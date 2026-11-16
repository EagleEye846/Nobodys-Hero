// HOME FROM THE SLIP: the end of the slip in the Wreck Yard (wreck_slip, the trigger
// x 13 to 16, row 13). Haddock rows the three back to Saltcombe, to the landing under the
// lookout (saltcombe_lookout), where to_the_wreck_yard set out from. Any time (`once:
// false`), so the yard can be visited again. Short: one exchange, the fade, the goto.
// Haddock speaks from where his prop stands on the slip; nobody walks.
export const WRECK_SLIP_HOME = {
  id: 'wreck_slip_home',
  room: 'wreck_slip',
  once: false,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 15, y: 10, portrait: 'haddock', plays: 'haddock_wreck', centered: true, animation: 'cf_haddock', speed: 0.5 },
    { id: 'ves_voice', look: 'prop:vesper_stand', x: 1, y: 1, portrait: 'vesper', hidden: true },
  ],

  steps: [
    // After the chapter he isn't on the slip (his prop is gone, and the actor would stand there alone):
    // out of sight at once, and Ves rows ((draft)).
    { do: 'leave', who: 'haddock', instant: true, after: 'haddock_gone' },
    { do: 'say', who: 'haddock', text: '{smile}Saltcombe, then? In ye get. Sit still.', until: 'haddock_gone' },
    { do: 'say', who: 'ves_voice', text: "{smile}Saltcombe. In you get. And no, you can't steer.", after: 'haddock_gone' },
    { do: 'stage', dim: 1, seconds: 1.6 },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 1.8 },
    { do: 'goto', room: 'saltcombe_lookout', spawn: { x: 30, y: 20 } },
  ],
};
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).

// HOME FROM THE SLIP, the first time after the mast (wreck_star_shard), for anyone who walks
// straight down to the boat without talking to him: Haddock says his piece about the sword and
// Orla himself (his [first after wreck_star_shard] lines, text/npcs/haddock_wreck.txt), then rows.
// Once; skipped if you'd already heard it from him (the trigger's `untilTalked`, wreckSlip.js).
// (draft) 2026-11-16.
export const WRECK_SLIP_ORLA = {
  id: 'wreck_slip_orla',
  room: 'wreck_slip',
  once: true,

  actors: [
    { id: 'haddock', look: 'prop:cf_haddock', x: 15, y: 10, portrait: 'haddock', plays: 'haddock_wreck', centered: true, animation: 'cf_haddock', speed: 0.5 },
    { id: 'bramble_voice', look: 'prop:bramble_stand', x: 1, y: 1, portrait: 'bramble', hidden: true },
  ],

  steps: [
    { do: 'say', who: 'haddock', text: "{proud}There ye are! Look at that sword. Pullin' like a dog on a lead, and all the one way." },
    { do: 'say', who: 'haddock', text: "{determined}Star-iron, that is. Only one smith on this coast would know what to do with it: Orla Cobb, out on the Beacon Isles. Big grey seal. Bad temper. Best hands I ever saw. She'll want what it's missin', mind." },
    { do: 'say', who: 'bramble_voice', text: '{surprised}A seal. A seal SMITH.' },
    { do: 'say', who: 'haddock', text: "{eh}See that post out on the point? There were a fog bell on it once. Me gran said they rang it for a ship that never come in, and one foggy night summat out there rang back. Took it down after, they did, and good riddance. Leave the point be." },
    { do: 'say', who: 'haddock', text: '{smile}Saltcombe, then? In ye get. Sit still.' },
    { do: 'stage', dim: 1, seconds: 1.6 },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 1.8 },
    { do: 'goto', room: 'saltcombe_lookout', spawn: { x: 30, y: 20 } },
  ],
};
