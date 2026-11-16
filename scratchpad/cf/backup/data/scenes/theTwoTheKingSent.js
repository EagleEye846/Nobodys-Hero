// THE TWO THE KING SENT (draft): the pithead, the first time you come down
// the back way from the king's hall. Sedge, the foreman of a shift of two,
// stops you at the edge of his yard and decides who you are. Ves won't be
// "sent". Mattock gets halfway through his grandad's grandad's story about a
// star going down into Seam Nine before Sedge stops him (the whole of it is
// in Mattock's talk, and Seam Nine itself: seam_nine_star).
//
// Clearance: there are no monsters at the pithead. You walk in to 9,9 and Ves
// to 8,10; Mattock comes over from 19,11 to 13,11 along row 11, and goes
// back to his spot at the end.
export const THE_TWO_THE_KING_SENT = {
  // Triggers in rooms name the scene by this id.
  id: 'the_two_the_king_sent',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'diggings_pithead',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'sedge', look: 'prop:bf_mole_miner_a', x: 11, y: 10, plays: 'mole_sedge' },
    { id: 'mattock', look: 'prop:bf_mole_miner_b', x: 19, y: 11, plays: 'mole_mattock' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 9, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 8, y: 10 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'sedge', dir: 'left' },
    { do: 'emote', who: 'sedge', emote: '!' },
    { do: 'say', who: 'sedge', text: 'Hold it. Hard hats.\n\n...You haven\'t got hard hats. Mind your heads, then. Twice as hard.' },
    { do: 'say', who: 'sedge', text: 'Sedge. Foreman. You\'ll be the two the king sent.' },
    { do: 'say', who: 'ves', text: '{bored}Nobody sent us. {proud}We were coming down anyway. He just pointed.' },
    // Mattock, who has been listening from the shift board, hurries over.
    { do: 'walk', who: 'mattock', to: { x: 13, y: 11 } },
    { do: 'face', who: 'mattock', dir: 'left' },
    { do: 'say', who: 'mattock', text: 'That\'s what the last one did! Came down here with nobody sending him.\n\nMy grandad\'s grandad saw him. And then he saw a star go straight down into Seam Ni-' },
    { do: 'face', who: 'sedge', dir: 'right' },
    { do: 'say', who: 'sedge', text: 'Mattock.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'mattock', text: '...Into a seam. Any seam. We\'ve got loads. None of them are called anything.' },
    { do: 'face', who: 'sedge', dir: 'left' },
    { do: 'say', who: 'sedge', text: 'Carts are east. Lamps are lit. The dark between them is not my department.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', who: 'ves', text: '{smile}Seam Nine. {bored}Noted.' },
    // Mattock goes back to the shift board.
    { do: 'walk', who: 'mattock', to: { x: 19, y: 11 } },
    { do: 'face', who: 'mattock', dir: 'down' },
    { do: 'wait', seconds: 0.3 },
  ],
};
