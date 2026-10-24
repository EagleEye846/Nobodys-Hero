// THE HEALER: Bryony takes one look at Ves's leg and puts her to bed. She'll
// keep it, but she won't be running anywhere for a long time. Everybody stays
// the night. Ves comes off your back for the first time since the stilt hut,
// and goes on the cot by the wall (she leaves the party till morning: see
// ves_on_her_feet).
export const THE_HEALER = {
  // Triggers in rooms name the scene by this id.
  id: 'the_healer',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_healer',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bryony', look: 'prop:lh_bryony', x: 4, y: 4, portrait: 'bryony', plays: 'lh_bryony' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 10, portrait: 'bramble', plays: 'bramble' },
    // Ves, on your back until she's on the cot.
    { id: 'ves', look: 'prop:bed_ves_sitting', x: 9, y: 4, portrait: 'vesper', hidden: true },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 7, y: 7 } },
    { do: 'walk', who: 'bramble', to: { x: 6, y: 8 } },
    { do: 'walk', who: 'bryony', to: { x: 6, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bryony', dir: 'down' },
    { do: 'say', who: 'bryony', text: '{stern}Well, don\'t stand in the door letting the warm out.\n\n{worried}...Is that a leg? Let me see that leg.' },
    { do: 'say', who: 'ves', text: '{angry}It\'s FINE.' },
    { do: 'say', who: 'bryony', text: '{stern}It\'s not fine. I can see it\'s not fine from over here. On the cot with her.' },
    { do: 'walk', who: 'player', to: { x: 8, y: 6 } },
    { do: 'face', who: 'player', dir: 'right' },
    // Off your back at last, and onto the cot.
    { do: 'piggyback', who: null },
    { do: 'leave_party', who: 'vesper' },
    { do: 'appear', who: 'ves' },
    { do: 'walk', who: 'bryony', to: { x: 8, y: 5 } },
    { do: 'face', who: 'bryony', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Bryony unwinds the strip of coat from Ves\'s leg, very gently, and looks at it for a long moment, and says nothing.' },
    { do: 'say', who: 'bryony', text: '{thoughtful}Two days on this, and a fen.\n\n{tender}You\'re either very brave or very silly, my love, and I think you\'re both.' },
    { do: 'sound', name: 'select' },
    { do: 'say', who: 'bryony', text: '{smile}There. Splinted. You\'ll keep it. But you won\'t be running anywhere this side of winter.' },
    { do: 'say', who: 'ves', text: '{shy}...Thank you.' },
    { do: 'face', who: 'bryony', dir: 'down' },
    { do: 'say', who: 'bryony', text: '{stern}She stays the night. So do you, all of you. That cot by the wall is yours.' },
    { do: 'say', who: 'bramble', text: '{surprised}What about me?' },
    { do: 'say', who: 'bryony', text: '{laughing}You can sleep on the rug with the cat.' },
    { do: 'say', who: 'bramble', text: '{thinking}...There isn\'t a cat.' },
    { do: 'say', who: 'bryony', text: '{smile}Then you\'ll have the rug to yourself.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Bryony gives Ves something bitter to drink, and a minute later she\'s asleep.\n\nThe town\'s still awake outside. You can look round, and come back to the cot when you\'re ready.' },
    { do: 'leave', who: 'ves' },
  ],
};
