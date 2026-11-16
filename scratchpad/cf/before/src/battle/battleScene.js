import { UI_SCALE as S, UI_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { ALLY_SOUNDS, SPELL_SOUNDS } from '../audio/moveSounds.js';
import { SONGS } from '../data/music/index.js';

// In a cave, fights have their own song ("Glass Hollows", caveBattleTheme.js).
// On the mountain, once Ves is with you, they have another, with her motif in
// it (mountainBattleTheme.js). In the Pinefall, where the hero fights alone,
// it's "Bramble Rush" (pinefallBattleTheme.js), and the same under Hollin's
// well, in the Old Drains, where Bramble's still with you. In the Dead City
// (the Hollow Valley) Bramble's gone home and it's just you and Ves again,
// she on her crutch: "Still Here" (valleyBattleTheme.js), the city's rain
// with her motif limping back in. Enemies with their own `music`
// (bosses) keep it. Everywhere else, and before she joins, it's the usual
// battle song.
const MOUNTAIN_AREAS = new Set(['stair', 'vigil', 'rest']);
function battleSong(area) {
  if (area === 'cave' && SONGS.caveBattle) return 'caveBattle';
  if ((area === 'pinefall' || area === 'drains' || area === 'marsh') && SONGS.pinefallBattle) return 'pinefallBattle';
  if (area === 'valley' && SONGS.valleyBattle) return 'valleyBattle';
  // Sunnyside's fights are bright and silly (sunnyBattleTheme.js).
  if (area === 'sunnyside' && SONGS.sunnyBattle) return 'sunnyBattle';
  const together = partyIds().includes('vesper');
  return together && MOUNTAIN_AREAS.has(area) && SONGS.mountainBattle ? 'mountainBattle' : 'battle';
}
// Some areas swap an enemy's own song for one of their own: in the mines
// (the Diggings), the underground fights' "Scurry" becomes "Struck Quartz"
// (diggingsBattleTheme.js), gems ringing in the walls; on the Stillwater's lake
// it becomes "Black Ripples" (stillwaterBattleTheme.js), a harp rippling out
// of time over black water; in the Deep it becomes "Rain on the Roots"
// (deepBattleTheme.js), the Counting Days rain turned into a fight.
// Chapter 5's coast monsters ask for 'coastBattleStorm'. That is only a key
// now, not a song (the old storm mock it was named after was retired on 10
// November 2026; it's kept in notes/music-backup-2026-11-10/), so every coast
// area swaps it, and anywhere that doesn't falls back to "Cutlass Weather"
// (COAST_DEFAULT, below). The happy beach (Gullrest) has its own dark sea-shanty fight, "Shore Leave"
// (gullrestBattleTheme.js); Wrack Shore, Saltcombe and the Sunken Lanes have
// "Cutlass Weather" (pirateBattleTheme.js); and from the Wreck Yard on, where
// the storm is in full, it turns into "Dead Men's Weather"
// (drownedBattleTheme.js), the same sea gone grim. Anything there asking for
// Cutlass Weather by name gets the grim one too. (Old Gulper has his own song
// now, "Long in the Tooth", oldGulperBattleTheme.js.) Once the storm
// has lifted (`stormOver`, after the chapter) those fights go back to Cutlass
// Weather.
// The longest BILLOW (Ves's sail) can keep the party untouchable, in seconds.
const SAIL_CAP_SECONDS = 5;
// Under this much of its HP, a monster's [flavor: low] line shows (wornFlavor).
const LOW_FLAVOR = 0.3;
const COAST_FIGHT = { coastBattleStorm: 'pirateBattle' };
const STORM_FIGHT = { coastBattleStorm: 'drownedBattle', pirateBattle: 'drownedBattle' };
const AREA_SONGS = {
  diggings: { belowBattle: 'diggingsBattle' }, stillwater: { belowBattle: 'stillwaterBattle' }, deep: { belowBattle: 'deepBattle' },
  gullrest: { coastBattleStorm: 'gullrestBattle' },
  // The cliff cave (its own backdrop, coastBackdrops.js) has its own dark fight song,
  // "Echoes Back" (cliffCaveBattleTheme.js): the cave song's hook in E minor, the bats' echoes.
  cliff_cave: { coastBattleStorm: 'cliffCaveBattle' },
  // The Soundings' sea caves have theirs too, "No Bottom" (soundingsBattleTheme.js): the
  // Soundings' hook, low and heavy. Under the cliffs the storm makes no difference, so it
  // stays after the storm has lifted (only 'drownedBattle' turns back into Cutlass Weather).
  soundings: { ...STORM_FIGHT, coastBattleStorm: 'soundingsBattle' },
  wrack: COAST_FIGHT, saltcombe: COAST_FIGHT, lanes: COAST_FIGHT,
  wreck: STORM_FIGHT, merrow: STORM_FIGHT,
  isles: STORM_FIGHT, haddock_light: STORM_FIGHT, reach: STORM_FIGHT, lastlight: STORM_FIGHT,
  // The ghost ship (the brig Fair Return, area ghostship). No regular-fight song of its own: the storm one
  // song when one exists; until then the storm fight song (Dead Men's Weather) is its fight music.
  ghostship: STORM_FIGHT,
};
// What a song key means where no area swaps it (and no song has its name).
const COAST_DEFAULT = { coastBattleStorm: 'pirateBattle' };
function songFor(enemySong, area, stormOver = false) {
  let swap = AREA_SONGS[area]?.[enemySong];
  if (stormOver && swap === 'drownedBattle') swap = 'pirateBattle';
  if (swap && SONGS[swap]) return swap;
  return SONGS[enemySong] ? enemySong : COAST_DEFAULT[enemySong] ?? enemySong;
}
import { textFile, textSection, voiceOf } from '../engine/textLoader.js';
import { lineClips, sayClips, stopVoice, warmVoices } from '../audio/voiceClips.js';
import { drawText } from '../ui/text.js';
import { TextBox } from '../ui/textbox.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { MEMBERS, partyIds, memberSprites, memberMaxHp, memberHp, setMemberHp, memberGrowth, hurtState, isHurt, setHurt } from '../characters/party.js';
import { memberGearBonus, memberFightPower } from '../characters/equipment.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, giveItem, healLabel } from '../data/items.js';
import { MATERIALS, giveMaterial } from '../data/candles.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { battleSpells, battleCommands } from '../characters/notches.js';
import { gainExp, heroMaxHp, heroHp, setHeroHp, healHeroFully, memberCommands, skillBonus, memberSkillBonus, heroDefense, spellPotency, armorSpGain, spellSharpening } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { SPELLS, SPELL_WEAPON_CAP } from '../data/spells.js';
import { starfallPower, starForging } from '../data/fallenStar.js';
import { Soul, SOUL_RADIUS, GRAZE_RADIUS } from './soul.js';
import { SOUL_ABILITIES } from './soulAbilities.js';
import { createPattern } from './bullets.js';
import { StrikeBar, BASE_SLASH_COUNT, SLASH_DAMAGE, PERFECT_SLASH_DAMAGE, FIGHT_GROWTH } from './strikeBar.js';
import { BACKDROPS } from './backdrops.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import * as hud from './hud.js';
import { SpellEffects } from './spellEffects.js';
import { PartyMoves } from './partyMoves.js';
import { StageBits, entranceOffset, bitColors, ENTER_LANDS, CURTAIN_PARTS, CURTAIN_OPEN } from './stageBits.js';
import { drawCurtains } from './theatreBackdrop.js';
import { STAGE_EFFECTS } from './stageEffects.js';
import { PORTRAITS } from '../data/art/portraits.js';
import { SETTINGS } from '../state/settings.js';
import { noteMet, noteLeft } from '../data/journal.js';
import { stealCheck, giveBack } from './steals.js';
import { feelHit, feelWindup, feelDefeat, feelTick, exitPose } from './foeFeel.js';
import * as feel from './battleFeel.js';
import { hasGear } from '../data/gear.js';

// The party fights from the left. Only the hero for now; max HP and level come
// from their progress (src/characters/progress.js).
const PARTY = [{ name: 'HERO', color: '#4fe3d0', sprite: HERO_ANIMATIONS.right[0] }];
const DEFEND_SP = 16;
// A friend's DEFEND, which covers only them.
const ALLY_DEFEND_SP = 8;
const BASE_IFRAMES = 1;

// Gold won from a fight, as a multiple of the enemies' `coins` rewards. Later
// chapters' fights are harder, so they pay more: half as much again for each
// chapter after the first (x1.5 in chapter 1, x2.25 in 2, x3 in 3).
const GOLD_REWARD = 1.5;
const GOLD_PER_CHAPTER = 0.5;
const goldReward = () => GOLD_REWARD * (1 + GOLD_PER_CHAPTER * ((WORLD_STATE.chapter ?? 1) - 1));
// EXP for beating an enemy. One met again in a later chapter (Sunnyside's
// chapter 4 monsters in chapter 5) can pay that chapter's rate instead:
// `rewards.laterExp` maps a chapter to the EXP from then on.
const expReward = (rewards) => {
  let exp = rewards.exp;
  for (const [chapter, later] of Object.entries(rewards.laterExp ?? {})) if ((WORLD_STATE.chapter ?? 1) >= Number(chapter)) exp = later;
  return exp;
};
// Fights refuse enemies with fewer different attacks than this.
const MIN_ATTACKS = 3;

// An enemy met again in a later chapter (Sunnyside's chapter 4 monsters in
// chapter 5) can be tougher there: `later` maps a chapter to the numbers that
// change from then on ({ 5: { maxHp, damage, difficulty } }), as laterExp
// does for its EXP. Anything not named stays as it was.
export function enemyForChapter(data, chapter = WORLD_STATE.chapter ?? 1) {
  if (!data?.later) return data;
  let out = data;
  for (const [from, changes] of Object.entries(data.later).sort((x, y) => Number(x[0]) - Number(y[0]))) {
    if (chapter >= Number(from)) out = { ...out, ...changes };
  }
  return out;
}
// A regular enemy in a group has this share of its HP (2 or 3 of them):
// monsters are built to take a lone fight of several rounds (about four or
// five rounds of good FIGHTs), and three at full HP would outlast a boss.
// Chapter 5 only until 13 November 2026, when every chapter's HP went up.
const GROUP_HP_CHAPTER = 1;
const GROUP_HP_SHARE = { 1: 1, 2: 0.7, 3: 0.6 };
export function groupHpShare(size, chapter = WORLD_STATE.chapter ?? 1) {
  return chapter >= GROUP_HP_CHAPTER ? GROUP_HP_SHARE[size] ?? 1 : 1;
}

// What each spell does (costs are in src/data/spells.js), before the armor's
// MAG (spellPotency) makes it stronger. Attack spells have a `power` there
// instead, a multiple of your best FIGHT (see spellDamage). Pacify only works
// once the target is fully calm. Spells in TARGETED_SPELLS ask which enemy.
const HEAL_PULSE_HP = 35;
const LULL_CALM = 30;
// MERCY from a SPELL (yours or an ally's) is only a nudge: a tenth of the spell's own number, at least 1%, and it
// doesn't grow with spell power (at 40% a cast, any boss was spared in three turns). Talking is how you calm someone.
const SPELL_MERCY = 0.1;
function spellMercy(amount) {
  return amount > 0 ? Math.max(1, Math.round(amount * SPELL_MERCY)) : 0;
}
// Chapter 2's spells.
const MEND_HP = 20;
const HUSH_CALM = 20;
const WARD_TURNS = 2;
// Chapters 3 and 4: Balm and Renew heal by their `heals` (src/data/spells.js),
// Aegis is a ward of `turns`, Serenade calms everyone by its `calm`.
const TARGETED_SPELLS = new Set(['rend', 'lull', 'pacify', 'starfall', 'comet', 'spark', 'siphon', 'sunder', 'lance', 'tempest', 'nova', 'undertow', 'brine', 'low_water', 'cleave', 'undercut', 'overwhelm', 'truce']);
const HEALING_SPELLS = new Set(['heal', 'mend', 'renew']);
// What the attack spells say as they're cast.
const ATTACK_SPELL_LINES = {
  rend: 'A blade of light cuts through.',
  starfall: 'Light pours down from above.',
  comet: 'The sky itself comes down.',
  ember: 'A ring of fire bursts out.',
  spark: 'A crackle of light leaps from your hand.',
  siphon: 'Light pulls loose, and flows back into you.',
  chain: 'Lightning leaps from one enemy to the next.',
  sunder: 'A blow that splits the air.',
  lance: 'A lance of light, thrown straight.',
  sunburst: 'The light bursts out of you in every direction.',
  tempest: 'The whole sky turns, and comes down.',
  nova: 'Everything goes white.',
  undertow: 'The water drags back, and takes them with it.',
  brine: 'A splash of sea water, thick with salt.',
  cleave: 'One stroke, straight through.',
  starstorm: 'Stars come down on everyone at once.',
  undercut: 'A blow from underneath that knocks them back, and stings after.',
  overwhelm: 'Everything you have, all at once.',
};
// What each attack spell looks like (a kind from src/battle/spellEffects.js),
// where it isn't a kind of its own.
const ATTACK_SPELL_FX = { rend: 'slash', sunder: 'slash', lance: 'spark', tempest: 'comet', undertow: 'downdraft', brine: 'pebble', cleave: 'slash', undercut: 'downdraft', overwhelm: 'comet' };

// A spell's one-line description from text/spells/spells.txt, with its
// {placeholders} filled in from `values`. Empty if it hasn't got one.
function spellText(section, values) {
  const text = textFile('spells/spells.txt')[section]?.[0] ?? '';
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

// Grazing, like Deltarune: a bullet entering the graze area gives a burst of SP
// and shaves a little off the enemy's turn; staying close keeps trickling SP in.
// (Halved 13 November 2026: grazing alone filled the bar most enemy turns,
// so the skills and armour that add graze SP did nothing you'd notice.)
const GRAZE_SP = 1.25;
const GRAZE_HOLD_SP_PER_SECOND = 2;
const GRAZE_TURN_CUT_SECONDS = 0.08;
// From chapter 5 on, graze SP bonuses past double count half: the coast's
// gear and skills stack high enough to fill the bar every enemy turn, and a
// big spell every round would leave FIGHT nothing to do.
const GRAZE_SOFT_CHAPTER = 5;
const GRAZE_SOFT_FROM = 2;
const softenGraze = (bonus) => ((WORLD_STATE.chapter ?? 1) >= GRAZE_SOFT_CHAPTER && bonus > GRAZE_SOFT_FROM ? GRAZE_SOFT_FROM + (bonus - GRAZE_SOFT_FROM) / 2 : bonus);
// From chapter 5 on, spells of 60 SP or more can be made at most 25% cheaper.
const BIG_SPELL_CHAPTER = 5;
const BIG_SPELL_SP = 60;
const BIG_SPELL_DISCOUNT = 0.25;
// Blocking a bullet with a weapon ability gives a little SP too.
const BLOCK_SP = 1;

// How long an early SHIFT press waits for the soul ability to be ready.
const ABILITY_BUFFER = 0.35;
// The strike bar's slash marks on a friend's FIGHT.
const ALLY_SLASH_COLORS = { vesper: '#b48cff', bramble: '#ff8c3a' };
// A press this close to the end of a recharge waits for it.
const ABILITY_RECHARGE_WAIT = 0.6;

// Running away gets likelier every turn.
const RUN_BASE_CHANCE = 0.4;
const RUN_CHANCE_PER_TURN = 0.15;
const RUN_MAX_CHANCE = 0.9;

// Fighting a group. At most two enemies attack in a turn; their bullets are
// thinned out, and the second one starts a moment later, so it stays fair.
const MAX_ATTACKERS = 2;
const COMBINED_DENSITY = 0.8;
const SECOND_ATTACKER_DELAY = 0.6;
// How long an enemy turn lasts, in seconds of dodging, by chapter:
// [regular, boss]. Deltarune's turns are about 5-6 s in its first chapter,
// 6-7 in its second, and 7-9 later on, with its bosses' 8-13; ours climb
// from about there. A turn shorter than this keeps going: as its last attack
// winds down (TURN_FILL_AT of the way through), another of the monster's own
// attacks comes in, a little lighter (TURN_FILL_DENSITY), cut to end the turn
// on time but never shorter than TURN_FILL_MIN_SECONDS. Within
// TURN_FILL_SLACK of it is close enough. An enemy (or a boss's phase, or a
// chapter in its `later`) can set its own `turnSeconds`. Chapters past the
// last listed use the last.
const TURN_SECONDS = { 1: [7, 9], 2: [7.5, 10], 3: [8.5, 11], 4: [9.5, 12], 5: [10.5, 13] };
const TURN_FILL_AT = 0.85;
const TURN_FILL_DENSITY = 0.75;
const TURN_FILL_MIN_SECONDS = 2;
const TURN_FILL_SLACK = 0.6;
// A boss's entrance: the stage opens out of the dark as it arrives (its
// `entrance`, landing at ENTER_LANDS: see stageBits.js), then its title card
// fades in, holds and fades out (all in seconds from the start).
const INTRO_DARK_SECONDS = 1.4;
const INTRO_CARD_IN = 1.9;
const INTRO_CARD_OUT = 4.5;
const INTRO_CARD_SECONDS = 5.1;
// A boss beaten: the last blow stops everything dead for a moment (the hit
// stop), then it's rocked by bursts all over for FINALE_SECONDS, a burst
// every FINALE_BURST_EVERY, before the last great flash. Then its death plays.
const HIT_STOP_SECONDS = 0.3;
const FINALE_SECONDS = 1.7;
const FINALE_BURST_EVERY = 0.11;
// Spared, soft lights rise off it for this long instead.
const SPARED_GLOW_SECONDS = 1.8;
// The MERCY bar snapped (snapMercy): lifted into his hands until `grab`,
// bent until `snap`, held broken until `throw`, then the halves are thrown at
// the screen until `hit` (they smack the glass), and slide off it until
// `done`.
const MERCY_SNAP = { grab: 0.55, bend: 0.8, snap: 1.9, throw: 2.5, hit: 3.0, done: 4.5 };

const COMMANDS = [
  { label: 'FIGHT', icon: 'fight' },
  { label: 'TALK', icon: 'talk' },
  { label: 'SPELLS', icon: 'spells' },
  { label: 'ITEMS', icon: 'items' },
  { label: 'DEFEND', icon: 'defend' },
  { label: 'RUN', icon: 'run' },
];
// A friend's turn has the same menu, less RUN (you decide when to run). Their
// SPELLS are their own `commands` (src/characters/party.js), paid for from
// the SP you share; FIGHT hits as hard as their weapon allows.
const ALLY_COMMANDS = COMMANDS.filter((command) => command.label !== 'RUN');
// An ally's kind word (TALK) raises one enemy's MERCY this much.
const ALLY_TALK_CALM = 12;
// SHELTER is DEFEND's stronger form: as well as halving the next attack, it
// takes this much (plus the ally's coat's SHELTER DEF) off every hit.
const SHELTER_DEF = 1;
// A weapon with `gust` makes SHELTER slow the next attack's bullets to this
// speed, for that many seconds.
const GUST_SPEED = 0.45;
// After Bramble HIDES, his next FIGHT or attack spell is a sneak attack: this
// many times as hard (plus his `sneak` from skills and gear).
const SNEAK_POWER = 2;
const SNEAK_SPELL_CHAPTER = 5;
// A friend's SP gifts past this count a third, from chapter 5 on (allySpGift).
const ALLY_SP_SOFT_CHAPTER = 5;
const ALLY_SP_SOFT_FROM = 30;
// HOLLER cuts the next enemy attack short, but never by more than this.
const MAX_FLINCH = 0.6;
// Ves's CALL OUT, while she's hurt: she shouts what's coming, and the next
// attack's bullets move at this speed for its first this-many seconds, while
// you get ready.
const CALL_OUT_SPEED = 0.55;
const CALL_OUT_SECONDS = 2.5;

// World positions: party on the left, enemies on the right, both side-on at
// double size. FOE_LAYOUTS gives each enemy's top-left for 1, 2 or 3 enemies.
const SCALE = 2;
const PARTY_FEET = { x: 58, y: 128 };
const FOE_LAYOUTS = {
  1: [{ x: 236, y: 56 }],
  2: [{ x: 228, y: 22 }, { x: 262, y: 88 }],
  3: [{ x: 234, y: 4 }, { x: 270, y: 54 }, { x: 234, y: 104 }],
};
// With two or three enemies, the spots in FOE_LAYOUTS were made for smaller
// ones: the coast's are big (42 or more wide, so 84 on the stage), and stood
// there they ran off the right of the screen and on top of each other. So each
// is pulled back in to fit: its right edge inside the screen, its feet on the
// stage, and the ones at the back (every other one) a step further left, so
// they stagger instead of stacking.
const STAGE_RIGHT = 318;
const STAGE_FLOOR = 160;
const BACK_STEP = 40;
function fitFoe(data, spot, i, count) {
  const w = data.sprite.rows[0].length * SCALE;
  const h = data.sprite.rows.length * SCALE;
  const back = count === 2 ? i === 0 : i !== 1;
  const x = Math.min(spot.x, STAGE_RIGHT - w - (back ? BACK_STEP : 0));
  const y = Math.max(2, Math.min(spot.y, STAGE_FLOOR - h - (count === 3 && i === 0 ? 40 : 0)));
  return { x, y };
}
const ENEMY_STATUS_GAP = 4;
// How far apart (UI pixels) the compact name-and-bars sets are, with several enemies.
const MINI_STATUS_SPACING = 48;
// How tall a lone enemy's name, HP and MERCY are, together (hud.drawEnemyStatus).
const ENEMY_STATUS_HEIGHT = 76;

// One half of the MERCY bar, drawn small and pixel by pixel (so it scales
// up with hard edges): the bar's own dark back and yellow fill, white
// lettering ("MER" or "CY"), a jagged splintered end where it broke, a few
// loose splinters, all on a black outline. The left half's break is on its
// right; the right half's, on its left.
const HALF_PAD = 6;
function makeHalf(side, calm) {
  const W = 50;
  const H = 12;
  const c = document.createElement('canvas');
  c.width = W + HALF_PAD * 2;
  c.height = H + HALF_PAD * 2;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const ox = HALF_PAD;
  const oy = HALF_PAD;
  g.fillStyle = hud.COLORS.calmBack;
  g.fillRect(ox, oy, W, H);
  // (Where the bar was filled: the yellow runs from its left end to `calm`.)
  const from = side ? 50 : 0;
  const filled = Math.max(0, Math.min(W, calm - from));
  g.fillStyle = hud.COLORS.calm;
  g.fillRect(ox, oy, filled, H);
  g.fillStyle = 'rgba(255, 255, 255, 0.35)';
  g.fillRect(ox, oy, W, 2);
  g.fillStyle = '#ffffff';
  g.font = '14px VT323, monospace';
  g.textBaseline = 'middle';
  g.textAlign = 'center';
  g.lineWidth = 3;
  g.strokeStyle = '#000000';
  const word = side ? 'CY' : 'MER';
  const lx = ox + W / 2 + (side ? 4 : -6);
  g.strokeText(word, lx, oy + H / 2 + 1);
  g.fillText(word, lx, oy + H / 2 + 1);
  // The jagged break: bites out of the end, a different depth each row.
  let depth = 3;
  for (let y = 0; y < H; y++) {
    depth = Math.max(1, Math.min(8, depth + Math.floor(Math.random() * 5) - 2));
    if (side) g.clearRect(ox, oy + y, depth, 1);
    else g.clearRect(ox + W - depth, oy + y, depth, 1);
  }
  // A few loose splinters off it, in the bar's colours.
  for (let i = 0; i < 4; i++) {
    const x = side ? ox - 1 - Math.floor(Math.random() * 4) : ox + W + Math.floor(Math.random() * 4);
    const y = oy + Math.floor(Math.random() * (H + 2)) - 1;
    g.fillStyle = i % 2 ? hud.COLORS.calm : hud.COLORS.calmBack;
    g.fillRect(x, y, 2, 1 + (i % 2));
  }
  // The black outline: every empty pixel touching a drawn one.
  const img = g.getImageData(0, 0, c.width, c.height);
  const a = img.data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < c.width && y < c.height && a[(y * c.width + x) * 4 + 3] > 40;
  const edge = [];
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) edge.push([x, y]);
    }
  }
  g.fillStyle = '#000000';
  for (const [x, y] of edge) g.fillRect(x, y, 1, 1);
  return c;
}

// Cracks in the glass round a point: jagged lines going out, and a ring
// of broken spans across them (UI pixels).
function glassCracks({ x, y }) {
  const lines = [];
  const angles = [];
  const count = 10 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    angles.push(angle);
    const length = 70 + Math.random() * 150;
    const line = [[x, y]];
    let a = angle;
    for (let d = 14; d < length; d += 12 + Math.random() * 12) {
      a += (Math.random() - 0.5) * 0.5;
      line.push([x + Math.cos(a) * d, y + Math.sin(a) * d]);
    }
    lines.push(line);
  }
  // Two uneven rings, each only a few spans of the way round.
  const rings = [];
  for (const r of [30, 62]) {
    for (let i = 0; i < count; i += 2) {
      if (Math.random() < 0.3) continue;
      const pts = [angles[i], angles[(i + 1) % count] + (i + 1 >= count ? Math.PI * 2 : 0)].map((a) => {
        const d = r * (0.85 + Math.random() * 0.3);
        return [x + Math.cos(a) * d, y + Math.sin(a) * d];
      });
      rings.push(pts);
    }
  }
  return { x, y, lines, rings };
}

const BOX_OPEN_SECONDS = 0.25;
// Where the battle box belongs. An attack can pick the box up and move it
// (the Bog Toad's GULP), or tear it open over the whole stage (King
// Peptup's finale, which leaves `tear` on it for his stage to draw); it's
// always put back here when the turn ends.
const BOX_HOME = { x: hud.BOX.x, y: hud.BOX.y, w: hud.BOX.w, h: hud.BOX.h };
function boxHome() {
  Object.assign(hud.BOX, BOX_HOME);
  delete hud.BOX.heldBy;
  delete hud.BOX.tear;
  delete hud.BOX.platforms;
  delete hud.BOX.hint;
  // (An attack can list the deck: the Fair Return's captain, ghost_ship attacks.)
  delete hud.BOX.tilt;
  // (Madam Fairweather's deck: her list and her waltz, fairweatherDeck.js.)
  delete hud.BOX.deck;
}

// The hero's aura: a pulsing glow behind them and motes rising from their feet.
const AURA_MOTE_INTERVAL = 0.08;
const AURA_MOTE_LIFE = 1.2;
const SLASH_SECONDS = 0.25;
const ENEMY_FLASH_SECONDS = 0.12;
const FOE_FADE_SECONDS = 1;

// A boss can have an `anim` (or one per phase, a phase's `anim`): frames in
// its sprite's palette, each a list of rows the same size as the sprite.
//   idle    loops all the time (at `fps`)
//   windup  plays once as its attack starts
//   hurt    plays once when it's hit
//   death   plays once when it's beaten, then its last frame holds (or, if
//           it has no `beatenSprite`, fades after)
//   spared  the same, when it's spared
// And `chips`: colours of the bits that fly off it when it's hit (stone, for
// the Warden), and that fall all through its death.
const ANIM_FPS = 6;
const CHIP_LIFE = 0.9;
function compileAnim(anim, palette) {
  if (!anim) return null;
  const out = { chips: anim.chips ?? null };
  for (const [name, clip] of Object.entries(anim)) {
    if (name === 'chips' || !clip?.frames) continue;
    out[name] = { sprites: clip.frames.map((rows) => makeSprite(rows, palette)), fps: clip.fps ?? ANIM_FPS, holds: clip.holds ?? null };
  }
  return out;
}
// The frame of a looping clip (idle, talk) `t` seconds in. With `holds`
// (how many frames' time each one stays up), it can linger on some and
// flick through others: a stop-motion jerk.
function loopFrame(clip, t) {
  if (!clip.holds) return clip.sprites[Math.floor(t * clip.fps) % clip.sprites.length];
  const total = clip.holds.reduce((sum, h) => sum + h, 0);
  let left = (t * clip.fps) % total;
  for (let i = 0; i < clip.sprites.length; i++) {
    left -= clip.holds[i] ?? 1;
    if (left < 0) return clip.sprites[i];
  }
  return clip.sprites[clip.sprites.length - 1];
}
// The frame of `clip` at `t` seconds in (holding the last), or null once it's over and doesn't hold.
function clipFrame(clip, t, hold = false) {
  if (!clip || t < 0) return null;
  const i = Math.floor(t * clip.fps);
  if (i < clip.sprites.length) return clip.sprites[i];
  return hold ? clip.sprites[clip.sprites.length - 1] : null;
}
const clipLength = (clip) => (clip ? clip.sprites.length / clip.fps : 0);

const TAUNT_SPEED = 35; // characters per second
const SHAKE_SECONDS = 0.25;
// How long two letters of an `anagram` name take to trade places.
const NAME_SWAP_SECONDS = 0.9;
const SPARK_SECONDS = 0.35;

// A boss's lantern flame (a phase with `flame`, the Usurper's): how close a
// snuffer must come to your shadow to be caught, and to the flame to reach it,
// and the SP a catch gives.
const CATCH_REACH = 5;
const FLAME_RADIUS = 5;
const CATCH_SP = 2;
let lanternSprite = null;
const POPUP_SECONDS = 0.9;
// How long a boss phase's `flash` takes to fade.
const STAGE_FLASH_SECONDS = 1.2;
const DEFEAT_SECONDS = 1.8;

// A turn-based battle against one to three enemies. On your turn you pick a
// command (and, with several enemies, a target); on the enemies' turn you steer
// your soul around a fixed box while their attacks play. The scene ends
// through onEnd with 'won' (every enemy beaten or pacified), 'fled' or 'death'.
export class BattleScene {
  // `noRun`: a fight you can't run from (true, or the words for why not).
  // `stormOver`: the room the fight started in has had its `calmAfter` scene
  // (after chapter 5), so a coast backdrop draws its calm sky (coastBackdrops.js).
  constructor(enemies, onEnd, area = 'ruins', { noRun = null, stormOver = false } = {}) {
    const list = (Array.isArray(enemies) ? enemies : [enemies]).map((data) => enemyForChapter(data));
    this.noRun = noRun;
    // A big boss fought alone can stand somewhere of its own (`battlePos`, its
    // top-left), to fit sprites wider or taller than the usual spot allows.
    const layout = list.length === 1 && list[0].battlePos ? [list[0].battlePos] : FOE_LAYOUTS[list.length];
    if (!layout) throw new Error(`A battle needs 1 to 3 enemies, not ${list.length}`);
    this.onEnd = onEnd;
    this.area = area;
    this.stormOver = stormOver;
    // A boss can bring its own background; otherwise it's the area's.
    this.backdrop = BACKDROPS[list.find((data) => data.backdrop)?.backdrop] ?? BACKDROPS[area] ?? BACKDROPS.ruins;
    // The theatre's boards start lower than other floors: the one at the back
    // of the line (you) steps down onto them rather than stand on the wall.
    this.backRowDrop = list.some((data) => data.backdrop === 'theatre') ? 9 : 0;
    this.foes = list.map((data, i) => this.makeFoe(data, list.length > 1 ? fitFoe(data, layout[i], i, list.length) : layout[i]));
    // (In a group, a regular enemy has a share of its HP: see groupHpShare.)
    const share = groupHpShare(list.length);
    for (const foe of this.foes) if (!foe.data.boss && share < 1) foe.hp = foe.maxHp = Math.round(foe.maxHp * share);
    for (const foe of this.foes) this.checkPatterns(foe.data);
    for (const foe of this.foes) noteMet(foe.data);
    // A boss fought in `phases` (the Usurper), and the lantern flame one of
    // them can put in the box (see enterPhase).
    this.phased = this.foes.find((foe) => foe.data.phases) ?? null;
    this.flame = null;
    // Her lantern is on the stage from the start, cold in the snow where he
    // threw it (summit_arrival), before Ves starts to relight it.
    this.stageLantern = Boolean(this.phased?.data.phases.some((phase) => phase.flame));
    // A phase's `stage` effects (see stageEffects.js), and what they keep.
    this.stageFx = null;
    this.stageState = null;
    this.provoked = false;
    this.flameGuardBonus = 0;

    // HP carries over from the last fight (see heroHp in progress.js, and
    // memberHp in party.js). Friends
    // in the party (src/characters/party.js) stand behind you and take a turn
    // each after yours.
    this.party = [
      ...PARTY.map((member) => ({ ...member, level: HERO_STATE.level, maxHp: heroMaxHp(), hp: heroHp() })),
      // (A hurt friend sits on the ground for the fight: their `hurt` look.)
      ...partyIds().map((id) => ({
        id, ...MEMBERS[id], commands: battleCommands(id), sprite: this.memberSprite(id), level: HERO_STATE.level, maxHp: memberMaxHp(id), hp: memberHp(id), ally: true, hurt: Boolean(hurtState(id)),
      })),
    ];
    this.hero = this.party[0];
    // Allies still to take their turn this round (see setPhase).
    this.pendingAllies = [];
    this.ally = null;
    // Whoever is choosing what to do right now: the hero, or `ally`. The
    // menus and their submenus (target, spells, items) act for them.
    this.actor = this.hero;
    // The ally's command button, kept between turns like yours.
    this.allySelected = 0;
    // SHELTER over you until the end of the next enemy turn: { def, gust }.
    this.shelter = null;
    this.gustLeft = 0;
    // CALL OUT: who's shouting about the next attack (an ally), and how long
    // its bullets are still slowed.
    this.callOut = null;
    this.callOutLeft = 0;
    // Ves's BRACE (the next hit on you does nothing), PARASOL SPIN (the next
    // hit is thrown back: { ally, power }), both till the end of the next
    // enemy turn; and her RAIN DANCE: { member, amount, turns } of HP back
    // after each enemy turn.
    this.absorb = false;
    this.riposte = null;
    this.rain = null;
    // Chapter 5. Ves's SAIL (seconds the whole party can't be hit at the start
    // of the next enemy turn), Bramble's WADE IN (his id: he takes the hits
    // meant for his friends this enemy turn), the hero's EBB AND FLOW
    // ({ attack, defence, turns }: hits you land are stronger and hits you take
    // are too, until `turns` enemy turns have passed). A foe can also carry
    // `brine` ({ damage, turns }: it burns after every enemy turn) and
    // `exposed` ({ bonus, turns }: LOW WATER, every hit on it lands harder).
    this.sailSeconds = 0;
    this.wading = null;
    this.tideSwap = null;

    // Learned skills shape the whole battle.
    // Thrift and Gentle Hands make spells cheaper. From chapter 5 on, a big
    // spell's discount stops at a quarter, so it's a choice every other turn
    // rather than every turn.
    // Only the spells in the hero's SPELL NOTCHES come along (src/characters/notches.js).
    this.spells = battleSpells().map((id) => {
      let discount = skillBonus('spellDiscount') + (id === 'pacify' ? skillBonus('pacifyDiscount') : 0);
      if ((WORLD_STATE.chapter ?? 1) >= BIG_SPELL_CHAPTER && SPELLS[id].sp >= BIG_SPELL_SP) discount = Math.min(BIG_SPELL_DISCOUNT, discount);
      // A spell that takes the whole bar (Starstorm, Nova) always takes the whole bar.
      if (SPELLS[id].sp === 100) discount = 0;
      return { id, ...SPELLS[id], sp: Math.max(1, Math.round(SPELLS[id].sp * (1 - Math.min(0.9, discount)))) };
    });
    this.fightPowerBonus = 1 + skillBonus('fightPower');
    this.grazeRadius = GRAZE_RADIUS + skillBonus('grazeRadius');
    // Friends' gear (src/characters/equipment.js) looks after you too: more
    // SP from grazes, and a little HP back after every enemy turn.
    const allies = this.party.filter((member) => member.ally);
    this.grazeSpBonus = softenGraze(1 + skillBonus('grazeSp') + armorSpGain() + allies.reduce((sum, ally) => sum + memberGearBonus(ally.id, 'grazeSp'), 0));
    // A foe can give less SP for grazing past it (`grazeSp` on the enemy,
    // e.g. Corrie's 0.25): its bullets are so thick that a full bar every
    // turn would make a big spell free. The lowest in the fight counts.
    this.grazeSpBonus *= Math.min(1, ...this.foes.map((foe) => foe.data.grazeSp ?? 1));
    // The armor: DEF takes something off every hit, MAG strengthens spells.
    this.defense = heroDefense();
    this.potency = spellPotency();
    // How many knockouts Last Stand can still save you from (Not Yet adds a second).
    this.lastStandReady = skillBonus('lastStand');

    // Kindling: some SP from the start.
    this.sp = Math.min(100, skillBonus('spStart'));
    // Bright Ward: enemy turns left with damage halved.
    this.wardTurns = 0;
    // Your bag: what you eat here is gone for good.
    this.items = HERO_STATE.items;
    this.turn = 0;
    this.defending = false;
    this.seenModes = new Set(['normal']);
    this.earned = { exp: 0, coins: 0, items: [], materials: {} };
    this.target = this.foes[0];
    this.slashFoe = null;

    // The equipped weapon sets FIGHT power and may give the soul a SHIFT ability.
    this.weapon = WEAPONS[HERO_STATE.weapon];
    // (A boss can give your shadow a power of its own for the fight, in place
    // of the weapon's: the enemy's `soulAbility`, from soulAbilities.js. A
    // phase can hold it back, or bring it in: see enterPhase.)
    const giver = this.foes.find((foe) => foe.data.soulAbility);
    const first = giver?.data.phases?.[0];
    this.giveAbility(first && 'soulAbility' in first ? first.soulAbility : giver?.data.soulAbility);
    this.grazeMultiplier = 1;
    boxHome();
    this.box = hud.BOX;

    this.selected = 0; // command button
    this.cursor = 0; // option in a TALK, SPELLS, ITEMS or target list
    this.soul = new Soul();
    this.bullets = [];
    this.attacks = [];
    this.sparks = [];
    this.motes = [];
    this.moteTimer = 0;
    this.popups = [];
    // Spells' bursts over the stage (src/battle/spellEffects.js).
    this.fx = new SpellEffects();
    // The party's swings, casts, guards and poses (partyMoves.js).
    this.moves = new PartyMoves();
    // Dust, sparks and lights over the stage (src/battle/stageBits.js).
    this.bits = new StageBits();
    this.hitStop = 0;
    this.strike = null;
    this.slashTime = 0;
    this.result = null;
    this.finished = false;
    this.time = 0;
    this.shake = 0;
    this.heroFlinch = 0;

    if (this.phased) this.enterPhase(this.phased, 0);

    // A boss with an `introCard` makes an entrance first.
    const boss = this.foes.find((foe) => foe.data.introCard);
    if (boss) this.startBossIntro(boss);
    else this.showIntro();
  }

  // A boss makes an entrance: the stage opens out of the dark, it flares up, a
  // title card names it, and it says a few lines (the [boss_intro] section of
  // its text file) while the opening of its song plays. Then the battle starts.
  startBossIntro(foe) {
    this.speaker = foe;
    this.landed = false;
    this.setBubbles(this.foeLines(foe, 'boss_intro'));
    warmVoices();
    this.setPhase('bossIntro');
  }

  // Where it is, `t` seconds into its entrance.
  entrance(foe, t = this.phaseTime) {
    const size = { w: foe.sprite.width * SCALE, h: foe.sprite.height * SCALE };
    return entranceOffset(foe.data.entrance, t, foe.pos, size);
  }

  // It arrives: the stage shakes, dust or light goes out from it, and it
  // shows itself (its `intro` clip if it has one, else its windup).
  bossLands(foe) {
    this.landed = true;
    const w = foe.sprite.width * SCALE;
    const feet = { x: foe.center.x, y: Math.min(hud.STAGE_HEIGHT - 6, foe.pos.y + foe.sprite.height * SCALE) };
    foe.introAt = this.time;
    if (!foe.anim?.intro) foe.attackAt = this.time;
    switch (foe.data.entrance) {
      case 'charge':
        this.shake = SHAKE_SECONDS * 2;
        this.bits.dust(feet.x + w * 0.2, feet.y, w * 0.6, 16, { spray: 1 });
        this.bits.ring(feet.x, feet.y, { squash: 0.25, speed: 160, color: '#e8dcc4' });
        sfx('thud');
        break;
      case 'curtain': {
        // The curtains are open: a spotlight snaps on, and confetti.
        this.shake = SHAKE_SECONDS;
        this.bits.star(foe.center.x, foe.pos.y + 20, { size: 30, life: 0.5 });
        this.bits.ring(foe.center.x, foe.center.y, { speed: 170, color: '#ffe48a', width: 3 });
        this.bits.scatter(foe.center.x, foe.pos.y + 6, 46, ['#ff5470', '#ffd25e', '#4fe3d0', '#7ab8ff', '#ffffff', '#c78bff'], { speed: 130, up: 70, gravity: 70, life: 1.6 });
        sfx('flare');
        break;
      }
      case 'swoop':
        this.shake = SHAKE_SECONDS;
        this.bits.dust(feet.x, feet.y, w * 0.8, 10, { color: '#9aa4c8' });
        this.bits.ring(foe.center.x, foe.center.y, { speed: 140, color: '#9aa4c8' });
        sfx('whoosh');
        break;
      case 'surge': {
        // Back down into the water: a splash of blue-green drops, a ring on the water.
        this.shake = SHAKE_SECONDS * 2;
        this.bits.scatter(feet.x, feet.y - 4, 30, ['#9fd8e4', '#d4f2fa', '#5aa890', '#7ac0b0'], { speed: 120, up: 90, gravity: 280, life: 1.1 });
        this.bits.ring(feet.x, feet.y - 2, { squash: 0.25, speed: 170, color: '#d4f2fa', width: 2 });
        this.bits.ring(feet.x, feet.y - 2, { squash: 0.25, speed: 100, color: '#5aa890', life: 0.6 });
        sfx('splash');
        break;
      }
      case 'rise':
      case 'whirl':
        this.bits.ring(foe.center.x, foe.center.y, { speed: 150, color: '#fff2cf', width: 3 });
        this.bits.ring(foe.center.x, foe.center.y, { speed: 90, color: '#ffd27a', life: 0.6 });
        for (let i = 0; i < 14; i++) this.bits.mote(foe.center.x + (Math.random() - 0.5) * w * 0.8, foe.center.y + Math.random() * 30, { vy: -20 - Math.random() * 30, color: foe.bitColors[i % foe.bitColors.length] });
        sfx('whoosh');
        break;
      default: // slam
        this.shake = SHAKE_SECONDS * 3;
        this.bits.dust(feet.x, feet.y, w * 0.7, 18);
        this.bits.ring(feet.x, feet.y, { squash: 0.25, speed: 190, color: '#e8dcc4', width: 3 });
        this.bits.scatter(feet.x, feet.y - 2, 10, ['#8a7d6a', '#5c5248', '#cbbfa8'], { speed: 70, up: 60, gravity: 260 });
        sfx('thud');
    }
  }

  updateBossIntro(input) {
    const landsAt = this.speaker.data.entrance === 'curtain' ? CURTAIN_OPEN : ENTER_LANDS;
    if (!this.landed && this.phaseTime >= landsAt) this.bossLands(this.speaker);
    if (this.phaseTime < INTRO_CARD_SECONDS) {
      // Z skips the title card (after a moment, so a held key doesn't).
      if (this.phaseTime > 1 && input.wasPressed('confirm')) this.phaseTime = INTRO_CARD_SECONDS;
      return;
    }
    const next = () => {
      if (!this.tauntBubbles.length) {
        this.taunt = null;
        stopVoice();
        this.showIntro();
        return;
      }
      this.nextBubble();
      this.tauntStart = this.phaseTime;
      this.tauntSkipped = false;
    };
    if (!this.taunt) next();
    else if (!input.wasPressed('confirm')) return;
    else if (!this.tauntSkipped && this.visibleTauntChars() < this.taunt.length) this.tauntSkipped = true;
    else next();
  }

  // The boss's flare (0 to 1) and the title card's fade (0 to 1) during its entrance.
  introGlow() {
    const t = this.phaseTime;
    const rise = Math.min(1, Math.max(0, (t - ENTER_LANDS) / 0.8));
    return rise * (0.75 + 0.25 * Math.sin(t * 3));
  }

  introCardAlpha() {
    const t = this.phaseTime;
    if (t < INTRO_CARD_IN || t > INTRO_CARD_SECONDS) return 0;
    if (t < INTRO_CARD_IN + 0.5) return (t - INTRO_CARD_IN) / 0.5;
    if (t > INTRO_CARD_OUT) return 1 - (t - INTRO_CARD_OUT) / (INTRO_CARD_SECONDS - INTRO_CARD_OUT);
    return 1;
  }

  drawBossIntro(ctx) {
    const foe = this.speaker;
    // Her light swelling around her.
    const glow = this.introGlow();
    if (glow > 0) {
      const cx = foe.center.x;
      const cy = foe.pos.y + foe.sprite.height * SCALE * 0.3;
      const radius = 30 + glow * 40;
      const light = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      light.addColorStop(0, `rgba(255, 200, 110, ${0.45 * glow})`);
      light.addColorStop(1, 'rgba(255, 200, 110, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = light;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.restore();
    }
  }

  // A showman's entrance: the stage curtains part on him. (Over the stage,
  // under his speech bubble and the panel, so the curtain's top never hides
  // what he says.)
  drawBossIntroCurtains(ctx) {
    if (this.speaker.data.entrance !== 'curtain') return;
    const u = Math.min(1, Math.max(0, (this.phaseTime - CURTAIN_PARTS) / (CURTAIN_OPEN - CURTAIN_PARTS)));
    drawCurtains(ctx, u, this.time, hud.STAGE_HEIGHT, { x: this.speaker.center.x, y: this.speaker.pos.y + 14 });
  }

  drawBossIntroOverlay(ctx) {
    // Opening out of the dark.
    const dark = 1 - Math.min(1, this.phaseTime / INTRO_DARK_SECONDS);
    if (dark > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${dark})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    const alpha = this.introCardAlpha();
    if (alpha <= 0) return;
    const { title, subtitle } = this.speaker.data.introCard;
    inUiSpace(ctx, () => {
      ctx.save();
      ctx.globalAlpha = alpha;
      // A band across the top of the stage, above the boss.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 8, UI_WIDTH, 112);
      ctx.fillStyle = '#ffd27a';
      ctx.fillRect(UI_WIDTH / 2 - 160, 18, 320, 2);
      ctx.fillRect(UI_WIDTH / 2 - 160, 108, 320, 2);
      drawText(ctx, title, UI_WIDTH / 2, 28, { size: 56, color: '#fff2cf', align: 'center', shadow: '#7a3a10' });
      if (subtitle) drawText(ctx, subtitle, UI_WIDTH / 2, 78, { size: 24, color: '#ffd27a', align: 'center' });
      ctx.restore();
    });
  }

  makeFoe(data, pos) {
    const sprite = makeSprite(data.sprite.rows, data.sprite.palette);
    // A white silhouette, flashed for a moment when the enemy takes a hit.
    const white = Object.fromEntries(Object.keys(data.sprite.palette).map((key) => [key, '#ffffff']));
    return {
      data,
      name: data.name,
      sprite,
      flashSprite: makeSprite(data.sprite.rows, white),
      // A boss can have a `beatenSprite` to show instead of fading away when beaten.
      beatenSprite: data.beatenSprite ? makeSprite(data.beatenSprite.rows, data.beatenSprite.palette) : null,
      pos,
      center: { x: pos.x + (sprite.width * SCALE) / 2, y: pos.y + (sprite.height * SCALE) / 2 },
      hp: data.maxHp,
      maxHp: data.maxHp,
      calm: 0,
      flash: 0,
      // Which of its `phases` it's in, and how many of its turns that's been.
      phase: 0,
      phaseTurns: 0,
      lastPattern: null,
      state: 'active', // then 'defeated' or 'pacified'
      leftAt: 0,
      // Its `anim`, and when it was last hit and last attacked, and the
      // chips flying off it (see compileAnim).
      anim: compileAnim(data.anim, data.sprite.palette),
      hitAt: -99,
      attackAt: -99,
      // (A regular enemy with an `intro` clip plays it as the fight starts.)
      introAt: data.anim?.intro && !data.boss ? 0 : -99,
      // What flies off it when it goes (see stageBits.js).
      bitColors: bitColors(data.sprite.palette),
      seenFlash: 0,
      chips: [],
    };
  }

  activeFoes() {
    return this.foes.filter((foe) => foe.state === 'active');
  }

  // Each enemy's lines come from its file in /text. A boss in `phases` can
  // have its own for the phase it's in: [flavor: lit] before [flavor].
  // Lines about a friend who's knocked out ("Ves sits on the flagstones...")
  // are left out till they're back up, unless that leaves none.
  // A monster nearly beaten, or ready to be spared, shows it in the flavour
  // box ("GULLION is backing towards the edge of the box"): its
  // [flavor: spareable] once its MERCY is full, or [flavor: low] once it's
  // under LOW_FLAVOR of its HP. Spareable first. Null if none has either.
  wornFlavor(active) {
    const has = (foe, section) => Boolean(textFile(foe.data.textFile)[section]?.length);
    const tries = [
      ['flavor: spareable', (foe) => foe.calm >= 100 && !this.mercyRule(foe)],
      ['flavor: low', (foe) => foe.hp > 0 && foe.hp <= foe.maxHp * LOW_FLAVOR],
    ];
    for (const [section, holds] of tries) {
      const foe = active.find((f) => holds(f) && has(f, section));
      if (!foe) continue;
      const lines = this.foeLines(foe, section);
      // (A lone [flavor: low] line, over a long fight's last few rounds,
      // takes turns with its ordinary flavour instead of showing every turn.)
      if (section === 'flavor: low') {
        foe.lowSince ??= this.turn;
        if (lines.length === 1 && (this.turn - foe.lowSince) % 2 === 1) continue;
      }
      return lines[this.turn % lines.length];
    }
    return null;
  }

  foeLines(foe, section) {
    const phase = this.bossPhase(foe);
    const own = phase ? textFile(foe.data.textFile)[`${section}: ${phase.id}`] : null;
    const lines = own?.length ? own : textSection(foe.data.textFile, section);
    const awake = lines.filter((line) => !this.aboutDownAlly(line));
    return awake.length ? awake : lines;
  }

  // Friends knocked out (HP 0) right now: they don't speak till they're up.
  downAllies() {
    return this.party.filter((member) => member.ally && member.hp <= 0);
  }

  // Whether a line or a TALK option names one of them ("Point at Ves").
  aboutDownAlly(text) {
    return this.downAllies().some((member) => text.includes(member.name));
  }

  // --- Boss phases ---
  //
  // A boss with `phases` (the Usurper; see src/data/enemies/usurper.js) fights
  // in stages, each a phase with its own attacks (`patterns`, `difficulty`)
  // and lines ([section: id] in its text file), and any of:
  //   smoke         { fight, spell }: what share of FIGHT and spell damage lands
  //   until         when to go on to the next: { turns: n }, { flame: true },
  //                 { below: share } (its HP down to that share of its max),
  //                 or { allyTurn: true } (straight after an `allyTurn`);
  //                 with several, whichever comes first; `atLeast: n` holds
  //                 any of them back till the phase has had n of its turns
  //   flame         { stages, guard, maxHelp }: a flame in the box to defend
  //   allyTurn      { <member>: section }: that member's turn is a line from it
  //   allyFight     { <member>: { power, color } }: their FIGHT's weapon power
  //   allyCommands  { <member>: { keep, add } }: their SPELLS, changed
  //   burn          share of max HP it loses as the phase starts
  //   sprite        how it looks now
  //   floor         share of max HP it can't be brought below in this phase
  //   noMercy       like the enemy's own `noMercy`, for this phase only
  //                 (its lines can be [no_mercy: <phase id>] for this phase)
  //   damage        how much its bullets hurt now, instead of its own `damage`
  //   gentle        like the enemy's own `gentle`, for this phase only
  //   gameOver      a section of its text file: the line under GAME OVER if
  //                 you fall in this phase, instead of the usual one
  //   unhurt        [<member>, ...]: they stop being hurt as it starts, for
  //                 good (full HP, their own SPELLS and look back)
  //   hitCalm       MERCY lost (a negative number) each time it's hit
  //   talk          its TALK options in this phase, instead of its usual ones
  //   flash         the stage flashes white as it starts
  //   dropped       a prop sprite lying on the stage in front of Ves
  //   beat          what's said as the phase starts: [{ who?, say }], `say` a
  //                 section; with no `who`, in the panel; with a party
  //                 member's id (or anyone with a portrait, like 'tuck'), in
  //                 their box; with 'foe', in its bubble. A step can also be
  //                 { pause: s } (the stage holds, nothing said, for s
  //                 seconds), { music: true } (the phase's `music` starts
  //                 now; or { music: null } for silence), { cue: name } (its
  //                 `stage` effects do something: see stageEffects.js),
  //                 { renew: true } (its HP climbs back: `renew`) or
  //                 { anagram: true } (its name starts changing: `anagram`)
  //   quiet         the music stops as it starts, and the phase's own `music`
  //                 waits for a { music: true } step of its beat
  //   calm          its MERCY is set to this as the phase starts
  //   renew         { to, seconds }: its HP climbs back up to that share of
  //                 its max over that many seconds (a { renew: true } beat step)
  //   anagram       its name runs through this list (see shuffleName), with
  //                 `nameSwap` seconds a swap and `nameJitter` to shake it
  //   stage         stage effects for the phase, by name (stageEffects.js):
  //                 lights, the box swaying, the buttons on strings...
  //   lowHp         below this share of its max HP, its taunts are often from
  //                 [low_hp] (or [low_hp: <phase id>]) instead
  //   leaveBeat     { pacified, defeated }: a beat (as `beat`) played as it's
  //                 spared or beaten, before the panel says so
  // `until` can also have `calm: n` (its MERCY up to n). A phase whose
  // `until` has `now: true` goes on as soon as your side's turn is over, not
  // after its attack.
  //
  // TALK options can have, as well as `calm`: `once` (gone once it's been
  // said), `after` (an option's name, or a list of them: it's only there once
  // those have been said), `atCalm` (only there with MERCY at least that)
  // and `spare` (it spares the foe, as Pacify does).
  // The phase it's in now, or null.
  bossPhase(foe = this.phased) {
    return foe?.data.phases?.[foe.phase] ?? null;
  }

  // The flame is in the box (a phase with `flame`).
  flameInBox() {
    return Boolean(this.flame && this.bossPhase()?.flame);
  }

  // Your shadow's SHIFT power: `id` from soulAbilities.js, or null for the
  // weapon's own. Fresh each time (its hint shows again on the next dodge).
  giveAbility(id) {
    this.ability = id ? SOUL_ABILITIES[id] : this.weapon.ability ? SOUL_ABILITIES[this.weapon.ability] : null;
    this.abilityCooldown = 0;
    this.abilityLeft = 0;
    this.abilityUses = 0;
    this.abilityState = {};
    this.abilityHintShown = false;
  }

  enterPhase(foe, index) {
    foe.phase = index;
    foe.phaseTurns = 0;
    const phase = foe.data.phases[index];
    // A phase's `soulAbility` changes your shadow's power from here on
    // (the king's scissors only come once you know there are strings).
    if (index > 0 && 'soulAbility' in phase) this.giveAbility(phase.soulAbility);
    // A phase can bring its own music in (the Usurper's three movements), or
    // (`quiet`) cut it, and bring its own in later in its beat.
    if (phase.quiet) music.play(null);
    // (`musicFrom`: start that song at one of its sections, even if it's
    // already playing: Corrie's phases each cut to their own part.)
    // The song goes through the same area swaps as the fight's own (songFor),
    // so a coast phase asking for Cutlass Weather gets the storm's version.
    else if (phase.music) music.play(songFor(phase.music, this.area, this.stormOver), null, phase.musicFrom ?? null);
    if (phase.calm !== undefined) foe.calm = phase.calm;
    // The rest of a hit the last phase's floor held back (see resist), unless
    // this phase heals her back up anyway. Never past this phase's own floor.
    if (foe.heldDamage) {
      if (!phase.renew) {
        const low = Math.max(1, Math.ceil(foe.maxHp * (phase.floor ?? 0)));
        const dealt = Math.max(0, Math.min(foe.heldDamage, foe.hp - low));
        if (dealt > 0) {
          foe.hp -= dealt;
          this.addPopup(`${dealt}`, foe.center?.x ?? 200, (foe.center?.y ?? 60) - 10, hud.COLORS.danger);
        }
      }
      foe.heldDamage = 0;
    }
    // Its own anagram starts from its first spelling, when the beat says.
    if (phase.anagram) {
      foe.nameStep = 0;
      foe.nameGo = false;
      foe.name = phase.anagram[0];
    }
    // Its stage effects, fresh.
    this.stageFx = phase.stage ? STAGE_EFFECTS[phase.stage] ?? null : null;
    this.stageState = this.stageFx?.start?.(this, foe) ?? null;
    if (phase.sprite) {
      const white = Object.fromEntries(Object.keys(phase.sprite.palette).map((key) => [key, '#ffffff']));
      foe.sprite = makeSprite(phase.sprite.rows, phase.sprite.palette);
      foe.flashSprite = makeSprite(phase.sprite.rows, white);
    }
    if (phase.anim) foe.anim = compileAnim(phase.anim, phase.sprite?.palette ?? foe.data.sprite.palette);
    // A later phase with an `intro` clip plays it as it starts (the jam).
    if (index > 0 && phase.anim?.intro) {
      foe.introAt = this.time;
      this.shake = SHAKE_SECONDS * 2;
      this.bits.ring(foe.center.x, foe.center.y, { speed: 110, color: '#ffe48a', width: 2 });
      sfx(phase.introSfx ?? 'thud');
    }
    if (phase.flame) {
      const box = hud.BOX;
      this.flame = {
        x: box.x + box.w / 2, y: box.y + box.h - 10, stage: 0, stages: phase.flame.stages,
        guard: phase.flame.guard, help: 0, lost: false, flicker: 0,
      };
    }
    if (phase.burn) {
      const burn = Math.round(foe.maxHp * phase.burn);
      foe.hp = Math.max(1, foe.hp - burn);
      foe.flash = ENEMY_FLASH_SECONDS * 3;
      this.addPopup(`${burn}`, foe.center.x, foe.pos.y + 10, hud.COLORS.danger);
      this.shake = SHAKE_SECONDS * 2;
      sfx('flare');
    }
    // Someone gets back on their feet (Ves, her umbrella back in her hands):
    // well for good, at full HP, with their own SPELLS and their own look.
    for (const id of phase.unhurt ?? []) {
      setHurt(id, false);
      const member = this.party.find((other) => other.id === id);
      if (!member) continue;
      member.hurt = false;
      member.commands = battleCommands(id);
      member.maxHp = memberMaxHp(id);
      member.hp = member.maxHp;
      member.sprite = this.memberSprite(id);
    }
    if (phase.flash) {
      this.stageFlash = STAGE_FLASH_SECONDS;
      sfx('flare');
    }
    // A phase's `name` is what the boss is called from here on (the plate swaps over),
    // and its `burst` colour throws rings, stars and sparks off it as it changes.
    if (index > 0 && phase.name && phase.name !== foe.name) {
      foe.nameFrom = foe.name;
      foe.name = phase.name;
      foe.nameAt = this.time;
    }
    if (index > 0 && phase.burst) {
      const { x, y } = foe.center;
      this.bits.ring(x, y, { speed: 150, color: phase.burst, width: 3, life: 0.6 });
      this.bits.ring(x, y, { speed: 90, color: '#ffffff', width: 2, life: 0.5 });
      for (let i = 0; i < 9; i++) this.bits.star(x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 60, { size: 10 + Math.random() * 8, life: 0.3 + Math.random() * 0.3 });
      this.bits.scatter(x, y, 22, [phase.burst, '#ffffff', '#fff3b0'], { speed: 130, life: 0.9 });
      this.shake = Math.max(this.shake ?? 0, SHAKE_SECONDS * 2);
      this.stageFlash = Math.max(this.stageFlash ?? 0, STAGE_FLASH_SECONDS);
    }
  }

  // After each of its turns: tends the flame, then goes on to the next phase
  // when this one's `until` is met, playing its `beat`. Then your turn.
  afterEnemyTurn() {
    const foe = this.phased;
    if (!foe || foe.state !== 'active') {
      this.setPhase('command');
      return;
    }
    foe.phaseTurns++;
    const next = () => {
      if (!this.nextBossPhase(foe)) this.setPhase('command');
    };
    const report = this.tendFlame(foe);
    if (report) this.showMessage(report, next);
    else next();
  }

  // The flame grows a stage if it got through the turn, or shrinks back one
  // if it was snuffed (and Ves shields it a little better next time). Returns
  // what the panel says about it, or null.
  tendFlame(foe) {
    if (!this.flameInBox()) return null;
    const flame = this.flame;
    let section = 'flame_grows';
    if (flame.lost) {
      flame.stage = Math.max(0, flame.stage - 1);
      flame.help = Math.min(this.bossPhase(foe).flame.maxHelp ?? 0, flame.help + 1);
      section = 'flame_snuffed';
    } else {
      flame.stage = Math.min(flame.stages, flame.stage + 1);
      // Lit: the next phase's beat says so.
      if (flame.stage >= flame.stages) return null;
    }
    const lines = this.foeLines(foe, section);
    return lines[Math.floor(Math.random() * lines.length)].replaceAll('{stage}', flame.stage).replaceAll('{stages}', flame.stages);
  }

  // A boss with an `anagram` (Peptup) moves its name one spelling along as
  // its first phase wears on (by HP lost or turns taken, whichever is further),
  // one swap at a time, and reaches the last spelling only when that phase ends.
  // A later phase can have an `anagram` of its own: the name runs straight
  // through that list once the phase's beat says so (a `{ anagram: true }`
  // step), each swap taking `nameSwap` seconds, the letters shaking if the
  // phase has `nameJitter` (Peptup taking his name back, PUPPET to PEPTUP).
  shuffleName(foe) {
    const own = this.bossPhase(foe)?.anagram;
    const steps = own ?? foe.data.anagram;
    if (!steps || foe.state !== 'active') return;
    if (own && !foe.nameGo) return;
    foe.nameStep ??= 0;
    const swap = this.bossPhase(foe)?.nameSwap ?? NAME_SWAP_SECONDS;
    if (this.time - (foe.nameAt ?? -99) < swap + (own ? 0.08 : 0.5)) return;
    const last = steps.length - 1;
    let want = last;
    if (!foe.phase) {
      const until = foe.data.phases?.[0]?.until ?? {};
      const lost = until.below ? (1 - foe.hp / foe.maxHp) / (1 - until.below) : 0;
      const turns = until.turns ? foe.phaseTurns / until.turns : 0;
      want = Math.min(last - 1, Math.floor(Math.max(lost, turns) * last));
    }
    if (want <= foe.nameStep) return;
    foe.nameFrom = steps[foe.nameStep];
    foe.nameStep += 1;
    foe.name = steps[foe.nameStep];
    foe.nameAt = this.time;
    sfx('creak');
  }

  // `then` is where the battle goes after the new phase's beat; `force` goes
  // on whatever `until` says (after an `allyTurn` that ends the phase).
  nextBossPhase(foe, then = 'command', force = false) {
    const until = this.bossPhase(foe)?.until;
    const next = foe.data.phases[foe.phase + 1];
    if (!until || !next) return false;
    const met = (until.turns && foe.phaseTurns >= until.turns) || (until.flame && this.flame?.stage >= this.flame.stages)
      || (until.below && foe.hp <= foe.maxHp * until.below) || (until.calm && foe.calm >= until.calm);
    const done = force || (met && foe.phaseTurns >= (until.atLeast ?? 0));
    if (!done) return false;
    this.enterPhase(foe, foe.phase + 1);
    this.playBeat(foe, next.beat ?? [], () => this.setPhase(then));
    return true;
  }

  // Plays a phase's `beat`, one step after another, then `done`.
  playBeat(foe, steps, done) {
    const [step, ...rest] = steps;
    if (!step) {
      done();
      return;
    }
    const go = () => this.playBeat(foe, rest, done);
    if (step.pause !== undefined) {
      this.holdFor = step.pause;
      this.holdNext = go;
      this.setPhase('hold');
      return;
    }
    if (step.music !== undefined) {
      music.play(step.music === true ? this.bossPhase(foe)?.music ?? null : step.music);
      go();
      return;
    }
    if (step.cue) {
      this.stageFx?.cue?.(this, foe, step.cue);
      go();
      return;
    }
    if (step.renew) {
      const { to = 0.5, seconds = 2 } = this.bossPhase(foe)?.renew ?? {};
      foe.renew = { to: Math.round(foe.maxHp * to), rate: Math.max(1, (foe.maxHp * to - foe.hp) / seconds) };
      go();
      return;
    }
    if (step.anagram) {
      foe.nameGo = true;
      go();
      return;
    }
    // A friend who's knocked out says nothing: the panel can say what they do
    // instead ([<section> down]), or it's skipped.
    if (step.who && this.downAllies().some((member) => member.id === step.who)) {
      const instead = textFile(foe.data.textFile)[`${step.say} down`] ?? [];
      this.playBeat(foe, [...(instead.length ? [{ say: `${step.say} down` }] : []), ...rest], done);
      return;
    }
    const lines = textFile(foe.data.textFile)[step.say] ?? [];
    if (!lines.length) {
      go();
      return;
    }
    if (step.who === 'foe') {
      this.sayAloud(foe, lines, go);
      return;
    }
    if (step.who) {
      const box = new TextBox();
      box.open(lines, partyIds().includes(step.who) || PORTRAITS[step.who] ? step.who : null);
      this.interjection = { box, next: go };
      this.setPhase('interject');
      return;
    }
    const say = (i) => (i < lines.length ? this.showMessage(lines[i], () => say(i + 1)) : go());
    say(0);
  }

  // An enemy says something in its speech bubbles (each of `lines` one after
  // another), outside its taunt; then `done`.
  sayAloud(foe, lines, done) {
    this.speaker = foe;
    this.setBubbles(lines);
    this.nextBubble();
    this.tauntStart = 0;
    this.tauntSkipped = false;
    this.speechDone = done;
    this.setPhase('speech');
  }

  // Lines to say in its bubbles, one bubble at a time, with the recording of
  // any line that's voiced (src/audio/voiceClips.js) on the bubble it goes with.
  setBubbles(lines) {
    this.tauntBubbles = [];
    this.tauntClips = [];
    for (const line of lines) {
      const bubbles = hud.speechBubbles(line);
      this.tauntBubbles.push(...bubbles);
      this.tauntClips.push(...lineClips(voiceOf(line), bubbles.length));
    }
  }

  // On to the next bubble (and its recording, cutting off the last one's).
  nextBubble() {
    this.taunt = this.tauntBubbles.shift() ?? null;
    sayClips(this.tauntClips?.shift());
  }

  // Leaves a foe open (LOW WATER, WEAKEN, Ves's CHARGE, Bramble's MARK IT): every
  // hit on it lands `bonus` harder for `turns` enemy turns (see resist). A
  // weaker one doesn't replace a stronger one that's still on it.
  exposeFoe(foe, { bonus, turns }) {
    if (foe.exposed && foe.exposed.bonus > bonus) return;
    foe.exposed = { bonus, turns };
  }

  // A phase with `smoke` lets only that share of a hit through (`kind` is
  // 'fight' or 'spell'), and the panel says so after.
  resist(foe, damage, kind) {
    // LOW WATER: its weak spots show, and every hit lands harder.
    if (foe.exposed && damage > 0) damage = Math.round(damage * (1 + foe.exposed.bonus));
    // A phase with a `floor` can't be brought below that share of its max
    // HP: there's more of the fight to come (the Hush, before the umbrella's free).
    // A `finale` with a `hold` is a floor too, until it's played, so a big hit
    // can't skip past it.
    const finale = this.bossPhase(foe)?.finale;
    const floor = Math.max(this.bossPhase(foe)?.floor ?? 0, finale?.hold && !foe.finaleDone ? finale.hold : 0);
    if (floor) {
      const capped = Math.min(damage, Math.max(0, foe.hp - Math.ceil(foe.maxHp * floor)));
      // A big hit (a sneak attack, say) isn't wasted on a phase that ends on HP:
      // what the floor holds back lands as soon as the next phase starts.
      if (capped < damage && this.bossPhase(foe)?.until?.below) foe.heldDamage = (foe.heldDamage ?? 0) + damage - capped;
      damage = capped;
    }
    const smoke = this.bossPhase(foe)?.smoke;
    if (!smoke || damage <= 0) return damage;
    const lines = this.foeLines(foe, kind === 'fight' ? 'smoke_fight' : 'smoke_spell');
    this.smokeLine = lines[Math.floor(Math.random() * lines.length)];
    return Math.round(damage * (smoke[kind] ?? smoke.spell ?? 1));
  }

  // An ally's SPELLS: their own, or what the boss's phase changes them to.
  allyCommands(ally) {
    const change = this.bossPhase()?.allyCommands?.[ally.id];
    if (!change) return ally.commands;
    // (`keep` reaches past the notches: those come along whatever they had notched.)
    return [...memberCommands(ally.id).filter((command) => change.keep?.includes(command.label)), ...(change.add ?? [])];
  }

  // An ally's weapon power for FIGHT: their own, or the phase's `allyFight`.
  allyWeaponPower(ally) {
    return this.bossPhase()?.allyFight?.[ally.id]?.power ?? memberFightPower(ally.id);
  }

  // A team attack (`team`): your best FIGHT and theirs together, times `team`
  // (and FIGHT_GROWTH, as allies' spells are: see allyStrikeDamage).
  teamDamage(ally, team) {
    return Math.max(1, Math.round(((this.bestStrike(this.hero) + this.bestStrike(ally)) * team + this.allyBonus(ally, 'allyStrike')) * FIGHT_GROWTH));
  }

  // A snuffer (a bullet with `snuffs`, after the flame): caught by your
  // shadow, it's gone, and gives a little SP; reaching the flame, it eats
  // into its guard.
  checkSnuffer(bullet) {
    const gap = bullet.edgeDistance(this.soul.x, this.soul.y);
    if (gap === Infinity) return;
    if (gap < SOUL_RADIUS + CATCH_REACH) {
      bullet.spent = true;
      this.gainSp(CATCH_SP);
      this.addSparks(4, '#aae0ff', 70);
      sfx('graze');
      return;
    }
    const flame = this.flame;
    if (Math.hypot(bullet.x - flame.x, bullet.y - flame.y) - (bullet.r ?? 2) >= FLAME_RADIUS) return;
    bullet.spent = true;
    flame.guard--;
    flame.flicker = 0.5;
    for (let i = 0; i < 4; i++) {
      this.sparks.push({ x: flame.x, y: flame.y, vx: (Math.random() - 0.5) * 60, vy: -Math.random() * 50, life: SPARK_SECONDS, color: '#5a6a8a' });
    }
    if (flame.guard <= 0 && !flame.lost) {
      flame.lost = true;
      this.addPopup('SNUFFED', flame.x, flame.y - 14, hud.COLORS.danger);
      sfx('hurt');
    } else {
      sfx('back');
    }
  }

  foeLine(foe, section) {
    return this.foeLines(foe, section)[0];
  }

  // The opening message. The very first time you ever fight, your shadow
  // stands up out of you first (text/battle.txt), and it's remembered.
  showIntro() {
    if (WORLD_STATE.metShadow) {
      this.showMessage(this.introText(), 'command');
      return;
    }
    WORLD_STATE.metShadow = true;
    this.showMessage(textSection('battle.txt', 'first_shadow')[0], () => this.showMessage(this.introText(), 'command'));
  }

  introText() {
    const [first, ...others] = this.foes;
    return [this.foeLine(first, 'intro'), ...others.map((foe) => `${foe.name} joins the fight!`)].join('\n');
  }

  // Every enemy needs several attacks, and soul modes are for special boss
  // battles only.
  checkPatterns(enemy) {
    const names = new Set(enemy.patterns.map(({ name }) => name));
    if (names.size < MIN_ATTACKS) {
      throw new Error(`${enemy.name} has ${names.size} attack(s); every enemy needs at least ${MIN_ATTACKS} different ones (see src/battle/attacks/).`);
    }
    if (enemy.boss) return;
    for (const { name } of enemy.patterns) {
      const { mode } = createPattern(name, hud.BOX);
      if (mode !== 'normal') {
        throw new Error(`${enemy.name} uses '${name}', which needs the ${mode} soul mode. Soul modes are for bosses only (boss: true).`);
      }
    }
  }

  enter(game) {
    this.game = game;
    const own = this.foes[0].data.music;
    music.play(own ? songFor(own, this.area, this.stormOver) : battleSong(this.area));
  }

  // A message too long for the panel carries on over several pages.
  showMessage(text, next) {
    const pages = hud.textPages(text);
    this.message = { text: pages[0], pages, page: 0, next };
    this.setPhase('message');
  }

  setPhase(phase) {
    // Between your action and the enemies' turn, each ally acts in turn.
    if (phase === 'taunt' && this.pendingAllies.length && this.activeFoes().length) {
      this.ally = this.pendingAllies.shift();
      phase = 'ally';
      // Someone hurt can't FIGHT (Ves, with no umbrella): their turn starts on SPELLS.
      if (isHurt(this.ally.id) && ALLY_COMMANDS[this.allySelected]?.label === 'FIGHT') {
        this.allySelected = ALLY_COMMANDS.findIndex((command) => command.label === 'SPELLS');
      }
    }
    // A phase that ends `now` (Tuck letting go of the levers) goes on the
    // moment your side's turn is done, before its attack.
    if (phase === 'taunt' && this.phased?.state === 'active' && this.bossPhase()?.until?.now && this.nextBossPhase(this.phased, 'taunt')) return;
    this.phase = phase;
    this.phaseTime = 0;
    switch (phase) {
      case 'ally': {
        this.actor = this.ally;
        this.cursor = 0;
        // A boss's phase can take their turn (`allyTurn`: Ves at the lantern),
        // unless you're down and need them.
        const auto = this.bossPhase()?.allyTurn?.[this.ally.id];
        if (auto && this.hero.hp > 0) {
          const said = this.foeLines(this.phased, auto);
          // A phase that ends with their turn (`until: { allyTurn: true }`:
          // Ves catching her umbrella) goes on to the next one straight after.
          const ends = this.bossPhase().until?.allyTurn;
          const next = ends ? () => this.nextBossPhase(this.phased, 'taunt', true) || this.setPhase('taunt') : 'taunt';
          this.showMessage(said[Math.min(this.flame?.stage ?? 0, said.length - 1)], next);
          return;
        }
        // What the panel says while they choose (a boss's phase can have its own).
        const own = this.phased ? textFile(this.phased.data.textFile)[`${this.ally.id}_turn: ${this.bossPhase().id}`] : null;
        const lines = own?.length ? own : this.allyLines(this.ally, 'turn');
        this.allyPrompt = lines.length ? lines[Math.floor(Math.random() * lines.length)] : `${this.ally.name}'s turn.`;
        break;
      }
      case 'bossIntro':
        this.taunt = null;
        break;
      case 'command': {
        this.actor = this.hero;
        // A new round: every ally gets a turn after yours.
        this.pendingAllies = this.party.filter((member) => member.ally && member.hp > 0);
        // Knocked down, you sit it out and your friends act without you.
        if (this.hero.hp <= 0) {
          this.setPhase('taunt');
          return;
        }
        // Each turn, a different enemy sets the scene.
        const active = this.activeFoes();
        const foe = active[this.turn % active.length];
        const flavor = this.foeLines(foe, 'flavor');
        this.flavor = flavor[Math.floor(this.turn / active.length) % flavor.length];
        // Unless one of them is worn out or ready to be spared, and says so.
        this.flavor = this.wornFlavor(active) ?? this.flavor;
        break;
      }
      case 'talk':
      case 'spells':
      case 'items':
      case 'target':
      case 'member':
        this.cursor = 0;
        break;
      case 'fight':
        // An ally swings with the same bar, in their own colour; your FIGHT
        // skills are yours alone (theirs add slashes with `allySlashes`).
        this.striker = this.actor;
        this.strike = new StrikeBar(this.target.center.x * S, this.target.center.y * S, this.actor.ally ? {
          extraSlashes: this.allySlashes(this.actor),
          color: this.bossPhase()?.allyFight?.[this.actor.id]?.color ?? this.actor.color,
          // Their slash marks in their own colour, a shade brighter so they
          // show on the dark bar (Ves purple, Bramble orange).
          slashColor: ALLY_SLASH_COLORS[this.actor.id] ?? this.actor.color,
        } : {
          extraSlashes: skillBonus('strikeSlashes'),
          toleranceScale: 1 + skillBonus('strikeTolerance'),
          color: this.hero.color,
        });
        break;
      case 'taunt': {
        this.strike = null;
        this.attackers = this.chooseAttackers();
        // Each picks its attack now, so what it says can be about it.
        for (const foe of this.attackers) foe.nextPattern = this.pickPattern(foe);
        this.speaker = this.attackers[Math.floor(Math.random() * this.attackers.length)];
        // A taunt written over several lines is said one bubble at a time.
        const taunts = this.tauntLines(this.speaker);
        this.setBubbles([taunts[Math.floor(Math.random() * taunts.length)]]);
        this.nextBubble();
        this.tauntStart = 0;
        this.tauntSkipped = false;
        break;
      }
      case 'dodge':
        this.startAttack();
        break;
    }
  }

  // What it says before its attack: its [taunts]; but often, low on HP
  // (below its phase's `lowHp`), one of its [low_hp]; or a line for the
  // attack it's about to make ([taunt: <attack name>]); or, with its MERCY at
  // half or more, one of [mercy_high]; or, hit since its last attack, one of
  // [hurt]. Each can be per phase, as ever ([hurt: alive]).
  tauntLines(foe) {
    const wasHit = foe.hitSince;
    foe.hitSince = false;
    // (Most enemies have none of these sections, and asking for a missing
    // one is an error; so only ask when it's there.)
    const file = textFile(foe.data.textFile);
    const phaseId = this.bossPhase(foe)?.id;
    const has = (section) => Boolean(file[section]?.length || (phaseId && file[`${section}: ${phaseId}`]?.length));
    const low = this.bossPhase(foe)?.lowHp ?? foe.data.lowHp;
    const tries = [
      [low && foe.hp <= foe.maxHp * low, 0.45, 'low_hp'],
      [foe.nextPattern, 0.6, `taunt: ${foe.nextPattern}`],
      [foe.calm >= 50, 0.4, 'mercy_high'],
      [wasHit, 0.5, 'hurt'],
    ];
    for (const [when, chance, section] of tries) {
      if (!when || !has(section) || Math.random() >= chance) continue;
      const lines = this.foeLines(foe, section);
      if (lines.length) return lines;
    }
    return this.foeLines(foe, 'taunts');
  }

  // Up to MAX_ATTACKERS of the enemies still standing, in a random order.
  chooseAttackers() {
    const shuffled = [...this.activeFoes()].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, MAX_ATTACKERS);
  }

  // Picks a weighted random attack for one enemy, never the same one twice in a row.
  pickPattern(foe) {
    // A phase's `finale` ({ below, pattern }): the attack it saves for when
    // the boss's HP drops below that share, played once. (`music`: the song
    // it cuts to then, for the rest of the fight: Peptup's "Upside Down";
    // with `musicFrom`, at one of its sections, even if it's already playing:
    // the Pale Olm's shatter.)
    const finale = this.bossPhase(foe)?.finale;
    if (finale && !foe.finaleDone && foe.hp < foe.maxHp * finale.below) {
      foe.finaleDone = true;
      if (finale.music) music.play(finale.music, null, finale.musicFrom ?? null);
      return finale.pattern;
    }
    const all = this.bossPhase(foe)?.patterns ?? foe.data.patterns;
    const options = all.length > 1 ? all.filter((p) => p.name !== foe.lastPattern) : all;
    const total = options.reduce((sum, p) => sum + (p.weight ?? 1), 0);
    let roll = Math.random() * total;
    for (const option of options) {
      roll -= option.weight ?? 1;
      if (roll <= 0) return option.name;
    }
    return options[options.length - 1].name;
  }

  // How long this foe's turn should be, in seconds (TURN_SECONDS).
  turnTarget(foe) {
    const phase = this.bossPhase(foe);
    const own = phase && 'turnSeconds' in phase ? phase.turnSeconds : foe.data.turnSeconds;
    if (own !== undefined) return own ?? 0;
    const chapters = Object.keys(TURN_SECONDS).map(Number);
    const chapter = Math.min(Math.max(WORLD_STATE.chapter ?? 1, chapters[0]), Math.max(...chapters));
    return TURN_SECONDS[chapter][foe.data.boss ? 1 : 0];
  }

  // Tops a turn up to its full length: while the attacks end short of it, as
  // the last winds down another of the monster's own attacks comes in (in a
  // group, each attacker in turn), a little lighter, and not one it's already
  // used this turn while it has others. Adds them to `attacks`.
  fillTurn(attacks) {
    const target = Math.max(...this.attackers.map((foe) => this.turnTarget(foe)));
    const end = (attack) => attack.delay + attack.pattern.duration;
    const used = new Map(this.attackers.map((foe) => [foe, attacks.filter((a) => a.foe === foe).map((a) => a.name)]));
    for (let piece = 0; piece < 8; piece++) {
      const last = attacks.reduce((a, b) => (end(b) > end(a) ? b : a));
      if (end(last) >= target - TURN_FILL_SLACK) return;
      const foe = this.attackers[(piece + 1) % this.attackers.length];
      const tuning = attacks.find((a) => a.foe === foe && a.tuning)?.tuning;
      const all = (this.bossPhase(foe)?.patterns ?? foe.data.patterns).filter((p) => p.layer !== false && (p.weight ?? 1) > 0);
      const seen = used.get(foe);
      const fresh = all.filter((p) => !seen.includes(p.name));
      const options = fresh.length ? fresh : all.filter((p) => p.name !== seen[seen.length - 1]);
      if (!tuning || !options.length) return;
      const name = options[Math.floor(Math.random() * options.length)].name;
      seen.push(name);
      const start = last.delay + last.pattern.duration * TURN_FILL_AT;
      const more = createPattern(name, hud.BOX, { ...tuning, density: tuning.density * TURN_FILL_DENSITY });
      // (Not a special soul-mode attack: that takes a whole turn to itself.)
      if (more.mode !== 'normal') continue;
      more.duration = Math.min(more.duration, Math.max(TURN_FILL_MIN_SECONDS, target - start));
      attacks.push({ foe, pattern: more, delay: start, beat: true, name, tuning });
    }
  }

  startAttack() {
    boxHome();
    for (const foe of this.attackers) {
      foe.attackAt = this.time;
      // (Its tell, if its `feel` has one: foeFeel.js.)
      feelWindup(this, foe);
    }
    const crowd = this.attackers.length > 1 ? COMBINED_DENSITY : 1;
    // A TALK with `soothe` (Haddock's bell) makes this attack gentler.
    const soothe = this.calmNext ?? null;
    this.calmNext = null;
    // A phase's stage effects can put the sea in the box (Corrie's tide):
    // handed to the attack as `tools.sea`, once a turn.
    const sea = this.stageFx?.sea?.(this, Boolean(soothe)) ?? null;
    let attacks = this.attackers.flatMap((foe, i) => {
      const name = foe.nextPattern ?? this.pickPattern(foe);
      foe.nextPattern = null;
      foe.lastPattern = name;
      // (A phase's finale can keep its own `difficulty`, tuned apart from the
      // phase's other attacks.)
      const finale = this.bossPhase(foe)?.finale;
      const pinned = name === finale?.pattern ? finale.difficulty : null;
      const { density = 1, speed = 1 } = pinned ?? this.bossPhase(foe)?.difficulty ?? foe.data.difficulty ?? {};
      // A `gentle` foe doesn't really want to hurt you: its attacks thin out a
      // little as its MERCY rises, and when you're nearly out of HP.
      let kindness = 1;
      if (this.bossPhase(foe)?.gentle ?? foe.data.gentle) {
        kindness = 1 - (foe.calm / 100) * 0.4;
        if (this.hero.hp < this.hero.maxHp * 0.3) kindness *= 0.65;
      }
      const tuning = {
        density: density * crowd * kindness * (soothe?.density ?? 1), speed: speed * (soothe?.speed ?? 1), flame: this.flameInBox() ? this.flame : null, sea,
      };
      const attack = { foe, pattern: createPattern(name, hud.BOX, tuning), delay: i * SECOND_ATTACKER_DELAY, name, tuning };
      const phase = this.bossPhase(foe);
      const isFinale = name === finale?.pattern;
      attack.finale = isFinale;
      // Another of its attacks than `name` (and not one marked `layer: false`,
      // too much to have on top of another), for secondWind and encore.
      const another = () => {
        const others = (phase?.patterns ?? foe.data.patterns).filter((p) => p.name !== name && p.layer !== false);
        return others.length ? others[Math.floor(Math.random() * others.length)].name : null;
      };
      const out = [attack];
      // An `encore` ({ at, seconds, density }) makes its turn longer: as the
      // first attack winds down (`at`, a share of its length) a second of its
      // attacks starts, a little lighter, and runs `seconds` more. Only when
      // it's attacking alone (two at once already fill the box), and never
      // after a finale or with Haddock's bell soothing it.
      const encore = phase && 'encore' in phase ? phase.encore : foe.data.encore;
      const next = encore && !soothe && !isFinale && this.attackers.length === 1 ? another() : null;
      if (next) {
        const more = createPattern(next, hud.BOX, { ...tuning, density: tuning.density * (encore.density ?? 0.85) });
        more.duration = Math.min(more.duration, encore.seconds ?? more.duration);
        out.push({ foe, pattern: more, delay: attack.delay + attack.pattern.duration * (encore.at ?? 0.85), beat: true, name: next });
      }
      // A boss with `secondWind` gets desperate when its HP drops below that
      // share of its max: it layers a second, different attack on top of the first.
      // (A regular enemy can have one too: chapter 5's coast monsters do.)
      // (A phase can have its own, or `secondWind: null` for none.)
      const secondWind = phase && 'secondWind' in phase ? phase.secondWind : foe.data.secondWind;
      if (!secondWind || soothe || foe.hp >= foe.maxHp * secondWind.below) return out;
      // (A regular enemy's secondWind is for when it's fought alone: with two
      // attacking at once, four attacks in the box would be too many.)
      if (!foe.data.boss && this.attackers.length > 1) return out;
      // (Nothing is layered on a finale: it has the stage to itself.)
      const extra = isFinale ? null : another();
      if (!extra) return out;
      const layered = createPattern(extra, hud.BOX, { ...tuning, density: tuning.density * (secondWind.density ?? 0.6) });
      return [attack, { foe, pattern: layered, delay: attack.delay + (secondWind.delay ?? 1), beat: true, name: extra }, ...out.slice(1)];
    });
    // A boss's special soul mode takes the whole turn to itself.
    const special = attacks.find((attack) => attack.pattern.mode !== 'normal');
    if (special) attacks = [{ ...special, delay: 0 }];
    // A turn runs its full length (TURN_SECONDS): not a special one, a
    // finale, or one Haddock's bell is soothing.
    else if (!soothe && !attacks.some((attack) => attack.finale)) this.fillTurn(attacks);
    this.attacks = attacks;
    // Each enemy turn is aimed at one of you still standing, the hero or a
    // friend, and its hits land on them (see hurt).
    // (Not whoever's hiding in the leaves: Bramble's HIDE. Nor anyone hurt,
    // like Ves riding on your back in the Lantern Marsh: they get at her
    // through you, unless there's nobody else left.)
    const standing = this.party.filter((member) => member.hp > 0);
    const findable = standing.filter((member) => member.id !== this.hiding && !(member.ally && isHurt(member.id)));
    const aimable = findable.length ? findable : standing;
    this.victim = aimable[Math.floor(Math.random() * aimable.length)];
    // The lantern's flame: fresh guard for the turn (more each time it's been
    // snuffed, and from guarding it); while it's in the box, Ves is out of
    // reach at the lantern, so it's all aimed at you. Staring him down
    // (`provoke`) turns this turn's snuffers on you instead.
    this.provokedTurn = this.provoked;
    this.provoked = false;
    if (this.flameInBox()) {
      this.flame.guard = this.bossPhase().flame.guard + this.flame.help + this.flameGuardBonus;
      this.flame.lost = false;
      if (this.hero.hp > 0) this.victim = this.hero;
    }
    this.flameGuardBonus = 0;
    this.turnLength = Math.max(...attacks.map((attack) => attack.delay + attack.pattern.duration));
    // Bramble's HOLLER: they flinch, and the attack stops short.
    if (this.flinch) {
      this.turnLength *= 1 - this.flinch;
      this.flinch = 0;
    }
    const mode = attacks[0].pattern.mode;

    this.bullets = [];
    this.sparks = [];
    this.dodgeTime = 0;
    // SHELTER with a `gust` weapon: the bullets start out slowed.
    this.gustLeft = this.shelter?.gust ?? 0;
    this.gustShown = false;
    // CALL OUT: slowed at the start, and the panel says what she shouted.
    const caller = this.callOut?.hp > 0 ? this.callOut : null;
    this.callOut = null;
    this.callOutLeft = caller ? CALL_OUT_SECONDS : 0;
    // The weapon ability starts every enemy turn ready and fully charged.
    this.abilityCooldown = 0;
    this.abilityLeft = 0;
    this.abilityUses = 0;
    this.abilityState = {};
    this.abilityPending = false;
    this.abilityBuffered = 0;
    this.grazeMultiplier = 1;

    const box = hud.BOX;
    const startY = mode === 'heavy' ? box.y + box.h : box.y + box.h / 2;
    this.soul.reset(box.x + box.w / 2, startY, mode);
    // SAIL: the wind carries the party past the first part of the attack.
    if (this.sailSeconds > 0) {
      this.soul.untouchable = this.sailSeconds;
      this.sailSeconds = 0;
    }

    // Explain a soul mode or weapon ability the first time it shows up.
    this.dodgeHint = '';
    if (!this.seenModes.has(mode)) {
      this.dodgeHint = this.soul.mode.hint;
    } else if (this.flameInBox() && !this.flameHintShown) {
      this.dodgeHint = this.foeLine(this.phased, 'flame_hint');
      this.flameHintShown = true;
    } else if (this.ability && !this.abilityHintShown) {
      this.dodgeHint = this.ability.hint;
      this.abilityHintShown = true;
    }
    this.seenModes.add(mode);
    // What she shouted (unless a new soul mode needs explaining).
    if (caller && !(this.dodgeHint && this.dodgeHint === this.soul.mode.hint)) {
      const shouts = this.allyLines(caller, 'call_out');
      const shout = shouts[Math.floor(Math.random() * shouts.length)] ?? `${caller.name} shouts a warning!`;
      this.dodgeHint = shout.replaceAll('{foe}', this.attackers[0]?.name ?? 'it');
    }
    // A phase's stage effects can set rules for the turn (Madam Fairweather's
    // listing deck and her waltz: they move the shadow, soul.mover).
    this.stageFx?.turnStart?.(this);
  }

  // Ends the battle. onEnd also hears how each enemy left: [{ enemy, state }],
  // where state is 'defeated', 'pacified' or (fled, or lost) 'active'; and,
  // after a fall, the boss phase's own GAME OVER line if it has one.
  finish(result) {
    if (this.finished) return;
    this.finished = true;
    // What you leave with is what you'll have next time; a fall brings you
    // back whole (unless a level-up already did).
    if (result === 'death') healHeroFully();
    else if (!this.levelledUp) {
      setHeroHp(Math.max(1, this.hero.hp));
      // A friend who was knocked down gets up with 1 HP.
      for (const member of this.party.filter((other) => other.ally)) setMemberHp(member.id, Math.max(1, member.hp));
    }
    const phase = this.bossPhase();
    const gameOver = result === 'death' && phase?.gameOver ? textSection(this.phased.data.textFile, phase.gameOver)[0] : undefined;
    this.onEnd(result, this.foes.map((foe) => ({ enemy: foe.data, state: foe.state })), gameOver);
  }

  update(dt, input) {
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
    // Time played, kept apart from playSeconds (the clock the sun runs on), which a
    // cutscene's `time` step can set. An old save starts it from the clock.
    WORLD_STATE.timePlayed = (WORLD_STATE.timePlayed ?? WORLD_STATE.playSeconds ?? 0) + dt;
    // A SHIFT press on the enemies' turn is kept until updateAbility reads it,
    // even on a frame that goes no further (a hit stop, the box still opening).
    if (this.phase === 'dodge' && input.wasPressed('ability')) this.abilityPending = true;
    // The hit stop on a boss's last blow: everything holds still.
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      return;
    }
    this.time += dt;
    this.phaseTime += dt;
    this.shake = Math.max(0, this.shake - dt);
    if (this.fx.update(dt)) this.shake = SHAKE_SECONDS * 2;
    this.heroFlinch = Math.max(0, this.heroFlinch - dt);
    this.stageFlash = Math.max(0, (this.stageFlash ?? 0) - dt);
    this.slashTime = Math.max(0, this.slashTime - dt);
    for (const foe of this.foes) {
      // A new flash is a new hit: its hurt frames, and chips off it.
      if (foe.flash > foe.seenFlash + 1e-6) this.foeHit(foe);
      // Drips, sparks, bubbles off it while it stands there (its `feel`).
      if (this.phase !== 'bossIntro') feelTick(this, foe, dt);
      foe.flash = Math.max(0, foe.flash - dt);
      foe.seenFlash = foe.flash;
      foe.chips = foe.chips.filter((chip) => this.time - chip.at < CHIP_LIFE);
      this.shuffleName(foe);
      // HP climbing back (a phase's `renew`).
      if (foe.renew) {
        foe.renew.at = Math.min(foe.renew.to, (foe.renew.at ?? foe.hp) + foe.renew.rate * dt);
        foe.hp = Math.max(foe.hp, Math.round(foe.renew.at));
        if (foe.renew.at >= foe.renew.to) foe.renew = null;
      }
      // All through its death, bits keep falling off it.
      if (foe.state === 'defeated' && foe.anim?.chips && this.time - foe.leftAt < clipLength(foe.anim.death) && Math.random() < dt * 14) this.addChips(foe, 1, true);
      // Spared, soft lights rise off it a while.
      if (foe.state === 'pacified' && this.time < foe.glowUntil && Math.random() < dt * (foe.data.boss ? 22 : 10)) {
        const w = foe.sprite.width * SCALE;
        const h = foe.sprite.height * SCALE;
        this.bits.mote(foe.pos.x + w * (0.15 + Math.random() * 0.7), Math.max(8, foe.pos.y + h * (0.3 + Math.random() * 0.6)), { vy: -16 - Math.random() * 20, life: 1.2 + Math.random() * 0.8 });
      }
    }
    this.bits.update(dt);
    // HP bars' ghosts, dust off the fallen (battleFeel.js).
    feel.feelUpdate(this, dt);
    this.updateEffects(dt);
    this.moves.update(this);
    this.stageFx?.update?.(this, dt);

    switch (this.phase) {
      case 'hold':
        // A beat's pause: the stage holds a moment, nothing said.
        if (this.phaseTime >= this.holdFor) this.holdNext();
        break;
      case 'message':
        if (input.wasPressed('confirm')) this.advanceMessage();
        break;
      case 'command':
        this.updateCommand(input);
        break;
      case 'target':
        this.updateTarget(input);
        break;
      case 'talk':
        this.updateTalk(input);
        break;
      case 'spells':
        this.updateSpells(input);
        break;
      case 'items':
        this.updateItems(input);
        break;
      case 'member':
        this.updateMember(input);
        break;
      case 'ally':
        this.updateAlly(input);
        break;
      case 'interject':
        this.interjection.box.update(dt, input);
        if (!this.interjection.box.isOpen) {
          const { next } = this.interjection;
          if (typeof next === 'function') next();
          else this.setPhase(next);
        }
        break;
      case 'fight': {
        const result = this.strike.update(dt, input);
        if (result) this.resolveStrike(Math.round(result.damage * this.strikePower()), 'fight');
        break;
      }
      case 'fightResult':
        this.strike?.update(dt, input);
        if (this.phaseTime >= 0.9) {
          // Through smoke: the panel says so.
          const smoke = this.smokeLine;
          this.smokeLine = null;
          if (this.target.hp <= 0) this.foeLeaves(this.target, 'defeated', 'taunt');
          else if (smoke) this.showMessage(smoke, 'taunt');
          else this.setPhase('taunt');
        }
        break;
      case 'taunt':
      case 'speech':
        this.updateTaunt(input);
        break;
      case 'bossIntro':
        this.updateBossIntro(input);
        break;
      case 'bossFinale':
        this.updateBossFinale();
        break;
      case 'snap':
        this.updateSnap();
        break;
      case 'dodge':
        this.updateDodge(dt, input);
        break;
      case 'defeat':
        if (this.phaseTime >= DEFEAT_SECONDS) this.finish('death');
        break;
    }
  }

  updateEffects(dt) {
    for (const spark of this.sparks) {
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.life -= dt;
    }
    this.sparks = this.sparks.filter((spark) => spark.life > 0);
    for (const popup of this.popups) popup.t += dt;
    this.popups = this.popups.filter((popup) => popup.t < POPUP_SECONDS);

    // Aura motes drift up from the hero's feet.
    for (const mote of this.motes) {
      mote.y += mote.vy * dt;
      mote.x += Math.sin(mote.life * 6 + mote.phase) * 4 * dt;
      mote.life -= dt;
    }
    this.motes = this.motes.filter((mote) => mote.life > 0);
    this.moteTimer -= dt;
    if (this.moteTimer <= 0 && this.phase !== 'defeat') {
      this.moteTimer += AURA_MOTE_INTERVAL;
      this.motes.push({
        x: PARTY_FEET.x + (Math.random() - 0.5) * 22,
        y: PARTY_FEET.y - Math.random() * 6,
        vy: -(14 + Math.random() * 18),
        life: AURA_MOTE_LIFE,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  // `next` is a phase name, 'exit' to end the battle, or a function to run.
  advanceMessage() {
    if (this.message.page < this.message.pages.length - 1) {
      this.message.page++;
      this.message.text = this.message.pages[this.message.page];
      return;
    }
    const { next } = this.message;
    if (typeof next === 'function') next();
    else if (next === 'exit') this.finish(this.result);
    else this.setPhase(next);
  }

  gainSp(amount) {
    this.sp = Math.min(100, this.sp + amount);
  }

  // What running away says: something about where you are ([escape: area]
  // in text/battle.txt, the area being where the fight is: 'cave', 'stair',
  // 'vigil' and so on), one picked at random.
  escapeLine() {
    // (An area without its own lines yet gets the ruins' ones, not a crash.)
    const pool = textFile('battle.txt')[`escape: ${this.area}`]?.length ? textSection('battle.txt', `escape: ${this.area}`) : textSection('battle.txt', 'escape: ruins');
    return pool[Math.floor(Math.random() * pool.length)] ?? 'You got away!';
  }

  // The command bar of whoever is choosing: yours, or the ally's.
  menuPhase() {
    return this.actor?.ally ? 'ally' : 'command';
  }

  // FIGHT's multiplier for whoever is swinging: your weapon and skills, or
  // the ally's own weapon (src/characters/equipment.js).
  strikePower() {
    // An ally's weapon, and how far they've grown with the hero's levels.
    if (this.actor?.ally) {
      const power = this.allyWeaponPower(this.actor) * (1 + memberGrowth(this.actor.id, 'fight')) * (1 + this.allyBonus(this.actor, 'allyFight'));
      const sneak = this.sneakPower(this.actor);
      this.spendSneak(this.actor);
      return power * sneak;
    }
    return this.weapon.fightPower * this.fightPowerBonus;
  }

  // Extra slashes in an ally's FIGHT, from their own skills (Ves's Quick Jab,
  // Bramble's Backswing).
  allySlashes(ally) {
    return memberSkillBonus(ally.id, 'allySlashes');
  }

  // An ally's move made stronger by their skills (skillBonus) and their own
  // weapon and armor (memberGearBonus).
  allyBonus(ally, effect) {
    return memberSkillBonus(ally.id, effect) + memberGearBonus(ally.id, effect) + memberGrowth(ally.id, effect);
  }

  // The MERCY one of an ally's calming moves gives each foe: its own amount,
  // raised by a percent for each point of their calming bonus (skills, gear,
  // growth: +50 is half as much again), then their outfit's MAG. (A flat
  // bonus on every calming move made a 12 SP FLURRY worth over 100%.)
  allyCalmAmount(ally, base) {
    if (!base) return 0;
    return spellMercy(base * Math.max(0.25, 1 + this.allyBonus(ally, 'allyCalm') / 100));
  }

  // Bramble's sneak attack, after he HIDES: his next hit is SNEAK_POWER times
  // as hard (more with his skills and gear), once. 1 for anyone else.
  // From chapter 5 on, a sneak attack with one of his attack spells (`spell`)
  // is only SNEAK_POWER times as hard: his skills and gear sharpen the sneak
  // FIGHT. (With all of them, THE BIG ONE out of the leaves was over x5, and
  // took a boss's whole phase in one swing.)
  sneakPower(member, spell = false) {
    if (!member?.ally || this.sneaking !== member.id) return 1;
    if (spell && (WORLD_STATE.chapter ?? 1) >= SNEAK_SPELL_CHAPTER) return SNEAK_POWER;
    return SNEAK_POWER + this.allyBonus(member, 'sneak');
  }

  // SP from one of a friend's moves (ZEPHYR, WHISTLE...): its own `sp` plus
  // their allySp. From chapter 5 on, what's past ALLY_SP_SOFT_FROM counts a
  // third: with every SP skill and gear, ZEPHYR (free) filled the whole bar
  // every round, and a big spell every turn left FIGHT nothing to do.
  allySpGift(ally, base) {
    const amount = Math.max(0, base + this.allyBonus(ally, 'allySp'));
    if ((WORLD_STATE.chapter ?? 1) < ALLY_SP_SOFT_CHAPTER || amount <= ALLY_SP_SOFT_FROM) return amount;
    return Math.round(ALLY_SP_SOFT_FROM + (amount - ALLY_SP_SOFT_FROM) / 3);
  }

  // Spends the sneak attack, with a cheer over the target.
  spendSneak(member) {
    if (!member?.ally || this.sneaking !== member.id) return;
    this.sneaking = null;
    this.addPopup('SNEAK ATTACK!', this.target?.center?.x ?? 200, (this.target?.pos?.y ?? 60) - 18, hud.COLORS.calm);
  }

  updateCommand(input) {
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (dir) sfx('move');
    this.selected = (this.selected + dir + COMMANDS.length) % COMMANDS.length;
    if (!input.wasPressed('confirm')) return;
    sfx('select');

    switch (COMMANDS[this.selected].label) {
      case 'FIGHT':
        this.chooseTarget(() => this.setPhase('fight'));
        break;
      case 'TALK':
        this.chooseTarget(() => this.setPhase('talk'));
        break;
      case 'SPELLS':
        this.setPhase('spells');
        break;
      case 'ITEMS':
        if (this.items.length) this.setPhase('items');
        else this.showMessage('Your bag is empty.', 'command');
        break;
      case 'DEFEND': {
        this.defending = true;
        // (Calm Mind: more SP for bracing.)
        const sp = DEFEND_SP + skillBonus('defendSp');
        this.gainSp(sp);
        let text = `${this.hero.name} braces. Damage is halved this turn.\nSP +${sp}%`;
        const heal = skillBonus('defendHeal');
        if (heal) {
          this.healHero(heal);
          text += `, HP +${heal}`;
        }
        this.showMessage(text, 'taunt');
        break;
      }
      case 'RUN':
        this.tryToRun();
        break;
    }
  }

  // Healing goes to someone in the party: with just you, straight to you;
  // otherwise it asks who. A friend who's down can be healed back up.
  chooseMember(action) {
    if (this.party.length === 1) {
      action(this.hero);
      return;
    }
    this.memberAction = action;
    this.setPhase('member');
  }

  updateMember(input) {
    const index = this.pickFromList(input, this.party.length);
    if (index === null) return;
    this.memberAction(this.party[index]);
  }

  // Heals `member` by `amount`, picking them back up if they were down.
  // Returns the HP they got back.
  healMember(member, amount) {
    const before = member.hp;
    member.hp = Math.min(member.maxHp, member.hp + Math.max(0, amount));
    if (before <= 0 && member.hp > 0) {
      const feet = this.memberFeet(member);
      this.addPopup('UP!', feet.x, feet.y - 62, hud.COLORS.enemyHp);
    }
    return member.hp - before;
  }

  // With one enemy left, acts on it straight away; otherwise asks which one first.
  chooseTarget(action) {
    const active = this.activeFoes();
    if (active.length === 1) {
      this.target = active[0];
      action(this.target);
      return;
    }
    this.targetAction = action;
    this.setPhase('target');
  }

  updateTarget(input) {
    const active = this.activeFoes();
    if (input.wasPressed('cancel')) {
      sfx('back');
      this.setPhase(this.menuPhase());
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = Math.min(active.length - 1, this.cursor + 1);
    if (input.wasPressed('up')) this.cursor = Math.max(0, this.cursor - 1);
    if (this.cursor !== before) sfx('move');
    if (!input.wasPressed('confirm')) return;
    sfx('select');
    this.target = active[this.cursor];
    this.targetAction(this.target);
  }

  // The boss you're fighting, if this is a boss fight.
  bossFight() {
    return this.activeFoes().find((foe) => foe.data.boss) ?? null;
  }

  tryToRun() {
    // There's no running from a boss. Trying doesn't cost you your turn.
    const boss = this.bossFight();
    if (boss) {
      this.showMessage(textFile(boss.data.textFile).no_escape?.[0] ?? `You can't run from ${boss.name}.`, 'command');
      return;
    }
    if (this.noRun) {
      this.showMessage(typeof this.noRun === 'string' ? this.noRun : "You can't run from this one.", 'command');
      return;
    }
    const chance = Math.min(RUN_MAX_CHANCE, RUN_BASE_CHANCE + this.turn * RUN_CHANCE_PER_TURN);
    if (Math.random() < chance) {
      this.result = 'fled';
      sfx('flee');
      this.showMessage(this.escapeLine(), 'exit');
    } else {
      const active = this.activeFoes();
      const who = active.length === 1 ? active[0].name : 'The enemies';
      this.showMessage(`${who} block${active.length === 1 ? 's' : ''} your escape!`, 'taunt');
    }
  }

  // Options sit in two columns: left/right picks the column, up/down the row.
  moveGridCursor(input, length) {
    let cursor = this.cursor;
    if (input.wasPressed('right') && cursor % 2 === 0 && cursor + 1 < length) cursor++;
    if (input.wasPressed('left') && cursor % 2 === 1) cursor--;
    if (input.wasPressed('down') && cursor + 2 < length) cursor += 2;
    if (input.wasPressed('up') && cursor >= 2) cursor -= 2;
    this.cursor = cursor;
  }

  // Shared handling for the pick lists. Returns the chosen index, or null.
  pickFromList(input, length) {
    if (input.wasPressed('cancel')) {
      sfx('back');
      this.setPhase(this.menuPhase());
      return null;
    }
    const before = this.cursor;
    this.moveGridCursor(input, length);
    if (this.cursor !== before) sfx('move');
    if (!input.wasPressed('confirm')) return null;
    sfx('select');
    return this.cursor;
  }

  // Raises a foe's MERCY (stored as `calm`), noting when it's ready to be pacified.
  calmFoe(foe, amount, text) {
    // Kind Word: every kindness goes further.
    amount = Math.round(amount * (1 + skillBonus('mercyBoost')));
    foe.calm = Math.min(100, foe.calm + amount);
    let result = `${text}\n${foe.name} MERCY +${amount}%`;
    if (foe.calm >= 100) result += ` - it seems peaceful now.`;
    return result;
  }

  // Some enemies can't be shown mercy: `noMercy: { who }` names the party
  // member who stops you (the Roost Mother, and Ves). Any calming TALK,
  // spell or candle aimed at them is stopped before it costs anything, and
  // that member says why in a dialogue box with their portrait: the first
  // time, all of [no_mercy] in the enemy's text file; after that, one of
  // [no_mercy_again]. Then whoever was choosing chooses again. Returns
  // whether it stepped in.
  refuseMercy(foe) {
    const rule = foe ? this.mercyRule(foe) : null;
    if (!rule) return false;
    const lines = textFile(foe.data.textFile);
    // Whoever would stop you is knocked out: the panel says no instead
    // ([no_mercy_down]).
    if (this.downAllies().some((member) => member.id === rule.who)) {
      sfx('back');
      const back = this.menuPhase();
      this.showMessage(lines.no_mercy_down?.[0] ?? `${foe.name} isn't ready for that. Not yet.`, back);
      return true;
    }
    // `who: 'foe'`: it mocks you itself, in its bubbles ([mercy_mock], then
    // one of [mercy_mock_again]).
    if (rule.who === 'foe') {
      // `snap`: the first try, it reaches down, takes the MERCY bar, and
      // breaks it in two (Peptup's last act). There's no bar after that.
      if (rule.snap && !foe.mercySnapped) {
        this.snapMercy(foe);
        return true;
      }
      const id = this.bossPhase(foe)?.id;
      const mocks = lines[`mercy_mock_again: ${id}`] ?? lines.mercy_mock_again ?? [];
      const said = this.mercyRefused && mocks.length ? [mocks[Math.floor(Math.random() * mocks.length)]] : (lines[`mercy_mock: ${id}`] ?? lines.mercy_mock ?? []);
      if (!said.length) return false;
      this.mercyRefused = true;
      sfx('back');
      const back = this.menuPhase();
      this.sayAloud(foe, said, () => this.setPhase(back));
      return true;
    }
    const id = this.bossPhase(foe)?.id;
    const again = lines[`no_mercy_again: ${id}`] ?? lines.no_mercy_again ?? [];
    const pages = this.mercyRefused && again.length ? [again[Math.floor(Math.random() * again.length)]] : (lines[`no_mercy: ${id}`] ?? lines.no_mercy ?? []);
    if (!pages.length) return false;
    this.mercyRefused = true;
    const box = new TextBox();
    box.open(pages, partyIds().includes(rule.who) ? rule.who : null);
    sfx('back');
    this.interjection = { box, next: this.menuPhase() };
    this.setPhase('interject');
    return true;
  }

  // The MERCY bar snapped (a `noMercy` with `snap`): it lifts off from under
  // the foe, is held up, bends, and breaks, and the halves are flung away
  // (drawn by drawMercySnap). Then [mercy_snap] in its bubbles, and back to
  // the menu.
  snapMercy(foe) {
    foe.mercySnapped = true;
    this.mercyRefused = true;
    this.snap = {
      foe, calm: foe.calm, from: { x: foe.center.x * S, y: this.foeStatusTop(foe) + 44 },
      // Where on the glass the two halves land (UI pixels).
      targets: [{ x: UI_WIDTH * 0.27 + Math.random() * 20, y: 170 + Math.random() * 30 }, { x: UI_WIDTH * 0.73 - Math.random() * 20, y: 270 + Math.random() * 30 }],
      creaked: false, broke: false,
    };
    foe.calm = 0;
    sfx('back');
    this.setPhase('snap');
  }

  updateSnap() {
    const snap = this.snap;
    const t = this.phaseTime;
    const hold = { x: snap.foe.center.x, y: snap.foe.center.y - 20 / S };
    if (t >= MERCY_SNAP.grab && !snap.grabbed) {
      snap.grabbed = true;
      sfx('clack');
    }
    if (t >= MERCY_SNAP.bend && !snap.creaked) {
      snap.creaked = true;
      sfx('creak');
    }
    if (t >= (MERCY_SNAP.bend + MERCY_SNAP.snap) / 2 && !snap.creaked2) {
      snap.creaked2 = true;
      sfx('creak');
    }
    // THE SNAP: a flash, a knock, and the bar bursts into yellow splinters.
    if (t >= MERCY_SNAP.snap && !snap.broke) {
      snap.broke = true;
      sfx('chop');
      sfx('crumble');
      this.shake = 0.3;
      this.stageFlash = 0.12;
      this.bits.star(hold.x, hold.y, { size: 22, life: 0.25 });
      this.bits.ring(hold.x, hold.y, { speed: 120, life: 0.35, color: hud.COLORS.calm, width: 2 });
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 40 + Math.random() * 90;
        this.bits.chip(hold.x, hold.y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, color: i % 3 ? hud.COLORS.calm : hud.COLORS.calmBack, w: 2 + Math.floor(Math.random() * 3), h: 2, floor: hold.y + 60, spin: (Math.random() - 0.5) * 24 });
      }
    }
    if (t >= MERCY_SNAP.throw && !snap.thrown) {
      snap.thrown = true;
      sfx('whoosh');
    }
    // SMACK: the halves hit the glass.
    if (t >= MERCY_SNAP.hit && !snap.hit) {
      snap.hit = true;
      sfx('crumble');
      sfx('thud');
      this.shake = 0.28;
      this.stageFlash = 0.18;
      snap.glass = snap.targets.map((target) => glassCracks(target));
    }
    if (t < MERCY_SNAP.done) return;
    const back = this.menuPhase();
    const lines = textFile(snap.foe.data.textFile).mercy_snap ?? [];
    this.snap = null;
    if (lines.length) this.sayAloud(snap.foe, lines, () => this.setPhase(back));
    else this.setPhase(back);
  }

  // In UI space: the bar lifted up into his wooden hands, bent till it
  // creaks, snapped; then he hurls the halves at you: they come at the
  // screen, bigger and bigger, smack the glass (cracks, a yellow smear), and
  // slide down it.
  drawMercySnap(ctx) {
    const snap = this.snap;
    if (!snap) return;
    const t = this.phaseTime;
    const M = MERCY_SNAP;
    const hold = { x: snap.foe.center.x * S, y: snap.foe.center.y * S - 20 };
    const w = 100;
    const h = 8;
    const ease = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 2;
    const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
    // A length of the bar drawn from `from` to `to` (0 to w along it), about
    // (cx, cy) turned `angle`, its yellow where the MERCY was; `scale` blows
    // it up for the throw.
    const piece = (cx, cy, angle, from, to, scale = 1, squash = 1) => {
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy));
      ctx.rotate(angle);
      ctx.scale(scale, scale * squash);
      const left = -w / 2 + from;
      ctx.fillStyle = hud.COLORS.outline;
      ctx.fillRect(left - 2, -h / 2 - 2, to - from + 4, h + 4);
      ctx.fillStyle = hud.COLORS.calmBack;
      ctx.fillRect(left, -h / 2, to - from, h);
      const filled = Math.max(0, Math.min(to, (w * snap.calm) / 100) - from);
      ctx.fillStyle = hud.COLORS.calm;
      ctx.fillRect(left, -h / 2, filled, h);
      // A pale lip along the top, so it shines.
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(left, -h / 2, to - from, 2);
      ctx.restore();
    };
    // One of the broken halves (0 left, 1 right) as the pixel-art canvas:
    // its centre at (cx, cy), turned `angle`, blown up `scale` with hard
    // pixels and no blur.
    const half = (i, cx, cy, angle, scale = 1, squash = 1, alpha = 1) => {
      snap.halves ??= [makeHalf(0, snap.calm), makeHalf(1, snap.calm)];
      const img = snap.halves[i];
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha *= alpha;
      ctx.translate(Math.round(cx), Math.round(cy));
      ctx.rotate(angle);
      ctx.scale(scale, scale * squash);
      ctx.drawImage(img, -25 - HALF_PAD, -6 - HALF_PAD);
      ctx.restore();
    };
    // A wooden hand (a fist, knuckles up) and the arm it's on, from his
    // shoulder.
    const shoulders = [[hold.x - 34, hold.y + 40], [hold.x + 34, hold.y + 40]];
    const hand = (side, x, y, shut = 1) => {
      const [sx, sy] = shoulders[side];
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const ex = (sx + x) / 2 + (side ? 18 : -18);
      const ey = Math.max(sy, y) + 16;
      for (const [width, color] of [[9, '#0a0710'], [5, '#c9a06a']]) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#0a0710';
      ctx.fillRect(Math.round(x) - 8, Math.round(y) - 7, 16, 14);
      ctx.fillStyle = '#c9a06a';
      ctx.fillRect(Math.round(x) - 7, Math.round(y) - 6, 14, 12);
      ctx.fillStyle = '#e6c896';
      ctx.fillRect(Math.round(x) - 7, Math.round(y) - 6, 14, 3);
      ctx.fillStyle = '#8e6844';
      for (let i = 0; i < 3; i++) ctx.fillRect(Math.round(x) - 5 + i * 4 + (shut ? 0 : 1), Math.round(y) + 1, 2, 4);
      ctx.restore();
    };
    // Where the bar's two ends are, for a bar about (cx, cy), the halves
    // turned `a` (the left one by -a, the right by +a).
    const ends = (cx, cy, a, gap = 0) => {
      const [lx, ly] = rot(-w / 2, 0, -a);
      const [rx, ry] = rot(w / 2, 0, a);
      return [[cx + lx - gap, cy + ly], [cx + rx + gap, cy + ry]];
    };

    if (t < M.bend) {
      // Lifted up (and his hands come in to grab either end of it).
      const k = Math.min(1, t / M.grab);
      const e = ease(k);
      const bx = snap.from.x + (hold.x - snap.from.x) * e;
      const by = snap.from.y + (hold.y - snap.from.y) * e - Math.sin(k * Math.PI) * 30;
      piece(bx, by, 0, 0, w);
      const reach = ease(t / M.bend);
      const [l, r] = ends(bx, by, 0);
      hand(0, l[0] - 70 * (1 - reach), l[1] - 30 * (1 - reach));
      hand(1, r[0] + 70 * (1 - reach), r[1] - 30 * (1 - reach));
      return;
    }
    if (t < M.snap) {
      // Bent over his knee: both ends pushed down, the middle bowing up,
      // shaking more and more, stress lines white in the middle.
      const k = (t - M.bend) / (M.snap - M.bend);
      const bend = k * k * 0.5;
      const jitter = SETTINGS.shake ? 1 : 0;
      const x = hold.x + (Math.random() - 0.5) * 5 * k * jitter;
      const y = hold.y - 8 * k + (Math.random() - 0.5) * 5 * k * jitter;
      piece(x, y, -bend, 0, w / 2);
      piece(x, y, bend, w / 2, w);
      const [l, r] = ends(x, y, bend);
      hand(0, l[0], l[1], 1);
      hand(1, r[0], r[1], 1);
      if (k > 0.45) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4 + 0.6 * k;
        const n = Math.floor(3 + k * 6);
        for (let i = 0; i < n; i++) {
          const dy = (i % 2 ? -1 : 1) * (2 + i);
          ctx.beginPath();
          ctx.moveTo(x - 1 + (i % 3), y - h / 2 - 1);
          ctx.lineTo(x + 3 - (i % 4) * 2, y + dy * 0.3);
          ctx.lineTo(x - 2 + (i % 2) * 4, y + h / 2 + 1);
          ctx.stroke();
        }
        ctx.restore();
      }
      return;
    }
    // SNAPPED. For a breath the halves stay in his fists, flung apart by it
    // (a hard white flash at the break); then he winds his arms back and
    // throws them at you.
    const since = t - M.snap;
    const apart = 6 + 12 * ease(since / 0.15);
    const wind = ease((t - (M.throw - 0.35)) / 0.35);
    const go = (t - M.throw) / (M.hit - M.throw);
    if (t < M.throw) {
      const a = 0.5 + 0.2 * ease(since / 0.2);
      const x = hold.x;
      const y = hold.y - 8 + 6 * wind - 12 * wind;
      half(0, x - apart - 25 * Math.cos(a), y + 25 * Math.sin(a), -a);
      half(1, x + apart + 25 * Math.cos(a), y + 25 * Math.sin(a), a);
      const [l, r] = ends(x, y, a, apart);
      hand(0, l[0], l[1], 1);
      hand(1, r[0], r[1], 1);
      if (since < 0.2) {
        ctx.save();
        ctx.globalAlpha = 1 - since / 0.2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.round(x - 3), Math.round(y - 22), 6, 44);
        ctx.restore();
      }
      return;
    }
    // THROWN: from his hands out at the glass. Each half grows as it comes
    // (to about five times its size), turning end over end.
    if (go < 1) {
      // A short trail of where each half just was, fainter and smaller.
      for (let k = 4; k >= 0; k--) {
        const gk = Math.max(0, go - k * 0.035);
        const e = gk * gk * (3 - 2 * gk);
        snap.targets.forEach((target, i) => {
          const sx = hold.x + (i ? 18 : -18);
          const sy = hold.y - 20;
          const px = sx + (target.x - sx) * e;
          const py = sy + (target.y - sy) * e - Math.sin(gk * Math.PI) * 26;
          const size = 1 + 4.2 * gk * gk;
          // (The half's break is its centre: it turns about that.)
          half(i, px, py, (i ? 1 : -1) * (0.5 + 5.5 * gk), size, 1, k ? 0.16 * (5 - k) / 4 : 1);
        });
      }
      // His hands let go, flung open, and he swings them back out of sight.
      const away = ease((t - M.throw) / 0.3);
      hand(0, hold.x - 40 - 20 * away, hold.y - 20 + 20 * away, 0);
      hand(1, hold.x + 40 + 20 * away, hold.y - 20 + 20 * away, 0);
      return;
    }
    // SMACK, and then it slides down the glass.
    const after = t - M.hit;
    const fade = Math.max(0, 1 - Math.max(0, after - 1.1) / (M.done - M.hit - 1.1));
    // The cracks first (under what hit), going out from each impact, fading
    // at the end.
    const glass = snap.glass ?? [];
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    glass.forEach((g) => {
      const spread = Math.min(1, after / 0.12);
      ctx.globalAlpha = fade;
      for (const [width, color] of [[3, 'rgba(0, 0, 0, 0.55)'], [1, '#f4f8ff']]) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        for (const line of g.lines) {
          ctx.beginPath();
          const reach = Math.max(1, Math.floor(line.length * spread));
          for (let i = 0; i < reach; i++) (i ? ctx.lineTo(line[i][0], line[i][1]) : ctx.moveTo(line[i][0], line[i][1]));
          ctx.stroke();
        }
        if (spread >= 1) {
          for (const ring of g.rings) {
            ctx.beginPath();
            ring.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
            ctx.stroke();
          }
        }
      }
      // A white burst where it hit, there and gone.
      ctx.globalAlpha = Math.max(0, 1 - after * 5) * 0.8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(g.x, g.y, 10 + after * 90, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    snap.targets.forEach((target, i) => {
      // The half, flattened on the glass (a squash springing back), then
      // sliding down it, leaving a yellow streak and a smear round where
      // it hit.
      const squash = 0.55 + 0.45 * ease(after / 0.25);
      const slide = Math.max(0, after - 0.5);
      const drop = 300 * slide * slide;
      ctx.save();
      if (drop > 1) {
        ctx.fillStyle = hud.COLORS.calm;
        ctx.globalAlpha = 0.5 * fade;
        ctx.fillRect(Math.round(target.x - 6), Math.round(target.y), 12, Math.round(drop));
      }
      if (after < 0.7) {
        ctx.fillStyle = hud.COLORS.calm;
        ctx.globalAlpha = 0.45 * (1 - after / 0.7);
        ctx.beginPath();
        ctx.ellipse(target.x, target.y, 70 + after * 40, 26 + after * 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = fade;
      half(i, target.x, target.y + drop, (i ? 1 : -1) * 0.1, 5.2, squash);
      ctx.restore();
    });
  }

  // Whether `foe` can't be shown mercy right now: its phase's `noMercy`, or
  // its own (the Hush, until Ves has her umbrella back).
  mercyRule(foe) {
    return this.bossPhase(foe)?.noMercy ?? foe.data.noMercy ?? null;
  }

  // An ally's turn: their own command bar, like yours (ALLY_COMMANDS). Its
  // submenus back out to here; the bar itself is their go, so no backing out.
  updateAlly(input) {
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (dir) sfx('move');
    this.allySelected = (this.allySelected + dir + ALLY_COMMANDS.length) % ALLY_COMMANDS.length;
    // (Hurt, there's no FIGHT for them: the cursor goes past it.)
    if (isHurt(this.ally.id) && ALLY_COMMANDS[this.allySelected].label === 'FIGHT') {
      this.allySelected = (this.allySelected + (dir || 1) + ALLY_COMMANDS.length) % ALLY_COMMANDS.length;
    }
    if (!input.wasPressed('confirm')) return;
    const ally = this.ally;
    if (ALLY_COMMANDS[this.allySelected].label !== 'FIGHT' || !isHurt(ally.id)) sfx('select');

    switch (ALLY_COMMANDS[this.allySelected].label) {
      case 'FIGHT':
        // Hurt, with no umbrella (Ves in the Lantern Marsh and the Dead City),
        // she can't fight: only COVER you and CALL OUT, under SPELLS.
        if (isHurt(ally.id)) {
          sfx('error');
          break;
        }
        this.chooseTarget(() => this.setPhase('fight'));
        break;
      case 'TALK':
        this.chooseTarget((foe) => this.allyTalk(ally, foe));
        break;
      case 'SPELLS':
        this.setPhase('spells');
        break;
      case 'ITEMS':
        if (this.items.length) this.setPhase('items');
        else this.showMessage('Your bag is empty.', 'ally');
        break;
      case 'DEFEND': {
        // A friend's DEFEND covers only them (SHELTER is how they cover
        // you), and builds a little SP.
        this.braced = (this.braced ?? new Set()).add(ally.id);
        this.gainSp(ALLY_DEFEND_SP);
        const lines = this.allyLines(ally, 'defend');
        this.showMessage(`${lines[0] ?? `${ally.name} braces.`}\nHits on ${ally.name} are halved this turn. SP +${ALLY_DEFEND_SP}%`, 'taunt');
        break;
      }
    }
  }

  // An ally's lines from text/battle.txt: [<id>_<kind>] (vesper_turn), or
  // while they're hurt [<id>_hurt_<kind>] if there is one (no umbrella to
  // shake the snow off).
  allyLines(ally, kind) {
    const hurt = ally.hurt ? textFile('battle.txt')[`${ally.id}_hurt_${kind}`] ?? [] : [];
    return hurt.length ? hurt : textSection('battle.txt', `${ally.id}_${kind}`);
  }

  // A member's battle sprite: their own, or sitting down hurt (their `hurt` look).
  memberSprite(id) {
    const look = hurtState(id)?.look;
    if (look && PROP_SPRITES[look]) return makeSprite(PROP_SPRITES[look], PROP_PALETTE);
    return memberSprites(id).right;
  }

  // An ally's kind word to one enemy: their own line for it if the enemy's
  // text file has one ([vesper_talk], or [vesper_hurt_talk] while she's
  // hurt), or one of their general ones from text/battle.txt, with {foe} for
  // its name. It raises MERCY a little.
  allyTalk(ally, foe) {
    if (this.refuseMercy(foe)) return;
    const kind = ally.hurt ? `${ally.id}_hurt_talk` : `${ally.id}_talk`;
    const id = this.bossPhase(foe)?.id;
    const file = textFile(foe.data.textFile);
    const own = (id && file[`${kind}: ${id}`]?.length ? file[`${kind}: ${id}`] : file[kind]) ?? [];
    const lines = own.length ? own : this.allyLines(ally, 'talk');
    const line = (lines[Math.floor(Math.random() * lines.length)] ?? `${ally.name} talks to {foe}.`).replaceAll('{foe}', foe.name);
    this.showMessage(this.calmFoe(foe, ALLY_TALK_CALM, line), 'taunt');
  }

  // Their SPELLS list: each of their `commands`, at its SP cost.
  updateAllySpells(input) {
    const commands = this.allyCommands(this.actor);
    const index = this.pickFromList(input, commands.length);
    if (index === null) return;
    const command = commands[index];
    if (this.sp < (command.cost ?? 0)) {
      this.showMessage('Not enough SP.\nGraze past bullets to build spell power.', 'spells');
      return;
    }
    if (command.calmAll && this.refuseMercy(this.activeFoes().find((foe) => this.mercyRule(foe)))) return;
    // A hit on one enemy asks which (and so does CHARGE, which marks one);
    // SP is only spent once it's cast.
    if (command.strikeOne || command.team || command.expose) {
      this.chooseTarget(() => {
        this.sp -= command.cost ?? 0;
        this.allyAct(this.actor, command);
      });
      return;
    }
    // A healing spell asks who it's for; SP is only spent once it's cast.
    if ((command.heal || (command.regen && !command.regenAll)) && this.party.length > 1) {
      this.chooseMember((member) => {
        this.healTarget = member;
        this.sp -= command.cost ?? 0;
        this.allyAct(this.actor, command);
      });
      return;
    }
    this.sp -= command.cost ?? 0;
    this.allyAct(this.actor, command);
  }

  // One of an ally's spells, made stronger by their skills and gear.
  allyAct(ally, command) {
    this.moves.cast(this, ally, command.label, command);
    const lines = [command.text];
    this.allyFx(ally, command);
    if (command.calmAll) {
      const amount = this.allyCalmAmount(ally, command.calmAll);
      for (const foe of this.activeFoes()) lines.push(this.calmFoe(foe, amount, '').trim());
    }
    if (command.sp) {
      const amount = this.allySpGift(ally, command.sp);
      this.gainSp(amount);
      lines.push(`SP +${amount}%`);
    }
    if (command.heal) {
      // Whoever they chose (see updateAlly), or you.
      const member = this.healTarget ?? this.hero;
      this.healTarget = null;
      const healed = this.healMember(member, this.allyPotent(ally, command.heal + this.allyBonus(ally, 'allyHeal')));
      sfx('heal');
      this.healFx(member, healed, command.label === 'AURORA' ? 'aurora' : 'heal');
      lines.push(`${member.name} recovered ${healed} HP.`);
    }
    // DAYBREAK: everyone still standing, at once.
    if (command.healAll) {
      sfx('heal');
      for (const member of this.party.filter((other) => other.hp > 0)) {
        const healed = this.healMember(member, this.allyPotent(ally, command.healAll + this.allyBonus(ally, 'allyHeal')));
        this.healFx(member, healed);
        lines.push(`${member.name} recovered ${healed} HP.`);
      }
    }
    // RAIN DANCE: HP back for whoever they chose (or you) after each of the
    // next few enemy turns. A new rain takes the old one's place.
    if (command.regen) {
      const member = this.healTarget ?? this.hero;
      this.healTarget = null;
      const amount = this.allyPotent(ally, command.regen + this.allyBonus(ally, 'allyHeal'));
      // (HOT SOUP, `regenAll`: everyone in the party, not one.)
      this.rain = { member, amount, turns: command.turns ?? 3, all: Boolean(command.regenAll) };
      lines.push(`${this.rain.all ? 'Everyone' : member.name} will recover ${amount} HP after each of the next ${this.rain.turns} enemy turns.`);
    }
    // SAIL: the wind carries the whole party past the start of the next attack.
    if (command.sail) {
      // Capped: with every gust skill it would cover a whole attack.
      this.sailSeconds = Math.min(SAIL_CAP_SECONDS, command.sail + Math.max(0, this.allyBonus(ally, 'gust')) + (this.shelter?.gust ?? 0));
      lines.push(`Nothing can touch you for the first ${this.sailSeconds} seconds of the next attack.`);
    }
    // WADE IN: Bramble steps in front of his friends for the next enemy turn.
    if (command.wade) {
      this.wading = ally.id;
      lines.push(`Hits meant for anyone else land on ${ally.name} instead, and do half the damage.`);
    }
    // HOLLER: the enemies flinch, and their next attack is cut short.
    if (command.shorten) {
      this.flinch = Math.min(MAX_FLINCH, (this.flinch ?? 0) + command.shorten + Math.max(0, this.allyBonus(ally, 'shorten')));
      lines.push('Their next attack will be shorter.');
    }
    // HIDE: out of reach this enemy turn, and a sneak attack ready after.
    if (command.hide) {
      this.hiding = ally.id;
      this.sneaking = ally.id;
      lines.push(`Nothing will aim at ${ally.name} this turn. His next hit is a sneak attack!`);
      // Hiding Spot (`hideHeal`): a snack while he's down there, that share
      // of his healing.
      const snack = this.allyBonus(ally, 'hideHeal');
      if (snack > 0 && ally.hp > 0) {
        const healed = this.healMember(ally, this.allyPotent(ally, snack * this.allyBonus(ally, 'allyHeal')));
        if (healed) lines.push(`${ally.name} recovered ${healed} HP.`);
      }
    }
    // COVER (Ves, hurt): her coat held over you. Like SHELTER (the next
    // attack is halved, and every hit does a little less, more with a thick
    // coat), but there's no umbrella to catch a gust.
    if (command.cover) {
      this.defending = true;
      this.shelter = { def: SHELTER_DEF + Math.max(0, this.allyBonus(ally, 'shelterDef')), gust: 0 };
      lines.push(`Every hit does ${this.shelter.def} less, too.`);
    }
    // CALL OUT (Ves, hurt): she'll shout what's coming as it starts, and its
    // bullets start out slowed (see startAttack).
    if (command.callOut) {
      this.callOut = ally;
      lines.push('The next attack will start out slow.');
    }
    if (command.guard) {
      // SHELTER: DEFEND's stronger form, with whatever the ally's gear adds.
      this.defending = true;
      this.shelter = { def: SHELTER_DEF + Math.max(0, this.allyBonus(ally, 'shelterDef')), gust: Math.max(0, this.allyBonus(ally, 'gust')) + (this.shelter?.gust ?? 0) };
      lines.push(`Every hit does ${this.shelter.def} less, too.${this.shelter.gust ? ' A gust will slow the bullets.' : ''}`);
      // Tuck In (`shelterHeal`): everyone under the umbrella gets that share
      // of her healing back.
      const tuck = this.allyBonus(ally, 'shelterHeal');
      if (tuck > 0) {
        const amount = this.allyPotent(ally, tuck * this.allyBonus(ally, 'allyHeal'));
        let total = 0;
        for (const member of this.party.filter((other) => other.hp > 0)) total += this.healMember(member, amount);
        if (total) lines.push(`Everyone under it recovered ${amount} HP.`);
      }
    }
    // HEADWIND: the next attack's bullets start out slowed, as SHELTER's gust
    // does, without the umbrella over you (her gust skills add to it).
    if (command.headwind) {
      const seconds = command.headwind + Math.max(0, this.allyBonus(ally, 'gust')) + (this.shelter?.gust ?? 0);
      this.shelter = { def: this.shelter?.def ?? 0, gust: seconds };
      lines.push(`The next attack's bullets will be slowed for ${seconds} seconds.`);
    }
    // BRACE: the next hit on the hero this enemy turn does nothing (see hurt).
    if (command.absorb) {
      this.absorb = true;
    }
    // PARASOL SPIN: the next hit on anyone this enemy turn is thrown back at
    // an attacker (see hurt), as hard as one of her attack spells.
    if (command.riposte) {
      this.riposte = { ally, damage: this.allyStrikeDamage(ally, command.riposte) };
      lines.push(`The next hit will be thrown back for ${this.riposte.damage} damage.`);
    }
    // CHARGE and MARK IT: the one they chose is left open (LOW WATER's `exposed`).
    if (command.expose && this.target) {
      this.exposeFoe(this.target, command.expose);
      lines.push(`${this.target.name} takes ${Math.round(command.expose.bonus * 100)}% more from every hit for ${command.expose.turns} enemy turns.`);
    }
    // A hit on every enemy (Sleet), or on the one they chose (Downdraft),
    // lands after the words.
    if (command.strikeAll) {
      // RIP CURRENT drags them together: the more enemies there are, the harder it hits each.
      const crowd = 1 + (command.pull ?? 0) * Math.max(0, this.activeFoes().length - 1);
      const damage = Math.round(this.allyStrikeDamage(ally, command.strikeAll) * this.sneakPower(ally, true) * crowd);
      this.spendSneak(ally);
      this.showMessage(lines.join('\n'), () => this.strikeAll(damage));
      return;
    }
    if (command.strikeOne) {
      const damage = Math.round(this.allyStrikeDamage(ally, command.strikeOne) * this.sneakPower(ally, true));
      this.spendSneak(ally);
      this.showMessage(lines.join('\n'), () => this.resolveStrike(damage, 'spell'));
      return;
    }
    // A team attack (the Usurper's last phase): the two of you, together.
    if (command.team) {
      const damage = this.teamDamage(ally, command.team);
      this.showMessage(lines.join('\n'), () => this.resolveStrike(damage, 'spell'));
      return;
    }
    this.showMessage(lines.join('\n'), 'taunt');
  }

  // The TALK options it has now: its phase's own (`talk` on a phase), or its
  // usual ones.
  // (Those it has `once` and that have been said are gone; those `after`
  // others wait for them; those `atCalm` wait for its MERCY.)
  talkOptions(foe) {
    const all = this.bossPhase(foe)?.talk ?? foe.data.talk;
    const said = foe.said ?? new Set();
    return all.filter((option) => !(option.once && said.has(option.name))
      && [option.after ?? []].flat().every((name) => said.has(name))
      && foe.calm >= (option.atCalm ?? 0)
      // (Only with that `gear` in your pockets, and with every friend it
      // `needs` in the party: Haddock's bell, rung with Bramble.)
      && (!option.gear || hasGear(option.gear))
      && (option.needs ?? []).every((id) => this.party.some((member) => member.id === id)));
  }

  // A TALK that's a deed done together (`needs`, Haddock's bell): those
  // friends must be on their feet and not have had their turn this round,
  // and doing it takes their turns too, so only the rest of the party acts
  // after you. It can cost SP (`sp`), make the next attack gentler (`soothe`:
  // { density, speed }, see startAttack) and cue the phase's stage effects
  // (`cue`). Returns what's wrong if it can't be done now, or null.
  teamTalkProblem(option) {
    if (option.sp && this.sp < option.sp) return `Not enough SP. It takes ${option.sp}% SP.\nGraze past bullets to build spell power.`;
    for (const id of option.needs ?? []) {
      const member = this.party.find((other) => other.id === id);
      if (!member || member.hp <= 0) return `${member?.name ?? 'Your friend'} is down. You can't do this one alone.`;
      if (!this.pendingAllies.includes(member)) return `${member.name} has already had a turn.`;
    }
    return null;
  }

  teamTalk(option, foe) {
    this.sp -= option.sp ?? 0;
    const helpers = (option.needs ?? []).map((id) => this.party.find((member) => member.id === id));
    this.pendingAllies = this.pendingAllies.filter((member) => !helpers.includes(member));
    if (option.soothe) this.calmNext = option.soothe;
    if (option.cue) this.stageFx?.cue?.(this, foe, option.cue);
    const middle = this.partyMiddle();
    this.bits.ring(middle.x, middle.y - 20, { speed: 120, color: '#ffe48a', width: 2 });
    this.bits.ring(middle.x, middle.y - 20, { speed: 70, color: '#fff2cf', life: 0.7 });
    sfx(option.sfx ?? 'bell');
  }

  updateTalk(input) {
    const foe = this.target;
    const talks = this.talkOptions(foe);
    const index = this.pickFromList(input, talks.length);
    if (index === null) return;

    const option = talks[index];
    // Nothing to do with a friend who's knocked out ("Stand by Ves").
    if (this.aboutDownAlly(option.name)) {
      sfx('back');
      return;
    }
    if ((option.calm || option.spare) && this.refuseMercy(foe)) return;
    const together = option.needs || option.sp;
    if (together) {
      const problem = this.teamTalkProblem(option);
      if (problem) {
        sfx('error');
        this.showMessage(problem, 'talk');
        return;
      }
      this.teamTalk(option, foe);
    }
    (foe.said ??= new Set()).add(option.name);
    // The Check line's "NAME - HP n" always shows the HP it really has in
    // this fight (chapter strength, party size), not the number typed in the text file.
    let text = this.foeLine(foe, `talk: ${option.name}`).replace(/ - HP \d+/, ` - HP ${foe.maxHp}`);
    // A TALK that spares it, like Pacify.
    if (option.spare) {
      this.spareFoe(foe, text);
      return;
    }
    if (option.calm) text = this.calmFoe(foe, option.calm, text);
    if (option.giveBack) text += `\n${giveBack(this, foe)}`.trimEnd();
    // Options that help defend a boss's flame (the Usurper's lantern).
    if (option.provoke && this.flameInBox()) this.provoked = true;
    if (option.flameGuard && this.flameInBox()) this.flameGuardBonus += option.flameGuard;
    // Some kindnesses cost you (`hurt`: HP, like hugging a Frostbite). They
    // never knock you out.
    if (option.hurt && this.hero.hp > 1) {
      const lost = Math.min(option.hurt, this.hero.hp - 1);
      this.hero.hp -= lost;
      this.addPopup(`${lost}`, PARTY_FEET.x, PARTY_FEET.y - 46, hud.COLORS.danger);
      sfx('hurt');
      text += `\nYou lose ${lost} HP.`;
    }
    this.showMessage(text, 'taunt');
  }

  updateSpells(input) {
    if (this.actor.ally) {
      this.updateAllySpells(input);
      return;
    }
    const index = this.pickFromList(input, this.spells.length);
    if (index === null) return;

    const spell = this.spells[index];
    if (!this.freeSpell && this.sp < spell.sp) {
      this.showMessage('Not enough SP.\nGraze past bullets to build spell power.', 'spells');
      return;
    }
    if (TARGETED_SPELLS.has(spell.id)) this.chooseTarget((foe) => this.castSpell(spell, foe));
    else if (HEALING_SPELLS.has(spell.id)) this.chooseMember((member) => this.castSpell(spell, null, member));
    else this.castSpell(spell, null);
  }

  // `member` is who a healing spell is for (you, if not given).
  castSpell(spell, foe, member = this.hero) {
    // A calming spell on someone who can't be calmed is stopped before it costs anything.
    if (spell.id === 'lull' || spell.id === 'pacify' || spell.id === 'truce') {
      if (this.refuseMercy(foe)) return;
    } else if ((spell.id === 'hush' || spell.id === 'serenade' || spell.id === 'soothe') && this.refuseMercy(this.activeFoes().find((other) => this.mercyRule(other)))) {
      return;
    }
    // After a Brine Tonic (`freeSpell`) the next spell is on the house.
    if (this.freeSpell) this.freeSpell = false;
    else this.sp -= spell.sp;
    this.moves.cast(this, this.hero, spell.id);
    if (SPELL_SOUNDS[spell.id]) sfx(SPELL_SOUNDS[spell.id]);
    const name = this.hero.name;
    switch (spell.id) {
      case 'heal':
      case 'mend':
      case 'renew': {
        const base = spell.id === 'heal' ? HEAL_PULSE_HP : spell.id === 'mend' ? MEND_HP : SPELLS[spell.id].heals;
        const healed = this.healMember(member, this.potent(base * (1 + skillBonus('healBoost'))));
        sfx('heal');
        this.healFx(member, healed);
        const who = member === this.hero ? 'Recovered' : `${member.name} recovered`;
        this.showMessage(`${name} cast ${spell.name}! ${who} ${healed} HP.`, 'taunt');
        break;
      }
      // Balm: the whole party at once, whoever's still standing.
      case 'balm':
      case 'restore': {
        sfx('heal');
        const amount = this.potent(SPELLS[spell.id].heals * (1 + skillBonus('healBoost')));
        const lines = this.party.filter((other) => other.hp > 0).map((other) => {
          const healed = this.healMember(other, amount);
          this.healFx(other, healed);
          return `${other === this.hero ? 'Recovered' : `${other.name} recovered`} ${healed} HP.`;
        });
        this.showMessage(`${name} cast ${spell.name}! A warmth settles over everyone.\n${lines.join('\n')}`, 'taunt');
        break;
      }
      case 'ember':
      case 'chain':
      case 'comet':
      case 'rend':
      case 'starfall':
      case 'spark':
      case 'siphon':
      case 'sunder':
      case 'lance':
      case 'sunburst':
      case 'tempest':
      case 'nova':
      case 'undertow':
      case 'brine':
      case 'cleave':
      case 'starstorm':
      case 'undercut':
      case 'overwhelm':
        this.castAttackSpell(spell);
        break;
      // EBB AND FLOW: attack and defence swap. Your hits land harder, theirs
      // do too, until two enemy turns have passed.
      case 'ebb_flow': {
        const swap = SPELLS.ebb_flow.swap;
        this.tideSwap = { attack: swap.attack, defence: swap.defence, turns: swap.turns };
        this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
        sfx('heal');
        this.showMessage(`${name} cast Ebb and Flow! The tide turns inside you.\nYour hits land ${swap.attack}x as hard, but so do theirs (${swap.defence}x), for ${swap.turns} enemy turns.`, 'taunt');
        break;
      }
      // LOW WATER: the tide goes out and shows what it was hiding.
      case 'low_water': {
        const { bonus, turns } = SPELLS.low_water.expose;
        foe.exposed = { bonus, turns };
        this.fx.add('calm', foe.center);
        this.showMessage(`${name} cast Low Water! The tide goes out, and the weak spots show.\n${foe.name} takes ${Math.round(bonus * 100)}% more from every hit for ${turns} enemy turns.`, 'taunt');
        break;
      }
      case 'ward':
      case 'aegis':
      case 'bastion': {
        const turns = spell.id === 'ward' ? WARD_TURNS : SPELLS[spell.id].turns;
        this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
        this.wardTurns = Math.max(this.wardTurns, turns);
        sfx('heal');
        this.showMessage(`${name} cast ${spell.name}! A shell of light closes round you.\nDamage is halved for the next ${turns} enemy turns.`, 'taunt');
        break;
      }
      case 'hush':
      case 'serenade':
      case 'soothe': {
        this.fx.add('snow', { style: 'flurry' });
        for (const other of this.activeFoes()) this.fx.add('calm', other.center);
        const calm = spell.id === 'hush' ? HUSH_CALM : SPELLS[spell.id].calm;
        const calmed = this.activeFoes().map((other) => this.calmFoe(other, spellMercy(calm), '').trim());
        const words = spell.id === 'hush' ? 'Snow seems to fall inside the room.' : spell.id === 'soothe' ? 'Everything in the room goes quiet and still.' : 'A song nobody taught you fills the room.';
        this.showMessage(`${name} cast ${spell.name}. ${words}\n${calmed.join('\n')}`, 'taunt');
        break;
      }
      case 'pacify':
        this.fx.add('calm', { ...foe.center, style: 'pacify' });
        if (foe.calm >= 100) {
          this.spareFoe(foe, `${name} cast Pacify!`);
        } else {
          // (A phase can say its own why not: [pacify: <phase>].)
          const why = textFile(foe.data.textFile)[`pacify: ${this.bossPhase(foe)?.id}`]?.[0] ?? `But ${foe.name} isn't calm enough yet.`;
          this.showMessage(`${name} cast Pacify...\n${why}`, 'taunt');
        }
        break;
      case 'lull':
        this.fx.add('calm', foe.center);
        this.showMessage(this.calmFoe(foe, spellMercy(foe.data.lullCalm ?? LULL_CALM), `${name} cast Lull. A soft hush settles over the room.`), 'taunt');
        break;
      // Chapter 5's third wave (see src/data/spells.js).
      // COUNTER: the next hit on you goes back at them, as PARASOL SPIN's does.
      case 'counter': {
        this.riposte = { damage: this.spellDamage('counter') };
        sfx('counter');
        this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
        this.showMessage(`${name} cast Counter, and waits.\nThe next hit will be thrown back for ${this.riposte.damage} damage.`, 'taunt');
        break;
      }
      // SIDESTEP: the next hit on you does nothing (BRACE's `absorb`).
      case 'sidestep':
        this.absorb = true;
        sfx('sidestep');
        this.fx.add('wind', this.partyMiddle());
        this.showMessage(`${name} cast Sidestep. Light on your feet now.\nThe next hit on you will do nothing.`, 'taunt');
        break;
      // TRUCE: one enemy calms, and holds back its next attack.
      case 'truce':
        sfx('truce');
        this.fx.add('calm', foe.center);
        this.flinch = Math.min(MAX_FLINCH, (this.flinch ?? 0) + SPELLS.truce.shove);
        this.showMessage(`${this.calmFoe(foe, spellMercy(SPELLS.truce.calm), `${name} cast Truce, and lowers the sword a little.`)}\nTheir next attack will be shorter.`, 'taunt');
        break;
      // WEAKEN: every enemy left open, like LOW WATER but smaller and shorter.
      case 'weaken': {
        const { bonus, turns } = SPELLS.weaken.expose;
        sfx('weaken');
        for (const other of this.activeFoes()) {
          this.exposeFoe(other, SPELLS.weaken.expose);
          this.fx.add('calm', other.center);
        }
        this.showMessage(`${name} cast Weaken! Every enemy falters.\nThey take ${Math.round(bonus * 100)}% more from every hit for ${turns} enemy turns.`, 'taunt');
        break;
      }
      // STALL: no damage, but their next attack is cut well short.
      case 'stall':
        this.flinch = Math.min(MAX_FLINCH, (this.flinch ?? 0) + SPELLS.stall.shove);
        sfx('stall');
        this.fx.add('wind', this.partyMiddle());
        this.showMessage(`${name} cast Stall. Everything slows to a crawl.\nTheir next attack will be a lot shorter.`, 'taunt');
        break;
      // DUCK UNDER: nothing can touch you at the start of the next attack (SAIL).
      case 'duck':
        this.sailSeconds = Math.min(SAIL_CAP_SECONDS, Math.max(this.sailSeconds, SPELLS.duck.sail));
        sfx('duck');
        this.fx.add('wind', this.partyMiddle());
        this.showMessage(`${name} cast Duck Under.\nNothing can touch you for the first ${this.sailSeconds} seconds of the next attack.`, 'taunt');
        break;
    }
  }

  // Where someone in the party is, for a spell's effect: the middle of them,
  // and how tall they are.
  memberAt(member) {
    const feet = this.memberFeet(member);
    const h = member.sprite.height * SCALE;
    return { x: feet.x, y: feet.y - h / 2, h };
  }

  // The middle of the whole party, and the top of the tallest, for a shell
  // or a canopy over all of them.
  partyMiddle() {
    const at = (this.party.length ? this.party : [this.hero]).map((member) => this.memberAt(member));
    const mean = (pick) => at.reduce((sum, p) => sum + pick(p), 0) / at.length;
    return { x: mean((p) => p.x), y: mean((p) => p.y), top: Math.min(...at.map((p) => p.y - p.h / 2)) };
  }

  // Motes rising off whoever's healed (or Aurora's lights), and the HP, floating up.
  healFx(member, healed, kind = 'heal') {
    const at = this.memberAt(member);
    this.fx.add(kind, kind === 'aurora' ? { ...this.partyMiddle(), h: at.h } : at);
    if (healed > 0) this.addPopup(`+${healed}`, at.x, at.y - at.h / 2 - 6, hud.COLORS.enemyHp);
  }

  // One of the hero's attack spells, on the target (or every enemy).
  attackFx(id) {
    const foe = this.target;
    const hero = this.memberAt(this.hero);
    if (id === 'ember' || id === 'sunburst') this.fx.add('embers', { points: this.activeFoes().map((other) => other.center) });
    else if (id === 'starstorm') for (const other of this.activeFoes()) this.fx.add('starfall', other.center);
    else if (id === 'chain') this.fx.add('chain', { points: [hero, ...this.activeFoes().map((other) => other.center)] });
    else if (!foe) return;
    else if (id === 'siphon') this.fx.add('siphon', { ...foe.center, to: hero });
    // Starfall: the whole sky (bigger the more the Fallen Star's been reforged).
    else if (id === 'starfall') this.fx.add('starfallShow', { ...foe.center, stars: HERO_STATE.weapons?.includes('fallen_star') ? starForging().stars : 0 });
    else this.fx.add(ATTACK_SPELL_FX[id] ?? id, foe.center);
  }

  // An ally's spell: Ves's wind and snow and umbrella, Bramble's shouts and leaves and axe.
  allyFx(ally, command) {
    if (ALLY_SOUNDS[command.label]) sfx(ALLY_SOUNDS[command.label]);
    const foe = this.target ?? this.activeFoes()[0];
    const me = this.memberAt(ally);
    const all = () => this.activeFoes().map((other) => other.center);
    switch (command.label) {
      case 'SHELTER': this.fx.add('shell', { ...this.partyMiddle(), style: 'umbrella' }); return;
      case 'COVER': this.fx.add('shell', { ...this.partyMiddle(), style: 'coat' }); return;
      case 'FLURRY': this.fx.add('snow', { style: 'flurry' }); return;
      case 'SLEET': this.fx.add('snow', { style: 'sleet' }); return;
      case 'WHITEOUT': this.fx.add('snow', { style: 'whiteout' }); return;
      case 'ZEPHYR':
      case 'UPDRAFT':
      case 'HEADWIND': this.fx.add('wind', this.partyMiddle()); return;
      case 'DOWNDRAFT':
      case 'THUNDERCLAP': if (foe) this.fx.add('downdraft', foe.center); return;
      case 'RAIN DANCE':
      case 'MONSOON': this.fx.add('snow', { style: 'flurry' }); return;
      case 'BRACE':
      case 'PARASOL SPIN': this.fx.add('shell', { ...this.partyMiddle(), style: 'umbrella' }); return;
      case 'HAILSTORM': this.fx.add('snow', { style: 'sleet' }); return;
      case 'COOL CHANGE':
      case 'BILLOW': this.fx.add('wind', this.partyMiddle()); return;
      case 'DOWNPOUR': this.fx.add('snow', { style: 'sleet' }); return;
      case 'WHIRL': this.fx.add('snow', { style: 'whiteout' }); return;
      case 'COUNT TO TEN': for (const point of all()) this.fx.add('calm', point); return;
      case 'CANNONBALL': if (foe) this.fx.add('comet', { ...foe.center, colors: ['#ffffff', '#bfe8ff', '#5fb8ff', '#2a6fb0'] }); return;
      case 'STAND FIRM': this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' }); return;
      // Chapter 5's second half.
      case 'HOLD FAST': this.fx.add('shell', { ...this.partyMiddle(), style: 'umbrella' }); return;
      case 'WINDSHEAR':
      case 'SUPERCELL': if (foe) this.fx.add('downdraft', foe.center); return;
      case 'HURRICANE': this.fx.add('snow', { style: 'whiteout' }); return;
      case 'SHEET LIGHTNING': this.fx.add('chain', { points: [me, ...all()] }); return;
      case 'STILL AIR': for (const point of all()) this.fx.add('calm', point); return;
      case 'FIRESIDE':
      case 'CLEAR SKIES': this.fx.add('aurora', { ...this.partyMiddle(), h: me.h }); return;
      case 'SPLINTERS': for (const point of all()) this.fx.add('slash', { ...point, colors: ['#ffffff', '#ff8c1a'] }); return;
      case 'THE BIG ONE': if (foe) this.fx.add('slash', { ...foe.center, colors: ['#ffffff', '#ff8c1a'] }); return;
      case 'THREE CHEERS':
      case 'SING-ALONG': this.fx.add('shout', me); return;
      case 'CONKERS': for (const point of all()) this.fx.add('pebble', point); return;
      case "I'VE GOT YOU": this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' }); return;
      // Chapter 5's third wave.
      case 'TWIRL': sfx('twirl'); this.fx.add('wind', this.partyMiddle()); return;
      case 'LIFT': sfx('lift'); this.fx.add('wind', this.partyMiddle()); return;
      case 'HOT SOUP': sfx('soup'); this.fx.add('aurora', { ...this.partyMiddle(), h: me.h }); return;
      case 'CHARGE': sfx('charge'); return;
      case 'WINDBREAK': sfx('umbrella'); this.fx.add('shell', { ...this.partyMiddle(), style: 'umbrella' }); return;
      case 'MARK IT': sfx('notch'); return;
      case 'RALLY': sfx('rally'); this.fx.add('shout', me); return;
      case 'LOOK OUT!': sfx('lookOut'); this.fx.add('shout', me); return;
      case 'POCKET SAND': sfx('sandThrow'); for (const point of all()) this.fx.add('pebble', point); return;
      case 'SHAKE IT OFF': sfx('shake'); this.fx.add('leaves', me); return;
      case 'CYCLONE': this.fx.add('snow', { style: 'whiteout' }); return;
      case 'DAYBREAK': this.fx.add('aurora', { ...this.partyMiddle(), h: me.h }); return;
      case 'FELL': if (foe) this.fx.add('slash', { ...foe.center, colors: ['#ffffff', '#ff8c1a'] }); return;
      case 'MARBLES': for (const point of all()) this.fx.add('pebble', point); return;
      case 'CALL OUT':
      case 'HOLLER':
      case 'WHISTLE':
      case 'WAR CRY': this.fx.add('shout', me); return;
      case 'HIDE': this.fx.add('leaves', me); return;
      case 'CHOP': if (foe) this.fx.add('slash', { ...foe.center, colors: ['#ffffff', '#ff8c1a'] }); return;
      case 'SLINGSHOT': if (foe) this.fx.add('pebble', foe.center); return;
      case 'TIMBER!': for (const point of all()) this.fx.add('comet', { ...point, colors: ['#e0b888', '#c08a4e', '#7a4f2a', '#5a3a1e'], style: 'log' }); return;
      default:
    }
    // Anything else, by what it does.
    if (command.team && foe) this.fx.add('comet', { ...foe.center, colors: ['#ffffff', '#ffe14d', '#4fe3d0', '#b07cff'] });
    else if (command.strikeAll) this.fx.add('snow', { style: 'sleet' });
    else if (command.strikeOne && foe) this.fx.add('slash', foe.center);
    else if (command.expose && foe) this.fx.add('spark', foe.center);
    else if (command.guard || command.cover) this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
    else if (command.calmAll) for (const point of all()) this.fx.add('calm', point);
  }

  // A spell's strength after the armor's MAG.
  potent(amount) {
    return Math.max(1, Math.round(amount * this.potency));
  }

  // The same for one of an ally's healing or calming spells, after their
  // outfit's MAG.
  allyPotent(ally, amount) {
    if (amount <= 0) return 0;
    return Math.max(1, Math.round(amount * Math.max(0.25, 1 + this.allyBonus(ally, 'magic'))));
  }

  // The most a FIGHT could do right now, every slash PERFECT: the hero's, with
  // their weapon and skills, or an ally's, with theirs and how far they've
  // grown. Allies' attack spells and team attacks are measured against it. A weapon weaker than a plain sword (a staff, a lantern)
  // doesn't make spells weaker: it counts as 1.
  bestStrike(member) {
    if (member.ally) {
      return (BASE_SLASH_COUNT + this.allySlashes(member)) * PERFECT_SLASH_DAMAGE * Math.max(1, this.allyWeaponPower(member)) * (1 + memberGrowth(member.id, 'fight')) * (1 + this.allyBonus(member, 'allyFight'));
    }
    return (BASE_SLASH_COUNT + skillBonus('strikeSlashes')) * PERFECT_SLASH_DAMAGE * Math.max(1, this.weapon.fightPower) * this.fightPowerBonus;
  }

  // The FIGHT an attack spell is measured against: every slash landed (not
  // PERFECT), with only the skills and as good a sword as the spell's
  // chapter had, so old spells stop growing (see src/data/spells.js), unless
  // a later skill has sharpened it ("Rend II": spellSharpening). FIGHT_GROWTH
  // keeps spells as far ahead of the FIGHT bar as they were before its curve
  // got gentler (see strikeBar.js).
  spellStrike(id) {
    // Starfall is the hero's own spell: it never stops growing (it's measured
    // against the chapter you're in, not the one it was learned in).
    const chapter = id === 'starfall' ? Math.min(WORLD_STATE.chapter ?? 1, Math.max(...Object.keys(SPELL_WEAPON_CAP).map(Number))) : spellSharpening(id)?.chapter ?? SPELLS[id].chapter ?? 1;
    const slashes = BASE_SLASH_COUNT + skillBonus('strikeSlashes', chapter);
    const weapon = Math.max(1, Math.min(this.weapon.fightPower, SPELL_WEAPON_CAP[chapter] ?? Infinity));
    return slashes * SLASH_DAMAGE * FIGHT_GROWTH * weapon * (1 + skillBonus('fightPower', chapter));
  }

  // What one of your attack spells does: that FIGHT times its `power`, plus a
  // quarter of the armor's MAG and half of Arcane Focus. They add rather
  // than multiply, so spells stay in line with FIGHT. Heavy armor (MAG
  // below 0) doesn't take any away.
  spellDamage(id, power = spellSharpening(id)?.power ?? SPELLS[id].power ?? 1) {
    // Starfall grows with the Fallen Star and its own sharpenings (starfallPower
    // in src/data/fallenStar.js).
    if (id === 'starfall') power = starfallPower();
    const boost = Math.max(0, this.potency - 1) / 4 + skillBonus('spellPower') / 2;
    return Math.max(1, Math.round(this.spellStrike(id) * (power + boost)));
  }

  // An ally's attack spell: `power` times their best FIGHT, plus their
  // allyStrike. Their outfit's MAG adds a quarter of itself to the power, as
  // yours does to your spells (spellDamage). All of it times FIGHT_GROWTH, as
  // your spells are (see strikeBar.js).
  allyStrikeDamage(ally, power) {
    const boost = power ? Math.max(0, this.allyBonus(ally, 'magic')) / 4 : 0;
    // A mage's attack spells grow faster than their FIGHT (Ves's `spellPower`, src/characters/party.js).
    // (`allyMagic`: her own skills on top, which count for her alone.)
    const mage = power ? 1 + Math.max(0, this.allyBonus(ally, 'spellPower')) + Math.max(0, this.allyBonus(ally, 'allyMagic')) : 1;
    // A mage (`spellBase: 'hero'`, Ves) casts from halfway between her own arm and the hero's best FIGHT:
    // well above Bramble's hatchet spells, a little above the hero's own.
    const base = power && MEMBERS[ally.id]?.spellBase === 'hero' ? Math.max(this.bestStrike(ally), (this.bestStrike(ally) + this.bestStrike(this.hero ?? {})) / 2) : this.bestStrike(ally);
    return Math.max(1, Math.round((base * (power + boost) + this.allyBonus(ally, 'allyStrike')) * FIGHT_GROWTH * mage));
  }

  // Rend, Starfall, Ember Flare and the rest: a hit on the target (shown with
  // the same slash and popup as FIGHT), or on everyone for an `all` spell.
  // Siphon heals you for its share of the damage.
  castAttackSpell(spell) {
    const damage = this.spellDamage(spell.id);
    this.attackFx(spell.id);
    const words = `${this.hero.name} cast ${spell.name}! ${ATTACK_SPELL_LINES[spell.id] ?? ''}`.trim();
    if (SPELLS[spell.id].all) {
      this.showMessage(words, () => this.strikeAll(damage));
      return;
    }
    // UNDERTOW: the water drags them back; their next attack is shorter.
    const shove = SPELLS[spell.id].shove ?? 0;
    // BRINE: it keeps burning, after every enemy turn, for a few turns.
    const dot = SPELLS[spell.id].dot;
    if (shove || dot) {
      const foe = this.target;
      const extra = [];
      if (shove) {
        this.flinch = Math.min(MAX_FLINCH, (this.flinch ?? 0) + shove);
        extra.push('Their next attack will be shorter.');
      }
      if (dot) {
        foe.brine = { damage: this.spellDamage(spell.id, dot.power), turns: dot.turns };
        extra.push(`${foe.name} is salted: ${foe.brine.damage} damage after each of the next ${dot.turns} enemy turns.`);
      }
      this.showMessage(`${words}\n${extra.join('\n')}`, () => this.resolveStrike(damage, 'spell'));
      return;
    }
    const share = SPELLS[spell.id].siphon ?? 0;
    if (share) {
      const healed = this.healMember(this.hero, Math.round(Math.min(damage, this.target.hp) * share));
      this.showMessage(`${words}\nYou recovered ${healed} HP.`, () => this.resolveStrike(damage, 'spell'));
      return;
    }
    this.showMessage(words, () => this.resolveStrike(damage, 'spell'));
  }

  // A hit on every enemy at once (Ember Flare, Ves's Sleet). Any that fall
  // leave one after another, then the turn goes on as after any attack.
  strikeAll(damage) {
    this.moves.landed(this, 'spell');
    const active = this.activeFoes();
    if (this.tideSwap) damage = Math.round(damage * this.tideSwap.attack);
    for (const foe of active) {
      const dealt = this.resist(foe, damage, 'spell');
      foe.hp = Math.max(0, foe.hp - dealt);
      this.addPopup(`${dealt}`, foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
      foe.flash = ENEMY_FLASH_SECONDS;
      if (dealt) foe.hitSince = true;
    }
    sfx('hit');
    this.shake = SHAKE_SECONDS;
    const goOn = () => {
      const smoke = this.smokeLine;
      this.smokeLine = null;
      if (smoke) this.showMessage(smoke, 'taunt');
      else this.setPhase('taunt');
    };
    // foeLeaves sees the rest of the fallen off itself, then runs goOn.
    const fallen = active.find((foe) => foe.hp <= 0);
    if (fallen) this.foeLeaves(fallen, 'defeated', goOn);
    else goOn();
  }

  updateItems(input) {
    const index = this.pickFromList(input, this.items.length);
    if (index === null) return;
    // Food goes to whoever you choose (it can get a friend back up); candles
    // with a `use` burn for everyone.
    if (!ITEMS[this.items[index]].use) {
      this.chooseMember((member) => this.useItem(index, member));
      return;
    }
    this.useItem(index, this.hero);
  }

  // Uses the item at `index` in the bag; food heals `member`.
  useItem(index, member) {
    if (ITEMS[this.items[index]].use === 'calm' && this.refuseMercy(this.activeFoes().find((foe) => this.mercyRule(foe)))) return;
    const [id] = this.items.splice(index, 1);
    this.moves.item(this, this.actor ?? this.hero, id, member);
    const item = ITEMS[id];
    sfx('heal');
    // An ally uses it on you: they light the candle, or hand you the food.
    const ally = this.actor.ally ? this.actor.name : null;
    const light = ally ? `${ally} lights` : 'You light';
    // Candles burn rather than get eaten: each does its own thing (see items.js).
    if (item.use === 'calm') {
      const calmed = this.activeFoes().map((foe) => this.calmFoe(foe, item.amount, '').trim());
      this.showMessage(`${light} the ${item.name}. A soft, sweet scent fills the air.\n${calmed.join('\n')}`, 'taunt');
      return;
    }
    if (item.use === 'sp') {
      this.gainSp(item.amount);
      // A `freeSpell` item (the Brine Tonic) also makes your next spell cost nothing.
      if (item.freeSpell) this.freeSpell = true;
      this.showMessage(`${light} the ${item.name}. Its glow fills you with power. SP +${item.amount}%!${item.freeSpell ? '\nYour next spell costs no SP!' : ''}`, 'taunt');
      return;
    }
    if (item.use === 'guard') {
      this.defending = true;
      // (A candle's smoke; anything else, you hide behind.)
      const cover = item.light ? `${light} the ${item.name}. Its smoke wraps around you like a cloak.` : `${ally ? `${ally} holds up` : 'You hold up'} the ${item.name}, and hide behind it.`;
      this.showMessage(`${cover}\nThe next attack will do half the damage.`, 'taunt');
      return;
    }
    // Warm Heart: food goes further.
    const heal = item.heal >= 999 ? item.heal : Math.round(item.heal * (1 + skillBonus('itemBoost')));
    const got = this.healMember(member, heal);
    const you = member === this.hero;
    const whose = you ? 'Your' : `${member.name}'s`;
    const healed = member.hp === member.maxHp && item.heal >= 999 ? `${whose} HP was maxed out!` : `${you ? 'Recovered' : `${member.name} recovered`} ${got} HP!`;
    if (item.light) this.showMessage(`${light} the ${item.name}. ${healed}`, 'taunt');
    else if (member === this.actor) this.showMessage(`${ally ? `${ally} ate` : 'You ate'} the ${item.name}. ${healed}`, 'taunt');
    else if (ally) this.showMessage(`${ally} hands you the ${item.name}. ${healed}`, 'taunt');
    else this.showMessage(`You hand ${member.name} the ${item.name}. ${healed}`, 'taunt');
  }

  // `kind` is 'fight' (the strike bar) or 'spell', for a boss made of smoke.
  resolveStrike(damage, kind = 'spell') {
    const foe = this.target;
    // Who lunges, and whose colour the slash is.
    this.striker = this.actor ?? this.hero;
    this.moves.landed(this, kind);
    if (this.tideSwap) damage = Math.round(damage * this.tideSwap.attack);
    damage = this.resist(foe, damage, kind);
    foe.hp = Math.max(0, foe.hp - damage);
    this.addPopup(damage ? `${damage}` : 'MISS', foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
    // (A beat's hold, sparks, a gold number on a PERFECT: battleFeel.js.)
    feel.strikeLanded(this, foe, damage, kind);
    if (damage) {
      this.slashFoe = foe;
      this.slashTime = SLASH_SECONDS;
      foe.flash = ENEMY_FLASH_SECONDS;
      foe.hitSince = true;
      sfx('hit');
      // A phase with `hitCalm`: hitting it costs MERCY (Peptup's show, louder).
      const lost = this.bossPhase(foe)?.hitCalm;
      if (lost && foe.calm > 0) {
        foe.calm = Math.max(0, foe.calm + lost);
        this.addPopup('MERCY ' + lost, foe.center.x, foe.pos.y + 14, hud.COLORS.calm);
      }
    }
    this.setPhase('fightResult');
  }

  // Spares it (Pacify, or a TALK with `spare`): its phase's `leaveBeat`
  // first, if it has one, then it goes, with `prefix` over its line.
  spareFoe(foe, prefix) {
    const beat = this.bossPhase(foe)?.leaveBeat?.pacified;
    if (!beat) {
      this.foeLeaves(foe, 'pacified', 'taunt', prefix);
      return;
    }
    this.showMessage(prefix, () => this.playBeat(foe, beat, () => this.foeLeaves(foe, 'pacified', 'taunt')));
  }

  // MERCY raised during its attack (a bullet that's a kindness to cut: the
  // strings Tuck hangs from), with a popup where it happened.
  addMercy(foe, amount, x, y) {
    if (!foe || foe.state !== 'active' || this.mercyRule(foe)) return;
    amount = Math.round(amount * (1 + skillBonus('mercyBoost')));
    const before = foe.calm;
    foe.calm = Math.min(100, foe.calm + amount);
    if (foe.calm > before) this.addPopup(`MERCY +${foe.calm - before}`, x, y, hud.COLORS.calm);
  }

  // An enemy is beaten or pacified: it fades away, its rewards are banked, and
  // the battle carries on (to `next`, a phase name or a function) or is won if
  // it was the last one.
  foeLeaves(foe, how, next, prefix = '') {
    foe.state = how;
    foe.leftAt = this.time;
    this.earned.coins += foe.data.rewards.coins;
    // Like Deltarune, sparing an enemy earns gold but no EXP.
    if (how === 'defeated') this.earned.exp += expReward(foe.data.rewards);
    // Sometimes they leave something behind.
    let dropped = false;
    for (const { item, chance } of foe.data.drops ?? []) {
      if (Math.random() < chance) { this.earned.items.push(item); dropped = true; }
    }
    noteLeft(foe.data, how, dropped);
    // And candle-making materials, spared or beaten alike.
    for (const { id, chance, amount = 1 } of foe.data.materials ?? []) {
      if (Math.random() < chance) this.earned.materials[id] = (this.earned.materials[id] ?? 0) + amount;
    }
    const back = giveBack(this, foe);
    const line = this.foeLine(foe, how === 'defeated' ? 'victory' : 'pacified') + (back ? `\n${back}` : '');
    const text = prefix ? `${prefix}\n${line}` : line;
    this.stageFx?.leave?.(this, foe, how);
    // Beaten, a phase's `leaveBeat` plays once it's come apart.
    const lastWords = how === 'defeated' ? this.bossPhase(foe)?.leaveBeat?.defeated : null;
    const say = () => (lastWords ? this.playBeat(foe, lastWords, sayLine) : sayLine());
    const sayLine = () => this.showMessage(text, () => {
      // Another enemy may have been knocked out at the same time.
      const alsoFallen = this.activeFoes().find((other) => other.hp <= 0);
      if (alsoFallen) this.foeLeaves(alsoFallen, 'defeated', next);
      else if (!this.activeFoes().length) this.win();
      else if (typeof next === 'function') next();
      else this.setPhase(next);
    });
    // A boss beaten goes out big (and the panel waits for it); anything else
    // goes with a pop of sparks, or, spared, a few soft lights.
    if (foe.data.boss && how === 'defeated') {
      this.startBossFinale(foe, say);
      return;
    }
    if (how === 'defeated') {
      sfx('vanish');
      this.bits.star(foe.center.x, foe.center.y, { size: 14 });
      this.bits.ring(foe.center.x, foe.center.y, { speed: 90, life: 0.35 });
      // (Its own themed burst instead of the sparks, if its `feel` has one.)
      if (!feelDefeat(this, foe)) this.bits.scatter(foe.center.x, foe.center.y, 12, foe.bitColors, { speed: 70 });
      for (let i = 0; i < 4; i++) this.bits.puff(foe.center.x + (Math.random() - 0.5) * 20, foe.center.y + (Math.random() - 0.5) * 16, { color: foe.bitColors[0], life: 0.5 });
    } else {
      sfx('spare');
      foe.glowUntil = this.time + (foe.data.boss ? SPARED_GLOW_SECONDS : SPARED_GLOW_SECONDS / 3);
      if (foe.data.boss) this.bits.ring(foe.center.x, foe.center.y, { speed: 60, life: 0.9, color: '#fff2cf' });
    }
    say();
  }

  // The last blow on a boss: everything stops dead, then it's rocked by bursts
  // of light all over, harder and harder, the stage shaking, to one last great
  // flash. Only then does its death play out and the panel say it's beaten.
  startBossFinale(foe, then) {
    this.finale = { foe, then, burstAt: 0, bursts: 0 };
    this.hitStop = HIT_STOP_SECONDS;
    foe.leftAt = this.time + FINALE_SECONDS;
    this.bits.star(foe.center.x, foe.center.y, { size: 34, life: 0.4 });
    sfx('burst');
    this.setPhase('bossFinale');
  }

  updateBossFinale() {
    const { foe } = this.finale;
    const w = foe.sprite.width * SCALE;
    const h = foe.sprite.height * SCALE;
    this.shake = Math.max(this.shake, 0.08);
    while (this.finale.burstAt <= this.phaseTime && this.phaseTime < FINALE_SECONDS) {
      this.finale.burstAt += FINALE_BURST_EVERY * (1 - 0.4 * (this.phaseTime / FINALE_SECONDS));
      // Somewhere on it (on the stage, for one that stands half off the top).
      const x = foe.pos.x + w * (0.15 + Math.random() * 0.7);
      const y = Math.max(6, foe.pos.y + h * (0.15 + Math.random() * 0.7));
      this.bits.star(x, y, { size: 8 + Math.random() * 10 });
      this.bits.scatter(x, y, 5, foe.bitColors, { speed: 80, life: 0.6 });
      if (this.finale.bursts++ % 2 === 0) sfx('burst');
    }
    if (this.phaseTime < FINALE_SECONDS) return;
    // The last great flash.
    const cx = foe.center.x;
    const cy = Math.max(10, foe.center.y);
    this.stageFlash = STAGE_FLASH_SECONDS * 0.85;
    this.shake = SHAKE_SECONDS * 3;
    this.bits.ring(cx, cy, { speed: 220, life: 0.6, width: 3 });
    this.bits.ring(cx, cy, { speed: 130, life: 0.7, color: foe.bitColors[0] });
    this.bits.scatter(cx, cy, 28, foe.bitColors, { speed: 150, life: 1.1 });
    sfx('boom');
    const { then } = this.finale;
    this.finale = null;
    then();
  }

  // Popups are positioned in world units and drawn in UI space.
  addPopup(text, x, y, color) {
    this.popups.push({ text, x: x * S, y: y * S, color, t: 0 });
  }

  updateTaunt(input) {
    if (!input.wasPressed('confirm')) return;
    if (!this.tauntSkipped && this.visibleTauntChars() < this.taunt.length) {
      this.tauntSkipped = true;
    } else if (this.tauntBubbles.length) {
      this.nextBubble();
      this.tauntStart = this.phaseTime;
      this.tauntSkipped = false;
    } else if (this.phase === 'speech') {
      stopVoice();
      this.speechDone();
    } else {
      stopVoice();
      this.setPhase('dodge');
    }
  }

  visibleTauntChars() {
    return this.tauntSkipped ? this.taunt.length : Math.floor((this.phaseTime - this.tauntStart) * TAUNT_SPEED);
  }

  updateDodge(dt, input) {
    if (this.phaseTime < BOX_OPEN_SECONDS) return;

    this.dodgeTime += dt;
    this.callOutLeft = Math.max(0, this.callOutLeft - dt);
    if (this.gustLeft > 0) {
      if (!this.gustShown) this.addPopup('GUST', this.soul.x, this.soul.y - 18, hud.COLORS.teal);
      this.gustShown = true;
      this.gustLeft = Math.max(0, this.gustLeft - dt);
    }
    // (A stage's turn rules keep their clock before the attacks look at it.)
    this.stageFx?.beforeAttacks?.(this, dt);
    for (const attack of this.attacks) {
      if (this.dodgeTime < attack.delay) continue;
      // An encore or a layered attack coming in is a new beat: the monster
      // winds up again and the box swells out once (battleFeel.js).
      if (attack.beat && !attack.begun && attack.foe.state === 'active') {
        // (Not a boss on its own stage: King Peptup's reach runs off attackAt.)
        if (!this.stageFx) attack.foe.attackAt = this.time;
        feelWindup(this, attack.foe);
        feel.encoreBeat(this, attack.foe);
      }
      attack.begun = true;
      const before = this.bullets.length;
      attack.pattern.update(dt, this.bullets, this.soul);
      // Bullets hurt as much as the enemy that fired them.
      for (let i = before; i < this.bullets.length; i++) {
        const bullet = this.bullets[i];
        if (bullet.dmg === null) bullet.dmg = this.bossPhase(attack.foe)?.damage ?? attack.foe.data.damage;
        // Stared down, he forgets the flame and comes for you.
        if (bullet.snuffs && (this.provokedTurn || !this.flameInBox())) {
          bullet.snuffs = false;
          bullet.homing = { target: this.soul, turn: 1.2 };
        }
      }
    }
    this.ability?.beforeMove?.(this, input, dt);
    this.soul.update(dt, input, hud.BOX);
    for (const bullet of this.bullets) bullet.update(dt * this.bulletTimeScale(bullet), hud.BOX);
    this.bullets = this.bullets.filter((bullet) => !bullet.spent && !bullet.isGone(hud.BOX));
    if (this.flame) this.flame.flicker = Math.max(0, this.flame.flicker - dt);
    this.updateAbility(dt, input);
    this.checkBullets(dt);

    if (this.phase === 'dodge' && this.dodgeTime >= this.turnLength) this.endEnemyTurn();
  }

  endEnemyTurn() {
    this.bullets = [];
    boxHome();
    this.defending = false;
    this.braced = null;
    this.hiding = null;
    this.shelter = null;
    this.gustLeft = 0;
    this.callOutLeft = 0;
    this.absorb = false;
    this.riposte = null;
    // A friend's warm scarf: a little HP back after every enemy turn.
    const regen = this.party.filter((member) => member.ally && member.hp > 0).reduce((sum, ally) => sum + memberGearBonus(ally.id, 'regen'), 0);
    if (regen > 0 && this.hero.hp > 0 && this.hero.hp < this.hero.maxHp) {
      this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + regen);
      this.addPopup(`+${regen}`, PARTY_FEET.x, PARTY_FEET.y - 46, hud.COLORS.enemyHp);
    }
    // Ves's rain, still falling: HP back for whoever it's over.
    if (this.rain) {
      const { member, amount } = this.rain;
      // (HOT SOUP's is over everyone: `all`.)
      for (const over of this.rain.all ? this.party : [member]) {
        if (over.hp <= 0) continue;
        const healed = this.healMember(over, amount);
        this.healFx(over, healed);
      }
      if (--this.rain.turns <= 0) this.rain = null;
    }
    if (this.wardTurns > 0) this.wardTurns--;
    this.sailSeconds = 0;
    this.wading = null;
    if (this.tideSwap && --this.tideSwap.turns <= 0) this.tideSwap = null;
    // BRINE burns, LOW WATER wears off.
    for (const foe of this.activeFoes()) {
      if (foe.brine) {
        const burn = Math.min(foe.brine.damage, foe.hp);
        foe.hp = Math.max(0, foe.hp - burn);
        foe.flash = ENEMY_FLASH_SECONDS;
        this.addPopup(`${burn}`, foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
        if (--foe.brine.turns <= 0) foe.brine = null;
      }
      if (foe.exposed && --foe.exposed.turns <= 0) foe.exposed = null;
    }
    this.soul.locked = false;
    this.turn++;
    // A weapon ability can knock an enemy out during its own turn.
    const fallen = this.activeFoes().find((foe) => foe.hp <= 0);
    // A thief takes something from the bag if it landed a hit (see steals.js).
    const stolen = this.hitThisTurn ? this.attackers?.map((foe) => stealCheck(this, foe, true)).find(Boolean) : null;
    this.hitThisTurn = false;
    if (fallen) this.foeLeaves(fallen, 'defeated', 'command');
    else if (stolen) this.showMessage(stolen, () => this.afterEnemyTurn());
    else this.afterEnemyTurn();
  }

  // Abilities like the lantern and bell slow or freeze bullets while active.
  // SHELTER's gust slows them all for a moment too, and so does CALL OUT.
  bulletTimeScale(bullet) {
    const gust = (this.gustLeft > 0 ? GUST_SPEED : 1) * (this.callOutLeft > 0 ? CALL_OUT_SPEED : 1);
    if (this.abilityLeft <= 0 || !this.ability?.bulletTimeScale) return gust;
    return gust * this.ability.bulletTimeScale(this, bullet);
  }

  // SHIFT uses the equipped weapon's soul ability, then it recharges.
  updateAbility(dt, input) {
    const ability = this.ability;
    if (!ability) return;
    this.abilityCooldown = Math.max(0, this.abilityCooldown - dt);

    const hasCharges = ability.charges === undefined || this.abilityUses < ability.charges;
    // `whileHurt`: it works while you're still flashing from a hit (the
    // scissors: a puppet string has just yanked you, and that's when you cut).
    const canUse = !ability.hold && hasCharges && this.abilityCooldown <= 0 && (ability.whileHurt || this.soul.iframes <= 0);
    // A press a little early (still recharging, still flashing) isn't lost:
    // it's held for ABILITY_BUFFER seconds and goes off the moment it can.
    // While you're still flashing from a hit (up to a second, longer with
    // skills) it waits out the flashing, and the last moments of a recharge
    // too: before, a press in the first part of the flash was quietly dropped.
    // One that can't go off soon (still recharging, no charges left) blips,
    // so it doesn't feel like the key was missed.
    if (this.abilityPending) {
      this.abilityPending = false;
      const flashing = ability.whileHurt ? 0 : this.soul.iframes;
      const recharge = this.abilityCooldown <= ABILITY_RECHARGE_WAIT ? this.abilityCooldown : Infinity;
      const wait = hasCharges && !ability.hold ? Math.max(flashing, recharge) : Infinity;
      if (wait === Infinity) {
        if (!ability.hold) sfx('error');
      } else {
        this.abilityBuffered = ABILITY_BUFFER + wait;
      }
    } else {
      this.abilityBuffered = Math.max(0, (this.abilityBuffered ?? 0) - dt);
    }
    if (canUse && this.abilityBuffered > 0) {
      this.abilityBuffered = 0;
      if (ability.activate?.(this, input) === false) {
        // It fizzled: a short pause before trying again, but no charge used.
        this.abilityCooldown = 0.4;
      } else {
        this.abilityUses++;
        this.abilityLeft = ability.duration;
        this.abilityCooldown = ability.cooldown;
      }
    }

    ability.tick?.(this, dt);
    if (this.abilityLeft > 0) {
      this.abilityLeft = Math.max(0, this.abilityLeft - dt);
      ability.update?.(this, dt);
    }
  }

  // The text and recharge bar under the box.
  abilityStatus() {
    const ability = this.ability;
    if (ability.hold) return { label: `HOLD SHIFT: ${ability.name}`, readiness: 1 };
    let label = `SHIFT: ${ability.name}`;
    let readiness = ability.cooldown ? 1 - this.abilityCooldown / ability.cooldown : 1;
    if (ability.charges !== undefined) {
      const left = ability.charges - this.abilityUses;
      label += ` x${left}`;
      if (left <= 0) readiness = 0;
    }
    return { label, readiness };
  }

  // Damage dealt by a soul ability (like the gauntlets' reflect) during the
  // enemies' turn. It lands on one of the attackers still standing.
  damageEnemy(amount) {
    const standing = this.attacks.map((attack) => attack.foe).filter((foe) => foe.state === 'active' && foe.hp > 0);
    const foe = standing[Math.floor(Math.random() * standing.length)] ?? this.activeFoes()[0];
    if (!foe) return;
    amount = this.resist(foe, amount, 'spell');
    this.smokeLine = null;
    foe.hp = Math.max(0, foe.hp - amount);
    foe.flash = ENEMY_FLASH_SECONDS;
    this.addPopup(`${amount}`, foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
    sfx('hit');
  }

  healHero(amount) {
    // Knocked down, only an item or a healing spell gets you back up.
    if (this.hero.hp <= 0) return;
    this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + amount);
    this.addPopup(`+${amount}`, PARTY_FEET.x, PARTY_FEET.y - 46, hud.COLORS.enemyHp);
    sfx('heal');
  }

  // Touched a healing bullet: whoever this turn is aimed at gets `heals` HP
  // back (or you, if they're down), with a little burst of green.
  catchHeal(bullet) {
    bullet.spent = true;
    const member = this.victim?.hp > 0 ? this.victim : this.hero;
    if (member.hp <= 0) return;
    const healed = this.healMember(member, bullet.heals);
    const feet = this.memberFeet(member);
    this.addPopup(`+${healed}`, feet.x, feet.y - 46, hud.COLORS.enemyHp);
    this.addSparks(5, hud.COLORS.enemyHp, 60);
    sfx('heal');
  }

  // Called by abilities that destroy a bullet.
  onBlocked(bullet) {
    this.gainSp(BLOCK_SP);
    for (let i = 0; i < 3; i++) {
      this.sparks.push({
        x: bullet.x,
        y: bullet.y,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80,
        life: SPARK_SECONDS,
        color: hud.COLORS.teal,
      });
    }
  }

  checkBullets(dt) {
    const soul = this.soul;
    for (const bullet of this.bullets) {
      if (bullet.snuffs) {
        if (!bullet.spent && this.flameInBox()) this.checkSnuffer(bullet);
        continue;
      }
      // A friendly bullet (the Wisp's one real light): touching it heals
      // instead of hurting, and it's used up.
      if (bullet.heals) {
        if (!bullet.spent && bullet.edgeDistance(soul.x, soul.y) < SOUL_RADIUS) this.catchHeal(bullet);
        continue;
      }
      const gap = bullet.edgeDistance(soul.x, soul.y);
      if (gap < SOUL_RADIUS) this.hurt(bullet);
      else if (gap < this.grazeRadius) this.graze(bullet, dt);
      if (this.phase !== 'dodge') return;
    }
  }

  graze(bullet, dt) {
    if (this.soul.iframes > 0) return;
    // Some weapons (the staff) multiply what grazing earns.
    if (!bullet.grazed) {
      bullet.grazed = true;
      sfx('graze');
      this.gainSp(GRAZE_SP * this.grazeMultiplier * this.grazeSpBonus);
      this.dodgeTime += GRAZE_TURN_CUT_SECONDS;
      this.addSparks(2, hud.COLORS.sp, 50);
      feel.grazed(this, bullet);
      // Close Shave: a close call puts a little HP back in whoever it's aimed at.
      const mend = skillBonus('grazeHeal');
      const mended = this.victim?.hp > 0 ? this.victim : this.hero;
      if (mend && mended.hp > 0 && mended.hp < mended.maxHp) {
        mended.hp = Math.min(mended.maxHp, mended.hp + mend);
        this.addSparks(1, hud.COLORS.enemyHp, 40);
      }
    } else {
      this.gainSp(GRAZE_HOLD_SP_PER_SECOND * this.grazeMultiplier * this.grazeSpBonus * dt);
    }
    this.soul.graze();
  }

  addSparks(count, color, speed) {
    for (let i = 0; i < count; i++) {
      this.sparks.push({
        x: this.soul.x + (Math.random() - 0.5) * 6,
        y: this.soul.y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed - 15,
        life: SPARK_SECONDS,
        color,
      });
    }
  }

  hurt(bullet) {
    const soul = this.soul;
    if (soul.iframes > 0 || soul.untouchable > 0) return;
    // Whoever this turn is aimed at, or whoever's still standing once they're down.
    let victim = this.victim?.hp > 0 ? this.victim : this.party.find((member) => member.hp > 0);
    if (!victim) return;
    // Bramble's WADE IN: he steps in front, and takes the hit for his friend (halved).
    const wader = this.wading ? this.party.find((member) => member.ally && member.id === this.wading && member.hp > 0) : null;
    const waded = Boolean(wader && wader !== victim);
    if (waded) victim = wader;
    // Ves's PARASOL SPIN: the first hit this turn goes straight back at them.
    if (this.riposte) {
      const { damage: thrown } = this.riposte;
      this.riposte = null;
      this.damageEnemy(thrown);
      this.addPopup('RETURNED!', soul.x, soul.y - 18, hud.COLORS.teal);
      soul.iframes = BASE_IFRAMES + skillBonus('iframes');
      return;
    }
    // Her BRACE: the first hit on you this turn does nothing at all.
    if (this.absorb && victim === this.hero) {
      this.absorb = false;
      this.addPopup('BRACED!', soul.x, soul.y - 18, hud.COLORS.teal);
      this.addSparks(5, hud.COLORS.teal, 60);
      soul.iframes = BASE_IFRAMES + skillBonus('iframes');
      return;
    }
    this.hitThisTurn = true;
    let damage = bullet.dmg ?? this.bossPhase(this.foes[0])?.damage ?? this.foes[0].data.damage;
    if (this.defending || this.wardTurns > 0 || this.braced?.has(victim.id) || waded) damage = Math.ceil(damage / 2);
    // EBB AND FLOW: the tide that carries your hits carries theirs.
    if (this.tideSwap) damage = Math.ceil(damage * this.tideSwap.defence);
    // A fright (a bullet with `scare`: n% of your SP) takes the wind out of you,
    // unless Bramble's Chillin' has taught the party to stay cool.
    if (bullet.scare && !skillBonus('fearless')) {
      this.sp = Math.max(0, this.sp - bullet.scare);
      this.addPopup(`SCARED -${bullet.scare}% SP`, soul.x, soul.y - 30, hud.COLORS.calm);
    }
    // Thick Skin and the armor's DEF take a little off every hit on the hero,
    // and a friend's outfit's DEF off hits on them (but a hit always hurts a
    // bit; armor that lowers DEF makes hits hurt more). SHELTER takes a
    // little more off, whoever it lands on. (Hold Ground: more off the hero's
    // hits while they DEFEND.)
    const braced = this.defending ? skillBonus('defendDef') : 0;
    const guard = victim === this.hero ? skillBonus('damageReduction') + this.defense + braced : victim.ally ? memberGearBonus(victim.id, 'defense') : 0;
    damage = Math.max(1, damage - guard - (this.shelter?.def ?? 0));
    victim.hp = Math.max(0, victim.hp - damage);
    sfx('hurt');
    const feet = this.memberFeet(victim);
    this.addPopup(`${damage}`, feet.x, feet.y - 46, hud.COLORS.danger);
    this.shake = SHAKE_SECONDS;
    this.heroFlinch = SHAKE_SECONDS;
    feel.shadowHurt(this, victim, damage);
    this.flinching = victim;
    soul.iframes = BASE_IFRAMES + skillBonus('iframes');
    // Last Stand: the hero's first knockout of the battle leaves them hanging
    // on at 1 HP (and with Not Yet, the second as well).
    if (victim === this.hero && this.hero.hp <= 0 && this.lastStandReady > 0) {
      this.lastStandReady -= 1;
      this.hero.hp = 1;
      this.addPopup(this.lastStandReady ? 'LAST STAND!' : skillBonus('lastStand') > 1 ? 'NOT YET!' : 'LAST STAND!', soul.x, soul.y - 18, hud.COLORS.calm);
    }
    if (victim.hp > 0) return;
    // Knocked down: they can't act until someone heals them (an item, or a
    // healing spell), and the rest of the turn comes at whoever's left.
    // Only when the whole party is down is it over.
    const standing = this.party.filter((member) => member.hp > 0);
    if (standing.length) {
      this.addPopup('DOWN', feet.x, feet.y - 62, hud.COLORS.danger);
      this.victim = standing[Math.floor(Math.random() * standing.length)];
    } else {
      // The soul shatters into shards.
      soul.shattered = true;
      for (let i = 0; i < 4; i++) this.addSparks(3, soul.mode.color, 140);
      this.setPhase('defeat');
    }
  }

  // Every enemy is beaten or pacified: hand out what they left behind.
  win() {
    this.result = 'won';
    // (No win jingle: the battle song carries on as it always did; Patrick
    // preferred it. music.victory() is still there if it's ever wanted.)
    const { exp } = this.earned;
    // Every fight pays better than the enemies' own `coins` (goldReward, more
    // each chapter), and Lucky Pockets pays more again.
    const coins = Math.round(this.earned.coins * goldReward() * (1 + skillBonus('goldBonus')));
    HERO_STATE.gold += coins;
    let text = `You won!\nGot ${exp} EXP and ${coins} gold.`;
    for (const id of this.earned.items) {
      const got = giveItem(id);
      // "a Wild Carrot", "an Ice Shortbread", and no "a" before a plural like "Hush Bristles".
      const name = ITEMS[id].name;
      const aName = /[^s]s$/.test(name) ? name : `${/^[AEIOU]/i.test(name) ? 'an' : 'a'} ${name}`;
      text += got === 'stored' ? `\nGot ${aName}! (Your bag's full: it went to storage.)`
        : got ? `\nGot ${aName}!` : `\nYou couldn't carry the ${name}.`;
    }
    for (const [id, amount] of Object.entries(this.earned.materials)) {
      giveMaterial(id, amount);
      const material = MATERIALS[id];
      text += `\nGot ${amount} ${amount > 1 ? material.plural ?? `${material.name}s` : material.name}.`;
    }
    if (exp && gainExp(exp)) {
      this.levelledUp = true;
      sfx('levelUp');
      text += `\nLEVEL UP! Now LV ${HERO_STATE.level}. Press C to spend skill points.`;
    }
    // The EXP and gold count up over the party.
    feel.victory(this, exp, coins, this.levelledUp, this.memberFeet(this.hero));
    this.showMessage(text, 'exit');
  }

  draw(ctx) {
    this.backdrop(ctx, this.time, hud.STAGE_HEIGHT, this);
    // A phase's stage effects can change the set behind everything (the
    // house lights going), and draw over the stage and the panel (see
    // stageEffects.js).
    this.stageFx?.drawBack?.(ctx, this);

    // The stage shakes when you're hit; the UI stays put.
    ctx.save();
    // (As big as the hit was: battleFeel.js. Nothing with SCREEN SHAKE off.)
    const shook = feel.shakeOffset(this);
    if (shook) ctx.translate(shook.x, shook.y);
    this.drawParty(ctx);
    if (this.stageLantern) this.drawStageLantern(ctx);
    if (this.bossPhase()?.dropped) this.drawDropped(ctx, this.bossPhase().dropped);
    if (this.phase === 'bossIntro') this.drawBossIntro(ctx);
    for (const foe of this.foes) this.drawFoe(ctx, foe);
    this.bits.draw(ctx);
    this.stageFx?.drawOver?.(ctx, this);
    this.drawBox(ctx);
    this.fx.drawStage(ctx);
    // (A PERFECT's gold flash: battleFeel.js.)
    feel.drawCritFlash(ctx, this);
    ctx.restore();
    if (this.phase === 'bossIntro') this.drawBossIntroCurtains(ctx);

    inUiSpace(ctx, () => {
      this.drawSlash(ctx);
      this.strike?.drawLabels(ctx);
      if ((this.phase === 'taunt' || this.phase === 'bossIntro' || this.phase === 'speech') && this.taunt) {
        const { pos } = this.speaker;
        // Keep the bubble clear of the name and bars under a lone enemy.
        const statusTop = this.foes.length === 1 ? this.foeStatusTop(this.speaker) : hud.STAGE_HEIGHT * S;
        hud.drawSpeech(ctx, this.taunt.slice(0, this.visibleTauntChars()), pos.x * S - 4, (pos.y + 14) * S, statusTop);
      }
      // (Not over a phase's own set, when it takes the whole stage.)
      if (!this.stageFx?.ownsStage?.(this)) {
        hud.drawSpGauge(ctx, this.sp, this.time);
        feel.drawSpTick(ctx, this);
        this.drawFoeStatus(ctx);
      }
      if (this.flameInBox()) hud.drawLanternMeter(ctx, this.flame.stage, this.flame.stages, this.time);
      hud.drawPanel(ctx);
      const choosing = ['command', 'talk', 'spells', 'items', 'target', 'member', 'ally'].includes(this.phase);
      // The card and the buttons are whoever's acting: you, or the ally
      // taking their turn (until the enemies' turn starts).
      const allyTurn = this.actor?.ally && !['taunt', 'dodge', 'defeat', 'command'].includes(this.phase);
      // On the enemies' turn, whoever it's aimed at, so you see their HP fall.
      const aimedAt = this.phase === 'dodge' && this.victim?.hp > 0 ? this.victim : this.hero;
      hud.drawPartyCard(ctx, allyTurn ? this.actor : aimedAt, choosing);
      feel.drawCardGhost(ctx, allyTurn ? this.actor : aimedAt);
      const anyCalm = this.activeFoes().some((foe) => foe.calm >= 100);
      const noRun = this.bossFight() || this.noRun ? ['RUN'] : [];
      const commands = allyTurn ? ALLY_COMMANDS : COMMANDS;
      const sway = this.stageFx?.buttons?.(this, commands) ?? null;
      this.stageFx?.drawStrings?.(ctx, this, commands, sway);
      if (allyTurn) hud.drawCommands(ctx, ALLY_COMMANDS, this.allySelected, this.phase === 'ally', [], this.time, this.ally && isHurt(this.ally.id) ? ['FIGHT'] : [], sway);
      else hud.drawCommands(ctx, COMMANDS, this.selected, this.phase === 'command', anyCalm ? ['SPELLS'] : [], this.time, noRun, sway);
      this.drawPanelText(ctx);
      this.drawPopups(ctx);
      feel.drawCounts(ctx, this, this.memberFeet(this.hero));
      this.stageFx?.drawUi?.(ctx, this);
      if (this.phase === 'snap') this.drawMercySnap(ctx);
    });
    if (this.phase === 'bossIntro') this.drawBossIntroOverlay(ctx);
    if (this.phase === 'interject') this.interjection.box.draw(ctx);
    // A phase's `flash`: everything white, fading.
    if (this.stageFlash > 0) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = `rgba(255, 255, 255, ${(this.stageFlash / STAGE_FLASH_SECONDS).toFixed(3)})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
    // Nova: everything goes white.
    this.fx.drawScreen(ctx);
  }

  // One enemy: full name and bars under it; with several, a compact set beside each.
  // Where a lone enemy's name and bars go: under it, or, for one that
  // reaches the boards (the king on his stage), as low as they still show.
  foeStatusTop(foe) {
    return Math.min((foe.pos.y + foe.sprite.height * SCALE + ENEMY_STATUS_GAP) * S, hud.STAGE_HEIGHT * S - ENEMY_STATUS_HEIGHT);
  }

  drawFoeStatus(ctx) {
    if (this.foes.length === 1) {
      const foe = this.foes[0];
      if (foe.state !== 'active') return;
      const top = this.foeStatusTop(foe);
      const phase = this.bossPhase(foe);
      const swapT = (this.time - (foe.nameAt ?? -99)) / (phase?.anagram ? phase.nameSwap ?? NAME_SWAP_SECONDS : NAME_SWAP_SECONDS);
      // (A phase with `nameJitter` shakes the letters while they swap, and for
      // a moment after.)
      const jitter = phase?.nameJitter && foe.nameGo && this.time - (foe.nameAt ?? -99) < 1.2 ? 1 : 0;
      const swap = swapT < 1 ? { from: foe.nameFrom, t: swapT, jitter } : jitter ? { from: foe.name, t: 1, jitter } : null;
      hud.drawEnemyStatus(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, foe.center.x * S, top, this.time, (phase?.noMercy ?? foe.data.noMercy)?.meter !== false && !foe.mercySnapped, swap);
      feel.drawStatusGhost(ctx, foe, foe.center.x * S, top);
      return;
    }
    // Hidden while dodging, so the box stays clear, and while an enemy is
    // talking, since its bubble sits where these go.
    if (this.phase === 'dodge' || this.phase === 'defeat' || this.phase === 'taunt' || this.phase === 'bossIntro') return;
    // In one column just left of the whole group (so none sits over another
    // enemy's picture), each level with its enemy, top to bottom, never
    // closer than MINI_STATUS_SPACING.
    const active = this.activeFoes();
    if (!active.length) return;
    const x = Math.min(...this.foes.map((foe) => foe.pos.x)) * S - 8;
    let last = -Infinity;
    for (const foe of [...active].sort((a, b) => a.center.y - b.center.y)) {
      const y = Math.max(last + MINI_STATUS_SPACING, Math.round(foe.center.y * S) - 24, 6);
      last = y;
      hud.drawEnemyMini(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, x, y, this.time);
      feel.drawMiniGhost(ctx, foe, x, y);
    }
  }

  // Where a party member stands: each one a little behind and below the last.
  memberFeet(member) {
    const i = Math.max(0, this.party.indexOf(member));
    // Three (or more) stand closer and start higher, so the last one's feet
    // stay on the stage (it's STAGE_HEIGHT tall).
    const crowded = this.party.length >= 3;
    const top = crowded ? PARTY_FEET.y - 16 : PARTY_FEET.y;
    const step = crowded ? 24 : 30;
    const left = crowded ? PARTY_FEET.x + 16 : PARTY_FEET.x;
    return { x: left - i * 10, y: top + i * step + (i === 0 && this.party.length > 1 ? this.backRowDrop : 0) };
  }

  drawParty(ctx) {
    this.party.forEach((member, i) => {
      const sprite = member.sprite;
      const w = sprite.width * SCALE;
      const h = sprite.height * SCALE;
      const { x: feetX, y: feetY } = this.memberFeet(member);

      // A red arrow beside whoever the enemies' turn is aimed at, pointing at them.
      if (this.phase === 'dodge' && member === this.victim && member.hp > 0) {
        const tip = feetX + w / 2 + 4 + Math.round(Math.sin(this.time * 6) * 2);
        const mid = feetY - h / 2;
        ctx.fillStyle = hud.COLORS.danger;
        ctx.beginPath();
        ctx.moveTo(tip, mid);
        ctx.lineTo(tip + 7, mid - 5);
        ctx.lineTo(tip + 7, mid + 5);
        ctx.fill();
      }

      if ((this.phase === 'defeat' && member === this.hero) || member.hp <= 0) {
        // Collapsed onto their side (partyMoves.js: their weapon beside them, stars round their head).
        this.moves.drawDown(ctx, this, member, feetX, feetY);
        return;
      }

      this.drawAura(ctx, feetX, feetY, h, member.color);
      // Standing: swinging, casting, guarding, hiding... (partyMoves.js).
      this.moves.drawMember(ctx, this, member, i, feetX, feetY);
    });
    // Anything tossed from one of them to another.
    this.moves.drawOver(ctx, this);
  }

  // A soft pulsing glow behind the hero, a shadow at their feet, and rising motes.
  drawAura(ctx, feetX, feetY, height, color) {
    const pulse = 0.75 + 0.25 * Math.sin(this.time * 2);
    const cx = feetX;
    const cy = feetY - height / 2;
    const radius = 28;
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    glow.addColorStop(0, `rgba(79, 227, 208, ${(0.3 * pulse).toFixed(3)})`);
    glow.addColorStop(1, 'rgba(79, 227, 208, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(feetX, feetY - 1, 13, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    for (const mote of this.motes) {
      ctx.globalAlpha = Math.min(1, mote.life / AURA_MOTE_LIFE) * 0.8;
      ctx.fillStyle = mote.life > AURA_MOTE_LIFE * 0.6 ? '#ffffff' : color;
      ctx.fillRect(Math.round(mote.x), Math.round(mote.y), 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  // A white crescent sweeping across the enemy when a hit lands.
  drawSlash(ctx) {
    if (this.slashTime <= 0 || !this.slashFoe) return;
    const progress = 1 - this.slashTime / SLASH_SECONDS;
    const cx = this.slashFoe.center.x * S;
    const cy = this.slashFoe.center.y * S;
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    // An ally's slash is in their colour.
    ctx.strokeStyle = this.striker?.ally ? this.striker.color : '#ffffff';
    ctx.lineWidth = 8 * (1 - progress) + 1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 30, 70, Math.PI * 0.05, Math.PI * (0.05 + 0.5 * Math.min(1, progress * 2)));
    ctx.stroke();
    ctx.restore();
  }

  // An enemy bobbing in place; shaking after a hit; fading away once beaten
  // (or drifting up and away once pacified). One with a `beatenSprite` sinks
  // into that instead, and stays, still.
  foeHit(foe) {
    foe.hitAt = this.time;
    if (foe.anim?.chips) this.addChips(foe, 7, false);
    feelHit(this, foe);
  }

  // Bits flying off it: from its middle when it's hit, from anywhere on it
  // (and only falling) as it breaks.
  addChips(foe, count, falling) {
    const w = foe.sprite.width * SCALE;
    const h = foe.sprite.height * SCALE;
    for (let i = 0; i < count; i++) {
      foe.chips.push({
        at: this.time,
        x: foe.pos.x + w * (falling ? 0.15 + Math.random() * 0.7 : 0.35 + Math.random() * 0.3),
        y: foe.pos.y + h * (falling ? 0.2 + Math.random() * 0.5 : 0.4 + Math.random() * 0.2),
        vx: falling ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 160,
        vy: falling ? Math.random() * 20 : -40 - Math.random() * 90,
        size: Math.random() < 0.3 ? 4 : 2,
        color: foe.anim.chips[Math.floor(Math.random() * foe.anim.chips.length)],
      });
    }
  }

  drawChips(ctx, foe) {
    for (const chip of foe.chips) {
      const t = this.time - chip.at;
      ctx.fillStyle = chip.color;
      ctx.fillRect(Math.round(chip.x + chip.vx * t), Math.round(chip.y + chip.vy * t + 260 * t * t), chip.size, chip.size);
    }
  }

  // Whether it's mid-sentence in a speech bubble (its `talk` clip plays then).
  isTalking(foe) {
    return foe === this.speaker && Boolean(this.taunt) && ['taunt', 'speech', 'bossIntro'].includes(this.phase) && this.visibleTauntChars() < this.taunt.length;
  }

  // The sprite its `anim` says to show now, or null for its usual one.
  animFrame(foe) {
    const anim = foe.anim;
    if (!anim) return null;
    if (foe.state === 'defeated') return clipFrame(anim.death, this.time - foe.leftAt, true);
    if (foe.state === 'pacified') return clipFrame(anim.spared, this.time - foe.leftAt, true);
    return clipFrame(anim.hurt, this.time - foe.hitAt)
      ?? clipFrame(anim.intro, this.time - foe.introAt)
      ?? clipFrame(anim.windup, this.time - foe.attackAt)
      // (Worn down, it winces now and then: battleFeel.js.)
      ?? clipFrame(anim.hurt, this.time - (foe.winceAt ?? -99))
      ?? (anim.talk && this.isTalking(foe) ? loopFrame(anim.talk, this.time) : null)
      ?? (anim.idle ? loopFrame(anim.idle, this.time) : null);
  }

  drawFoe(ctx, foe) {
    // A boss beaten, rocked by its finale (see bossFinale) before its death
    // plays: shaking harder and harder, flashing white, in its hurt look.
    if (foe.state === 'defeated' && this.time < foe.leftAt) {
      const t = FINALE_SECONDS - (foe.leftAt - this.time);
      const hard = 1 + 2 * Math.max(0, t / FINALE_SECONDS);
      const dx = Math.round(Math.sin(this.time * 61) * hard);
      const dy = Math.round(Math.cos(this.time * 47) * hard * 0.6);
      const white = this.hitStop > 0 || Math.floor(t / 0.07) % 3 === 0;
      const look = foe.anim?.hurt ? clipFrame(foe.anim.hurt, 0) : foe.sprite;
      ctx.drawImage(white ? foe.flashSprite : look, foe.pos.x + dx, foe.pos.y + dy, foe.sprite.width * SCALE, foe.sprite.height * SCALE);
      this.drawChips(ctx, foe);
      return;
    }
    // Its death or sparing, played out, before it's left broken or fades.
    const leaving = foe.state === 'defeated' ? foe.anim?.death : foe.state === 'pacified' ? foe.anim?.spared : null;
    if (leaving && (foe.beatenSprite || this.time - foe.leftAt < clipLength(leaving))) {
      if (foe === this.phased && this.stageFx?.drawFoe?.(ctx, this, foe, foe.pos.x, foe.pos.y, foe.sprite.width * SCALE, foe.sprite.height * SCALE)) {
        this.drawChips(ctx, foe);
        return;
      }
      const sprite = this.animFrame(foe);
      const bottom = foe.pos.y + foe.sprite.height * SCALE;
      const shake = Math.round(Math.sin((this.time - foe.leftAt) * 47) * 2 * Math.max(0, 1 - (this.time - foe.leftAt) / clipLength(leaving)));
      ctx.drawImage(sprite, foe.pos.x + shake, bottom - sprite.height * SCALE, sprite.width * SCALE, sprite.height * SCALE);
      this.drawChips(ctx, foe);
      return;
    }
    if (foe.state === 'defeated' && foe.beatenSprite) {
      const sprite = foe.beatenSprite;
      const bottom = foe.pos.y + foe.sprite.height * SCALE;
      // A shudder as she goes down.
      const shake = Math.round(Math.sin((this.time - foe.leftAt) * 50) * 2 * Math.max(0, 1 - (this.time - foe.leftAt) * 2));
      ctx.drawImage(sprite, foe.pos.x + shake, bottom - sprite.height * SCALE, sprite.width * SCALE, sprite.height * SCALE);
      return;
    }
    let w = foe.sprite.width * SCALE;
    let h = foe.sprite.height * SCALE;
    let x = foe.pos.x;
    // (Unless it's `still`: a statue stands.)
    let y = foe.pos.y + (foe.data.still ? 0 : Math.round(Math.sin(this.time * 2 + foe.pos.y) * 2));
    let alpha = 1;
    // A boss on its way in (its `entrance`), squashing down as it lands.
    if (this.phase === 'bossIntro' && foe === this.speaker) {
      const e = this.entrance(foe);
      const sw = Math.round(w * e.sx);
      const sh = Math.round(h * e.sy);
      x += Math.round(e.x) + Math.round((w - sw) / 2);
      y += Math.round(e.y) + (h - sh);
      w = sw;
      h = sh;
      alpha *= e.alpha;
    }
    // Made of smoke, he wavers.
    if (this.bossPhase(foe)?.smoke) alpha = 0.78 + 0.22 * Math.sin(this.time * 5);
    if (this.phase === 'fightResult' && foe === this.target) {
      x += Math.round(Math.sin(this.phaseTime * 40) * 3 * Math.max(0, 1 - this.phaseTime));
    }
    if (foe.state !== 'active') {
      // (After its death or sparing has played, if it has one.)
      const gone = this.time - foe.leftAt - clipLength(leaving);
      if (gone >= FOE_FADE_SECONDS) return;
      // Beaten, it leaves its own way (its `feel.exit`: sinks, scuttles off, pops).
      const exit = foe.state === 'defeated' ? exitPose(foe, gone / FOE_FADE_SECONDS) : null;
      if (exit?.gone) return;
      alpha *= exit ? Math.max(0, Math.min(1, exit.alpha)) : 1 - gone / FOE_FADE_SECONDS;
      if (foe.state === 'pacified') y -= Math.round(gone * 16);
      if (exit) {
        x += exit.dx;
        y += exit.dy;
        if (exit.turn) {
          const frame = this.animFrame(foe) ?? foe.sprite;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.translate(Math.round(x + w / 2), Math.round(y + h / 2));
          ctx.rotate(exit.turn);
          ctx.drawImage(frame, -w / 2, -h / 2, w, h);
          ctx.restore();
          this.drawChips(ctx, foe);
          return;
        }
      }
    }

    // A phase's stage effects can draw it themselves (the puppet coming alive).
    if (foe === this.phased && this.stageFx?.drawFoe?.(ctx, this, foe, x, y, w, h)) {
      this.drawChips(ctx, foe);
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    // A hurt frame flinches instead of flashing white, if it has one.
    const frame = this.animFrame(foe);
    const hurting = frame && foe.anim.hurt && this.time - foe.hitAt < clipLength(foe.anim.hurt);
    // (Squashed as it's struck, breathing while it stands: battleFeel.js.)
    const pose = feel.foePose(this, foe, x, y, w, h);
    ctx.drawImage(foe.flash > 0 && !hurting ? foe.flashSprite : frame ?? foe.sprite, pose.x, pose.y, pose.w, pose.h);
    ctx.restore();
    this.drawChips(ctx, foe);
  }

  // The box and soul are drawn in UI space (fine outline, detailed heart);
  // the bullets in world space (pixel art).
  drawBox(ctx) {
    if (this.phase !== 'dodge' && this.phase !== 'defeat') return;
    const box = hud.BOX;
    const open = this.phase === 'dodge' ? Math.min(1, this.phaseTime / BOX_OPEN_SECONDS) : 1;
    // A phase's stage effects can hang the box from the rigging: the whole
    // box, bullets and soul swing together (only how it looks: nothing in
    // it moves against anything else). `sway` is in world units.
    const sway = this.stageFx?.boxSway?.(this) ?? null;
    if (sway) this.stageFx.drawRigging?.(ctx, this, sway);
    // Or turn it about its middle (`boxTurn`, radians: Corrie's whirlpool).
    // Like the sway, only how it looks: everything in it turns together.
    // An attack can tip the box too (`box.tilt`, radians: the captain's listing deck).
    const turn = (this.stageFx?.boxTurn?.(this) ?? 0) + (box.tilt ?? 0);
    const spin = (scale) => {
      if (!turn) return;
      const cx = (box.x + box.w / 2) * scale;
      const cy = (box.y + box.h / 2) * scale;
      ctx.translate(cx, cy);
      ctx.rotate(turn);
      ctx.translate(-cx, -cy);
    };
    const ui = (draw, turned = true) => inUiSpace(ctx, () => {
      if (sway) ctx.translate(Math.round(sway.x * S), Math.round(sway.y * S));
      if (turned) spin(S);
      draw();
    });
    // (A phase's stage effects can draw the box themselves: King Peptup's
    // finale tears it open.)
    ui(() => this.stageFx?.drawBoxBack?.(ctx, this, open) || hud.drawBoxBack(ctx, open));

    if (open >= 1) {
      ctx.save();
      if (sway) ctx.translate(Math.round(sway.x), Math.round(sway.y));
      spin(1);
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.w, box.h);
      ctx.clip();
      if (this.flameInBox()) this.drawFlame(ctx);
      // (In Peptup's torn-open finale every bullet gets a dark halo, so it
      // never melts into the set behind.)
      if (box.tear) { ctx.shadowColor = '#000'; ctx.shadowBlur = 6; }
      for (const bullet of this.bullets) bullet.draw(ctx);
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      for (const spark of this.sparks) {
        ctx.globalAlpha = spark.life / SPARK_SECONDS;
        ctx.fillStyle = spark.color;
        ctx.fillRect(Math.round(spark.x), Math.round(spark.y), 1, 1);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      ui(() => {
        const r = hud.boxRect();
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.clip();
        if (this.ability) {
          this.ability.drawAlways?.(ctx, this);
          if (this.abilityLeft > 0) this.ability.draw?.(ctx, this, this.abilityLeft);
        }
        this.soul.draw(ctx);
        feel.drawReady(ctx, this, BOX_OPEN_SECONDS);
      });
    }

    ui(() => {
      if (this.stageFx?.drawBoxBorder?.(ctx, this, open)) return;
      // (It jolts when the shadow is hurt.)
      const jolt = feel.borderJolt(this);
      ctx.translate(jolt, -Math.round(jolt / 2));
      hud.drawBoxBorder(ctx, open);
      if (open >= 1) feel.drawEncore(ctx, this);
    });
    ui(() => {
      if (this.ability && this.phase === 'dodge' && open >= 1) {
        const { label, readiness } = this.abilityStatus();
        hud.drawAbility(ctx, label, readiness);
      }
    }, false);
  }

  // The lantern's flame in the box, growing with each stage, flickering when
  // a snuffer reaches it, with a pale thread from each snuffer to it so you
  // can see which bullets are after it. Drawn in world space.
  drawFlame(ctx) {
    const flame = this.flame;
    ctx.save();
    ctx.strokeStyle = '#aae0ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 3]);
    ctx.globalAlpha = 0.35;
    for (const bullet of this.bullets) {
      if (!bullet.snuffs) continue;
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(flame.x, flame.y);
      ctx.stroke();
    }
    ctx.restore();
    lanternSprite ??= makeSprite(PROP_SPRITES.mothers_lantern, PROP_PALETTE);
    ctx.drawImage(lanternSprite, Math.round(flame.x - lanternSprite.width / 2), Math.round(flame.y - 5));
    const flicker = flame.flicker > 0 ? 0.5 + 0.5 * Math.sin(this.time * 60) : 1;
    const size = (1 + flame.stage + Math.max(0, flame.guard) * 0.4) * flicker;
    const glow = ctx.createRadialGradient(flame.x, flame.y, 1, flame.x, flame.y, 6 + size * 3);
    glow.addColorStop(0, 'rgba(255, 200, 110, 0.5)');
    glow.addColorStop(1, 'rgba(255, 200, 110, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(flame.x - 24, flame.y - 24, 48, 48);
    const h = Math.round(2 + size * 1.6);
    const sway = Math.round(Math.sin(this.time * 9));
    ctx.fillStyle = '#ff8c1a';
    ctx.fillRect(Math.round(flame.x - 1) + sway, Math.round(flame.y + 1 - h), 3, h);
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(Math.round(flame.x) + sway, Math.round(flame.y + 2 - h), 1, Math.max(1, h - 1));
    // Its guard this turn: a dot for each snuffer it can still shrug off.
    ctx.fillStyle = '#ffd27a';
    for (let i = 0; i < flame.guard; i++) ctx.fillRect(Math.round(flame.x - flame.guard + i * 2), Math.round(flame.y + 8), 1, 1);
  }

  // Something a boss dropped, lying on the stage in front of Ves (a phase's
  // `dropped`, a prop sprite: the Hush losing her umbrella).
  drawDropped(ctx, look) {
    if (!PROP_SPRITES[look]) return;
    this.droppedSprites ??= {};
    this.droppedSprites[look] ??= makeSprite(PROP_SPRITES[look], PROP_PALETTE);
    const sprite = this.droppedSprites[look];
    const ves = this.party.find((member) => member.ally) ?? this.hero;
    const feet = this.memberFeet(ves);
    ctx.drawImage(sprite, Math.round(feet.x + 14), Math.round(feet.y - sprite.height));
  }

  // Her lantern on the stage, by Ves: cold where it landed, then catching,
  // then blazing, its light washing over everything once it's lit.
  drawStageLantern(ctx) {
    const ves = this.party.find((member) => member.ally) ?? this.hero;
    const feet = this.memberFeet(ves);
    const x = feet.x + 16;
    const y = feet.y;
    const lit = this.flame ? this.flame.stage / this.flame.stages : 0;
    lanternSprite ??= makeSprite(PROP_SPRITES.mothers_lantern, PROP_PALETTE);
    const radius = 10 + lit * 50 + (lit >= 1 ? 30 + Math.sin(this.time * 3) * 6 : 0);
    if (lit > 0) {
      const glow = ctx.createRadialGradient(x, y - 6, 1, x, y - 6, radius);
      glow.addColorStop(0, `rgba(255, 196, 100, ${(0.25 + 0.35 * lit).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 196, 100, 0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.fillRect(x - radius, y - 6 - radius, radius * 2, radius * 2);
      // Blazing: a warm wash across the whole summit.
      if (lit >= 1) {
        ctx.fillStyle = `rgba(255, 170, 80, ${(0.07 + 0.02 * Math.sin(this.time * 2)).toFixed(3)})`;
        ctx.fillRect(0, 0, ctx.canvas.width, hud.STAGE_HEIGHT);
      }
      ctx.restore();
    }
    ctx.drawImage(lanternSprite, Math.round(x - lanternSprite.width / 2), Math.round(y - lanternSprite.height));
    if (lit > 0) {
      ctx.fillStyle = lit >= 1 ? '#fff2c0' : '#ffb347';
      ctx.fillRect(Math.round(x - 1), Math.round(y - 7 - lit * 2), 2, Math.round(2 + lit * 2));
    }
  }

  // What a spell does, for the line under the SPELLS list: its section of
  // text/spells/spells.txt, with {amount} the number it would do right now.
  spellDescription(spell) {
    const healBoost = 1 + skillBonus('healBoost');
    const amounts = { heal: HEAL_PULSE_HP * healBoost, mend: MEND_HP * healBoost };
    const mercy = { lull: LULL_CALM, hush: HUSH_CALM, serenade: SPELLS.serenade.calm, soothe: SPELLS.soothe.calm, truce: SPELLS.truce.calm };
    let amount = spell.id in mercy ? Math.round(spellMercy(mercy[spell.id]) * (1 + skillBonus('mercyBoost')))
      : this.potent(amounts[spell.id] ?? (SPELLS[spell.id].heals ?? 0) * healBoost);
    if (spell.id === 'ward') amount = WARD_TURNS;
    else if (SPELLS[spell.id].turns) amount = SPELLS[spell.id].turns;
    else if (SPELLS[spell.id].power) amount = this.spellDamage(spell.id);
    return spellText(spell.id, { amount });
  }

  // The same for an ally's spells (<id>_<label> in the file), with their
  // skills and gear counted in, as allyAct does.
  allySpellDescription(ally, command) {
    const bonus = (effect) => this.allyBonus(ally, effect);
    return spellText(`${ally.id}_${command.label.toLowerCase()}`, {
      def: SHELTER_DEF + Math.max(0, bonus('shelterDef')),
      calm: this.allyCalmAmount(ally, command.calmAll ?? 0),
      // (A strike waiting on Bramble's sneak attack, after he HIDES, counts it: the number shown is what lands.)
      damage: command.team ? this.teamDamage(ally, command.team)
        : Math.round(this.allyStrikeDamage(ally, command.strikeAll ?? command.strikeOne ?? command.riposte ?? 0) * (command.strikeAll || command.strikeOne ? this.sneakPower(ally, true) : 1)),
      heal: this.allyPotent(ally, Math.max(0, (command.heal ?? command.healAll ?? command.regen ?? 0) + bonus('allyHeal'))),
      sp: this.allySpGift(ally, command.sp ?? 0),
      turns: command.turns ?? 0,
      seconds: (command.headwind ?? command.sail ?? 0) + Math.max(0, bonus('gust')),
    });
  }

  drawPanelText(ctx) {
    switch (this.phase) {
      case 'fight':
      case 'fightResult':
        this.strike?.drawBar(ctx);
        break;
      case 'message':
        hud.drawTextBox(ctx, this.message.text);
        break;
      case 'command':
        hud.drawTextBox(ctx, this.flavor);
        break;
      case 'target':
        hud.drawTargets(ctx, this.activeFoes(), this.cursor, this.time);
        break;
      case 'member':
        hud.drawOptions(ctx, this.party.map((member) => ({
          label: member.name,
          note: member.hp > 0 ? `${member.hp}/${member.maxHp}` : 'DOWN',
          enabled: true,
        })), this.cursor);
        break;
      case 'talk':
        hud.drawOptions(ctx, this.talkOptions(this.target).map((option) => ({
          label: option.name,
          ...(option.sp ? { note: `${option.sp}% SP` } : {}),
          enabled: !this.aboutDownAlly(option.name) && (!option.sp || this.sp >= option.sp),
        })), this.cursor);
        break;
      case 'ally':
        hud.drawTextBox(ctx, this.allyPrompt);
        break;
      case 'spells': {
        if (this.actor.ally) {
          hud.drawOptions(ctx, this.allyCommands(this.actor).map((command) => ({
            label: command.label,
            note: command.cost ? `${command.cost}% SP` : 'FREE',
            enabled: this.sp >= (command.cost ?? 0),
            description: this.allySpellDescription(this.actor, command),
          })), this.cursor);
          break;
        }
        const anyCalm = this.activeFoes().some((foe) => foe.calm >= 100);
        hud.drawOptions(ctx, this.spells.map((spell) => ({
          label: spell.name,
          note: this.freeSpell ? 'FREE' : `${spell.sp}% SP`,
          enabled: (this.freeSpell || this.sp >= spell.sp) && (spell.id !== 'pacify' || anyCalm),
          description: this.spellDescription(spell),
        })), this.cursor);
        break;
      }
      case 'items':
        hud.drawOptions(ctx, this.items.map((id) => ({
          label: ITEMS[id].name,
          note: healLabel(id),
          noteColor: hud.COLORS.enemyHp,
          enabled: true,
        })), this.cursor);
        break;
      case 'dodge':
        // (An attack can put up a hint of its own partway through: `hint` on
        // the box, as Peptup's finale does when your shadow turns heavy.)
        if (hud.BOX.hint || this.dodgeHint) hud.drawTextBox(ctx, hud.BOX.hint || this.dodgeHint);
        break;
    }
  }

  drawPopups(ctx) {
    // (Numbers pop and hop, words rise: battleFeel.js.)
    for (const popup of this.popups) feel.drawPopup(ctx, popup, POPUP_SECONDS);
    ctx.globalAlpha = 1;
  }
}
