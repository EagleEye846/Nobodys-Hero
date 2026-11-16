import * as hud from './hud.js';
import { UI_SCALE as S } from '../config.js';
import { sfx } from '../audio/music.js';
import { SETTINGS } from '../state/settings.js';
import { textSection } from '../engine/textLoader.js';
import { borderJolt } from './battleFeel.js';
import { Deck, deckRules, songClock, BAR, WARN_BARS } from './fairweatherDeck.js';

// Madam Fairweather's stage (src/data/enemies/fairweather.js): what each of her four phases does
// to the box, beyond its attacks (see stageEffects.js for the hooks). Every phase has
// `stage: 'fairweather'`; the phase's id says which look it gets.
//
//   laugh      the box is dark sea with foam, a few bubbles; THE LIST
//   shower     the box is the night sky, stars in it; THE DANCE
//   carousel   the box is a painted carousel's inside, its canopy turning; the dance on a listing deck
//   chaos      all of them: the sky and the stripes; the list and the dance swapping on her laugh
//
// Her two rules (fairweatherDeck.js) are set each turn here (turnStart), and drawn here:
//   the list   the box's frame leans (drawn leaning, edge by edge, never turned: the picture
//              stays sharp), water runs down to the low side and sloshes back when she
//              laughs, the timbers creak a bar before and groan as she rolls over.
//   the dance  a pulse goes out from your SHADOW on every beat (gold on ONE), the frame
//              flashes on ONE, three lamps over the box count ONE two three, and the first
//              times she counts it aloud in her bubble.
// With SCREEN SHAKE off the frame leans less (the pull is the same).

const phaseOf = (battle) => battle.bossPhase()?.id ?? null;
const FOE_SCALE = 2;
// How far the frame's corners lift and drop at the steepest (UI pixels each side).
const LEAN = 10;
const CURTSY_SECONDS = 1.5;
// Her counting, in her bubble, for the first few dances.
const COUNTED_TURNS = 2;
const deckOf = () => hud.BOX.deck ?? null;

// `a` towards `b` (both #rrggbb) by k.
function mix(a, b, k) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(', ')})`;
}

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

  // `{ cue: 'curtsy' }` in a phase's beat: she dips to you before the waltz.
  cue(battle, foe, name) {
    if (name === 'curtsy') battle.fwCurtsyAt = battle.time;
  },

  // Each enemy turn: the rules for it (or none), handed to the box and the SHADOW.
  turnStart(battle) {
    const id = phaseOf(battle);
    if (!deckRules(id)) return;
    const song = songClock();
    const deck = new Deck(id, { clock: song ?? battle.fwClock ?? 0, side: Math.random() < 0.5 ? -1 : 1 });
    deck.ownClock = song === null;
    hud.BOX.deck = deck;
    battle.soul.mover = deck;
    deck.warned = 0;
    // The first time each rule comes in, the panel says how it goes.
    battle.fwSeen ??= new Set();
    const rules = deckRules(id);
    const key = rules.alternate ? 'swap' : rules.list && rules.dance ? 'both' : rules.dance ? 'dance' : 'list';
    if (!battle.fwSeen.has(key)) {
      battle.fwSeen.add(key);
      const line = battle.phased && textSection(battle.phased.data.textFile, `deck_hint: ${key}`)[0];
      if (line) {
        // (A weapon's own hint waits for the next turn.)
        if (battle.dodgeHint && battle.dodgeHint === battle.ability?.hint) battle.abilityHintShown = false;
        battle.dodgeHint = line;
      }
    }
    if (deck.ruleAt(0).dance || rules.alternate) battle.fwDances = (battle.fwDances ?? 0) + 1;
  },

  // Every frame of the turn, before the attacks: the deck's clock and its laughs.
  beforeAttacks(battle, dt) {
    const deck = deckOf();
    if (!deck) return;
    deck.tick(dt);
    battle.fwClock = deck.clock;
    const next = deck.nextSwap();
    // A bar before she rolls the deck over: a giggle and a creak.
    if (next < Infinity && deck.tt >= next - WARN_BARS * BAR && deck.warned < deck.swapped + 1) {
      deck.warned = deck.swapped + 1;
      sfx('creak');
      const foe = battle.phased;
      if (foe) battle.addPopup('ha ha', foe.center.x + 18, foe.center.y - 14, '#fff0a8');
    }
    if (deck.swapJust) {
      sfx('shipGroan');
      const foe = battle.phased;
      if (foe) battle.addPopup('HA!', foe.center.x - 14, foe.center.y - 20, '#ff9ae0');
    }
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
    // Her curtsy: down, a little held, and up, the hand still out.
    const c = (battle.time - (battle.fwCurtsyAt ?? -99)) / CURTSY_SECONDS;
    if (c >= 0 && c < 1) {
      const dip = Math.sin(Math.PI * Math.min(1, c * 1.25)) * 7;
      const frame = battle.animFrame(foe) ?? foe.sprite;
      const squash = Math.round(dip * 0.6);
      ctx.drawImage(frame, Math.round(x), Math.round(y + dip + squash), w, h - squash);
      return true;
    }
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

  // The frame, leaning with the list (each edge drawn a pixel column at a time, so it
  // stays sharp), the water at the low side, and the frame's flash on ONE.
  drawBoxBorder(ctx, battle, open) {
    const deck = deckOf();
    if (!deck || open < 1 || battle.phase !== 'dodge') return false;
    const r = hud.boxRect(open);
    const jolt = borderJolt(battle);
    ctx.save();
    ctx.translate(jolt, -Math.round(jolt / 2));
    const slope = deck.slopeAt(deck.tt);
    const soften = SETTINGS.shake ? 1 : 0.4;
    const d = Math.round(Math.abs(slope) * LEAN * soften);
    const right = slope >= 0;
    // 0 at the high side, 1 at the low.
    const low = (x) => { const k = (x - (r.x - 3)) / (r.w + 6); return right ? k : 1 - k; };
    const top = (x) => r.y - 3 - Math.round(2 * d * (1 - low(x)));
    const bottom = (x) => r.y + r.h + Math.round(2 * d * low(x));
    // (The beat's lamps hang on the top rail: drawUi.)
    battle.fwRail = top;
    const id = phaseOf(battle);
    const back = { laugh: '#04101a', shower: '#030712', carousel: '#12080a', chaos: '#0c0614' }[id] ?? '#000';
    // Water: it runs to the low side, late, and sloshes as she rolls over.
    battle.fwWater ??= 0;
    battle.fwWaterV ??= 0;
    const dt = Math.min(0.05, Math.max(0, battle.time - (battle.fwWaterAt ?? battle.time)));
    battle.fwWaterAt = battle.time;
    battle.fwWaterV += ((slope - battle.fwWater) * 14 - battle.fwWaterV * 2.6) * dt;
    battle.fwWater += battle.fwWaterV * dt;
    const w = battle.fwWater;
    const t = battle.time;
    const beatGlow = deck.rule.dance && deck.one ? Math.max(0, 1 - deck.beatPhase * 3) : 0;
    const frame = beatGlow > 0 ? mix(hud.COLORS.box, '#fff0a8', beatGlow) : hud.COLORS.box;
    for (let x = r.x - 3; x < r.x + r.w + 3; x++) {
      const yt = top(x);
      const yb = bottom(x);
      // The wedges the lean opens up, filled as the box.
      if (yt + 3 < r.y) { ctx.fillStyle = back; ctx.fillRect(x, yt + 3, 1, r.y - yt - 3); }
      if (yb > r.y + r.h) { ctx.fillStyle = back; ctx.fillRect(x, r.y + r.h, 1, yb - (r.y + r.h)); }
      // The water's top: level with the sea, so lying along the low side.
      const k = (x - r.x) / r.w;
      const lean = w * (k - 0.5) * 2;
      const level = r.y + r.h + 2 - Math.max(0, lean) * (4 + 2 * d) + Math.sin(t * 5 + x * 0.15) * (0.8 + Math.abs(battle.fwWaterV) * 1.5);
      const wy = Math.round(Math.min(level, yb - 1));
      if (wy < yb && x >= r.x && x < r.x + r.w) {
        ctx.fillStyle = 'rgba(74, 184, 224, 0.42)';
        ctx.fillRect(x, wy, 1, yb - wy);
        ctx.fillStyle = 'rgba(232, 246, 244, 0.7)';
        ctx.fillRect(x, wy, 1, 1);
      }
      ctx.fillStyle = frame;
      ctx.fillRect(x, yt, 1, 3);
      ctx.fillRect(x, yb, 1, 3);
    }
    ctx.fillStyle = frame;
    ctx.fillRect(r.x - 3, top(r.x - 3), 3, bottom(r.x - 3) + 3 - top(r.x - 3));
    ctx.fillRect(r.x + r.w, top(r.x + r.w + 2), 3, bottom(r.x + r.w + 2) + 3 - top(r.x + r.w + 2));
    ctx.restore();
    return true;
  },

  // In UI space, over everything: the beat (a pulse off the SHADOW, lamps over the box
  // counting ONE two three) and, the first times, her counting in her bubble.
  drawUi(ctx, battle) {
    const deck = deckOf();
    if (!deck || battle.phase !== 'dodge' || battle.phaseTime < 0.25) return;
    const rule = deck.rule;
    if (!rule.dance) return;
    const n = ((deck.beatIx % 3) + 3) % 3;
    const k = deck.beatPhase;
    const soul = battle.soul;
    // The pulse: out from the SHADOW as the beat lands.
    if (k < 0.6 && !soul.shattered) {
      ctx.save();
      ctx.globalAlpha = (1 - k / 0.6) * (n === 0 ? 0.9 : 0.55);
      ctx.strokeStyle = n === 0 ? '#fff0a8' : '#bff4ff';
      ctx.lineWidth = n === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.arc(Math.round(soul.x * S), Math.round(soul.y * S), 10 + k * (n === 0 ? 26 : 16), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    // Three lamps hung on the box's top rail: ONE big, two and three small.
    const r = hud.boxRect();
    const cx = r.x + r.w / 2;
    for (let i = 0; i < 3; i++) {
      const lit = i === n;
      const size = i === 0 ? 8 : 6;
      const x = Math.round(cx + (i - 1) * 22 - size / 2);
      const y = (battle.fwRail?.(x + size / 2) ?? r.y - 3) + 1;
      ctx.fillStyle = '#140c10';
      ctx.fillRect(x - 1, y - 1, size + 2, size + 2);
      ctx.fillStyle = lit ? (i === 0 ? '#fff0a8' : '#bff4ff') : '#3a4a5a';
      ctx.fillRect(x, y, size, size);
    }
    // Her counting, the first dances.
    const foe = battle.phased;
    if (foe && (battle.fwDances ?? 0) <= COUNTED_TURNS && k < 0.85) {
      const words = textSection(foe.data.textFile, 'deck_count foe');
      const word = words[n] ?? '';
      if (word) hud.drawSpeech(ctx, word, foe.pos.x * S - 4, (foe.pos.y + 14) * S, battle.foeStatusTop(foe));
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
