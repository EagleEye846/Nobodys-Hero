// The folk of King Peptup's hall, shared by the scenes that play in it after
// the welcome (rumbolds_duel and the two after-duel scenes): who stands where,
// and the helpers that make the whole hall cheer in a wave or go quiet at
// once. (The welcome, theKingsWelcome.js, has its own copy of the same list.)

// [actor id, the room's cast name or npc id, picture, how fast they cheer]
export const AUDIENCE = [
  ['a2', 'a2', 'bf_mole_crowd_b', 0.3],
  ['a1', 'a1', 'bf_mole_crowd', 0.34],
  ['a4', 'a4', 'bf_mole_crowd_c', 0.28],
  ['a7', 'a7', 'bf_mole_crowd_d', 0.36],
  ['a5', 'a5', 'bf_mole_miner_a', 0.4],
  ['a8', 'a8', 'bf_glowworm', 0.4],
  ['a9', 'a9', 'bf_mole_crowd', 0.32],
  ['kid', 'bt_throne_kid', 'bf_frog_kid_a', 0.4],
  ['snail', 'bt_throne_snail', 'bf_snail_elder', 0.5],
  ['b1', 'b1', 'bf_mole_crowd_d', 0.3],
  ['b3', 'b3', 'bf_mole_crowd_b', 0.35],
  ['b5', 'b5', 'bf_mole_crowd', 0.27],
  ['b6', 'b6', 'bf_mole_crowd_c', 0.33],
  ['b7', 'b7', 'bf_toad_innkeeper', 0.5],
  ['b8', 'b8', 'bf_mole_crowd_b', 0.31],
  ['b9', 'b9', 'bf_beetle_postman', 0.5],
  ['kid2', 'bt_throne_kid2', 'bf_frog_kid_b', 0.4],
  ['miner', 'bt_throne_miner', 'bf_mole_miner_b', 0.4],
];
export const POSITIONS = {
  a1: [6, 10], a2: [8, 10], kid: [10, 10], a4: [5, 12], a5: [7, 12], snail: [9, 12], a7: [6, 14], a8: [8, 14], a9: [10, 14],
  b1: [15, 10], kid2: [17, 10], b3: [19, 10], miner: [16, 12], b5: [18, 12], b6: [20, 12], b7: [15, 14], b8: [17, 14], b9: [19, 14],
};
// The snail is two tiles wide and is cast from the middle of her footprint.
export const WIDE = new Set(['snail']);

// Actors for all of them, standing where the room has them.
export const audienceActors = () => AUDIENCE.map(([id, who, sprite]) => ({
  id, look: `prop:${sprite}`, x: POSITIONS[id][0], y: POSITIONS[id][1], plays: who, centered: WIDE.has(id),
}));

// The whole hall cheers, one after another from the left, and keeps cheering.
export const wave = (gap = 0.1) => AUDIENCE.flatMap(([id, , sprite, speed]) => [
  { do: 'animate', who: id, animation: sprite, speed },
  { do: 'wait', seconds: gap },
]);
// Everyone goes quiet at once.
export const hush = () => AUDIENCE.map(([id]) => ({ do: 'animate', who: id }));

// Spotlights, all on the king.
export const ON_THE_KING = [
  { onto: 'king', color: '255, 240, 180', radius: 46 },
  { onto: 'king', color: '255, 190, 210', radius: 34, from: { x: 5, y: -2 } },
  { onto: 'king', color: '170, 215, 255', radius: 34, from: { x: 20, y: -2 } },
];
