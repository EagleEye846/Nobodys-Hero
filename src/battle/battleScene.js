import { UI_SCALE as S, UI_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { textFile, textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { HERO_STATE } from '../characters/heroState.js';
import { ITEMS, giveItem, healLabel } from '../data/items.js';
import { MATERIALS, giveMaterial } from '../data/candles.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { gainExp, heroMaxHp, knownSpells, skillBonus } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { SPELLS } from '../data/spells.js';
import { Soul, SOUL_RADIUS, GRAZE_RADIUS } from './soul.js';
import { SOUL_ABILITIES } from './soulAbilities.js';
import { createPattern } from './bullets.js';
import { StrikeBar } from './strikeBar.js';
import { BACKDROPS } from './backdrops.js';
import * as hud from './hud.js';

// The party fights from the left. Only the hero for now; max HP and level come
// from their progress (src/characters/progress.js).
const PARTY = [{ name: 'HERO', color: '#4fe3d0', sprite: HERO_ANIMATIONS.right[0] }];
const DEFEND_SP = 16;
const BASE_IFRAMES = 1;
// Fights refuse enemies with fewer different attacks than this.
const MIN_ATTACKS = 3;

// What each spell does (costs are in src/data/spells.js). Pacify only works
// once the target is fully calm. Spells in TARGETED_SPELLS ask which enemy.
const HEAL_PULSE_HP = 35;
const REND_DAMAGE = 30;
const LULL_CALM = 30;
const STARFALL_DAMAGE = 45;
const TARGETED_SPELLS = new Set(['rend', 'lull', 'pacify', 'starfall']);

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
const POPUP_SECONDS = 0.9;
const DEFEAT_SECONDS = 1.8;

// A turn-based battle against one to three enemies. On your turn you pick a
// command (and, with several enemies, a target); on the enemies' turn you steer
// your soul around a fixed box while their attacks play. The scene ends
// through onEnd with 'won' (every enemy beaten or pacified), 'fled' or 'death'.
export class BattleScene {
  constructor(enemies, onEnd, area = 'ruins') {
    const list = Array.isArray(enemies) ? enemies : [enemies];
    const layout = FOE_LAYOUTS[list.length];
    if (!layout) throw new Error(`A battle needs 1 to 3 enemies, not ${list.length}`);
    this.onEnd = onEnd;
    this.backdrop = BACKDROPS[area] ?? BACKDROPS.ruins;
    this.foes = list.map((data, i) => this.makeFoe(data, layout[i]));
    for (const foe of this.foes) this.checkPatterns(foe.data);

    this.party = PARTY.map((member) => ({ ...member, level: HERO_STATE.level, maxHp: heroMaxHp(), hp: heroMaxHp() }));
    this.hero = this.party[0];

    // Learned skills shape the whole battle.
    this.spells = knownSpells().map((id) => ({ id, ...SPELLS[id] }));
    this.fightPowerBonus = 1 + skillBonus('fightPower');
    this.grazeRadius = GRAZE_RADIUS + skillBonus('grazeRadius');
    this.grazeSpBonus = 1 + skillBonus('grazeSp');
    this.lastStandReady = skillBonus('lastStand') > 0;

    this.sp = 0;
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
    this.tauntBubbles = this.foeLines(foe, 'boss_intro').flatMap((line) => line.split('\n'));
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
      lastPattern: null,
      state: 'active', // then 'defeated' or 'pacified'
      leftAt: 0,
    };
  }

  activeFoes() {
    return this.foes.filter((foe) => foe.state === 'active');
  }

  // Each enemy's lines come from its file in /text.
  foeLines(foe, section) {
    return textSection(foe.data.textFile, section);
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
    music.play(this.foes[0].data.music ?? 'battle');
  }

  // A message too long for the panel carries on over several pages.
  showMessage(text, next) {
    const pages = hud.textPages(text);
    this.message = { text: pages[0], pages, page: 0, next };
    this.setPhase('message');
  }

  setPhase(phase) {
    this.phase = phase;
    this.phaseTime = 0;
    switch (phase) {
      case 'bossIntro':
        this.taunt = null;
        break;
      case 'command': {
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
        this.cursor = 0;
        break;
      case 'fight':
        this.strike = new StrikeBar(this.target.center.x * S, this.target.center.y * S, {
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
        this.tauntBubbles = taunts[Math.floor(Math.random() * taunts.length)].split('\n');
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
    const all = foe.data.patterns;
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
      const { density = 1, speed = 1 } = foe.data.difficulty ?? {};
      // A `gentle` foe doesn't really want to hurt you: its attacks thin out a
      // little as its MERCY rises, and when you're nearly out of HP.
      let kindness = 1;
      if (foe.data.gentle) {
        kindness = 1 - (foe.calm / 100) * 0.4;
        if (this.hero.hp < this.hero.maxHp * 0.3) kindness *= 0.65;
      }
      const tuning = { density: density * crowd * kindness, speed };
      const attack = { foe, pattern: createPattern(name, hud.BOX, tuning), delay: i * SECOND_ATTACKER_DELAY };
      // A boss with `secondWind` gets desperate when its HP drops below that
      // share of its max: it layers a second, different attack on top of the first.
      const { secondWind } = foe.data;
      if (!secondWind || foe.hp >= foe.maxHp * secondWind.below) return [attack];
      const others = foe.data.patterns.filter((p) => p.name !== name);
      const extra = others[Math.floor(Math.random() * others.length)].name;
      const layered = createPattern(extra, hud.BOX, { density: tuning.density * (secondWind.density ?? 0.6), speed });
      return [attack, { foe, pattern: layered, delay: attack.delay + (secondWind.delay ?? 1) }];
    });
    // A boss's special soul mode takes the whole turn to itself.
    const special = attacks.find((attack) => attack.pattern.mode !== 'normal');
    if (special) attacks = [{ ...special, delay: 0 }];
    this.attacks = attacks;
    this.turnLength = Math.max(...attacks.map((attack) => attack.delay + attack.pattern.duration));
    const mode = attacks[0].pattern.mode;

    this.bullets = [];
    this.sparks = [];
    this.dodgeTime = 0;
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
      case 'fight': {
        const result = this.strike.update(dt, input);
        if (result) this.resolveStrike(Math.round(result.damage * this.weapon.fightPower * this.fightPowerBonus));
        break;
      }
      case 'fightResult':
        this.strike?.update(dt, input);
        if (this.phaseTime >= 0.9) {
          if (this.target.hp <= 0) this.foeLeaves(this.target, 'defeated', 'taunt');
          else this.setPhase('taunt');
        }
        break;
      case 'taunt':
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
      this.setPhase('command');
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

  tryToRun() {
    // There's no running from a boss.
    const boss = this.activeFoes().find((foe) => foe.data.boss);
    if (boss) {
      this.showMessage(textFile(boss.data.textFile).no_escape?.[0] ?? `You can't run from ${boss.name}.`, 'taunt');
      return;
    }
    const chance = Math.min(RUN_MAX_CHANCE, RUN_BASE_CHANCE + this.turn * RUN_CHANCE_PER_TURN);
    if (Math.random() < chance) {
      this.result = 'fled';
      this.showMessage('You slipped away into the ruins!', 'exit');
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
      this.setPhase('command');
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
    foe.calm = Math.min(100, foe.calm + amount);
    let result = `${text}\n${foe.name} MERCY +${amount}%`;
    if (foe.calm >= 100) result += ` - it seems peaceful now.`;
    return result;
  }

  updateTalk(input) {
    const foe = this.target;
    const index = this.pickFromList(input, foe.data.talk.length);
    if (index === null) return;

    const option = foe.data.talk[index];
    let text = this.foeLine(foe, `talk: ${option.name}`);
    if (option.calm) text = this.calmFoe(foe, option.calm, text);
    this.showMessage(text, 'taunt');
  }

  updateSpells(input) {
    const index = this.pickFromList(input, this.spells.length);
    if (index === null) return;

    const spell = this.spells[index];
    if (this.sp < spell.sp) {
      this.showMessage('Not enough SP.\nGraze past bullets to build spell power.', 'spells');
      return;
    }
    if (TARGETED_SPELLS.has(spell.id)) this.chooseTarget((foe) => this.castSpell(spell, foe));
    else this.castSpell(spell, null);
  }

  castSpell(spell, foe) {
    this.sp -= spell.sp;
    const name = this.hero.name;
    switch (spell.id) {
      case 'heal':
        this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + HEAL_PULSE_HP);
        sfx('heal');
        this.showMessage(`${name} cast Heal Pulse! Recovered ${HEAL_PULSE_HP} HP.`, 'taunt');
        break;
      case 'rend':
        // A guaranteed hit, shown with the same slash and popup as FIGHT.
        this.showMessage(`${name} cast Rend! A blade of light cuts through.`, () => this.resolveStrike(REND_DAMAGE));
        break;
      case 'pacify':
        if (foe.calm >= 100) {
          this.foeLeaves(foe, 'pacified', 'taunt', `${name} cast Pacify!`);
        } else {
          this.showMessage(`${name} cast Pacify...\nBut ${foe.name} isn't calm enough yet.`, 'taunt');
        }
        break;
      case 'lull':
        this.showMessage(this.calmFoe(foe, foe.data.lullCalm ?? LULL_CALM, `${name} cast Lull. A soft hush settles over the room.`), 'taunt');
        break;
      case 'starfall':
        this.showMessage(`${name} cast Starfall! Light pours down from above.`, () => this.resolveStrike(STARFALL_DAMAGE));
        break;
    }
  }

  updateItems(input) {
    const index = this.pickFromList(input, this.items.length);
    if (index === null) return;

    const [id] = this.items.splice(index, 1);
    const item = ITEMS[id];
    sfx('heal');
    // Candles burn rather than get eaten: each does its own thing (see items.js).
    if (item.use === 'calm') {
      const calmed = this.activeFoes().map((foe) => this.calmFoe(foe, item.amount, '').trim());
      this.showMessage(`You light the ${item.name}. A soft, sweet scent fills the air.\n${calmed.join('\n')}`, 'taunt');
      return;
    }
    if (item.use === 'sp') {
      this.gainSp(item.amount);
      this.showMessage(`You light the ${item.name}. Its glow fills you with power. SP +${item.amount}%!`, 'taunt');
      return;
    }
    if (item.use === 'guard') {
      this.defending = true;
      this.showMessage(`You light the ${item.name}. Its smoke wraps around you like a cloak.\nThe next attack will do half the damage.`, 'taunt');
      return;
    }
    const before = this.hero.hp;
    this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + item.heal);
    const healed = this.hero.hp === this.hero.maxHp && item.heal >= 999 ? 'Your HP was maxed out!' : `Recovered ${this.hero.hp - before} HP!`;
    this.showMessage(`You ${item.light ? 'light' : 'ate'} the ${item.name}. ${healed}`, 'taunt');
  }

  resolveStrike(damage) {
    const foe = this.target;
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
    for (const attack of this.attacks) {
      if (this.dodgeTime < attack.delay) continue;
      const before = this.bullets.length;
      attack.pattern.update(dt, this.bullets, this.soul);
      // Bullets hurt as much as the enemy that fired them.
      for (let i = before; i < this.bullets.length; i++) {
        if (this.bullets[i].dmg === null) this.bullets[i].dmg = attack.foe.data.damage;
      }
    }
    this.ability?.beforeMove?.(this, input, dt);
    this.soul.update(dt, input, hud.BOX);
    for (const bullet of this.bullets) bullet.update(dt * this.bulletTimeScale(bullet), hud.BOX);
    this.bullets = this.bullets.filter((bullet) => !bullet.isGone(hud.BOX));
    this.updateAbility(dt, input);
    this.checkBullets(dt);

    if (this.phase === 'dodge' && this.dodgeTime >= this.turnLength) this.endEnemyTurn();
  }

  endEnemyTurn() {
    this.bullets = [];
    this.defending = false;
    this.soul.locked = false;
    this.turn++;
    // A weapon ability can knock an enemy out during its own turn.
    const fallen = this.activeFoes().find((foe) => foe.hp <= 0);
    if (fallen) this.foeLeaves(fallen, 'defeated', 'command');
    else this.setPhase('command');
  }

  // Abilities like the lantern and bell slow or freeze bullets while active.
  bulletTimeScale(bullet) {
    if (this.abilityLeft <= 0 || !this.ability?.bulletTimeScale) return 1;
    return this.ability.bulletTimeScale(this, bullet);
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
    foe.hp = Math.max(0, foe.hp - amount);
    foe.flash = ENEMY_FLASH_SECONDS;
    this.addPopup(`${amount}`, foe.center.x, foe.pos.y - 4, hud.COLORS.danger);
    sfx('hit');
  }

  healHero(amount) {
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
    let damage = bullet.dmg ?? this.foes[0].data.damage;
    if (this.defending) damage = Math.ceil(damage / 2);
    this.hero.hp = Math.max(0, this.hero.hp - damage);
    sfx('hurt');
    this.addPopup(`${damage}`, PARTY_FEET.x, PARTY_FEET.y - 46, hud.COLORS.danger);
    this.shake = SHAKE_SECONDS;
    this.heroFlinch = SHAKE_SECONDS;
    soul.iframes = BASE_IFRAMES + skillBonus('iframes');
    // Last Stand: the first knockout of the battle leaves you hanging on at 1 HP.
    if (this.hero.hp <= 0 && this.lastStandReady) {
      this.lastStandReady = false;
      this.hero.hp = 1;
      this.addPopup('LAST STAND!', soul.x, soul.y - 18, hud.COLORS.calm);
    }
    if (this.hero.hp <= 0) {
      // The soul shatters into shards.
      soul.shattered = true;
      for (let i = 0; i < 4; i++) this.addSparks(3, soul.mode.color, 140);
      this.setPhase('defeat');
    }
  }

  // Every enemy is beaten or pacified: hand out what they left behind.
  win() {
    this.result = 'won';
    const { exp, coins } = this.earned;
    HERO_STATE.gold += coins;
    let text = `You won!\nGot ${exp} EXP and ${coins} gold.`;
    for (const id of this.earned.items) {
      text += giveItem(id) ? `\nGot a ${ITEMS[id].name}!` : `\nYou couldn't carry the ${ITEMS[id].name}.`;
    }
    for (const [id, amount] of Object.entries(this.earned.materials)) {
      giveMaterial(id, amount);
      text += `\nGot ${amount} ${MATERIALS[id].name}${amount > 1 ? 's' : ''}.`;
    }
    if (exp && gainExp(exp)) {
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
    if (this.phase === 'bossIntro') this.drawBossIntro(ctx);
    for (const foe of this.foes) this.drawFoe(ctx, foe);
    this.drawBox(ctx);
    ctx.restore();

    inUiSpace(ctx, () => {
      this.drawSlash(ctx);
      this.strike?.drawLabels(ctx);
      if ((this.phase === 'taunt' || this.phase === 'bossIntro') && this.taunt) {
        const { pos } = this.speaker;
        hud.drawSpeech(ctx, this.taunt.slice(0, this.visibleTauntChars()), pos.x * S - 4, (pos.y + 14) * S);
      }
      hud.drawSpGauge(ctx, this.sp, this.time);
      this.drawFoeStatus(ctx);
      hud.drawPanel(ctx);
      const choosing = ['command', 'talk', 'spells', 'items', 'target'].includes(this.phase);
      hud.drawPartyCard(ctx, this.hero, choosing);
      const anyCalm = this.activeFoes().some((foe) => foe.calm >= 100);
      hud.drawCommands(ctx, COMMANDS, this.selected, this.phase === 'command', anyCalm ? ['SPELLS'] : [], this.time);
      this.drawPanelText(ctx);
      this.drawPopups(ctx);
    });
    if (this.phase === 'bossIntro') this.drawBossIntroOverlay(ctx);
  }

  // One enemy: full name and bars under it; with several, a compact set beside each.
  drawFoeStatus(ctx) {
    if (this.foes.length === 1) {
      const foe = this.foes[0];
      if (foe.state !== 'active') return;
      const top = (foe.pos.y + foe.sprite.height * SCALE + ENEMY_STATUS_GAP) * S;
      hud.drawEnemyStatus(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, foe.center.x * S, top, this.time);
      return;
    }
    // Hidden while dodging, so the box stays clear.
    if (this.phase === 'dodge' || this.phase === 'defeat') return;
    for (const foe of this.activeFoes()) {
      hud.drawEnemyMini(ctx, foe.name, foe.hp, foe.maxHp, foe.calm, foe.pos.x * S - 8, foe.pos.y * S + 6, this.time);
    }
  }

  drawParty(ctx) {
    this.party.forEach((member, i) => {
      const sprite = member.sprite;
      const w = sprite.width * SCALE;
      const h = sprite.height * SCALE;
      const feetX = PARTY_FEET.x - i * 10;
      const feetY = PARTY_FEET.y + i * 30;

      if (this.phase === 'defeat' && member === this.hero) {
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
      const lunging = this.phase === 'fight' || this.phase === 'fightResult';
      if (lunging) x += 12;
      if (this.heroFlinch > 0) x += Math.round(Math.sin(this.heroFlinch * 60) * 2);
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
    ctx.strokeStyle = '#ffffff';
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
    if (this.phase === 'fightResult' && foe === this.target) {
      x += Math.round(Math.sin(this.phaseTime * 40) * 3 * Math.max(0, 1 - this.phaseTime));
    }
    if (foe.state !== 'active') {
      const gone = this.time - foe.leftAt;
      if (gone >= FOE_FADE_SECONDS) return;
      alpha = 1 - gone / FOE_FADE_SECONDS;
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
      case 'talk':
        hud.drawOptions(ctx, this.target.data.talk.map((option) => ({ label: option.name, enabled: true })), this.cursor);
        break;
      case 'spells': {
        const anyCalm = this.activeFoes().some((foe) => foe.calm >= 100);
        hud.drawOptions(ctx, this.spells.map((spell) => ({
          label: spell.name,
          note: `${spell.sp}% SP`,
          enabled: this.sp >= spell.sp && (spell.id !== 'pacify' || anyCalm),
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
