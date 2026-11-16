// ORCHARD TALK: walking through the black orchard (ash_orchard, the trigger at x 20), Bramble
// brings up the top of the Last Light: Corrie knocking Ves and the hero down, and his "My turn."
// Ves teases him, then means it, once. No walks; the monsters keep to the corners. (draft)
export const ORCHARD_TALK = {
  id: 'orchard_talk',
  room: 'ash_orchard',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'say', text: 'Between the black trees it\'s very quiet. Even your footsteps are soft in the ash.' },
    { do: 'say', who: 'bramble', text: '{thinking}Ves. At the top of the Last Light. When Corrie knocked you both down.' },
    { do: 'say', who: 'ves', text: '{bored}I remember. I was there. On the floor, mostly.' },
    { do: 'say', who: 'bramble', text: '{proud}I said "My turn." Did you hear me say it?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{smile}The whole tower heard you say it.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{proud}It was good, wasn\'t it. I\'d been saving it.' },
    { do: 'say', who: 'ves', text: '{laughing}You save everything. The bell, the line. Do you save string?' },
    { do: 'say', who: 'bramble', text: '{grin}...Some string.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{thoughtful}It was good, Bramble.' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'wait', seconds: 0.4 },
  ],
};
