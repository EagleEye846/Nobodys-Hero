// SLIP BELL HEARD (DRAFT): the first time you come into the slip's cove after the mast's scorch (wreck_star_shard), the wind
// takes the old fog bell out on the far east point and it speaks once on its own. The camera looks across the cove at it and comes
// back. It only points: ringing it is still up to you (the lever `fog_bell`, 29,4; the ship comes at ship_looms). Trigger: wreck_slip,
// x 5, rows 2-10, a few steps in from the mast's door (2,4). Ves (3,5) and Bramble (3,3) stand just behind you, clear of the save
// crystal (6,5), the anchor (3,8) and the net frame (7,7). No monsters in the slip. The hero never speaks.
export const SLIP_BELL_HEARD = {
  id: 'slip_bell_heard',
  room: 'wreck_slip',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 3, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'bell' },
    { do: 'camera', to: { x: 27, y: 5 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The wind comes round the cliff, and right out at the far end of the cove something rings: one flat, deep note, and then nothing.\n\nOut on the point, past an old boat lying keel-up, a bell on a post is still swinging. The brass has a cold shine to it. Beyond it there is only fog.' },
    { do: 'camera' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'bramble', text: '{scared}There IS a bell. The sign said there wasn\'t a bell.' },
    { do: 'say', who: 'ves', text: '{bored}The sign also says ring loudly. I wouldn\'t take its word for much.' },
    { do: 'say', who: 'ves', text: '{smile}That scorch on the mast ran off this way, into the fog. I\'m only saying.' },
  ],
};
