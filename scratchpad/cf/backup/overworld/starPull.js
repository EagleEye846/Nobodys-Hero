import { music } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { hasGear } from '../data/gear.js';
import { WORLD_STATE } from '../state/saveGame.js';

// THE STAR'S PULL (chapter 5's ghost ship): a shard of the fallen star is somewhere aboard (in the
// figurehead's breast, at the bow), and the Fallen Star knows it. In a room with `starPull` (0 to 1:
// how near the bow the room is, by the way you have to go), and only while you carry the sword and
// the shard is still out there, every few seconds:
//   - a faint chime: the start of THE FALLING STAR (parts/starGuardians.js), in the figurehead's key
//     (D). Far off, only its first note; nearer, more of it; at the bow, all four.
//   - a small glint at the sword on the hero's hip, pale blue, brighter the nearer you are.
// The nearer the bow, the more often it comes (about every 9 s far off, every 3 s at the bow).
// Quiet while a scene plays or words are up. Costs nothing in a room without `starPull`.
// Set globalThis.STAR_PULL_FORCE = true (in the console) and the next room's first glint comes at once (for stills).

// The Falling Star in D: D6 A5 G#5 D5, quick, quick, a breath, long.
const NOTES = [86, 81, 80, 74];
const AT = [0, 0.17, 0.34, 0.68];
const GLINT_SECONDS = 0.9;
const SHARD_SCENES = ['figurehead_spared', 'figurehead_beaten'];

export function makeStarPull(scene) {
  const pull = scene.roomData.starPull;
  if (!pull) return null;
  if (!HERO_STATE.weapons?.includes('fallen_star')) return null;
  const seen = WORLD_STATE.seenScenes ?? [];
  if (hasGear('star_shard_wreck') || SHARD_SCENES.some((id) => seen.includes(id))) return null;
  return new StarPull(scene, Math.max(0, Math.min(1, pull)));
}

export class StarPull {
  constructor(scene, pull) {
    this.scene = scene;
    this.pull = pull;
    this.every = 9 - 6 * pull;
    // The first one comes a little after you walk in, never on the doorstep.
    this.wait = globalThis.STAR_PULL_FORCE ? 0.3 : 2 + Math.random() * 2;
    this.glint = 0;
  }

  update(dt) {
    if (this.glint > 0) this.glint = Math.max(0, this.glint - dt);
    const s = this.scene;
    if (s.cutscene || s.textbox?.isOpen || s.fadeIn > 0 || s.doorway) return;
    this.wait -= dt;
    if (this.wait > 0) return;
    this.wait = this.every * (0.85 + Math.random() * 0.3);
    this.glint = GLINT_SECONDS;
    this.ring();
  }

  // The chime: a thin bowed-glass note with a glockenspiel's ping on top, very quiet far off.
  ring() {
    const count = Math.max(1, Math.min(4, 1 + Math.round(this.pull * 3)));
    const volume = 0.035 + 0.06 * this.pull;
    for (let i = 0; i < count; i++) {
      const last = i === count - 1;
      music.chime('vibesBowed', NOTES[i], { delay: AT[i], volume, seconds: last ? 1.2 : 0.35, attack: 0.03, release: last ? 1.4 : 0.5 });
      music.chime('glock', NOTES[i], { delay: AT[i], volume: volume * 0.5, seconds: 0.3, release: 0.6 });
    }
  }

  // The glint at the hero's hip (in the room's own space, so it leans with the ship). A little cross
  // of pale blue pixels that opens and fades; its arms grow with the pull.
  draw(ctx) {
    if (this.glint <= 0) return;
    const p = this.scene.player;
    if (!p || p.hidden) return;
    const cam = this.scene.camera;
    const age = 1 - this.glint / GLINT_SECONDS;
    const fade = age < 0.2 ? age / 0.2 : 1 - (age - 0.2) / 0.8;
    const side = p.facing === 'left' ? -5 : p.facing === 'right' ? 5 : 4;
    const x = Math.round(p.x + side - cam.x);
    const y = Math.round(p.y - 9 - (p.z ?? 0) - cam.y);
    const reach = 1 + Math.round(this.pull * 3 * Math.min(1, age * 3));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const halo = ctx.createRadialGradient(x, y, 0, x, y, 6 + 6 * this.pull);
    halo.addColorStop(0, `rgba(150, 210, 255, ${(0.35 * fade * (0.5 + this.pull)).toFixed(3)})`);
    halo.addColorStop(1, 'rgba(150, 210, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(x - 12, y - 12, 24, 24);
    ctx.fillStyle = `rgba(214, 238, 255, ${(fade * (0.55 + 0.45 * this.pull)).toFixed(3)})`;
    ctx.fillRect(x, y, 1, 1);
    for (let i = 1; i <= reach; i++) {
      ctx.globalAlpha = Math.max(0, 1 - i / (reach + 1));
      ctx.fillRect(x + i, y, 1, 1);
      ctx.fillRect(x - i, y, 1, 1);
      ctx.fillRect(x, y + i, 1, 1);
      ctx.fillRect(x, y - i, 1, 1);
    }
    ctx.restore();
  }
}
