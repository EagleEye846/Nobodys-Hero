// What the hero carries, has learned and has equipped. It lasts between
// scenes, including after a game over.
export const HERO_STATE = {
  level: 1,
  exp: 0,
  // A few points to start with, so the skill tree can be tried straight away.
  skillPoints: 3,
  skills: [],
  gold: 0,
  weapon: 'worn_sword',
  weapons: ['worn_sword', 'old_shield'],
};
