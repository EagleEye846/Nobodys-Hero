import { UI_WIDTH as W, UI_HEIGHT as H } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { expToNext, hasSkill, learnSkill, skillBlocker } from '../characters/progress.js';
import { SKILL_BRANCHES } from '../data/skills.js';
import { ICONS } from '../data/art/icons.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, wrapLines } from './text.js';

// The skill tree, drawn as constellations in a night sky. Each branch is a
// chain of stars; learned stars glow in the branch's colour and light the line
// to the next. Left/right picks a branch, up/down a skill, Z learns it (each
// needs the one above), X goes back. It has its own slow song.

const DESCRIPTIONS = 'skills/skills.txt';
const BRANCH_ICONS = ['fight', 'spells', 'defend'];
const COLUMN_X = [130, 320, 510];
// Small sideways offsets so each branch looks like a constellation, not a list.
const ZIGZAG = [0, -16, 14, -6];
const NODE_TOP = 162;
const NODE_SPACING = 54;
const NODE_RADIUS = 17;
const PANEL = { x: 24, y: 380, w: 592, h: 92 };
const SPARKLE_SECONDS = 0.9;

const COLORS = {
  text: '#ffffff',
  dim: '#6f668f',
  locked: '#3a3060',
  gold: '#ffe14d',
  description: '#d9d2f0',
};

// Repeatable pseudo-random numbers, so the sky is the same every time.
function hash(n) {
  const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 120 }, (_, i) => ({
  x: hash(i) * W,
  y: hash(i + 300) * H,
  size: hash(i + 600) < 0.15 ? 2 : 1,
  phase: hash(i + 900) * Math.PI * 2,
  speed: 0.6 + hash(i + 1200) * 1.6,
}));
const NEBULAE = [
  { x: 130, y: 150, radius: 190, rgb: '176, 124, 255' },
  { x: 520, y: 250, radius: 210, rgb: '79, 227, 208' },
  { x: 330, y: 430, radius: 170, rgb: '255, 140, 26' },
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

export class SkillsMenu {
  constructor() {
    this.isOpen = false;
    this.branch = 0;
    this.index = 0;
    this.message = '';
    this.sparkles = [];
    this.time = 0;
    this.lastFrame = null;
    this.returnSong = null;
  }

  open() {
    this.isOpen = true;
    this.message = '';
    this.lastFrame = null;
    this.returnSong = music.songName;
    music.play('skills');
  }

  close() {
    this.isOpen = false;
    music.play(this.returnSong);
  }

  update(input) {
    if (input.wasPressed('cancel') || input.wasPressed('menu')) {
      sfx('back');
      this.close();
      return;
    }

    const before = `${this.branch},${this.index}`;
    const branches = SKILL_BRANCHES.length;
    if (input.wasPressed('right')) this.branch = (this.branch + 1) % branches;
    if (input.wasPressed('left')) this.branch = (this.branch - 1 + branches) % branches;
    const last = SKILL_BRANCHES[this.branch].skills.length - 1;
    this.index = Math.min(this.index, last);
    if (input.wasPressed('down')) this.index = Math.min(last, this.index + 1);
    if (input.wasPressed('up')) this.index = Math.max(0, this.index - 1);
    if (`${this.branch},${this.index}` !== before) {
      sfx('move');
      this.message = '';
    }

    if (input.wasPressed('confirm')) {
      const branch = SKILL_BRANCHES[this.branch];
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

  nodePosition(branchIndex, index) {
    return { x: COLUMN_X[branchIndex] + ZIGZAG[index % ZIGZAG.length], y: NODE_TOP + index * NODE_SPACING };
  }

  // A shower of sparkles from a star you've just learned.
  burst(branchIndex, index, color) {
    const { x, y } = this.nodePosition(branchIndex, index);
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 110;
      this.sparkles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: SPARKLE_SECONDS, color });
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

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
      SKILL_BRANCHES.forEach((branch, b) => this.drawBranch(ctx, branch, b));
      this.drawSparkles(ctx);
      this.drawPanel(ctx);
    });
  }

  drawSky(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#05030f');
    sky.addColorStop(1, '#170b33');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    NEBULAE.forEach((nebula, i) => {
      const x = nebula.x + Math.sin(this.time * 0.05 + i * 2) * 24;
      const y = nebula.y + Math.cos(this.time * 0.04 + i) * 14;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, nebula.radius);
      glow.addColorStop(0, `rgba(${nebula.rgb}, 0.16)`);
      glow.addColorStop(1, `rgba(${nebula.rgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(x - nebula.radius, y - nebula.radius, nebula.radius * 2, nebula.radius * 2);
    });

    ctx.fillStyle = COLORS.text;
    for (const star of STARS) {
      ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(this.time * star.speed + star.phase));
      ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  drawHeader(ctx) {
    drawText(ctx, 'SKILL TREE', 30, 16, { size: 52, shadow: '#2b1a55' });

    const level = HERO_STATE.level;
    const need = expToNext(level);
    drawText(ctx, `LV ${level}`, 32, 70, { size: 26, color: '#c9b8ff' });
    ctx.fillStyle = '#24153d';
    ctx.fillRect(96, 78, 170, 8);
    const fill = ctx.createLinearGradient(96, 0, 266, 0);
    fill.addColorStop(0, '#7a4fd0');
    fill.addColorStop(1, '#e6d4ff');
    ctx.fillStyle = fill;
    ctx.fillRect(96, 78, Math.round(170 * Math.min(1, HERO_STATE.exp / need)), 8);
    drawText(ctx, `${HERO_STATE.exp}/${need} EXP`, 276, 70, { size: 22, color: COLORS.dim });

    // Skill points as a glowing golden orb.
    const points = HERO_STATE.skillPoints;
    const orbX = W - 176;
    const orbY = 40;
    ctx.save();
    ctx.shadowColor = COLORS.gold;
    ctx.shadowBlur = points ? 14 + 6 * Math.sin(this.time * 3) : 0;
    const orb = ctx.createRadialGradient(orbX - 4, orbY - 4, 2, orbX, orbY, 17);
    orb.addColorStop(0, '#fff6c0');
    orb.addColorStop(1, points ? COLORS.gold : '#6b5a2a');
    ctx.fillStyle = orb;
    circle(ctx, orbX, orbY, 17);
    ctx.fill();
    ctx.restore();
    drawText(ctx, `${points}`, orbX, orbY - 14, { size: 30, color: '#1a1424', align: 'center' });
    drawText(ctx, `SKILL POINT${points === 1 ? '' : 'S'}`, orbX + 26, orbY - 12, { size: 24, color: points ? COLORS.gold : COLORS.dim });
    drawText(ctx, 'Z: learn    X: back', W - 26, 76, { size: 20, color: COLORS.dim, align: 'right' });
  }

  drawBranch(ctx, branch, b) {
    const cx = COLUMN_X[b];
    ctx.drawImage(icon(BRANCH_ICONS[b], branch.color), cx - 9, 98, 18, 18);
    drawText(ctx, branch.name, cx, 118, { size: 28, color: branch.color, align: 'center', shadow: '#05030f' });

    // Lines between the stars: bright once the lower star is learned, dashed and dim before.
    for (let i = 0; i < branch.skills.length - 1; i++) {
      const from = this.nodePosition(b, i);
      const to = this.nodePosition(b, i + 1);
      const lit = hasSkill(branch.skills[i + 1].id);
      ctx.save();
      if (lit) {
        ctx.strokeStyle = branch.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = branch.color;
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = hasSkill(branch.skills[i].id) ? branch.color : COLORS.locked;
        ctx.globalAlpha = hasSkill(branch.skills[i].id) ? 0.5 : 1;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -this.time * 12;
      }
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      ctx.beginPath();
      ctx.moveTo(from.x + Math.cos(angle) * NODE_RADIUS, from.y + Math.sin(angle) * NODE_RADIUS);
      ctx.lineTo(to.x - Math.cos(angle) * NODE_RADIUS, to.y - Math.sin(angle) * NODE_RADIUS);
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

    ctx.save();
    if (learned) {
      ctx.shadowColor = branch.color;
      ctx.shadowBlur = 18 + 4 * Math.sin(this.time * 2 + i);
      const fill = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, NODE_RADIUS);
      fill.addColorStop(0, '#ffffff');
      fill.addColorStop(0.35, branch.color);
      fill.addColorStop(1, '#1a1033');
      ctx.fillStyle = fill;
    } else {
      ctx.fillStyle = available ? '#160c2e' : '#0c0820';
      if (available) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6 + 6 * (0.5 + 0.5 * Math.sin(this.time * 4));
      }
    }
    circle(ctx, x, y, NODE_RADIUS);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = learned ? '#ffffff' : available ? COLORS.text : COLORS.locked;
    ctx.stroke();
    ctx.restore();

    // A little four-pointed star on learned skills; the cost on the rest.
    if (learned) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 6, y, 13, 1);
      ctx.fillRect(x, y - 6, 1, 13);
      ctx.fillRect(x - 2, y - 2, 5, 5);
    } else {
      drawText(ctx, `${skill.cost}`, x, y - 11, { size: 24, color: available ? COLORS.gold : COLORS.dim, align: 'center' });
    }

    if (selected) {
      ctx.save();
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.lineDashOffset = this.time * 20;
      circle(ctx, x, y, NODE_RADIUS + 7);
      ctx.stroke();
      ctx.restore();
      ctx.drawImage(soulSprite(), x - NODE_RADIUS - 34, y - 8);
    }

    const labelColor = learned ? branch.color : available ? COLORS.text : COLORS.dim;
    drawText(ctx, skill.name, x + NODE_RADIUS + 10, y - 11, { size: 22, color: selected ? COLORS.gold : labelColor, shadow: '#05030f' });
  }

  drawSparkles(ctx) {
    for (const sparkle of this.sparkles) {
      ctx.globalAlpha = sparkle.life / SPARKLE_SECONDS;
      ctx.fillStyle = Math.random() < 0.3 ? '#ffffff' : sparkle.color;
      ctx.fillRect(Math.round(sparkle.x), Math.round(sparkle.y), 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  // The selected skill's name, description, and whether (or why not) it can be learned.
  drawPanel(ctx) {
    const branch = SKILL_BRANCHES[this.branch];
    const skill = branch.skills[this.index];
    const { x, y, w, h } = PANEL;

    ctx.save();
    ctx.fillStyle = 'rgba(10, 6, 24, 0.88)';
    ctx.strokeStyle = branch.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = branch.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 12);
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.restore();

    drawText(ctx, skill.name, x + 18, y + 8, { size: 32, color: branch.color });
    const blocker = skillBlocker(branch, this.index);
    let status = this.message || blocker || `Costs ${skill.cost} point${skill.cost === 1 ? '' : 's'}. Press Z to learn.`;
    const learnedNow = this.message.startsWith('Learned');
    const color = learnedNow || !blocker ? COLORS.gold : COLORS.dim;
    if (hasSkill(skill.id) && !this.message) status = 'Learned.';
    drawText(ctx, status, x + w - 18, y + 14, { size: 22, color, align: 'right' });

    const lines = wrapLines(ctx, textSection(DESCRIPTIONS, skill.id)[0], w - 36, 22).slice(0, 2);
    drawText(ctx, lines.join('\n'), x + 18, y + 44, { size: 22, lineHeight: 22, color: COLORS.description });
  }
}
