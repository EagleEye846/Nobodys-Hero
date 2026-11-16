import * as hud from './hud.js';
import { fract, vistaHash as noise } from '../engine/noise.js';
import { flashScale } from '../state/settings.js';
import { sfx } from '../audio/music.js';

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
function stormMass(ctx, cx, top, t, grow = 1) {
  const flash = (() => {
    const n = Math.floor(t / 2.6);
    const local = t - n * 2.6;
    // (The LIGHTNING FLASHES option dims it, or leaves it out.)
    return local < 0.5 ? (local < 0.08 ? 1 : 1 - local / 0.5) * (noise(n) > 0.3 ? 1 : 0.4) * flashScale() : 0;
  })();
  // It turns about him: four arms of cloud winding out from behind his
  // head, thicker the further out, and its eye alight at his back.
  const eyeY = top + 36;
  soft(ctx, cx, eyeY, 100, '110, 255, 170', (0.26 + 0.05 * Math.sin(t * 3.1) + flash * 0.3) * grow);
  for (let pass = 0; pass < 2; pass++) {
    for (let arm = 0; arm < 4; arm++) {
      // (It winds out from him as the change plays: `grow`.)
      for (let k = 0; k < 64 * grow; k++) {
        const rr = 20 + k * 1.3;
        const a = (arm * Math.PI) / 2 + rr * 0.034 + t * 0.6;
        const x = cx + Math.cos(a) * rr * 1.25;
        const y = eyeY + Math.sin(a) * rr * 0.72;
        const w = 6 + rr * 0.13 + noise(arm * 70 + k) * 4;
        const h = 4 + rr * 0.07;
        const fade = Math.min(1, (104 - rr) / 30, (64 * grow - k) / 10);
        if (pass === 0) {
          ctx.fillStyle = `rgba(6, 24, 22, ${(0.8 * fade).toFixed(3)})`;
          ctx.fillRect(Math.round(x - w / 2), Math.round(y - h / 2), Math.round(w), Math.round(h));
        } else if (k % 2 === 0) {
          // Lit along the edge that faces the eye.
          const lit = 0.4 + flash * 0.5;
          ctx.fillStyle = `rgba(${Math.round(60 + flash * 150)}, ${Math.round(150 + flash * 100)}, ${Math.round(112 + flash * 110)}, ${(lit * fade).toFixed(3)})`;
          ctx.fillRect(Math.round(x - w / 2 - Math.cos(a) * 2), Math.round(y - h / 2 - Math.sin(a) * 2), Math.round(w * 0.6), 1);
          if (k % 6 === 0) { ctx.fillStyle = `rgba(20, 52, 44, ${(0.9 * fade).toFixed(3)})`; ctx.fillRect(Math.round(x - w / 4), Math.round(y), Math.round(w / 2), 2); }
        }
      }
    }
  }
  if (flash > 0.2 && grow >= 1) {
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

// The storm's lightning jumping off his staff: a quick crooked arc to the
// floor, the frames or the air, a few times a second.
function staffArcs(ctx, sx, sy, t) {
  const every = 0.55;
  const n = Math.floor(t / every);
  const local = t - n * every;
  if (local > 0.16 || noise(n + 300) < 0.25) return;
  const k = (1 - local / 0.16) * flashScale();
  if (k <= 0) return;
  const a = Math.PI * (0.55 + noise(n + 310) * 0.75);
  const len = 50 + noise(n + 320) * 70;
  const ex = sx + Math.cos(a) * len;
  const ey = sy + Math.sin(a) * len;
  for (const [width, color] of [[4, `rgba(98, 255, 162, ${(0.35 * k).toFixed(3)})`], [2, `rgba(240, 255, 236, ${k.toFixed(3)})`]]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    for (let j = 1; j <= 6; j++) {
      const u = j / 6;
      const off = j === 6 ? 0 : (noise(n * 17 + j) - 0.5) * 22;
      ctx.lineTo(Math.round(sx + (ex - sx) * u - Math.sin(a) * off), Math.round(sy + (ey - sy) * u + Math.cos(a) * off));
    }
    ctx.stroke();
  }
  soft(ctx, ex, ey, 18, '200, 255, 220', 0.5 * k);
  soft(ctx, sx, sy, 26, '160, 255, 200', 0.5 * k);
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

// THE TOWER COMING APART. Each change of phase is a moment you see: his
// `intro` clip (corrieBattle.js) plays while the lamp room around him breaks,
// on a timeline (seconds from the change): flashes, shakes, the glass going,
// the roof tearing off. `ruin` (0-3) is how wrecked the room is, and `lamp`
// (0-1) how lit the great lamp is; the backdrop draws both
// (battle.lastLightRuin, drawLastLight in coastBackdrops.js).
//   phase 1, the boy:   the room whole, the glass whole, the great lamp cold
//   phase 2, the storm: the panes crack, then blow in (ruin 1)
//   phase 3, the whirl: the windows gone, the roof torn half away (ruin 2)
//   phase 4, the lamp:  the roof mostly gone, the lamp lit and turning,
//                       open to the sky, the sea surging up outside (ruin 3)
// Each phase's beat starts with a pause (corrie.js) so the change plays out
// before anyone speaks. A step can:
//   ruin, lamp     how wrecked the room is to be / the great lamp lit
//   tint, fade     a coloured flash over the stage
//   dark           the room goes dark for that many seconds (the held breath)
//   bolt           a great fork of lightning down onto him
//   wind           the air going round the room for that many seconds
//   glass, roof    that many pieces of glass / of the roof thrown about
//   burst          'storm' (rings of green off him), 'geyser' (the sea
//                  bursting up under him), 'slam' (the girder landing),
//                  'light' (the lamp catching: rings of gold off the lens, a
//                  beam straight up through the roof), 'drain' (the water
//                  falling off him)
//   shake, sfx
const CHANGES = [
  [],
  // THE STORM TAKES HIM: the room goes dark and the glass crazes; then the
  // strike, down through the roof onto him: every window blows in at once.
  // He comes up out of the flash taller, and it strikes again, and again.
  [
    { at: 0.05, dark: 0.85, ruin: 0.45, sfx: 'whoosh' },
    { at: 0.45, ruin: 0.9, shake: 0.25, sfx: 'zap' },
    { at: 0.88, bolt: 1, tint: '240, 255, 240', fade: 0.8, shake: 0.9, ruin: 1, glass: 70, burst: 'storm', sfx: ['thunderclap', 'shatter'] },
    { at: 1.35, bolt: 0.7, tint: '120, 255, 170', alpha: 0.4, fade: 0.45, shake: 0.5, glass: 14, sfx: 'thunderclap' },
    { at: 1.8, tint: '120, 255, 170', alpha: 0.25, fade: 0.3, shake: 0.3, burst: 'storm', sfx: 'zap' },
    { at: 2.25, bolt: 1, tint: '235, 255, 240', alpha: 0.45, fade: 0.6, shake: 0.7, glass: 10, sfx: 'thunderclap' },
  ],
  // THE WHIRLPOOL: the air starts going round; the sea bursts up through the
  // floor under him and lifts him; the roof peels off from the far end, and
  // a girder comes down across the room.
  [
    { at: 0.05, wind: 2.8, shake: 0.4, sfx: 'whoosh' },
    { at: 0.4, ruin: 1.3, glass: 18, roof: 8, shake: 0.5, sfx: 'shipGroan' },
    { at: 0.88, burst: 'geyser', tint: '200, 240, 255', fade: 0.6, shake: 0.9, ruin: 1.7, roof: 26, sfx: ['splash', 'splinters'] },
    { at: 1.35, ruin: 2, roof: 22, shake: 0.5, sfx: 'crumble' },
    { at: 1.62, burst: 'slam', shake: 0.8, sfx: 'boom' },
    { at: 2.2, burst: 'geyser', shake: 0.4, sfx: 'tideRush' },
  ],
  // THE LAMP: a breath of dark; then the great lamp catches. Its light goes
  // straight up through what's left of the roof and takes it off, and the
  // storm's water falls away from him.
  [
    { at: 0.05, dark: 0.7, shake: 0.3, sfx: 'whoosh' },
    { at: 0.72, lamp: 1, ruin: 2.5, tint: '255, 240, 190', fade: 1.1, shake: 0.9, roof: 34, burst: 'light', sfx: ['flare', 'crumble'] },
    { at: 1.2, ruin: 3, roof: 20, shake: 0.5, burst: 'drain', sfx: 'splinters' },
    { at: 1.75, tint: '255, 226, 160', fade: 0.5, shake: 0.3, burst: 'drain', sfx: 'splash' },
    { at: 2.3, shake: 0.4, sfx: 'tideRush' },
  ],
];
const RUIN_SPEED = 1.5;
const LAMP_SPEED = 2.5;

// Glass and pieces of the roof thrown into the room. The glass comes in from
// the windows on both sides; the roof goes up and away downwind (toward him).
function debris(battle, glass, roof) {
  for (let i = 0; i < glass; i++) {
    const side = i % 2 ? 1 : -1;
    const x = 160 + side * (40 + Math.random() * 120);
    const y = 6 + Math.random() * 94;
    const big = i % 5 === 0;
    battle.bits.chip(x, y, {
      vx: -side * (50 + Math.random() * 130), vy: -50 - Math.random() * 90,
      color: i % 3 ? 'rgba(200, 240, 230, 0.9)' : '#ffffff', w: big ? 5 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 3), h: big ? 3 : 1 + Math.floor(Math.random() * 2),
      floor: 122 + Math.random() * 30, life: 2.2, spin: 14,
    });
  }
  for (let i = 0; i < roof; i++) {
    const x = Math.random() * 230;
    const plate = i % 3 === 0;
    battle.bits.chip(x, 2 + Math.random() * 16, {
      vx: 30 + Math.random() * 170, vy: -70 - Math.random() * 150, gravity: plate ? 170 : 230,
      color: plate ? '#232b27' : i % 3 === 1 ? '#4a3a22' : '#a07820', w: plate ? 7 + Math.floor(Math.random() * 6) : 3 + Math.floor(Math.random() * 4), h: plate ? 4 : 2,
      floor: 124 + Math.random() * 30, life: 2.6, spin: plate ? 6 : 11,
    });
  }
}

// What a step's `burst` throws about (see CHANGES).
function burst(battle, kind) {
  const foe = battle.phased;
  const { x, y } = foe?.center ?? { x: 260, y: 74 };
  const bits = battle.bits;
  if (kind === 'storm') {
    bits.ring(x, y, { speed: 260, life: 0.6, color: '#62ffa2', width: 4 });
    bits.ring(x, y, { speed: 170, life: 0.7, color: '#efffef', width: 2 });
    bits.scatter(x, y, 30, ['#62ffa2', '#efffef', '#c8f290'], { speed: 200, up: 20, gravity: 60, life: 0.8 });
  } else if (kind === 'geyser') {
    // Up out of the floor under him, and out along it.
    for (let i = 0; i < 46; i++) {
      bits.spark(x + (Math.random() - 0.5) * 70, 140 - Math.random() * 10, {
        vx: (Math.random() - 0.5) * 150, vy: -120 - Math.random() * 230, gravity: 320, life: 0.9 + Math.random() * 0.6,
        color: i % 3 ? (i % 2 ? '#a4e4f6' : '#52a8d4') : '#f2fcff', size: i % 4 ? 2 : 3,
      });
    }
    bits.ring(x, 142, { squash: 0.22, speed: 220, life: 0.8, color: '#a4e4f6', width: 3 });
    bits.ring(x, 142, { squash: 0.22, speed: 130, life: 1, color: '#f2fcff', width: 2 });
  } else if (kind === 'slam') {
    bits.dust(64, 134, 70, 16, { color: '#6c7c74' });
    bits.scatter(68, 132, 14, ['#a07820', '#56665c', '#232b27'], { speed: 110, up: 60, gravity: 300, life: 0.9 });
    bits.ring(66, 136, { squash: 0.25, speed: 120, life: 0.5, color: '#c8d8d0', width: 2 });
  } else if (kind === 'light') {
    // (The lens is at the middle of the room: 160, 74.)
    bits.beam(160, 74, { life: 1.6, width: 30, color: '255, 240, 190' });
    bits.beam(160, 74, { life: 1.1, width: 12, color: '255, 255, 240' });
    bits.star(160, 74, { size: 46, life: 0.5 });
    bits.ring(160, 74, { speed: 330, life: 0.7, color: '#ffe9a8', width: 5 });
    bits.ring(160, 74, { speed: 210, life: 0.9, color: '#ffffff', width: 2 });
    for (let i = 0; i < 20; i++) bits.mote(100 + Math.random() * 120, 40 + Math.random() * 90, { vy: -20 - Math.random() * 40, color: i % 2 ? '#ffe9a8' : '#ffffff', life: 1.8 });
  } else if (kind === 'drain') {
    for (let i = 0; i < 26; i++) {
      bits.spark(x + (Math.random() - 0.5) * 80, y + Math.random() * 50, {
        vx: (Math.random() - 0.5) * 60, vy: -20 + Math.random() * 60, gravity: 380, life: 0.7 + Math.random() * 0.5,
        color: i % 3 ? '#52a8d4' : '#a4e4f6', size: i % 4 ? 2 : 3,
      });
    }
    bits.ring(x, 142, { squash: 0.22, speed: 150, life: 0.9, color: '#a4e4f6', width: 2 });
  }
}

// The fork that comes down on him: from the top of the stage to his chest,
// crooked, with two branches; there and gone in a third of a second.
function strike(ctx, battle, bolt) {
  const age = battle.time - bolt.at;
  if (age < 0 || age > 0.34) return;
  const foe = battle.phased;
  if (!foe) return;
  const k = (age < 0.06 ? 1 : 1 - (age - 0.06) / 0.28) * flashScale() * bolt.power;
  if (k <= 0) return;
  const ex = foe.center.x;
  const ey = foe.center.y - 6;
  const seed = Math.floor(bolt.at * 10);
  const sx = ex - 26 + noise(seed) * 40;
  const pts = [[sx, -4]];
  for (let j = 1; j <= 7; j++) pts.push([sx + (ex - sx) * (j / 7) + (j === 7 ? 0 : (noise(seed + j * 3) - 0.5) * 34), -4 + (ey + 4) * (j / 7)]);
  const draw = (line, width, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    line.forEach(([x, y], i) => (i ? ctx.lineTo(Math.round(x), Math.round(y)) : ctx.moveTo(Math.round(x), Math.round(y))));
    ctx.stroke();
  };
  const branch = (from, dir) => {
    const out = [pts[from]];
    for (let j = 1; j <= 4; j++) out.push([pts[from][0] + dir * j * (10 + noise(seed + from + j) * 8), pts[from][1] + j * 9 + (noise(seed + from * 5 + j) - 0.5) * 10]);
    return out;
  };
  ctx.save();
  ctx.lineJoin = 'miter';
  for (const [line, scale] of [[pts, 1], [branch(2, -1), 0.5], [branch(4, 1), 0.5], [branch(5, -1), 0.4]]) {
    draw(line, 12 * scale, `rgba(98, 255, 162, ${(0.3 * k).toFixed(3)})`);
    draw(line, 6 * scale, `rgba(200, 255, 220, ${(0.7 * k).toFixed(3)})`);
    draw(line, Math.max(1, 3 * scale), `rgba(255, 255, 255, ${k.toFixed(3)})`);
  }
  soft(ctx, ex, ey, 70, '230, 255, 236', 0.7 * k);
  soft(ctx, sx, 0, 50, '200, 255, 220', 0.5 * k);
  ctx.restore();
}

// The air going round the room: long streaks, one way over the top and back
// the other way along the floor, quickening and then dying off.
function windStreaks(ctx, battle, wind) {
  const age = battle.time - wind.at;
  if (age < 0 || age > wind.seconds) return;
  const k = Math.min(1, age / 0.4, (wind.seconds - age) / 0.6);
  const width = 320;
  for (let i = 0; i < 30; i++) {
    const y = 4 + noise(i + 600) * (hud.STAGE_HEIGHT - 12);
    const way = y < hud.STAGE_HEIGHT * 0.5 ? 1 : -1;
    const speed = 380 + noise(i + 610) * 320;
    const span = width + 120;
    const x = ((noise(i + 620) * span + way * age * speed) % span + span) % span - 60;
    const len = 26 + noise(i + 630) * 46;
    const bend = Math.sin((x / width) * Math.PI) * (way > 0 ? -5 : 5);
    ctx.fillStyle = `rgba(214, 246, 240, ${((i % 3 ? 0.22 : 0.4) * k).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y + bend), Math.round(len), 1);
    if (i % 4 === 0) ctx.fillRect(Math.round(x + len * 0.3), Math.round(y + bend + 1), Math.round(len * 0.5), 1);
  }
}

// How far in a phase's look has come (0-1): what goes on behind and round
// him starts at the change's big moment (the strike, the geyser, the lamp
// catching: CHANGES) and takes a second to come up, so it grows out of it.
const GROW_FROM = [0, 0.88, 0.88, 0.72];
function grown(battle) {
  const state = battle.stageState;
  if (!state || !state.change) return 1;
  return Math.max(0, Math.min(1, (battle.time - state.changeAt - GROW_FROM[state.change]) / 1.1));
}

export const CORRIE_STAGE = {
  start(battle, foe) {
    const keep = battle.stageState ?? {};
    const ruin = battle.lastLightRuin ?? { ruin: 0, want: 0, lamp: 0, wantLamp: 0 };
    battle.lastLightRuin = ruin;
    return { tide: TIDE_START, hinted: keep.hinted ?? false, turnFrom: battle.time, changeAt: battle.time, change: foe?.phase ?? 0, fired: 0 };
  },

  // The change's timeline, and the room easing toward how wrecked it's to be.
  update(battle, dt) {
    const state = battle.stageState;
    const room = battle.lastLightRuin;
    if (!state || !room) return;
    const steps = CHANGES[state.change] ?? [];
    const since = battle.time - state.changeAt;
    while (state.fired < steps.length && since >= steps[state.fired].at) {
      const step = steps[state.fired++];
      if (step.ruin !== undefined) room.want = Math.max(room.want, step.ruin);
      if (step.lamp !== undefined) room.wantLamp = step.lamp;
      if (step.shake) battle.shake = Math.max(battle.shake ?? 0, step.shake);
      if (step.tint) state.tint = { rgb: step.tint, at: battle.time, fade: step.fade ?? 0.5, alpha: step.alpha ?? 0.7 };
      if (step.dark) state.dark = { at: battle.time, seconds: step.dark };
      if (step.bolt) state.bolt = { at: battle.time, power: step.bolt };
      if (step.wind) state.wind = { at: battle.time, seconds: step.wind };
      if (step.glass || step.roof) debris(battle, step.glass ?? 0, step.roof ?? 0);
      if (step.burst) burst(battle, step.burst);
      for (const name of [].concat(step.sfx ?? [])) sfx(name);
    }
    room.ruin = Math.min(room.want, room.ruin + dt * RUIN_SPEED);
    room.lamp = Math.min(room.wantLamp, room.lamp + dt * LAMP_SPEED);
  },

  // For previews: straight to how the room is once the change is over.
  skip(battle, foe) {
    const room = battle.lastLightRuin;
    const state = battle.stageState;
    if (!room || !state) return;
    for (const step of CHANGES[state.change] ?? []) {
      if (step.ruin !== undefined) room.want = Math.max(room.want, step.ruin);
      if (step.lamp !== undefined) room.wantLamp = step.lamp;
    }
    room.ruin = room.want;
    room.lamp = room.wantLamp;
    state.fired = (CHANGES[state.change] ?? []).length;
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
    battle.bits.ring(x, y + 62, { squash: 0.25, speed: 120, color: '#7fd4ee', width: 2, life: 1.2 });
    battle.bits.ring(x, y + 62, { squash: 0.25, speed: 70, color: '#d8f6ff', life: 1.4 });
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
    const grow = grown(battle);
    ctx.save();
    if (id === 'boy') {
      soft(ctx, cx, cy, 84, '120, 220, 240', 0.24 + 0.05 * Math.sin(t * 1.7));
      orbit(ctx, cx, y + h * 0.62, t, 'back');
    } else if (id === 'storm') {
      if (grow > 0) stormMass(ctx, cx, y + 14, t, grow);
    } else if (id === 'whirlpool') {
      soft(ctx, cx, y + h * 0.75, 70, '60, 150, 180', 0.2 * grow);
      if (grow > 0.3) whirlRing(ctx, cx, y + h * 0.8, t, 'back');
    } else if (id === 'lamp') {
      if (grow > 0) { ctx.globalAlpha = grow; lampBeam(ctx, cx, y, w, h, t); }
    }
    ctx.restore();
    return false;
  },

  // In front of him: the near half of what goes round him, the storm's rain.
  drawOver(ctx, battle) {
    // A change's held breath of dark, its wind and its strike.
    const fx = battle.stageState;
    if (fx?.dark) {
      const age = battle.time - fx.dark.at;
      const k = Math.min(1, age / 0.35, (fx.dark.seconds - age) / 0.12);
      if (k > 0) {
        ctx.fillStyle = `rgba(0, 6, 8, ${(0.62 * k).toFixed(3)})`;
        ctx.fillRect(0, 0, ctx.canvas.width, hud.STAGE_HEIGHT);
      }
    }
    if (fx?.wind) windStreaks(ctx, battle, fx.wind);
    if (fx?.bolt) strike(ctx, battle, fx.bolt);
    // A change's coloured flash over the whole stage (the LIGHTNING FLASHES option dims it).
    const tint = battle.stageState?.tint;
    if (tint) {
      const k = 1 - (battle.time - tint.at) / tint.fade;
      if (k > 0) {
        ctx.fillStyle = `rgba(${tint.rgb}, ${(tint.alpha * k * k * flashScale()).toFixed(3)})`;
        ctx.fillRect(0, 0, ctx.canvas.width, hud.STAGE_HEIGHT);
      }
    }
    const foe = battle.phased;
    if (!foe || foe.state !== 'active') return;
    const id = phaseOf(battle);
    const t = battle.time;
    const w = foe.sprite.width * FOE_SCALE;
    const h = foe.sprite.height * FOE_SCALE;
    const cx = foe.pos.x + w / 2;
    ctx.save();
    if (id === 'boy') orbit(ctx, cx, foe.pos.y + h * 0.62, t, 'front');
    else if (id === 'whirlpool') { if (grown(battle) > 0.3) whirlRing(ctx, cx, foe.pos.y + h * 0.8, t, 'front'); }
    else if (id === 'storm') {
      stormRain(ctx, cx, foe.pos.y, h, t);
      if (grown(battle) > 0.3) staffArcs(ctx, foe.pos.x + 19, foe.pos.y + 9, t);
    }
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
