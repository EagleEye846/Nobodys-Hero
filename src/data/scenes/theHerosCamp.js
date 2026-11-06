// THE HERO'S CAMP: you come to the bedroll at the far end of the camp, after
// the marks on the wall and the word by the fire. It's the size of a child's.
// Ves crouches beside it and says, in as few words as she can manage, what
// everyone has been working out. Inside the bedroll is the rest of the
// copybook from the far shore: the root needs two, and there was only one;
// a hundred and eleven days of trying; one sweet left; "I KNOW HOW". (How is
// at the root, after the light goes up.) The hero says nothing. Nobody makes
// a speech.
export const THE_HEROS_CAMP = {
  // Triggers in rooms name the scene by this id.
  id: 'the_heros_camp',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'deep_heros_camp',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 23, y: 8, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 25, y: 8 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'An old bedroll. It\'s the size of a child\'s.\n\nThe blanket is folded at its foot, folded small, the way you fold something when you have been told to keep things tidy.' },
    { do: 'walk', who: 'ves', to: { x: 24, y: 7 } },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'wait', seconds: 1.6 },
    { do: 'say', who: 'ves', text: '{thoughtful}...They were a kid.' },
    { do: 'wait', seconds: 1 },
    // What's rolled up inside it: the rest of the copybook from the far
    // shore (the_cold_camp), a day at a time.
    { do: 'say', text: 'Rolled up inside the bedroll, the rest of the copybook.\n\nOn the cover, a name was written once. The damp has had it. All that\'s left is THIS BOOK BELONGS TO.' },
    { do: 'say', text: 'The hand is smaller now, and the pencil was down to a stub.\n\nDAY 9. FOUND THE ROOT. TO LIGHT IT, ONE PERSON HOLDS THE BEAM AND ONE PERSON TURNS THE STONE. THERE IS ONLY ME.' },
    { do: 'say', text: 'DAY 40. TRIED AGAIN. DAY 41. TRIED AGAIN.\n\nThe next page is TRIED AGAIN, all the way down.' },
    { do: 'say', text: 'DAY 70. ONE SWEET LEFT. SAVING IT. THE CAPS BY THE WALL ARE ALL RIGHT IF YOU DONT LOOK AT THEM.' },
    { do: 'say', text: 'DAY 111. I KNOW HOW.\n\nThe last page has only that on it, and a drawing of the sword.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{thoughtful}A hundred and eleven days. On one sweet and some mushrooms.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{sad}"There is only me."\n\n{bored}...I know that page.' },
    { do: 'wait', seconds: 1.2 },
    { do: 'say', who: 'ves', text: '{sad}Down here on their own, counting days. Telling themselves to stay.' },
    { do: 'wait', seconds: 1.4 },
    { do: 'say', who: 'ves', text: '{determined}And they did.' },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{bored}Nine feet tall, the mural said. {smile}Liars.' },
    { do: 'wait', seconds: 0.6 },
  ],
};
