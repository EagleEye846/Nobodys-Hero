// Spells cost SP (spell power) in battle. The hero starts knowing
// STARTING_SPELLS; the rest are learned from the skill tree.
//
// An attack spell's damage is its `power` times the most your FIGHT could do
// right now (every slash PERFECT; see bestStrike in battleScene.js), so it
// always beats swinging, however strong your sword and skills get. Armor MAG
// and Arcane Focus make it stronger still. `all` hits every enemy.
// `siphon` heals you for that share of the damage.
export const SPELLS = {
  heal: { name: 'Heal Pulse', sp: 32 },
  pacify: { name: 'Pacify', sp: 16 },
  rend: { name: 'Rend', sp: 40, power: 1.2 },
  lull: { name: 'Lull', sp: 24 },
  starfall: { name: 'Starfall', sp: 70, power: 1.6 },
  // Chapter 2 (learned on Mount Vigil's branches of the tree).
  mend: { name: 'Mend', sp: 18 },
  ember: { name: 'Ember Flare', sp: 36, power: 0.75, all: true },
  ward: { name: 'Bright Ward', sp: 30 },
  hush: { name: 'Hush', sp: 45 },
  comet: { name: 'Comet', sp: 90, power: 2.4 },
  // Chapter 2's ARCANA branch: spells for their own sake.
  spark: { name: 'Spark', sp: 22, power: 1.05 },
  siphon: { name: 'Siphon', sp: 48, power: 1.15, siphon: 0.5 },
  chain: { name: 'Chain Bolt', sp: 60, power: 1, all: true },
  nova: { name: 'Nova', sp: 100, power: 3 },
};

export const STARTING_SPELLS = ['heal', 'pacify'];
