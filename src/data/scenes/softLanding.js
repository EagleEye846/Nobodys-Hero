// SOFT LANDING: the end of the fall. The shaft opens out, a violet glow comes
// up from below (the 'shaft' vision, mood 'rush'), and then: FWUMP. Ves
// snaps her umbrella open, grabs your hand, and the fall turns into a drift.
// The two of you come down side by side through the dark, hand in hand under
// the umbrella (sunny_hand_float), the way she floats you on the wind
// geysers, through a cloud of glowing spores (sunny_spores), and touch down
// on the top of a giant glowing mushroom, which gives a little under you and
// settles (sunny_glowcap). You hop down off it. A spore drifts onto your
// nose. Ves, very pleased with herself, says nothing about whose umbrella
// broke the field. Then the two of them go to the edge of the ledge: the
// camera pans out over the Glimmering and down to the whole buried kingdom,
// and the Glimmering's song swells in.
// (The cap's actor is `flat`, so everyone stands on top of it.)
export const SOFT_LANDING = {
  // Triggers in rooms name the scene by this id.
  id: 'soft_landing',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'glimmer_landing',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // The cap stands in for the room's mushroom (its prop is `cast: 'glowcap'`)
  // and starts out hidden so it can be moved to the middle of the 4 tiles it
  // stands on; the two of you drifting down together (you're hidden till you
  // let go); Ves on her own once you have; the spores.
  actors: [
    { id: 'cap', look: 'anim:sunny_glowcap', x: 14, y: 9, hidden: true, flat: true, plays: 'glowcap' },
    { id: 'pair', look: 'anim:sunny_hand_float', x: 14, y: 0, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 15, y: 8, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'spores', look: 'anim:sunny_spores', x: 13, y: 4, hidden: true },
  ],

  steps: [
    { do: 'music', song: null },
    // Put the cap where it stands, under the vision where nobody sees; you're
    // up in the air with Ves, not on the ground yet.
    { do: 'appear', who: 'cap', at: { x: 14, y: 9 } },
    { do: 'animate', who: 'cap', animation: 'sunny_glowcap', speed: 999 },
    { do: 'leave', who: 'player', instant: true },
    { do: 'camera', to: { x: 14, y: 6 } },
    { do: 'vision', name: 'shaft', mood: 'rush' },
    { do: 'wait', seconds: 1.7 },
    // FWUMP: the umbrella, open.
    { do: 'sound', name: 'whoosh' },
    { do: 'vision' },
    { do: 'appear', who: 'pair', at: { x: 14, y: 0 }, instant: true },
    { do: 'animate', who: 'pair', animation: 'sunny_hand_float', speed: 0.3 },
    // Down, slowly, through the spores.
    { do: 'appear', who: 'spores', at: { x: 13, y: 4 } },
    { do: 'animate', who: 'spores', animation: 'sunny_spores', speed: 0.55, once: true },
    { do: 'toss', who: 'pair', to: { x: 14, y: 7 }, height: 4, airtime: 3.4, bounces: 0 },
    // SPLOMF. You touch down and the cap takes you flat (you sink into it),
    // holds a beat, then springs you back up (sunny_glowcap_splomf), and
    // squashes and springs twice more, smaller, while a puff of spores bursts
    // out of the top and drifts slowly down.
    { do: 'sound', name: 'thud' },
    { do: 'animate', who: 'cap', animation: 'sunny_glowcap_splomf', speed: 0.11, once: true },
    { do: 'quake', amount: 2, seconds: 0.25 },
    { do: 'appear', who: 'spores', at: { x: 14, y: 8 }, instant: true },
    { do: 'animate', who: 'spores', animation: 'sunny_spores', speed: 0.3, once: true },
    { do: 'toss', who: 'pair', to: { x: 14, y: 7.75 }, height: 0, airtime: 0.22, bounces: 0 },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'pair', to: { x: 14, y: 7 }, height: 30, airtime: 0.42, bounces: 2 },
    { do: 'wait', seconds: 0.4 },
    // You let go, and hop down off it, one each side.
    { do: 'leave', who: 'pair', instant: true },
    { do: 'appear', who: 'player', at: { x: 13, y: 7 }, instant: true },
    { do: 'appear', who: 'ves', at: { x: 15, y: 7 }, instant: true },
    { do: 'toss', who: 'player', to: { x: 12, y: 11 }, height: 12, bounces: 0, wait: false },
    { do: 'toss', who: 'ves', to: { x: 15, y: 11 }, height: 12, bounces: 0 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'left' },
    // Down to the two of you, so the box doesn't cover the spore on your nose.
    { do: 'camera', to: { x: 14, y: 9.5 } },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Silence. One glowing spore drifts slowly down, and settles on your nose.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{proud}See? Umbrella.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{bored}...Don\'t say anything about the field.' },
    { do: 'say', text: 'Ves has glowing spores all through her hair, and sparkles faintly. She does not mention it.' },
    // To the edge of the ledge.
    { do: 'walk', who: 'ves', to: { x: 15, y: 14 } },
    { do: 'walk', who: 'player', to: { x: 12, y: 14 } },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'player', dir: 'down' },
    // The view: down, and out, over the Glimmering and the buried kingdom.
    { do: 'music', song: 'glimmer' },
    { do: 'camera', to: { x: 14, y: 25 } },
    { do: 'wait', seconds: 3 },
    { do: 'say', who: 'ves', text: '{surprised}Oh.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{surprised}Somebody lives down there.\n\n{glee}Lots of somebodies.' },
    { do: 'say', who: 'ves', text: '{determined}Well. We\'re not getting back up the way we came.\n\nLet\'s go and say hello. Politely. With swords.' },
    // Back to you, and the mushroom back as the room's own.
    { do: 'animate', who: 'cap' },
    { do: 'appear', who: 'cap', at: { x: 12, y: 9 } },
    { do: 'camera' },
  ],
};
