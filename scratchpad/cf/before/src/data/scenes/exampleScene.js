// EXAMPLE SCENE: made to show how cutscenes work. Edit it in the Cutscene
// Maker (tools/), or copy it. Put a Cutscene trigger in a room (Room Editor,
// Place) to play it when the player steps there.
export const EXAMPLE_SCENE = {
  // Triggers in rooms name the scene by this id.
  id: 'example_scene',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'ruins_entrance',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player. `look` is a prop
  // sprite (prop:keeper) or an enemy (enemy:columneon); `portrait` shows their
  // face when they talk; `hidden` ones wait off-stage until an `appear` step.
  actors: [
    { id: 'keeper', look: 'prop:keeper', x: 1, y: 12, portrait: 'old_keeper', hidden: true },
  ],

  // What happens, in order. `who` is 'player' or an actor's id; tile
  // coordinates are like the room's. A `say` step's text has one page per
  // blank-line-separated block, like the text files.
  steps: [
    { do: 'appear', who: 'keeper' },
    { do: 'walk', who: 'keeper', to: { x: 4, y: 12 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'emote', who: 'keeper', emote: '!' },
    { do: 'say', who: 'keeper', text: 'Ah. You found your feet.\n\nThe Ruins are quiet today. Stay close to the light.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'walk', who: 'keeper', to: { x: 1, y: 12 } },
    { do: 'leave', who: 'keeper' },
  ],
};
