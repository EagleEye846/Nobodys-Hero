// (3 November: the spared ending can no longer happen, since the last act snaps
// the MERCY bar. `rumbold_spared` is kept below but nothing reaches it; only
// `rumbold_defeated` plays, and it gives the Spare Paper Crown.)
// AFTER THE DUEL: the hall, silent, and the truth. However the fight ended
// (`rumbold_spared`: in the last act Tuck stopped the puppet with his own
// voice; or `rumbold_defeated`: you broke it), it's nearly the same scene.
// The light that got into the king has gone, off up into the dark of the
// hall, and what's left on the dais is a heap of painted wood with the paper
// crown on top. Tuck stands beside it on his own two feet, free of the
// strings. Ves looks up at the roof, where the light went, and nobody has an
// answer for that.
//
// Then Tuck says sorry, and tells the hall what it was: there never was a
// King Peptup, just a dormouse nobody listened to. When the old king died and
// the light was going, all the folk wanted was the Hero back; the Hero wasn't
// coming, but the Hero's lost friend might be found. So Tuck carved a tall
// wooden man (the Hero's friend had to be somebody you'd look up to) and said
// he'd found him in the dark. Ves notes he made him a lot taller than the
// Hero (so did the mural). He believed it, at the end, the king: he'd heard
// the story more than anyone. Ves says we've got a nobody too. A mole asks how
// long he's been doing the voice. "Forty-two." "It's a REALLY good voice."
// Spared, the hall heard that voice stop the king, and says so, and somebody
// claps, then a few more; beaten, Tuck crouches by the pieces, and nobody
// claps. Then he takes the spare paper crown he always carried for the shows
// out of his coat, and leaves it at the edge of the dais for you.
//
// Then a crack runs up a pillar. Then another. The duel has cracked the
// pillars that hold the hall up, and the scene carries on into
// the_hall_falls (belowtown_collapse).
//
// The throne is cast from the room's prop (`cast: 'throne'`), its curtain
// fallen closed again: nobody behind it now. The folk are the same as in the
// duel (hallFolk.js).
import { audienceActors, hush } from './hallFolk.js';

// The four pillars of the hall (carved, standing: the `I` tiles).
const PILLARS = [
  { id: 'crackA', x: 22, y: 7 },
  { id: 'crackB', x: 3, y: 16 },
  { id: 'crackC', x: 3, y: 7 },
  { id: 'crackD', x: 22, y: 16 },
];

function afterDuel(id, beaten) {
  return {
    id,
    room: 'belowtown_throne',
    once: true,

    actors: [
      // (Where the duel left her, beside you in the aisle.)
      { id: 'ves', look: 'prop:vesper_stand', x: 13, y: 12, portrait: 'vesper', plays: 'vesper' },
      // The king's place: nothing there now but the heap (below).
      { id: 'king', look: 'prop:bf_rumbold', x: 11, y: 7, portrait: 'rumbold', plays: 'rumbold', centered: true, hidden: true },
      // The throne, its curtain fallen closed (nobody on the stool).
      { id: 'throne', look: 'prop:bf_throne', x: 11, y: 6, plays: 'throne', centered: true },
      // What's left of the king: a heap of painted wood, the crown on top.
      { id: 'planks', look: 'anim:finale_planks', x: 12, y: 7 },
      // Tuck, free, standing on the dais by the heap.
      { id: 'tuck', look: 'prop:bf_tuck', x: 14, y: 8, portrait: 'tuck' },
      ...audienceActors(),
      ...PILLARS.map((p) => ({ id: p.id, look: 'anim:finale_pillar_crack', x: p.x, y: p.y, hidden: true })),
    ],

    steps: [
      { do: 'music' },
      { do: 'stage', spots: [], dim: 0.12, seconds: 0.6 },
      ...hush(),
      { do: 'face', who: 'player', dir: 'up' },
      { do: 'face', who: 'ves', dir: 'up' },
      { do: 'camera', to: { x: 12, y: 8 } },
      // Nothing for a moment. Then the last of him settling: a board slides,
      // the crown rocks, once, twice, and stops.
      { do: 'wait', seconds: 1 },
      { do: 'animate', who: 'planks', animation: 'finale_planks', speed: 0.5 },
      { do: 'sound', name: 'clack' },
      { do: 'wait', seconds: 1.2 },
      { do: 'animate', who: 'planks' },
      { do: 'sound', name: 'click' },
      { do: 'wait', seconds: 1.2 },
      // Tuck beside the heap, rubbing his wrists where the strings were
      // (tuck_rub, src/data/art/ch4Moves.js), until he's said his piece.
      { do: 'animate', who: 'tuck', animation: 'tuck_rub', speed: 0.45 },
      ...(beaten ? [
        { do: 'say', text: 'What is left of King Peptup lies across the dais in pieces: a hand here, a foot there, the jaw, and the paper crown on top. Nothing in it is lit now.\n\nTuck stands beside it, rubbing his wrists where the strings were.' },
      ] : [
        { do: 'say', text: 'King Peptup lies on the dais in a heap of painted wood, with his paper crown on top. Nothing in him is lit now.\n\nTuck stands beside him on his own two feet, rubbing his wrists where the strings were.' },
      ]),
      { do: 'wait', seconds: 0.8 },
      // Where the light went.
      { do: 'face', who: 'ves', dir: 'up' },
      { do: 'camera', to: { x: 12, y: 3 } },
      { do: 'wait', seconds: 1.4 },
      // (Ves stands low in the hall: the words go at the top, so the box doesn't hide her.)
      { do: 'textbox', top: true },
      { do: 'say', who: 'ves', text: '{thoughtful}...Where did that go?' },
      { do: 'act', who: 'tuck', act: 'shiver', wait: false },
      { do: 'say', who: 'tuck', text: '{scared}I don\'t know. I don\'t know what that was. In forty-two years he never... it was never like that.' },
      { do: 'camera', to: { x: 12, y: 8 } },
      { do: 'wait', seconds: 0.8 },
      // He stops rubbing his wrists, and turns to the hall.
      { do: 'animate', who: 'tuck' },
      { do: 'face', who: 'tuck', dir: 'down' },
      { do: 'wait', seconds: 0.5 },
      { do: 'say', who: 'tuck', text: '{sad}...Sorry.' },
      { do: 'wait', seconds: 0.6 },
      { do: 'say', who: 'tuck', text: '{shy}There never was a King Peptup. Not a real one. There was just... me.\n\nAnd nobody listens to a dormouse.' },
      { do: 'say', who: 'tuck', text: '{whisper}When the old king died, everybody was so frightened. The light was going.\n\nAll anybody said was, if only the Hero would come back.' },
      { do: 'say', who: 'tuck', text: '{shy}The Hero wasn\'t coming. But the Hero\'s friend, lost in the dark... somebody might FIND him.' },
      { do: 'say', who: 'tuck', text: '{sad}So I carved him. All winter, up a ladder.\n\nHe had to be tall. The Hero\'s friend had to be somebody you\'d look up to.\n\nThen I told everybody I\'d found him.' },
      { do: 'say', who: 'ves', text: '{thoughtful}You made him a lot taller than the Hero.' },
      // He looks round at the heap, as if to check.
      { do: 'face', who: 'tuck', dir: 'left' },
      { do: 'wait', seconds: 0.4 },
      { do: 'say', who: 'tuck', text: '{surprised}...Did I?' },
      { do: 'say', who: 'ves', text: '{bored}Don\'t worry. So did the mural.' },
      { do: 'wait', seconds: 0.8 },
      { do: 'face', who: 'tuck', dir: 'down' },
      { do: 'act', who: 'tuck', act: 'sigh' },
      { do: 'say', who: 'tuck', text: '{sad}He believed it, at the end. {whisper}I suppose he\'d heard it more than anyone.' },
      { do: 'act', who: 'tuck', act: 'sigh' },
      { do: 'say', who: 'tuck', text: '{sad}I\'m nobody. A nobody can only be king from behind a puppet.' },
      { do: 'wait', seconds: 1 },
      { do: 'say', who: 'ves', text: '{thoughtful}That\'s funny.' },
      // A look at you (you're on her left), a nod, and back to Tuck.
      { do: 'face', who: 'ves', dir: 'left' },
      { do: 'face', who: 'player', dir: 'right' },
      { do: 'act', who: 'ves', act: 'nod' },
      { do: 'face', who: 'ves', dir: 'up' },
      { do: 'wait', seconds: 0.4 },
      { do: 'say', who: 'ves', text: '{smile}We\'ve got a nobody too. He\'s done all right.' },
      { do: 'face', who: 'ves', dir: 'up' },
      { do: 'face', who: 'player', dir: 'up' },
      ...(beaten ? [
        // Beaten: you broke him, and Tuck crouches by the pieces.
        { do: 'wait', seconds: 0.8 },
        { do: 'face', who: 'tuck', dir: 'left' },
        { do: 'act', who: 'tuck', act: 'crouch' },
        { do: 'wait', seconds: 0.6 },
        { do: 'say', who: 'tuck', text: '{sad}He wasn\'t going to stop. Not once he\'d started.\n\n{shy}...Thank you. I think.' },
        { do: 'act', who: 'tuck', act: 'stand' },
        { do: 'face', who: 'tuck', dir: 'down' },
        { do: 'say', who: 'ves', text: '{bored}Should\'ve stayed in his chair.' },
      ] : [
        // Spared: Tuck stopped him himself, and the whole hall heard.
        { do: 'wait', seconds: 0.8 },
        { do: 'say', who: 'ves', text: '{bored}Four words. You could have led with those.' },
        { do: 'say', who: 'tuck', text: '{shy}I didn\'t know I could. I\'ve never said anything in my own voice that loud.' },
      ]),
      { do: 'wait', seconds: 1 },
      { do: 'animate', who: 'a1', animation: 'bf_mole_crowd', speed: 0.9 },
      ...(beaten ? [] : [
        { do: 'say', who: 'a1', text: '...That was YOU? Just now? The "stop"?' },
        { do: 'say', who: 'tuck', text: '{shy}...Yes.' },
      ]),
      { do: 'say', who: 'a1', text: '...You\'ve been doing the voice for forty years?' },
      { do: 'say', who: 'tuck', text: '{shy}Forty-two.' },
      { do: 'wait', seconds: 0.8 },
      { do: 'say', who: 'a1', text: 'It\'s a REALLY good voice.' },
      { do: 'animate', who: 'a1' },
      ...(beaten ? [
        { do: 'wait', seconds: 0.8 },
      ] : [
        // Spared, the hall heard him: somebody claps. Then a few more.
        { do: 'wait', seconds: 0.6 },
        { do: 'animate', who: 'kid', animation: 'bf_frog_kid_a', speed: 0.5 },
        { do: 'wait', seconds: 0.9 },
        { do: 'animate', who: 'a1', animation: 'bf_mole_crowd', speed: 0.45 },
        { do: 'animate', who: 'snail', animation: 'bf_snail_elder', speed: 0.6 },
        { do: 'wait', seconds: 0.5 },
        { do: 'animate', who: 'miner', animation: 'bf_mole_miner_b', speed: 0.45 },
        { do: 'animate', who: 'b7', animation: 'bf_toad_innkeeper', speed: 0.6 },
        { do: 'wait', seconds: 0.9 },
        { do: 'act', who: 'tuck', act: 'hop' },
        { do: 'say', text: 'Tuck\'s ears go very pink.' },
      ]),
      // A spare crown: Tuck always carried one, for the shows.
      { do: 'say', text: 'Tuck takes a second paper crown out of his coat, folded flat. He shakes it open, looks at it, and sets it down at the edge of the dais.' },
      { do: 'say', who: 'tuck', text: '{shy}He always needed a spare. ...I don\'t want it.' },
      { do: 'give', item: 'paper_crown' },
      { do: 'wait', seconds: 0.6 },
      { do: 'textbox', top: false },

      // And then a crack runs up a pillar, and the hall goes quiet again.
      ...hush(),
      { do: 'sound', name: 'creak' },
      { do: 'wait', seconds: 0.5 },
      { do: 'appear', who: 'crackA' },
      { do: 'animate', who: 'crackA', animation: 'finale_pillar_crack', speed: 0.45, once: true },
      { do: 'camera', to: { x: 17, y: 8 } },
      { do: 'say', text: 'High up the side of the hall, a thin line of light runs up one of the pillars. It sounds like a very large biscuit breaking.' },
      { do: 'sound', name: 'creak' },
      { do: 'appear', who: 'crackB' },
      { do: 'animate', who: 'crackB', animation: 'finale_pillar_crack', speed: 0.4, once: true },
      { do: 'quake', amount: 1, seconds: 0.8 },
      { do: 'wait', seconds: 1 },
      { do: 'say', who: 'tuck', text: '{scared}...That\'s not supposed to do that.' },
      { do: 'sound', name: 'creak' },
      { do: 'appear', who: 'crackC' },
      { do: 'appear', who: 'crackD' },
      { do: 'animate', who: 'crackC', animation: 'finale_pillar_crack', speed: 0.3, once: true },
      { do: 'animate', who: 'crackD', animation: 'finale_pillar_crack', speed: 0.3, once: true },
      { do: 'stage', rubble: 3, rubbleAmount: 0.4, flicker: 2 },
      { do: 'quake', amount: 2, seconds: 1.4 },
      { do: 'sound', name: 'crumble' },
      { do: 'wait', seconds: 2.2 },
      // The hall comes down: on into the collapse.
      { do: 'goto', room: 'belowtown_collapse', spawn: { x: 13, y: 20 } },
    ],
  };
}

export const RUMBOLD_SPARED = afterDuel('rumbold_spared', false);
export const RUMBOLD_DEFEATED = afterDuel('rumbold_defeated', true);
