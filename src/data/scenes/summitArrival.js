// SUMMIT ARRIVAL: stepping up onto the summit. A whiteout, and fog so thick
// you can hardly see the beacon. At the very edge, with nothing beyond him
// but sky, a dark shape with its back to you, looking out over the
// mountain: the Usurper (src/data/art/usurper.js). He sweeps his arm out,
// and the storm stops: the snow fades out of the air and the fog lifts (the
// room's weather stays still after this; see `weatherUntil` in
// vigilSummit.js). Only then does he turn round, to his theme ("A Crown of
// Cold Iron"). He throws her lantern down: it arcs, bounces twice and skids
// to a stop in the snow (it stays there; see the room's props), and he
// comes at you.
// The lines here are drafts, to be rewritten. It ends in the fight
// (src/data/enemies/usurper.js); beating him plays usurper_falls.
// Plays once, at the top of the stair (vigilSummit.js).
export const SUMMIT_ARRIVAL = {
  // Triggers in rooms name the scene by this id.
  id: 'summit_arrival',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'vigil_summit',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 16, y: 17, portrait: 'vesper', plays: 'vesper' },
    // At the very edge of the summit, the sky beyond him.
    { id: 'usurper', look: 'anim:usurper_brood', x: 23, y: 2, animation: 'usurper_brood', speed: 0.6 },
    // Her lantern, once he's thrown it.
    { id: 'lantern', look: 'anim:usurper_lantern', x: 21, y: 2, hidden: true, animation: 'usurper_lantern', speed: 0.07 },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 15, y: 13 } },
    { do: 'walk', who: 'ves', to: { x: 16, y: 14 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Snow and fog, so thick you can hardly see the beacon in front of you.' },
    // A dark shape at the very edge, its back to you.
    { do: 'camera', to: { x: 21, y: 5 } },
    { do: 'wait', seconds: 2.2 },
    { do: 'say', who: 'ves', text: '{worried}...There\'s someone up there. Right on the edge.' },
    { do: 'wait', seconds: 1.2 },
    // He sweeps his arm out, and the storm stops.
    { do: 'animate', who: 'usurper', animation: 'usurper_swish', speed: 0.3, once: true },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'flare' },
    { do: 'weather', to: 0, seconds: 3.5 },
    { do: 'wait', seconds: 4 },
    { do: 'say', text: 'The snow stops. All of it, all at once, hanging in the air, then gone.' },
    { do: 'wait', seconds: 1.2 },
    // Only then does he turn round.
    { do: 'music', song: 'usurper' },
    { do: 'animate', who: 'usurper', animation: 'usurper_idle', speed: 0.3 },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'usurper', text: 'So. The village sent someone up after all.\n\nA little late. A hundred years late.' },
    { do: 'say', who: 'usurper', text: 'Do you know what this is?\n\nIt was hers. The lamplighter\'s. She was going to light that beacon, so a Hero could find his way up.' },
    { do: 'say', who: 'usurper', text: 'But a Hero was already here.' },
    // He throws her lantern down: up, over, bouncing, skidding to a stop in the snow.
    { do: 'animate', who: 'usurper', animation: 'usurper_toss', speed: 0.16, once: true },
    { do: 'wait', seconds: 0.45 },
    { do: 'appear', who: 'lantern', at: { x: 22, y: 1 } },
    { do: 'toss', who: 'lantern', to: { x: 18, y: 9 }, height: 46, bounces: 2 },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{furious}That\'s... that\'s MUM\'S!' },
    { do: 'animate', who: 'usurper', animation: 'usurper_idle', speed: 0.3 },
    { do: 'camera' },
    // And he comes at you.
    { do: 'animate', who: 'usurper', animation: 'usurper_charge', speed: 0.1 },
    { do: 'walk', who: 'usurper', to: { x: 15, y: 11 }, fast: true, keep: true },
    // The fight. Beat him and usurper_falls plays (usurperFalls.js).
    { do: 'battle', enemy: 'usurper', who: 'usurper', defeated: 'usurper_falls' },
  ],
};
