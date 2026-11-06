// INTO BELOWTOWN: the gate of the buried town. A banner over it says
// WELLCOME, and half the town has crowded the road to look at you, and none of
// them can stop asking whether you're the Hero come back. (In Lasthome nobody
// asked. Here they can't stop.) Ves catches the words that matter: "come
// back". They've seen one before.
//
// The crowd are the gate's own folk (their props, cast as actors for the
// scene); they stay where they stand, east of the gate, well clear of the road
// along row 8 that the scene walks (x 1 to 13).
export const INTO_BELOWTOWN = {
  // Triggers in rooms name the scene by this id.
  id: 'into_belowtown',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_gate',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'tuck', look: 'prop:bf_tuck', x: 10, y: 8, portrait: 'tuck', hidden: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'mole', look: 'prop:bf_mole_miner_a', x: 20, y: 7, plays: 'bt_gate_mole' },
    { id: 'kid', look: 'prop:bf_frog_kid_a', x: 19, y: 9, plays: 'bt_gate_frogkid' },
    { id: 'kid2', look: 'prop:bf_frog_kid_b', x: 21, y: 10, plays: 'bt_gate_frogkid2' },
    { id: 'bow', look: 'prop:bf_mole_miner_b', x: 22, y: 6, plays: 'bt_gate_mole2' },
    { id: 'newt', look: 'prop:bf_newt_guard', x: 13, y: 5, plays: 'bt_gate_newt' },
    { id: 'beetle', look: 'prop:bf_beetle_postman', x: 26, y: 6, plays: 'bt_gate_beetle' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 7, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 6, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'appear', who: 'tuck', at: { x: 10, y: 8 } },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'camera', to: { x: 19, y: 8 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'A banner hangs over the gate. It says WELLCOME. Under it, half of Belowtown has crowded onto the road to look at you.' },
    { do: 'act', who: 'mole', act: 'startle' },
    { do: 'say', who: 'mole', text: 'Down from the TOP?' },
    { do: 'act', who: 'kid', act: 'hop' },
    { do: 'say', who: 'kid', top: true, text: 'Is it them? Is it the Hero, come back?' },
    { do: 'say', who: 'kid2', top: true, text: 'Two of them, though. The Hero was only one.' },
    { do: 'act', who: 'bow', act: 'look' },
    { do: 'say', who: 'bow', text: 'Maybe the Hero\'s brought a friend. I ironed my tie for this.' },
    { do: 'act', who: 'beetle', act: 'startle' },
    { do: 'say', who: 'beetle', text: '*parp*' },
    { do: 'say', who: 'mole', text: 'Ask them! Somebody ask them!' },
    { do: 'act', who: 'newt', act: 'shake' },
    { do: 'say', who: 'newt', text: 'Hold the line! Please! ...It\'s more of a crowd, really. Hold the crowd!' },
    { do: 'camera', who: 'tuck' },
    { do: 'face', who: 'tuck', dir: 'right' },
    { do: 'emote', who: 'tuck', emote: 'sweat' },
    { do: 'say', who: 'tuck', text: '{worried}Please, everyone, His Majesty will... His Majesty says...' },
    { do: 'say', who: 'kid', top: true, text: 'IS IT THE HERO?!' },
    { do: 'say', who: 'tuck', text: '{scared}...Please...' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{surprised}Did you hear that? "Come back."' },
    { do: 'say', who: 'ves', text: '{determined}Tuck wasn\'t slipping. They really have seen one before.' },
    { do: 'say', who: 'ves', text: '{bored}Also, "Wellcome". {laughing}Two Ls. They really mean it.' },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'say', who: 'tuck', text: '{shy}This way. Please. Everyone. Um. Mind the... everyone.' },
    { do: 'walk', who: 'tuck', to: { x: 13, y: 8 } },
    // On ahead, out of the picture, rather than fading out where he stands.
    { do: 'walk', who: 'tuck', to: { x: 21, y: 8 }, fast: true },
    { do: 'leave', who: 'tuck' },
    { do: 'wait', seconds: 0.4 },
  ],
};
