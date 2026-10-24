// THE STILT HUT: you come out on an island in the fen, and there's a hut on
// stilts in the water beside it, with smoke coming out of its roof and
// firelight in its window.
export const THE_STILT_HUT = {
  // Triggers in rooms name the scene by this id.
  id: 'the_stilt_hut',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_hut_island',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'camera', to: { x: 13, y: 3 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'A little hut, up on stilts in the water. Smoke is coming out of the thatch. There\'s firelight in the window.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{surprised}Smoke! Somebody\'s lit a fire!\n\n{thinking}Bog things don\'t light fires. I don\'t think. I don\'t know much about bog things.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'bramble', text: '{determined}Go on, Sword. You go first. I\'m right behind you. Right behind.' },
  ],
};
