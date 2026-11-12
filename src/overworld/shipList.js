// THE SHIP'S LIST (Chapter 5, the ghost ship: the brig Fair Return). The whole ship leans one way
// or the other, PORT or STARBOARD, and every room aboard leans with her. A room that has a `list`
// field has two maps of the same size: its `tiles` are the PORT map, `list.star` the STARBOARD one.
// Turning the ship (a helm, a trimming line, a ballast crank: any prop with `listWheel`) swaps the
// tiles that differ, a few at a time like the tide in tides.js (this is the same engine, with the
// two states renamed: port is 'high', starboard is 'low' underneath, and the state is saved under
// the group `ship_list` so it is ONE list for the whole ship, kept in every save).
//
// What leans with it:
//   * the picture (the whole view tips about a degree and a quarter and rolls a little, always)
//   * the tiles (`list.star` against `tiles`)
//   * loose cargo: a prop with `loose: { port: [tx, ty], star: [tx, ty] }` is a barrel, a crate, a
//     cannon, a ballast pig that slides from one spot to the other when the list changes (solid at
//     rest, never in your way while it moves). `weighs: true` also lets it press a treadle it comes
//     to rest on. A body in its landing place makes it wait.
//   * a room with no `list.star` at all still tips and rolls (the plank, the cabin)
//
// Room field:
//   list: { star: [ ...rows... ],   // the STARBOARD map (a space is "same as port"); leave out for none
//           creep: 1.6 }            // seconds the tiles take (default 1.6)
// Props:
//   { sprite: 'gs_helm', x, y, listWheel: { to: 'toggle', port: 'section', star: 'section', busy: 'section' } }
//   { sprite: 'c5_barrel', x, y, loose: { port: [5, 6], star: [5, 12] } }   (put x, y at the start)
// Play script (tools/preview.html): `list:port|star|toggle`, `listsettle`, `expect:list:port|star`.
import { TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { RoomTide, Tides } from './tides.js';
import { textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { inUiSpace } from '../engine/screen.js';

export const LIST_GROUP = 'ship_list';
const NAME = { high: 'port', low: 'star' };
const STATE = { port: 'high', star: 'low' };
// How far the picture leans (radians), and how much it grows so the corners stay covered.
export const TILT = 0.021;
const ZOOM = 1.045;

// A room's `list` as a tide field.
export function listAsTide(data) {
  const star = data.list.star ?? data.tiles.map((row) => ' '.repeat(row.length));
  return { low: star, start: 'high', group: LIST_GROUP, creep: data.list.creep ?? 1.6, wait: 3, hud: false };
}

export class RoomList extends RoomTide {
  constructor(room, data) {
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
    this.seconds = spec.seconds ?? 1.3;
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
      this.loose.forEach((l, i) => l.start(rt.state, 0.25 + i * 0.12));
      this.creakIn = 8;
    }
    // The ship's own noises: now and then a groan, whatever you do.
    const paused = s.textbox.isOpen || s.cutscene || s.doorway || s.caught;
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
      l.t = Math.min(1, l.t + dt / l.seconds);
      // Sliding downhill: slow, then faster, a small bump at the end.
      const k = l.t * l.t * (3 - 2 * l.t);
      const bump = l.t > 0.9 ? Math.sin((l.t - 0.9) * 10 * Math.PI) * 0.6 * (1 - l.t) : 0;
      l.prop.x = Math.round(l.from.x + (l.to.x - l.from.x) * k);
      l.prop.y = Math.round(l.from.y + (l.to.y - l.from.y) * k + bump);
      if (l.t >= 1) {
        l.prop.x = l.to.x;
        l.prop.y = l.to.y;
        sfx('push');
        landed = true;
        l.finish = true;
      }
    }
    if (landed) {
      room.settleTreadles?.(bodies);
      room.refreshPuzzles(bodies);
    }
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

  // Lays that canvas on the screen, tipped and a little larger so the corners stay covered.
  endTilt(main) {
    const w = this.off.width;
    const h = this.off.height;
    main.save();
    main.setTransform(1, 0, 0, 1, 0, 0);
    main.imageSmoothingEnabled = true;
    main.imageSmoothingQuality = 'high';
    main.translate(w / 2, h / 2);
    main.rotate(this.angle + this.roll);
    main.scale(ZOOM, ZOOM);
    main.drawImage(this.off, -w / 2, -h / 2);
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
    this.set(want);
    say(want === 'port' ? (cfg.port ?? 'The ship groans and leans to port.') : (cfg.star ?? 'The ship groans and leans to starboard.'));
    return true;
  }

  // A small gauge top right: which way she leans.
  drawHud(ctx) {
    const s = this.scene;
    if (s.cutscene) return;
    const to = this.now;
    const moving = Boolean(this.rt.anim);
    inUiSpace(ctx, () => {
      const w = 158;
      const h = 34;
      const x = 640 - 16 - w;
      const y = s.roomData.dark ? 40 : 10;
      ctx.fillStyle = 'rgba(10, 12, 14, 0.7)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#7a8a86';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
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
      drawText(ctx, moving ? 'LEANING' : `${to === 'port' ? 'PORT' : 'STARBOARD'} LIST`, x + 42, y + 7, { size: 20, color: '#cfd8d0', outline: '#000' });
    });
  }

  // One line for the play script report.
  describe() {
    const l = this.loose.map((q) => `${q.prop.x / T},${q.prop.y / T}${q.moving ? '(sliding)' : ''}`).join(' ');
    return `list ${this.rt.anim ? `-> ${NAME[this.rt.anim.to]} (leaning)` : NAME[this.rt.state]}${l ? ` loose ${l}` : ''}`;
  }
}

// The list for rooms that name none (a save from before it existed): port.
export function savedList() {
  return NAME[WORLD_STATE.tides?.[LIST_GROUP] ?? 'high'];
}
