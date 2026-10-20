// THE KEEPER AT THE FIRE: you walk into the woodcutters' camp, and there he
// is, minding their fire, a long way down from the summit and ahead of you
// again. Kind, helpful, and pointing the way south, towards where the wind
// took Ves. When he's done the forest's waltz starts ("The Scarlet Waltz",
// pinefallTheme.js), and from then on the Pinefall plays it (each room's
// `musicAfter`). After this he stays by the fire (the room's `keeper` prop,
// with lines in text/npcs/old_keeper.txt).
export const KEEPER_AT_THE_FIRE = {
  // Triggers in rooms name the scene by this id.
  id: 'keeper_at_the_fire',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'pinefall_camp',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 16, y: 12, portrait: 'old_keeper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'walk', who: 'player', to: { x: 13, y: 10 } },
    { do: 'camera', to: { x: 15, y: 11 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'emote', who: 'keeper', emote: '!' },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'say', who: 'keeper', face: 'surprised', text: 'Well. Well, well. Look what fell out of the sky.\n\nI heard you coming down through the trees from a mile off. So did the birds.' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'Sit, sit. The woodcutters went off with their axes and left me minding the fire. It\'s been wanting someone to sit at it.' },
    { do: 'say', who: 'keeper', text: 'You\'ll be wondering how an old man got down the mountain ahead of you. Again.\n\n{sly}I didn\'t fall, for one thing. That helps.' },
    { do: 'emote', who: 'keeper', emote: '...' },
    { do: 'say', who: 'keeper', text: '...She isn\'t with you.' },
    { do: 'say', who: 'keeper', face: 'sad', text: 'No. I saw. From down here it looked like a star, going the wrong way.\n\nThe wind carried her a long way past where you came down. South, over the trees, towards the mist.' },
    { do: 'say', who: 'keeper', face: 'worried', text: 'Something big went through the wood that way too. That\'s what the woodcutters went after.' },
    { do: 'say', who: 'keeper', text: 'South, then. Through the turning wood, and keep to the paths. If you come to a clearing where the trees are all scratched, don\'t stop in it.' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'She\'s a tough little thing, that one. Tougher than her umbrella.\n\nGo and find her.' },
    { do: 'music', song: 'pinefall' },
    { do: 'camera' },
  ],
};
