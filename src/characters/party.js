import { makeSprite, flipHorizontal } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { HERO_STATE } from './heroState.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { giveStartingGear } from './equipment.js';
import { VES_FRAMES, VES_CRUTCH_FRAMES } from '../data/art/vesper.js';
import { BRAMBLE_FRAMES } from '../data/art/bramble.js';

// Friends who travel with the hero. A member who's joined (HERO_STATE.party)
// follows you round the world (src/overworld/follower.js: they vanish while
// you're on the rope and catch up when you're off it), takes a turn of their
// own in every battle after yours (battleScene.js, the 'ally' phase), and
// has a branch of their own in the skill tree (MEMBER_SKILL_BRANCHES in
// src/data/skills.js), paid for with their own points.
//
// Someone joins through a cutscene step ({ do: 'join', who: 'vesper' }) or by
// talking to a room character with `join: 'vesper'` (see OverworldScene.interact).
// Nobody joins yet by default: Ves is the first one built.
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
    growth: { fight: 0.05, allyStrike: 2, allyHeal: 3, allyCalm: 1 },
    // Before chapter 5 her FIGHT grows slower (the hero's doesn't grow with
    // levels at all): at 0.05 she was hitting 75-80% as hard as him at each
    // chapter's start. 0.03 keeps her near 60%, under Bramble.
    earlyGrowth: { fight: 0.03 },
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
    // Besides the effects above, these use (see allyAct in battleScene.js):
    //   shorten   the next enemy attack is cut short by this share (like HOLLER)
    //   headwind  the next attack's bullets are slowed for this many seconds,
    //             with no SHELTER needed (SHELTER's gust adds to it)
    //   absorb    the next hit on the hero this enemy turn does nothing at all
    //   riposte   the next hit on anyone this enemy turn is thrown back at
    //             an attacker: this multiple of her best FIGHT
    //   regen     HP back at the end of each of the next `turns` enemy turns
    //             (for everyone, with `regenAll`)
    //   expose    { bonus, turns }: the enemy they pick takes `bonus` more from
    //             every hit for `turns` enemy turns (the hero's Lay Bare)
    //   healAll   HP for everyone in the party at once
    learnable: {
      downdraft: { label: 'DOWNDRAFT', cost: 80, strikeOne: 1.4, text: 'Ves snaps her umbrella shut and brings the wind straight down!' },
      whiteout: { label: 'WHITEOUT', cost: 60, strikeAll: 1.1, text: 'Ves spins her umbrella over her head. The whole room goes white!' },
      aurora: { label: 'AURORA', cost: 40, heal: 40, text: 'Ves lifts her umbrella, and the light of the northern sky pours down it.' },
      // Chapter 3: her mother's umbrella, and the weather that comes with it.
      updraft: { label: 'UPDRAFT', cost: 24, shorten: 0.25, sp: 6, text: 'Ves flings her umbrella open into the wind. Everyone gets knocked back a step.' },
      headwind: { label: 'HEADWIND', cost: 14, headwind: 3, text: 'Ves turns her umbrella into the wind and leans on it. The air goes thick and slow.' },
      thunderclap: { label: 'THUNDERCLAP', cost: 44, strikeOne: 1.6, shorten: 0.15, text: 'Ves snaps the umbrella open with a CRACK like thunder!' },
      raindance: { label: 'RAIN DANCE', cost: 28, regen: 10, turns: 3, text: 'Ves twirls under her umbrella, and a warm rain starts to fall. It keeps falling.' },
      brace: { label: 'BRACE', cost: 20, absorb: true, text: 'Ves plants her feet and braces the umbrella in front of you both.\nThe next hit on you will do nothing.' },
      spin: { label: 'PARASOL SPIN', cost: 32, riposte: 1.2, text: 'Ves sets her umbrella spinning. Whatever hits it next is going straight back.' },
      hailstorm: { label: 'HAILSTORM', cost: 50, strikeAll: 0.95, text: 'Ves points her umbrella at the sky, and the sky throws hail at everyone!' },
      // Chapter 4.
      cyclone: { label: 'CYCLONE', cost: 70, strikeAll: 1.3, shorten: 0.2, text: 'Ves spins and spins until the wind picks the whole room up!' },
      daybreak: { label: 'DAYBREAK', cost: 60, healAll: 45, text: 'Ves opens her umbrella wide, and the first light of morning comes through it.' },
      monsoon: { label: 'MONSOON', cost: 48, regen: 14, turns: 4, sp: 10, text: 'Ves calls the rain down in sheets. It will rain for a while.' },
      // Chapter 5, the BREEZE branch. Sail is what the party can't be hit for at
      // the start of the next attack (seconds; her gust skills add to it), and
      // Rip Current hits every enemy harder the more of them there are (`pull`).
      sea_breeze: { label: 'COOL CHANGE', cost: 30, heal: 75, text: 'Ves tips her umbrella into a cool wind off the sea. It smells of salt and clean washing.' },
      sail: { label: 'BILLOW', cost: 36, sail: 3, text: 'Ves opens her umbrella like a sail, and the wind takes all three of you past the worst of it.' },
      downpour: { label: 'DOWNPOUR', cost: 85, strikeAll: 1.5, shorten: 0.15, text: 'Ves points her umbrella at the green sky, and the sea comes down on everyone!' },
      rip_current: { label: 'WHIRL', cost: 45, strikeAll: 0.7, pull: 0.5, shorten: 0.1, text: 'Ves sweeps her umbrella round, and the water drags every enemy into a heap.' },
      // Chapter 5, the second half of the tree. Her attacks are measured
      // against her own FIGHT, so the hero still hits hardest; her strength is
      // the wind, looking after everyone, and magic.
      hold_fast: { label: 'HOLD FAST', cost: 34, guard: true, absorb: true, text: 'Ves digs her heels in and holds the umbrella out in front of you both.\nThe next attack will do half the damage, and the first hit nothing.' },
      windshear: { label: 'WINDSHEAR', cost: 58, strikeOne: 1.9, shorten: 0.2, text: 'Ves slices the umbrella sideways, and the wind cuts like a blade!' },
      hurricane: { label: 'HURRICANE', cost: 100, strikeAll: 1.8, shorten: 0.25, text: 'Ves holds her umbrella up and lets the whole storm in. Everything goes round and round!' },
      fireside: { label: 'FIRESIDE', cost: 75, healAll: 70, text: 'Ves shakes out her umbrella like it\'s been a long day, and somehow everyone feels warm and dry.' },
      sheet_lightning: { label: 'SHEET LIGHTNING', cost: 55, strikeAll: 1.1, pull: 0.3, text: 'Ves taps the umbrella\'s tip on the floor. The whole sky flashes, and it jumps from one enemy to the next!' },
      supercell: { label: 'SUPERCELL', cost: 100, strikeOne: 2.4, shorten: 0.2, text: 'Ves points her umbrella at one enemy, and the biggest cloud you\'ve ever seen opens over it.' },
      still_air: { label: 'STILL AIR', cost: 28, calmAll: 24, shorten: 0.15, text: 'Ves closes her umbrella and the wind just stops. Nobody quite knows what to do with themselves.' },
      clear_skies: { label: 'CLEAR SKIES', cost: 90, healAll: 55, shorten: 0.2, absorb: true, text: 'Ves opens her umbrella and the clouds pull apart. The sun comes out on all of you.' },
      // Chapter 5's third wave. CHARGE leaves one enemy open (`expose`, as the
      // hero's Lay Bare does): every hit on it lands harder for a while.
      twirl: { label: 'TWIRL', cost: 24, calmAll: 14, headwind: 2, text: 'Ves twirls her umbrella on her shoulder like she\'s out for a stroll. It\'s very calming. The air goes slow.' },
      lift: { label: 'LIFT', cost: 30, shorten: 0.3, sp: 10, text: 'Ves catches the wind under her umbrella and lets it lift the whole fight back a step.' },
      // HOT SOUP is RAIN DANCE for everyone (`regenAll`).
      hot_soup: { label: 'HOT SOUP', cost: 70, regen: 10, regenAll: true, turns: 2, text: 'Ves produces a flask of soup from somewhere and passes it round. It stays hot for ages.' },
      charge: { label: 'CHARGE', cost: 40, expose: { bonus: 0.3, turns: 2 }, text: 'Ves rubs the umbrella\'s silk the wrong way and points. Something crackles all over the enemy.' },
      windbreak: { label: 'WINDBREAK', cost: 60, guard: true, sail: 2, text: 'Ves plants the umbrella like a windbreak on a beach, and pulls you both in behind it.' },
    },
    // What their gear's and skills' stats are called in the menus, after
    // their own SPELLS (see MEMBER_GEAR_STATS in equipment.js).
    statNames: { allyStrike: 'SLEET', allyCalm: 'FLURRY', allyHeal: 'ZEPHYR HP', allySp: 'ZEPHYR SP' },
    // While she's hurt (chapter 3, after the Lantern Marsh: her leg's bad and
    // her umbrella's lost, so she rides on your back; see isHurt). Her max HP
    // is halved, and these SPELLS take the place of all her others (they all
    // need the umbrella). Her weapon does nothing, and her FIGHT is a weak
    // swat at `fightPower`. In battle she sits on the ground (`look`).
    //   cover    SHELTER's guard (the next attack is halved, and every hit
    //            does a little less), but cheaper, and with no gust
    //   callOut  she shouts what's coming: her warning shows in the panel as
    //            the next attack starts ([vesper_call_out] in text/battle.txt),
    //            and its bullets start out slowed (CALL_OUT_SPEED in battleScene.js)
    // Walking about while she's hurt (after the healer in Lasthome patches her
    // up), she limps on a crutch: `frames` take the place of her usual ones
    // (see memberFrames).
    hurt: {
      look: 'vesper_hurt',
      // Her face without the umbrella over it (in the menus).
      portrait: 'vesper_bare',
      frames: VES_CRUTCH_FRAMES,
      fightPower: 0.3,
      note: "Ves's umbrella is lost. She can't fight without it.",
      commands: [
        { label: 'COVER', cost: 4, cover: true, text: 'Ves pulls her coat off her shoulders and holds it up over you both.\nThe next attack will do half the damage.' },
        { label: 'CALL OUT', cost: 4, callOut: true, text: 'Ves watches them closely, ready to shout.' },
      ],
    },
  },

  // BRAMBLE: the woodcutters' kid, about ten, met in the Hushwood with a
  // hatchet too big for him, hunting the beast that went after Ves. Loud,
  // brave, wrong about things. In the world he fits through gaps you can't
  // (switch to him with Q), and he chops down thin trees. In battle he
  // hollers, hides in the leaves, and chops.
  bramble: {
    id: 'bramble',
    name: 'BRAMBLE',
    color: '#e0662c',
    look: 'bramble_stand',
    frames: BRAMBLE_FRAMES,
    portrait: 'bramble',
    // He joins a chapter after Ves did, so he starts out a little sturdier,
    // with a few skill points to spend on his tree straight away.
    baseHp: 70,
    startingPoints: 4,
    hpPerLevel: 9,
    growth: { fight: 0.05, allyStrike: 2, allyHeal: 2, allyCalm: 1 },
    skillPointsPerLevel: 1,
    // Effects of his own, besides the ones Ves's spells use:
    //   shorten  the next enemy attack is cut short by this share (they flinch)
    //   hide     nothing's aimed at him this enemy turn, and his next FIGHT or
    //            CHOP is a sneak attack (see SNEAK_POWER in battleScene.js)
    commands: [
      { label: 'HOLLER', cost: 8, calmAll: 8, shorten: 0.3, text: 'Bramble cups his hands and HOLLERS. Everybody flinches, including you.' },
      { label: 'HIDE', cost: 0, hide: true, text: 'Bramble dives into the leaves. You can just see the top of his head.' },
      { label: 'CHOP', cost: 14, strikeOne: 1.3, text: 'Bramble swings his hatchet with both hands and his whole weight behind it!' },
    ],
    learnable: {
      biscuit: { label: 'BISCUIT', cost: 12, heal: 30, text: 'Bramble digs in his pocket and finds a biscuit. It\'s only a bit fluffy.' },
      slingshot: { label: 'SLINGSHOT', cost: 4, strikeOne: 0.7, sp: 8, text: 'Bramble fires an acorn from his slingshot. Plink!' },
      war_cry: { label: 'WAR CRY', cost: 20, calmAll: 6, sp: 18, text: 'Bramble bangs his hatchet on a stump and yells a woodcutters\' song, badly.' },
      timber: { label: 'TIMBER!', cost: 55, strikeAll: 1.15, text: 'Bramble hacks at the nearest tree and yells TIMBER! It comes down on everyone!' },
      // Chapter 4 (for when he's back with you).
      fell: { label: 'FELL', cost: 60, strikeOne: 2, text: 'Bramble winds up like he\'s felling an oak, and brings the hatchet round!' },
      whistle: { label: 'WHISTLE', cost: 16, sp: 24, shorten: 0.1, text: 'Bramble puts two fingers in his mouth and whistles. Everybody\'s ears ring.' },
      marbles: { label: 'MARBLES', cost: 30, strikeAll: 0.8, text: 'Bramble empties a pocket of marbles across the floor. Everybody goes over!' },
      // Chapter 5, the CHILL branch (after the Last Light). Wade In: his friends'
      // hits land on him instead, halved, for the enemy turn.
      deep_breath: { label: 'COUNT TO TEN', cost: 10, calmAll: 14, sp: 14, text: 'Bramble takes the biggest breath of his life, and lets it out slowly. Everybody feels calmer, including him.' },
      cannonball: { label: 'CANNONBALL', cost: 50, strikeOne: 2.3, shorten: 0.2, text: 'Bramble takes a run up and jumps with his knees tucked! SPLASH. Everything nearby is soaked.' },
      lifeline: { label: 'HAND UP', cost: 22, heal: 75, text: 'Bramble throws a rope, and hauls a friend back up by it, hand over hand.' },
      wade_in: { label: 'STAND FIRM', cost: 18, wade: true, text: 'Bramble splashes in front of his friends, shaking, with his chin up.' },
      // Chapter 5, the second half of the tree: chopping, cheering, and sneaking.
      splinters: { label: 'SPLINTERS', cost: 62, strikeAll: 1.35, shorten: 0.1, text: 'Bramble hacks at everything in reach. Chips fly everywhere!' },
      big_one: { label: 'THE BIG ONE', cost: 90, strikeOne: 3, shorten: 0.25, text: 'Bramble spits on his hands, takes the longest wind-up in history, and SWINGS.' },
      cheer: { label: 'THREE CHEERS', cost: 28, healAll: 30, calmAll: 6, text: 'Bramble climbs on something and leads three cheers for everybody. Hip hip!' },
      sing_along: { label: 'SING-ALONG', cost: 45, healAll: 35, calmAll: 16, sp: 10, text: 'Bramble starts a song everybody knows. By the second verse even the enemies are humming.' },
      conkers: { label: 'CONKERS', cost: 18, strikeAll: 0.7, shorten: 0.05, text: 'Bramble whirls a conker on a string round his head and lets go of the string. Several times.' },
      // CHILL's last star: he stands in front of everyone and patches them up.
      got_you: { label: "I'VE GOT YOU", cost: 50, wade: true, healAll: 40, text: 'Bramble plants himself in front of everyone and doesn\'t move. "I\'ve got you."' },
      // Chapter 5's third wave. NOTCH leaves the enemy open (`expose`), like
      // Ves's CHARGE; LOOK OUT shouts a warning (CALL OUT) and gets you out of
      // the way of the first hit (BRACE's `absorb`).
      notch: { label: 'NOTCH', cost: 36, strikeOne: 0.8, expose: { bonus: 0.3, turns: 2 }, text: 'Bramble cuts a neat notch in it, like his dad showed him. "That\'s where you hit it."' },
      rally: { label: 'RALLY', cost: 34, healAll: 20, sp: 16, text: 'Bramble waves his hatchet over his head. "Come on! We\'re not done!"' },
      pocket_sand: { label: 'POCKET SAND', cost: 16, headwind: 3, text: 'Bramble flings a handful of sand from his pocket. Nobody can see a thing.' },
      look_out: { label: 'LOOK OUT!', cost: 24, callOut: true, absorb: true, text: 'Bramble climbs up on something to keep watch.' },
      shake_off: { label: 'SHAKE IT OFF', cost: 32, heal: 40, shorten: 0.1, text: 'Bramble shakes himself like a wet dog, all over a friend. Somehow it helps.' },
    },
    statNames: { allyStrike: 'CHOP', allyCalm: 'HOLLER', allyHeal: 'BISCUIT', allySp: 'WAR CRY' },
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
  HERO_STATE.memberPoints[id] ??= MEMBERS[id].startingPoints ?? 1;
  // They come with their own weapon and armor, already on.
  giveStartingGear(id);
  return true;
}

export function leaveParty(id) {
  HERO_STATE.party = partyIds().filter((member) => member !== id);
}

// Whether a member is hurt (HERO_STATE.hurt): set by a cutscene step,
// { do: 'hurt', who: 'vesper', on: true }, and healed by one with on: false.
// While they're hurt they use their `hurt` block above, if they have one.
// A friend's pronouns for menu lines ("Her HP was maxed out!", "He'll follow
// you"), capitalised; anyone not listed gets they/their.
const PRONOUNS = { vesper: { they: 'She', their: 'Her' }, bramble: { they: 'He', their: 'His' } };
export function pronoun(id, which = 'they') {
  return PRONOUNS[id]?.[which] ?? { they: 'They', their: 'Their' }[which];
}
export function possessive(id) {
  return pronoun(id, 'their');
}

// Ves's hurt leg is chapter 3's: from chapter 4 on she's well, whatever an
// older save (or a chapter start built from one) still says. Hurt, she fights
// with no umbrella at a third of her strength.
const WELL_FROM_CHAPTER = { vesper: 4 };
export function isHurt(id) {
  if ((WORLD_STATE.chapter ?? 1) >= (WELL_FROM_CHAPTER[id] ?? Infinity)) return false;
  return (HERO_STATE.hurt ?? []).includes(id);
}

export function setHurt(id, on) {
  if (!MEMBERS[id]) throw new Error(`Unknown party member '${id}'`);
  const others = (HERO_STATE.hurt ?? []).filter((member) => member !== id);
  HERO_STATE.hurt = on ? [...others, id] : others;
  // Hurt or well again, they start from full.
  if (HERO_STATE.memberHp) delete HERO_STATE.memberHp[id];
}

// Their `hurt` block while they're hurt, or null.
export function hurtState(id) {
  return isHurt(id) ? MEMBERS[id]?.hurt ?? null : null;
}

// From chapter 5 on, a friend's FIGHT stops growing with levels past LV 37
// (where a full chapter 4 ends): like the hero's, it climbs with their weapon
// and their own skills from then on, so FIGHT stays hero > Bramble > Ves.
// Their spells, heals and calming keep growing with every level.
const FIGHT_GROWTH_CAP_CHAPTER = 5;
const FIGHT_GROWTH_CAP_LEVEL = 37;

// What `effect` (a key of a member's `growth`) adds at the hero's level now.
export function memberGrowth(id, effect) {
  let levels = HERO_STATE.level - 1;
  if (effect === 'fight' && (WORLD_STATE.chapter ?? 1) >= FIGHT_GROWTH_CAP_CHAPTER) levels = Math.min(levels, FIGHT_GROWTH_CAP_LEVEL - 1);
  const early = (WORLD_STATE.chapter ?? 1) < FIGHT_GROWTH_CAP_CHAPTER ? MEMBERS[id]?.earlyGrowth?.[effect] : undefined;
  return (early ?? MEMBERS[id]?.growth?.[effect] ?? 0) * levels;
}

// Their max HP at the hero's level now: half of it while they're hurt.
export function memberMaxHp(id) {
  const member = MEMBERS[id];
  const full = member.baseHp + (HERO_STATE.level - 1) * member.hpPerLevel;
  return isHurt(id) ? Math.ceil(full / 2) : full;
}

// Their HP now. Like the hero's, it carries between battles (see heroHp in
// progress.js): food from the ITEMS menu, levelling up, a save point and a
// night at an inn bring it back. A missing value means full.
export function memberHp(id) {
  const max = memberMaxHp(id);
  return Math.max(0, Math.min(max, HERO_STATE.memberHp?.[id] ?? max));
}

export function setMemberHp(id, hp) {
  HERO_STATE.memberHp ??= {};
  HERO_STATE.memberHp[id] = Math.max(0, Math.min(memberMaxHp(id), Math.round(hp)));
}

// A member's skill points: the ones they've earned, less the ones they've spent.
export function memberPoints(id) {
  return HERO_STATE.memberPoints?.[id] ?? 0;
}

export function spendMemberPoints(id, cost) {
  HERO_STATE.memberPoints ??= {};
  HERO_STATE.memberPoints[id] = memberPoints(id) - cost;
}

// The frames are made once and kept, separately for hurt and well (a member
// can have different frames while they're hurt), so the key says which.
const cacheKey = (id) => `${id}${hurtState(id)?.frames ? ':hurt' : ''}`;

const sprites = new Map();
// A member's sprite, facing right and left (in battle they face right).
export function memberSprites(id) {
  const key = cacheKey(id);
  if (!sprites.has(key)) {
    const frames = memberFrames(id);
    const right = frames?.rightIdle ?? makeSprite(PROP_SPRITES[MEMBERS[id].look], PROP_PALETTE);
    sprites.set(key, { right, left: frames?.leftIdle ?? flipHorizontal(right) });
  }
  return sprites.get(key);
}

const frameSets = new Map();
// A member's walking and running frames, if they have them (`frames`: rows
// in the prop palette, named like the hero's: downIdle, leftStep, upStride...),
// with the right-facing ones made by mirroring the left. Null if they don't.
// While they're hurt, their `hurt` block's frames if it has some (Ves on her crutch).
export function memberFrames(id) {
  const key = cacheKey(id);
  if (!frameSets.has(key)) {
    const rows = hurtState(id)?.frames ?? MEMBERS[id].frames;
    let set = null;
    if (rows) {
      set = Object.fromEntries(Object.entries(rows).map(([name, frame]) => [name, makeSprite(frame, PROP_PALETTE)]));
      for (const [name, sprite] of Object.entries(set)) {
        if (name.startsWith('left')) set[`right${name.slice(4)}`] = flipHorizontal(sprite);
      }
    }
    frameSets.set(key, set);
  }
  return frameSets.get(key);
}
