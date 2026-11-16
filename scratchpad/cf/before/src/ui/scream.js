import { music } from '../audio/music.js';
import { SETTINGS } from '../state/settings.js';

// An easter egg: once in twenty times you equip the Ash Spear, you hear a
// scream (the spear's description warns of the screams of its past
// wielders). Stays quiet if the game is muted.
const CHANCE = 1 / 20;
const SOUND = 'assets/audio/scream.ogg';

let playing = false;

export function maybeScream() {
  if (playing || music.muted || SETTINGS.sounds <= 0 || Math.random() >= CHANCE) return;
  const scream = new Audio(SOUND);
  scream.volume = SETTINGS.sounds;
  playing = true;
  const done = () => { playing = false; };
  scream.addEventListener('ended', done);
  scream.addEventListener('error', done);
  scream.play().catch(done);
}
