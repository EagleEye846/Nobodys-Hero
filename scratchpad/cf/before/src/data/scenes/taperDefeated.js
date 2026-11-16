// TAPER DEFEATED: you fought her until her flame went out. She's down on one
// knee (as the battle left her), says goodbye, and her flame gutters out; she
// melts into a pool of wax under her shawl, which stays in the room (the
// taper_remains prop in wayOut.js). Her home is cold and empty after this
// (see the "Shows up" settings in taperHome.js).
export const TAPER_DEFEATED = {
  // Triggers in rooms name the scene by this id.
  id: 'taper_defeated',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'way_out',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  actors: [
    { id: 'taper', look: 'prop:taper_kneel', x: 32, y: 4, portrait: 'mother_taper' },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'music', song: 'taperFarewell' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'taper', face: 'exhausted', text: 'Heh... look at you. Such strong roots...\n\nStronger than any of them...' },
    { do: 'emote', who: 'taper', emote: '...' },
    { do: 'say', who: 'taper', text: '{sad}Go on, then, sprout. Grow somewhere bright.\n\n{beaten}Just... not toward that light. Promise me...' },
    { do: 'wait', seconds: 1 },
    // Her flame flickers, gutters and goes out, and she melts away.
    { do: 'animate', who: 'taper', animation: 'taper_death', speed: 0.7, once: true },
    { do: 'wait', seconds: 7.5 },
  ],
};
