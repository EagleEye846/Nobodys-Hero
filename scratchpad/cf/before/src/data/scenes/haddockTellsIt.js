// HADDOCK TELLS IT: the parlour of Haddock's Light, the first time in. He sits the three of them
// down and tells, once and plainly, the night the light went out: his ward Corrie, the young
// Hero who stopped a summer, the boy going out to stop the sea, the old man who sat down for a
// minute. Then he gives the hero his brass handbell. (The hero never speaks. Haddock is a bit
// hard of hearing, and proud of it.) One scene: the telling, then the bell, and the boat at the jetty
// (`to_the_reach`) waits for it.
//
// (draft). The lines are as written in the chapter bible.
//
// It plays straight after `keeper_at_haddocks` (the old man with the lantern at the stove), from
// a second trigger where that scene leaves the hero. Haddock sits in his armchair (8..9, row 4). That scene leaves the party on the
// left (hero 7,7; Ves 5,6; Bramble 4,7); from there they walk up to row 6; Ves and Bramble stand
// over by the stove (5, row 3). Nothing else in the room moves, and there are no monsters.
export const HADDOCK_TELLS_IT = {
  id: 'haddock_tells_it',
  room: 'haddock_light_parlour',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_chair', x: 9, y: 4, portrait: 'haddock', plays: 'haddock_light', centered: true },
    { id: 'ves', look: 'prop:vesper_stand', x: 5, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 4, y: 7, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    // (The first look round the room is in keeper_at_haddocks, which plays just before this.)
    { do: 'walk', who: 'player', to: { x: 9, y: 6 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 6, y: 5 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 4, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'haddock', text: '{tired}Sit, sit. Mind the cat.\n\n...There\'s no cat. Habit.' },
    { do: 'say', who: 'haddock', text: '{tired}Ye\'ll have seen the little room up top. Or ye will.' },
    { do: 'music', song: 'corrieLullaby' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'haddock', text: '{tender}I had a boy. Not mine. Washed up in a crab pot, near enough. No bigger than a loaf.' },
    { do: 'say', who: 'haddock', text: '{tender}Corrie. I minded him like I mind the light.' },
    { do: 'say', who: 'bramble', text: '{thinking}...Was he nice?' },
    { do: 'say', who: 'haddock', text: '{laughing}He was a terror. Rang me bell at the gulls. Ate a candle once.' },
    { do: 'say', who: 'haddock', text: '{smile}Then a young\'un came down the coast. Hundred year back, near enough.\n\nSmall lad. Sword too big for him. Stopped with us a summer.' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{thoughtful}...A sword.' },
    { do: 'say', who: 'haddock', text: '{smile}Corrie followed him about like a gull after a boat. Wanted to be just like him.' },
    { do: 'say', who: 'haddock', text: '{tired}Then he went off north-east. And the sea started comin\' up.' },
    { do: 'say', who: 'haddock', text: '{sad}Corrie said he\'d stop it. Like the young\'un would have. Took me boat and a spell out of a book.' },
    { do: 'say', who: 'haddock', text: '{sad}I said I\'d mind the light. All night, so he\'d find his way home.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'haddock', text: '{sad}...' },
    { do: 'act', who: 'haddock', act: 'sigh' },
    { do: 'say', who: 'haddock', text: '{tired}I was old already. I sat down for a minute.' },
    { do: 'say', who: 'haddock', text: '{sad}When I woke the light was out. And the sea was green.' },
    { do: 'say', who: 'haddock', text: '{sad}He never came back. The storm did.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{tender}...You fell asleep.' },
    { do: 'say', who: 'haddock', text: '{tired}I did.' },
    // A beat of silence. Ves looks away; Bramble takes a step closer.
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 1.2 },
    { do: 'walk', who: 'bramble', to: { x: 5, y: 6 } },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'bramble', text: '{sheepish}I fall asleep all the time.' },
    { do: 'say', who: 'haddock', text: '{smile}I know, lad. Ye snore.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'haddock', text: '{tired}There. That\'s it told. I\'ll not tell it again.' },
    { do: 'wait', seconds: 1.2 },

    // The bell.
    { do: 'say', text: 'Haddock lifts the cord over his head, and the brass handbell swings from his flipper, and he holds it out.' },
    { do: 'say', who: 'haddock', text: '{proud}Here. Ring it if the sea gets cheeky.' },
    { do: 'say', who: 'bramble', text: '{worried}Don\'t you need it?' },
    { do: 'say', who: 'haddock', text: '{eh}Eh? ...Need what?\n\nNever heard it anyway.' },
    // The hero steps up to take it, and nods: the nearest he comes to thanks.
    { do: 'walk', who: 'player', to: { x: 9, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'give', item: 'haddocks_bell' },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{smile}He gave it to the one who never says thank you.' },
    { do: 'face', who: 'player', dir: 'down' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
