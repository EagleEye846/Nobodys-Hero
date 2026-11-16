// BRAMBLE, CORNERED: in the Hollow Oak, a kid with a hatchet far too big for
// him is backed into the ring of old trunks by two Russets and a Burrhog. He
// sees you, decides in about a second that you're on his side, and runs to
// it. The fight that follows is the first you have together (he joins just
// before it; there's no running from it), and bramble_rescued plays after.
export const BRAMBLE_CORNERED = {
  // Triggers in rooms name the scene by this id.
  id: 'bramble_cornered',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_hollow_oak',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_cornered', x: 5, y: 9, portrait: 'bramble' },
    { id: 'fox', look: 'enemy:russet', x: 8, y: 8 },
    { id: 'fox2', look: 'enemy:russet', x: 8, y: 11 },
    { id: 'hog', look: 'enemy:burrhog', x: 10, y: 9 },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 15, y: 9 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'camera', to: { x: 8, y: 9 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{shout}BACK! Back, I said! I\'ll chop you! I\'ll chop the lot of you into kindling!', shake: true },
    { do: 'walk', who: 'fox', to: { x: 7, y: 8 } },
    { do: 'emote', who: 'hog', emote: '...' },
    { do: 'say', who: 'bramble', text: '{scared}...Please back?' },
    { do: 'wait', seconds: 0.8 },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', who: 'bramble', text: '{surprised}YOU! You, with the sword! Are you with them?' },
    { do: 'camera' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'bramble', text: '{thinking}You\'re not, are you. You\'ve got a face.\n\n{shout}THEN DON\'T JUST STAND THERE!', shake: true },
    { do: 'walk', who: 'bramble', to: { x: 14, y: 10 } },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'leave', who: 'bramble' },
    { do: 'join', who: 'bramble' },
    { do: 'battle', enemies: ['russet', 'russet', 'burrhog'], who: 'hog', noRun: true, noRunText: 'oak_no_run', after: 'bramble_rescued' },
  ],
};
