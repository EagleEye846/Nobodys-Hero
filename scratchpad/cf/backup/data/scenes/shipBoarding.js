// SHIP BOARDING (DRAFT): once, the first time you walk out along the quay towards the Fair Return (ship_plank, trigger across the quay at
// x 18, rows 5-11; reached from the slip's fog bell, ship_looms). Her gangway is hauled up against her rail on its davit
// (gs_gangway_up, and the gap under it shut, gs_rail_gap at 24, rows 7-8, `until` this scene). Nobody is at her rail, but the
// crew sing you aboard with their shanty "Port Tomorrow" (C C D Eb D ..., stopping a note short of home, the last C never sung),
// a voice from the rigging asks you up, and her gangway swings down on its own (you watch it fall: gs_gangway_swing) and lands
// across the quay with a thump. When the scene ends it lies there and the way up is open. Reworked 12 November (Patrick's picks:
// the gangway drops for you, a creepy invitation, the crew singing you aboard and stopping a note short); the swing added 14 November.
// Ves (17,5) and Bramble (17,10) stand on the quay behind
// you, clear of the barrels (15,7), the bollard (22,9) and the mooring post (21,11). No monsters in this room. The hero never speaks.
export const SHIP_BOARDING = {
  id: 'ship_boarding',
  room: 'ship_plank',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 17, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 17, y: 10, portrait: 'bramble', plays: 'bramble' },
    // Her gangway, hauled up against her rail: takes the place of the room's gs_gangway_up (cast 'gangway') and swings down.
    { id: 'gangway', look: 'prop:gs_gangway_up', x: 19, y: 9, plays: 'gangway', centered: true },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'camera', to: { x: 25, y: 7 } },
    { do: 'say', text: 'The quay stops at a wall. It is the side of a ship: a great black brig with all her masts and all her ropes, dry in a yard full of wrecks. Over a gap in her rail, gilt on black: FAIR RETURN.\n\nHer gangway is hauled up and lashed against her side. There is nobody at her rail.' },
    { do: 'wait', seconds: 0.8 },
    // The crew's shanty, from the deck, low and slow: Port to-mor-row... and the last note never comes.
    { do: 'sing', notes: [60, 60, 62, 63, 62], step: 0.8 },
    { do: 'wait', seconds: 4.6 },
    { do: 'say', text: 'Then, from up on her deck, men\'s voices. Low and slow and all together, the way a crew sings at the end of a watch:\n\nPort... to... mor... row...\n\nAnd it stops. A note short of the end, as if nobody aboard had ever learned how it finishes.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}...They didn\'t finish it.' },
    { do: 'say', who: 'ves', text: '{angry}...Nobody stops a song there. You can\'t. It itches.' },
    { do: 'haunt', whisper: '...come aboard...' },
    { do: 'wait', seconds: 1.0 },
    { do: 'say', text: 'A voice comes down out of the rigging. It is glad and easy, the voice of somebody who has been expecting you for a long time and does not hold it against you:\n\n"COME ABOARD, THEN. WE KEPT YOUR PLACE."' },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'creak' },
    { do: 'wait', seconds: 0.5 },
    // The hoist line runs free, and the gangway swings down (gs_gangway_swing, 0.08 s a frame): slow, then
    // faster and faster, flat on the quay 1.12 s in, a puff of spray, a kick up off the stones, and still.
    { do: 'sound', name: 'gangwayLetGo' },
    { do: 'animate', who: 'gangway', animation: 'gs_gangway_swing', speed: 0.08, once: true },
    { do: 'wait', seconds: 1.12 },
    { do: 'sound', name: 'gangwayThump' },
    { do: 'quake', seconds: 0.4, amount: 2 },
    { do: 'wait', seconds: 0.9 },
    { do: 'say', text: 'The lashings let go by themselves. Her gangway swings down off her side, slow, then all at once, and lands on the quay at your feet with a thump. It is wet. Nobody touched it.' },
    { do: 'say', who: 'bramble', text: '{worried}Our place. They kept OUR place. Who told them we were coming?' },
    { do: 'say', who: 'ves', text: '{smile}You rang the bell. ...I\'d like it noted that it was you who rang the bell.' },
    { do: 'camera' },
    // (The gangway lying on the quay is the room's own from here on: gs_gangway_down, `after` this scene.)
    { do: 'leave', who: 'gangway', instant: true },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
