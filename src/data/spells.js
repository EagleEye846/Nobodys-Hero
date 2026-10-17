// Spells cost SP (spell power) in battle. The hero starts knowing
// STARTING_SPELLS; the rest are learned from the skill tree.
export const SPELLS = {
  heal: { name: 'Heal Pulse', sp: 32 },
  pacify: { name: 'Pacify', sp: 16 },
  rend: { name: 'Rend', sp: 40 },
  lull: { name: 'Lull', sp: 24 },
  starfall: { name: 'Starfall', sp: 70 },
  // Chapter 2 (learned on Mount Vigil's branches of the tree).
  mend: { name: 'Mend', sp: 18 },
  ember: { name: 'Ember Flare', sp: 36 },
  ward: { name: 'Bright Ward', sp: 30 },
  hush: { name: 'Hush', sp: 45 },
  comet: { name: 'Comet', sp: 90 },
};

export const STARTING_SPELLS = ['heal', 'pacify'];
