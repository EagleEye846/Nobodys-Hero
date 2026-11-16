// THE TIDE HELD OPENS: the start of Chapter 5. The next morning, in the Soft
// Field, beside the hole (roped off in the night by Farmer Tolliver). The three of them wake in the wet grass, Ves says the one thing
// about the quiet that she will say all chapter, and nobody answers it.
// Farmer Tolliver, the ancient tortoise from the Last Farm, comes very slowly
// along the lane with a breakfast basket, and tells them his gran's story: a small child who
// walked east along the lane toward the sea, a long time ago, in a coat much
// too big for him (the first mark of the Hero's trail: an object and a story,
// never a speech). Then he sends them off, and they set out east.
// (The hero never speaks; Tolliver, Ves and Bramble do the talking.)
//
// There are no monsters in this field. Tolliver comes along the top of the lane
// (row 9) from the east door to the grass at (23, 8); at the end he plods off home
// along row 8 while the party leaves east along row 9, out of the east door to the
// Hayfields (the scene ends there, so he never vanishes in view).
// (Marigold is only an optional stall in chapter 4, so she isn't in this.)
export const TIDE_HELD_OPENS = {
  id: 'tide_held_opens',
  room: 'sunny_soft_field',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 22, y: 13, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 20, y: 11, portrait: 'bramble', plays: 'bramble', hidden: true },
    { id: 'tolliver', look: 'prop:sy_tortoise', x: 36, y: 9, animation: 'sy_tortoise', speed: 1.2, hidden: true },
  ],

  // (draft) 2026-11-15: staged and trimmed. The sky and the seed-clocks are shown, not told; the camera
  // goes to the roped-off hole and to the tortoise coming; the three sit to eat and stand to go.
  steps: [
    { do: 'music', song: null },
    { do: 'time', of: 0.05 },
    { do: 'stage', dim: 1 },
    { do: 'appear', who: 'ves', at: { x: 22, y: 13 }, instant: true },
    { do: 'appear', who: 'bramble', at: { x: 20, y: 11 }, instant: true },
    { do: 'animate', who: 'ves', animation: 'ves_sat', speed: 1.2 },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 1.2 },
    { do: 'stage', dim: 0, seconds: 4 },
    { do: 'music', song: 'sunnyside' },
    { do: 'wait', seconds: 2.6 },
    // Bramble wakes first, and finds the dandelions have all gone to clocks.
    { do: 'animate', who: 'bramble' },
    { do: 'act', who: 'bramble', act: 'startle' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{awed}Somebody turned all the dandelions into clocks.' },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'player', at: 'ves' },
    { do: 'act', who: 'ves', act: 'sigh', wait: false },
    { do: 'say', who: 'ves', text: '{laughing}One\'s stuck in your hair. Two. Hold still, you\'re turning into a field.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{proud}I slept in a FIELD. On PURPOSE.' },
    { do: 'say', who: 'ves', text: '{laughing}Your face was in a daisy.' },
    { do: 'say', who: 'bramble', text: '{proud}A purposeful daisy.' },
    // The rope round the hole: the camera goes to look.
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'camera', to: { x: 26, y: 11 } },
    { do: 'wait', seconds: 2 },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{thoughtful}...It\'s quiet without Tuck.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera' },
    // Something is coming along the lane.
    { do: 'emote', who: 'bramble', emote: '?', wait: false },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'ves', act: 'look', wait: false },
    { do: 'wait', seconds: 1 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'act', who: 'bramble', act: 'hop' },

    // Farmer Tolliver, along the lane from the east, very slowly, with a basket.
    // (The tortoise from the Last Farm, out on his morning walk. He roped off
    // the hole in the night: it took him most of it.)
    { do: 'appear', who: 'tolliver', at: { x: 36, y: 9 }, instant: true },
    { do: 'face', who: 'tolliver', dir: 'left' },
    { do: 'say', who: 'ves', text: '{glee}Breakfast. Somebody is carrying breakfast this way. Nobody move. It might be shy.' },
    { do: 'camera', who: 'tolliver' },
    { do: 'walk', who: 'tolliver', to: { x: 33, y: 9 }, pace: 16 },
    { do: 'say', who: 'tolliver', text: 'Morning. Or thereabouts. I don\'t hold with being exact.' },
    { do: 'camera' },
    { do: 'walk', who: 'tolliver', to: { x: 23, y: 8 }, pace: 16, wait: false },
    { do: 'say', who: 'tolliver', text: 'Found a hole in this field last night. Put a rope round it. Took me most of the night.\n\nThen I went home for the breakfast. That took the rest.' },
    { do: 'act', who: 'ves', act: 'shake', wait: false },
    { do: 'say', who: 'ves', text: '{shy}...It was like that when we got here. Mostly.' },
    { do: 'say', who: 'tolliver', text: 'They usually are.' },
    { do: 'wait', seconds: 2.4 },
    // He's arrived: everyone turns to him.
    { do: 'face', who: 'bramble', at: 'tolliver' },
    { do: 'face', who: 'tolliver', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'tolliver', text: 'Tolliver. Last farm along. I always bring too much breakfast. Takes so long to get anywhere, I like to be ready.\n\nBread. Honey. Six boiled eggs. They were hot when I set out. That was a while ago.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{glee}SIX eggs?' },
    { do: 'say', who: 'tolliver', text: '...Is it too few?' },
    { do: 'act', who: 'bramble', act: 'shake', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}No! No. It\'s exactly right. I\'ll tell you after.' },
    { do: 'act', who: 'player', act: 'nod', wait: false },
    { do: 'give', item: 'jam_tart' },
    // They sit down in the long wet grass and eat, while the tortoise watches the eggs go.
    { do: 'animate', who: 'ves', animation: 'ves_sat', speed: 1.2 },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'wait', seconds: 2.2 },
    { do: 'act', who: 'player', act: 'nod', wait: false },
    { do: 'wait', seconds: 1.2 },

    // The story.
    { do: 'say', who: 'tolliver', text: 'Where are you off to, then? Not under. You\'ve the look of folk who\'ve done under.' },
    { do: 'say', who: 'ves', text: '{proud}East. We\'ve done west, and we\'ve done underneath. Thoroughly.' },
    { do: 'say', who: 'tolliver', text: 'East. Along the lane. My gran had a story about that. Nobody asked for it. She told it anyway.\n\nA very small boy, walking east on the lane, toward the sea. A hundred years back, about. Not long, for us.\n\nSleeves down over his hands. "A coat too big for him." The same words, every time. Waved at the scarecrows going by, she said. Every one. Never a word to anybody.' },
    { do: 'act', who: 'player', act: 'look' },
    { do: 'say', who: 'ves', text: '{smile}...There\'s a lot of coat in that story.' },
    { do: 'say', who: 'bramble', text: '{thinking}Did he come back?' },
    { do: 'say', who: 'tolliver', text: 'Gran always stopped at the sea. She said that was the polite place to stop.' },
    // Up on their feet.
    { do: 'animate', who: 'ves' },
    { do: 'animate', who: 'bramble' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'say', who: 'ves', text: '{determined}Then we\'ll go and be polite at the sea.' },

    // Off east (along the top of the lane, clear of his rope).
    { do: 'say', who: 'tolliver', text: 'Mind the gulls. They\'re not what they were. They used to have manners.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'wait', seconds: 0.6 },
    // He sets off home too, at his own speed, along the grass above the lane
    // (row 8); the three of them pass him on the lane and go out of the east
    // door ahead of him, so he is never seen to vanish.
    { do: 'face', who: 'tolliver', dir: 'right' },
    { do: 'walk', who: 'tolliver', to: { x: 36, y: 8 }, pace: 12, wait: false },
    // Ves and Bramble come up onto the lane (clear of the rope, which starts at
    // x 23) and walk east with you.
    { do: 'walk', who: 'bramble', to: { x: 20, y: 9 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 22, y: 9 }, wait: false },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'walk', who: 'player', to: { x: 21, y: 9 } },
    { do: 'wait', seconds: 0.8 },
    // In single file, Ves in front: the hero walks at their pace, so nobody
    // walks through anybody.
    // (Far enough on that the tortoise, plodding along the grass above, is behind them.)
    { do: 'walk', who: 'ves', to: { x: 32, y: 9 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 28, y: 9 }, wait: false },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'walk', who: 'player', to: { x: 30, y: 9 }, pace: 48 },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'act', who: 'bramble', act: 'hop', wait: false },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{glee}Bye, Mr Tolliver! See you eventually!' },
    { do: 'say', who: 'tolliver', text: 'I\'ll wave when I get there.' },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'walk', who: 'ves', to: { x: 37, y: 10 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 36, y: 9 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 37, y: 9 }, pace: 48 },
    { do: 'wait', seconds: 0.3 },
    { do: 'goto', room: 'sunny_hayfields', spawn: { x: 1, y: 9 } },
  ],
};
