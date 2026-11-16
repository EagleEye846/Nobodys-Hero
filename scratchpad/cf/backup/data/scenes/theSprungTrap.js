// THE SPRUNG TRAP: the grown-ups' trap camp, wrecked. The cage they built
// for the Hush is smashed open from the inside, axes left in the ground,
// nobody here. Bramble goes very quiet, then runs from one thing to the
// next, and finds the notch: fresh, past the wreckage. Ma cut it after. She's
// alright, and still hunting.
export const THE_SPRUNG_TRAP = {
  // Triggers in rooms name the scene by this id.
  id: 'the_sprung_trap',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_sprung_trap',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 14, y: 21, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'camera', to: { x: 6, y: 10 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'bramble', text: '{scared}...That\'s the grown-ups\' trap.' },
    { do: 'say', who: 'bramble', text: '{scared}They were building it all summer. They wouldn\'t let me help. They said it was too big for me.' },
    { do: 'camera' },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 18 } },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{worried}Nobody\'s here. There\'s axes, but nobody\'s here.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'walk', who: 'bramble', to: { x: 24, y: 18 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'walk', who: 'bramble', to: { x: 26, y: 6 } },
    { do: 'camera', to: { x: 26, y: 6 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', who: 'bramble', text: '{surprised}Sword! SWORD! Come and look!' },
    { do: 'say', who: 'bramble', text: '{crying}It\'s Ma\'s notch. It\'s FRESH. She cut it after. After all this.\n\n{glee}She\'s alright! You don\'t stop to cut a notch if you\'re not alright!' },
    { do: 'say', who: 'bramble', text: '{determined}And it points off east. She cut it after, and went off east. Still after it, I bet.\n\n{sheepish}...I wasn\'t scared. I had something in my eye.' },
    { do: 'camera' },
    { do: 'music', song: 'hushwood' },
  ],
};
