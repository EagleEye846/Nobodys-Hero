// THE FAR DOOR: after Bramble's gone home, by the barred door in Lasthome's
// east wall. Thistle's there. Something came through the town in the night,
// over the roofs, quiet as snow, and went out into the dead city toward the
// Gate, with something purple in its mouth. Ves knows what. Thistle unbars
// the door.
export const THE_FAR_DOOR = {
  // Triggers in rooms name the scene by this id.
  id: 'the_far_door',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'thistle', look: 'prop:lh_thistle', x: 30, y: 8, portrait: 'thistle' },
    { id: 'ves', look: 'prop:vesper_crutch', x: 25, y: 9, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 28, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 27, y: 10 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'thistle', dir: 'left' },
    { do: 'say', who: 'thistle', text: '{sad}Morning. Didn\'t sleep. Nobody did, much.\n\nSomething came through in the night. Over the roofs. Not a sound. Just the birds, all stopping at once.' },
    { do: 'say', who: 'thistle', text: '{thoughtful}I saw it go over the far wall, out into the old city. Toward the Gate.\n\nIt had something in its mouth. Something purple.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{determined}That\'s mine.' },
    { do: 'say', who: 'thistle', text: '{surprised}Yours? Love, that thing\'s bigger than my house.' },
    { do: 'say', who: 'ves', text: '{determined}I don\'t care how big it is. It was my mum\'s. I let go of it once. I\'m not doing it twice.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'thistle', text: '{sad}...No. I don\'t suppose you are.' },
    { do: 'say', who: 'thistle', text: '{smile}Nobody\'s gone out that door in my lifetime. The old city\'s all falling down, and things live in it.\n\nBut it\'s your umbrella. Mind how you go.' },
    { do: 'sound', name: 'door' },
    { do: 'say', text: 'Thistle lifts the great beam off the far door, and it swings out onto a street of dead lamps.' },
  ],
};
