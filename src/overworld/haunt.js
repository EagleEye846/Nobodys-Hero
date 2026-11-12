// THE HAUNTING (Chapter 5, the ghost ship: the brig Fair Return). Everything about the ship that is
// not the list (shipList.js): the lantern, what the lantern shows, the things that watch and move
// and play, and the slow dread under all of it. Nothing here ever jumps out: no sudden loud sound,
// no face that pops up. The ship is made frightening by what has been moved since you looked, by
// the light going low, by a tune with nobody playing it.
//
// THE LANTERN. Once you hold the Ship's Lantern (the keepsake `ship_lantern`), L (or the pad's back
// button) puts it out and lights it again. Lit, it opens a pool of light round you (a bigger hole in
// the room's dark) and does three things to what is in the pool:
//   * props with `haunt: { kind: 'unseen' }` (footprints, a handprint, writing, a latch, a hidden
//     door) and `{ kind: 'ghost' }` (a ghost, drawn see-through) can only be seen, and used, in the light
//   * a monster in the room's `npcs` with `lantern: 'freeze'` stops dead while the light is on it;
//     `'flee'` backs away from the light; `'unseen'` can't be seen outside it (a sleeper too: see `dormant`)
//   * furniture with `haunt: { kind: 'shift', at: [[x, y], ...] }` moves on while the lantern has been out
//     for a few seconds, or between visits, so the room is not as you left it
// THE REST (all room-level, in a room's `haunt` field):
//   haunt: { whispers: ['...is it morning...', ...],  // faint words that drift up near you now and then
//            dips: true,                              // the lights go low every so often (default true)
//            selfPlay: { set: 'ship', every: 24, range: 9 } }  // a chime set that plays its own tune
// Props:
//   haunt: { kind: 'eyes', eyes: [[x, y], [x, y]] }   a portrait whose eyes follow you (pupils are
//                                                     painted over the two pixels given, in the sprite's own pixels)
// A scene can do any of it: { do: 'haunt', wake: 'name' | lantern: 'on'|'off' | dip: 2 | whisper: '...' | list: 'star' }.
// Play script: `lantern:on|off`, `expect:lit:x,y`, `expect:seen:x,y` (a haunt prop is showing).
import { TILE_SIZE as T } from '../config.js';
import { hasGear } from '../data/gear.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { music, sfx } from '../audio/music.js';
import { CHIME_SETS } from './chimes.js';
import { drawText } from '../ui/text.js';
import { inUiSpace } from '../engine/screen.js';

// How far the lantern throws its light, in world pixels, and how far a ghost is seen in it.
export const LANTERN_RADIUS = 66;
const SEEN_AT = 0.92;
// Seconds the lantern has to stay out before furniture feels free to move.
const DARK_FOR = 3;

const hash = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

export class Haunt {
  constructor(scene) {
    this.scene = scene;
    const data = scene.roomData;
    this.cfg = data.haunt ?? {};
    this.time = 0;
    this.dip = 0;
    this.dipLeft = 0;
    this.dipIn = 18 + Math.random() * 20;
    this.whispers = [];
    this.whisperIn = 9 + Math.random() * 8;
    this.dark = 0;
    this.playIn = this.cfg.selfPlay?.first ?? 5;
    this.playing = null;
    // Props with a `haunt` field: handed it, by the room's own data (props line up with allProps).
    const info = data.props ?? [];
    this.things = [];
    scene.room.allProps.forEach((p, i) => {
      const h = info[i]?.haunt;
      if (!h) return;
      p.haunt = h;
      this.things.push(p);
    });
    // Furniture that moves between visits.
    const visits = (WORLD_STATE.shipVisits ??= {});
    const was = visits[data.id] ?? 0;
    visits[data.id] = was + 1;
    this.visit = was;
    for (const p of this.things.filter((q) => q.haunt.kind === 'shift')) this.shiftTo(p, was % p.haunt.at.length, true);
    // How the room's monsters answer the lantern (their own `lantern` field).
    this.update(0, null);
  }

  get has() {
    return hasGear('ship_lantern');
  }

  get on() {
    return this.has && WORLD_STATE.lanternOn !== false;
  }

  // Put out or lit again.
  toggle() {
    if (!this.has) return false;
    WORLD_STATE.lanternOn = !this.on;
    sfx('click');
    return true;
  }

  get point() {
    return this.scene.lightPoint;
  }

  // The lantern's pool, or null.
  hole() {
    if (!this.on) return null;
    const flick = 1 + Math.sin(this.time * 9) * 0.03 + Math.sin(this.time * 23) * 0.02;
    return { ...this.point, radius: Math.round(LANTERN_RADIUS * flick * (1 - this.dip * 0.4)), cut: 0.95 };
  }

  // How lit a world point is, 0 to 1 (0 when the lantern is out or it is beyond the pool).
  lightAt(x, y) {
    if (!this.on) return 0;
    const p = this.point;
    const d = Math.hypot(x - p.x, y - p.y);
    const reach = LANTERN_RADIUS * SEEN_AT;
    return d >= reach ? 0 : 1 - (d / reach) ** 2;
  }

  // Whether a prop can be seen, for OverworldScene.inLight. Only haunt props are ever hidden.
  reveals(prop) {
    const kind = prop.haunt?.kind;
    if (kind !== 'unseen' && kind !== 'ghost') return true;
    return this.lightAt(prop.x + prop.width / 2, prop.y + T / 2) > 0.02;
  }

  // A scene's `haunt` step.
  run(step) {
    if (step.wake) {
      const npc = this.scene.npcs.find((n) => n.name === step.wake);
      if (npc) {
        npc.wake();
        sfx('shipGroan');
      }
    }
    if (step.lantern) {
      WORLD_STATE.lanternOn = step.lantern !== 'off';
      sfx('click');
    }
    if (step.dip) this.startDip(step.dip);
    // { play: true }: the room's self-playing tune starts now (the harmonium).
    if (step.play) this.playIn = 0;
    if (step.play) this.forcePlay = true;
    if (step.whisper) this.whisper(step.whisper);
    if (step.list) this.scene.tides.set?.(step.list);
  }

  startDip(seconds = 2.4) {
    this.dipLeft = seconds;
    this.dipTotal = seconds;
  }

  whisper(text) {
    const p = this.point;
    this.whispers.push({ text, x: p.x + (Math.random() < 0.5 ? -1 : 1) * (22 + Math.random() * 30), y: p.y - 18 - Math.random() * 14, t: 0 });
    // A breath of wind through the rigging, no more.
    sfx('creak');
  }

  shiftTo(prop, index, quiet = false) {
    const [tx, ty] = prop.haunt.at[index % prop.haunt.at.length];
    // Never onto someone, or onto another prop.
    const room = this.scene.room;
    const box = [tx * T + 1, ty * T + 1, (tx + 1) * T - 1, (ty + 1) * T - 1];
    const bodies = [this.scene.player, ...this.scene.others, ...this.scene.followers].filter(Boolean);
    const taken = room.props.some((q) => q !== prop && !q.walkable && !q.hidden && q.overlaps(...box))
      || bodies.some((b) => b.x + 4 > tx * T && b.x - 4 < (tx + 1) * T && b.y > ty * T && b.y - 5 < (ty + 1) * T);
    if (taken && !quiet) return false;
    prop.x = tx * T;
    prop.y = ty * T;
    prop.haunt.index = index % prop.haunt.at.length;
    return true;
  }

  // Each frame (`input` is null when the room is first made).
  update(dt, input) {
    const s = this.scene;
    this.time += dt;
    const busy = s.textbox?.isOpen || s.cutscene || s.doorway || s.caught;
    if (input && !busy && input.wasPressed('lantern')) this.toggle();
    // The lantern out: the dark gathers; lit again after a while and things have moved.
    if (this.has && !this.on) this.dark += dt;
    else if (this.dark >= DARK_FOR && this.on) {
      this.dark = 0;
      this.shiftAll();
    } else if (this.on) this.dark = 0;
    // Monsters and the lantern.
    this.updateNpcs(dt);
    // Props that only the light shows.
    for (const p of this.things) {
      const kind = p.haunt.kind;
      if (kind === 'ghost' || kind === 'unseen') {
        const lit = this.lightAt(p.x + p.width / 2, p.y + T / 2);
        // A ghost is see-through and breathes; writing and prints come up out of the dark and fade back.
        p.ghostAlpha = kind === 'ghost' ? Math.min(0.85, lit * 1.2) * (0.78 + 0.18 * Math.sin(this.time * 2.1 + p.x)) : Math.min(0.9, lit * 1.3);
      }
    }
    // A chase on: the chase song plays while anything is after you, and the room's own song comes back after.
    this.updateChase();
    this.selfPlay(dt, busy);
    if (busy) return;
    // The lights going low.
    if (this.cfg.dips !== false && this.has !== undefined) {
      if (this.dipLeft > 0) {
        this.dipLeft -= dt;
        const k = this.dipTotal ? 1 - Math.abs(2 * (this.dipLeft / this.dipTotal) - 1) : 0;
        this.dip = Math.max(0, Math.min(1, k * 1.6));
      } else {
        this.dip = 0;
        if (input && (this.dipIn -= dt) <= 0) {
          this.dipIn = 30 + Math.random() * 30;
          this.startDip(3 + Math.random() * 2);
          sfx('shipGroan');
          const lines = this.cfg.whispers;
          if (lines?.length) this.whisper(lines[Math.floor(Math.random() * lines.length)]);
        }
      }
    }
    for (const w of this.whispers) w.t += dt;
    this.whispers = this.whispers.filter((w) => w.t < 4.6);
  }

  // While a monster with a `lantern` rule is chasing you, the room's `haunt.chaseSong` plays; when none is, the room's song again.
  updateChase() {
    const song = this.cfg.chaseSong;
    if (!song || !this.scene.npcs) return;
    const chased = this.scene.npcs.some((n) => n.lantern && n.chasing && !n.dormant);
    if (chased && !this.chaseOn) {
      this.chaseOn = true;
      music.play(song, this.scene.ambience);
    } else if (!chased && this.chaseOn && !this.scene.cutscene) {
      this.chaseOn = false;
      music.play(this.scene.song, this.scene.ambience);
    }
  }

  // Lantern and monsters: freeze, flee, unseen.
  updateNpcs(dt) {
    const s = this.scene;
    for (const npc of s.npcs) {
      if (!npc.lantern) continue;
      const lit = this.lightAt(npc.x, npc.y - 6);
      if (npc.lantern === 'freeze') {
        // Stopped dead in the light, and a little paler for it.
        npc.frozen = lit > 0.08;
      } else if (npc.lantern === 'flee') {
        npc.frozen = false;
        if (lit > 0.05 && !npc.dormant) {
          const p = this.point;
          const dx = npc.x - p.x;
          const dy = npc.y - 6 - p.y;
          const d = Math.hypot(dx, dy) || 1;
          npc.chasing = false;
          npc.step(s.room, (dx / d) * 34 * dt, (dy / d) * 34 * dt);
          npc.moving = true;
        }
      } else if (npc.lantern === 'unseen') {
        npc.ghostAlpha = Math.min(1, lit * 1.5) * 0.85;
      }
      if (npc.lantern !== 'unseen') npc.ghostAlpha = null;
    }
  }

  // Everything that can shift moves on to its next place.
  shiftAll() {
    let any = false;
    for (const p of this.things.filter((q) => q.haunt.kind === 'shift')) {
      if (this.shiftTo(p, (p.haunt.index ?? 0) + 1)) any = true;
    }
    if (any) sfx('shipGroan');
    return any;
  }

  // A chime set that plays its own tune now and then, when you are near, and keys go down on their own.
  selfPlay(dt, busy = false) {
    const cfg = this.cfg.selfPlay;
    const chimes = this.scene.chimes;
    if (!cfg || !chimes) return;
    const set = CHIME_SETS[cfg.set];
    if (!set || chimes.solved(cfg.set) || chimes.answer) { this.playing = null; return; }
    if (this.playing) {
      this.playing.t += dt;
      const order = this.playing.order;
      while (this.playing.step < order.length && this.playing.t >= this.playing.step * (cfg.step ?? 0.78)) {
        const prop = order[this.playing.step++];
        if (!chimes.warmed) {
          chimes.warmed = true;
          music.warm(set.sample, 'vibesBowed', 'harp', 'cellos');
        }
        chimes.sound(prop);
        prop.ringing = 0.7;
        // The key goes down by itself, and comes up again with the next.
        for (const k of order) k.setOn(k === prop);
      }
      if (this.playing.step >= order.length && this.playing.t > order.length * (cfg.step ?? 0.78) + 0.5) {
        this.playing = null;
        chimes.reset(cfg.set);
      }
      return;
    }
    const keys = chimes.props.filter((p) => p.chime.set === cfg.set);
    if (!keys.length) return;
    const p = this.scene.player;
    const near = keys.some((k) => Math.hypot(k.x + 8 - p.x, k.y + 8 - p.y) < (cfg.range ?? 9) * T);
    if ((near && !busy && chimes.idle > 12 && (this.playIn -= dt) <= 0) || this.forcePlay) {
      this.forcePlay = false;
      this.playIn = cfg.every ?? 24;
      this.playing = { t: 0, step: 0, order: chimes.tuneOrder(cfg.set) };
    }
  }

  // Under the light: the lantern's warm pool, and nothing else drawn here.
  drawGlow(ctx) {
    const h = this.hole();
    if (!h) return;
    const cx = h.x - this.scene.camera.x;
    const cy = h.y - this.scene.camera.y;
    const r = h.radius;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    g.addColorStop(0, 'rgba(255, 196, 120, 0.2)');
    g.addColorStop(0.6, 'rgba(255, 170, 96, 0.08)');
    g.addColorStop(1, 'rgba(255, 170, 96, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  }

  // Portraits' eyes (over everything in the room, under the HUD), and whispers.
  drawOver(ctx) {
    const s = this.scene;
    const target = s.player;
    for (const p of this.things) {
      if (p.haunt.kind !== 'eyes' || p.hidden) continue;
      const frame = p.sprite;
      const x0 = p.x + Math.floor((p.width - frame.width) / 2) - s.camera.x;
      const y0 = p.y + T - (p.raise ?? 0) - frame.height - s.camera.y;
      // Which way the pupils look: toward whoever you steer, a pixel at most.
      const dx = target.x - (p.x + p.width / 2);
      const dy = target.y - 8 - (p.y + T / 2 - 4);
      const d = Math.hypot(dx, dy) || 1;
      const ox = Math.abs(dx) < 4 ? 0 : Math.sign(dx);
      const oy = d < 20 ? 0 : Math.abs(dy) < 5 ? 0 : Math.sign(dy);
      for (const [ex, ey] of p.haunt.eyes) {
        ctx.fillStyle = '#0a0806';
        ctx.fillRect(Math.round(x0 + ex) + ox, Math.round(y0 + ey) + oy, 1, 1);
      }
    }
  }

  // The words on the dark, over everything (faint, slow, gone again).
  drawWhispers(ctx) {
    if (!this.whispers.length) return;
    const cam = this.scene.camera;
    inUiSpace(ctx, () => {
      for (const w of this.whispers) {
        const k = w.t / 4.6;
        const alpha = Math.sin(Math.min(1, k) * Math.PI) * 0.7;
        const sx = (w.x - cam.x) * 2;
        const sy = (w.y - cam.y - w.t * 3) * 2;
        ctx.globalAlpha = Math.max(0, alpha);
        drawText(ctx, w.text, sx, sy, { size: 20, color: '#b8d4cc', align: 'center', outline: '#04100e' });
      }
      ctx.globalAlpha = 1;
    });
  }

  // The little hint: how to put the lantern out and light it.
  drawHint(ctx) {
    if (!this.has || this.scene.cutscene || this.scene.textbox.isOpen) return;
    inUiSpace(ctx, () => {
      drawText(ctx, `L: LANTERN ${this.on ? 'ON' : 'OFF'}`, 12, 10, { size: 18, color: this.on ? '#f0d8a0' : '#8a98a0', outline: '#000' });
    });
  }

  // For the play script.
  describe() {
    const foes = this.scene.npcs.filter((n) => n.lantern).map((n) => `${n.name ?? n.enemy}@${(n.x / T).toFixed(1)},${(n.y / T).toFixed(1)}${n.dormant ? '(asleep)' : n.frozen ? '(frozen)' : n.chasing ? '(chasing)' : ''}`).join(' ');
    return `haunt foes ${foes} lantern ${this.has ? (this.on ? 'on' : 'off') : 'none'} dip ${this.dip.toFixed(2)} things ${this.things.filter((p) => p.haunt.kind === 'unseen' || p.haunt.kind === 'ghost').map((p) => `${p.x / T},${p.y / T}${this.reveals(p) ? '+' : '-'}`).join(' ')}`;
  }
}

// Whether a room is a haunted one (it says so with a `haunt` field).
export const isHaunted = (data) => Boolean(data.haunt);
