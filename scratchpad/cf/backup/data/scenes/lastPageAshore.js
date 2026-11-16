// LAST PAGE ASHORE (DRAFT): once, on the Saltcombe quay, the first time you are on it holding the other four torn pages of
// the Fair Return's log (log_page_1 to log_page_4). Something knocks at the quay steps (26, row 13), patient as a visitor: a
// bottle, the same green glass and red wax as the other four, that wasn't there a moment ago, on a flat sea. When the scene
// ends it lies on the bottom step (a gift, log_page_5: the page that says where her bell went). Trigger: anywhere on the
// quay's boards (x 1-38, rows 7-12); nobody walks (Ves and Bramble stay where they were following). The town carries on.
// The hero never speaks.
export const LAST_PAGE_ASHORE = {
  id: 'last_page_ashore',
  room: 'saltcombe_quay',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 25, y: 10, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 27, y: 10, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 1.1 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera', to: { x: 26, y: 12 } },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Something is knocking at the quay steps. Knock, and a wait. Knock, and a wait. Patient, like somebody who doesn\'t like to be a bother.\n\nA bottle, nodding against the bottom step. Green glass, a cork sealed with red wax. The water round it is quite flat.' },
    { do: 'say', who: 'bramble', text: '{scared}That wasn\'t there. I was LOOKING at there.' },
    { do: 'say', who: 'ves', text: '{surprised}...It came straight to us. The other four, we had to go and fish out.\n\n{smile}It\'s either a letter or a very slow attack. Go on, then.' },
    { do: 'camera' },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
