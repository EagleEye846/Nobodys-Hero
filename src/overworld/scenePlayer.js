import { TILE_SIZE as T, UI_SCALE, UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { soulSprite } from '../battle/soul.js';
import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { chooseFacing } from '../characters/hero.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { ENEMIES } from '../data/enemies/index.js';
import { music, sfx } from '../audio/music.js';
import { drawText, textWidth } from '../ui/text.js';
import { animationFrame, DEFAULT_FRAME_SECONDS } from '../engine/animations.js';
import { ITEMS, giveItem } from '../data/items.js';
import { joinParty, leaveParty, memberFrames } from '../characters/party.js';

// Plays a cutscene (src/data/scenes/) in the overworld: actors walk, face,
// talk and emote, and the camera pans, one step at a time. The overworld
// hands over control while it runs. Made in the Cutscene Maker (tools/).

// What each step does, for the Cutscene Maker.
export const STEP_TYPES = {
  say: 'Say something',
  walk: 'Walk to a spot',
  face: 'Turn to face',
  emote: 'Show an emote',
  wait: 'Wait',
  camera: 'Move the camera',
  appear: 'Appear',
  leave: 'Leave',
  animate: 'Play an animation',
  sound: 'Play a sound',
  music: 'Change the music',
  give: 'Give an item',
  battle: 'Start a battle',
  end_chapter: 'End the chapter',
  join: 'Join the party',
  leave_party: 'Leave the party',
  vision: 'Show a vision (dreams)',
  bed: 'In bed: sit up, lie down, get up',
  toss: 'Throw something, with bounces',
  weather: "Fade the room's snow and fog",
};
// 'sweat' isn't a bubble: drops of cold sweat run down beside their head.
export const EMOTES = ['!', '?', '...', '<3', 'sweat'];
export const FACINGS = ['down', 'up', 'left', 'right'];

const ACTOR_SPEED = 48; // pixels per second
// Actors with walking frames step this often (seconds a frame), walking and running.
const STEP_SECONDS = 0.18;
const RUN_STEP_SECONDS = 0.12;
const PLAYER_SPEED = 70;
const CAMERA_SPEED = 180;
const EMOTE_SECONDS = 0.8;
const BOB_SECONDS = 0.6;
const FADE_MS = 300; // how long actors take to fade in or out

// Before a story battle (in seconds from its start): the music cuts out, the
// room closes in to a spotlight on you and the enemy (`who`) while their light
// flares, your shadow stands up out of you and blinks three times, then
// everything goes black and it drops away into the fight.
const ENCOUNTER = {
  darken: 1.2,
  blinks: [1.3, 1.6, 1.9], // each blink lasts BLINK_SECONDS, with a ding
  blackout: 2.25,
  drop: 2.4,
  end: 2.9,
};
const BLINK_SECONDS = 0.2;

const spriteCache = new Map();
// The sprite for an actor's `look`: 'prop:keeper' or 'enemy:columneon'.
export function lookSprite(look) {
  if (!spriteCache.has(look)) {
    const [kind, name] = String(look).split(':');
    let sprite = null;
    let back = null;
    if (kind === 'prop' && PROP_SPRITES[name]) {
      sprite = makeSprite(PROP_SPRITES[name], PROP_PALETTE);
      // A NAME_back prop sprite, if there is one, shows when they face away.
      if (PROP_SPRITES[`${name}_back`]) back = makeSprite(PROP_SPRITES[`${name}_back`], PROP_PALETTE);
    }
    if (kind === 'enemy' && ENEMIES[name]) sprite = makeSprite(ENEMIES[name].sprite.rows, ENEMIES[name].sprite.palette);
    // An animation's first frame (src/engine/animations.js): for someone who
    // is only ever seen animated, like the Usurper ('anim:usurper_idle').
    if (kind === 'anim') sprite = animationFrame(name, 0);
    spriteCache.set(look, sprite && { right: sprite, left: flipHorizontal(sprite), back });
  }
  return spriteCache.get(look);
}

// Someone in this scene. Like the player, (x, y) is under the feet. An actor
// that `plays` a character already in the room (their NPC or shop id) takes
// that character's place: they start where the character stands, and the
// character hides until the scene ends.
class Actor {
  constructor({ id, look, x, y, portrait = null, hidden = false, plays = null, ahead = false, animation = null, speed = DEFAULT_FRAME_SECONDS, glow = 0 }) {
    // In a dark room, the light they give off themselves (a radius in pixels),
    // so they can be seen in it: the great bat's eyes, say.
    this.glow = glow;
    this.plays = plays;
    // Playing a party member who ran on ahead (see `leavesAhead`): they're
    // already here at (x, y), rather than stepping out from behind you.
    this.ahead = ahead;
    // An animation they're playing (see src/engine/animations.js), or null.
    this.animation = animation;
    this.speed = speed;
    this.id = id;
    this.sprites = lookSprite(look);
    if (!this.sprites) throw new Error(`A cutscene actor '${id}' has an unknown look '${look}'`);
    // Standing in for a party member with walking frames (Ves, following
    // you): set by the ScenePlayer, so they walk, run and turn with those.
    this.frames = null;
    this.running = false;
    this.x = (x + 0.5) * T;
    this.y = (y + 1) * T;
    this.portrait = portrait;
    this.hidden = hidden;
    this.facing = 'right';
    this.walking = false;
    // How high off the ground they are, in pixels (a thrown thing in flight).
    this.lift = 0;
  }

  get sortY() {
    return this.y;
  }

  // Fades in when they appear and out when they leave, rather than blinking.
  show() {
    this.hidden = false;
    this.fade = { from: 0, to: 1, at: performance.now() };
  }

  hide() {
    this.fade = { from: 1, to: 0, at: performance.now() };
  }

  get alpha() {
    if (!this.fade) return 1;
    const t = Math.min(1, (performance.now() - this.fade.at) / FADE_MS);
    return this.fade.from + (this.fade.to - this.fade.from) * t;
  }

  // With walking frames: the way they face, stepping (or running, on a
  // `fast` walk) while they move.
  walkFrame(seconds) {
    const dir = ['up', 'down', 'left', 'right'].includes(this.facing) ? this.facing : 'down';
    if (!this.walking) return this.frames[`${dir}Idle`];
    if (this.running) return this.frames[`${dir}${Math.floor(seconds / RUN_STEP_SECONDS) % 2 ? 'Pass' : 'Stride'}`];
    return this.frames[`${dir}${Math.floor(seconds / STEP_SECONDS) % 2 ? 'Step' : 'Idle'}`];
  }

  // What they look like right now.
  currentSprite(seconds) {
    // An animation played `once` runs from its start and stays on its last frame.
    const animated = this.animation && (this.once
      ? animationFrame(this.animation, seconds - this.animationStart, this.speed, true)
      : animationFrame(this.animation, seconds, this.speed));
    return animated
      || (this.frames && this.walkFrame(seconds))
      || (this.facing === 'up' && this.sprites.back)
      || (this.facing === 'left' ? this.sprites.left : this.sprites.right);
  }

  // Their shadow in the sun (see shadows.js).
  shadow() {
    if (this.hidden || this.alpha <= 0) return null;
    return { image: this.currentSprite(performance.now() / 1000), x: this.x, y: this.y };
  }

  draw(ctx, camera) {
    if (this.hidden) return;
    const alpha = this.alpha;
    if (alpha <= 0) return;
    const seconds = performance.now() / 1000;
    const sprite = this.currentSprite(seconds);
    const bob = !this.frames && this.walking && Math.floor(seconds / (BOB_SECONDS / 3)) % 2 ? 1 : 0;
    ctx.globalAlpha = alpha;
    // In the air, a shadow stays on the ground under it.
    if (this.lift > 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(Math.round(this.x) - 4 - camera.x, Math.round(this.y) - 2 - camera.y, 8, 2);
    }
    ctx.drawImage(sprite, Math.round(this.x) - Math.floor(sprite.width / 2) - camera.x, Math.round(this.y) - sprite.height - bob - Math.round(this.lift) - camera.y);
    ctx.globalAlpha = 1;
  }
}

export class ScenePlayer {
  // `overworld` is the OverworldScene it plays in (for the player, camera and textbox).
  constructor(scene, overworld) {
    this.scene = scene;
    this.overworld = overworld;
    this.actors = new Map((scene.actors ?? []).map((data) => [data.id, new Actor(data)]));
    // Actors playing someone already in the room step into their place.
    this.standIns = [];
    // Or someone in the party (`plays: 'vesper'`): the actor takes over from
    // the one following you, who steps back in where the scene leaves them.
    this.memberStandIns = [];
    for (const actor of this.actors.values()) {
      const prop = actor.plays && overworld.room.props.find((p) => p.character === actor.plays && !p.hidden);
      const follower = !prop && actor.plays && overworld.followers?.find((f) => f.id === actor.plays);
      if (follower) {
        if (!actor.ahead) {
          actor.x = follower.x;
          actor.y = follower.y;
        }
        follower.hidden = true;
        // Already here as part of the room (a prop with `member`): the actor
        // takes over from it, and it's gone once they move.
        for (const stayed of overworld.room.props.filter((p) => p.member === actor.plays)) stayed.hidden = true;
        actor.frames = memberFrames(actor.plays);
        this.memberStandIns.push({ actor, follower });
      }
      if (!prop) continue;
      actor.x = prop.x + T / 2;
      actor.y = prop.y + T;
      // Carry on with whatever they were doing (watering flowers, say).
      if (!actor.animation && prop.animation) {
        actor.animation = prop.animation;
        actor.speed = prop.speed;
      }
      prop.hidden = true;
      this.standIns.push({ actor, prop });
    }
    this.emotes = [];
    // Where the camera looks; null follows the player.
    this.focus = null;
    this.index = -1;
    this.done = false;
    this.advance();
  }

  // Light from actors who glow (`glow`), for a dark room (see drawDarkness).
  get lights() {
    return [...this.actors.values()]
      .filter((actor) => actor.glow > 0 && !actor.hidden && actor.alpha > 0)
      .map((actor) => ({ x: actor.x, y: actor.y - (actor.sprites.right.height / 2), radius: actor.glow }));
  }

  // The things to draw sorted with the room's characters.
  get drawables() {
    return [...this.actors.values()];
  }

  // The player and the scene's actors share the same moves.
  body(who) {
    if (who === 'player' || !who) return this.overworld.player;
    const actor = this.actors.get(who);
    if (!actor) throw new Error(`Cutscene '${this.scene.id}' talks about '${who}', who isn't in it`);
    return actor;
  }

  // Starts the next step. Instant steps run straight away, so several can happen in one frame.
  advance() {
    for (;;) {
      this.index++;
      const step = this.scene.steps[this.index];
      if (!step) {
        this.finish();
        return;
      }
      this.step = { ...step, t: 0 };
      if (!this.begin(this.step)) return;
    }
  }

  // Returns true when the step is already finished.
  begin(step) {
    switch (step.do) {
      case 'say': {
        const speaker = step.who && step.who !== 'player' ? this.body(step.who) : null;
        const pages = String(step.text ?? '').split(/\n\s*\n/).map((page) => page.trim()).filter(Boolean);
        if (!pages.length) return true;
        // `face` is the speaker's expression (see portraits.js); a page can change it with {sad} and so on.
        // `shake`: the words tremble (a scream, a shout).
        this.overworld.textbox.open(pages, speaker?.portrait ?? null, step.face ?? null, { shake: Boolean(step.shake) });
        return false;
      }
      case 'walk':
        return false;
      case 'toss': {
        // A throw: up in an arc to `to`, then `bounces` smaller hops on from
        // there (each a third as high and half as far), sliding to a stop.
        // `height` is how high the first arc goes (pixels).
        const body = this.body(step.who);
        const start = { x: body.x, y: body.y };
        const end = { x: (step.to.x + 0.5) * T, y: (step.to.y + 1) * T };
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const bounces = step.bounces ?? 2;
        const hops = [{ from: 0, to: 1, height: step.height ?? 40 }];
        let at = 1;
        let height = step.height ?? 40;
        let reach = 0.35;
        for (let i = 0; i < bounces; i++) {
          height /= 3;
          hops.push({ from: at, to: at + reach, height });
          at += reach;
          reach /= 2;
        }
        step.flight = { start, dx, dy, hops, hop: 0, t: 0, slide: 0 };
        return false;
      }
      case 'face': {
        const body = this.body(step.who);
        body.facing = step.dir ?? 'down';
        return true;
      }
      case 'emote':
        this.emotes.push({ body: this.body(step.who), text: step.emote ?? '!', t: 0 });
        return false;
      case 'wait':
        return false;
      case 'camera':
        // Back to the player, or to a spot, or to someone.
        if (!step.to && (!step.who || step.who === 'player')) step.target = () => this.overworld.player;
        else if (step.to) step.target = () => ({ x: (step.to.x + 0.5) * T, y: (step.to.y + 1) * T });
        else step.target = () => this.body(step.who);
        // Start from wherever the camera is now (a copy, so moving it never moves anyone).
        const from = this.focus ?? this.overworld.player;
        this.focus = { x: from.x, y: from.y };
        return false;
      case 'appear': {
        const body = this.body(step.who);
        if (step.at) {
          body.x = (step.at.x + 0.5) * T;
          body.y = (step.at.y + 1) * T;
        }
        if (body.show) body.show();
        else body.hidden = false;
        return true;
      }
      case 'leave': {
        const body = this.body(step.who);
        if (body.hide) body.hide();
        else body.hidden = true;
        return true;
      }
      case 'animate': {
        // Starts (or with no animation, stops) an animation. With `seconds`,
        // the scene waits that long, then the animation stops. With `once`, it
        // plays through one time and stays on its last frame. With `glow`,
        // the light they give off in the dark changes to that (0 for none:
        // the light going out of the Roost Mother's eyes); with only `glow`
        // and no `animation`, just the light changes and the animation goes on.
        const body = this.body(step.who);
        if (body === this.overworld.player) {
          // The hero plays one too (src/engine/animations.js), drawn in place of
          // their walking frames until another `animate` with no animation.
          body.sceneAnimation = step.animation
            ? { name: step.animation, start: performance.now() / 1000, speed: step.speed ?? DEFAULT_FRAME_SECONDS, once: Boolean(step.once) }
            : null;
          return true;
        }
        if (step.glow !== undefined) body.glow = step.glow;
        if (step.glow !== undefined && step.animation === undefined) return true;
        body.animation = step.animation || null;
        body.speed = step.speed ?? DEFAULT_FRAME_SECONDS;
        body.once = Boolean(step.once);
        body.animationStart = performance.now() / 1000;
        return !(step.animation && step.seconds > 0);
      }
      case 'vision': {
        // A whole-screen picture in the dark (see visions.js), for dreams:
        // `name` starts one, `mood` changes how it is, and no name ends it.
        // `fade` (seconds) fades it in over what's there, rather than cutting.
        const now = performance.now() / 1000;
        const current = this.overworld.vision;
        if (!step.name) this.overworld.vision = null;
        else if (current?.name === step.name) Object.assign(current, { mood: step.mood ?? 'calm', moodStart: now });
        else this.overworld.vision = { name: step.name, mood: step.mood ?? 'calm', start: now, moodStart: now, fade: step.fade ?? 0 };
        return true;
      }
      case 'bed':
        // You, in the bed you slept in (see tuckIn in overworldScene.js):
        // `pose` 'sitting', 'lying', or 'up' to get out of it.
        if (step.pose === 'up') this.overworld.getUp?.();
        else this.overworld.sitUp?.(step.pose !== 'lying');
        return true;
      case 'sound':
        if (step.name) sfx(step.name);
        return true;
      case 'weather':
        // The room's snow and fog fade to `to` (0 gone, 1 as the room has
        // them) over `seconds`; the scene goes straight on while it fades.
        this.overworld.fadeWeather?.(step.to ?? 0, step.seconds ?? 2);
        return true;
      case 'give': {
        const item = ITEMS[step.item];
        if (!item) return true;
        const got = giveItem(step.item);
        if (got) sfx('heal');
        this.overworld.textbox.open([got === 'stored' ? `You got ${item.name}. Your bag is full, so it went to storage.`
          : got ? `You got ${item.name}.` : `You'd take the ${item.name}, but you've nowhere to put it.`]);
        return false;
      }
      case 'battle':
        // The encounter plays first (see ENCOUNTER), then the scene ends there.
        music.play(null);
        sfx('flare');
        step.dings = 0;
        return false;
      case 'end_chapter':
        // A card between chapters; then on into `room` (at `spawn`), or the title screen without one.
        this.endChapter = step;
        this.finish();
        return false;
      case 'music':
        music.play(step.song || null);
        return true;
      case 'join':
        // `who` is a party member id (src/characters/party.js), not a scene actor.
        if (joinParty(step.who)) this.overworld.addFollower?.(step.who);
        return true;
      case 'leave_party':
        leaveParty(step.who);
        this.overworld.removeFollower?.(step.who);
        return true;
      default:
        throw new Error(`Cutscene '${this.scene.id}' has a step it doesn't know: '${step.do}'`);
    }
  }

  update(dt, input) {
    if (this.done) return;
    const step = this.step;
    step.t += dt;
    for (const emote of this.emotes) emote.t += dt;
    this.emotes = this.emotes.filter((emote) => emote.t < EMOTE_SECONDS);

    let finished = false;
    switch (step.do) {
      case 'say':
      case 'give':
        this.overworld.textbox.update(dt, input);
        finished = !this.overworld.textbox.isOpen;
        break;
      case 'walk':
        finished = this.walk(step, dt);
        break;
      case 'toss':
        finished = this.toss(step, dt);
        break;
      case 'emote':
        finished = step.t >= EMOTE_SECONDS;
        break;
      case 'wait':
        finished = step.t >= (step.seconds ?? 0.5);
        break;
      case 'animate':
        finished = step.t >= step.seconds;
        // One played `once` keeps its last frame; a looping one stops.
        if (finished && !step.once) this.body(step.who).animation = null;
        break;
      case 'camera':
        finished = this.pan(step, dt);
        break;
      case 'battle':
        while (step.dings < ENCOUNTER.blinks.length && step.t >= ENCOUNTER.blinks[step.dings]) {
          sfx('soul');
          step.dings++;
        }
        if (step.t >= ENCOUNTER.end) {
          // The scene ends here; the overworld runs the battle, then plays the
          // `spared` or `defeated` scene after it (see OverworldScene.storyBattle).
          this.battle = step;
          this.finish();
        }
        return;
      default:
        finished = true;
    }
    if (finished) this.advance();
  }

  // Walks in a straight line to the tile, at walking pace. Scripted walks go
  // where they're told, through anything in the way.
  // A thrown thing in flight (the `toss` step). Returns true once it's come to rest.
  toss(step, dt) {
    const body = this.body(step.who);
    const f = step.flight;
    const hop = f.hops[f.hop];
    if (!hop) {
      // Skidding the last little way in the snow, then still.
      body.lift = 0;
      return true;
    }
    // Higher hops take longer: like falling under gravity.
    const seconds = 0.18 + Math.sqrt(hop.height) * 0.07;
    f.t = Math.min(seconds, f.t + dt);
    const k = f.t / seconds;
    const along = hop.from + (hop.to - hop.from) * k;
    const total = f.hops[f.hops.length - 1].to;
    body.x = f.start.x + f.dx * (along / total);
    body.y = f.start.y + f.dy * (along / total);
    body.lift = Math.sin(k * Math.PI) * hop.height;
    if (k >= 1) {
      body.lift = 0;
      sfx(f.hop === 0 ? 'hit' : 'type');
      f.hop++;
      f.t = 0;
      // Settled: it stops spinning.
      if (f.hop >= f.hops.length) body.animation = null;
    }
    return false;
  }

  walk(step, dt) {
    const body = this.body(step.who);
    const isPlayer = body === this.overworld.player;
    const goalX = (step.to.x + 0.5) * T;
    const goalY = (step.to.y + 1) * T;
    const dx = goalX - body.x;
    const dy = goalY - body.y;
    const distance = Math.hypot(dx, dy);
    // `fast` hurries: twice the pace.
    const stride = (isPlayer ? PLAYER_SPEED : ACTOR_SPEED) * (step.fast ? 2 : 1) * dt;
    // Whatever they were doing, they stop to walk, unless the walk says to
    // `keep` it (the Roost Mother falling, frozen in her last frame).
    if (!isPlayer && !step.keep) body.animation = null;
    if (distance <= stride) {
      body.x = goalX;
      body.y = goalY;
      this.setWalking(body, false);
      return true;
    }
    body.x += (dx / distance) * stride;
    body.y += (dy / distance) * stride;
    if (isPlayer) {
      body.facing = chooseFacing(Math.sign(Math.round(dx)), Math.sign(Math.round(dy)), body.facing);
      body.animationTime += dt;
    } else if (Math.abs(dy) > Math.abs(dx)) {
      // Mostly up or down: away from us (their back) or toward us.
      body.facing = dy < 0 ? 'up' : 'down';
    } else if (Math.abs(dx) > 0.5) {
      body.facing = dx < 0 ? 'left' : 'right';
    }
    this.setWalking(body, true);
    return false;
  }

  setWalking(body, walking) {
    if (body === this.overworld.player) {
      body.moving = walking;
      if (!walking) {
        body.animationTime = 0;
        body.x = Math.round(body.x);
        body.y = Math.round(body.y);
      }
    } else {
      body.walking = walking;
      body.running = walking && Boolean(this.step?.fast);
    }
  }

  // Slides the camera toward its target; when it gets back to the player, it follows them again.
  pan(step, dt) {
    const target = step.target();
    const dx = target.x - this.focus.x;
    const dy = target.y - this.focus.y;
    const distance = Math.hypot(dx, dy);
    const stride = CAMERA_SPEED * dt;
    if (distance <= stride) {
      // Back on the player: follow them again. On someone in the scene: keep
      // following them as they move. On a spot: stay there.
      if (target === this.overworld.player) this.focus = null;
      else this.focus = step.who && !step.to ? target : { x: target.x, y: target.y };
      return true;
    }
    this.focus.x += (dx / distance) * stride;
    this.focus.y += (dy / distance) * stride;
    return false;
  }

  // What the camera should centre on.
  get cameraPoint() {
    return this.focus ?? this.overworld.player;
  }

  finish() {
    this.done = true;
    this.overworld.vision = null;
    this.overworld.player.moving = false;
    this.overworld.player.sceneAnimation = null;
    // Room characters stay where the scene left them, or stay gone if they left
    // (until you come back into the room).
    const { player } = this.overworld;
    for (const { actor, prop } of this.standIns) {
      if (actor.hidden || actor.fade?.to === 0) continue;
      const [fromX, fromY] = [prop.x / T, prop.y / T];
      prop.hidden = false;
      prop.animation = actor.animation;
      prop.speed = actor.speed;
      prop.moveToTile(Math.floor(actor.x / T), Math.floor((actor.y - 1) / T));
      // Never leave them standing on the player (they'd be stuck): back to their spot.
      if (prop.overlaps(player.x - 5, player.y - 6, player.x + 5, player.y)) prop.moveToTile(fromX, fromY);
    }
    for (const { actor, follower } of this.memberStandIns) {
      // One who left in the scene has gone on ahead, or stays somewhere in the
      // room as part of it (see `leavesAhead`): out of sight as a follower.
      if (actor.hidden || actor.fade?.to === 0 || this.scene.leavesAhead?.who === follower.id) continue;
      follower.hidden = false;
      follower.warpTo(actor.x, actor.y);
    }
    for (const actor of this.actors.values()) actor.hidden = true;
  }

  // The lead-in to a story battle (see ENCOUNTER), over the whole room.
  drawEncounter(ctx, camera, step) {
    const t = step.t;
    const ease = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
    const { player } = this.overworld;
    const chest = { x: player.x - camera.x, y: player.y - 10 - camera.y };
    const foe = step.who ? this.body(step.who) : null;
    const flame = foe && { x: foe.x - camera.x, y: foe.y - (foe.sprites?.right.height ?? 24) * 0.6 - camera.y };

    // The dark closing in to a spotlight around you both.
    const close = ease(t / ENCOUNTER.darken);
    const cx = flame ? (chest.x + flame.x) / 2 : chest.x;
    const cy = flame ? (chest.y + flame.y) / 2 : chest.y;
    const tight = (flame ? Math.hypot(flame.x - chest.x, flame.y - chest.y) / 2 : 0) + 30;
    const radius = 420 + (tight - 420) * close;
    const dark = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
    dark.addColorStop(0, 'rgba(0, 0, 0, 0)');
    dark.addColorStop(1, `rgba(0, 0, 0, ${(0.94 * close).toFixed(3)})`);
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Their light flaring up, with embers rising off it.
    const lit = Math.min(1, t / 0.8) * (1 - ease((t - ENCOUNTER.blackout) / 0.15));
    if (flame && lit > 0) {
      const glowRadius = (16 + 14 * close) * (0.9 + 0.1 * Math.sin(t * 17));
      const glow = ctx.createRadialGradient(flame.x, flame.y, 1, flame.x, flame.y, glowRadius);
      glow.addColorStop(0, `rgba(255, 200, 110, ${(0.55 * lit).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 200, 110, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.fillRect(flame.x - glowRadius, flame.y - glowRadius, glowRadius * 2, glowRadius * 2);
      ctx.restore();
      for (let i = 0; i < 14; i++) {
        const rise = (t * 0.8 + i / 14) % 1;
        ctx.fillStyle = i % 3 ? `rgba(255, 190, 90, ${((1 - rise) * lit).toFixed(3)})` : `rgba(255, 240, 200, ${((1 - rise) * lit).toFixed(3)})`;
        ctx.fillRect(Math.round(flame.x + Math.sin(i * 12.9) * 9 + Math.sin(t * 3 + i) * 2), Math.round(flame.y + 8 - rise * 36), 1, 1);
      }
    }

    // Then nothing but black.
    const black = ease((t - ENCOUNTER.blackout) / 0.15);
    if (black > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${black.toFixed(3)})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    // Your soul: it blinks out of your chest, then drops away into the fight.
    const blinking = ENCOUNTER.blinks.some((start) => t >= start && t < start + BLINK_SECONDS);
    const held = t >= ENCOUNTER.blinks.at(-1) + BLINK_SECONDS;
    if (!blinking && !held) return;
    const fall = ease((t - ENCOUNTER.drop) / (ENCOUNTER.end - ENCOUNTER.drop));
    const sprite = soulSprite();
    const x = chest.x * UI_SCALE + (UI_WIDTH / 2 - chest.x * UI_SCALE) * fall;
    const y = chest.y * UI_SCALE + (UI_HEIGHT * 0.78 - chest.y * UI_SCALE) * fall;
    // A ring bursting out of it on each ding.
    const since = t - ENCOUNTER.blinks.filter((start) => t >= start).at(-1);
    inUiSpace(ctx, () => {
      ctx.globalAlpha = 1 - fall * 0.7;
      // Your shadow, standing up out of you, glowing at the edges.
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.drawImage(sprite, Math.round(x - sprite.width / 2), Math.round(y - sprite.height / 2));
      ctx.shadowBlur = 0;
      if (since < 0.3 && fall === 0) {
        ctx.globalAlpha = 1 - since / 0.3;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10 + since * 90, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  // Drops of cold sweat: two, running down either side of a head, in turn.
  drawSweat(ctx, x, headY, t) {
    for (const [side, delay] of [[-1, 0], [1, 0.35]]) {
      const run = ((t - delay) % 0.9 + 0.9) % 0.9;
      if (t < delay) continue;
      const dx = Math.round(x + side * 7);
      const dy = Math.round(headY + run * 9);
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(dx - 1, dy - 1, 3, 4);
      ctx.fillStyle = '#9fd4ff';
      ctx.fillRect(dx, dy, 1, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dx, dy, 1, 1);
    }
  }

  // Emote bubbles above heads, drawn over everything else in the room.
  drawOverlay(ctx, camera) {
    if (this.step?.do === 'battle' && !this.done) this.drawEncounter(ctx, camera, this.step);
    for (const { body, text, t } of this.emotes) {
      const pop = Math.min(1, t / 0.12);
      const headY = body.y - (body.sprites?.right.height ?? 24) - 8 - camera.y;
      const x = body.x - camera.x;
      if (text === 'sweat') {
        this.drawSweat(ctx, x, headY + 8, t);
        continue;
      }
      inUiSpace(ctx, () => {
        const size = Math.round(24 * pop);
        if (size < 4) return;
        const w = textWidth(ctx, text, size) + 12;
        const cx = x * UI_SCALE;
        const top = headY * UI_SCALE - size - 4;
        ctx.fillStyle = '#120c1c';
        ctx.fillRect(cx - w / 2 - 2, top - 2, w + 4, size + 8);
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - w / 2, top, w, size + 4);
        drawText(ctx, text, cx, top + 2, { size, color: '#120c1c', align: 'center' });
      });
    }
  }
}
