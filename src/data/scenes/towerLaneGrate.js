// TOWER LANE GRATE: coming up the lane under Merrow's bell tower (merrow_tower_lane). The
// tower's door is barred from inside. Beside it, at the waterline, is an old flood grating with
// half its bars rusted away: a hole about the size of a ten-year-old, and full of sea. Ves
// points out whose size that is; Bramble is scared and says so. Then it's over to the player
// (E steers Bramble). The trigger is the whole of column 12; the walks stay in x 13 to 17, rows
// 8 to 10 (the room's monsters are east of x 26). The hero never speaks. DRAFT words.
export const TOWER_LANE_GRATE = {
  id: 'tower_lane_grate',
  room: 'merrow_tower_lane',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 9, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 11, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 16, y: 8 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 14, y: 9 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 15, y: 10 } },
    { do: 'wait', seconds: 0.4 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'The lane comes out under the bell tower. Its door is oak and iron, and when you push it, it doesn\'t so much as rattle. Barred, from the inside.\n\nBeside it, down where the flood laps the wall, is an old drain grating with half its bars rusted away.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{thoughtful}That\'s a Bramble-sized hole.' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}It\'s a SEA-sized hole. It\'s full of sea!' },
    { do: 'say', who: 'ves', text: '{bored}It\'ll come up to your chin. I measured it with my eyes.' },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}It\'s dark in there. And there\'ll be eels. There\'s always eels in a hole.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}Then be quick.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}...I\'m going to be SO quick.' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', text: 'Only Bramble will fit through the grating. (E steers him.)' },
  ],
};
