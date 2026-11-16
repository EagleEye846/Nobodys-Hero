// THE SHADOW PASSES: in the Windfall, the first time you see the Hush. Not
// the beast itself: its shadow, going over the treetops, so big it darkens
// the whole wood under it. Bramble hears the birds stop and pulls you into
// the leaves. It's going north. The same way Ves went.
export const THE_SHADOW_PASSES = {
  // Triggers in rooms name the scene by this id.
  id: 'the_shadow_passes',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_windfall',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 15, y: 19, portrait: 'bramble', plays: 'bramble' },
    { id: 'hidden', look: 'prop:bramble_crouch', x: 17, y: 18, portrait: 'bramble', hidden: true },
    { id: 'shadow', look: 'proc:shadow', x: 34, y: 20, hidden: true },
  ],

  steps: [
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{worried}...Sword. Listen.' },
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'The birds have stopped. All of them, all at once.' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', who: 'bramble', text: '{scared}Down! In the leaves! NOW!', shake: true },
    { do: 'walk', who: 'bramble', to: { x: 17, y: 18 } },
    { do: 'leave', who: 'bramble' },
    { do: 'appear', who: 'hidden' },
    // You dive in beside him and get down low, as flat as you can.
    { do: 'walk', who: 'player', to: { x: 16, y: 18 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'act', who: 'player', act: 'crouch' },
    { do: 'music', song: 'hushStalk' },
    { do: 'appear', who: 'shadow' },
    { do: 'walk', who: 'shadow', to: { x: -6, y: 20 } },
    { do: 'leave', who: 'shadow' },
    { do: 'wait', seconds: 1.4 },
    { do: 'act', who: 'player', act: 'stand' },
    { do: 'leave', who: 'hidden' },
    { do: 'appear', who: 'bramble', at: { x: 17, y: 19 } },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{scared}...That was it. That was the Hush.' },
    { do: 'say', who: 'bramble', text: '{awed}It\'s bigger than in the stories. It\'s bigger than the CART.\n\n{scared}I could feel it go over. Like when a cloud goes over, but cold.' },
    { do: 'say', who: 'bramble', text: '{worried}It\'s going north. The way your friend went.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'bramble', text: '{determined}Then we\'d better get there first.\n\n{thinking}If it comes over again: leaves, and keep still. Not a hair. That\'s how the deer do it.' },
    { do: 'music', song: 'hushwood' },
  ],
};
