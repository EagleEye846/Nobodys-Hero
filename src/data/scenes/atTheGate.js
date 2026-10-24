// AT THE GATE: the end of the dead city. The Hero's Gate, shut, and before it
// the Warden, a colossal statue of the Hero, asleep with its sword raised.
// High on its shoulder, the Hush, with Ves's umbrella in its jaws; it looks
// at you, and closes its eyes. Then you step forward, and the Warden wakes.
// It has waited three hundred years for the Hero, and it looks at you and
// finds you wanting: the wrong height, the wrong face, and no name. None may
// pass but the Hero. It can't be talked round: it has to break (the fight;
// warden_breaks after).
export const AT_THE_GATE = {
  // Triggers in rooms name the scene by this id.
  id: 'at_the_gate',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_gate_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_crutch', x: 4, y: 10, portrait: 'vesper_bare', plays: 'vesper' },
    // The Hush, lying up along the statue's shoulder, breathing (hushBeast.js).
    { id: 'hush', look: 'anim:hush_lying', x: 14, y: 4, hidden: true, animation: 'hush_lying', speed: 1.1 },
    // The Warden: the statue in the room, waking (its whole self is the first
    // frame of warden_crack, wardenFall.js, so it stands where the room draws it).
    { id: 'warden', look: 'anim:warden_crack', x: 13, y: 7, plays: 'warden' },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'walk', who: 'player', to: { x: 9, y: 11 } },
    { do: 'walk', who: 'ves', to: { x: 8, y: 12 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'camera', to: { x: 13, y: 5 } },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', text: 'The Hero\'s Gate: two great stone doors in a wall like a cliff, shut. And before them, a statue of the Hero as tall as a tower, its stone sword raised in welcome, its eyes closed.' },
    { do: 'say', who: 'ves', text: '{surprised}...It\'s the biggest one yet. It\'s been standing there with its arm up the whole time.' },
    { do: 'wait', seconds: 1 },
    { do: 'appear', who: 'hush' },
    { do: 'say', text: 'Up on the statue\'s shoulder, in the dark, an ember opens. Something big lies along the stone there, quite still, its flank going slowly up and down. Something lies by its jaws, plum-coloured.' },
    { do: 'say', who: 'ves', text: '{scared}...That\'s it.\n\n{determined}That\'s it, and that\'s mine.' },
    { do: 'wait', seconds: 1 },
    { do: 'leave', who: 'hush' },
    { do: 'camera' },
    { do: 'walk', who: 'player', to: { x: 11, y: 10 } },
    { do: 'face', who: 'player', dir: 'up' },
    // The Warden wakes.
    { do: 'sound', name: 'flare' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'music', song: 'warden' },
    { do: 'say', who: 'warden', text: 'WHO COMES TO THE GATE OF THE HERO?', shake: true },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'warden', text: 'THREE HUNDRED YEARS I HAVE STOOD. THREE HUNDRED YEARS I HAVE HELD UP MY SWORD TO GREET HIM.\n\nLET ME SEE YOU.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'warden', text: 'HE WAS TO BE TALL. YOU ARE NOT.\n\nHE WAS TO HAVE A FACE THE CITY KNEW. YOU HAVE NOT.\n\nSPEAK YOUR NAME.' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'warden', text: 'YOU HAVE NO NAME.' },
    { do: 'say', who: 'ves', text: '{bored}They haven\'t got one. Neither has your Hero, by the look of it.' },
    { do: 'say', who: 'warden', text: 'NONE MAY PASS BUT THE HERO.\n\nAND YOU ARE NOBODY.' },
    { do: 'say', who: 'ves', text: '{determined}...Then nobody\'s going through.' },
    { do: 'battle', enemy: 'warden', who: 'warden', defeated: 'warden_breaks' },
  ],
};
