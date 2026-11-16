// THE KEEPER AT HADDOCK'S: the first time into the parlour of Haddock's Light, somebody is
// there before you again. The old man in the hood, warming his hands at Haddock's stove, his
// lantern on its staff beside him. He's cheerful and calls Haddock "lad"; Haddock, who never
// stops talking, says almost nothing while he's there. He goes off out of the door before the
// weather comes in, and Haddock turns his own lamp up. His theme ("Minding the Fire",
// keeperTheme.js) plays while he's in the room, and Haddock's song comes back when he goes.
// Then `haddock_tells_it` plays straight after (the room has a second trigger for it where this
// scene leaves the hero, which only works once this one has played).
//
// (draft).
//
// Staging: Haddock stays in his chair (8..9, row 4). The old man stands by the stove (6,4). The
// party comes in at the door (7..8, row 12) and stops on the left (hero 7,7; Ves 5,6; Bramble 4,7),
// clear of the text box. His way out runs along row 5 in front of the chair to x 11, down to
// row 10 and out of the door at 8,12, so it passes nobody, and haddock_tells_it's walks up to
// the stove (hero 9,6; Ves 6,5; Bramble 4,5) cross nobody either. No monsters in the room.
export const KEEPER_AT_HADDOCKS = {
  id: 'keeper_at_haddocks',
  room: 'haddock_light_parlour',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_chair', x: 9, y: 4, portrait: 'haddock', plays: 'haddock_light', centered: true },
    { id: 'keeper', look: 'prop:keeper', x: 6, y: 4, portrait: 'old_keeper' },
    { id: 'ves', look: 'prop:vesper_stand', x: 7, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'keeper' },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'The foot of the tower is one round room, warm as a teapot. A stove ticks in the corner with a kettle on it. A cot, a table with a fat ledger on it, a tide board chalked up on the wall. And in a worn red armchair under the window, Haddock, with his hat tipped back.' },
    { do: 'walk', who: 'player', to: { x: 7, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 5, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 4, y: 7 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'He has company. At the stove, warming his hands, is an old man in a hood, with a lantern on a staff beside him.' },
    { do: 'face', who: 'keeper', dir: 'down' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'Ah! There they are. I said they\'d be along. Didn\'t I say so, lad?' },
    { do: 'say', who: 'haddock', text: '{tired}Ye did.' },
    { do: 'say', who: 'bramble', text: '{surprised}How did he get here first? There\'s only the one way out here. We were on it.' },
    { do: 'say', who: 'ves', text: '{smile}He does that. Don\'t ask him how. He\'ll only say "slowly".' },
    { do: 'say', who: 'keeper', face: 'sly', text: 'Slowly. And without falling off anything.' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'We\'re old friends, the lightman and I. Aren\'t we, lad?' },
    { do: 'say', who: 'haddock', text: '{tired}...Aye.' },
    { do: 'wait', seconds: 1 },
    // He looks to the window: the weather coming in.
    { do: 'face', who: 'keeper', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'keeper', dir: 'down' },
    { do: 'say', who: 'keeper', face: 'worried', text: 'There\'s weather coming. I\'ll be off before it gets here.\n\n{glee}It\'s a long dark sea out there, little one. Stay where the light can find you.' },
    // Out along the front of the chair, round the party and through the door.
    { do: 'walk', who: 'keeper', to: { x: 7, y: 5 } },
    { do: 'walk', who: 'keeper', to: { x: 11, y: 5 } },
    { do: 'walk', who: 'keeper', to: { x: 11, y: 10 } },
    { do: 'walk', who: 'keeper', to: { x: 8, y: 11 } },
    { do: 'walk', who: 'keeper', to: { x: 8, y: 12 } },
    { do: 'leave', who: 'keeper' },
    { do: 'wait', seconds: 1.2 },
    { do: 'music', song: 'haddock' },
    { do: 'say', text: 'The door bangs shut behind him. Haddock leans over to the lamp at his elbow and turns the wick up. Then a little more.' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{thinking}...Is he your friend?' },
    { do: 'say', who: 'haddock', text: '{tired}Known him a long time.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
