import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { drawText } from './text.js';

// The PAUSED card, over everything, when the game window loses focus (see
// Game.pause in src/engine/game.js). The game underneath is frozen where it
// was. `age` is how long it's been paused, in milliseconds.
export function drawPaused(ctx, age = 0) {
  const fade = Math.min(1, age / 150);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.55 * fade;
  ctx.fillStyle = '#05030c';
  ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
  ctx.globalAlpha = fade;
  const w = 300;
  const h = 96;
  const x = (UI_WIDTH - w) / 2;
  const y = (UI_HEIGHT - h) / 2 - 20;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);
  drawText(ctx, 'PAUSED', UI_WIDTH / 2, y + 14, { size: 44, align: 'center', color: '#ffe14d' });
  // The prompt breathes, slowly.
  ctx.globalAlpha = fade * (0.65 + 0.35 * Math.sin(age / 400));
  drawText(ctx, 'Press any key to carry on', UI_WIDTH / 2, y + 60, { size: 22, align: 'center', color: '#c9c2e0' });
  ctx.restore();
}
