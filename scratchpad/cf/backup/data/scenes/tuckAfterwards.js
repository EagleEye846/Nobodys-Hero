// AFTER THE CREDITS: a stinger. Played last of all in chapter 4 (after the
// card and the credits, before the title screen: see `postCredits` on the
// end_chapter step in out_into_the_light), whichever way the fight with the king
// ended.
//
// The hall after the collapse, dim and quiet, nobody left in it but Tuck. He
// is tidying up: a few steps, a stop, a look at the empty place where the
// throne stood, a small practice of nothing in particular. Light from
// outside lies up the floor from the great doorway at the south end. Then
// somebody steps into that light, out past the doorway, and their shadow
// looms in: a long figure stretching up the floor toward him, growing as
// they come, till its head falls across him. We never see who it belongs to,
// and it gives nothing away: just the dark shape of somebody, and the light
// round it dimmed. Tuck turns round. "...You?"
// And hard to black. A beat of silence. Then the title.
//
// (Same scene however the duel went, so it never reads rumbold_spared or
// rumbold_defeated. The hero and Ves stay out of it: the party waits out of
// sight and the hero is hidden.)
const TUCK_START = { x: 12, y: 13 };
// The middle of the great doorway's threshold, where the light comes in.
const DOOR = { x: 13, y: 22 };

export const TUCK_AFTERWARDS = {
  id: 'tuck_afterwards',
  room: 'belowtown_collapse',
  // Plays here by itself (the room's own doorway trigger never fires).
  spawn: { x: 13, y: 3 },
  once: false,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: TUCK_START.x, y: TUCK_START.y, portrait: 'tuck', animation: 'bf_tuck', speed: 0.5 },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'leave', who: 'player', instant: true },
    // Low enough to see the doorway at the south end, and him in the hall.
    { do: 'camera', to: { x: 13, y: 16.5 } },
    // Black to start: the room comes up slowly out of it, dim, with
    // nobody about, and the light from outside lying in through the doorway.
    { do: 'stage', dim: 1, doorway: { at: DOOR, w: 5, length: 12, seconds: 2.2 } },
    { do: 'stage', dim: 0.5, seconds: 2.2 },
    { do: 'wait', seconds: 2.6 },

    // Tidying: small steps, a stop, a look at where the throne was.
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_right', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: { x: 14, y: TUCK_START.y } },
    { do: 'animate', who: 'tuck' },
    { do: 'wait', seconds: 0.7 },
    { do: 'face', who: 'tuck', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'act', who: 'tuck', act: 'sigh' },
    { do: 'animate', who: 'tuck', animation: 'bf_tuck_walk_left', speed: 0.22 },
    { do: 'walk', who: 'tuck', to: TUCK_START },
    { do: 'animate', who: 'tuck' },
    { do: 'wait', seconds: 1.2 },
    { do: 'act', who: 'tuck', act: 'look' },
    { do: 'wait', seconds: 0.8 },

    // Somebody steps into the light outside: their shadow looms in at the
    // doorway and stretches up the floor, slowly, and doesn't stop until its
    // head is over him.
    { do: 'stage', shadow: { at: { x: TUCK_START.x, y: TUCK_START.y - 1.2 }, seconds: 5 } },
    { do: 'wait', seconds: 3.2 },
    // The light's gone dimmer. He turns round to the door.
    { do: 'face', who: 'tuck', dir: 'down' },
    { do: 'act', who: 'tuck', act: 'startle' },
    { do: 'wait', seconds: 2.6 },
    { do: 'say', who: 'tuck', text: '{surprised}...You?' },

    // Hard cut to black, and a held beat of nothing.
    { do: 'stage', shadow: null, doorway: null, dim: 1, seconds: 0 },
    { do: 'stage', spots: [] },
    { do: 'leave', who: 'tuck', instant: true },
    { do: 'wait', seconds: 3 },
    { do: 'go_on' },
  ],
};
