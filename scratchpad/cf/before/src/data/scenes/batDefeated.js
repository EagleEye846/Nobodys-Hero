// BAT DEFEATED: after you kill the Roost Mother. (She can't be spared: Ves
// saw the climbers' bones under her, see [no_mercy] in great_bat.txt.)
// Her death is shown, not told, like Taper's: she flinches, beats her wings
// weaker and weaker, folds them, and falls; on the ice she breathes twice,
// the light goes out of her eyes, and frost creeps over her until she's ice
// (greatBatDeath.js). Ves can't stop trembling.
// Then a pup, no bigger than a mitten, flutters down, perches beside her and
// squeaks for her. Ves apologises to the hero for shouting, and for making
// them do it, though she'd do it again. Then she does the bravest thing she's
// done yet: she walks up to a bat, kneels, and holds out her umbrella. The pup
// climbs onto the crook, and she lifts it up to the roost. Her fear of bats is
// broken, and so is "only doing this for Mum": she's grieving for somebody
// else. Then it comes back with a plum from its mother's winter store, a
// peace offering, and that breaks her: she killed its mother, and it brought
// her food. She can't keep it, and gives it to the hero (the only roost_plum:
// the fight doesn't drop one). The little ones come down and settle on their mother, and stay (the
// remains and pups in iceCaveRoost.js, there from now on).
// Then she makes herself search the bones for her mother's scarf (the twin of
// her own). It isn't there, and the bones are all too old: her mother got
// past the Roost and kept climbing. (What happened to her is saved for the
// chapter's final boss: this only shows it wasn't here.)
// Plays straight after the fight in the Roost (the `defeated` of batsInTheRoost.js).
export const BAT_DEFEATED = {
  // Triggers in rooms name the scene by this id.
  id: 'bat_defeated',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'ice_cave_roost',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 14, y: 16, portrait: 'vesper', plays: 'vesper' },
    { id: 'great_bat', look: 'enemy:great_bat', x: 13, y: 8, glow: 72 },
    // The pup, and three of the roost's little ones who come down for their
    // mother and settle on her (where the room's pups perch afterwards).
    { id: 'pup', look: 'prop:small_bat', x: 13, y: 3, hidden: true, animation: 'small_bat', speed: 0.1 },
    { id: 'bat1', look: 'prop:small_bat', x: 4, y: 4, hidden: true, animation: 'small_bat', speed: 0.08 },
    { id: 'bat2', look: 'prop:small_bat', x: 23, y: 4, hidden: true, animation: 'small_bat', speed: 0.07 },
    { id: 'bat3', look: 'prop:small_bat', x: 13, y: 3, hidden: true, animation: 'small_bat', speed: 0.08 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    // Her death, shown. She falters in the air...
    { do: 'music', song: null },
    { do: 'animate', who: 'ves', animation: 'ves_tremble', speed: 0.09 },
    { do: 'sound', name: 'squeak' },
    { do: 'animate', who: 'great_bat', animation: 'great_bat_death_falter', speed: 0.5, once: true },
    { do: 'wait', seconds: 1 },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 2.2 },
    // ...falls, still folded...
    { do: 'walk', who: 'great_bat', to: { x: 13, y: 11 }, fast: true, keep: true },
    { do: 'sound', name: 'hit' },
    // ...and lies on the ice. Two breaths, the second fainter. The light goes
    // out of her eyes. The frost takes her.
    { do: 'animate', who: 'great_bat', animation: 'great_bat_death', speed: 0.75, once: true, glow: 48 },
    { do: 'wait', seconds: 3 },
    { do: 'animate', who: 'great_bat', glow: 24 },
    { do: 'wait', seconds: 1.5 },
    { do: 'animate', who: 'great_bat', glow: 0 },
    { do: 'wait', seconds: 4 },
    { do: 'wait', seconds: 1.5 },

    { do: 'animate', who: 'ves' },
    { do: 'walk', who: 'ves', to: { x: 15, y: 15 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{exhausted}...It\'s over.' },
    { do: 'wait', seconds: 1 },

    // A pup comes down to her, perches by her wing, and squeaks for her.
    { do: 'appear', who: 'pup' },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'pup', to: { x: 11, y: 12 } },
    { do: 'animate', who: 'pup', animation: 'small_bat_perch', speed: 0.45 },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'wait', seconds: 1 },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 1.4 },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{sad}Oh. Oh, no.' },

    // She says sorry.
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{crying}I\'m sorry. I shouted at you. You were trying to be kind, and I wouldn\'t let you.\n\n{crying}And I\'d do it again. That\'s the worst part.\n\n{crying}If she\'d lived, the next people up the mountain... I\'d do it all again.\n\n{sobbing}But I made you do it with me. I\'m sorry.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 0.8 },

    // And walks up to a bat. Up past you first, then across, so she doesn't
    // walk through you.
    { do: 'walk', who: 'ves', to: { x: 15, y: 13 } },
    { do: 'walk', who: 'ves', to: { x: 12, y: 13 } },
    { do: 'animate', who: 'ves', animation: 'ves_tremble', speed: 0.09 },
    { do: 'emote', who: 'ves', emote: 'sweat' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{scared}H-hey. Hey, little one. It\'s all right. I\'m not going to...\n\n{tender}...Your mum\'s not coming back. I know. I\'m sorry. I\'m so sorry.\n\n{crying}Mine didn\'t come home either.' },
    // On her knees, the crook held out, her hands shaking.
    { do: 'animate', who: 'ves', animation: 'ves_offer', speed: 0.12 },
    { do: 'wait', seconds: 2 },
    { do: 'animate', who: 'ves', animation: 'ves_offer', speed: 0.6 },
    { do: 'wait', seconds: 1.2 },
    // The pup climbs on.
    { do: 'animate', who: 'pup', animation: 'small_bat', speed: 0.1 },
    { do: 'walk', who: 'pup', to: { x: 11, y: 13 } },
    { do: 'leave', who: 'pup' },
    { do: 'animate', who: 'ves', animation: 'ves_offer_pup', speed: 0.4 },
    { do: 'sound', name: 'squeak' },
    // "Little Wings" (remorseTheme.js), through the plum and her remorse,
    // until the cave's own song comes back after the search.
    { do: 'music', song: 'remorse' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'ves', text: '{surprised}...It\'s so light.\n\n{tender}You\'re shaking worse than I was.' },
    // She stands, and lifts it up to the roost.
    { do: 'animate', who: 'ves', animation: 'ves_lift', speed: 0.4 },
    { do: 'wait', seconds: 1.8 },
    { do: 'appear', who: 'pup', at: { x: 12, y: 12 } },
    { do: 'animate', who: 'ves', animation: 'ves_raised', speed: 0.9 },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'pup', to: { x: 12, y: 3 } },
    { do: 'leave', who: 'pup' },
    { do: 'wait', seconds: 1.5 },

    // It comes back. It's brought her something from its mother's winter
    // store: a plum. A peace offering, from the one she's just orphaned.
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'appear', who: 'pup', at: { x: 12, y: 3 } },
    { do: 'animate', who: 'pup', animation: 'small_bat_plum', speed: 0.1 },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'pup', to: { x: 11, y: 13 } },
    { do: 'emote', who: 'ves', emote: '?' },
    { do: 'animate', who: 'pup', animation: 'small_bat_perch', speed: 0.45 },
    { do: 'animate', who: 'ves', animation: 'ves_plum', speed: 0.9 },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'ves', text: '{surprised}...A plum. From her store. You brought me a plum.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{crying}Why would you... I\'m the one who...\n\n{sobbing}I killed your mum. I killed your mum, and you brought me a plum.' },
    { do: 'animate', who: 'ves', animation: 'ves_sob', speed: 0.35 },
    { do: 'wait', seconds: 2.5 },
    { do: 'say', who: 'ves', text: '{sobbing}I\'m sorry. I\'m sorry, I\'m sorry, I\'m so sorry...' },
    { do: 'wait', seconds: 2 },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 1.5 },
    { do: 'sound', name: 'squeak' },
    { do: 'animate', who: 'pup', animation: 'small_bat', speed: 0.1 },
    { do: 'walk', who: 'pup', to: { x: 12, y: 3 } },
    { do: 'leave', who: 'pup' },
    { do: 'wait', seconds: 1.5 },
    { do: 'animate', who: 'ves', animation: 'ves_plum', speed: 0.9 },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{crying}...I can\'t eat it. I can\'t even hold it.\n\n{sad}You keep it. Please.' },
    { do: 'give', item: 'roost_plum' },
    { do: 'animate', who: 'ves', animation: 'ves_kneel', speed: 0.6 },
    { do: 'wait', seconds: 1.5 },

    // The roost comes down for its mother, and settles close in against her
    // (in front of her, so they're drawn over her, not hidden behind).
    { do: 'appear', who: 'bat1' },
    { do: 'appear', who: 'bat2' },
    { do: 'appear', who: 'bat3' },
    { do: 'sound', name: 'squeak' },
    { do: 'walk', who: 'bat1', to: { x: 12, y: 12 } },
    { do: 'animate', who: 'bat1', animation: 'small_bat_perch', speed: 0.5 },
    { do: 'walk', who: 'bat2', to: { x: 15, y: 12 } },
    { do: 'animate', who: 'bat2', animation: 'small_bat_perch', speed: 0.55 },
    { do: 'walk', who: 'bat3', to: { x: 14, y: 12 } },
    { do: 'animate', who: 'bat3', animation: 'small_bat_perch', speed: 0.6 },
    { do: 'sound', name: 'squeak' },
    { do: 'wait', seconds: 2 },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1 },

    // Was Mum here? She has to know. Along the floor, below where the
    // Roost Mother lies, on her knees at each spot.
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{scared}...I have to look. At the floor. I have to know if she\'s...\n\n{worried}Mum knitted this scarf. She made two, the same. She\'d never have taken hers off, not up here.' },
    { do: 'walk', who: 'ves', to: { x: 8, y: 13 } },
    { do: 'animate', who: 'ves', animation: 'ves_search', speed: 0.35 },
    { do: 'wait', seconds: 2 },
    { do: 'walk', who: 'ves', to: { x: 18, y: 13 } },
    { do: 'animate', who: 'ves', animation: 'ves_search', speed: 0.35 },
    { do: 'wait', seconds: 2 },
    { do: 'walk', who: 'ves', to: { x: 13, y: 13 } },
    { do: 'animate', who: 'ves', animation: 'ves_search', speed: 0.5 },
    { do: 'wait', seconds: 1.5 },
    { do: 'animate', who: 'ves', animation: 'ves_kneel', speed: 0.6 },
    { do: 'say', who: 'ves', text: '{exhausted}...It\'s not here. No scarf. No lantern.\n\n{thoughtful}And these boots are all cracked and grey. Every one of them, older than eight years.\n\n{thoughtful}Long before her.' },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'camera', to: { x: 13, y: 4 } },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{hopeful}She got past. She got past the Roost, and she kept going up. Toward the beacon.\n\n{determined}Wherever she is, it\'s higher than this.' },
    { do: 'camera' },
    { do: 'music', song: 'caves' },

    // What's changed.
    { do: 'say', who: 'ves', text: '{thoughtful}I\'ve been scared of bats my whole life. Since the cave. Since my lantern went out.\n\n{thoughtful}They\'re just little. They\'re little and frightened, and they want their mum.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{shy}...Thank you. For standing in front of me. Again.\n\n{tender}And for not looking at me any differently. After.' },
    { do: 'emote', who: 'player', emote: '<3' },
    { do: 'say', who: 'ves', text: '{smile}...Come on. Let\'s go, before I start crying again.' },
  ],
};
