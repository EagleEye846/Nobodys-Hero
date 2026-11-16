// TUCK FINDS YOU: in the grotto past the falls, a very small person in a very
// large tabard steps out from behind a crystal, sees the two of you, and ducks
// back. Then the tail of the tabard sticks out. Then, slowly, he comes out.
// He is the king's page, he's been sent to see what fell into the Glimmering,
// and he is terrified of being looked at. He looks at the hero's sword for a
// long moment and almost says something he shouldn't. Then he turns to lead.
//
// Tuck's animations here: the bf_tuck walking frames (the tabard swishing and
// dragging), the idle frames with ear-twitches and a tail-flick while he
// hides, a startle, a shiver, ears fidgeting while he talks, a sidle out from
// behind the crystal, and his tail left showing when he thinks he's hidden.
//
// Clearance: there are no monsters in this room. The walks keep to rows 6 to 9
// between x 6 and 25: you (and Ves) walk to 11,8 and 10,9; Tuck steps out of
// the crystal at 17-18,7 to 19.4,6, back, out, then down the east side and
// across row 8.
export const TUCK_FINDS_YOU = {
  // Triggers in rooms name the scene by this id.
  id: 'tuck_finds_you',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'glimmer_tuck',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    // Hiding behind the 2-wide crystal at 17-18,7: his feet are a row higher
    // than the crystal's, so it draws in front of him.
    { id: 'tuck', look: 'prop:bf_tuck', x: 17.5, y: 5.9, portrait: 'tuck', animation: 'bf_tuck', speed: 0.35 },
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 9, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'music', song: 'tuck' },
    { do: 'walk', who: 'player', to: { x: 11, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 10, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 0.5 },
    // A small figure steps out from behind the crystal...
    { do: 'camera', to: { x: 16, y: 7 } },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 19.4, y: 5.9 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.35 },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'wait', seconds: 0.5 },
    // ...sees them...
    { do: 'act', who: 'tuck', act: 'startle' },
    // ...and ducks back.
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.14 },
    { do: 'walk', who: 'tuck', to: { x: 17.5, y: 5.9 }, keep: true, fast: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.35 },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera' },
    { do: 'emote', who: 'ves', emote: '...' },
    // The tail of the tabard creeps out, flicking.
    { do: 'camera', to: { x: 16, y: 7 } },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.5 },
    { do: 'walk', who: 'tuck', to: { x: 18.45, y: 5.9 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.2 },
    { do: 'wait', seconds: 1.6 },
    { do: 'camera' },
    // (You and Ves stand low in the grotto: the words go at the top, so the box doesn't hide her.)
    { do: 'textbox', top: true },
    { do: 'say', who: 'ves', text: '{surprised}That crystal has a tail.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{smile}It\'s all right. We\'re friendly. {thoughtful}Mostly.' },
    // He sidles out, ears fidgeting.
    { do: 'camera', to: { x: 16, y: 7 } },
    { do: 'act', who: 'tuck', act: 'shiver' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.3 },
    { do: 'walk', who: 'tuck', to: { x: 19.4, y: 5.9 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_down', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 19.4, y: 8 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 14, y: 8 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.3 },
    { do: 'camera' },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'tuck', text: '{scared}Oh! Oh, um. Hello. Sorry. Sorry, I didn\'t... you\'re very tall.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'tuck', text: '{shy}I\'m Tuck. I\'m the king\'s page. Um.\n\nHis Majesty felt the ground go. He sent me to... to see what fell in.' },
    { do: 'say', who: 'ves', text: '{bored}Us. We fell in.' },
    { do: 'say', who: 'tuck', text: '{worried}Yes. I can see that. Are you... are you hurt?' },
    { do: 'say', who: 'ves', text: '{proud}Only my dignity. And that was already in a bad way.' },
    // He looks at the hero's sword for a long moment.
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'tuck', emote: '...' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'tuck', text: '{whisper}...You came down from the top. Nobody comes down from the top. Only...' },
    { do: 'wait', seconds: 0.9 },
    { do: 'act', who: 'tuck', act: 'startle' },
    { do: 'say', who: 'tuck', text: '{shy}Sorry. His Majesty will want to see you. He loves visitors. He loves... an audience.\n\nThis way. Please. Mind the pink ones, they bite.' },
    { do: 'say', who: 'ves', text: '{smile}The pink ones. {bored}Noted.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'emote', who: 'ves', emote: '?' },
    // Off he goes, tabard dragging, and looks back to see if you're coming.
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 22, y: 8 }, keep: true },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck', speed: 0.35 },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'wait', seconds: 0.7 },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 25, y: 8 }, keep: true },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.5 },
    { do: 'textbox', top: false },
    // Back to the room's song.
    { do: 'music' },
  ],
};
