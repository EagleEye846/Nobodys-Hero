// THE WEIGHT: on the platform in the Weight Room, under the oak gallows over the deepest well in
// the caves. The hero lifts the brass sounding-weight off its hook (`give`: the words are
// got_brass_sounding_weight in gear.txt), the boss key of the Soundings: it hangs on the empty
// hook of the gate's counterweight in soundings_up. The frame's props go as this begins (`until` /
// `after`), so two actors stand in for them (16.5: the middle of the 2-wide frame at prop x 16) and
// swap when the text says the weight is lifted. Nobody walks (Z on the frame plays it, `setOut` on the prop, after Z once has read the tag; the platform has no
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
    // The camera goes down the well along the knotted cord, into the dark. (draft)
    { do: 'camera', to: { x: 16, y: 17 } },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 0.5, seconds: 1.4 },
    { do: 'wait', seconds: 1.8 },
    { do: 'camera', to: { x: 16, y: 15 } },
    { do: 'wait', seconds: 0.4 },
    // You lift the brass weight off its hook: it is heavier than it looks. (Z on the frame plays this, after
    // Z once has read the tag wired to the weight's eye.)
    { do: 'act', who: 'player', act: 'crouch' },
    { do: 'sound', name: 'creak' },
    { do: 'leave', who: 'frame', instant: true },
    { do: 'appear', who: 'frame_empty', instant: true },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'camera' },
    { do: 'give', item: 'brass_sounding_weight' },
    { do: 'face', who: 'bramble', at: 'frame_empty' },
    { do: 'face', who: 'ves', at: 'frame_empty' },
    { do: 'wait', seconds: 0.6 },
    // The tag is what says why: they only know what it says. (draft)
    { do: 'say', who: 'ves', text: '{thoughtful}"For the gate above." ...Which gate?' },
    { do: 'emote', who: 'bramble', emote: '?', wait: false },
    { do: 'say', who: 'bramble', text: '{thinking}The shut one, probably. There\'s always one.' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
