// THE WELL: the end of the Hushwood. In Hollin's square, Ves's last chalk
// mark is on the well's rim, an arrow pointing down, and one word: "sorry".
// Then the birds that weren't singing stop anyway, something behind the
// rooftops breathes out, and the shadow of the Hush rises over the cottages,
// bigger than the houses. Every lane out is blocked. Bramble works it out
// first: she went DOWN. He takes your hand, and you jump. (On to the bottom
// of the well, hollin_well_bottom, where under_the_well plays.)
export const THE_WELL = {
  // Triggers in rooms name the scene by this id.
  id: 'the_well',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hollin_well',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 15, portrait: 'bramble', plays: 'bramble' },
    { id: 'hush', look: 'proc:hush', x: 16, y: 9, hidden: true },
    { id: 'jump', look: 'prop:bramble_jump', x: 16, y: 13, portrait: 'bramble', hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 15, y: 13 } },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 13 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{thinking}This is it. The well from Grandad\'s story.' },
    { do: 'say', text: 'On the well\'s rim, in chalk: an arrow, pointing straight down.\n\nAnd one word, written small. "sorry".' },
    { do: 'say', who: 'bramble', text: '{surprised}...Down? She went DOWN the WELL?' },
    { do: 'say', who: 'bramble', text: '{worried}Why would anybody go down a well, unless something was—' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Behind the rooftops, something very large breathes out.' },
    { do: 'music', song: 'hushStalk' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'camera', to: { x: 16, y: 5 } },
    { do: 'appear', who: 'hush' },
    { do: 'walk', who: 'hush', to: { x: 16, y: 6 } },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'bramble', text: '{scared}S-Sword.', shake: true },
    { do: 'wait', seconds: 1 },
    { do: 'walk', who: 'hush', to: { x: 16, y: 7 } },
    { do: 'camera', to: { x: 16, y: 11 } },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{scared}The lanes are all blocked. The way we came\'s behind IT. There\'s nowhere—\n\n{thinking}...' },
    { do: 'say', who: 'bramble', text: '{determined}She went down.\n\nShe was running from it too, and she went DOWN. So there\'s somewhere down there to go.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{scared}...I can\'t swim very well.\n\n{determined}Hold my hand. Don\'t let go. Whatever happens, don\'t let go.' },
    { do: 'emote', who: 'player', emote: '<3' },
    { do: 'walk', who: 'player', to: { x: 15, y: 12 } },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 12 } },
    { do: 'walk', who: 'hush', to: { x: 16, y: 8 } },
    { do: 'say', who: 'bramble', text: '{shout}ONE... TWO...', shake: true },
    { do: 'say', who: 'bramble', text: '{shout}THREE!', shake: true },
    { do: 'leave', who: 'bramble' },
    { do: 'appear', who: 'jump', at: { x: 16, y: 11 } },
    { do: 'animate', who: 'player', animation: 'player_dive', speed: 0.11, once: true },
    { do: 'wait', seconds: 0.35 },
    // Down the shaft together (the 'well' vision, src/overworld/visions.js),
    // and into the water at the bottom.
    { do: 'music', song: null },
    { do: 'vision', name: 'well', mood: 'drop', fade: 0.25 },
    { do: 'wait', seconds: 2.6 },
    { do: 'vision', name: 'well', mood: 'water' },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 1.6 },
    // No going back up: it saves by itself at the bottom.
    { do: 'goto', room: 'hollin_well_bottom', spawn: { x: 8, y: 9 }, save: true },
  ],
};
