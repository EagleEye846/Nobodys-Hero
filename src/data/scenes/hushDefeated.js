// HUSH DEFEATED: you beat the Hush down instead. It doesn't run: it can't.
// It tries a step toward you, its forelegs fold, and it goes down on its
// knees and then onto its side, and dies there on the paving (the hush_death
// animation, hushBeast.js), with Ves beside it. The ember of its eye finds
// her, and goes out. Ves, her umbrella in her hand, isn't glad. Then the two
// of you walk through the broken Gate together, under her umbrella. The end
// of Chapter 3.
export const HUSH_DEFEATED = {
  // Triggers in rooms name the scene by this id.
  id: 'hush_defeated',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'city_gate_foot',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 11, portrait: 'vesper', plays: 'vesper' },
    { id: 'hush', look: 'anim:hush_stand', x: 13, y: 8, animation: 'hush_stand', speed: 0.45 },
  ],

  steps: [
    { do: 'music', song: null },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'The Hush stands where the fight left it, swaying. Its breath goes in and out like a bellows with a hole in it.' },
    { do: 'say', who: 'ves', text: '{worried}It\'s not running.\n\n{scared}Why isn\'t it running?' },
    // Its dying, start to finish (14 frames, about 7.7 seconds): the step and
    // the stagger, down on its knees, over onto its side, the last breaths,
    // the ember dimming and going out, the bristles settling.
    { do: 'animate', who: 'hush', animation: 'hush_death', speed: 0.55, once: true },
    { do: 'wait', seconds: 1.7 },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 2, seconds: 0.3 },
    { do: 'say', text: 'It tries a step toward you. Its forelegs fold under it, and it goes down on its knees, and then, slowly, the way a tree goes, onto its side.' },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 3, seconds: 0.4 },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{scared}...It\'s not getting up.' },
    { do: 'walk', who: 'ves', to: { x: 12, y: 10 } },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'say', text: 'Ves goes to it. She shouldn\'t. She does.' },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'say', text: 'The ember of its eye finds her, and stays on her. It breathes once more, very slowly, and the bristles along its back settle, like grass when the wind drops.' },
    { do: 'say', who: 'ves', text: '{sad}You only followed us. All that way.\n\n{sad}You could have just come and sat with us. I\'d have let you.' },
    { do: 'say', text: 'The ember goes out, the way a coal does: dark at the edges first, and then all at once.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', text: 'Somewhere in the valley, after a long while, a bird starts singing again. It sounds wrong.' },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'say', who: 'ves', text: '{sad}It didn\'t fight back. Not really. Not at the end.\n\n{thoughtful}I think it only ever followed us.' },
    { do: 'say', who: 'ves', text: '{tender}I\'ve got it back, anyway. That\'s what matters.\n\n...Isn\'t it.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{smile}It makes a better crutch than the crutch, too.' },
    { do: 'say', who: 'ves', text: '{sad}Come on. I\'ve got an umbrella again.\n\n{thoughtful}Somebody should see what\'s on the other side of that Gate. It might as well be nobody.' },
    { do: 'music', song: 'nobodysDawn' },
    { do: 'walk', who: 'player', to: { x: 11, y: 6 } },
    { do: 'walk', who: 'ves', to: { x: 12, y: 6 } },
    { do: 'walk', who: 'player', to: { x: 13, y: 4 } },
    { do: 'walk', who: 'ves', to: { x: 14, y: 4 } },
    { do: 'say', text: 'You go through the Hero\'s Gate together, Ves out in front with her umbrella up, into the dawn. Behind you, on the paving, something very big lies still.' },
    { do: 'end_chapter', credits: { song: 'creditsSearch', text: 'credits_search.txt' }, card: 'chapter_end_search.txt' },
  ],
};
