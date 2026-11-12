// SHIP HOLD IN: down the ladder into the hold (ship_hold, trigger (3-4, row 5), the tiles just under the ladder). The ship
// lurches to port as you come down (the list is set, the lights go low), a whistle far off in the dark. Nothing yet:
// this is only the dread before the chase (ship_hold_chase, further on). Ves (2,4), Bramble (4,4). The Bosun sleeps at
// (4,13), nine tiles south. The hero never speaks. DRAFT words.
export const SHIP_HOLD_IN = {
  id: 'ship_hold_in',
  room: 'ship_hold',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 2, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 4, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', text: 'The hold is the biggest room in the ship, and the darkest. The lantern shows you the first stack of crates, and the second, and gives up. Beyond that there is only the sound of a lot of heavy things, packed tight, waiting.' },
    { do: 'haunt', list: 'port', dip: 3.2 },
    { do: 'sound', name: 'shipGroan' },
    { do: 'say', text: 'The ship leans. Slowly, like a man leaning on a wall. Somewhere in the dark, barrels begin to roll, and stop.' },
    { do: 'say', who: 'bramble', text: '{scared}Did we just MOVE?' },
    { do: 'say', who: 'ves', text: '{thoughtful}The ship did. She shouldn\'t be able to. ...Keep that lantern lit, will you? I\'d like to see what\'s looking.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'whistle' },
    { do: 'say', text: 'Far away, a bosun\'s whistle: one long, low note, going up. Somebody calling the hands.\n\nIt isn\'t meant for you.' },
    { do: 'say', who: 'bramble', text: '{worried}...Is it just me, or does that sound a bit like someone asking to be let go?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{thoughtful}It\'s not just you.' },
  ],
};
