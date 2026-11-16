// HOMECOMING: back in the square once the light has gone up. The Sunstone
// starts the scene as it was (dim and cracked), shudders, and blazes: a flash
// of white-gold and rings of light rolling out across the town. The square
// erupts: a band of frogs thumping their own bellies, glow-worms dancing, a
// mole shouting THE HERO'S FRIENDS and another correcting him. Ves, for once,
// lets it happen. The old snail (from tucks_whisper) tells the end of his
// story: the Hero came back up the Way Up, slept on the bench, nobody
// thanked him, and he went up the old stair, which fell in after.
// Tuck, in the crowd, isn't cheering: he's looking at the
// throne hall, and he's frightened. A newt guard delivers the king's
// invitation (the duel follows, in the throne hall).
//
// The party is the square's own `after: the_light_goes_up` props, cast as
// actors. The Sunstone prop is cast too, so the scene can show it dim, then
// blazing; the room's lighting comes on when the scene ends, covered by a
// last flare.
export const HOMECOMING = {
  // Triggers in rooms name the scene by this id.
  id: 'homecoming',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'belowtown_square',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'sun', look: 'prop:sunstone', x: 22, y: 4, plays: 'sunstone', animation: 'sunstone_dim_pulse', speed: 1.1 },
    { id: 'tuck', look: 'prop:bf_tuck', x: 31, y: 10, portrait: 'tuck', hidden: true },
    { id: 'guard', look: 'prop:bf_newt_guard', x: 22, y: 5, hidden: true },
    { id: 'bandA', look: 'prop:bf_drummer', x: 19, y: 11, plays: 'bt_band_a' },
    { id: 'bandB', look: 'prop:bf_drummer', x: 21, y: 11, plays: 'bt_band_b' },
    { id: 'danceA', look: 'prop:bf_glowworm', x: 20, y: 14, plays: 'bt_dancer_a' },
    { id: 'danceB', look: 'prop:bf_glowworm', x: 23, y: 15, plays: 'bt_dancer_b' },
    { id: 'kid', look: 'prop:bf_frog_kid_a', x: 25, y: 11, plays: 'bt_sq_party_kid' },
    { id: 'cheerA', look: 'prop:bf_mole_crowd', x: 28, y: 11, plays: 'bt_sq_cheer_a' },
    { id: 'cheerB', look: 'prop:bf_mole_crowd_b', x: 30, y: 8, plays: 'bt_sq_cheer_b' },
    { id: 'cheerC', look: 'prop:bf_mole_crowd_c', x: 12, y: 13, plays: 'bt_sq_cheer_c' },
    { id: 'mole', look: 'prop:bf_mole_miner_a', x: 7, y: 14, plays: 'bt_sq_mole' },
    { id: 'mole2', look: 'prop:bf_mole_miner_b', x: 13, y: 18, plays: 'bt_sq_mole2' },
    // The old snail (bt_sq_snail) from tucks_whisper, with the rest of his story.
    { id: 'snail', look: 'prop:bf_snail_elder', x: 30, y: 14, plays: 'bt_sq_snail' },
  ],

  steps: [
    { do: 'music' },
    { do: 'walk', who: 'player', to: { x: 18, y: 10 } },
    // (On the row above the well, not beside it: the well would hide her.)
    { do: 'walk', who: 'ves', to: { x: 17, y: 10 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    // (Low enough that the Sunstone is still up top and the two of you clear the text box.)
    { do: 'camera', to: { x: 22, y: 8 } },
    { do: 'say', text: 'The Sunstone hangs over the square, as dim as ever, cracked and breathing. The folk look up at it, as they always do. Then it shudders.' },
    { do: 'quake', amount: 2, seconds: 0.8 },
    { do: 'act', who: 'player', act: 'startle', wait: false },
    { do: 'act', who: 'ves', act: 'startle', wait: false },
    { do: 'animate', who: 'sun', animation: 'sunstone_blaze', speed: 0.34, once: true },
    { do: 'wait', seconds: 0.9 },
    { do: 'sound', name: 'flare' },
    { do: 'stage', flare: { at: { x: 22, y: 3 }, seconds: 2.8 } },
    { do: 'music', song: 'belowtown' },
    // The whole town out in the square (AMBIENCES in src/audio/music.js).
    { do: 'ambience', name: 'belowtown_party' },
    { do: 'wait', seconds: 1.4 },

    // The square erupts.
    { do: 'sound', name: 'crowdCheer' },
    { do: 'animate', who: 'bandA', animation: 'bf_drummer', speed: 0.16 },
    { do: 'animate', who: 'bandB', animation: 'bf_drummer', speed: 0.2 },
    { do: 'wait', seconds: 0.3 },
    { do: 'animate', who: 'danceA', animation: 'bf_glowworm', speed: 0.3 },
    { do: 'animate', who: 'danceB', animation: 'bf_glowworm', speed: 0.35 },
    { do: 'animate', who: 'cheerA', animation: 'bf_mole_crowd', speed: 0.3 },
    { do: 'animate', who: 'cheerB', animation: 'bf_mole_crowd_b', speed: 0.38 },
    { do: 'animate', who: 'cheerC', animation: 'bf_mole_crowd_c', speed: 0.33 },
    { do: 'animate', who: 'kid', animation: 'bf_frog_kid_a', speed: 0.3 },
    { do: 'animate', who: 'mole', animation: 'bf_mole_miner_a', speed: 0.3 },
    { do: 'animate', who: 'mole2', animation: 'bf_mole_miner_b', speed: 0.3 },
    // Confetti, and the cheer going through the square in a wave: everyone
    // jumps a beat after the one before, from the band out to the edges, and
    // the two of you jump too.
    { do: 'stage', confetti: 6 },
    ...['bandA', 'bandB', 'danceA', 'danceB', 'kid', 'cheerA', 'cheerB', 'cheerC', 'mole', 'mole2'].flatMap((id) => [
      { do: 'act', who: id, act: 'hop', wait: false },
      { do: 'wait', seconds: 0.11 },
    ]),
    { do: 'act', who: 'ves', act: 'hop', wait: false },
    { do: 'act', who: 'player', act: 'hop' },
    // The camera goes to each shouter (the moles are off the left of the screen).
    { do: 'camera', to: { x: 12, y: 13 } },
    { do: 'act', who: 'mole', act: 'hop' },
    { do: 'say', who: 'mole', text: 'THE HERO\'S FRIENDS!' },
    { do: 'act', who: 'mole2', act: 'hop' },
    // (He's down at the bottom of the screen, so this line goes at the top: the box would hide him.)
    { do: 'say', who: 'mole2', top: true, text: 'No, THE HERO! Two of \'em!' },
    { do: 'say', who: 'cheerC', text: 'WHICH ONE IS THE HERO?!' },
    { do: 'camera', to: { x: 24, y: 10 } },
    { do: 'say', who: 'cheerB', text: 'THE SHORT ONE! NO! THE OTHER SHORT ONE!' },
    { do: 'camera' },
    { do: 'act', who: 'ves', act: 'look' },
    { do: 'say', who: 'ves', text: '{bored}We\'re not... {smile}Oh, let them.' },

    // The old snail's other day: how the Hero came back, and what the town owed him.
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'camera', who: 'snail' },
    { do: 'say', who: 'snail', text: 'Just like last time. Only louder. And I\'m older.' },
    { do: 'say', who: 'snail', text: 'Last time, the light came up and the whole town stood out here staring at it.\n\nAnd then the stair in the south wall, the one that only opens when the root is lit, creaked open, and up out of the Deep came the Hero.' },
    { do: 'say', who: 'snail', text: 'Mud to the eyebrows. Sat down on that bench. Never said a word. Fell asleep sitting up.' },
    { do: 'say', who: 'snail', text: 'Every house in this town is still standing because of him. Every pie. Me.\n\nAnd nobody said thank you. We were all looking up at the light.' },
    { do: 'say', who: 'snail', text: 'When we looked down, the bench was empty, and he was halfway up the old stair, clank, clank.\n\nNot long after, the stair fell in.' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{bored}You could start with us.\n\n{smile}We take thank-yous. And pies.' },

    // Tuck, in the crowd, not cheering.
    { do: 'appear', who: 'tuck', at: { x: 31, y: 10 } },
    { do: 'camera', who: 'tuck' },
    { do: 'face', who: 'tuck', dir: 'left' },
    { do: 'wait', seconds: 0.6 },
    { do: 'act', who: 'tuck', act: 'shiver' },
    { do: 'say', text: 'In the crowd, one small figure in a tabard that\'s too big for him is not cheering. Tuck is looking at the doors of the throne hall. He looks frightened.' },
    { do: 'camera' },

    // The invitation.
    { do: 'appear', who: 'guard', at: { x: 22, y: 5 } },
    { do: 'walk', who: 'guard', to: { x: 22, y: 8 }, fast: true },
    { do: 'walk', who: 'guard', to: { x: 20, y: 8 }, fast: true },
    { do: 'walk', who: 'guard', to: { x: 19, y: 10 }, fast: true },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'guard', dir: 'left' },
    // Out of breath: he ran the whole way down from the hall.
    { do: 'act', who: 'guard', act: 'sigh' },
    { do: 'say', who: 'guard', text: 'His Majesty requests your presence. At once. Immediately. And also now.' },
    { do: 'say', who: 'ves', text: '{bored}...That doesn\'t sound like a party invitation.' },
    // (draft) The last-chance warning for chapter 4's forging and its secret (the whistle pieces, the shard under Seam Nine, Hobnail): nobody comes back from that hall.
    { do: 'say', who: 'ves', text: '{thoughtful}Before we answer it. I don\'t like that door. If there\'s anything left to do in Belowtown, or down in the Diggings, the forge, a loose end, I\'d do it first.' },
    { do: 'leave', who: 'tuck' },
    { do: 'leave', who: 'guard' },

    // Back to the room as it is: the Sunstone blazing, the band still playing.
    { do: 'animate', who: 'sun', animation: 'sunstone_bright_pulse', speed: 0.5 },
    { do: 'stage', flare: { at: { x: 22, y: 3 }, seconds: 1.6 } },
    { do: 'wait', seconds: 0.35 },
  ],
};
