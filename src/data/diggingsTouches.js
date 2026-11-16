// The Diggings' extra touches (the life pass, 14 November 2026). Added to the table in
// src/data/touches.js by src/overworld/diggingsLife.js; the kinds are described there.
export const DIGGINGS_EXTRA_TOUCHES = {
  diggings_pithead: [
    { kind: 'cricket', x: 6, y: 6 },
    { kind: 'sleepbat', x: 8, y: 1 },
    { kind: 'cobweb', x: 4, y: 1, flip: true },
    { kind: 'teeth', x: 17, y: 1, w: 3 },
  ],
  diggings_cart_yard: [
    { kind: 'beetle', x: 16, y: 13, w: 6 },
    { kind: 'cricket', x: 25, y: 11 },
    { kind: 'cobweb', x: 11, y: 1, flip: true },
    { kind: 'grit', x: 20, y: 1.9, fall: 1.5, every: 10 },
  ],
  diggings_trestle: [
    { kind: 'grit', x: 14, y: 1.9, fall: 1.5, every: 6 },
    { kind: 'teeth', x: 22, y: 1, w: 4 },
    { kind: 'motes', x: 14, y: 3, w: 10, h: 6, n: 8, color: '190,205,230' },
  ],
  diggings_switchback: [
    { kind: 'cricket', x: 12, y: 5 },
    { kind: 'beetle', x: 8, y: 15, w: 3 },
    { kind: 'sleepbat', x: 19, y: 1, dir: -1 },
    { kind: 'cobweb', x: 1, y: 1 },
  ],
  diggings_old_seam: [
    { kind: 'glowworms', x: 2, y: 3, w: 5, n: 7 },
    { kind: 'sleepbat', x: 3, y: 2 },
    { kind: 'cobweb', x: 1, y: 2 },
    { kind: 'teeth', x: 6, y: 2, w: 3 },
  ],
  diggings_flooded_drift: [
    { kind: 'glowworms', x: 10, y: 2, w: 8, n: 10 },
    { kind: 'cricket', x: 34, y: 7 },
    { kind: 'beetle', x: 2, y: 5, w: 2 },
    { kind: 'sleepbat', x: 4, y: 2 },
  ],
  diggings_cave_in: [
    { kind: 'teeth', x: 3, y: 1, w: 3 },
    { kind: 'motes', x: 4, y: 11, w: 4, h: 3, n: 8 },
  ],
  diggings_lift: [
    { kind: 'cricket', x: 22, y: 8 },
    { kind: 'cobweb', x: 1, y: 2 },
    { kind: 'grit', x: 5, y: 2.9, fall: 1.5, every: 7 },
    { kind: 'teeth', x: 15, y: 2, w: 3 },
  ],
  diggings_lost_seam: [
    { kind: 'glowworms', x: 8, y: 3, w: 6, n: 9 },
    { kind: 'cricket', x: 22, y: 4 },
    { kind: 'sleepbat', x: 7, y: 2 },
    { kind: 'cobweb', x: 4, y: 2 },
  ],
  diggings_air_shaft: [
    { kind: 'grit', x: 9, y: 6, fall: 4, every: 5.5, n: 8, reach: 60 },
    { kind: 'wetwall', x: 7, y: 9, w: 1, h: 2 },
    { kind: 'glowworms', x: 7, y: 8, w: 3, n: 6 },
    { kind: 'sleepbat', x: 6, y: 6 },
  ],
  diggings_star_camp: [
    { kind: 'cricket', x: 7, y: 4 },
    { kind: 'cobweb', x: 3, y: 2 },
    { kind: 'glowworms', x: 7, y: 3, w: 4, n: 6 },
    { kind: 'starmotes', x: 12, y: 5, w: 4, h: 3, n: 5, color: '255,226,170' },
  ],
  diggings_star_siding: [
    { kind: 'cricket', x: 4, y: 12 },
    { kind: 'cobweb', x: 1, y: 2 },
    { kind: 'starmotes', x: 26, y: 7, w: 4, h: 5, n: 6, color: '255,226,170' },
    { kind: 'grit', x: 19, y: 1.9, fall: 1.5, every: 8 },
  ],
  diggings_star_scorch: [
    { kind: 'starmotes', x: 12, y: 4, w: 9, h: 4, n: 9, color: '190,225,255' },
    { kind: 'seam', x: 2, y: 2.5, w: 36, h: 1, n: 10, color: '190,220,255' },
  ],
  diggings_star_spill: [
    { kind: 'starmotes', x: 13, y: 4, w: 2, h: 8, n: 7, color: '200,230,255' },
    { kind: 'cricket', x: 5, y: 12 },
    { kind: 'cobweb', x: 1, y: 2 },
    { kind: 'glowworms', x: 3, y: 3, w: 6, n: 8 },
  ],
  diggings_star_gallery: [
    { kind: 'starmotes', x: 4, y: 3, w: 9, h: 3, n: 8, color: '255,226,170' },
    { kind: 'seam', x: 24, y: 3, w: 6, h: 3, n: 6, color: '255,226,160' },
    { kind: 'cricket', x: 12, y: 10 },
    { kind: 'cobweb', x: 1, y: 2 },
  ],
  diggings_star_glass: [
    { kind: 'starmotes', x: 11, y: 3, w: 12, h: 9, n: 14, color: '190,225,255' },
    { kind: 'seam', x: 3, y: 2.5, w: 28, h: 1, n: 8, color: '190,225,255' },
    { kind: 'cricket', x: 4, y: 11 },
  ],
  diggings_star_pool: [
    { kind: 'starmotes', x: 11, y: 4, w: 14, h: 8, n: 14, color: '190,225,255' },
    { kind: 'glowworms', x: 14, y: 3, w: 8, n: 8 },
    { kind: 'cobweb', x: 1, y: 2 },
  ],
};
