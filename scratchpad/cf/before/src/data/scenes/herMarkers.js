// HER MARKERS: in the Wisp Hollow, where the lanterns have all gone out and
// the boards fork and fork again. Ves came this way, and tied a strip of her
// coat at every turning she took. Follow them.
export const HER_MARKERS = {
  // Triggers in rooms name the scene by this id.
  id: 'her_markers',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'marsh_wisp_hollow',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'bramble', look: 'prop:bramble_stand', x: 7, y: 5, portrait: 'bramble', plays: 'bramble' },
    // Ves is on your back: she talks, but isn't anywhere else to be seen.
    { id: 'ves', look: 'prop:vesper_hurt', x: 0, y: 0, portrait: 'vesper_bare', hidden: true },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'bramble', text: '{worried}All the lanterns are out after here. All of them.' },
    { do: 'say', who: 'ves', text: '{thoughtful}I know. I came this way in the dark. The boards split up all over the place, and most of them just stop.\n\n{determined}I tied a bit of my coat on a reed at every turning I took. Look for the blue.' },
    { do: 'say', who: 'bramble', text: '{proud}We KNOW. We\'ve been following them for ages.' },
    { do: 'say', who: 'ves', text: '{shy}...Oh.\n\n{tender}Well. Good.' },
  ],
};
