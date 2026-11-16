// ASH ROAD OPENS: the start of Chapter 6 (ash_seabed). The three of them come down the old
// boat-slip, the one with the prow carved in its head, onto the sand the sea left when it went out
// at the end of Chapter 5. The surf is a murmur far behind; to the north-east, the smoke. Bramble
// has Haddock's bell on his belt and won't ring it yet. (The hero never speaks.) No walks: the
// party stands where it is. No monsters in this room. (draft)
export const ASH_ROAD_OPENS = {
  id: 'ash_road_opens',
  room: 'ash_seabed',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 4, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The old slip runs down off the shore onto bare sand, and the sand goes on where the sea used to be: ribbed in long ripples, weed lying flat, out and out to a thin bright line at the edge of the world.' },
    { do: 'say', text: 'Far behind you, the surf. It sounds like somebody talking in another room.' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', who: 'bramble', text: '{surprised}It\'s just... gone. The whole sea.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}It\'ll be back. It always comes back. That\'s the whole thing about it.' },
    { do: 'say', who: 'bramble', text: '{worried}Not all at once, though. Right?' },
    { do: 'say', who: 'ves', text: '{smile}Then we walk quickly.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'bell' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', text: 'Something clinks. Bramble has Haddock\'s bell tied to his belt with a bootlace. He puts his hand over it to stop it ringing.' },
    { do: 'say', who: 'ves', text: '{thoughtful}You can ring it, you know.' },
    { do: 'say', who: 'bramble', text: '{determined}Not yet. I\'m saving it for something good.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'To the north-east, low over the land, lies the long smudge of smoke. Nearer, where the sand ends, the ground is grey.' },
    { do: 'say', who: 'ves', text: '{bored}Right. The smoke, then. Everyone keep up.' },
  ],
};
