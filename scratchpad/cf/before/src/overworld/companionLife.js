// COMPANION LIFE (chapters 4 to 6): Ves and Bramble doing small things of their
// own, picked to suit where you are.
//
//   Idle moments, after you've stood still a while: Bramble draws in the ash,
//   sneezes, chases a moth, skims a stone, builds a little cairn; Ves shakes
//   out her umbrella, hums, checks the sky, sighs at Bramble.
//   Reactions: coughing in an ash storm, jumping at a bird taking off,
//   shivering in spray and wind, squinting into glare, looking round at a
//   noise, and Ves going quiet at the orchard's one green shoot.
//
// They are little animations (idles.js poses and frames, follower acts) with
// drawn bits beside them and now and then a short speech bubble. None of it
// has a body, blocks anything or talks long, and none of it runs while a
// cutscene, a conversation, a menu, a cart or a rope has hold of the party. In
// chapter 4 Bramble isn't in the party (he is following in secret), so only
// Ves does anything there.

import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H, UI_SCALE } from '../config.js';
import { animationFrame } from '../engine/animations.js';
import { flipHorizontal } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { drawText, textWidth } from '../ui/text.js';
import { TILES } from './tileset.js';
import { addIdles } from './idles.js';
import { isHurt } from '../characters/party.js';

const T = 16;
const now = () => performance.now() / 1000;
const frac = (v) => v - Math.floor(v);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const hump = (k) => Math.sin(clamp01(k) * Math.PI);
const ease = (k) => 1 - (1 - clamp01(k)) ** 2;
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const between = ([lo, hi]) => lo + Math.random() * (hi - lo);

// Chapters 1 to 3 as well now. Chapter 1 has no companions (nothing happens there). Chapter 2: Ves
// only (Bramble isn't met yet). Chapter 3: Ves is missing, then on a crutch with her umbrella lost
// (so none of her umbrella moves), and Bramble is there from the Hollow Oak to Lasthome. Whoever is
// really in the party (scene.followers) is who does anything; the kind just says which moves suit.
// Which kind of place each area is.
const KIND_OF = {
  ashroad: 'ash',
  gullrest: 'coast', saltcombe: 'coast', wrack: 'coast', wreck: 'coast', lanes: 'coast', soundings: 'coast',
  isles: 'coast', lastlight: 'coast', reach: 'coast', haddock_light: 'coast', merrow: 'coast',
  belowtown: 'deep', diggings: 'deep', glimmer: 'deep', stillwater: 'deep', deep: 'deep',
  vigil: 'snow', stair: 'snow', rest: 'snow',
  pinefall: 'wood', hollin: 'wood', hushwood: 'wood',
  drains: 'drain', marsh: 'marsh',
  lasthome: 'town', valley: 'city',
};
// Rooms that are a different kind of place from the rest of their area.
function kindOf(room) {
  const base = KIND_OF[room.area];
  if (!base) return null;
  const early = ['snow', 'wood', 'drain', 'marsh', 'town', 'city'].includes(base);
  if (!early) return base;
  if (/^(cave_|ice_cave)/.test(room.id)) return 'cave';
  if (room.indoors) return 'indoor';
  return base;
}
// What flies off an umbrella, what's drawn with, what coughs up, by kind.
const LOOK = {
  ash: { bits: '#8a8480', mark: '#4a4440', puff: '#8a8480' },
  coast: { bits: '#9ac4d8', mark: '#8a6a40', puff: '#e8e4d8' },
  deep: { bits: '#a09484', mark: '#d0c4ac', puff: '#a09484' },
  snow: { bits: '#eef4fa', mark: '#8aa0b8', puff: '#eef4fa' },
  wood: { bits: '#b8742c', mark: '#4a3420', puff: '#9a8a60' },
  drain: { bits: '#7a9aa0', mark: '#5a5a54', puff: '#8aa0a0' },
  marsh: { bits: '#8aa070', mark: '#3a4a30', puff: '#a8b8a0' },
  town: { bits: '#c8c0b0', mark: '#7a6a58', puff: '#c8c0b0' },
  city: { bits: '#a8a090', mark: '#6a6458', puff: '#a8a090' },
  cave: { bits: '#cfe4f4', mark: '#8aa0b8', puff: '#cfe4f4' },
  indoor: { bits: '#c8c0b0', mark: '#7a6a58', puff: '#c8c0b0' },
};

const flipped = new WeakMap();
function mirrored(sprite) {
  if (sprite && !flipped.has(sprite)) flipped.set(sprite, flipHorizontal(sprite));
  return flipped.get(sprite);
}
const frame = (name, index) => animationFrame(name, index + 0.5, 1, true);
// Ves's umbrella frames; on her crutch (chapter 3) her own frames stay, since the umbrella is lost.
const vesFrame = (i) => (isHurt('vesper') ? null : frame('ves_idle', i));
const index = (times, t) => times.filter((from) => t >= from).length - 1;

// Which way Ves looks to sigh at Bramble (set when it starts).
let sighLook = null;

// --- The idles themselves: what the sprite does. `length` seconds, `at(t, facing)`. ---

const IDLES = {
  vesper: {
    // The umbrella given a hard shake, whatever's on it flying off.
    ves_shakeout: {
      length: 2.0,
      at: (t) => ({ face: 'down', sprite: vesFrame(t > 0.2 && t < 1.6 ? 1 : 0), pose: { dx: t > 0.35 && t < 1.5 ? (Math.floor(t * 16) % 2 ? 1 : -1) : 0, lift: t > 0.35 && t < 1.5 ? 0 : 0 } }),
    },
    // A tune under her breath, swaying a little.
    ves_hum: {
      length: 3.6,
      at: (t) => ({ face: 'down', sprite: vesFrame(0), pose: { dx: Math.sin(t * 2.4) * 0.8, sy: 1 + 0.015 * Math.sin(t * 4.8) } }),
    },
    // Chin up, umbrella up, working out the sky.
    ves_peer: {
      length: 2.8,
      at: (t) => {
        const i = index([0, 0.2, 0.5, 2.1, 2.4], t);
        return { face: 'down', sprite: vesFrame([0, 1, 2, 1, 0][i]), pose: { sy: i >= 1 && i <= 3 ? 1.03 : 1 } };
      },
    },
    // Weight shifted off the bad leg and onto the crutch, and back (crutch-friendly: nothing waved about).
    ves_lean: {
      length: 3.2,
      at: (t) => ({ face: 'down', sprite: vesFrame(0), pose: { dx: Math.sin(Math.min(1, t / 3.2) * Math.PI) * -1.2, sy: 1 - 0.02 * hump(t / 3.2) } }),
    },
    // A breath out in the cold, a little cloud of it, hands rubbed.
    ves_breath: {
      length: 2.6,
      at: (t) => ({ face: 'down', sprite: vesFrame(0), pose: { sy: t > 0.5 && t < 1.4 ? 1.04 : 1, dx: t > 1.5 ? Math.floor(t * 12) % 2 * 0.6 : 0 } }),
    },
    // A long look at Bramble, and a sigh.
    ves_sigh: {
      length: 2.4,
      at: (t) => ({ face: 'down', sprite: vesFrame(0), pose: { look: sighLook, sy: t > 0.9 && t < 1.8 ? 1 - 0.05 * hump((t - 0.9) / 0.9) : 1, lift: 0 } }),
    },
  },
  bramble: {
    // Crouched over the ground with a finger, drawing.
    br_draw: {
      length: 5.6,
      at: (t) => {
        const k = ease(Math.min(t, 0.3) / 0.3) * (t > 5.2 ? 1 - ease((t - 5.2) / 0.4) : 1);
        return { face: 'down', pose: { sx: 1 + 0.1 * k, sy: 1 - 0.2 * k, dx: t > 0.5 && t < 5 ? Math.floor(t * 5) % 2 : 0 } };
      },
    },
    // A little tower of stones, and then he can't help it.
    br_cairn: {
      length: 6.4,
      at: (t) => {
        const down = ease(Math.min(t, 0.3) / 0.3) * (t > 6.0 ? 1 - ease((t - 6.0) / 0.4) : 1);
        const poke = t > 4.4 && t < 4.9 ? hump((t - 4.4) / 0.5) : 0;
        return { face: 'down', pose: { sx: 1 + 0.1 * down, sy: 1 - 0.2 * down, forward: poke } };
      },
    },
    // A leaf comes down, and he's after it with both hands, and gets it.
    br_leaf: {
      length: 4.4,
      at: (t) => {
        const snatch = t > 3.0 && t < 3.4 ? hump((t - 3.0) / 0.4) : 0;
        return { face: 'down', pose: { dx: t < 3.0 ? Math.sin(t * 2.2) * 2 : 0, lift: t > 3.0 && t < 3.5 ? 2 : 0, forward: snatch, sy: 1 + 0.05 * snatch } };
      },
    },
    // Crouched at the edge of the water, watching something small and wet.
    br_frog: {
      length: 5.0,
      at: (t) => {
        const k = ease(Math.min(t, 0.3) / 0.3) * (t > 4.6 ? 1 - ease((t - 4.6) / 0.4) : 1);
        const jump = t > 3.2 && t < 3.6 ? hump((t - 3.2) / 0.4) : 0;
        return { face: 'down', pose: { sx: 1 + 0.08 * k, sy: 1 - 0.18 * k, lift: jump * 2 } };
      },
    },
    // A jump into the nearest puddle, both feet.
    br_splash: {
      length: 2.4,
      at: (t) => {
        const up = t > 0.4 && t < 1.0 ? hump((t - 0.4) / 0.6) : 0;
        const down = t > 1.0 && t < 1.3 ? 1 - (t - 1.0) / 0.3 : 0;
        return { face: 'down', pose: { lift: up * 5, sy: 1 + 0.06 * up - 0.12 * down, sx: 1 - 0.04 * up + 0.1 * down } };
      },
    },
    // After a moth, hopping this way and that.
    br_moth: {
      length: 4.2,
      at: (t) => ({ face: Math.sin(t * 1.7) > 0 ? 'right' : 'left', pose: { dx: Math.sin(t * 1.7) * 3, lift: Math.abs(Math.sin(t * 3.4)) * 3 } }),
    },
    // Head back, eyes screwed up... and out it comes.
    br_sneeze: {
      length: 2.6,
      at: (t) => {
        if (t < 1.1) return { face: 'down', pose: { sy: 1 + 0.07 * ease(t / 1.1), lift: t > 0.5 ? 1 : 0, dx: t > 0.8 ? Math.floor(t * 20) % 2 * 0.6 : 0 } };
        if (t < 1.5) return { face: 'down', pose: { sy: 0.88, sx: 1.12, forward: 1 } };
        return { face: 'down', pose: { sy: 0.88 + 0.12 * ease((t - 1.5) / 0.6), sx: 1.12 - 0.12 * ease((t - 1.5) / 0.6) } };
      },
    },
    // Side-on, the arm back and then flung out: a stone skipping.
    br_skim: {
      length: 3.0,
      at: (t, facing) => {
        const wind = t < 1.0;
        const sprite = frame('bramble_chop', wind ? 0 : 1);
        return { face: facing < 0 ? 'left' : 'right', sprite: t > 1.8 ? null : facing < 0 ? sprite : mirrored(sprite), pose: { forward: wind ? 0 : 1 } };
      },
    },
  },
};
for (const table of Object.values(IDLES)) for (const idle of Object.values(table)) idle.manual = true;
addIdles('vesper', IDLES.vesper);
addIdles('bramble', IDLES.bramble);

// --- What each can be doing where. weight 0 = never there. `line`: { at, chance, text } said when `at` seconds in. ---

const MOVES = {
  vesper: [
    // Umbrella moves need the umbrella: not on the crutch in chapter 3, where it's lost.
    { name: 'ves_shakeout', needs: 'umbrella', weight: { ash: 3, coast: 3, deep: 2, snow: 5, wood: 3, drain: 2, marsh: 3, town: 2, city: 2, cave: 1 } },
    { name: 'ves_hum', weight: { ash: 1, coast: 2, deep: 1, snow: 1, wood: 2, drain: 1, marsh: 2, town: 3, city: 1, cave: 1, indoor: 2 } },
    {
      name: 'ves_peer', needs: 'umbrella', weight: { ash: 3, coast: 2, deep: 1, snow: 3, wood: 2, marsh: 2, town: 1, city: 2 },
      line: { at: 1.2, chance: 0.45, text: { ash: ["Sky's still grey.", 'Sky, or a lid?', "Not getting better."], coast: ["It'll turn. Probably.", 'That cloud has plans.'], deep: ["Ceiling's holding.", 'Still rock up there.'], snow: ['More snow. Obviously.', 'That cloud is thinking about it.'], wood: ['Branches. Then more branches.', 'Where is the sky, even.'], marsh: ['Fog, fog and a heron.', 'Is that sky? It looks damp.'], town: ['Chimneys all lit.'], city: ['Still holding up.'] } },
    },
    // On the crutch: weight shifted, no umbrella to lift (it's lost).
    {
      name: 'ves_lean', needs: 'crutch', weight: { wood: 4, drain: 3, marsh: 3, town: 4, city: 3, cave: 2, indoor: 3, snow: 3 },
      line: { at: 1.4, chance: 0.4, text: { wood: ['Leg is fine.', 'Still attached.'], drain: ['Leg is fine.'], marsh: ['Leg is fine. Ground is the problem.'], town: ['Standing. Look at that.'], city: ['Still attached.'], snow: ['Leg is fine.'] } },
    },
    { name: 'ves_breath', weight: { snow: 5, cave: 2 }, line: { at: 1.0, chance: 0.4, text: { snow: ['Not cold. Just fast air.', 'I am warm. Mostly.'], cave: ['Frozen air. Lovely.'] } } },
    {
      name: 'ves_sigh', weight: { ash: 2, coast: 2, deep: 2, wood: 3, drain: 2, marsh: 2, town: 2, city: 2, cave: 2, indoor: 2 }, needs: 'bramble',
      line: { at: 1.0, chance: 0.7, text: { ash: ['Bramble.', "Don't."], coast: ['Bramble.', 'I saw that.'], deep: ['Bramble.', "Don't."], wood: ['Bramble.', 'Not that stick.'], drain: ['Bramble.', 'Not in there.'], marsh: ['Bramble.', 'Do not lick that.'], town: ['Bramble.', 'Sit.'], city: ['Bramble.'], cave: ['Bramble.'], indoor: ['Bramble.', "Don't touch it."] } },
    },
  ],
  bramble: [
    { name: 'br_draw', weight: { ash: 3, coast: 2, deep: 2, wood: 3, town: 2, city: 2, marsh: 1 }, ground: true },
    { name: 'br_cairn', weight: { ash: 2, coast: 2, deep: 1, wood: 2, city: 2 }, ground: true, line: { at: 5.0, chance: 0.6, text: { ash: ['Oops.'], coast: ['Oops.'], deep: ['Oops.'], wood: ['Oops.'], city: ['Oops.'] } } },
    { name: 'br_moth', weight: { ash: 1, coast: 0, deep: 2, wood: 1, drain: 2, marsh: 2, cave: 2 }, line: { at: 0.8, chance: 0.4, text: { ash: ['Come back!'], deep: ['Come back!'], wood: ['Come back!'], drain: ['Come back!'], marsh: ['Come back!'], cave: ['Come back!'] } } },
    { name: 'br_sneeze', weight: { ash: 3, coast: 0, deep: 1, drain: 1, city: 2 }, line: { at: 1.2, chance: 1, text: { ash: ['Ah... CHOO!'], deep: ['Ah... CHOO!'], drain: ['Ah... CHOO!'], city: ['Ah... CHOO!'] } } },
    { name: 'br_skim', weight: { ash: 1, coast: 3, deep: 0, marsh: 2, wood: 1 }, ground: true, line: { at: 2.4, chance: 0.4, text: { ash: ['Thud.'], coast: ['Three skips!', 'Did you see that?'], marsh: ['Plip.', 'Sank.'], wood: ['Thud.'] } } },
    // A leaf drifts down and he catches it (the Pinefall's, the Hushwood's).
    { name: 'br_leaf', weight: { wood: 6, town: 1 }, line: { at: 3.3, chance: 0.7, text: { wood: ['Got it!', 'Ha! Mine.'], town: ['Got it!'] } } },
    { name: 'br_frog', weight: { marsh: 6, drain: 1 }, ground: true, line: { at: 3.4, chance: 0.6, text: { marsh: ['Ribbit?', 'It looked at me!'], drain: ['Was that a frog?'] } } },
    { name: 'br_splash', weight: { marsh: 3, drain: 3, wood: 1, town: 1 }, line: { at: 1.0, chance: 0.5, text: { marsh: ['Splash!'], drain: ['Splash!'], wood: ['Splash!'], town: ['Splash!'] } } },
  ],
};

// Little pictures drawn in the ground (9 wide, 7 high, '#' is a line).
const DOODLES = [
  ['....#....', '...###...', '..#####..', '.#######.', '.#.....#.', '.#..#..#.', '.#######.'],
  ['..#####..', '.#.....#.', '#..#.#..#', '#.......#', '#.#...#.#', '.#.###.#.', '..#####..'],
  ['....#....', '....#....', '.#######.', '..#####..', '..##.##..', '.##...##.', '.#.....#.'],
];

// Reactions and room-specific moments.
const SHOOT = { room: 'ash_orchard', x: 24, y: 13 };

export class CompanionLife {
  constructor(scene, life) {
    this.scene = scene;
    this.life = life;
    this.kind = kindOf(scene.roomData) ?? 'ash';
    this.look = LOOK[this.kind];
    this.time = 0;
    this.bubbles = [];
    this.doodles = [];
    this.puffs = [];
    this.states = new Map();
    this.talkAt = 4;
    this.flapSeen = 0;
    this.glared = false;
    this.shootSeen = false;
    const crew = () => this.scene.followers;
    this.fx = { get sortY() { return Math.max(0, ...crew().map((f) => f.y)) + 1; }, draw: (ctx, camera) => this.drawFx(ctx, camera) };
    this.floor = { sortY: -1e9, draw: (ctx, camera) => this.drawFloor(ctx, camera) };
    this.things = [this.floor, this.fx];
    this.stormSeen = 0;
  }

  state(f) {
    let st = this.states.get(f.id);
    if (!st) {
      st = { due: null, lastT: 0, said: false, cough: between([5, 12]), shiver: between([10, 20]), look: between([20, 38]), start: 0, which: null, last: null, bird: 0 };
      this.states.set(f.id, st);
    }
    return st;
  }

  // Whether the party is free to be getting on with their own things.
  get busy() {
    const s = this.scene;
    return Boolean(s.cutscene || s.textbox?.isOpen || s.pauseMenu?.isOpen || s.storageMenu?.isOpen || s.travelMenu?.isOpen
      || s.doorway || s.battleFlash || s.others?.length || s.partner || !this.life.ordinary
      || s.player.carrying || s.player.skin || s.player.hidden || s.player.tucked || s.player.balancing || s.player.sinking
      || s.fadeIn > 0.2 || s.resting || s.sleeper);
  }

  crew() {
    return this.scene.followers.filter((f) => !f.hidden && !f.tucked && (f.id === 'vesper' || f.id === 'bramble'));
  }

  free(f) {
    const hero = this.scene.player;
    return !f.walking && !f.balancing && !f.act && !f.animation && !f.glanceDir && !f.sag
      && now() - (hero.freeAt ?? -1) < 0.1;
  }

  canSay() {
    return this.time >= this.talkAt && !this.bubbles.length;
  }

  say(f, text, seconds = 2.1) {
    if (!text || !this.canSay()) return false;
    this.bubbles.push({ f, text, t: 0, life: seconds });
    this.talkAt = this.time + seconds + 6 + Math.random() * 8;
    return true;
  }

  // Ground where a doodle or a heap of stones can sit: dry, walkable.
  groundOk(f) {
    const tile = this.life.tileUnder({ x: f.x + 9 * (f.facing || 1), y: f.y });
    const own = this.life.tileUnder(f);
    const ok = (t) => TILES[t] && !TILES[t].solid && !';%~=$'.includes(t);
    return ok(tile) && ok(own);
  }

  update(dt) {
    this.time += dt;
    for (const b of this.bubbles) b.t += dt;
    this.bubbles = this.bubbles.filter((b) => b.t < b.life && !b.f.hidden);
    this.puffs = this.puffs.filter((p) => this.time - p.born < p.life);
    this.doodles = this.doodles.filter((d) => this.time - d.born < 30);
    if (this.busy) {
      this.bubbles = [];
      return;
    }
    const crew = this.crew();
    const bramble = crew.find((f) => f.id === 'bramble');
    for (const f of crew) {
      const st = this.state(f);
      this.updateIdle(f, st, bramble);
      this.updateReactions(dt, f, st, crew);
    }
  }

  // --- Idle moments. ---

  updateIdle(f, st, bramble) {
    const s = this.scene;
    const mine = f.fidget && IDLES[f.id]?.[f.fidget.name];
    if (mine) {
      // Keep them at it: no glancing off in the middle of a thing.
      f.nextGlance = Math.max(f.nextGlance, f.stillFor + 1);
      const def = MOVES[f.id].find((m) => m.name === f.fidget.name);
      const t = f.fidget.t;
      if (def?.line && st.said && st.lastT < def.line.at && t >= def.line.at) {
        const lines = def.line.text[this.kind];
        if (lines) this.say(f, pick(lines));
        st.said = false;
      }
      st.lastT = t;
      return;
    }
    if (s.idleTime < 1) { st.due = null; return; }
    if (f.fidget || !this.free(f)) return;
    st.due ??= s.idleTime + 6 + Math.random() * 7;
    if (s.idleTime < st.due) return;
    const options = MOVES[f.id].filter((m) => (m.weight[this.kind] ?? 0) > 0 && m.name !== st.last
      && (m.needs !== 'bramble' || (bramble && !bramble.walking && Math.hypot(bramble.x - f.x, bramble.y - f.y) < 90))
      && (m.needs !== 'umbrella' || !isHurt('vesper'))
      && (m.needs !== 'crutch' || isHurt('vesper'))
      && (!m.ground || this.groundOk(f)));
    st.due = s.idleTime + 14 + Math.random() * 16;
    if (!options.length) return;
    let roll = Math.random() * options.reduce((n, m) => n + m.weight[this.kind], 0);
    const move = options.find((m) => (roll -= m.weight[this.kind]) < 0) ?? options[0];
    st.last = move.name;
    st.lastT = 0;
    st.said = Boolean(move.line) && Math.random() < move.line.chance;
    if (move.name === 'ves_sigh' && bramble) sighLook = bramble.x < f.x ? 'left' : 'right';
    f.startFidget(move.name);
    st.start = this.time;
    if (move.name === 'br_draw') {
      const spot = { x: f.x + 10 * (f.facing || 1), y: f.y - 1 };
      this.doodles.push({ ...spot, born: this.time, kind: Math.floor(Math.random() * DOODLES.length) });
      if (this.doodles.length > 2) this.doodles.shift();
    }
    if (move.name === 'br_sneeze') this.puffs.push({ f, born: this.time + 1.1, life: 0.9, kind: 'sneeze' });
  }

  // --- Reactions. ---

  act(f, name) {
    if (f.act || f.animation || f.walking === undefined) return false;
    if (f.fidget) f.fidget = null;
    f.perform(name);
    return true;
  }

  updateReactions(dt, f, st, crew) {
    const s = this.scene;
    const hero = s.player;
    const calm = !f.act && !f.animation && !f.fidget && !f.balancing && !f.sag && !hero.isAirborne;
    if (!calm) return;
    const bramble = f.id === 'bramble';
    // Coughing in an ash storm.
    const storm = s.ash?.stormLevel?.() ?? 0;
    st.cough -= dt * (storm > 0.35 ? 1 : 0);
    if (storm > 0.35 && st.cough <= 0) {
      st.cough = between([8, 15]);
      if (this.act(f, 'bounce')) {
        this.puffs.push({ f, born: this.time, life: 0.7, kind: 'cough' });
        if (Math.random() < (bramble ? 0.7 : 0.45)) this.say(f, '*cough*', 1.4);
      }
      return;
    }
    // Shivering in the spray, the rain or a gale.
    const air = s.roomData.atmosphere ?? {};
    const bitter = !s.roomData.indoors && ((this.kind === 'coast' && ((air.spray ?? 0) >= 1 || (air.rain ?? 0) >= 1 || s.roomData.weather === 'gale'))
      || (this.kind === 'snow' && ['snow', 'flurry', 'gale', 'whiteout'].includes(s.roomData.weather)));
    st.shiver -= dt * (bitter ? 1 : 0);
    if (bitter && st.shiver <= 0) {
      st.shiver = between([16, 28]);
      if (this.act(f, 'shiver') && Math.random() < 0.4) this.say(f, bramble ? 'Brr!' : this.kind === 'snow' ? pick(['Not cold. Windy.', 'Perfectly warm.']) : 'Not cold. Windy.', 1.6);
      return;
    }
    // A noise in the dark: both look round.
    const dim = this.kind === 'deep' || this.kind === 'drain' || this.kind === 'cave' || s.roomData.dark;
    st.look -= dt * (dim ? 1 : 0);
    if (dim && st.look <= 0) {
      st.look = between([28, 50]);
      if (this.act(f, 'look') && Math.random() < 0.3) this.say(f, bramble ? 'What was that?' : 'Water. Probably.', 1.8);
      return;
    }
    // A bird, or a gull, taking off close by: Bramble jumps, Ves glances.
    st.bird -= dt;
    if (st.bird <= 0) {
      const flap = s.monsterFlavour?.flap;
      let near = false;
      if (flap && flap.at > this.flapSeen && Math.hypot(flap.x - f.x, flap.y - f.y) < 80 && s.monsterFlavour.time - flap.at < 0.5) near = true;
      if (!near) near = (this.life.birds ?? []).some((b) => b.mode === 'fly' && b.t < 0.25 && Math.hypot(b.x - f.x, b.y - f.y) < 60);
      if (near) {
        if (flap) this.flapSeen = flap.at;
        st.bird = 12;
        if (this.act(f, bramble ? 'startle' : 'look') && bramble && Math.random() < 0.6) this.say(f, pick(['Whoa!', 'Gah!', 'It moved!']), 1.3);
        return;
      }
      st.bird = 0.3;
    }
    // Glare off the sand: Ves, once, squinting.
    if (!bramble && !this.glared && s.roomData.area === 'gullrest' && !s.roomData.indoors && s.idleTime > 2) {
      this.glared = true;
      if (this.act(f, 'sigh')) this.say(f, 'Bright.', 1.6);
      return;
    }
    // Ves, quiet, at the orchard's one green shoot.
    if (!bramble && !this.shootSeen && s.roomData.id === SHOOT.room) {
      const d = Math.hypot(f.x - (SHOOT.x + 0.5) * T, f.y - (SHOOT.y + 0.5) * T);
      if (d < 44) {
        this.shootSeen = true;
        if (this.act(f, 'look')) { this.talkAt = Math.min(this.talkAt, this.time); this.say(f, '...', 2.6); }
      }
    }
  }

  // --- Drawing. ---

  headOf(f, camera) {
    const h = f.sprites?.right?.height ?? 24;
    return { x: Math.round(f.x) - camera.x, y: Math.round(f.y) - Math.round(f.shownGround ?? f.ground ?? 0) - camera.y - h };
  }

  drawFloor(ctx, camera) {
    if (this.busy && !this.doodles.length) return;
    const look = this.look;
    for (const d of this.doodles) {
      const age = this.time - d.born;
      const built = clamp01(age / 4.5);
      const fade = age > 22 ? 1 - (age - 22) / 8 : 1;
      if (fade <= 0) continue;
      const rows = DOODLES[d.kind];
      const x = Math.round(d.x) - 4 - camera.x;
      const y = Math.round(d.y) - 6 - camera.y;
      ctx.globalAlpha = 0.8 * fade;
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          if (row[rx] === '#' && (rx + ry * 0.5) / 12 <= built) px(ctx, look.mark, x + rx, y + ry);
        }
      });
    }
    ctx.globalAlpha = 1;
  }

  drawFx(ctx, camera) {
    const look = this.look;
    for (const p of this.puffs) {
      const k = (this.time - p.born) / p.life;
      if (k < 0 || k > 1 || p.f.hidden) continue;
      const head = this.headOf(p.f, camera);
      const dir = p.f.facing || 1;
      const cx = head.x + (p.kind === 'sneeze' ? dir * 7 + k * dir * 10 : 4 * dir + k * 6 * dir);
      const cy = head.y + 8 + (p.kind === 'sneeze' ? k * 3 : -k * 3);
      ctx.globalAlpha = 0.8 * (1 - k);
      for (let i = 0; i < 4; i++) px(ctx, look.puff, cx + (i - 1.5) * (1 + k * 3), cy + Math.sin(i * 2.1 + k * 4) * (1 + k * 2), 2, 2);
    }
    ctx.globalAlpha = 1;
    for (const f of this.crew()) {
      const fid = f.fidget;
      if (!fid || !IDLES[f.id]?.[fid.name]) continue;
      const head = this.headOf(f, camera);
      const feetY = Math.round(f.y) - Math.round(f.shownGround ?? f.ground ?? 0) - camera.y;
      const t = fid.t;
      const dir = f.facing || 1;
      switch (fid.name) {
        case 'ves_shakeout':
          if (t > 0.35 && t < 1.6) {
            for (let i = 0; i < 6; i++) {
              const ph = frac(t * 2.4 + i * 0.17);
              ctx.globalAlpha = 1 - ph;
              px(ctx, look.bits, head.x + (i % 2 ? -1 : 1) * (5 + ph * 9), head.y + 2 + ph * ph * 12, 1, 1);
            }
            ctx.globalAlpha = 1;
          }
          break;
        case 'ves_hum':
          for (let i = 0; i < 2; i++) {
            const ph = frac(t * 0.4 + i * 0.5);
            ctx.globalAlpha = Math.min(1, (1 - ph) * 2);
            const nx = head.x + 6 + ph * 9 + Math.sin(ph * 7 + i) * 2;
            const ny = head.y + 4 - ph * 14;
            px(ctx, '#fff4d0', nx, ny, 2, 1);
            px(ctx, '#fff4d0', nx + 1, ny - 3, 1, 3);
            px(ctx, '#fff4d0', nx + 2, ny - 3, 1, 1);
          }
          ctx.globalAlpha = 1;
          break;
        case 'ves_breath':
          // A breath out, a thin cloud drifting up and away.
          if (t > 0.5 && t < 2.2) {
            const k = (t - 0.5) / 1.7;
            ctx.globalAlpha = 0.85 * (1 - k);
            for (let i = 0; i < 3; i++) px(ctx, '#f4f8ff', head.x + dir * (6 + k * 8 + i * 2), head.y + 9 - k * 7 + Math.sin(k * 6 + i) * 1.5, 2 + (i === 1 ? 1 : 0), 2);
            ctx.globalAlpha = 1;
          }
          break;
        case 'br_leaf': this.drawLeaf(ctx, f, t, camera, head, feetY); break;
        case 'br_frog': this.drawFrog(ctx, f, t, camera, feetY, dir); break;
        case 'br_splash':
          if (t > 1.0 && t < 1.8) {
            const k = (t - 1.0) / 0.8;
            ctx.globalAlpha = 1 - k;
            for (let i = 0; i < 6; i++) px(ctx, '#bcd8e4', Math.round(f.x) - camera.x + (i - 2.5) * (2 + k * 2), feetY - 2 - Math.sin(k * Math.PI) * (3 + (i % 3) * 2), 1, 1);
            ctx.globalAlpha = 1;
          }
          break;
        case 'br_cairn': this.drawCairn(ctx, f, t, camera, feetY, dir); break;
        case 'br_moth': this.drawMoth(ctx, f, t, camera, head); break;
        case 'br_skim': this.drawSkim(ctx, f, t, camera, feetY, dir); break;
        default: break;
      }
    }
    ctx.globalAlpha = 1;
  }

  drawCairn(ctx, f, t, camera, feetY, dir) {
    const bx = Math.round(f.x) + dir * 11 - camera.x;
    const by = feetY - 1;
    const stones = [[6, 3], [5, 3], [3, 2]];
    const out = clamp01((t - 6.0) / 0.4);
    let height = 0;
    stones.forEach(([w, h], i) => {
      const appear = 1.0 + i * 1.0;
      if (t < appear) return;
      const fall = clamp01((t - 4.6) / 0.9);
      const settle = clamp01((t - appear) / 0.25);
      let x = bx - w / 2 + (fall > 0 ? fall * (i + 1) * 5 * dir : 0);
      let y = by - height - h - (1 - settle) * 6 + (fall > 0 ? fall * height : 0);
      ctx.globalAlpha = 1 - out;
      px(ctx, '#3c3c44', x, y + h - 1, w, 1);
      px(ctx, '#80808a', x, y + 1, w, h - 1);
      px(ctx, '#b4b4bc', x + 1, y, w - 2, 1);
      height += h;
    });
    ctx.globalAlpha = 1;
  }

  // A leaf turning over as it comes down beside him; at 3.0 seconds he has it (and it's in his hand a moment).
  drawLeaf(ctx, f, t, camera, head, feetY) {
    const dir = f.facing || 1;
    const hue = ['#c8602c', '#d89030', '#a83c28'][Math.floor(f.x) % 3];
    if (t < 3.0) {
      const k = t / 3.0;
      const lx = head.x + dir * 8 + Math.sin(k * 11) * 5;
      const ly = head.y - 12 + k * (feetY - head.y + 4) * 0.85;
      px(ctx, hue, lx, ly, 3, 1);
      if (Math.sin(k * 22) > 0) px(ctx, hue, lx + 1, ly + 1, 1, 1);
    } else if (t < 4.2) {
      const ax = head.x + dir * 4;
      const ay = head.y + 13;
      px(ctx, hue, ax, ay, 3, 1);
      px(ctx, hue, ax + 1, ay - 1, 1, 1);
    }
  }

  // A small frog at the water's edge that watches, and hops off when he leans in.
  drawFrog(ctx, f, t, camera, feetY, dir) {
    const bx = Math.round(f.x) + dir * 11 - camera.x;
    if (t < 0.6 || t > 4.6) return;
    const jump = t > 3.2 ? (t - 3.2) / 0.5 : 0;
    if (jump > 1) return;
    const x = bx + jump * dir * 10;
    const y = feetY - 1 - Math.sin(jump * Math.PI) * 5;
    px(ctx, '#3c6a34', x, y - 2, 4, 2);
    px(ctx, '#5a9a48', x + 1, y - 3, 2, 1);
    px(ctx, '#e8f0c0', x + (dir > 0 ? 3 : 0), y - 3, 1, 1);
    px(ctx, '#3c6a34', x - 1, y, 2, 1);
    px(ctx, '#3c6a34', x + 3, y, 2, 1);
  }

  drawMoth(ctx, f, t, camera, head) {
    const a = t * 2.6;
    const mx = head.x + Math.sin(a) * 10 + Math.sin(a * 2.3) * 3;
    const my = head.y - 4 + Math.cos(a * 1.4) * 5;
    const open = Math.floor(t * 20) % 2 === 0;
    const body = this.kind === 'deep' ? '#bfe0ff' : '#bcb6ae';
    px(ctx, body, mx, my);
    px(ctx, body, mx - 1, my - (open ? 1 : 0));
    px(ctx, body, mx + 1, my - (open ? 1 : 0));
  }

  drawSkim(ctx, f, t, camera, feetY, dir) {
    if (t < 1.0 || t > 2.5) return;
    const k = (t - 1.0) / 1.5;
    const sx = Math.round(f.x) + dir * (8 + k * 54) - camera.x;
    // Three skips, each lower.
    const hop = frac(k * 3);
    const arc = [7, 4, 2][Math.min(2, Math.floor(k * 3))];
    const sy = feetY - 4 - Math.sin(hop * Math.PI) * arc;
    px(ctx, '#d4d0c8', sx, sy, 2, 1);
    if (hop < 0.12 || hop > 0.9) {
      const rx = sx - 1;
      ctx.globalAlpha = 0.7;
      px(ctx, this.look.puff, rx - 1, feetY - 3, 5, 1);
      px(ctx, this.look.puff, rx, feetY - 4, 3, 1);
      ctx.globalAlpha = 1;
    }
  }

  // Speech bubbles, over everything.
  drawTop(ctx) {
    if (!this.bubbles.length) return;
    const cam = this.scene.camera;
    for (const b of this.bubbles) {
      const head = this.headOf(b.f, cam);
      if (head.x < -20 || head.x > W + 20 || head.y < -20 || head.y > H) continue;
      const pop = clamp01(b.t / 0.12);
      const fade = clamp01((b.life - b.t) / 0.3);
      inUiSpace(ctx, () => {
        const size = 16;
        const w = Math.round(textWidth(ctx, b.text, size)) + 12;
        const cx = Math.min(640 - w / 2 - 6, Math.max(w / 2 + 6, head.x * UI_SCALE));
        const top = Math.round(head.y * UI_SCALE - size - 14 - (1 - pop) * 6);
        ctx.globalAlpha = Math.min(pop, fade);
        ctx.fillStyle = '#120c1c';
        ctx.fillRect(cx - w / 2 - 2, top - 2, w + 4, size + 8);
        ctx.fillRect(head.x * UI_SCALE - 3, top + size + 6, 6, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx - w / 2, top, w, size + 4);
        ctx.fillRect(head.x * UI_SCALE - 2, top + size + 4, 4, 4);
        drawText(ctx, b.text, cx, top + 2, { size, color: '#120c1c', align: 'center' });
      });
    }
  }
}

export function makeCompanionLife(scene, life) {
  if (!kindOf(scene.roomData)) return null;
  return new CompanionLife(scene, life);
}
