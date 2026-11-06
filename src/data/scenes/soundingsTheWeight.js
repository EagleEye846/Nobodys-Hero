// THE WEIGHT: on the platform in the Weight Room, under the oak gallows over the deepest well in
// the caves. The hero lifts the brass sounding-weight off its hook (`give`: the words are
// got_brass_sounding_weight in gear.txt), the boss key of the Soundings: it hangs on the empty
// hook of the gate's counterweight in soundings_up. The frame's props go as this begins (`until` /
// `after`), so two actors stand in for them (16.5: the middle of the 2-wide frame at prop x 16) and
// swap when the text says the weight is lifted. Nobody walks (the trigger is on the platform, which has no
// monsters on it). The hero never speaks.
export const SOUNDINGS_THE_WEIGHT = {
  id: 'soundings_the_weight',
  room: 'soundings_weight_room',
  once: true,

  actors: [
    { id: 'frame', look: 'prop:sd_weight_frame', x: 16.5, y: 15, glow: 40 },
    { id: 'frame_empty', look: 'prop:sd_weight_frame_empty', x: 16.5, y: 15, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 18, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 18, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'The gallows creaks over the well. The cord runs down past the weight into the dark, knotted every fathom, and the knots go on further than the light does.' },
    { do: 'sound', name: 'creak' },
    { do: 'leave', who: 'frame', instant: true },
    { do: 'appear', who: 'frame_empty', instant: true },
    { do: 'say', text: 'You lift the brass weight off its hook. It is heavier than it looks, and it looks heavy.' },
    { do: 'give', item: 'brass_sounding_weight' },
    { do: 'say', who: 'bramble', text: '{worried}How deep does it GO?' },
    { do: 'say', who: 'ves', text: '{bored}Deep enough that they drew a red ring round it on the chart.' },
    { do: 'say', who: 'ves', text: '{thoughtful}And the gate on the way up wants a weight. I\'d bet this is the one.' },
  ],
};
