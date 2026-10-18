import { UI_SCALE as S, UI_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { SONGS } from '../data/music/index.js';

// In a cave, fights have their own song ("Glass Hollows", caveBattleTheme.js).
// On the mountain, once Ves is with you, they have another, with her motif in
// it (mountainBattleTheme.js). Enemies with their own `music` (bosses) keep
// it. Everywhere else, and before she joins, it's the usual battle song.
const MOUNTAIN_AREAS = new Set(['stair', 'vigil', 'rest']);
function battleSong(area) {
  if (area === 'cave' && SONGS.caveBattle) return 'caveBattle';
  const together = partyIds().includes('vesper');
  return together && MOUNTAIN_AREAS.has(area) && SONGS.mountainBattle ? 'mountainBattle' : 'battle';
}
import { textFile, textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { TextBox } from '../ui/textbox.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { MEMBERS, partyIds, memberSprites, memberMaxHp, memberGrowth } from '../characters/party.js';
import { memberGearBonus, memberFightPower } from '../characters/equipment.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, giveItem, healLabel } from '../data/items.js';
import { MATERIALS, giveMaterial } from '../data/candles.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { gainExp, heroMaxHp, heroHp, setHeroHp, healHeroFully, knownSpells, memberCommands, skillBonus, heroDefense, spellPotency, armorSpGain } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { SPELLS } from '../data/spells.js';
import { Soul, SOUL_RADIUS, GRAZE_RADIUS } from './soul.js';
import { SOUL_ABILITIES } from './soulAbilities.js';
import { createPattern } from './bullets.js';
import { StrikeBar, BASE_SLASH_COUNT, PERFECT_SLASH_DAMAGE } from './strikeBar.js';
import { BACKDROPS } from './backdrops.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import * as hud from './hud.js';

// The party fights from the left. Only the hero for now; max HP and level come
// from their progress (src/characters/progress.js).
const PARTY = [{ name: 'HERO', color: '#4fe3d0', sprite: HERO_ANIMATIONS.right[0] }];
const DEFEND_SP = 16;
const BASE_IFRAMES = 1;

// Gold won from a fight, as a multiple of the enemies' `coins` rewards.
const GOLD_REWARD = 1.5;
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
const TARGETED_SPELLS = new Set(['rend', 'lull', 'pacify', 'starfall', 'comet', 'spark', 'siphon', 'nova']);
// What the attack spells say as they're cast.
const ATTACK_SPELL_LINES = {
  rend: 'A blade of light cuts through.',
  starfall: 'Light pours down from above.',
  comet: 'The sky itself comes down.',
  ember: 'A ring of fire bursts out.',
  spark: 'A crackle of light leaps from your hand.',
  siphon: 'Light pulls loose, and flows back into you.',
  chain: 'Lightning leaps from one enemy to the next.',
  nova: 'Everything goes white.',
};

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
// A boss's entrance: the stage opens out of the dark, then its title card
// fades in, holds and fades out (all in seconds from the start).
const INTRO_DARK_SECONDS = 1.4;
const INTRO_CARD_IN = 1.6;
const INTRO_CARD_OUT = 4.2;
const INTRO_CARD_SECONDS = 4.8;

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

// The hero's aura: a pulsing glow behind them and motes rising from their feet.
const AURA_MOTE_INTERVAL = 0.08;
const AURA_MOTE_LIFE = 1.2;
const SLASH_SECONDS = 0.25;
const ENEMY_FLASH_SECONDS = 0.12;
const FOE_FADE_SECONDS = 1;

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
const DEFEAT_SECONDS = 1.8;

// A turn-based battle against one to three enemies. On your turn you pick a
// command (and, with several enemies, a target); on the enemies' turn you steer
// your soul around a fixed box while their attacks play. The scene ends
// through onEnd with 'won' (every enemy beaten or pacified), 'fled' or 'death'.
export class BattleScene {
  constructor(enemies, onEnd, area = 'ruins') {
    const list = Array.isArray(enemies) ? enemies : [enemies];
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
    this.provoked = false;
    this.flameGuardBonus = 0;

    // HP carries over from the last fight (see heroHp in progress.js). Friends
    // in the party (src/characters/party.js) stand behind you and take a turn
    // each after yours.
    this.party = [
      ...PARTY.map((member) => ({ ...member, level: HERO_STATE.level, maxHp: heroMaxHp(), hp: heroHp() })),
      ...partyIds().map((id) => ({
        id, ...MEMBERS[id], commands: memberCommands(id), sprite: memberSprites(id).right, level: HERO_STATE.level, maxHp: memberMaxHp(id), hp: memberMaxHp(id), ally: true,
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
    this.tauntBubbles = this.foeLines(foe, 'boss_intro').flatMap(hud.speechBubbles);
    this.setPhase('bossIntro');
  }

  updateBossIntro(input) {
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
    const rise = Math.min(1, Math.max(0, (t - 0.6) / 1.2));
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
    };
  }

  activeFoes() {
    return this.foes.filter((foe) => foe.state === 'active');
  }

  // Each enemy's lines come from its file in /text. A boss in `phases` can
  // have its own for the phase it's in: [flavor: lit] before [flavor].
  foeLines(foe, section) {
    const phase = this.bossPhase(foe);
    const own = phase ? textFile(foe.data.textFile)[`${section}: ${phase.id}`] : null;
    return own?.length ? own : textSection(foe.data.textFile, section);
  }

  // --- Boss phases ---
  //
  // A boss with `phases` (the Usurper; see src/data/enemies/usurper.js) fights
  // in stages, each a phase with its own attacks (`patterns`, `difficulty`)
  // and lines ([section: id] in its text file), and any of:
  //   smoke         { fight, spell }: what share of FIGHT and spell damage lands
  //   until         { turns: n } or { flame: true }: when to go on to the next
  //   flame         { stages, guard, maxHelp }: a flame in the box to defend
  //   allyTurn      { <member>: section }: that member's turn is a line from it
  //   allyFight     { <member>: { power, color } }: their FIGHT's weapon power
  //   allyCommands  { <member>: { keep, add } }: their SPELLS, changed
  //   burn          share of max HP it loses as the phase starts
  //   sprite        how it looks now
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
    if (phase.sprite) {
      const white = Object.fromEntries(Object.keys(phase.sprite.palette).map((key) => [key, '#ffffff']));
      foe.sprite = makeSprite(phase.sprite.rows, phase.sprite.palette);
      foe.flashSprite = makeSprite(phase.sprite.rows, white);
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

  nextBossPhase(foe) {
    const until = this.bossPhase(foe)?.until;
    const next = foe.data.phases[foe.phase + 1];
    if (!until || !next) return false;
    const done = (until.turns && foe.phaseTurns >= until.turns) || (until.flame && this.flame?.stage >= this.flame.stages);
    if (!done) return false;
    this.enterPhase(foe, foe.phase + 1);
    this.playBeat(foe, next.beat ?? [], () => this.setPhase('command'));
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
          this.showMessage(said[Math.min(this.flame?.stage ?? 0, said.length - 1)], 'taunt');
          return;
        }
        // What the panel says while they choose (a boss's phase can have its own).
        const own = this.phased ? textFile(this.phased.data.textFile)[`${this.ally.id}_turn: ${this.bossPhase().id}`] : null;
        const lines = own?.length ? own : textSection('battle.txt', `${this.ally.id}_turn`);
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
    const crowd = this.attackers.length > 1 ? COMBINED_DENSITY : 1;
    let attacks = this.attackers.flatMap((foe, i) => {
      const name = this.pickPattern(foe);
      foe.lastPattern = name;
      const { density = 1, speed = 1 } = this.bossPhase(foe)?.difficulty ?? foe.data.difficulty ?? {};
      // A `gentle` foe doesn't really want to hurt you: its attacks thin out a
      // little as its MERCY rises, and when you're nearly out of HP.
      let kindness = 1;
      if (foe.data.gentle) {
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
    const standing = this.party.filter((member) => member.hp > 0);
    this.victim = standing[Math.floor(Math.random() * standing.length)];
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
    const mode = attacks[0].pattern.mode;

    this.bullets = [];
    this.sparks = [];
    this.dodgeTime = 0;
    // SHELTER with a `gust` weapon: the bullets start out slowed.
    this.gustLeft = this.shelter?.gust ?? 0;
    this.gustShown = false;
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
  }

  // Ends the battle. onEnd also hears how each enemy left: [{ enemy, state }],
  // where state is 'defeated', 'pacified' or (fled, or lost) 'active'.
  finish(result) {
    if (this.finished) return;
    this.finished = true;
    // What you leave with is what you'll have next time; a fall brings you
    // back whole (unless a level-up already did).
    if (result === 'death') healHeroFully();
    else if (!this.levelledUp) setHeroHp(Math.max(1, this.hero.hp));
    this.onEnd(result, this.foes.map((foe) => ({ enemy: foe.data, state: foe.state })));
  }

  update(dt, input) {
    this.time += dt;
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
    this.phaseTime += dt;
    this.shake = Math.max(0, this.shake - dt);
    this.heroFlinch = Math.max(0, this.heroFlinch - dt);
    this.slashTime = Math.max(0, this.slashTime - dt);
    for (const foe of this.foes) foe.flash = Math.max(0, foe.flash - dt);
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
    if (this.actor?.ally) return this.allyWeaponPower(this.actor) * (1 + memberGrowth(this.actor.id, 'fight'));
    return this.weapon.fightPower * this.fightPowerBonus;
  }

  // An ally's move made stronger by their skills (skillBonus) and their own
  // weapon and armor (memberGearBonus).
  allyBonus(ally, effect) {
    return skillBonus(effect) + memberGearBonus(ally.id, effect) + memberGrowth(ally.id, effect);
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
    const rule = foe?.data.noMercy;
    if (!rule) return false;
    const lines = textFile(foe.data.textFile);
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
    const again = lines.no_mercy_again ?? [];
    const pages = this.mercyRefused && again.length ? [again[Math.floor(Math.random() * again.length)]] : (lines.no_mercy ?? []);
    if (!pages.length) return false;
    this.mercyRefused = true;
    const box = new TextBox();
    box.open(pages, partyIds().includes(rule.who) ? rule.who : null);
    sfx('back');
    this.interjection = { box, next: this.menuPhase() };
    this.setPhase('interject');
    return true;
  }

  // An ally's turn: their own command bar, like yours (ALLY_COMMANDS). Its
  // submenus back out to here; the bar itself is their go, so no backing out.
  updateAlly(input) {
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (dir) sfx('move');
    this.allySelected = (this.allySelected + dir + ALLY_COMMANDS.length) % ALLY_COMMANDS.length;
    if (!input.wasPressed('confirm')) return;
    sfx('select');
    const ally = this.ally;

    switch (ALLY_COMMANDS[this.allySelected].label) {
      case 'FIGHT':
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
        const lines = textSection('battle.txt', `${ally.id}_defend`);
        this.showMessage(`${lines[0] ?? `${ally.name} braces.`}\nDamage is halved this turn.`, 'taunt');
        break;
      }
    }
  }

  // An ally's kind word to one enemy: their own line for it if the enemy's
  // text file has one ([vesper_talk]), or one of their general ones from
  // text/battle.txt, with {foe} for its name. It raises MERCY a little.
  allyTalk(ally, foe) {
    if (this.refuseMercy(foe)) return;
    const own = textFile(foe.data.textFile)[`${ally.id}_talk`] ?? [];
    const lines = own.length ? own : textSection('battle.txt', `${ally.id}_talk`);
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
    if (command.calmAll && this.refuseMercy(this.activeFoes().find((foe) => foe.data.noMercy))) return;
    // A hit on one enemy asks which; SP is only spent once it's cast.
    if (command.strikeOne || command.team) {
      this.chooseTarget(() => {
        this.sp -= command.cost ?? 0;
        this.allyAct(this.actor, command);
      });
      return;
    }
    // A healing spell asks who it's for; SP is only spent once it's cast.
    if (command.heal && this.party.length > 1) {
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
      lines.push(`${member.name} recovered ${healed} HP.`);
    }
    if (command.guard) {
      // SHELTER: DEFEND's stronger form, with whatever the ally's gear adds.
      this.defending = true;
      this.shelter = { def: SHELTER_DEF + Math.max(0, this.allyBonus(ally, 'shelterDef')), gust: Math.max(0, this.allyBonus(ally, 'gust')) };
      lines.push(`Every hit does ${this.shelter.def} less, too.${this.shelter.gust ? ' A gust will slow the bullets.' : ''}`);
    }
    // A hit on every enemy (Sleet), or on the one they chose (Downdraft),
    // lands after the words.
    if (command.strikeAll) {
      const damage = this.allyStrikeDamage(ally, command.strikeAll);
      this.showMessage(lines.join('\n'), () => this.strikeAll(damage));
      return;
    }
    if (command.strikeOne) {
      const damage = this.allyStrikeDamage(ally, command.strikeOne);
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
    else if (spell.id === 'heal' || spell.id === 'mend') this.chooseMember((member) => this.castSpell(spell, null, member));
    else this.castSpell(spell, null);
  }

  // `member` is who a healing spell is for (you, if not given).
  castSpell(spell, foe, member = this.hero) {
    // A calming spell on someone who can't be calmed is stopped before it costs anything.
    if (spell.id === 'lull' || spell.id === 'pacify') {
      if (this.refuseMercy(foe)) return;
    } else if (spell.id === 'hush' && this.refuseMercy(this.activeFoes().find((other) => other.data.noMercy))) {
      return;
    }
    this.sp -= spell.sp;
    const name = this.hero.name;
    switch (spell.id) {
      case 'heal':
      case 'mend': {
        const base = spell.id === 'heal' ? HEAL_PULSE_HP : MEND_HP;
        const healed = this.healMember(member, this.potent(base * (1 + skillBonus('healBoost'))));
        sfx('heal');
        const who = member === this.hero ? 'Recovered' : `${member.name} recovered`;
        this.showMessage(`${name} cast ${spell.name}! ${who} ${healed} HP.`, 'taunt');
        break;
      }
      case 'ember':
      case 'chain':
      case 'comet':
      case 'rend':
      case 'starfall':
      case 'spark':
      case 'siphon':
      case 'nova':
        this.castAttackSpell(spell);
        break;
      case 'ward':
        this.wardTurns = WARD_TURNS;
        sfx('heal');
        this.showMessage(`${name} cast Bright Ward! A shell of light closes round you.\nDamage is halved for the next ${WARD_TURNS} enemy turns.`, 'taunt');
        break;
      case 'hush': {
        const calmed = this.activeFoes().map((other) => this.calmFoe(other, this.potent(HUSH_CALM), '').trim());
        this.showMessage(`${name} cast Hush. Snow seems to fall inside the room.\n${calmed.join('\n')}`, 'taunt');
        break;
      }
      case 'pacify':
        if (foe.calm >= 100) {
          this.foeLeaves(foe, 'pacified', 'taunt', `${name} cast Pacify!`);
        } else {
          this.showMessage(`${name} cast Pacify...\nBut ${foe.name} isn't calm enough yet.`, 'taunt');
        }
        break;
      case 'lull':
        this.showMessage(this.calmFoe(foe, this.potent(foe.data.lullCalm ?? LULL_CALM), `${name} cast Lull. A soft hush settles over the room.`), 'taunt');
        break;
    }
  }

  // A spell's strength after the armor's MAG.
  potent(amount) {
    return Math.max(1, Math.round(amount * this.potency));
  }

  // The most a FIGHT could do right now, every slash PERFECT: the hero's, with
  // their weapon and skills, or an ally's, with theirs and how far they've
  // grown. Attack spells are measured against it, so they always hit harder
  // than swinging. A weapon weaker than a plain sword (a staff, a lantern)
  // doesn't make spells weaker: it counts as 1.
  bestStrike(member) {
    if (member.ally) {
      return BASE_SLASH_COUNT * PERFECT_SLASH_DAMAGE * Math.max(1, this.allyWeaponPower(member)) * (1 + memberGrowth(member.id, 'fight'));
    }
    return (BASE_SLASH_COUNT + skillBonus('strikeSlashes')) * PERFECT_SLASH_DAMAGE * Math.max(1, this.weapon.fightPower) * this.fightPowerBonus;
  }

  // What one of your attack spells does: its `power` (src/data/spells.js)
  // times your best FIGHT, then the armor's MAG and Arcane Focus. Heavy armor
  // that weighs on your magic (MAG below 0) can't drag one below that, so a
  // spell always beats a FIGHT.
  spellDamage(id) {
    return Math.max(1, Math.round(this.bestStrike(this.hero) * (SPELLS[id].power ?? 1) * Math.max(1, this.potency) * (1 + skillBonus('spellPower'))));
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
    const leave = (fallen) => {
      if (!fallen.length) {
        const smoke = this.smokeLine;
        this.smokeLine = null;
        if (smoke) this.showMessage(smoke, 'taunt');
        else this.setPhase('taunt');
        return;
      }
      const [first, ...rest] = fallen;
      this.foeLeaves(first, 'defeated', () => leave(rest));
    };
    leave(active.filter((foe) => foe.hp <= 0));
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
    if (ITEMS[this.items[index]].use === 'calm' && this.refuseMercy(this.activeFoes().find((foe) => foe.data.noMercy))) return;
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
      this.showMessage(`${light} the ${item.name}. Its smoke wraps around you like a cloak.\nThe next attack will do half the damage.`, 'taunt');
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
  // the battle carries on (to `next`) or is won if it was the last one.
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
    this.showMessage(text, () => {
      // Another enemy may have been knocked out at the same time.
      const alsoFallen = this.activeFoes().find((other) => other.hp <= 0);
      if (alsoFallen) this.foeLeaves(alsoFallen, 'defeated', next);
      else if (this.activeFoes().length) this.setPhase(next);
      else this.win();
    });
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
        if (bullet.dmg === null) bullet.dmg = attack.foe.data.damage;
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
    this.defending = false;
    this.shelter = null;
    this.gustLeft = 0;
    // A friend's warm scarf: a little HP back after every enemy turn.
    const regen = this.party.filter((member) => member.ally && member.hp > 0).reduce((sum, ally) => sum + memberGearBonus(ally.id, 'regen'), 0);
    if (regen > 0 && this.hero.hp > 0 && this.hero.hp < this.hero.maxHp) {
      this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + regen);
      this.addPopup(`+${regen}`, PARTY_FEET.x, PARTY_FEET.y - 46, hud.COLORS.enemyHp);
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
  // SHELTER's gust slows them all for a moment too.
  bulletTimeScale(bullet) {
    const gust = this.gustLeft > 0 ? GUST_SPEED : 1;
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
    let damage = bullet.dmg ?? this.foes[0].data.damage;
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
    // Every fight pays a bit better than the enemies' own `coins` (GOLD_REWARD),
    // and Lucky Pockets pays more again.
    const coins = Math.round(this.earned.coins * GOLD_REWARD * (1 + skillBonus('goldBonus')));
    HERO_STATE.gold += coins;
    let text = `You won!\nGot ${exp} EXP and ${coins} gold.`;
    for (const id of this.earned.items) {
      const got = giveItem(id);
      text += got === 'stored' ? `\nGot a ${ITEMS[id].name}! (Your bag's full: it went to storage.)`
        : got ? `\nGot a ${ITEMS[id].name}!` : `\nYou couldn't carry the ${ITEMS[id].name}.`;
    }
    for (const [id, amount] of Object.entries(this.earned.materials)) {
      giveMaterial(id, amount);
      text += `\nGot ${amount} ${MATERIALS[id].name}${amount > 1 ? 's' : ''}.`;
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
    if (this.flame) this.drawStageLantern(ctx);
    if (this.phase === 'bossIntro') this.drawBossIntro(ctx);
    for (const foe of this.foes) this.drawFoe(ctx, foe);
    this.drawBox(ctx);
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
      const noRun = this.bossFight() ? ['RUN'] : [];
      if (allyTurn) hud.drawCommands(ctx, ALLY_COMMANDS, this.allySelected, this.phase === 'ally', [], this.time);
      else hud.drawCommands(ctx, COMMANDS, this.selected, this.phase === 'command', anyCalm ? ['SPELLS'] : [], this.time, noRun);
      this.drawPanelText(ctx);
      this.drawPopups(ctx);
    });
    if (this.phase === 'bossIntro') this.drawBossIntroOverlay(ctx);
    if (this.phase === 'interject') this.interjection.box.draw(ctx);
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
  drawFoe(ctx, foe) {
    if (foe.state === 'defeated' && foe.beatenSprite) {
      const sprite = foe.beatenSprite;
      const bottom = foe.pos.y + foe.sprite.height * SCALE;
      // A shudder as she goes down.
      const shake = Math.round(Math.sin((this.time - foe.leftAt) * 50) * 2 * Math.max(0, 1 - (this.time - foe.leftAt) * 2));
      ctx.drawImage(sprite, foe.pos.x + shake, bottom - sprite.height * SCALE, sprite.width * SCALE, sprite.height * SCALE);
      return;
    }
    const w = foe.sprite.width * SCALE;
    const h = foe.sprite.height * SCALE;
    let x = foe.pos.x;
    let y = foe.pos.y + Math.round(Math.sin(this.time * 2 + foe.pos.y) * 2);
    let alpha = 1;
    // Made of smoke, he wavers.
    if (this.bossPhase(foe)?.smoke) alpha = 0.78 + 0.22 * Math.sin(this.time * 5);
    if (this.phase === 'fightResult' && foe === this.target) {
      x += Math.round(Math.sin(this.phaseTime * 40) * 3 * Math.max(0, 1 - this.phaseTime));
    }
    if (foe.state !== 'active') {
      const gone = this.time - foe.leftAt;
      if (gone >= FOE_FADE_SECONDS) return;
      alpha *= 1 - gone / FOE_FADE_SECONDS;
      if (foe.state === 'pacified') y -= Math.round(gone * 16);
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(foe.flash > 0 ? foe.flashSprite : foe.sprite, x, y, w, h);
    ctx.restore();
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

  // Her lantern on the stage, by Ves: cold, catching, then blazing, its
  // light washing over everything once it's lit.
  drawStageLantern(ctx) {
    const ves = this.party.find((member) => member.ally) ?? this.hero;
    const feet = this.memberFeet(ves);
    const x = feet.x + 16;
    const y = feet.y;
    const lit = this.flame.stage / this.flame.stages;
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
    const amounts = { heal: HEAL_PULSE_HP * healBoost, mend: MEND_HP * healBoost, lull: LULL_CALM, hush: HUSH_CALM };
    let amount = this.potent(amounts[spell.id] ?? 0);
    if (spell.id === 'ward') amount = WARD_TURNS;
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
      damage: command.team ? this.teamDamage(ally, command.team) : this.allyStrikeDamage(ally, command.strikeAll ?? command.strikeOne ?? 0),
      heal: Math.max(0, (command.heal ?? 0) + bonus('allyHeal')),
      sp: Math.max(0, (command.sp ?? 0) + bonus('allySp')),
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
        hud.drawOptions(ctx, this.target.data.talk.map((option) => ({ label: option.name, enabled: true })), this.cursor);
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
