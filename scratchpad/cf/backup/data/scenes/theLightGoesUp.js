// THE LIGHT GOES UP: the beam strikes the root. The base of the vein wakes
// first, and then the light climbs it from the bottom, one great crystal
// after another, up and up out of sight, with the camera going up with it.
// A long rumble comes down through the rock from far above. Then, so faint it
// might be imagined, a cheer. Ves asks if it worked. It did. Then the new
// light shows how the Hero did it alone, a hundred years ago: a sword wedged
// in a crack to hold the beam, and a small pair of feet pushing the stone.
//
// The lit veins are scene actors laid over the room's dark ones (not `flat`:
// that would put them under the dark ones, on the floor; the room's
// own lit copies take over, for good, when the scene ends). An actor stands
// on its feet and the vein art is 40 high, hence y + 1.5 to sit exactly on a
// prop at tile y. The way up opens
// with the gate in deep_root, which waits on the same eye.
const VEIN_ROWS = [15, 13, 11, 9, 7, 5, 3, 1];

export const THE_LIGHT_GOES_UP = {
  // Triggers in rooms name the scene by this id.
  id: 'the_light_goes_up',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_root',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 24, y: 19, portrait: 'vesper', plays: 'vesper', glow: 24 },
    ...VEIN_ROWS.map((y) => ({ id: `vein${y}`, look: 'prop:root_vein_lit', x: 16.5, y: y + 1.5, hidden: true, glow: 90, animation: 'root_vein_lit', speed: 0.3 })),
  ],

  steps: [
    { do: 'wait', seconds: 0.5 },
    { do: 'camera', to: { x: 16, y: 16 } },
    { do: 'sound', name: 'flare' },
    { do: 'wait', seconds: 1 },
    // Up the vein, a crystal at a time.
    ...VEIN_ROWS.flatMap((y) => [
      { do: 'appear', who: `vein${y}` },
      { do: 'sound', name: 'bell' },
      { do: 'camera', to: { x: 16, y: Math.max(4, y - 3) } },
      { do: 'wait', seconds: 0.2 },
    ]),
    { do: 'stage', flare: { at: { x: 16, y: 2 }, seconds: 2.4 } },
    { do: 'sound', name: 'boom' },
    // The whole rock wakes: rumbling, shedding grit (AMBIENCES in src/audio/music.js).
    { do: 'ambience', name: 'root_waking' },
    // The beam pulses down the whole root from the roof, and grit shakes
    // loose from the rock as the light goes on up through it.
    { do: 'stage', shafts: [{ at: { x: 16.5, y: 14 }, w: 1.4, color: '255, 240, 170' }], rubble: 3.5, rubbleAmount: 0.25 },
    { do: 'wait', seconds: 1.8 },
    { do: 'say', text: 'The light goes on up out of sight, and keeps going.' },
    { do: 'quake', amount: 2, seconds: 3.5 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 2.5 },
    { do: 'stage', shafts: [], rubble: 0 },
    { do: 'say', text: 'A long rumble comes down through the rock from very far above, as if something enormous had turned over in its sleep and opened one eye.' },
    { do: 'wait', seconds: 1.4 },
    // It settles back to the Deep's own quiet, for the cheer.
    { do: 'ambience' },
    { do: 'sound', name: 'farCheer' },
    { do: 'say', text: 'And then, from a very long way up, so faint you could swear you imagined it: a cheer.' },
    { do: 'wait', seconds: 1 },
    // Back down to the two of you, wherever you're standing (a walk could
    // take her across the drop), with the words up top so they don't cover you.
    { do: 'camera' },
    { do: 'textbox', top: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{surprised}...Did that work?' },
    { do: 'wait', seconds: 0.8 },
    // She whoops and jumps, umbrella up like a sail (ves_jump), and you
    // jump with her; then she twirls it over her head for the mural line.
    { do: 'animate', who: 'ves', animation: 'ves_jump', speed: 0.1, once: true },
    { do: 'act', who: 'player', act: 'hop', wait: false },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{glee}That worked.' },
    { do: 'animate', who: 'ves', animation: 'ves_twirl', speed: 0.11 },
    { do: 'act', who: 'player', act: 'hop' },
    { do: 'say', who: 'ves', text: '{proud}Put it in a mural. Make me nine feet tall.' },
    { do: 'animate', who: 'ves' },
    { do: 'wait', seconds: 1 },
    // What the Hero's "I KNOW HOW" was (the_heros_camp): the root shows it now.
    { do: 'say', text: 'In the new light, the ledge by the last prism shows something the dark had been hiding.\n\nA narrow crack in the rock, worn smooth and wide at the top, about the width of a sword blade.' },
    { do: 'say', text: 'Below it, the rock is scraped pale, low down, where somebody small braced his feet and pushed the stone round on his own.\n\nScratched beside the crack, a number and a word: 112. LIT.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}He stuck the sword in the crack to hold the beam, and turned the stone himself.' },
    { do: 'say', who: 'ves', text: '{bored}It took two of us.\n\n{smile}...Show-off.' },
    { do: 'wait', seconds: 0.6 },
  ],
};
