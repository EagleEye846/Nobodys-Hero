import { COAST_AREAS } from '../overworld/coastTiles.js';

// What going through a door sounds like, by what the door is made of (the
// sounds are in SFX, src/audio/music.js). A door can say for itself with
// `sound` (any sound effect's name); otherwise it's worked out from the two
// rooms either side of it:
//   - one of the named doors below (DOORS): King Peptup's great hall doors,
//     the little timber door down to the mines, the lift cage's iron gate
//   - in or out of a hull (a room whose ambience is inside a wreck): the
//     heavy iron hatch (doorHatch)
//   - between a cave and somewhere that isn't one: the cave mouth, no door,
//     just steps on rock (doorCave)
//   - in or out of any other building: a wooden house door (doorWood)
//   - anything else (along a path, from one cave to the next, up the stairs
//     inside one building): the soft step it always was (door).
// Gates that open by a switch in a coast room are iron (doorGate: see
// gateSound).

// A cave is a room whose ambience is a cave's, or that rings like one (its
// `echo` flag: see ECHOES in src/audio/music.js). Chapter 4's passages out of
// Belowtown (the Long Rope, the Secret Way) count too: no door, just rock.
const CAVES = new Set([
  'cave', 'sea_cave', 'cliff_cave', 'mine', 'lake', 'deep', 'crystal',
  'crystal_falls', 'mine_quiet', 'mine_flooded', 'lake_jetty', 'lake_hall', 'deep_stair', 'deep_fire',
  'long_rope', 'belowtown_tunnel',
]);
const CAVE_ECHOES = new Set(['cave', 'cavern', 'tunnel', 'pocket']);
const HULLS = new Set(['hulk_storm', 'calm_hulk']);

// Doors that are their own thing, by the two rooms they join (either way).
// Added 9 November 2026 for chapter 4.
const DOORS = [
  // King Peptup's hall: its great carved doors on the square.
  [['belowtown_square', 'belowtown_throne'], 'doorHall'],
  // The little door at the back of the hall that goes down to the pithead.
  [['belowtown_throne', 'diggings_pithead'], 'doorMine'],
  // The lift's cage: an iron gate, then down to the lake.
  [['diggings_lift', 'stillwater_shore'], 'doorGate'],
];

const isCave = (room) => CAVES.has(room?.ambience) || CAVE_ECHOES.has(room?.echo);
const isHull = (room) => HULLS.has(room?.ambience);

export function doorSound(from, to, door = {}) {
  if (door.sound) return door.sound;
  const named = DOORS.find(([rooms]) => rooms.includes(from?.id) && rooms.includes(to?.id) && from?.id !== to?.id);
  if (named) return named[1];
  if (isHull(from) !== isHull(to)) return 'doorHatch';
  if (isCave(from) !== isCave(to)) return 'doorCave';
  if (Boolean(from?.indoors) !== Boolean(to?.indoors) && !isCave(from) && !isCave(to)) return 'doorWood';
  return 'door';
}

// A gate in a room swinging open when its switches are all set: iron on the
// coast (the wreck's bolted gate, Saltcombe's), the old grinding stone
// elsewhere. A gate can say for itself with `sound`.
export function gateSound(room, gate) {
  return gate?.sound ?? (COAST_AREAS.has(room?.area) ? 'doorGate' : 'door');
}
