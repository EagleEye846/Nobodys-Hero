// THE CREW COME HOME (DRAFT, 2026-11-14): after the Fair Return has sailed (crew_go_free, which `sees`
// fair_return_gone), four of her crew turn up in Saltcombe, once each, to say goodbye, and then they're gone.
// Each ghost is a prop in its room, there `after: fair_return_gone` and `until` its own scene; the scene's actor
// plays it (its `cast`) and fades. The living answer them. The hero never speaks; Ves and Bramble say very little.
//   crew_home_quay    the quay: the lookout at Mrs. Tansy's last lamp (her gran's gran lit the quay for the ship),
//                     and the ship's boy on the fisher's step by the stoat (whose gran heard the crew singing).
//                     He leaves the coil on the step (a prop, after this scene).
// Who belongs to whom is a guess for the designer to change.

// The quay. The trigger (saltcombeQuay.js) is the quay's boards, rows 6-12: the first step onto them from any way in.
// The lookout stands at (27,8), pointing east at the last lamp (31,7) past Tansy (29,8); the boy kneels at the fisher's
// shut door (26,6), the stoat (24,7) beside him. Nobody walks: the camera goes to them.
export const CREW_HOME_QUAY = {
  id: 'crew_home_quay',
  room: 'saltcombe_quay',
  once: true,

  actors: [
    { id: 'lookout', look: 'prop:gs_ghost_lookout', x: 27, y: 8, plays: 'home_lookout', animation: 'gs_ghost_lookout', speed: 1.2 },
    { id: 'boy', look: 'prop:gs_ghost_boy', x: 26, y: 6, plays: 'home_boy', animation: 'gs_ghost_boy', speed: 0.8 },
    { id: 'tansy', look: 'prop:cf_tansy', x: 29, y: 8, portrait: 'tansy', plays: 'tansy', animation: 'cf_tansy', speed: 0.45 },
    { id: 'ves', look: 'prop:vesper_stand', x: 20, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 21, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    // (draft) 2026-11-15: trimmed (the hush on the quay and the ghosts leaving are shown, not told).
    { do: 'camera', to: { x: 28, y: 8 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'lookout', text: 'A tall, pale man is standing by Mrs. Tansy\'s last lamp with one arm out, pointing at it, the way he pointed from the top of the mast.\n\n"There," he says. "I told them there were lights. Every lamp on the quay."' },
    { do: 'face', who: 'tansy', dir: 'left' },
    { do: 'say', who: 'tansy', text: '{huffy}...Course there were. They\'re mine.' },
    { do: 'say', who: 'tansy', text: '{smug}My gran\'s gran lit them for you. A whole winter, every night.\n\n{huffy}...You took your time.' },
    { do: 'animate', who: 'lookout', animation: null },
    { do: 'wait', seconds: 1.4 },
    { do: 'leave', who: 'lookout' },
    { do: 'wait', seconds: 1.2 },
    { do: 'camera', to: { x: 25, y: 7 } },
    { do: 'say', who: 'boy', text: 'On the fisher\'s step, a boy is kneeling, coiling the end of the stoat\'s net line. Real rope, this time. Over, and under.\n\n"I did it right," he tells the stoat. "First voyage. Will you tell my mam?"' },
    { do: 'say', text: 'The stoat looks at him for a long moment.\n\n"Your mam\'s been gone a good while, son," he says, gently. "...I\'ll tell her anyway. First thing."' },
    { do: 'animate', who: 'boy', animation: null },
    { do: 'wait', seconds: 1 },
    { do: 'leave', who: 'boy' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'bramble', text: '{proud}...He did do it right. I SAW him.', after: 'bramble_and_the_boy' },
    { do: 'camera' },
  ],
};
