import { UI_WIDTH as W, UI_HEIGHT as H } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { expToNext, hasSkill, learnSkill, skillBlocker, pointsFor } from '../characters/progress.js';
import { skillPages } from '../data/skills.js';
import { partyIds } from '../characters/party.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { ICONS } from '../data/art/icons.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, wrapLines, textWidth } from './text.js';
import { drawOwnerTag, ownerLook } from './menuFrame.js';

// The skill tree, drawn as constellations in a night sky. Each branch is a
// chain of stars under a tab across the top; learned stars burn in the
// branch's colour and light the line to the next, stars you could learn pulse,
// and the rest wait dark. Left/right picks a branch, up/down a skill (the sky
// scrolls when a branch is taller than the screen), Z learns it (each needs
// the one above), X goes back. It has its own slow song.
//
// The tree grows chapter by chapter (see `chapter` in src/data/skills.js), and
// party members bring pages of their own (MEMBER_SKILL_BRANCHES), paid for
// with their own points: SPACE flips between the hero's page and theirs,
// shown as pills beside the title. The layout fits however many branches a
// page has by now.

const DESCRIPTIONS = 'skills/skills.txt';

const TABS_Y = 68;
const TAB_H = 28;
const TREE_TOP = 134;
const ROW_H = 46;
// How many stars of a branch fit on the screen at once; taller ones scroll.
const ROWS = 5;
const TREE_BOTTOM = TREE_TOP + (ROWS - 1) * ROW_H + 34;
const NODE_RADIUS = 12;
// Small sideways offsets so each branch reads as a constellation, not a list.
const ZIGZAG = [0, -6, 5, -4, 6, -5, 3];
const PANEL = { x: 20, y: 386, w: 600, h: 86 };
const SPARKLE_SECONDS = 0.9;

const COLORS = {
  text: '#ffffff',
  dim: '#7a7299',
  faint: '#3b335e',
  gold: '#ffe14d',
  description: '#d9d2f0',
  glass: 'rgba(14, 9, 32, 0.78)',
};

// Repeatable pseudo-random numbers, so the sky is the same every time.
function hash(n) {
  const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: hash(i) * W,
  y: hash(i + 300) * H,
  size: hash(i + 600) < 0.15 ? 2 : 1,
  phase: hash(i + 900) * Math.PI * 2,
  speed: 0.6 + hash(i + 1200) * 1.6,
}));
const NEBULAE = [
  { x: 120, y: 170, radius: 200, rgb: '176, 124, 255' },
  { x: 540, y: 240, radius: 220, rgb: '79, 227, 208' },
  { x: 330, y: 440, radius: 180, rgb: '255, 140, 26' },
];
// Ribbons of aurora drifting across the top of the sky.
const AURORA = [
  { y: 30, amp: 12, length: 180, speed: 0.25, rgb: '90, 230, 180', alpha: 0.10 },
  { y: 48, amp: 9, length: 240, speed: -0.18, rgb: '120, 160, 255', alpha: 0.08 },
];

const iconCache = new Map();
function icon(name, color) {
  const key = `${name}|${color}`;
  if (!iconCache.has(key)) iconCache.set(key, makeSprite(ICONS[name], { '#': color }));
  return iconCache.get(key);
}

function circle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

// A four-pointed star, for learned skills.
function sparkle(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.fill();
}

// Whose page it is: 'hero' or a member id (see ownerLook in menuFrame.js).
const pageOwner = (page) => page.member ?? 'hero';

export class SkillsMenu {
  constructor() {
    this.isOpen = false;
    this.page = 0;
    this.branch = 0;
    this.index = 0;
    this.scroll = 0;
    this.message = '';
    this.sparkles = [];
    this.time = 0;
    this.lastFrame = null;
    this.returnSong = null;
  }

  open() {
    this.isOpen = true;
    // The tree grows chapter by chapter, and with the party (see src/data/skills.js).
    this.pages = skillPages(WORLD_STATE.chapter ?? 1, partyIds());
    this.page = Math.min(this.page, this.pages.length - 1);
    this.branches = this.pages[this.page].branches;
    this.branch = Math.min(this.branch, this.branches.length - 1);
    this.message = '';
    this.lastFrame = null;
    this.returnSong = music.songName;
    this.returnAmbience = music.ambienceName;
    music.play('skills');
  }

  close() {
    this.isOpen = false;
    music.play(this.returnSong, this.returnAmbience);
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.close();
      return;
    }

    // SPACE: the next page (the hero's, then each party member's).
    if (input.wasPressed('jump') && this.pages.length > 1) {
      this.page = (this.page + 1) % this.pages.length;
      this.branches = this.pages[this.page].branches;
      this.branch = Math.min(this.branch, this.branches.length - 1);
      this.index = 0;
      this.scroll = 0;
      this.message = '';
      sfx('move');
      return;
    }

    const before = `${this.branch},${this.index}`;
    const branches = this.branches.length;
    if (input.wasPressed('right')) this.branch = (this.branch + 1) % branches;
    if (input.wasPressed('left')) this.branch = (this.branch - 1 + branches) % branches;
    const last = this.branches[this.branch].skills.length - 1;
    this.index = Math.min(this.index, last);
    if (input.wasPressed('down')) this.index = Math.min(last, this.index + 1);
    if (input.wasPressed('up')) this.index = Math.max(0, this.index - 1);
    if (`${this.branch},${this.index}` !== before) {
      sfx('move');
      this.message = '';
    }
    // Keep the selected star on the screen.
    if (this.index < this.scroll) this.scroll = this.index;
    if (this.index > this.scroll + ROWS - 1) this.scroll = this.index - ROWS + 1;

    if (input.wasPressed('confirm')) {
      const branch = this.branches[this.branch];
      const blocker = skillBlocker(branch, this.index);
      if (blocker) {
        sfx('error');
        this.message = blocker;
      } else if (learnSkill(branch, this.index)) {
        sfx('levelUp');
        this.message = `Learned ${branch.skills[this.index].name}!`;
        this.burst(this.branch, this.index, branch.color);
      }
    }
  }

  // --- Layout: columns spread across the sky; rows scroll with the selection. ---
  columnX(index) {
    const count = this.branches.length;
    return Math.round((W / count) * (index + 0.5));
  }

  nodePosition(branchIndex, index) {
    return { x: this.columnX(branchIndex) + ZIGZAG[index % ZIGZAG.length], y: TREE_TOP + (index - this.scroll) * ROW_H };
  }

  get tallest() {
    return Math.max(...this.branches.map((branch) => branch.skills.length));
  }

  // A shower of sparkles from a star you've just learned.
  burst(branchIndex, index, color) {
    const { x, y } = this.nodePosition(branchIndex, index);
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.sparkles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: SPARKLE_SECONDS, color });
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;
    // Keep the selected star on the screen.
    if (this.index < this.scroll) this.scroll = this.index;
    if (this.index > this.scroll + ROWS - 1) this.scroll = this.index - ROWS + 1;

    // Menus get no dt, so the animation keeps its own clock.
    const now = performance.now() / 1000;
    const dt = this.lastFrame === null ? 0 : Math.min(0.05, now - this.lastFrame);
    this.lastFrame = now;
    this.time += dt;
    for (const sparkle of this.sparkles) {
      sparkle.x += sparkle.vx * dt;
      sparkle.y += sparkle.vy * dt;
      sparkle.vx *= 0.96;
      sparkle.vy *= 0.96;
      sparkle.life -= dt;
    }
    this.sparkles = this.sparkles.filter((sparkle) => sparkle.life > 0);

    inUiSpace(ctx, () => {
      this.drawSky(ctx);
      this.drawHeader(ctx);
      this.drawTabs(ctx);
      // The stars live between the tabs and the panel; what scrolls past is cut off.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, TREE_TOP - 22, W, TREE_BOTTOM - TREE_TOP + 22);
      ctx.clip();
      this.branches.forEach((branch, b) => this.drawBranch(ctx, branch, b));
      this.drawSparkles(ctx);
      ctx.restore();
      this.drawScrollArrows(ctx);
      this.drawPanel(ctx);
      this.drawPageFrame(ctx);
    });
  }

  drawSky(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#04020d');
    sky.addColorStop(0.6, '#0e0724');
    sky.addColorStop(1, '#1b0f3c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    NEBULAE.forEach((nebula, i) => {
      const x = nebula.x + Math.sin(this.time * 0.05 + i * 2) * 26;
      const y = nebula.y + Math.cos(this.time * 0.04 + i) * 16;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, nebula.radius);
      glow.addColorStop(0, `rgba(${nebula.rgb}, 0.15)`);
      glow.addColorStop(1, `rgba(${nebula.rgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(x - nebula.radius, y - nebula.radius, nebula.radius * 2, nebula.radius * 2);
    });

    // Aurora: soft ribbons rolling slowly across.
    for (const ribbon of AURORA) {
      ctx.beginPath();
      ctx.moveTo(0, ribbon.y);
      for (let x = 0; x <= W; x += 16) ctx.lineTo(x, ribbon.y + Math.sin(x / ribbon.length * Math.PI * 2 + this.time * ribbon.speed * 2) * ribbon.amp);
      for (let x = W; x >= 0; x -= 16) ctx.lineTo(x, ribbon.y + 34 + Math.sin(x / ribbon.length * Math.PI * 2 + this.time * ribbon.speed * 2 + 1) * ribbon.amp);
      ctx.closePath();
      const fade = ctx.createLinearGradient(0, ribbon.y - 10, 0, ribbon.y + 44);
      fade.addColorStop(0, `rgba(${ribbon.rgb}, 0)`);
      fade.addColorStop(0.5, `rgba(${ribbon.rgb}, ${ribbon.alpha})`);
      fade.addColorStop(1, `rgba(${ribbon.rgb}, 0)`);
      ctx.fillStyle = fade;
      ctx.fill();
    }

    ctx.fillStyle = COLORS.text;
    for (const star of STARS) {
      ctx.globalAlpha = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(this.time * star.speed + star.phase));
      ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  drawHeader(ctx) {
    drawText(ctx, 'SKILL TREE', 28, 8, { size: 40, shadow: '#2b1a55' });

    // Level and EXP, as a slim bar on the right of the hint line.
    const level = HERO_STATE.level;
    const need = expToNext(level);
    drawText(ctx, `LV ${level}`, 372, 46, { size: 20, color: '#c9b8ff' });
    roundRect(ctx, 418, 52, 100, 8, 4);
    ctx.fillStyle = '#1e1238';
    ctx.fill();
    const fill = ctx.createLinearGradient(418, 0, 518, 0);
    fill.addColorStop(0, '#7a4fd0');
    fill.addColorStop(1, '#e6d4ff');
    roundRect(ctx, 418, 52, Math.max(0, Math.round(100 * Math.min(1, HERO_STATE.exp / need))), 8, 4);
    ctx.fillStyle = fill;
    ctx.fill();
    drawText(ctx, `${HERO_STATE.exp}/${need} EXP`, 524, 47, { size: 17, color: COLORS.dim });

    // The points you're spending (the hero's, or the member's whose page this
    // is: the pills beside the title say whose), in a capsule with a golden orb.
    const branch = this.branches[this.branch];
    const points = pointsFor(branch);
    const label = `${points} SKILL POINT${points === 1 ? '' : 'S'}`;
    const width = textWidth(ctx, label, 20) + 54;
    const x = W - 20 - width;
    const y = 8;
    roundRect(ctx, x, y, width, 32, 16);
    ctx.fillStyle = COLORS.glass;
    ctx.fill();
    ctx.strokeStyle = points ? COLORS.gold : COLORS.faint;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = COLORS.gold;
    ctx.shadowBlur = points ? 12 + 5 * Math.sin(this.time * 3) : 0;
    const orb = ctx.createRadialGradient(x + 14, y + 13, 1, x + 16, y + 16, 10);
    orb.addColorStop(0, '#fff6c0');
    orb.addColorStop(1, points ? COLORS.gold : '#5a4a22');
    ctx.fillStyle = orb;
    circle(ctx, x + 16, y + 16, 10);
    ctx.fill();
    ctx.restore();
    drawText(ctx, label, x + 34, y + 6, { size: 20, color: points ? COLORS.gold : COLORS.dim });

    // Under the title: whose page it is (with friends along) and SPACE to
    // switch; or, alone, the keys. Kept clear of the level and EXP on the right.
    if (this.pages.length > 1) {
      const right = this.drawPagePills(ctx, 26);
      drawText(ctx, 'SPACE: switch', right + 6, 46, { size: 18, color: COLORS.dim });
    } else {
      drawText(ctx, 'Z learn   X back   ←→↑↓ move', 30, 46, { size: 18, color: COLORS.dim });
    }
  }

  // Whose page you're on: a tag with their face for each, the current one
  // filled in their colour. Returns where they end.
  drawPagePills(ctx, left) {
    let x = left;
    this.pages.forEach((page, p) => {
      x += drawOwnerTag(ctx, pageOwner(page), x, 40, { selected: p === this.page, size: 16 }) + 6;
    });
    return x;
  }

  // With more than one page, a glowing edge round the sky in the colour of
  // whoever's page it is.
  drawPageFrame(ctx) {
    if (this.pages.length < 2) return;
    const { color } = ownerLook(pageOwner(this.pages[this.page]));
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.75 + 0.2 * Math.sin(this.time * 2);
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.lineWidth = 4;
    roundRect(ctx, 3, 3, W - 6, H - 6, 10);
    ctx.stroke();
    ctx.restore();
  }

  // The branches, as tabs across the top of the sky.
  drawTabs(ctx) {
    const many = this.branches.length > 5;
    const size = many ? 17 : 20;
    this.branches.forEach((branch, b) => {
      const cx = this.columnX(b);
      const selected = b === this.branch;
      const label = branch.name;
      const width = textWidth(ctx, label, size) + (many ? 34 : 42);
      const x = cx - width / 2;
      roundRect(ctx, x, TABS_Y, width, TAB_H, 14);
      ctx.fillStyle = selected ? `${branch.color}33` : 'rgba(14, 9, 32, 0.6)';
      ctx.fill();
      ctx.strokeStyle = selected ? branch.color : COLORS.faint;
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      const iconSize = many ? 12 : 16;
      ctx.drawImage(icon(branch.icon, selected ? branch.color : COLORS.dim), Math.round(x + 10), TABS_Y + (TAB_H - iconSize) / 2, iconSize, iconSize);
      drawText(ctx, label, x + 14 + iconSize, TABS_Y + (many ? 5 : 3), { size, color: selected ? COLORS.text : COLORS.dim });
      if (selected) {
        ctx.save();
        ctx.shadowColor = branch.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = branch.color;
        ctx.fillRect(Math.round(cx - 18), TABS_Y + TAB_H + 4, 36, 2);
        ctx.restore();
      }
      // How much of the branch is learned, as dots under the tab.
      const learned = branch.skills.filter((skill) => hasSkill(skill.id)).length;
      for (let i = 0; i < branch.skills.length; i++) {
        ctx.fillStyle = i < learned ? branch.color : COLORS.faint;
        ctx.fillRect(Math.round(cx - branch.skills.length * 3 + i * 6), TABS_Y + TAB_H + 10, 3, 3);
      }
    });
  }

  drawBranch(ctx, branch, b) {
    // Lines between the stars: bright once the lower star is learned, dashed and dim before.
    for (let i = 0; i < branch.skills.length - 1; i++) {
      const from = this.nodePosition(b, i);
      const to = this.nodePosition(b, i + 1);
      const lit = hasSkill(branch.skills[i + 1].id);
      const reaching = !lit && hasSkill(branch.skills[i].id);
      ctx.save();
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const x0 = from.x + Math.cos(angle) * NODE_RADIUS;
      const y0 = from.y + Math.sin(angle) * NODE_RADIUS;
      const x1 = to.x - Math.cos(angle) * NODE_RADIUS;
      const y1 = to.y - Math.sin(angle) * NODE_RADIUS;
      if (lit) {
        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, branch.color);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.shadowColor = branch.color;
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = reaching ? branch.color : COLORS.faint;
        ctx.globalAlpha = reaching ? 0.6 : 1;
        ctx.lineWidth = reaching ? 2 : 1.5;
        ctx.setLineDash([3, 7]);
        ctx.lineDashOffset = -this.time * 14;
      }
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.restore();
    }

    branch.skills.forEach((skill, i) => this.drawStar(ctx, branch, b, skill, i));
  }

  drawStar(ctx, branch, b, skill, i) {
    const { x, y } = this.nodePosition(b, i);
    const learned = hasSkill(skill.id);
    const available = !learned && !skillBlocker(branch, i);
    const selected = b === this.branch && i === this.index;
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 3 + i);

    ctx.save();
    if (learned) {
      ctx.shadowColor = branch.color;
      ctx.shadowBlur = 16 + 6 * Math.sin(this.time * 2 + i);
      const fill = ctx.createRadialGradient(x - 4, y - 4, 1, x, y, NODE_RADIUS);
      fill.addColorStop(0, '#ffffff');
      fill.addColorStop(0.4, branch.color);
      fill.addColorStop(1, '#1a1033');
      ctx.fillStyle = fill;
    } else if (available) {
      ctx.shadowColor = branch.color;
      ctx.shadowBlur = 6 + 10 * pulse;
      ctx.fillStyle = '#140b2a';
    } else {
      ctx.fillStyle = '#0b0718';
    }
    circle(ctx, x, y, NODE_RADIUS);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = learned ? 1.5 : 2;
    ctx.strokeStyle = learned ? '#ffffff' : available ? branch.color : COLORS.faint;
    if (available) ctx.globalAlpha = 0.6 + 0.4 * pulse;
    ctx.stroke();
    ctx.restore();

    if (selected) {
      // The soul marks the star you're looking at.
      const soul = soulSprite();
      ctx.drawImage(soul, Math.round(x - soul.width / 2), Math.round(y - soul.height / 2));
      ctx.save();
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.lineDashOffset = this.time * 24;
      circle(ctx, x, y, NODE_RADIUS + 6);
      ctx.stroke();
      ctx.restore();
    } else if (learned) {
      sparkle(ctx, x, y, 7, '#ffffff');
    } else {
      drawText(ctx, `${skill.cost}`, x, y - 11, { size: 22, color: available ? COLORS.gold : COLORS.dim, align: 'center' });
    }

    // Its name under the star, in the column.
    const labelColor = learned ? branch.color : available ? COLORS.text : COLORS.dim;
    drawText(ctx, skill.name, x, y + NODE_RADIUS + 1, { size: 15, color: selected ? COLORS.gold : labelColor, align: 'center', shadow: '#05030f' });
  }

  // Arrows when a branch runs off the top or bottom of the sky.
  drawScrollArrows(ctx) {
    ctx.fillStyle = COLORS.gold;
    const cx = this.columnX(this.branch) + 40;
    if (this.scroll > 0) {
      ctx.beginPath();
      ctx.moveTo(cx - 5, TREE_TOP - 4);
      ctx.lineTo(cx + 5, TREE_TOP - 4);
      ctx.lineTo(cx, TREE_TOP - 10);
      ctx.fill();
    }
    if (this.scroll + ROWS < this.tallest) {
      ctx.beginPath();
      ctx.moveTo(cx - 5, TREE_BOTTOM - 4);
      ctx.lineTo(cx + 5, TREE_BOTTOM - 4);
      ctx.lineTo(cx, TREE_BOTTOM + 2);
      ctx.fill();
    }
  }

  drawSparkles(ctx) {
    for (const sparkle of this.sparkles) {
      ctx.globalAlpha = sparkle.life / SPARKLE_SECONDS;
      ctx.fillStyle = Math.random() < 0.3 ? '#ffffff' : sparkle.color;
      ctx.fillRect(Math.round(sparkle.x), Math.round(sparkle.y), 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  // The selected skill: name, cost, whether (or why not) it can be learned, and what it does.
  drawPanel(ctx) {
    const branch = this.branches[this.branch];
    const skill = branch.skills[this.index];
    const { x, y, w, h } = PANEL;

    ctx.save();
    roundRect(ctx, x, y, w, h, 12);
    ctx.fillStyle = COLORS.glass;
    ctx.shadowColor = branch.color;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `${branch.color}99`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // A bar of the branch's colour down the left edge.
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, 6, h, [12, 0, 0, 12]);
    else ctx.rect(x, y, 6, h);
    ctx.fillStyle = branch.color;
    ctx.fill();
    ctx.restore();

    // With more than one page, whose skill it is, before its name.
    const title = this.pages.length > 1 ? `${ownerLook(pageOwner(this.pages[this.page])).name}: ${skill.name}` : skill.name;
    drawText(ctx, title, x + 22, y + 8, { size: 30, color: branch.color });
    // The cost, as a little chip after the name.
    const nameWidth = textWidth(ctx, title, 30);
    const chip = `${skill.cost} PT${skill.cost === 1 ? '' : 'S'}`;
    const chipW = textWidth(ctx, chip, 18) + 16;
    roundRect(ctx, x + 32 + nameWidth, y + 14, chipW, 22, 11);
    ctx.fillStyle = hasSkill(skill.id) ? `${branch.color}55` : 'rgba(255, 225, 77, 0.18)';
    ctx.fill();
    drawText(ctx, chip, x + 40 + nameWidth, y + 15, { size: 18, color: hasSkill(skill.id) ? branch.color : COLORS.gold });

    const blocker = skillBlocker(branch, this.index);
    let status = this.message || blocker || 'Press Z to learn.';
    const learnedNow = this.message.startsWith('Learned');
    const color = learnedNow || !blocker ? COLORS.gold : COLORS.dim;
    if (hasSkill(skill.id) && !this.message) status = 'Learned.';
    // The status sits on the right unless the name is long; then on the next line's right.
    const statusWidth = textWidth(ctx, status, 20);
    const statusY = x + 48 + nameWidth + chipW + statusWidth > x + w - 18 ? y + 62 : y + 14;
    drawText(ctx, status, x + w - 18, statusY, { size: 20, color, align: 'right' });

    const lines = wrapLines(ctx, textSection(DESCRIPTIONS, skill.id)[0], statusY === y + 62 ? w - 44 - statusWidth - 12 : w - 44, 21).slice(0, 2);
    drawText(ctx, lines.join('\n'), x + 22, y + 44, { size: 21, lineHeight: 21, color: COLORS.description });
  }
}
