// TWO TRAILS: in the Notched Trees, the trails part. Ma's notch, fresh, on a
// post pointing east into trees too thick to follow; Ves's chalk pointing
// north. Bramble chooses yours.
export const TWO_TRAILS = {
  // Triggers in rooms name the scene by this id.
  id: 'two_trails',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_notched',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 15, y: 16, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'wait', seconds: 0.3 },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{surprised}Sword! That post, over by the thicket! That\'s Ma\'s notch!' },
    { do: 'walk', who: 'bramble', to: { x: 27, y: 19 } },
    { do: 'camera', to: { x: 27, y: 18 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{thinking}It\'s fresh. The wood\'s still white. And an arrow cut under it, pointing east.\n\n{worried}They went into the thick. After the Hush, I bet. On the wrong side of it.' },
    { do: 'wait', seconds: 1 },
    { do: 'camera' },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 16 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{sad}...And your friend\'s arrow says north.\n\n{thinking}Ma cuts notches. She\'d never touch chalk. The chalk\'s been your friend\'s the whole way, pointing where I saw her run.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'bramble', text: '{thinking}I could go after Ma. She\'d be cross. But she\'d be cross anyway.\n\n{determined}But she\'s got six woodcutters and the best axe in the wood. Your friend\'s got some chalk.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{proud}And she\'s got you. And you\'ve got me. North it is.' },
  ],
};
