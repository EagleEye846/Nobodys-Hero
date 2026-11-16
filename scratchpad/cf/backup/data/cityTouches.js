// The life pass's touches (round 2) for Lasthome, the Dead City, the Registry and the Old Baths: see
// src/overworld/cityLife.js for the kinds it adds, and src/overworld/touches.js for the rest. Drawn only:
// none of them has a body, so none can block a walk, a lever, a plank or a cutscene.
//
// Lasthome is alive (sparrows, hens, kids, cats, bees, lanterns). The Dead City is left alone (pigeons, crows,
// leaves, ivy curtains over the shopfronts, water that still moves). The Registry is dust and paper. The
// Last Street is silent on purpose: the Hush is near, so nothing moves there.
const IVY = { style: 'ivy' };

export const CITY_TOUCHES = {
  // ---- Lasthome ----
  lasthome_gate: [
    { kind: 'c3birds', look: 'sparrow', x: 15, y: 6, w: 4, h: 2, n: 3 },
    { kind: 'c3birds', look: 'hen', x: 20, y: 9, w: 3, h: 2, n: 2 },
    { kind: 'cat', x: 21.3, y: 5.4, color: '#d8884a', dark: '#9a5a2a', light: '#f0c49a' },
    { kind: 'grass', x: 1, y: 4, w: 3, h: 3 },
    { kind: 'grass', x: 20, y: 5, w: 3, h: 5 },
    { kind: 'moths', x: 8.5, y: 3.3, n: 4 },
    { kind: 'moths', x: 15.5, y: 3.3, n: 4 },
  ],
  lasthome_square: [
    { kind: 'c3birds', look: 'sparrow', x: 14, y: 4, w: 3, h: 1, n: 3 },
    { kind: 'c3birds', look: 'hen', x: 1, y: 17, w: 4, h: 3, n: 3 },
    { kind: 'c3kids', play: 'chase', x: 22, y: 18, w: 5, h: 3, n: 2, seed: 1 },
    { kind: 'c3kids', play: 'hop', x: 28, y: 17, w: 1, h: 3, n: 2, seed: 3 },
    { kind: 'cat', x: 24.35, y: 5.7, color: '#7a7a86', dark: '#4a4a56', light: '#d8d8de' },
    { kind: 'bees', x: 18, y: 3.8, n: 3 },
    { kind: 'moths', x: 6.5, y: 7, n: 4 },
    { kind: 'moths', x: 22.5, y: 6, n: 4 },
    { kind: 'moths', x: 11.5, y: 15, n: 4 },
    { kind: 'lanterns', x: 14.5, y: 6.4, x2: 23.5, y2: 6.4, n: 6 },
  ],
  lasthome_healer: [
    { kind: 'steam', x: 7.5, y: 2.6 },
    { kind: 'spores', x: 3, y: 3, w: 8, h: 6, color: '255, 236, 200', n: 8 },
  ],
  lasthome_inn: [
    { kind: 'steam', x: 13.5, y: 2.6 },
    { kind: 'sparks', x: 6.5, y: 2.5, n: 6 },
    { kind: 'c3mouse', x: 13, y: 11, toX: 11, toY: 11 },
  ],
  lasthome_chapel: [
    { kind: 'shaft', x: 4.5, y: 1.2, w: 3, h: 9, color: '255, 226, 160' },
    { kind: 'shaft', x: 8.5, y: 1.2, w: 2, h: 9, color: '255, 226, 160' },
    { kind: 'spores', x: 3, y: 3, w: 8, h: 8, color: '255, 236, 200', n: 10 },
  ],

  // ---- The Dead City ----
  city_old_street: [
    { kind: 'crow', x: 3, y: 3, face: 1 },
    { kind: 'crow', x: 27, y: 4, face: -1, dy: 6 },
    { kind: 'c3birds', look: 'pigeon', x: 6, y: 4, w: 4, h: 1, n: 3 },
    { kind: 'c3vines', x: 1, y: 4, w: 10, len: 12 },
    { kind: 'c3vines', x: 12, y: 4, w: 5, len: 10 },
    { kind: 'blown', x: 1, y: 4, w: 27, h: 5, n: 5, colors: ['#76784c', '#56583a', '#969a62'], wind: 40 },
  ],
  city_forum: [
    { kind: 'c3birds', look: 'pigeon', x: 2, y: 2, w: 8, h: 2, n: 4 },
    { kind: 'crow', x: 6, y: 14, face: 1 },
    { kind: 'drift', x: 8, y: 5, w: 16, h: 9, n: 9, color: '#76784c', lit: '#969a62' },
    { kind: 'ripples', points: [[12, 7], [18, 10], [10, 12], [20, 6]] },
    { kind: 'dragonfly', x: 10, y: 6, w: 10, h: 5 },
    { kind: 'c3vines', x: 1, y: 2, w: 14, len: 12 },
    { kind: 'c3vines', x: 15, y: 2, w: 9, len: 10 },
    { kind: 'blown', x: 1, y: 2, w: 30, h: 14, n: 5, colors: ['#76784c', '#56583a', '#969a62'], wind: 40 },
  ],
  city_colonnade: [
    { kind: 'c3birds', look: 'pigeon', x: 1, y: 11, w: 10, h: 3, n: 3 },
    { kind: 'shaft', x: 16.5, y: 2, w: 2, h: 12, color: '255, 236, 190' },
    { kind: 'shaft', x: 21.5, y: 2, w: 2, h: 12, color: '255, 236, 190' },
    { kind: 'c3vines', x: 13, y: 2, w: 2, len: 12 },
    { kind: 'c3vines', x: 16, y: 2, w: 12, len: 11 },
    { kind: 'blown', x: 1, y: 2, w: 28, h: 12, n: 4, colors: ['#76784c', '#56583a'], wind: 36 },
  ],
  city_library: [
    { kind: 'c3papers', x: 1, y: 2, w: 18, h: 12, n: 7 },
    { kind: 'c3mouse', x: 2, y: 12, toX: 4, toY: 12 },
    { kind: 'shaft', x: 22, y: 2, w: 3, h: 12, color: '255, 236, 190' },
    { kind: 'c3vines', x: 1, y: 2, w: 26, len: 9 },
    { kind: 'spores', x: 1, y: 2, w: 26, h: 14, color: '230, 220, 200', n: 8 },
  ],
  city_reading_room: [
    { kind: 'c3papers', x: 2, y: 2, w: 9, h: 6, n: 4 },
    { kind: 'shaft', x: 4, y: 1, w: 3, h: 7, color: '255, 236, 190' },
    { kind: 'c3mouse', x: 2, y: 7, toX: 4, toY: 7 },
  ],
  city_baths: [
    { kind: 'steam', x: 4.2, y: 9.6, lean: 1 },
    { kind: 'steam', x: 5.6, y: 10, lean: 1 },
    { kind: 'steam', x: 16, y: 9.6, lean: -1 },
    { kind: 'steam', x: 17.4, y: 10, lean: -1 },
    { kind: 'caustics', x: 3, y: 9, w: 4, h: 3, color: '140,235,255' },
    { kind: 'caustics', x: 15, y: 9, w: 4, h: 3, color: '140,235,255' },
    { kind: 'ripples', points: [[4, 10], [6, 11], [16, 10], [17, 11]] },
  ],
  baths_stokehold: [
    { kind: 'sparks', x: 3, y: 4.5, n: 5 },
    { kind: 'steam', x: 14, y: 4, lean: 1 },
    { kind: 'c3mouse', x: 2, y: 9.5, toX: 4, toY: 10 },
  ],
  city_crier_square: [
    { kind: 'crow', x: 3, y: 7, face: 1 },
    { kind: 'crow', x: 22, y: 7, face: -1 },
    { kind: 'c3birds', look: 'pigeon', x: 15, y: 2, w: 6, h: 1.5, n: 4 },
    { kind: 'c3papers', x: 2, y: 2, w: 22, h: 12, n: 6 },
    { kind: 'c3vines', x: 1, y: 2, w: 24, len: 11 },
    { kind: 'blown', x: 1, y: 2, w: 24, h: 13, n: 5, colors: ['#76784c', '#56583a', '#969a62'], wind: 40 },
  ],
  city_aqueduct: [
    { kind: 'drift', x: 2, y: 6, w: 2, h: 3, n: 3, color: '#76784c', lit: '#969a62' },
    { kind: 'drift', x: 26, y: 6, w: 2, h: 3, n: 3, color: '#76784c', lit: '#969a62' },
    { kind: 'ripples', points: [[2.5, 7], [3, 8], [26.5, 7], [27, 6.5]] },
    { kind: 'dragonfly', x: 1, y: 5, w: 4, h: 4 },
    { kind: 'c3birds', look: 'pigeon', x: 8, y: 12, w: 8, h: 3, n: 3 },
    { kind: 'c3vines', x: 1, y: 2, w: 14, len: 12 },
    { kind: 'c3vines', x: 16, y: 2, w: 12, len: 10 },
  ],
  city_statue_court: [
    { kind: 'crow', x: 4, y: 3, face: 1 },
    { kind: 'crow', x: 26, y: 3, face: -1 },
    { kind: 'drift', x: 22, y: 2, w: 2, h: 15, n: 7, color: '#76784c', lit: '#969a62' },
    { kind: 'caustics', x: 22, y: 2, w: 2, h: 15, color: '140,235,255' },
    { kind: 'c3birds', look: 'pigeon', x: 11, y: 5, w: 8, h: 3, n: 3 },
    { kind: 'c3vines', x: 1, y: 2, w: 28, len: 12 },
    { kind: 'blown', x: 1, y: 2, w: 30, h: 15, n: 5, colors: ['#76784c', '#56583a', '#969a62'], wind: 40 },
  ],
  city_sculptors_yard: [
    { kind: 'spores', x: 2, y: 2, w: 10, h: 6, color: '230, 226, 214', n: 8 },
    { kind: 'shaft', x: 5, y: 0.5, w: 2, h: 7, color: '255, 236, 190' },
    { kind: 'c3mouse', x: 11, y: 8, toX: 9, toY: 8 },
  ],
  // The Last Street is silent on purpose. Nothing here moves.
  city_gate_foot: [
    { kind: 'blown', x: 1, y: 12, w: 8, h: 4, n: 3, colors: ['#56583a', '#76784c'], wind: 24 },
  ],

  // ---- The Registry ----
  registry_cleft: [
    { kind: 'c3papers', x: 1, y: 3, w: 27, h: 8, n: 6 },
    { kind: 'c3mouse', x: 12, y: 10, toX: 10, toY: 10 },
    { kind: 'c3vines', x: 1, y: 4, w: 27, len: 8, style: 'web' },
  ],
  registry_counting: [
    { kind: 'c3papers', x: 1, y: 2, w: 27, h: 12, n: 8 },
    { kind: 'c3mouse', x: 3, y: 13, toX: 5, toY: 13 },
    { kind: 'c3vines', x: 1, y: 2, w: 13, len: 8, style: 'web' },
    { kind: 'spores', x: 1, y: 2, w: 27, h: 12, color: '230, 220, 200', n: 8 },
  ],
  registry_stacks: [
    { kind: 'c3papers', x: 1, y: 4, w: 42, h: 7, n: 8 },
    { kind: 'c3vines', x: 1, y: 4, w: 42, len: 7, style: 'web' },
    { kind: 'spores', x: 1, y: 4, w: 42, h: 7, color: '230, 220, 200', n: 10 },
  ],
  registry_lair: [
    { kind: 'c3papers', x: 1, y: 3, w: 27, h: 13, n: 10, colors: ['#efe6cc', '#d4c8a8', '#1c2c58'], ink: '#101a34' },
    { kind: 'c3vines', x: 1, y: 4, w: 27, len: 8, style: 'web' },
  ],
  registry_cellar: [
    { kind: 'c3papers', x: 1, y: 4, w: 27, h: 8, n: 5 },
    { kind: 'drip', x: 18, y: 2.5, fall: 2.6, every: 4.1 },
    { kind: 'c3mouse', x: 24, y: 7, toX: 26, toY: 7 },
  ],
  registry_waiting: [
    { kind: 'c3papers', x: 1, y: 3, w: 19, h: 6, n: 4 },
    { kind: 'c3mouse', x: 3, y: 8, toX: 5, toY: 8 },
    { kind: 'spores', x: 1, y: 3, w: 19, h: 6, color: '230, 220, 200', n: 6 },
  ],
};
