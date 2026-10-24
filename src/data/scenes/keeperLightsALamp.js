// THE KEEPER LIGHTS A LAMP: through the shutter on the Old Street, the first
// street of the dead city, and somebody's ahead of you again. The Keeper, up
// on his toes with a taper, coaxing one of the dead lamps alight: the first
// light on the street in a hundred years. He's glad to see Ves found, sorry
// about her leg, and sends you on toward the Gate. His theme ("Minding the
// Fire", keeperTheme.js) plays under it. After this he stays by the lamp (the
// room's `keeper` prop, lines in text/npcs/old_keeper.txt), and the lamp
// stays lit.
export const KEEPER_LIGHTS_A_LAMP = {
  // Triggers in rooms name the scene by this id.
  id: 'keeper_lights_a_lamp',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_old_street',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 15, y: 5, portrait: 'old_keeper' },
    { id: 'ves', look: 'prop:vesper_crutch', x: 12, y: 7, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'music', song: 'keeper' },
    { do: 'walk', who: 'player', to: { x: 13, y: 6 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'keeper', dir: 'up' },
    { do: 'say', text: 'Somebody\'s ahead of you on the street of dead lamps. An old man in a hood, up on his toes, holding a taper to the glass.' },
    { do: 'say', who: 'keeper', text: 'Come on. Come on, you stubborn old thing...' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'The lamp catches. A small warm light, the first on this street for a hundred years.' },
    { do: 'say', who: 'keeper', face: 'glee', text: '...There.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'emote', who: 'keeper', emote: '!' },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'Ah! There you both are. And you found her! I said you would.' },
    { do: 'say', who: 'ves', text: '{surprised}You! You were on the mountain. How did you get all the way down here?' },
    { do: 'say', who: 'keeper', face: 'sly', text: 'Slowly. And without falling off anything. You should both try it some time.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'keeper', face: 'sad', text: '...Oh. Your leg. And no umbrella.' },
    { do: 'say', who: 'ves', text: '{determined}Something took it. It went this way, toward the Gate. I\'m getting it back.' },
    { do: 'say', who: 'keeper', face: 'worried', text: 'Through the old city? Then you\'ll want a bit of light. Nobody\'s lit these since the city gave up waiting for its Hero.' },
    { do: 'face', who: 'keeper', dir: 'up' },
    { do: 'say', who: 'keeper', face: 'thoughtful', text: 'A lamp\'s a patient thing, you know. It\'ll hold on to a light for a very long time, if you let it.' },
    { do: 'wait', seconds: 1 },
    { do: 'face', who: 'keeper', dir: 'left' },
    { do: 'say', who: 'keeper', face: 'glee', text: 'Go on, the pair of you. I\'ll light a few more behind you, so you can find your way back.' },
    { do: 'say', who: 'ves', text: '{smile}...Thank you.' },
    { do: 'face', who: 'keeper', dir: 'up' },
    { do: 'wait', seconds: 2 },
  ],
};
