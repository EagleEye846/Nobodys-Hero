import { HERO_STATE } from './heroState.js';
import { WEAPONS } from '../data/weapons.js';
import { ARMOR } from '../data/armor.js';
import { MEMBERS, hurtState } from './party.js';

// Who wears what. Weapons and armor you own sit together in HERO_STATE.weapons
// and HERO_STATE.armors, but each one is made for somebody: the hero, or a
// party member named by its `wielder` (src/data/weapons.js, src/data/armor.js).
// Nobody can use anyone else's. The hero's are HERO_STATE.weapon and .armor;
// a member's are in HERO_STATE.memberGear, as { vesper: { weapon, armor } }.
//
// Everything here takes `who`: 'hero', or a member id.

export const HERO = 'hero';

const SLOTS = {
  weapon: { table: WEAPONS, owned: 'weapons' },
  armor: { table: ARMOR, owned: 'armors' },
};

// What a member brings with them when they join (see joinParty).
export const STARTING_GEAR = {
  vesper: { weapon: 'lamplighters_handle', armor: 'evening_coat' },
  bramble: { weapon: 'grandads_hatchet', armor: 'hand_me_down_flannel' },
};

// A member's gear stats, all optional (0 if left out), and how the menus
// label them. Weapons tend to have the first six, armor the last three.
// Battle reads them through memberGearBonus, next to the member's skills:
//   fightPower  scales their FIGHT (weapons only; a member with no weapon
//               fights at MEMBER_FIGHT_POWER)
//   allyStrike  extra damage from their hit on everyone (Ves's SLEET)
//   allyCalm    extra MERCY from their calming move (Ves's FLURRY)
//   allyHeal    extra HP from their healing move (Ves's ZEPHYR)
//   allySp      extra SP from their move (Ves's ZEPHYR)
//   gust        seconds their guard (SHELTER) also slows the next attack's bullets
//   shelterDef  taken off every hit while their guard (SHELTER) is up
//   regen       HP you get back at the end of every enemy turn
//   grazeSp     extra SP from your grazes (0.15 = +15%)
//   sneak       how much harder their sneak attack hits, after HIDE (0.5 = +50%)
//   shorten     how much more their HOLLER cuts the next attack short (0.1 = 10%)
// They can be negative, as a trade for something else. The spell stats are
// labelled with the wearer's own spell names (their `statNames` in party.js).
const percent = (value) => `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
const plus = (value) => `${value > 0 ? '+' : ''}${value}`;
export const MEMBER_GEAR_STATS = [
  { stat: 'fightPower', color: 'fight', label: (v) => `FIGHT x${v}` },
  { stat: 'allyStrike', color: 'fight', label: (v, names) => `${names.allyStrike ?? 'STRIKE'} ${plus(v)}` },
  { stat: 'allyCalm', color: 'calm', label: (v, names) => `${names.allyCalm ?? 'CALM'} ${plus(v)}` },
  { stat: 'allyHeal', color: 'heal', label: (v, names) => `${names.allyHeal ?? 'HEAL'} ${plus(v)}` },
  { stat: 'allySp', color: 'spGain', label: (v, names) => `${names.allySp ?? 'SP'} ${plus(v)}` },
  { stat: 'sneak', color: 'fight', label: (v) => `SNEAK ATTACK ${percent(v)}` },
  { stat: 'shorten', color: 'ability', label: (v) => `FLINCH ${percent(v)}` },
  { stat: 'gust', color: 'ability', label: () => 'SHELTER: GUST' },
  { stat: 'shelterDef', color: 'defense', label: (v) => `SHELTER DEF ${plus(v)}` },
  { stat: 'regen', color: 'heal', label: (v) => `HP ${plus(v)} EACH TURN` },
  { stat: 'grazeSp', color: 'spGain', label: (v) => `GRAZE SP ${percent(v)}` },
];

function entry(slot, id) {
  return SLOTS[slot].table[id] ?? null;
}

// Who a weapon or piece of armor is for: 'hero', or a member id.
export function wielderOf(slot, id) {
  return entry(slot, id)?.wielder ?? HERO;
}

export function canEquip(who, slot, id) {
  return entry(slot, id) !== null && wielderOf(slot, id) === who;
}

// What `who` could put on in a slot: the owned ones made for them.
export function ownedGear(who, slot) {
  return (HERO_STATE[SLOTS[slot].owned] ?? []).filter((id) => canEquip(who, slot, id));
}

// What `who` has on in a slot, or null.
export function equippedGear(who, slot) {
  if (who === HERO) return HERO_STATE[slot] ?? null;
  return HERO_STATE.memberGear?.[who]?.[slot] ?? null;
}

// Puts something on `who`, if it's theirs to wear. Returns whether it worked.
export function equipGear(who, slot, id) {
  if (!canEquip(who, slot, id)) return false;
  if (who === HERO) {
    HERO_STATE[slot] = id;
  } else {
    HERO_STATE.memberGear ??= {};
    HERO_STATE.memberGear[who] ??= {};
    HERO_STATE.memberGear[who][slot] = id;
  }
  return true;
}

// Whether anyone has it on (shops won't buy it then).
export function isWorn(slot, id) {
  if (HERO_STATE[slot] === id) return true;
  return Object.values(HERO_STATE.memberGear ?? {}).some((gear) => gear?.[slot] === id);
}

// A member's starting kit: owned, and put on wherever they've nothing on yet.
export function giveStartingGear(who) {
  const kit = STARTING_GEAR[who];
  if (!kit) return;
  for (const [slot, id] of Object.entries(kit)) {
    const owned = (HERO_STATE[SLOTS[slot].owned] ??= []);
    if (!owned.includes(id)) owned.push(id);
    if (!canEquip(who, slot, equippedGear(who, slot))) equipGear(who, slot, id);
  }
}

export const MEMBER_FIGHT_POWER = 0.5;

// How hard a member's FIGHT hits: their weapon's fightPower (or, hurt, the
// weak swat in their `hurt` block).
export function memberFightPower(who) {
  const hurt = hurtState(who);
  if (hurt) return hurt.fightPower ?? MEMBER_FIGHT_POWER;
  return WEAPONS[equippedGear(who, 'weapon')]?.fightPower ?? MEMBER_FIGHT_POWER;
}

// One stat added up across a member's weapon and armor (0 if they've none).
// While they're hurt (Ves without her umbrella) their weapon counts for nothing.
export function memberGearBonus(who, stat) {
  const slots = hurtState(who) ? ['armor'] : ['weapon', 'armor'];
  return slots.reduce((sum, slot) => sum + Number(entry(slot, equippedGear(who, slot))?.[stat] ?? 0), 0);
}

// The menus' labels for a member's weapon or armor: [{ text, color, bad }],
// with `color` a MENU_COLORS key. Stats it hasn't got are left out.
export function memberGearLabels(slot, id) {
  const gear = entry(slot, id) ?? {};
  const names = MEMBERS[gear.wielder]?.statNames ?? {};
  return MEMBER_GEAR_STATS
    .filter(({ stat }) => gear[stat])
    .map(({ stat, color, label }) => ({ stat, text: label(gear[stat], names), color, bad: gear[stat] < 0 }));
}
