// What the hero carries, has learned and has equipped. It lasts between
// scenes, including after a game over.
export const HERO_STATE = {
  level: 1,
  exp: 0,
  // Skill points only come from levelling up (see progress.js).
  skillPoints: 0,
  skills: [],
  gold: 0,
  // Item ids (see src/data/items.js), eaten in battle with ITEMS.
  items: ['trail_mix', 'trail_mix'],
  // Candle-making materials by id, and how many (see src/data/candles.js).
  materials: {},
  // The candle burning in the dark: { id, left (seconds) }, or null.
  lit: null,
  weapon: 'worn_sword',
  weapons: ['worn_sword', 'old_shield'],
  // Armor worn and owned (see src/data/armor.js).
  armor: 'travel_clothes',
  armors: ['travel_clothes'],
  // Gear for getting around, kept for good (see src/data/gear.js).
  gear: [],
  // Friends who've joined (ids in src/characters/party.js), and their own
  // skill points (earned, less spent).
  party: [],
  memberPoints: {},
  // Each member's own weapon and armor, as { vesper: { weapon, armor } }
  // (see src/characters/equipment.js). What they own sits with yours, above.
  memberGear: {},
};
