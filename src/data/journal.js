import { ENEMIES } from './enemies/index.js';
import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE } from '../state/saveGame.js';

// The MONSTER JOURNAL's contents and bookkeeping. The pages are in the order
// you meet the monsters (chapter by chapter), each with the area it's mostly
// found in (an id in src/data/areas.js). The words on each page are in
// text/journal.txt; everything else on it comes from the enemy's own data.
export const JOURNAL_ORDER = [
  ['ruins', ['bunny', 'dummy', 'waxling', 'moth', 'columneon', 'duskling', 'taper']],
  ['stair', ['step', 'chough', 'craghorn']],
  ['vigil', ['frostbite', 'glintling', 'iceStep', 'ice_moth', 'rimewing', 'ringer', 'stone_golem', 'great_bat', 'usurper']],
  ['pinefall', ['sapling', 'russet', 'burrhog', 'tatterwight']],
  ['hushwood', ['knotling', 'puffcap', 'gloamworm']],
  ['hollin', ['grist', 'hob', 'hayward']],
  ['drains', ['siltling', 'slipjack', 'clinker']],
  ['marsh', ['bog_toad', 'reed_stalker', 'wisp']],
  ['valley', ['cairn_hound', 'lamp_mite', 'heralds_echo', 'warden', 'the_hush']],
  ['sunnyside', ['bunting', 'dandylion', 'haybob']],
  ['glimmer', ['gleamsnail', 'prismoth', 'quartzling']],
  ['diggings', ['drillbug', 'magpiemole', 'slagling']],
  ['stillwater', ['blindfish', 'fiddler', 'olm']],
  ['deep', ['gnawer', 'murk']],
  ['belowtown', ['rumbold']],
  ['gullrest', ['gullion', 'dunlin_dancer', 'sandcastle']],
  ['wrack', ['shellac', 'moonjelly', 'limpet_knight', 'pinwheel', 'dowager_crab']],
];

// Which chapter each row of pages belongs to. Once you're past a chapter,
// all of its monsters count as met, so a save that skipped ahead (chapter
// select, or a save from before the journal) still has the earlier pages.
const AREA_CHAPTER = {
  ruins: 1, stair: 2, vigil: 2,
  pinefall: 3, hushwood: 3, hollin: 3, drains: 3, marsh: 3, valley: 3,
  sunnyside: 4, glimmer: 4, diggings: 4, stillwater: 4, deep: 4, belowtown: 4,
};
const PAST_CHAPTER = Object.fromEntries(JOURNAL_ORDER.flatMap(([area, ids]) => ids.map((id) => [id, AREA_CHAPTER[area]])).filter(([, chapter]) => chapter));

// [{ id, area }] for every page, in order. Any enemy not listed above goes on
// the end, so a new one never goes missing.
export const JOURNAL_PAGES = (() => {
  const pages = JOURNAL_ORDER.flatMap(([area, ids]) => ids.filter((id) => ENEMIES[id]).map((id) => ({ id, area })));
  const listed = new Set(pages.map((page) => page.id));
  for (const [id, data] of Object.entries(ENEMIES)) {
    if (data && !listed.has(id)) pages.push({ id, area: data.area ?? null });
  }
  return pages;
})();

// An enemy's id, from its data (what a battle is given).
export function enemyId(data) {
  return Object.keys(ENEMIES).find((id) => ENEMIES[id] === data) ?? Object.keys(ENEMIES).find((id) => ENEMIES[id]?.name === data?.name) ?? null;
}

// What the save remembers: HERO_STATE.journal[id] = { beaten, spared, loot }.
// Saves from before the journal have none, which starts it empty. A page
// opens once you've met the monster (a boss, once the fight is over).
function entry(id) {
  HERO_STATE.journal ??= {};
  return (HERO_STATE.journal[id] ??= { beaten: 0, spared: 0, loot: false });
}

export function journalEntry(id) {
  return HERO_STATE.journal?.[id] ?? null;
}

export function isMet(id) {
  return Boolean(HERO_STATE.journal?.[id]) || (PAST_CHAPTER[id] ?? Infinity) < (WORLD_STATE.chapter ?? 1);
}

// A battle starts: everyone but a boss is met.
export function noteMet(data) {
  const id = enemyId(data);
  if (id && !data.boss) entry(id);
}

// An enemy is beaten or spared, and `dropped` if it left something behind.
export function noteLeft(data, how, dropped) {
  const id = enemyId(data);
  if (!id) return;
  const page = entry(id);
  if (how === 'defeated') page.beaten++;
  else page.spared++;
  if (dropped) page.loot = true;
}
