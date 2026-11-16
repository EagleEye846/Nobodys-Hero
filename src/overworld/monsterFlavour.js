// MONSTER FLAVOUR: what the monsters out in chapters 4 to 6 get up to before
// you fight them. An ashling rolls in the ash, soot gulls squabble over a
// crust, a Milestone dozes with little z's, a crab sidles and clacks its claws,
// cave things twitch and drip, glassy things glint.
//
// It is only for show. A monster keeps its patrol, its sight, its lunge, its
// ambush and its cutscene clearance exactly as they are: this just wiggles how
// the sprite is drawn (npc.flavourPose, read by Npc.drawBody) and draws a few
// pixels of something round it. It stops the moment a monster is hiding,
// alerted, chasing, lunging, stunned or frozen.

import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// Chapters 4 to 6: the Deep, the coast and the Ash Road.
export const FLAVOUR_AREAS = new Set([
  'ashroad',
  'gullrest', 'saltcombe', 'wrack', 'wreck', 'lanes', 'soundings', 'isles', 'lastlight', 'reach', 'haddock_light', 'merrow',
  'belowtown', 'diggings', 'glimmer', 'stillwater', 'deep',
  // Chapters 1 to 3: the Ruins, Mount Vigil and the Long Stair, the Pinefall and Hollin, the Hushwood,
  // the Old Drains, the Lantern Marsh and the Hollow Valley (the dead city).
  'ruins', 'vigil', 'stair', 'pinefall', 'hollin', 'hushwood', 'drains', 'marsh', 'valley',
]);

const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const frac = (v) => v - Math.floor(v);
const NONE = { dx: 0, lift: 0, angle: 0, sx: 1, sy: 1 };
const pose = (bits) => ({ ...NONE, ...bits });

// --- Things drawn round a monster. (x, feet) is the spot under it, `top` the top of its sprite. ---

function zzz(ctx, x, top, t) {
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.45 + i / 3);
    const zx = Math.round(x + 4 + ph * 7 + Math.sin(ph * 6) * 1.5);
    const zy = Math.round(top - 1 - ph * 15);
    const s = ph < 0.45 ? 3 : 4;
    ctx.globalAlpha = Math.min(1, (1 - ph) * 1.6);
    for (const [color, o] of [['#1a1420', 1], ['#eaf0fa', 0]]) {
      px(ctx, color, zx + o, zy + o, s, 1);
      px(ctx, color, zx + o, zy + s - 1 + o, s, 1);
      if (s === 3) px(ctx, color, zx + 1 + o, zy + 1 + o, 1, 1);
      else if (s === 4) { px(ctx, color, zx + 2 + o, zy + 1 + o, 1, 1); px(ctx, color, zx + 1 + o, zy + 2 + o, 1, 1); }
      else px(ctx, color, zx + o, zy + o, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

function puffs(ctx, x, feet, t, color) {
  for (let i = 0; i < 5; i++) {
    const ph = frac(t * 1.7 + i * 0.2);
    const side = i % 2 ? -1 : 1;
    const r = 1 + Math.round(ph * 2);
    ctx.globalAlpha = 0.65 * (1 - ph);
    px(ctx, color, x + side * (3 + ph * 7) - r / 2, feet - 3 - ph * 7, r + 1, r);
  }
  ctx.globalAlpha = 1;
}

function sparks(ctx, x, top, t, w) {
  for (let i = 0; i < 4; i++) {
    const ph = frac(t * 0.9 + i * 0.27);
    ctx.globalAlpha = 1 - ph;
    px(ctx, i % 2 ? '#ffd070' : '#ff8a3a', x + (hash(i + 3) - 0.5) * w + Math.sin(ph * 7 + i) * 2, top + 4 - ph * 16, 1, 1);
  }
  // A thread of smoke over it.
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.5 + i / 3);
    ctx.globalAlpha = 0.45 * (1 - ph);
    px(ctx, '#5a5460', x + Math.sin(ph * 5 + i) * 3, top - ph * 14, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function glints(ctx, x, top, t, w, h, color = '#ffffff') {
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.8 + i * 0.34);
    if (ph > 0.4) continue;
    const arm = Math.round(Math.sin((ph / 0.4) * Math.PI) * 2);
    const gx = Math.round(x + (hash(i + 9) - 0.5) * w);
    const gy = Math.round(top + 2 + hash(i + 17) * Math.max(4, h - 4));
    ctx.globalAlpha = 0.95;
    px(ctx, color, gx, gy);
    if (arm) {
      px(ctx, color, gx - arm, gy);
      px(ctx, color, gx + 1, gy);
      px(ctx, color, gx, gy - arm);
      px(ctx, color, gx, gy + 1);
    }
  }
  ctx.globalAlpha = 1;
}

function bubbles(ctx, x, top, t, color) {
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.55 + i / 3);
    ctx.globalAlpha = 0.85 * (1 - ph);
    const bx = Math.round(x + (i - 1) * 3 + Math.sin(ph * 8 + i * 2) * 1.5);
    const by = Math.round(top - ph * 16);
    px(ctx, color, bx, by, 2, 2);
    px(ctx, '#ffffff', bx, by, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function drip(ctx, x, top, feet, t, color) {
  const ph = frac(t * 0.6);
  const y = top + 3 + ph * ph * (feet - top - 3);
  ctx.globalAlpha = 0.9;
  px(ctx, color, x + 5, y, 1, 2);
  if (ph > 0.88) px(ctx, color, x + 4, feet - 1, 3, 1);
  ctx.globalAlpha = 1;
}

function flicks(ctx, x, mid, t, color) {
  for (let i = 0; i < 6; i++) {
    const ph = frac(t * 2.2 + i * 0.17);
    const side = i % 2 ? -1 : 1;
    ctx.globalAlpha = 1 - ph;
    px(ctx, color, x + side * (4 + ph * 9), mid - 4 + ph * 3 + ph * ph * 7, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function feathers(ctx, x, mid, t, color) {
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.7 + i * 0.33);
    ctx.globalAlpha = 1 - ph;
    px(ctx, color, x + Math.sin(ph * 9 + i * 2) * 5, mid - 6 + ph * 14, 2, 1);
  }
  ctx.globalAlpha = 1;
}

function crust(ctx, x, feet) {
  px(ctx, '#7a5a30', x + 8, feet - 2, 3, 2);
  px(ctx, '#d2ac66', x + 8, feet - 3, 3, 1);
  px(ctx, '#d2ac66', x + 9, feet - 2, 1, 1);
}

function claws(ctx, x, mid, t, w) {
  if (frac(t * 1.6) > 0.35) return;
  const open = frac(t * 12) < 0.5;
  for (const side of [-1, 1]) {
    const cx = x + side * (w / 2 + 2);
    px(ctx, '#f4efe4', cx, mid - 3 - (open ? 1 : 0), 1, 2);
    px(ctx, '#f4efe4', cx + side * 1, mid - 4, 1, 1);
  }
}

// Wings that shed a fine powder as they go.
function powder(ctx, x, mid, t, color) {
  for (let i = 0; i < 5; i++) {
    const ph = frac(t * 0.8 + i * 0.2);
    ctx.globalAlpha = 0.9 * (1 - ph);
    px(ctx, color, x + Math.sin(i * 2.3 + ph * 4) * 6, mid - 2 + ph * 12, 1, 1);
  }
  ctx.globalAlpha = 1;
}

// Leaves coming down past it, turning over as they fall.
function leaves(ctx, x, top, feet, t) {
  const tints = ['#c8602c', '#d89030', '#a83c28'];
  for (let i = 0; i < 3; i++) {
    const ph = frac(t * 0.42 + i / 3);
    const lx = x + (i - 1) * 6 + Math.sin(ph * 9 + i * 2) * 4;
    const ly = top - 6 + ph * (feet - top + 4);
    ctx.globalAlpha = ph > 0.85 ? (1 - ph) / 0.15 : 1;
    px(ctx, tints[i], lx, ly, 2, 1);
    if (Math.sin(ph * 14 + i) > 0) px(ctx, tints[i], lx + 1, ly + 1, 1, 1);
  }
  ctx.globalAlpha = 1;
}

// Little round clouds let off the top, drifting up and thinning.
function spores(ctx, x, top, t, color) {
  for (let i = 0; i < 4; i++) {
    const ph = frac(t * 0.5 + i * 0.25);
    ctx.globalAlpha = 0.7 * (1 - ph);
    px(ctx, color, x + (i - 1.5) * 3 + Math.sin(ph * 6 + i) * 2, top + 2 - ph * 14, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// --- The moves. `len` seconds; `still` ones wait till it's standing; pose(t) shapes the sprite; fx draws. ---

const MOVES = {
  // Sound asleep: breathing, and z's drifting up.
  doze: {
    len: 6, still: true,
    pose: (t) => pose({ sy: 1 + 0.035 * Math.sin(t * 2.2), sx: 1 - 0.015 * Math.sin(t * 2.2), angle: 0.05 }),
    fx: (c, o) => zzz(c, o.x, o.top, o.t),
  },
  // Rocking and rolling in whatever is underfoot, a cloud kicked up.
  roll: {
    len: 3.2,
    pose: (t) => pose({ angle: Math.sin(t * 6) * 0.3, dx: Math.sin(t * 6) * 2, sx: 1 + 0.06 * Math.sin(t * 12) }),
    fx: (c, o, m) => puffs(c, o.x, o.feet, o.t, m.color ?? '#8a8480'),
  },
  // A hop and a flutter, a crust on the ground and feathers flying.
  squabble: {
    len: 3.4, still: true,
    pose: (t) => pose({ lift: Math.abs(Math.sin(t * 9)) * 3, angle: Math.sin(t * 13) * 0.2, dx: Math.sin(t * 5) * 1.5 }),
    fx: (c, o, m) => { crust(c, o.x, o.feet); feathers(c, o.x, o.mid, o.t, m.color ?? '#3a3640'); },
    start: (flavour, npc) => flavour.noteFlap(npc),
  },
  // Sideways, shuffling, claws up.
  sidle: {
    len: 3.6,
    pose: (t) => pose({ dx: Math.sin(t * 2.4) * 3, angle: Math.sin(t * 5) * 0.06 }),
    fx: (c, o) => claws(c, o.x, o.mid, o.t, o.w),
  },
  // Hanging about, a sudden twitch now and then, a drip.
  twitch: {
    len: 4.2,
    pose: (t) => (frac(t * 0.75) < 0.12 ? pose({ dx: Math.sin(t * 90) * 1, angle: Math.sin(t * 60) * 0.1, lift: 1 }) : pose({ sy: 1 + 0.012 * Math.sin(t * 3) })),
    fx: (c, o, m) => drip(c, o.x, o.top, o.feet, o.t, m.color ?? '#9ac4d8'),
  },
  glint: {
    len: 3.6,
    pose: (t) => pose({ sy: 1 + 0.02 * Math.sin(t * 4) }),
    fx: (c, o, m) => glints(c, o.x, o.top, o.t, o.w, o.h, m.color ?? '#ffffff'),
  },
  bubbles: {
    len: 4,
    pose: (t) => pose({ sy: 1 + 0.03 * Math.sin(t * 2.6), sx: 1 - 0.02 * Math.sin(t * 2.6) }),
    fx: (c, o, m) => bubbles(c, o.x, o.top, o.t, m.color ?? '#bfe0e8'),
  },
  // A jelly's slow squeeze.
  pulse: {
    len: 4,
    pose: (t) => pose({ sy: 1 + 0.1 * Math.sin(t * 3), sx: 1 - 0.07 * Math.sin(t * 3), lift: 1 + Math.sin(t * 3) }),
    fx: (c, o, m) => (m.color ? bubbles(c, o.x, o.top, o.t, m.color) : null),
  },
  embers: {
    len: 4,
    pose: (t) => pose({ sy: 1 + 0.05 * Math.sin(t * 5) }),
    fx: (c, o) => sparks(c, o.x, o.top, o.t, o.w),
  },
  // A good shake from head to foot, bits flying off.
  shake: {
    len: 1.7,
    pose: (t) => pose({ dx: t > 0.2 && t < 1.4 ? (Math.floor(t * 18) % 2 ? 1.5 : -1.5) : 0, angle: t > 0.2 && t < 1.4 ? Math.sin(t * 40) * 0.08 : 0 }),
    fx: (c, o, m) => (o.t > 0.2 && o.t < 1.5 ? flicks(c, o.x, o.mid, o.t, m.color ?? '#8a8480') : null),
  },
  // Swaying on its chain or its feet.
  sway: {
    len: 4,
    pose: (t) => pose({ angle: Math.sin(t * 2) * 0.14, dx: Math.sin(t * 2) * 1.5 }),
  },
  // Looking about, one way then the other.
  peer: {
    len: 3.4, still: true,
    pose: (t) => pose({ dx: Math.sin(t * 1.6) * 2.5, lift: Math.abs(Math.sin(t * 0.8)) }),
  },
  // Tinkering and hopping, something small glinting.
  tinker: {
    len: 3, still: true,
    pose: (t) => pose({ lift: Math.abs(Math.sin(t * 7)) * 2, dx: Math.sin(t * 3.5) * 1.5 }),
    fx: (c, o) => glints(c, o.x, o.top, o.t, o.w, o.h, '#ffe8a0'),
  },
  // Wings going, a fine powder falling.
  flutter: {
    len: 3.6,
    pose: (t) => pose({ lift: Math.abs(Math.sin(t * 8)) * 1.5, dx: Math.sin(t * 3) * 1.5 }),
    fx: (c, o, m) => powder(c, o.x, o.mid, o.t, m.color ?? '#d8ecff'),
  },
  // Leaves coming down past it.
  leaves: {
    len: 4.2,
    pose: (t) => pose({ angle: Math.sin(t * 1.6) * 0.05 }),
    fx: (c, o) => leaves(c, o.x, o.top, o.feet, o.t),
  },
  // Puffs of spores off the top.
  spores: {
    len: 4,
    pose: (t) => pose({ sy: 1 + 0.04 * Math.sin(t * 2.4), sx: 1 - 0.025 * Math.sin(t * 2.4) }),
    fx: (c, o, m) => spores(c, o.x, o.top, o.t, m.color ?? '#c8d0a8'),
  },
  // A ring of iron rung and left humming.
  ting: {
    len: 2.8,
    pose: (t) => pose({ angle: Math.sin(t * 16) * 0.16 * Math.max(0, 1 - t / 1.8), dx: Math.sin(t * 16) * 1.2 * Math.max(0, 1 - t / 1.8) }),
    fx: (c, o) => glints(c, o.x, o.top, o.t, o.w, o.h, '#f0f4ff'),
  },
  // Spinning on the spot.
  whirl: {
    len: 2.6,
    pose: (t) => pose({ angle: Math.sin(t * 8) * 0.4 }),
    fx: (c, o) => puffs(c, o.x, o.feet, o.t, '#b8b0a8'),
  },
};

// What each one gets up to: [move, options].
const ASH = '#8a8480';
const SOOT = '#3a3640';
const SALT = '#e8e8f0';
const WET = '#9ac4d8';
const SAND = '#d8c08a';
const DUST = '#a09484';
const FLAVOUR = {
  ashling: [['roll', { color: ASH }], ['shake', { color: ASH }], ['doze']],
  soot_gull: [['squabble', { color: SOOT }], ['shake', { color: SOOT }]],
  milestone: [['doze'], ['doze'], ['shake', { color: DUST }]],
  charcur: [['shake', { color: SOOT }], ['doze'], ['roll', { color: SOOT }]],
  slagling: [['embers'], ['shake', { color: '#ff8a3a' }], ['doze']],
  pinwheel: [['whirl'], ['sway']],
  dowager_crab: [['sidle'], ['sidle'], ['shake', { color: WET }]],
  limpet_knight: [['sidle'], ['peer'], ['doze']],
  shellac: [['sidle'], ['doze']],
  sandcastle: [['shake', { color: SAND }], ['roll', { color: SAND }]],
  dunlin_dancer: [['squabble', { color: '#5a5048' }], ['sidle']],
  gullion: [['squabble', { color: '#e4e0d8' }], ['doze'], ['peer']],
  kelpie_foal: [['shake', { color: WET }], ['twitch', { color: WET }]],
  wrackeel: [['bubbles'], ['twitch', { color: WET }]],
  blind_crab: [['sidle'], ['twitch', { color: WET }]],
  tidewight: [['bubbles'], ['sway']],
  bellbuoy: [['sway'], ['twitch', { color: WET }]],
  old_diver: [['peer'], ['bubbles'], ['sway']],
  ghost_deckhand: [['peer'], ['pulse', { color: '#bfe8e0' }]],
  net_wraith: [['pulse'], ['shake', { color: WET }]],
  salt_shade: [['pulse'], ['shake', { color: SALT }]],
  storm_imp: [['glint', { color: '#e8f0a0' }], ['shake', { color: '#e8f0a0' }]],
  moonjelly: [['pulse', { color: '#cfe4ee' }], ['bubbles']],
  blindfish: [['bubbles'], ['twitch', { color: WET }]],
  olm: [['doze'], ['bubbles']],
  murk: [['pulse', { color: '#6a5a8a' }], ['bubbles', { color: '#8a78a8' }]],
  gleamsnail: [['glint'], ['doze']],
  quartzling: [['glint'], ['twitch', { color: '#d8e4ff' }]],
  prismoth: [['glint', { color: '#ffd8f4' }], ['twitch', { color: '#d8e4ff' }]],
  magpiemole: [['tinker'], ['twitch', { color: DUST }], ['peer']],
  powder_monkey: [['tinker'], ['shake', { color: DUST }]],
  drillbug: [['twitch', { color: DUST }], ['shake', { color: DUST }], ['doze']],
  gnawer: [['twitch', { color: DUST }], ['peer']],
  fiddler: [['twitch', { color: DUST }], ['peer'], ['tinker']],
};
// Chapters 1 to 3.
const SNOW = '#eef4fa';
const LEAF = '#c8602c';
const FLAVOUR_EARLY = {
  bunny: [['roll', { color: DUST }], ['shake', { color: DUST }], ['peer']],
  dummy: [['sway'], ['shake', { color: '#b8a070' }]],
  columneon: [['doze'], ['peer'], ['glint', { color: '#c8d8a0' }]],
  duskling: [['doze'], ['shake', { color: '#8a7a9a' }], ['peer']],
  waxling: [['embers'], ['sway'], ['pulse', { color: '#f0e0a0' }]],
  craghorn: [['peer'], ['shake', { color: DUST }], ['doze']],
  step: [['sway'], ['twitch', { color: DUST }]],
  ice_moth: [['flutter', { color: '#d8ecff' }], ['glint', { color: '#d8ecff' }]],
  stone_golem: [['doze'], ['shake', { color: DUST }], ['glint', { color: '#d8e8ff' }]],
  glintling: [['glint'], ['pulse', { color: '#e8f4ff' }]],
  rimewing: [['flutter', { color: '#ffe8a0' }], ['peer']],
  chough: [['squabble', { color: '#2a2a30' }], ['peer'], ['shake', { color: SNOW }]],
  frostbite: [['shake', { color: SNOW }], ['doze'], ['sway']],
  ringer: [['ting'], ['sway']],
  burrhog: [['roll', { color: '#b08850' }], ['shake', { color: '#8a5a30' }], ['doze']],
  sapling: [['leaves'], ['sway']],
  russet: [['peer'], ['leaves'], ['doze'], ['shake', { color: LEAF }]],
  hayward: [['sway'], ['shake', { color: '#c8a860' }]],
  hob: [['tinker'], ['peer']],
  grist: [['twitch', { color: DUST }], ['tinker'], ['shake', { color: '#d8d0c0' }]],
  puffcap: [['spores', { color: '#c8d0a8' }], ['doze']],
  knotling: [['sway'], ['shake', { color: '#8a6a40' }], ['leaves']],
  gloamworm: [['pulse', { color: '#b8e87a' }], ['glint', { color: '#d8ff9a' }]],
  siltling: [['bubbles', { color: '#8a7a60' }], ['pulse']],
  clinker: [['sidle'], ['bubbles'], ['twitch', { color: WET }]],
  slipjack: [['bubbles'], ['twitch', { color: WET }]],
  bog_toad: [['doze'], ['bubbles', { color: '#a8c890' }]],
  reed_stalker: [['peer'], ['sway'], ['doze']],
  wisp: [['pulse', { color: '#d8ffd0' }], ['glint', { color: '#d8ffd0' }]],
  cairn_hound: [['shake', { color: DUST }], ['doze'], ['peer']],
  lamp_mite: [['flutter', { color: '#f0e0b0' }], ['glint', { color: '#fff0c0' }]],
  heralds_echo: [['pulse', { color: '#cfd8ee' }], ['peer'], ['sway']],
};
Object.assign(FLAVOUR, FLAVOUR_EARLY);
const DEFAULT = [['peer'], ['shake']];

export class MonsterFlavour {
  constructor(scene) {
    this.scene = scene;
    this.time = 0;
    // A flapping burst the party might notice: { x, y, at }.
    this.flap = null;
    this.states = new Map();
    this.things = scene.npcs.map((npc) => {
      const state = { next: 1 + Math.random() * 6, move: null, t: 0 };
      this.states.set(npc, state);
      const flavour = this;
      return {
        get sortY() { return npc.y + 0.5; },
        draw: (ctx, camera) => flavour.draw(ctx, camera, npc, state),
      };
    });
  }

  noteFlap(npc) {
    this.flap = { x: npc.x, y: npc.y, at: this.time };
  }

  // Free to be doing something: not hiding, not noticing anyone, not fighting.
  idle(npc) {
    return !(npc.lurking || npc.chasing || npc.alert > 0 || npc.leap || npc.lunge || npc.cooldown > 0
      || npc.frozen || npc.stunned > 0 || npc.dormant || npc.ghostAlpha === 0 || npc.pouncing || npc.disguised || npc.submerged);
  }

  onScreen(npc) {
    const cam = this.scene.camera;
    const x = npc.x - cam.x;
    const y = npc.y - cam.y;
    return x > -24 && x < W + 24 && y > -10 && y < H + 50;
  }

  update(dt) {
    this.time += dt;
    for (const npc of this.scene.npcs) {
      const state = this.states.get(npc);
      if (!state) continue;
      if (!this.idle(npc) || !this.onScreen(npc)) {
        state.move = null;
        npc.flavourPose = null;
        continue;
      }
      const table = FLAVOUR[npc.enemy] ?? DEFAULT;
      if (state.move) {
        state.t += dt;
        const move = MOVES[state.move.name];
        // A sleeper who gets up and walks off has finished sleeping.
        if (state.t >= move.len || (move.still && npc.moving)) {
          state.move = null;
          state.next = 3 + Math.random() * 6;
          npc.flavourPose = null;
        } else {
          npc.flavourPose = move.pose(state.t);
        }
        continue;
      }
      npc.flavourPose = null;
      state.next -= dt;
      if (state.next > 0) continue;
      const options = table.filter(([name]) => !(MOVES[name].still && npc.moving));
      if (!options.length) { state.next = 1.5; continue; }
      const [name, opts = {}] = options[Math.floor(Math.random() * options.length)];
      state.move = { name, ...opts };
      state.t = 0;
      MOVES[name].start?.(this, npc);
    }
  }

  draw(ctx, camera, npc, state) {
    if (!state.move || !this.scene.npcs.includes(npc) || !this.idle(npc)) return;
    const move = MOVES[state.move.name];
    if (!move.fx) return;
    const w = npc.sprite.width;
    const h = npc.sprite.height;
    const x = Math.round(npc.x) - camera.x;
    const feet = Math.round(npc.y) - camera.y;
    const lift = npc.gait === 'fly' ? 12 : npc.gait === 'float' ? 6 : 0;
    const top = feet - 2 - lift - h;
    move.fx(ctx, { x, feet, top, mid: top + h / 2, w, h, t: state.t }, state.move);
  }
}

export function makeMonsterFlavour(scene) {
  if (!FLAVOUR_AREAS.has(scene.roomData.area) || !scene.npcs?.length) return null;
  return new MonsterFlavour(scene);
}
