import { inUiSpace } from '../engine/screen.js';
import { textFile } from '../engine/textLoader.js';
import { sfx } from '../audio/music.js';
import { partyIds, hurtState } from '../characters/party.js';
import { HERO } from '../characters/equipment.js';
import { spellChoices, notchedKeys, notchCount, setNotch } from '../characters/notches.js';
import { drawText, wrapLines, textWidth } from './text.js';
import { HERO_STATE } from '../characters/heroState.js';
import { skillBonus, spellPotency } from '../characters/progress.js';
import { WEAPONS } from '../data/weapons.js';
import { drawMenuFrame, drawWeaponList, drawControls, drawOwnerTag, ownerLook, listIcon, MENU, HEADER_Y, FOOTER_Y, MENU_COLORS } from './menuFrame.js';

// The SPELLS screen (C menu): which learned spells each person takes into
// battle, one to a SPELL NOTCH (src/characters/notches.js). The list on the
// left is their notches, then the spells that never need one; Z on a notch
// opens everything they know, and Z on a spell puts it in that notch (if it
// was in another, the two swap). LEFT/RIGHT is the next person, X goes back.
// The panel on the right says what the spell under the soul does.

const LIST_AREA = { x: MENU.x + 24, y: MENU.y + 78, width: 272, rowHeight: 30, rows: 7 };
// The EQUIPPED strip under the list (like a charm's notches): every notch as a gem with its spell's name.
// With many notches it wraps onto more lines (each slot stays wide enough to read its name), and the
// list above gives up a row for each extra line.
const STRIP_MIN_SLOT = 70;
const STRIP_LINE = 25;
const STRIP_LABEL_W = 92;
function stripLayout(count) {
  const width = MENU.w - 48 - STRIP_LABEL_W;
  let lines = 1;
  while (lines < 3 && width / Math.ceil(count / lines) < STRIP_MIN_SLOT) lines++;
  const listRows = LIST_AREA.rows - (lines - 1);
  return { lines, perLine: Math.ceil(count / lines), listRows, y: LIST_AREA.y + listRows * LIST_AREA.rowHeight + 1 };
}
const EQUIPPED_FILL = 'rgba(255, 210, 94, 0.16)';
const DETAILS = { x: MENU.x + 320, y: MENU.y + 78, w: 216 };

const KIND_COLORS = {
  ATTACK: MENU_COLORS.fight,
  'ALL ENEMIES': MENU_COLORS.fight,
  HEAL: MENU_COLORS.heal,
  CALM: MENU_COLORS.calm,
  GUARD: MENU_COLORS.defense,
  HELP: MENU_COLORS.magic,
  SPARE: MENU_COLORS.calm,
};

// The battle's own sums (battleScene.js), loaded once the menu is first used (a plain import would go round in a circle).
let BATTLE = null;
import('../battle/battleScene.js').then((module) => { BATTLE = module.BattleScene.prototype; }).catch(() => {});

// A stand-in battle with only what the spell sums read (your weapon, your MAG, your skills, nobody hiding):
// what a spell would do if a fight started now.
function calculator() {
  if (!BATTLE) return null;
  const battle = Object.create(BATTLE);
  battle.weapon = WEAPONS[HERO_STATE.weapon] ?? { fightPower: 1 };
  battle.fightPowerBonus = 1 + skillBonus('fightPower');
  battle.potency = spellPotency();
  battle.sneaking = null;
  return battle;
}

// What an attack spell hits for right now (each foe, for one that hits them all), or null for one that doesn't hit.
export function spellHit(who, choice) {
  if (choice.kind !== 'ATTACK' && choice.kind !== 'ALL ENEMIES') return null;
  const battle = calculator();
  if (!battle) return null;
  try {
    if (who === HERO) return battle.spellDamage(choice.key);
    const ally = { id: who, ally: true };
    const command = choice.command;
    if (command.team) return Math.round(battle.teamDamage(ally, command.team));
    return Math.round(battle.allyStrikeDamage(ally, command.strikeAll ?? command.strikeOne ?? command.riposte ?? 0));
  } catch {
    return null;
  }
}

// A spell's line from text/spells/spells.txt, as the battle shows it, with its numbers filled in as they would be
// now ("?" for any that can't be worked out here).
function description(who, choice) {
  const battle = calculator();
  try {
    if (battle && who === HERO) return battle.spellDescription({ id: choice.key }).replace(/\{\w+\}/g, '?');
    if (battle && choice.command) return battle.allySpellDescription({ id: who, ally: true }, choice.command).replace(/\{\w+\}/g, '?');
  } catch { /* the plain line, below */ }
  const section = who === HERO ? choice.key : `${who}_${choice.name.toLowerCase()}`;
  const text = textFile('spells/spells.txt')[section]?.[0] ?? '';
  return text.replace(/\{\w+\}/g, '?');
}

export class NotchMenu {
  constructor() {
    this.isOpen = false;
    this.person = 0;
    this.cursor = 0;
    // 'notches' (choosing a notch) or 'pick' (choosing a spell for `notch`).
    this.mode = 'notches';
    this.notch = 0;
    this.message = '';
  }

  people() {
    return [HERO, ...partyIds()];
  }

  open() {
    this.isOpen = true;
    this.person = Math.min(this.person, this.people().length - 1);
    this.mode = 'notches';
    this.cursor = 0;
    this.message = '';
  }

  who() {
    return this.people()[this.person];
  }

  // The rows of the list: in 'notches', each notch (its spell's key) then the
  // free spells; in 'pick', every spell that can go in a notch.
  rows() {
    const who = this.who();
    const choices = spellChoices(who);
    const find = (key) => choices.find((choice) => choice.key === key);
    if (this.mode === 'pick') return choices.filter((choice) => !choice.free);
    return [...notchedKeys(who).map(find), ...choices.filter((choice) => choice.free)];
  }

  update(input) {
    const who = this.who();
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      if (this.mode === 'pick' && !input.wasPressed('menu')) {
        this.mode = 'notches';
        this.cursor = this.notch;
        return;
      }
      this.isOpen = false;
      return;
    }
    const people = this.people();
    const dir = (input.wasPressed('right') ? 1 : 0) - (input.wasPressed('left') ? 1 : 0);
    if (dir && people.length > 1 && this.mode === 'notches') {
      sfx('move');
      this.person = (this.person + dir + people.length) % people.length;
      this.cursor = 0;
      this.message = '';
      return;
    }
    // Hurt (Ves without her umbrella), they've only their few hurt SPELLS: nothing to choose.
    if (who !== HERO && hurtState(who)) return;
    const rows = this.rows();
    if (!rows.length) return;
    const before = this.cursor;
    if (input.wasPressed('down')) this.cursor = (this.cursor + 1) % rows.length;
    if (input.wasPressed('up')) this.cursor = (this.cursor - 1 + rows.length) % rows.length;
    if (this.cursor !== before) {
      sfx('move');
      this.message = '';
    }
    if (!input.wasPressed('confirm')) return;
    const row = rows[this.cursor];
    if (this.mode === 'notches') {
      if (row.free) {
        sfx('error');
        this.message = `${row.name} needs no notch. It's always there.`;
        return;
      }
      sfx('select');
      this.mode = 'pick';
      this.notch = this.cursor;
      this.cursor = Math.max(0, this.rows().findIndex((choice) => choice.key === row.key));
      this.message = '';
      return;
    }
    sfx('equip');
    setNotch(who, this.notch, row.key);
    this.message = `${row.name} is in notch ${this.notch + 1}.`;
    this.mode = 'notches';
    this.cursor = this.notch;
  }

  draw(ctx) {
    if (!this.isOpen) return;
    inUiSpace(ctx, () => {
      const who = this.who();
      const people = this.people();
      const count = notchCount(who);
      drawMenuFrame(ctx, 'SPELLS', `${count} NOTCH${count === 1 ? '' : 'ES'}`, { split: false, ...(people.length > 1 ? { accent: ownerLook(who).color } : {}) });
      if (people.length > 1) {
        let tagX = MENU.x + 16;
        for (const one of people) tagX += drawOwnerTag(ctx, one, tagX, MENU.y - 27, { selected: one === who, size: 20 }) + 6;
      }
      // Beside the title: what the list is.
      const heading = this.mode === 'pick' ? `NOTCH ${this.notch + 1}: PICK A SPELL` : 'IN BATTLE';
      drawText(ctx, heading, MENU.x + 170, HEADER_Y + 14, { size: 26, color: this.mode === 'pick' ? MENU_COLORS.highlight : MENU_COLORS.dim });

      const hurt = who !== HERO ? hurtState(who) : null;
      if (hurt) {
        drawText(ctx, wrapLines(ctx, hurt.note, MENU.w - 64, 24).join('\n'), MENU.x + 32, LIST_AREA.y, { size: 24, color: MENU_COLORS.description });
        drawText(ctx, hurt.commands.map((command) => command.label).join('   '), MENU.x + 32, LIST_AREA.y + 70, { size: 26 });
        drawControls(ctx, 'LEFT/RIGHT: change person     X: close');
        return;
      }

      const rows = this.rows();
      const notched = notchedKeys(who);
      const ids = rows.map((_, i) => i);
      const strip = stripLayout(Math.max(1, notchCount(who)));
      const area = { ...LIST_AREA, rows: strip.listRows };
      drawWeaponList(ctx, ids, Math.min(this.cursor, rows.length - 1), {
        area,
        name: (i) => rows[i].name,
        nameColor: (i) => {
          if (this.mode === 'pick') return notched.includes(rows[i].key) ? MENU_COLORS.highlight : MENU_COLORS.text;
          return rows[i].free ? MENU_COLORS.dim : MENU_COLORS.text;
        },
        tag: (i) => {
          const row = rows[i];
          const at = notched.indexOf(row.key);
          if (this.mode === 'pick' && at >= 0) return { text: `#${at + 1}`, color: MENU_COLORS.highlight };
          if (row.free) return { text: 'FREE', color: MENU_COLORS.dim };
          // Picking: an attack's damage, so you can compare down the list.
          const hit = this.mode === 'pick' ? spellHit(this.who(), row) : null;
          if (hit) return { text: hit >= 10000 ? `${Math.round(hit / 1000)}k` : hit >= 1000 ? `${(hit / 1000).toFixed(1)}k` : `${hit}`, color: MENU_COLORS.fight };
          return { text: row.sp ? `${row.sp}%` : 'FREE', color: MENU_COLORS.spGain };
        },
        // In a notch: a gold gem, and a gold band behind it. Not in one: the empty socket.
        icon: (i) => {
          if (rows[i].free) return null;
          return notched.includes(rows[i].key) ? listIcon('gem', MENU_COLORS.highlight) : listIcon('socket', MENU_COLORS.dim);
        },
        rowFill: (i) => (this.mode === 'pick' && notched.includes(rows[i].key) ? EQUIPPED_FILL : null),
      });
      this.drawEquipped(ctx, who, notched, strip);
      if (!rows.length) drawText(ctx, 'No spells yet.', LIST_AREA.x + 26, LIST_AREA.y, { size: 26, color: MENU_COLORS.dim });
      // The divider between the list and the details.
      ctx.fillStyle = MENU_COLORS.divider;
      ctx.fillRect(DETAILS.x - 16, LIST_AREA.y - 4, 2, area.rows * LIST_AREA.rowHeight);
      const row = rows[this.cursor];
      if (row) this.drawDetails(ctx, who, row, strip.y);

      const footer = this.message || (this.mode === 'pick'
        ? 'Already in another notch? The two swap.'
        : `${count} spell${count === 1 ? '' : 's'} go into a fight, and the FREE ones.`);
      drawText(ctx, footer, MENU.x + MENU.w / 2, FOOTER_Y + 4, { size: 22, color: this.message ? MENU_COLORS.highlight : MENU_COLORS.description, align: 'center' });
      drawControls(ctx, this.mode === 'pick'
        ? 'Z: put it in the notch     X: back'
        : people.length > 1 ? 'Z: change     LEFT/RIGHT: change person     X: close' : 'Z: change spell     X: close');
    });
  }

  // EQUIPPED: a row of every notch along the bottom, each a gem with its spell's name in its kind's colour (the
  // notch being filled, while picking, framed in gold), so what goes into a fight is plain at a glance.
  drawEquipped(ctx, who, notched, strip) {
    const choices = spellChoices(who);
    const left = MENU.x + 24;
    const width = MENU.w - 48;
    const count = Math.max(1, notchCount(who));
    const height = strip.lines === 1 ? 26 : STRIP_LINE - 2;
    const stripH = (strip.lines - 1) * STRIP_LINE + height;
    drawText(ctx, 'EQUIPPED', left, strip.y + stripH / 2 - 10, { size: 20, color: MENU_COLORS.dim });
    const x0 = left + STRIP_LABEL_W;
    const slot = (left + width - x0) / strip.perLine;
    for (let i = 0; i < count; i++) {
      const col = i % strip.perLine;
      const sx = Math.round(x0 + col * slot);
      const sy = strip.y + Math.floor(i / strip.perLine) * STRIP_LINE;
      const sw = Math.round(slot) - 4;
      const choice = choices.find((c) => c.key === notched[i]);
      const editing = this.mode === 'pick' && this.notch === i;
      ctx.fillStyle = editing ? MENU_COLORS.highlight : choice ? 'rgba(255, 210, 94, 0.35)' : MENU_COLORS.divider;
      ctx.fillRect(sx, sy, sw, height);
      ctx.fillStyle = choice ? '#1a1408' : '#000';
      ctx.fillRect(sx + 2, sy + 2, sw - 4, height - 4);
      const gem = height - 10;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(listIcon(choice ? 'gem' : 'socket', choice ? MENU_COLORS.highlight : MENU_COLORS.dim), sx + 4, sy + 5, gem, gem);
      ctx.restore();
      // The name, shrunk to fit its slot, and cut short with a dot if it still won't (never over the next slot).
      const textX = sx + gem + 7;
      const room = sx + sw - 3 - textX;
      let label = choice ? choice.name : 'EMPTY';
      const size = Math.max(12, Math.min(18, Math.floor((18 * room) / Math.max(1, textWidth(ctx, label, 18)))));
      while (label.length > 2 && textWidth(ctx, label, size) > room) label = `${label.slice(0, label.endsWith('.') ? -2 : -1).trimEnd()}.`;
      ctx.save();
      ctx.beginPath();
      ctx.rect(textX, sy, room + 1, height);
      ctx.clip();
      drawText(ctx, label, textX, sy + (height - size) / 2, { size, color: choice ? (KIND_COLORS[choice.kind] ?? MENU_COLORS.text) : MENU_COLORS.dim });
      ctx.restore();
    }
  }

  // The spell under the soul: its name, what kind it is, its SP, and its line.
  drawDetails(ctx, who, row, stripY) {
    const { x, y, w } = DETAILS;
    const size = Math.min(30, Math.floor((30 * w) / Math.max(1, textWidth(ctx, row.name, 30))));
    drawText(ctx, row.name, x, y, { size, color: MENU_COLORS.highlight });
    drawText(ctx, row.kind, x, y + 36, { size: 22, color: KIND_COLORS[row.kind] ?? MENU_COLORS.text });
    drawText(ctx, row.sp ? `${row.sp}% SP` : 'NO SP', x + w, y + 36, { size: 22, color: MENU_COLORS.spGain, align: 'right' });
    // What it hits for now (each foe, for one that hits them all), so the best one is easy to pick.
    let top = y + 70;
    const hit = spellHit(who, row);
    if (hit) {
      drawText(ctx, `${hit.toLocaleString('en-GB')} DAMAGE${row.kind === 'ALL ENEMIES' ? ' EACH' : ''}`, x, top, { size: 26, color: MENU_COLORS.fight });
      top += 32;
    }
    const lines = wrapLines(ctx, description(who, row), w, 22).slice(0, Math.max(1, Math.floor((stripY - 6 - top) / 24)));
    drawText(ctx, lines.join('\n'), x, top, { size: 22, lineHeight: 24, color: MENU_COLORS.description });
  }
}
