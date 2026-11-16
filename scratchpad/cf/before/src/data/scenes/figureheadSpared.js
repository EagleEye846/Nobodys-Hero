// FIGUREHEAD SPARED (DRAFT): the fight ended by talking (ship_figurehead_perch). She lets go of her wish (that the night would never end),
// hears the ship's name for the first time, lets her hand fall,
// and the star goes down in her chest like a lantern turned low. The shard is hers to give, and she gives it: she puts it in the hero's palm
// (`give star_shard_wreck`). Ves (20,6) and Bramble (20,8) stand on the bowsprit. The hero never speaks.
export const FIGUREHEAD_SPARED = {
  id: 'figurehead_spared',
  room: 'ship_figurehead_perch',
  once: true,

  actors: [
    { id: 'figurehead', look: 'enemy:fairweather', x: 25, y: 7, centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: 'ghostShip' },
    { do: 'camera', to: { x: 23, y: 7 } },
    { do: 'say', text: 'She lets her hand fall. Her head tips back, chin up, the way a figurehead\'s does, and the star in her breast goes down slowly, like a lantern being turned low by somebody who means to come back to it.\n\nShe is smiling out at the dark, at the place where the morning will be. It is a very good smile. It was carved to be.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Her hand comes out, palm up, as it always has. Not for a coin this time. Something slides out of the crack in her breast and into it: a splinter of star-metal, warm.\n\nShe holds it out to you. The wood of her arm creaks, once, like a gate.' },
    { do: 'sound', name: 'shimmer' },
    { do: 'give', item: 'star_shard_wreck' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{awed}She gave it to us.' },
    { do: 'say', who: 'ves', text: '{tender}She\'s been holding it out for a hundred years. Somebody finally put a hand under it.' },
    { do: 'say', who: 'ves', text: '{laughing}And she is going to be insufferable about it. Let\'s go before she thinks of a game.' },
    { do: 'leave', who: 'figurehead', instant: true },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
