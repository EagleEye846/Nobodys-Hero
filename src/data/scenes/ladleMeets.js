// OLD LADLE: the cistern's hob, who has kept Hollin's water sweet for fifty
// years for a village that isn't there any more, because nobody came down to
// tell him to stop. He takes Bramble for "young Oakley" (Bramble's grandad,
// who was a boy when everyone left), and works it out, and it's sad for a
// moment, and then he's glad of the company. He saw Ves: wet through, and
// limping. Then his fire, his bed of sacks, and his stall.
export const LADLE_MEETS = {
  // Triggers in rooms name the scene by this id.
  id: 'ladle_meets',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'drains_ladle',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ladle', look: 'prop:ladle', x: 11, y: 6, portrait: 'ladle' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 8, y: 6 } },
    { do: 'walk', who: 'bramble', to: { x: 8, y: 7 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'ladle', dir: 'left' },
    { do: 'emote', who: 'ladle', emote: '!' },
    { do: 'say', who: 'ladle', text: '{surprised}Oh! Oh, visitors. Mind the gutter by the wall, that\'s the clean one.' },
    { do: 'say', who: 'ladle', text: '{laughing}Well, I never. Young Oakley! Look at you. You\'ve not grown a bit.' },
    { do: 'say', who: 'bramble', text: '{thinking}...I\'m Bramble. Oakley\'s my grandad.' },
    { do: 'say', who: 'ladle', text: '{muddled}Your grandad? Little Oakley? But he was only just... he dropped his marble down my well, only...\n\nOnly...' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ladle', text: '{sad}Oh. How long has it been, up there?' },
    { do: 'say', who: 'bramble', text: '{tender}Fifty years, Grandad says. Since everybody left.' },
    { do: 'say', who: 'ladle', text: '{sad}Fifty. And me down here all the while, keeping the water sweet for them. Nobody came down to say.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ladle', text: '{tender}Well. It\'s sweet, anyway. If anybody wants it.' },
    { do: 'say', who: 'bramble', text: '{proud}I\'ll have some.' },
    { do: 'say', who: 'ladle', text: '{laughing}There\'s a good lad. Just like your grandad.' },
    { do: 'say', who: 'ladle', text: '{worried}You\'ll be after the girl, I expect. Wet as a herring, she was, and limping. Wouldn\'t stop. Said thank you, though.' },
    { do: 'say', who: 'bramble', text: '{worried}Limping?' },
    { do: 'say', who: 'ladle', text: '{worried}She came down the culverts all the way, and the culverts are no place for legs. She went on down to the old stone, where the water gets out.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'ladle', text: '{tender}Sit by the fire a bit first. There\'s a bed of sacks, and I\'ve things to sell if you\'ve coins.\n\nAll sorts washes down. I keep it.' },
  ],
};
