import { music } from '../audio/music.js';

// An easter egg: once in a hundred times you equip the Ash Spear, you hear a
// scream (the spear's description warns of the screams of its past
// wielders). Stays quiet if the game is muted.
const CHANCE = 1 / 100;
const SOUND = 'assets/audio/scream.ogg';

let playing = false;

export function maybeScream() {
  if (playing || music.muted || Math.random() >= CHANCE) return;
  const scream = new Audio(SOUND);
  playing = true;
  const done = () => { playing = false; };
  scream.addEventListener('ended', done);
  scream.addEventListener('error', done);
  scream.play().catch(done);
}
