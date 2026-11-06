// The skill tree: branches, each a chain where every skill needs the one above
// it. Skill points (and max HP) only come from levelling up with EXP.
// Descriptions live in text/skills/skills.txt, one section per skill id.
//
// The tree grows with the story: a skill's `chapter` (1 if left out) is the
// chapter it becomes learnable in, and the SKILLS screen only shows the ones
// up to the chapter you're on (WORLD_STATE.chapter). Each new chapter should
// add about as many skills again as there were before (roughly doubling the
// tree): more spells, and new branches as the game opens up.
//
// Effects (added together across learned skills):
//   fightPower       extra FIGHT damage (0.15 = +15%)
//   strikeTolerance  how much wider the FIGHT bar's hit window is (0.3 = +30%)
//   strikeSlashes    extra FIGHT slashes
//   spell            a spell id from src/data/spells.js to learn
//   grazeSp          extra SP from grazing (0.25 = +25%)
//   grazeRadius      extra graze reach, in world pixels
//   damageReduction  less damage from every hit (never below 1)
//   iframes          extra seconds of invincibility after a hit
//   defendHeal       HP healed when you DEFEND
//   lastStand        once per battle, survive a knockout hit with 1 HP
//   runSpeed         faster running in the overworld (0.25 = +25%)
//   jumpHeight       extra jump height, in world pixels (12 is one block step)
//   softLanding      landings crack the floor only every other time
// Chapter 2 effects:
//   spStart          SP you start every battle with (25 = 25%)
//   spellDiscount    spells cost this much less SP (0.2 = 20% off)
//   pacifyDiscount   Pacify alone costs this much less (0.5 = half price)
//   healBoost        Heal Pulse and Mend heal this much more (0.5 = +50%)
//   itemBoost        food heals this much more (0.3 = +30%)
//   mercyBoost       TALK, Lull and Hush raise MERCY this much more (0.25 = +25%)
//   goldBonus        more gold from every fight (0.25 = +25%)
//   swingPower       pump a rope swing up this much faster (0.5 = +50%)
//   bargain          shops charge this much less (0.15 = 15% off)
//   spellPower       attack spells hit this much harder (0.2 = +20%)
// Chapter 3 adds a couple of stars to every branch (the Hushwood, the Dead
// City), and chapter 4 a couple more, past the Hero's Gate: those are written
// now, hidden until the story gets there, so the tree's ready to grow.
export const SKILL_BRANCHES = [
  {
    name: 'VALOR',
    icon: 'fight',
    color: '#ff8c1a',
    skills: [
      { id: 'sharpened', name: 'Sharpened', cost: 1, effect: { fightPower: 0.15 } },
      { id: 'keen_eye', name: 'Keen Eye', cost: 1, effect: { strikeTolerance: 0.3 } },
      { id: 'rend', name: 'Rend', cost: 2, effect: { spell: 'rend' } },
      { id: 'flurry', name: 'Flurry', cost: 2, effect: { strikeSlashes: 1 } },
      { id: 'ember', name: 'Ember Flare', cost: 2, chapter: 2, effect: { spell: 'ember' } },
      { id: 'heavy_hand', name: 'Heavy Hand', cost: 2, chapter: 2, effect: { fightPower: 0.25 } },
      { id: 'comet', name: 'Comet', cost: 3, chapter: 2, effect: { spell: 'comet' } },
      // Chapter 3: a fifth slash, and a blow that splits things.
      { id: 'follow_through', name: 'Follow Through', cost: 2, chapter: 3, effect: { strikeSlashes: 1 } },
      { id: 'sunder', name: 'Sunder', cost: 3, chapter: 3, effect: { spell: 'sunder' } },
      // Chapter 4: the hero's own hand, at last, and fire for everyone.
      { id: 'heros_hand', name: "Hero's Hand", cost: 3, chapter: 4, effect: { fightPower: 0.3 } },
      { id: 'sunburst', name: 'Sunburst', cost: 3, chapter: 4, effect: { spell: 'sunburst' } },
      // Chapter 5: a salt-cured edge, and slashes with the whole sea behind them.
      { id: 'salt_edge', name: 'Honed Edge', cost: 3, chapter: 5, effect: { fightPower: 0.3 } },
      { id: 'wave_break', name: 'Crosscut', cost: 3, chapter: 5, effect: { strikeSlashes: 1 } },
      // Chapter 5, the second half: a steadier eye, a blow that splits a mast,
      // a firmer grip, and the stroke the whole branch has been for.
      { id: 'steady_aim', name: 'Steady Aim', cost: 2, chapter: 5, effect: { strikeTolerance: 0.3 } },
      { id: 'cleave', name: 'Cleave', cost: 3, chapter: 5, effect: { spell: 'cleave' } },
      { id: 'strong_grip', name: 'Strong Grip', cost: 3, chapter: 5, effect: { fightPower: 0.2 } },
      { id: 'masterstroke', name: 'Masterstroke', cost: 6, chapter: 5, effect: { fightPower: 0.35, strikeTolerance: 0.2 } },
    ],
  },
  {
    name: 'SPIRIT',
    icon: 'spells',
    color: '#b07cff',
    skills: [
      { id: 'focus', name: 'Focus', cost: 1, effect: { grazeSp: 0.25 } },
      { id: 'lull', name: 'Lull', cost: 1, effect: { spell: 'lull' } },
      { id: 'wide_graze', name: 'Wide Graze', cost: 2, effect: { grazeRadius: 4 } },
      { id: 'starfall', name: 'Starfall', cost: 2, effect: { spell: 'starfall' } },
      { id: 'kindling', name: 'Kindling', cost: 1, chapter: 2, effect: { spStart: 25 } },
      { id: 'thrift', name: 'Thrift', cost: 2, chapter: 2, effect: { spellDiscount: 0.2 } },
      { id: 'mending_light', name: 'Mending Light', cost: 2, chapter: 2, effect: { spell: 'mend', healBoost: 0.5 } },
      // Chapter 3: breath for the long dark, and a balm for the whole party.
      { id: 'deep_breath', name: 'Deep Breath', cost: 2, chapter: 3, effect: { spStart: 15, grazeSp: 0.25 } },
      { id: 'balm', name: 'Balm', cost: 3, chapter: 3, effect: { spell: 'balm' } },
      // Chapter 4: SP that spills over, and a healing that puts someone right.
      { id: 'overflow', name: 'Overflow', cost: 2, chapter: 4, effect: { grazeSp: 0.5 } },
      { id: 'renew', name: 'Renew', cost: 3, chapter: 4, effect: { spell: 'renew' } },
      // Chapter 5: breath from open water, and a lighter touch with spells.
      { id: 'open_water', name: 'Clear Head', cost: 2, chapter: 5, effect: { spStart: 20, grazeSp: 0.5 } },
      { id: 'slack_tide', name: 'Frugal', cost: 2, chapter: 5, effect: { spellDiscount: 0.15 } },
      // Chapter 5, the second half: healing that goes further, a big healing for
      // everyone, and a well that doesn't run dry.
      { id: 'second_wind', name: 'Second Wind', cost: 2, chapter: 5, effect: { healBoost: 0.3 } },
      { id: 'restore', name: 'Restore', cost: 3, chapter: 5, effect: { spell: 'restore' } },
      { id: 'wellspring', name: 'Wellspring', cost: 5, chapter: 5, effect: { spStart: 20, grazeSp: 0.5 } },
    ],
  },
  {
    name: 'RESOLVE',
    icon: 'defend',
    color: '#4fe3d0',
    skills: [
      { id: 'tough', name: 'Thick Skin', cost: 1, effect: { damageReduction: 1 } },
      { id: 'steady_soul', name: 'Steady Shadow', cost: 1, effect: { iframes: 0.4 } },
      { id: 'guard_up', name: 'Guard Up', cost: 1, effect: { defendHeal: 8 } },
      { id: 'last_stand', name: 'Last Stand', cost: 2, effect: { lastStand: true } },
      { id: 'bright_ward', name: 'Bright Ward', cost: 2, chapter: 2, effect: { spell: 'ward' } },
      { id: 'warm_heart', name: 'Warm Heart', cost: 1, chapter: 2, effect: { itemBoost: 0.3 } },
      { id: 'iron_will', name: 'Iron Will', cost: 2, chapter: 2, effect: { damageReduction: 1 } },
      // Chapter 3: digging in.
      { id: 'set_jaw', name: 'Set Jaw', cost: 2, chapter: 3, effect: { defendHeal: 10, damageReduction: 1 } },
      { id: 'stubborn', name: 'Stubborn', cost: 2, chapter: 3, effect: { iframes: 0.3 } },
      // Chapter 4: a shell that lasts, and skin that's seen everything.
      { id: 'aegis', name: 'Aegis', cost: 3, chapter: 4, effect: { spell: 'aegis' } },
      { id: 'unbroken', name: 'Unbroken', cost: 3, chapter: 4, effect: { damageReduction: 2 } },
      // Chapter 5: oilskin, and sea legs.
      { id: 'oilskin_skin', name: 'Hard Hide', cost: 3, chapter: 5, effect: { damageReduction: 1 } },
      { id: 'sea_legs', name: 'Steady Feet', cost: 2, chapter: 5, effect: { iframes: 0.3 } },
      // Chapter 5, the second half: getting your breath back, a shell that holds
      // a long time, and standing like a wall.
      { id: 'catch_breath', name: 'Catch Breath', cost: 2, chapter: 5, effect: { defendHeal: 15 } },
      { id: 'bastion', name: 'Bastion', cost: 3, chapter: 5, effect: { spell: 'bastion' } },
      { id: 'immovable', name: 'Immovable', cost: 6, chapter: 5, effect: { damageReduction: 2, iframes: 0.2 } },
    ],
  },
  {
    // Getting around: running, jumping higher, landing lightly.
    name: 'STRIDE',
    icon: 'run',
    color: '#5fc27a',
    skills: [
      { id: 'sprinter', name: 'Sprinter', cost: 1, effect: { runSpeed: 0.25 } },
      { id: 'acrobat', name: 'Acrobat', cost: 2, effect: { jumpHeight: 12 } },
      { id: 'sure_foot', name: 'Sure Foot', cost: 2, effect: { softLanding: true } },
      { id: 'strong_arms', name: 'Strong Arms', cost: 1, chapter: 2, effect: { swingPower: 0.5 } },
      { id: 'mountain_legs', name: 'Mountain Legs', cost: 1, chapter: 2, effect: { runSpeed: 0.25 } },
      { id: 'lucky_pockets', name: 'Lucky Pockets', cost: 2, chapter: 2, effect: { goldBonus: 0.25 } },
      // Chapter 3: the long walk to Lasthome.
      { id: 'light_step', name: 'Light Step', cost: 1, chapter: 3, effect: { runSpeed: 0.2 } },
      { id: 'pathfinder', name: 'Pathfinder', cost: 2, chapter: 3, effect: { goldBonus: 0.15, bargain: 0.05 } },
      // Chapter 4: a traveller now, with a packed lunch.
      { id: 'wayfarer', name: 'Wayfarer', cost: 2, chapter: 4, effect: { runSpeed: 0.25, swingPower: 0.5 } },
      { id: 'packed_lunch', name: 'Packed Lunch', cost: 2, chapter: 4, effect: { itemBoost: 0.3 } },
      // Chapter 5: quick over wet planks, and a biscuit in the pocket.
      { id: 'swift_tide', name: 'Quickstep', cost: 1, chapter: 5, effect: { runSpeed: 0.2 } },
      { id: 'ships_biscuit', name: 'Second Helping', cost: 2, chapter: 5, effect: { itemBoost: 0.3 } },
      // Chapter 5, the second half: hands for the ropes, and an old traveller's ways.
      { id: 'rope_hands', name: 'Rope Hands', cost: 1, chapter: 5, effect: { swingPower: 0.5 } },
      { id: 'old_hand', name: 'Old Hand', cost: 4, chapter: 5, effect: { itemBoost: 0.4, runSpeed: 0.15 } },
    ],
  },
  {
    // Chapter 2: the gentle way. Talking enemies down, and getting on with people.
    name: 'GRACE',
    icon: 'talk',
    color: '#ffd25e',
    chapter: 2,
    skills: [
      { id: 'kind_word', name: 'Kind Word', cost: 1, chapter: 2, effect: { mercyBoost: 0.25 } },
      { id: 'hush', name: 'Hush', cost: 2, chapter: 2, effect: { spell: 'hush' } },
      { id: 'gentle_hands', name: 'Gentle Hands', cost: 2, chapter: 2, effect: { pacifyDiscount: 0.5 } },
      { id: 'haggler', name: 'Haggler', cost: 2, chapter: 2, effect: { bargain: 0.15 } },
      // Chapter 3: patience, learned the hard way.
      { id: 'soft_voice', name: 'Soft Voice', cost: 2, chapter: 3, effect: { mercyBoost: 0.25 } },
      { id: 'patience', name: 'Patience', cost: 2, chapter: 3, effect: { pacifyDiscount: 0.25, mercyBoost: 0.1 } },
      // Chapter 4: a song for a whole room, and an open hand.
      { id: 'serenade', name: 'Serenade', cost: 3, chapter: 4, effect: { spell: 'serenade' } },
      { id: 'open_hand', name: 'Open Hand', cost: 2, chapter: 4, effect: { bargain: 0.15, mercyBoost: 0.15 } },
      // Chapter 5: still waters, and fair dealing.
      { id: 'calm_waters', name: 'Even Temper', cost: 2, chapter: 5, effect: { mercyBoost: 0.3 } },
      { id: 'fair_trade', name: 'Fair Trade', cost: 2, chapter: 5, effect: { bargain: 0.1, mercyBoost: 0.1 } },
      // Chapter 5, the second half: a calm over the whole room, and making peace.
      { id: 'soothe', name: 'Soothe', cost: 3, chapter: 5, effect: { spell: 'soothe' } },
      { id: 'peacemaker', name: 'Peacemaker', cost: 5, chapter: 5, effect: { mercyBoost: 0.4 } },
    ],
  },
  {
    // Chapter 2: spells for their own sake. Every attack spell hits harder
    // than your best FIGHT (see `power` in src/data/spells.js).
    name: 'ARCANA',
    icon: 'spells',
    color: '#5fb8ff',
    chapter: 2,
    skills: [
      { id: 'spark', name: 'Spark', cost: 1, chapter: 2, effect: { spell: 'spark' } },
      { id: 'arcane_focus', name: 'Arcane Focus', cost: 2, chapter: 2, effect: { spellPower: 0.2 } },
      { id: 'siphon', name: 'Siphon', cost: 2, chapter: 2, effect: { spell: 'siphon' } },
      { id: 'chain_bolt', name: 'Chain Bolt', cost: 2, chapter: 2, effect: { spell: 'chain' } },
      // Chapter 3: a lance of light, and a steadier hand on it.
      { id: 'lance', name: 'Light Lance', cost: 2, chapter: 3, effect: { spell: 'lance' } },
      { id: 'second_focus', name: 'Second Focus', cost: 3, chapter: 3, effect: { spellPower: 0.2 } },
      // Chapter 4: spells that cost less, and the storm itself.
      { id: 'spellthrift', name: 'Spellthrift', cost: 2, chapter: 4, effect: { spellDiscount: 0.15 } },
      { id: 'tempest', name: 'Tempest', cost: 4, chapter: 4, effect: { spell: 'tempest' } },
      // Chapter 5: the spring tide, and the neap.
      { id: 'spring_tide', name: 'Deep Focus', cost: 3, chapter: 5, effect: { spellPower: 0.25 } },
      { id: 'neap_tide', name: 'Quiet Focus', cost: 2, chapter: 5, effect: { spellPower: 0.15 } },
      // Chapter 5, the second half: stars on everyone, and mastery. (They sit
      // before Nova, so they don't wait for the end of the chapter.)
      { id: 'starstorm', name: 'Starstorm', cost: 4, chapter: 5, effect: { spell: 'starstorm' } },
      { id: 'mastery', name: 'Mastery', cost: 6, chapter: 5, effect: { spellPower: 0.3 } },
      // Nova can't be bought: it wakes by itself at the end of chapter 5, when
      // the water comes up the stair (`scripted`: a cutscene's { do: 'learn',
      // skill: 'nova' } step gives it, see scenePlayer.js). Everything going
      // white is a late-game power.
      { id: 'nova', name: 'Nova', cost: 10, chapter: 5, scripted: true, requires: 'my_turn', effect: { spell: 'nova' } },
    ],
  },
  {
    // Chapter 5: the sea as a weapon and a shield. Each spell needs the one above.
    name: 'TIDE',
    icon: 'spells',
    color: '#3fb8c8',
    chapter: 5,
    requires: 'ways_of_the_sea',
    skills: [
      { id: 'tide_brine', name: 'Scald', cost: 2, chapter: 5, effect: { spell: 'brine' } },
      { id: 'tide_undertow', name: 'Shove', cost: 3, chapter: 5, effect: { spell: 'undertow' } },
      { id: 'tide_low_water', name: 'Lay Bare', cost: 3, chapter: 5, effect: { spell: 'low_water' } },
      { id: 'tide_ebb_flow', name: 'Turnabout', cost: 3, chapter: 5, effect: { spell: 'ebb_flow' } },
      // The second half: a shove and a burn in one, and the last word.
      { id: 'tide_undercut', name: 'Undercut', cost: 3, chapter: 5, effect: { spell: 'undercut' } },
      { id: 'tide_overwhelm', name: 'Overwhelm', cost: 6, chapter: 5, effect: { spell: 'overwhelm' } },
    ],
  },
];

// Party members' own branches (src/characters/party.js), keyed by member id:
// a page of the tree of their own, like the hero's (switch with SPACE).
// Each branch names its `member`, whose points pay for it, and can have a
// `chapter` like the hero's. Their effects work like the hero's, plus:
//   allyCalm     extra MERCY from an ally's calming move (Ves's FLURRY)
//   allySp       extra SP from an ally's move (Ves's ZEPHYR)
//   allyHeal     extra HP from an ally's healing move (Ves's ZEPHYR, AURORA)
//   allyStrike   extra damage from an ally's attack spells (SLEET and the rest)
//   shelterDef   extra taken off each hit while their SHELTER is up
//   gust         seconds their SHELTER also slows the next attack's bullets
//   command      a new SPELL for them: a key of their `learnable` commands
//   allyFight    their FIGHT hits this much harder (0.2 = +20%)
//   sneak        their sneak attack, after HIDE, hits this much harder
//   shorten      their HOLLER cuts the next attack short by this much more
//                (and Ves's UPDRAFT and THUNDERCLAP)
// A member's ally effects only count for that member: Bramble's CHOP skills
// don't sharpen Ves's sleet. Effects the hero has too (goldBonus, say) count
// for everyone, wherever they're learned.
//
// Ves gets her mother's umbrella back at the Hero's Gate (chapter 3), and
// her whole strength with it: that's when her third-chapter stars open, and
// a fourth branch, TEMPEST, for the weather itself.
export const MEMBER_SKILL_BRANCHES = {
  vesper: [
    {
      name: 'UMBRELLA',
      icon: 'talk',
      color: '#9a7ad8',
      member: 'vesper',
      skills: [
        { id: 'ves_drift', name: 'Snowdrift', cost: 1, effect: { allyCalm: 5 } },
        { id: 'ves_hail', name: 'Hailstones', cost: 1, effect: { allyStrike: 4 } },
        { id: 'ves_warm', name: 'Warm Front', cost: 2, effect: { allyHeal: 6, allySp: 5 } },
        { id: 'ves_brim', name: 'Wide Brim', cost: 2, effect: { damageReduction: 1 } },
        // Chapter 3: her mother's umbrella, back in her hands.
        { id: 'ves_mothers', name: "Mother's Umbrella", cost: 2, chapter: 3, effect: { allyStrike: 6, allyHeal: 6, allyCalm: 4 } },
        { id: 'ves_ribs', name: 'Steel Ribs', cost: 2, chapter: 3, effect: { allyFight: 0.2 } },
        { id: 'ves_oilcloth', name: 'Oilcloth', cost: 2, chapter: 3, effect: { allyCalm: 6, allyHeal: 4 } },
        { id: 'ves_ferrule', name: 'Brass Ferrule', cost: 3, chapter: 3, effect: { allyStrike: 5, allyFight: 0.15 } },
        { id: 'ves_tidy_fold', name: 'Tidy Fold', cost: 2, chapter: 3, effect: { allySp: 6, allyCalm: 3 } },
        // Chapter 4: the whole canopy, and a lining of silver.
        { id: 'ves_silver', name: 'Silver Lining', cost: 2, chapter: 4, effect: { allyHeal: 10, allySp: 8 } },
        { id: 'ves_folded_away', name: 'Folded Away', cost: 2, chapter: 4, effect: { allyHeal: 8 } },
        { id: 'ves_dry_humour', name: 'Dry Humour', cost: 3, chapter: 4, effect: { allyFight: 0.2 } },
        { id: 'ves_full_canopy', name: 'Full Canopy', cost: 3, chapter: 4, effect: { damageReduction: 1, shelterDef: 1 } },
        // Chapter 5: sailcloth, tarred seams.
        { id: 'ves_tarred_seams', name: 'Patched Seams', cost: 2, chapter: 5, effect: { allyStrike: 8, allyCalm: 4 } },
        { id: 'ves_sailcloth', name: 'Fresh Linen', cost: 2, chapter: 5, effect: { allyHeal: 10, allySp: 8 } },
        // Chapter 5, the second half: a sturdier handle, a brass tip, holding fast,
        // and the umbrella as an old friend.
        { id: 'ves_sturdy_handle', name: 'Sturdy Handle', cost: 2, chapter: 5, effect: { shelterDef: 1, allyCalm: 4 } },
        { id: 'ves_brass_tip', name: 'Brass Tip', cost: 2, chapter: 5, effect: { allyStrike: 8 } },
        { id: 'ves_hold_fast', name: 'Hold Fast', cost: 3, chapter: 5, effect: { command: 'hold_fast' } },
        { id: 'ves_old_friend', name: 'Old Friend', cost: 6, chapter: 5, effect: { allyStrike: 12, allyHeal: 12, allyCalm: 6 } },
      ],
    },
    {
      // Her umbrella as a weapon: the wind and the weather, turned on enemies.
      name: 'GALE',
      icon: 'fight',
      color: '#7fd8f0',
      member: 'vesper',
      chapter: 2,
      skills: [
        { id: 'ves_squall', name: 'Squall', cost: 1, chapter: 2, effect: { allyStrike: 5 } },
        { id: 'ves_downdraft', name: 'Downdraft', cost: 2, chapter: 2, effect: { command: 'downdraft' } },
        { id: 'ves_tailwind', name: 'Tailwind', cost: 2, chapter: 2, effect: { gust: 2 } },
        { id: 'ves_whiteout', name: 'Whiteout', cost: 3, chapter: 2, effect: { command: 'whiteout' } },
        // Chapter 3: winds that knock attacks back, slow them, and one crack like thunder.
        { id: 'ves_updraft', name: 'Updraft', cost: 2, chapter: 3, effect: { command: 'updraft' } },
        { id: 'ves_headwind', name: 'Headwind', cost: 2, chapter: 3, effect: { command: 'headwind' } },
        { id: 'ves_thunderclap', name: 'Thunderclap', cost: 3, chapter: 3, effect: { command: 'thunderclap' } },
        { id: 'ves_gale_warning', name: 'Gale Warning', cost: 2, chapter: 3, effect: { gust: 1 } },
        { id: 'ves_sidewind', name: 'Sidewind', cost: 2, chapter: 3, effect: { allyStrike: 6 } },
        { id: 'ves_rolling_thunder', name: 'Rolling Thunder', cost: 3, chapter: 3, effect: { allyStrike: 5, gust: 1 } },
        // Chapter 4: a crosswind behind every spell, and the cyclone.
        { id: 'ves_crosswind', name: 'Crosswind', cost: 2, chapter: 4, effect: { allyStrike: 10 } },
        { id: 'ves_trade_winds', name: 'Trade Winds', cost: 2, chapter: 4, effect: { allyStrike: 8 } },
        { id: 'ves_gale_force', name: 'Gale Force', cost: 3, chapter: 4, effect: { allyStrike: 8, gust: 1 } },
        { id: 'ves_cyclone', name: 'Cyclone', cost: 4, chapter: 4, effect: { command: 'cyclone' } },
        // Chapter 5: sea gales, and a line of squalls.
        { id: 'ves_sea_gale', name: 'Cutting Wind', cost: 2, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'ves_squall_line', name: 'Gust Front', cost: 3, chapter: 5, effect: { allyStrike: 12 } },
        // Chapter 5, the second half: sharper gusts, a wind that cuts one enemy
        // down, and the hurricane. (Her wind, not her FIGHT: the hero hits hardest.)
        { id: 'ves_sharp_gusts', name: 'Sharp Gusts', cost: 2, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'ves_windshear', name: 'Windshear', cost: 3, chapter: 5, effect: { command: 'windshear' } },
        { id: 'ves_hurricane', name: 'Hurricane', cost: 7, chapter: 5, effect: { command: 'hurricane' } },
      ],
    },
    {
      // Looking after you: warmth, cover, and the northern lights.
      name: 'HEARTH',
      icon: 'defend',
      color: '#ff9a6a',
      member: 'vesper',
      chapter: 2,
      skills: [
        { id: 'ves_cocoa', name: 'Cocoa Break', cost: 1, chapter: 2, effect: { allyHeal: 6 } },
        { id: 'ves_canopy', name: 'Double Canopy', cost: 2, chapter: 2, effect: { shelterDef: 1 } },
        { id: 'ves_aurora', name: 'Aurora', cost: 2, chapter: 2, effect: { command: 'aurora' } },
        { id: 'ves_steadfast', name: 'Steadfast', cost: 2, chapter: 2, effect: { allySp: 10 } },
        // Chapter 3: warm rain that keeps falling, and bracing for a hit.
        { id: 'ves_rain_dance', name: 'Rain Dance', cost: 2, chapter: 3, effect: { command: 'raindance' } },
        { id: 'ves_brace', name: 'Brace', cost: 2, chapter: 3, effect: { command: 'brace' } },
        { id: 'ves_hot_water', name: 'Hot-Water Bottle', cost: 1, chapter: 3, effect: { allyHeal: 8 } },
        { id: 'ves_wool_socks', name: 'Wool Socks', cost: 2, chapter: 3, effect: { allyHeal: 6 } },
        { id: 'ves_tea_cosy', name: 'Tea Cosy', cost: 2, chapter: 3, effect: { shelterDef: 1 } },
        { id: 'ves_spare_scarf', name: 'Spare Scarf', cost: 3, chapter: 3, effect: { allySp: 8, allyHeal: 4 } },
        // Chapter 4: the kettle's always on, and daybreak for everyone.
        { id: 'ves_kettle', name: 'Kettle On', cost: 2, chapter: 4, effect: { allyHeal: 12 } },
        { id: 'ves_banked_embers', name: 'Banked Embers', cost: 2, chapter: 4, effect: { allySp: 10 } },
        { id: 'ves_hearthstone', name: 'Hearthstone', cost: 3, chapter: 4, effect: { allyHeal: 10, shelterDef: 1 } },
        { id: 'ves_daybreak', name: 'Daybreak', cost: 3, chapter: 4, effect: { command: 'daybreak' } },
        // Chapter 5: a flask of chowder, and the oil lamp in the window.
        { id: 'ves_chowder_flask', name: 'Hot Flask', cost: 2, chapter: 5, effect: { allyHeal: 14 } },
        { id: 'ves_oil_lamp', name: 'Night Light', cost: 2, chapter: 5, effect: { allySp: 10, shelterDef: 1 } },
        // Chapter 5, the second half: warm hands, a spare blanket, everyone round
        // the fire, and home.
        { id: 'ves_warm_hands', name: 'Warm Hands', cost: 2, chapter: 5, effect: { allyHeal: 12 } },
        { id: 'ves_spare_blanket', name: 'Spare Blanket', cost: 2, chapter: 5, effect: { shelterDef: 1, allyHeal: 6 } },
        { id: 'ves_fireside', name: 'Fireside', cost: 3, chapter: 5, effect: { command: 'fireside' } },
        { id: 'ves_home_fires', name: 'Home Fires', cost: 6, chapter: 5, effect: { allyHeal: 16, allyCalm: 6, shelterDef: 1 } },
      ],
    },
    {
      // Chapter 3: the weather itself. With her mother's umbrella back she
      // doesn't just catch the wind any more; she calls it.
      name: 'TEMPEST',
      icon: 'spells',
      color: '#5fa8ff',
      member: 'vesper',
      chapter: 3,
      skills: [
        { id: 'ves_after_rain', name: 'After the Rain', cost: 1, chapter: 3, effect: { allySp: 6, allyCalm: 4 } },
        { id: 'ves_parasol_spin', name: 'Parasol Spin', cost: 2, chapter: 3, effect: { command: 'spin' } },
        { id: 'ves_hailstorm', name: 'Hailstorm', cost: 3, chapter: 3, effect: { command: 'hailstorm' } },
        { id: 'ves_eye', name: 'Eye of the Storm', cost: 2, chapter: 3, effect: { gust: 1, shelterDef: 1 } },
        { id: 'ves_petrichor', name: 'Petrichor', cost: 2, chapter: 3, effect: { allySp: 6, allyCalm: 4 } },
        { id: 'ves_dew_point', name: 'Dew Point', cost: 1, chapter: 3, effect: { allyStrike: 4 } },
        { id: 'ves_black_cloud', name: 'Black Cloud', cost: 3, chapter: 3, effect: { allyStrike: 7, gust: 1 } },
        // Chapter 4: the umbrella as a lightning rod, and the monsoon.
        { id: 'ves_lightning_rod', name: 'Lightning Rod', cost: 2, chapter: 4, effect: { allyStrike: 6, gust: 1 } },
        { id: 'ves_static', name: 'Static', cost: 2, chapter: 4, effect: { allyStrike: 8 } },
        { id: 'ves_rainbow', name: 'Rainbow', cost: 3, chapter: 4, effect: { allyHeal: 8, allySp: 8, allyCalm: 5 } },
        { id: 'ves_monsoon', name: 'Monsoon', cost: 4, chapter: 4, effect: { command: 'monsoon' } },
        // Chapter 5: ball lightning, and a fog off the sea.
        { id: 'ves_ball_lightning', name: 'Ball Lightning', cost: 3, chapter: 5, effect: { allyStrike: 10, gust: 1 } },
        { id: 'ves_sea_fog', name: 'Low Cloud', cost: 2, chapter: 5, effect: { allyCalm: 6, allySp: 8 } },
        // Chapter 5, the second half: charged air, lightning across the sky, and
        // the biggest storm cloud there is.
        { id: 'ves_charged_air', name: 'Charged Air', cost: 2, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'ves_sheet_lightning', name: 'Sheet Lightning', cost: 3, chapter: 5, effect: { command: 'sheet_lightning' } },
        { id: 'ves_supercell', name: 'Supercell', cost: 6, chapter: 5, effect: { command: 'supercell' } },
      ],
    },
    {
      // Chapter 5: the sea wind, and the rain that comes with it.
      name: 'BREEZE',
      icon: 'run',
      color: '#8fe0d0',
      member: 'vesper',
      chapter: 5,
      requires: 'ways_of_the_sea',
      skills: [
        { id: 'ves_sea_breeze', name: 'Cool Change', cost: 2, chapter: 5, effect: { command: 'sea_breeze' } },
        { id: 'ves_sail', name: 'Billow', cost: 2, chapter: 5, effect: { command: 'sail' } },
        { id: 'ves_salt_spray', name: 'Needle Rain', cost: 2, chapter: 5, effect: { allyStrike: 6, allyCalm: 6 } },
        { id: 'ves_downpour', name: 'Downpour', cost: 3, chapter: 5, effect: { command: 'downpour' } },
        { id: 'ves_rip_current', name: 'Whirl', cost: 3, chapter: 5, effect: { command: 'rip_current' } },
        { id: 'ves_storm_umbrella', name: 'Storm Umbrella', cost: 3, chapter: 5, effect: { shelterDef: 2, gust: 1 } },
        // The second half: a fair wind, light rain, still air, and clear skies.
        { id: 'ves_fair_wind', name: 'Fair Wind', cost: 2, chapter: 5, effect: { allyStrike: 8, allyHeal: 8 } },
        { id: 'ves_light_rain', name: 'Light Rain', cost: 2, chapter: 5, effect: { allyCalm: 6, allyHeal: 8 } },
        { id: 'ves_still_air', name: 'Still Air', cost: 3, chapter: 5, effect: { command: 'still_air' } },
        { id: 'ves_clear_skies', name: 'Clear Skies', cost: 7, chapter: 5, effect: { command: 'clear_skies' } },
      ],
    },
  ],
  // Bramble joins in chapter 3, so all his branches are chapter 3's. He goes
  // home from Lasthome and isn't back till later, so his chapter 4 stars are
  // waiting for him when he is (a page only shows while they're in the party).
  bramble: [
    {
      // His hatchet: chopping things, and things falling over.
      name: 'HATCHET',
      icon: 'fight',
      color: '#e0662c',
      member: 'bramble',
      chapter: 3,
      skills: [
        { id: 'bram_edge', name: 'Sharp Edge', cost: 1, chapter: 3, effect: { allyStrike: 5 } },
        { id: 'bram_swing', name: 'Big Swing', cost: 2, chapter: 3, effect: { allyFight: 0.2 } },
        { id: 'bram_timber', name: 'Timber!', cost: 2, chapter: 3, effect: { command: 'timber' } },
        { id: 'bram_woodsman', name: 'Woodsman', cost: 3, chapter: 3, effect: { allyStrike: 8, allyFight: 0.15 } },
        // Chapter 4: he's grown into the hatchet.
        { id: 'bram_two_hands', name: 'Two Hands', cost: 2, chapter: 4, effect: { allyFight: 0.25 } },
        { id: 'bram_fell', name: 'Fell', cost: 3, chapter: 4, effect: { command: 'fell' } },
        // Chapter 5: a boathook, and a really big swing.
        { id: 'bram_boathook', name: 'Long Reach', cost: 2, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'bram_wide_swing', name: 'Wide Swing', cost: 3, chapter: 5, effect: { allyFight: 0.25 } },
        // Chapter 5, the second half: a keen edge, a notched handle, chips flying,
        // a woodpile, and the big one.
        { id: 'bram_keen_edge', name: 'Keen Edge', cost: 2, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'bram_notched_handle', name: 'Notched Handle', cost: 3, chapter: 5, effect: { allyStrike: 10 } },
        { id: 'bram_splinters', name: 'Splinters', cost: 3, chapter: 5, effect: { command: 'splinters' } },
        { id: 'bram_woodpile', name: 'Woodpile', cost: 3, chapter: 5, effect: { allyStrike: 12 } },
        { id: 'bram_big_one', name: 'The Big One', cost: 7, chapter: 5, effect: { command: 'big_one' } },
      ],
    },
    {
      // His voice, which is the loudest thing in the forest.
      name: 'LUNGS',
      icon: 'talk',
      color: '#ffd25e',
      member: 'bramble',
      chapter: 3,
      skills: [
        { id: 'bram_loud', name: 'Big Lungs', cost: 1, chapter: 3, effect: { allyCalm: 4 } },
        { id: 'bram_flinch', name: 'Make Them Jump', cost: 2, chapter: 3, effect: { shorten: 0.15 } },
        { id: 'bram_war_cry', name: 'War Cry', cost: 2, chapter: 3, effect: { command: 'war_cry' } },
        { id: 'bram_echo', name: 'Echo', cost: 2, chapter: 3, effect: { allySp: 8, allyCalm: 3 } },
        // Chapter 4: louder still, and a whistle you can hear across a valley.
        { id: 'bram_bellow', name: 'Bellow', cost: 2, chapter: 4, effect: { shorten: 0.1, allyCalm: 5 } },
        { id: 'bram_whistle', name: 'Two-Finger Whistle', cost: 2, chapter: 4, effect: { command: 'whistle' } },
        // Chapter 5: a foghorn voice, and a sea shanty (badly).
        { id: 'bram_foghorn', name: 'Big Voice', cost: 2, chapter: 5, effect: { shorten: 0.1, allyCalm: 6 } },
        { id: 'bram_shanty', name: 'Marching Song', cost: 2, chapter: 5, effect: { allySp: 10, allyCalm: 4 } },
        // Chapter 5, the second half: loud and proud, good lungs, three cheers, a
        // voice that never runs out, and everybody singing.
        { id: 'bram_loud_proud', name: 'Loud and Proud', cost: 2, chapter: 5, effect: { allyCalm: 6, allySp: 6 } },
        { id: 'bram_good_lungs', name: 'Good Lungs', cost: 3, chapter: 5, effect: { allySp: 8, allyCalm: 4 } },
        { id: 'bram_cheer', name: 'Three Cheers', cost: 3, chapter: 5, effect: { command: 'cheer' } },
        { id: 'bram_bottomless', name: 'Bottomless', cost: 3, chapter: 5, effect: { allySp: 6, allyCalm: 6 } },
        { id: 'bram_sing_along', name: 'Sing-Along', cost: 7, chapter: 5, effect: { command: 'sing_along' } },
      ],
    },
    {
      // Being ten: small, sneaky, and with something in every pocket.
      name: 'SCAMP',
      icon: 'run',
      color: '#5fc27a',
      member: 'bramble',
      chapter: 3,
      skills: [
        { id: 'bram_pockets', name: 'Deep Pockets', cost: 1, chapter: 3, effect: { command: 'biscuit' } },
        { id: 'bram_sneak', name: 'Sneaky', cost: 1, chapter: 3, effect: { sneak: 0.5 } },
        { id: 'bram_slingshot', name: 'Slingshot', cost: 2, chapter: 3, effect: { command: 'slingshot' } },
        { id: 'bram_crumbs', name: 'Crumbs', cost: 2, chapter: 3, effect: { allyHeal: 12 } },
        { id: 'bram_scavenger', name: 'Scavenger', cost: 2, chapter: 3, effect: { goldBonus: 0.15 } },
        // Chapter 4: more pockets, more trouble.
        { id: 'bram_marbles', name: 'Marbles', cost: 2, chapter: 4, effect: { command: 'marbles' } },
        { id: 'bram_lucky_stone', name: 'Lucky Stone', cost: 1, chapter: 4, effect: { sneak: 0.5, goldBonus: 0.1 } },
        // Chapter 5: a crab in the pocket, and a lot of shells.
        { id: 'bram_pocket_crab', name: 'Pocket Snack', cost: 2, chapter: 5, effect: { allyHeal: 14 } },
        { id: 'bram_shell_collector', name: 'Magpie', cost: 2, chapter: 5, effect: { sneak: 0.5, goldBonus: 0.1 } },
        // Chapter 5, the second half: quiet feet, a stash of snacks, hand-me-downs,
        // conkers, and not being there at all.
        { id: 'bram_quiet_feet', name: 'Quiet Feet', cost: 2, chapter: 5, effect: { sneak: 0.25 } },
        { id: 'bram_snack_stash', name: 'Snack Stash', cost: 2, chapter: 5, effect: { allyHeal: 12 } },
        { id: 'bram_hand_me_downs', name: 'Hand-Me-Downs', cost: 2, chapter: 5, effect: { allyHeal: 10, allyStrike: 4 } },
        { id: 'bram_conkers', name: 'Conkers', cost: 3, chapter: 5, effect: { command: 'conkers' } },
        { id: 'bram_not_there', name: 'Not There', cost: 7, chapter: 5, effect: { sneak: 0.5, allyStrike: 8 } },
      ],
    },
    {
      // Chapter 5: what the sea taught him. It isn't shown until the end of the
      // chapter (`requires`: a scene that must have played, see skillPages).
      name: 'CHILL',
      icon: 'defend',
      color: '#6fc8f0',
      member: 'bramble',
      chapter: 5,
      requires: 'my_turn',
      skills: [
        { id: 'bram_deep_breath', name: 'Count to Ten', cost: 2, chapter: 5, effect: { command: 'deep_breath' } },
        { id: 'bram_cannonball', name: 'Cannonball', cost: 3, chapter: 5, effect: { command: 'cannonball' } },
        { id: 'bram_lifeline', name: 'Hand Up', cost: 2, chapter: 5, effect: { command: 'lifeline' } },
        { id: 'bram_chillin', name: "Chillin'", cost: 2, chapter: 5, effect: { fearless: true, allyCalm: 4 } },
        { id: 'bram_wade_in', name: 'Stand Firm', cost: 3, chapter: 5, effect: { command: 'wade_in' } },
        // The second half: a brave face, feet on the bottom, keeping calm, and
        // "I've got you."
        { id: 'bram_brave_face', name: 'Brave Face', cost: 2, chapter: 5, effect: { allyCalm: 6, allyHeal: 6 } },
        { id: 'bram_feet_down', name: 'Feet Down', cost: 2, chapter: 5, effect: { allyHeal: 10 } },
        { id: 'bram_keep_calm', name: 'Keep Calm', cost: 3, chapter: 5, effect: { allyCalm: 8, allyHeal: 8 } },
        { id: 'bram_got_you', name: "I've Got You", cost: 7, chapter: 5, effect: { command: 'got_you' } },
      ],
    },
  ],
};

// Every skill there is, the hero's and the members'.
export const ALL_SKILL_BRANCHES = [...SKILL_BRANCHES, ...Object.values(MEMBER_SKILL_BRANCHES).flat()];

// Branches as they stand in `chapter`: each with only the skills you can
// learn by then, and branches with none left out.
function grownBy(branches, chapter, seen = []) {
  return branches
    .filter((branch) => !branch.requires || seen.includes(branch.requires))
    // A skill can wait for a scene too (`requires`): Nova stays hidden till the
    // end of chapter 5, so the tree doesn't give it away.
    .map((branch) => ({ ...branch, skills: branch.skills.filter((skill) => (skill.chapter ?? 1) <= chapter && (!skill.requires || seen.includes(skill.requires))) }))
    .filter((branch) => branch.skills.length);
}

// A branch with `requires` (a scene id) only shows once that scene is in
// `seen` (WORLD_STATE.seenScenes): the hero's TIDE and Ves's BREEZE wait for
// Haddock's lesson 'ways_of_the_sea' (Gullrest); Bramble's CHILL for 'my_turn'.
// The tree as it stands in `chapter`, as pages: the hero's, then one for each
// of whoever's in the party (`members`, ids) who has branches. Each page is
// { member (null for the hero), branches }.
export function skillPages(chapter = 1, members = [], seen = []) {
  const pages = [{ member: null, branches: grownBy(SKILL_BRANCHES, chapter, seen) }];
  for (const id of members) {
    const branches = grownBy(MEMBER_SKILL_BRANCHES[id] ?? [], chapter, seen);
    if (branches.length) pages.push({ member: id, branches });
  }
  return pages;
}
