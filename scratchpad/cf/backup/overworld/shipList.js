// THE SHIP'S LIST (Chapter 5, the ghost ship: the brig Fair Return). The whole ship leans one way
// or the other, PORT or STARBOARD, and every room aboard leans with her. A room that has a `list`
// field has two maps of the same size: its `tiles` are the PORT map, `list.star` the STARBOARD one.
// Turning the ship (a helm, a trimming line, a ballast crank: any prop with `listWheel`) swaps the
// tiles that differ, a few at a time like the tide in tides.js (this is the same engine, with the
// two states renamed: port is 'high', starboard is 'low' underneath, and the state is saved under
// the group `ship_list` so it is ONE list for the whole ship, kept in every save).
//
// What leans with it:
//   * the view shudders when she goes over (the picture used to tip; it stays square now, so the pixels stay crisp)
//   * the tiles (`list.star` against `tiles`)
//   * loose cargo: a prop with `loose: { port: [tx, ty], star: [tx, ty] }` is a barrel, a crate, a
//     cannon, a ballast pig that slides from one spot to the other when the list changes (solid at
//     rest, never in your way while it moves). `weighs: true` also lets it press a treadle it comes
//     to rest on. A body in its landing place makes it wait.
//   * a room with no `list.star` at all still creaks (the plank, the cabin); the gauge only shows in a
//     room where something leans: a wheel, loose cargo or her own lurching
//   * CAREENING cargo (`careen: true` on a loose prop): it goes fast, with a rumble and a jolt, and
//     whatever is in its lane is hit: you (or whoever you steer) are knocked out of the lane to the
//     side and lose a little HP (never the last of it); a monster is flattened for a few seconds and
//     can be walked past. Bramble and Ves following on behind are never hit.
//   * SHE LURCHES BY HERSELF (`list.lurch`): every `every` seconds of play (the clock stops for words,
//     scenes and doors) she goes over the other way on her own, with a creak and a shudder `warn`
//     seconds before. Water that comes over you washes you to the nearest dry boards, and costs a
//     little HP (the friends following are only washed across, never hurt).
//   * A wheel with `hold: n` throws her over for n seconds only: then she rolls back by herself (warned
//     the same way). The gauge shows how long she has left.
//   * A room's own lean (`list.own`): it isn't the ship's one list but the room's own, and starts the
//     way the room is drawn (port, or `list.start`) every time you come in, so nothing done elsewhere
//     can leave it the wrong way round.
//
// Room field:
//   list: { star: [ ...rows... ],   // the STARBOARD map (a space is "same as port"); leave out for none
//           creep: 1.6,             // seconds the tiles take (default 1.6)
//           wait: 3,                // seconds water waits for somebody to step off before it washes them off
//           own: true,              // this room's lean is its own (see above); start: 'port' | 'star'
//           lurch: { every: 4, warn: 1, first: 3 } }   // she goes over by herself (first: the first wait)
// Props:
//   { sprite: 'gs_helm', x, y, listWheel: { to: 'toggle', port: 'section', star: 'section', busy: 'section' } }
//   { sprite: 'gs_tackle', x, y, listWheel: { to: 'star', hold: 3.5, ... } }   (over for 3.5 s, then back)
//   { sprite: 'c5_barrel', x, y, loose: { port: [5, 6], star: [5, 12] } }   (put x, y at the start)
//   { sprite: 'gs_cannon', x, y, loose: { port: [12, 3], star: [12, 10], careen: true, stun: 5 } }
// Play script (tools/preview.html): `list:port|star|toggle`, `listsettle`, `expect:list:port|star`.
import { TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { RoomTide, Tides } from './tides.js';
import { textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { inUiSpace } from '../engine/screen.js';
import { heroHp, heroMaxHp, setHeroHp } from '../characters/progress.js';

export const LIST_GROUP = 'ship_list';
const NAME = { high: 'port', low: 'star' };
const STATE = { port: 'high', star: 'low' };
// How far the picture leans (radians), and how much it grows so the corners stay covered.
export const TILT = 0.021;
// (ZOOM, the grow that covered the corners of the tipped picture, went with the tip.)

// A room's `list` as a tide field.
export function listAsTide(data) {
  const cfg = data.list;
  const star = cfg.star ?? data.tiles.map((row) => ' '.repeat(row.length));
  const group = cfg.own ? `room:${data.id}` : LIST_GROUP;
  return { low: star, start: STATE[cfg.start ?? 'port'], group, creep: cfg.creep ?? 1.6, wait: cfg.wait ?? 3, hud: false };
}

export class RoomList extends RoomTide {
  constructor(room, data) {
    // A room with its own lean starts the way it's drawn, every time you come in (or load a save in it).
    if (data.list.own && WORLD_STATE.tides) delete WORLD_STATE.tides[`room:${data.id}`];
    super(room, { ...data, tide: listAsTide(data) });
    this.listData = data.list;
  }

  // Nothing floats on a ship's deck.
  crates() {
    return [];
  }

  get named() {
    return NAME[this.state];
  }
}

const ease = (t) => t * t * (3 - 2 * t);

function lines(file, v) {
  if (Array.isArray(v)) return v;
  try {
    return textSection(file, v);
  } catch {
    return [v];
  }
}

// A barrel (or a crate, or a gun) that slides from its port spot to its starboard spot.
class Loose {
  constructor(prop, spec, state) {
    this.prop = prop;
    this.spec = spec;
    this.from = null;
    this.to = null;
    this.t = 1;
    this.careen = Boolean(spec.careen);
    this.seconds = spec.seconds ?? (this.careen ? 0.55 : 1.3);
    this.place(state);
    prop.weighs = Boolean(spec.weighs);
    prop.looseMoving = false;
  }

  spot(state) {
    return this.spec[NAME[state]];
  }

  // At rest where the list wants it.
  place(state) {
    const [tx, ty] = this.spot(state);
    this.prop.x = tx * T;
    this.prop.y = ty * T;
    this.prop.walkable = false;
    this.t = 1;
  }

  // Start sliding to where the (new) list wants it.
  start(state, delay = 0) {
    const [tx, ty] = this.spot(state);
    this.from = { x: this.prop.x, y: this.prop.y };
    this.to = { x: tx * T, y: ty * T };
    this.t = 0;
    this.delay = delay;
    this.prop.looseMoving = true;
    this.prop.walkable = true;
    // Who it has hit this run (once each), and whether it has started rumbling.
    this.hit = new Set();
    this.rumbled = false;
  }

  get moving() {
    return this.t < 1;
  }
}

export class ShipList extends Tides {
  constructor(scene) {
    super(scene);
    this.angle = this.targetAngle();
    this.vel = 0;
    this.roll = 0;
    this.loose = [];
    this.looseBlocked = null;
    this.creakIn = 6 + Math.random() * 6;
    const info = scene.roomData.props ?? [];
    scene.room.allProps.forEach((p, i) => {
      if (info[i]?.loose) this.loose.push(new Loose(p, info[i].loose, this.rt.state));
    });
    // Her own lurching (list.lurch), and a wheel's roll back (`hold`): what she does next by herself.
    this.lurch = scene.roomData.list?.lurch ?? null;
    this.swing = null;
    if (this.lurch) this.armLurch(this.lurch.first ?? this.lurch.every);
    // Little "-3"s over you when you're hurt, and a breath between hurts.
    this.pops = [];
    this.hurtCool = 0;
    // The gauge only where something leans.
    this.shows = Boolean(this.lurch || this.loose.length || scene.room.allProps.some((p) => p.listWheel));
    // A treadle under a cask at the start reads as pressed from the first frame.
    scene.room.settleTreadles?.(this.bodies());
  }

  targetAngle() {
    return this.rt.state === 'high' ? -TILT : TILT;
  }

  // The list, as a word: 'port' or 'star' (where it is heading, while it moves).
  get now() {
    return NAME[this.rt.anim ? this.rt.anim.to : this.rt.state];
  }

  // Sets the list (a play script, a scene or a wheel). `to` is 'port', 'star' or 'toggle'.
  set(to) {
    const was = this.now;
    const want = to === 'toggle' ? (was === 'port' ? 'star' : 'port') : to;
    this.rt.begin(STATE[want]);
    return want;
  }

  call(to) {
    return this.set(to === 'high' ? 'port' : to === 'low' ? 'star' : to);
  }

  update(dt) {
    const rt = this.rt;
    const s = this.scene;
    if (rt.changedBy) {
      rt.changedBy = null;
      // The hull taking the weight: a long groan, then the cargo starts to go.
      sfx('shipGroan');
      // (Careening guns go all but at once.)
      this.loose.forEach((l, i) => l.start(rt.state, l.careen ? 0.15 + i * 0.04 : 0.25 + i * 0.12));
      this.creakIn = 8;
    }
    // The ship's own noises: now and then a groan, whatever you do.
    const paused = s.textbox.isOpen || s.cutscene || s.doorway || s.caught;
    this.hurtCool = Math.max(0, this.hurtCool - dt);
    for (const p of this.pops) p.t += dt;
    this.pops = this.pops.filter((p) => p.t < 1);
    this.updateSwing(dt, paused);
    if (!paused && !rt.busy && (this.creakIn -= dt) <= 0) {
      this.creakIn = 7 + Math.random() * 9;
      sfx(Math.random() < 0.35 ? 'shipGroan' : 'creak');
    }
    for (const p of s.room.props) if (p.listWheel && p.shake > 0) p.shake = Math.max(0, p.shake - dt);
    const stuck = rt.update(dt, this.bodies());
    for (const { body, tx, ty } of stuck) this.pushOut(body, tx, ty);
    if (rt.sinceDone < 1.2 && !rt.busy) this.rescue();
    this.updateLoose(dt);
    // The picture: a spring to the new tilt (it lurches a little past), and always a slow roll.
    const target = this.targetAngle();
    this.vel += (target - this.angle) * 26 * dt;
    this.vel *= Math.max(0, 1 - 4.2 * dt);
    this.angle += this.vel * dt;
    this.roll = Math.sin(s.time * 0.55) * 0.0035 + Math.sin(s.time * 1.3 + 1) * 0.0012;
  }

  updateLoose(dt) {
    const room = this.scene.room;
    const bodies = this.bodies();
    let landed = false;
    for (const l of this.loose) {
      if (!l.moving) {
        // Sitting where someone stood when it arrived: solid the moment they step out.
        if (l.prop.looseMoving) {
          const p = l.prop;
          const here = bodies.some((b) => b.x + 4 > p.x && b.x - 4 < p.x + p.width && b.y > p.y && b.y - 5 < p.y + T);
          if (!here) { p.looseMoving = false; p.walkable = false; landed = true; }
        }
        continue;
      }
      if (l.delay > 0) { l.delay -= dt; continue; }
      if (l.careen && !l.rumbled) {
        // Off it goes: a gun's trucks rumbling on the planks, and the deck jumps.
        l.rumbled = true;
        sfx('cannonball');
        this.scene.shakeCamera?.(3, 0.6);
      }
      l.t = Math.min(1, l.t + dt / l.seconds);
      // Sliding downhill: slow, then faster, a small bump at the end. Careening: faster all the way.
      const k = l.careen ? l.t * l.t : l.t * l.t * (3 - 2 * l.t);
      const bump = l.t > 0.9 ? Math.sin((l.t - 0.9) * 10 * Math.PI) * 0.6 * (1 - l.t) : 0;
      l.prop.x = Math.round(l.from.x + (l.to.x - l.from.x) * k);
      l.prop.y = Math.round(l.from.y + (l.to.y - l.from.y) * k + bump);
      if (l.careen) this.careenHits(l);
      if (l.t >= 1) {
        l.prop.x = l.to.x;
        l.prop.y = l.to.y;
        sfx(l.careen ? 'boom' : 'push');
        if (l.careen) this.scene.shakeCamera?.(2, 0.3);
        landed = true;
        l.finish = true;
      }
    }
    if (landed) {
      room.settleTreadles?.(bodies);
      room.refreshPuzzles(bodies);
    }
  }

  armLurch(seconds) {
    this.swing = { left: seconds, total: seconds, to: 'toggle', warn: this.lurch.warn ?? 1 };
  }

  // She goes over by herself: a lurch (list.lurch) or a wheel's roll back (`hold`). Waits while words are up
  // and while she is still moving; warns (a creak and a shudder) `warn` seconds before.
  updateSwing(dt, paused) {
    const s = this.scene;
    const still = !this.rt.busy && !this.loose.some((l) => l.moving);
    if (this.reactLater && !paused && still) {
      // The first time she ever went over by herself: Bramble and Ves catch up with it, once she's settled.
      const key = this.reactLater;
      this.reactLater = null;
      s.queueReactions?.(s.roomData.textFile, key);
      const go = s.afterText;
      s.afterText = null;
      go?.();
    }
    const sw = this.swing;
    if (!sw || paused || !still) return;
    sw.left -= dt;
    if (!sw.warned && sw.left <= sw.warn) {
      sw.warned = true;
      sfx('creak');
      s.shakeCamera?.(1, sw.warn);
    }
    if (sw.left > 0) return;
    this.swing = null;
    const want = sw.to === 'toggle' ? (this.now === 'port' ? 'star' : 'port') : sw.to;
    if (want !== this.now) {
      s.shakeCamera?.(3, 0.8);
      this.set(want);
      WORLD_STATE.read ??= [];
      if (this.lurch && !WORLD_STATE.read.includes('ship:first_lurch')) {
        WORLD_STATE.read.push('ship:first_lurch');
        this.reactLater = 'ship_first_lurch';
      }
    }
    if (this.lurch) this.armLurch(this.lurch.every);
  }

  // A careening gun (or shot) on its way: whoever is in its lane is hit, once a run.
  careenHits(l) {
    const s = this.scene;
    const p = l.prop;
    const box = [p.x + 1, p.y + 1, p.x + p.width - 1, p.y + T - 1];
    const inBox = (x, y) => x + 5 > box[0] && x - 5 < box[2] && y > box[1] && y - 6 < box[3];
    for (const body of [s.player, ...s.others].filter(Boolean)) {
      if (l.hit.has(body) || body.isAirborne || !inBox(body.x, body.y)) continue;
      l.hit.add(body);
      this.knock(body, l);
    }
    for (const npc of s.npcs ?? []) {
      if (l.hit.has(npc) || npc.dormant || !inBox(npc.x, npc.y)) continue;
      l.hit.add(npc);
      // Flattened: it lies there a while, and you can walk past it.
      npc.stunned = l.spec.stun ?? 5;
      npc.chasing = false;
      sfx('thud');
    }
  }

  // Knocked out of a careening gun's lane, to the nearest clear tile at the side, and hurt a little.
  knock(body, l) {
    const s = this.scene;
    const room = s.room;
    const p = l.prop;
    const across = Math.abs(l.to.x - l.from.x) < Math.abs(l.to.y - l.from.y);
    const side = Math.sign(across ? body.x - (p.x + p.width / 2) : body.y - (p.y + T)) || -1;
    const lane = [Math.min(l.from.x, l.to.x), Math.min(l.from.y, l.to.y), Math.max(l.from.x, l.to.x) + p.width, Math.max(l.from.y, l.to.y) + T];
    const inLane = (x, y) => x + 5 > lane[0] && x - 5 < lane[2] && y > lane[1] && y - 6 < lane[3];
    const free = (x, y) => !(body.collidesAt ? body.collidesAt(room, x, y) : room.collides(x - 5, y - 6, x + 5, y)) && !inLane(x, y);
    let spot = null;
    for (let d = 1; d <= 4 && !spot; d++) {
      for (const k of [side, -side]) {
        const x = across ? (Math.floor(body.x / T) + k * d) * T + T / 2 : body.x;
        const y = across ? body.y : (Math.floor((body.y - 1) / T) + k * d + 1) * T;
        if (free(x, y)) { spot = { x, y }; break; }
      }
    }
    if (spot) {
      body.x = spot.x;
      body.y = spot.y;
    }
    if (body === s.player) s.unstick?.();
    this.hurt(body, 'hit');
  }

  // A little HP gone (never the last of it), a jolt, and a "-3" over you. Only ever you, never the friends behind.
  hurt(body, how) {
    const s = this.scene;
    if (body !== s.player && !s.others.includes(body)) return;
    s.shakeCamera?.(how === 'hit' ? 4 : 2, 0.4);
    if (this.hurtCool > 0) return;
    this.hurtCool = 1;
    const before = heroHp();
    setHeroHp(Math.max(1, before - Math.max(2, Math.round(heroMaxHp() * 0.04))));
    const lost = before - heroHp();
    sfx('hurt');
    if (lost > 0) this.pops.push({ text: `-${lost}`, x: body.x, y: body.y - 30, t: 0 });
    // The first time each way (once a save), Bramble and Ves catch up with it once she's settled.
    const key = how === 'hit' ? 'ship_careen_hit' : 'ship_washed';
    WORLD_STATE.read ??= [];
    if (!WORLD_STATE.read.includes(`ship:${key}`) && !this.reactLater) {
      WORLD_STATE.read.push(`ship:${key}`);
      this.reactLater = key;
    }
  }

  // Water coming over somebody: washed to the nearest dry boards (Tides.pushOut), and hurt a little where she lurches.
  pushOut(body, tx, ty) {
    super.pushOut(body, tx, ty);
    if (this.lurch) this.hurt(body, 'wash');
  }

  // The picture tilts: call before the room is drawn, and `endTilt` after the world is drawn.
  // Returns the context to draw the world on (an offscreen canvas the size of the screen, same transform).
  beginTilt(main) {
    const m = main.getTransform();
    const w = Math.round(640);
    const h = Math.round(480);
    this.off ??= Object.assign(document.createElement('canvas'), { width: w, height: h });
    const c = this.off.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, w, h);
    c.imageSmoothingEnabled = false;
    c.setTransform(m);
    return c;
  }

  // Lays that canvas on the screen. (12 November: no longer tipped. A tipped picture had to be smoothed,
  // and smoothed pixel art read as fuzzy planks; the lean now shows in the tiles, the sliding cargo,
  // the gauge and a shudder of the camera when she goes over: see use(). `angle` and `roll` are kept
  // for the gauge.)
  endTilt(main) {
    main.save();
    main.setTransform(1, 0, 0, 1, 0, 0);
    main.imageSmoothingEnabled = false;
    main.drawImage(this.off, 0, 0);
    main.restore();
  }

  use(prop) {
    const spec = prop.listWheel;
    if (!spec) return false;
    const cfg = typeof spec === 'object' ? spec : {};
    const rt = this.rt;
    const s = this.scene;
    const file = s.roomData.textFile;
    const say = (v) => s.textbox.open(lines(file, v), null);
    if (rt.busy) {
      sfx('back');
      say(cfg.busy ?? 'It will not move while the ship is still leaning over.');
      return true;
    }
    const was = this.now;
    const to = cfg.to ?? 'toggle';
    const want = to === 'toggle' ? (was === 'port' ? 'star' : 'port') : to;
    if (want === was) {
      sfx('select');
      say(cfg.already ?? 'She is leaning that way as far as she goes.');
      return true;
    }
    sfx('door');
    prop.shake = 0.5;
    // She goes over: the view shudders (the picture itself stays square and crisp).
    s.shakeCamera?.(2, 0.7);
    this.set(want);
    // Thrown over for a moment only: she rolls back by herself (`hold` seconds, counted once the words are read).
    if (cfg.hold) this.swing = { left: cfg.hold, total: cfg.hold, to: was, warn: cfg.warn ?? 1 };
    say(want === 'port' ? (cfg.port ?? 'The ship groans and leans to port.') : (cfg.star ?? 'The ship groans and leans to starboard.'));
    // The very first time she goes over by your hand (once a save): Bramble and Ves catch up with what
    // just happened, after the words ([ship_first_lean_bramble], [ship_first_lean_ves] in the room's text file).
    WORLD_STATE.read ??= [];
    if (!WORLD_STATE.read.includes('ship:first_lean')) {
      WORLD_STATE.read.push('ship:first_lean');
      s.queueReactions?.(file, 'ship_first_lean');
    }
    return true;
  }

  // A small gauge top right: which way she leans.
  drawHud(ctx) {
    const s = this.scene;
    if (s.cutscene) return;
    this.drawPops(ctx);
    if (!this.shows) return;
    const to = this.now;
    const moving = Boolean(this.rt.anim) || this.loose.some((l) => l.moving);
    const sw = this.swing;
    const warn = Boolean(sw?.warned) && !moving;
    const flash = Math.floor(performance.now() / 200) % 2 === 0;
    inUiSpace(ctx, () => {
      const w = 182;
      const h = 34;
      const x = 640 - 16 - w;
      const y = s.roomData.dark ? 40 : 10;
      ctx.fillStyle = 'rgba(10, 12, 14, 0.7)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = warn && flash ? '#ff7a5c' : '#7a8a86';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      // How long till she goes over by herself (a lurch, or rolling back off a wheel).
      if (sw && !moving) {
        ctx.fillStyle = '#1a2422';
        ctx.fillRect(x + 42, y + 26, w - 66, 4);
        ctx.fillStyle = warn ? '#ff7a5c' : '#a8b8a0';
        ctx.fillRect(x + 42, y + 26, Math.round((w - 66) * Math.max(0, Math.min(1, sw.left / (sw.total || 1)))), 4);
      }
      // A little hull, leaning with her.
      ctx.save();
      ctx.translate(x + 22, y + 18);
      ctx.rotate((this.angle / TILT) * 0.32);
      ctx.fillStyle = '#a89a80';
      ctx.fillRect(-12, 2, 24, 5);
      ctx.fillStyle = '#6a5a44';
      ctx.fillRect(-1, -10, 2, 12);
      ctx.fillStyle = '#c8c0a8';
      ctx.fillRect(1, -9, 7, 8);
      ctx.restore();
      drawText(ctx, moving ? 'LEANING' : warn ? 'HOLD ON' : `${to === 'port' ? 'PORT' : 'STARBOARD'} LIST`, x + 42, y + (sw && !moving ? 3 : 7), { size: 20, color: warn && flash ? '#ff9a80' : '#cfd8d0', outline: '#000' });
      // Which way loose things roll: up the screen (north) to port, down (south) to starboard.
      const ax = x + w - 16;
      const ay = y + h / 2;
      const up = to === 'port';
      ctx.fillStyle = '#e8d890';
      ctx.fillRect(ax - 2, up ? ay - 2 : ay - 9, 4, 11);
      ctx.beginPath();
      ctx.moveTo(ax - 7, up ? ay - 2 : ay + 2);
      ctx.lineTo(ax + 7, up ? ay - 2 : ay + 2);
      ctx.lineTo(ax, up ? ay - 11 : ay + 11);
      ctx.closePath();
      ctx.fill();
    });
  }

  // The "-3"s, rising and fading over you.
  drawPops(ctx) {
    if (!this.pops.length) return;
    const cam = this.scene.camera;
    inUiSpace(ctx, () => {
      for (const p of this.pops) {
        ctx.globalAlpha = Math.max(0, 1 - p.t);
        drawText(ctx, p.text, (p.x - cam.x) * 2, (p.y - cam.y - p.t * 10) * 2, { size: 20, color: '#ff8a7a', align: 'center', outline: '#000' });
      }
      ctx.globalAlpha = 1;
    });
  }

  // One line for the play script report.
  describe() {
    const l = this.loose.map((q) => `${q.prop.x / T},${q.prop.y / T}${q.moving ? '(sliding)' : ''}`).join(' ');
    const sw = this.swing ? ` swing ${this.swing.left.toFixed(1)}s` : '';
    return `list ${this.rt.anim ? `-> ${NAME[this.rt.anim.to]} (leaning)` : NAME[this.rt.state]}${sw}${l ? ` loose ${l}` : ''} hp ${heroHp()}`;
  }
}

// The list for rooms that name none (a save from before it existed): port.
export function savedList() {
  return NAME[WORLD_STATE.tides?.[LIST_GROUP] ?? 'high'];
}
