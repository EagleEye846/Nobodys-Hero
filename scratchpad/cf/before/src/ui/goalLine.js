import { UI_WIDTH } from '../config.js';
import { textFile } from '../engine/textLoader.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { drawStyledLine, textWidth } from './text.js';
import { nowPlayingShowing, NOW_PLAYING_DROP } from './nowPlaying.js';

// "What was I doing?": one plain line about where to go next, from the
// story so far. The lines are in text/goals.txt: [5] for chapter 5 before
// anything, and [5: <scene id>] once that scene has played (the one seen
// most recently wins; a side quest's [5: <scene id> ~<quest>] lines stop once its
// `~<quest> done` scene has played). It's on the C menu's card (pauseMenu.js), and for a
// few seconds after a save loads (showGoalSoon, drawn by Game over every
// scene, the way "Now playing" is).

const SIZE = 22;
const PAD = 12;
const HEIGHT = 32;
const TOAST_DELAY = 1.2;
const TOAST_SECONDS = 5;
const TOAST_FADE = 0.8;
const COLORS = { fill: '#000', edge: '#ffffff', label: '#8a82b0', text: '#e8e4f4' };

// The line for now, or null if the chapter has none.
export function currentGoal() {
  return goalEntry()?.line ?? null;
}

// Which goal it is ("5: town_meeting", or "5" before any scene), for telling when the goal has moved on.
export function currentGoalKey() {
  return goalEntry()?.key ?? null;
}

function goalEntry() {
  let lines;
  try {
    lines = textFile('goals.txt');
  } catch {
    return null;
  }
  const chapter = WORLD_STATE.chapter ?? 1;
  const seen = WORLD_STATE.seenScenes ?? [];
  const side = sideGoals(lines, chapter);
  // Side quests already finished, found on the way back through what you've seen: their lines are passed over.
  const done = new Set();
  for (let i = seen.length - 1; i >= 0; i--) {
    const line = lines[`${chapter}: ${seen[i]}`]?.[0];
    if (line) return { key: `${chapter}: ${seen[i]}`, line };
    const quest = side.get(seen[i]);
    if (!quest) continue;
    if (quest.done) done.add(quest.name);
    else if (!done.has(quest.name) && quest.line) return { key: `${chapter}: ${seen[i]} ~${quest.name}`, line: quest.line };
  }
  const line = lines[String(chapter)]?.[0];
  return line ? { key: String(chapter), line } : null;
}

// A side quest's lines ([5: <scene> ~<quest>], and [5: <scene> ~<quest> done] where it ends): scene id ->
// { name, line, done }, for this chapter.
function sideGoals(lines, chapter) {
  const found = new Map();
  for (const [key, entries] of Object.entries(lines)) {
    const m = key.match(/^(\d+): (\S+) ~(\S+)( done)?$/);
    if (!m || m[1] !== String(chapter)) continue;
    found.set(m[2], { name: m[3], line: entries[0] ?? null, done: Boolean(m[4]) });
  }
  return found;
}

// A box with "NOW" and the goal in it, its top left at x, y.
export function drawGoal(ctx, goal, x, y, { align = 'left' } = {}) {
  const label = 'NOW';
  const labelW = textWidth(ctx, label, 18);
  const w = PAD * 2 + labelW + 12 + textWidth(ctx, goal, SIZE);
  const left = align === 'right' ? x - w : align === 'center' ? Math.round(x - w / 2) : x;
  ctx.fillStyle = COLORS.edge;
  ctx.fillRect(left - 3, y - 3, w + 6, HEIGHT + 6);
  ctx.fillStyle = COLORS.fill;
  ctx.fillRect(left, y, w, HEIGHT);
  drawStyledLine(ctx, label, left + PAD, y + 8, { size: 18, color: COLORS.label });
  drawStyledLine(ctx, goal, left + PAD + labelW + 12, y + 4, { size: SIZE, color: COLORS.text });
  return w;
}

// After a save loads: the goal shows for a few seconds, top right.
let toastAt = null;
export function showGoalSoon(now = performance.now()) {
  toastAt = now + TOAST_DELAY * 1000;
}

export function drawGoalToast(ctx, now, scene) {
  if (toastAt === null) return;
  const age = (now - toastAt) / 1000;
  if (age > TOAST_SECONDS + TOAST_FADE) {
    toastAt = null;
    return;
  }
  // Only out in the world, not over the title or a cutscene of its own.
  if (age < 0 || !scene?.roomData) return;
  const goal = currentGoal();
  if (!goal) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = Math.min(1, age / 0.3, age > TOAST_SECONDS ? 1 - (age - TOAST_SECONDS) / TOAST_FADE : 1);
  // Under "Now playing" if that's still up.
  const y = nowPlayingShowing(now) ? NOW_PLAYING_DROP + 6 : 13;
  drawGoal(ctx, goal, UI_WIDTH - 13, y, { align: 'right' });
  ctx.restore();
}
