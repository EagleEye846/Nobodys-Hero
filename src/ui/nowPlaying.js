import { music } from '../audio/music.js';
import { drawText, textWidth } from './text.js';
import { COLORS } from '../battle/hud.js';

// "Now playing": when a new song starts, its name slides in at the top left,
// stays a few seconds, and fades away. Drawn over every scene by Game (see
// src/engine/game.js), in UI space.
const SLIDE_SECONDS = 0.35;
const SHOW_SECONDS = 4;
const FADE_SECONDS = 0.7;
const AT = { x: 10, y: 10 };
const HEIGHT = 30;
const PAD = 10;
const SIZE = 24;

// A little pixel quaver, 2 UI pixels a dot.
const NOTE = ['...##', '...#.#', '...#..', '...#..', '.###..', '####..', '.##...'];

export function drawNowPlaying(ctx, now = performance.now()) {
  const playing = music.nowPlaying;
  if (!playing) return;
  const age = (now - playing.at) / 1000;
  if (age < 0 || age > SHOW_SECONDS + FADE_SECONDS) return;
  const slide = Math.min(1, age / SLIDE_SECONDS);
  const eased = 1 - (1 - slide) ** 3;
  const alpha = age > SHOW_SECONDS ? 1 - (age - SHOW_SECONDS) / FADE_SECONDS : 1;
  const width = PAD * 2 + 16 + textWidth(ctx, playing.title, SIZE);
  const x = Math.round(AT.x - (1 - eased) * (width + AT.x));
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = alpha * 0.9;
  ctx.fillStyle = COLORS.cardFill;
  ctx.fillRect(x, AT.y, width, HEIGHT);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = COLORS.cardIdle;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, AT.y + 1, width - 2, HEIGHT - 2);
  ctx.fillStyle = COLORS.yellow;
  NOTE.forEach((row, y) => [...row].forEach((c, nx) => {
    if (c === '#') ctx.fillRect(x + PAD + nx * 2, AT.y + 8 + y * 2, 2, 2);
  }));
  drawText(ctx, playing.title, x + PAD + 16, AT.y + 3, { size: SIZE, color: COLORS.text });
  ctx.restore();
}
