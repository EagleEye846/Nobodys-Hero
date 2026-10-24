// THE LANTERNS: the mist comes down thick on the Lantern Path, and the only
// things you can see in it are the lanterns, one after another, going out
// across the bog. And something else, glowing, that moves.
export const THE_LANTERNS = {
  // Triggers in rooms name the scene by this id.
  id: 'the_lanterns',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_lantern_path',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 1, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 2, y: 9 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The mist comes down so thick you can hardly see your own feet. Only the lanterns show through it, one, and another, and another, going on into the white.' },
    { do: 'say', who: 'bramble', text: '{worried}Sword. That one\'s moving.' },
    { do: 'camera', to: { x: 9, y: 9 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{scared}Lanterns don\'t move. Lanterns are on POLES.\n\n{determined}...Only the ones on poles, then. Right?' },
  ],
};
