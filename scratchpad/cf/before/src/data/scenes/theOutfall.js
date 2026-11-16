// THE OUTFALL: the end of the Old Drains. The old conduit just stops, broken
// off, and its water goes over into the mist. Daylight. Far off, lights on
// poles across a fen. Ves's last arrow says "nearly". Old steps go down beside
// the falls into the Lantern Marsh.
export const THE_OUTFALL = {
  // Triggers in rooms name the scene by this id.
  id: 'the_outfall',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'drains_outfall',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 14, y: 7 } },
    { do: 'walk', who: 'bramble', to: { x: 14, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The old conduit ends. Its floor just stops, broken off, and all its water goes over the edge into the mist.' },
    { do: 'say', who: 'bramble', text: '{awed}Sword. Look. Daylight.' },
    { do: 'camera', to: { x: 22, y: 7 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'Far out in the fog, something glows. Then another. Lights, on poles, in a long wavering line across the fen.' },
    { do: 'say', who: 'bramble', text: '{thinking}Lights. Somebody lives out there. Somebody lit those.' },
    { do: 'say', who: 'bramble', text: '{worried}...She\'d have gone that way. It\'s the only way there is.' },
    { do: 'camera' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{determined}Come on, Sword. We\'re nearly there.\n\n{grin}She said so.' },
  ],
};
