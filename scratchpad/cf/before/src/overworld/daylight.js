import { WORLD_STATE } from '../state/saveGame.js';

// Day and night on the mountain. The sun goes round once every DAY_SECONDS
// of play, starting in the morning, so a long climb sees the light change:
// the sky deepens, the far peaks go blue, lamps and windows come on in the
// village, stars come out over the spire, and it all comes back with the
// dawn. Only the outdoors notices (rooms with a `vista`, or in an outdoor
// area); caves and houses are lit the way they're lit.

export const DAY_SECONDS = 14 * 60;
// Where in the day the game begins (0 is sunrise, 0.25 noon, 0.5 sunset).
const START_OF_DAY = 0.08;

// The time of day, 0 to 1 (0 sunrise, 0.25 noon, 0.5 sunset, 0.75 midnight).
export function timeOfDay(seconds = WORLD_STATE.playSeconds ?? 0) {
  return ((seconds / DAY_SECONDS) + START_OF_DAY) % 1;
}

// How dark it is (0 full day, 1 deep night), how golden the light is (0 to
// 1, peaking at sunrise and sunset), and how high the sun stands (-1 to 1).
export function daylight(seconds) {
  const t = timeOfDay(seconds);
  const elevation = Math.sin(t * Math.PI * 2);
  const night = Math.max(0, Math.min(1, (0.12 - elevation) / 0.55));
  const dusk = Math.max(0, 1 - Math.abs(elevation) / 0.22) * (1 - night * 0.5);
  return { t, elevation, night, dusk };
}
