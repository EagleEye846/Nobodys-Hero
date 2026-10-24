// FOUND VES: inside the stilt hut in the Lantern Marsh. She's sitting against
// the wall by the stove with her leg out, bound up in a strip of her own coat,
// a chair leg in her lap for a weapon. She's furious with you for taking so
// long, and so glad she can't hide it. Bramble meets her at last. You give
// her back what you found of hers on the way. She tells you what happened:
// the Hush caught her at Hollin's well, and to get away down it she had to let
// go of her umbrella, her mother's, the only thing of hers that came back down
// the mountain. She can't walk. Bramble says you'll carry her; she says
// absolutely not; then she says fine. She's back in the party, hurt, riding
// on your back. Her song plays from when she sees you.
export const FOUND_VES = {
  // Triggers in rooms name the scene by this id.
  id: 'found_ves',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_hut',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // Ves sitting hurt takes the place of the one in the room (its `cast`), and
  // Bramble steps out from behind you.
  actors: [
    { id: 'ves', look: 'prop:vesper_hurt', x: 10, y: 4, portrait: 'vesper_bare', plays: 'hurt_ves' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 6, y: 8, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 7, y: 6 } },
    { do: 'walk', who: 'bramble', to: { x: 6, y: 7 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{exhausted}...If you\'re another one of those bog things, I\'m warning you.\n\nI\'ve got a chair leg.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'emote', who: 'ves', emote: '!' },
    { do: 'music', song: 'ves' },
    { do: 'say', who: 'ves', text: '{surprised}...' },
    { do: 'say', who: 'ves', text: '{surprised}It\'s you.\n\n{thoughtful}...Huh. You actually came all the way down.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{angry}You took your TIME about it!' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'say', who: 'bramble', text: '{awed}It\'s HER. Sword, it\'s her! The girl who fell out of the sky!' },
    { do: 'say', who: 'ves', text: '{angry}I didn\'t FALL. I was carried. Badly.\n\n{thoughtful}...Who are you?' },
    { do: 'say', who: 'bramble', text: '{proud}Bramble. Best chopper in the camp under eleven. I saw you come down over the trees.\n\n{grin}We followed your chalk. And your bits of coat. Sword never even needed telling.' },
    { do: 'say', who: 'ves', text: '{smile}Good. That\'s what they were for.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'walk', who: 'player', to: { x: 9, y: 5 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'You hold out what you found of hers along the way, wrung out as well as you could.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{surprised}You kept all of it?\n\n{smile}...You\'re very strange. Give it here. It\'s freezing.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{sad}It got my leg. The Hush. At the well in the empty village.\n\nI went down the well to get away from it. It couldn\'t follow.' },
    { do: 'say', who: 'ves', text: '{sad}But I had to let go of the umbrella. You can\'t climb down a well with an umbrella. It\'s still up there. With it.' },
    { do: 'say', who: 'ves', text: '{angry}It was Mum\'s. The only thing of hers that ever came back down the mountain.\n\n{sad}And now a bog-pig\'s got it.' },
    { do: 'say', who: 'ves', text: '{thoughtful}The sorry on the well wasn\'t for you, by the way.\n\n{bored}It was for Mum. For letting go of it.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'bramble', text: '{determined}Then we\'ll get it back.' },
    { do: 'say', who: 'ves', text: '{bored}Lovely. I\'ll hop there, shall I? I tried standing up this morning. The stove won.' },
    { do: 'say', who: 'bramble', text: '{thinking}...Sword can carry you.' },
    { do: 'say', who: 'ves', text: '{angry}Absolutely not.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{shy}...Fine. FINE.\n\n{determined}But you don\'t run, and you don\'t jump, and you don\'t tell anyone. Ever.' },
    { do: 'say', who: 'bramble', text: '{grin}Who would we tell? There\'s nobody out here.' },
    // She's with you again: hurt, and on your back.
    { do: 'join', who: 'vesper' },
    { do: 'hurt', who: 'vesper', on: true },
    { do: 'leave', who: 'ves' },
    { do: 'sound', name: 'select' },
    { do: 'piggyback', who: 'vesper' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{tender}...Thanks.\n\n{bored}Don\'t make a thing of it.' },
    { do: 'say', who: 'ves', text: '{bored}There\'s a back door. Yesterday I got all the way across the fen, then my leg gave up and I hopped back here.\n\n{thoughtful}But I saw lights out east. Not lanterns. Windows.\n\n{determined}That\'s where we\'re going.' },
    { do: 'say', text: 'VES is with you again. She can\'t fight with her umbrella gone, but she can COVER you and CALL OUT what\'s coming.\n\n(Carrying her, you can\'t run or jump.)' },
  ],
};
