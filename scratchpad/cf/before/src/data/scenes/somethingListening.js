// SOMETHING LISTENING: a step into the Crawl from the west, and Ves stops
// you. Something down here hunts by sound (the rings on the floor: see
// deep_crawl), and for once, charging in won't do.
export const SOMETHING_LISTENING = {
  // Triggers in rooms name the scene by this id.
  id: 'something_listening',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_crawl',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 1, y: 17, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    // You're down in the room's bottom corner: the words go up top.
    { do: 'textbox', top: true },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'ves', act: 'look' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{worried}Wait. Something\'s down here.\n\n{scared}Not a monster-monster. Something that sits very still and LISTENS.' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'ves', text: '{bored}So, for once in your life, no charging at things. Slow, quiet, and if the floor starts to ripple, that\'s it hearing us.\n\n{thoughtful}And if it won\'t move, give it something more interesting to listen to.\n\n{smile}Hide. I\'ll be hiding first, for the record.' },
    { do: 'face', who: 'player', dir: 'right' },
  ],
};
