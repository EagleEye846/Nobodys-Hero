// THE END OF CHAPTER 5 ("The Tide Held"): everything after the Corrie fight, in six scenes that
// hand on to each other with a `goto` onto a one-tile trigger (`after` the scene before), as the
// end of chapter 4 did:
//
//   corrie_falls          the lamp room (lastlight_lamp), the `defeated` of corrie_appears's battle step.
//                         The fight has torn the room open (the room's `wreck`, src/overworld/lampWreck.js:
//                         no wall, no roof, the storm sky, the lamp lit); rain pours in. Corrie slumped, a tired small boy. His two
//                         lines; Ves's one; Bramble's offer, and at Haddock's name the storm takes him one
//                         last time: his eyes go green, the coat whips up, he rises, he lifts the staff,
//                         and the sea outside stands up past the broken walls and comes in over the top.
//                         It takes the hero and Ves out through the glass; Bramble is thrown clear. It
//                         marks `my_turn` seen (`sees`), which wakes Bramble's CHILL branch (skills.js).
//   beach_bramble_dives   the shore under the tower (lastlight_shore), the sea filling the view. Bramble
//                         washed up, coughing; out on the water the hero and Ves going under. He can't
//                         make himself go in. The bubbles get fewer. "My turn." He dives (the 'undertow'
//                         vision, tideVisions.js: under the water, the grab, the climb), hauls them up the
//                         sand. Corrie's oilskin washes in, empty, and in it the Stormglass Blade. Then
//                         the tower groans and pours water out of its foot, the Bother rides empty at her
//                         line, and they go back in, for Haddock.
//   the_crank             the sluice room (lastlight_sluice, in from the stair): the tower is flooding from
//                         below and the crank won't stay up on its own. Haddock is there, holding it. He
//                         sends them off. The hero hangs Haddock's bell on the crank by him. Out the way
//                         they came, by the stair door.
//   the_light_answers     the stair (lastlight_stair, the top landing): above them the sluice gives, the sea
//                         comes down the stair after them, and they run (to the storm's song). It marks `haddock_gone` seen
//                         (`sees`): the world after him (his shed opens; he is gone from his rooms and the
//                         Bother's rides are Ves's, rowing). Nobody says so.
//   the_bell              the foot of the tower (reach_foot), out of the door with the water. Quiet. Out on
//                         the sea, his hat comes up, and floats there by itself (Bramble's one line: he
//                         thinks it's been dropped); his bell comes up beside it. Nothing else does. Bramble wades in for the bell and keeps it. In the Bother,
//                         his ledger: today's date, and one word. The hero on his knees; and then the light
//                         in him answers (the player holds Z: `press`, quiet), the sea pulls back from the
//                         tower further than anyone has seen (the 'ebb' vision), and he learns NOVA.
//   the_tide_held         the balcony (lastlight_balcony) at dawn: the sea pulled back farther than anyone
//                         has seen, the carved slip, the smoke to the north-east (nobody explains it); Ves's
//                         one line; far off across the sand, one lantern quietly lights (nobody sees who,
//                         nobody remarks on it). Then the credits ("Found"), the card, and on in Saltcombe,
//                         in the harbour office, where the back door now stands open.
//
// The hero never speaks. Haddock is a lightman, never anything else. New staging and lines
// 2026-11-15 (draft).

// --- 1. Corrie falls (lastlight_lamp) ---------------------------------------------------------------
// After the fight you stand where corrie_appears left you (10,9). The lamp prop `ll_dead_lamp` is 4
// wide at x 9-12, its foot on row 8; Corrie is slumped against its foot (10.5, 8.15), and the three
// come up round it to him (row 8, either side), so the words sit at the bottom. The glass
// ran along the top (rows 0-1, x 1-21: GLASS below): it and the roof are gone by now, the room open
// to the sky as in the fight's last backdrop (the room's `wreck`), and the lamp burning. No monsters here.
const GLASS = { x: 1, y: 0, w: 20, h: 2 };
export const CORRIE_FALLS = {
  id: 'corrie_falls',
  room: 'lastlight_lamp',
  once: true,
  // Bramble's CHILL waits for this (skills.js reads it from the seen scenes).
  sees: ['my_turn'],

  actors: [
    // A tired small boy, hood down, knees up, head bowed, the staff leaning on him (coastFolk.js).
    // (Against the lamp's foot. Everybody in this scene keeps to row 8: high enough up the room
    // that the words can go at the bottom, and the torn-open top of it stays in view while they talk.)
    { id: 'corrie', look: 'anim:cf_corrie_tired', x: 10.5, y: 8.15, portrait: 'corrie', animation: 'cf_corrie_tired', speed: 0.5 },
    // The storm in him: hood blown back, eyes green, the staff up and blazing, rising (coastFolk.js).
    // (He swells to twice the boy's size as it fills him, like the fight's possession: `grow`.)
    { id: 'storm', look: 'anim:cf_corrie_possessed', x: 10.5, y: 8.15, portrait: 'corrie', hidden: true, animation: 'cf_corrie_possessed', speed: 0.12, scale: 2, grow: 2.2 },
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 12, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // Quietly, under it all: his lullaby, the tune Haddock hums.
    { do: 'music', song: 'corrieLullaby' },
    // (Words at the bottom: the open sky is the top of the picture.)
    { do: 'textbox', top: false },
    // The top of the tower is open to the storm now (the room's `wreck`, src/overworld/lampWreck.js:
    // the sky, the sea over the broken wall, the rain straight in). A little more rain with it.
    { do: 'stage', rain: 0.35, seconds: 2 },
    // The great lamp, lit by the fight, still turning: its beam going round the open room.
    { do: 'stage', fx: { lamp: { at: { x: 10.5, y: 6 }, power: 0.8 } } },
    // A look at what's left of the place before anybody moves.
    { do: 'wait', seconds: 1.6 },
    // Up round the lamp to him: Ves and the hero on its left, Bramble on its right.
    { do: 'walk', who: 'ves', to: { x: 7.1, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 13.6, y: 8.1 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 8.2, y: 8.15 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'left' },
    // The storm outside goes quiet, not all at once: like a breath let out. The boy in front of the lamp,
    // hood down, knees up, head bowed, very small. (draft)
    { do: 'stage', dim: 0.3, seconds: 1.6 },
    { do: 'stage', spots: [{ onto: 'corrie', color: '130, 176, 190', radius: 26, from: { x: 10.5, y: 0 } }] },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera', who: 'corrie' },
    { do: 'wait', seconds: 1.8 },
    { do: 'say', who: 'corrie', text: '{small}...I was going to stop it. Like the Hero would\'ve.' },
    { do: 'say', who: 'corrie', text: '{small}The light went out. I couldn\'t see the way home.' },
    { do: 'wait', seconds: 1.4 },
    // (draft, 15 Nov 2026: was "He kept it lit after. Every night.", which Ves couldn't know. Now only what
    // she's seen: Haddock waiting at the foot of the tower with the Bother.)
    { do: 'say', who: 'ves', text: "{sad}...He's still waiting for you. Haddock. Down at the bottom, with the boat." },
    { do: 'wait', seconds: 0.8 },
    // Bramble goes to him, slowly, the way you'd go to something hurt.
    { do: 'walk', who: 'bramble', to: { x: 13.05, y: 8.15 }, pace: 10 },
    { do: 'face', who: 'bramble', at: 'corrie' },
    { do: 'say', who: 'bramble', text: '{worried}...We could take you. Down to him.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'corrie', text: '{small}...Haddock?' },
    { do: 'wait', seconds: 1.2 },

    // At the name, the storm takes him. One last time. (draft)
    { do: 'music', song: null },
    { do: 'sound', name: 'thunderclap' },
    { do: 'stage', bolt: true },
    { do: 'quake', amount: 1.2, seconds: 0.6 },
    { do: 'act', who: 'corrie', act: 'shiver' },
    { do: 'stage', sky: 0.45, seconds: 1.2 },
    { do: 'stage', spots: [{ onto: 'corrie', color: '120, 240, 170', radius: 30, from: { x: 10.5, y: 0 } }] },
    { do: 'stage', flicker: 0.8 },
    { do: 'sound', name: 'zap' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'corrie', text: '{crying}No. No, I want to go h-', shake: true },
    // Up off the floor: the hood blown back, the hair lifting, his eyes storm-green, the staff up.
    { do: 'leave', who: 'corrie', instant: true },
    // (Forward of the lamp, over the dark boards, in the flash: so he stands out against the dark.)
    { do: 'appear', who: 'storm', instant: true, at: { x: 10.5, y: 10.3 } },
    // The storm's own song comes up under him, from where it gathers: its drop lands with the sea.
    { do: 'music', song: 'corrieBattle', section: 'C' },
    // The storm drinks the lamp down to an ember, so he is the brightest thing in the room: green,
    // in the light of his own storm (the aura).
    { do: 'stage', fx: { lamp: { at: { x: 10.5, y: 6 }, power: 0.2 } } },
    { do: 'stage', spots: [] },
    { do: 'stage', fx: { aura: { who: 'storm', power: 1, seconds: 1.2, lift: 14 } } },
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 2, seconds: 2.2 },
    { do: 'camera', who: 'storm' },
    // (Slowly up off the boards, and he goes on rising till the sea comes.)
    { do: 'toss', who: 'storm', to: { x: 10.5, y: 10.3 }, height: 24, airtime: 26, bounces: 0, keep: true, wait: false },
    // They fall back from him, either side.
    { do: 'walk', who: 'ves', to: { x: 5.8, y: 8 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 7, y: 8.15 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 14.6, y: 8.1 }, fast: true },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{scared}Corrie. CORRIE.' },
    { do: 'say', who: 'bramble', text: '{scared}His EYES-' },
    // The staff goes up over his head, and its light goes the green of the sky.
    { do: 'act', who: 'storm', act: 'hop' },
    { do: 'stage', bolt: true },
    { do: 'sound', name: 'flare' },
    { do: 'quake', amount: 2.5, seconds: 1 },
    { do: 'stage', fx: { aura: { who: 'storm', power: 1.4, seconds: 0.6, lift: 16 } } },
    { do: 'say', who: 'ves', text: '{scared}Get DOWN-', shake: true },
    // And outside, past the broken walls, the sea stands up: up the empty frames, over the sill, higher
    // than the top of the tower, the crest torn white.
    { do: 'stage', fx: { surge: { glass: GLASS, level: 1, seconds: 2 } } },
    { do: 'sound', name: 'tideRush' },
    { do: 'stage', rain: 1.5, seconds: 2 },
    { do: 'quake', amount: 1.6, seconds: 4 },
    { do: 'wait', seconds: 2 },
    // And it comes on over the top of the tower, hanging over the room, its shadow on all of them.
    { do: 'stage', fx: { surge: { over: 70, seconds: 2.2 } } },
    { do: 'stage', dim: 0.45, seconds: 2 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 2.2 },

    // It comes in over the top: the last teeth of the glass, the iron, and then the whole white weight of it.
    { do: 'stage', fx: { burst: { glass: GLASS }, pour: { at: { x: 1, y: 2 }, w: 18, drop: 70, power: 1 } } },
    { do: 'stage', dim: 0 },
    { do: 'stage', fx: { pour: { at: { x: 20, y: 2 }, w: 18, drop: 70, power: 1 } } },
    { do: 'sound', name: 'shatter' },
    { do: 'sound', name: 'boom' },
    { do: 'sound', name: 'tideRush' },
    { do: 'quake', amount: 5, seconds: 1.8 },
    { do: 'stage', fx: { surge: { level: 0, over: 0, seconds: 0.4 }, aura: null, lamp: null } },
    { do: 'leave', who: 'storm', seconds: 0.6 },
    // As it drains back out it takes the hero and Ves with it, out through the frames; Bramble, small, is
    // flung the other way, against the wall.
    { do: 'wait', seconds: 0.5 },
    { do: 'toss', who: 'player', to: { x: 9, y: 1 }, height: 30, airtime: 0.9, bounces: 0, wait: false },
    { do: 'toss', who: 'ves', to: { x: 5, y: 1 }, height: 26, airtime: 0.9, bounces: 0, wait: false },
    { do: 'toss', who: 'bramble', to: { x: 20, y: 12 }, height: 12, airtime: 0.55, bounces: 1, wait: false },
    { do: 'wait', seconds: 0.5 },
    { do: 'leave', who: 'ves', seconds: 0.4 },
    { do: 'stage', white: 1, seconds: 0.7 },
    { do: 'wait', seconds: 0.5 },
    { do: 'leave', who: 'player', instant: true },
    { do: 'wait', seconds: 1 },
    { do: 'stage', rain: 0 },
    { do: 'stage', sky: 0 },
    { do: 'stage', dim: 0 },
    { do: 'stage', fx: { clear: true } },
    { do: 'goto', room: 'lastlight_shore', spawn: { x: 9, y: 12 } },
  ],
};

// --- 2. Bramble dives (lastlight_shore) -------------------------------------------------------------
// Washed up on the shore under the tower. The sea fills the view down to the surf on row 10; the sand is
// rows 11-14. Bramble lies at (6,12); the hero is out at (7,6), Ves at (12,7), her umbrella off at (14,6).
// He goes in at (8,10). The words stay at the top (they cover rows 0-4; everything happens below them).
// The player stays hidden till the hero is up the sand. `echo`: what Haddock said in the lagoon
// (swimmingLesson.js), remembered: his face and voice, grey words, nobody there.
export const BEACH_BRAMBLE_DIVES = {
  id: 'beach_bramble_dives',
  room: 'lastlight_shore',
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 12, portrait: 'bramble', plays: 'bramble', ahead: true, animation: 'tr_bramble_lie', speed: 0.7 },
    { id: 'ves', look: 'prop:vesper_stand', x: 9, y: 11.6, portrait: 'vesper', plays: 'vesper', ahead: true, hidden: true },
    { id: 'hero_sea', look: 'anim:tr_hero_struggle', x: 7, y: 6, animation: 'tr_hero_struggle', speed: 0.16 },
    { id: 'ves_sea', look: 'anim:tr_ves_struggle', x: 12, y: 7, animation: 'tr_ves_struggle', speed: 0.14 },
    { id: 'umbrella', look: 'anim:tr_umbrella_float', x: 14, y: 6, animation: 'tr_umbrella_float', speed: 0.35 },
    { id: 'hatchet', look: 'anim:tr_hatchet', x: 7, y: 12.6, hidden: true, animation: 'tr_hatchet', speed: 1.4, flat: true },
    { id: 'swimmer', look: 'anim:sc_bramble_swim', x: 8, y: 8, hidden: true, animation: 'sc_bramble_swim', speed: 0.16 },
    { id: 'hero_lie', look: 'anim:finale_hero_dive', x: 7, y: 10, hidden: true },
    { id: 'ves_lie', look: 'anim:finale_ves_dive', x: 9, y: 10, hidden: true },
    { id: 'oilskin', look: 'anim:tf_oilskin', x: 12, y: 10, hidden: true, flat: true, animation: 'tf_oilskin', speed: 0.7 },
    { id: 'echo', look: 'anim:tr_hatchet', x: 0, y: 0, hidden: true, portrait: 'haddock' },
  ],

  steps: [
    // The Long Climb, low, under the storm going over.
    { do: 'music', song: 'lastlight' },
    { do: 'textbox', top: true },
    { do: 'leave', who: 'player', instant: true },
    { do: 'stage', white: 1 },
    // Out on the water: the two of them, heads and arms, going up and down in the swell.
    { do: 'sink', who: 'hero_sea', depth: 0, line: 9, fade: 30 },
    { do: 'sink', who: 'ves_sea', depth: 0, line: 9, fade: 30 },
    { do: 'stage', fx: { rings: { id: 'hero', at: { x: 7, y: 6 }, every: 0.6, size: 12 } } },
    { do: 'stage', fx: { rings: { id: 'ves', at: { x: 12, y: 7 }, every: 0.7, size: 12 } } },
    { do: 'stage', white: 0, seconds: 3 },
    { do: 'wait', seconds: 2.6 },
    // He comes to: coughing up the sea, up on his hands and knees.
    { do: 'sound', name: 'cough' },
    { do: 'wait', seconds: 1.1 },
    { do: 'sound', name: 'cough' },
    { do: 'animate', who: 'bramble', animation: 'bramble_crawl_up', speed: 9 },
    { do: 'act', who: 'bramble', act: 'shake' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'cough' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 1 },
    { do: 'animate', who: 'bramble' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{scared}...Ves?' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', who: 'bramble', text: '{scared}VES!', shake: true },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 11 }, fast: true },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{scared}SWORD! Swim! You have to SWIM!' },
    // They're going under.
    { do: 'sink', who: 'hero_sea', depth: 4, seconds: 3 },
    { do: 'sink', who: 'ves_sea', depth: 3, seconds: 3 },
    { do: 'stage', fx: { bubbles: { id: 'hero', at: { x: 7, y: 6 }, rate: 3 } } },
    { do: 'wait', seconds: 2 },
    { do: 'animate', who: 'hero_sea', animation: 'tr_hero_sink', speed: 0.9 },
    { do: 'sink', who: 'hero_sea', depth: 12, seconds: 6 },
    // One step. The sea comes up over his boot, and he jumps back from it like it bit him.
    { do: 'walk', who: 'bramble', to: { x: 8, y: 10.3 }, pace: 9 },
    { do: 'sound', name: 'paddle' },
    { do: 'stage', fx: { rings: { id: 'boot', at: { x: 8, y: 9.9 }, every: 0.5, size: 8 } } },
    { do: 'wait', seconds: 0.4 },
    { do: 'toss', who: 'bramble', to: { x: 8, y: 12 }, height: 6, airtime: 0.3, bounces: 1 },
    { do: 'stage', fx: { rings: { id: 'boot', every: 0 } } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'act', who: 'bramble', act: 'shiver' },
    // The music goes. His heart, loud, and the world closing in round him.
    { do: 'music', song: null },
    { do: 'stage', fx: { heartbeat: { bpm: 96 }, vignette: { on: 'bramble', amount: 0.5, seconds: 3 } } },
    { do: 'say', who: 'bramble', text: "{scared}I can't. I can't, I can't, it's too BIG." },
    { do: 'animate', who: 'ves_sea', animation: 'tr_ves_sink', speed: 0.8 },
    { do: 'sink', who: 'ves_sea', depth: 13, seconds: 6 },
    { do: 'stage', fx: { bubbles: { id: 'ves', at: { x: 12, y: 7 }, rate: 3 } } },
    { do: 'wait', seconds: 2.2 },
    // He looks down at his hands. They won't stop shaking.
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'echo', text: "{smile}{c:grey}Nobody's ever sunk with me holdin' the braces.{/c}" },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'bramble', text: "{crying}...You're not here." },
    // The bubbles getting fewer.
    { do: 'sink', who: 'hero_sea', depth: 30, seconds: 5 },
    { do: 'leave', who: 'hero_sea', seconds: 4 },
    { do: 'stage', fx: { bubbles: { id: 'hero', at: { x: 7, y: 6 }, rate: 1 }, rings: { id: 'hero', every: 0 } } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'walk', who: 'umbrella', to: { x: 17, y: 5 }, pace: 4, keep: true, wait: false },
    { do: 'wait', seconds: 2.4 },
    { do: 'sink', who: 'ves_sea', depth: 30, seconds: 5 },
    { do: 'leave', who: 'ves_sea', seconds: 4 },
    { do: 'stage', fx: { bubbles: { id: 'ves', at: { x: 12, y: 7 }, rate: 1.2 }, rings: { id: 'ves', every: 0 } } },
    { do: 'wait', seconds: 2.4 },
    { do: 'stage', fx: { bubbles: { id: 'hero', at: { x: 7, y: 6 }, rate: 0.4 }, heartbeat: { bpm: 84 } } },
    { do: 'wait', seconds: 2.4 },
    { do: 'stage', fx: { bubbles: { id: 'hero', rate: 0 } } },
    { do: 'stage', fx: { bubbles: { id: 'ves', at: { x: 12, y: 7 }, rate: 0.35 } } },
    { do: 'wait', seconds: 2.2 },
    // And then not even his heart: only the sea.
    { do: 'stage', fx: { heartbeat: null } },
    { do: 'wait', seconds: 1.8 },
    { do: 'say', who: 'bramble', text: '{determined}My turn.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'stage', fx: { vignette: { on: 'bramble', amount: 0, seconds: 0.6 } } },
    // He lets the hatchet drop, and runs at it, and goes in head first.
    { do: 'appear', who: 'hatchet', at: { x: 7, y: 12.6 }, instant: true },
    { do: 'sound', name: 'thud' },
    // (Down, like a runner; then up the sand at it, his boots throwing up the surf.)
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'wait', seconds: 0.5 },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 10.6 }, fast: true },
    { do: 'stage', fx: { splash: { at: { x: 8, y: 10.2 }, power: 0.35 } } },
    { do: 'sound', name: 'paddle' },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 10 }, fast: true },
    { do: 'stage', fx: { splash: { at: { x: 8, y: 9.7 }, power: 0.45 } } },
    { do: 'animate', who: 'bramble', animation: 'tr_bramble_dive', speed: 0.1, once: true },
    { do: 'wait', seconds: 0.2 },
    // Up and out over it, a long way for somebody that small; the lightning has him for a moment, arms out,
    // against the whole sea. Then it has closed over him.
    { do: 'toss', who: 'bramble', to: { x: 8, y: 8 }, height: 30, airtime: 0.95, bounces: 0, keep: true, wait: false },
    { do: 'wait', seconds: 0.42 },
    { do: 'stage', bolt: true },
    { do: 'sound', name: 'thunderclap' },
    { do: 'wait', seconds: 0.53 },
    { do: 'leave', who: 'bramble', instant: true },
    { do: 'stage', fx: { splash: { at: { x: 8, y: 7.6 }, power: 2 }, rings: { id: 'dive', at: { x: 8, y: 7.6 }, every: 0.4, size: 20 } } },
    { do: 'sound', name: 'plunge' },
    { do: 'quake', amount: 1.6, seconds: 0.4 },
    // Nothing on the water but the rings, and his hatchet on the sand.
    { do: 'wait', seconds: 1.7 },

    // Under the water.
    { do: 'stage', fx: { bubbles: { id: 'ves', rate: 0 } } },
    { do: 'vision', name: 'undertow', mood: 'plunge', fade: 0.3 },
    { do: 'wait', seconds: 2.6 },
    { do: 'say', who: 'echo', text: "{proud}{c:grey}Arms like ye're diggin'. Kick like ye're cross.{/c}" },
    { do: 'wait', seconds: 1.6 },
    { do: 'vision', name: 'undertow', mood: 'grab' },
    { do: 'wait', seconds: 4.6 },
    { do: 'vision', name: 'undertow', mood: 'climb' },
    { do: 'sound', name: 'bubbles' },
    { do: 'wait', seconds: 2 },
    { do: 'sound', name: 'bubbles' },
    { do: 'say', who: 'echo', text: "{smile}{c:grey}Breathe when yer face is out, not when it's in.{/c}" },
    { do: 'wait', seconds: 1.4 },
    { do: 'vision', name: 'undertow', mood: 'break' },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 0.7 },
    { do: 'stage', white: 1 },
    { do: 'vision' },
    { do: 'stage', white: 0, seconds: 1 },

    // Out: the three of them come up gasping, him with Ves by the hand and the hero by the collar.
    { do: 'stage', fx: { rings: { id: 'dive', every: 0 }, splash: { at: { x: 8, y: 7.6 }, power: 1 } } },
    { do: 'sound', name: 'gasp' },
    { do: 'appear', who: 'swimmer', at: { x: 8, y: 8 }, instant: true },
    { do: 'appear', who: 'hero_sea', at: { x: 7, y: 8 }, instant: true },
    { do: 'appear', who: 'ves_sea', at: { x: 9, y: 8 }, instant: true },
    { do: 'sink', who: 'hero_sea', depth: 1 },
    { do: 'sink', who: 'ves_sea', depth: 1 },
    { do: 'hold', who: 'swimmer', what: 'hero_sea', offset: { x: -12, y: 2 } },
    { do: 'hold', who: 'swimmer', what: 'ves_sea', offset: { x: 12, y: 3 }, also: true },
    { do: 'sound', name: 'cough' },
    { do: 'walk', who: 'swimmer', to: { x: 8, y: 9 }, pace: 9, keep: true },
    { do: 'sound', name: 'paddle' },
    { do: 'walk', who: 'umbrella', to: { x: 14, y: 10 }, pace: 9, keep: true, wait: false },
    { do: 'walk', who: 'swimmer', to: { x: 8, y: 9.8 }, pace: 7, keep: true },
    // Up the sand, backwards, bent double, hauling the two of them by a hand and a collar.
    { do: 'hold', who: 'swimmer' },
    { do: 'leave', who: 'swimmer', instant: true },
    { do: 'leave', who: 'hero_sea', instant: true },
    { do: 'leave', who: 'ves_sea', instant: true },
    { do: 'animate', who: 'hero_lie', animation: 'finale_hero_dive', speed: 0.01, once: true },
    { do: 'animate', who: 'ves_lie', animation: 'finale_ves_dive', speed: 0.01, once: true },
    { do: 'appear', who: 'bramble', at: { x: 8, y: 10.2 }, instant: true },
    { do: 'animate', who: 'bramble', animation: 'tr_bramble_haul', speed: 0.22 },
    { do: 'appear', who: 'hero_lie', at: { x: 7.4, y: 9.6 }, instant: true },
    { do: 'appear', who: 'ves_lie', at: { x: 8.6, y: 9.5 }, instant: true },
    { do: 'hold', who: 'bramble', what: 'hero_lie', offset: { x: -13, y: -14 }, behind: true },
    { do: 'hold', who: 'bramble', what: 'ves_lie', offset: { x: 13, y: -16 }, behind: true, also: true },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 11.2 }, pace: 7, keep: true },
    { do: 'wait', seconds: 0.4 },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 12.4 }, pace: 6, keep: true },
    { do: 'hold', who: 'bramble' },
    // And down he goes, on the sand, and can't get up.
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 0.7 },
    { do: 'wait', seconds: 1.8 },
    { do: 'sound', name: 'cough' },
    { do: 'act', who: 'ves_lie', act: 'shake' },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'cough' },
    { do: 'act', who: 'hero_lie', act: 'shake' },
    { do: 'wait', seconds: 1.2 },
    // Ves first: up on one elbow, then sitting, soaked through, her hair in her eyes.
    { do: 'leave', who: 'ves_lie', instant: true },
    { do: 'appear', who: 'ves', at: { x: 9, y: 11.6 }, instant: true },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 0.8 },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: "{exhausted}...You can't swim." },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{crying}I know.' },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'wait', seconds: 1 },
    { do: 'act', who: 'bramble', act: 'shiver' },
    // Then the hero, getting up, shaking the sea off.
    { do: 'leave', who: 'hero_lie', instant: true },
    { do: 'appear', who: 'player', at: { x: 7, y: 11 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'act', who: 'player', act: 'shake' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'wait', seconds: 1.6 },

    // In the surf: the oilskin, empty, washing in. A few notes of the lullaby come up off it and go. What the
    // storm left lies in a fold of it.
    { do: 'appear', who: 'oilskin', seconds: 1.5 },
    { do: 'music', song: 'corrieLullaby' },
    { do: 'stage', fx: { rings: { id: 'oilskin', at: { x: 12, y: 10 }, every: 1, size: 14 } } },
    { do: 'wait', seconds: 1.6 },
    { do: 'face', who: 'player', at: 'oilskin' },
    { do: 'face', who: 'ves', at: 'oilskin' },
    { do: 'face', who: 'bramble', at: 'oilskin' },
    { do: 'stage', notes: { at: { x: 12, y: 10 }, seconds: 3.4 } },
    { do: 'wait', seconds: 3.2 },
    // (Beside it, at the water's edge, not over it.)
    { do: 'walk', who: 'player', to: { x: 10.6, y: 11 } },
    { do: 'walk', who: 'player', to: { x: 10.6, y: 10.4 }, pace: 20 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'act', who: 'player', act: 'crouch' },
    // What the storm left: the Stormglass Blade (weapons.js, "dropped by Corrie"). He takes it up here;
    // the "You got" box waits for the end of the scene, so it doesn't break the quiet (decided 16 November).
    { do: 'sound', name: 'shimmer' },
    { do: 'wait', seconds: 1 },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'stage', fx: { rings: { id: 'oilskin', every: 0 } } },

    // Behind them the tower groans, and the sea comes pouring out of its foot.
    { do: 'sound', name: 'crumble' },
    { do: 'quake', amount: 2, seconds: 1.6 },
    { do: 'stage', fx: { pour: { at: { x: 18.4, y: 6 }, w: 20, drop: 46, power: 1, seconds: 1 } } },
    { do: 'sound', name: 'tideRush' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1.4 },
    // And the Bother, riding at her line off the rocks. Nobody in her.
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: "{scared}...The boat's empty." },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{scared}...Haddock?' },
    { do: 'face', who: 'bramble', dir: 'right' },
    // Up, and back in.
    { do: 'animate', who: 'ves' },
    { do: 'animate', who: 'bramble' },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 12.4 } },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'leave', who: 'hatchet', instant: true },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'walk', who: 'ves', to: { x: 14, y: 11 }, fast: true },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'leave', who: 'umbrella', instant: true },
    { do: 'sound', name: 'umbrella' },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'walk', who: 'player', to: { x: 19, y: 13 }, fast: true, wait: false },
    { do: 'walk', who: 'ves', to: { x: 19, y: 12 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 18, y: 13 }, fast: true },
    { do: 'stage', dim: 1, seconds: 0.8 },
    { do: 'wait', seconds: 0.9 },
    { do: 'textbox', top: false },
    // (The blade he took up from the oilskin.)
    { do: 'give', item: 'stormglass_blade' },
    { do: 'stage', fx: { clear: true } },
    { do: 'goto', room: 'lastlight_sluice', spawn: { x: 2, y: 15 } },
  ],
};

// --- 3. The crank (lastlight_sluice) ----------------------------------------------------------------
// In from the stair (2,15), up out of the flooding foot of the tower. The crank `c5_crank_wheel` is at
// (24,3) with the sluice gate beside it (27,3); the floor in front (x 19-28, rows 4-10) is clear. Haddock
// leans on it at (24,4), his back to you. The way across is the weight grille in the divider (18, rows
// 8-9), open since the puzzle; back out the same way to the stair door. The room's monsters are gone
// once corrie_falls has played (`until`).
export const THE_CRANK = {
  id: 'the_crank',
  room: 'lastlight_sluice',
  once: true,

  actors: [
    // His hat gone, both flippers up on the handle, leaning on it (tideFinale.js).
    { id: 'haddock', look: 'anim:tf_haddock_strain', x: 24, y: 4, portrait: 'haddock_hatless', animation: 'tf_haddock_strain', speed: 0.45 },
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 16, portrait: 'vesper', plays: 'vesper', ahead: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 16, portrait: 'bramble', plays: 'bramble', ahead: true },
    // His bell, hung on the crank by him (coastProps.js).
    { id: 'bell', look: 'prop:c5_handbell', x: 25.4, y: 4, hidden: true },
  ],

  steps: [
    { do: 'music', song: 'lastlight' },
    { do: 'stage', flood: 0.1 },
    { do: 'stage', dim: 0, seconds: 0.6 },
    { do: 'stage', flood: 0.26, seconds: 30 },
    // Across the room at a run, the water coming up through the floor, and through the grille.
    // (Ves keeps to the wall side of the crate of wicks at (4,12).)
    { do: 'walk', who: 'ves', to: { x: 2, y: 12 }, pace: 90, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 2, y: 15 }, pace: 90, wait: false },
    { do: 'walk', who: 'player', to: { x: 2, y: 11 }, pace: 90 },
    { do: 'walk', who: 'ves', to: { x: 3, y: 10 }, pace: 90, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 2, y: 11 }, pace: 90, wait: false },
    { do: 'walk', who: 'player', to: { x: 11, y: 9 }, pace: 90 },
    { do: 'walk', who: 'ves', to: { x: 14, y: 9 }, pace: 90, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 10, y: 10 }, pace: 90, wait: false },
    { do: 'walk', who: 'player', to: { x: 17, y: 9 }, pace: 90 },
    { do: 'walk', who: 'ves', to: { x: 18, y: 9 }, pace: 90, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 15, y: 9 }, pace: 90, wait: false },
    { do: 'walk', who: 'player', to: { x: 20, y: 9 }, pace: 90 },
    { do: 'walk', who: 'ves', to: { x: 23, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 26, y: 8 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 25, y: 9 }, fast: true },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    // The room is filling: sea wells up through the grates, the great gate groans on its chain and spits
    // water round its edges; the camera goes up to the crank, trying to turn back by itself, and the man
    // leaning on it with all his weight, hat gone. (draft)
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 1.4, seconds: 1.8 },
    { do: 'stage', burst: { at: { x: 27, y: 4 }, power: 0.7 } },
    { do: 'camera', to: { x: 25, y: 4 } },
    { do: 'wait', seconds: 1.8 },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{surprised}You said you hate stairs.' },
    { do: 'emote', who: 'haddock', emote: '?' },
    { do: 'say', who: 'haddock', text: '{eh}Eh? Couldn\'t hear you.' },
    // The crank slips back a quarter turn; he leans into it, and it holds.
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 2, seconds: 0.5 },
    { do: 'act', who: 'haddock', act: 'lunge' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'haddock', text: '{determined}Go on. I\'ve minded worse.' },
    { do: 'music', song: 'haddock' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera' },
    { do: 'walk', who: 'ves', to: { x: 23, y: 6 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{angry}You great stubborn lump.' },
    { do: 'say', who: 'haddock', text: '{tender}Thank you, miss. I\'ve kept trim.' },
    { do: 'wait', seconds: 1.4 },
    // He looks back over his shoulder: he can't let go of it to turn round.
    { do: 'camera', who: 'haddock' },
    { do: 'animate', who: 'haddock', animation: 'tf_haddock_look', speed: 0.6 },
    { do: 'say', who: 'haddock', text: '{proud}Swim properly, lad. Like I showed you.' },
    { do: 'say', who: 'bramble', text: '{sad}...I will.' },
    { do: 'animate', who: 'haddock', animation: 'tf_haddock_strain', speed: 0.45 },
    { do: 'act', who: 'haddock', act: 'lunge' },
    { do: 'wait', seconds: 1.4 },
    // The hero goes up to him, lifts the bell's cord off over his own head, and hangs it on the crank by
    // Haddock's flipper. Nobody says anything. (draft)
    { do: 'walk', who: 'player', to: { x: 25, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'appear', who: 'bell', at: { x: 25.4, y: 4 } },
    { do: 'sound', name: 'bell' },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera' },

    // They go: back across the floor and out the way they came, Bramble last.
    { do: 'walk', who: 'ves', to: { x: 18, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 20, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 19, y: 9 }, fast: true },
    { do: 'walk', who: 'ves', to: { x: 14, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 12, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 9 }, fast: true },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1.4 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'walk', who: 'ves', to: { x: 6, y: 10 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 4, y: 10 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 10, y: 9 }, fast: true },
    { do: 'stage', dim: 1, seconds: 0.8 },
    { do: 'wait', seconds: 0.9 },
    { do: 'goto', room: 'lastlight_stair', spawn: { x: 2, y: 3 } },
  ],
};

// --- 4. The light answers (lastlight_stair) ---------------------------------------------------------
// In at the top landing (2,3), out of the sluice room's door. Along landing D (rows 2-4) toward the
// east gap down (22-24, rows 5-6), down it, and west along landing C (rows 7-9). The room's monsters
// (landing C) are gone once corrie_falls has played. The water is the stage's `flood`, and the sea
// pouring out of the door behind them and then down the flight after them. The run has the storm's
// song (corrieBattle from its drop, `W`); it stops dead at the foot of the tower (the_bell).
export const THE_LIGHT_ANSWERS = {
  id: 'the_light_answers',
  room: 'lastlight_stair',
  once: true,
  // The world without him from here on (his shed, his rooms, the Bother's rides).
  sees: ['haddock_gone'],

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'stage', dim: 0, seconds: 0.5 },
    { do: 'walk', who: 'ves', to: { x: 8, y: 2 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 4 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 9, y: 3 }, fast: true },
    // Above them, the sluice gives. His song stops dead. Nobody says what that means.
    { do: 'music', song: null },
    { do: 'sound', name: 'boom' },
    { do: 'quake', amount: 4, seconds: 1.4 },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'wait', seconds: 1.3 },
    // Bramble starts back for the door.
    { do: 'walk', who: 'bramble', to: { x: 5, y: 4 }, fast: true },
    { do: 'say', who: 'bramble', text: '{scared}HADDOCK!', shake: true },
    { do: 'wait', seconds: 0.5 },
    // And the sea comes down out of the door at him, with the storm's song on it. (draft)
    { do: 'stage', fx: { pour: { at: { x: 1.5, y: 1 }, w: 30, drop: 40, spread: 2.4, power: 1, seconds: 0.5 } } },
    { do: 'sound', name: 'tideRush' },
    { do: 'music', song: 'corrieBattle', section: 'W' },
    { do: 'quake', amount: 2.4, seconds: 6 },
    { do: 'stage', flood: 0.2, seconds: 1.5 },
    // Ves has him by the hood.
    { do: 'walk', who: 'ves', to: { x: 6, y: 4 }, fast: true },
    { do: 'say', who: 'ves', text: '{scared}RUN.', shake: true },
    // Along the landing in a string, the three of them, for the way down (the front row of it:
    // the purse and the drums are against the wall).
    { do: 'walk', who: 'player', to: { x: 10, y: 4 }, fast: true },
    { do: 'walk', who: 'player', to: { x: 24, y: 4 }, fast: true, wait: false },
    { do: 'walk', who: 'ves', to: { x: 23, y: 4 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 22, y: 4 }, fast: true },
    // Down the flight, and it comes down the flight after them.
    { do: 'walk', who: 'player', to: { x: 24, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'ves', to: { x: 23, y: 8 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 22, y: 9 }, fast: true },
    { do: 'stage', fx: { pour: { at: { x: 23, y: 4.4 }, w: 40, drop: 44, spread: 1.5, power: 1, seconds: 0.4 } } },
    { do: 'sound', name: 'tideRush' },
    { do: 'quake', amount: 3, seconds: 4 },
    { do: 'stage', flood: 0.5, seconds: 4 },
    { do: 'walk', who: 'ves', to: { x: 8, y: 8 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 4, y: 9 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 7, y: 9 }, fast: true, wait: false },
    { do: 'wait', seconds: 0.7 },
    { do: 'say', who: 'bramble', text: "{scared}It's right BEHIND us!" },
    { do: 'wait', seconds: 0.5 },
    // And the dark comes in with it.
    { do: 'stage', dim: 1, seconds: 0.7 },
    { do: 'wait', seconds: 0.9 },
    { do: 'stage', fx: { clear: true } },
    { do: 'goto', room: 'reach_foot', spawn: { x: 20, y: 19 } },
  ],
};

// --- 5. The bell (reach_foot) -----------------------------------------------------------------------
// Out of the tower's door onto the forecourt (20,19), with the water. The storm has gone (the room's
// `calmAfter`). Out on the sea south of the forecourt, where the water from the tower comes out round
// the rock, his hat comes up (20,23) and then his bell (21.5,23.4). The Bother is tied up at the landing
// (5,23, the empty boat now) with his ledger in her. No monsters in this room.
export const THE_BELL = {
  id: 'the_bell',
  room: 'reach_foot',
  once: true,

  actors: [
    { id: 'hat', look: 'anim:tr_hat_float', x: 20, y: 23, hidden: true, animation: 'tr_hat_float', speed: 0.5 },
    { id: 'bell', look: 'anim:c5_handbell_float', x: 21.5, y: 23.4, hidden: true, animation: 'c5_handbell_float', speed: 0.4 },
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 19, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 21, y: 19, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // Silence: no song for the hat, the bell and what comes after, until the light.
    { do: 'music', song: null },
    { do: 'time', of: 0.94 },
    { do: 'stage', dim: 1 },
    // Out of the door with the sea at their backs: it pours out after them and runs off the rock.
    { do: 'stage', fx: { pour: { at: { x: 20, y: 17.6 }, w: 36, drop: 40, spread: 2.2, power: 1 } } },
    { do: 'sound', name: 'tideRush' },
    { do: 'stage', dim: 0, seconds: 1.2 },
    { do: 'walk', who: 'ves', to: { x: 18, y: 21 }, fast: true, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 22, y: 21 }, fast: true, wait: false },
    { do: 'walk', who: 'player', to: { x: 20, y: 21 }, fast: true },
    { do: 'sound', name: 'cough' },
    { do: 'act', who: 'ves', act: 'shake', wait: false },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1.8 },
    // It slackens, and stops. Quiet. No wind, no rain: the sea lies down against the rocks and breathes,
    // slow, like something asleep. (draft)
    { do: 'stage', fx: { pour: { at: { x: 20, y: 17.6 }, power: 0, seconds: 5 } } },
    { do: 'wait', seconds: 4 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    // Out on the water, his hat comes up, and floats there by itself, turning slowly round.
    { do: 'camera', to: { x: 20, y: 22 } },
    { do: 'appear', who: 'hat', instant: true },
    { do: 'sink', who: 'hat', depth: 12, line: 3, fade: 14 },
    { do: 'sink', who: 'hat', depth: 0, seconds: 3 },
    { do: 'stage', fx: { rings: { id: 'hat', at: { x: 20, y: 23 }, every: 1.6, size: 16 } } },
    { do: 'wait', seconds: 3.4 },
    // The last thing anybody says. (draft)
    { do: 'say', who: 'bramble', text: '{worried}...Haddock? You dropped your hat.' },
    { do: 'wait', seconds: 3.6 },
    // Then his bell, beside it. Then nothing else. Nothing else comes up.
    { do: 'appear', who: 'bell', instant: true },
    { do: 'sink', who: 'bell', depth: 10, line: 3, fade: 12 },
    { do: 'sink', who: 'bell', depth: 0, seconds: 2.5 },
    { do: 'sound', name: 'bubbles' },
    { do: 'wait', seconds: 6 },
    // Bramble takes a step toward it, and stops. Ves's hand goes to her mouth.
    { do: 'walk', who: 'bramble', to: { x: 21.5, y: 21.6 }, pace: 22 },
    { do: 'animate', who: 'ves', animation: 'tr_ves_mouth', speed: 0.5 },
    { do: 'wait', seconds: 4 },
    // He wades in after the bell, up to his middle, and takes it out of the water. He holds it in both hands
    // so it can't ring, and he doesn't give it back. Nobody asks him to. The hat he leaves where it is. (draft)
    { do: 'walk', who: 'bramble', to: { x: 21.5, y: 22.6 }, pace: 10 },
    { do: 'sink', who: 'bramble', depth: 5, line: 11, seconds: 0.6 },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'leave', who: 'bell' },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'take', item: 'haddocks_bell' },
    { do: 'wait', seconds: 1.6 },
    { do: 'sink', who: 'bramble', depth: 0, seconds: 0.6 },
    { do: 'walk', who: 'bramble', to: { x: 21.5, y: 21.4 }, pace: 10 },
    { do: 'sink', who: 'bramble', depth: null },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'wait', seconds: 1.4 },
    // The Bother, tied up where he left her.
    { do: 'camera' },
    { do: 'animate', who: 'ves' },
    { do: 'walk', who: 'ves', to: { x: 16, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 11, y: 22 } },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'give', item: 'haddocks_ledger' },
    { do: 'say', text: 'Today\'s date, and one word.\n\nfound' },
    { do: 'wait', seconds: 1.6 },
    { do: 'act', who: 'ves', act: 'sigh' },
    { do: 'wait', seconds: 1.4 },
    // She comes back with it held shut against her coat, and stands by them.
    { do: 'walk', who: 'ves', to: { x: 13, y: 21 } },
    { do: 'walk', who: 'ves', to: { x: 18, y: 21 } },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 1 },

    // The hero, by the water, with the hat out there. He goes down on his knees. A long time, nothing.
    { do: 'camera', who: 'player' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 1.2 },
    { do: 'act', who: 'player', act: 'crouch' },
    { do: 'wait', seconds: 5 },
    // And then the light in him answers: a spark in his chest, beating, a glow growing round it. The player
    // lets it out (holds Z; nothing on the screen says so for a while but the light). He gets up.
    // (A heart under it, slow: the only sound there is.)
    { do: 'stage', fx: { heartbeat: { bpm: 50 } } },
    { do: 'press', seconds: 5, upto: 0.4, quiet: true, light: 'player', slip: 4, hint: 3.5 },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'wait', seconds: 0.6 },
    // The other two turn round to it.
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'face', who: 'bramble', at: 'player' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{surprised}...Sword?' },
    { do: 'stage', fx: { heartbeat: { bpm: 72 } } },
    { do: 'press', seconds: 6, from: 0.4, quiet: true, light: 'player', slip: 4, hint: 2.5 },
    // White: his light, all of it at once; and in it the sea pulls back from the tower, out across the sand,
    // past the rocks and the wrecks, further than anyone has ever seen it go.
    { do: 'sound', name: 'nova' },
    { do: 'stage', white: 1 },
    { do: 'stage', fx: { light: null, heartbeat: null, rings: { id: 'hat', every: 0 } } },
    { do: 'learn', skill: 'nova' },
    // And the music comes back with the light: What the Tide Left.
    { do: 'music', song: 'saltcombeAfter' },
    { do: 'vision', name: 'ebb', mood: 'ebb' },
    { do: 'sound', name: 'tideRush' },
    { do: 'wait', seconds: 2.4 },
    { do: 'sound', name: 'lowWater' },
    { do: 'wait', seconds: 5.6 },
    { do: 'say', text: 'You learned NOVA.\n\nIt is in your SPELLS now.' },
    { do: 'wait', seconds: 1.2 },
    // Later: at first light they climb back up.
    { do: 'vision' },
    { do: 'stage', dim: 1, seconds: 2.5 },
    { do: 'stage', white: 0, seconds: 2.5 },
    { do: 'wait', seconds: 2.6 },
    { do: 'time', of: 0.02 },
    { do: 'goto', room: 'lastlight_balcony', spawn: { x: 12, y: 5 } },
  ],
};

// --- 6. The tide held (lastlight_balcony) -----------------------------------------------------------
// Dawn on the balcony. The view is `low_tide_dawn` (src/overworld/seaVista.js); the camera looks down
// over the rail at the carved slip (12,17), then settles half way (12,10) for the rest. The far lantern
// is `tf_far_light` (tideFinale.js) out on the sand (7, 12.6), where it sits on the far sand with the camera half way.
export const THE_TIDE_HELD = {
  id: 'the_tide_held',
  room: 'lastlight_balcony',
  once: true,

  actors: [
    { id: 'lantern', look: 'anim:tf_far_light', x: 7, y: 12.6, hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 11, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 13, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'time', of: 0.02 },
    { do: 'stage', dim: 1 },
    { do: 'stage', dim: 0, seconds: 3.5 },
    { do: 'walk', who: 'ves', to: { x: 10, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 14, y: 6 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 12, y: 6 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    // Dawn: the storm gone as if it had never been, the sky the colour of the inside of a shell. (draft)
    { do: 'wait', seconds: 3.4 },
    // Looking down over the rail: the sea gone out further than anyone has ever seen it, past the reef and the
    // wrecks to a thin bright thread at the edge of the world; far below, the stone slip with a small boat's
    // prow carved in its head, worn nearly smooth.
    { do: 'textbox', top: true },
    { do: 'camera', to: { x: 12, y: 17 } },
    { do: 'wait', seconds: 4.2 },
    { do: 'camera', to: { x: 12, y: 10 } },
    { do: 'textbox', top: false },
    { do: 'appear', who: 'lantern' },
    // The smoke, north-east, low on the sky: Ves turns her head to it, and nobody says anything.
    { do: 'wait', seconds: 1.4 },
    { do: 'act', who: 'ves', act: 'look' },
    { do: 'wait', seconds: 2 },
    // Bramble still has the bell. He hasn't put it down.
    { do: 'act', who: 'bramble', act: 'sigh' },
    { do: 'wait', seconds: 1.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}He\'d have said he was only minding it.' },
    { do: 'wait', seconds: 2.8 },
    // Far off, across the sand.
    // (tideFinale.js: it catches, then its small star of light twinkles, so it reads from this far off.)
    { do: 'animate', who: 'lantern', animation: 'tf_far_light', speed: 0.6, once: true },
    { do: 'wait', seconds: 2.2 },
    { do: 'animate', who: 'lantern', animation: 'tf_far_glow', speed: 0.35 },
    { do: 'wait', seconds: 3 },
    { do: 'stage', dim: 1, seconds: 3.5 },
    { do: 'wait', seconds: 3.7 },
    // The credits ("Found"), the card, and on in Saltcombe, in the harbour office.
    // (`stay`: you play on in chapter 5; chapter 6 starts from the chart in the harbour office, set_out_for_the_smoke.)
    { do: 'end_chapter', chapter: 5, stay: true, credits: { song: 'creditsTide', text: 'credits_tide.txt', ambience: 'credits_sea', sea: true }, card: 'chapter_end_tide.txt', room: 'saltcombe_harbour_office', spawn: { x: 6, y: 8 } },
  ],
};
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.
