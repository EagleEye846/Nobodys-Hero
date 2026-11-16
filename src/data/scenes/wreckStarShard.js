// THE SCORCH AT THE MAST (the id stays `wreck_star_shard`, because Haddock's lines and the chapter's goals
// wait on it): the fighting top of the mast in the Wreck Yard (wreck_mast, the trigger x 16 to 18, rows 2
// to 4: you come off the rope onto it). The mast's snapped top pokes up through the planks. The star-shard
// that used to be wedged in its split is NOT here any more (it moved to the end of the optional ghost
// ship; see notes/docs/superboss-ch5.md): what is left is a scorch of black glassy grain at the split
// and a line of burnt planks running east off the end of the yard, out to sea. The Fallen Star tugs at the
// hero's hand the way the line runs. It is only a hint. The hero steps up beside the split (16,4); Ves and
// Bramble stand back on the top (17,2 and 18,3). The hero never speaks. All of it is DRAFT words.
export const WRECK_STAR_SHARD = {
  id: 'wreck_star_shard',
  room: 'wreck_mast',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 16, y: 3, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 17, y: 3, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // (draft) 2026-11-15: staged and trimmed. The camera follows the scorch east along the yard and out to
    // where the Last Light stands in the storm, instead of the paragraph saying so.
    { do: 'walk', who: 'ves', to: { x: 17, y: 2 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 18, y: 3 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 16, y: 4 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', text: 'The top of the mast comes up through the planks, split like a broken pencil. The wood at the split is black and glassy, as though something very hot was pulled out of it, a long time ago.\n\nThere is nothing wedged in it now.' },
    { do: 'emote', who: 'player', emote: '!', wait: false },
    { do: 'sound', name: 'shimmer' },
    { do: 'act', who: 'player', act: 'startle' },
    // The Fallen Star tugs, like a dog that has seen a gate: the camera runs east along the scorch, out over the water.
    { do: 'camera', to: { x: 24, y: 3 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera', to: { x: 33, y: 5 } },
    { do: 'wait', seconds: 2 },
    { do: 'camera' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'ves', text: '{surprised}Something was stuck in here. Something hot. And then it went... that way. Past the slip. Out to that point.' },
    { do: 'say', who: 'bramble', text: '{scared}There is nothing out in the fog.' },
    { do: 'say', who: 'ves', text: '{smile}That\'s exactly where I\'d hide a star, if I were one.' },
    { do: 'face', who: 'ves', at: 'player' },
    { do: 'say', who: 'ves', text: '{determined}Slip first. Haddock\'s there, and Haddock might know what this is. Then that point. Whatever\'s out there can wait till we know how to get to it.' },
    { do: 'face', who: 'ves', dir: 'right' },
  ],
};
