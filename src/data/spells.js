// Spells cost SP (spell power) in battle. The hero starts knowing
// STARTING_SPELLS; the rest are learned from the skill tree.
//
// An attack spell's damage is measured against a good FIGHT (every slash
// landed, not PERFECT; see spellStrike in battleScene.js), but only as strong
// as a FIGHT could be in the spell's `chapter`: the slash and FIGHT skills
// from then, and a sword no better than that chapter's best
// (SPELL_WEAPON_CAP). So an old spell stops growing and the new ones take
// over. `power` is how many of those FIGHTs it's worth; armor MAG and Arcane
// Focus add to it (a quarter of the MAG, half the Focus), rather than
// multiplying everything again. `all` hits every enemy. `siphon` heals you
// for that share of the damage.
export const SPELLS = {
  heal: { name: 'Heal Pulse', sp: 32 },
  pacify: { name: 'Pacify', sp: 16 },
  rend: { name: 'Rend', sp: 40, power: 1.2, chapter: 1 },
  lull: { name: 'Lull', sp: 24 },
  starfall: { name: 'Starfall', sp: 70, power: 1.6, chapter: 1 },
  // Chapter 2 (learned on Mount Vigil's branches of the tree).
  mend: { name: 'Mend', sp: 18 },
  ember: { name: 'Ember Flare', sp: 36, power: 0.75, all: true, chapter: 2 },
  ward: { name: 'Bright Ward', sp: 30 },
  hush: { name: 'Hush', sp: 45 },
  // The top of chapter 2's attacks. It stops growing after chapter 2, so
  // the later ones are worth having.
  comet: { name: 'Comet', sp: 80, power: 1.75, chapter: 2 },
  // Chapter 2's ARCANA branch: spells for their own sake.
  spark: { name: 'Spark', sp: 22, power: 1.05, chapter: 2 },
  siphon: { name: 'Siphon', sp: 48, power: 1.15, siphon: 0.5, chapter: 2 },
  chain: { name: 'Chain Bolt', sp: 60, power: 1, all: true, chapter: 2 },
  // Chapter 3 (the Hushwood and the Dead City). Balm heals the whole party.
  sunder: { name: 'Sunder', sp: 75, power: 1.55, chapter: 3 },
  balm: { name: 'Balm', sp: 48, heals: 25, all: true },
  lance: { name: 'Light Lance', sp: 65, power: 1.25, chapter: 3 },
  // Chapter 4, past the Hero's Gate. Renew heals one person a lot; Aegis is
  // Bright Ward for a turn longer; Serenade calms every enemy more than Hush.
  sunburst: { name: 'Sunburst', sp: 85, power: 1.3, all: true, chapter: 4 },
  renew: { name: 'Renew', sp: 55, heals: 60 },
  aegis: { name: 'Aegis', sp: 50, turns: 3 },
  serenade: { name: 'Serenade', sp: 65, calm: 35 },
  tempest: { name: 'Tempest', sp: 95, power: 2.2, chapter: 4 },
  // Chapter 5.
  nova: { name: 'Nova', sp: 100, power: 3, chapter: 5 },
  // The TIDE branch (see src/data/skills.js). Undertow hits and drags the
  // enemy back (`shove`: its next attack is that much shorter). Brine hits a
  // little, then burns for `dot.power` of a good FIGHT after each of the next
  // `dot.turns` enemy turns. Ebb and Flow swaps attack and defence: your hits
  // (and your friends') land `attack` times as hard and theirs `defence`
  // times, until `turns` enemy turns have passed. Low Water shows an enemy's
  // weak spots: every hit on it does `bonus` more for `turns` enemy turns.
  undertow: { name: 'Shove', sp: 60, power: 1.4, shove: 0.3, chapter: 5 },
  brine: { name: 'Scald', sp: 50, power: 0.6, dot: { power: 0.25, turns: 3 }, chapter: 5 },
  ebb_flow: { name: 'Turnabout', sp: 40, swap: { attack: 1.75, defence: 1.5, turns: 2 } },
  low_water: { name: 'Lay Bare', sp: 45, expose: { bonus: 0.4, turns: 3 } },
  // Chapter 5's second wave (the full-size tree). Cleave is VALOR's big single
  // hit; Restore is Balm for a whole party that's really hurt; Bastion is
  // Aegis for a turn longer; Soothe calms everyone more than Serenade;
  // Starstorm is ARCANA's hit on everyone; Undercut and Overwhelm are TIDE's
  // (Undercut shoves and burns at once, Overwhelm is the branch's last word).
  cleave: { name: 'Cleave', sp: 85, power: 2, chapter: 5 },
  restore: { name: 'Restore', sp: 70, heals: 55, all: true },
  bastion: { name: 'Bastion', sp: 70, turns: 4 },
  soothe: { name: 'Soothe', sp: 75, calm: 50 },
  starstorm: { name: 'Starstorm', sp: 100, power: 1.2, all: true, chapter: 5 },
  undercut: { name: 'Undercut', sp: 75, power: 1, shove: 0.2, dot: { power: 0.15, turns: 3 }, chapter: 5 },
  overwhelm: { name: 'Overwhelm', sp: 115, power: 2.6, shove: 0.3, chapter: 5 },
};

// The best FIGHT a hero's weapon gives in each chapter (Worn Sword, Skyiron
// Blade, then the Fallen Star as each chapter's smith reforges it). An attack
// spell counts your sword as no better than its chapter's.
export const SPELL_WEAPON_CAP = { 1: 1, 2: 1.2, 3: 2.05, 4: 2.35, 5: 2.7, 6: 3.1 };

export const STARTING_SPELLS = ['heal', 'pacify'];
