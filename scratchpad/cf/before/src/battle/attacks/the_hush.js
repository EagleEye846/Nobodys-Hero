import { defineBulletArt } from '../projectiles.js';
import { clamp, shuffleBag } from '../patternTools.js';

// The Hush's attacks: the demon boar of the Hushwood, big as a cart and quiet
// as snow. Everything it throws at you is something of its own: its shadow,
// its claws, its tusks, its eyes in the dark, the snow that goes still round
// it, the birds that stop singing when it's near, and Ves's umbrella,
// swinging in its jaws.
//
// Its fight has three phases (see `phases` in src/data/enemies/the_hush.js):
//   HUNT     it circles, silent: the birds go quiet, its shadow passes over
//            (and pounces), its claws rake, and the umbrella swings from
//            its jaws
//   LOOSE    the umbrella's knocked out of its jaws: the hunt without it
//   DAWN     Ves has her umbrella back, and the Hush doesn't know what to do.
//            It isn't hunting any more. It follows you round the box (its
//            pawprints on your trail), comes too close, watches from the
//            dark, and calls out. It still hurts.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. `density` speeds up an attack's own clock, so
// these keep `real` time (time / density) to know when to stop. The shadow,
// the swinging umbrella and the rings of its call are bullets of their own
// made here (anything with update, isGone, edgeDistance and draw will do; see
// projectiles.js).

const HU = {
  k: '#0c0810', // outline
  w: '#3a3040', // its hide
  W: '#52464e', // its hide, lit
  p: '#2c2430', // its bristles
  P: '#16111a', // its bristles, the dark of them
  e: '#d8a23a', // its eyes, dull embers
  s: '#120608', // the dark round them
  i: '#d6c9a8', // tusks, claws, hooves
  f: '#eef3fa', // snow
  F: '#b8cce0',
  b: '#6a4a3a', // a little brown bird
  r: '#c8583a', // its red breast
  g: '#8a8a9a', // a bird gone quiet, grey
  G: '#5a5a6a',
  t: '#aac4ff', // a tear of frost
  T: '#ffffff',
};

// Where its head is when it calls: right of the box, where it stands.
const head = (box) => ({ x: box.x + box.w + 30, y: box.y + 18 });

// --- Art ---

// A little bird of the Hushwood, flitting across (drawn flying right).
defineBulletArt('hushBird', {
  frames: [
    ['b...b', '.bbrk', '..b..'],
    ['.....', 'bbbrk', 'b...b'],
  ],
  palette: HU,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.09,
});

// The same bird, gone quiet: wings shut, grey, dropping like a stone.
defineBulletArt('hushBirdStill', {
  frames: [['.gg.', 'gGGk', '.gg.']],
  palette: HU,
  radius: 1.5,
});

// A flake of the snow that goes still round it.
defineBulletArt('hushFlake', {
  frames: [['.f.', 'fFf', '.f.'], ['f.f', '.F.', 'f.f']],
  palette: HU,
  radius: 1.2,
  frameSeconds: 0.25,
});

// A hank of its black bristles, torn loose by its own claws.
defineBulletArt('hushTuft', {
  frames: [['.p.', 'pPw', '.P.'], ['p..', '.Pw', '..p']],
  palette: HU,
  radius: 1.3,
  frameSeconds: 0.15,
});

// One of its hoofprints, pressed into the snow where you just were: cloven,
// two deep halves.
defineBulletArt('hushPaw', {
  frames: [['.P.P.', 'PP.PP', 'PP.PP', 'PP.PP', '.P.P.']],
  palette: HU,
  radius: 2.5,
});

// Its great black head, coming too close: horns back, an ember eye, the
// tusk hooked up out of its jaw. One looking right, one left.
defineBulletArt('hushHeadRight', {
  frames: [
    ['.ki.........', 'kPPik.......', 'kPPPPkk.....', 'kwWwwwwkk...', 'kwwwsewwwk..', 'kwwwwwwwwwk.', '.kpwwwwwwik.', '..kpwwwwikk.', '...kkkkik...'],
  ],
  palette: HU,
  radius: 4,
});
defineBulletArt('hushHeadLeft', {
  frames: [
    ['.........ik.', '.......kiPPk', '.....kkPPPPk', '...kkwwwwWwk', '..kwwweswwwk', '.kwwwwwwwwwk', '.kiwwwwwwpk.', '.kkiwwwwpk..', '...kikkkk...'],
  ],
  palette: HU,
  radius: 4,
});

// A shard of bristle, thrown off it when its shadow slams down.
defineBulletArt('hushBristle', {
  frames: [['P..', '.Pp', '..p'], ['..P', '.pP', 'p..']],
  palette: HU,
  radius: 1.3,
  frameSeconds: 0.12,
});

// A breath of frost, sighed out.
defineBulletArt('hushBreath', {
  frames: [['.F.', 'FfF', '.F.'], ['...', '.f.', '...']],
  palette: HU,
  radius: 1.2,
  frameSeconds: 0.2,
});

// A pair of its eyes, opening in the dark (harmless: they watch).
defineBulletArt('hushEyes', {
  frames: [
    ['ee.ee', 'ss.ss'],
    ['ee.ee', 'ss.ss'],
    ['ee.ee', 'ss.ss'],
    ['.....', 'ee.ee'],
  ],
  palette: HU,
  radius: 2,
  frameSeconds: 0.22,
});

// What falls from them: a tear of frost.
defineBulletArt('hushTear', {
  frames: [['.t.', 'tTt', '.t.'], ['.T.', 'tTt', '.t.']],
  palette: HU,
  radius: 1.4,
  frameSeconds: 0.15,
});

// --- Bullets of its own ---

// ITS SHADOW, passing over the box from `from` to `to` in `seconds`: a great
// soft dark, longer than it's wide along the way it's going, with two pale
// points in it. First a faint band shows the way it'll go (harmless). Only
// its dark heart hurts; the soft edge is safe.
function passingShadow({ from, to, seconds, rx = 22, ry = 13, warn = 0.75 }) {
  const heading = Math.atan2(to.y - from.y, to.x - from.x);
  return {
    x: from.x, y: from.y, dmg: null, grazed: false, age: 0,
    update(dt) {
      this.age += dt;
      const t = clamp((this.age - warn) / seconds, 0, 1);
      this.x = from.x + (to.x - from.x) * t;
      this.y = from.y + (to.y - from.y) * t;
    },
    isGone() { return this.age > warn + seconds; },
    edgeDistance(px, py) {
      if (this.age < warn) return Infinity;
      // Into its own frame: along its way, and across.
      const dx = px - this.x;
      const dy = py - this.y;
      const along = dx * Math.cos(heading) + dy * Math.sin(heading);
      const across = -dx * Math.sin(heading) + dy * Math.cos(heading);
      const heart = Math.hypot(along / (rx * 0.62), across / (ry * 0.62));
      return (heart - 1) * ry * 0.62;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.08 : 0.18;
        ctx.strokeStyle = '#61657f';
        ctx.lineWidth = ry * 1.2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.restore();
        return;
      }
      ctx.translate(this.x, this.y);
      ctx.rotate(heading);
      ctx.scale(rx / ry, 1);
      // (The box is black, so its dark is a cold blue-grey dark, to be seen.)
      const shade = ctx.createRadialGradient(0, 0, 2, 0, 0, ry);
      shade.addColorStop(0, 'rgba(70, 66, 110, 0.95)');
      shade.addColorStop(0.62, 'rgba(52, 48, 86, 0.85)');
      shade.addColorStop(1, 'rgba(40, 36, 64, 0)');
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(0, 0, ry, 0, Math.PI * 2);
      ctx.fill();
      // The edge of its dark heart, where it starts to hurt: a ragged pale rim.
      ctx.strokeStyle = 'rgba(149, 153, 180, 0.7)';
      ctx.lineWidth = 1 / (rx / ry);
      ctx.setLineDash([2, 1.5]);
      ctx.beginPath();
      ctx.arc(0, 0, ry * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      // Its eyes, up front, looking the way it's going: two embers. And its
      // tusks, pale hooks either side of them.
      const ex = this.x + Math.cos(heading) * rx * 0.45;
      const ey = this.y + Math.sin(heading) * rx * 0.45;
      const side = { x: -Math.sin(heading) * 3, y: Math.cos(heading) * 3 };
      ctx.fillStyle = '#d8a23a';
      for (const s of [-1, 1]) ctx.fillRect(Math.round(ex + side.x * s) - 1, Math.round(ey + side.y * s), 2, 1);
      ctx.fillStyle = '#d6c9a8';
      for (const s of [-1, 1]) {
        const tx = this.x + Math.cos(heading) * rx * 0.3 + side.x * s * 2.2;
        const ty = this.y + Math.sin(heading) * rx * 0.3 + side.y * s * 2.2;
        ctx.fillRect(Math.round(tx), Math.round(ty), 1, 2);
      }
    },
  };
}

// THE UMBRELLA IN ITS JAWS, swinging: held by its handle from somewhere above
// the box (`pivot`), furled, swinging from side to side as it shakes its
// head, `swing` radians either way of straight down. The plum canopy hurts
// (from `inner` out to `length`); the bare shaft above it doesn't reach into
// the box. First its sweep shows as a dotted arc (harmless).
function swingingUmbrella({ pivot, length = 78, inner = 34, swing = 1.05, period = 2.1, warn = 0.8, seconds = 6, drift = 0 }) {
  const phase = Math.random() < 0.5 ? 0 : Math.PI;
  return {
    x: pivot.x, y: pivot.y, dmg: null, grazed: false, age: 0,
    angle() {
      const t = Math.max(0, this.age - warn);
      return Math.PI / 2 + swing * Math.sin((t / period) * Math.PI * 2 + phase);
    },
    update(dt) {
      this.age += dt;
      // It paces as it swings.
      if (this.age > warn) this.x = pivot.x + Math.sin((this.age - warn) * 0.8) * drift;
    },
    isGone() { return this.age > warn + seconds + 0.3; },
    // The end of its swing, for shaking snow off it.
    tip() {
      const a = this.angle();
      return { x: this.x + Math.cos(a) * length, y: this.y + Math.sin(a) * length };
    },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + seconds) return Infinity;
      const a = this.angle();
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const along = clamp((px - this.x) * dx + (py - this.y) * dy, inner, length);
      return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 2.5;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.55;
        ctx.strokeStyle = '#a8608a';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, length - 4, Math.PI / 2 - swing, Math.PI / 2 + swing);
        ctx.stroke();
        ctx.restore();
        return;
      }
      const fade = this.age > warn + seconds ? Math.max(0, 1 - (this.age - warn - seconds) / 0.3) : 1;
      ctx.globalAlpha = fade;
      const a = this.angle();
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      const at = (d) => [this.x + dx * d, this.y + dy * d];
      ctx.lineCap = 'round';
      // The shaft.
      ctx.strokeStyle = '#7a4f2a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(...at(0));
      ctx.lineTo(...at(length + 2));
      ctx.stroke();
      // The furled canopy: dark plum, a lit fold down it, a strap round it.
      ctx.strokeStyle = '#3a1a2e';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(...at(inner));
      ctx.lineTo(...at(length - 3));
      ctx.stroke();
      ctx.strokeStyle = '#7a3a5e';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = '#a8608a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(...at(inner + 2));
      ctx.lineTo(...at(length - 6));
      ctx.stroke();
      const [sx, sy] = at((inner + length) / 2);
      ctx.fillStyle = '#5a2846';
      ctx.fillRect(Math.round(sx) - 2, Math.round(sy) - 2, 4, 4);
      ctx.restore();
    },
  };
}

// ITS SHADOW GATHERING over `at` and slamming down: first a ring closes on
// the spot (harmless) for `warn` seconds, then the dark drops in a flash and
// everything within `r` hurts for a moment. Eight shards of bristle fly out
// of the slam (made by the attack that owns it).
function pouncingShadow({ at, r = 17, warn = 0.95 }) {
  return {
    x: at.x, y: at.y, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + 0.42; },
    landed() { return this.age >= warn; },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + 0.22) return Infinity;
      return Math.hypot(px - this.x, py - this.y) - r * 0.8;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        // The ring closing, faster as it comes; its eyes open over you last.
        const t = this.age / warn;
        ctx.globalAlpha = 0.35 + 0.5 * t;
        ctx.strokeStyle = '#9599b4';
        ctx.lineWidth = 1 + t * 2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.arc(this.x, this.y, r + (1 - t) * 26, 0, Math.PI * 2);
        ctx.stroke();
        if (t > 0.6) {
          ctx.setLineDash([]);
          ctx.fillStyle = '#d8a23a';
          ctx.fillRect(Math.round(this.x) - 4, Math.round(this.y) - 6, 2, 1);
          ctx.fillRect(Math.round(this.x) + 2, Math.round(this.y) - 6, 2, 1);
        }
        ctx.restore();
        return;
      }
      const t = (this.age - warn) / 0.42;
      ctx.globalAlpha = 1 - t;
      const shade = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, r);
      shade.addColorStop(0, 'rgba(70, 66, 110, 0.95)');
      shade.addColorStop(0.8, 'rgba(52, 48, 86, 0.8)');
      shade.addColorStop(1, 'rgba(40, 36, 64, 0)');
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * (1 + t * 0.4), 0, Math.PI * 2);
      ctx.fill();
      // The crack of it: a pale ring going out.
      ctx.strokeStyle = '#eef3fa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * 0.8 + t * 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
  };
}

// ITS CALL: a ring of frost going out from `at`, slow, with a gap in it
// (`gap` radians wide, centred on `gapAt`). It hurts where it is, except in
// the gap. First the place it comes from pulses (harmless).
function callRing({ at, speed = 38, gapAt, gap = 1.0, warn = 0.45, max = 150 }) {
  return {
    x: at.x, y: at.y, dmg: null, grazed: false, age: 0, r: 0,
    update(dt) {
      this.age += dt;
      if (this.age >= warn) this.r += speed * dt;
    },
    isGone() { return this.r > max; },
    edgeDistance(px, py) {
      if (this.age < warn || this.r < 3) return Infinity;
      const dx = px - this.x;
      const dy = py - this.y;
      const off = Math.abs((((Math.atan2(dy, dx) - gapAt) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      if (off < gap / 2) return Infinity;
      return Math.abs(Math.hypot(dx, dy) - this.r) - 1.5;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
        ctx.strokeStyle = '#aac4ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4 + this.age * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return;
      }
      ctx.globalAlpha = clamp(1.2 - this.r / this.maxShown(), 0.25, 1);
      ctx.strokeStyle = '#aac4ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, gapAt + gap / 2, gapAt - gap / 2 + Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    },
    maxShown() { return max; },
  };
}

// A hush falling over the box: a pale wash, gone in a moment (harmless).
function stillness() {
  return {
    x: 0, y: 0, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; },
    isGone() { return this.age > 0.5; },
    edgeDistance() { return Infinity; },
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.22 * (1 - this.age / 0.5);
      ctx.fillStyle = '#e6eeff';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    },
  };
}

export const HUSH_ATTACKS = {
  // --- HUNT ---

  // THE BIRDS GO QUIET. Little birds of the wood flit across the box in
  // threes. Then a hush comes over everything (the box goes pale for a
  // moment): every bird still in the air stops singing, goes grey, and
  // drops like a stone. Keep out from under them.
  hushQuiet(box, density, { Shot, every, rand }) {
    let real = 0;
    const flock = [];
    let way = Math.random() < 0.5 ? 1 : -1;
    const lanes = shuffleBag([0, 1, 2, 3, 4]);
    const birds = every(0.55, 0.7, (bullets) => {
      way = -way;
      const y = box.y + 8 + lanes() * 13;
      for (let i = 0; i < 3; i++) {
        const bird = new Shot({
          x: way > 0 ? box.x - 4 - i * 9 : box.x + box.w + 4 + i * 9, y: y + (i % 2) * 4, vx: way * rand(46, 54),
          wobble: { amplitude: rand(2, 4), frequency: rand(6, 8) }, art: 'hushBird',
        });
        flock.push(bird);
        bullets.push(bird);
      }
    }, { first: 0.1 });
    const hush = every(2.0, 2.3, (bullets) => {
      bullets.push(stillness());
      // Every bird over the box goes quiet, and falls.
      // (Birds not over it yet fly on, to go quiet next time.)
      for (const bird of flock.splice(0)) {
        if (bird.spent) continue;
        if (bird.x < box.x - 2 || bird.x > box.x + box.w + 2) {
          flock.push(bird);
          continue;
        }
        bird.spent = true;
        bullets.push(new Shot({ x: bird.x, y: bird.y, vx: bird.vx * 0.12, vy: -10, gravity: 150, art: 'hushBirdStill' }));
      }
    }, { first: 1.7 });
    return {
      duration: 7.5,
      update: (dt, bullets) => {
        real += dt / density;
        if (real > 6.6) return;
        birds(dt, bullets);
        hush(dt, bullets);
      },
    };
  },

  // A SHADOW PASSES. Its shadow goes over the box, huge and quick, from one
  // side to the other (a faint band shows the way first), ember eyes and
  // tusks in the dark of it, and the snow it passes over hangs still in the
  // air a moment, then falls. Every third pass is two shadows side by side
  // with a lane between them: get in the lane. And now and then the shadow
  // gathers right over you instead, a ring closing, and slams down: move
  // before it lands, and mind the bristles it throws. Only the dark heart of
  // a passing shadow hurts; its soft edge is safe.
  hushShadow(box, density, { Shot, every, rand }) {
    let real = 0;
    let passes = 0;
    const pounces = [];
    const side = shuffleBag(['left', 'right', 'top', 'diagonal']);
    const pass = every(1.25, 1.45, (bullets, soul) => {
      passes++;
      const s = side();
      let from;
      let to;
      if (s === 'left' || s === 'right') {
        const y = clamp(soul.y + rand(-10, 10), box.y + 12, box.y + box.h - 12);
        from = { x: s === 'left' ? box.x - 26 : box.x + box.w + 26, y };
        to = { x: s === 'left' ? box.x + box.w + 26 : box.x - 26, y: y + rand(-12, 12) };
      } else if (s === 'top') {
        const x = clamp(soul.x + rand(-10, 10), box.x + 12, box.x + box.w - 12);
        from = { x, y: box.y - 22 };
        to = { x: x + rand(-14, 14), y: box.y + box.h + 22 };
      } else {
        const left = Math.random() < 0.5;
        from = { x: left ? box.x - 20 : box.x + box.w + 20, y: box.y - 20 };
        to = { x: left ? box.x + box.w + 20 : box.x - 20, y: box.y + box.h + 20 };
      }
      const seconds = rand(1.25, 1.5);
      if (passes % 3 === 0) {
        // Two abreast, a lane down the middle just wide enough for you.
        const a = Math.atan2(to.y - from.y, to.x - from.x);
        const off = { x: -Math.sin(a) * 19, y: Math.cos(a) * 19 };
        for (const k of [-1, 1]) {
          bullets.push(passingShadow({
            from: { x: from.x + off.x * k, y: from.y + off.y * k }, to: { x: to.x + off.x * k, y: to.y + off.y * k },
            seconds, rx: 24, ry: 12, warn: 0.85,
          }));
        }
      } else {
        bullets.push(passingShadow({ from, to, seconds, rx: 24, ry: 14, warn: 0.7 }));
      }
    }, { first: 0.1 });
    // The pounce: over where you are, when it starts gathering.
    const pounce = every(2.6, 3.0, (bullets, soul) => {
      const shadow = pouncingShadow({ at: { x: soul.x, y: soul.y } });
      pounces.push(shadow);
      bullets.push(shadow);
    }, { first: 1.6 });
    // The snow, going still where it's been, then falling.
    const snow = every(0.16, 0.22, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 2, vy: rand(16, 26), wobble: { amplitude: 2, frequency: 2 }, art: 'hushFlake' }));
    }, { first: 0.4 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        // A slam throws bristles out, whatever the clock says.
        for (let i = pounces.length - 1; i >= 0; i--) {
          const shadow = pounces[i];
          if (!shadow.landed()) continue;
          pounces.splice(i, 1);
          for (let k = 0; k < 8; k++) {
            const a = (k / 8) * Math.PI * 2 + rand(-0.2, 0.2);
            bullets.push(new Shot({ x: shadow.x, y: shadow.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, accel: -14, life: 1.5, art: 'hushBristle' }));
          }
        }
        if (real > 6.4) return;
        pass(dt, bullets, soul);
        pounce(dt, bullets, soul);
        snow(dt, bullets);
      },
    };
  },

  // CLAWS. It rakes the box: three long cuts side by side through where you
  // are, each flashing first, and tufts of its own fur scatter off them.
  // Now and then two rakes cross.
  hushClaws(box, density, { Shot, Line, every, rand }) {
    let real = 0;
    let rakes = 0;
    const rake = (bullets, at, a, warn) => {
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      for (let i = -1; i <= 1; i++) {
        bullets.push(new Line({
          x: at.x + nx * i * 8 - Math.cos(a) * 70, y: at.y + ny * i * 8 - Math.sin(a) * 70, angle: a, length: 140,
          warn: warn + (i + 1) * 0.06, life: 0.16, thickness: 3, color: '#fff6dc', glow: '#61657f',
        }));
      }
      for (let i = 0; i < 3; i++) {
        const t = rand(-30, 30);
        const spread = rand(0, Math.PI * 2);
        bullets.push(new Shot({
          x: at.x + Math.cos(a) * t, y: at.y + Math.sin(a) * t, vx: Math.cos(spread) * 22, vy: Math.sin(spread) * 22 - 6,
          gravity: 30, warn: warn + 0.2, life: 1.2, art: 'hushTuft',
        }));
      }
    };
    const swipe = every(0.95, 1.1, (bullets, soul) => {
      rakes++;
      const at = { x: soul.x + rand(-5, 5), y: soul.y + rand(-5, 5) };
      const a = rand(-0.9, 0.9) + (Math.random() < 0.5 ? 0 : Math.PI / 2);
      rake(bullets, at, a, 0.6);
      if (rakes % 3 === 0) rake(bullets, at, a + Math.PI / 2 + rand(-0.3, 0.3), 0.95);
    }, { first: 0.15 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.5) return;
        swipe(dt, bullets, soul);
      },
    };
  },

  // THE UMBRELLA IN ITS JAWS. Ves's umbrella swings down into the box from
  // above as it shakes its head, back and forth, its dotted arc blinking
  // first. Snow shakes off the end of each swing, and low down its hoof
  // swipes along the floor of the box, so there's nowhere to just wait.
  hushUmbrella(box, density, { Shot, Line, every, rand }) {
    let real = 0;
    let umbrella = null;
    let lastSide = 0;
    const swipe = every(1.5, 1.8, (bullets, soul) => {
      const y = clamp(soul.y + rand(-4, 4), box.y + box.h * 0.55, box.y + box.h - 5);
      const left = Math.random() < 0.5;
      bullets.push(new Line({
        x: left ? box.x - 2 : box.x + box.w + 2, y, angle: left ? 0 : Math.PI, length: box.w + 4,
        warn: 0.65, life: 0.18, thickness: 4, color: '#fff6dc', glow: '#61657f',
      }));
    }, { first: 1.4 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!umbrella) {
          // (It swings in real seconds, like every bullet; a harder fight swings it faster.)
          umbrella = swingingUmbrella({ pivot: { x: box.x + box.w / 2, y: box.y - 30 }, seconds: 6.2, period: 2.1 / Math.sqrt(density), drift: 10 });
          bullets.push(umbrella);
        }
        if (real > 6.6) return;
        swipe(dt, bullets, soul);
        // At each end of its swing, snow shakes loose.
        const side = Math.sign(umbrella.angle() - Math.PI / 2);
        if (umbrella.age > 0.8 && side !== lastSide && Math.abs(umbrella.angle() - Math.PI / 2) > 0.85) {
          lastSide = side;
          const tip = umbrella.tip();
          for (let i = 0; i < 3; i++) {
            bullets.push(new Shot({ x: tip.x, y: tip.y, vx: side * rand(10, 40), vy: rand(-20, 0), gravity: 90, art: 'hushFlake' }));
          }
        }
      },
    };
  },

  // --- DAWN: it isn't hunting any more. ---

  // IT FOLLOWS. Its hoofprints press into the snow on your trail, a moment
  // behind you, wherever you've been. Keep moving. Now and then a line of
  // them walks straight across the box: it's never done anything but follow.
  hushFollows(box, density, { Shot, every, rand }) {
    let real = 0;
    let time = 0;
    let foot = 1;
    const trail = [];
    const mark = every(0.28, 0.28, (bullets, soul) => trail.push({ x: soul.x, y: soul.y, at: time }), { first: 0.2 });
    const walk = every(2.1, 2.4, (bullets) => {
      const fromTop = Math.random() < 0.5;
      const start = fromTop ? { x: rand(box.x + 10, box.x + box.w - 10), y: box.y + 4 } : { x: box.x + 4, y: rand(box.y + 10, box.y + box.h - 10) };
      const a = fromTop ? Math.PI / 2 + rand(-0.4, 0.4) : rand(-0.4, 0.4);
      for (let i = 0; i < 9; i++) {
        const side = i % 2 ? 3 : -3;
        bullets.push(new Shot({
          x: start.x + Math.cos(a) * i * 10 - Math.sin(a) * side, y: start.y + Math.sin(a) * i * 10 + Math.cos(a) * side,
          warn: 0.35 + i * 0.16, life: 0.9, art: 'hushPaw',
        }));
      }
    }, { first: 1.2 });
    const snow = every(0.35, 0.45, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 2, vy: rand(14, 20), wobble: { amplitude: 2, frequency: 2 }, art: 'hushFlake' }));
    });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        time += dt;
        if (real > 6.6) return;
        mark(dt, bullets, soul);
        // Each step of your trail gets its print a moment after you've left it.
        while (trail.length && time - trail[0].at > 0.55) {
          const step = trail.shift();
          foot = -foot;
          bullets.push(new Shot({ x: step.x + foot * 2, y: step.y, warn: 0.4, life: 0.55, art: 'hushPaw' }));
        }
        walk(dt, bullets);
        snow(dt, bullets);
      },
    };
  },

  // TOO CLOSE. Its great pale head comes in from the side of the box, right
  // up to you, slowing as it comes, and stops there, close enough to touch,
  // and sighs: a breath of frost spreads out from it. It doesn't mean to
  // hurt. It does.
  hushNuzzle(box, density, { Shot, every, rand }) {
    let real = 0;
    const sighs = [];
    let time = 0;
    const side = shuffleBag(['left', 'right']);
    const come = every(1.05, 1.25, (bullets, soul) => {
      const s = side();
      const from = { x: s === 'left' ? box.x - 6 : box.x + box.w + 6, y: clamp(soul.y + rand(-8, 8), box.y + 8, box.y + box.h - 8) };
      const goal = { x: soul.x + (s === 'left' ? -6 : 6), y: soul.y };
      const distance = Math.max(12, Math.hypot(goal.x - from.x, goal.y - from.y));
      const speed = 72;
      const accel = (speed * speed) / (2 * distance);
      const a = Math.atan2(goal.y - from.y, goal.x - from.x);
      const warn = 0.35;
      const reach = speed / accel;
      bullets.push(new Shot({
        x: from.x, y: from.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -accel,
        warn, life: reach + 0.55, art: s === 'left' ? 'hushHeadRight' : 'hushHeadLeft',
      }));
      sighs.push({ at: time + (warn + reach) * density, x: goal.x, y: goal.y, way: s === 'left' ? 1 : -1 });
    }, { first: 0.2 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        time += dt;
        while (sighs.length && time >= sighs[0].at) {
          const sigh = sighs.shift();
          for (let i = -2; i <= 2; i++) {
            const a = (sigh.way > 0 ? 0 : Math.PI) + i * 0.5;
            bullets.push(new Shot({ x: sigh.x + sigh.way * 5, y: sigh.y - 1, vx: Math.cos(a) * 26, vy: Math.sin(a) * 26, accel: -8, life: 1.6, art: 'hushBreath' }));
          }
        }
        if (real > 6.4) return;
        come(dt, bullets, soul);
      },
    };
  },

  // EYES IN THE DARK. Its eyes open, pair after pair, all round the box,
  // never right next to you: watching. Each pair lets fall a tear of frost
  // that drifts after you. Then a ring of them opens round you, close, and
  // every pair weeps inward at once: slip out between them.
  hushEyes(box, density, { Shot, every, rand, pointAwayFrom }) {
    let real = 0;
    const open = every(0.42, 0.55, (bullets, soul) => {
      const at = pointAwayFrom(box, soul, 30, 8);
      bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 1.6, art: 'hushEyes' }));
      const a = Math.atan2(soul.y - at.y, soul.x - at.x);
      bullets.push(new Shot({
        x: at.x, y: at.y + 2, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, warn: 0.75, life: 2.6,
        homing: { target: soul, turn: 0.6 }, art: 'hushTear',
      }));
    }, { first: 0.15 });
    const ring = every(2.4, 2.7, (bullets, soul) => {
      const count = 7;
      const turn = rand(0, Math.PI * 2);
      for (let i = 0; i < count; i++) {
        const a = turn + (i / count) * Math.PI * 2;
        const at = { x: soul.x + Math.cos(a) * 34, y: soul.y + Math.sin(a) * 34 };
        bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 1.2, art: 'hushEyes' }));
        bullets.push(new Shot({ x: at.x, y: at.y + 2, vx: -Math.cos(a) * 24, vy: -Math.sin(a) * 24, warn: 0.8, life: 2.8, art: 'hushTear' }));
      }
    }, { first: 1.8 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.5) return;
        open(dt, bullets, soul);
        ring(dt, bullets, soul);
      },
    };
  },

  // A CALL INTO THE DARK. It lifts its head and calls: the first sound it's
  // made. Slow rings of frost go out from it across the box, one after
  // another, each with a gap to slip through. Nothing answers. Between them
  // the snow comes down, quieter than before.
  hushCall(box, density, { Shot, every, rand }) {
    let real = 0;
    const from = head(box);
    const call = every(0.85, 1.0, (bullets, soul) => {
      // The gap is somewhere near the line from it to you, but not on it.
      const toward = Math.atan2(soul.y - from.y, soul.x - from.x);
      bullets.push(callRing({ at: from, gapAt: toward + rand(-0.55, 0.55), gap: 0.62 }));
    }, { first: 0.1 });
    const snow = every(0.3, 0.4, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 2, vy: rand(14, 22), wobble: { amplitude: 2, frequency: 2 }, art: 'hushFlake' }));
    }, { first: 0.5 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.4) return;
        call(dt, bullets, soul);
        snow(dt, bullets);
      },
    };
  },
};
