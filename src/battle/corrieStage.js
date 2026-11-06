import * as hud from './hud.js';

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
