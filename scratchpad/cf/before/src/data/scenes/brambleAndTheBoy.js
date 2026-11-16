// BRAMBLE AND THE BOY (DRAFT, 2026-11-14): on the Fair Return's deck (ship_deck), once you carry the Ship's Lantern
// (the crew can only be spoken to in its light, so the scene lights it). The ship's boy kneels at (17,14) coiling a
// rope that isn't there ([ghost_boy]); Bramble crouches by him, says hello, and races him coiling a real line. Bramble
// loses, gets shown how, gets it right, and the boy gives him the keepsake he made for the voyage: a MONKEY'S FIST
// (`give monkeys_fist`). If the crew go free later (crew_go_free), the boy waves to Bramble from her rail.
// The trigger (shipDeck.js) is the band of deck just north of the boy (x 14-20, rows 11-13), on the way from the lantern's
// hook to anywhere aft or forward. Bramble crouches at (16,14) (round by 16,12, never through the boy), the hero stands
// at (17,12), Ves at (19,12): clear of the lantern hook (13,12), the save point (15,16), the gangway head
// trigger (19-22, rows 15-16) and the patrolling ghost_deckhand (24-27, row 13). The hero never speaks.
export const BRAMBLE_AND_THE_BOY = {
  id: 'bramble_and_the_boy',
  room: 'ship_deck',
  once: true,

  actors: [
    // The deck's own ghost boy (its prop has `cast: 'deck_boy'`), still coiling.
    { id: 'boy', look: 'prop:gs_ghost_boy', x: 17, y: 14, plays: 'deck_boy', animation: 'gs_ghost_boy', speed: 0.7 },
    { id: 'ves', look: 'prop:vesper_stand', x: 19, y: 12, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 14, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'haunt', lantern: 'on' },
    { do: 'walk', who: 'player', to: { x: 17, y: 12 } },
    { do: 'walk', who: 'ves', to: { x: 19, y: 12 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 12 } },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 14 } },
    { do: 'camera', to: { x: 17, y: 13 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', at: 'boy' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'Bramble has stopped beside the boy with the rope that isn\'t there. He watches the hands go round for a while.\n\nThen he crouches down, a careful arm\'s length off, the way you get near a bird.' },
    { do: 'act', who: 'bramble', act: 'crouch' },
    { do: 'say', who: 'bramble', text: '{scared}...Hello.' },
    { do: 'animate', who: 'boy', animation: null },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'boy', text: 'The hands stop. The boy looks up. It seems to take him a moment to remember what you say back.\n\n"...Hello."' },
    { do: 'say', who: 'bramble', text: '{awed}Is that rope? I can\'t see it. Is it ghost rope?\n\n{surprised}Can you only do ghost rope, or can you do real rope as well?' },
    { do: 'say', who: 'boy', text: '"It\'s my first voyage," says the boy. "I want it to be right."' },
    { do: 'say', who: 'bramble', text: '{determined}I know rope! Grandad showed me, for hauling logs.\n\n{grin}Race you.' },
    { do: 'animate', who: 'boy', animation: 'gs_ghost_boy', speed: 0.35 },
    { do: 'sound', name: 'creak' },
    { do: 'say', text: 'Bramble grabs the end of a real line off the deck and starts coiling it, fast and furious. Beside him the boy\'s hands go round, neat and even and in no hurry at all.\n\nBramble\'s coil ends up a heap. The boy\'s lies flat and round as a plate.' },
    { do: 'say', who: 'bramble', text: '{sheepish}...You\'ve had LOADS more practice than me.' },
    { do: 'say', who: 'boy', text: 'The boy laughs. It\'s quite a small laugh, and rusty, as if it had been put away somewhere a long while ago and only just found.\n\n"Over, and under, and let the rope do the turning," he says. "Don\'t fight it. It wants to lie down."' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'Bramble tries again, with his tongue out of the side of his mouth. Over, and under.\n\nIt lies down.' },
    { do: 'act', who: 'bramble', act: 'stand' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'say', who: 'bramble', text: '{glee}It WORKED!' },
    { do: 'animate', who: 'boy', animation: null },
    { do: 'say', who: 'boy', text: 'The boy feels inside his jersey and holds something out on his palm: a ball of knotted line the size of a plum, tight and hard, with a tail to throw it by.\n\n"Monkey\'s fist," he says. "I made it for the voyage. You have it." He thinks about it. "You did it right."' },
    { do: 'give', item: 'monkeys_fist' },
    { do: 'say', who: 'bramble', text: '{awed}...To keep?\n\n{worried}I haven\'t got anything to give you back.' },
    { do: 'act', who: 'bramble', act: 'look' },
    { do: 'say', who: 'bramble', text: '{determined}...I\'ll come and say hello, though. Every time we\'re here. That\'s a thing.' },
    { do: 'animate', who: 'boy', animation: 'gs_ghost_boy', speed: 1.1 },
    { do: 'say', text: 'The boy nods, as if that is a fair trade, and goes back to his rope. Slower now. He keeps an eye on Bramble while he does it.' },
    { do: 'say', who: 'ves', text: '{smile}A ghost ship, and he\'s found a friend on it. Of course he has.' },
    { do: 'camera' },
  ],
};
