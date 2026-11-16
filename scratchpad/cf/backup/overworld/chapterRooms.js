import { WORLD_STATE } from '../state/saveGame.js';

// A room that looks different in a later chapter. Sunnyside's first four
// rooms are walked in Chapter 4 and again in Chapter 5, so each carries a
// `chapter5` field: what is different once WORLD_STATE.chapter is 5 or more.
// Chapter 4 never sees it, so those visits are exactly as they were.
//
//   chapter5: {
//     // Any plain field of the room, swapped whole: tiles, doors, cutscenes,
//     // npcs (each one's beaten-key is made apart from chapter 4's, so a
//     // monster beaten then isn't missing now), tileTexts, birds, music...
//     tiles: [...], doors: [...], cutscenes: [...], npcs: [...],
//     // Props added to the room's own.
//     addProps: [{ sprite: 'sy_rope_post', x: 25, y: 10 }],
//     // Props taken away: 'sprite@x,y'.
//     dropProps: ['field_hole@26,11'],
//     // Words swapped: the section a prop (or a tile letter) reads is
//     // replaced by another, { soft_hole: 'soft_hole_5' }.
//     textSwap: { soft_hole: 'soft_hole_5' },
//   }
//
// The room's `id` stays the same, so doors, saves and the map keep working.
export const FIRST_VARIANT_CHAPTER = 5;

export function roomForChapter(data) {
  const variant = data?.chapter5;
  if (!variant || (WORLD_STATE.chapter ?? 1) < FIRST_VARIANT_CHAPTER) return data;
  return applyVariant(data, variant);
}

// The variant itself, whatever the chapter (the room check builds it too).
export function applyVariant(data, variant) {
  const { addProps = [], dropProps = [], textSwap = {}, npcs, ...fields } = variant;
  const merged = { ...data, ...fields };
  const swap = (name) => (name && textSwap[name]) || name;
  const dropped = new Set(dropProps);
  merged.props = [...data.props.filter((p) => !dropped.has(`${p.sprite}@${p.x},${p.y}`)), ...addProps]
    .map((p) => (p.text && textSwap[p.text] ? { ...p, text: swap(p.text) } : p));
  merged.tileTexts = Object.fromEntries(Object.entries(fields.tileTexts ?? data.tileTexts ?? {}).map(([k, v]) => [k, swap(v)]));
  if (npcs) merged.npcs = npcs.map((n, i) => ({ ...n, key: n.key ?? `${data.id}:ch5:${i}` }));
  delete merged.chapter5;
  return merged;
}
