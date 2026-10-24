// THE QUIET: coming into the Quiet, where the Hush is up in the trees, its
// shadow going round and round the wood below. Bramble whispers the rules:
// move while it's away, keep still in the leaves when it comes over.
export const THE_QUIET = {
  // Triggers in rooms name the scene by this id.
  id: 'the_quiet',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_quiet',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 18, y: 23, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'bramble', text: '{scared}(whispering) ...It\'s here. Up there. I can\'t hear a single bird.' },
    { do: 'say', who: 'bramble', text: '{worried}(whispering) Watch its shadow. It goes round and round. When it\'s coming, get in a leaf pile and keep STILL.\n\n{scared}If it goes over you anywhere else, it\'ll see you.' },
    { do: 'say', who: 'bramble', text: '{determined}(whispering) I\'ll be right behind you. Go when it\'s gone past.' },
  ],
};
