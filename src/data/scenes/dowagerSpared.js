// DOWAGER SPARED: you won her round with manners. She curtseys, holds out a claw to be
// shaken, and unbolts her own bell, which opens the gate to the boards. (The hero never
// speaks.) Then she goes off up the beach to the water, tub and all. Gives the Bathtub Bell.
export const DOWAGER_SPARED = {
  id: 'dowager_spared',
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
    { do: 'say', text: 'The Dowager lowers her claw. The steam stops. The bell on her bath gives one small, satisfied ting.' },
    { do: 'say', who: 'crab', text: '"Well."\n\n"I see that someone has taught you how to behave. It was not, I think, the shore."' },
    { do: 'say', who: 'bramble', text: '{thinking}...Can we shake her claw?' },
    { do: 'say', text: 'You shake her claw. It is about the size of your whole arm, and she does it properly: up and down, once, and let go.' },
    { do: 'say', who: 'crab', text: '"The bell, I think. For the gate to the boards."\n\n"Hang it on the post. It is not a hard thing. It is only a matter of doing it properly."' },
    { do: 'say', text: 'She works the bell loose from the top of her tub with one claw, polishes it on a pearl, and holds it out. A tag is tied to it, in very neat writing: PLEASE WIPE YOUR FEET.' },
    { do: 'give', item: 'bathtub_bell' },
    { do: 'say', who: 'crab', text: '"Good afternoon."\n\n"I shall be at the bottom of the bay, if anyone should call. Do not call."' },
    { do: 'walk', who: 'crab', to: { x: 25, y: 5 }, pace: 28 },
    { do: 'leave', who: 'crab' },
    { do: 'wait', seconds: 0.8 },
    { do: 'camera' },
    { do: 'music', song: 'wrack' },
  ],
};
