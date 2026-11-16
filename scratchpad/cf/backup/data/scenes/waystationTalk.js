// WAYSTATION TALK: in the lee of the old waystation's wall (ash_waystation, the trigger at x 14),
// Bramble asks about the last word in Haddock's ledger. No walks; no monsters in this room. (draft)
export const WAYSTATION_TALK = {
  id: 'waystation_talk',
  room: 'ash_waystation',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'say', text: 'The wind drops in the lee of the old wall. For a moment it is almost warm.' },
    { do: 'say', who: 'bramble', text: '{thinking}Ves. Haddock wrote "found" at the end of his book. What was found?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{thoughtful}...Corrie, maybe. Or Haddock was. Or it\'s the word you write when there isn\'t a better one.' },
    { do: 'say', who: 'bramble', text: '{worried}That\'s not an answer.' },
    { do: 'say', who: 'ves', text: '{bored}No. It\'s a lightman\'s answer. Get used to them.' },
    { do: 'say', who: 'bramble', text: '{determined}When we get where we\'re going, I\'m writing "found" in something.' },
    { do: 'say', who: 'ves', text: '{smile}You\'ll have to learn to spell it first.' },
    { do: 'say', who: 'bramble', text: '{grin}F. O. U. N... D.' },
    { do: 'say', who: 'ves', text: '{bored}...Fine. Well done.' },
  ],
};
