// SHIP QUARTERS IN: down the hatch into the crew's quarters (ship_quarters, trigger row 3, x 12-16: the row you land on). Hammocks,
// laid mess table, sea chests. Then the harmonium at the bow end plays, by itself, six notes of the crew's song (haunt.js
// `play`); and plays them again: it wants answering. Ves (12,4) and Bramble (16,4). Both monsters are further off than
// five tiles. The hero never speaks. DRAFT words.
export const SHIP_QUARTERS_IN = {
  id: 'ship_quarters_in',
  room: 'ship_quarters',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 12, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 16, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', text: 'Below, it smells of lye soap and wet wool and pipe smoke: the smell of a room a great many people left a minute ago. Hammocks hang in a row along the wall with a name stitched on every one. The long table is laid for supper, a tin mug and a knife at every place, a hard biscuit in front of each.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'haunt', play: true },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Somewhere forward, an organ note sounds. Then another. A little harmonium, playing a tune of six notes, the start of a sailors\' song, up a step and a step and then falling home, and stopping as if the rest were a very long way off.\n\nNobody is at it. The keys go down by themselves.' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}Nobody\'s playing it! The keys are going DOWN!' },
    { do: 'say', who: 'ves', text: '{bored}It\'s a harmonium, Bramble. That\'s what the keys do.' },
    { do: 'say', who: 'bramble', text: '{scared}BY THEMSELVES?' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', who: 'ves', text: '{thoughtful}...Not usually. No.' },
    { do: 'wait', seconds: 3.4 },
    { do: 'haunt', play: true },
    { do: 'wait', seconds: 3.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}It\'s doing it again. Same six notes. I think it wants someone to answer.' },
    { do: 'say', who: 'bramble', text: '{worried}Why would a harmonium want that?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Because whoever played it last was never allowed to finish.' },
  ],
};
