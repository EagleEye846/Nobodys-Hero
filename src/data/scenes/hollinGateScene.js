// HOLLIN GATE: Bramble sees his grandad's village for the first time, and it
// isn't how the stories had it. He tells you the one story about the Hush
// that everyone in the camp knows: it came up the lane, fifty years ago,
// stopped at the well, and looked down it for a long time. Then it went
// away again, and the village went up the wood to the camp.
export const HOLLIN_GATE_SCENE = {
  // Triggers in rooms name the scene by this id.
  id: 'hollin_gate_scene',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hollin_gate',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 15, y: 15, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'bramble', to: { x: 16, y: 12 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'bramble', text: '{awed}...Hollin.\n\nGrandad was born here. In one of those. He said it had red doors, and a bell on the green, and the best apples in the wood.' },
    { do: 'say', who: 'bramble', text: '{sad}The doors aren\'t red any more.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{thinking}Everyone at camp knows the story. Fifty years ago the Hush came out of its hollow and walked right up the lane, slow as anything, and nobody dared breathe.' },
    { do: 'say', who: 'bramble', text: '{scared}And it stopped at the well. And it looked down it. For ages.\n\n{thinking}Then it turned round and went back. And the next day everybody packed up and went up the wood to the camp, and never came back.' },
    { do: 'emote', who: 'player', emote: '?' },
    { do: 'say', who: 'bramble', text: '{worried}Grandad said it looked like it\'d lost something down there.\n\n{sheepish}He also said he once fought a bear with a spoon. So.' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{determined}Gate\'s barred from inside. But there\'s a gap in the fence where a stake\'s gone. Grandad\'s gap. Leave it to me.' },
  ],
};
