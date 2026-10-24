// MEET SLOWLY: in the Old Baths, steam, warm water, and a tortoise three
// hundred years old who remembers the city alive. He's very glad of company.
// He saw what went by last night.
export const MEET_SLOWLY = {
  // Triggers in rooms name the scene by this id.
  id: 'meet_slowly',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_baths',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'slowly', look: 'prop:slowly', x: 10, y: 7, portrait: 'slowly', plays: 'slowly_shop' },
    { id: 'ves', look: 'prop:vesper_crutch', x: 10, y: 2, portrait: 'vesper_bare', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 10, y: 5 } },
    { do: 'walk', who: 'ves', to: { x: 9, y: 4 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'slowly', text: '{sleepy}...Hm?' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'slowly', text: '{surprised}...Oh! People.\n\n{smile}How nice. Come in. Come in. Mind the steam. I\'m Slowly. That\'s not my name. It\'s what everyone called me. When there was everyone.' },
    { do: 'say', who: 'ves', text: '{surprised}You live here? On your own? In the dead city?' },
    { do: 'say', who: 'slowly', text: '{thoughtful}It wasn\'t dead when I came. I came for the warm water, three hundred years ago. Everybody was getting ready. Flags on all the roofs.\n\n{sad}Then they all went. I didn\'t. I\'m not good at going.' },
    { do: 'say', who: 'slowly', text: '{smile}Get in the bath, the both of you. You look like you\'ve come a long way. I\'ve things to eat, if you\'ve coins. I\'ve things to talk about, if you haven\'t.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{worried}Did you see anything go past? Last night? Something big?' },
    { do: 'say', who: 'slowly', text: '{thoughtful}...Yes. Over the roofs, very quiet. Toward the Gate.\n\n{sad}It had something purple in its mouth. I thought: that\'s somebody\'s.' },
    { do: 'say', who: 'ves', text: '{determined}It is.' },
  ],
};
