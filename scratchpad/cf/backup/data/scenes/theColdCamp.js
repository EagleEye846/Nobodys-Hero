// THE COLD CAMP: the far shore of the Stillwater, the first time you cross
// it. Up against the rock is the little camp somebody made the night before
// they went down the stair: a fire ring, a bedroll tied up small, a cairn.
// Under the bedroll there's a page torn from a copybook, in a big careful
// hand: a list of the things they were scared of, and on the back, a drawing
// of home and why they came. Ves reads it, puts it back exactly as it was,
// and takes one thing off the list. (The deeper pages are at the Hero's
// camp: the_heros_camp.)
export const THE_COLD_CAMP = {
  // Triggers in rooms name the scene by this id.
  id: 'the_cold_camp',
  // The room it's made for, used by the Cutscene Maker's map and preview.
  room: 'stillwater_far_shore',
  // false: it plays every time you step on its trigger, not just the first time.
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 15, y: 8, portrait: 'vesper', plays: 'vesper' },
  ],

  steps: [
    { do: 'walk', who: 'player', to: { x: 21, y: 7 } },
    { do: 'walk', who: 'ves', to: { x: 19, y: 7 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'Up against the rock, out of the draught, somebody small once made a camp. A ring of stones. A bedroll tied up tight.\n\nBeside the fire, the bones of one little fish, picked clean and laid in a row, the way you lay out something you are proud of.' },
    { do: 'act', who: 'ves', act: 'crouch' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Under the bedroll, folded into eighths and pressed flat by a hundred years, there\'s a page torn from a copybook.\n\nThe writing is big and careful, the way you write when you have only just learned how.' },
    { do: 'say', text: 'THINGS I AM SCARED OF.\n\n1. THE DARK. 2. THE DARK DOWN THERE. 3. THINGS IN THE EDGES. 4. GOING ON MY OWN. 5. NOT BEING ABLE TO.' },
    { do: 'say', text: 'Number six has been written and then scratched out so hard the pencil went through.\n\nAt the bottom, underlined twice: GO ANYWAY.' },
    { do: 'say', text: 'On the back, a drawing. A field of flowers, every one of them shut. A house.\n\nAn arrow going up off the top of the page, and under it: HOME.' },
    { do: 'say', text: 'Under the field: THEY WONT OPEN ANY MORE. THE GROUND IS COLD. THE COLD COMES FROM UNDER. NOBODY WILL GO AND SEE. SO I AM.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', who: 'ves', text: '{smile}"Things in the edges." Gubb got to them too.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', who: 'ves', text: '{sad}Number four.\n\n{thoughtful}...I had that one. For a while.' },
    { do: 'wait', seconds: 1 },
    { do: 'say', text: 'Ves folds the page back into eighths, exactly the way it was, and slides it back under the bedroll.' },
    { do: 'act', who: 'ves', act: 'stand' },
    { do: 'wait', seconds: 0.6 },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'say', who: 'ves', text: '{bored}Well. There are two of us. {smile}That\'s number four sorted.' },
    { do: 'wait', seconds: 0.4 },
  ],
};
