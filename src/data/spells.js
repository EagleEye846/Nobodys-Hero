// Spells cost SP (spell power) in battle. The hero starts knowing
// STARTING_SPELLS; the rest are learned from the skill tree.
export const SPELLS = {
  heal: { name: 'Heal Pulse', sp: 32 },
  pacify: { name: 'Pacify', sp: 16 },
  rend: { name: 'Rend', sp: 40 },
  lull: { name: 'Lull', sp: 24 },
  starfall: { name: 'Starfall', sp: 70 },
};

export const STARTING_SPELLS = ['heal', 'pacify'];
