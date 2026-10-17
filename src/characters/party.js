import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { HERO_STATE } from './heroState.js';

// Friends who travel with the hero. A member who's joined (HERO_STATE.party)
// follows you round the world (src/overworld/follower.js: they vanish while
// you're on the rope and catch up when you're off it), takes a turn of their
// own in every battle after yours (battleScene.js, the 'ally' phase), and
// has a branch of their own in the skill tree (MEMBER_SKILL_BRANCHES in
// src/data/skills.js), paid for with their own points.
//
// Someone joins through a cutscene step ({ do: 'join', who: 'vesper' }) or by
// talking to a room character with `join: 'vesper'` (see OverworldScene.interact).
// Nobody joins yet by default: Ves is the first one built (see
// docs/party-member-ideas.md).
export const MEMBERS = {
  // VES (Vesper): a girl from Heralds' Rest, found praying in the chapel. She
  // fights with her umbrella: it shelters you, and it catches the snow and
  // the wind for her spells.
  vesper: {
    id: 'vesper',
    name: 'VES',
    color: '#9a7ad8',
    // Their prop sprite (src/data/art/props.js), used in the world and in battle.
    look: 'vesper',
    // A portrait id from src/data/art/portraits.js, when they have one.
    portrait: 'vesper',
    // HP: for show, for now. Enemies only ever aim at the hero's shadow.
    baseHp: 44,
    hpPerLevel: 5,
    // Skill points they get with every level the hero gains.
    skillPointsPerLevel: 1,
    // What they can do on their turn. Each has a label, what it does, and
    // what the panel says. Effects: calmAll (MERCY for every enemy), sp
    // (spell power for the hero), heal (hero HP), guard (halves the next
    // attack), strikeAll (damage to every enemy).
    commands: [
      { label: 'SHELTER', guard: true, text: 'Ves opens her umbrella over you and holds it steady.\nThe next attack will do half the damage.' },
      { label: 'FLURRY', calmAll: 10, text: 'Ves twirls her umbrella. Snow swirls round everyone, soft and slow.' },
      { label: 'SLEET', strikeAll: 8, text: 'Ves points her umbrella. A sting of sleet sweeps across the room!' },
      { label: 'ZEPHYR', heal: 8, sp: 10, text: 'Ves calls a warm wind. It smells of hearths and spring.' },
    ],
  },
};

export function partyIds() {
  return HERO_STATE.party ?? [];
}

export function inParty(id) {
  return partyIds().includes(id);
}

export function joinParty(id) {
  if (!MEMBERS[id]) throw new Error(`Unknown party member '${id}'`);
  HERO_STATE.party ??= [];
  HERO_STATE.memberPoints ??= {};
  if (HERO_STATE.party.includes(id)) return false;
  HERO_STATE.party.push(id);
  HERO_STATE.memberPoints[id] ??= 1;
  return true;
}

export function leaveParty(id) {
  HERO_STATE.party = partyIds().filter((member) => member !== id);
}

export function memberMaxHp(id) {
  const member = MEMBERS[id];
  return member.baseHp + (HERO_STATE.level - 1) * member.hpPerLevel;
}

// A member's skill points: the ones they've earned, less the ones they've spent.
export function memberPoints(id) {
  return HERO_STATE.memberPoints?.[id] ?? 0;
}

export function spendMemberPoints(id, cost) {
  HERO_STATE.memberPoints ??= {};
  HERO_STATE.memberPoints[id] = memberPoints(id) - cost;
}

const sprites = new Map();
// A member's sprite, facing right and left.
export function memberSprites(id) {
  if (!sprites.has(id)) {
    const right = makeSprite(PROP_SPRITES[MEMBERS[id].look], PROP_PALETTE);
    sprites.set(id, { right, left: flipHorizontal(right) });
  }
  return sprites.get(id);
}
