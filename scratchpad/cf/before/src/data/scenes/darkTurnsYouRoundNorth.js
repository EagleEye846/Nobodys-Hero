// THE DARK TURNS YOU ROUND (north corridor; Ves stands by its mouth): the two corridors off the fork in the First Dark
// (north, narrow at (23,7); south, narrow at (24,11)), the ones the older cairns point down. It goes on, and bends, and
// bends again, and comes out where it began: the fork.
// Nothing hurts; you are just back (the room starts again at the fork), a
// little wiser about whose pebbles to believe.
export const DARK_TURNS_YOU_ROUND_NORTH = {
  // Triggers in rooms name the scene by this id.
  id: 'dark_turns_you_round_north',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_first_dark',
  // false: it plays every time you step on its trigger, not just the first time.
  once: false,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 22, y: 7, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'textbox', top: true },
    { do: 'say', text: 'The corridor goes up, and on, and bends, and bends again. The floor is the same floor. The wall is the same wall. After a while you could swear you have passed that crack before.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{thoughtful}I have passed that crack before.\n\n{bored}Right. I think that was the dark having a laugh.' },
    { do: 'say', text: 'Round the last bend are small piles of stones, one with pale pebbles and some with dark. You are back at the fork, and the pale pebbles are pointing the way you came.' },
    { do: 'goto', room: 'deep_first_dark', spawn: { x: 21, y: 8 } },
  ],
};
