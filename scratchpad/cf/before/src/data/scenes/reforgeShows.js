// THE REFORGE SHOWS for the two smiths whose reforge happens at the shop counter:
// Teasel (chapter 3, Lasthome's square) and Hobnail (chapter 4, the heat vent in
// Belowtown). The shop's TALK topic "The star sword" does the reforge itself
// (src/shop/shopScene.js, `forge`), says what the smith says as they take the
// shard, then closes the shop and the room plays the scene named by the shop's
// `forgeScene` (src/data/shops.js): the big show (`forge_show`, drawn by
// src/overworld/reforgeShow.js), then the smith's words about the new sword.
// Orla's is part of isles_star_held (islesStarHeld.js), which has her walk-in
// version too.
//
// Played once each (`once`): the reforge only ever happens once per smith. New
// lines are (draft).
export const REFORGE_TEASEL = {
  id: 'reforge_teasel',
  room: 'lasthome_square',
  once: true,

  // Only her voice: she stays at her anvil (the shop's keeper, not a prop in the room).
  actors: [
    { id: 'teasel', look: 'prop:lh_teasel', x: 11, y: 6, hidden: true },
  ],

  steps: [
    { do: 'wait', seconds: 0.4 },
    { do: 'forge_show', smith: 'lasthome_smithy' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'teasel', text: 'There. Stronger than it was. And it\'ll call down two now, if you ask it. Don\'t ask me how I know that. It told me.' },
  ],
};

export const REFORGE_HOBNAIL = {
  id: 'reforge_hobnail',
  room: 'belowtown_forge',
  once: true,

  actors: [
    { id: 'hobnail', look: 'prop:bf_hobnail', x: 7, y: 6, portrait: 'hobnail', hidden: true },
  ],

  steps: [
    { do: 'wait', seconds: 0.4 },
    { do: 'forge_show', smith: 'hobnail_forge' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'hobnail', text: '...Good.' },
  ],
};
