// BELL FOUND (DRAFT): once, the first time you come up off the bar onto the Watch Rock (wreck_watch_rock, the rock in front
// of the bell, x 19-24, rows 6-9). The Fair Return's fog bell hangs on the fog-watch's stump, its rope tied up short. You haul
// it, and it swings without a sound: its tongue is gone. A tin tag on the arm says where (the Drowned Rat's doorstop, in
// Saltcombe, though it only says "where it's dry and the door's never shut"). After this the inn's doorstop can be had.
// The hero walks to the bell (23,6); Ves and Bramble come from where they were following and stay where they are. No
// monsters on the rock. The hero never speaks.
export const BELL_FOUND = {
  id: 'bell_found',
  room: 'wreck_watch_rock',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 18, y: 7, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'camera', to: { x: 23, y: 5 } },
    { do: 'walk', who: 'player', to: { x: 23, y: 6 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: 'On the stump of the old fog-watch\'s beacon, on an iron arm leaded into the stone, hangs a ship\'s bell. It is green with salt. Its rope has been taken up short and tied off round the arm, so nobody could pull it by accident.\n\nCast round its waist, under the green: IN FOG, RING FOR THE FAIR RETURN.' },
    { do: 'say', text: 'You untie the rope and haul.' },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The bell swings out over the water, heavy and slow, and back. It makes no sound at all.\n\nInside it, where the tongue should hang, there is only an empty iron eye.' },
    { do: 'say', who: 'bramble', text: '{surprised}It didn\'t ring. Why didn\'t it RING?' },
    { do: 'say', text: 'Wired to the arm there is a strip of tin, scratched in big careful capitals:\n\nHER TONGUE IS TOOK HOME, WHERE IT\'S DRY AND THE DOOR\'S NEVER SHUT. LET HER BE.\n\nTHE FOG-WATCH' },
    { do: 'say', who: 'ves', text: '{thoughtful}Dry. And a door that\'s never shut. ...Where\'s dry, on this coast? Nothing\'s dry.' },
    { do: 'say', who: 'bramble', text: '{glee}The Drowned Rat! Its door\'s never shut! Nobody\'s turned away from the Drowned Rat!\n\n{worried}...Do we HAVE to give it its tongue back?' },
    { do: 'say', who: 'ves', text: '{smile}Yes. It\'s a bell. It wants ringing.\n\n{angry}...And I was just about to say the Drowned Rat.' },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
