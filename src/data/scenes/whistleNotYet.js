// THE WHISTLE, NOT YET (a secret, Chapter 4; draft, every line): walking down the crack's
// corridor in Seam Nine with one or two of the seventh shift's three whistle pieces, not
// all three (the trigger is in diggingsLostSeam.js, `someGear`; with all three it is
// whistle_blown instead, puddingPool.js). The skin of glass hums at what you carry, a tune with
// gaps in it, and Ves says which pieces are still missing, the way the roster by the hats put
// it (the pea: Fenn, up to the light; the mouthpiece: Hale, the smith's; the barrel: Tarn,
// where the stones run out). The steps pick themselves by what's in your pack (`has`,
// `lacks`, `holding`: see scenePlayer.js). Plays every time; the hero steps back off the
// trigger at the end. The hero never speaks.
// Clearance: the walk is column 3, rows 12 to 13, nothing else in the corridor.
const PEA = 'whistle_pea';
const MOUTH = 'whistle_mouth';
const BARREL = 'whistle_barrel';
const PIECES = [PEA, MOUTH, BARREL];

export const WHISTLE_NOT_YET = {
  id: 'whistle_not_yet',
  room: 'diggings_lost_seam',
  once: false,
  actors: [{ id: 'ves', look: 'prop:vesper_stand', x: 3, y: 11, portrait: 'vesper', plays: 'vesper' }],
  steps: [
    { do: 'walk', who: 'player', to: { x: 3, y: 13 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'shimmer' },

    // One piece of three.
    { do: 'say', has: PEA, holding: [1, PIECES], text: 'In your pocket, the whistle pea has gone warm, and it rattles once on its own.\n\nThe skin of glass over the crack hums back at it: one note of a tune, and then a long gap where the rest should be.' },
    { do: 'say', has: MOUTH, holding: [1, PIECES], text: 'In your pocket, the brass mouthpiece has gone warm.\n\nThe skin of glass over the crack hums back at it: one note of a tune, and then a long gap where the rest should be.' },
    { do: 'say', has: BARREL, holding: [1, PIECES], text: 'In your pocket, the brass barrel has gone warm, and it still smells of the lake.\n\nThe skin of glass over the crack hums back at it: one note of a tune, and then a long gap where the rest should be.' },
    { do: 'say', holding: [1, PIECES], who: 'ves', text: '{bored}One piece of three. That isn\'t a whistle. That\'s a souvenir.' },

    // Two pieces of three.
    { do: 'say', lacks: PEA, holding: [2, PIECES], text: 'In your pocket, the mouthpiece and the barrel have gone warm. They click together, nearly.\n\nThe skin of glass over the crack hums back at them: most of a tune, and then a gap, small and pea-shaped.' },
    { do: 'say', lacks: MOUTH, holding: [2, PIECES], text: 'In your pocket, the pea and the barrel have gone warm. The pea rattles in the barrel, looking for something to blow it.\n\nThe skin of glass over the crack hums back at them: most of a tune, and then a gap where the first note should be.' },
    { do: 'say', lacks: BARREL, holding: [2, PIECES], text: 'In your pocket, the pea and the mouthpiece have gone warm, with nothing to hold them together.\n\nThe skin of glass over the crack hums back at them: most of a tune, and then a gap in the middle.' },
    { do: 'say', holding: [2, PIECES], who: 'ves', text: '{smile}Two of three. Close. A whistle is no good at all at close.' },

    // What's missing, as the roster put it.
    { do: 'say', lacks: PEA, who: 'ves', text: '{thoughtful}No pea. That was Fenn\'s. Up to the light, the roster said. Needs a stone under it.' },
    { do: 'say', lacks: MOUTH, who: 'ves', text: '{thoughtful}No mouthpiece. Hale\'s. Gone to the smith\'s, still cooling. {bored}It\'s had long enough.' },
    { do: 'say', lacks: BARREL, who: 'ves', text: '{thoughtful}No barrel. Tarn\'s. The long way round, where the stones run out.' },

    { do: 'walk', who: 'player', to: { x: 3, y: 12 } },
  ],
};
