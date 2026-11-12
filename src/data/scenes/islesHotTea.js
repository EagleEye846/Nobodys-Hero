// ISLES HOT TEA: the top of the old light, which nobody has used for years. Dust on everything,
// and under the window a lantern burning, and a cup of tea still steaming beside it. (Lantern 5
// of the chapter.) Ves touches the cup; it's hot. Each of them has a plain excuse for it, and
// nobody follows it up. (The hero never speaks.) The walks stay on the boards between the stair
// and the table (rows 4 to 9): the hero steps to 5,9, Ves goes round the chair (12,4) to the
// table, Bramble to 10,7 (above the text box). The room has no monsters.
export const ISLES_HOT_TEA = {
  id: 'isles_hot_tea',
  room: 'isles_old_lightroom',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 3, y: 8, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 2, y: 9, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 5, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', text: 'Forty steps up, the old lightroom. Dust lies on the boards like a carpet, with no prints in it but yours. The great lens stands in the middle, grey, a web strung from it to the floor.\n\nUnder the window there\'s a little table. On it, a lantern is burning. Beside the lantern is a cup of tea, and the steam is still coming off it.' },
    { do: 'walk', who: 'ves', to: { x: 11, y: 6 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 5 } },
    { do: 'walk', who: 'ves', to: { x: 13, y: 4 } },
    { do: 'face', who: 'player', at: 'ves' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{surprised}...It\'s hot.' },
    { do: 'emote', who: 'player', emote: '?', wait: false },
    { do: 'walk', who: 'bramble', to: { x: 10, y: 7 } },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{thinking}Somebody\'s just popped out. For milk, probably.' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{bored}Or the fishers come up to watch the weather. You\'d want tea, for that much weather.' },
    { do: 'act', who: 'bramble', act: 'fidget', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}...We should go before they get back. It\'s rude, being in somebody\'s lighthouse.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'Ves puts the cup back down, exactly where it was, handle turned the same way.' },
    { do: 'say', who: 'ves', text: '{thoughtful}...Yes. Rude.' },
    { do: 'walk', who: 'ves', to: { x: 11, y: 7 } },
  ],
};
