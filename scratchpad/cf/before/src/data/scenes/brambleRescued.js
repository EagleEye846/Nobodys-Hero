// BRAMBLE, RESCUED: after the fight in the Hollow Oak. Bramble was winning,
// he says. He names himself, names you ("Sword", since you won't), and tells
// you what he saw this morning: a girl coming down over the trees on an
// umbrella, and the Hush going after her. The grown-ups went hunting it with
// axes and told him to mind the camp. He didn't. Now you're going together.
// His song ("Didn't Mind the Camp", brambleTheme.js) starts when he does.
export const BRAMBLE_RESCUED = {
  // Triggers in rooms name the scene by this id.
  id: 'bramble_rescued',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_hollow_oak',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // Bramble's walking with you now: this actor takes over from him.
  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 14, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'wait', seconds: 0.5 },
    { do: 'walk', who: 'bramble', to: { x: 13, y: 9 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'music', song: 'bramble' },
    { do: 'say', who: 'bramble', text: '{glee}HA! Did you SEE that? They RAN! They ran right off!\n\n{proud}I was winning, by the way. Before you came. I was just about to win.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{sheepish}...Thanks, though.' },
    { do: 'say', who: 'bramble', text: '{proud}I\'m Bramble. From the woodcutters\' camp, up past the brook. Best chopper in the camp under eleven.\n\n{thinking}Who are you?' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'bramble', text: '{thinking}Nothing? Everybody\'s got a name. Even the goat\'s got a name.\n\n{grin}Fine. I\'ll call you Sword. \'Cos you\'ve got one. It\'s a good name. I\'d have it.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'bramble', text: '{awed}Did you come down out of the sky? There\'s been a lot of that today.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'bramble', text: '{surprised}There was a GIRL! This morning! She came down over the trees on an umbrella, really slow, like a dandelion seed.\n\n{thinking}I thought she was a big bird. Then I thought she was a ghost. Then she landed by the old hollow and RAN.' },
    { do: 'say', who: 'bramble', text: '{scared}\'Cos the Hush was after her.\n\nThe beast. Big as a cart and quiet as snow. The birds all stop singing when it\'s near. That\'s how you know.' },
    { do: 'say', who: 'bramble', text: '{determined}The grown-ups went after it last night with all their axes. Ma said, Bramble, you mind the camp.\n\n{sheepish}I didn\'t mind the camp.' },
    { do: 'say', who: 'bramble', text: '{determined}Somebody had to go after the girl. And nobody was going after the girl. They were all going after the Hush.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{sly}...You\'re looking for her. Aren\'t you.\n\nI can tell. You\'ve got a looking-for-someone face. Even without any talking.' },
    { do: 'emote', who: 'player', emote: '<3' },
    { do: 'say', who: 'bramble', text: '{grin}Right. Then you\'re coming with me. I know the wood, and you\'ve got a sword. That\'s a team, that is.\n\n{proud}I\'m in charge, though. On account of knowing the wood.' },
    { do: 'say', who: 'bramble', text: '{thinking}And if you ever need somebody small, I\'m small. There\'s holes in this wood only I fit through.\n\n{grin}(Press Q, and you can steer Bramble. Q again swaps back.)' },
    { do: 'say', who: 'bramble', text: '{glee}Come on, Sword! She went north! I saw!' },
  ],
};
