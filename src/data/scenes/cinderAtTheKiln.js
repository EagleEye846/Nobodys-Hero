// NAN CINDER AT THE KILN: the charcoal burner, who lives alone this deep in
// the wood, knows Bramble (and his mother) far too well. Rowan came through
// last night with the woodcutters, hunting the Hush, and left word: if my
// son comes this way, sit on him. Cinder doesn't. She asks after the people
// up the mountain still waiting for their Hero, and Bramble asks what a Hero
// is. Ves came by before dawn, running, and drew on Cinder's tree; the Hush
// came an hour after, further up the wood than it's ever come. Then soup,
// and a bun for the road.
export const CINDER_AT_THE_KILN = {
  // Triggers in rooms name the scene by this id.
  id: 'cinder_at_the_kiln',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'hush_kiln',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'cinder', look: 'prop:cinder', x: 17, y: 11, portrait: 'nan_cinder' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 15, y: 16, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 15, y: 13 } },
    { do: 'walk', who: 'bramble', to: { x: 16, y: 14 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'face', who: 'cinder', dir: 'down' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'cinder', text: '{stern}Bramble. Rowan\'s. Boy.' },
    { do: 'say', who: 'bramble', text: '{sheepish}...Hello, Nan Cinder.' },
    { do: 'say', who: 'cinder', text: '{stern}Your mother came through here last night with six woodcutters, a lot of axes and a very bad temper.\n\nDo you know the first thing she said to me?' },
    { do: 'say', who: 'bramble', text: '{sheepish}"Have you seen the Hush?"' },
    { do: 'say', who: 'cinder', text: '{cross}"If my son comes this way, sit on him."' },
    { do: 'say', who: 'bramble', text: '{scared}You wouldn\'t.' },
    { do: 'say', who: 'cinder', text: '{sly}I\'m thinking about it.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'emote', who: 'cinder', emote: '?' },
    { do: 'say', who: 'cinder', text: '{surprised}And who\'s this? You\'re not from the camp. You\'re not from anywhere down here. That coat\'s mountain wool.' },
    { do: 'say', who: 'bramble', text: '{proud}That\'s Sword. Sword fell out of the sky. Sword doesn\'t talk. We\'re finding the umbrella girl.' },
    { do: 'say', who: 'cinder', text: '{worried}Off the mountain. Then they\'re still up there, are they? The heralds, with their trumpets, waiting at the top of the stairs for their Hero to come?' },
    { do: 'say', who: 'bramble', text: '{thinking}What\'s a Hero?' },
    { do: 'say', who: 'cinder', text: '{laughing}Ha! Hear that? A hundred years they\'ve been waiting up there, and down here the children don\'t know the word.' },
    { do: 'say', who: 'cinder', text: '{tender}A hero\'s someone who comes when nobody else will, lad. That\'s all it ever meant, before they made a song of it.' },
    { do: 'say', who: 'bramble', text: '{thinking}...Like a woodcutter. But for monsters.' },
    { do: 'say', who: 'cinder', text: '{laughing}Near enough.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'cinder', text: '{worried}Your friend came by me too. This morning, running, with no coat on to speak of. She drew on my tree with chalk and wouldn\'t stop for soup.' },
    { do: 'say', who: 'cinder', text: '{sad}The Hush went past an hour after her, and the birds went quiet for a mile.\n\n{worried}It\'s never come this far up the wood. Not in my time, not in my mother\'s. Something\'s got it out of its hollow, and I don\'t like it.' },
    { do: 'emote', who: 'player', emote: 'sweat' },
    { do: 'say', who: 'cinder', text: '{tender}Sit. Eat. The pair of you look like you came here backwards through a hedge.\n\nThere\'s a cot under the awning, and I sell what I bake, at prices you\'ll call robbery.' },
    { do: 'say', who: 'cinder', text: '{sly}And Bramble. I\'m not sitting on you. Your mother can do her own sitting.\n\n{tender}Here. For the road.' },
    { do: 'give', item: 'soot_bun' },
    { do: 'say', who: 'bramble', text: '{glee}Nan Cinder\'s buns are the best buns in the whole wood. They\'re black on the outside. That\'s the best bit.' },
  ],
};
