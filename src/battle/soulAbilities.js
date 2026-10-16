import { UI_SCALE as S } from '../config.js';
import { soulSprite } from './soul.js';

// Soul abilities come from the equipped weapon and are used with SHIFT while
// dodging. Positions are in world units; draw functions run in UI space.
//
// Every ability has:
//   name      shown under the box
//   hint      shown the first time you dodge with it
//   cooldown  seconds before it can be used again
//   duration  seconds it stays active once used (0 for instant)
// and any of these optional parts:
//   hold                          true if it works while SHIFT is held, instead of on a press
//   charges                       uses per enemy turn
//   activate(battle, input)       runs on use; return false if it fizzled
//   beforeMove(battle, input, dt) runs every frame, before the soul moves
//   update(battle, dt)            runs every frame while active
//   tick(battle, dt)              runs every frame of the enemy's turn
//   bulletTimeScale(battle, b)    while active, how fast bullet b moves (1 = normal)
//   draw(ctx, battle, left)       while active, `left` seconds remaining
//   drawAlways(ctx, battle)       every frame of the enemy's turn
//
// battle.abilityState is an empty object at the start of each enemy turn, for
// an ability to keep its own state in.

const BLOCK_RADIUS = 13;
// After a perfect parry the blade is ready again this quickly.
const PERFECT_PARRY_RECHARGE = 0.6;
const PARRY_RADIUS = 11;
const PERFECT_PARRY_GAP = 5;
const PERFECT_PARRY_SP = 3;
const LUNGE_SPEED = 200;
const ARROW_SPEED = 220;
const QUAKE_RADIUS = 22;
const LIGHT_RADIUS = 24;
const LIGHT_SLOWDOWN = 0.3;
const REFLECT_RANGE = 20;
const REFLECT_DAMAGE = 3;
const RECALL_SP = 20;
const RECALL_HP = 12;

function axis(input, negative, positive) {
  return (input.isDown(positive) ? 1 : 0) - (input.isDown(negative) ? 1 : 0);
}

// Destroys every bullet within `radius` of (x, y). Returns how many, and how close the closest was.
function destroyWithin(battle, x, y, radius) {
  let count = 0;
  let closest = Infinity;
  battle.bullets = battle.bullets.filter((bullet) => {
    const gap = bullet.edgeDistance(x, y);
    if (gap > radius) return true;
    closest = Math.min(closest, gap);
    count++;
    battle.onBlocked(bullet);
    return false;
  });
  return { count, closest };
}

function circle(ctx, x, y, radius, { stroke = null, fill = null, width = 3, alpha = 1 } = {}) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.beginPath();
  ctx.arc(x * S, y * S, radius * S, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export const SOUL_ABILITIES = {
  // Old Shield: a barrier around the soul destroys any bullet that touches it.
  block: {
    name: 'BLOCK',
    hint: 'Press SHIFT to raise your shield and block bullets.',
    cooldown: 3,
    duration: 0.6,
    update(battle) {
      destroyWithin(battle, battle.soul.x, battle.soul.y, BLOCK_RADIUS);
    },
    draw(ctx, battle, left) {
      circle(ctx, battle.soul.x, battle.soul.y, BLOCK_RADIUS, {
        stroke: '#4fe3d0',
        fill: 'rgba(79, 227, 208, 0.15)',
        alpha: left / 0.15,
      });
    },
  },

  // Duelist's Blade: a quick slash. Catch a bullet just before it hits to recharge instantly.
  parry: {
    name: 'PARRY',
    hint: 'Press SHIFT to slash. Parry a bullet just before it hits to recharge instantly.',
    cooldown: 2,
    duration: 0.2,
    activate(battle) {
      battle.abilityState.perfect = false;
    },
    update(battle) {
      const { soul, abilityState } = battle;
      const { count, closest } = destroyWithin(battle, soul.x, soul.y, PARRY_RADIUS);
      if (count && closest < PERFECT_PARRY_GAP && !abilityState.perfect) {
        abilityState.perfect = true;
        battle.abilityCooldown = PERFECT_PARRY_RECHARGE;
        battle.gainSp(PERFECT_PARRY_SP);
        battle.addPopup('PARRY!', soul.x, soul.y - 14, '#ffe14d');
      }
    },
    draw(ctx, battle, left) {
      const progress = 1 - left / 0.2;
      const start = Math.PI * 1.1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(battle.soul.x * S, battle.soul.y * S, PARRY_RADIUS * S, start, start + Math.PI * 0.8 * progress);
      ctx.stroke();
    },
  },

  // Ash Spear: dash in the direction you're moving. Nothing can hurt you mid-dash.
  lunge: {
    name: 'LUNGE',
    hint: "Press SHIFT to dash the way you're moving. You can't be hurt mid-dash.",
    cooldown: 1.8,
    duration: 0.15,
    activate(battle, input) {
      const dx = axis(input, 'left', 'right');
      const dy = axis(input, 'up', 'down');
      const length = Math.hypot(dx, dy);
      battle.abilityState.direction = length ? { x: dx / length, y: dy / length } : { x: 0, y: -1 };
      battle.abilityState.trail = [];
      battle.soul.untouchable = 0.16;
    },
    update(battle, dt) {
      const { soul, abilityState } = battle;
      abilityState.trail.push({ x: soul.x, y: soul.y });
      soul.x += abilityState.direction.x * LUNGE_SPEED * dt;
      soul.y += abilityState.direction.y * LUNGE_SPEED * dt;
      soul.clampTo(battle.box);
    },
    draw(ctx, battle) {
      const sprite = soulSprite(battle.soul.modeName);
      battle.abilityState.trail.forEach((point, i, trail) => {
        ctx.globalAlpha = 0.4 * ((i + 1) / trail.length);
        ctx.drawImage(sprite, Math.round(point.x * S) - 8, Math.round(point.y * S) - 8);
      });
      ctx.globalAlpha = 1;
    },
  },

  // Hunting Bow: fire arrows straight up that break the first bullet they hit.
  shoot: {
    name: 'SHOOT',
    hint: 'Press SHIFT to fire an arrow upward. It breaks the first bullet it hits. 3 arrows per turn.',
    cooldown: 0.35,
    duration: 0,
    charges: 3,
    activate(battle) {
      battle.abilityState.arrows ??= [];
      battle.abilityState.arrows.push({ x: battle.soul.x, y: battle.soul.y - 4 });
    },
    tick(battle, dt) {
      const arrows = battle.abilityState.arrows ?? [];
      battle.abilityState.arrows = arrows.filter((arrow) => {
        arrow.y -= ARROW_SPEED * dt;
        const hit = battle.bullets.find((bullet) => bullet.edgeDistance(arrow.x, arrow.y) < 2);
        if (hit) {
          battle.bullets = battle.bullets.filter((bullet) => bullet !== hit);
          battle.onBlocked(hit);
          return false;
        }
        return arrow.y > battle.box.y - 6;
      });
    },
    drawAlways(ctx, battle) {
      for (const arrow of battle.abilityState.arrows ?? []) {
        const x = Math.round(arrow.x * S);
        const y = Math.round(arrow.y * S);
        ctx.fillStyle = '#c9a26b';
        ctx.fillRect(x - 1, y, 2, 14);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y - 2, 4, 3);
      }
    },
  },

  // Oak Staff: hold to stand still and channel. Grazing builds SP three times as fast.
  channel: {
    name: 'CHANNEL',
    hint: 'Hold SHIFT to channel: you stand still, but grazing builds SP three times as fast.',
    cooldown: 0,
    duration: 0,
    hold: true,
    beforeMove(battle, input) {
      const channeling = input.isDown('ability');
      battle.soul.locked = channeling;
      battle.grazeMultiplier = channeling ? 3 : 1;
      battle.abilityState.channeling = channeling;
    },
    drawAlways(ctx, battle) {
      if (!battle.abilityState.channeling) return;
      const pulse = 0.5 + 0.5 * Math.sin(battle.time * 10);
      circle(ctx, battle.soul.x, battle.soul.y, 9 + pulse * 2, { stroke: '#b07cff', width: 2, alpha: 0.8 });
    },
  },

  // Stone Hammer: slam the ground, clearing the bullets closest to you.
  quake: {
    name: 'QUAKE',
    hint: 'Press SHIFT to slam the ground and clear the bullets closest to you. Slow to recharge.',
    cooldown: 7,
    duration: 0.35,
    activate(battle) {
      destroyWithin(battle, battle.soul.x, battle.soul.y, QUAKE_RADIUS);
      battle.shake = 0.2;
    },
    draw(ctx, battle, left) {
      const progress = 1 - left / 0.35;
      circle(ctx, battle.soul.x, battle.soul.y, QUAKE_RADIUS * progress, { stroke: '#ffb347', width: 6 * (1 - progress) + 1 });
    },
  },

  // Spare Lantern: leave a pool of light where bullets crawl.
  light: {
    name: 'LIGHT',
    hint: 'Press SHIFT to leave a pool of light. Bullets inside it slow to a crawl.',
    cooldown: 7,
    duration: 3,
    activate(battle) {
      battle.abilityState.light = { x: battle.soul.x, y: battle.soul.y };
    },
    bulletTimeScale(battle, bullet) {
      const { light } = battle.abilityState;
      return Math.hypot(bullet.x - light.x, bullet.y - light.y) < LIGHT_RADIUS ? LIGHT_SLOWDOWN : 1;
    },
    draw(ctx, battle, left) {
      const { light } = battle.abilityState;
      const x = light.x * S;
      const y = light.y * S;
      const radius = LIGHT_RADIUS * S;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, 'rgba(255, 204, 102, 0.35)');
      glow.addColorStop(1, 'rgba(255, 204, 102, 0.08)');
      ctx.globalAlpha = Math.min(1, left / 0.4);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      circle(ctx, light.x, light.y, LIGHT_RADIUS, { stroke: '#ffcc66', width: 2, alpha: Math.min(1, left / 0.4) * 0.7 });
    },
  },

  // Glass Dagger: blink to the opposite side of the box.
  phase: {
    name: 'PHASE',
    hint: 'Press SHIFT to blink to the opposite side of the box.',
    cooldown: 3,
    duration: 0.3,
    activate(battle) {
      const { soul, box } = battle;
      battle.abilityState.from = { x: soul.x, y: soul.y };
      soul.x = 2 * (box.x + box.w / 2) - soul.x;
      soul.y = 2 * (box.y + box.h / 2) - soul.y;
      soul.clampTo(box);
      soul.untouchable = 0.2;
    },
    draw(ctx, battle, left) {
      const fade = left / 0.3;
      const { from } = battle.abilityState;
      circle(ctx, from.x, from.y, 10 * fade, { stroke: '#c9b8ff', width: 2, alpha: fade });
      circle(ctx, battle.soul.x, battle.soul.y, 12 * (1 - fade) + 4, { stroke: '#ffffff', width: 2, alpha: fade });
    },
  },

  // Iron Gauntlets: punch the nearest bullet back at the enemy for damage.
  reflect: {
    name: 'REFLECT',
    hint: 'Press SHIFT to punch the nearest bullet back at the enemy. It has to be close!',
    cooldown: 1.5,
    duration: 0.2,
    activate(battle) {
      const { soul } = battle;
      let nearest = null;
      let nearestGap = REFLECT_RANGE;
      for (const bullet of battle.bullets) {
        const gap = bullet.edgeDistance(soul.x, soul.y);
        if (gap < nearestGap) {
          nearest = bullet;
          nearestGap = gap;
        }
      }
      if (!nearest) return false;
      battle.bullets = battle.bullets.filter((bullet) => bullet !== nearest);
      battle.onBlocked(nearest);
      battle.abilityState.punch = { x: nearest.x, y: nearest.y };
      battle.damageEnemy(REFLECT_DAMAGE);
      return true;
    },
    draw(ctx, battle, left) {
      const { punch } = battle.abilityState;
      ctx.globalAlpha = left / 0.2;
      ctx.strokeStyle = '#ff8c1a';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(battle.soul.x * S, battle.soul.y * S);
      ctx.lineTo(punch.x * S, punch.y * S);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
  },

  // Chapel Bell: one ring freezes every bullet for a moment.
  toll: {
    name: 'TOLL',
    hint: 'Press SHIFT to ring the bell and freeze every bullet for a moment.',
    cooldown: 8,
    duration: 0.4,
    bulletTimeScale() {
      return 0;
    },
    draw(ctx, battle, left) {
      const progress = 1 - left / 0.4;
      for (const offset of [0, 0.3]) {
        const p = Math.min(1, progress + offset);
        circle(ctx, battle.soul.x, battle.soul.y, 6 + p * 40, { stroke: '#ffe14d', width: 2, alpha: 1 - p });
      }
    },
  },

  // Old Tome: turn spell power into health on the spot.
  recall: {
    name: 'RECALL',
    hint: `Press SHIFT to spend ${RECALL_SP}% SP and heal ${RECALL_HP} HP, right in the middle of an attack.`,
    cooldown: 2,
    duration: 0.4,
    activate(battle) {
      if (battle.sp < RECALL_SP) {
        battle.addPopup(`NEED ${RECALL_SP}% SP`, battle.soul.x, battle.soul.y - 14, '#7d7590');
        return false;
      }
      battle.sp -= RECALL_SP;
      battle.healHero(RECALL_HP);
      return true;
    },
    draw(ctx, battle, left) {
      circle(ctx, battle.soul.x, battle.soul.y, 6 + (1 - left / 0.4) * 10, { stroke: '#5ef08a', width: 2, alpha: left / 0.4 });
    },
  },
};
