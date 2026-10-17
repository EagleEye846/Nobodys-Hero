import { defineBulletArt } from '../projectiles.js';
import { makeStepAttacks } from './step.js';

// The Frozen Step's attacks. It's the Loose Step's brother, the top step of
// the Long Stair, frozen solid while it waited, so it fights the same way in
// ice and snow: little iced-over steps tumbling down and shattering into
// chips, the Hero's bootprint (frosted, now), ice cracks running through the
// box, and an avalanche where its brother had a rockslide. The moves are the
// Loose Step's own (makeStepAttacks in step.js); only the art is new.

const ICE = { k: '#1a2236', w: '#f4f8fc', i: '#bfe6ff', I: '#7fb6dc', d: '#4a7aa6', s: '#a8a092' };

// A little stair step sealed in ice, a cap of snow on top.
defineBulletArt('iceBlock', {
  frames: [[
    'kkkkkkk',
    'kwwwwwk',
    'kiiwiik',
    'kkkkkIk',
    'kisiiIk',
    'kIIIIdk',
    'kkkkkkk',
  ]],
  palette: ICE,
  radius: 3,
  spin: 6,
});

// A chip of ice, glinting as it turns.
defineBulletArt('iceChip', {
  frames: [
    ['.w.', 'wiI', '.I.'],
    ['.i.', 'Iwi', '.i.'],
  ],
  palette: ICE,
  radius: 1.5,
  frameSeconds: 0.08,
});

// A snowball rolled up round a rock, picking up snow as it comes.
defineBulletArt('iceSnowball', {
  frames: [[
    '..kkk..',
    '.kwwwk.',
    'kwwwisk',
    'kwiwwwk',
    'kswwiwk',
    '.kiIik.',
    '..kkk..',
  ]],
  palette: ICE,
  radius: 3.5,
  spin: 5,
});

// The sole of a hero's boot, rimed with frost. It blinks where it'll land.
defineBulletArt('iceBoot', {
  frames: [[
    '...kkkkk...',
    '..kbbbbbk..',
    '.kbBwBbBbk.',
    '.kbbbbbwbk.',
    '.kbBbBbBbk.',
    '.kwbbbbbbk.',
    '..kbBbBwk..',
    '..kbbbbbk..',
    '...kbwbk...',
    '...kkkkk...',
    '..kbbbbbk..',
    '..kwBbBbk..',
    '..kbbbbwk..',
    '...kkkkk...',
  ]],
  palette: { k: '#120c1c', b: '#7a4f2a', B: '#5a3a1e', w: '#dff0fb' },
  hitbox: { w: 9, h: 13 },
});

export const ICE_STEP_ATTACKS = makeStepAttacks({
  names: { tumble: 'iceStepTumble', footfall: 'iceStepFootfall', crack: 'iceStepCrack', slide: 'iceStepAvalanche' },
  art: { block: 'iceBlock', pebble: 'iceChip', boulder: 'iceSnowball', boot: 'iceBoot' },
  crack: '#bfe6ff',
});
