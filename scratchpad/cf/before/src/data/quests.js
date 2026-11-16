import { WORLD_STATE } from '../state/saveGame.js';
import { HERO_STATE } from '../characters/heroState.js';
import { GEAR, hasGear, giveGear } from './gear.js';
import { textSection } from '../engine/textLoader.js';
import { sfx } from '../audio/music.js';

// SIDE QUESTS: small errands for townsfolk, paid in keepsakes and a bit of
// story (never gold or power). There's no quest log and no "accepted" step:
// everything is a rule on the person who gives or takes the thing, so a
// quest works in any order and can be ignored for good.
//
// A townsperson's `quest` (in the room file, on their NPC prop) is a list of
// rules, tried top to bottom. The first whose `needs` all hold fires; if none
// does, they say their usual words. A rule:
//   needs   what must be so: 'flag' (a flag is set), '!flag', 'has:thing'
//           (you carry that GEAR), '!has:thing'
//   text    a section of the person's own file (text/npcs/<npc>.txt) to say
//   append  true: say their usual words first, then this; otherwise it
//           replaces them
//   set     flags to set (WORLD_STATE.quests, kept in the save)
//   take    GEAR handed over (it leaves your pockets)
//   give    GEAR you're given (a keepsake, with its words in
//           text/interactions/gear.txt, [got_<id>])
// The things carried between people are GEAR too, so they take no bag space.

export function questFlag(flag) {
  return (WORLD_STATE.quests ?? []).includes(flag);
}

const holds = (need) => {
  const not = need.startsWith('!');
  const rest = not ? need.slice(1) : need;
  const yes = rest.startsWith('has:') ? hasGear(rest.slice(4)) : questFlag(rest);
  return not ? !yes : yes;
};

export function questRuleHolds(rule) {
  return (rule.needs ?? []).every(holds);
}

const list = (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

// Carry the rule out. Returns the pages for anything you were given.
export function applyQuestRule(rule) {
  const pages = [];
  for (const id of list(rule.take)) {
    HERO_STATE.gear = (HERO_STATE.gear ?? []).filter((g) => g !== id);
  }
  WORLD_STATE.quests ??= [];
  for (const flag of list(rule.set)) if (!WORLD_STATE.quests.includes(flag)) WORLD_STATE.quests.push(flag);
  for (const id of list(rule.give)) {
    if (!GEAR[id]) throw new Error(`A quest rule gives unknown gear '${id}'`);
    giveGear(id);
    sfx('heal');
    pages.push(...textSection('interactions/gear.txt', `got_${id}`));
  }
  return pages;
}
