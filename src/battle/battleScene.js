import { UI_SCALE as S, UI_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
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
  const together = partyIds().includes('vesper');
  return together && MOUNTAIN_AREAS.has(area) && SONGS.mountainBattle ? 'mountainBattle' : 'battle';
}
import { textFile, textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { TextBox } from '../ui/textbox.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { MEMBERS, partyIds, memberSprites, memberMaxHp, memberGrowth, hurtState, isHurt, setHurt } from '../characters/party.js';
import { memberGearBonus, memberFightPower } from '../characters/equipment.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, giveItem, healLabel } from '../data/items.js';
import { MATERIALS, giveMaterial } from '../data/candles.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { gainExp, heroMaxHp, heroHp, setHeroHp, healHeroFully, knownSpells, memberCommands, skillBonus, memberSkillBonus, heroDefense, spellPotency, armorSpGain } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { SPELLS, SPELL_WEAPON_CAP } from '../data/spells.js';
import { Soul, SOUL_RADIUS, GRAZE_RADIUS } from './soul.js';
import { SOUL_ABILITIES } from './soulAbilities.js';
import { createPattern } from './bullets.js';
import { StrikeBar, BASE_SLASH_COUNT, SLASH_DAMAGE, PERFECT_SLASH_DAMAGE } from './strikeBar.js';
import { BACKDROPS } from './backdrops.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import * as hud from './hud.js';
import { SpellEffects } from './spellEffects.js';
import { StageBits, entranceOffset, bitColors, ENTER_LANDS } from './stageBits.js';

// The party fights from the left. Only the hero for now; max HP and level come
// from their progress (src/characters/progress.js).
const PARTY = [{ name: 'HERO', color: '#4fe3d0', sprite: HERO_ANIMATIONS.right[0] }];
const DEFEND_SP = 16;
const BASE_IFRAMES = 1;

// Gold won from a fight, as a multiple of the enemies' `coins` rewards. Later
// chapters' fights are harder, so they pay more: half as much again for each
// chapter after the first (x1.5 in chapter 1, x2.25 in 2, x3 in 3).
const GOLD_REWARD = 1.5;
const GOLD_PER_CHAPTER = 0.5;
const goldReward = () => GOLD_REWARD * (1 + GOLD_PER_CHAPTER * ((WORLD_STATE.chapter ?? 1) - 1));
// Fights refuse enemies with fewer different attacks than this.
const MIN_ATTACKS = 3;

// What each spell does (costs are in src/data/spells.js), before the armor's
// MAG (spellPotency) makes it stronger. Attack spells have a `power` there
// instead, a multiple of your best FIGHT (see spellDamage). Pacify only works
// once the target is fully calm. Spells in TARGETED_SPELLS ask which enemy.
const HEAL_PULSE_HP = 35;
const LULL_CALM = 30;
// Chapter 2's spells.
const MEND_HP = 20;
const HUSH_CALM = 20;
const WARD_TURNS = 2;
// Chapters 3 and 4: Balm and Renew heal by their `heals` (src/data/spells.js),
// Aegis is a ward of `turns`, Serenade calms everyone by its `calm`.
const TARGETED_SPELLS = new Set(['rend', 'lull', 'pacify', 'starfall', 'comet', 'spark', 'siphon', 'sunder', 'lance', 'tempest', 'nova']);
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
};
// What each attack spell looks like (a kind from src/battle/spellEffects.js),
// where it isn't a kind of its own.
const ATTACK_SPELL_FX = { rend: 'slash', sunder: 'slash', lance: 'spark', tempest: 'comet' };

// A spell's one-line description from text/spells/spells.txt, with its
// {placeholders} filled in from `values`. Empty if it hasn't got one.
function spellText(section, values) {
  const text = textFile('spells/spells.txt')[section]?.[0] ?? '';
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

// Grazing, like Deltarune: a bullet entering the graze area gives a burst of SP
// and shaves a little off the enemy's turn; staying close keeps trickling SP in.
const GRAZE_SP = 2.5;
const GRAZE_HOLD_SP_PER_SECOND = 4;
const GRAZE_TURN_CUT_SECONDS = 0.08;
// Blocking a bullet with a weapon ability gives a little SP too.
const BLOCK_SP = 1;

// Running away gets likelier every turn.
const RUN_BASE_CHANCE = 0.4;
const RUN_CHANCE_PER_TURN = 0.15;
const RUN_MAX_CHANCE = 0.9;

// Fighting a group. At most two enemies attack in a turn; their bullets are
// thinned out, and the second one starts a moment later, so it stays fair.
const MAX_ATTACKERS = 2;
const COMBINED_DENSITY = 0.8;
const SECOND_ATTACKER_DELAY = 0.6;
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
const ENEMY_STATUS_GAP = 4;

const BOX_OPEN_SECONDS = 0.25;
// Where the battle box belongs. An attack can pick the box up and move it
// (the Bog Toad's GULP); it's always put back here when the turn ends.
const BOX_HOME = { x: hud.BOX.x, y: hud.BOX.y };
function boxHome() {
  hud.BOX.x = BOX_HOME.x;
  hud.BOX.y = BOX_HOME.y;
  delete hud.BOX.heldBy;
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
    out[name] = { sprites: clip.frames.map((rows) => makeSprite(rows, palette)), fps: clip.fps ?? ANIM_FPS };
  }
  return out;
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
  constructor(enemies, onEnd, area = 'ruins', { noRun = null } = {}) {
    const list = Array.isArray(enemies) ? enemies : [enemies];
    this.noRun = noRun;
    // A big boss fought alone can stand somewhere of its own (`battlePos`, its
    // top-left), to fit sprites wider or taller than the usual spot allows.
    const layout = list.length === 1 && list[0].battlePos ? [list[0].battlePos] : FOE_LAYOUTS[list.length];
    if (!layout) throw new Error(`A battle needs 1 to 3 enemies, not ${list.length}`);
    this.onEnd = onEnd;
    this.area = area;
    // A boss can bring its own background; otherwise it's the area's.
    this.backdrop = BACKDROPS[list.find((data) => data.backdrop)?.backdrop] ?? BACKDROPS[area] ?? BACKDROPS.ruins;
    this.foes = list.map((data, i) => this.makeFoe(data, layout[i]));
    for (const foe of this.foes) this.checkPatterns(foe.data);
    // A boss fought in `phases` (the Usurper), and the lantern flame one of
    // them can put in the box (see enterPhase).
    this.phased = this.foes.find((foe) => foe.data.phases) ?? null;
    this.flame = null;
    // Her lantern is on the stage from the start, cold in the snow where he
    // threw it (summit_arrival), before Ves starts to relight it.
    this.stageLantern = Boolean(this.phased?.data.phases.some((phase) => phase.flame));
    this.provoked = false;
    this.flameGuardBonus = 0;

    // HP carries over from the last fight (see heroHp in progress.js). Friends
    // in the party (src/characters/party.js) stand behind you and take a turn
    // each after yours.
    this.party = [
      ...PARTY.map((member) => ({ ...member, level: HERO_STATE.level, maxHp: heroMaxHp(), hp: heroHp() })),
      // (A hurt friend sits on the ground for the fight: their `hurt` look.)
      ...partyIds().map((id) => ({
        id, ...MEMBERS[id], commands: memberCommands(id), sprite: this.memberSprite(id), level: HERO_STATE.level, maxHp: memberMaxHp(id), hp: memberMaxHp(id), ally: true, hurt: Boolean(hurtState(id)),
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

    // Learned skills shape the whole battle.
    // Thrift and Gentle Hands make spells cheaper.
    this.spells = knownSpells().map((id) => {
      const discount = skillBonus('spellDiscount') + (id === 'pacify' ? skillBonus('pacifyDiscount') : 0);
      return { id, ...SPELLS[id], sp: Math.max(1, Math.round(SPELLS[id].sp * (1 - Math.min(0.9, discount)))) };
    });
    this.fightPowerBonus = 1 + skillBonus('fightPower');
    this.grazeRadius = GRAZE_RADIUS + skillBonus('grazeRadius');
    // Friends' gear (src/characters/equipment.js) looks after you too: more
    // SP from grazes, and a little HP back after every enemy turn.
    const allies = this.party.filter((member) => member.ally);
    this.grazeSpBonus = 1 + skillBonus('grazeSp') + armorSpGain() + allies.reduce((sum, ally) => sum + memberGearBonus(ally.id, 'grazeSp'), 0);
    // The armor: DEF takes something off every hit, MAG strengthens spells.
    this.defense = heroDefense();
    this.potency = spellPotency();
    this.lastStandReady = skillBonus('lastStand') > 0;

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
    this.ability = this.weapon.ability ? SOUL_ABILITIES[this.weapon.ability] : null;
    this.abilityCooldown = 0;
    this.abilityLeft = 0;
    this.abilityUses = 0;
    this.abilityState = {};
    this.abilityHintShown = false;
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
    this.tauntBubbles = this.foeLines(foe, 'boss_intro').flatMap(hud.speechBubbles);
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
      case 'swoop':
        this.shake = SHAKE_SECONDS;
        this.bits.dust(feet.x, feet.y, w * 0.8, 10, { color: '#9aa4c8' });
        this.bits.ring(foe.center.x, foe.center.y, { speed: 140, color: '#9aa4c8' });
        sfx('whoosh');
        break;
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
    if (!this.landed && this.phaseTime >= ENTER_LANDS) this.bossLands(this.speaker);
    if (this.phaseTime < INTRO_CARD_SECONDS) {
      // Z skips the title card (after a moment, so a held key doesn't).
      if (this.phaseTime > 1 && input.wasPressed('confirm')) this.phaseTime = INTRO_CARD_SECONDS;
      return;
    }
    const next = () => {
      if (!this.tauntBubbles.length) {
        this.taunt = null;
        this.showIntro();
        return;
      }
      this.taunt = this.tauntBubbles.shift();
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
      introAt: -99,
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
  //   flash         the stage flashes white as it starts
  //   dropped       a prop sprite lying on the stage in front of Ves
  //   beat          what's said as the phase starts: [{ who?, say }], `say` a
  //                 section; with no `who`, in the panel; with a party
  //                 member's id, in their box; with 'foe', in its bubble
  // The phase it's in now, or null.
  bossPhase(foe = this.phased) {
    return foe?.data.phases?.[foe.phase] ?? null;
  }

  // The flame is in the box (a phase with `flame`).
  flameInBox() {
    return Boolean(this.flame && this.bossPhase()?.flame);
  }

  enterPhase(foe, index) {
    foe.phase = index;
    foe.phaseTurns = 0;
    const phase = foe.data.phases[index];
    // A phase can bring its own music in (the Usurper's three movements).
    if (phase.music) music.play(phase.music);
    if (phase.sprite) {
      const white = Object.fromEntries(Object.keys(phase.sprite.palette).map((key) => [key, '#ffffff']));
      foe.sprite = makeSprite(phase.sprite.rows, phase.sprite.palette);
      foe.flashSprite = makeSprite(phase.sprite.rows, white);
    }
    if (phase.anim) foe.anim = compileAnim(phase.anim, phase.sprite?.palette ?? foe.data.sprite.palette);
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
      member.commands = memberCommands(id);
      member.maxHp = memberMaxHp(id);
      member.hp = member.maxHp;
      member.sprite = this.memberSprite(id);
    }
    if (phase.flash) {
      this.stageFlash = STAGE_FLASH_SECONDS;
      sfx('flare');
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

  // `then` is where the battle goes after the new phase's beat; `force` goes
  // on whatever `until` says (after an `allyTurn` that ends the phase).
  nextBossPhase(foe, then = 'command', force = false) {
    const until = this.bossPhase(foe)?.until;
    const next = foe.data.phases[foe.phase + 1];
    if (!until || !next) return false;
    const met = (until.turns && foe.phaseTurns >= until.turns) || (until.flame && this.flame?.stage >= this.flame.stages)
      || (until.below && foe.hp <= foe.maxHp * until.below);
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
      box.open(lines, partyIds().includes(step.who) ? step.who : null);
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
    this.tauntBubbles = lines.flatMap(hud.speechBubbles);
    this.taunt = this.tauntBubbles.shift();
    this.tauntStart = 0;
    this.tauntSkipped = false;
    this.speechDone = done;
    this.setPhase('speech');
  }

  // A phase with `smoke` lets only that share of a hit through (`kind` is
  // 'fight' or 'spell'), and the panel says so after.
  resist(foe, damage, kind) {
    // A phase with a `floor` can't be brought below that share of its max
    // HP: there's more of the fight to come (the Hush, before the umbrella's free).
    const floor = this.bossPhase(foe)?.floor;
    if (floor) damage = Math.min(damage, Math.max(0, foe.hp - Math.ceil(foe.maxHp * floor)));
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
    return [...ally.commands.filter((command) => change.keep?.includes(command.label)), ...(change.add ?? [])];
  }

  // An ally's weapon power for FIGHT: their own, or the phase's `allyFight`.
  allyWeaponPower(ally) {
    return this.bossPhase()?.allyFight?.[ally.id]?.power ?? memberFightPower(ally.id);
  }

  // A team attack (`team`): your best FIGHT and theirs together, times `team`.
  teamDamage(ally, team) {
    return Math.max(1, Math.round((this.bestStrike(this.hero) + this.bestStrike(ally)) * team) + this.allyBonus(ally, 'allyStrike'));
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
    music.play(this.foes[0].data.music ?? battleSong(this.area));
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
        // skills are yours alone.
        this.striker = this.actor;
        this.strike = new StrikeBar(this.target.center.x * S, this.target.center.y * S, this.actor.ally ? { color: this.bossPhase()?.allyFight?.[this.actor.id]?.color ?? this.actor.color } : {
          extraSlashes: skillBonus('strikeSlashes'),
          toleranceScale: 1 + skillBonus('strikeTolerance'),
          color: this.hero.color,
        });
        break;
      case 'taunt': {
        this.strike = null;
        this.attackers = this.chooseAttackers();
        this.speaker = this.attackers[Math.floor(Math.random() * this.attackers.length)];
        // A taunt written over several lines is said one bubble at a time.
        const taunts = this.foeLines(this.speaker, 'taunts');
        this.tauntBubbles = hud.speechBubbles(taunts[Math.floor(Math.random() * taunts.length)]);
        this.taunt = this.tauntBubbles.shift();
        this.tauntStart = 0;
        this.tauntSkipped = false;
        break;
      }
      case 'dodge':
        this.startAttack();
        break;
    }
  }

  // Up to MAX_ATTACKERS of the enemies still standing, in a random order.
  chooseAttackers() {
    const shuffled = [...this.activeFoes()].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, MAX_ATTACKERS);
  }

  // Picks a weighted random attack for one enemy, never the same one twice in a row.
  pickPattern(foe) {
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

  startAttack() {
    boxHome();
    for (const foe of this.attackers) foe.attackAt = this.time;
    const crowd = this.attackers.length > 1 ? COMBINED_DENSITY : 1;
    let attacks = this.attackers.flatMap((foe, i) => {
      const name = this.pickPattern(foe);
      foe.lastPattern = name;
      const { density = 1, speed = 1 } = this.bossPhase(foe)?.difficulty ?? foe.data.difficulty ?? {};
      // A `gentle` foe doesn't really want to hurt you: its attacks thin out a
      // little as its MERCY rises, and when you're nearly out of HP.
      let kindness = 1;
      if (this.bossPhase(foe)?.gentle ?? foe.data.gentle) {
        kindness = 1 - (foe.calm / 100) * 0.4;
        if (this.hero.hp < this.hero.maxHp * 0.3) kindness *= 0.65;
      }
      const tuning = { density: density * crowd * kindness, speed, flame: this.flameInBox() ? this.flame : null };
      const attack = { foe, pattern: createPattern(name, hud.BOX, tuning), delay: i * SECOND_ATTACKER_DELAY };
      // A boss with `secondWind` gets desperate when its HP drops below that
      // share of its max: it layers a second, different attack on top of the first.
      const { secondWind } = foe.data;
      if (!secondWind || foe.hp >= foe.maxHp * secondWind.below) return [attack];
      const others = (this.bossPhase(foe)?.patterns ?? foe.data.patterns).filter((p) => p.name !== name);
      const extra = others[Math.floor(Math.random() * others.length)].name;
      const layered = createPattern(extra, hud.BOX, { ...tuning, density: tuning.density * (secondWind.density ?? 0.6) });
      return [attack, { foe, pattern: layered, delay: attack.delay + (secondWind.delay ?? 1) }];
    });
    // A boss's special soul mode takes the whole turn to itself.
    const special = attacks.find((attack) => attack.pattern.mode !== 'normal');
    if (special) attacks = [{ ...special, delay: 0 }];
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
    this.grazeMultiplier = 1;

    const box = hud.BOX;
    const startY = mode === 'heavy' ? box.y + box.h : box.y + box.h / 2;
    this.soul.reset(box.x + box.w / 2, startY, mode);

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
    else if (!this.levelledUp) setHeroHp(Math.max(1, this.hero.hp));
    const phase = this.bossPhase();
    const gameOver = result === 'death' && phase?.gameOver ? textSection(this.phased.data.textFile, phase.gameOver)[0] : undefined;
    this.onEnd(result, this.foes.map((foe) => ({ enemy: foe.data, state: foe.state })), gameOver);
  }

  update(dt, input) {
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
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
      foe.flash = Math.max(0, foe.flash - dt);
      foe.seenFlash = foe.flash;
      foe.chips = foe.chips.filter((chip) => this.time - chip.at < CHIP_LIFE);
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
    this.updateEffects(dt);

    switch (this.phase) {
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
    const lines = textSection('battle.txt', `escape: ${this.area}`);
    const pool = lines.length ? lines : textSection('battle.txt', 'escape: ruins');
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

  // An ally's move made stronger by their skills (skillBonus) and their own
  // weapon and armor (memberGearBonus).
  allyBonus(ally, effect) {
    return memberSkillBonus(ally.id, effect) + memberGearBonus(ally.id, effect) + memberGrowth(ally.id, effect);
  }

  // Bramble's sneak attack, after he HIDES: his next hit is SNEAK_POWER times
  // as hard (more with his skills and gear), once. 1 for anyone else.
  sneakPower(member) {
    if (!member?.ally || this.sneaking !== member.id) return 1;
    return SNEAK_POWER + this.allyBonus(member, 'sneak');
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
        this.gainSp(DEFEND_SP);
        let text = `${this.hero.name} braces. Damage is halved this turn.\nSP +${DEFEND_SP}%`;
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
      const mocks = lines.mercy_mock_again ?? [];
      const said = this.mercyRefused && mocks.length ? [mocks[Math.floor(Math.random() * mocks.length)]] : (lines.mercy_mock ?? []);
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
        this.defending = true;
        const lines = this.allyLines(ally, 'defend');
        this.showMessage(`${lines[0] ?? `${ally.name} braces.`}\nDamage is halved this turn.`, 'taunt');
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
    const own = textFile(foe.data.textFile)[ally.hurt ? `${ally.id}_hurt_talk` : `${ally.id}_talk`] ?? [];
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
    // A hit on one enemy asks which; SP is only spent once it's cast.
    if (command.strikeOne || command.team) {
      this.chooseTarget(() => {
        this.sp -= command.cost ?? 0;
        this.allyAct(this.actor, command);
      });
      return;
    }
    // A healing spell asks who it's for; SP is only spent once it's cast.
    if ((command.heal || command.regen) && this.party.length > 1) {
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
    const lines = [command.text];
    this.allyFx(ally, command);
    if (command.calmAll) {
      const amount = this.potent(command.calmAll + this.allyBonus(ally, 'allyCalm'));
      for (const foe of this.activeFoes()) lines.push(this.calmFoe(foe, amount, '').trim());
    }
    if (command.sp) {
      const amount = Math.max(0, command.sp + this.allyBonus(ally, 'allySp'));
      this.gainSp(amount);
      lines.push(`SP +${amount}%`);
    }
    if (command.heal) {
      // Whoever they chose (see updateAlly), or you.
      const member = this.healTarget ?? this.hero;
      this.healTarget = null;
      const healed = this.healMember(member, command.heal + this.allyBonus(ally, 'allyHeal'));
      sfx('heal');
      this.healFx(member, healed, command.label === 'AURORA' ? 'aurora' : 'heal');
      lines.push(`${member.name} recovered ${healed} HP.`);
    }
    // DAYBREAK: everyone still standing, at once.
    if (command.healAll) {
      sfx('heal');
      for (const member of this.party.filter((other) => other.hp > 0)) {
        const healed = this.healMember(member, command.healAll + this.allyBonus(ally, 'allyHeal'));
        this.healFx(member, healed);
        lines.push(`${member.name} recovered ${healed} HP.`);
      }
    }
    // RAIN DANCE: HP back for whoever they chose (or you) after each of the
    // next few enemy turns. A new rain takes the old one's place.
    if (command.regen) {
      const member = this.healTarget ?? this.hero;
      this.healTarget = null;
      const amount = command.regen + this.allyBonus(ally, 'allyHeal');
      this.rain = { member, amount, turns: command.turns ?? 3 };
      lines.push(`${member.name} will recover ${amount} HP after each of the next ${this.rain.turns} enemy turns.`);
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
    // A hit on every enemy (Sleet), or on the one they chose (Downdraft),
    // lands after the words.
    if (command.strikeAll) {
      const damage = Math.round(this.allyStrikeDamage(ally, command.strikeAll) * this.sneakPower(ally));
      this.spendSneak(ally);
      this.showMessage(lines.join('\n'), () => this.strikeAll(damage));
      return;
    }
    if (command.strikeOne) {
      const damage = Math.round(this.allyStrikeDamage(ally, command.strikeOne) * this.sneakPower(ally));
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

  updateTalk(input) {
    const foe = this.target;
    const index = this.pickFromList(input, foe.data.talk.length);
    if (index === null) return;

    const option = foe.data.talk[index];
    // Nothing to do with a friend who's knocked out ("Stand by Ves").
    if (this.aboutDownAlly(option.name)) {
      sfx('back');
      return;
    }
    if (option.calm && this.refuseMercy(foe)) return;
    let text = this.foeLine(foe, `talk: ${option.name}`);
    if (option.calm) text = this.calmFoe(foe, option.calm, text);
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
    if (this.sp < spell.sp) {
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
    if (spell.id === 'lull' || spell.id === 'pacify') {
      if (this.refuseMercy(foe)) return;
    } else if ((spell.id === 'hush' || spell.id === 'serenade') && this.refuseMercy(this.activeFoes().find((other) => this.mercyRule(other)))) {
      return;
    }
    this.sp -= spell.sp;
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
      case 'balm': {
        sfx('heal');
        const amount = this.potent(SPELLS.balm.heals * (1 + skillBonus('healBoost')));
        const lines = this.party.filter((other) => other.hp > 0).map((other) => {
          const healed = this.healMember(other, amount);
          this.healFx(other, healed);
          return `${other === this.hero ? 'Recovered' : `${other.name} recovered`} ${healed} HP.`;
        });
        this.showMessage(`${name} cast Balm! A warmth settles over everyone.\n${lines.join('\n')}`, 'taunt');
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
        this.castAttackSpell(spell);
        break;
      case 'ward':
      case 'aegis': {
        const turns = spell.id === 'ward' ? WARD_TURNS : SPELLS.aegis.turns;
        this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
        this.wardTurns = Math.max(this.wardTurns, turns);
        sfx('heal');
        this.showMessage(`${name} cast ${spell.name}! A shell of light closes round you.\nDamage is halved for the next ${turns} enemy turns.`, 'taunt');
        break;
      }
      case 'hush':
      case 'serenade': {
        this.fx.add('snow', { style: 'flurry' });
        for (const other of this.activeFoes()) this.fx.add('calm', other.center);
        const calm = spell.id === 'hush' ? HUSH_CALM : SPELLS.serenade.calm;
        const calmed = this.activeFoes().map((other) => this.calmFoe(other, this.potent(calm), '').trim());
        const words = spell.id === 'hush' ? 'Snow seems to fall inside the room.' : 'A song nobody taught you fills the room.';
        this.showMessage(`${name} cast ${spell.name}. ${words}\n${calmed.join('\n')}`, 'taunt');
        break;
      }
      case 'pacify':
        this.fx.add('calm', { ...foe.center, style: 'pacify' });
        if (foe.calm >= 100) {
          this.foeLeaves(foe, 'pacified', 'taunt', `${name} cast Pacify!`);
        } else {
          this.showMessage(`${name} cast Pacify...\nBut ${foe.name} isn't calm enough yet.`, 'taunt');
        }
        break;
      case 'lull':
        this.fx.add('calm', foe.center);
        this.showMessage(this.calmFoe(foe, this.potent(foe.data.lullCalm ?? LULL_CALM), `${name} cast Lull. A soft hush settles over the room.`), 'taunt');
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
    else if (id === 'chain') this.fx.add('chain', { points: [hero, ...this.activeFoes().map((other) => other.center)] });
    else if (!foe) return;
    else if (id === 'siphon') this.fx.add('siphon', { ...foe.center, to: hero });
    else this.fx.add(ATTACK_SPELL_FX[id] ?? id, foe.center);
  }

  // An ally's spell: Ves's wind and snow and umbrella, Bramble's shouts and leaves and axe.
  allyFx(ally, command) {
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
    else if (command.guard || command.cover) this.fx.add('shell', { ...this.partyMiddle(), style: 'ward' });
    else if (command.calmAll) for (const point of all()) this.fx.add('calm', point);
  }

  // A spell's strength after the armor's MAG.
  potent(amount) {
    return Math.max(1, Math.round(amount * this.potency));
  }

  // The most a FIGHT could do right now, every slash PERFECT: the hero's, with
  // their weapon and skills, or an ally's, with theirs and how far they've
  // grown. Allies' attack spells and team attacks are measured against it. A weapon weaker than a plain sword (a staff, a lantern)
  // doesn't make spells weaker: it counts as 1.
  bestStrike(member) {
    if (member.ally) {
      return BASE_SLASH_COUNT * PERFECT_SLASH_DAMAGE * Math.max(1, this.allyWeaponPower(member)) * (1 + memberGrowth(member.id, 'fight')) * (1 + this.allyBonus(member, 'allyFight'));
    }
    return (BASE_SLASH_COUNT + skillBonus('strikeSlashes')) * PERFECT_SLASH_DAMAGE * Math.max(1, this.weapon.fightPower) * this.fightPowerBonus;
  }

  // The FIGHT an attack spell is measured against: every slash landed (not
  // PERFECT), with only the skills and as good a sword as the spell's
  // chapter had, so old spells stop growing (see src/data/spells.js).
  spellStrike(id) {
    const chapter = SPELLS[id].chapter ?? 1;
    const slashes = BASE_SLASH_COUNT + skillBonus('strikeSlashes', chapter);
    const weapon = Math.max(1, Math.min(this.weapon.fightPower, SPELL_WEAPON_CAP[chapter] ?? Infinity));
    return slashes * SLASH_DAMAGE * weapon * (1 + skillBonus('fightPower', chapter));
  }

  // What one of your attack spells does: that FIGHT times its `power`, plus a
  // quarter of the armor's MAG and half of Arcane Focus. They add rather
  // than multiply, so spells stay in line with FIGHT. Heavy armor (MAG
  // below 0) doesn't take any away.
  spellDamage(id) {
    const boost = Math.max(0, this.potency - 1) / 4 + skillBonus('spellPower') / 2;
    return Math.max(1, Math.round(this.spellStrike(id) * ((SPELLS[id].power ?? 1) + boost)));
  }

  // An ally's attack spell: `power` times their best FIGHT, plus their allyStrike.
  allyStrikeDamage(ally, power) {
    return Math.max(1, Math.round(this.bestStrike(ally) * power) + this.allyBonus(ally, 'allyStrike'));
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
    const active = this.activeFoes();
    for (const foe of active) {
      const dealt = this.resist(foe, damage, 'spell');
      foe.hp = Math.max(0, foe.hp - dealt);
      this.addPopup(`${dealt}`, foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
      foe.flash = ENEMY_FLASH_SECONDS;
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
      this.showMessage(`${light} the ${item.name}. Its glow fills you with power. SP +${item.amount}%!`, 'taunt');
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
    damage = this.resist(foe, damage, kind);
    foe.hp = Math.max(0, foe.hp - damage);
    this.addPopup(damage ? `${damage}` : 'MISS', foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
    if (damage) {
      this.slashFoe = foe;
      this.slashTime = SLASH_SECONDS;
      foe.flash = ENEMY_FLASH_SECONDS;
      sfx('hit');
    }
    this.setPhase('fightResult');
  }

  // An enemy is beaten or pacified: it fades away, its rewards are banked, and
  // the battle carries on (to `next`, a phase name or a function) or is won if
  // it was the last one.
  foeLeaves(foe, how, next, prefix = '') {
    foe.state = how;
    foe.leftAt = this.time;
    this.earned.coins += foe.data.rewards.coins;
    // Like Deltarune, sparing an enemy earns gold but no EXP.
    if (how === 'defeated') this.earned.exp += foe.data.rewards.exp;
    // Sometimes they leave something behind.
    for (const { item, chance } of foe.data.drops ?? []) {
      if (Math.random() < chance) this.earned.items.push(item);
    }
    // And candle-making materials, spared or beaten alike.
    for (const { id, chance, amount = 1 } of foe.data.materials ?? []) {
      if (Math.random() < chance) this.earned.materials[id] = (this.earned.materials[id] ?? 0) + amount;
    }
    const line = this.foeLine(foe, how === 'defeated' ? 'victory' : 'pacified');
    const text = prefix ? `${prefix}\n${line}` : line;
    const say = () => this.showMessage(text, () => {
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
      this.bits.star(foe.center.x, foe.center.y, { size: 14 });
      this.bits.ring(foe.center.x, foe.center.y, { speed: 90, life: 0.35 });
      this.bits.scatter(foe.center.x, foe.center.y, 12, foe.bitColors, { speed: 70 });
      for (let i = 0; i < 4; i++) this.bits.puff(foe.center.x + (Math.random() - 0.5) * 20, foe.center.y + (Math.random() - 0.5) * 16, { color: foe.bitColors[0], life: 0.5 });
    } else {
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
      this.taunt = this.tauntBubbles.shift();
      this.tauntStart = this.phaseTime;
      this.tauntSkipped = false;
    } else if (this.phase === 'speech') {
      this.speechDone();
    } else {
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
    for (const attack of this.attacks) {
      if (this.dodgeTime < attack.delay) continue;
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
      if (member.hp > 0) {
        const healed = this.healMember(member, amount);
        this.healFx(member, healed);
      }
      if (--this.rain.turns <= 0) this.rain = null;
    }
    if (this.wardTurns > 0) this.wardTurns--;
    this.soul.locked = false;
    this.turn++;
    // A weapon ability can knock an enemy out during its own turn.
    const fallen = this.activeFoes().find((foe) => foe.hp <= 0);
    if (fallen) this.foeLeaves(fallen, 'defeated', 'command');
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
    const canUse = !ability.hold && hasCharges && this.abilityCooldown <= 0 && this.soul.iframes <= 0;
    if (canUse && input.wasPressed('ability')) {
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
    const victim = this.victim?.hp > 0 ? this.victim : this.party.find((member) => member.hp > 0);
    if (!victim) return;
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
    let damage = bullet.dmg ?? this.bossPhase(this.foes[0])?.damage ?? this.foes[0].data.damage;
    if (this.defending || this.wardTurns > 0) damage = Math.ceil(damage / 2);
    // Thick Skin and the armor's DEF take a little off every hit on the hero
    // (but a hit always hurts a bit; armor that lowers DEF makes hits hurt
    // more). SHELTER takes a little more off, whoever it lands on.
    const guard = victim === this.hero ? skillBonus('damageReduction') + this.defense : 0;
    damage = Math.max(1, damage - guard - (this.shelter?.def ?? 0));
    victim.hp = Math.max(0, victim.hp - damage);
    sfx('hurt');
    const feet = this.memberFeet(victim);
    this.addPopup(`${damage}`, feet.x, feet.y - 46, hud.COLORS.danger);
    this.shake = SHAKE_SECONDS;
    this.heroFlinch = SHAKE_SECONDS;
    this.flinching = victim;
    soul.iframes = BASE_IFRAMES + skillBonus('iframes');
    // Last Stand: the hero's first knockout of the battle leaves them hanging on at 1 HP.
    if (victim === this.hero && this.hero.hp <= 0 && this.lastStandReady) {
      this.lastStandReady = false;
      this.hero.hp = 1;
      this.addPopup('LAST STAND!', soul.x, soul.y - 18, hud.COLORS.calm);
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
    this.showMessage(text, 'exit');
  }

  draw(ctx) {
    this.backdrop(ctx, this.time, hud.STAGE_HEIGHT);

    // The stage shakes when you're hit; the UI stays put.
    ctx.save();
    if (this.shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 4));
    this.drawParty(ctx);
    if (this.stageLantern) this.drawStageLantern(ctx);
    if (this.bossPhase()?.dropped) this.drawDropped(ctx, this.bossPhase().dropped);
    if (this.phase === 'bossIntro') this.drawBossIntro(ctx);
    for (const foe of this.foes) this.drawFoe(ctx, foe);
    this.bits.draw(ctx);
    this.drawBox(ctx);
    this.fx.drawStage(ctx);
    ctx.restore();

    inUiSpace(ctx, () => {
      this.drawSlash(ctx);
      this.strike?.drawLabels(ctx);
      if ((this.phase === 'taunt' || this.phase === 'bossIntro' || this.phase === 'speech') && this.taunt) {
        const { pos } = this.speaker;
        // Keep the bubble clear of the name and bars under a lone enemy.
        const statusTop = this.foes.length === 1 ? (pos.y + this.speaker.sprite.height * SCALE + ENEMY_STATUS_GAP) * S : hud.STAGE_HEIGHT * S;
        hud.drawSpeech(ctx, this.taunt.slice(0, this.visibleTauntChars()), pos.x * S - 4, (pos.y + 14) * S, statusTop);
      }
      hud.drawSpGauge(ctx, this.sp, this.time);
      this.drawFoeStatus(ctx);
      if (this.flameInBox()) hud.drawLanternMeter(ctx, this.flame.stage, this.flame.stages, this.time);
      hud.drawPanel(ctx);
      const choosing = ['command', 'talk', 'spells', 'items', 'target', 'member', 'ally'].includes(this.phase);
      // The card and the buttons are whoever's acting: you, or the ally
      // taking their turn (until the enemies' turn starts).
      const allyTurn = this.actor?.ally && !['taunt', 'dodge', 'defeat', 'command'].includes(this.phase);
      // On the enemies' turn, whoever it's aimed at, so you see their HP fall.
      const aimedAt = this.phase === 'dodge' && this.victim?.hp > 0 ? this.victim : this.hero;
      hud.drawPartyCard(ctx, allyTurn ? this.actor : aimedAt, choosing);
      const anyCalm = this.activeFoes().some((foe) => foe.calm >= 100);
      const noRun = this.bossFight() || this.noRun ? ['RUN'] : [];
      if (allyTurn) hud.drawCommands(ctx, ALLY_COMMANDS, this.allySelected, this.phase === 'ally', [], this.time, this.ally && isHurt(this.ally.id) ? ['FIGHT'] : []);
      else hud.drawCommands(ctx, COMMANDS, this.selected, this.phase === 'command', anyCalm ? ['SPELLS'] : [], this.time, noRun);
      this.drawPanelText(ctx);
      this.drawPopups(ctx);
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
  drawFoeStatus(ctx) {
    if (this.foes.length === 1) {
      const foe = this.foes[0];
      if (foe.state !== 'active') return;
      const top = (foe.pos.y + foe.sprite.height * SCALE + ENEMY_STATUS_GAP) * S;
      hud.drawEnemyStatus(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, foe.center.x * S, top, this.time, foe.data.noMercy?.meter !== false);
      return;
    }
    // Hidden while dodging, so the box stays clear, and while an enemy is
    // talking, since its bubble sits where these go.
    if (this.phase === 'dodge' || this.phase === 'defeat' || this.phase === 'taunt' || this.phase === 'bossIntro') return;
    for (const foe of this.activeFoes()) {
      hud.drawEnemyMini(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, foe.pos.x * S - 8, foe.pos.y * S + 6, this.time);
    }
  }

  // Where a party member stands: each one a little behind and below the last.
  memberFeet(member) {
    const i = Math.max(0, this.party.indexOf(member));
    return { x: PARTY_FEET.x - i * 10, y: PARTY_FEET.y + i * 30 };
  }

  drawParty(ctx) {
    this.party.forEach((member, i) => {
      const sprite = member.sprite;
      const w = sprite.width * SCALE;
      const h = sprite.height * SCALE;
      const feetX = PARTY_FEET.x - i * 10;
      const feetY = PARTY_FEET.y + i * 30;

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
        // Collapsed onto their side.
        ctx.save();
        ctx.translate(feetX, feetY - 6);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(sprite, -w / 2, -h, w, h);
        ctx.restore();
        return;
      }

      this.drawAura(ctx, feetX, feetY, h, member.color);

      let x = feetX - w / 2;
      const lunging = (this.phase === 'fight' || this.phase === 'fightResult') && member === (this.striker ?? this.hero);
      if (lunging) x += 12;
      if (this.heroFlinch > 0 && member === (this.flinching ?? this.hero)) x += Math.round(Math.sin(this.heroFlinch * 60) * 2);
      const y = feetY - h + Math.round(Math.sin(this.time * 2.5 + i));

      // Afterimages trail behind a lunge.
      if (lunging) {
        for (const [offset, alpha] of [[-10, 0.25], [-20, 0.1]]) {
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, x + offset, y, w, h);
        }
        ctx.globalAlpha = 1;
      }
      ctx.drawImage(sprite, x, y, w, h);
    });
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

  // The sprite its `anim` says to show now, or null for its usual one.
  animFrame(foe) {
    const anim = foe.anim;
    if (!anim) return null;
    if (foe.state === 'defeated') return clipFrame(anim.death, this.time - foe.leftAt, true);
    if (foe.state === 'pacified') return clipFrame(anim.spared, this.time - foe.leftAt, true);
    return clipFrame(anim.hurt, this.time - foe.hitAt)
      ?? clipFrame(anim.intro, this.time - foe.introAt)
      ?? clipFrame(anim.windup, this.time - foe.attackAt)
      ?? (anim.idle ? anim.idle.sprites[Math.floor(this.time * anim.idle.fps) % anim.idle.sprites.length] : null);
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
      alpha *= 1 - gone / FOE_FADE_SECONDS;
      if (foe.state === 'pacified') y -= Math.round(gone * 16);
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    // A hurt frame flinches instead of flashing white, if it has one.
    const frame = this.animFrame(foe);
    const hurting = frame && foe.anim.hurt && this.time - foe.hitAt < clipLength(foe.anim.hurt);
    ctx.drawImage(foe.flash > 0 && !hurting ? foe.flashSprite : frame ?? foe.sprite, x, y, w, h);
    ctx.restore();
    this.drawChips(ctx, foe);
  }

  // The box and soul are drawn in UI space (fine outline, detailed heart);
  // the bullets in world space (pixel art).
  drawBox(ctx) {
    if (this.phase !== 'dodge' && this.phase !== 'defeat') return;
    const box = hud.BOX;
    const open = this.phase === 'dodge' ? Math.min(1, this.phaseTime / BOX_OPEN_SECONDS) : 1;
    inUiSpace(ctx, () => hud.drawBoxBack(ctx, open));

    if (open >= 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.w, box.h);
      ctx.clip();
      if (this.flameInBox()) this.drawFlame(ctx);
      for (const bullet of this.bullets) bullet.draw(ctx);
      for (const spark of this.sparks) {
        ctx.globalAlpha = spark.life / SPARK_SECONDS;
        ctx.fillStyle = spark.color;
        ctx.fillRect(Math.round(spark.x), Math.round(spark.y), 1, 1);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      inUiSpace(ctx, () => {
        const r = hud.boxRect();
        ctx.beginPath();
        ctx.rect(r.x, r.y, r.w, r.h);
        ctx.clip();
        if (this.ability) {
          this.ability.drawAlways?.(ctx, this);
          if (this.abilityLeft > 0) this.ability.draw?.(ctx, this, this.abilityLeft);
        }
        this.soul.draw(ctx);
      });
    }

    inUiSpace(ctx, () => {
      hud.drawBoxBorder(ctx, open);
      if (this.ability && this.phase === 'dodge' && open >= 1) {
        const { label, readiness } = this.abilityStatus();
        hud.drawAbility(ctx, label, readiness);
      }
    });
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
    const amounts = { heal: HEAL_PULSE_HP * healBoost, mend: MEND_HP * healBoost, lull: LULL_CALM, hush: HUSH_CALM, serenade: SPELLS.serenade.calm };
    let amount = this.potent(amounts[spell.id] ?? (SPELLS[spell.id].heals ?? 0) * healBoost);
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
      calm: this.potent((command.calmAll ?? 0) + bonus('allyCalm')),
      damage: command.team ? this.teamDamage(ally, command.team) : this.allyStrikeDamage(ally, command.strikeAll ?? command.strikeOne ?? command.riposte ?? 0),
      heal: Math.max(0, (command.heal ?? command.healAll ?? command.regen ?? 0) + bonus('allyHeal')),
      sp: Math.max(0, (command.sp ?? 0) + bonus('allySp')),
      turns: command.turns ?? 0,
      seconds: (command.headwind ?? 0) + Math.max(0, bonus('gust')),
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
        hud.drawOptions(ctx, this.target.data.talk.map((option) => ({ label: option.name, enabled: !this.aboutDownAlly(option.name) })), this.cursor);
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
          note: `${spell.sp}% SP`,
          enabled: this.sp >= spell.sp && (spell.id !== 'pacify' || anyCalm),
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
        if (this.dodgeHint) hud.drawTextBox(ctx, this.dodgeHint);
        break;
    }
  }

  drawPopups(ctx) {
    for (const popup of this.popups) {
      ctx.globalAlpha = 1 - popup.t / POPUP_SECONDS;
      drawText(ctx, popup.text, popup.x, popup.y - popup.t * 30, { size: 32, color: popup.color, align: 'center', outline: hud.COLORS.outline });
    }
    ctx.globalAlpha = 1;
  }
}
