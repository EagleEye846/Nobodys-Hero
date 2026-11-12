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
    { do: 'say', text: 'Morning. The grass is soaked, and the sky is the pale, undecided yellow of a thing that has only just woken up.' },
    { do: 'say', text: 'Every dandelion in the field has gone to seed overnight. They drift over the grass like very slow snow.' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{surprised}Somebody turned all the dandelions into clocks.' },
    { do: 'face', who: 'player', at: 'ves' },
    { do: 'say', who: 'ves', text: '{bored}They do that. You blink in summer, and they have.' },
    { do: 'say', who: 'bramble', text: '{grin}I slept in a FIELD. On PURPOSE. Nobody can say I didn\'t.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}You fell asleep mid-sentence. Your face was in a daisy.' },
    { do: 'say', who: 'bramble', text: '{grin}A purposeful daisy.' },
    { do: 'wait', seconds: 0.6 },
    // The rope round the hole.
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'Beyond the posts and the rope, the hole is still there. Somebody has roped it off in the night and tied a small red flag to every length of rope, in case anyone missed the idea.' },
    { do: 'face', who: 'player', at: 'ves' },
    { do: 'say', who: 'ves', text: '{thoughtful}...It\'s quiet without Tuck.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'ves', text: '{bored}Something smells of breakfast. I\'d like to meet whoever\'s carrying it.' },
    // Up on their feet.
    { do: 'animate', who: 'ves' },
    { do: 'animate', who: 'bramble' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'face', who: 'player', dir: 'right' },

    // Farmer Tolliver, along the lane from the east, very slowly, with a basket.
    // (The tortoise from the Last Farm, out on his morning walk. He roped off
    // the hole in the night: it took him most of it.)
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'appear', who: 'tolliver', at: { x: 36, y: 9 }, instant: true },
    { do: 'face', who: 'tolliver', dir: 'left' },
    // The camera goes along the lane to meet him (and comes back to you as he sets off for the grass).
    { do: 'emote', who: 'bramble', emote: '?', wait: false },
    { do: 'camera', who: 'tolliver' },
    { do: 'walk', who: 'tolliver', to: { x: 33, y: 9 }, pace: 16 },
    { do: 'say', text: 'Along the lane from the east, at roughly the speed of a hedge growing, comes a very old tortoise in a waistcoat, with a basket.' },
    { do: 'say', who: 'tolliver', text: 'Morning. Or thereabouts. I don\'t hold with being exact.' },
    { do: 'camera' },
    { do: 'walk', who: 'tolliver', to: { x: 23, y: 8 }, pace: 16, wait: false },
    { do: 'say', who: 'tolliver', text: 'Found a hole in this field last night. Put a rope round it. Took me most of the night.\n\nThen I went home for the breakfast. That took the rest.' },
    { do: 'say', who: 'ves', text: '{bored}It was here when we arrived.' },
    { do: 'say', who: 'tolliver', text: 'They usually are.' },
    { do: 'wait', seconds: 2.4 },
    // He's arrived: everyone turns to him.
    { do: 'face', who: 'bramble', at: 'tolliver' },
    { do: 'face', who: 'tolliver', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'tolliver', text: 'Tolliver. Last farm along. I always bring too much breakfast. Takes so long to get anywhere, I like to be ready.' },
    { do: 'say', who: 'tolliver', text: 'Bread. Honey. Six boiled eggs. They were hot when I set out. That was a while ago.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{surprised}Six is a lot of eggs.' },
    { do: 'say', who: 'tolliver', text: '...Is it too few?' },
    { do: 'act', who: 'bramble', act: 'shake', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}No! No. It\'s exactly right. I\'ll tell you after.' },
    { do: 'say', text: 'He presses a jam tart on you as well, for later.' },
    { do: 'act', who: 'player', act: 'nod', wait: false },
    { do: 'give', item: 'jam_tart' },
    { do: 'say', text: 'You eat in the long wet grass, in the sun, while the tortoise watches the eggs go with great patience. There is a great deal of honey.' },
    { do: 'wait', seconds: 0.8 },

    // The story.
    { do: 'say', who: 'tolliver', text: 'Where are you off to, then? Not under. You\'ve the look of folk who\'ve done under.' },
    { do: 'say', who: 'ves', text: '{thoughtful}East. We\'ve run out of west, and of everything underneath. East is what\'s left.' },
    { do: 'say', who: 'tolliver', text: 'East. Along the lane.\n\n...My gran had a story about that.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}We didn\'t ask for a story.' },
    { do: 'say', who: 'tolliver', text: 'Nobody does. She told it anyway. A very small boy, walking east on the lane, toward the sea. A hundred years back, about. Not long, for us.\n\nSleeves down over his hands. "A coat too big for him." The same words, every time.' },
    { do: 'say', who: 'bramble', text: '{thinking}A coat?' },
    { do: 'say', who: 'tolliver', text: 'Waved at the scarecrows going by, she said. Every one. Never a word to anybody. Just the coat, and the waving.' },
    { do: 'act', who: 'player', act: 'look' },
    { do: 'say', who: 'ves', text: '{smile}...There\'s a lot of coat in that story.' },
    { do: 'say', who: 'bramble', text: '{thinking}Did he come back?' },
    { do: 'say', who: 'tolliver', text: 'Gran always stopped at the sea. She said that was the polite place to stop.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{thoughtful}...Then I suppose that\'s where we start.' },

    // Off east (along the top of the lane, clear of his rope).
    { do: 'say', who: 'tolliver', text: 'Mind the gulls. They\'re not what they were. They used to have manners.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{grin}We\'ll mind them extremely!' },
    { do: 'say', who: 'tolliver', text: 'Go on, then. I\'ll catch you up.\n\nEventually.' },
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
    { do: 'say', who: 'bramble', text: '{grin}Bye, Mr Tolliver! See you eventually!' },
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
