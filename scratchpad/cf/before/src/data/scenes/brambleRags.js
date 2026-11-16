// BRAMBLE'S RAGS: the waystation (ash_waystation, the trigger at x 6), once you carry all five red rags he
// took off the little spare cairns along the road (the Tideline, the Buried Road, the Cinder Field, the
// Black Orchard, the Open Flats: all optional). He ties them into a pennant on the bootlace that holds
// Haddock's bell to his belt, and gives you a biscuit for helping. No walks; no monsters in this room. (draft)
export const BRAMBLE_RAGS = {
  id: 'bramble_rags',
  room: 'ash_waystation',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 4, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', text: 'Bramble stops in the lee of the old wall and takes five faded red rags out of his jacket, one at a time, and lays them along his arm.' },
    { do: 'say', who: 'bramble', text: '{thinking}I\'ve been thinking about what to do with these.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}You\'ve been thinking about it for six rooms. I could hear it.' },
    { do: 'say', who: 'bramble', text: '{determined}Haddock\'s bell rings, but nobody can see where it is. So.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: 'He knots them end to end, and the last one to the bootlace that holds the bell to his belt. A long red swallow-tail, faded to the colour of a scab, streams out behind him in what wind there is.' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'bramble', text: '{proud}Now we\'re easy to find. If I get lost. Or you do.' },
    { do: 'say', who: 'ves', text: '{smile}You could be found from the far end of the road.' },
    { do: 'say', who: 'bramble', text: '{grin}That\'s the idea.' },
    { do: 'say', text: 'Ves says nothing for a moment. Then she puts out a fingertip and straightens one of the rags.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{glee}Oh! I nearly forgot. You helped, so. It was at the bottom of the pocket.' },
    { do: 'give', item: 'bell_pennant' },
    { do: 'give', item: 'cairn_biscuit' },
    { do: 'say', who: 'ves', text: '{bored}It has a rag-shaped dent in it.' },
    { do: 'say', who: 'bramble', text: '{grin}That\'s where the flavour is.' },
  ],
};
