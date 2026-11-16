// THE KILN DREAM: asleep on Nan Cinder's cot, you dream of the fall: an
// umbrella opening far below you like a flower, and a voice you know saying
// your name, which you've never heard said out loud. Then just the kiln
// ticking, and Bramble talking in his sleep beside you.
export const KILN_DREAM = {
  // Beds name their dream by this id.
  id: 'kiln_dream',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_kiln',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [],

  steps: [
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'You dream of falling.\n\nFar below, something plum-coloured opens like a flower, and the wind takes it sideways, away from you.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Someone is drawing arrows in the dark, one after another, quick and neat.\n\nEvery one of them points at you.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: '...The kiln ticks as it cools. Beside you, somebody small is talking in his sleep.' },
    { do: 'say', text: '"...did mind the camp, Ma... mostly... sorry..."' },
    { do: 'wait', seconds: 1 },
  ],
};
