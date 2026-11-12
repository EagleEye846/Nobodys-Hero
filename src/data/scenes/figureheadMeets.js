// FIGUREHEAD MEETS (DRAFT, the superboss): the figurehead's perch (ship_figurehead_perch, the column x 18, rows 6-8, once). The carved woman at the head
// of the bowsprit turns to look. The star-shard lodged in her breast woke her a long time ago; she has been alone with it ever since, and she
// has been laughing. Nobody on the ship ever looked forward. Then the fight: enemy fairweather (her song figureheadBattle, the backdrop
// ghostship_perch), spared = figurehead_spared, defeated = figurehead_beaten. The hero walks out to (21,7); Ves (20,6) and Bramble (20,8) are on the
// bowsprit beside him; she is at (25,7), where her prop hangs (the prop goes once this scene starts). The hero never speaks.
export const FIGUREHEAD_MEETS = {
  id: 'figurehead_meets',
  room: 'ship_figurehead_perch',
  once: true,

  actors: [
    { id: 'figurehead', look: 'enemy:fairweather', x: 25, y: 7, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 18, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 21, y: 7 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 20, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 20, y: 8 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'camera', to: { x: 23, y: 7 } },
    { do: 'say', text: 'The bowsprit ends in the carved woman who has hung from it since the day the Fair Return was launched: her chin lifted, her hair carved in waves, one hand held out ahead of her as if for a coin. Her crown is gilt stars. She faces the way the ship was going.\n\nIn her breast, where the wood has cracked open, a splinter of star-metal is burning pale blue, and the cracks run out from it through the grain like frost on a pane.' },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'At your side, the Fallen Star is not humming. It is ringing, like a struck glass, and it will not stop.' },
    { do: 'say', who: 'bramble', text: '{awed}...She\'s so pretty.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Every man on this ship watched the stern for a dawn. Nobody on it ever looked forward. She was out here the whole time, with that in her chest, watching the road.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'creak' },
    { do: 'say', text: 'The carved head turns. It takes a long time, and the wood makes a sound doing it that is not a creak at all. A bell, a bright one. Her eyes have nobody in them. Her mouth, which was carved shut, is open.\n\nShe laughs.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}That\'s her! That was her the whole way down!' },
    { do: 'say', who: 'ves', text: '{determined}Right. A laugh like that, then. Stay where I can see you, both of you, and do what the lights tell you.' },
    { do: 'camera' },
    { do: 'battle', enemy: 'fairweather', who: 'figurehead', spared: 'figurehead_spared', defeated: 'figurehead_beaten' },
  ],
};
