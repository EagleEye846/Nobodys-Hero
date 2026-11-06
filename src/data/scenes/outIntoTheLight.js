// OUT INTO THE LIGHT: the end of Chapter 4. Up the Long Rope and out of the
// hole in the Soft Field (sunny_soft_field), the one the ground opened under
// Ves at the start of the chapter, so the whole scene is a callback to it.
//
// It's night when they come up (they've been a long time in the dark, and the
// dark up here is the soft, wide, starry kind). The field fades in out of
// black. Bramble has never seen the sky at night. They look back down the
// hole; Bramble gives the rope two tugs, and far below something tugs back
// twice. Ves goes to the spot where she struck her proud pose and starts to
// swing the umbrella down, and stops herself, and holds it like a person.
// The Long Rope's song carries on out of the hole and fades away to the night
// sounds. Ves: "We should get some rest." They lie down in the grass where
// they are, the view tilts up to the stars, Bramble counts them and falls
// asleep mid-number, and the credits roll.
// (Marigold is only an optional stall in this chapter, so she isn't here.)
//
// After the credits (and Tuck's stinger, tuck_afterwards) the game goes on into
// Chapter 5 in this same field, the next morning (tide_held_opens), and the
// save is made there.
export const OUT_INTO_THE_LIGHT = {
  // Triggers in rooms name the scene by this id.
  id: 'out_into_the_light',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'sunny_soft_field',
  once: true,

  // The two who climbed out with you.
  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 27, y: 12, portrait: 'vesper', plays: 'vesper', hidden: true },
    { id: 'bramble', look: 'prop:bramble_stand', x: 27, y: 12, portrait: 'bramble', plays: 'bramble', hidden: true },
  ],

  steps: [
    // No music step to begin with: the rope room's song ('longRope') is still
    // playing from the climb, and carries on out into the field.
    // Night, and the whole view black.
    { do: 'time', of: 0.74 },
    { do: 'stage', dim: 1 },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Up, and up, and up. And then the dark simply runs out.\n\nNot into light. Into a different dark: a soft, wide one, with a breeze in it.' },
    // Out of the hole, one after another.
    { do: 'appear', who: 'ves', at: { x: 27, y: 11.4 }, instant: true },
    { do: 'toss', who: 'ves', to: { x: 28, y: 13 }, height: 10, airtime: 0.4, bounces: 0 },
    { do: 'sound', name: 'thud' },
    { do: 'appear', who: 'bramble', at: { x: 27, y: 11.4 }, instant: true },
    { do: 'toss', who: 'bramble', to: { x: 26, y: 13 }, height: 12, airtime: 0.4, bounces: 0 },
    { do: 'sound', name: 'thud' },
    { do: 'wait', seconds: 1 },
    // The field fades in out of the dark, and everyone blinks at it.
    { do: 'stage', dim: 0, seconds: 4 },
    { do: 'act', who: 'ves', act: 'shake', wait: false },
    { do: 'act', who: 'bramble', act: 'look', wait: false },
    { do: 'wait', seconds: 2.2 },
    { do: 'act', who: 'player', act: 'look', wait: false },
    { do: 'act', who: 'ves', act: 'sigh' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', text: 'Grass. Crickets. A sky with nothing hanging from it but stars.' },
    { do: 'say', who: 'ves', text: '{bored}...Ow.' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', who: 'bramble', text: '{surprised}Is the sky always this BIG?' },
    { do: 'say', who: 'ves', text: '{bored}It was before. You just got used to ceilings.' },
    { do: 'say', who: 'bramble', text: '{awed}It\'s got holes in it. Little bright ones.' },
    { do: 'say', who: 'ves', text: '{smile}Stars. They come out at night. Nobody tells you.' },
    { do: 'say', who: 'bramble', text: '{grin}I like them. I\'m going to look at them for ages.' },
    { do: 'wait', seconds: 0.6 },

    // Looking back down.
    { do: 'walk', who: 'player', to: { x: 27, y: 13 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'The hole looks small from up here. Small, and quiet, and not at all like something that ate you.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Funny. It felt a lot bigger from the inside.' },
    { do: 'say', who: 'bramble', text: '{thinking}Do you think they can see us? From the bottom?' },
    { do: 'say', who: 'ves', text: '{bored}We\'re a very small dot. A very well-dressed one.' },
    // Two tugs, so they know.
    { do: 'walk', who: 'bramble', to: { x: 29, y: 12 } },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'sound', name: 'hook' },
    { do: 'act', who: 'bramble', act: 'hop' },
    { do: 'sound', name: 'hook' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', text: 'Bramble gives the rope two good tugs. For a long moment, nothing.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'sound', name: 'hook' },
    { do: 'wait', seconds: 0.45 },
    { do: 'sound', name: 'hook' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'say', text: 'Then, from very far below, the rope tugs back. Twice.' },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'face', who: 'bramble', dir: 'down' },
    { do: 'say', who: 'bramble', text: '{proud}Told you. Best pull in the camp.' },
    { do: 'say', who: 'ves', text: '{bored}You\'ve mentioned it.' },
    { do: 'say', who: 'bramble', text: '{proud}I\'ll mention it again.' },
    { do: 'say', who: 'ves', text: '{smile}...Two tugs. Well. They know.' },
    { do: 'wait', seconds: 0.8 },

    // The spot where she struck her pose. She does not plant it.
    { do: 'walk', who: 'ves', to: { x: 30, y: 12 } },
    { do: 'walk', who: 'ves', to: { x: 30, y: 9 } },
    { do: 'walk', who: 'ves', to: { x: 27, y: 9 } },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}That\'s where I stood. Hand on hip.\n\n"Look at us."' },
    { do: 'say', who: 'bramble', text: '{grin}"I could get used to this. IMMEDIATELY."' },
    { do: 'say', who: 'ves', text: '{bored}I\'m getting used to it more slowly, now.' },
    // The umbrella starts to swing down, out of habit...
    { do: 'animate', who: 'ves', animation: 'sunny_ves_proud', speed: 1, seconds: 0.9 },
    { do: 'animate', who: 'ves' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'emote', who: 'bramble', emote: '!' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}...No.' },
    { do: 'act', who: 'ves', act: 'shake' },
    { do: 'say', who: 'ves', text: '{proud}I\'ll just hold it. Like a person.' },
    { do: 'wait', seconds: 1 },

    // The song goes, and leaves the crickets.
    { do: 'music', song: null },
    { do: 'wait', seconds: 2.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}...We should get some rest.' },
    { do: 'say', who: 'bramble', text: '{thinking}Here? In the field?' },
    { do: 'say', who: 'ves', text: '{smile}Here. The grass is soft, and nothing\'s falling on us. That\'s the whole list.' },
    // Ves in the middle, so she and Bramble can talk; you go round the
    // west side of the hole, Bramble round the east.
    { do: 'walk', who: 'ves', to: { x: 28, y: 8 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 29, y: 8 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 25, y: 12 } },
    { do: 'walk', who: 'player', to: { x: 25, y: 9 } },
    { do: 'walk', who: 'player', to: { x: 27, y: 8 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'animate', who: 'ves', animation: 'ves_sat', speed: 1.2 },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'wait', seconds: 1.5 },
    { do: 'say', who: 'bramble', text: '{thinking}Ves? Is it like this every night?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Every night. Nobody tells you.' },
    { do: 'say', who: 'bramble', text: '{thinking}...Nobody told me.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{thoughtful}We\'ll have to go somewhere. Eventually.' },
    { do: 'say', who: 'bramble', text: '{grin}Eventually.' },
    { do: 'say', who: 'ves', text: '{smile}Not yet.' },
    { do: 'wait', seconds: 1.5 },
    // Looking up: the room slides down and the stars come in over it.
    { do: 'stage', tilt: 0.32, seconds: 7 },
    { do: 'wait', seconds: 6 },
    { do: 'sound', name: 'shimmer' },
    { do: 'wait', seconds: 2 },
    { do: 'say', text: 'Overhead, the stars keep coming out, one after another, until there are far too many to count. Bramble counts them anyway.' },
    { do: 'say', who: 'bramble', text: '{tired}...forty-one... forty-two... forty...' },
    { do: 'wait', seconds: 2 },
    { do: 'say', who: 'ves', text: '{smile}...He\'s asleep.' },
    { do: 'act', who: 'player', act: 'nod' },
    { do: 'wait', seconds: 3 },
    { do: 'stage', dim: 1, seconds: 3 },
    { do: 'wait', seconds: 3.2 },
    // The credits (the chapter's own song), the card, Tuck's stinger, and
    // Continue picks up back here in the field, the next morning.
    { do: 'end_chapter', chapter: 4, credits: { song: 'creditsFirst', text: 'credits_first.txt' }, card: 'chapter_end_first.txt', postCredits: 'tuck_afterwards', room: 'sunny_soft_field', spawn: { x: 21, y: 12 } },
  ],
};
