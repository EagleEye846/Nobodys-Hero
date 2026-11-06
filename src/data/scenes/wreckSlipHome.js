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
  ],

  steps: [
    { do: 'say', who: 'haddock', text: '{smile}Saltcombe, then? In you get. Sit still.' },
    { do: 'stage', dim: 1, seconds: 1.6 },
    { do: 'sound', name: 'splash' },
    { do: 'wait', seconds: 1.8 },
    { do: 'goto', room: 'saltcombe_lookout', spawn: { x: 30, y: 20 } },
  ],
};
