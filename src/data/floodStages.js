// SALTCOMBE FLOODS (chapter 5, draft 2026-11-15): the water is a little higher each time you come back after a big story
// beat, so the town's trouble can be seen and not only told. Three stages, all made of props that come and go with the
// story (`after` / `until`, the way the town's other changes do): no tile is touched, nothing has a body, so every shop,
// door and route works at every stage.
//
//   stage 1: after the Wreck Yard (wreck_slip_home)     the jetty's far end under, a puddle or two on the boards
//   stage 2: after Merrow's sea gate (merrow_sea_gate)  half the jetty under, water up the stilts, the lookout's landing wet
//   stage 3: after the Soundings (soundings_weight_gate) the whole jetty under, the boards awash, the water a hand under the red line
//
// Each stage's tide post, stilt bands and folk replace the last stage's; the sheets and puddles pile up. After the chapter
// (the_light_answers) the storm is over, the water has gone down, and none of it shows.
export const FLOOD = {
  one: 'wreck_slip_home',
  two: 'merrow_sea_gate',
  three: 'soundings_weight_gate',
  end: 'the_light_answers',
};

const AFTER = [null, FLOOD.one, FLOOD.two, FLOOD.three];

// Shows from this stage's scene on, to the end of the chapter.
const from = (stage) => ({ after: AFTER[stage], until: FLOOD.end });
// Shows at this stage only (the next stage's scene, or the end, takes it away).
const only = (stage) => ({ after: AFTER[stage], until: [AFTER[stage + 1] ?? FLOOD.end, FLOOD.end].filter(Boolean) });

const sheet = (sprite, x, y, stage) => ({ sprite, x, y, flat: true, walkable: true, ...from(stage) });

// The quay (saltcombe_quay).
export function quayFloodProps() {
  const props = [];
  for (const stage of [1, 2, 3]) {
    props.push({ sprite: `st_tide_post_${stage}`, x: 3, y: 14, text: `quay_tide_post_${stage}`, walkable: true, ...only(stage) });
    props.push({ sprite: `st_flood_band_l_${stage}`, x: 11, y: 20, walkable: true, ...only(stage) });
    props.push({ sprite: `st_flood_band_s_${stage}`, x: 32, y: 19, walkable: true, ...only(stage) });
  }
  // The jetty (x 5-6, rows 14-21) goes under from its far end.
  for (const [stage, rows] of [[1, [21, 20, 19]], [2, [18, 17, 16]], [3, [15, 14]]]) {
    for (const y of rows) props.push(sheet('st_flood_sheet', 5, y, stage));
  }
  // Puddles on the boards, coming in from the south edge.
  const puddles = [
    [1, [[15, 12], [27, 12]]],
    [2, [[7, 12], [20, 12], [32, 12]]],
    [3, [[11, 12], [24, 12], [36, 12], [16, 11], [29, 11], [8, 11]]],
  ];
  for (const [stage, spots] of puddles) for (const [x, y] of spots) props.push(sheet('st_flood_puddle', x, y, stage));
  // Folk with something to carry up the hill. (Walk-through, like the puddles: they never block a route.)
  props.push({ sprite: 'st_folk_c', x: 22, y: 12, npc: 'st_flood_sandbagger', walkable: true, ...from(1) });
  props.push({ sprite: 'st_folk_b', x: 34, y: 10, npc: 'st_flood_hauler', walkable: true, ...from(2) });
  return props;
}

// The lookout (saltcombe_lookout): the landing at the water's edge.
export function lookoutFloodProps() {
  const props = [];
  for (const [x, y] of [[22, 21], [28, 21]]) props.push(sheet('st_flood_puddle', x, y, 2));
  for (const [x, y] of [[25, 20], [33, 21], [21, 20]]) props.push(sheet('st_flood_puddle', x, y, 3));
  return props;
}
