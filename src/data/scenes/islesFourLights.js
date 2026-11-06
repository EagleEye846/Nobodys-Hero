// ISLES FOUR LIGHTS: up out of the Soundings' stair and into the wind, the first look at the
// Beacon Isles: little lights on their rocks out across the water, one turning, one dark, and
// far off to the east a taller one with a warm window. Bramble finds out how much sea there is.
// (The hero never speaks.) The walks stay on the path below the cave (rows 6 to 8, x 5 to 10);
// the landing has no monsters.
export const ISLES_FOUR_LIGHTS = {
  id: 'isles_four_lights',
  room: 'isles_landing',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 5, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'The stair comes out of the rock into the wind. Rain, salt, and a lot of sky.\n\nOut across the water, each on its own rock, are little lighthouses. One is turning. One is dark. Further off there are more, and past all of them, a long way east, a taller one with a warm window low down.' },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 7 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{scared}...It\'s all sea. Every way. Even behind.' },
    { do: 'walk', who: 'ves', to: { x: 7, y: 6 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{bored}It\'s an island. That\'s the deal with islands.' },
    { do: 'say', who: 'bramble', text: '{worried}Who builds a house in the middle of a puddle? On purpose?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Four someones, by the look of it.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{thinking}Three. That one\'s off.' },
    { do: 'say', who: 'ves', text: '{bored}Three and a half, then. Come on. The sea isn\'t going anywhere.' },
    { do: 'say', who: 'bramble', text: '{scared}That\'s what I\'m worried about.' },
  ],
};
