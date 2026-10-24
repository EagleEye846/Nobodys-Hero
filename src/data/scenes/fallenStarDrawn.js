// THE FALLEN STAR, DRAWN: you take hold of the sword in the star-stone and
// it comes out like it was waiting to. You spin round with it and hold it up
// over your head, shining (the player_sword_get animation, player.js), to a
// little jingle ('starGet'), and somewhere a bird has opinions about jingles.
// Played by the stone itself (`drawScene` on the prop in hushStarfall.js),
// which has already handed the sword over.
export const FALLEN_STAR_DRAWN = {
  // Triggers in rooms name the scene by this id.
  id: 'fallen_star_drawn',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_starfall',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [],

  steps: [
    { do: 'music', song: null },
    { do: 'face', who: 'player', dir: 'down' },
    // Eight frames of spin, then up it goes (0.1s a frame).
    { do: 'animate', who: 'player', animation: 'player_sword_get', speed: 0.1, once: true },
    { do: 'wait', seconds: 0.75 },
    { do: 'sound', name: 'starGet' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', text: 'You drew the FALLEN STAR!\n\nIt\'s warm, and it hums, very faintly, like something remembering being a long way up.' },
    { do: 'say', text: 'Somewhere in the trees, a bird sings something like "If only there was a better jingle for pulling out a sword that wasn\'t heavily copyrighted by a company..."' },
    { do: 'animate', who: 'player' },
    { do: 'say', text: 'Equip it from EQUIP (press C). Its soul ability is STARFALL: SHIFT, while you dodge, calls a star down through the bullets.\n\nA smith might know what to do with star-metal.' },
    { do: 'music', song: 'hushwood' },
  ],
};
