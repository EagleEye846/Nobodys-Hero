// TAPER BLOCKS: Taper is waiting in front of the door out of the Ruins (the
// actor `plays` the Taper prop already standing there). Every hero who went
// through it vanished, and she won't hand you over to whatever took them.
// Then the boss fight; spare her (taper_spared) or don't (taper_defeated).
export const TAPER_BLOCKS = {
  // Triggers in rooms name the scene by this id.
  id: 'taper_blocks',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'way_out',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'taper', look: 'prop:taper', x: 32, y: 4, portrait: 'mother_taper', plays: 'mother_taper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'taper', text: 'You followed me. Of course you did.\n\nGrowing things always lean toward the open air.' },
    { do: 'say', who: 'taper', text: 'I\'ve watched six heroes walk out this door. I fed every one of them first.\n\nNot one of them ever came home.' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: 'There\'s a light out there that calls to people. It called them, one by one.\n\nI can\'t bear for it to call you too.' },
    { do: 'say', who: 'taper', text: 'So I\'m sorry, sprout. Truly.\n\nIf you want to go, show me you\'re strong enough to come back.' },
    { do: 'battle', enemy: 'taper', spared: 'taper_spared', defeated: 'taper_defeated' },
  ],
};
