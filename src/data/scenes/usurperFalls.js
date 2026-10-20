// USURPER FALLS: after you beat the Usurper on the summit (the `defeated` of
// his battle step). He's dropped the stolen blade in the snow, and he's
// hunched over, clutching his sides, laughing. He lunges, grabs Ves (a
// `hold`: she's still her own actor, playing 'ves_held' and then
// 'ves_held_over' in step with him), and drags her to the very edge. He
// looks back at you once; then, dying, he slumps over backwards off the
// mountain with her in his grip, and the camera watches them go. A beat of
// silence. Then "Reach": the hero sprints for the edge, crouches, and dives. The fall fades in (the 'fall' vision in
// src/overworld/visions.js, in the spirit of the opening of Tears of the
// Kingdom): the plunge, the reach, her fingers an inch from yours, the miss,
// her umbrella slipping free; then the trees rushing up. Black. Credits.
// The lines are drafts, to be rewritten.
export const USURPER_FALLS = {
  // Triggers in rooms name the scene by this id.
  id: 'usurper_falls',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_summit',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 17, y: 13, portrait: 'vesper', plays: 'vesper' },
    { id: 'usurper', look: 'anim:usurper_laugh', x: 15, y: 10, animation: 'usurper_laugh', speed: 0.14 },
    // The blade he stole, dropped point-first in the snow.
    { id: 'blade', look: 'anim:usurper_blade', x: 12, y: 11, animation: 'usurper_blade', speed: 0.8 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'usurper', text: 'Heh. Heh heh heh...' },
    { do: 'say', who: 'usurper', text: 'HAHAHAHAHA!', shake: true },
    { do: 'say', who: 'usurper', text: 'Look at you. Not one word, the whole way up. Not one.\n\nSome Hero.' },
    { do: 'say', who: 'usurper', text: 'She screamed, you know. Your mother. Right about where you\'re standing.\n\nAnd then the light went out.' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'ves', text: '{furious}Don\'t you DARE talk about her!' },
    { do: 'say', who: 'usurper', text: 'If I am not the Hero...' },
    // He lunges, and he has her.
    { do: 'animate', who: 'usurper', animation: 'usurper_lunge', speed: 0.1 },
    { do: 'walk', who: 'usurper', to: { x: 17, y: 13 }, fast: true, keep: true },
    { do: 'sound', name: 'hit' },
    { do: 'hold', who: 'usurper', what: 'ves' },
    { do: 'animate', who: 'usurper', animation: 'usurper_grab', speed: 0.12 },
    { do: 'animate', who: 'ves', animation: 'ves_held', speed: 0.12 },
    { do: 'say', who: 'ves', text: '{scared}Let go! LET GO OF ME!', shake: true },
    { do: 'emote', who: 'player', emote: '!' },
    // He drags her to the very edge, slow, dying, the camera on them.
    { do: 'camera', who: 'usurper' },
    { do: 'walk', who: 'usurper', to: { x: 29, y: 11 }, keep: true },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{crying}Please...!', shake: true },
    { do: 'say', who: 'usurper', text: '...then there will be no Hero at all.' },
    { do: 'wait', seconds: 0.8 },
    // He slumps over backwards off the mountain, with her in his grip.
    { do: 'camera', to: { x: 27, y: 11 } },
    { do: 'animate', who: 'usurper', animation: 'usurper_slump', speed: 0.2, once: true },
    { do: 'animate', who: 'ves', animation: 'ves_held_over', speed: 0.2, once: true },
    { do: 'wait', seconds: 1.2 },
    { do: 'sound', name: 'flare' },
    { do: 'walk', who: 'usurper', to: { x: 30, y: 12 }, fast: true, keep: true },
    { do: 'walk', who: 'usurper', to: { x: 31, y: 18 }, fast: true, keep: true },
    { do: 'leave', who: 'usurper' },
    { do: 'leave', who: 'ves' },
    // A beat of nothing.
    { do: 'wait', seconds: 1.2 },
    // Then the hero runs, and dives.
    { do: 'music', song: 'freefall' },
    { do: 'camera' },
    { do: 'walk', who: 'player', to: { x: 27, y: 11 }, fast: true },
    { do: 'animate', who: 'player', animation: 'player_dive', speed: 0.11, once: true },
    { do: 'walk', who: 'player', to: { x: 29, y: 11 }, fast: true },
    { do: 'walk', who: 'player', to: { x: 31, y: 12 }, fast: true },
    { do: 'walk', who: 'player', to: { x: 32, y: 16 }, fast: true },
    { do: 'vision', name: 'fall', mood: 'plunge', fade: 0.5 },
    { do: 'wait', seconds: 3.6 },
    { do: 'vision', name: 'fall', mood: 'reach' },
    { do: 'wait', seconds: 3.2 },
    { do: 'vision', name: 'fall', mood: 'miss' },
    { do: 'wait', seconds: 2.8 },
    { do: 'vision', name: 'fall', mood: 'trees' },
    { do: 'wait', seconds: 3.2 },
    { do: 'music', song: null },
    // She went over the edge without you: she isn't with you any more.
    { do: 'leave_party', who: 'vesper' },
    { do: 'wait', seconds: 1.5 },
    // Black, and the credits: "Nobody's Hero", then Chapter Two's card; then
    // Chapter 3, waking where you fell, in the scarlet forest below.
    { do: 'end_chapter', credits: { song: 'creditsVigil', text: 'credits_vigil.txt' }, card: 'chapter_end_vigil.txt', room: 'pinefall_landing', spawn: { x: 10, y: 9 } },
  ],
};
