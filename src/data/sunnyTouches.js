// The life pass, round 2: Sunnyside's living things (kinds in src/overworld/sunnyLife.js, and the older
// ones in touches.js: laundry, steam and so on). Added on top of each room's own list in
// src/data/touches.js. Only drawn, never placed: none of it has a body. `ch: 4` or `ch: 5` limits a line to
// one chapter. Positions are in tiles. Rooms: Sunnyside's fourteen, the Burrow, Haddock's Light and the
// chapter 5 secret rooms.
//
//   hen        a hen (white, brown, black, speckle) pecking about; `chicks: 2` trail her
//   dog        a farm dog, asleep; wakes when you come near
//   puff       a dandelion clock that lets go of its seeds when you come close
//   flutter    butterflies round a patch; they scatter when you come near
//   swallows   a pair skimming over a box of the field now and then
//   ducks      a duck and her ducklings paddling over water
//   heron      a heron in the shallows, off when you come near
//   rustle     a bush that rustles (chapter 4: it is a little nearer the path each time you come back)
//   ants       a line of ants carrying crumbs between two points
//   cloudshade soft cloud shadows drifting over the whole room
//   dapple     leaf shadow and flecks of light under a tree
//   slowSnail  a snail on the way along a course; it will take about six minutes
//   spray      foam blowing up over a cliff edge
export const SUNNY_TOUCHES = {
  sunny_lane: [
    { kind: 'hen', x: 10, y: 13, coat: 'white', chicks: 2, r: 1.3 },
    { kind: 'laundry', x: 7.5, y: 10.9, x2: 12.4, y2: 10.9, items: 4 },
    { kind: 'flutter', x: 7, y: 5, n: 3 },
    { kind: 'swallows', x: 2, y: 3, w: 34, h: 5, every: 13, offset: 3 },
  ],
  sunny_gate_field: [
    { kind: 'puff', x: 19, y: 12 },
    { kind: 'swallows', x: 2, y: 2, w: 26, h: 6, every: 12, offset: 5 },
    { kind: 'cloudshade', y: 2, w: 30, h: 12, n: 3 },
    { kind: 'dapple', x: 3, y: 6.6, r: 2.2 },
  ],
  sunny_brook: [
    { kind: 'ducks', x: 15, y: 9.2, w: 15, h: 1.6, n: 3 },
    { kind: 'heron', x: 3, y: 10, side: -1 },
    { kind: 'puff', x: 26, y: 6 },
    { kind: 'flutter', x: 9, y: 5, n: 3 },
  ],
  sunny_soft_field: [
    { kind: 'hen', x: 4, y: 5, coat: 'white', chicks: 2, r: 1.4 },
    { kind: 'dog', x: 10, y: 16, face: 1 },
    { kind: 'flutter', x: 13, y: 4, n: 3 },
    { kind: 'swallows', x: 2, y: 2, w: 34, h: 6, every: 12, offset: 7 },
  ],
  sunny_hayfields: [
    { kind: 'puff', x: 13, y: 8 },
    { kind: 'flutter', x: 35, y: 10, n: 2 },
    { kind: 'swallows', x: 2, y: 2, w: 36, h: 6, every: 10, offset: 1 },
    { kind: 'cloudshade', y: 2, w: 40, h: 14, n: 4 },
  ],
  sunny_dandelion_hill: [
    { kind: 'puff', x: 3, y: 8 },
    { kind: 'flutter', x: 6, y: 3, n: 3 },
    { kind: 'swallows', x: 14, y: 2, w: 14, h: 6, every: 11, offset: 4 },
    { kind: 'cloudshade', y: 2, w: 48, h: 14, n: 4 },
  ],
  sunny_windmill: [
    { kind: 'puff', x: 12, y: 5 },
    { kind: 'flutter', x: 12, y: 7, n: 3 },
    { kind: 'swallows', x: 12, y: 2, w: 20, h: 5, every: 9, offset: 3 },
    { kind: 'cloudshade', y: 2, w: 40, h: 14, n: 4 },
  ],
  sunny_orchard: [
    { kind: 'dog', x: 38, y: 8, face: -1 },
    { kind: 'puff', x: 22, y: 10 },
    { kind: 'flutter', x: 34, y: 5, n: 4 },
    { kind: 'swallows', x: 2, y: 2, w: 36, h: 6, every: 12, offset: 6 },
  ],
  sunny_mill_pond: [
    { kind: 'ducks', x: 13, y: 3.8, w: 12, h: 1, n: 3 },
    { kind: 'heron', x: 23, y: 7, side: 1 },
    { kind: 'flutter', x: 34, y: 7, n: 3 },
    { kind: 'swallows', x: 10, y: 3, w: 20, h: 7, every: 9, offset: 2 },
  ],
  sunny_last_farm: [
    { kind: 'hen', x: 6, y: 14, coat: 'white', chicks: 2, r: 1.5 },
    { kind: 'dog', x: 4, y: 8, face: 1 },
    { kind: 'flutter', x: 36, y: 13, n: 2 },
    { kind: 'swallows', x: 2, y: 2, w: 36, h: 6, every: 11, offset: 8 },
  ],
  sunny_cliff_meadow: [
    { kind: 'puff', x: 6, y: 3 },
    { kind: 'swallows', x: 2, y: 2, w: 30, h: 7, every: 9, offset: 4 },
    { kind: 'skyGulls', x: 20, y: 1, w: 20, h: 6, n: 3 },
    { kind: 'cloudshade', y: 2, w: 44, h: 14, n: 3 },
  ],
  sunny_sea_view: [
    { kind: 'skyGulls', x: 2, y: 4, w: 26, h: 8, n: 4 },
    { kind: 'spray', x: 0, y: 12.2, w: 23, h: 1.6, n: 14 },
    { kind: 'swallows', x: 2, y: 3, w: 26, h: 8, every: 10, offset: 5 },
    { kind: 'cloudshade', y: 2, w: 30, h: 10, n: 3 },
  ],
  // ---- The burrow under the orchard ----
  secret_sunny_burrow: [
    { kind: 'spores', x: 5, y: 3, w: 6, h: 5, color: '255, 232, 180', n: 8 },
  ],
  // ---- Haddock's Light: gulls, spray and dust in the lamplight. His rooms' own things are left as they are. ----
  haddock_light_door: [
    { kind: 'skyGulls', x: 2, y: 1, w: 26, h: 4, n: 3 },
    { kind: 'spray', x: 1, y: 1, w: 9, h: 3, n: 7 },
    { kind: 'swallows', x: 2, y: 5, w: 24, h: 7, every: 14, offset: 6 },
  ],
  haddock_light_parlour: [
    { kind: 'spores', x: 6, y: 3, w: 5, h: 5, color: '255, 240, 200', n: 9 },
  ],
  haddock_light_stair: [
    { kind: 'spores', x: 8, y: 4, w: 5, h: 4, color: '255, 240, 200', n: 8 },
  ],
  haddock_light_corries_room: [
    { kind: 'spores', x: 4, y: 3, w: 4, h: 4, color: '255, 240, 200', n: 7 },
  ],
};
