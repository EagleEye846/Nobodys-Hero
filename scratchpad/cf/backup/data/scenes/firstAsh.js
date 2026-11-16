// FIRST ASH: on the tideline (ash_tideline, the trigger at x 11), where the sand gives out and
// the ash begins. It's coming down slowly out of a grey sky, and Bramble is sure it's snow.
// No walks; the monsters keep to the east end. (draft)
export const FIRST_ASH = {
  id: 'first_ash',
  room: 'ash_tideline',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'Something pale comes drifting down out of the grey sky. Then more of it, slowly, settling on your sleeves without a sound.' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}SNOW! I\'ve never seen snow!' },
    { do: 'say', who: 'bramble', text: '{surprised}...It\'s warm. Is snow warm?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{bored}It looks like snow. It isn\'t. Don\'t eat it, Bramble.' },
    { do: 'say', who: 'bramble', text: '{worried}...I wasn\'t going to eat it.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{thoughtful}It\'s ash. Something up there has been burning for a long time.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}How long?' },
    { do: 'say', who: 'ves', text: '{bored}Longer than you\'ve been alive. Keep walking. And close your mouth.' },
  ],
};
