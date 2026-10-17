import { TILE_SIZE as T, UI_SCALE } from '../config.js';
import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { chooseFacing } from '../characters/hero.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { ENEMIES } from '../data/enemies/index.js';
import { music, sfx } from '../audio/music.js';
import { drawText, textWidth } from '../ui/text.js';
import { animationFrame, DEFAULT_FRAME_SECONDS } from '../engine/animations.js';
import { ITEMS, giveItem } from '../data/items.js';

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
};
export const EMOTES = ['!', '?', '...', '<3'];
export const FACINGS = ['down', 'up', 'left', 'right'];

const ACTOR_SPEED = 48; // pixels per second
const PLAYER_SPEED = 70;
const CAMERA_SPEED = 180;
const EMOTE_SECONDS = 0.8;
const BOB_SECONDS = 0.6;
const FADE_MS = 300; // how long actors take to fade in or out

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
    spriteCache.set(look, sprite && { right: sprite, left: flipHorizontal(sprite), back });
  }
  return spriteCache.get(look);
}

// Someone in this scene. Like the player, (x, y) is under the feet. An actor
// that `plays` a character already in the room (their NPC or shop id) takes
// that character's place: they start where the character stands, and the
// character hides until the scene ends.
class Actor {
  constructor({ id, look, x, y, portrait = null, hidden = false, plays = null, animation = null, speed = DEFAULT_FRAME_SECONDS }) {
    this.plays = plays;
    // An animation they're playing (see src/engine/animations.js), or null.
    this.animation = animation;
    this.speed = speed;
    this.id = id;
    this.sprites = lookSprite(look);
    if (!this.sprites) throw new Error(`A cutscene actor '${id}' has an unknown look '${look}'`);
    this.x = (x + 0.5) * T;
    this.y = (y + 1) * T;
    this.portrait = portrait;
    this.hidden = hidden;
    this.facing = 'right';
    this.walking = false;
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

  draw(ctx, camera) {
    if (this.hidden) return;
    const alpha = this.alpha;
    if (alpha <= 0) return;
    const seconds = performance.now() / 1000;
    const animated = this.animation && animationFrame(this.animation, seconds, this.speed);
    const sprite = animated
      || (this.facing === 'up' && this.sprites.back)
      || (this.facing === 'left' ? this.sprites.left : this.sprites.right);
    const bob = this.walking && Math.floor(seconds / (BOB_SECONDS / 3)) % 2 ? 1 : 0;
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, Math.round(this.x) - Math.floor(sprite.width / 2) - camera.x, Math.round(this.y) - sprite.height - bob - camera.y);
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
    for (const actor of this.actors.values()) {
      const prop = actor.plays && overworld.room.props.find((p) => p.character === actor.plays && !p.hidden);
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
        this.overworld.textbox.open(pages, speaker?.portrait ?? null);
        return false;
      }
      case 'walk':
        return false;
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
        this.focus ??= { x: this.overworld.player.x, y: this.overworld.player.y };
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
        // the scene waits that long, then the animation stops.
        const body = this.body(step.who);
        if (body === this.overworld.player) return true;
        body.animation = step.animation || null;
        body.speed = step.speed ?? DEFAULT_FRAME_SECONDS;
        return !(step.animation && step.seconds > 0);
      }
      case 'sound':
        if (step.name) sfx(step.name);
        return true;
      case 'give': {
        const item = ITEMS[step.item];
        if (!item) return true;
        const got = giveItem(step.item);
        if (got) sfx('heal');
        this.overworld.textbox.open([got ? `You got ${item.name}.` : `You'd take the ${item.name}, but your bag is full.`]);
        return false;
      }
      case 'battle':
        // The scene ends here; the overworld runs the battle, then plays the
        // `spared` or `defeated` scene after it (see OverworldScene.storyBattle).
        this.battle = step;
        this.finish();
        return false;
      case 'end_chapter':
        // A card between chapters; then on into `room` (at `spawn`), or the title screen without one.
        this.endChapter = step;
        this.finish();
        return false;
      case 'music':
        music.play(step.song || null);
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
      case 'emote':
        finished = step.t >= EMOTE_SECONDS;
        break;
      case 'wait':
        finished = step.t >= (step.seconds ?? 0.5);
        break;
      case 'animate':
        finished = step.t >= step.seconds;
        if (finished) this.body(step.who).animation = null;
        break;
      case 'camera':
        finished = this.pan(step, dt);
        break;
      default:
        finished = true;
    }
    if (finished) this.advance();
  }

  // Walks in a straight line to the tile, at walking pace. Scripted walks go
  // where they're told, through anything in the way.
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
    // Whatever they were doing, they stop to walk.
    if (!isPlayer) body.animation = null;
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
      this.focus = target === this.overworld.player ? null : { x: target.x, y: target.y };
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
    this.overworld.player.moving = false;
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
    for (const actor of this.actors.values()) actor.hidden = true;
  }

  // Emote bubbles above heads, drawn over everything else in the room.
  drawOverlay(ctx, camera) {
    for (const { body, text, t } of this.emotes) {
      const pop = Math.min(1, t / 0.12);
      const headY = body.y - (body.sprites?.right.height ?? 24) - 8 - camera.y;
      const x = body.x - camera.x;
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
