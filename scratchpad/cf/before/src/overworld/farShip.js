import { TILE_SIZE as T } from '../config.js';
import { music } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { glowSprite } from './lamplight.js';
import { drawText } from '../ui/text.js';
import { inUiSpace } from '../engine/screen.js';
import { UI_WIDTH } from '../config.js';

// THE FAR SHIP (chapter 5): the Fair Return, before you have found her. In a few rooms that look out to
// sea, now and then, something of her comes in off the water and goes again. Never in a scene, never twice
// in one visit, and not every visit:
//
//   farShip: { sing: true }            her crew's shanty, "Port Tomorrow", very faint, from somewhere out on
//                                      the water (C C D Eb D: it stops a note short, as it always does).
//   farShip: { light: { x, y } }       a ship's lantern far out in the fog, at that tile on the sea: it comes
//                                      up, swings a little, and is gone.
//   (both: one or the other, each visit.) `chance` (0 to 1, default 0.45) is how often a visit has one.
//
// Only in chapter 5, and only until you've been aboard her (ship_boarding). The first time the singing is
// heard at all, the friends say something ([far_singing] in text/interactions/ghostship.txt).
// tools/preview.html's `farship=sing` or `farship=light` makes the next room have that one, soon (for stills).
const SHANTY = [60, 60, 62, 63, 62];
const STEP = 0.9;
const CAPTION = '...men singing, very far off, out on the water...';
const SHIP_TEXT = 'interactions/ghostship.txt';

export function makeFarShip(scene) {
  const cfg = scene.roomData.farShip;
  if (!cfg) return null;
  if ((WORLD_STATE.chapter ?? 0) !== 5) return null;
  if ((WORLD_STATE.seenScenes ?? []).includes('ship_boarding')) return null;
  return new FarShip(scene, cfg);
}

export class FarShip {
  constructor(scene, cfg) {
    this.scene = scene;
    this.cfg = cfg;
    const kinds = [cfg.sing && 'sing', cfg.light && 'light'].filter(Boolean);
    const forced = globalThis.FAR_SHIP_FORCE;
    if (forced && kinds.includes(forced)) {
      this.kind = forced;
      this.wait = 1.5;
    } else if (kinds.length && Math.random() < (cfg.chance ?? 0.45)) {
      this.kind = kinds[Math.floor(Math.random() * kinds.length)];
      this.wait = 6 + Math.random() * 14;
    } else this.kind = null;
    this.t = -1;
  }

  // The room must be free (no scene, no words up) for the wait to count down.
  update(dt) {
    if (!this.kind) return;
    const s = this.scene;
    if (this.t < 0) {
      if (s.cutscene || s.textbox.isOpen || s.fadeIn > 0) return;
      this.wait -= dt;
      if (this.wait > 0) return;
      this.t = 0;
      if (this.kind === 'sing') this.sing();
      return;
    }
    this.t += dt;
    if (this.kind === 'sing' && this.t > SHANTY.length * STEP + 1.4 && !this.answered) {
      this.answered = true;
      this.firstHearing();
    }
    if (this.t > 9) this.kind = null;
  }

  // The crew's shanty, faint, on the same choir as the boarding scene (one voice doubled low), the music dipping a
  // little under it so it can be heard at all.
  sing() {
    music.duck(0.55, SHANTY.length * STEP + 0.8);
    SHANTY.forEach((midi, i) => {
      for (const [k, sample] of ['choir', 'cellos'].entries()) {
        music.chime(sample, k ? midi - 12 : midi, { delay: 0.3 + i * STEP, volume: k ? 0.045 : 0.085, seconds: STEP * 1.3, attack: 0.15 });
      }
    });
  }

  // The first time it's ever heard: a line, and the friends' answers. Later times, nobody says anything.
  firstHearing() {
    const s = this.scene;
    WORLD_STATE.seenScenes ??= [];
    if (WORLD_STATE.seenScenes.includes('far_singing_heard')) return;
    if (s.cutscene || s.textbox.isOpen) return;
    WORLD_STATE.seenScenes.push('far_singing_heard');
    s.say(SHIP_TEXT, 'far_singing');
  }

  // The lantern far out: a warm point and its bloom at the tile, rising out of the fog and sinking back, with a slow
  // swing (a ship rolling). Drawn under the fog, so the fog goes over it.
  draw(ctx) {
    if (this.kind !== 'light' || this.t < 0 || !this.cfg.light) return;
    const u = this.t / 7;
    if (u >= 1) return;
    const fade = Math.min(1, u / 0.25) * Math.min(1, (1 - u) / 0.3);
    const flicker = 0.85 + 0.15 * Math.sin(this.t * 9.1) * Math.sin(this.t * 3.7);
    const cam = this.scene.camera;
    const x = this.cfg.light.x * T + T / 2 + Math.sin(this.t * 0.9) * 3 - cam.x;
    const y = this.cfg.light.y * T + T / 2 + Math.sin(this.t * 0.7 + 1) * 1.5 - cam.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.55 * fade * flicker;
    const bloom = glowSprite('255, 200, 120');
    ctx.drawImage(bloom, x - 22, y - 22, 44, 44);
    ctx.globalAlpha = 0.25 * fade;
    ctx.drawImage(bloom, x - 6, y + 4, 12, 26);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = fade * flicker;
    ctx.fillStyle = '#ffe2a8';
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    ctx.restore();
  }

  // While the shanty drifts in, a faint line at the top of the screen says what it is (for anyone with the sound low).
  drawCaption(ctx) {
    if (this.kind !== 'sing' || this.t < 0) return;
    const end = SHANTY.length * STEP + 1.2;
    if (this.t > end) return;
    const fade = Math.min(1, this.t / 0.8) * Math.min(1, (end - this.t) / 0.8);
    inUiSpace(ctx, () => {
      ctx.globalAlpha = 0.6 * fade;
      drawText(ctx, CAPTION, UI_WIDTH / 2, 20, { size: 22, color: '#bfe0d8', align: 'center' });
      ctx.globalAlpha = 1;
    });
  }
}
