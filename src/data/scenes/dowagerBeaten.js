// DOWAGER BEATEN: she has sunk into the tub, the bell tipped over, quite put out. Then she
// hauls herself up, unbolts her own bell with one claw, and gives it to you with great
// dignity, because a bell that opens the gate is hers to give. (The hero never speaks.)
// Then she goes off up the beach to the water, tub and all. Gives the Bathtub Bell.
export const DOWAGER_BEATEN = {
  id: 'dowager_beaten',
  room: 'wrack_bathtub',
  once: true,

  actors: [
    { id: 'crab', look: 'enemy:dowager_crab', x: 25, y: 10, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 7, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 17, y: 9 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The Dowager sits down in her bath with a sound like a very large teapot being put on a shelf.\n\nThe bell on top tips over and rings once, quite softly, as if it were embarrassed.' },
    { do: 'say', who: 'crab', text: '"Well."\n\n"I have not been spoken to like that since the Admiral."' },
    { do: 'say', who: 'ves', text: '{bored}Nobody spoke.' },
    { do: 'say', who: 'crab', text: '"That is what I found so rude."' },
    { do: 'say', text: 'She works the bell loose from the top of her tub with one claw, polishes it on a pearl, and holds it out. A tag is tied to it, in very neat writing: PLEASE WIPE YOUR FEET.' },
    { do: 'give', item: 'bathtub_bell' },
    { do: 'say', who: 'crab', text: '"It opens the gate to the boards. You will need to hang it on the post."\n\n"I shall be at the bottom of the bay. I intend to be extremely cross there for some time."' },
    { do: 'walk', who: 'crab', to: { x: 25, y: 5 }, pace: 28 },
    { do: 'leave', who: 'crab' },
    { do: 'wait', seconds: 0.8 },
    { do: 'camera' },
    { do: 'music', song: 'wrack' },
  ],
};
