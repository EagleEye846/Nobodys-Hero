// STONES ON THE STAIR (draft): the Way Up, at the foot of the fifth flight,
// once the light has gone up. The root's light runs on up the stair ahead of
// you like somebody lighting a street of lamps, which is how Ves's mum used to
// do it. At the turn, one of the Hero's little piles of flat stones; Ves adds
// one of her own. Far below, a pebble clicks down the steps, as if something
// small had kicked it (Bramble, who never went home).
//
// Clearance: nothing lives on the Way Up. Ves goes ahead along row 21, then
// along row 22 to stand below the cairn at 18,21; you follow to 17,21.
export const STONES_ON_THE_STAIR = {
  // Triggers in rooms name the scene by this id.
  id: 'stones_on_the_stair',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_way_up',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 25, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 1, y: 21 } },
    { do: 'face', who: 'player', dir: 'up' },
    // The light, going on up the stair ahead of you.
    { do: 'camera', to: { x: 11, y: 8 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The root\'s light runs on up the stair ahead of you, vein by vein, flight by flight, like somebody going up a street lighting the lamps.' },
    { do: 'camera' },
    { do: 'walk', who: 'ves', to: { x: 2, y: 21 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{smile}Mum went like that. One lamp, then the next, then the next.' },
    { do: 'say', who: 'ves', text: '{bored}Slower, though. She stopped to talk to everybody.' },
    // On along the flight to the turn.
    { do: 'walk', who: 'ves', to: { x: 16, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 17, y: 22 } },
    { do: 'walk', who: 'ves', to: { x: 18, y: 22 } },
    { do: 'walk', who: 'player', to: { x: 17, y: 21 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: 'At the turn, another little pile of flat stones, stacked by small hands.\n\nOne at every turn, all the way up, for whoever came down next.' },
    { do: 'say', who: 'ves', text: '{thoughtful}A hundred years, and whoever came next was us.' },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Ves picks a flat stone up off the step and sets it on the top, very carefully, so it won\'t be the one that brings the rest down.' },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{proud}There. Now it says somebody came.' },
    { do: 'wait', seconds: 0.8 },
    // Far below, something small.
    { do: 'sound', name: 'clack' },
    { do: 'say', text: 'Far below, a pebble clicks down a flight of steps, as if something small had kicked it. Then nothing.' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{surprised}... {bored}It\'s a very old stair.' },
    { do: 'wait', seconds: 0.3 },
  ],
};
