import { defineBulletArt } from '../projectiles.js';
import { clamp, shuffleBag } from '../patternTools.js';

// The Usurper's attacks: the shade on the summit who thinks he's the Hero.
// Everything he throws is something he took, or something he is: the
// village's stolen blade, the spikes of the crown he forged himself, strips
// torn from the heralds' banners he wears as a cloak, the red eye behind his
// cracked mask, the dark he's made of, the storm he holds back, and the
// fanfare he stole for himself.
//
// His fight has three phases (see `phases` in src/data/enemies/usurper.js):
//   SMOKE   the blade, the crown, the banners, the stare, the hands, the fanfare
//   FLAME   Ves is relighting her mother's lantern, and a small flame sits in
//           the box. Each of these attacks sends SNUFFERS after it: pale,
//           cold things (gusts, shadow blades, grasping hands, crown spikes)
//           that fly at the flame, not at you. Catch them with your shadow
//           (they don't hurt you) before they reach it. The battle draws a
//           thread from each one to the flame, so you can see which they are
//           (battleScene.js, `snuffs`).
//   LIT     no blade (Ves has it), faster, and his last stand, everything at once.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. `density` speeds up an attack's own clock, so
// the ones here keep `real` time (time / density) to know when to stop.
// `tools.flame` is where the flame is ({ x, y }) in the FLAME phase.

const US = {
  k: '#120c1c', // outline
  s: '#2a1f43', // shadow
  S: '#4a3b84', // lighter shadow
  v: '#9b87e8', // his pale edge glow
  V: '#d8ccff',
  r: '#8c0e1e', // banner red
  R: '#e8324a',
  e: '#ff2838', // the red eye
  E: '#ffd0d0',
  g: '#a57033', // the blade's gold guard
  G: '#fbc954',
  w: '#efeaea', // steel, the mask
  m: '#b8b0c8', // mask shadow
  i: '#aae0ff', // snuffers: cold, pale, glowing
  I: '#f2fbff',
  b: '#5a8acc',
  n: '#3a2a10', // horn brass, dark
  N: '#d8a040',
};

// Where the flame is when an attack runs without one (the Pattern Lab).
const flameOf = (box, tools) => tools.flame ?? { x: box.x + box.w / 2, y: box.y + box.h - 10 };

// Marks a shot as a SNUFFER: it flies at the flame, and your shadow catches it.
function snuffer(shot) {
  shot.snuffs = true;
  return shot;
}

// A point just inside an edge (not the bottom, where the flame is), for snuffers.
function snufferStart(box, side, rand) {
  if (side === 'left') return { x: box.x + 3, y: rand(box.y + 6, box.y + box.h * 0.55) };
  if (side === 'right') return { x: box.x + box.w - 3, y: rand(box.y + 6, box.y + box.h * 0.55) };
  return { x: rand(box.x + 8, box.x + box.w - 8), y: box.y + 3 };
}

// --- Art ---

// A spike off his crown, black iron, pointing the way it flies.
defineBulletArt('usCrownSpike', {
  frames: [['kS.....', 'kSSvvVw', 'kS.....']],
  palette: US,
  radius: 1.5,
  rotate: true,
});

// The same spike, gone cold and pale: a snuffer, after the flame.
defineBulletArt('usColdSpike', {
  frames: [['bi.....', 'biiiIII', 'bi.....'], ['ib.....', 'iIiIiII', 'ib.....']],
  palette: US,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.1,
});

// A strip torn from a herald's banner: red, a gold stripe, frayed.
defineBulletArt('usBanner', {
  frames: [['rRRRr', 'RGGGR', 'rRRRr', '.r.r.'], ['rRRRr', 'RGGGR', 'rRRRr', 'r.r.r']],
  palette: US,
  radius: 2,
  frameSeconds: 0.15,
});

// The head of a strip: the heralds' crest, slashed through.
defineBulletArt('usCrest', {
  frames: [['.kGGk.', 'kGrkGk', 'kGkrGk', 'kGrkGk', '.kGGk.', '..kk..']],
  palette: US,
  radius: 2.5,
});

// His cracked half-mask, with its one red eye (harmless: it stares).
defineBulletArt('usMask', {
  frames: [
    ['.wwww.', 'wwkwww', 'wkwkew', 'wwkwmw', '.wkmm.', '..wm..'],
    ['.wwww.', 'wwkwww', 'wkwkEw', 'wwkwmw', '.wkmm.', '..wm..'],
  ],
  palette: US,
  radius: 3,
  frameSeconds: 0.2,
});

// A red ember of his stare, left smouldering along the beam.
defineBulletArt('usEyeEmber', {
  frames: [['.e.', 'eEe', '.e.'], ['...', '.e.', '...']],
  palette: US,
  radius: 1,
  frameSeconds: 0.12,
});

// A shadow hand, drawn reaching right (the arms turn it to face their way).
defineBulletArt('usHand', {
  frames: [['..vv..', 'sSSSv.', 'sSSSSv', 'sSSSv.', 'sSSSSv', '..vv..']],
  palette: US,
  radius: 3,
  rotate: true,
});

// A cold hand crawling over the snow for the flame (a snuffer).
defineBulletArt('usColdHand', {
  frames: [
    ['..ii..', 'bIIIi.', 'bIIIIi', 'bIIIi.', 'bIIIIi', '..ii..'],
    ['.ii...', 'bIIIi.', 'bIIIIi', 'bIIIi.', 'bIIIIi', '...ii.'],
  ],
  palette: US,
  radius: 2.5,
  rotate: true,
  frameSeconds: 0.18,
});

// A note of the stolen fanfare, and a long one (a whole note) for the chords.
defineBulletArt('usNote', {
  frames: [['...kR', '...kR', '...k.', '.RRk.', 'RRRk.', '.RR..']],
  palette: US,
  radius: 2,
});
defineBulletArt('usWholeNote', {
  frames: [['.GGG.', 'GkkkG', 'Gk.kG', 'GkkkG', '.GGG.']],
  palette: US,
  radius: 2.5,
  spin: 3,
});

// A herald's horn he blows the fanfare through (harmless).
defineBulletArt('usHorn', {
  frames: [['NN.....', 'nNNNNNk', 'nNNNNNk', 'NN.....']],
  palette: US,
  radius: 2,
});

// Snow on the storm he's holding back, and a gust of it (a snuffer).
defineBulletArt('usFlake', {
  frames: [['.w.', 'wIw', '.w.'], ['w.w', '.I.', 'w.w']],
  palette: US,
  radius: 1.2,
  frameSeconds: 0.2,
});
defineBulletArt('usGust', {
  frames: [
    ['.iii..', 'i...i.', 'i.Ii.i', '.i..bi', '..iii.'],
    ['..iii.', '.i...i', 'i.iI.i', 'ib..i.', '.iii..'],
  ],
  palette: US,
  radius: 2.5,
  frameSeconds: 0.12,
});

// A shadow of the stolen blade, spinning (and a cold one, a snuffer).
defineBulletArt('usShadowBlade', {
  frames: [['k......', 'kgSSSSv', 'k......']],
  palette: US,
  radius: 2,
  spin: 9,
});
defineBulletArt('usColdBlade', {
  frames: [['b......', 'bIiiiiI', 'b......']],
  palette: US,
  radius: 2,
  spin: 9,
});

// --- Bullets of his own ---

// THE STOLEN BLADE, swung round a pivot just outside the box. First the
// wedge it will sweep blinks (harmless), then the blade swings from `from`
// to `to` (radians) over `seconds`. Only the blade hurts, out to `length`:
// beyond that the wedge's curved edge is safe, and so is anywhere it's
// already passed.
function sweepingBlade({ pivot, from, to, length = 72, warn = 0.75, seconds = 0.45 }) {
  return {
    x: pivot.x, y: pivot.y, dmg: null, grazed: false, age: 0,
    angle() {
      const t = clamp((this.age - warn) / seconds, 0, 1);
      return from + (to - from) * (t * t * (3 - 2 * t));
    },
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + seconds + 0.3; },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + seconds) return Infinity;
      const a = this.angle();
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const along = clamp((px - this.x) * dx + (py - this.y) * dy, 0, length);
      return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 2;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        // The wedge it will sweep, blinking.
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.12 : 0.28;
        ctx.fillStyle = '#fbc954';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, length, Math.min(from, to), Math.max(from, to));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return;
      }
      const a = this.angle();
      const fade = this.age > warn + seconds ? Math.max(0, 1 - (this.age - warn - seconds) / 0.3) : 1;
      ctx.globalAlpha = fade;
      // A smear of light behind the swing.
      const done = clamp((this.age - warn) / seconds, 0, 1);
      ctx.globalAlpha = 0.25 * fade;
      ctx.fillStyle = '#efeaea';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.arc(this.x, this.y, length, Math.min(from, a), Math.max(from, a));
      ctx.closePath();
      if (done < 1) ctx.fill();
      ctx.globalAlpha = fade;
      // The steel, the gold guard, and the red ribbon.
      const tip = { x: this.x + Math.cos(a) * length, y: this.y + Math.sin(a) * length };
      ctx.strokeStyle = '#efeaea';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x + Math.cos(a) * 10, this.y + Math.sin(a) * 10);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      ctx.strokeStyle = '#aae0ff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = '#fbc954';
      ctx.lineWidth = 3;
      const gx = this.x + Math.cos(a) * 10;
      const gy = this.y + Math.sin(a) * 10;
      ctx.beginPath();
      ctx.moveTo(gx - Math.sin(a) * 5, gy + Math.cos(a) * 5);
      ctx.lineTo(gx + Math.sin(a) * 5, gy - Math.cos(a) * 5);
      ctx.stroke();
      ctx.fillStyle = '#e8324a';
      ctx.fillRect(Math.round(gx - Math.cos(a) * 4) - 1, Math.round(gy - Math.sin(a) * 4), 2, 4);
      ctx.restore();
    },
  };
}

// A SHADOW ARM reaching in from the edge of the box: a dotted line shows how
// far it will reach (harmless), then it shoots out, holds, and pulls back.
// The whole arm hurts while it's out, the hand at its end most of all.
function reachingArm({ from, angle, reach, warn = 0.5, out = 0.16, hold = 0.35, back = 0.3 }) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  return {
    x: from.x, y: from.y, dmg: null, grazed: false, age: 0,
    length() {
      const t = this.age - warn;
      if (t < 0) return 0;
      if (t < out) return reach * (t / out);
      if (t < out + hold) return reach;
      return reach * Math.max(0, 1 - (t - out - hold) / back);
    },
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + out + hold + back; },
    edgeDistance(px, py) {
      const length = this.length();
      if (length <= 0) return Infinity;
      const along = clamp((px - this.x) * dx + (py - this.y) * dy, 0, length);
      const arm = Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 2;
      const hand = Math.hypot(px - (this.x + dx * length), py - (this.y + dy * length)) - 3;
      return Math.min(arm, hand);
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
        ctx.strokeStyle = '#9b87e8';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + dx * reach, this.y + dy * reach);
        ctx.stroke();
        ctx.restore();
        return;
      }
      const length = this.length();
      const tip = { x: this.x + dx * length, y: this.y + dy * length };
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#9b87e8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      ctx.strokeStyle = '#2a1f43';
      ctx.lineWidth = 3;
      ctx.stroke();
      // The hand, fingers spread.
      ctx.fillStyle = '#4a3b84';
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9b87e8';
      for (const spread of [-0.7, 0, 0.7]) {
        ctx.fillRect(Math.round(tip.x + Math.cos(angle + spread) * 4), Math.round(tip.y + Math.sin(angle + spread) * 4), 1, 1);
      }
      ctx.restore();
    },
  };
}

// A strip of banner: a crest at its head and `length` torn strips behind it,
// all following the same wavy path across the box, one after another.
function bannerStrip(bullets, Shot, { x, y, way, speed, amplitude, frequency, length = 6, gap = 4 }) {
  const phase = Math.random() * Math.PI * 2;
  for (let i = 0; i <= length; i++) {
    const shot = new Shot({
      x: x - way * i * gap, y, vx: way * speed, warn: 0, art: i === 0 ? 'usCrest' : 'usBanner',
      wobble: { amplitude, frequency },
    });
    // Each strip lags behind the one before it on the same wave.
    shot.age = 0;
    shot.baseY = y;
    shot.wobblePhase = phase - (i * gap / speed) * frequency;
    const move = shot.update.bind(shot);
    shot.update = (dt, box) => {
      move(dt, box);
      shot.y = shot.baseY + Math.sin(shot.age * frequency + shot.wobblePhase) * amplitude;
    };
    bullets.push(shot);
  }
}

// A ring of crown spikes round `at`, pointing in, with `gapSize` of them left
// out starting at `gapAt`. They blink for `warn`, then close in.
function crownRing(bullets, Shot, { at, radius, count, gapAt, gapSize, speed, warn, art = 'usCrownSpike' }) {
  for (let i = 0; i < count; i++) {
    if ((i - gapAt + count) % count < gapSize) continue;
    const a = (i / count) * Math.PI * 2;
    bullets.push(new Shot({
      x: at.x + Math.cos(a) * radius, y: at.y + Math.sin(a) * radius,
      vx: -Math.cos(a) * speed, vy: -Math.sin(a) * speed, warn, art, angle: a + Math.PI, life: (radius * 2.2) / speed,
    }));
  }
}

// The rhythm of the stolen fanfare (the Long Stair's, in minor): 1 a note,
// 2 a chord, 0 a rest. Eight beats to the bar.
const FANFARE = [1, 1, 1, 0, 2, 0, 1, 0, 1, 1, 1, 0, 2, 0, 0, 0];

export const USURPER_ATTACKS = {
  // --- SMOKE ---

  // THE STOLEN BLADE. He swings the village's sword round from a corner of
  // the box: the wedge it'll cover blinks gold first, so get out past its
  // edge. Between swings, two slashes cross where you are, each line
  // flashing before it cuts.
  usurperBlade(box, density, { Line, every, rand }) {
    const corner = shuffleBag([0, 1, 2, 3]);
    let real = 0;
    const swing = every(2.3, 2.5, (bullets) => {
      const c = corner();
      const right = c % 2 === 1;
      const bottom = c >= 2;
      const pivot = { x: right ? box.x + box.w + 4 : box.x - 4, y: bottom ? box.y + box.h + 4 : box.y - 4 };
      // The quarter-turn that faces into the box from that corner.
      const base = right ? (bottom ? Math.PI : Math.PI / 2) : (bottom ? -Math.PI / 2 : 0);
      const way = Math.random() < 0.5;
      const from = way ? base - 0.08 : base + Math.PI / 2 + 0.08;
      const to = way ? base + Math.PI / 2 + 0.08 : base - 0.08;
      bullets.push(sweepingBlade({ pivot, from, to, length: rand(68, 76) }));
    }, { first: 0.15 });
    const cross = every(2.3, 2.5, (bullets, soul) => {
      const at = { x: soul.x + rand(-6, 6), y: soul.y + rand(-6, 6) };
      const tilt = rand(0, Math.PI);
      [0, Math.PI / 2 + rand(-0.3, 0.3)].forEach((turn, i) => {
        const a = tilt + turn;
        bullets.push(new Line({
          x: at.x - Math.cos(a) * 75, y: at.y - Math.sin(a) * 75, angle: a, length: 150,
          warn: 0.6 + i * 0.18, life: 0.16, thickness: 4, color: '#efeaea', glow: '#fbc954',
        }));
      });
    }, { first: 1.35 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.4) return;
        swing(dt, bullets);
        cross(dt, bullets, soul);
      },
    };
  },

  // THE CROWN HE MADE HIMSELF. Rings of its spikes close in round you, each
  // with a gap: slip out through it. Between rings, spikes rain from above,
  // aimed at where you're going.
  usurperCrown(box, density, { Shot, every, rand }) {
    let real = 0;
    const ring = every(1.55, 1.75, (bullets, soul) => {
      crownRing(bullets, Shot, {
        at: { x: soul.x, y: soul.y }, radius: 40, count: 12, gapAt: Math.floor(rand(0, 12)), gapSize: 3, speed: 52, warn: 0.7,
      });
    }, { first: 0.2 });
    const rain = every(0.5, 0.65, (bullets, soul) => {
      const x = rand(box.x + 6, box.x + box.w - 6);
      const lead = { x: soul.x + rand(-10, 10), y: soul.y };
      const a = Math.atan2(lead.y - (box.y + 2), lead.x - x);
      bullets.push(new Shot({ x, y: box.y + 2, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, warn: 0.3, art: 'usCrownSpike' }));
    }, { first: 0.9 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.6) return;
        ring(dt, bullets, soul);
        rain(dt, bullets, soul);
      },
    };
  },

  // THE STOLEN BANNERS. Strips torn from the heralds' banners in his cloak
  // stream across the box, each led by their crest (slashed through), rippling
  // as they go, from one side then the other. Keep between them.
  usurperBanners(box, density, { Shot, every, rand }) {
    let real = 0;
    const lanes = shuffleBag([0, 1, 2, 3, 4]);
    let way = Math.random() < 0.5 ? 1 : -1;
    const strip = every(0.75, 0.9, (bullets) => {
      way = -way;
      const y = box.y + 10 + lanes() * 15;
      bannerStrip(bullets, Shot, {
        x: way > 0 ? box.x - 2 : box.x + box.w + 2, y, way, speed: rand(46, 54), amplitude: rand(3, 6), frequency: rand(3, 4.5),
      });
    }, { first: 0.1 });
    return {
      duration: 7.5,
      update: (dt, bullets) => {
        real += dt / density;
        if (real < 6) strip(dt, bullets);
      },
    };
  },

  // THE STARE. His cracked mask peers in at the edge of the box, its red
  // eye lights, a line shows where it's looking (at you), and it stares a
  // beam down it. The beam leaves embers smouldering along its line.
  usurperStare(box, density, { Shot, Line, every, rand, angleTo }) {
    let real = 0;
    const side = shuffleBag(['left', 'right', 'top', 'topLeft', 'topRight']);
    const stare = every(1.05, 1.2, (bullets, soul) => {
      const s = side();
      const at = s === 'left' ? { x: box.x + 5, y: rand(box.y + 10, box.y + box.h - 10) }
        : s === 'right' ? { x: box.x + box.w - 5, y: rand(box.y + 10, box.y + box.h - 10) }
          : s === 'topLeft' ? { x: box.x + 6, y: box.y + 6 }
            : s === 'topRight' ? { x: box.x + box.w - 6, y: box.y + 6 }
              : { x: rand(box.x + 10, box.x + box.w - 10), y: box.y + 5 };
      // Never right on top of you: then it peers in from the other side.
      if (Math.hypot(at.x - soul.x, at.y - soul.y) < 24) at.x = 2 * box.x + box.w - at.x;
      const a = angleTo(at, soul);
      const warn = 0.7;
      bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: warn + 0.5, art: 'usMask' }));
      bullets.push(new Line({ x: at.x, y: at.y, angle: a, length: 140, warn, life: 0.32, thickness: 5, color: '#ff2838', glow: '#ff6e6e' }));
      for (let i = 1; i <= 3; i++) {
        const d = 18 + i * 18;
        bullets.push(new Shot({
          x: at.x + Math.cos(a) * d, y: at.y + Math.sin(a) * d, vx: Math.cos(a) * 6, vy: Math.sin(a) * 6,
          warn: warn + 0.3, life: 1.1, art: 'usEyeEmber',
        }));
      }
    }, { first: 0.2 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 6.4) stare(dt, bullets, soul);
      },
    };
  },

  // THE DARK HE'S MADE OF. Shadow arms reach in from every side, each
  // showing first how far it'll reach; they grab at where you are, hold,
  // and pull back. Now and then two reach at once, from opposite sides.
  usurperHands(box, density, { every, rand, angleTo }) {
    let real = 0;
    const side = shuffleBag(['left', 'right', 'top', 'bottom']);
    const edge = (s) => (s === 'left' ? { x: box.x, y: rand(box.y + 8, box.y + box.h - 8) }
      : s === 'right' ? { x: box.x + box.w, y: rand(box.y + 8, box.y + box.h - 8) }
        : s === 'top' ? { x: rand(box.x + 8, box.x + box.w - 8), y: box.y }
          : { x: rand(box.x + 8, box.x + box.w - 8), y: box.y + box.h });
    const reachFor = (bullets, soul, s) => {
      const from = edge(s);
      const a = angleTo(from, soul) + rand(-0.12, 0.12);
      const reach = clamp(Math.hypot(soul.x - from.x, soul.y - from.y) + 14, 30, 96);
      bullets.push(reachingArm({ from, angle: a, reach }));
    };
    const grab = every(0.5, 0.62, (bullets, soul) => reachFor(bullets, soul, side()), { first: 0.15 });
    const pair = every(2.4, 2.6, (bullets, soul) => {
      const horizontal = Math.random() < 0.5;
      reachFor(bullets, soul, horizontal ? 'left' : 'top');
      reachFor(bullets, soul, horizontal ? 'right' : 'bottom');
    }, { first: 1.8 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.6) return;
        grab(dt, bullets, soul);
        pair(dt, bullets, soul);
      },
    };
  },

  // THE STOLEN FANFARE. Two heralds' horns at the top of the box blare the
  // fanfare that was meant to welcome the Hero, in minor: notes in its rhythm,
  // tossed at you from one horn then the other, and on the long notes, chords
  // of three that spread.
  usurperFanfare(box, density, { Shot, rand }) {
    const horns = [{ x: box.x + 7, y: box.y + 4 }, { x: box.x + box.w - 7, y: box.y + 4 }];
    let real = 0;
    let beat = 0;
    let next = 0.4;
    let time = 0;
    let horn = 0;
    let placed = false;
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        time += dt;
        if (!placed) for (const h of horns) bullets.push(new Shot({ x: h.x, y: h.y, harmless: true, life: 7.2, art: 'usHorn' }));
        placed = true;
        if (real > 6.6 || time < next) return;
        next += 0.24;
        const step = FANFARE[beat % FANFARE.length];
        beat++;
        if (!step) return;
        horn = 1 - horn;
        const from = horns[horn];
        const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
        const spread = step === 2 ? [-0.38, 0, 0.38] : [rand(-0.1, 0.1)];
        for (const s of spread) {
          bullets.push(new Shot({
            x: from.x, y: from.y + 3, vx: Math.cos(aim + s) * 66, vy: Math.sin(aim + s) * 66 - 12, gravity: 30,
            art: step === 2 ? 'usWholeNote' : 'usNote',
          }));
        }
      },
    };
  },

  // --- FLAME: Ves is relighting the lantern, and he wants it out. ---

  // THE STORM HE HOLDS BACK. He lets a little of the whiteout through: snow
  // streams across the box on a hard wind, and gusts of it (snuffers) curl
  // round toward the flame. Catch the gusts; dodge the snow.
  usurperWhiteout(box, density, tools) {
    const { Shot, every, rand } = tools;
    const flame = flameOf(box, tools);
    const way = Math.random() < 0.5 ? 1 : -1;
    let real = 0;
    const snow = every(0.13, 0.17, (bullets) => {
      const y = rand(box.y + 4, box.y + box.h - 4);
      bullets.push(new Shot({
        x: way > 0 ? box.x - 3 : box.x + box.w + 3, y, vx: way * rand(62, 74),
        wobble: { amplitude: rand(2, 4), frequency: rand(3, 5) }, art: 'usFlake',
      }));
    }, { first: 0.1 });
    const gust = every(0.95, 1.1, (bullets) => {
      const at = snufferStart(box, way > 0 ? 'left' : 'right', rand);
      if (Math.random() < 0.35) Object.assign(at, snufferStart(box, 'top', rand));
      const a = Math.atan2(flame.y - at.y, flame.x - at.x);
      bullets.push(snuffer(new Shot({
        x: at.x, y: at.y, vx: Math.cos(a) * 32, vy: Math.sin(a) * 32, warn: 0.4, art: 'usGust',
        homing: { target: flame, turn: 1.6 },
      })));
    }, { first: 0.5 });
    return {
      duration: 7.5,
      update: (dt, bullets) => {
        real += dt / density;
        if (real > 6.6) return;
        snow(dt, bullets);
        gust(dt, bullets);
      },
    };
  },

  // SHADOW BLADES. Shadows of the stolen sword: he flings them spinning at
  // you, while cold ones (snuffers) curve down at the flame from the top
  // corners. Between throws, a slash flashes across where you are.
  usurperShadowBlades(box, density, tools) {
    const { Shot, Line, every, rand, angleTo } = tools;
    const flame = flameOf(box, tools);
    let real = 0;
    const side = shuffleBag(['left', 'right', 'top']);
    const fling = every(0.55, 0.7, (bullets, soul) => {
      const s = side();
      const at = s === 'left' ? { x: box.x - 3, y: rand(box.y + 6, box.y + box.h - 6) }
        : s === 'right' ? { x: box.x + box.w + 3, y: rand(box.y + 6, box.y + box.h - 6) }
          : { x: rand(box.x + 6, box.x + box.w - 6), y: box.y - 3 };
      const a = angleTo(at, soul) + rand(-0.15, 0.15);
      bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64, art: 'usShadowBlade' }));
    }, { first: 0.3 });
    const cold = every(1.0, 1.15, (bullets) => {
      const left = Math.random() < 0.5;
      const at = { x: left ? box.x + 4 : box.x + box.w - 4, y: box.y + 4 };
      const a = Math.atan2(flame.y - at.y, flame.x - at.x) + (left ? -0.5 : 0.5);
      bullets.push(snuffer(new Shot({
        x: at.x, y: at.y, vx: Math.cos(a) * 36, vy: Math.sin(a) * 36, warn: 0.4, art: 'usColdBlade',
        homing: { target: flame, turn: 1.3 },
      })));
    }, { first: 0.6 });
    const slash = every(2.2, 2.4, (bullets, soul) => {
      const a = rand(0, Math.PI);
      bullets.push(new Line({
        x: soul.x - Math.cos(a) * 75, y: soul.y - Math.sin(a) * 75, angle: a, length: 150,
        warn: 0.65, life: 0.16, thickness: 4, color: '#9b87e8', glow: '#2a1f43',
      }));
    }, { first: 1.6 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.6) return;
        fling(dt, bullets, soul);
        cold(dt, bullets);
        slash(dt, bullets, soul);
      },
    };
  },

  // GRASPING DARK. Cold hands (snuffers) crawl over the snow from both
  // sides toward the flame, slow and patient, while shadow arms reach down
  // from above for you. Standing over the flame keeps them off it, until an
  // arm comes for you there.
  usurperGrasp(box, density, tools) {
    const { Shot, every, rand, angleTo } = tools;
    const flame = flameOf(box, tools);
    let real = 0;
    const crawl = every(1.0, 1.2, (bullets) => {
      const left = Math.random() < 0.5;
      const at = { x: left ? box.x + 3 : box.x + box.w - 3, y: rand(flame.y - 22, flame.y + 4) };
      const a = Math.atan2(flame.y - at.y, flame.x - at.x);
      bullets.push(snuffer(new Shot({
        x: at.x, y: at.y, vx: Math.cos(a) * 24, vy: Math.sin(a) * 24, warn: 0.4, art: 'usColdHand',
        homing: { target: flame, turn: 1.2 },
      })));
    }, { first: 0.4 });
    const reach = every(0.62, 0.75, (bullets, soul) => {
      const from = { x: clamp(soul.x + rand(-26, 26), box.x + 6, box.x + box.w - 6), y: box.y };
      const a = angleTo(from, soul) + rand(-0.1, 0.1);
      bullets.push(reachingArm({ from, angle: a, reach: clamp(Math.hypot(soul.x - from.x, soul.y - from.y) + 14, 30, 90) }));
    }, { first: 0.2 });
    // Now and then from the sides too, low, across the snow.
    const sweep = every(2.6, 2.8, (bullets, soul) => {
      const left = Math.random() < 0.5;
      const from = { x: left ? box.x : box.x + box.w, y: clamp(soul.y + rand(-6, 6), box.y + 10, box.y + box.h - 6) };
      bullets.push(reachingArm({ from, angle: left ? 0 : Math.PI, reach: 72, warn: 0.6 }));
    }, { first: 1.7 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.6) return;
        crawl(dt, bullets);
        reach(dt, bullets, soul);
        sweep(dt, bullets, soul);
      },
    };
  },

  // A CROWN OF COLD. Rings of crown spikes close round you, with a gap,
  // and cold spikes (snuffers) drop toward the flame from the top in
  // twos and threes, blinking first so you can get under them.
  usurperColdCrown(box, density, tools) {
    const { Shot, every, rand } = tools;
    const flame = flameOf(box, tools);
    let real = 0;
    const ring = every(1.9, 2.1, (bullets, soul) => {
      crownRing(bullets, Shot, {
        at: { x: soul.x, y: soul.y }, radius: 40, count: 12, gapAt: Math.floor(rand(0, 12)), gapSize: 3, speed: 46, warn: 0.75,
      });
    }, { first: 1.0 });
    const drop = every(1.3, 1.5, (bullets) => {
      const count = Math.random() < 0.5 ? 2 : 3;
      const middle = rand(box.x + 16, box.x + box.w - 16);
      for (let i = 0; i < count; i++) {
        const at = { x: clamp(middle + (i - (count - 1) / 2) * 16, box.x + 4, box.x + box.w - 4), y: box.y + 3 };
        const a = Math.atan2(flame.y - at.y, flame.x - at.x);
        bullets.push(snuffer(new Shot({
          x: at.x, y: at.y, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, warn: 0.5 + i * 0.25, art: 'usColdSpike',
          homing: { target: flame, turn: 0.9 },
        })));
      }
    }, { first: 0.3 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.6) return;
        ring(dt, bullets, soul);
        drop(dt, bullets);
      },
    };
  },

  // --- LIT: his last stand. ---

  // NOBODY'S CROWN. Everything at once, each thinned so there's always a
  // way: crown rings close round you, banner strips stream across, the mask
  // stares down beams, and the fanfare blares from the top, faster and
  // faster as the light eats him.
  usurperLastStand(box, density, tools) {
    const { Shot, Line, every, rand, angleTo } = tools;
    let real = 0;
    let way = 1;
    const lanes = shuffleBag([0, 1, 2, 3, 4]);
    const ring = every(2.4, 2.6, (bullets, soul) => {
      crownRing(bullets, Shot, {
        at: { x: soul.x, y: soul.y }, radius: 40, count: 12, gapAt: Math.floor(rand(0, 12)), gapSize: 4, speed: 48, warn: 0.75,
      });
    }, { first: 0.2 });
    const strip = every(1.5, 1.7, (bullets) => {
      way = -way;
      bannerStrip(bullets, Shot, {
        x: way > 0 ? box.x - 2 : box.x + box.w + 2, y: box.y + 10 + lanes() * 15, way, speed: 50, amplitude: 4, frequency: 3.5, length: 5,
      });
    }, { first: 1.0 });
    const stare = every(2.0, 2.2, (bullets, soul) => {
      const at = { x: Math.random() < 0.5 ? box.x + 5 : box.x + box.w - 5, y: box.y + 6 };
      const a = angleTo(at, soul);
      bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 1.2, art: 'usMask' }));
      bullets.push(new Line({ x: at.x, y: at.y, angle: a, length: 140, warn: 0.75, life: 0.3, thickness: 5, color: '#ff2838', glow: '#ff6e6e' }));
    }, { first: 1.7 });
    const notes = every(0.5, 0.6, (bullets, soul) => {
      const x = rand(box.x + 8, box.x + box.w - 8);
      const a = Math.atan2(soul.y - box.y, soul.x - x) + rand(-0.2, 0.2);
      bullets.push(new Shot({ x, y: box.y + 2, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, warn: 0.25, art: 'usNote' }));
    }, { first: 0.6 });
    return {
      duration: 8.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 7.6) return;
        ring(dt, bullets, soul);
        strip(dt, bullets);
        stare(dt, bullets, soul);
        notes(dt, bullets, soul);
      },
    };
  },
};
