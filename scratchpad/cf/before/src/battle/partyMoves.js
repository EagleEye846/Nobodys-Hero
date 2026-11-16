// The party moving in battle: the hero's sword (or the Fallen Star) swinging
// with each slash of the strike bar, Ves's umbrella jabbing and sweeping,
// Bramble's hatchet chopping; a cast pose for every spell; a guard for DEFEND
// (and Bramble down in a bush for HIDE); a flinch when hit; pulling out an
// item and using it (or tossing it to a friend); a tired stance on low HP; a
// dizzy heap when knocked down; lowered weapons when an enemy is spared; and a
// little victory pose.
//
// Only how it looks: nothing here touches damage, timing or turns, and none
// of it waits for anything. Every pose is worked out each frame from the
// battle as it stands (who's defending, hiding, hit, low on HP, who just
// slashed) and from a few short "acts" started by battleScene.js (a spell
// cast, an item used, a blow landing). Each is over in about a second, or
// lasts as long as the state it shows.
//
// Drawn the way the sprites are: each member is put together on a small
// canvas at the sprites' own pixel size (body, arm, weapon, smear), then
// scaled up like any sprite, so a turning sword is still on the pixel grid.

import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE } from '../data/art/props.js';
import { PLAYER_SPRITES, PLAYER_PALETTE } from '../data/art/player.js';
import { VES_FRAMES } from '../data/art/vesper.js';
import { BRAMBLE_FRAMES } from '../data/art/bramble.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS } from '../data/items.js';
import { KIT_WEAPONS, KIT_ITEMS, KIT_BUSH } from '../data/art/partyBattle.js';
import { sfx } from '../audio/music.js';
import { kick } from './battleFeel.js';

const SCALE = 2;
// The canvas each member is put together on, in sprite pixels, and where
// their feet go on it.
const CW = 96;
const CH = 84;
const AX = 48;
const AY = 70;

// How long things take (seconds).
const SWING = 0.12;
const SWING_HOLD = 0.2;
const SWING_BACK = 0.16;
const FINISH = 0.16;
const FINISH_LIFE = 0.85;
const CAST_LIFE = 1.1;
const RELEASE_LIFE = 0.4;
const FLINCH_LIFE = 0.38;
const ITEM_LIFE = 1.05;
const TOSS_SECONDS = 0.32;
const SPARE_LIFE = 1.2;
// A swing's smear starts at this angle (a little back of straight up).
const SMEAR_FROM = -0.7;
// Low on HP: under this share of their HP (as the HP bar goes red).
const TIRED_SHARE = 0.3;

// Each member's frame, mirrored to face right as in battle, and the points
// the poses work from (in that frame's pixels): the shoulder their arm
// swings from, the row their head starts leaning from (`split`), the row
// their legs start (`legs`), their sleeve and hand colours.
const flip = (rows) => rows.map((row) => [...row].reverse().join(''));

// A frame with its weapon taken out of it (the umbrella over Ves's shoulder,
// the hatchet over Bramble's), so the one in their hand is the only one:
// those colours cleared, and any outline left on its own cleared too.
function stripped(rows, clear, extra = () => false) {
  const grid = rows.map((row, y) => [...row].map((ch, x) => (clear.includes(ch) || extra(x, y, ch) ? '.' : ch)));
  const solid = (x, y) => grid[y]?.[x] && grid[y][x] !== '.' && grid[y][x] !== 'k';
  const out = grid.map((row, y) => row.map((ch, x) => {
    if (ch !== 'k') return ch;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (solid(x + dx, y + dy)) return ch;
    return '.';
  }));
  return out.map((row) => row.join(''));
}

const RIGS = {
  hero: {
    // His arm (the skin at his side) goes: the one in his hand is drawn.
    rows: () => flip(PLAYER_SPRITES.leftIdle.map((row, y) => (y >= 12 && y <= 13 ? row.replace('s', 'c') : row))),
    base: () => flip(PLAYER_SPRITES.leftIdle),
    palette: PLAYER_PALETTE,
    shoulder: { x: 5, y: 10 },
    split: 9,
    legs: 15,
    armLength: 4,
    sleeve: '#3e7bd6',
    hand: '#f1c49a',
  },
  vesper: {
    rows: () => flip(stripped(VES_FRAMES.leftIdle, 'qQd4', (x, y) => y < 6)),
    base: () => flip(VES_FRAMES.leftIdle),
    palette: PROP_PALETTE,
    shoulder: { x: 8, y: 16 },
    split: 15,
    legs: 22,
    armLength: 5,
    sleeve: '#4a74b0',
    hand: '#d9a441',
  },
  bramble: {
    rows: () => flip(stripped(BRAMBLE_FRAMES.leftIdle, 'MSl', (x, y, ch) => ch === 'C' && x >= 11 && (y === 12 || y === 13))),
    base: () => flip(BRAMBLE_FRAMES.leftIdle),
    palette: PROP_PALETTE,
    shoulder: { x: 8, y: 13 },
    split: 12,
    legs: 18,
    armLength: 4,
    sleeve: '#c43b3b',
    hand: '#f2d6b0',
  },
};

// The colours of a swing's smear: the hero's (teal, his aura's), the Fallen
// Star's (white, gold and star-blue), Ves's (her lilac wind), Bramble's (his orange).
const SMEARS = {
  sword: ['#ffffff', '#bfe8ff', '#4fe3d0'],
  star: ['#ffffff', '#fff2a0', '#9ad8ff'],
  umbrella: ['#ffffff', '#d8f0fa', '#9a7ad8'],
  axe: ['#ffffff', '#ffd2a0', '#e0662c'],
};

// ---------- what each spell looks like being cast ----------

// The hero's spells: a cast style (how he moves) and a colour (the light at
// his blade). Starfall and Nova have their own.
const HERO_CASTS = {
  heal: ['raise', '#7dff9a'], mend: ['raise', '#7dff9a'], renew: ['raise', '#7dff9a'],
  balm: ['raise', '#3ee08f'], restore: ['raise', '#3ee08f'],
  ward: ['ward', '#ffe9a0'], aegis: ['ward', '#ffe9a0'], bastion: ['ward', '#ffd25e'], counter: ['ward', '#ffffff'],
  ember: ['point', '#ff8c1a'], sunburst: ['raise', '#ffd25e'], spark: ['point', '#fff2a0'], lance: ['point', '#bfe8ff'],
  chain: ['point', '#7fd0ff'], siphon: ['point', '#ff5470'],
  comet: ['hurl', '#ff8c1a'], tempest: ['hurl', '#bfe8ff'], overwhelm: ['hurl', '#ff5470'],
  rend: ['slash', '#ff5470'], sunder: ['slash', '#ff5470'], cleave: ['slash', '#ff8c1a'], undercut: ['sweep', '#7fd0ff'],
  undertow: ['sweep', '#2a6fb0'], brine: ['sweep', '#bfe8ff'], ebb_flow: ['sweep', '#5fb8ff'], low_water: ['sweep', '#5fb8ff'],
  hush: ['calm', '#ffffff'], serenade: ['calm', '#ffe14d'], soothe: ['calm', '#fff6b0'], lull: ['calm', '#fff6b0'],
  pacify: ['calm', '#ffe14d'], truce: ['calm', '#ffe14d'], weaken: ['calm', '#b07cff'], stall: ['calm', '#bfe8ff'],
  sidestep: ['step', '#ffe9a0'], duck: ['step', '#bfe8ff'],
  starstorm: ['raise', '#ffe14d'], starfall: ['starfall', '#ffe14d'], nova: ['nova', '#ffffff'],
};

// Ves's and Bramble's, by the label on the button.
const ALLY_CASTS = {
  SHELTER: ['shield', '#e0aa48'], BRACE: ['shield', '#d8f0fa'], 'HOLD FAST': ['shield', '#ffe9a0'], WINDBREAK: ['shield', '#ffe9a0'],
  'CLEAR SKIES': ['openUp', '#fff2a0'], DAYBREAK: ['openUp', '#ffd25e'], AURORA: ['openUp', '#7dff9a'],
  BILLOW: ['openUp', '#d8f0fa'], UPDRAFT: ['openUp', '#d8f0fa'], LIFT: ['openUp', '#d8f0fa'],
  FIRESIDE: ['shakeOut', '#ff8c1a'],
  FLURRY: ['twirl', '#ffffff'], WHITEOUT: ['twirl', '#e6f6ff'], 'RAIN DANCE': ['twirl', '#7fd0ff'], MONSOON: ['twirl', '#5fb8ff'],
  'PARASOL SPIN': ['twirl', '#ffe9a0'], CYCLONE: ['twirl', '#d8f0fa'], HURRICANE: ['twirl', '#bfe8ff'], TWIRL: ['twirl', '#fff6b0'], WHIRL: ['twirl', '#5fb8ff'],
  SLEET: ['point', '#bfe8ff'], HAILSTORM: ['point', '#e6f6ff'], DOWNPOUR: ['point', '#5fb8ff'],
  SUPERCELL: ['pointFoe', '#bfe8ff'], CHARGE: ['pointFoe', '#fff2a0'], DOWNDRAFT: ['pointFoe', '#d8f0fa'],
  WINDSHEAR: ['slice', '#d8f0fa'], THUNDERCLAP: ['snap', '#fff2a0'], 'SHEET LIGHTNING': ['tap', '#bfe8ff'],
  ZEPHYR: ['breeze', '#ffe9a0'], 'COOL CHANGE': ['breeze', '#d8f0fa'], 'STILL AIR': ['breeze', '#ffffff'], HEADWIND: ['headwind', '#d8f0fa'],
  'HOT SOUP': ['item', 'soup'],
  CHOP: ['chop', 0.22], 'MARK IT': ['chop', 0.22], FELL: ['chop', 0.4], 'TIMBER!': ['chop', 0.3], 'THE BIG ONE': ['chop', 0.8],
  SPLINTERS: ['splinters', 0],
  HOLLER: ['holler', '#ff8c1a'], 'WAR CRY': ['holler', '#ff8c1a'], WHISTLE: ['holler', '#ffffff'], 'LOOK OUT!': ['holler', '#ffe14d'],
  'COUNT TO TEN': ['breathe', '#bfe8ff'],
  'THREE CHEERS': ['cheer', '#ffe14d'], 'SING-ALONG': ['cheer', '#ffe14d'], RALLY: ['rally', '#ffe14d'],
  SLINGSHOT: ['throw', '#8a8296'], CONKERS: ['throw', '#7a4f2a'], MARBLES: ['throw', '#7fd0ff'], 'POCKET SAND': ['throw', '#e0c890'],
  'HAND UP': ['throw', '#c08a4e'],
  BISCUIT: ['item', 'food'],
  CANNONBALL: ['cannonball', '#5fb8ff'],
  'STAND FIRM': ['standFirm', '#ffe9a0'], "I'VE GOT YOU": ['standFirm', '#7dff9a'],
  'SHAKE IT OFF': ['shakeOff', '#7fd0ff'],
  HIDE: ['dive', '#b81e30'],
};

// A spell nobody's listed yet, by what it does.
function guessCast(id, command) {
  if (!command) return ['point', '#ffffff'];
  if (command.strikeOne || command.team) return id === 'bramble' ? ['chop', 0.25] : ['pointFoe', '#ffffff'];
  if (command.strikeAll) return id === 'bramble' ? ['splinters', 0] : ['twirl', '#ffffff'];
  if (command.guard || command.cover || command.absorb || command.wade) return id === 'bramble' ? ['standFirm', '#ffe9a0'] : ['shield', '#ffe9a0'];
  if (command.heal || command.healAll || command.regen) return id === 'bramble' ? ['cheer', '#7dff9a'] : ['openUp', '#7dff9a'];
  return id === 'bramble' ? ['holler', '#ffe14d'] : ['breeze', '#ffffff'];
}

// ---------- little helpers ----------

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - clamp01(t)) ** 3;
const easeInOut = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
// 0 to 1 over [a, b].
const span = (t, a, b) => clamp01((t - a) / (b - a));
// A steady 0-1 for speck i (so specks don't jump about from frame to frame).
function rand(seed, i, salt = 0) {
  let n = (seed * 374761393 + i * 668265263 + salt * 2246822519) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function dot(c, x, y, color) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// A line of single pixels from a to b (Bresenham), calling `put` on each.
function line(x0, y0, x1, y1, put) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const tx = Math.round(x1);
  const ty = Math.round(y1);
  const dx = Math.abs(tx - x);
  const dy = -Math.abs(ty - y);
  const sx = x < tx ? 1 : -1;
  const sy = y < ty ? 1 : -1;
  let err = dx + dy;
  for (let guard = 0; guard < 200; guard++) {
    put(x, y);
    if (x === tx && y === ty) return;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

// A sparkle: a plus with a bright middle, `arm` pixels each way.
function sparkle(c, x, y, color, arm = 1, core = '#ffffff') {
  for (let k = -arm; k <= arm; k++) {
    dot(c, x + k, y, color);
    dot(c, x, y + k, color);
  }
  dot(c, x, y, core);
}

// ---------- the moves ----------

export class PartyMoves {
  constructor() {
    this.acts = new Map();
    this.strike = null;
    this.seenSlashes = 0;
    this.combo = 0;
    this.lastFlinch = 0;
    this.spared = new Set();
    this.wonAt = null;
    this.tosses = [];
    this.lastCast = new Map();
    this.boomed = new WeakSet();
    this.canvas = document.createElement('canvas');
    this.canvas.width = CW;
    this.canvas.height = CH;
    this.c = this.canvas.getContext('2d');
    this.c.imageSmoothingEnabled = false;
    this.sprites = {};
  }

  // ---- started by battleScene.js ----

  // A spell: the hero's (`key` a spell id) or an ally's (a SPELLS label).
  cast(battle, member, key, command = null) {
    if (!member || member.hurt) return;
    const [style, extra] = member === battle.hero ? HERO_CASTS[key] ?? ['point', '#ffffff'] : ALLY_CASTS[key] ?? guessCast(member.id, command);
    this.lastCast.set(member, { style, extra });
    if (style === 'item') {
      this.item(battle, member, null, member, extra);
      return;
    }
    this.start(battle, member, 'cast', { style, extra, seed: Math.floor(Math.random() * 1e6) });
  }

  // An item: `who` uses it on `target` (themselves, or a friend they toss it to).
  item(battle, who, id, target, look = null) {
    if (!who || who.hurt) return;
    const item = id ? ITEMS[id] : null;
    const kind = look ?? (item?.light ? 'candle' : item?.heal && !item.use ? 'food' : 'other');
    this.start(battle, who, 'item', { look: kind, target: target && target !== who && !item?.use ? target : null, eat: kind === 'food' || kind === 'soup', seed: Math.floor(Math.random() * 1e6) });
  }

  // A blow lands (resolveStrike, strikeAll): the strike bar's last big swing,
  // or a spell's release.
  landed(battle, kind) {
    const member = battle.striker ?? battle.actor ?? battle.hero;
    if (!member || member.hurt || member.hp <= 0) return;
    if (kind === 'fight') this.start(battle, member, 'finish', { seed: Math.floor(Math.random() * 1e6) });
    else this.start(battle, member, 'release', { cast: this.lastCast.get(member) ?? null });
  }

  start(battle, member, kind, data = {}) {
    this.acts.set(member, { kind, at: battle.time, ...data });
  }

  // ---- watching the battle ----

  // Each frame (not while a hit holds the stage still): the strike bar's
  // slashes as they're hit or missed, hits taken, enemies spared, the win,
  // and Nova's and Starfall's big moments (a boom as they land).
  update(battle) {
    const strike = battle.phase === 'fight' ? battle.strike : null;
    if (strike !== this.strike) {
      this.strike = strike;
      this.seenSlashes = 0;
      this.combo = 0;
    }
    if (strike) {
      for (let i = this.seenSlashes; i < strike.slashes.length; i++) {
        const slash = strike.slashes[i];
        if (slash.state === 'sliding') break;
        this.seenSlashes = i + 1;
        const who = battle.striker ?? battle.hero;
        if (slash.state === 'hit') this.start(battle, who, 'swing', { n: this.combo++, perfect: slash.closeness > 0.85 });
        else this.start(battle, who, 'whiff', { n: this.combo });
      }
    }
    if (battle.heroFlinch > this.lastFlinch + 1e-6 && battle.flinching) this.start(battle, battle.flinching, 'flinch');
    this.lastFlinch = battle.heroFlinch;
    for (const foe of battle.foes) {
      if (foe.state !== 'pacified' || this.spared.has(foe)) continue;
      this.spared.add(foe);
      for (const member of battle.party) if (member.hp > 0 && !this.acts.get(member)) this.start(battle, member, 'spare');
    }
    if (battle.result === 'won' && this.wonAt === null) this.wonAt = battle.time;
    for (const e of battle.fx?.effects ?? []) {
      if ((e.kind === 'nova' || e.kind === 'starfallShow') && !this.boomed.has(e) && e.t >= (e.kind === 'nova' ? 0.45 : 1.1)) {
        this.boomed.add(e);
        sfx('boom');
        // A big shake as it lands (none with SCREEN SHAKE off).
        kick(battle, 7, 0.45);
      }
    }
    this.tosses = this.tosses.filter((toss) => battle.time - toss.at < TOSS_SECONDS + 0.4);
  }

  // ---- drawing ----

  spritesFor(key) {
    if (!this.sprites[key]) {
      const rig = RIGS[key];
      this.sprites[key] = { bare: makeSprite(rig.rows(), rig.palette), base: makeSprite(rig.base(), rig.palette) };
    }
    return this.sprites[key];
  }

  weaponSprite(kind) {
    const key = `w:${kind}`;
    if (!this.sprites[key]) this.sprites[key] = makeSprite(KIT_WEAPONS[kind].rows, KIT_WEAPONS[kind].palette);
    return this.sprites[key];
  }

  itemSprite(look) {
    const key = `i:${look}`;
    if (!this.sprites[key]) this.sprites[key] = makeSprite(KIT_ITEMS[look].rows, KIT_ITEMS[look].palette);
    return this.sprites[key];
  }

  bushSprite() {
    if (!this.sprites.bush) {
      const { w, h, blobs, colors, berries } = KIT_BUSH;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const c = canvas.getContext('2d');
      const inside = (x, y) => y < h - 1 && blobs.some(([bx, by, r]) => (x + 0.5 - bx) ** 2 + (y + 0.5 - by) ** 2 <= r * r);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (!inside(x, y)) {
            if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) dot(c, x, y, colors.outline);
            continue;
          }
          // Lit from the top left; little leaf flecks.
          const light = (w - x) * 0.4 + (h - y) * 0.9 + ((x * 7 + y * 3) % 5);
          const color = light > 17 ? colors.shine : light > 12 ? colors.light : light > 7 ? colors.mid : colors.dark;
          dot(c, x, y, (x + y * 2) % 7 === 0 && color !== colors.dark ? colors.mid : color);
        }
      }
      for (const [x, y] of berries) dot(c, x, y, colors.berry);
      this.sprites.bush = canvas;
    }
    return this.sprites.bush;
  }

  rigKey(battle, member) {
    if (member === battle.hero) return 'hero';
    return RIGS[member.id] ? member.id : null;
  }

  heroWeapon() {
    return HERO_STATE.weapon === 'fallen_star' ? 'star' : 'sword';
  }

  weaponFor(battle, member) {
    if (member === battle.hero) return this.heroWeapon();
    return member.id === 'vesper' ? 'umbrella' : member.id === 'bramble' ? 'axe' : null;
  }

  // One member, standing (not down): `i` is their place in the line.
  drawMember(ctx, battle, member, i, feetX, feetY) {
    const key = this.rigKey(battle, member);
    const lunging = (battle.phase === 'fight' || battle.phase === 'fightResult') && member === (battle.striker ?? battle.hero);
    let sx = lunging ? 12 : 0;
    if (battle.heroFlinch > 0 && member === (battle.flinching ?? battle.hero)) sx += Math.round(Math.sin(battle.heroFlinch * 60) * 2);
    const bob = Math.round(Math.sin(battle.time * 2.5 + i));
    // Someone with no moves of their own (a friend hurt and sitting down, or
    // anyone new): their sprite as it always was.
    if (!key || member.hurt) {
      const w = member.sprite.width * SCALE;
      const h = member.sprite.height * SCALE;
      ctx.drawImage(member.sprite, feetX - w / 2 + sx, feetY - h + bob, w, h);
      return;
    }
    const pose = this.pose(battle, member, key);
    this.compose(battle, member, key, pose);
    const x = feetX - AX * SCALE + sx;
    const y = feetY - AY * SCALE + bob;
    // Afterimages trail a lunge, and a swing.
    if (lunging || pose.trail) {
      for (const [offset, alpha] of [[-10, 0.25], [-20, 0.1]]) {
        ctx.globalAlpha = alpha * (pose.trail ?? 1);
        ctx.drawImage(this.canvas, x + offset, y, CW * SCALE, CH * SCALE);
      }
      ctx.globalAlpha = 1;
    }
    if (pose.flip) {
      ctx.save();
      ctx.translate(feetX + sx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.canvas, -AX * SCALE, y, CW * SCALE, CH * SCALE);
      ctx.restore();
    } else {
      ctx.drawImage(this.canvas, x, y, CW * SCALE, CH * SCALE);
    }
    if (pose.after) pose.after(ctx, feetX + sx, feetY + bob);
  }

  // Knocked down: on their side, their weapon dropped on the floor beside
  // them, a few stars going round their head. Not hurt badly: just down.
  drawDown(ctx, battle, member, feetX, feetY) {
    const key = this.rigKey(battle, member);
    const sprite = key && !member.hurt ? this.spritesFor(key)[member === battle.hero ? 'bare' : 'base'] : member.sprite;
    const w = sprite.width * SCALE;
    const h = sprite.height * SCALE;
    const kind = key && !member.hurt ? this.weaponFor(battle, member) : null;
    // (Ves's and Bramble's stay over their shoulders, in their frames.)
    if (kind && member === battle.hero) {
      const weapon = this.weaponSprite(kind);
      ctx.save();
      ctx.translate(feetX + 10, feetY - 3);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(weapon, -weapon.width, -weapon.height / 2 * SCALE, weapon.width * SCALE, weapon.height * SCALE);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(feetX, feetY - 6);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(sprite, -w / 2, -h, w, h);
    ctx.restore();
    // Stars round the head (which lies to the left).
    const hx = feetX - h + 8;
    const hy = feetY - 6 - w / 2 - 6;
    for (let k = 0; k < 3; k++) {
      const a = battle.time * 3 + (k * Math.PI * 2) / 3;
      const px = Math.round(hx + Math.cos(a) * 9);
      const py = Math.round(hy + Math.sin(a) * 3);
      ctx.globalAlpha = Math.sin(a) > -0.2 ? 1 : 0.45;
      ctx.fillStyle = k === 1 ? '#ffffff' : '#ffe14d';
      ctx.fillRect(px - 2, py, 6, 2);
      ctx.fillRect(px, py - 2, 2, 6);
    }
    ctx.globalAlpha = 1;
  }

  // Over the whole party: items in the air, tossed to a friend.
  drawOver(ctx, battle) {
    for (const toss of this.tosses) {
      const p = (battle.time - toss.at) / TOSS_SECONDS;
      if (p < 0) continue;
      const sprite = this.itemSprite(toss.look);
      if (p >= 1) {
        // A pop of sparkle as it's caught.
        const q = (p - 1) / 0.35 * TOSS_SECONDS;
        if (q > 1) continue;
        ctx.globalAlpha = 1 - q;
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          ctx.fillStyle = k % 2 ? '#ffffff' : '#7dff9a';
          ctx.fillRect(Math.round(toss.to.x + Math.cos(a) * q * 16), Math.round(toss.to.y + Math.sin(a) * q * 12), 2, 2);
        }
        ctx.globalAlpha = 1;
        continue;
      }
      const x = lerp(toss.from.x, toss.to.x, p);
      const y = lerp(toss.from.y, toss.to.y, p) - Math.sin(p * Math.PI) * 26;
      ctx.drawImage(sprite, Math.round(x - sprite.width), Math.round(y - sprite.height), sprite.width * SCALE, sprite.height * SCALE);
    }
  }

  // ---- poses ----

  // What a member is doing now, as a pose: how their body is set (dx, dy,
  // lean, crouch: sprite pixels), what's in their hand and at what angle
  // (radians; 0 points straight up, more turns it forward, towards the
  // enemies), where their arm points and how far it reaches, a smear behind a
  // swing, a light at the tip, a tint, and anything else drawn with them.
  pose(battle, member, key) {
    const t = battle.time;
    const kind = this.weaponFor(battle, member);
    const hero = member === battle.hero;
    const act = this.acts.get(member);
    const age = act ? t - act.at : Infinity;
    let pose = null;
    if (act && this.alive(act, age, battle, member)) pose = this.actPose(battle, member, key, kind, act, age);
    else if (act) this.acts.delete(member);
    // Won: the last word.
    if (!pose && this.wonAt !== null) pose = this.victoryPose(member, key, kind, t - this.wonAt);
    if (!pose && member.id && battle.hiding === member.id) pose = this.hidePose(battle, member, t);
    if (!pose && this.guarding(battle, member)) pose = this.guardPose(member, key, kind, t, battle.wading === member.id);
    // Waiting on the strike bar: weapon up, ready.
    if (!pose && battle.phase === 'fight' && member === (battle.striker ?? battle.hero)) pose = this.readyPose(key, kind, 0, t);
    if (!pose && member.maxHp && member.hp / member.maxHp < TIRED_SHARE) pose = this.tiredPose(member, key, kind, t, hero);
    if (!pose) pose = this.idlePose(member, key, kind, t, hero);
    // A hit taken shows over whatever they were doing.
    if (act?.kind === 'flinch' && age < FLINCH_LIFE) {
      const p = age / FLINCH_LIFE;
      pose.dx = (pose.dx ?? 0) - Math.round(3 * (1 - easeOut(p)));
      pose.lean = (pose.lean ?? 0) - (p < 0.5 ? 1 : 0);
      if (pose.weapon) pose.weapon.angle -= 0.35 * (1 - p);
      pose.tint = age < 0.06 ? { color: '#ffffff', alpha: 0.85 } : { color: '#ff3048', alpha: 0.45 * (1 - p) };
    }
    return pose;
  }

  alive(act, age, battle, member) {
    switch (act.kind) {
      case 'swing':
      case 'whiff':
        return battle.phase === 'fight' || age < SWING + SWING_HOLD;
      case 'finish': return age < FINISH_LIFE;
      case 'cast': return age < this.castLife(act);
      case 'release': return age < RELEASE_LIFE;
      case 'item': return age < ITEM_LIFE;
      case 'spare': return age < SPARE_LIFE;
      case 'flinch': return age < FLINCH_LIFE;
      default: return false;
    }
  }

  castLife(act) {
    if (act.style === 'starfall') return 2.1;
    if (act.style === 'nova') return 2.2;
    if (act.style === 'chop') return 0.75 + act.extra;
    if (act.style === 'splinters') return 1.1;
    return CAST_LIFE;
  }

  guarding(battle, member) {
    if (member === battle.hero) return Boolean(battle.defending);
    return Boolean(battle.braced?.has(member.id) || (battle.wading === member.id));
  }

  hold(kind, angle, arm, reach = 1, extra = {}) {
    return { kind, angle, arm, reach, ...extra };
  }

  idlePose(member, key, kind, t, hero) {
    // Ves's umbrella and Bramble's hatchet rest over their shoulders, as
    // they're drawn; the hero holds his sword up in front of him, ready.
    if (!hero) return {};
    return { weapon: this.hold(kind, 0.55 + Math.sin(t * 2.5) * 0.05, 2.5, 0.9) };
  }

  tiredPose(member, key, kind, t, hero) {
    const heave = Math.sin(t * 2.2) > 0.2 ? 1 : 0;
    const pose = { crouch: 1 + heave, lean: 1 };
    if (hero) pose.weapon = this.hold(kind, 2.35, 2.6, 0.9);
    // A bead of sweat now and then.
    const drop = (t * 0.7) % 1;
    const rig = RIGS[key];
    pose.extra = (c, ox, oy) => {
      if (drop > 0.55) return;
      dot(c, ox + rig.shoulder.x + 4, oy + rig.split - 4 + Math.round(drop * 8), '#9ad8ff');
    };
    return pose;
  }

  guardPose(member, key, kind, t, wading) {
    const shimmer = (t % 1.4) < 0.18;
    const step = wading ? 2 : 0;
    if (key === 'vesper') return { crouch: 1, dx: step, weapon: this.hold('umbrellaOpen', 1.35, 1.35, 0.8, { glint: shimmer ? '#ffffff' : null }) };
    if (key === 'bramble') return { crouch: 1, dx: step, weapon: this.hold('axe', 0.85, 1.3, 0.8, { glint: shimmer ? '#ffffff' : null }) };
    return { crouch: 1, dx: step, weapon: this.hold(kind, 0.2, 1.6, 0.75, { glint: shimmer ? '#ffffff' : null }) };
  }

  hidePose(battle, member, t) {
    // Down in the bush, the top of his head showing; now and then he peeks
    // out over the leaves.
    const since = t - (battle.hidAt ?? 0);
    const peek = (t % 3.2) > 2.3 && (t % 3.2) < 3.0 ? 3 : 0;
    return { hide: { sink: 7 - peek, rustle: Math.sin(t * 9) > 0.85 ? 1 : 0 }, dx: 2, since };
  }

  // Before a swing: where the blade waits for slash `n`.
  readyPose(key, kind, n, t) {
    const s = this.swingArc(key, n);
    return { lean: 0, weapon: this.hold(kind, s.from + Math.sin(t * 8) * 0.04, s.armFrom, s.reachFrom, { behind: s.behind }) };
  }

  // Each character's swings: where the blade starts and ends, and the arm.
  swingArc(key, n) {
    if (key === 'bramble') {
      // Every one an overhead chop.
      return { from: -2.5, to: 2.1, armFrom: -0.6, armTo: 2.1, reachFrom: 1, reachTo: 1, behind: true };
    }
    if (key === 'vesper') {
      // A jab, then a sweep.
      return n % 2 === 0
        ? { from: 1.45, to: 1.6, armFrom: 1.5, armTo: 1.55, reachFrom: 0.2, reachTo: 1, jab: true }
        : { from: -0.8, to: 2.1, armFrom: -0.3, armTo: 2.1, reachFrom: 1, reachTo: 1 };
    }
    // The hero: down and across, then back up.
    return n % 2 === 0
      ? { from: -2.2, to: 2.1, armFrom: -0.4, armTo: 2.0, reachFrom: 1, reachTo: 1 }
      : { from: 2.3, to: -0.4, armFrom: 2.4, armTo: 0.3, reachFrom: 1, reachTo: 1 };
  }

  actPose(battle, member, key, kind, act, age) {
    switch (act.kind) {
      case 'swing':
      case 'whiff': return this.swingPose(battle, key, kind, act, age);
      case 'finish': return this.finishPose(key, kind, act, age);
      case 'cast': return this.castPose(battle, member, key, kind, act, age);
      case 'release': return this.releasePose(key, kind, act, age);
      case 'item': return this.itemPose(battle, member, key, kind, act, age);
      case 'spare': return this.sparePose(member, key, kind, age, battle.time);
      default: return null;
    }
  }

  swingPose(battle, key, kind, act, age) {
    const s = this.swingArc(key, act.n);
    const whiff = act.kind === 'whiff';
    const p = easeOut(age / (whiff ? SWING * 1.6 : SWING));
    const angle = lerp(s.from, whiff ? lerp(s.from, s.to, 0.6) : s.to, p);
    const pose = {
      dx: Math.round(2 * p),
      lean: p > 0.3 ? 1 : 0,
      crouch: key === 'bramble' && p > 0.8 ? 1 : 0,
      trail: age < SWING ? 0.8 : 0,
      weapon: this.hold(kind, angle, lerp(s.armFrom, s.armTo, p), lerp(s.reachFrom, s.reachTo, p), { behind: s.behind && p < 0.35 }),
    };
    if (whiff) {
      pose.lean = p > 0.6 ? 2 : 1;
      return pose;
    }
    if (age < SWING + 0.1) pose.smear = { from: s.from, to: angle, colors: SMEARS[kind], alpha: 1 - span(age, SWING, SWING + 0.1), jab: s.jab, big: act.perfect };
    // After the hold, back to where the next one starts.
    if (age > SWING + SWING_HOLD * 0.5 && battle.phase === 'fight') {
      const q = easeInOut((age - SWING - SWING_HOLD * 0.5) / SWING_BACK);
      const next = this.swingArc(key, act.n + 1);
      pose.weapon = this.hold(kind, lerp(s.to, next.from, q), lerp(s.armTo, next.armFrom, q), lerp(s.reachTo, next.reachFrom, q), { behind: next.behind && q > 0.5 });
      pose.dx = Math.round(2 * (1 - q));
    }
    if (key === 'bramble' && age > SWING * 0.8 && age < SWING + 0.15) pose.chips = { age: age - SWING * 0.8, seed: act.n * 97 + 13 };
    return pose;
  }

  // The strike bar's last blow, as the damage lands: a big swing all the way
  // through, a step in behind it.
  finishPose(key, kind, act, age) {
    const p = easeOut(age / FINISH);
    const back = easeInOut(span(age, FINISH_LIFE - 0.3, FINISH_LIFE));
    if (key === 'vesper') {
      // A long lunge, the umbrella straight out, wind going off its tip.
      return {
        dx: Math.round(4 * p * (1 - back)), lean: 1,
        trail: age < FINISH ? 1 : 0,
        weapon: this.hold('umbrella', 1.57, 1.55, lerp(0.2, 1, p)),
        gust: { age, color: SMEARS.umbrella[2] },
      };
    }
    if (key === 'bramble') {
      // A hop and a chop with everything behind it.
      const hop = age < FINISH ? -Math.round(Math.sin(p * Math.PI) * 4) : 0;
      return {
        dy: hop, crouch: age > FINISH && age < FINISH + 0.25 ? 2 : 0, lean: 1,
        trail: age < FINISH ? 1 : 0,
        weapon: this.hold('axe', lerp(-2.6, 2.3, p), lerp(-0.6, 2.2, p), 1, { behind: p < 0.3 }),
        smear: age < FINISH + 0.12 ? { from: -2.6, to: lerp(-2.6, 2.3, p), colors: SMEARS.axe, alpha: 1 - span(age, FINISH, FINISH + 0.12), big: true } : null,
        chips: age > FINISH * 0.8 ? { age: age - FINISH * 0.8, seed: 77, many: true } : null,
        dust: age > FINISH * 0.8 ? age - FINISH * 0.8 : null,
      };
    }
    const from = -2.6;
    const to = 2.5;
    const angle = lerp(from, to, p);
    return {
      dx: Math.round(3 * p * (1 - back)), lean: p > 0.3 && back < 0.5 ? 1 : 0,
      trail: age < FINISH ? 1 : 0,
      weapon: this.hold(kind, lerp(angle, 0.55, back), lerp(lerp(-0.5, 2.2, p), 2.5, back), lerp(1, 0.9, back)),
      smear: age < FINISH + 0.14 ? { from, to: angle, colors: SMEARS[kind], alpha: 1 - span(age, FINISH, FINISH + 0.14), big: true } : null,
      starTrail: kind === 'star' && age < FINISH + 0.3 ? age : null,
    };
  }

  // A spell going off (the words read, the damage landing): a quick thrust,
  // or a chop.
  releasePose(key, kind, act, age) {
    const p = easeOut(age / 0.1);
    const back = easeInOut(span(age, 0.22, RELEASE_LIFE));
    const color = typeof act.cast?.extra === 'string' ? act.cast.extra : '#ffffff';
    if (key === 'bramble') {
      return {
        crouch: age < 0.2 ? 1 : 0, lean: 1,
        weapon: this.hold('axe', lerp(lerp(-2.4, 2.1, p), 0.6, back), lerp(lerp(-0.5, 2.1, p), 1.4, back), 1, { behind: p < 0.3 }),
        smear: age < 0.18 ? { from: -2.4, to: lerp(-2.4, 2.1, p), colors: SMEARS.axe, alpha: 1 - span(age, 0.1, 0.18) } : null,
      };
    }
    const w = key === 'vesper' ? 'umbrella' : kind;
    return {
      dx: Math.round(3 * p * (1 - back)), lean: back < 0.5 ? 1 : 0,
      weapon: this.hold(w, lerp(1.5, key === 'vesper' ? 1.5 : 0.55, back), lerp(1.5, 2.5, back), lerp(lerp(0.3, 1, p), 0.9, back), { glow: age < 0.25 ? { color, size: 2 } : null }),
    };
  }

  castPose(battle, member, key, kind, act, age) {
    const style = act.style;
    const color = typeof act.extra === 'string' ? act.extra : '#ffffff';
    const life = this.castLife(act);
    const into = easeOut(age / 0.14);
    const out = easeInOut(span(age, life - 0.25, life));
    // Blends a held pose's angles back to how they stand at rest.
    const restAngle = key === 'hero' ? 0.55 : 0;
    const settle = (w) => (out > 0 ? { ...w, angle: lerp(w.angle, restAngle, out), arm: lerp(w.arm, key === 'hero' ? 2.5 : w.arm, out) } : w);
    const pulse = 1 + Math.round(Math.sin(age * 18) * 0.5 + 0.5);
    const motes = { color, seed: act.seed, age };
    if (key === 'hero') {
      switch (style) {
        case 'raise':
          return { dy: -Math.round(Math.sin(span(age, 0, 0.25) * Math.PI)), weapon: settle(this.hold(kind, lerp(0.55, -0.05, into), lerp(2.5, -0.1, into), 1, { glow: out < 0.5 ? { color, size: pulse + 1 } : null })), motes };
        case 'point':
          return { dx: Math.round(2 * into * (1 - out)), lean: 1, weapon: settle(this.hold(kind, lerp(0.55, 1.5, into), lerp(2.5, 1.45, into), lerp(0.6, 1, into), { glow: out < 0.5 ? { color, size: pulse, burst: age } : null })) };
        case 'hurl': {
          const swing = easeOut(span(age, 0.32, 0.44));
          const up = easeOut(age / 0.2);
          const angle = lerp(lerp(0.55, -0.4, up), 1.7, swing);
          return {
            dx: Math.round(2 * swing * (1 - out)), lean: swing > 0.3 ? 1 : 0,
            weapon: settle(this.hold(kind, angle, lerp(lerp(2.5, -0.3, up), 1.7, swing), 1, { glow: swing < 0.5 ? { color, size: pulse + 1 } : null })),
            smear: age > 0.32 && age < 0.56 ? { from: -0.4, to: angle, colors: ['#ffffff', color, color], alpha: 1 - span(age, 0.44, 0.56) } : null,
          };
        }
        case 'slash': {
          const p = easeOut(span(age, 0.08, 0.2));
          const angle = lerp(-2.4, 2.3, p);
          return {
            dx: Math.round(2 * p * (1 - out)), lean: p > 0.3 && out < 0.5 ? 1 : 0, trail: age > 0.08 && age < 0.2 ? 1 : 0,
            weapon: settle(this.hold(kind, age < 0.08 ? lerp(0.55, -2.4, easeOut(age / 0.08)) : angle, lerp(-0.4, 2.1, p), 1)),
            smear: age > 0.08 && age < 0.34 ? { from: -2.4, to: angle, colors: ['#ffffff', color, color], alpha: 1 - span(age, 0.2, 0.34), big: true } : null,
          };
        }
        case 'sweep': {
          const p = easeOut(span(age, 0.1, 0.3));
          const angle = lerp(-1.9, 2.4, p);
          return {
            crouch: 2 - Math.round(out * 2), lean: 1,
            weapon: settle(this.hold(kind, age < 0.1 ? lerp(0.55, -1.9, easeOut(age / 0.1)) : angle, lerp(-1.4, 2.0, p), 1)),
            smear: age > 0.1 && age < 0.45 ? { from: -1.9, to: angle, colors: ['#ffffff', color, '#2a6fb0'], alpha: 1 - span(age, 0.3, 0.45) } : null,
            drops: age > 0.2 ? { age: age - 0.2, color, seed: act.seed } : null,
          };
        }
        case 'calm':
          return { crouch: age > 0.15 && age < 0.6 ? 1 : 0, weapon: settle(this.hold(kind, lerp(0.55, 2.75, into), lerp(2.5, 2.9, into), 0.8)), motes: { ...motes, soft: true } };
        case 'ward':
          return { crouch: 1 - Math.round(out), weapon: settle(this.hold(kind, lerp(0.55, 0.15, into), lerp(2.5, 1.5, into), 0.8, { glow: out < 0.5 ? { color, size: pulse } : null })), ring: { color, age } };
        case 'step': {
          const hop = span(age, 0, 0.3);
          return { dx: -Math.round(Math.sin(hop * Math.PI * 0.5) * 5 * (1 - out)), dy: -Math.round(Math.sin(hop * Math.PI) * 3), crouch: age > 0.3 && age < 0.45 ? 1 : 0, weapon: settle(this.hold(kind, 0.8, 1.8, 0.8)), streaks: { color, age } };
        }
        case 'starfall': {
          // Up to the sky while the stars gather and fall, then brought down
          // at the enemy as the great star lands.
          const down = easeOut(span(age, 0.95, 1.1));
          const up = easeOut(age / 0.3);
          const angle = lerp(lerp(0.55, -0.05, up), 1.9, down);
          return {
            dy: -Math.round(Math.sin(span(age, 0, 0.3) * Math.PI) * 2),
            crouch: age > 1.1 && age < 1.4 ? 1 : 0, lean: down > 0.3 ? 1 : 0,
            weapon: settle(this.hold(kind, angle, lerp(lerp(2.5, -0.1, up), 1.9, down), 1, { glow: down < 0.6 && out < 0.5 ? { color: '#ffe14d', size: 2 + pulse, star: true } : null })),
            smear: age > 0.95 && age < 1.3 ? { from: -0.05, to: angle, colors: SMEARS.star, alpha: 1 - span(age, 1.1, 1.3), big: true } : null,
            starTrail: age > 0.95 && age < 1.5 ? age - 0.95 : null,
          };
        }
        case 'nova': {
          // Down on one knee, the blade up, the light gathering to it; the
          // white; then up, the blade at the enemy.
          const rise = easeOut(span(age, 0.9, 1.15));
          return {
            crouch: Math.round(3 * (1 - rise)), lean: rise > 0.5 ? 1 : 0,
            weapon: settle(this.hold(kind, lerp(-0.05, 1.5, rise), lerp(-0.1, 1.5, rise), 1, { glow: age < 0.5 ? { color: '#ffffff', size: 1 + Math.round(age * 9), star: true } : null })),
            gather: age < 0.45 ? { age, seed: act.seed } : null,
          };
        }
        default:
          return null;
      }
    }
    if (key === 'vesper') {
      switch (style) {
        case 'shield':
          return { crouch: 1, weapon: this.hold(age < 0.1 ? 'umbrella' : 'umbrellaOpen', 1.35, 1.35, lerp(0.4, 0.85, into), { glint: age > 0.1 && age < 0.25 ? '#ffffff' : null }), gust: age > 0.1 ? { age: age - 0.1, color, against: true } : null };
        case 'openUp': {
          const open = age > 0.18;
          return { dy: age > 0.18 && age < 0.3 ? -1 : 0, weapon: this.hold(open ? 'umbrellaOpen' : 'umbrella', lerp(0.6, 0.1, into), lerp(1.2, 0.05, into), 1), motes: open ? motes : null, pop: open && age < 0.4 ? { age: age - 0.18, color } : null };
        }
        case 'shakeOut':
          return { weapon: this.hold('umbrellaOpen', 0.3 + Math.sin(age * 40) * 0.25 * (1 - out), 0.4, 0.9), drops: age > 0.1 ? { age: age - 0.1, color, seed: act.seed, fling: true } : null, motes };
        case 'twirl': {
          // A spin on the spot, the umbrella open over her.
          const spinning = age > 0.12 && age < 0.62;
          return { flip: spinning && Math.floor((age - 0.12) / 0.0625) % 2 === 1, dy: spinning ? -1 : 0, weapon: this.hold('umbrellaOpen', Math.sin(age * 26) * 0.18, 0.05, 1), whirl: { age, color, seed: act.seed } };
        }
        case 'point':
          return { lean: 1, weapon: this.hold('umbrella', lerp(1.2, 0.75, into), lerp(1.2, 0.8, into), 1, { glow: out < 0.5 ? { color, size: pulse, crackle: age } : null }) };
        case 'pointFoe':
          return { lean: 1, dx: Math.round(into), weapon: this.hold('umbrella', 1.45, 1.45, lerp(0.4, 1, into), { glow: out < 0.5 ? { color, size: pulse, crackle: age } : null }) };
        case 'slice': {
          const p = easeOut(span(age, 0.08, 0.2));
          const angle = lerp(-1.0, 2.2, p);
          return { lean: 1, dx: Math.round(2 * p), trail: age > 0.08 && age < 0.2 ? 1 : 0, weapon: this.hold('umbrella', angle, lerp(-0.6, 2.0, p), 1), smear: age > 0.08 && age < 0.36 ? { from: -1.0, to: angle, colors: ['#ffffff', color, '#9a7ad8'], alpha: 1 - span(age, 0.2, 0.36), big: true } : null };
        }
        case 'snap': {
          const open = age > 0.3;
          return { dy: open && age < 0.4 ? -1 : 0, weapon: this.hold(open ? 'umbrellaOpen' : 'umbrella', open ? 0.9 : 0.4, open ? 1.0 : 0.3, 1, { glint: open && age < 0.4 ? '#ffffff' : null }), pop: open && age < 0.6 ? { age: age - 0.3, color, big: true } : null };
        }
        case 'tap': {
          const down = easeOut(span(age, 0.2, 0.3));
          return { crouch: down > 0.5 && age < 0.5 ? 1 : 0, weapon: this.hold('umbrella', lerp(0.6, 2.75, down), lerp(0.7, 2.8, down), 1), tap: age > 0.3 ? { age: age - 0.3, color } : null };
        }
        case 'breeze':
          return { weapon: this.hold('umbrellaOpen', -0.5 + Math.sin(age * 5) * 0.12, 0.3, 0.8), motes: { ...motes, soft: true }, gust: { age, color } };
        case 'headwind':
          return { lean: 1, crouch: 1, weapon: this.hold('umbrellaOpen', 1.0, 1.0, 0.9), gust: { age, color, against: true } };
        default:
          return null;
      }
    }
    if (key === 'bramble') {
      switch (style) {
        case 'chop': {
          // A wind-up (longer for the big ones, shaking for THE BIG ONE), then down.
          const wind = act.extra;
          const shake = wind > 0.5 && age < wind ? (Math.floor(age * 30) % 2) : 0;
          const up = easeOut(age / Math.min(0.2, wind));
          const p = easeOut(span(age, wind, wind + 0.1));
          const angle = age < wind ? lerp(0, -2.6, up) : lerp(-2.6, 2.2, p);
          const big = wind >= 0.4;
          return {
            dx: shake, lean: age < wind ? -1 : 1, crouch: age > wind + 0.08 && age < wind + 0.35 ? (big ? 2 : 1) : 0,
            dy: big && age > wind - 0.1 && age < wind + 0.1 ? -Math.round(Math.sin(span(age, wind - 0.1, wind + 0.1) * Math.PI) * 3) : 0,
            trail: age > wind && age < wind + 0.1 ? 1 : 0,
            weapon: this.hold('axe', lerp(angle, 1.0, out), lerp(age < wind ? lerp(1.0, -0.6, up) : lerp(-0.6, 2.1, p), 1.3, out), 1, { behind: age < wind + 0.03 }),
            smear: age > wind && age < wind + 0.25 ? { from: -2.6, to: angle, colors: SMEARS.axe, alpha: 1 - span(age, wind + 0.1, wind + 0.25), big } : null,
            chips: age > wind + 0.08 ? { age: age - wind - 0.08, seed: act.seed, many: big } : null,
            dust: big && age > wind + 0.08 ? age - wind - 0.08 : null,
          };
        }
        case 'splinters': {
          // Three quick chops.
          const n = Math.min(2, Math.floor(age / 0.24));
          const local = age - n * 0.24;
          const p = easeOut(span(local, 0.06, 0.14));
          const angle = local < 0.06 ? lerp(1.6, -2.4, local / 0.06) : lerp(-2.4, 2.1, p);
          return {
            lean: 1, crouch: p > 0.8 ? 1 : 0, dx: n,
            weapon: this.hold('axe', lerp(angle, 1.0, out), lerp(lerp(-0.6, 2.1, p), 1.3, out), 1, { behind: p < 0.3 }),
            smear: local > 0.06 && local < 0.2 ? { from: -2.4, to: angle, colors: SMEARS.axe, alpha: 1 - span(local, 0.14, 0.2) } : null,
            chips: local > 0.12 ? { age: local - 0.12, seed: act.seed + n, many: true } : null,
          };
        }
        case 'holler':
          // Back, then out with everything he's got, shaking with it.
          return { lean: age < 0.15 ? -1 : 2 - Math.round(out * 2), crouch: age > 0.15 && age < 0.8 ? 1 : 0, dx: age > 0.15 && age < 0.8 ? Math.floor(age * 30) % 2 : 0, shout: age > 0.15 ? { age: age - 0.15, color } : null };
        case 'breathe':
          return { dy: -Math.round(Math.sin(span(age, 0.05, 0.5) * Math.PI) * 1.4), crouch: age > 0.55 && age < 0.9 ? 1 : 0, motes: { ...motes, soft: true } };
        case 'cheer': {
          const k = Math.floor(age / 0.3);
          const hop = k < 3 ? -Math.round(Math.sin(((age % 0.3) / 0.3) * Math.PI) * 3) : 0;
          return { dy: hop, weapon: this.hold('axe', -0.15 + (k % 2) * 0.3, 0.1, 1), motes };
        }
        case 'rally':
          return { dy: age < 0.3 ? -Math.round(Math.sin((age / 0.3) * Math.PI) * 2) : 0, weapon: this.hold('axe', Math.sin(age * 14) * 0.45 * (1 - out), Math.sin(age * 14) * 0.3, 1), motes };
        case 'throw': {
          // His free arm: back, then flung forward (the axe stays on his shoulder).
          const p = easeOut(span(age, 0.16, 0.26));
          return { lean: p > 0.3 ? 1 : -1, arm: { angle: age < 0.16 ? lerp(2.8, -1.2, easeOut(age / 0.16)) : lerp(-1.2, 1.5, p), reach: 1 }, flick: age > 0.2 && age < 0.4 ? { age: age - 0.2, color } : null };
        }
        case 'cannonball': {
          const air = span(age, 0.15, 0.55);
          const inAir = age > 0.15 && age < 0.55;
          return { crouch: age < 0.15 ? 2 : inAir ? 3 : age < 0.75 ? 2 : 0, dy: inAir ? -Math.round(Math.sin(air * Math.PI) * 12) : 0, dx: Math.round(lerp(0, 6, air) * (1 - out)), splash: age > 0.55 ? { age: age - 0.55, color } : null };
        }
        case 'standFirm':
          return { dx: Math.round(2 * into), crouch: 1, weapon: this.hold('axe', 0.85, 1.3, 0.8, { glint: age > 0.1 && age < 0.25 ? '#ffffff' : null }), ring: { color, age } };
        case 'shakeOff':
          return { dx: age < 0.6 ? (Math.floor(age * 28) % 2 ? 1 : -1) : 0, drops: { age, color, seed: act.seed, fling: true } };
        case 'dive':
          return { dy: -Math.round(Math.sin(span(age, 0, 0.25) * Math.PI) * 3), dx: Math.round(2 * span(age, 0, 0.25)), crouch: age > 0.2 ? 3 : 0 };
        default:
          return null;
      }
    }
    return null;
  }

  // Pulled from a pocket, held up, and eaten (or lit, or used, or tossed to a friend).
  itemPose(battle, member, key, kind, act, age) {
    const hero = key === 'hero';
    // The hero's sword is set down a moment; Ves's and Bramble's weapons stay on their shoulders.
    const reach = age < 0.2 ? lerp(0.6, 0.9, age / 0.2) : 1;
    let arm = age < 0.2 ? lerp(2.4, 3.3, easeOut(age / 0.2)) : age < 0.45 ? lerp(3.3, 0.15, easeOut((age - 0.2) / 0.25)) : 0.15;
    let showItem = age > 0.12;
    let eatAt = null;
    if (act.target) {
      // Tossed: the arm swings forward and the item flies to them.
      if (age > 0.55) {
        arm = lerp(0.15, 1.4, easeOut((age - 0.55) / 0.1));
        showItem = false;
        if (!act.tossed) {
          act.tossed = true;
          const from = battle.memberFeet(member);
          const to = battle.memberAt(act.target);
          this.tosses.push({ look: act.look, at: battle.time, from: { x: from.x + 6, y: from.y - 40 }, to: { x: to.x, y: to.y - 4 } });
        }
      }
    } else if (act.eat && age > 0.6) {
      // Up to the mouth, and crumbs.
      arm = lerp(0.15, 1.2, easeOut((age - 0.6) / 0.12));
      eatAt = age - 0.6;
      if (age > 0.85) showItem = false;
    }
    const pose = { arm: { angle: arm, reach: eatAt !== null ? 0.5 : reach }, held: showItem ? { look: act.look, age, glow: age > 0.4 && age < 0.65 } : null, crumbs: eatAt !== null ? { age: eatAt, seed: act.seed } : null };
    if (hero) pose.bare = true;
    if (age > 0.4 && age < 0.55) pose.dy = -1;
    return pose;
  }

  sparePose(member, key, kind, age, t) {
    const nod = age > 0.15 && age < 0.55 ? 1 : 0;
    if (key === 'hero') return { crouch: nod, weapon: this.hold(kind, lerp(0.55, 2.85, easeOut(age / 0.25)), lerp(2.5, 3.0, easeOut(age / 0.25)), 0.85) };
    if (key === 'bramble') return { arm: { angle: 0.25 + Math.sin(age * 16) * 0.45, reach: 1 } };
    return { crouch: nod };
  }

  victoryPose(member, key, kind, age) {
    const hop = age > 0.12 && age < 0.42 ? -Math.round(Math.sin(span(age, 0.12, 0.42) * Math.PI) * 3) : 0;
    const crouch = age < 0.12 ? 1 : 0;
    const glint = (age % 1.6) > 1.3 ? '#ffffff' : null;
    if (key === 'hero') return { dy: hop, crouch, weapon: this.hold(kind, lerp(0.55, -0.05, easeOut(span(age, 0.1, 0.3))), lerp(2.5, -0.05, easeOut(span(age, 0.1, 0.3))), 1, { glint, glow: kind === 'star' ? { color: '#ffe14d', size: 1 + Math.round(Math.sin(age * 6) + 1) / 2, star: true } : null }) };
    if (key === 'vesper') return { dy: hop, crouch, flip: age > 0.15 && age < 0.45 && Math.floor((age - 0.15) / 0.075) % 2 === 1, weapon: this.hold('umbrellaOpen', -0.35 + Math.sin(age * 3) * 0.1, 0.0, 0.9) };
    // Bramble: two hops, the hatchet up.
    const k = age < 0.75 ? Math.floor(age / 0.32) : 2;
    const hop2 = k < 2 ? -Math.round(Math.sin(((age % 0.32) / 0.32) * Math.PI) * 4) : 0;
    return { dy: hop2, crouch: k >= 2 ? 0 : crouch, weapon: this.hold('axe', -0.25 + Math.sin(age * 4) * 0.08, 0.05, 1, { glint }) };
  }

  // ---- putting it together ----

  compose(battle, member, key, pose) {
    const c = this.c;
    const rig = RIGS[key];
    const { bare, base } = this.spritesFor(key);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, CW, CH);
    const sprite = pose.weapon || pose.bare || (pose.arm && key === 'hero') ? bare : base;
    const crouch = pose.crouch ?? 0;
    const lean = pose.lean ?? 0;
    const ox = AX - sprite.width / 2 + (pose.dx ?? 0);
    const oy = AY - sprite.height + (pose.dy ?? 0);
    const t = battle.time;

    if (pose.hide) {
      this.drawHidden(c, sprite === base ? base : this.spritesFor(key).base, ox, oy, pose);
      return;
    }

    // Where the arm and the hand are.
    const shoulder = { x: ox + rig.shoulder.x + Math.round(lean / 2), y: oy + rig.shoulder.y + crouch };
    const armSpec = pose.weapon ?? pose.arm ?? null;
    let hand = null;
    if (armSpec) {
      const a = armSpec.arm ?? armSpec.angle;
      const r = rig.armLength * (armSpec.reach ?? 1);
      hand = { x: Math.round(shoulder.x + Math.sin(a) * r), y: Math.round(shoulder.y - Math.cos(a) * r) };
    }

    // A weapon behind them (wound up behind the head) goes first.
    if (pose.weapon?.behind) this.drawWeapon(c, pose.weapon, hand);
    if (pose.smear?.behind) this.drawSmear(c, hand, pose.weapon, pose.smear);
    this.drawBody(c, sprite, rig, ox, oy, lean, crouch);
    if (pose.extra) pose.extra(c, ox, oy);
    if (armSpec) this.drawArm(c, rig, shoulder, hand);
    if (pose.weapon && !pose.weapon.behind) this.drawWeapon(c, pose.weapon, hand);
    if (pose.smear && !pose.smear.behind && hand) this.drawSmear(c, hand, pose.weapon, pose.smear);
    if (hand) this.drawHand(c, rig, hand);
    if (pose.held && hand) this.drawHeld(c, pose.held, hand);
    if (pose.weapon?.glow && hand) this.drawGlow(c, pose.weapon, hand, t);
    this.drawBits(c, pose, rig, ox, oy, hand, t);

    // A tint over all of it (a flinch's flash).
    if (pose.tint && pose.tint.alpha > 0) {
      c.globalCompositeOperation = 'source-atop';
      c.globalAlpha = pose.tint.alpha;
      c.fillStyle = pose.tint.color;
      c.fillRect(0, 0, CW, CH);
      c.globalAlpha = 1;
      c.globalCompositeOperation = 'source-over';
    }
  }

  // The body, its head and chest leaned forward (or back) and lowered into a
  // crouch, the legs where they stand.
  drawBody(c, sprite, rig, ox, oy, lean, crouch) {
    const w = sprite.width;
    const h = sprite.height;
    const legs = rig.legs;
    const split = rig.split;
    c.drawImage(sprite, 0, legs, w, h - legs, ox, oy + legs, w, h - legs);
    c.drawImage(sprite, 0, split, w, legs - split, ox + Math.round(lean / 2), oy + split + crouch, w, legs - split);
    c.drawImage(sprite, 0, 0, w, split, ox + lean, oy + crouch, w, split);
  }

  drawArm(c, rig, shoulder, hand) {
    const pts = [];
    line(shoulder.x, shoulder.y, hand.x, hand.y, (x, y) => pts.push([x, y]));
    c.fillStyle = '#120c1c';
    for (const [x, y] of pts) c.fillRect(x - 1, y - 1, 3, 3);
    c.fillStyle = rig.sleeve;
    for (const [x, y] of pts) c.fillRect(x, y, 1, 1);
  }

  drawHand(c, rig, hand) {
    c.fillStyle = '#120c1c';
    c.fillRect(hand.x - 1, hand.y - 1, 3, 3);
    c.fillStyle = rig.hand;
    c.fillRect(hand.x, hand.y, 1, 1);
  }

  drawWeapon(c, weapon, hand) {
    if (!hand) return;
    const art = KIT_WEAPONS[weapon.kind];
    const sprite = this.weaponSprite(weapon.kind);
    c.save();
    c.translate(hand.x + 0.5, hand.y + 0.5);
    c.rotate(weapon.angle);
    c.imageSmoothingEnabled = false;
    c.drawImage(sprite, -art.grip.x, -art.grip.y);
    // A glint running up the blade.
    if (weapon.glint) {
      c.fillStyle = weapon.glint;
      c.fillRect(-1, -art.grip.y + 2, 2, 2);
      c.fillRect(-2, -art.grip.y + 3, 4, 1);
    }
    c.restore();
  }

  // How far the tip of the weapon is from the hand.
  reach(kind) {
    return KIT_WEAPONS[kind].grip.y;
  }

  tipOf(weapon, hand) {
    const r = this.reach(weapon.kind);
    return { x: hand.x + Math.sin(weapon.angle) * r, y: hand.y - Math.cos(weapon.angle) * r };
  }

  // The arc a swing leaves: brightest where the blade is now, thinning back
  // to where it started.
  drawSmear(c, hand, weapon, smear) {
    if (!hand || !weapon) return;
    // A thin band out at the blade's last third (not a fan over their face),
    // a little see-through.
    const r1 = this.reach(weapon.kind) + (smear.big ? 1 : 0);
    const r0 = Math.max(4, r1 - (smear.big ? 4 : 3));
    c.globalAlpha = clamp01(smear.alpha) * 0.85;
    if (smear.jab) {
      // A jab: streaks off the tip, straight ahead.
      const tip = this.tipOf(weapon, hand);
      for (let k = -1; k <= 1; k++) {
        line(tip.x - 8, tip.y + k * 2, tip.x - 1, tip.y + k * 2, (x, y) => dot(c, x, y, k === 0 ? smear.colors[0] : smear.colors[2]));
      }
      c.globalAlpha = 1;
      return;
    }
    const from = smear.from;
    const to = smear.to;
    const dir = Math.sign(to - from) || 1;
    const length = Math.abs(to - from);
    for (let a = from; dir > 0 ? a <= to : a >= to; a += dir * 0.035) {
      // Only the part out in front and overhead: behind them it would be
      // drawn over their own back.
      if (a < SMEAR_FROM) continue;
      const u = length ? Math.abs(a - from) / length : 1;
      const inner = lerp(r1 - 1, r0, u);
      for (let r = Math.round(inner); r <= r1; r++) {
        const edge = r >= r1 - 1;
        const color = u > 0.8 || (edge && u > 0.4) ? smear.colors[0] : u > 0.4 || edge ? smear.colors[1] : smear.colors[2];
        dot(c, hand.x + Math.sin(a) * r, hand.y - Math.cos(a) * r, color);
      }
    }
    c.globalAlpha = 1;
  }

  // Light at the weapon's tip (a spell gathering), pulsing; a star for the
  // Fallen Star's spells; crackles for Ves's storm.
  drawGlow(c, weapon, hand, t) {
    const g = weapon.glow;
    const tip = this.tipOf(weapon, hand);
    const x = Math.round(tip.x);
    const y = Math.round(tip.y);
    const size = Math.max(1, Math.round(g.size));
    if (g.star) {
      sparkle(c, x, y, g.color, size + 1);
      for (let k = 1; k <= size; k++) {
        dot(c, x - k, y - k, g.color);
        dot(c, x + k, y - k, g.color);
        dot(c, x - k, y + k, g.color);
        dot(c, x + k, y + k, g.color);
      }
    } else {
      sparkle(c, x, y, g.color, size);
    }
    if (g.burst !== undefined && g.burst > 0.15 && g.burst < 0.45) {
      const r = (g.burst - 0.15) * 30;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        dot(c, x + Math.cos(a) * r, y + Math.sin(a) * r, g.color);
      }
    }
    if (g.crackle !== undefined) {
      const flick = Math.floor(g.crackle * 20);
      for (let b = 0; b < 3; b++) {
        let px = x;
        let py = y;
        for (let s = 0; s < 3; s++) {
          const nx = px + Math.round((rand(flick, b * 7 + s) - 0.5) * 6);
          const ny = py - 1 - Math.round(rand(flick, b * 7 + s, 1) * 3);
          line(px, py, nx, ny, (lx, ly) => dot(c, lx, ly, s ? g.color : '#ffffff'));
          px = nx;
          py = ny;
        }
      }
    }
  }

  // Something from a pocket, in the hand.
  drawHeld(c, held, hand) {
    const sprite = this.itemSprite(held.look === 'candle' ? 'candle' : held.look);
    const x = hand.x - Math.floor(sprite.width / 2);
    const y = hand.y - sprite.height + 1;
    c.drawImage(sprite, x, y);
    if (held.glow) {
      const r = 2 + Math.round((held.age - 0.4) * 30);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + 0.3;
        dot(c, hand.x + Math.cos(a) * r, y + 2 + Math.sin(a) * r * 0.8, k % 2 ? '#ffffff' : '#fff2a0');
      }
    }
  }

  // Bramble in his bush: only the top of his head over the leaves.
  drawHidden(c, sprite, ox, oy, pose) {
    const { sink, rustle } = pose.hide;
    // Him, sunk down, cut off at the ground.
    c.save();
    c.beginPath();
    c.rect(0, 0, CW, AY);
    c.clip();
    c.drawImage(sprite, ox, oy + sink);
    c.restore();
    const bush = this.bushSprite();
    c.drawImage(bush, AX - bush.width / 2 + 2 + rustle, AY - bush.height + 1);
  }

  // Everything else that goes with a pose: motes, gusts, chips, dust, drops...
  drawBits(c, pose, rig, ox, oy, hand, t) {
    const midX = ox + rig.shoulder.x;
    const footY = AY;
    if (pose.motes) {
      const { color, seed, age, soft } = pose.motes;
      for (let i = 0; i < 10; i++) {
        const life = (age * (soft ? 0.8 : 1.4) + rand(seed, i)) % 1;
        if (age < rand(seed, i) * 0.3) continue;
        c.globalAlpha = 1 - life;
        const x = midX - 8 + rand(seed, i, 1) * 16 + Math.sin(life * 6 + i) * 1.5;
        const y = footY - 2 - life * (soft ? 14 : 24) - rand(seed, i, 2) * 4;
        dot(c, x, y, i % 3 ? color : '#ffffff');
      }
      c.globalAlpha = 1;
    }
    if (pose.ring) {
      const r = Math.min(1, pose.ring.age / 0.25) * 12;
      c.globalAlpha = 0.8 * (1 - span(pose.ring.age, 0.5, 1));
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2 + pose.ring.age * 3;
        if (k % 2) dot(c, midX + Math.cos(a) * r, oy + rig.split + 4 + Math.sin(a) * r * 1.1, pose.ring.color);
      }
      c.globalAlpha = 1;
    }
    if (pose.gust && hand) {
      // Wind: streaks going past them (or breaking on the canopy).
      const { age, color, against } = pose.gust;
      c.globalAlpha = 1 - span(age, 0.6, 0.9);
      for (let i = 0; i < 4; i++) {
        const along = ((age * 3 + i * 0.27) % 1);
        const y = hand.y - 6 + i * 4;
        const x = against ? hand.x + 18 - along * 10 : hand.x + 2 + along * 18;
        line(x, y, x + 4, y, (px, py) => dot(c, px, py, i % 2 ? color : '#ffffff'));
      }
      c.globalAlpha = 1;
    }
    if (pose.pop && hand) {
      // A burst off the canopy as it snaps open.
      const { age, color, big } = pose.pop;
      const tip = { x: hand.x, y: hand.y - 12 };
      const r = 3 + age * (big ? 60 : 35);
      c.globalAlpha = 1 - clamp01(age / 0.3);
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        dot(c, tip.x + Math.cos(a) * r, tip.y + Math.sin(a) * r * 0.7, k % 2 ? color : '#ffffff');
      }
      c.globalAlpha = 1;
    }
    if (pose.whirl) {
      // Wind circling her as she spins.
      const { age, color } = pose.whirl;
      c.globalAlpha = 1 - span(age, 0.75, 1.05);
      for (let k = 0; k < 12; k++) {
        const a = age * 12 + (k / 12) * Math.PI * 2;
        const r = 10 + (k % 3);
        dot(c, midX + Math.cos(a) * r, oy + rig.split + 3 + Math.sin(a) * 3 - (k % 4), k % 3 ? color : '#ffffff');
      }
      c.globalAlpha = 1;
    }
    if (pose.tap) {
      // Sparks off the floor where the tip struck.
      const { age, color } = pose.tap;
      const tip = this.tipOf(pose.weapon, hand);
      c.globalAlpha = 1 - clamp01(age / 0.4);
      for (let k = 0; k < 6; k++) {
        const a = -Math.PI * (0.1 + 0.8 * (k / 5));
        dot(c, tip.x + Math.cos(a) * age * 30, tip.y + Math.sin(a) * age * 22, k % 2 ? color : '#ffffff');
      }
      c.globalAlpha = 1;
    }
    if (pose.chips) {
      // Wood chips flying off the chop.
      const { age, seed, many } = pose.chips;
      if (age < 0.4 && hand && pose.weapon) {
        const tip = this.tipOf(pose.weapon, hand);
        for (let i = 0; i < (many ? 8 : 5); i++) {
          const a = -0.3 - rand(seed, i) * 2.2;
          const v = 18 + rand(seed, i, 1) * 26;
          const x = tip.x + Math.cos(a) * v * age;
          const y = tip.y + Math.sin(a) * v * age + 60 * age * age;
          c.globalAlpha = 1 - age / 0.4;
          dot(c, x, y, i % 3 ? '#c08a4e' : '#e0b888');
        }
        c.globalAlpha = 1;
      }
    }
    if (pose.dust !== null && pose.dust !== undefined && pose.dust < 0.45) {
      const age = pose.dust;
      c.globalAlpha = 1 - age / 0.45;
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1;
        dot(c, midX + side * (4 + age * 30 + i), footY - 1 - Math.round(age * 6 * (i % 3)), '#d8c8b0');
      }
      c.globalAlpha = 1;
    }
    if (pose.drops) {
      // Water (or rain) flung off.
      const { age, color, seed, fling } = pose.drops;
      if (age < 0.6) {
        for (let i = 0; i < 8; i++) {
          const a = fling ? rand(seed, i) * Math.PI * 2 : -0.4 - rand(seed, i) * 0.8;
          const v = 16 + rand(seed, i, 1) * 18;
          c.globalAlpha = 1 - age / 0.6;
          dot(c, midX + Math.cos(a) * v * age, oy + rig.split + Math.sin(a) * v * age + 40 * age * age, i % 2 ? color : '#ffffff');
        }
        c.globalAlpha = 1;
      }
    }
    if (pose.splash) {
      const { age, color } = pose.splash;
      if (age < 0.4) {
        c.globalAlpha = 1 - age / 0.4;
        for (let i = 0; i < 8; i++) {
          const a = -Math.PI * (0.1 + 0.8 * (i / 7));
          dot(c, midX + (pose.dx ?? 0) + Math.cos(a) * age * 50, footY - 2 + Math.sin(a) * age * 40 + 60 * age * age, i % 2 ? color : '#ffffff');
        }
        c.globalAlpha = 1;
      }
    }
    if (pose.shout) {
      // Arcs off his mouth.
      const { age, color } = pose.shout;
      for (let k = 0; k < 2; k++) {
        const a = age - k * 0.15;
        if (a < 0 || a > 0.5) continue;
        c.globalAlpha = 1 - a / 0.5;
        const r = 3 + a * 22;
        const mx = ox + 13 + (pose.lean ?? 0);
        const my = oy + rig.split - 3 + (pose.crouch ?? 0);
        for (let s = -2; s <= 2; s++) dot(c, mx + Math.cos(s * 0.35) * r, my + Math.sin(s * 0.35) * r, s === 0 ? '#ffffff' : color);
      }
      c.globalAlpha = 1;
    }
    if (pose.flick && hand) {
      // What he threw, leaving his hand.
      const { age, color } = pose.flick;
      dot(c, hand.x + age * 60, hand.y - age * 20, color);
      dot(c, hand.x + age * 60 - 1, hand.y - age * 20, '#ffffff');
    }
    if (pose.crumbs && hand) {
      const { age, seed } = pose.crumbs;
      if (age < 0.4) {
        for (let i = 0; i < 4; i++) {
          c.globalAlpha = 1 - age / 0.4;
          dot(c, hand.x + (rand(seed, i) - 0.5) * 6, hand.y + 2 + age * 20 * (0.5 + rand(seed, i, 1)), '#f4d79a');
        }
        c.globalAlpha = 1;
      }
    }
    if (pose.streaks) {
      const { age, color } = pose.streaks;
      c.globalAlpha = 1 - span(age, 0.3, 0.6);
      for (let i = 0; i < 3; i++) {
        const y = oy + 6 + i * 4;
        line(midX + 6 + age * 10, y, midX + 11 + age * 10, y, (px, py) => dot(c, px, py, color));
      }
      c.globalAlpha = 1;
    }
    if (pose.starTrail !== null && pose.starTrail !== undefined && hand && pose.weapon) {
      // Little stars shed off the Fallen Star's swing.
      const age = pose.starTrail;
      const tip = this.tipOf(pose.weapon, hand);
      for (let i = 0; i < 5; i++) {
        const a = age - i * 0.04;
        if (a < 0 || a > 0.35) continue;
        c.globalAlpha = 1 - a / 0.35;
        sparkle(c, tip.x - i * 3 + rand(7, i) * 4, tip.y + a * 16 + rand(7, i, 1) * 4, i % 2 ? '#9ad8ff' : '#ffe14d', 1);
      }
      c.globalAlpha = 1;
    }
    if (pose.gather && hand && pose.weapon) {
      // Nova: light drawn in from all round to the raised blade.
      const { age, seed } = pose.gather;
      const tip = this.tipOf(pose.weapon, hand);
      for (let i = 0; i < 14; i++) {
        const a = rand(seed, i) * Math.PI * 2;
        const d = (1 - clamp01(age / 0.45 + rand(seed, i, 1) * 0.3)) * 26 + 2;
        dot(c, tip.x + Math.cos(a) * d, tip.y + Math.sin(a) * d, i % 2 ? '#fff6dc' : '#ffffff');
      }
    }
    if (pose.weapon?.kind === 'star' && !pose.weapon.glow) {
      // The Fallen Star always gives off a faint sparkle.
      const blink = Math.floor(t * 3) % 4;
      if (blink === 0 && hand) {
        const tip = this.tipOf(pose.weapon, hand);
        const mid = { x: (tip.x + hand.x) / 2, y: (tip.y + hand.y) / 2 };
        dot(c, mid.x + 1, mid.y, '#ffffff');
      }
    }
  }
}
