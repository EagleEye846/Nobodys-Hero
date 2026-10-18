import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { HERO_STATE } from './heroState.js';
import { giveStartingGear } from './equipment.js';
import { VES_FRAMES } from '../data/art/vesper.js';

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
    // Their prop sprite (src/data/art/props.js), used where there's no frame for it.
    look: 'vesper_stand',
    // Walking and running frames, like the hero's (see memberFrames).
    frames: VES_FRAMES,
    // A portrait id from src/data/art/portraits.js, when they have one.
    portrait: 'vesper',
    // HP at level 1, and how much more with every level the hero gains (they
    // level up together).
    baseHp: 44,
    hpPerLevel: 9,
    // How much stronger they get with every level after the first: FIGHT power
    // (as a share: 0.1 is 10% more a level), and what their spells add (the
    // same effects their gear adds to: see equipment.js).
    growth: { fight: 0.1, allyStrike: 2, allyHeal: 3, allyCalm: 1 },
    // Skill points they get with every level the hero gains.
    skillPointsPerLevel: 1,
    // On their turn they get a menu like yours (FIGHT, TALK, SPELLS, ITEMS,
    // DEFEND; see battleScene.js). FIGHT's power comes from their own weapon
    // (src/characters/equipment.js). These are their SPELLS: each has a label,
    // a `cost` in the SP you share (0 for none), what it does, and what the
    // panel says. Effects: calmAll (MERCY for every enemy), sp (spell power
    // for the hero), heal (hero HP), guard (halves the next attack, and takes
    // a little more off each hit), strikeAll and strikeOne (damage to every
    // enemy, or to one: a multiple of the most their own FIGHT could do, plus
    // their allyStrike; see bestStrike in battleScene.js).
    commands: [
      { label: 'SHELTER', cost: 6, guard: true, text: 'Ves opens her umbrella over you and holds it steady.\nThe next attack will do half the damage.' },
      { label: 'FLURRY', cost: 12, calmAll: 10, text: 'Ves twirls her umbrella. Snow swirls round everyone, soft and slow.' },
      { label: 'SLEET', cost: 20, strikeAll: 0.6, text: 'Ves points her umbrella. A sting of sleet sweeps across the room!' },
      { label: 'ZEPHYR', cost: 0, heal: 8, sp: 10, text: 'Ves calls a warm wind. It smells of hearths and spring.' },
    ],
    // SPELLS learned from their branches of the skill tree (a skill's
    // `command` effect, src/data/skills.js), added after the ones above.
    learnable: {
      downdraft: { label: 'DOWNDRAFT', cost: 30, strikeOne: 1.4, text: 'Ves snaps her umbrella shut and brings the wind straight down!' },
      whiteout: { label: 'WHITEOUT', cost: 60, strikeAll: 1.1, text: 'Ves spins her umbrella over her head. The whole room goes white!' },
      aurora: { label: 'AURORA', cost: 40, heal: 40, text: 'Ves lifts her umbrella, and the light of the northern sky pours down it.' },
    },
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
  // They come with their own weapon and armor, already on.
  giveStartingGear(id);
  return true;
}

export function leaveParty(id) {
  HERO_STATE.party = partyIds().filter((member) => member !== id);
}

// What `effect` (a key of a member's `growth`) adds at the hero's level now.
export function memberGrowth(id, effect) {
  return (MEMBERS[id]?.growth?.[effect] ?? 0) * (HERO_STATE.level - 1);
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
// A member's sprite, facing right and left (in battle they face right).
export function memberSprites(id) {
  if (!sprites.has(id)) {
    const frames = memberFrames(id);
    const right = frames?.rightIdle ?? makeSprite(PROP_SPRITES[MEMBERS[id].look], PROP_PALETTE);
    sprites.set(id, { right, left: frames?.leftIdle ?? flipHorizontal(right) });
  }
  return sprites.get(id);
}

const frameSets = new Map();
// A member's walking and running frames, if they have them (`frames`: rows
// in the prop palette, named like the hero's: downIdle, leftStep, upStride...),
// with the right-facing ones made by mirroring the left. Null if they don't.
export function memberFrames(id) {
  if (!frameSets.has(id)) {
    const rows = MEMBERS[id].frames;
    let set = null;
    if (rows) {
      set = Object.fromEntries(Object.entries(rows).map(([name, frame]) => [name, makeSprite(frame, PROP_PALETTE)]));
      for (const [name, sprite] of Object.entries(set)) {
        if (name.startsWith('left')) set[`right${name.slice(4)}`] = flipHorizontal(sprite);
      }
    }
    frameSets.set(id, set);
  }
  return frameSets.get(id);
}
