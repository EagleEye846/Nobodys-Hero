// THE GHOST COOK: stepping into the wreck's galley (wreck_galley, trigger the column at
// x 3). The cook, a drowned ship's cook who has not noticed, is delighted to have diners
// at last. His face in the box is the `ghost_cook` portrait (src/data/art/wreckYard.js;
// {surprised} is his one other look). Nobody walks: the party stays by the door (x 2 to 4) and the cook
// stays by his stove (15,4). (The hero never speaks.)
export const THE_GHOST_COOK = {
  id: 'the_ghost_cook',
  room: 'wreck_galley',
  once: true,

  actors: [
    { id: 'cook', look: 'prop:wy_ghost_cook', x: 15, y: 4, portrait: 'ghost_cook', plays: 'ghost_cook', animation: 'wy_ghost_cook', speed: 0.4 },
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The galley is dry, and laid for dinner. Bowls down the long table, spoons beside them, every bowl full to the brim with nothing at all.' },
    { do: 'camera', to: { x: 14, y: 5 } },
    { do: 'wait', seconds: 1 },
    { do: 'emote', who: 'cook', emote: '!' },
    { do: 'act', who: 'cook', act: 'hop' },
    { do: 'say', text: 'A pale shape over the stove throws up its ladle.' },
    { do: 'say', who: 'cook', text: '{surprised}CUSTOMERS!' },
    { do: 'say', who: 'cook', text: 'Sit down, sit down! Soup\'s on. Soup\'s always on.' },
    { do: 'camera' },
    { do: 'face', who: 'ves', at: 'cook' },
    { do: 'face', who: 'bramble', at: 'cook' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{surprised}...He\'s a GHOST.' },
    { do: 'act', who: 'cook', act: 'hop', wait: false },
    { do: 'say', who: 'cook', text: '{surprised}I\'m RESTING, miss. Between services.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}What\'s the soup?' },
    { do: 'say', who: 'cook', text: 'Soup of the day!' },
    { do: 'say', who: 'bramble', text: '{thinking}Which day?' },
    { do: 'act', who: 'cook', act: 'look' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'cook', text: '...Tuesday. It\'s been Tuesday a good while.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{smile}Your stove isn\'t lit.' },
    { do: 'act', who: 'cook', act: 'shake', wait: false },
    { do: 'say', text: 'The cook flaps his ladle at her.' },
    { do: 'say', who: 'cook', text: 'Shh! It doesn\'t KNOW that.' },
    { do: 'say', who: 'cook', text: 'Help yourselves from the pot. Mind your fingers, it\'s hot!' },
    { do: 'say', text: 'It is not hot.' },
    { do: 'emote', who: 'player', emote: '...', wait: false },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'bramble', text: '{grin}I like him.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{glee}You would.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
