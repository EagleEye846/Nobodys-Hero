// THE SONG COMES IN: the upper hall (lastlight_upper) is silent on the way in. Partway across, on the
// east pocket, the tower's song starts, very faintly, from somewhere above. A music box, running down.
// One line, then the song stays on in this room (the room's `musicAfter` is this scene).
// (draft).
export const LASTLIGHT_SONG = {
  // Triggers in rooms name the scene by this id.
  id: 'lastlight_song',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lastlight_upper',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [],

  steps: [
    { do: 'music', song: 'lastlight' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', text: 'Somewhere above you, very faintly, something has started to play. A music box, running down.' },
  ],
};
