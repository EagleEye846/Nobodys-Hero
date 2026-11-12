// SHIP DECK IN: up the gangway onto the deck (ship_deck, trigger row 15, x 19-22: the first row north of the plank). The
// deck is dry. A single lantern burns by the captain's door with no oil in it. You can't see anyone, and it is like walking
// into a room where everyone has just stopped talking. Ves (19,16) and Bramble (22,16) are behind, either side of the
// gangway's head. Nobody walks. No monster stands within three tiles of the trigger. The hero never speaks. DRAFT.
export const SHIP_DECK_IN = {
  id: 'ship_deck_in',
  room: 'ship_deck',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 16, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 22, y: 16, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'On deck the fog is so thick that the mast is only a rumour. The planks are dry. That is wrong, in this yard: it has been raining on everything else for months, and here the wet has been held off, like a hand held over a candle.' },
    { do: 'camera', to: { x: 13, y: 12 } },
    { do: 'say', text: 'A lantern burns on a bracket at the foot of the stern deck, by a shut door. It gives a small, steady, yellow light. The wick is dry. There is no oil. It is the only light on the ship, and it looks like a light that has been left on for somebody.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'camera' },
    { do: 'haunt', dip: 2.2 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'say', text: 'There\'s nobody on the deck. You can\'t see anyone. All the same it feels like walking into a room where everyone has just stopped talking.' },
    { do: 'say', who: 'bramble', text: '{scared}Somebody\'s looking at me.' },
    { do: 'say', who: 'ves', text: '{bored}Don\'t look at the rail.' },
    { do: 'say', who: 'bramble', text: '{scared}I\'m not looking at the rail. I\'m looking at the floor. It\'s a very nice floor.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{thoughtful}Somebody\'s left a light on for us. Charming. We\'d better have it.' },
    { do: 'face', who: 'ves', dir: 'up' },
  ],
};
