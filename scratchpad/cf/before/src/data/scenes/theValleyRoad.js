// THE VALLEY ROAD: down out of the fen into the valley at dusk. A stone giant
// fallen on its face in the weeds, and ahead, a great hall with lights in it.
export const THE_VALLEY_ROAD = {
  // Triggers in rooms name the scene by this id.
  id: 'the_valley_road',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'valley_road',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 10, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'camera', to: { x: 13, y: 3 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'In the weeds by the road, a great stone figure lies on its face, broken in three. One hand, bigger than you, still holds a stone sword.' },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{awed}Who knocked HIM over?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Nobody, I think. I think he just got tired of standing.' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{surprised}Look. Up ahead. Smoke. And lights.\n\n{smile}Windows. I told you. Windows.' },
  ],
};
