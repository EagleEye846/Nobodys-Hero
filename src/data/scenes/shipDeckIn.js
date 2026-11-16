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
    { do: 'say', who: 'ves', text: '{proud}There\'s nobody here, Bramble. I looked.' },
    { do: 'say', who: 'bramble', text: '{scared}Then who\'s LOOKING? ...I\'m going to look at the floor. It\'s a very nice floor.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{determined}...Somebody\'s left a light on. I\'d rather we were holding it than whoever lit it.' },
    { do: 'face', who: 'ves', dir: 'up' },
    // (draft) 2026-11-14: the shard at the bow. With the Fallen Star, it hums toward the bow (and keeps on, starPull.js);
    // with it or without, the faint blue light out past the bow rail (gs_bow_star, the deck's east point).
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'shimmer', wields: 'fallen_star' },
    { do: 'emote', who: 'player', emote: '!', wait: false, wields: 'fallen_star' },
    { do: 'say', wields: 'fallen_star', text: 'At your hip, the Fallen Star hums: one thin, high note, like a wet finger round the rim of a glass. It isn\'t the cold. It is pulling, very slightly, forward. Toward the bow.' },
    { do: 'camera', to: { x: 36, y: 10 } },
    { do: 'say', text: 'Out at the far end of the deck, where the rail closes to a point, there is a light in the fog. Not a lantern\'s yellow: a pale, cold blue, very small, somewhere out past the bow. It doesn\'t flicker.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', wields: 'fallen_star', text: '{scared}Your sword\'s pointing again. ...At the scary end. Of course it\'s the scary end.' },
    { do: 'say', who: 'bramble', unarmed: 'fallen_star', text: '{scared}I looked up. I said I wouldn\'t, and I looked up.' },
    { do: 'say', who: 'ves', text: '{smile}Well. Now we know which end of the ship is the interesting one.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
