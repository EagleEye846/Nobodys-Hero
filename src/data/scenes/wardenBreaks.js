// WARDEN BREAKS: after the fight. The Warden cracks from the plinth up while
// it says its last words (the warden_crack animation, wardenFall.js); its
// eyes go out; then it comes apart and falls (warden_fall), and as it falls
// its sword goes into the Gate, and the Gate comes down with it. Dust, and
// dawn through the broken doors. Then the Hush is gone from its shoulder:
// down into the gateway's shadow. The game saves itself here (hush_descends
// is next).
export const WARDEN_BREAKS = {
  // Triggers in rooms name the scene by this id.
  id: 'warden_breaks',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_gate_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 8, y: 12, portrait: 'vesper_bare', plays: 'vesper' },
    { id: 'warden', look: 'anim:warden_crack', x: 13, y: 7, plays: 'warden' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 1 },
    { do: 'sound', name: 'creak' },
    // It cracks, slowly, all through what it says (5 frames, 2.5 seconds).
    { do: 'animate', who: 'warden', animation: 'warden_crack', speed: 0.5, once: true },
    { do: 'say', text: 'A crack runs up the Warden from its plinth to its crown, slowly, with a sound like ice on a pond.' },
    { do: 'say', who: 'warden', text: '...THREE HUNDRED YEARS.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'warden', text: 'I WAS MADE TO KNOW HIM WHEN I SAW HIM.\n\n...I THINK I WOULD NOT HAVE KNOWN HIM AT ALL.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'The light goes out of its eyes. For a moment nothing in the court moves at all.' },
    { do: 'sound', name: 'crumble' },
    { do: 'quake', amount: 2, seconds: 1.2 },
    { do: 'wait', seconds: 1 },
    // And it falls (11 frames, about 2.4 seconds), the screen shaking with it.
    { do: 'animate', who: 'warden', animation: 'warden_fall', speed: 0.22, once: true },
    { do: 'sound', name: 'creak' },
    { do: 'quake', amount: 5, seconds: 2.4 },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'boom' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'crumble' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'boom' },
    { do: 'say', text: 'The Warden falls. Its stone sword comes down across the Gate, and the great doors give, and fall in, and the Gate comes down with it in a long roar of stone.', shake: true },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', text: 'When the dust settles, there\'s grey light coming through where the doors were. Dawn, on the far side.' },
    { do: 'say', who: 'ves', text: '{sad}...It didn\'t want to stop. It just didn\'t know how.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{worried}Where\'s the Hush? It was up on its shoulder. It was right there.' },
    { do: 'say', text: 'Something moves in the shadow of the broken gateway. Quiet as snow.' },
    { do: 'save' },
    { do: 'say', text: '(The game has saved.)' },
  ],
};
