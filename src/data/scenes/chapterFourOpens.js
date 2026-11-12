// CHAPTER FOUR OPENS: dawn, just past the broken Hero's Gate. The two of you
// walk out into sun, grass and birdsong, Ves hobbling on her crutch. She
// stops and looks at the sky for a long time. "Oh." The Sunnyside song comes in
// after that first word. Then she looks down at the crutch, and across at the
// hedge, and THROWS it: a wind-up (sunny_ves_throw), the crutch spinning in a
// high arc (sunny_crutch_spin), straight into the shrub in the hedge, which
// shakes, and a small brown bird bursts out of it and away (sunny_shrub_shake,
// sunny_bird). She's well from here on (the `hurt` step), and walks off it.
// Then she says why she's going on: the little sun scratched on the Gate
// (end of chapter 3) and her mum's lamps. Nothing else happens. That's the
// whole point of Sunnyside.
// (All the art is in src/data/art/sunnyScenes.js.)
export const CHAPTER_FOUR_OPENS = {
  // Triggers in rooms name the scene by this id.
  id: 'chapter_four_opens',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'sunny_gate_field',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // Ves, who takes the place of the one following you; the crutch (listed
  // before the shrub so it's drawn behind it: it goes *into* the leaves); the
  // shrub, standing in for the one in the hedge; and the bird.
  actors: [
    { id: 'ves', look: 'anim:sunny_ves_throw', x: 14, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'crutch', look: 'anim:sunny_crutch_spin', x: 14, y: 6, hidden: true },
    { id: 'shrub', look: 'prop:sun_shrub', x: 7, y: 2, plays: 'shrub' },
    { id: 'bird', look: 'anim:sunny_bird', x: 7, y: 2, hidden: true },
  ],

  steps: [
    // She comes in on her crutch (even if a chapter-select start made her well:
    // there's a crutch to throw away).
    { do: 'hurt', who: 'vesper', on: true },
    // Dawn, whatever the clock said: the sun's just up, golden and low.
    { do: 'time', of: 0.1 },
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.4 },
    // Out of the Gate into the sun: the hero first, Ves behind, hobbling.
    { do: 'walk', who: 'player', to: { x: 14, y: 6 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 6 } },
    { do: 'face', who: 'player', dir: 'down' },
    // She stops, and looks up at the sky for a long time.
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 2.4 },
    { do: 'say', who: 'ves', text: '{surprised}Oh.' },
    { do: 'music', song: 'sunnyside' },
    { do: 'say', who: 'ves', text: '{smile}Sun. I\'d forgotten it did that.' },
    { do: 'wait', seconds: 0.6 },
    // And then she looks at the crutch.
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 0.7 },
    { do: 'say', text: 'Ves looks down at the crutch under her arm. Then across, at the hedge.' },
    // The wind-up (hold, wind1, wind2: 0.45s), and the throw.
    { do: 'animate', who: 'ves', animation: 'sunny_ves_throw', speed: 0.15, once: true },
    { do: 'wait', seconds: 0.45 },
    { do: 'sound', name: 'whoosh' },
    { do: 'appear', who: 'crutch', at: { x: 14, y: 6 } },
    { do: 'animate', who: 'crutch', animation: 'sunny_crutch_spin', speed: 0.06 },
    // Up in a high arc, end over end, into the shrub in the hedge.
    { do: 'toss', who: 'crutch', to: { x: 7, y: 2 }, height: 50, bounces: 0 },
    { do: 'leave', who: 'crutch' },
    { do: 'sound', name: 'thud' },
    // The shrub shakes, leaves flying; a bird bursts out and is gone.
    { do: 'animate', who: 'shrub', animation: 'sunny_shrub_shake', speed: 0.07 },
    { do: 'act', who: 'player', act: 'startle', wait: false },
    { do: 'appear', who: 'bird', at: { x: 7, y: 2 } },
    { do: 'animate', who: 'bird', animation: 'sunny_bird', speed: 0.07 },
    { do: 'toss', who: 'bird', to: { x: 10, y: 0 }, height: 24, bounces: 0 },
    { do: 'toss', who: 'bird', to: { x: 18, y: -3 }, height: 36, bounces: 0 },
    { do: 'leave', who: 'bird' },
    { do: 'animate', who: 'shrub' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{bored}...Sorry, bird.' },
    // Well, from here on: off the crutch for good.
    { do: 'hurt', who: 'vesper', on: false },
    { do: 'animate', who: 'ves' },
    { do: 'act', who: 'ves', act: 'hop' },
    { do: 'say', who: 'ves', text: '{proud}There. Walking.\n\nDon\'t watch, it\'s not very elegant yet.' },
    { do: 'walk', who: 'ves', to: { x: 11, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 8 } },
    // She turns back up to you, and the Gate behind you.
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    // Why she's going looking (seeded at the Gate, end of chapter 3).
    { do: 'say', who: 'ves', text: '{smile}That little sun on the Gate. Somebody came through here once, and left a mark for whoever came next.' },
    { do: 'say', who: 'ves', text: '{sad}Mum lit lamps for twenty years for a Hero who never turned up.\n\n{determined}I\'d like to know if he turned up anywhere.' },
    { do: 'say', who: 'ves', text: '{smile}So. Somewhere out there is someone who knows.\n\nLet\'s go and be annoying at them.' },
  ],
};
