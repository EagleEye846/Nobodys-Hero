// GATE CHOKED: the end of the Ash Road for now (ash_town_gate, in front of the gate, after the
// Lum). The town's gate stands up out of the ash, and the ash behind it is piled to the lintel.
// The buried town is the next part of the chapter and isn't built yet: the last line says so
// plainly. TEMP until the town exists. No walks. (draft)
export const GATE_CHOKED = {
  id: 'gate_choked',
  room: 'ash_town_gate',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 27, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 26, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', text: 'The town\'s gate stands up out of the ash. Through the arch there\'s no street: only ash, piled to the lintel, and on up the bank past the roofs.' },
    { do: 'say', who: 'bramble', text: '{surprised}There\'s a whole town under there.' },
    { do: 'say', who: 'ves', text: '{bored}I can blow a heap off a road. I can\'t blow a town out of a hill.' },
    { do: 'say', who: 'bramble', text: '{determined}Then we dig.' },
    { do: 'say', who: 'ves', text: '{smile}You first.' },
    { do: 'say', text: '(This is as far as the Ash Road goes for now. The buried town is the next part of the chapter.)' },
  ],
};
