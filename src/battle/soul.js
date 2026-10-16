import { UI_SCALE as S } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { SOUL_MODES, SOUL_INSET } from './soulModes.js';

// In world units. Bullets must touch the small circle at the soul's centre to
// hurt; anything inside the graze area around it grazes instead.
export const SOUL_RADIUS = 2;
export const GRAZE_RADIUS = 12;

const MODE_FLASH_SECONDS = 0.4;
const GRAZE_GLOW_SECONDS = 0.15;

// The soul: a heart, half filled, with a sparkle. 17x16, drawn in UI space at
// 1:1 so it keeps its detail. Modes recolour it.
const SOUL_ROWS = [
  '...###.....###...',
  '..#...#...#...#..',
  '.#.....#.#.....#.',
  '#.......#...#...#',
  '#..........#.#..#',
  '#...........#...#',
  '#.........#.....#',
  '.#.............#.',
  '.#..#########..#.',
  '..#..#.#####..#..',
  '...#..#.###..#...',
  '....#..###..#....',
  '.....#..#..#.....',
  '......#...#......',
  '.......#.#.......',
  '........#........',
];
const CENTER = { x: 8, y: 8 };

const sprites = new Map();
// The soul sprite in a mode's colour. Also used as the menu cursor.
export function soulSprite(modeName = 'normal') {
  if (!sprites.has(modeName)) sprites.set(modeName, makeSprite(SOUL_ROWS, { '#': SOUL_MODES[modeName].color }));
  return sprites.get(modeName);
}

// The player's soul: what you steer inside the battle box while the enemy
// attacks. Its position is in world units.
export class Soul {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.grounded = false;
    this.focused = false;
    this.iframes = 0;
    // Abilities can root the soul in place, or make it briefly unhittable without blinking.
    this.locked = false;
    this.untouchable = 0;
    this.modeFlash = 0;
    this.grazeGlow = 0;
    this.shattered = false;
    this.modeName = 'normal';
    this.mode = SOUL_MODES.normal;
  }

  reset(x, y, modeName) {
    this.mode = SOUL_MODES[modeName];
    if (!this.mode) throw new Error(`Unknown soul mode '${modeName}'`);
    this.modeName = modeName;
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.grounded = false;
    this.focused = false;
    this.iframes = 0;
    this.locked = false;
    this.untouchable = 0;
    this.grazeGlow = 0;
    // A ring pulses out when the soul takes on a special mode.
    this.modeFlash = modeName === 'normal' ? 0 : MODE_FLASH_SECONDS;
  }

  // Lights up the graze area for a moment, like Deltarune.
  graze() {
    this.grazeGlow = GRAZE_GLOW_SECONDS;
  }

  update(dt, input, box) {
    this.iframes = Math.max(0, this.iframes - dt);
    this.untouchable = Math.max(0, this.untouchable - dt);
    this.modeFlash = Math.max(0, this.modeFlash - dt);
    this.grazeGlow = Math.max(0, this.grazeGlow - dt);
    if (!this.locked) this.mode.update(this, dt, input, box);
    this.clampTo(box);
  }

  clampTo(box) {
    this.x = Math.min(Math.max(this.x, box.x + SOUL_INSET), box.x + box.w - SOUL_INSET);
    this.y = Math.min(Math.max(this.y, box.y + SOUL_INSET), box.y + box.h - SOUL_INSET);
  }

  // Draw in UI space.
  draw(ctx) {
    if (this.shattered) return;
    const x = Math.round(this.x * S);
    const y = Math.round(this.y * S);
    const sprite = soulSprite(this.modeName);

    // While grazing, a larger faint heart shows the graze area.
    if (this.grazeGlow > 0) {
      ctx.globalAlpha = (this.grazeGlow / GRAZE_GLOW_SECONDS) * 0.5;
      ctx.drawImage(sprite, x - CENTER.x * 2, y - CENTER.y * 2, sprite.width * 2, sprite.height * 2);
      ctx.globalAlpha = 1;
    }

    // Blink while invincible after a hit.
    if (this.iframes > 0 && Math.floor(this.iframes * 12) % 2 === 0) return;
    ctx.drawImage(sprite, x - CENTER.x, y - CENTER.y);

    if (this.focused) {
      ctx.fillStyle = '#4fe3d0';
      ctx.fillRect(x - 1, y - 1, 3, 3);
    }
    if (this.modeFlash > 0) {
      ctx.strokeStyle = this.mode.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 10 + (MODE_FLASH_SECONDS - this.modeFlash) * 80, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
