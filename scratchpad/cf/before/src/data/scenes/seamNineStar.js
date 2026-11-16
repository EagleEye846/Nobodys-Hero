// SEAM NINE'S STAR (draft): the first time you get into Seam Nine, the seam
// that isn't on any map. Mattock's grandad's grandad said he saw a star come
// down through the roof of the Old Seam and on into Seam Nine, and that they
// shut it up after and hung a BROKEN sign on the lever. The shaft you came
// down is the hole it made. At the back of the room, the Deep Star Shard
// hums, and the sword answers it. (Chapter 4's superboss: that sliver is only the
// tip of it. The crack runs on out of the south-west corner and down, and the real
// shard is at the bottom, with whatever is guarding it: see diggingsStarPool.js.)
// Only after the_two_the_king_sent, where Mattock starts the story and Sedge stops him.
//
// Clearance: the walks stay in columns 13 and 14 between rows 1 and 9 (the
// shaft and the cart stub); the slagling patrols row 11 from x 16 to 23.
export const SEAM_NINE_STAR = {
  // Triggers in rooms name the scene by this id.
  id: 'seam_nine_star',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'diggings_lost_seam',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 1, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 14, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 7 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The shaft you came down isn\'t like the other shafts. No timbers. No pick marks.\n\nJust a hole, straight down through the rock, glassy at the edges, as if something very hot had come through it in a hurry.' },
    { do: 'say', who: 'ves', text: '{surprised}Seam Nine. The one that isn\'t on any map.' },
    { do: 'say', who: 'ves', text: '{glee}Mattock\'s grandad\'s grandad wasn\'t making it up. Something came down through the roof.' },
    { do: 'wait', seconds: 0.4 },
    // At the back of the room, the sliver in its crack, and the crack running on.
    { do: 'camera', to: { x: 5, y: 11 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    // (draft)
    { do: 'say', text: "At the back of the room, something wedged in a crack gives off a thin, cold light. It hums. The sword answers it.\n\nBut it's only a sliver, no bigger than a fingernail. The hum isn't coming from it. It's coming up out of the crack, from a long way down, and the crack runs on out of the corner and into the floor." },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{thoughtful}And then they shut it all up, and hung a sign on the lever that said BROKEN.' },
    { do: 'say', who: 'ves', text: '{bored}You don\'t put a sign on a lever that\'s broken. {smile}You put one on a lever you don\'t want pulled.' },
    // (draft)
    { do: 'say', who: 'ves', text: "{thoughtful}Though a sliver that size doesn't hum at a sword from this far off. The rest of it's down there somewhere." },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{smile}Somebody sealed that crack on purpose, and somebody wrote it down. They always write it down. Check the roster by the hats.' },
    { do: 'wait', seconds: 0.3 },
  ],
};
