import { TILE_SIZE as T, UI_SCALE, UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { drawFootShadow } from './shadows.js';
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
import { GEAR, giveGear } from '../data/gear.js';
import { ARMOR } from '../data/armor.js';
import { WEAPONS } from '../data/weapons.js';
import { HERO_STATE } from '../characters/heroState.js';
import { reforgeAt } from '../data/fallenStar.js';
import { ReforgeShow } from './reforgeShow.js';
import { wielderOf, HERO } from '../characters/equipment.js';
import { saveGame, WORLD_STATE } from '../state/saveGame.js';
import { DAY_SECONDS } from './daylight.js';
import { textSection } from '../engine/textLoader.js';
import { warmVoices } from '../audio/voiceClips.js';
import { MEMBERS, joinParty, leaveParty, setHurt, memberFrames, inParty } from '../characters/party.js';
import { hushFigureSprite, hushShadowSprite } from './hushwood.js';
import { ACTS, actLength, actPose, poseOffset, drawPosed, startAct } from './acts.js';
import { Stage } from './stageShow.js';
import { keyFor, keyName } from '../engine/input.js';

// The acts an `act` step can play (see acts.js), for the Cutscene Maker.
export { ACTS };

// Plays a cutscene (src/data/scenes/) in the overworld: actors walk, face,
// talk and emote, and the camera pans, one step at a time. The overworld
// hands over control while it runs. Made in the Cutscene Maker (tools/).

// What each step does, for the Cutscene Maker.
export const STEP_TYPES = {
  say: 'Say something',
  walk: 'Walk to a spot',
  face: 'Turn to face',
  emote: 'Show an emote',
  act: 'Do something (hop, nod, look about...)',
  wait: 'Wait',
  camera: 'Move the camera',
  appear: 'Appear',
  leave: 'Leave',
  animate: 'Play an animation',
  sound: 'Play a sound',
  quake: 'Shake the screen',
  music: 'Change the music',
  give: 'Give an item',
  battle: 'Start a battle',
  end_chapter: 'End the chapter',
  go_on: 'Go on to what comes next (the title screen)',
  join: 'Join the party',
  leave_party: 'Leave the party',
  hurt: 'Hurt (or heal) a party member',
  piggyback: 'Carry a party member on your back (or put them down)',
  save: 'Save the game here',
  vision: 'Show a vision (dreams)',
  bed: 'In bed: sit up, lie down, get up',
  toss: 'Throw something, with bounces',
  weather: "Fade the room's snow and fog",
  time: 'Set the time of day (0 sunrise, 0.25 noon, 0.5 sunset)',
  hold: 'Hold someone (they go where you go)',
  goto: 'Go to another room',
  stage: 'Stage effects (spotlights, curtains, confetti, flicker, flare)',
  textbox: 'Move the text box to the top of the screen (or back)',
  press: 'The player holds a key down to fill a bar (Nova holding the sea back)',
  take: 'Take a keepsake away (it goes to someone else)',
  reforge: "A smith reforges the Fallen Star (if you've brought the piece)",
  forge_show: 'The big reforge show: the forge, the hammer, the shard, the new name',
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

// Skipping a scene you've seen: hold C this long, and it plays the rest out
// in steps of SKIP_TICK seconds (never more than SKIP_MAX_TICKS of them).
const SKIP_HOLD_SECONDS = 1;
const SKIP_TICK = 1 / 20;
const SKIP_MAX_TICKS = 20000;

// The scenes watched to the end, kept apart from the save so they stay
// watched after a game over or a reload (it's what lets you skip them).
const WATCHED_KEY = 'ruins-rpg-watched-scenes-v1';
function watchedScenes() {
  try {
    return JSON.parse(localStorage.getItem(WATCHED_KEY)) ?? [];
  } catch {
    return [];
  }
}
// Only a scene watched to the end before, and with nothing in it that waits
// for an answer (a choice or a prompt), can be skipped. `noSkip: true` on a
// scene keeps one unskippable whatever else is true.
const ASKING_STEPS = ['choice', 'prompt', 'ask', 'menu', 'shop'];
export function canSkip(scene) {
  if (scene.noSkip || scene.steps.some((step) => ASKING_STEPS.includes(step.do) || step.choices || step.options)) return false;
  return watchedScenes().includes(scene.id);
}
function markWatched(id) {
  const watched = watchedScenes();
  if (watched.includes(id)) return;
  watched.push(id);
  try {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
  } catch { /* not allowed to save: nothing to skip next time */ }
}

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
// And first, the one in the spotlight lunges at you (unless the step says
// `still`), and the screen jolts as it comes.
const LUNGE_JOLT = 0.24;

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
    // Something drawn in code rather than in rows: the Hush rising over the
    // rooftops (src/overworld/hushwood.js).
    if (kind === 'proc' && name === 'hush') sprite = hushFigureSprite();
    // And its shadow going over the trees.
    if (kind === 'proc' && name === 'shadow') sprite = hushShadowSprite();
    spriteCache.set(look, sprite && { right: sprite, left: flipHorizontal(sprite), back });
  }
  return spriteCache.get(look);
}

// Someone in this scene. Like the player, (x, y) is under the feet. An actor
// that `plays` a character already in the room (their NPC or shop id) takes
// that character's place: they start where the character stands, and the
// character hides until the scene ends.
class Actor {
  constructor({ id, look, x, y, portrait = null, hidden = false, plays = null, ahead = false, animation = null, speed = DEFAULT_FRAME_SECONDS, glow = 0, flat = false, centered = false }) {
    // Playing a wide prop (Gubb's three-tile punt): stands on the middle of it, not its first tile.
    this.centered = centered;
    // In a dark room, the light they give off themselves (a radius in pixels),
    // so they can be seen in it: the great bat's eyes, say.
    this.glow = glow;
    this.plays = plays;
    // Something lying on the ground (cracks in the turf, a shadow): drawn under everyone, not sorted among them.
    this.flat = flat;
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
    // Who has hold of them (the `hold` step).
    this.heldBy = null;
    // Something they're doing (an `act` step: see acts.js), and how far a
    // bridge has sagged under them (set by the overworld: bridges.js).
    this.act = null;
    this.sag = 0;
  }

  perform(name, toward = null) {
    this.act = startAct(name, performance.now() / 1000, this.facing, toward);
  }

  // Held, they're drawn just in front of whoever holds them. Up on a raised
  // block (the crier's stone), they're drawn after it, like the player
  // (Player.sortY), not hidden behind the top of the block in front.
  get sortY() {
    if (this.flat) return -1e8;
    // (`behind`: riding inside it, like Gubb's punt, so its near side hides their feet.)
    if (this.heldBy) return this.heldBy.sortY + (this.holdBehind ? -0.01 : 0.01);
    return this.ground > 0 ? this.y + T - 1 : this.y;
  }

  // How high the floor under their feet is: a raised block's height, or 0.
  get ground() {
    return this.room?.raiseAt(Math.floor(this.x / T), Math.floor((this.y - 1) / T)) ?? 0;
  }

  // Bobbing a pixel as they walk; held, they bob with whoever holds them.
  bob(seconds) {
    if (this.heldBy?.bob) return this.heldBy.bob(seconds);
    return !this.frames && this.walking && Math.floor(seconds / (BOB_SECONDS / 3)) % 2 ? 1 : 0;
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

  // What they look like right now (facing `look` for the moment, if given:
  // glancing about).
  currentSprite(seconds, look = null) {
    // An animation played `once` runs from its start and stays on its last frame.
    const animated = this.animation && (this.once
      ? animationFrame(this.animation, seconds - this.animationStart, this.speed, true)
      : animationFrame(this.animation, seconds, this.speed));
    const facing = look ?? this.facing;
    return animated
      || (this.frames && (look ? this.frames[`${look}Idle`] : this.walkFrame(seconds)))
      || (facing === 'up' && this.sprites.back)
      || (facing === 'left' ? this.sprites.left : this.sprites.right);
  }

  // Their shadow in the sun (see shadows.js).
  shadow() {
    if (this.hidden || this.flat || this.alpha <= 0) return null;
    return { image: this.currentSprite(performance.now() / 1000), x: this.x, y: this.y };
  }

  draw(ctx, camera) {
    if (this.hidden) return;
    const alpha = this.alpha;
    if (alpha <= 0) return;
    const seconds = performance.now() / 1000;
    const pose = actPose(this.act, seconds);
    if (this.act && !pose) this.act = null;
    const sprite = this.currentSprite(seconds, pose?.look ?? null);
    const off = poseOffset(pose, this.facing);
    const bob = this.bob(seconds);
    ctx.globalAlpha = alpha;
    // A shadow at their feet, that stays on the ground when they're in the
    // air (or hopping). Only for people: not a statue or a beast.
    if (sprite && !this.flat && sprite.width <= 24) drawFootShadow(ctx, Math.round(this.x) - camera.x, Math.round(this.y) - this.ground + this.sag - camera.y);
    const feet = Math.round(this.y) - this.ground - bob - Math.round(this.lift) + this.sag + off.y;
    drawPosed(ctx, sprite, Math.round(this.x) + off.x - camera.x, feet - camera.y, pose?.sx ?? 1, pose?.sy ?? 1);
    ctx.globalAlpha = 1;
  }
}

export class ScenePlayer {
  // `overworld` is the OverworldScene it plays in (for the player, camera and textbox).
  constructor(scene, overworld) {
    this.scene = scene;
    this.overworld = overworld;
    // A scene with recorded lines in it loads them ahead (src/audio/voiceClips.js).
    if (scene.steps?.some((step) => step.voice)) warmVoices();
    // One you've watched to the end before (on any save) can be skipped:
    // hold the SKIP key (C), see SKIP_HOLD_SECONDS.
    this.skippable = canSkip(scene);
    this.skipHeld = 0;
    this.actors = new Map((scene.actors ?? []).map((data) => [data.id, new Actor(data)]));
    // So they know when they're standing up on a block (Actor.sortY).
    for (const actor of this.actors.values()) actor.room = overworld.room;
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
      actor.x = prop.x + (actor.centered ? prop.width / 2 : T / 2);
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
    // Walks and tosses started with `wait: false`, still going.
    this.background = [];
    // Spotlights, curtains and confetti (stageShow.js), switched on by `stage` steps.
    this.stage = new Stage();
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

  // A bubble over someone's head; a new one replaces the one they already
  // have, so two never sit on top of each other.
  addEmote(body, text) {
    this.emotes = this.emotes.filter((emote) => emote.body !== body);
    this.emotes.push({ body, text, t: 0 });
  }

  // A new walk or toss for someone stops any `wait: false` one they still had
  // going, so two never pull the same body two ways at once (and freeze it).
  claim(step) {
    const body = this.body(step.who);
    this.background = this.background.filter((going) => {
      if (this.body(going.who) !== body) return true;
      this.setWalking(body, false, going);
      return false;
    });
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
      // A step can wait for a scene to have played (`after`), or stop once
      // one has (`until`), like a trigger or a prop: the rides in the Bother
      // have Haddock's line until he's gone, and Ves's after. (Not a battle:
      // its `after` is the scene that plays once it's won, see storyBattle.)
      const seen = WORLD_STATE.seenScenes ?? [];
      if (step.do !== 'battle' && ((step.after && !seen.includes(step.after)) || (step.until && seen.includes(step.until)))) continue;
      // What you carry can pick the steps too: `has` (every one of these keepsakes is in your pack),
      // `lacks` (none of them is), and `holding: [n, [ids]]` (exactly n of those). For the quest
      // pieces: the Register's leaves at the Old Street's cleft, the whistle's at Seam Nine's crack.
      if (step.has && ![step.has].flat().every((id) => (HERO_STATE.gear ?? []).includes(id))) continue;
      if (step.lacks && [step.lacks].flat().some((id) => (HERO_STATE.gear ?? []).includes(id))) continue;
      if (step.holding && step.holding[1].filter((id) => (HERO_STATE.gear ?? []).includes(id)).length !== step.holding[0]) continue;
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
        // (The hero has no voice; anyone else sounds like who they are or play: src/audio/voices.js.)
        const voice = speaker && speaker !== this.overworld.player ? speaker.portrait ?? speaker.plays ?? speaker.id : null;
        // `voice`: a recorded line (src/audio/voiceClips.js), by its id.
        this.overworld.textbox.open(pages, speaker?.portrait ?? null, step.face ?? null, { shake: Boolean(step.shake), top: step.top ?? this.textTop, voice, line: step.voice ?? null });
        return false;
      }
      case 'textbox':
        // { top: true }: the words go at the top of the screen from here on
        // (or a say step's own `top`), for when the people are down at the
        // bottom of a room, where the camera can't go any lower. false puts it back.
        this.textTop = Boolean(step.top);
        return true;
      case 'walk':
        // `wait: false`: they set off and the scene goes straight on (two
        // things moving at once: the log and Bramble). `pace` is pixels a second.
        this.claim(step);
        if (step.wait === false) {
          this.background.push(step);
          return true;
        }
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
        // `airtime`: how many seconds the first arc takes (it's worked out from the height otherwise).
        const hops = [{ from: 0, to: 1, height: step.height ?? 40, seconds: step.airtime }];
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
        this.claim(step);
        if (step.wait === false) {
          this.background.push(step);
          return true;
        }
        return false;
      }
      case 'face': {
        // `dir`, or `at`: toward someone else in the scene ('player' for you),
        // or a spot ({ x, y }), whichever way is further.
        const body = this.body(step.who);
        if (step.at) {
          const there = typeof step.at === 'string' ? this.body(step.at) : { x: (step.at.x + 0.5) * T, y: (step.at.y + 1) * T };
          const dx = there.x - body.x;
          const dy = there.y - body.y;
          if (dx || dy) body.facing = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
          return true;
        }
        body.facing = step.dir ?? 'down';
        return true;
      }
      case 'emote':
        // `wait: false`: the bubble pops up and the scene goes straight on.
        this.addEmote(this.body(step.who), step.emote ?? '!');
        return step.wait === false;
      case 'act': {
        // Someone does something with their whole body (see ACTS in
        // acts.js): a hop, a start (with a "!"), a look about, a nod, a shake
        // of the head, a shiver, a sigh, a lunge, a crouch (they stay down
        // until a `stand`). The scene waits for it, unless `wait: false`:
        // then the next step starts with it (two people nodding together).
        const body = this.body(step.who);
        body.perform(step.act ?? 'hop');
        if (step.act === 'startle') {
          this.addEmote(body, '!');
          sfx('ambush');
        }
        return step.wait === false;
      }
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
        // `instant`: no fade (a swap between two pictures of the same thing).
        if (step.instant) {
          body.hidden = false;
          body.fade = null;
        } else if (body.show) body.show();
        else body.hidden = false;
        return true;
      }
      case 'leave': {
        const body = this.body(step.who);
        if (step.instant) {
          body.hidden = true;
          body.fade = null;
        } else if (body.hide) body.hide();
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
      case 'haunt':
        // The ghost ship (haunt.js, shipList.js): { wake: 'name' } sends a sleeping ghost after you,
        // { lantern: 'on' | 'off' }, { dip: seconds } the lights go low, { whisper: 'words' }, { list: 'port' | 'star' | 'toggle' }.
        this.overworld.haunt?.run(step);
        return true;
      case 'quake':
        // The screen shakes, `amount` pixels for `seconds` (the Warden coming down).
        this.overworld.shakeCamera?.(step.amount ?? 3, step.seconds ?? 0.5);
        return true;
      case 'time':
        // The sun goes to `of` (0 sunrise, 0.25 noon, 0.5 sunset, 0.75 midnight) and the clock
        // carries on from there: Chapter 4 opens on a sunny morning whatever time it was.
        WORLD_STATE.playSeconds = ((((step.of ?? 0.1) - 0.08) % 1 + 1) % 1) * DAY_SECONDS;
        return true;
      case 'weather':
        // The room's snow and fog fade to `to` (0 gone, 1 as the room has
        // them) over `seconds`; the scene goes straight on while it fades.
        this.overworld.fadeWeather?.(step.to ?? 0, step.seconds ?? 2);
        return true;
      case 'give': {
        // A keepsake or a tool (src/data/gear.js), with its own words in
        // interactions/gear.txt, or an item for your bag.
        if (GEAR[step.item]) {
          giveGear(step.item);
          sfx('heal');
          this.overworld.textbox.open(textSection('interactions/gear.txt', `got_${step.item}`));
          return false;
        }
        // A weapon or armor (Ves's mended coat, from Bryony), as from a chest.
        const slot = ARMOR[step.item] ? 'armor' : WEAPONS[step.item] ? 'weapon' : null;
        if (slot) {
          const list = slot === 'armor' ? HERO_STATE.armors : HERO_STATE.weapons;
          if (!list.includes(step.item)) list.push(step.item);
          sfx('heal');
          const { name } = (slot === 'armor' ? ARMOR : WEAPONS)[step.item];
          const wielder = wielderOf(slot, step.item);
          const forWhom = wielder !== HERO && inParty(wielder) ? ` It's for ${MEMBERS[wielder].name}.` : '';
          this.overworld.textbox.open([`You got the ${name}!${forWhom} Put it on from EQUIP (press C).`]);
          return false;
        }
        const item = ITEMS[step.item];
        if (!item) return true;
        const got = giveItem(step.item);
        if (got) sfx('heal');
        this.overworld.textbox.open([got === 'stored' ? `You got ${item.name}. Your bag is full, so it went to storage.`
          : got ? `You got ${item.name}.` : `You'd take the ${item.name}, but you've nowhere to put it.`]);
        return false;
      }
      case 'battle': {
        // The encounter plays first (see ENCOUNTER), then the scene ends there.
        music.play(null);
        sfx('flare');
        step.dings = 0;
        // The one in the spotlight comes at you, and you start.
        const foe = step.who && !step.still ? this.body(step.who) : null;
        if (foe && foe !== this.overworld.player) {
          const { player } = this.overworld;
          const d = Math.hypot(player.x - foe.x, player.y - foe.y) || 1;
          foe.perform('lunge', { x: (player.x - foe.x) / d, y: (player.y - foe.y) / d });
          player.perform?.('startle');
          step.lunged = true;
        }
        return false;
      }
      case 'end_chapter':
        // A card between chapters; then on into `room` (at `spawn`), or the title screen without one.
        this.endChapter = step;
        this.finish();
        return false;
      case 'go_on':
        // The end of a stinger that was played on its own (end_chapter's
        // `postCredits`): the scene ends and the game goes on to whatever was
        // waiting behind it, the title screen.
        this.goOn = true;
        this.finish();
        return false;
      case 'goto':
        // Off into another room (`room`, at `spawn`), as through a door: the
        // scene ends here. Jumping down a well, say.
        this.goto = step;
        this.finish();
        return false;
      case 'music':
        // `section`: start the song at one of its sections (any song's named part).
        music.play(step.song || null, null, step.section ?? null);
        return true;
      case 'ambience':
        // The sounds of the place change for a while (`name`, one of AMBIENCES in
        // src/audio/music.js: the town hall full for the meeting), under the same
        // song. Without a name, back to the room's own. (When the scene ends, the
        // room's own comes back anyway.)
        music.setAmbience(step.name ?? this.overworld.ambience ?? null);
        return true;
      case 'stage':
        this.stage.apply(step);
        return true;
      case 'hold': {
        // `who` takes hold of `what` (someone else in the scene): from now on
        // `what` stands right where `who` does, goes wherever they go, and is
        // drawn just in front of them. Give them animations made to line up
        // (the Usurper's 'usurper_grab' and Ves's 'ves_held': each in their
        // own sprite, so she's never part of his). With no `what`, `who` lets go.
        // `offset: { x, y }` (pixels) holds them a little off to one side; the
        // player can be held too (`what: 'player'`, riding Gubb's punt); and
        // `also: true` takes hold of one more without letting go of the rest.
        // `behind: true` draws them just behind instead (riding in a boat).
        const holder = this.body(step.who);
        if (!step.also) {
          for (const actor of this.actors.values()) if (actor.heldBy === holder) actor.heldBy = null;
          if (this.heldPlayer?.holder === holder) this.heldPlayer = null;
        }
        if (step.what === 'player') this.heldPlayer = { holder, offset: step.offset ?? { x: 0, y: 0 } };
        else if (step.what) {
          const held = this.body(step.what);
          held.heldBy = holder;
          held.holdOffset = step.offset ?? null;
          held.holdBehind = Boolean(step.behind);
        }
        this.carry();
        return true;
      }
      case 'join':
        // `who` is a party member id (src/characters/party.js), not a scene actor.
        if (joinParty(step.who)) this.overworld.addFollower?.(step.who);
        return true;
      case 'leave_party':
        leaveParty(step.who);
        this.overworld.removeFollower?.(step.who);
        return true;
      case 'hurt':
        // `who` is a party member id, like 'join'. { on: true } and they're
        // hurt (half their HP, and their own SPELLS for it: see `hurt` on
        // MEMBERS in party.js) until a { on: false } step heals them.
        setHurt(step.who, step.on !== false);
        // Whoever's playing them walks in what they wear now (the crutch, or not).
        for (const actor of this.actors.values()) if (actor.plays === step.who && actor.frames) actor.frames = memberFrames(step.who);
        return true;
      case 'press':
        // { do: 'press', seconds: 3, text: 'Hold on.', glow: 'player' }: the
        // player holds Z (confirm) and a bar fills; let go and it slips back
        // (a third as fast). The scene waits till it's full. `text` is shown
        // over the bar; `glow` (an actor id, or 'player') sets the stage's
        // light pouring out of them, as bright as the bar is full (stageShow.js).
        step.charge = 0;
        return false;
      case 'take':
        // { do: 'take', item: 'haddocks_bell' }: a keepsake leaves you (knocked
        // off in the wave; somebody else keeps it now). Nothing is said: the
        // scene says it.
        if (HERO_STATE.gear) HERO_STATE.gear = HERO_STATE.gear.filter((id) => id !== step.item);
        return true;
      case 'reforge':
        // { do: 'reforge', smith: 'orla_forge', marks: 'isles_star_held' }: that smith's
        // reforge of the Fallen Star (src/data/fallenStar.js), the same as from her shop's
        // TALK: the piece goes into the sword. `marks`: a scene to count as watched with it
        // (the one the shop would play after, so it never plays twice). Nothing happens if
        // the reforge isn't ready (the scene's trigger checks that first: `forge`).
        if (reforgeAt(step.smith)) {
          // (No jingle here: the show that follows (`forge_show`) has the sting.)
          WORLD_STATE.seenScenes ??= [];
          for (const id of [step.marks ?? []].flat()) if (!WORLD_STATE.seenScenes.includes(id)) WORLD_STATE.seenScenes.push(id);
        }
        return true;
      case 'forge_show':
        // { do: 'forge_show', smith: 'orla_forge' }: the big show for that smith's reforge of the
        // Fallen Star (src/overworld/reforgeShow.js): the forge, slow-motion hammer strikes, the shard
        // sinking in, the new name. Purely a show: the reforge itself is `reforge` (or the shop's
        // TALK topic), done before it. It ends by itself, so it can never hold the scene.
        step.show = new ReforgeShow(step.smith, { quiet: Boolean(this.skipping) });
        return false;
      case 'learn':
        // { do: 'learn', skill: 'nova' }: gives the hero a skill for free, no points
        // (Nova wakes this way, at the end of chapter 5).
        if (!HERO_STATE.skills.includes(step.skill)) HERO_STATE.skills.push(step.skill);
        return true;
      case 'save':
        // Saves where you're standing, like a save point (between the two
        // fights at the Hero's Gate, so losing the second doesn't mean the
        // first all over again).
        saveGame(this.overworld.roomData.id, { x: Math.floor(this.overworld.player.x / T), y: Math.floor((this.overworld.player.y - 1) / T) });
        return true;
      case 'piggyback':
        // `who` is a party member id to carry on your back from now on (Ves,
        // hurt, in the Lantern Marsh), or null to put them down: see
        // Player.carrying. You walk slower, and can't run, jump or climb.
        this.overworld.carry?.(step.who ?? null);
        return true;
      default:
        throw new Error(`Cutscene '${this.scene.id}' has a step it doesn't know: '${step.do}'`);
    }
  }

  update(dt, input) {
    if (this.done) return;
    if (this.skippable && !this.skipping) {
      // (Not counted until the key has been let go once since the scene began,
      // so running into it with the key down doesn't skip it by accident.)
      const down = input.isDown('skip');
      if (!down) this.skipArmed = true;
      this.skipHeld = down && this.skipArmed ? this.skipHeld + dt : 0;
      if (this.skipHeld >= SKIP_HOLD_SECONDS) {
        this.skipThrough();
        return;
      }
    }
    const step = this.step;
    step.t += dt;
    for (const emote of this.emotes) emote.t += dt;
    this.stage.update(dt, this.overworld.camera);
    this.background = this.background.filter((going) => !(going.do === 'toss' ? this.toss(going, dt) : this.walk(going, dt)));
    this.emotes = this.emotes.filter((emote) => emote.t < EMOTE_SECONDS);

    let finished = false;
    switch (step.do) {
      case 'say':
      case 'give':
        // (Already closed when a skip shuts it.)
        if (this.overworld.textbox.isOpen) this.overworld.textbox.update(dt, input);
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
      case 'act':
        finished = step.t >= actLength(step.act ?? 'hop');
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
      case 'press': {
        // (Skipping, nobody's holding anything: it's simply done.)
        const held = input.isDown('confirm');
        const seconds = step.seconds ?? 3;
        step.charge = this.skipping ? 1 : Math.max(0, Math.min(1, step.charge + (held ? dt / seconds : -dt / (seconds * 3))));
        if (step.glow) this.stage.glow = { who: step.glow, power: step.charge };
        finished = step.charge >= 1;
        break;
      }
      case 'forge_show':
        step.show.update(dt, input, this.skipping);
        finished = step.show.done;
        break;
      case 'battle':
        if (step.lunged && !step.jolted && step.t >= LUNGE_JOLT) {
          step.jolted = true;
          sfx('pounce');
          this.overworld.shakeCamera?.(2, 0.25);
        }
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
    this.carry();
    if (finished) this.advance();
  }

  // Whoever is held (the `hold` step) moves with whoever holds them.
  carry() {
    for (const actor of this.actors.values()) {
      const holder = actor.heldBy;
      if (!holder) continue;
      actor.x = holder.x + (actor.holdOffset?.x ?? 0);
      actor.y = holder.y + (actor.holdOffset?.y ?? 0);
      actor.lift = holder.lift ?? 0;
    }
    if (this.heldPlayer) {
      const { holder, offset } = this.heldPlayer;
      this.overworld.player.x = holder.x + offset.x;
      this.overworld.player.y = holder.y + offset.y;
    }
  }

  // Walks in a straight line to the tile, at walking pace. Scripted walks go
  // where they're told, through anything in the way.
  // A thrown thing in flight (the `toss` step). Returns true once it's come to rest.
  toss(step, dt) {
    const body = this.body(step.who);
    const f = step.flight;
    const hop = f.hops[f.hop];
    // The hero is lifted by their own height off the ground (`z`); an actor by `lift`.
    const raise = (pixels) => {
      if (body === this.overworld.player) body.z = pixels;
      else body.lift = pixels;
    };
    if (!hop) {
      // Skidding the last little way in the snow, then still.
      raise(0);
      return true;
    }
    // Higher hops take longer: like falling under gravity.
    const seconds = hop.seconds ?? 0.18 + Math.sqrt(hop.height) * 0.07;
    f.t = Math.min(seconds, f.t + dt);
    const k = f.t / seconds;
    const along = hop.from + (hop.to - hop.from) * k;
    const total = f.hops[f.hops.length - 1].to;
    body.x = f.start.x + f.dx * (along / total);
    body.y = f.start.y + f.dy * (along / total);
    raise(Math.sin(k * Math.PI) * hop.height);
    if (k >= 1) {
      raise(0);
      sfx(f.hop === 0 ? 'hit' : 'type');
      f.hop++;
      f.t = 0;
      // Settled: it stops spinning (unless the toss says to `keep` its
      // animation: Ves, flat on the floor where she dived).
      if (f.hop >= f.hops.length && !step.keep) body.animation = null;
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
    const stride = (step.pace ?? (isPlayer ? PLAYER_SPEED : ACTOR_SPEED) * (step.fast ? 2 : 1)) * dt;
    // Whatever they were doing, they stop to walk, unless the walk says to
    // `keep` it (the Roost Mother falling, frozen in her last frame).
    if (!isPlayer && !step.keep) body.animation = null;
    if (distance <= stride) {
      body.x = goalX;
      body.y = goalY;
      this.setWalking(body, false, step);
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
    this.setWalking(body, true, step);
    return false;
  }

  setWalking(body, walking, step = this.step) {
    if (body === this.overworld.player) {
      body.moving = walking;
      if (!walking) {
        body.animationTime = 0;
        body.x = Math.round(body.x);
        body.y = Math.round(body.y);
      }
    } else {
      body.walking = walking;
      body.running = walking && Boolean(step?.fast);
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

  // Skipping: the rest of the scene plays out at once, silently, every page
  // closed, so whatever it does (joins, gifts, music, flags, a battle at the
  // end) still happens.
  skipThrough() {
    this.skipping = true;
    music.hushed = true;
    const { textbox } = this.overworld;
    const still = { isDown: () => false, wasPressed: () => false };
    try {
      for (let i = 0; i < SKIP_MAX_TICKS && !this.done; i++) {
        while (textbox.isOpen) textbox.nextPage();
        this.update(SKIP_TICK, still);
      }
    } finally {
      music.hushed = false;
    }
    // Whatever was still fading or shaking is over, as it would be by now.
    this.overworld.tickWeather?.(1e6);
    this.overworld.shake = null;
  }

  finish() {
    this.done = true;
    markWatched(this.scene.id);
    // A scene can mark other scenes as seen (`sees`) or not seen any more
    // (`unsees`), so things that appear `after` or `until` them come and go
    // with the story: Gubb's punt moored on the east shore, or the west one.
    WORLD_STATE.seenScenes ??= [];
    for (const id of this.scene.sees ?? []) if (!WORLD_STATE.seenScenes.includes(id)) WORLD_STATE.seenScenes.push(id);
    if (this.scene.unsees) WORLD_STATE.seenScenes = WORLD_STATE.seenScenes.filter((id) => !this.scene.unsees.includes(id));
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
      prop.moveToTile(Math.floor((actor.x - (actor.centered ? prop.width / 2 - T / 2 : 0)) / T), Math.floor((actor.y - 1) / T));
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

  // The `press` step: its words, and a bar that fills while the key is held.
  drawPress(step, ctx) {
    inUiSpace(ctx, () => {
      const w = 280;
      const x = Math.round((UI_WIDTH - w) / 2);
      const y = Math.round(UI_HEIGHT * 0.72);
      const pulse = 0.82 + 0.18 * Math.sin(step.t * 6);
      if (step.text) drawText(ctx, step.text, UI_WIDTH / 2, y - 64, { size: 24, color: '#ffffff', align: 'center', outline: '#000' });
      drawText(ctx, `Hold ${keyName(keyFor('confirm'))}`, UI_WIDTH / 2, y - 32, { size: 20, color: `rgba(255, 246, 214, ${pulse.toFixed(2)})`, align: 'center', outline: '#000' });
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(x - 3, y - 3, w + 6, 18);
      ctx.fillStyle = '#3a3450';
      ctx.fillRect(x, y, w, 12);
      ctx.fillStyle = '#fff6d6';
      ctx.fillRect(x, y, Math.round(w * step.charge), 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, Math.round(w * step.charge), 3);
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
    // A scene you've seen before: a small hint, and while the key is held, a
    // bar filling up.
    if (this.skippable && !this.done) {
      inUiSpace(ctx, () => {
        const w = 150;
        const x = UI_WIDTH - w - 16;
        const held = this.skipHeld > 0;
        drawText(ctx, held ? 'SKIPPING...' : `Hold ${keyName(keyFor('skip'))} to skip`, x + w, 12, { size: 18, color: held ? '#fff' : '#8a82b0', align: 'right', outline: '#000' });
        if (held) {
          ctx.fillStyle = '#120c1c';
          ctx.fillRect(x, 36, w, 6);
          ctx.fillStyle = '#fff';
          ctx.fillRect(x, 36, Math.round(w * Math.min(1, this.skipHeld / SKIP_HOLD_SECONDS)), 6);
        }
      });
    }
    this.stage.draw(ctx, camera, (id) => this.body(id));
    if (this.step?.do === 'press' && !this.done) this.drawPress(this.step, ctx);
    if (this.step?.do === 'forge_show' && !this.done) inUiSpace(ctx, () => this.step.show.draw(ctx));
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
