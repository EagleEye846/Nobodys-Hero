// What the hero carries, has learned and has equipped. It lasts between
// scenes, including after a game over.
export const HERO_STATE = {
  level: 1,
  exp: 0,
  // A few points to start with, so the skill tree can be tried straight away.
  skillPoints: 3,
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
};
