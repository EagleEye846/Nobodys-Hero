// LASTHOME NIGHT: asleep on the healer's cot, you dream the fall again: the
// plunge, the reach, the miss. Then you're awake in the dark, and Ves is
// awake too (she keeps dreaming it as well), and tells you what she saw on
// the way down, cheerfully enough for someone with a hurt leg: you, falling into the trees; her shouting, with no name to shout;
// and the thing that came out of the trees after her shadow. In the morning,
// she's up (ves_on_her_feet).
export const LASTHOME_NIGHT = {
  // Triggers in rooms name the scene by this id.
  id: 'lasthome_night',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'lasthome_healer',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,
  // The scene for waking up from this dream.
  wakeScene: 'ves_on_her_feet',

  // Ves, in the dark, on the other cot: she talks, but you can't see her.
  actors: [
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'wait', seconds: 1.5 },
    { do: 'vision', name: 'fall', mood: 'plunge', fade: 0.5 },
    { do: 'wait', seconds: 3 },
    { do: 'vision', name: 'fall', mood: 'reach' },
    { do: 'wait', seconds: 2.6 },
    { do: 'vision', name: 'fall', mood: 'miss' },
    { do: 'wait', seconds: 2.4 },
    { do: 'vision' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'ves', text: '{smile}...Psst. You awake? You were kicking like a frog.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}Dreaming about the fall? Me too. I keep doing it.\n\n{surprised}I saw you go, you know. Straight down into the trees.' },
    { do: 'say', who: 'ves', text: '{worried}The wind grabbed the umbrella and yanked me sideways, and I yelled after you.\n\n{laughing}I didn\'t even know what to yell. You haven\'t got a name. So I just went HEY. Very heroic of me.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{scared}And then, when I came down over the forest, something came out of the trees underneath me. It followed my shadow along the ground. All morning. It never made a sound.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{bored}And now it\'s got Mum\'s umbrella, and I\'m just a girl with a stick.\n\n{determined}A very cross girl with a stick.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Outside, all at once, every bird in Lasthome stops.' },
    { do: 'wait', seconds: 2 },
    { do: 'say', who: 'ves', text: '{worried}...' },
    { do: 'wait', seconds: 2.4 },
    { do: 'say', text: 'Then it passes. A long while after, one bird starts up again, then another.' },
    { do: 'wait', seconds: 1 },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{smile}...Don\'t look at me like that. I\'m getting it back. And then I\'m bonking that thing on the nose with it.\n\nGo back to sleep. Big day tomorrow.' },
    { do: 'wait', seconds: 1.6 },
  ],
};
