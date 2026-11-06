// THE CROSSING: the ride out to the Wreck Yard, on board the Bother. Plays once, the
// first time you arrive on wreck_gate's jetty (from to_the_wreck_yard, Haddock's boat
// out of Saltcombe). The view starts black; the boat comes in out of the fog along the
// channel west of the jetty with the three aboard (Ves in the stern, Bramble clinging
// on amidships, the hero standing in the bow) and Haddock rowing. He's a bit deaf and
// hears Ves's digs as compliments. Bramble does not like the sea. At the jetty they
// climb out and Haddock rows off round to the slip on the far side (wreck_slip), where
// he'll fetch them home.
//
// Everything happens on the water west of the jetty (x 1 to 8, row 10) and on the
// jetty itself (x 9 and 10): nothing else is in the room's west end, and the room has
// no monsters. (The hero never speaks.)
export const WRECK_CROSSING = {
  id: 'wreck_crossing',
  room: 'wreck_gate',
  once: true,

  actors: [
    // The boat (4 tiles wide) is placed by its centre, out in the channel.
    { id: 'boat', look: 'prop:cf_haddock_row', x: 2, y: 10, portrait: 'haddock', centered: true, animation: 'cf_haddock_row', speed: 0.35 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // Black first, while everyone gets into the boat.
    { do: 'stage', dim: 1 },
    { do: 'hold', who: 'boat', what: 'player', offset: { x: 25, y: -7 } },
    { do: 'hold', who: 'boat', what: 'ves', offset: { x: -26, y: -7 }, also: true },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 1.2 },
    { do: 'hold', who: 'boat', what: 'bramble', offset: { x: 9, y: -7 }, also: true },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'music', song: 'haddock' },
    { do: 'wait', seconds: 0.4 },
    { do: 'stage', dim: 0, seconds: 2.5 },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', text: 'Saltcombe\'s lamps dropped out of sight a long while back. Since then it has been fog, and rain, and the slow knock of the oars.' },
    { do: 'say', text: 'Shapes come up out of the fog and slide past. A ship on its side. A mast with no ship. A figurehead, staring at nothing.' },
    { do: 'say', who: 'bramble', text: '{scared}...Are they ALL broken?' },
    { do: 'say', who: 'boat', text: '{proud}Every one. Finest yard on the coast, this. Nothing\'s sailed out of it in forty year.' },
    { do: 'say', who: 'ves', text: '{bored}That\'s not the boast you think it is.' },
    { do: 'say', who: 'boat', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'boat', text: '{smile}Thank you, miss. I do keep it nice.' },
    { do: 'walk', who: 'boat', to: { x: 4, y: 10 }, keep: true },
    { do: 'emote', who: 'bramble', emote: 'sweat' },
    { do: 'say', text: 'Bramble has both arms round the side of the boat and his cheek pressed flat against it.' },
    { do: 'say', who: 'ves', text: '{bored}Bramble. You can let go of the boat.' },
    { do: 'say', who: 'bramble', text: '{scared}I\'m not holding on. I\'m holding it TOGETHER.' },
    { do: 'say', who: 'boat', text: '{laughing}That\'s the spirit, lad! She\'s been held together with less.' },
    { do: 'say', who: 'bramble', text: '{worried}...With LESS?' },
    { do: 'say', who: 'boat', text: '{determined}Folk in Saltcombe say a star came down out here, the night the storm came. Stuck up the big mast. Still shining.' },
    { do: 'say', text: 'At your side, the Fallen Star gives a small hum, the way it does near its own kind.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...It heard that.' },
    { do: 'say', who: 'ves', text: '{bored}Your oar is dripping down my neck, by the way.' },
    { do: 'say', who: 'boat', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'boat', text: '{proud}Aye, she\'s a fine oar. Ash. Was my dad\'s.' },
    { do: 'say', who: 'ves', text: '{bored}...Lovely.' },
    // In to the jetty.
    { do: 'walk', who: 'boat', to: { x: 6, y: 10 }, keep: true },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 1, seconds: 0.25 },
    { do: 'say', who: 'boat', text: '{smile}Here\'s the gate. Mind the planks. They\'re older than me, and not as polite.' },
    // Out onto the jetty, the hero first, then Ves.
    { do: 'hold', who: 'boat' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 9, y: 10 }, height: 12, bounces: 0 },
    { do: 'animate', who: 'ves' },
    { do: 'toss', who: 'ves', to: { x: 10, y: 9 }, height: 12, bounces: 0 },
    { do: 'hold', who: 'boat', what: 'bramble', offset: { x: 9, y: -7 } },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'say', who: 'bramble', text: '{worried}I\'ll just stay here and keep it together.' },
    { do: 'say', who: 'ves', text: '{bored}Out.' },
    { do: 'hold', who: 'boat' },
    { do: 'animate', who: 'bramble' },
    { do: 'toss', who: 'bramble', to: { x: 10, y: 11 }, height: 12, bounces: 0 },
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'boat', text: '{proud}I\'ll row round to the old slip, far side of the yard. Give us a shout when you want fetching. Loud, mind. I\'m a bit...' },
    { do: 'say', who: 'ves', text: '{bored}Deaf.' },
    { do: 'say', who: 'boat', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'boat', text: '{smile}...Deft. Thank you, miss. I am.' },
    // Off into the fog.
    { do: 'walk', who: 'boat', to: { x: 2, y: 10 }, keep: true },
    { do: 'leave', who: 'boat' },
    { do: 'wait', seconds: 0.8 },
    { do: 'music', song: 'wreck' },
    { do: 'face', who: 'player', dir: 'right' },
  ],
};
