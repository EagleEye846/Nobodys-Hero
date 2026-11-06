import { TILE_SIZE as T } from '../config.js';
import { HUSH_SHAPES } from '../data/art/hushBeast.js';

// The Hushwood (Chapter 3): the old, dark wood below the Pinefall, where the
// beast the woodcutters call the Hush lives. Most of its puzzles are props
// (see prop.js: kid gaps, treadles, logs, trees to chop, leaf piles, water
// in sluice channels) worked by OverworldScene with Room's help. This file
// has the Hush itself.
//
// THE HUSH'S SHADOW. In some rooms (`hush` in the room's data) the beast is
// up in the canopy somewhere, and its shadow goes over the forest floor
// along a loop of tiles, stopping now and then to listen:
//
//   hush: { path: [[x, y], [x, y, pause], ...], speed, radius, start }
//
// `path` is tiles (a third number is how long it stops there, in seconds);
// `speed` is pixels a second; `radius` how far round its middle it sees;
// `across` (pixels, optional) how far it sees to either side of the way it's
// going, for a shadow that fills a street from wall to wall (Hollin Lane);
// `start` how far along its loop it begins (0 to 1). If it passes over you
// and you aren't keeping still in a leaf pile, it's seen you: the room starts
// again from the door you came in by. You can't fight it. Not yet.
//
// `sound: true` (the Deep's Crawl) makes it a blind thing that hunts by
// ear: no beast's shape, just rings of sound spreading over the floor from
// where it is, drawn over the dark so you can read them from far off. The
// outer ring is exactly how far it hears. `caught` names the text sections
// ({ first, again } in the room's own text file) said when it finds you.

const DEFAULT_SPEED = 34;
const DEFAULT_RADIUS = 30;
// How long each step of its walk shows, in the shadow.
const SHADOW_STEP = 0.22;
// Where its eye is in the beast's shape (src/data/art/hushBeast.js, 64x40).
const EYE = { x: 12.5, y: 20 };

// The beast's shape, as the shadow it throws: its walk, frame by frame,
// anything but air painted dark. Built once.
let shapeFrames = null;
function shadowShapes() {
  if (shapeFrames) return shapeFrames;
  shapeFrames = HUSH_SHAPES.map((rows) => {
    const canvas = document.createElement('canvas');
    canvas.width = rows[0].length;
    canvas.height = rows.length;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#04020a';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] !== '.') ctx.fillRect(x, y, 1, 1);
    });
    return canvas;
  });
  return shapeFrames;
}

// The shape (facing left as drawn), huge and soft-edged, `scale` times its
// size and squashed a little, centred on (0, 0); `dir` 1 flips it to face right.
function drawShape(ctx, frame, scale, dir, alpha) {
  const w = frame.width * scale;
  const h = frame.height * scale * 0.8;
  ctx.save();
  ctx.scale(dir === 1 ? -1 : 1, 1);
  ctx.globalAlpha = alpha * 0.35;
  for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) ctx.drawImage(frame, -w / 2 + dx, -h * 0.55 + dy, w, h);
  ctx.globalAlpha = alpha;
  ctx.drawImage(frame, -w / 2, -h * 0.55, w, h);
  ctx.restore();
}

export class HushShadow {
  constructor({ path, speed = DEFAULT_SPEED, radius = DEFAULT_RADIUS, start = 0, across = null, sound = false }) {
    this.across = across;
    this.sound = sound;
    this.points = path.map(([x, y, pause = 0]) => ({ x: (x + 0.5) * T, y: (y + 0.5) * T, pause }));
    this.speed = speed;
    this.radius = radius;
    // The way it faces: -1 left (as its shape is drawn), 1 right.
    this.dir = -1;
    // Lengths of each leg of the loop, and the whole way round.
    this.legs = this.points.map((p, i) => {
      const q = this.points[(i + 1) % this.points.length];
      return Math.hypot(q.x - p.x, q.y - p.y);
    });
    this.loop = this.legs.reduce((a, b) => a + b, 0);
    this.reset(start);
    this.time = 0;
  }

  reset(start = 0) {
    this.leg = 0;
    this.along = 0;
    this.waiting = 0;
    // Start partway round, if asked.
    let left = start * this.loop;
    while (left > this.legs[this.leg] && this.leg < this.legs.length - 1) {
      left -= this.legs[this.leg];
      this.leg++;
    }
    this.along = left;
    this.place();
  }

  // Where it is now, from which leg it's on and how far along.
  place() {
    const p = this.points[this.leg];
    const q = this.points[(this.leg + 1) % this.points.length];
    const k = this.legs[this.leg] ? this.along / this.legs[this.leg] : 0;
    this.x = p.x + (q.x - p.x) * k;
    this.y = p.y + (q.y - p.y) * k;
    this.heading = Math.atan2(q.y - p.y, q.x - p.x);
    // Going mostly up or down it keeps facing the way it was.
    if (Math.abs(Math.cos(this.heading)) > 0.3) this.dir = Math.cos(this.heading) > 0 ? 1 : -1;
  }

  update(dt) {
    this.time += dt;
    if (this.waiting > 0) {
      this.waiting -= dt;
      return;
    }
    this.along += this.speed * dt;
    while (this.along >= this.legs[this.leg]) {
      this.along -= this.legs[this.leg];
      this.leg = (this.leg + 1) % this.points.length;
      const pause = this.points[this.leg].pause;
      if (pause > 0) {
        this.waiting = pause;
        this.along = 0;
        break;
      }
    }
    this.place();
  }

  // Whether it's listening (stopped on a waypoint): it sees further then.
  get listening() {
    return this.waiting > 0;
  }

  // Whether a point (feet, in world pixels) is under it.
  covers(x, y) {
    const reach = this.radius * (this.listening ? 1.15 : 1);
    if (!this.across) return Math.hypot(x - this.x, y - this.y) < reach;
    // Wide: so far along the way it's going, and `across` to either side.
    const dx = x - this.x;
    const dy = y - this.y;
    const along = dx * Math.cos(this.heading) + dy * Math.sin(this.heading);
    const side = -dx * Math.sin(this.heading) + dy * Math.cos(this.heading);
    return Math.abs(along) < reach && Math.abs(side) < this.across;
  }

  // How close it is to a point, 0 (far) to 1 (on top of it): for the dread.
  nearness(x, y) {
    return Math.max(0, Math.min(1, 1 - (Math.hypot(x - this.x, y - this.y) - this.radius) / (this.radius * 4)));
  }

  // A great soft dark going over, longer than it's wide along the way it's
  // going, and in it the beast's own shape, thrown down off the rooftops:
  // bigger than a cart, hunched, hackles up, walking. When it stops to
  // listen it stands, breathes, and the ember of its eye opens.
  draw(ctx, camera) {
    if (this.sound) return;
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    const breathe = this.listening ? 1 + Math.sin(this.time * 3) * 0.05 : 1;
    const r = this.radius * 1.9 * breathe;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.heading);
    // A wide one spreads right across the way it's going.
    ctx.scale(1.4, this.across ? (this.across * 1.15) / r : 0.8);
    const shade = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    shade.addColorStop(0, 'rgba(4, 2, 10, 0.6)');
    shade.addColorStop(0.55, 'rgba(4, 2, 10, 0.4)');
    shade.addColorStop(1, 'rgba(4, 2, 10, 0)');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const frames = shadowShapes();
    const frame = frames[this.listening ? 0 : Math.floor(this.time / SHADOW_STEP) % frames.length];
    const scale = (this.radius * 3.4 * breathe) / frame.width;
    const bob = this.listening ? 0 : Math.sin(this.time * (Math.PI / SHADOW_STEP)) * 1.2;
    ctx.save();
    ctx.translate(cx, cy + bob);
    drawShape(ctx, frame, scale, this.dir, 0.66);
    ctx.restore();
    if (this.listening) {
      // Its eye: an ember, with a little light round it.
      // Where the eye lands: the shape is drawn from (-w/2, -h*0.55),
      // mirrored when it faces right (see drawShape).
      const w = frame.width * scale;
      const h = frame.height * scale * 0.8;
      const ex = cx + (this.dir === 1 ? -1 : 1) * (EYE.x * scale - w / 2);
      const ey = cy + EYE.y * scale * 0.8 - h * 0.55;
      const glow = ctx.createRadialGradient(ex, ey, 1, ex, ey, 9);
      glow.addColorStop(0, 'rgba(232, 134, 44, 0.45)');
      glow.addColorStop(1, 'rgba(232, 134, 44, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(ex - 9, ey - 9, 18, 18);
      ctx.fillStyle = 'rgba(240, 150, 50, 0.95)';
      ctx.fillRect(Math.round(ex) - 2, Math.round(ey) - 1, 4, 2);
      ctx.fillStyle = 'rgba(255, 240, 176, 0.9)';
      ctx.fillRect(Math.round(ex) - 2, Math.round(ey) - 1, 1, 1);
    }
  }

  // The blind hunter's sound, drawn over the dark: rings spreading out from
  // it, quick and small when it pads along, slow and wide when it stops to
  // listen. The edge of the widest ring is the edge of what it hears.
  drawSound(ctx, camera) {
    if (!this.sound) return;
    const cx = this.x - camera.x;
    const cy = this.y - camera.y;
    const reach = this.radius * (this.listening ? 1.15 : 1);
    const period = this.listening ? 1.6 : 0.8;
    ctx.save();
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const k = ((this.time / period + i / 3) % 1);
      ctx.strokeStyle = `rgba(150, 190, 235, ${(0.5 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, reach * (0.15 + 0.85 * k), reach * (0.15 + 0.85 * k) * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // A pale smudge at the middle: where it is.
    const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 9);
    glow.addColorStop(0, `rgba(190, 215, 245, ${this.listening ? 0.5 : 0.3})`);
    glow.addColorStop(1, 'rgba(190, 215, 245, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 9, cy - 9, 18, 18);
    ctx.restore();
  }

  // Drawn over everything on the floor (it's a shadow from above).
  get sortY() {
    return Infinity;
  }
}

// THE SENTRY (the Deep's Crawl): the same blind hunter, but one that stands
// guard instead of walking its loop. It waits on its `post` (an index into
// `path`) listening, and only moves when something makes a noise:
//
//   hush: { sound: true, post: 3, path: [[x, y], ...], speed, radius, caught }
//
// A prop with `lure: { to: <index into path>, hold: <seconds> }` (loose scree
// you can kick, see OverworldScene.kickScree) sends it off round the loop the
// short way to that waypoint, where it stands listening for `hold` seconds,
// and then it walks back to its post. With `stay: true` instead of `hold` it
// stays where the noise was until something else is kicked (or you're caught). A ring of sound shows on the floor
// where the noise was made, so you can see what it heard. Nothing else about
// it changes: same rings, same reach, same hollows to hide in.
export class SoundHunter extends HushShadow {
  constructor(data) {
    super({ ...data, sound: true });
    this.post = data.post ?? 0;
    this.pings = [];
    this.reset();
  }

  // Cumulative distance round the loop to each waypoint.
  get marks() {
    if (!this.cum) {
      let at = 0;
      this.cum = this.legs.map((len) => { const here = at; at += len; return here; });
    }
    return this.cum;
  }

  reset() {
    this.s = this.marks[this.post ?? 0] ?? 0;
    this.mode = 'post';
    this.target = this.post ?? 0;
    this.hold = 0;
    this.waiting = 0;
    this.pings = [];
    this.placeAt();
  }

  // Put it where `s` (distance round the loop) says.
  placeAt() {
    const loop = this.loop;
    this.s = ((this.s % loop) + loop) % loop;
    let leg = 0;
    while (leg < this.legs.length - 1 && this.s >= this.marks[leg] + this.legs[leg]) leg++;
    const along = this.s - this.marks[leg];
    const p = this.points[leg];
    const q = this.points[(leg + 1) % this.points.length];
    const k = this.legs[leg] ? along / this.legs[leg] : 0;
    this.x = p.x + (q.x - p.x) * k;
    this.y = p.y + (q.y - p.y) * k;
    this.heading = Math.atan2(q.y - p.y, q.x - p.x);
  }

  // Something clinked at waypoint `index`: go and listen there for `hold` seconds.
  lure(index, hold) {
    // (A new noise breaks off whatever it was listening to.)
    this.waiting = 0;
    this.mode = 'going';
    this.target = index;
    this.hold = hold;
  }

  // A ring on the floor where a noise was made (world pixels).
  ping(x, y) {
    this.pings.push({ x, y, t: 0 });
  }

  // Walk `step` pixels the short way round to loop distance `goal`; true on arrival.
  walkTo(goal, step) {
    const loop = this.loop;
    let ahead = (((goal - this.s) % loop) + loop) % loop;
    const way = ahead <= loop / 2 ? 1 : -1;
    const left = way === 1 ? ahead : loop - ahead;
    if (left <= step) {
      this.s = goal;
      return true;
    }
    this.s += way * step;
    return false;
  }

  update(dt) {
    this.time += dt;
    for (const ping of this.pings) ping.t += dt;
    this.pings = this.pings.filter((ping) => ping.t < 1.4);
    if (this.waiting > 0) {
      this.waiting -= dt;
      if (this.waiting <= 0 && this.mode === 'holding') this.mode = 'back';
      return;
    }
    if (this.mode === 'going') {
      if (this.walkTo(this.marks[this.target], this.speed * dt)) {
        this.mode = 'holding';
        this.waiting = this.hold;
      }
    } else if (this.mode === 'back') {
      if (this.walkTo(this.marks[this.post], this.speed * dt)) this.mode = 'post';
    }
    this.placeAt();
  }

  // Standing still at its post, or at the end of a lure, it listens.
  get listening() {
    return this.mode === 'post' || this.mode === 'holding';
  }

  drawSound(ctx, camera) {
    super.drawSound(ctx, camera);
    // The noise that sent it: a ring spreading from the spot, then gone.
    ctx.save();
    ctx.lineWidth = 1;
    for (const ping of this.pings) {
      const k = Math.min(1, ping.t / 1.2);
      ctx.strokeStyle = `rgba(235, 215, 170, ${(0.7 * (1 - k)).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(ping.x - camera.x, ping.y - camera.y, 3 + 26 * k, (3 + 26 * k) * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// The Hush rising: its shadow standing up over the rooftops at the well, for
// the cutscene that ends the Hushwood ('proc:hush' as an actor's look; see
// lookSprite in scenePlayer.js). Never the beast itself: just its shape, far
// bigger than a house, and its eyes.
let hushFigure = null;
export function hushFigureSprite() {
  if (hushFigure) return hushFigure;
  const w = 120;
  const h = 96;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#06030c';
  // Hunched shoulders, a long low head, ears laid back: rough enough to be
  // anything big, in pixels so it sits with the rest of the art.
  const fill = (x, y, cw, ch) => ctx.fillRect(Math.round(x), Math.round(y), Math.round(cw), Math.round(ch));
  const blob = (ox, oy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const span = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y / ry) ** 2)));
      fill(ox - span, oy + y, span * 2, 1);
    }
  };
  blob(60, 78, 58, 30); // the bulk, its back and shoulders
  blob(60, 46, 26, 22); // the head, lifting
  blob(34, 58, 18, 20); // a shoulder
  blob(86, 58, 18, 20); // the other
  // Ears, laid back, and ragged fur along the back.
  for (const [x, dir] of [[44, -1], [76, 1]]) {
    for (let i = 0; i < 16; i++) fill(x + dir * i * 0.7, 28 - i, 6 - i * 0.3, 2);
  }
  for (let i = 0; i < 24; i++) {
    const x = 6 + i * 4.6;
    const top = 50 + Math.abs(i - 12) * 1.6;
    fill(x, top - 4 - (i % 3) * 2, 2, 6);
  }
  // Its eyes: pale, wide-set, not quite level.
  ctx.fillStyle = '#dce2ff';
  fill(48, 46, 4, 2);
  fill(69, 45, 4, 2);
  ctx.fillStyle = '#ffffff';
  fill(49, 46, 2, 1);
  fill(70, 45, 2, 1);
  hushFigure = canvas;
  return hushFigure;
}

// The Hush's shadow going over, as a cutscene actor ('proc:shadow'): a soft
// dark blot, longer than it's wide, with the beast's shape in it, for scenes
// where it passes over (the_shadow_passes). Drawn once, facing right like
// any actor's sprite (the scene flips it to face the way it walks).
let shadowBlot = null;
export function hushShadowSprite() {
  if (shadowBlot) return shadowBlot;
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.translate(60, 32);
  ctx.save();
  ctx.scale(1.8, 1);
  const shade = ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
  shade.addColorStop(0, 'rgba(4, 2, 10, 0.62)');
  shade.addColorStop(0.65, 'rgba(4, 2, 10, 0.4)');
  shade.addColorStop(1, 'rgba(4, 2, 10, 0)');
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawShape(ctx, shadowShapes()[0], 1.6, 1, 0.66);
  shadowBlot = canvas;
  return shadowBlot;
}
