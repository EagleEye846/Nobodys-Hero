import * as hud from './hud.js';
import { fract, vistaHash as noise } from '../engine/noise.js';
import { flashScale } from '../state/settings.js';

// Corrie, the Tidecaller's stage (src/data/enemies/corrie.js): what each of
// his four phases does to the box, beyond its attacks (see stageEffects.js
// for the hooks). Every phase has `stage: 'corrie'`; the phase's id says
// which look it gets.
//
//   boy        the box is the dark sea at night, a few bubbles rising
//   storm      the box is the storm sky; and THE TIDE: the water in the box
//              (the storm attacks' Tide, src/battle/attacks/corrie.js) starts
//              TIDE_START deep and climbs TIDE_STEP more after each of his
//              turns, up to TIDE_MAX. Haddock's bell (a TALK in his fight)
//              soothes the next attack: the water drains out of the box
//              during it, and the tide starts again from the bottom
//   whirlpool  the box is the whirlpool seen from above, its arms turning;
//              the box itself rocks round (boxTurn), and the bell weakens
//              the current for one attack
//   lamp       the box is the lamp room's dark, the beam's warmth in it
//
// The level is kept in the stage's state and handed to each attack as
// `tools.sea` ({ level, rise, soothed, first, pull }).

const TIDE_START = 12;
const TIDE_STEP = 6;
const TIDE_MAX = 34;
// How far the box rocks (radians) in the whirlpool, and how fast.
const TURN = 0.2;
const TURN_SPEED = 0.85;

const phaseOf = (battle) => battle.bossPhase()?.id ?? null;
// Battle sprites are drawn at twice their size (as in battleScene.js).
const FOE_SCALE = 2;


// A soft round light.
function soft(ctx, x, y, r, rgb, a) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, `rgba(${rgb}, ${a.toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// The boy: seven drops of sea turning round him on a tilted ring, the far
// half behind him and the near half in front, each with a glint and a tail.
function orbit(ctx, cx, cy, t, side) {
  for (let i = 0; i < 7; i++) {
    const a = t * 0.9 + (i / 7) * Math.PI * 2;
    const front = Math.sin(a) > 0;
    if ((side === 'front') !== front) continue;
    const x = cx + Math.cos(a) * 54;
    const y = cy + Math.sin(a) * 12 - 10 + Math.sin(t * 2 + i) * 2;
    const r = front ? 2 : 1;
    for (let k = 1; k <= 3; k++) {
      const b = a - k * 0.09;
      ctx.fillStyle = `rgba(143, 240, 255, ${(0.3 - k * 0.08).toFixed(3)})`;
      ctx.fillRect(Math.round(cx + Math.cos(b) * 54), Math.round(cy + Math.sin(b) * 12 - 10), 2, 2);
    }
    ctx.fillStyle = front ? '#7fd4ee' : 'rgba(80, 170, 200, 0.8)';
    ctx.fillRect(Math.round(x - r), Math.round(y - r), r * 2, r * 2);
    ctx.fillStyle = front ? '#efffff' : '#a8e8f4';
    ctx.fillRect(Math.round(x - r + 1), Math.round(y - r), 1, 1);
  }
}

// The storm: a mass of cloud piled up at his back, rolling slowly, its edges
// lit green-white, and now and then a fork running down it and the whole of
// it lighting from inside.
function stormMass(ctx, cx, top, t) {
  const flash = (() => {
    const n = Math.floor(t / 2.6);
    const local = t - n * 2.6;
    // (The LIGHTNING FLASHES option dims it, or leaves it out.)
    return local < 0.5 ? (local < 0.08 ? 1 : 1 - local / 0.5) * (noise(n) > 0.3 ? 1 : 0.4) * flashScale() : 0;
  })();
  const puffs = [[-50, 30, 34, 22], [48, 26, 32, 22], [0, 4, 44, 26], [-30, -6, 26, 18], [30, -8, 28, 18], [-66, 62, 22, 18], [64, 58, 22, 18], [0, 40, 52, 24]];
  for (const [i, [dx, dy, rx, ry]] of puffs.entries()) {
    const x = cx + dx + Math.sin(t * 0.6 + i) * 3;
    const y = top + dy + Math.cos(t * 0.5 + i * 1.3) * 2;
    ctx.fillStyle = 'rgba(8, 22, 20, 0.9)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 2, ry + 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(22, 46, 40, 0.95)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${Math.round(70 + flash * 140)}, ${Math.round(124 + flash * 120)}, ${Math.round(100 + flash * 120)}, ${(0.55 + flash * 0.4).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x - rx * 0.15, y - ry * 0.25, rx * 0.8, ry * 0.6, 0, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
  }
  if (flash > 0.2) {
    // The fork: down from the cloud on one side or the other.
    const n = Math.floor(t / 2.6);
    const sx = cx + (noise(n + 5) > 0.5 ? 1 : -1) * (36 + noise(n + 9) * 30);
    ctx.strokeStyle = `rgba(236, 255, 220, ${flash.toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let px = sx;
    let py = top + 10;
    ctx.moveTo(px, py);
    for (let k = 0; k < 7; k++) {
      px += (noise(n * 13 + k) - 0.5) * 16;
      py += 12 + noise(n * 7 + k) * 6;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    soft(ctx, sx, top + 30, 60, '220, 255, 230', 0.3 * flash);
  }
}

// The storm's rain, slanting across in front of him.
function stormRain(ctx, cx, top, h, t) {
  ctx.strokeStyle = 'rgba(190, 236, 220, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 34; i++) {
    const span = h + 40;
    const y = top - 20 + ((noise(i) * span + t * (220 + noise(i + 40) * 60)) % span);
    const x = cx - 80 + noise(i + 80) * 160 - (y - top) * 0.3;
    ctx.moveTo(Math.round(x) + 0.5, Math.round(y));
    ctx.lineTo(Math.round(x - 3) + 0.5, Math.round(y - 9));
  }
  ctx.stroke();
}

// The whirlpool: a tilted ring of foam going round under him, with planks
// and a broken oar carried in it; the far half behind, the near half in front.
function whirlRing(ctx, cx, cy, t, side) {
  for (let i = 0; i < 44; i++) {
    const a = -t * 2.2 + (i / 44) * Math.PI * 2;
    const front = Math.sin(a) > 0;
    if ((side === 'front') !== front) continue;
    const r = 52 + Math.sin(i * 1.7) * 4;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * 13;
    ctx.fillStyle = i % 3 ? (front ? 'rgba(224, 248, 255, 0.85)' : 'rgba(160, 210, 225, 0.55)') : (front ? 'rgba(127, 212, 238, 0.8)' : 'rgba(60, 140, 170, 0.55)');
    ctx.fillRect(Math.round(x), Math.round(y), front ? 3 : 2, 2);
    if (front && i % 4 === 0) {
      ctx.fillStyle = 'rgba(224, 248, 255, 0.6)';
      ctx.fillRect(Math.round(x - 1), Math.round(y - 3 - ((t * 6 + i) % 3)), 1, 1);
    }
  }
  // The wreckage going round with it.
  for (let i = 0; i < 3; i++) {
    const a = -t * 2.2 * 0.8 + i * 2.1;
    const front = Math.sin(a) > 0;
    if ((side === 'front') !== front) continue;
    const x = cx + Math.cos(a) * 46;
    const y = cy + Math.sin(a) * 11 - 3;
    const turn = t * 3 + i;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(turn);
    ctx.fillStyle = '#6e553c';
    ctx.fillRect(-6, -1, 12, 3);
    ctx.fillStyle = '#a88a68';
    ctx.fillRect(-6, -1, 12, 1);
    if (i === 1) { ctx.fillStyle = '#6e553c'; ctx.fillRect(5, -2, 4, 5); }
    ctx.restore();
  }
}

// The lamp: the Last Light's beam coming down on him from above through the
// dark, warm, dust turning in it.
function lampBeam(ctx, cx, y, w, h, t) {
  const top = Math.max(0, y - 40);
  const g = ctx.createLinearGradient(0, top, 0, y + h);
  g.addColorStop(0, 'rgba(255, 228, 160, 0.26)');
  g.addColorStop(1, 'rgba(255, 228, 160, 0.04)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - 22, top);
  ctx.lineTo(cx + 30, top);
  ctx.lineTo(cx + w * 0.7, y + h);
  ctx.lineTo(cx - w * 0.6, y + h);
  ctx.closePath();
  ctx.fill();
  soft(ctx, cx, y + h * 0.4, 60, '255, 220, 150', 0.16 + 0.03 * Math.sin(t * 1.3));
  for (let i = 0; i < 14; i++) {
    const k = fract(noise(i) + t * (0.04 + noise(i + 20) * 0.04));
    const dy = top + k * (y + h - top);
    const spread = 22 + (dy - top) * 0.45;
    const dx = cx + (noise(i + 40) - 0.5) * 2 * spread + Math.sin(t + i) * 3;
    ctx.fillStyle = `rgba(255, 240, 200, ${(0.5 * Math.sin(k * Math.PI)).toFixed(3)})`;
    ctx.fillRect(Math.round(dx), Math.round(dy), 1, 1);
  }
}

export const CORRIE_STAGE = {
  start(battle, foe) {
    const keep = battle.stageState ?? {};
    return { tide: TIDE_START, hinted: keep.hinted ?? false, turnFrom: battle.time };
  },

  // Once a turn, as his attack starts: the sea the attack is to have.
  sea(battle, soothed) {
    const state = battle.stageState;
    if (!state) return null;
    switch (phaseOf(battle)) {
      case 'storm': {
        const sea = { level: state.tide, rise: soothed ? 0 : 9, soothed, first: !state.hinted };
        state.hinted = true;
        state.tide = soothed ? 0 : Math.min(TIDE_MAX, state.tide + TIDE_STEP);
        return sea;
      }
      case 'whirlpool':
        return { pull: soothed ? 0.45 : 1, soothed };
      default:
        return { soothed };
    }
  },

  // Beaten (after the battle's own finale bursts): the storm goes out of
  // him. Spray falls away, a last ripple spreads over the water, and the
  // glow lifts off him in motes. He stays (his beatenSprite).
  leave(battle, foe, how) {
    if (how !== 'defeated') return;
    const { x, y } = foe.center;
    battle.bits.ring(x, y + 40, { squash: 0.25, speed: 120, color: '#7fd4ee', width: 2, life: 1.2 });
    battle.bits.ring(x, y + 40, { squash: 0.25, speed: 70, color: '#d8f6ff', life: 1.4 });
    battle.bits.scatter(x, y, 24, ['#7fd4ee', '#d8f6ff', '#3c8cc0'], { speed: 90, up: 40, gravity: 160, life: 1.3 });
    for (let i = 0; i < 16; i++) battle.bits.mote(x + (Math.random() - 0.5) * 50, y + Math.random() * 30, { vy: -14 - Math.random() * 22, color: i % 2 ? '#8ff0ff' : '#efffff' });
  },

  boxTurn(battle) {
    if (phaseOf(battle) !== 'whirlpool' || battle.phase !== 'dodge') return 0;
    // (It eases in as the box opens.)
    const ease = Math.min(1, battle.dodgeTime / 0.8);
    return TURN * ease * Math.sin(battle.dodgeTime * TURN_SPEED * Math.PI);
  },

  // Behind him, so each phase reads as a boss and not just a boy: the sea's
  // glow and the drops he keeps turning round him (the boy); the storm itself
  // piled up at his back, lightning running in it (the storm); the sea going
  // round under him with spray and wreckage (the whirlpool); the Last Light's
  // beam falling on him through the dark (the lamp). Then the battle draws him.
  drawFoe(ctx, battle, foe, x, y, w, h) {
    if (foe.state !== 'active') return false;
    const id = phaseOf(battle);
    const t = battle.time;
    const cx = x + w / 2;
    const cy = y + h * 0.5;
    ctx.save();
    if (id === 'boy') {
      soft(ctx, cx, cy, 84, '120, 220, 240', 0.24 + 0.05 * Math.sin(t * 1.7));
      orbit(ctx, cx, y + h * 0.62, t, 'back');
    } else if (id === 'storm') {
      stormMass(ctx, cx, y + 14, t);
    } else if (id === 'whirlpool') {
      soft(ctx, cx, y + h * 0.75, 70, '60, 150, 180', 0.2);
      whirlRing(ctx, cx, y + h * 0.8, t, 'back');
    } else if (id === 'lamp') {
      lampBeam(ctx, cx, y, w, h, t);
    }
    ctx.restore();
    return false;
  },

  // In front of him: the near half of what goes round him, the storm's rain.
  drawOver(ctx, battle) {
    const foe = battle.phased;
    if (!foe || foe.state !== 'active') return;
    const id = phaseOf(battle);
    const t = battle.time;
    const w = foe.sprite.width * FOE_SCALE;
    const h = foe.sprite.height * FOE_SCALE;
    const cx = foe.pos.x + w / 2;
    ctx.save();
    if (id === 'boy') orbit(ctx, cx, foe.pos.y + h * 0.62, t, 'front');
    else if (id === 'whirlpool') whirlRing(ctx, cx, foe.pos.y + h * 0.8, t, 'front');
    else if (id === 'storm') stormRain(ctx, cx, foe.pos.y, h, t);
    ctx.restore();
  },

  // Over the backdrop: the storm darkens the room; the lamp warms it.
  drawBack(ctx, battle) {
    const id = phaseOf(battle);
    const { width } = ctx.canvas;
    if (id === 'storm' || id === 'whirlpool') {
      ctx.fillStyle = id === 'storm' ? 'rgba(2, 16, 14, 0.32)' : 'rgba(2, 10, 18, 0.28)';
      ctx.fillRect(0, 0, width, hud.STAGE_HEIGHT);
    } else if (id === 'lamp') {
      ctx.fillStyle = 'rgba(255, 228, 160, 0.07)';
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
    if (id === 'storm') {
      const sky = ctx.createLinearGradient(0, r.y, 0, r.y + r.h);
      sky.addColorStop(0, '#071512');
      sky.addColorStop(1, '#10261f');
      ctx.fillStyle = sky;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // Clouds rolling past, and a flash when lightning's down.
      for (let i = 0; i < 6; i++) {
        const x = r.x + ((i * 61 + t * (14 + i * 3)) % (r.w + 80)) - 40;
        const y = r.y + 10 + ((i * 37) % (r.h - 30));
        ctx.fillStyle = i % 2 ? 'rgba(40, 70, 58, 0.45)' : 'rgba(24, 48, 40, 0.5)';
        ctx.beginPath();
        ctx.ellipse(x, y, 34, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (battle.bullets.some((b) => b.points && b.active)) {
        ctx.fillStyle = 'rgba(220, 255, 230, 0.16)';
        ctx.fillRect(r.x, r.y, r.w, r.h);
      }
    } else if (id === 'whirlpool') {
      ctx.fillStyle = '#03121a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // The whirlpool's arms, turning in toward the eye.
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      for (let arm = 0; arm < 4; arm++) {
        for (let k = 0; k < 60; k++) {
          const rr = 6 + k * 1.9;
          const a = arm * (Math.PI / 2) + rr * 0.045 - t * 1.6;
          ctx.fillStyle = k % 3 ? 'rgba(30, 90, 110, 0.55)' : 'rgba(80, 160, 170, 0.45)';
          ctx.fillRect(Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), 3, 3);
        }
      }
    } else if (id === 'lamp') {
      ctx.fillStyle = '#0b0906';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // The tower's stones, faint.
      ctx.fillStyle = 'rgba(70, 60, 44, 0.35)';
      for (let y = r.y + 10; y < r.y + r.h; y += 20) {
        ctx.fillRect(r.x, y, r.w, 2);
        for (let x = r.x + ((y / 20) % 2 ? 0 : 24); x < r.x + r.w; x += 48) ctx.fillRect(x, y - 18, 2, 18);
      }
    } else {
      ctx.fillStyle = '#01040a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      // The sea at night: bubbles rising slowly.
      ctx.fillStyle = 'rgba(127, 212, 238, 0.25)';
      for (let i = 0; i < 9; i++) {
        const x = r.x + 10 + ((i * 47) % (r.w - 20));
        const y = r.y + r.h - ((t * (10 + (i % 3) * 4) + i * 29) % r.h);
        ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      }
    }
    ctx.restore();
    return true;
  },
};
