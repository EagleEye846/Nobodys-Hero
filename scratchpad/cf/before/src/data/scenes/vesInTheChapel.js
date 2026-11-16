// VES IN THE CHAPEL: you walk up the aisle and find Ves (Vesper) kneeling at
// the altar, praying for her mother. Eight years ago the lamplighter of
// Heralds' Rest took her lantern up past the clouds to light the old beacon
// at the summit, so the Hero could find the way, and never came back; only
// her umbrella came down, on the wind. Ves tells you; Greta comes in with
// soup and they have it out; and Ves comes with you, to find out what
// happened to her mother and to finish lighting her lamp. Her song plays
// from the moment she talks about her mother.
export const VES_IN_THE_CHAPEL = {
  // Triggers in rooms name the scene by this id.
  id: 'ves_in_the_chapel',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'rest_chapel',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  // People who appear only in this scene, besides the player (see exampleScene.js).
  // Ves kneeling takes the place of the praying Ves in the room; when she
  // gets up, the standing one takes over.
  actors: [
    { id: 'kneeling', look: 'prop:vesper', x: 7, y: 5, portrait: 'vesper', plays: 'vesper' },
    { id: 'ves', look: 'prop:vesper_stand', x: 7, y: 5, portrait: 'vesper', hidden: true },
    { id: 'greta', look: 'prop:herald_inn', x: 7, y: 14, portrait: 'herald_greta', hidden: true },
  ],

  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).
  steps: [
    { do: 'walk', who: 'player', to: { x: 7, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'kneeling', text: '{praying}...and keep her warm, wherever she is. Keep her lamp lit.\n\n{praying}And if she can\'t come down to me... then please. Let me go up to her.' },
    { do: 'wait', seconds: 1 },
    { do: 'emote', who: 'kneeling', emote: '!' },
    { do: 'leave', who: 'kneeling' },
    { do: 'appear', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'say', who: 'ves', text: '{surprised}Oh! I didn\'t hear the door. Nobody comes in here this late but me.' },
    { do: 'say', who: 'ves', text: '{shy}You heard all that, didn\'t you.\n\n{smile}I\'m Vesper. Ves. Everyone calls me Ves.' },
    { do: 'walk', who: 'ves', to: { x: 7, y: 7 } },
    { do: 'say', who: 'ves', text: '{thoughtful}You came up the stairs. The whole village is out there with trumpets. Nobody\'s come UP those stairs since before I was born.\n\n{sad}The last person who went the other way was my mum.' },
    { do: 'music', song: 'ves' },
    { do: 'emote', who: 'player', emote: '...' },
    { do: 'say', who: 'ves', text: '{tender}She was the lamplighter. Every lamp in Heralds\' Rest, every night, for twenty years. I used to hold the ladder.\n\n{sad}Then one winter she said the Hero would never find us in the dark. So she took her lantern up past the Lookout, to light the old beacon at the top.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{crying}She never came back down. Only this did.\n\n{crying}Her umbrella. It came down on the wind a week later and caught on the waymark at the Lookout. Still dry inside. She always kept it dry.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'appear', who: 'greta' },
    { do: 'walk', who: 'greta', to: { x: 7, y: 11 } },
    { do: 'say', who: 'greta', text: '{worried}Ves? Ves, love, your soup\'s gone cold twice, I\'ve been up and down that square...' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'emote', who: 'greta', emote: '!' },
    { do: 'say', who: 'greta', text: '{surprised}Oh! It\'s you. Half the village is looking for you, you know. Horace has his speech out.' },
    { do: 'say', who: 'ves', text: '{determined}Greta. They came up the stairs. All the way up, through the ice and the goats and everything.\n\n{resolute}So it can be climbed. Up as well as down.' },
    { do: 'say', who: 'greta', text: '{stern}No.' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'ves', text: '{angry}I haven\'t said anything yet!' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'say', who: 'greta', text: '{stern}You don\'t have to. You\'ve got your mother\'s face on. The going-up face.' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'ves', text: '{furious}Eight YEARS, Greta! Eight years of lighting a candle in here every night and asking nobody in particular to bring her home!\n\n{sobbing}Nobody\'s coming. There isn\'t a Hero. There\'s just me, and her umbrella, and the stairs.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'say', who: 'greta', text: '{sad}...Your mother stood right where you\'re standing and said nearly the same thing. I couldn\'t stop her either.\n\n{tender}But she went up alone. You won\'t.' },
    { do: 'face', who: 'greta', dir: 'down' },
    { do: 'say', who: 'greta', text: '{stern}You. Yes, you. You bring her back down this stair. Both of you, in one piece, with your scarves on. Do you hear me?' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'say', who: 'ves', text: '{hopeful}...You\'re letting me go?' },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'greta', dir: 'up' },
    { do: 'say', who: 'greta', text: '{smile}Letting you? Love, I couldn\'t stop you with a rope. I\'m just seeing you don\'t go alone.\n\n{glee}And you\'ll take a jar of soup. Don\'t argue.' },
    { do: 'give', item: 'rest_soup' },
    { do: 'walk', who: 'greta', to: { x: 7, y: 14 } },
    { do: 'leave', who: 'greta' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{tender}I\'m not going up to find the Hero. I stopped praying for one a long time ago.\n\n{resolute}I\'m going to find out what happened to her. And I\'m going to finish lighting her lamp.' },
    { do: 'say', who: 'ves', text: '{laughing}...Sorry. I\'m not usually this loud in church.\n\n{glee}And it\'s a very good umbrella. It kept the wind off her for twenty years. It can keep it off you too.' },
    { do: 'emote', who: 'player', emote: '!' },
    { do: 'leave', who: 'ves' },
    { do: 'join', who: 'vesper' },
    { do: 'music', song: 'chapel' },
  ],
};
