// THE STAR SHARD: the top of the mast in the Wreck Yard (wreck_mast's fighting top, the
// trigger x 16 to 18, rows 2 to 4: you come off the rope onto it). The mast's snapped top
// pokes up through the planks, and a splinter of star-metal is wedged in the split. The
// Fallen Star hums at it; the hero works it free (`give`: the star_shard_wreck words are
// in gear.txt). It is what Orla, out on the Beacon Isles, will need for the Fallen Star
// +3. Nobody walks; the shard's prop goes once this has played (`until`). The hero never
// speaks.
export const WRECK_STAR_SHARD = {
  id: 'wreck_star_shard',
  room: 'wreck_mast',
  once: true,

  actors: [
    { id: 'shard', look: 'prop:c5_star_shard', x: 15, y: 4, plays: 'wreck_shard', animation: 'c5_star_shard', speed: 0.3 },
    { id: 'ves', look: 'prop:vesper_stand', x: 16, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 17, y: 3, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', text: 'The top of the mast comes up through the planks of the lookout, split like a broken pencil. Wedged deep in the split, something is shining. It isn\'t wet. Nothing else up here can say that.' },
    { do: 'say', text: 'At your side, the Fallen Star hums. Not softly, this time.' },
    { do: 'say', who: 'bramble', text: '{awed}...It\'s doing the thing.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Go on, then. It\'s clearly yours.' },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'shimmer' },
    { do: 'leave', who: 'shard' },
    { do: 'give', item: 'star_shard_wreck' },
    { do: 'say', who: 'ves', text: '{bored}Well. One shiny splinter, from the top of a dead ship, in a storm. I\'d hope it was worth it.' },
    { do: 'say', who: 'bramble', text: '{worried}Can we go DOWN now?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Along, I think. That spar goes all the way to the cliff.' },
    { do: 'say', who: 'bramble', text: '{scared}...Along is just down with extra steps.' },
  ],
};
