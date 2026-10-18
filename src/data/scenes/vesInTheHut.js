// VES IN THE HUT: the lamplighter's hut, on its ledge in the cloud, the
// furthest anyone knows her mother got. Her ladder leans on the wall, and her
// chalk tally of the lamps she lit runs along it: eight, and a ninth half
// drawn. Ves holds together just long enough to see it, then goes down on her
// knees and cries. The hero says nothing (the hero never does) and just
// stays, at her side; and that's what she needed. She owns up to how she was
// at the cairn, and asks you to go on with her. Their friendship starts here.
// Plays once, just inside the door (vigilLamplightersHut.js). She ran in
// ahead of you on the ledge (vesSeesTheHut.js), so she's already standing at
// the tally when you come in: the actor `plays` Ves from where she is (`ahead`).
// At the end she tells you to get some rest and sits down by the door to
// think; she stays there (a prop in vigilLamplightersHut.js) and you can't
// leave until you've slept (`leavesAhead`, until the dream: hutDream.js).
export const VES_IN_THE_HUT = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_in_the_hut',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_lamplighters_hut',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  // Ves stays sitting by the door, not following you, until you've slept;
  // till then the door won't let you out (`blocked`, in upper_vigil.txt).
  leavesAhead: { who: 'vesper', until: 'hut_dream', blocked: 'hut_rest_first' },

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 4, portrait: 'vesper', plays: 'vesper', ahead: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{surprised}Oh.\n\n{thoughtful}That\'s her ladder. She carried her ladder all the way up here.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}And that\'s her tally. One mark for every lamp she lit on the way up.\n\n{sad}Eight. And a ninth, half drawn.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'ves', text: '{sad}She never finished it.\n\n{sad}She always finished things. She was so annoying about finishing things.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'animate', who: 'ves', animation: 'ves_sob', speed: 0.35 },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'ves', text: '{sobbing}I told myself she\'d be here. That I\'d open the door and she\'d look round and say "you took your time, little lamp."\n\n{sobbing}Eight years I\'ve been telling myself that.' },
    { do: 'wait', seconds: 1.8 },
    { do: 'walk', who: 'player', to: { x: 7, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 7, y: 4 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'wait', seconds: 1.4 },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 1.4 },
    { do: 'animate', who: 'ves', animation: 'ves_kneel', speed: 0.6 },
    { do: 'say', who: 'ves', text: '{crying}...You\'re not going to say anything, are you.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{tender}...Good. Don\'t. Everyone at home always says something.\n\n{tender}"She\'ll turn up." "She knew the mountain." "You\'ve got her eyes, you know."' },
    { do: 'emote', who: 'player', emote: '<3' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{crying}...You just stayed.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'emote', who: 'ves', emote: '<3' },
    { do: 'say', who: 'ves', text: '{shy}I\'m sorry I was horrible at the cairn. I didn\'t want anyone with me. If I came up alone, I could be the one who didn\'t need anybody.\n\n{smile}That was stupid. I needed somebody to hold on to my boot.' },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{resolute}We\'ll rest here. Then we go on and finish her lamps.\n\n{shy}Together. If you... if that\'s alright.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'ves', text: '{laughing}...You\'ve got a very strong grip, you know. For someone who never says anything.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{tender}You should get some rest. Take the cot. It was hers... she\'d want somebody to use it.\n\n{thoughtful}I\'m going to sit up a while. I need to think.' },
    { do: 'walk', who: 'ves', to: { x: 3, y: 7 } },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 1.2 },
    { do: 'wait', seconds: 0.6 },
  ],
};
