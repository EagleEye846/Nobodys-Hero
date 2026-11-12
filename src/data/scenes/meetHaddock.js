// MEET HADDOCK: the beach at Gullrest, in the sun. A walrus in an oilskin is
// sitting on a big pink rock at the water's edge, ringing a brass handbell at
// the sea. Nothing answers. He is Haddock, the coast's lightman (the gag:
// Ves says "...Isn't it a lighthouse keeper?" and he is offended for the whole
// of the next room, the lifeboat house). He is a bit deaf, and hears Ves's
// dry asides as compliments. He doesn't join the party; he meets you at stops.
// (The hero never speaks.)
//
// The party walks from the trigger strip (x 12, rows 2 to 14) to 13,7, then along row 10 to
// the foot of his rock (x 19 to 22, rows 8 and 9). No monsters near: the
// castles and the gullion are east of x 25 or far down the west beach.
export const MEET_HADDOCK = {
  id: 'meet_haddock',
  room: 'gullrest_beach',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_bell', x: 20, y: 8, portrait: 'haddock', plays: 'haddock', centered: true, animation: 'cf_haddock_bell', speed: 0.3 },
    { id: 'ves', look: 'prop:vesper_stand', x: 15, y: 7, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 14, y: 8, portrait: 'bramble', plays: 'bramble', hidden: true },
  ],

  steps: [
    // From anywhere on the trigger strip (x 12, rows 2 to 14) to the sand by the bunting, clear of the huts.
    // Ves and Bramble step in from where they were following and come along.
    { do: 'appear', who: 'ves', instant: true },
    { do: 'appear', who: 'bramble', instant: true },
    { do: 'walk', who: 'ves', to: { x: 14, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 12, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 13, y: 7 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The beach is exactly as the bunting promised: warm sand, striped huts, and a sea so blue it looks like an advertisement for itself.' },
    { do: 'camera', to: { x: 22, y: 9 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'Someone is sitting on a big pink rock at the water\'s edge. Someone large, in an oilskin, ringing a brass handbell slowly at the sea.\n\nDing.\n\nDing.\n\nNothing answers.' },
    // (Over a little, so Bramble is in the picture with the rock.)
    { do: 'camera', to: { x: 17, y: 9 } },
    { do: 'say', who: 'bramble', text: '{thinking}Is he ringing it AT something?' },
    { do: 'say', who: 'ves', text: '{bored}At the sea, I think. It isn\'t listening.' },
    { do: 'camera' },
    // Down onto the wet sand (row 10), then along it to the foot of the rock,
    // Ves in front, the hero at her pace, Bramble on the row below.
    { do: 'walk', who: 'ves', to: { x: 15, y: 10 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 12, y: 11 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 13, y: 10 } },
    // (Let the first legs finish: two walks at once for one person never end.)
    { do: 'wait', seconds: 0.5 },
    { do: 'walk', who: 'ves', to: { x: 21, y: 10 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 18, y: 11 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 19, y: 10 }, pace: 48 },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'bell' },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    { do: 'wait', seconds: 1.2 },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{proud}Morning! Haddock. Lightman o\' this coast, and all her tides.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{thoughtful}...Isn\'t it a lighthouse keeper?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.7 },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{offended}Keeper. KEEPER. Nobody KEEPS a light, miss.\n\nYou MIND it.' },
    { do: 'act', who: 'ves', act: 'nod', wait: false },
    { do: 'say', who: 'ves', text: '{bored}...Noted.' },
    // An aside, to you.
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{bored}He\'s a lot.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{smile}Thank you, miss. I\'ve kept trim.' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'bramble', text: '{grin}He heard THAT one.' },
    { do: 'say', who: 'ves', text: '{bored}Selectively.' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'haddock', text: '{proud}Rung that bell every noon since I was a lad. Tide comes up the beach, tide goes back down. Somebody\'s got to let it know it\'s been noticed.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}Does it come up THIS far?' },
    { do: 'say', who: 'haddock', text: '{laughing}Up to the huts! And back again.\n\nManners, mostly.' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'say', who: 'bramble', text: '{thinking}...It has manners?' },
    { do: 'say', who: 'haddock', text: '{smile}Some.' },
    { do: 'say', who: 'haddock', text: '{proud}Lifeboat house, up the beach: big red doors, kettle on. Then the cove, then the jetty. And mind the castles. They\'ll tell you the tide\'s not coming in.' },
    { do: 'say', who: 'ves', text: '{bored}And is it?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{proud}It is.' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'emote', who: 'player', emote: '...' },
    // Off he goes up the beach to put the kettle on: down off his rock, east along the sand
    // (row 7, well above the castles on row 11) and in at the lifeboat house's doors (31,4).
    // From here on he's in there, not on his rock (gullrest_beach's Haddock is `until` this scene).
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_right', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 23, y: 7 }, pace: 40, keep: true },
    { do: 'walk', who: 'haddock', to: { x: 31, y: 7 }, pace: 40, wait: false, keep: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 3.2 },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_walk_up', speed: 0.3 },
    { do: 'walk', who: 'haddock', to: { x: 31, y: 4 }, pace: 40, keep: true },
    { do: 'leave', who: 'haddock' },
  ],
};
