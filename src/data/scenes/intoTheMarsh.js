// INTO THE MARSH: at the foot of the old steps down from the Outfall. The fen,
// grey and flat and going on for miles under the mist, and the first lantern
// on its pole. Bramble's never been out of the trees before.
export const INTO_THE_MARSH = {
  // Triggers in rooms name the scene by this id.
  id: 'into_the_marsh',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_falls_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 2, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 4, y: 5 } },
    { do: 'walk', who: 'bramble', to: { x: 3, y: 5 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{awed}There\'s no trees.\n\nThere\'s no trees ANYWHERE. Where did they all go?' },
    { do: 'camera', to: { x: 17, y: 7 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Flat grey ground, and black water, and reeds, and mist, going on further than you can see. And out in it, on a crooked pole, a light.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{thinking}Grandad says there\'s a bog past the bottom of the forest that eats cows. I thought he was making it up.\n\n{worried}He makes most things up.' },
    { do: 'say', who: 'bramble', text: '{determined}We stay on the hard bits. And we follow the lights. Like the stone says.' },
  ],
};
