// SHIP NEST: the crow's nest (ship_rigging, trigger (9-10, row 4): the front row of the nest, where the spar lands). The lookout,
// Hobbs, a figure at the top of the mast pointing at a harbour that is not there. In the lantern's light only; the scene
// says so anyway. Ves (8,4), Bramble (11,4). No monsters. The hero never speaks. DRAFT words.
export const SHIP_NEST = {
  id: 'ship_nest',
  room: 'ship_rigging',
  once: true,

  actors: [
    { id: 'ves', look: 'prop:vesper_stand', x: 8, y: 4, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 11, y: 4, portrait: 'bramble', plays: 'bramble' },
  ],

  steps: [
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'say', text: 'The nest is a little round platform at the very top of the mast, with a rail, and a stand, and the fog going away on every side like the sea. At the rail, a tall figure with one arm out, pointing.' },
    { do: 'haunt', dip: 2.6 },
    { do: 'say', text: '"Land," he says. "Land ho. I see lights. I see the lights of the town."' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'Far off in the fog, so faint you might be imagining it, there is a row of small lights, like a harbour\'s. They are the lamps of the Wreck Yard\'s wrecks. You know that. He doesn\'t.' },
    { do: 'say', who: 'bramble', text: '{worried}...Shall we tell him?' },
    { do: 'say', who: 'ves', text: '{thoughtful}Not him. He\'s only a man who saw the lights. Whoever he\'s pointing them out to is the one who needs telling.' },
    { do: 'say', who: 'bramble', text: '{worried}That\'s worse.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Yes.' },
  ],
};
