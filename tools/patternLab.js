import { SOUL_MODES, SOUL_INSET } from '../src/battle/soulModes.js';
import { SOUL_RADIUS, GRAZE_RADIUS, soulSprite } from '../src/battle/soul.js';
import { loadPatterns, makePattern, wrapFactory, PATTERN_INFO } from './library.js';
import { listDir, readText } from './api.js';
import { isIdentifier } from './source.js';
import {
  el, setChildren, icon, btn, hint, field, slider, section, segmented, popupMenu, confirmBox, pixelCanvas, thumbnail,
  isTyping, deepClone, camelCase, friendly, codeView, toast,
} from './ui.js';

// Pattern Lab: try the game's attack patterns in a copy of the battle box with
// a soul you steer, or build a new one from blocks (no code needed). Saving
// writes src/data/patterns/<name>.js, which enemies can use by name at once.

const FALLBACK_BOX = { x: 120, y: 44, w: 80, h: 80 };
const MARGIN = 28;
const SCALE = 3;
const IFRAME_SECONDS = 1;
const MAX_DT = 1 / 20;
const SOUL_CENTER = { x: 8, y: 10 };
const KEYS = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', KeyX: 'focus', ShiftLeft: 'focus', Space: 'jump',
};
const n = (v) => String(Math.round(v * 1000) / 1000);
const deg = (v) => n((v * Math.PI) / 180);

// --- Blocks: each one is an emitter with plain settings, and writes its own code. ---
const BLOCKS = {
  rain: {
    label: 'Rain from the top',
    text: 'Bullets fall from the top of the box.',
    params: [
      { key: 'rate', label: 'How often', min: 1, max: 14, step: 0.5, value: 5, format: (v) => `${v} a second` },
      { key: 'speed', label: 'Speed', min: 20, max: 150, step: 5, value: 70 },
      { key: 'wind', label: 'Wind', min: -40, max: 40, step: 5, value: 0, format: (v) => (v < 0 ? `${-v} to the left` : v > 0 ? `${v} to the right` : 'none') },
      { key: 'bullet', type: 'bullet', value: 'puff' },
    ],
    code: (p) => `{
    const wind = ${n(p.wind)};
    emitters.push(every(${n(0.8 / p.rate)}, ${n(1.2 / p.rate)}, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x - wind * 0.6, box.x + box.w - wind * 0.6), y: box.y - 3, vx: wind + rand(-6, 6), vy: rand(${n(p.speed * 0.85)}, ${n(p.speed * 1.15)}), size: '${p.bullet}' }));
    }));
  }`,
  },
  aimed: {
    label: 'Aimed at you',
    text: 'Little spreads of shots fired straight at the soul.',
    params: [
      { key: 'rate', label: 'How often', min: 0.3, max: 4, step: 0.1, value: 1.2, format: (v) => `${v} a second` },
      { key: 'count', label: 'Shots each time', min: 1, max: 9, step: 1, value: 3 },
      { key: 'spread', label: 'Spread', min: 0, max: 40, step: 1, value: 12, format: (v) => `${v}°` },
      { key: 'speed', label: 'Speed', min: 30, max: 170, step: 5, value: 85 },
      { key: 'from', label: 'From', type: 'choice', options: [['top', 'Top'], ['sides', 'Sides'], ['any', 'Anywhere']], value: 'top' },
      { key: 'bullet', type: 'bullet', value: 'small' },
    ],
    code: (p) => `{
    const sides = ${JSON.stringify({ top: ['top'], sides: ['left', 'right'], any: ['top', 'left', 'right'] }[p.from]).replace(/"/g, "'")};
    emitters.push(every(${n(0.8 / p.rate)}, ${n(1.2 / p.rate)}, (bullets, soul) => {
      const side = pick(sides);
      const x = side === 'left' ? box.x - 3 : side === 'right' ? box.x + box.w + 3 : rand(box.x + 6, box.x + box.w - 6);
      const y = side === 'top' ? box.y - 3 : rand(box.y + 6, box.y + box.h * 0.6);
      const aim = Math.atan2(soul.y - y, soul.x - x);
      for (let i = 0; i < ${p.count}; i++) {
        const angle = aim + (i - ${n((p.count - 1) / 2)}) * ${deg(p.spread)};
        bullets.push(new Shot({ x, y, vx: Math.cos(angle) * ${n(p.speed)}, vy: Math.sin(angle) * ${n(p.speed)}, size: '${p.bullet}' }));
      }
    }));
  }`,
  },
  ring: {
    label: 'Ring burst',
    text: 'A circle of bullets bursts outward (or closes in on you).',
    params: [
      { key: 'rate', label: 'How often', min: 0.2, max: 2.5, step: 0.1, value: 0.8, format: (v) => `${v} a second` },
      { key: 'count', label: 'Bullets in the ring', min: 4, max: 24, step: 1, value: 10 },
      { key: 'speed', label: 'Speed', min: 15, max: 120, step: 5, value: 45 },
      { key: 'where', label: 'Where', type: 'choice', options: [['random', 'Anywhere'], ['center', 'Middle'], ['soul', 'Around you']], value: 'random' },
      { key: 'bullet', type: 'bullet', value: 'ember' },
    ],
    code: (p) => {
      const ring = p.where === 'soul'
        ? `      // A ring around the soul that closes in, with a gap to escape through.
      const gapAt = Math.floor(rand(0, ${p.count}));
      for (let i = 0; i < ${p.count}; i++) {
        if (i === gapAt || i === (gapAt + 1) % ${p.count}) continue;
        const angle = (i / ${p.count}) * Math.PI * 2;
        bullets.push(new Shot({ x: soul.x + Math.cos(angle) * 34, y: soul.y + Math.sin(angle) * 34, vx: -Math.cos(angle) * ${n(p.speed)}, vy: -Math.sin(angle) * ${n(p.speed)}, size: '${p.bullet}' }));
      }`
        : `${p.where === 'center'
          ? '      const x = box.x + box.w / 2;\n      const y = box.y + box.h / 2;'
          : `      // Somewhere random, but not right on top of the soul.
      let x = 0;
      let y = 0;
      for (let tries = 0; tries < 10; tries++) {
        x = rand(box.x + 10, box.x + box.w - 10);
        y = rand(box.y + 10, box.y + box.h * 0.6);
        if (Math.hypot(x - soul.x, y - soul.y) > 28) break;
      }`}
      const turn = rand(0, Math.PI * 2);
      for (let i = 0; i < ${p.count}; i++) {
        const angle = turn + (i / ${p.count}) * Math.PI * 2;
        bullets.push(new Shot({ x, y, vx: Math.cos(angle) * ${n(p.speed)}, vy: Math.sin(angle) * ${n(p.speed)}, size: '${p.bullet}' }));
      }`;
      return `{
    emitters.push(every(${n(0.8 / p.rate)}, ${n(1.2 / p.rate)}, (bullets, soul) => {
${ring}
    }));
  }`;
    },
  },
  spiral: {
    label: 'Spiral',
    text: 'A spinning emitter sprays bullets in arms.',
    params: [
      { key: 'arms', label: 'Arms', min: 1, max: 6, step: 1, value: 3 },
      { key: 'turn', label: 'Spin', min: 4, max: 60, step: 1, value: 20, format: (v) => `${v}° a shot` },
      { key: 'rate', label: 'How often', min: 2, max: 20, step: 1, value: 9, format: (v) => `${v} a second` },
      { key: 'speed', label: 'Speed', min: 20, max: 120, step: 5, value: 45 },
      { key: 'where', label: 'Where', type: 'choice', options: [['top', 'Near the top'], ['center', 'Middle']], value: 'top' },
      { key: 'bullet', type: 'bullet', value: 'small' },
    ],
    code: (p) => `{
    let angle = rand(0, Math.PI * 2);
    const turn = ${deg(p.turn)} * pick([-1, 1]);
    emitters.push(every(${n(1 / p.rate)}, ${n(1 / p.rate)}, (bullets) => {
      const x = box.x + box.w / 2;
      const y = ${p.where === 'center' ? 'box.y + box.h / 2' : 'box.y + 14'};
      for (let i = 0; i < ${p.arms}; i++) {
        const a = angle + (i * Math.PI * 2) / ${p.arms};
        bullets.push(new Shot({ x, y, vx: Math.cos(a) * ${n(p.speed)}, vy: Math.sin(a) * ${n(p.speed)}, size: '${p.bullet}' }));
      }
      angle += turn;
    }));
  }`,
  },
  wall: {
    label: 'Wall with a gap',
    text: 'Rows of bullets sweep across; slip through the gap.',
    params: [
      { key: 'rate', label: 'How often', min: 0.3, max: 2.5, step: 0.1, value: 0.9, format: (v) => `${v} walls a second` },
      { key: 'gap', label: 'Gap size', min: 12, max: 50, step: 1, value: 24 },
      { key: 'spacing', label: 'Bullet spacing', min: 5, max: 16, step: 1, value: 7 },
      { key: 'speed', label: 'Speed', min: 20, max: 120, step: 5, value: 50 },
      { key: 'wander', label: 'Gap wanders', min: 0, max: 40, step: 5, value: 20 },
      { key: 'from', label: 'From', type: 'choice', options: [['top', 'Top'], ['left', 'Left'], ['right', 'Right']], value: 'top' },
      { key: 'bullet', type: 'bullet', value: 'small' },
    ],
    code: (p) => {
      const along = p.from === 'top' ? 'box.w' : 'box.h';
      const shot = {
        top: `{ x: box.x + pos, y: box.y - 3, vy: ${n(p.speed)}, size: '${p.bullet}' }`,
        left: `{ x: box.x - 3, y: box.y + pos, vx: ${n(p.speed)}, size: '${p.bullet}' }`,
        right: `{ x: box.x + box.w + 3, y: box.y + pos, vx: -${n(p.speed)}, size: '${p.bullet}' }`,
      }[p.from];
      return `{
    const gap = ${n(p.gap)};
    const lo = gap / 2 + 2;
    const hi = ${along} - gap / 2 - 2;
    let center = rand(lo, hi);
    let drift = rand(-${n(p.wander)}, ${n(p.wander)});
    const fire = every(${n(0.85 / p.rate)}, ${n(1.15 / p.rate)}, (bullets) => {
      for (let pos = 3; pos < ${along}; pos += ${n(p.spacing)}) {
        if (Math.abs(pos - center) > gap / 2) bullets.push(new Shot(${shot}));
      }
    });
    emitters.push((dt, bullets) => {
      drift = clamp(drift + rand(-60, 60) * dt, -${n(p.wander)}, ${n(p.wander)});
      center += drift * dt;
      if (center < lo || center > hi) {
        drift = -drift;
        center = clamp(center, lo, hi);
      }
      fire(dt, bullets);
    });
  }`;
    },
  },
  bounce: {
    label: 'Bouncing balls',
    text: 'A few big bullets that bounce off the walls all turn.',
    params: [
      { key: 'count', label: 'How many', min: 1, max: 8, step: 1, value: 3 },
      { key: 'delay', label: 'Time between', min: 0.2, max: 2, step: 0.1, value: 0.8, format: (v) => `${v} s` },
      { key: 'speed', label: 'Speed', min: 30, max: 120, step: 5, value: 65 },
      { key: 'bullet', type: 'bullet', value: 'yarn' },
    ],
    code: (p) => `{
    let spawned = 0;
    emitters.push(every(${n(p.delay * 0.8)}, ${n(p.delay * 1.2)}, (bullets) => {
      if (spawned >= ${p.count}) return;
      spawned++;
      const angle = rand(0.3, 0.7) * Math.PI;
      bullets.push(new Shot({ x: rand(box.x + 10, box.x + box.w - 10), y: box.y + 6, vx: Math.cos(angle) * ${n(p.speed)} * pick([-1, 1]), vy: Math.sin(angle) * ${n(p.speed)}, size: '${p.bullet}', bounce: true }));
    }));
  }`,
  },
  wave: {
    label: 'Wavy shots',
    text: 'Bullets wiggle up and down as they cross the box.',
    params: [
      { key: 'rate', label: 'How often', min: 0.5, max: 8, step: 0.5, value: 2, format: (v) => `${v} a second` },
      { key: 'speed', label: 'Speed', min: 20, max: 120, step: 5, value: 50 },
      { key: 'amplitude', label: 'Wiggle size', min: 0, max: 20, step: 1, value: 9 },
      { key: 'frequency', label: 'Wiggle speed', min: 1, max: 10, step: 0.5, value: 5 },
      { key: 'from', label: 'From', type: 'choice', options: [['both', 'Both sides'], ['left', 'Left'], ['right', 'Right']], value: 'both' },
      { key: 'bullet', type: 'bullet', value: 'dust' },
    ],
    code: (p) => `{
    emitters.push(every(${n(0.8 / p.rate)}, ${n(1.2 / p.rate)}, (bullets) => {
      const fromLeft = ${p.from === 'both' ? 'Math.random() < 0.5' : p.from === 'left'};
      bullets.push(new Shot({
        x: fromLeft ? box.x - 3 : box.x + box.w + 3,
        y: rand(box.y + 8, box.y + box.h - 8),
        vx: (fromLeft ? 1 : -1) * rand(${n(p.speed * 0.85)}, ${n(p.speed * 1.15)}),
        size: '${p.bullet}',
        wobble: { amplitude: ${n(p.amplitude)}, frequency: ${n(p.frequency)} },
      }));
    }));
  }`,
  },
};

function newBlock(type) {
  return { type, on: true, params: Object.fromEntries(BLOCKS[type].params.map((p) => [p.key, p.value])) };
}

// The whole pattern file, from the blocks.
function generate(name, design) {
  const parts = design.blocks.filter((b) => b.on).map((b) => `  // ${BLOCKS[b.type].label}\n  ${BLOCKS[b.type].code(b.params)}`);
  return [
    `// ${name}: an attack pattern made in the Ruins Studio Pattern Lab (tools/).`,
    `// Enemies use it by name, e.g. { name: '${name}', weight: 2 } in their patterns.`,
    `// studio-blocks: ${JSON.stringify(design)}`,
    `export default function ${name}(box, density, { Shot, Pillar, every, rand, pick, clamp }) {`,
    '  const emitters = [];',
    '',
    parts.join('\n\n') || '  // (no blocks yet)',
    '',
    '  return {',
    `    duration: ${n(design.duration)},`,
    '    update(dt, bullets, soul) {',
    '      for (const emit of emitters) emit(dt, bullets, soul);',
    '    },',
    '  };',
    '}',
    '',
  ].join('\n');
}

// Turns pattern source (a module with `export default`, or a bare function) into a factory.
function compile(code) {
  const body = /export\s+default\s+/.test(code) ? code.replace(/export\s+default\s+/, 'return ') : `return (${code.trim().replace(/;+\s*$/, '')});`;
  // eslint-disable-next-line no-new-func
  const factory = new Function(`"use strict";\n${body}`)();
  if (typeof factory !== 'function') throw new Error('The code must be a function: (box, density, tools) => ({ duration, update })');
  return factory;
}

export async function mount(root, studio) {
  let patterns = await loadPatterns();
  const { bullets: game } = patterns;
  const TOOLS = game.PATTERN_TOOLS;
  const SIZES = game.SHOT_SIZES ?? ['small', 'puff', 'yarn', 'dust', 'ember'];
  let box = { ...FALLBACK_BOX };
  try { box = { ...(await import('../src/battle/hud.js')).BOX }; } catch { /* use the copy */ }

  let mode = 'try';
  let tryName = patterns.builtin[0];
  let design = { duration: 6, blocks: [newBlock('rain'), newBlock('aimed')] };
  let name = 'myPattern';
  let editingSaved = null; // name of the saved pattern being edited
  let handCode = null; // code typed by hand (Advanced), replaces the blocks
  const difficulty = { density: 1, speed: 1 };
  let pattern = null;
  let bullets = [];
  let time = 0;
  let hits = 0;
  let grazes = 0;
  let paused = false;
  let soul = null;
  let message = '';
  const held = new Set();
  const pressed = new Set();
  const input = { isDown: (k) => held.has(k), wasPressed: (k) => pressed.has(k) };

  const bulletSprites = Object.fromEntries(SIZES.map((size) => {
    try { return [size, new TOOLS.Shot({ x: 0, y: 0, size }).sprite]; } catch { return [size, null]; }
  }));

  // --- Layout ---
  const canvas = pixelCanvas((box.w + MARGIN * 2) * SCALE, (box.h + MARGIN * 2) * SCALE, { tabindex: 0, tip: 'Arrow keys or WASD move your soul' });
  const stats = el('div', { class: 'lab-stats' });
  const messageBox = el('div', { class: 'notice warn', hidden: true });
  const pauseButton = btn('pause', 'Pause', () => setPaused(!paused), { kind: 'ghost' });
  const stageCol = el('div', { class: 'lab-stage' },
    canvas, stats,
    el('div', { class: 'row' }, btn('loop', 'Restart', () => restart(), { kind: 'ghost', key: 'R' }), pauseButton),
    el('div', { style: 'width:100%;max-width:400px' },
      slider({ label: 'Bullets', min: 0.3, max: 1.5, step: 0.05, value: 1, format: (v) => `${Math.round(v * 100)}%`, onInput: (v) => { difficulty.density = v; }, onChange: () => restart(), tip: 'How an enemy\'s "density" thins the bullets out' }),
      slider({ label: 'Bullet speed', min: 0.3, max: 1.5, step: 0.05, value: 1, format: (v) => `${Math.round(v * 100)}%`, onInput: (v) => { difficulty.speed = v; }, onChange: () => restart() }),
      hint('Arrow keys or WASD move your soul; hold X to move slowly. Bullets touching the centre of the heart hurt; near misses graze.')),
    messageBox);
  const modeSwitch = segmented([['try', 'Try a pattern', 'play'], ['build', 'Build your own', 'wand']], mode, (v) => setMode(v));
  const side = el('div', { class: 'grow', style: 'min-width:340px;max-width:720px' });
  root.append(el('div', { class: 'home', style: 'flex:1;overflow-y:auto' },
    el('div', { class: 'lab' }, stageCol, el('div', { class: 'grow', style: 'min-width:340px;max-width:720px' }, el('div', { style: 'margin-bottom:18px' }, modeSwitch), side))));

  // --- Keyboard ---
  window.addEventListener('keydown', (e) => {
    if (!studio.isActive() || isTyping(e) || document.querySelector('.overlay')) return;
    if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) { restart(); return; }
    if (!KEYS[e.code] || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    if (!held.has(KEYS[e.code])) pressed.add(KEYS[e.code]);
    held.add(KEYS[e.code]);
  });
  window.addEventListener('keyup', (e) => { if (KEYS[e.code]) held.delete(KEYS[e.code]); });
  window.addEventListener('blur', () => held.clear());

  // --- Modes ---
  function setMode(next) {
    mode = next;
    modeSwitch.set(next);
    studio.setFile(mode === 'build' ? `src/data/patterns/${name}.js${editingSaved === name ? '' : ' (new)'}` : null);
    renderSide();
    restart();
  }

  function renderSide() {
    if (mode === 'try') renderTry();
    else renderBuild();
  }

  function renderTry() {
    const pill = (pname, custom) => el('button', {
      type: 'button', class: `pattern-pill${pname === tryName ? ' active' : ''}`,
      onclick: () => { tryName = pname; renderTry(); restart(); },
    }, pname, el('small', {}, custom ? 'Made in the Pattern Lab' : PATTERN_INFO[pname] ?? ''));
    const customNames = Object.keys(patterns.custom);
    setChildren(side,
      section('Built into the game', el('div', { class: 'pattern-list' }, patterns.builtin.map((p) => pill(p, false)))),
      section('Made in the Pattern Lab', customNames.length
        ? [el('div', { class: 'pattern-list' }, customNames.map((p) => pill(p, true))),
          customNames.includes(tryName) ? el('div', { class: 'row', style: 'margin-top:10px' }, btn('pencil', `Change "${tryName}"`, () => editSaved(tryName), { kind: 'ghost' })) : null]
        : hint('None yet. Switch to "Build your own" to make one.')));
  }

  async function editSaved(pname) {
    const source = await readText(`src/data/patterns/${pname}.js`);
    const saved = source.match(/^\/\/ studio-blocks: (.*)$/m);
    if (saved) {
      try {
        design = JSON.parse(saved[1]);
        handCode = null;
      } catch {
        handCode = source;
      }
    } else {
      handCode = source;
      document.body.classList.contains('advanced') || toast('This pattern was written as code, so it opens in Advanced mode.', { kind: 'info' });
    }
    name = pname;
    editingSaved = pname;
    studio.setDirty(false);
    setMode('build');
  }

  // --- Build mode ---
  const blockList = el('div');
  const codeArea = el('textarea', { class: 'code', rows: 22, spellcheck: 'false' });
  codeArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); useHandCode(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b, value } = codeArea;
      codeArea.value = `${value.slice(0, a)}  ${value.slice(b)}`;
      codeArea.selectionStart = codeArea.selectionEnd = a + 2;
    }
  });
  function useHandCode() {
    handCode = codeArea.value;
    studio.setDirty(true);
    renderBuild();
    restart();
  }

  function currentCode() {
    return handCode ?? generate(name, design);
  }

  function renderBuild() {
    const nameInput = el('input', {
      type: 'text', value: name,
      onchange: (e) => {
        const next = camelCase(e.target.value) || 'myPattern';
        name = /^[a-z]/i.test(next) ? next : `p${next}`;
        e.target.value = name;
        studio.setDirty(true);
        studio.setFile(`src/data/patterns/${name}.js${editingSaved === name ? '' : ' (new)'}`);
        renderCode();
      },
    });
    setChildren(side,
      el('div', { class: 'row', style: 'align-items:flex-end;gap:14px;margin-bottom:6px' },
        el('div', { class: 'grow' }, field('Pattern name', nameInput, 'Enemies pick it by this name.')),
        el('div', { style: 'width:220px' }, slider({ label: 'How long', min: 3, max: 12, step: 0.5, value: design.duration, format: (v) => `${v} seconds`, onInput: (v) => { design.duration = v; studio.setDirty(true); renderCode(); }, onChange: () => restart() }))),
      handCode !== null
        ? el('div', { class: 'notice warn' }, icon('code', 16), el('span', { class: 'grow' }, 'This pattern is written as code (see Advanced), so the blocks are off.'),
          btn('wand', 'Use blocks instead', async () => {
            if (!(await confirmBox('Use blocks', 'Throw away the hand-written code and go back to blocks?', 'Use blocks', 'danger'))) return;
            handCode = null;
            studio.setDirty(true);
            renderBuild();
            restart();
          }, { kind: 'ghost' }))
        : [blockList, btn('plus', 'Add a block', (e) => popupMenu(e.currentTarget, Object.entries(BLOCKS).map(([type, b]) => ({
          icon: 'pattern', label: b.label, hint: b.text,
          onClick: () => { design.blocks.push(newBlock(type)); studio.setDirty(true); renderBlocks(); hotSwap(); },
        }))), { kind: 'primary' }),
        hint('Blocks all run at once. Drag the sliders and watch the box: it updates as you go.')],
      el('div', { class: 'adv', style: 'margin-top:22px' },
        section('Code', hint(handCode !== null ? 'Edit, then press Run (Ctrl+Enter).' : 'Made from your blocks. Edit it and press Run to write it by hand instead.'),
          codeArea,
          el('div', { class: 'row', style: 'margin-top:8px' }, btn('play', 'Run', useHandCode, { kind: 'ghost', key: 'Ctrl+Enter' })))));
    if (handCode === null) renderBlocks();
    renderCode();
  }

  function renderCode() {
    if (document.activeElement !== codeArea) codeArea.value = currentCode();
  }

  function renderBlocks() {
    setChildren(blockList, design.blocks.length ? design.blocks.map((block, i) => {
      const info = BLOCKS[block.type];
      const body = info.params.map((p) => {
        if (p.type === 'bullet') {
          return el('div', { class: 'full' }, el('span', { class: 'field-label' }, 'Bullet'),
            el('div', { class: 'bullet-pick' }, SIZES.filter((s) => bulletSprites[s]).map((size) => el('button', {
              type: 'button', class: block.params.bullet === size ? 'active' : '', tip: friendly(size),
              onclick: () => { block.params.bullet = size; studio.setDirty(true); renderBlocks(); hotSwap(); },
            }, thumbnail(bulletSprites[size], 28, 2)))));
        }
        if (p.type === 'choice') {
          return el('div', { class: 'full', style: 'margin-bottom:12px' }, el('div', { class: 'field-label', style: 'margin-bottom:4px' }, p.label),
            segmented(p.options, block.params[p.key], (v) => { block.params[p.key] = v; studio.setDirty(true); hotSwap(); }, { small: true }));
        }
        return slider({
          label: p.label, min: p.min, max: p.max, step: p.step, value: block.params[p.key], format: p.format ?? ((v) => String(v)),
          onInput: (v) => { block.params[p.key] = v; studio.setDirty(true); hotSwap(); },
        });
      });
      return el('div', { class: `block${block.on ? '' : ' off'}` },
        el('div', { class: 'block-head' }, icon('pattern', 18), el('span', { class: 'block-title' }, info.label),
          btn(block.on ? 'eye' : 'close', block.on ? 'Turn off' : 'Turn on', () => { block.on = !block.on; studio.setDirty(true); renderBlocks(); hotSwap(); }, { iconOnly: true, kind: 'ghost', title: block.on ? 'Switch this block off for a moment' : 'Switch it back on' }),
          btn('copy', 'Duplicate', () => { design.blocks.splice(i + 1, 0, deepClone(block)); studio.setDirty(true); renderBlocks(); hotSwap(); }, { iconOnly: true, kind: 'ghost' }),
          btn('trash', 'Remove', () => { design.blocks.splice(i, 1); studio.setDirty(true); renderBlocks(); hotSwap(); }, { iconOnly: true, kind: 'ghost danger' })),
        el('div', { class: 'block-body' }, el('p', { class: 'hint full', style: 'margin-top:0' }, info.text), body));
    }) : el('div', { class: 'empty', style: 'padding:24px' }, icon('pattern', 36), el('h3', {}, 'No blocks yet'), el('p', {}, 'Add a block to start spraying bullets.')));
  }

  // --- Running ---
  function build() {
    if (mode === 'try') return makePattern(patterns, tryName, box, difficulty);
    return wrapFactory(compile(currentCode()), box, difficulty, TOOLS);
  }

  function resetSoul(modeName) {
    const m = SOUL_MODES[modeName] ? modeName : 'normal';
    soul = { x: box.x + box.w / 2, y: m === 'normal' ? box.y + box.h / 2 : box.y + box.h - SOUL_INSET, vy: 0, grounded: false, focused: false, modeName: m, mode: SOUL_MODES[m], iframes: 0 };
  }

  function showMessage(text) {
    message = text;
    messageBox.hidden = !text;
    setChildren(messageBox, icon('warn', 16), el('span', {}, text));
  }

  function restart() {
    bullets = [];
    time = 0;
    hits = 0;
    grazes = 0;
    showMessage('');
    try {
      pattern = build();
      resetSoul(pattern.mode ?? 'normal');
      setPaused(false);
    } catch (error) {
      fail(error);
    }
    if (mode === 'build') renderCode();
  }

  // Swaps in the new settings without clearing the box, so slider drags feel live.
  function hotSwap() {
    renderCode();
    try {
      const next = build();
      pattern = next;
      if (!soul) resetSoul('normal');
      showMessage('');
      if (paused && message === '') setPaused(false);
    } catch (error) {
      fail(error);
    }
  }

  function setPaused(value) {
    paused = value;
    setChildren(pauseButton, icon(paused ? 'play' : 'pause', 18), el('span', {}, paused ? 'Resume' : 'Pause'));
  }

  function fail(error) {
    console.warn('Pattern Lab:', error);
    const tip = /width|sprite/i.test(error.message) ? ' (Probably a bullet type that does not exist.)' : '';
    showMessage(`This pattern has a problem: ${error.message}${tip}`);
    pattern = null;
    setPaused(true);
  }

  function step(dt) {
    soul.iframes = Math.max(0, soul.iframes - dt);
    soul.mode.update(soul, dt, input, box);
    soul.x = TOOLS.clamp(soul.x, box.x + SOUL_INSET, box.x + box.w - SOUL_INSET);
    soul.y = TOOLS.clamp(soul.y, box.y + SOUL_INSET, box.y + box.h - SOUL_INSET);
    pressed.clear();
    pattern.update(dt, bullets, soul);
    for (const b of bullets) b.update(dt, box);
    bullets = bullets.filter((b) => !b.isGone(box));
    for (const b of bullets) {
      const gap = b.edgeDistance(soul.x, soul.y);
      if (gap < SOUL_RADIUS) {
        if (soul.iframes <= 0) { hits++; soul.iframes = IFRAME_SECONDS; }
      } else if (gap < GRAZE_RADIUS && !b.labGrazed && soul.iframes <= 0) {
        b.labGrazed = true;
        grazes++;
      }
    }
    time += dt;
    if (time >= pattern.duration) restart();
  }

  function draw() {
    const view = { x: box.x - MARGIN, y: box.y - MARGIN, w: box.w + MARGIN * 2, h: box.h + MARGIN * 2 };
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0b0614';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(SCALE, 0, 0, SCALE, -view.x * SCALE, -view.y * SCALE);
    ctx.fillStyle = '#000';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    for (const b of bullets) b.draw(ctx);
    ctx.fillStyle = 'rgba(11, 6, 20, 0.7)';
    ctx.fillRect(view.x, view.y, view.w, box.y - view.y);
    ctx.fillRect(view.x, box.y + box.h, view.w, view.y + view.h - box.y - box.h);
    ctx.fillRect(view.x, box.y, box.x - view.x, box.h);
    ctx.fillRect(box.x + box.w, box.y, view.x + view.w - box.x - box.w, box.h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const toScreen = (x, y) => ({ x: (x - view.x) * SCALE, y: (y - view.y) * SCALE });
    const corner = toScreen(box.x, box.y);
    const border = (3 / 2) * SCALE;
    ctx.strokeStyle = '#35d46c';
    ctx.lineWidth = border;
    ctx.strokeRect(corner.x - border / 2, corner.y - border / 2, box.w * SCALE + border, box.h * SCALE + border);
    if (soul && !(soul.iframes > 0 && Math.floor(soul.iframes * 12) % 2 === 0)) {
      const sprite = soulSprite(soul.modeName);
      const k = SCALE / 2;
      const p = toScreen(soul.x, soul.y);
      ctx.drawImage(sprite, Math.round(p.x - SOUL_CENTER.x * k), Math.round(p.y - SOUL_CENTER.y * k), sprite.width * k, sprite.height * k);
    }
  }

  function renderStats() {
    const duration = pattern ? pattern.duration : 0;
    setChildren(stats,
      el('span', {}, 'Time ', el('b', {}, `${time.toFixed(1)} / ${Number(duration).toFixed(1)}s`)),
      el('span', {}, 'Bullets ', el('b', {}, String(bullets.length))),
      el('span', {}, 'Hits ', el('b', {}, String(hits))),
      el('span', {}, 'Grazes ', el('b', {}, String(grazes))),
      soul && soul.modeName !== 'normal' ? el('span', {}, 'Soul ', el('b', {}, soul.modeName)) : null);
  }

  let last = performance.now();
  let statTimer = 0;
  (function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(MAX_DT, (now - last) / 1000));
    last = now;
    if (!studio.isActive()) return;
    if (!paused && pattern && soul) {
      try { step(dt); } catch (error) { bullets = []; fail(error); }
    }
    try { draw(); } catch (error) { bullets = []; fail(error); }
    statTimer -= dt;
    if (statTimer <= 0) { statTimer = 0.1; renderStats(); }
  })(performance.now());

  // --- Saving ---
  async function getFiles() {
    if (mode !== 'build') throw new Error('Saving makes a pattern of your own: switch to "Build your own" first. (Built-in patterns live in the game\'s code.)');
    if (!isIdentifier(name)) throw new Error('The pattern name must be letters and numbers.');
    if (patterns.builtin.includes(name)) throw new Error(`"${name}" is already a built-in pattern. Pick another name.`);
    if (handCode === null && !design.blocks.some((b) => b.on)) throw new Error('Add a block (or switch one on) first.');
    try { wrapFactory(compile(currentCode()), box, difficulty, TOOLS); } catch (error) { throw new Error(`The pattern has a problem: ${error.message}`); }
    const existing = (await listDir('src/data/patterns')) ?? [];
    if (existing.includes(`${name}.js`) && editingSaved !== name) {
      if (!(await confirmBox('Replace pattern', `There's already a pattern called "${name}". Replace it?`, 'Replace', 'danger'))) throw new Error('Not saved.');
    }
    let content = currentCode();
    if (!/export\s+default/.test(content)) content = `// ${name}: written in the Ruins Studio Pattern Lab (tools/).\nexport default ${content.trim().replace(/;+\s*$/, '')};\n`;
    return [{ path: `src/data/patterns/${name}.js`, content }];
  }

  async function afterSave() {
    editingSaved = name;
    studio.setDirty(false);
    studio.setFile(`src/data/patterns/${name}.js`);
    patterns = await loadPatterns(true);
  }

  setMode('try');
  return { getFiles, afterSave };
}
