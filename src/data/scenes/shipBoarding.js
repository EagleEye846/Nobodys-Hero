// SHIP BOARDING: the foot of the gangway on the quay (ship_plank, trigger x 22, rows 7-8; reached from the slip's fog bell, ship_looms). The first sight of the
// brig FAIR RETURN: whole, with all her ropes, dry in a yard of wrecks. A bell on her deck strikes eight bells (the end
// of a watch) with nobody there to strike it. Ves and Bramble stand on the quay (21,6) and (21,10), clear of the
// gangway. No monsters in this room. The hero never speaks. DRAFT words, for the designer.
export const SHIP_BOARDING = {
  id: 'ship_boarding',
  room: 'ship_plank',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 21, y: 6, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 21, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'bramble', dir: 'right' },
    { do: 'say', text: 'The quay stops at a wall. It is the side of a ship: a great black brig, lying against the end of the Wreck Yard as if she\'d only put in for the night. A plank runs up to a gap in her rail. Over the gap is a board with her name on it, gilt on black: FAIR RETURN.\n\nShe has all her masts. She has all her ropes. Everything else in the yard is a wreck, and she is dry.' },
    { do: 'say', who: 'bramble', text: '{worried}Everything else here is broken. She\'s not.' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{thoughtful}No. She isn\'t.' },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.35 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.3 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.35 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.3 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.35 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.3 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 0.35 },
    { do: 'sound', name: 'bell' },
    { do: 'wait', seconds: 1.0 },
    { do: 'say', text: 'On the ship, a bell is struck. Two strokes, a gap. Two, a gap. Two, a gap. Two. Eight bells: the end of a watch. There is nobody on her deck to strike it.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}...Somebody\'s finished their watch.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{thoughtful}Nobody has been on watch aboard that ship for a hundred years.' },
    { do: 'say', who: 'bramble', text: '{worried}Then who\'s going off it?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{bored}Let\'s not ask the plank. ...No. You are going aboard, aren\'t you. The sword hasn\'t stopped humming since the point. Mind your feet.' },
    { do: 'face', who: 'ves', dir: 'right' },
  ],
};
