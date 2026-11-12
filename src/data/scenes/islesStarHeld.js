// ISLES STAR HELD: Orla's one soft beat. She has the shard on the anvil and wants to see the
// sword in the big light first, so the hero takes it to the shaft of light coming down through
// the forge's high window and holds it up (the player_sword_get pose), and it glints. Then she
// takes it back to the anvil and works the shard in. (The hero never speaks; what the hero does
// is told.) Played once, by the shop as it closes after [forge_now] (`forgeScene` on orla_forge
// in src/data/shops.js); the sword is already +3 by then. Usually it plays instead as the end of
// isles_star_brought (islesStarBrought.js), as you walk in with the sword and the shard. The
// walk is a few tiles of boards from Orla's anvil to the shaft (x 6 to 9, rows 5 to 6), and Ves and Bramble step back to row 8
// to watch; the forge has no monsters.
export const ISLES_STAR_HELD = {
  id: 'isles_star_held',
  room: 'isles_forge',
  once: true,

  actors: [
    // Orla stays at her anvil (the room's prop); this is only her voice and face.
    { id: 'orla', look: 'prop:cf_orla', x: 6, y: 4, portrait: 'orla', hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 4, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 3, y: 6, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // The other two step back out of the way to watch (clear of the anvil, the shaft and the save).
    { do: 'walk', who: 'ves', to: { x: 8, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 11, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 9, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 9, y: 6 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'say', who: 'orla', text: '{gruff}In the light. All of it. Higher.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'animate', who: 'player', animation: 'player_sword_get', speed: 0.1, once: true },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'shimmer' },
    // The big light comes down the shaft onto the blade, brighter for a moment.
    { do: 'stage', shafts: [{ at: { x: 9, y: 6 }, w: 1.2, color: '255, 244, 210' }] },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'You hold the Fallen Star up into the light from the window. It runs down the blade, and the whole of it goes pale gold, then white, then something else. For a moment it glints the way a star does, a long way up.' },
    { do: 'say', who: 'orla', text: '{soft}...Right. That\'s what I wanted to see. It\'s lit from the inside. It wants to be.' },
    { do: 'stage', shafts: [] },
    { do: 'animate', who: 'player' },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.25 },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.25 },
    { do: 'sound', name: 'clink' },
    // Back round to her at the anvil, to hand it over.
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', text: 'She nods, once, to nobody. Then she takes the sword back to the anvil and pulls her goggles down.' },
    // The big reforge show (src/overworld/reforgeShow.js): the forge, the hammer, the shard, the new name.
    { do: 'forge_show', smith: 'orla_forge' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'When she\'s done, the blade hums back.' },
    { do: 'say', who: 'orla', text: '{proud}There. Four stars now, if you ask. Don\'t ask for them all at once.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}It hummed at her. It never hums at me.' },
  ],
};
