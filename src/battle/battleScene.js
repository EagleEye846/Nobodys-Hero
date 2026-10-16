import { SCREEN_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { Soul, HEART_SPRITE, SOUL_HIT_RADIUS, GRAZE_RADIUS } from './soul.js';
import { createPattern } from './bullets.js';
import { AttackBar } from './attackBar.js';

const PLAYER = { name: 'HERO', lv: 1, maxHp: 90 };
const STARTING_ITEMS = ['Dark Candy', 'Dark Candy'];
const ITEM_HEAL = 40;
const DEFEND_TP = 16;
const TP_PER_GRAZE = 2;
const HIT_IFRAMES = 1;

const BUTTONS = ['FIGHT', 'ACT', 'ITEM', 'SPARE', 'DEFEND'];
const BUTTON = { w: 52, h: 26, gap: 4, y: 204 };
const BUTTONS_X = Math.floor((SCREEN_WIDTH - BUTTONS.length * BUTTON.w - (BUTTONS.length - 1) * BUTTON.gap) / 2);

// The battle box morphs between a wide text box and a taller dodging arena.
const MENU_BOX = { x: 40, y: 96, w: 240, h: 68 };
const DODGE_BOX = { x: 105, y: 92, w: 110, h: 96 };

const ENEMY = { x: 136, y: 8, scale: 3 };

const FONT = '8px monospace';
const LINE_HEIGHT = 11;
const QUIP_SPEED = 35; // characters per second
const GRAZE_SPARK_LIFE = 0.35;

// A Deltarune-style battle. On your turn you pick a button; on the enemy's turn
// you dodge its bullets as a soul in the box. The scene ends through onEnd with
// 'victory', 'spared' or 'death'.
export class BattleScene {
  constructor(enemy, onEnd) {
    this.enemy = enemy;
    this.onEnd = onEnd;
    this.sprite = makeSprite(enemy.sprite.rows, enemy.sprite.palette);

    this.enemyHp = enemy.maxHp;
    this.mercy = 0;
    this.hp = PLAYER.maxHp;
    this.tp = 0;
    this.items = [...STARTING_ITEMS];
    this.turn = 0;
    this.defending = false;

    this.selected = 0; // main menu button
    this.cursor = 0; // submenu row
    this.soul = new Soul();
    this.bullets = [];
    this.particles = [];
    this.popup = null;
    this.result = null;
    this.finished = false;
    this.time = 0;
    this.box = { ...MENU_BOX };

    this.showMessage(`* ${enemy.name} blocks the way!`, 'menu');
  }

  enter(game) {
    this.game = game;
  }

  showMessage(text, next) {
    this.message = { text, next };
    this.setPhase('message');
  }

  setPhase(phase) {
    this.phase = phase;
    this.phaseTime = 0;
    if (phase === 'menu') {
      this.flavor = this.enemy.flavor[this.turn % this.enemy.flavor.length];
    } else if (phase === 'dialogue') {
      this.quip = this.enemy.quips[Math.floor(Math.random() * this.enemy.quips.length)];
      this.quipDone = false;
    } else if (phase === 'dodge') {
      this.soul.reset(DODGE_BOX.x + DODGE_BOX.w / 2, DODGE_BOX.y + DODGE_BOX.h * 0.7);
      this.bullets = [];
      this.particles = [];
      this.pattern = createPattern(this.enemy.patterns[this.turn % this.enemy.patterns.length], DODGE_BOX);
    } else if (phase === 'attack') {
      this.attackBar = new AttackBar(200);
    } else if (phase === 'act' || phase === 'item') {
      this.cursor = 0;
    }
  }

  finish(result) {
    if (this.finished) return;
    this.finished = true;
    this.onEnd(result);
  }

  update(dt, input) {
    this.time += dt;
    this.phaseTime += dt;
    if (this.popup) {
      this.popup.t += dt;
      if (this.popup.t > 1) this.popup = null;
    }

    // Ease the box toward the shape the current phase wants.
    const target = this.phase === 'dodge' || this.phase === 'death' ? DODGE_BOX : MENU_BOX;
    const ease = Math.min(1, dt * 10);
    for (const key of ['x', 'y', 'w', 'h']) this.box[key] += (target[key] - this.box[key]) * ease;

    switch (this.phase) {
      case 'message':
        if (input.wasPressed('confirm')) this.advanceMessage();
        break;
      case 'menu':
        this.updateMenu(input);
        break;
      case 'act':
        this.updateActMenu(input);
        break;
      case 'item':
        this.updateItemMenu(input);
        break;
      case 'attack': {
        const result = this.attackBar.update(dt, input);
        if (result) this.resolveAttack(result);
        break;
      }
      case 'attackResult':
        if (this.phaseTime >= 0.9) {
          if (this.enemyHp <= 0) this.win(false);
          else this.setPhase('dialogue');
        }
        break;
      case 'dialogue':
        this.updateDialogue(input);
        break;
      case 'dodge':
        this.updateDodge(dt, input);
        break;
      case 'death':
        if (this.phaseTime >= 1.5) this.finish('death');
        break;
    }
  }

  advanceMessage() {
    const { next } = this.message;
    if (next === 'exit') {
      this.finish(this.result);
      return;
    }
    this.setPhase(next);
  }

  updateMenu(input) {
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    this.selected = (this.selected + dir + BUTTONS.length) % BUTTONS.length;
    if (!input.wasPressed('confirm')) return;

    switch (BUTTONS[this.selected]) {
      case 'FIGHT':
        this.setPhase('attack');
        break;
      case 'ACT':
        this.setPhase('act');
        break;
      case 'ITEM':
        if (this.items.length) this.setPhase('item');
        else this.showMessage("* You're out of items.", 'menu');
        break;
      case 'SPARE':
        if (this.mercy >= 100) this.win(true);
        else this.showMessage(`* You spared ${this.enemy.name}.\n* But its name wasn't yellow.`, 'dialogue');
        break;
      case 'DEFEND':
        this.defending = true;
        this.tp = Math.min(100, this.tp + DEFEND_TP);
        this.showMessage('* You brace yourself.\n* TP increased!', 'dialogue');
        break;
    }
  }

  updateActMenu(input) {
    if (input.wasPressed('cancel')) {
      this.setPhase('menu');
      return;
    }
    const acts = this.enemy.acts;
    const dir = (input.wasPressed('down') ? 1 : 0) - (input.wasPressed('up') ? 1 : 0);
    this.cursor = (this.cursor + dir + acts.length) % acts.length;
    if (!input.wasPressed('confirm')) return;

    const act = acts[this.cursor];
    if (act.tp && this.tp < act.tp) {
      this.showMessage('* Not enough TP.', 'act');
      return;
    }
    this.tp -= act.tp ?? 0;
    if (act.mercy) this.mercy = Math.min(100, this.mercy + act.mercy);
    const suffix = act.mercy ? `\n* MERCY +${act.mercy}%` : '';
    this.showMessage(act.text + suffix, 'dialogue');
  }

  updateItemMenu(input) {
    if (input.wasPressed('cancel')) {
      this.setPhase('menu');
      return;
    }
    const dir = (input.wasPressed('down') ? 1 : 0) - (input.wasPressed('up') ? 1 : 0);
    this.cursor = (this.cursor + dir + this.items.length) % this.items.length;
    if (!input.wasPressed('confirm')) return;

    const [item] = this.items.splice(this.cursor, 1);
    this.hp = Math.min(PLAYER.maxHp, this.hp + ITEM_HEAL);
    this.showMessage(`* You ate the ${item}.\n* Recovered ${ITEM_HEAL} HP!`, 'dialogue');
  }

  resolveAttack({ hit, closeness }) {
    let damage = 0;
    let label = 'MISS';
    if (hit) {
      damage = Math.round(12 + closeness * closeness * 38);
      label = closeness > 0.92 ? `${damage}!!` : `${damage}`;
    }
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.popup = { text: label, t: 0 };
    this.setPhase('attackResult');
  }

  updateDialogue(input) {
    if (!input.wasPressed('confirm')) return;
    const fullyShown = this.quipDone || Math.floor(this.phaseTime * QUIP_SPEED) >= this.quip.length;
    if (fullyShown) this.setPhase('dodge');
    else this.quipDone = true;
  }

  updateDodge(dt, input) {
    this.pattern.update(dt, this.phaseTime, this.bullets, this.soul);
    this.soul.update(dt, input, DODGE_BOX);
    for (const bullet of this.bullets) bullet.update(dt, DODGE_BOX);
    this.bullets = this.bullets.filter((bullet) => !bullet.isGone(DODGE_BOX));
    this.checkBullets();

    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.phaseTime >= this.pattern.duration && this.phase === 'dodge') {
      this.bullets = [];
      this.defending = false;
      this.turn++;
      this.setPhase('menu');
    }
  }

  checkBullets() {
    for (const bullet of this.bullets) {
      const distance = Math.hypot(bullet.x - this.soul.x, bullet.y - this.soul.y);
      if (distance < bullet.r + SOUL_HIT_RADIUS) {
        this.hitSoul(bullet);
      } else if (!bullet.grazed && distance < bullet.r + GRAZE_RADIUS) {
        // Touhou-style graze: shaving past a bullet charges TP.
        bullet.grazed = true;
        this.tp = Math.min(100, this.tp + TP_PER_GRAZE);
        this.particles.push({
          x: this.soul.x + (Math.random() - 0.5) * 8,
          y: this.soul.y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 40,
          vy: -30,
          life: GRAZE_SPARK_LIFE,
        });
      }
    }
  }

  hitSoul(bullet) {
    if (this.soul.iframes > 0) return;
    let damage = bullet.dmg ?? this.enemy.bulletDamage;
    if (this.defending) damage = Math.ceil(damage / 2);
    this.hp = Math.max(0, this.hp - damage);
    this.soul.iframes = HIT_IFRAMES;
    if (this.hp <= 0) this.setPhase('death');
  }

  win(spared) {
    this.result = spared ? 'spared' : 'victory';
    const exp = spared ? 0 : this.enemy.rewards.exp;
    this.showMessage(`* You won!\n* Got ${exp} EXP and ${this.enemy.rewards.money} D$.`, 'exit');
  }

  draw(ctx) {
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    this.drawEnemy(ctx);
    this.drawBox(ctx);
    this.drawBoxContents(ctx);
    if (this.phase === 'dialogue') this.drawBubble(ctx);
    this.drawUi(ctx);
    if (this.popup) this.drawPopup(ctx);
  }

  drawEnemy(ctx) {
    const w = this.sprite.width * ENEMY.scale;
    const h = this.sprite.height * ENEMY.scale;
    let x = ENEMY.x;
    if (this.phase === 'attackResult') {
      x += Math.round(Math.sin(this.phaseTime * 40) * 3 * (1 - this.phaseTime));
    }
    const bob = this.result ? 0 : Math.round(Math.sin(this.time * 2) * 2);

    ctx.save();
    // A beaten enemy fades out behind the victory message.
    if (this.result === 'victory') ctx.globalAlpha = Math.max(0, 1 - this.phaseTime);
    ctx.drawImage(this.sprite, x, ENEMY.y + bob, w, h);
    ctx.restore();

    if (this.phase === 'attackResult') {
      ctx.fillStyle = '#404040';
      ctx.fillRect(ENEMY.x, ENEMY.y - 8, w, 5);
      ctx.fillStyle = '#00c000';
      ctx.fillRect(ENEMY.x, ENEMY.y - 8, Math.round((w * this.enemyHp) / this.enemy.maxHp), 5);
    }

    if (this.mercy > 0 && !this.result) {
      const y = ENEMY.y + h + 4;
      ctx.fillStyle = '#404040';
      ctx.fillRect(ENEMY.x, y, w, 4);
      ctx.fillStyle = '#ffe020';
      ctx.fillRect(ENEMY.x, y, Math.round((w * this.mercy) / 100), 4);
      ctx.fillText(`MERCY ${this.mercy}%`, ENEMY.x + w + 6, y - 2);
    }
  }

  drawBox(ctx) {
    const b = this.box;
    ctx.fillStyle = '#fff';
    ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 2, Math.round(b.w) + 4, Math.round(b.h) + 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h));
  }

  drawBoxContents(ctx) {
    const b = this.box;
    if (this.phase === 'menu') {
      ctx.fillStyle = '#fff';
      this.drawLines(ctx, this.flavor, b.x + 8, b.y + 8);
    } else if (this.phase === 'message') {
      ctx.fillStyle = '#fff';
      this.drawLines(ctx, this.message.text, b.x + 8, b.y + 8);
    } else if (this.phase === 'act') {
      this.enemy.acts.forEach((act, i) => {
        const affordable = !act.tp || this.tp >= act.tp;
        ctx.fillStyle = affordable ? '#fff' : '#707070';
        const label = act.tp ? `${act.name} (${act.tp} TP)` : act.name;
        ctx.fillText(label, b.x + 26, b.y + 8 + i * 14);
        if (i === this.cursor) ctx.drawImage(HEART_SPRITE, Math.round(b.x) + 12, Math.round(b.y) + 9 + i * 14);
      });
    } else if (this.phase === 'item') {
      ctx.fillStyle = '#fff';
      this.items.forEach((item, i) => {
        ctx.fillText(item, b.x + 26, b.y + 8 + i * 14);
        if (i === this.cursor) ctx.drawImage(HEART_SPRITE, Math.round(b.x) + 12, Math.round(b.y) + 9 + i * 14);
      });
    } else if (this.phase === 'attack') {
      this.attackBar.draw(ctx, Math.round(b.x + (b.w - 200) / 2), Math.round(b.y + b.h / 2 - 8), 16);
    } else if (this.phase === 'dodge' || this.phase === 'death') {
      ctx.save();
      ctx.beginPath();
      ctx.rect(Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h));
      ctx.clip();
      for (const bullet of this.bullets) bullet.draw(ctx);
      for (const p of this.particles) {
        ctx.globalAlpha = p.life / GRAZE_SPARK_LIFE;
        ctx.fillStyle = '#ffe020';
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      }
      ctx.globalAlpha = 1;
      // The soul winks out shortly after death.
      if (!(this.phase === 'death' && this.phaseTime > 0.5)) this.soul.draw(ctx);
      ctx.restore();
    }
  }

  drawLines(ctx, text, x, y) {
    text.split('\n').forEach((line, i) => ctx.fillText(line, Math.round(x), Math.round(y) + i * LINE_HEIGHT));
  }

  drawBubble(ctx) {
    const x = 192;
    const y = 14;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 118, 50);
    // Tail pointing at the enemy.
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x - 8, y + 22);
    ctx.lineTo(x, y + 26);
    ctx.fill();
    ctx.fillStyle = '#000';
    const visible = this.quipDone ? this.quip.length : Math.floor(this.phaseTime * QUIP_SPEED);
    this.drawLines(ctx, this.quip.slice(0, visible), x + 6, y + 6);
  }

  drawUi(ctx) {
    BUTTONS.forEach((label, i) => {
      const x = BUTTONS_X + i * (BUTTON.w + BUTTON.gap);
      const active = this.phase === 'menu' && i === this.selected;
      const spareReady = label === 'SPARE' && this.mercy >= 100;
      ctx.fillStyle = active ? '#ffb020' : spareReady ? '#ffe020' : '#c85a00';
      ctx.fillRect(x, BUTTON.y, BUTTON.w, BUTTON.h);
      ctx.fillStyle = '#000';
      ctx.fillRect(x + 2, BUTTON.y + 2, BUTTON.w - 4, BUTTON.h - 4);
      ctx.textAlign = 'center';
      ctx.fillStyle = active ? '#fff' : spareReady ? '#ffe020' : '#ffa040';
      ctx.fillText(label, x + BUTTON.w / 2 + (active ? 4 : 0), BUTTON.y + 10);
      if (active) ctx.drawImage(HEART_SPRITE, x + 5, BUTTON.y + 10);
    });
    ctx.textAlign = 'left';

    // Name, LV and HP along the bottom.
    ctx.fillStyle = '#fff';
    ctx.fillText(`${PLAYER.name}  LV ${PLAYER.lv}`, 48, 190);
    ctx.fillText('HP', 150, 190);
    ctx.fillStyle = '#802020';
    ctx.fillRect(166, 189, 54, 9);
    ctx.fillStyle = '#ffe000';
    ctx.fillRect(166, 189, Math.round((54 * this.hp) / PLAYER.maxHp), 9);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${this.hp}/${PLAYER.maxHp}`, 226, 190);

    // TP gauge on the left, charged by grazing and defending.
    ctx.fillText('TP', 20, 84);
    ctx.fillStyle = '#802020';
    ctx.fillRect(22, 96, 8, 88);
    const tpHeight = Math.round((88 * this.tp) / 100);
    ctx.fillStyle = '#ff8020';
    ctx.fillRect(22, 96 + 88 - tpHeight, 8, tpHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.round(this.tp)}%`, 14, 188);
  }

  drawPopup(ctx) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = '#ff4040';
    ctx.fillText(this.popup.text, 160, Math.round(ENEMY.y + 20 - this.popup.t * 14));
    ctx.font = FONT;
    ctx.textAlign = 'left';
  }
}
