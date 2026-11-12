// The little touches that make every fight feel better, whoever it's against:
// a short hold when a blow lands, a squash on the enemy, sparks where it was
// struck, damage numbers that pop and bounce (gold on a PERFECT), shakes
// sized to the hit, HP bars that drain behind a pale "ghost", sparks off the
// shadow when it grazes, a jolt of the box border when it's hurt, a beat as
// the shadow appears, dust as a beaten enemy fades, and the EXP and gold
// counting up when you win. battleScene.js calls in here with a line or two
// at each spot.
//
// Only how it looks. Nothing here touches bullets, damage, HP, hitboxes or
// how long the shadow can't be hurt; the one hold (hitStop) happens on your
// own turn, after the strike bar is done, while no bullet is in the air.
// Screen shake follows the SCREEN SHAKE setting, and the brightest thing
// here (the shadow's white blink when hurt) dims with LIGHTNING FLASHES.

import { UI_SCALE as S, UI_WIDTH } from '../config.js';
import { drawText } from '../ui/text.js';
import { SETTINGS, flashScale } from '../state/settings.js';
import * as hud from './hud.js';
import { sfx } from '../audio/music.js';

const SCALE = 2;
// Its own little random source, so none of this shifts the dice the attacks,
// damage and drops roll, or the seeded attack checks (as in foeFeel.js).
let seed = 0xfee1;
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rand = (a, b) => a + random() * (b - a);
const pick = (list) => list[Math.floor(random() * list.length)];

// A blow's hold (seconds): long enough to feel, too short to notice as a pause.
const HOLD_SECONDS = 0.05;
const PERFECT_HOLD_SECONDS = 0.085;
// A strike-bar slash this close to the notch is a PERFECT (as in strikeBar.js).
const PERFECT_CLOSENESS = 0.85;
// The enemy's squash when struck.
const SQUASH_SECONDS = 0.32;
const SQUASH = 0.14;
const BOSS_SQUASH = 0.06;
// The ghost behind an HP bar: it holds a moment, then drains down to the real one.
const GHOST_HOLD_SECONDS = 0.35;
const GHOST_COLOR = '#fff2b0';
// The box border's jolt when the shadow is hurt.
const JOLT_SECONDS = 0.22;
// The ring that closes on the shadow as the box opens.
const READY_SECONDS = 0.32;
// Damage numbers: how long the pop takes, and how high they hop.
const POP_SECONDS = 0.14;
const HOP = 14;
// The EXP and gold counting up over the party when you win.
const COUNT_SECONDS = 1.7;
const COUNT_UP_SECONDS = 0.7;
// Low on HP (under this share, the same as the bar going red in hud.js):
// the bar throbs, slowly, and while you dodge a soft heartbeat ticks this
// often. The LOW HP WARNING option turns the beat (QUIET) or both (OFF) off.
const LOW_HP_SHARE = 0.3;
// A blow this big a share of the enemy's whole HP holds and lands like a PERFECT.
const BIG_HIT_SHARE = 0.08;
const BIG_HOLD_SECONDS = 0.075;
// The PERFECT's gold flash, and the stage's nudge the way the blow went.
const CRIT_FLASH_SECONDS = 0.14;
const NUDGE_SECONDS = 0.16;
const NUDGE = 3;
// The encore: as a monster's second attack of the turn comes in, the box
// border swells out once in its colour.
const ENCORE_SECONDS = 0.4;
// Worn down: under WINCE_SHARE of its HP a monster winces now and then (its
// hurt clip); under PANT_SHARE it pants and sweats.
const WINCE_SHARE = 0.5;
const PANT_SHARE = 0.3;
const LOW_HP_THROB_SECONDS = 1.1;
const HEARTBEAT_SECONDS = 1.1;

// ---------- your blow lands ----------

// Called from resolveStrike once the damage is dealt and its number is up.
// A FIGHT holds for a beat (longer on a PERFECT), the stage gives a little
// kick, sparks fly off where the slash met it, and the number goes gold if
// a slash was PERFECT.
export function strikeLanded(battle, foe, damage, kind) {
  if (!damage) return;
  const perfect = kind === 'fight' && Boolean(battle.strike?.slashes?.some((slash) => slash.closeness > PERFECT_CLOSENESS));
  const allPerfect = perfect && battle.strike.slashes.every((slash) => slash.closeness > PERFECT_CLOSENESS);
  // A big blow (a good share of its HP, a spell's as much as a FIGHT's)
  // holds longer and lands bigger: with the chapter 5 monsters' long HP
  // bars, the hits that matter should feel like it.
  const big = foe?.maxHp ? damage >= foe.maxHp * BIG_HIT_SHARE : false;
  const popup = battle.popups[battle.popups.length - 1];
  if (popup) {
    popup.hop = true;
    popup.crit = perfect;
    popup.big = big;
  }
  if (kind === 'fight') battle.hitStop = Math.max(battle.hitStop, perfect ? PERFECT_HOLD_SECONDS : HOLD_SECONDS);
  if (big) battle.hitStop = Math.max(battle.hitStop, BIG_HOLD_SECONDS);
  kick(battle, perfect || big ? 4 : 2.5, perfect || big ? 0.16 : 0.1);
  impactSparks(battle, foe, perfect || big, allPerfect);
  // A PERFECT: a soft gold flash over the stage (dimmed by LIGHTNING
  // FLASHES), and the stage nudged a step the way the blow went (none with
  // SCREEN SHAKE off).
  if (perfect) {
    battle.critFlashAt = battle.time;
    battle.nudgeAt = battle.time;
  }
}

// In world space, over the stage: the PERFECT's gold flash, fading.
export function drawCritFlash(ctx, battle) {
  const t = battle.time - (battle.critFlashAt ?? -9);
  if (t < 0 || t > CRIT_FLASH_SECONDS) return;
  const a = 0.24 * flashScale() * (1 - t / CRIT_FLASH_SECONDS);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#fff1b8';
  ctx.fillRect(0, 0, UI_WIDTH / S, hud.STAGE_HEIGHT);
  ctx.restore();
}

// Sparks where the slash crosses it (the crescent's middle, a little up
// and left of centre), flying away from the party.
function impactSparks(battle, foe, perfect, allPerfect) {
  const x = foe.center.x - 6 + rand(-3, 3);
  const y = foe.center.y - 4 + rand(-3, 3);
  const color = battle.striker?.ally ? battle.striker.color : '#ffffff';
  battle.bits.star(x, y, { size: perfect ? 16 : 10, life: perfect ? 0.2 : 0.14 });
  for (let i = 0; i < (perfect ? 9 : 5); i++) {
    const a = rand(-1.1, 1.1);
    const v = rand(90, perfect ? 220 : 160);
    battle.bits.spark(x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, gravity: 260, life: rand(0.18, 0.34), color: i % 3 ? color : perfect ? hud.COLORS.yellow : '#ffffff', size: random() < 0.4 ? 2 : 1 });
  }
  if (perfect) battle.bits.ring(x, y, { speed: 120, life: 0.22, color: hud.COLORS.yellow, width: 1 });
  if (allPerfect) battle.bits.ring(x, y, { speed: 190, life: 0.3, color: '#ffffff', width: 2 });
}

// ---------- shakes sized to the hit ----------

// A shake `size` UI pixels across (side to side, and up and down), for
// `seconds`. Without one, the stage's shake is the usual 4.
export function kick(battle, size, seconds) {
  battle.shake = Math.max(battle.shake, seconds);
  battle.shakeSize = { size, until: battle.time + seconds };
}

// How far across the stage shakes this frame (0 with SCREEN SHAKE off).
export function shakeOffset(battle) {
  if (!SETTINGS.shake) return null;
  // (A PERFECT's nudge: pushed a step right, the way the blow went, easing back.)
  const n = battle.time - (battle.nudgeAt ?? -9);
  const nudge = n >= 0 && n < NUDGE_SECONDS ? Math.round(NUDGE * (1 - n / NUDGE_SECONDS)) : 0;
  if (battle.shake <= 0) return nudge ? { x: nudge, y: 0 } : null;
  const size = battle.shakeSize && battle.time < battle.shakeSize.until ? battle.shakeSize.size : 4;
  return { x: Math.round((random() - 0.5) * size) + nudge, y: Math.round((random() - 0.5) * size) };
}

// ---------- the shadow is hurt ----------

// Called from hurt(): a shake as big as the hit is (out of the victim's HP),
// the box border jolts, and the shadow blinks white with a ring going out.
export function shadowHurt(battle, victim, damage) {
  const share = victim?.maxHp ? damage / victim.maxHp : 0.1;
  // (Kept near the usual shake at most: the bullets shake with the stage
  // while you dodge. A graze of a hit is smaller, a heavy one longer.)
  kick(battle, Math.min(5, 2 + share * 12), Math.min(0.32, 0.2 + share * 0.5));
  battle.joltAt = battle.time;
  battle.soul.hurtGlow = 0.28;
  battle.soul.hurtScale = hurtBlinkScale();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rand(-0.3, 0.3);
    battle.sparks.push({ x: battle.soul.x, y: battle.soul.y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, life: 0.3, color: hud.COLORS.danger });
  }
}

// How far the box border is jolted (UI pixels), or 0.
export function borderJolt(battle) {
  const t = battle.time - (battle.joltAt ?? -9);
  if (t < 0 || t >= JOLT_SECONDS || !SETTINGS.shake) return 0;
  return Math.round(Math.sin(t * 70) * 3 * (1 - t / JOLT_SECONDS));
}

// How bright the shadow's white hurt blink may go.
export const hurtBlinkScale = () => Math.max(0.35, flashScale());

// ---------- grazing ----------

// Called on a fresh graze: sparks skip off the side of the shadow the bullet
// passed, flying on the way it was going, and the SP gauge ticks.
export function grazed(battle, bullet) {
  const soul = battle.soul;
  const dx = soul.x - bullet.x;
  const dy = soul.y - bullet.y;
  const len = Math.hypot(dx, dy) || 1;
  // The edge of the shadow nearest the bullet.
  const ex = soul.x - (dx / len) * 4;
  const ey = soul.y - (dy / len) * 4;
  // Across the line between them, either way: they skate off.
  const side = random() < 0.5 ? 1 : -1;
  for (let i = 0; i < 3; i++) {
    const v = rand(50, 90);
    battle.sparks.push({ x: ex, y: ey, vx: (-dy / len) * v * side + (-dx / len) * 20, vy: (dx / len) * v * side + (-dy / len) * 20, life: rand(0.2, 0.32), color: i ? '#ffffff' : hud.COLORS.sp });
  }
  battle.spTickAt = battle.time;
}

// Over the SP gauge, after it's drawn: a bright line at the top of the fill
// for a moment after a graze.
export function drawSpTick(ctx, battle) {
  const t = battle.time - (battle.spTickAt ?? -9);
  if (t < 0 || t > 0.25) return;
  const { x, y, w, h } = hud.SP_GAUGE;
  const filled = Math.round((h * Math.min(100, battle.sp)) / 100);
  ctx.globalAlpha = 1 - t / 0.25;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 3, y + h - filled - 1, w + 6, 2);
  ctx.globalAlpha = 1;
}

// ---------- the enemy ----------

// Its squash when struck, and a slow breath while it stands there (only an
// enemy with no idle clip of its own, and not a `still` statue). Returns the
// size and place to draw it at, from the usual ones, its feet kept where they are.
export function foePose(battle, foe, x, y, w, h) {
  let sx = 1;
  let sy = 1;
  const t = battle.time - (foe.hitAt ?? -9);
  if (t >= 0 && t < SQUASH_SECONDS) {
    const k = 1 - t / SQUASH_SECONDS;
    // Flattened first, then springing up past and back.
    const s = Math.cos(t * 26) * k * k * (foe.data.boss ? BOSS_SQUASH : SQUASH) * (foe.data.still ? 0.4 : 1);
    sx += s;
    sy -= s;
  } else if (foe.state === 'active' && !foe.data.still && foe.maxHp && foe.hp < foe.maxHp * PANT_SHARE) {
    // Worn down: quicker, deeper breaths, idle clip or not.
    const b = Math.sin(battle.time * 5.5 + foe.pos.x * 0.37) * 0.03;
    sy += b;
    sx -= b * 0.5;
  } else if (foe.state === 'active' && !foe.data.still && !foe.anim?.idle) {
    const b = Math.sin(battle.time * 2.2 + foe.pos.x * 0.37) * 0.018;
    sy += b;
    sx -= b * 0.5;
  }
  if (sx === 1 && sy === 1) return { x, y, w, h };
  const nw = Math.round(w * sx);
  const nh = Math.round(h * sy);
  return { x: x + Math.round((w - nw) / 2), y: y + (h - nh), w: nw, h: nh };
}

// Every frame (from update): HP ghosts, a spared enemy's farewell, and
// dust rising off a beaten one as it fades.
export function feelUpdate(battle, dt) {
  for (const foe of battle.foes) {
    ghost(foe, battle.time, dt);
    if (foe.feltState !== foe.state) {
      if (foe.feltState === 'active' && foe.state === 'pacified' && !foe.data.boss) spared(battle, foe);
      foe.feltState = foe.state;
    }
    if (foe.state === 'defeated') fadeDust(battle, foe, dt);
    if (foe.state === 'active') worn(battle, foe, dt);
  }
  for (const member of battle.party ?? []) ghost(member, battle.time, dt);
  heartbeat(battle, dt);
}

// A monster worn down shows it. Under half its HP it winces now and then
// (its hurt clip plays: battleScene's animFrame reads `winceAt`); under
// PANT_SHARE it pants (foePose) and a bead of sweat flies off it. The long
// chapter 5 fights need the enemy to look like it's losing.
function worn(battle, foe, dt) {
  if (!foe.maxHp || foe.data.still) return;
  const share = foe.hp / foe.maxHp;
  if (share >= WINCE_SHARE) return;
  foe.winceIn = (foe.winceIn ?? rand(1.5, 3)) - dt;
  if (foe.winceIn <= 0) {
    foe.winceIn = share < PANT_SHARE ? rand(2.2, 3.4) : rand(3.5, 5.5);
    // (Not over its own attack's windup or a hit's flinch.)
    if (battle.time - (foe.attackAt ?? -9) > 1 && battle.time - (foe.hitAt ?? -9) > 1) foe.winceAt = battle.time;
  }
  if (share >= PANT_SHARE || !foe.sprite) return;
  foe.sweatIn = (foe.sweatIn ?? rand(0.4, 1.2)) - dt;
  if (foe.sweatIn > 0) return;
  foe.sweatIn = rand(1.1, 1.9);
  const w = foe.sprite.width * SCALE;
  const side = random() < 0.5 ? -1 : 1;
  const x = foe.pos.x + w / 2 + side * w * rand(0.2, 0.32);
  const y = foe.pos.y + foe.sprite.height * SCALE * rand(0.12, 0.25);
  const vx = side * rand(18, 32);
  // A drop: a bright head and a paler pixel trailing it.
  battle.bits.spark(x, y, { vx, vy: -rand(40, 60), gravity: 240, life: 0.6, color: '#d8f4ff', size: 2 });
  battle.bits.spark(x - side, y + 1, { vx, vy: -rand(40, 60) + 8, gravity: 240, life: 0.5, color: '#7cc8e8', size: 1 });
}

// As an encore or layered attack comes in: the box swells out once.
export function encoreBeat(battle, foe) {
  battle.encoreAt = battle.time;
  battle.encoreColor = foe?.data?.feel?.color ?? hud.COLORS.yellow;
}

// In UI space, round the box: the encore's swell, an outline going out and fading.
export function drawEncore(ctx, battle) {
  const t = battle.time - (battle.encoreAt ?? -9);
  if (t < 0 || t > ENCORE_SECONDS) return;
  const k = t / ENCORE_SECONDS;
  const r = hud.boxRect();
  const grow = Math.round(4 + k * 14);
  ctx.save();
  ctx.globalAlpha = 0.8 * (1 - k);
  ctx.strokeStyle = battle.encoreColor ?? '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x - grow, r.y - grow, r.w + grow * 2, r.h + grow * 2);
  ctx.restore();
}

// While you dodge with little HP left, a soft heartbeat (never on a fall).
function heartbeat(battle, dt) {
  const hero = battle.hero;
  const low = SETTINGS.lowHp === 'on' && battle.phase === 'dodge' && hero?.maxHp && hero.hp > 0 && hero.hp / hero.maxHp < LOW_HP_SHARE;
  if (!low) {
    battle.heartbeatIn = 0.3;
    return;
  }
  battle.heartbeatIn = (battle.heartbeatIn ?? 0.3) - dt;
  if (battle.heartbeatIn > 0) return;
  battle.heartbeatIn = HEARTBEAT_SECONDS;
  sfx('heartbeat');
}

// Over the party card's HP bar, when it's low: a slow, soft throb of light,
// and a faint red edge round the card.
export function drawLowHp(ctx, member) {
  if (SETTINGS.lowHp === 'off' || !member?.maxHp || member.hp <= 0 || member.hp / member.maxHp >= LOW_HP_SHARE) return;
  const t = (performance.now() / 1000 / LOW_HP_THROB_SECONDS) % 1;
  // Quick to swell, slow to fade, like a beat.
  const throb = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / 0.6);
  const { x, y, w, h } = hud.PARTY_CARD;
  const filled = Math.max(2, Math.round(74 * member.hp / member.maxHp));
  ctx.save();
  ctx.globalAlpha = 0.45 * throb;
  ctx.fillStyle = '#ffd0d8';
  ctx.fillRect(x + 66, y + 29, filled, 9);
  ctx.globalAlpha = 0.35 + 0.4 * throb;
  ctx.strokeStyle = hud.COLORS.danger;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
  ctx.restore();
}

// The pale bar behind a falling HP bar: it waits a moment, then drains.
function ghost(who, time, dt) {
  if (who.ghostHp === undefined || who.hp >= who.ghostHp) {
    who.ghostHp = who.hp;
    who.ghostLast = who.hp;
    return;
  }
  // (Each new drop starts its wait again.)
  if (who.hp < who.ghostLast) who.ghostAt = time;
  who.ghostLast = who.hp;
  if (time - who.ghostAt < GHOST_HOLD_SECONDS) return;
  const gap = who.ghostHp - who.hp;
  who.ghostHp = Math.max(who.hp, who.ghostHp - Math.max(who.maxHp * 0.25, gap * 5) * dt);
}

// Over an HP bar (`x, y, w, h` in UI pixels, as hud draws it): the ghost.
export function drawGhost(ctx, who, x, y, w, h) {
  if (!who?.maxHp || who.ghostHp === undefined || who.ghostHp <= who.hp) return;
  const from = Math.round(w * Math.max(0, who.hp) / who.maxHp);
  const to = Math.round(w * Math.min(1, who.ghostHp / who.maxHp));
  if (to <= from) return;
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = GHOST_COLOR;
  ctx.fillRect(x + from, y, to - from, h);
  ctx.globalAlpha = 1;
}

// Where hud.js draws the bars (see drawEnemyStatus, drawEnemyMini, drawPartyCard).
export const drawStatusGhost = (ctx, foe, cx, top) => drawGhost(ctx, foe, Math.round(cx - 50), top + 26, 100, 8);
export const drawMiniGhost = (ctx, foe, right, top) => drawGhost(ctx, foe, right - 84, top + 20, 84, 6);
export const drawCardGhost = (ctx, member) => {
  drawGhost(ctx, member, hud.PARTY_CARD.x + 66, hud.PARTY_CARD.y + 29, 74, 9);
  drawLowHp(ctx, member);
};

// Spared (not a boss, who has its own): a soft ring and a twinkle or two.
function spared(battle, foe) {
  const { x, y } = foe.center;
  battle.bits.ring(x, y, { speed: 70, life: 0.6, color: '#fff2cf', width: 1 });
  for (let i = 0; i < 3; i++) battle.bits.star(x + rand(-14, 14), y + rand(-12, 8), { size: rand(5, 8), life: rand(0.2, 0.32) });
}

// A beaten enemy that just fades (no `feel.exit`, no broken sprite it stays
// as, no stage of its own) crumbles into dust that lifts off it as it goes.
function fadeDust(battle, foe, dt) {
  if (foe.data.feel?.exit || foe.beatenSprite || foe === battle.phased || !foe.sprite) return;
  const clip = foe.anim?.death;
  const gone = battle.time - foe.leftAt - (clip ? clip.sprites.length / clip.fps : 0);
  if (gone < 0 || gone > 0.9) return;
  const w = foe.sprite.width * SCALE;
  const h = foe.sprite.height * SCALE;
  const rate = 26 + (w * h) / 160;
  const colors = foe.bitColors?.length ? foe.bitColors : ['#ffffff'];
  for (let n = rate * dt; n > 0; n--) {
    if (n < 1 && random() > n) break;
    // From the top down, the way it crumbles.
    const fy = Math.min(1, gone * 1.3) * rand(0.6, 1);
    battle.bits.mote(foe.pos.x + w * rand(0.15, 0.85), foe.pos.y + h * fy, { vy: -rand(14, 34), life: rand(0.5, 0.9), color: pick(colors), size: random() < 0.3 ? 2 : 1, sway: rand(0, 6.28) });
  }
}

// ---------- the shadow appears ----------

// In UI space with the shadow, the moment the box has opened: a ring closing
// in on it, and a glint, so your eye finds it before the first bullet.
export function drawReady(ctx, battle, boxOpenSeconds) {
  if (battle.phase !== 'dodge' || battle.soul.shattered) return;
  const t = battle.phaseTime - boxOpenSeconds;
  if (t < 0 || t > READY_SECONDS) return;
  const k = t / READY_SECONDS;
  const x = Math.round(battle.soul.x * S);
  const y = Math.round(battle.soul.y * S);
  ctx.save();
  ctx.globalAlpha = 1 - k;
  ctx.strokeStyle = battle.soul.mode?.color ?? '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 8 + (1 - k) * 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  const arm = Math.round(6 * (1 - k)) + 1;
  ctx.fillRect(x - arm, y - 1, arm * 2, 2);
  ctx.fillRect(x - 1, y - arm, 2, arm * 2);
  ctx.restore();
}

// ---------- numbers ----------

// One popup, in UI space. Damage numbers pop in large, hop and settle, then
// rise and fade; a PERFECT one is gold, bigger, with a glint. Words (MISS,
// DOWN, MERCY +10) rise as they always have.
export function drawPopup(ctx, popup, lifeSeconds) {
  const t = popup.t;
  const fade = 1 - t / lifeSeconds;
  if (!popup.hop && !/^\+?\d+$/.test(popup.text)) {
    ctx.globalAlpha = fade;
    drawText(ctx, popup.text, popup.x, popup.y - t * 30, { size: 32, color: popup.color, align: 'center', outline: hud.COLORS.outline });
    ctx.globalAlpha = 1;
    return;
  }
  const pop = t < POP_SECONDS ? 1 + 0.6 * (1 - t / POP_SECONDS) : 1;
  // A hop up and a smaller one after, then a slow drift up.
  const hop = t < 0.3 ? Math.sin((t / 0.3) * Math.PI) * HOP : t < 0.45 ? Math.sin(((t - 0.3) / 0.15) * Math.PI) * HOP * 0.3 : 0;
  const rise = Math.max(0, t - 0.45) * 26;
  const size = popup.crit ? 40 : popup.big ? 36 : 32;
  const y = popup.y - hop - rise;
  ctx.save();
  ctx.globalAlpha = Math.min(1, fade * 1.6);
  ctx.translate(popup.x, y + size / 2);
  ctx.scale(pop, pop);
  drawText(ctx, popup.text, 0, -size / 2, { size, color: popup.crit ? hud.COLORS.yellow : popup.color, align: 'center', outline: hud.COLORS.outline });
  ctx.restore();
  if (popup.crit && t < 0.5) {
    // A glint at its corner.
    const g = Math.round(7 * Math.sin((t / 0.5) * Math.PI));
    const gx = popup.x + 6 + popup.text.length * 10;
    const gy = y + 4;
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx - g, gy - 1, g * 2, 2);
    ctx.fillRect(gx - 1, gy - g, 2, g * 2);
    ctx.globalAlpha = 1;
  }
}

// ---------- winning ----------

// The EXP and gold, counting up over the party as the "You won!" panel
// shows; and on a level up, sparks rising round the hero.
export function victory(battle, exp, coins, levelledUp, feet) {
  battle.counts = [];
  if (exp) battle.counts.push({ label: 'EXP', to: exp, color: hud.COLORS.yellow, at: battle.time });
  if (coins) battle.counts.push({ label: 'G', to: coins, color: '#ffd070', at: battle.time + 0.25 });
  if (!levelledUp) return;
  for (let i = 0; i < 14; i++) {
    battle.bits.mote(feet.x + rand(-16, 16), feet.y - rand(0, 30), { vy: -rand(24, 50), life: rand(0.9, 1.5), color: pick(['#ffe14d', '#ffffff', '#4fe3d0']), size: random() < 0.4 ? 2 : 1, sway: rand(0, 6.28) });
  }
  battle.bits.ring(feet.x, feet.y - 2, { speed: 70, life: 0.6, color: '#ffe14d', width: 1, squash: 0.3 });
}

// In UI space: the counts, over the party's heads.
export function drawCounts(ctx, battle, feet) {
  if (!battle.counts?.length) return;
  battle.counts.forEach((count, i) => {
    const t = battle.time - count.at;
    if (t < 0 || t > COUNT_SECONDS) return;
    const k = Math.min(1, t / COUNT_UP_SECONDS);
    const shown = Math.round(count.to * (1 - (1 - k) * (1 - k)));
    ctx.globalAlpha = Math.min(1, (COUNT_SECONDS - t) / 0.4, t / 0.1);
    const pop = k >= 1 && t - COUNT_UP_SECONDS < 0.12 ? 1.2 : 1;
    const x = (feet.x + 30) * S;
    const y = (feet.y - 66) * S - i * 30 - Math.min(t, 0.4) * 20;
    ctx.save();
    ctx.translate(x, y + 12);
    ctx.scale(pop, pop);
    drawText(ctx, `+${shown} ${count.label}`, 0, -12, { size: 24, color: count.color, align: 'left', outline: hud.COLORS.outline });
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}
