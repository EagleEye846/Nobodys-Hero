// BRAMBLE GOES HOME: by Lasthome's gate, Corran's waiting with the charcoal
// cart. Bramble says goodbye, which he says isn't goodbye: he gives you his
// whistle, and tells you not to tell him how it ends, because he's coming to
// see. Then he goes. (He'll be back for a while, later in the story.)
export const BRAMBLE_GOES_HOME = {
  // Triggers in rooms name the scene by this id.
  id: 'bramble_goes_home',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 15, portrait: 'bramble', plays: 'bramble' },
    { id: 'ves', look: 'prop:vesper_crutch', x: 16, y: 15, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'corran', look: 'prop:lh_corran', x: 24, y: 16, plays: 'lh_corran' },
  ],

  steps: [
    { do: 'walk', who: 'corran', to: { x: 17, y: 19 } },
    { do: 'face', who: 'corran', dir: 'up' },
    { do: 'walk', who: 'player', to: { x: 16, y: 17 } },
    { do: 'walk', who: 'ves', to: { x: 15, y: 17 } },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 18 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'music', song: 'bramble' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{sheepish}So. This is the gate.' },
    { do: 'say', who: 'bramble', text: '{determined}I\'m not crying. It\'s the charcoal. Corran\'s all over charcoal.' },
    { do: 'say', who: 'bramble', text: '{proud}Here. Sword. Take this.' },
    { do: 'give', item: 'bramble_whistle' },
    { do: 'say', who: 'bramble', text: '{determined}You blow it and I\'ll come. I\'ll hear it. I\'ve got the best ears in the camp. Ma says I can hear a biscuit tin open from the other side of the brook.' },
    { do: 'say', who: 'ves', text: '{smile}Bramble. You came after somebody you\'d never even met.\n\n{bored}That\'s either very brave or very silly. ...Thanks.' },
    { do: 'say', who: 'bramble', text: '{proud}Somebody had to.\n\n{grin}And you were worth it. You tie good knots.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{thinking}Sword. When it\'s all over, whatever it is you\'re doing... tell me how it ends.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{determined}No. Don\'t tell me. I\'ll come and SEE.' },
    { do: 'say', who: 'bramble', text: '{grin}This isn\'t goodbye, all right? It\'s later. See you later.' },
    { do: 'leave_party', who: 'bramble' },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 20 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{shout}SEE YOU LATER, SWORD!' },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 21 } },
    { do: 'leave', who: 'bramble' },
    { do: 'walk', who: 'corran', to: { x: 16, y: 21 } },
    { do: 'leave', who: 'corran' },
    { do: 'wait', seconds: 1.4 },
    { do: 'music', song: 'lasthome' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{sad}...It\'s very quiet, without him.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{smile}Come on. You heard Bryony. Somebody\'s got to look after me.\n\n{laughing}Apparently.' },
  ],
};
