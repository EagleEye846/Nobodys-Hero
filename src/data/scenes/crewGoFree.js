// CREW GO FREE (DRAFT, 2026-11-14): only when BOTH the captain and the figurehead were talked down (captain_spared and
// figurehead_spared: the trigger's `afterAll`). Coming back out onto the Watch Rock (wreck_watch_rock) afterwards, by her
// stern door (arriving at 29,8) or down her plank (34,7): the fog round the Fair Return thins and goes, there is a line of
// dawn low over the sea, and her crew are at her rail. Her lines let go, her plank lifts away, they sing her off with
// "Port Tomorrow", all the way to the end this time (the last C, never sung before: shipBoarding), and she slips away
// north into the gold. The ship's boy waves to Bramble from the rail. The hero never speaks.
// AFTER (`sees: fair_return_gone`): her hull, plank and lantern are gone from the rock, the stones run out to open water,
// the door through her rail (36, rows 7-8) is gone (`until: crew_go_free`), so the ship's rooms can't be reached again.
// The Watch Rock's tide fog is lifted for good (`tideFog.lifted`), and the rest of the Wreck Yard's fog thins
// (`fogLiftAfter` on the wreck rooms). Her crew turn up once in Saltcombe (crew_home_quay: the lookout and the boy).
// If only one of the two was spared, none of this plays and she stays as she is.
// Places: the hero stops at (33,7) on the stones, Ves at (31,7), Bramble at (32,8), all facing her; nobody walks into
// the water (row 9 east of x 29) and nobody stands on the bell's triggers (19-24). Her crew ride with her (`hold`).
export const CREW_GO_FREE = {
  id: 'crew_go_free',
  room: 'wreck_watch_rock',
  once: true,
  sees: ['fair_return_gone'],

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 31, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 32, y: 8, portrait: 'bramble', plays: 'bramble' },
    // Her, lying off the rock (the room's gs_hull_rock, cast 'fair_return'), her plank across the stones, her lantern.
    { id: 'ship', look: 'prop:gs_hull_rock', x: 39.5, y: 16, flat: true, centered: true, plays: 'fair_return' },
    { id: 'plank', look: 'prop:gs_gangway_down', x: 31, y: 9, flat: true, centered: true, plays: 'fr_gangway' },
    { id: 'lamp', look: 'prop:gs_post_lantern', x: 35, y: 6, plays: 'fr_lantern' },
    { id: 'fog_a', look: 'prop:gs_fog_a', x: 33, y: 12, flat: true, plays: 'fr_fog_a' },
    { id: 'fog_b', look: 'prop:gs_fog_b', x: 34, y: 3, flat: true, plays: 'fr_fog_b' },
    // Her crew at the port rail (held by the ship: they go where she goes). From the bow (north) aft.
    { id: 'lookout', look: 'prop:gs_ghost_lookout', x: 38, y: 3, hidden: true, animation: 'gs_ghost_lookout', speed: 1.2 },
    { id: 'sailor_a', look: 'prop:gs_ghost_rail', x: 37, y: 5, hidden: true, animation: 'gs_ghost_rail', speed: 1.1 },
    { id: 'boy', look: 'prop:gs_ghost_boy_wave', x: 37, y: 9, hidden: true, animation: 'gs_ghost_boy_wave', speed: 0.8 },
    { id: 'sailor_b', look: 'prop:gs_ghost_rail', x: 37, y: 11, hidden: true, animation: 'gs_ghost_rail', speed: 1.3 },
    { id: 'old', look: 'prop:gs_ghost_old', x: 38, y: 13, hidden: true, animation: 'gs_ghost_old', speed: 1.4 },
    { id: 'mate', look: 'prop:gs_ghost_mate', x: 40, y: 15, hidden: true, animation: 'gs_ghost_mate', speed: 0.9 },
  ],

  steps: [
    // (draft) 2026-11-15: trimmed. The fog going, the crew at her rail, the lines slipping and the plank lifting
    // are shown and heard; only the last note and the going of the ship are said.
    { do: 'walk', who: 'player', to: { x: 33, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 31, y: 7 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 32, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    // The crew take their places on her, out of sight.
    { do: 'hold', who: 'ship', what: 'lookout', offset: { x: -24, y: -208 } },
    { do: 'hold', who: 'ship', what: 'sailor_a', offset: { x: -40, y: -176 }, also: true },
    { do: 'hold', who: 'ship', what: 'boy', offset: { x: -40, y: -112 }, also: true },
    { do: 'hold', who: 'ship', what: 'sailor_b', offset: { x: -40, y: -80 }, also: true },
    { do: 'hold', who: 'ship', what: 'old', offset: { x: -24, y: -48 }, also: true },
    { do: 'hold', who: 'ship', what: 'mate', offset: { x: 0, y: -16 }, also: true },
    { do: 'face', who: 'boy', dir: 'left' },
    { do: 'face', who: 'lookout', dir: 'left' },
    { do: 'camera', to: { x: 37, y: 8 } },
    { do: 'music' },
    { do: 'wait', seconds: 1.0 },
    // (The Watch Rock's fog lifts by itself from here: tideFog.lifted is this scene.)
    { do: 'leave', who: 'fog_a' },
    { do: 'leave', who: 'fog_b' },
    { do: 'wait', seconds: 2.4 },
    { do: 'appear', who: 'mate' },
    { do: 'wait', seconds: 0.3 },
    { do: 'appear', who: 'old' },
    { do: 'appear', who: 'sailor_b' },
    { do: 'wait', seconds: 0.3 },
    { do: 'appear', who: 'boy' },
    { do: 'appear', who: 'sailor_a' },
    { do: 'wait', seconds: 0.3 },
    { do: 'appear', who: 'lookout' },
    { do: 'wait', seconds: 1.2 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'gangwayLetGo' },
    { do: 'leave', who: 'plank' },
    { do: 'wait', seconds: 0.8 },
    // "Port Tomorrow", all six notes: the last one at last.
    { do: 'sing', notes: [60, 60, 62, 63, 62, 60], step: 0.8 },
    { do: 'wait', seconds: 5.4 },
    { do: 'say', text: 'They sing her off. It is the same song as before, the one that always stopped a note short of the end.\n\nThis time they get to the end of it.' },
    { do: 'sound', name: 'shipGroan' },
    { do: 'walk', who: 'ship', to: { x: 39.5, y: 11 }, pace: 9, wait: false },
    { do: 'wait', seconds: 1.0 },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'bramble', text: '{shout}He\'s WAVING! The rope boy!\n\n{glee}BYE! I\'ve still got it! I\'m keeping it RIGHT!', after: 'bramble_and_the_boy' },
    { do: 'say', who: 'bramble', text: '{awed}...That boy\'s waving. At us. I think he\'s waving at us!', until: 'bramble_and_the_boy' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}A hundred years late, and not a scratch on her.\n\n{bored}I did promise him I\'d tell them in Saltcombe. ...I think they\'re going to beat us to it.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'walk', who: 'ship', to: { x: 39.5, y: -24 }, pace: 46, wait: false },
    { do: 'leave', who: 'lamp' },
    { do: 'wait', seconds: 3.4 },
    { do: 'leave', who: 'ship', instant: true },
    { do: 'leave', who: 'lookout', instant: true },
    { do: 'leave', who: 'sailor_a', instant: true },
    { do: 'leave', who: 'boy', instant: true },
    { do: 'leave', who: 'sailor_b', instant: true },
    { do: 'leave', who: 'old', instant: true },
    { do: 'leave', who: 'mate', instant: true },
    { do: 'wait', seconds: 1.6 },
    { do: 'camera' },
  ],
};
