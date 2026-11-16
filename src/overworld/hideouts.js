import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';

// HIDING PLACES: where a lurking monster waits in a room, and how it gives
// itself away. A room's enemy names one with `look` (see Npc in npc.js):
//
//   { enemy: 'limpet_knight', x: 33, y: 12, patrol: [33, 33], behaviour: 'disguise', look: 'weedy_rock' }
//
// With `disguise`, it stands in the room looking like the `prop` (a sprite from
// src/data/art/props.js, so it matches the real ones round it), or like itself
// gone stock still (`self`), or in its own disguise art from its enemy file
// (`ownArt`: the look only adds the burst and the sound). With `burrow` it lies under the sand, water or
// litter, and only the tells show (or a heap, if the look has a `prop`). With
// `drop` it waits up overhead, out of sight, and the tells show on the floor
// under it.
//
// Tells, so a sharp eye can read it after the first time (each look lists its own):
//   peek     a little picture (eyes opening, a drill tip, a fin) shows for a
//            moment every few seconds, at `dx`, `dy` pixels up from its feet
//   twitch   the disguise shivers a pixel for a moment
//   bubbles  bubbles rise and pop over the spot now and then
//   stir     a few grains hop up off the ground
//   dust     specks fall from overhead onto the spot, over a faint shadow
// And when it goes: `bits` (colours) burst out and `sound` plays (a name in
// src/audio/music.js), before the usual "!" sting.

const EYES = (lid, eye) => ({
  rows: ['k.k', 'e.e'],
  palette: { k: lid, e: eye },
});

export const HIDEOUTS = {
  // --- Chapter 3 ---
  // The Dead City: lamp mites nesting in a dead street lamp. It wears the mites'
  // own lamp art (`ownArt`: an eye opens, a wing twitches); out they come in a puff of dust.
  dead_lamp: { ownArt: true, bits: ['#c8bca8', '#e8dcc0', '#d8c890', '#8a7e70'], sound: 'flutter' },
  // The Old Drains: a clinker under a heap of fallen rubble, mug and all. Its
  // two rust-red feelers come out and wave.
  rubble_feelers: {
    prop: 'rubble_heap', tells: ['peek'], dx: 2, dy: 9,
    peek: { rows: ['a...a', '.a.a.', '.a.a.'], palette: { a: '#d86a44' } },
    bits: ['#6a6058', '#8a8078', '#b8442a', '#e8e4dc'], sound: 'crumble',
  },
  // The Lantern Marsh: a wisp passing for a lantern on a pole, at the end of a
  // spur. Its own art (a blink, the flame flaring); it goes up in a shower of green sparks.
  marsh_lantern: { ownArt: true, bits: ['#bfe8a0', '#6aae7a', '#f4f0b0', '#cfeec0'], sound: 'flutter' },

  // --- Chapter 4 ---
  // The Diggings: a magpie mole in among the ore sacks; a beady eye opens.
  ore_sacks: { prop: 'ore_sacks', tells: ['peek', 'twitch'], peek: EYES('#120c1c', '#f4f4f4'), dx: 1, dy: 7, bits: ['#a8905a', '#6a5a34', '#d8d0c0'], sound: 'rustle' },
  // The Diggings: a drillbug under the floor; its drill tip pokes up and the grit hops.
  mine_floor: {
    tells: ['peek', 'stir'], dx: 0, dy: 1,
    peek: { rows: ['.w.', '.w.', 'kgk'], palette: { w: '#e8e8f0', g: '#9a9aa8', k: '#2a2430' } },
    grit: '#8a7a64', bits: ['#8a7a64', '#5c5040', '#b0a088'], sound: 'crumble',
  },
  // The Diggings: a slagling gone cold and still, passing for a lump of slag.
  // Now and then a crack in it glows.
  slag_lump: {
    self: true, filter: 'grayscale(1) brightness(0.6)', tells: ['peek'], dx: 0, dy: 6,
    peek: { rows: ['.o.', 'oyo', '.o.'], palette: { o: '#ff7a18', y: '#ffc23a' } },
    bits: ['#524446', '#7a6a68', '#ff7a18', '#ffc23a'], sound: 'crumble',
  },
  // The Stillwater: an olm lying under the shallows by the stepping stones. Slow, pale bubbles.
  still_water: { tells: ['bubbles'], bubble: '#cfe4ee', bits: ['#2e4a5a', '#8ab4c4', '#cfe4ee'], sound: 'paddle' },

  // --- Chapter 5 ---
  // The cliff cave: a barnacle bat hanging in the roof over the thread of dusty light. Dust sifts down.
  cave_roof: { tells: ['dust'], speck: '#d8ccb0', shadow: 'rgba(20, 14, 10, 0.26)', bits: ['#c8bca0', '#8a7e68', '#e4dccb'], sound: 'flutter', land: 'land' },
  // The Pools: a limpet knight passing for a weedy rock; its visor slit glints.
  weedy_rock: { prop: 'c5_rock_weedy', tells: ['peek'], peek: EYES('#1a1e18', '#fff2b0'), dx: 0, dy: 8, bits: ['#5d6650', '#7a8a5a', '#3a4236'], sound: 'crumble' },
  // The Mill: a wrackeel lying in the pond. Bubbles, and now and then a fin.
  eel_pond: {
    tells: ['bubbles', 'peek'], bubble: '#bfe0d8', dx: 0, dy: 1,
    peek: { rows: ['.t.', 'tTt'], palette: { t: '#2f8a7a', T: '#56b8a0' } },
    bits: ['#3f7f80', '#9fd0c8', '#e0f4ee'], sound: 'paddle',
  },
  // The West Light: an old diver standing empty and still on the rocks, like a
  // suit left out to dry. Now and then a light comes on behind the helmet glass.
  empty_suit: {
    self: true, filter: 'saturate(0.6) brightness(0.8)', tells: ['peek'], dx: 0, dy: 19,
    peek: { rows: ['yy', 'yy'], palette: { y: '#ffe27a' } },
    bits: ['#b88a3a', '#e8c868', '#6f7f6a'], sound: 'thunk',
  },
  // The Soundings: a Blind Grotto Crab sitting as a big white shell on the cave floor. It wears its own
  // disguise art (`ownArt`, from its enemy file: a feeler twitches under the lip now and then); out it
  // comes in a puff of white grit.
  white_shell: { ownArt: true, bits: ['#f2f6f6', '#d3e0e4', '#a3bac6', '#fbe7f0'], sound: 'crumble' },
};

// The pictures, made the first time they're needed.
const pictures = new Map();
function picture(key, make) {
  if (!pictures.has(key)) pictures.set(key, make());
  return pictures.get(key);
}

// What the disguise looks like standing still: a prop's sprite, or the monster's own (`self`).
export function hideoutSprite(look, own) {
  if (look.self) {
    if (!look.filter) return own;
    // Gone cold and dull (`filter`, a canvas filter): the slagling with its fire out.
    return picture(look, () => {
      const out = document.createElement('canvas');
      out.width = own.width;
      out.height = own.height;
      const g = out.getContext('2d');
      g.filter = look.filter;
      g.drawImage(own, 0, 0);
      return out;
    });
  }
  if (!look.prop) return null;
  if (!PROP_SPRITES[look.prop]) throw new Error(`Unknown prop '${look.prop}' for a hiding place`);
  return picture(`prop:${look.prop}`, () => makeSprite(PROP_SPRITES[look.prop], PROP_PALETTE));
}

function peekSprite(look) {
  return picture(look.peek, () => makeSprite(look.peek.rows, look.peek.palette));
}

// The tells repeat this often (seconds), and the quick ones (peek, twitch, stir) last this long.
export const TELL_EVERY = 2.6;
export const TELL_FOR = 0.4;

// Draws a lurker in its hiding place at (x, y), the point under its feet on
// screen. `t` is its own clock; `sprite` its disguise picture (or null).
export function drawHideout(ctx, look, sprite, x, y, t) {
  const cycle = t % TELL_EVERY;
  const telling = cycle < TELL_FOR;
  const tells = look.tells ?? [];
  // A faint shadow on the floor, under something up above.
  if (tells.includes('dust')) {
    const breathe = 0.75 + 0.25 * Math.sin(t * 2.4);
    ctx.save();
    ctx.globalAlpha = breathe;
    ctx.fillStyle = look.shadow ?? 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y - 2, 6, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (sprite) {
    const shiver = tells.includes('twitch') && telling ? (Math.floor(cycle * 30) % 2 ? 1 : -1) : 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x - 7, y - 3, 14, 3);
    ctx.drawImage(sprite, x - Math.floor(sprite.width / 2) + shiver, y - sprite.height);
  }
  if (tells.includes('peek') && telling) {
    const peek = peekSprite(look);
    ctx.drawImage(peek, x + (look.dx ?? 0) - Math.floor(peek.width / 2), y - (look.dy ?? 0) - peek.height);
  }
  if (tells.includes('stir') && cycle < TELL_FOR * 1.5) {
    const k = cycle / (TELL_FOR * 1.5);
    ctx.fillStyle = look.grit ?? '#8a7a64';
    for (const [dx, up] of [[-4, 4], [3, 6], [5, 3], [-2, 5]]) {
      ctx.fillRect(Math.round(x + dx * (0.6 + k)), Math.round(y - 2 - Math.sin(k * Math.PI) * up), 1, 1);
    }
  }
  if (tells.includes('bubbles')) {
    // Three bubbles a cycle, each rising a few pixels and popping.
    ctx.fillStyle = look.bubble ?? '#cfe4ee';
    for (let i = 0; i < 3; i++) {
      const b = (cycle - i * 0.35) / 1.1;
      if (b < 0 || b > 1) continue;
      const bx = Math.round(x + [-3, 2, -1][i] + Math.sin(b * 6 + i) * 1);
      const by = Math.round(y - 3 - b * 7);
      if (b > 0.85) {
        ctx.fillRect(bx - 1, by, 1, 1);
        ctx.fillRect(bx + 1, by, 1, 1);
      } else {
        ctx.fillRect(bx, by - 1, 1, 1);
        ctx.fillRect(bx - 1, by, 1, 1);
        ctx.fillRect(bx + 1, by, 1, 1);
        ctx.fillRect(bx, by + 1, 1, 1);
      }
    }
  }
  if (tells.includes('dust')) {
    // A thin trickle from overhead, landing on the shadow.
    ctx.fillStyle = look.speck ?? '#c8bca0';
    for (let i = 0; i < 4; i++) {
      const d = ((t * 0.9 + i * 0.25) % 1);
      // Only in bursts: most of the cycle there's nothing falling.
      if (cycle > 1.2) continue;
      const sx = Math.round(x + [-1, 1, 0, 2][i]);
      const sy = Math.round(y - 48 + d * 46);
      ctx.fillRect(sx, sy, 1, 1);
    }
  }
}

// The burst as it comes out: bits flung up and out, falling back.
export function burst(look, x, y, count = 14) {
  const colours = look?.bits ?? ['#8a7a64'];
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const speed = 30 + Math.random() * 40;
    return { x, y, z: 2, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed * 0.5, vz: 50 + Math.random() * 50, life: 0.5 + Math.random() * 0.3, colour: colours[i % colours.length] };
  });
}

export function updateBits(bits, dt) {
  for (const b of bits) {
    b.life -= dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vz -= 260 * dt;
    b.z = Math.max(0, b.z + b.vz * dt);
    if (b.z === 0) { b.vx *= 0.8; b.vy *= 0.8; }
  }
  return bits.filter((b) => b.life > 0);
}

export function drawBits(ctx, bits, camera) {
  for (const b of bits) {
    ctx.fillStyle = b.colour;
    ctx.fillRect(Math.round(b.x - camera.x), Math.round(b.y - b.z - camera.y), b.life > 0.25 ? 2 : 1, b.life > 0.25 ? 2 : 1);
  }
}
