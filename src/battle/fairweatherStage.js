import * as hud from './hud.js';

// Madam Fairweather's stage (src/data/enemies/fairweather.js): what each of her four phases does
// to the box, beyond its attacks (see stageEffects.js for the hooks). Every phase has
// `stage: 'fairweather'`; the phase's id says which look it gets.
//
//   laugh      the box is dark sea with foam, a few bubbles; no turning
//   shower     the box is the night sky, stars in it; (the attacks tip it themselves)
//   carousel   the box is a painted carousel's inside, turning about its middle (boxTurn)
//   chaos      all of them: the sky, the stripes and a turn that never keeps one speed
//
// The turning is how it looks only: nothing in the box moves against anything else (see drawBox).

const phaseOf = (battle) => battle.bossPhase()?.id ?? null;
const FOE_SCALE = 2;

function soft(ctx, x, y, r, rgb, a) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, `rgba(${rgb}, ${a.toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Little stars going round her on a tilted ring; `side` is which half is drawn (the far half
// behind her, the near half in front).
function ring(ctx, cx, cy, t, side, count = 8, spin = 1) {
  for (let i = 0; i < count; i++) {
    const a = t * 0.9 * spin + (i / count) * Math.PI * 2;
    const front = Math.sin(a) > 0;
    if ((side === 'front') !== front) continue;
    const x = cx + Math.cos(a) * 52;
    const y = cy + Math.sin(a) * 12;
    ctx.fillStyle = front ? '#fff0a8' : 'rgba(191, 244, 255, 0.7)';
    ctx.fillRect(Math.round(x - 1), Math.round(y - 3), 2, 6);
    ctx.fillRect(Math.round(x - 3), Math.round(y - 1), 6, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
}

export const FAIRWEATHER_STAGE = {
  start() {
    return {};
  },

  // Straight to how things are once a phase's beat is over (for previews).
  skip() {},

  // Beaten or spared: the light lifts off her in motes and stars.
  leave(battle, foe) {
    const { x, y } = foe.center;
    battle.bits.ring(x, y + 10, { squash: 0.4, speed: 100, color: '#bff4ff', width: 2, life: 1.2 });
    battle.bits.ring(x, y + 10, { squash: 0.4, speed: 60, color: '#fff0a8', life: 1.4 });
    battle.bits.scatter(x, y, 26, ['#bff4ff', '#fff0a8', '#ff9ae0', '#e8c060'], { speed: 90, up: 50, gravity: 90, life: 1.5 });
    for (let i = 0; i < 18; i++) battle.bits.mote(x + (Math.random() - 0.5) * 50, y + Math.random() * 40, { vy: -14 - Math.random() * 24, color: i % 2 ? '#fff0a8' : '#bff4ff' });
  },

  boxTurn(battle) {
    if (battle.phase !== 'dodge') return 0;
    const id = phaseOf(battle);
    const t = battle.dodgeTime;
    const ease = Math.min(1, t / 0.8);
    if (id === 'carousel') return 0.3 * ease * Math.sin(t * 0.8 * Math.PI * 0.75) + 0.08 * ease * Math.sin(t * 2.3);
    if (id === 'chaos') return ease * (0.24 * Math.sin(t * 1.3) + 0.12 * Math.sin(t * 2.9 + 1));
    return 0;
  },

  drawFoe(ctx, battle, foe, x, y, w, h) {
    if (foe.state !== 'active') return false;
    const id = phaseOf(battle);
    const t = battle.time;
    const cx = x + w / 2;
    const cy = y + h * 0.5;
    ctx.save();
    soft(ctx, cx, cy, 84, id === 'chaos' ? '255, 150, 220' : '150, 220, 255', 0.2 + 0.06 * Math.sin(t * (id === 'chaos' ? 6 : 2)));
    if (id === 'shower' || id === 'chaos') ring(ctx, cx, y + h * 0.3, t, 'back', 8, 1);
    if (id === 'carousel' || id === 'chaos') ring(ctx, cx, y + h * 0.7, t, 'back', 10, -1.4);
    ctx.restore();
    return false;
  },

  drawOver(ctx, battle) {
    const foe = battle.phased;
    if (!foe || foe.state !== 'active') return;
    const id = phaseOf(battle);
    const t = battle.time;
    const w = foe.sprite.width * FOE_SCALE;
    const h = foe.sprite.height * FOE_SCALE;
    const cx = foe.pos.x + w / 2;
    ctx.save();
    if (id === 'shower' || id === 'chaos') ring(ctx, cx, foe.pos.y + h * 0.3, t, 'front', 8, 1);
    if (id === 'carousel' || id === 'chaos') ring(ctx, cx, foe.pos.y + h * 0.7, t, 'front', 10, -1.4);
    ctx.restore();
  },

  drawBack(ctx, battle) {
    const id = phaseOf(battle);
    const { width } = ctx.canvas;
    if (id === 'chaos') {
      ctx.fillStyle = `rgba(60, 10, 60, ${(0.12 + 0.05 * Math.sin(battle.time * 5)).toFixed(3)})`;
      ctx.fillRect(0, 0, width, hud.STAGE_HEIGHT);
    } else if (id === 'carousel') {
      ctx.fillStyle = 'rgba(40, 20, 10, 0.14)';
      ctx.fillRect(0, 0, width, hud.STAGE_HEIGHT);
    }
  },

  drawBoxBack(ctx, battle, open) {
    const r = hud.boxRect(open);
    const t = battle.time;
    const id = phaseOf(battle);
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (id === 'carousel') {
      ctx.fillStyle = '#12080a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // The painted canopy: stripes fanning from the middle, turning.
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      for (let i = 0; i < 14; i++) {
        const a0 = (i / 14) * Math.PI * 2 + t * 0.5;
        ctx.fillStyle = i % 2 ? 'rgba(120, 30, 40, 0.5)' : 'rgba(232, 192, 96, 0.28)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r.w, a0, a0 + Math.PI / 14);
        ctx.closePath();
        ctx.fill();
      }
    } else if (id === 'shower' || id === 'chaos') {
      ctx.fillStyle = id === 'chaos' ? '#0c0614' : '#030712';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      for (let i = 0; i < 26; i++) {
        const x = r.x + ((i * 53) % r.w);
        const y = r.y + ((i * 29 + (id === 'chaos' ? t * 12 : 0)) % r.h);
        ctx.fillStyle = i % 5 === 0 ? 'rgba(255, 240, 168, 0.8)' : 'rgba(191, 244, 255, 0.45)';
        ctx.fillRect(Math.round(x), Math.round(y), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
    } else {
      ctx.fillStyle = '#04101a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = 'rgba(232, 246, 244, 0.22)';
      for (let i = 0; i < 10; i++) {
        const x = r.x + 8 + ((i * 41) % (r.w - 16));
        const y = r.y + r.h - ((t * (9 + (i % 3) * 4) + i * 27) % r.h);
        ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      }
    }
    ctx.restore();
    return true;
  },
};
