// ME AND THE HERO (Hero trail 5, the drawing): in Corrie's little room at the top of Haddock's
// Light, the child's crayon drawing by the window (c5_child_drawing, 7,2): a lighthouse and two
// small people under it, one labelled ME, the other THE HERO. Bramble notices the sword is bigger
// than THE HERO; Ves glances at the hero (and his sword) and doesn't say it. Nobody names Corrie
// or the boy. The hero never speaks. The Z read (room_drawing, haddock_light.txt) is unchanged.
//
// The trigger (haddockLightCorriesRoom.js) is x 4 to 7, row 8: just inside the only door (5..6,
// row 10), so anyone coming in walks through it. The hero stops under the drawing (7,3), Bramble
// beside him (6,3), Ves a step back by the chest (8,4); clear of the toy boat (3,7), the lamp
// stool (3,4), the plant (4,3), the chest (9,4) and the books (10,7). No monsters. Until the end
// of the chapter (the_light_answers).
//
// (draft).
export const ME_AND_THE_HERO = {
  id: 'me_and_the_hero',
  room: 'haddock_light_corries_room',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 5, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 6, y: 3 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 8, y: 4 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 7, y: 3 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', text: 'Pinned up by the window, a child\'s drawing in crayon. A lighthouse, and two small people under it, holding hands.\n\nOne says ME. The other says THE HERO.' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{thinking}THE HERO\'s got a sword. It\'s bigger than he is.' },
    { do: 'say', who: 'ves', text: '{smile}Artistic licence.' },
    // She looks at the hero (and what's at his side) a moment too long, and back.
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{grin}And ME\'s got a coat on. Right down to his feet.' },
    { do: 'say', who: 'ves', text: '{laughing}He did himself first. Bigger letters, too.' },
    { do: 'act', who: 'bramble', act: 'nod' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
