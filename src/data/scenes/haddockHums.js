// HADDOCK HUMS: in the Drowned Rat, the first night in Saltcombe. Haddock is
// on a crate by the fire, eyes shut, humming a lullaby. It's Corrie's
// ("Come In, Little Boat": corrieLullaby). He never says so, and when Bramble
// asks, it's "just a tune". He mishears Ves (deaf, and proud of it). Then he
// says the lad's learning to swim, in the lagoon, now, while he's warm.
// Bramble is not keen. Haddock goes on ahead (he's quicker in water than out).
// (The hero never speaks.)
//
// The party comes in at the door (8..9, row 12) and walks up the middle to
// row 8, clear of the tables (9..10 and 13..14) and the counter.
export const HADDOCK_HUMS = {
  id: 'haddock_hums',
  room: 'saltcombe_inn',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock_sit', x: 6, y: 4, portrait: 'haddock', plays: 'haddock_inn', centered: true, animation: 'cf_haddock_sit', speed: 0.6 },
    { id: 'rat', look: 'prop:cf_rat_innkeeper', x: 14, y: 3, portrait: 'rat_innkeeper', plays: 'rat_innkeeper', animation: 'cf_rat_innkeeper', speed: 0.5 },
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 12, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 9, y: 12, portrait: 'bramble', plays: 'bramble', hidden: true },
  ],

  steps: [
    { do: 'appear', who: 'ves', at: { x: 8, y: 12 }, instant: true },
    { do: 'appear', who: 'bramble', at: { x: 9, y: 12 }, instant: true },
    { do: 'music', song: 'corrieLullaby' },
    { do: 'say', text: 'The Drowned Rat is low and warm and loud with rain. Wet coats steam on every peg. Somebody has put a whole log on the fire, and the fire is very pleased about it.' },
    { do: 'walk', who: 'player', to: { x: 8, y: 8 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 7, y: 9 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 9, y: 9 } },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Haddock is on a crate by the fire with his eyes shut, humming.' },
    { do: 'wait', seconds: 2.5 },
    { do: 'say', text: 'It\'s a slow tune, the kind you rock a cradle to. It goes up, and stops halfway, as if it has asked something. Then it comes back down, very gently, like a door being drawn to.' },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'bramble', text: '{thinking}What\'s that song?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'say', who: 'haddock', text: '{smile}Oh. Just a tune. Fires do it to me.' },
    { do: 'say', who: 'rat', text: '{wry}Every night, that one. Same tune, same crate. I could hum it myself by now.' },
    { do: 'say', who: 'ves', text: '{bored}He\'s flat.' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock_listen', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{eh}Eh?' },
    { do: 'animate', who: 'haddock', animation: 'cf_haddock', speed: 0.5 },
    { do: 'say', who: 'haddock', text: '{proud}I am, miss. Flat calm. Nothing troubles me.' },
    { do: 'say', who: 'ves', text: '{bored}...Clearly.' },
    { do: 'say', who: 'haddock', text: '{determined}Right. While I\'m warm. Lagoon\'s out past the market, east. The lad\'s learning to swim.' },
    { do: 'say', who: 'bramble', text: '{worried}Which lad?' },
    { do: 'say', who: 'haddock', text: '{smile}Only the one lad here.' },
    { do: 'emote', who: 'bramble', emote: 'sweat' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', who: 'bramble', text: '{worried}...There could be others. In the back.' },
    { do: 'say', who: 'ves', text: '{bored}There aren\'t.' },
    { do: 'say', who: 'haddock', text: '{laughing}Off you go, then! I\'ll be there before you. I\'m quicker in water than out of it.' },
    { do: 'leave', who: 'haddock' },
    { do: 'say', text: 'Haddock heaves himself up, leaves his mug on the crate, and goes out into the rain humming the same tune.' },
    { do: 'say', who: 'rat', text: '{smile}He\'s a good teacher. Taught half this town.\n\n{wry}Mostly to stay out of the water, mind.' },
    { do: 'music', song: 'saltcombe' },
  ],
};
