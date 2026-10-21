import { makeSprite } from '../src/engine/sprite.js';
import { BACKDROPS } from '../src/battle/backdrops.js';
import { loadEnemies, loadEnemyArt, loadPatterns, makePattern, loadRooms, roomFiles, enemySprite, PATTERN_INFO } from './library.js';
import { listDir, readText } from './api.js';
import { loadOrder } from './order.js';
import { quote, inline } from './source.js';
import { parseTextFile, normaliseBody } from './textfile.js';
import { T, TILES, renderTiles, drawThings, editableRoom, roomModule, roomHeader } from './rooms.js';
import {
  el, setChildren, icon, btn, hint, field, select, optionNodes, slider, segmented, confirmBox, pixelCanvas, thumbnail,
  deepClone, snakeCase, constCase, friendly, codeView, toast, checkbox,
} from './ui.js';

// Enemy Maker: a step-by-step wizard for a new foe (or changing an old one).
// Saves src/data/enemies/<id>.js and text/enemies/<id>.txt, and can drop the
// enemy into a room.

const STEPS = ['Look', 'Stats', 'Attacks', 'Talk', 'Words', 'Save'];
const PRESETS = {
  easy: { maxHp: 80, damage: 5, density: 0.8, speed: 0.85, exp: 25, coins: 15 },
  normal: { maxHp: 120, damage: 6, density: 0.95, speed: 0.9, exp: 45, coins: 30 },
  hard: { maxHp: 180, damage: 8, density: 1.1, speed: 1.05, exp: 70, coins: 50 },
};
const HOW_OFTEN = [[0, 'Off'], [1, 'Rarely'], [2, 'Sometimes'], [3, 'Often']];
const PREVIEW_BOX = { x: 120, y: 44, w: 80, h: 80 };
// The game refuses to fight an enemy with fewer attacks than this (MIN_ATTACKS
// in src/battle/battleScene.js).
const MIN_ATTACKS = 3;
const WORDS = [
  ['intro', 'When the fight starts', 'The first thing the player reads.'],
  ['flavor', 'Each turn', 'One is shown at the start of each of your turns, in order. Leave an empty line between them.'],
  ['taunts', 'Taunts', 'Said in a speech bubble before each attack, picked at random. Empty line between them.'],
  ['victory', 'When it is beaten', 'The rewards line is added by the game.'],
  ['pacified', 'When it is spared', 'Shown when Mercy reaches 100% and you spare it.'],
];

function defaultWords(name) {
  return {
    intro: `${name} blocks the way!`,
    flavor: `${name} is sizing you up.\n\n${name} hums to itself.\n\nThe air smells like dust and candle wax.`,
    taunts: 'You can\'t get past me!\n\nHee hee!\n\nTry and dodge THIS!',
    victory: `${name} was defeated!`,
    pacified: `${name} doesn't want to fight anymore.`,
  };
}
function defaultActs(name, hp) {
  return [
    { name: 'Inspect', calm: 0, text: `${name} - HP ${hp}\nA strange creature from the Ruins.` },
    { name: 'Chat', calm: 30, text: `You chat with ${name}. It seems to relax a little.` },
    { name: 'Compliment', calm: 35, text: `You tell ${name} it looks great today. It blushes.` },
    { name: 'Hum', calm: 40, text: `You hum a calm tune. ${name} sways along.` },
  ];
}

function blankForm() {
  const name = 'NEW FOE';
  return {
    isNew: true,
    id: '',
    constName: '',
    textFile: '',
    name,
    art: null, // { file, base }
    ...PRESETS.normal,
    boss: false,
    kept: {},
    patterns: {},
    acts: defaultActs(name, PRESETS.normal.maxHp).map((a) => ({ ...a, edited: false })),
    words: defaultWords(name),
    edited: {},
    place: { on: false, room: null, x: null, y: null, walk: 2 },
  };
}

// Settings the Enemy Maker has no controls for yet, carried over untouched
// when you open and save an enemy (so saving Taper keeps her own battle song,
// her `gentle` attacks, her `secondWind`, her `lullCalm`, her `beatenSprite`
// and any item drops). `area` and `home` say where an enemy not yet placed in
// a room belongs, for the Studio's area headings (tools/order.js).
const KEPT_FIELDS = ['gentle', 'music', 'secondWind', 'introCard', 'drops', 'materials', 'lullCalm', 'noMercy', 'gait', 'beatenSprite', 'backdrop', 'area', 'home', 'disguise'];

// The enemy module, in the same shape as the game's own enemy files.
function enemyModule(f, id, constName) {
  const patterns = Object.entries(f.patterns).filter(([, w]) => w > 0).map(([name, weight]) => `    ${inline({ name, weight })},`);
  const talk = f.acts.map(({ name, calm }) => `    ${inline(calm ? { name, calm } : { name })},`);
  const lines = [
    `import { ${f.art.base}_PALETTE, ${f.art.base}_SPRITE } from '../art/${f.art.file}';`,
    '',
    `// The ${f.name}'s numbers. Everything it says is in text/${f.textFile || `enemies/${id}.txt`}.`,
    "// Made in the Nobody's Hero Studio Enemy Maker (tools/).",
    `export const ${constName} = {`,
    `  name: ${quote(f.name)},`,
    `  textFile: ${quote(f.textFile || `enemies/${id}.txt`)},`,
    `  sprite: { rows: ${f.art.base}_SPRITE, palette: ${f.art.base}_PALETTE },`,
    `  maxHp: ${f.maxHp},`,
    `  damage: ${f.damage},`,
    '',
    '  // Fewer bullets (density) that fly slower (speed). 1 is full strength.',
    `  difficulty: { density: ${f.density}, speed: ${f.speed} },`,
    '',
    '  // Each enemy turn picks one at random (never the same twice in a row).',
    '  // Higher weight = more likely.',
    '  patterns: [',
    ...patterns,
    '  ],',
    '',
    '  // TALK options. Each name has a [talk: Name] section in the text file.',
    '  // `calm` raises the MERCY meter; at 100% the enemy can be spared.',
    '  talk: [',
    ...talk,
    '  ],',
    '',
    `  rewards: { exp: ${f.exp}, coins: ${f.coins} },`,
  ];
  if (f.boss) lines.push('', '  // A boss: its attacks may change how the soul moves.', '  boss: true,');
  const kept = Object.entries(f.kept ?? {});
  if (kept.length) lines.push('', '  // Set by hand in this file (the Enemy Maker keeps them as they are).', ...kept.map(([key, value]) => `  ${key}: ${inline(value)},`));
  lines.push('};');
  return `${lines.join('\n')}\n`;
}

function enemyText(f, id) {
  const body = (text, fallback) => normaliseBody(text) || fallback;
  const lines = [
    `# ${f.name}`,
    `# Numbers (HP, damage, how much Mercy each TALK option gives) live in`,
    `# src/data/enemies/${id}.js.`,
    '',
    '[intro]',
    body(f.words.intro, `${f.name} appears!`),
    '',
    '# Shown at the start of each of your turns, in order, then repeating.',
    '[flavor]',
    body(f.words.flavor, `${f.name} is watching you.`),
    '',
    '# Said in a speech bubble before each attack, picked at random.',
    '[taunts]',
    body(f.words.taunts, 'Here I come!'),
    '',
    `# One section per TALK option. The names after "talk:" must match src/data/enemies/${id}.js.`,
    f.acts.map((a) => `[talk: ${a.name}]\n${body(a.text, `You try ${a.name.toLowerCase()}.`)}`).join('\n\n'),
    '',
    '# How the fight ends. The rewards line is added automatically.',
    '[victory]',
    body(f.words.victory, `${f.name} was defeated!`),
    '',
    '[pacified]',
    body(f.words.pacified, `${f.name} was spared.`),
  ];
  return `${lines.join('\n')}\n`;
}

export async function mount(root, studio) {
  let enemies = await loadEnemies();
  let art = await loadEnemyArt();
  let patterns = await loadPatterns();
  let rooms = await loadRooms();
  // Lists under area headings, in the order the player meets things.
  let order = await loadOrder();
  const enemySprites = () => Object.fromEntries(Object.entries(enemies).map(([id, info]) => [id, enemySprite(info.enemy)]));
  const allPatterns = () => [...patterns.builtin, ...Object.keys(patterns.custom)];
  const modeOf = {};
  const patternMode = (name) => {
    if (!(name in modeOf)) {
      try { modeOf[name] = makePattern(patterns, name, PREVIEW_BOX).mode ?? 'normal'; } catch { modeOf[name] = 'normal'; }
    }
    return modeOf[name];
  };

  let form = blankForm();
  let step = 0;
  let previewSprite = null;

  // --- Layout ---
  const battle = pixelCanvas(640, 328);
  const summary = el('div');
  const openSelect = el('select', { onchange: (e) => openEnemy(e.target.value) });
  const previewCol = el('aside', { class: 'wizard-preview' },
    el('div', { class: 'row' }, openSelect, btn('plus', 'New enemy', () => newEnemy(), { kind: 'ghost' })),
    el('div', { class: 'battle-view' }, battle),
    el('p', { class: 'hint', style: 'margin-top:-6px;text-align:center' }, 'Battle size'),
    summary);
  const stepsBar = el('div', { class: 'steps' });
  const body = el('div', { class: 'step-body' });
  const nav = el('div', { class: 'step-nav' });
  root.append(el('div', { class: 'wizard' }, previewCol, el('div', { class: 'wizard-main' }, stepsBar, body, nav)));

  const changed = () => {
    studio.setDirty(true);
    studio.setFile(`src/data/enemies/${idFor()}.js${form.isNew ? ' (new)' : ''}`);
    renderSummary();
  };

  // --- Opening ---
  function renderOpen() {
    setChildren(openSelect,
      form.isNew ? el('option', { value: '' }, 'New enemy') : null,
      optionNodes(order.options('enemies', Object.keys(enemies), (id) => friendly(enemies[id].enemy.name))));
    openSelect.value = form.isNew ? '' : form.id;
  }

  async function okToLeave() {
    if (!studio.isDirty()) return true;
    return confirmBox('Unsaved changes', `${friendly(form.name)} has changes that aren't saved. Throw them away?`, 'Throw away', 'danger');
  }

  async function newEnemy() {
    if (!(await okToLeave())) { renderOpen(); return; }
    form = blankForm();
    step = 0;
    studio.setDirty(false);
    refresh();
  }

  async function openEnemy(id) {
    if (!id || (!form.isNew && id === form.id)) return;
    if (!(await okToLeave())) { renderOpen(); return; }
    const info = enemies[id];
    const e = info.enemy;
    const text = parseTextFile(await readText(`text/${e.textFile}`));
    const words = (key) => (text[key] ?? []).join('\n\n');
    const artEntry = art.find((a) => a.file === info.artFile && a.base === info.artBase)
      ?? art.find((a) => JSON.stringify(a.rows) === JSON.stringify(e.sprite.rows));
    form = {
      isNew: false,
      id,
      constName: info.constName,
      textFile: e.textFile,
      name: e.name,
      art: artEntry ? { file: artEntry.file, base: artEntry.base } : null,
      maxHp: e.maxHp,
      damage: e.damage,
      density: e.difficulty?.density ?? 1,
      speed: e.difficulty?.speed ?? 1,
      exp: e.rewards?.exp ?? 0,
      coins: e.rewards?.coins ?? 0,
      boss: Boolean(e.boss),
      kept: Object.fromEntries(KEPT_FIELDS.filter((key) => e[key] !== undefined).map((key) => [key, e[key]])),
      patterns: Object.fromEntries(e.patterns.map((p) => [p.name, p.weight ?? 1])),
      acts: e.talk.map((t) => ({ name: t.name, calm: t.calm ?? 0, text: words(`talk: ${t.name}`), edited: true })),
      words: Object.fromEntries(WORDS.map(([key]) => [key, words(key)])),
      edited: Object.fromEntries(WORDS.map(([key]) => [key, true])),
      place: { on: false, room: null, x: null, y: null, walk: 2 },
    };
    studio.setDirty(false);
    refresh();
  }

  // --- Preview ---
  function updateSprite() {
    const entry = form.art && art.find((a) => a.file === form.art.file && a.base === form.art.base);
    previewSprite = entry ? makeSprite(entry.rows, entry.palette) : null;
  }

  (function drawBattle(now) {
    requestAnimationFrame(drawBattle);
    if (!studio.isActive()) return;
    const ctx = battle.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    try { (BACKDROPS.ruins ?? Object.values(BACKDROPS)[0])(ctx, now / 1000, 164); } catch { ctx.fillStyle = '#0b0614'; ctx.fillRect(0, 0, 320, 164); }
    if (previewSprite) {
      const bob = Math.round(Math.sin(now / 1000 * 2.5) * 2);
      const w = previewSprite.width * 2;
      const h = previewSprite.height * 2;
      ctx.drawImage(previewSprite, Math.round(160 - w / 2), Math.round(118 - h) + bob, w, h);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '16px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Pick a look in step 1', 160, 90);
      ctx.textAlign = 'left';
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Name, HP and Mercy like the battle HUD.
    ctx.font = '26px VT323, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(form.name, 320, 278);
    ctx.fillStyle = '#3a1020';
    ctx.fillRect(220, 288, 200, 10);
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(220, 288, 200, 10);
    ctx.fillStyle = '#ff8c1a';
    ctx.fillRect(220, 304, 200, 8);
    ctx.fillStyle = '#5a2c0a';
    ctx.fillRect(221, 305, 198, 6);
    ctx.font = '18px VT323, monospace';
    ctx.fillStyle = '#ffe14d';
    ctx.textAlign = 'left';
    ctx.fillText(`HP ${form.maxHp}`, 430, 297);
    ctx.fillStyle = '#ff8c1a';
    ctx.fillText('MERCY', 430, 313);
  })(performance.now());

  function renderSummary() {
    const on = Object.entries(form.patterns).filter(([, w]) => w > 0).map(([n]) => n);
    const mercy = form.acts.reduce((m, a) => Math.max(m, a.calm), 0);
    setChildren(summary, el('dl', { class: 'summary' },
      el('dt', {}, 'HP'), el('dd', {}, String(form.maxHp)),
      el('dt', {}, 'Hits for'), el('dd', {}, `${form.damage} damage`),
      el('dt', {}, 'Attacks'), el('dd', {}, on.length ? on.join(', ') : 'none yet'),
      el('dt', {}, 'Talk'), el('dd', {}, `${form.acts.length} options${mercy ? '' : ' (none give Mercy!)'}`),
      el('dt', {}, 'Rewards'), el('dd', {}, `${form.exp} EXP, ${form.coins} coins`)));
  }

  // --- Steps ---
  function renderSteps() {
    const items = [];
    STEPS.forEach((label, i) => {
      if (i) items.push(el('span', { class: 'step-line' }));
      items.push(el('button', {
        type: 'button', class: `step-dot${i === step ? ' active' : i < step ? ' done' : ''}`,
        onclick: () => go(i),
      }, el('span', { class: 'num' }, i < step ? '✓' : String(i + 1)), el('span', {}, label)));
    });
    setChildren(stepsBar, items);
    setChildren(nav,
      step > 0 ? btn('back', 'Back', () => go(step - 1), { kind: 'ghost' }) : el('span'),
      step < STEPS.length - 1 ? btn('next', `Next: ${STEPS[step + 1]}`, () => go(step + 1), { kind: 'primary' }) : el('span'));
  }

  function go(i) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    hovered = null;
    renderSteps();
    renderStep();
    body.scrollTop = 0;
  }

  function renderStep() {
    [stepLook, stepStats, stepAttacks, stepTalk, stepWords, stepSave][step]();
  }

  // Keeps untouched default words in step with the name.
  function rename(name) {
    const old = form.name;
    form.name = name;
    const defaults = defaultWords(name);
    for (const [key] of WORDS) if (!form.edited[key]) form.words[key] = defaults[key];
    const acts = defaultActs(name, form.maxHp);
    for (const act of form.acts) {
      const d = acts.find((a) => a.name === act.name);
      if (d && !act.edited) act.text = d.text;
      else if (!act.edited) act.text = act.text.split(old).join(name);
    }
  }

  // 1: Look
  function stepLook() {
    const nameInput = el('input', {
      type: 'text', value: friendly(form.name), style: 'font-size:18px;max-width:420px',
      oninput: (e) => { rename(e.target.value.trim().toUpperCase() || 'NEW FOE'); changed(); },
    });
    // Pictures under their enemy's area heading; any others after.
    const artPlace = (a) => {
      const owner = Object.keys(enemies).find((id) => enemies[id].artFile === a.file && enemies[id].artBase === a.base)
        ?? Object.keys(enemies).find((id) => enemies[id].artFile === a.file);
      return owner ? order.where('enemies', owner) : null;
    };
    const keyOf = (a) => `${a.file}:${a.base}`;
    const artByKey = Object.fromEntries(art.map((a) => [keyOf(a), a]));
    const artGroups = order.groups('enemies', art.map(keyOf), { placeOf: (key) => artPlace(artByKey[key]), fallback: 'Other pictures' });
    const card = (a) => {
      const active = form.art && form.art.file === a.file && form.art.base === a.base;
      return el('button', {
        type: 'button', class: `art-card${active ? ' active' : ''}`,
        onclick: () => { form.art = { file: a.file, base: a.base }; updateSprite(); changed(); stepLook(); },
        tip: `src/data/art/${a.file}`,
      }, el('span', { class: 'thumb-box' }, thumbnail(makeSprite(a.rows, a.palette), 64)), el('span', {}, a.label));
    };
    setChildren(body,
      el('h2', {}, 'What does it look like?'),
      hint('Give it a name and pick a picture, or draw a brand new one.'),
      field('Name', nameInput),
      el('div', { class: 'art-grid' },
        el('button', {
          type: 'button', class: 'art-card new',
          onclick: () => studio.open('sprites', { type: 'new', preset: 'enemy', name: friendly(form.name), returnTo: 'enemies' }),
        }, el('span', { class: 'thumb-box' }, icon('pencil', 36)), el('span', {}, 'Draw a new one'))),
      artGroups.map(({ group, ids }) => [
        el('h3', { style: 'margin:18px 0 8px' }, group),
        el('div', { class: 'art-grid' }, ids.map((key) => card(artByKey[key])))]));
  }

  // 2: Stats
  function stepStats() {
    const presetOf = Object.entries(PRESETS).find(([, p]) => Object.entries(p).every(([k, v]) => form[k] === v))?.[0] ?? '';
    const set = (key) => (v) => { form[key] = v; changed(); };
    setChildren(body,
      el('h2', {}, 'How tough is it?'),
      hint('Pick a starting point, then fine-tune with the sliders.'),
      el('div', { style: 'margin-bottom:20px' }, segmented([['easy', 'Easy'], ['normal', 'Normal'], ['hard', 'Hard']], presetOf, (v) => {
        Object.assign(form, PRESETS[v]);
        for (const act of form.acts) if (act.name === 'Inspect' && !act.edited) act.text = defaultActs(form.name, form.maxHp)[0].text;
        changed();
        stepStats();
      })),
      el('div', { class: 'words', style: 'grid-template-columns:repeat(auto-fill,minmax(260px,1fr));column-gap:28px' },
        slider({ label: 'HP', min: 20, max: 400, step: 5, value: form.maxHp, onInput: (v) => { set('maxHp')(v); for (const act of form.acts) if (act.name === 'Inspect' && !act.edited) act.text = defaultActs(form.name, v)[0].text; } }),
        slider({ label: 'Damage per hit', min: 1, max: 20, value: form.damage, onInput: set('damage') }),
        slider({ label: 'How many bullets', min: 0.5, max: 1.5, step: 0.05, value: form.density, format: (v) => `${Math.round(v * 100)}%`, onInput: set('density'), tip: 'Below 100% its attacks have fewer bullets' }),
        slider({ label: 'Bullet speed', min: 0.5, max: 1.5, step: 0.05, value: form.speed, format: (v) => `${Math.round(v * 100)}%`, onInput: set('speed') }),
        slider({ label: 'EXP when beaten', min: 0, max: 200, step: 5, value: form.exp, onInput: set('exp') }),
        slider({ label: 'Coins when beaten', min: 0, max: 200, step: 5, value: form.coins, onInput: set('coins') })),
      hint('Try its attacks at these settings in the Pattern Lab: the Bullets and Bullet speed sliders there work the same way.'));
  }

  // 3: Attacks, with a little live preview on each card.
  let hovered = null;
  const snapshots = new Map();
  function runPreview(name, seconds, live) {
    const pattern = makePattern(patterns, name, PREVIEW_BOX, { density: form.density, speed: form.speed });
    const soul = { x: PREVIEW_BOX.x + PREVIEW_BOX.w / 2, y: PREVIEW_BOX.y + PREVIEW_BOX.h / 2 + 10, vy: 0 };
    const state = { pattern, soul, bullets: [], time: 0 };
    for (let t = 0; t < seconds; t += 1 / 30) advance(state, 1 / 30);
    return live ? state : state.bullets;
  }
  function advance(state, dt) {
    state.pattern.update(dt, state.bullets, state.soul);
    for (const b of state.bullets) b.update(dt, PREVIEW_BOX);
    state.bullets = state.bullets.filter((b) => !b.isGone(PREVIEW_BOX));
    state.time += dt;
  }
  function drawPreview(canvas, bullets) {
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(2, 0, 0, 2, -(PREVIEW_BOX.x - 4) * 2, -(PREVIEW_BOX.y - 4) * 2);
    for (const b of bullets) b.draw(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = '#35d46c';
    ctx.lineWidth = 3;
    ctx.strokeRect(6.5, 6.5, canvas.width - 13, canvas.height - 13);
  }

  function stepAttacks() {
    const attackCard = (name) => {
      const canvas = pixelCanvas((PREVIEW_BOX.w + 8) * 2, (PREVIEW_BOX.h + 8) * 2);
      const weight = form.patterns[name] ?? 0;
      const boss = patternMode(name) !== 'normal';
      try {
        const key = `${name}:${form.density}:${form.speed}`;
        if (!snapshots.has(key)) snapshots.set(key, runPreview(name, 2.2, false));
        drawPreview(canvas, snapshots.get(key));
      } catch { /* a broken custom pattern: leave the box empty */ }
      const card = el('div', {
        class: `attack-card${weight ? ' on' : ''}`,
        onmouseenter: () => { try { hovered = { canvas, name, state: runPreview(name, 0.5, true) }; } catch { hovered = null; } },
        onmouseleave: () => { hovered = null; },
      },
      el('div', { class: 'name' }, name, boss ? el('span', { class: 'badge hot', tip: 'Changes how the soul moves: only bosses can use it' }, 'boss') : null,
        name in patterns.custom ? el('span', { class: 'badge' }, 'yours') : null),
      el('div', { class: 'desc' }, name in patterns.custom ? 'Made in the Pattern Lab.' : PATTERN_INFO[name] ?? (patterns.themed.has(name) ? 'A themed enemy attack (src/battle/attacks/).' : '')),
      canvas,
      segmented(HOW_OFTEN.map(([v, l]) => [v, l]), Math.min(3, weight), (v) => {
        if (v) form.patterns[name] = v; else delete form.patterns[name];
        if (boss && v && !form.boss) { form.boss = true; toast(`${name} changes how the soul moves, so this enemy is now a boss.`, { kind: 'info' }); }
        if (!Object.keys(form.patterns).some((p) => patternMode(p) !== 'normal')) form.boss = false;
        card.classList.toggle('on', Boolean(v));
        changed();
      }, { small: true }));
      return card;
    };
    const themed = allPatterns().filter((name) => patterns.themed.has(name));
    const yours = allPatterns().filter((name) => name in patterns.custom);
    const plain = allPatterns().filter((name) => !patterns.themed.has(name) && !(name in patterns.custom));
    const count = Object.values(form.patterns).filter((w) => w > 0).length;
    const group = (title, names) => (names.length ? [el('h3', { style: 'margin:18px 0 8px' }, title), el('div', { class: 'attack-grid' }, names.map(attackCard))] : []);
    setChildren(body,
      el('h2', {}, 'How does it attack?'),
      hint(`Turn on at least ${MIN_ATTACKS} different attacks and how often each is used. Hover a card to watch it. Make your own in the Pattern Lab.`),
      count >= MIN_ATTACKS ? null : el('div', { class: 'notice warn' }, icon('warn', 16), `Pick at least ${MIN_ATTACKS} attacks (${count} so far). Every enemy needs a few different ones.`),
      // The enemies' own attacks, under the area of the first enemy using each.
      ...order.groups('patterns', themed, { fallback: "Other enemies' attacks" }).flatMap(({ group: title, ids }) => group(title, ids)),
      ...group('Made in the Pattern Lab', yours),
      ...group('Plain patterns (simple orbs, best for testing)', plain));
  }
  (function animateHovered() {
    requestAnimationFrame(animateHovered);
    if (!hovered || !studio.isActive()) return;
    try {
      advance(hovered.state, 1 / 60);
      if (hovered.state.time > hovered.state.pattern.duration) hovered.state = runPreview(hovered.name, 0, true);
      drawPreview(hovered.canvas, hovered.state.bullets);
    } catch {
      hovered = null;
    }
  })();

  // 4: Talk
  function stepTalk() {
    const acts = form.acts.map((act, i) => el('div', { class: 'act' },
      el('div', { class: 'act-head' },
        field('Option', el('input', { type: 'text', value: act.name, oninput: (e) => { act.name = e.target.value.replace(/[[\]]/g, '').trim(); changed(); } })),
        slider({ label: 'Mercy', min: 0, max: 100, step: 5, value: act.calm, format: (v) => (v ? `+${v}%` : 'none'), onInput: (v) => { act.calm = v; changed(); } }),
        btn('trash', 'Remove', () => { form.acts.splice(i, 1); changed(); stepTalk(); }, { iconOnly: true, kind: 'ghost danger', disabled: form.acts.length < 2 })),
      el('textarea', {
        rows: 3, value: act.text, placeholder: 'What happens when you pick it. An empty line starts a new page.',
        oninput: (e) => { act.text = e.target.value; act.edited = true; changed(); },
      })));
    const names = form.acts.map((a) => a.name);
    const problems = [];
    if (names.some((n) => !n)) problems.push('Every option needs a name.');
    if (new Set(names).size !== names.length) problems.push('Two options have the same name.');
    if (!form.acts.some((a) => a.calm > 0)) problems.push('No option gives Mercy, so it can never be spared.');
    setChildren(body,
      el('h2', {}, 'What can you say to it?'),
      hint('These are its TALK options. Each one fills the Mercy meter by some amount; at 100% the player can spare it.'),
      problems.map((p) => el('div', { class: 'notice warn' }, icon('warn', 16), p)),
      acts,
      btn('plus', 'Add an option', () => { form.acts.push({ name: `Option ${form.acts.length + 1}`, calm: 30, text: '', edited: true }); changed(); stepTalk(); }, { kind: 'ghost' }));
  }

  // 5: Words
  function stepWords() {
    setChildren(body,
      el('h2', {}, 'What does it say?'),
      hint('These start filled in with its name. Change anything you like.'),
      el('div', { class: 'words' }, WORDS.map(([key, label, help]) => el('div', {},
        el('div', { class: 'row', style: 'justify-content:space-between;margin-bottom:5px' }, el('span', { class: 'field-label' }, label),
          form.edited[key] ? btn('undo', 'Reset', () => { form.edited[key] = false; form.words[key] = defaultWords(form.name)[key]; changed(); stepWords(); }, { kind: 'ghost', title: 'Go back to the default words' }) : null),
        el('textarea', { rows: key === 'flavor' || key === 'taunts' ? 7 : 3, value: form.words[key], oninput: (e) => { form.words[key] = e.target.value; form.edited[key] = true; changed(); } }),
        hint(help)))));
  }

  // 6: Save (and maybe put it in a room)
  function stepSave() {
    const id = idFor();
    const ready = problems();
    const roomIds = order.sorted('rooms', Object.keys(rooms));
    form.place.room ??= roomIds[0] ?? null;
    const mapCanvas = el('div', { class: 'pick-stage', style: 'max-height:340px' });
    setChildren(body,
      el('h2', {}, form.isNew ? 'Save your enemy' : `Save ${friendly(form.name)}`),
      hint('Press Save and it is in the game. Refresh the game to meet it.'),
      ready.length ? ready.map((p) => el('div', { class: 'notice warn' }, icon('warn', 16), p)) : el('div', { class: 'all-good', style: 'margin:10px 0' }, icon('check', 16), 'Ready to save.'),
      el('dl', { class: 'summary' },
        el('dt', {}, 'Enemy file'), el('dd', {}, el('code', {}, `src/data/enemies/${id}.js`)),
        el('dt', {}, 'Words'), el('dd', {}, el('code', {}, `text/${form.textFile || `enemies/${id}.txt`}`)),
        el('dt', {}, 'Rooms call it'), el('dd', {}, el('code', {}, id))),
      el('div', { style: 'margin:6px 0 18px' }, checkbox(form.place.on, (v) => { form.place.on = v; changed(); stepSave(); }, 'Also put it in a room')),
      form.place.on && form.place.room ? el('div', { style: 'margin-bottom:18px' },
        el('div', { class: 'row', style: 'align-items:flex-end;gap:18px' },
          field('Room', select(order.options('rooms', roomIds, (r) => friendly(rooms[r].name || r)), form.place.room, (v) => { form.place.room = v; form.place.x = null; changed(); stepSave(); })),
          el('div', { style: 'width:220px' }, slider({ label: 'Walks', min: 0, max: 6, value: form.place.walk, format: (v) => (v ? `${v} tiles each way` : 'stays put'), onInput: (v) => { form.place.walk = v; drawMap(); } }))),
        hint(form.place.x === null ? 'Click a floor tile where it should wander.' : `It will wander around tile ${form.place.x}, ${form.place.y}.`),
        mapCanvas) : null,
      el('div', { class: 'row' }, btn('save', form.place.on ? 'Save enemy and room' : 'Save enemy', () => studio.save(), { kind: 'primary big', disabled: !studio.server, title: studio.server ? 'Ctrl+S works too' : 'Start the Studio with `python tools/serve.py` to save' })),
      el('div', { class: 'adv', style: 'margin-top:24px' },
        form.isNew ? field('Enemy id', el('input', { type: 'text', value: form.id || id, onchange: (e) => { form.id = snakeCase(e.target.value); changed(); stepSave(); } }), 'The file name, and what rooms call it.') : null,
        field('Code', codeView(form.art ? enemyModule(form, id, constFor(id)) : '(pick a look first)')),
        field('Text file', codeView(enemyText(form, id)))));
    let drawMap = () => {};
    if (form.place.on && form.place.room) {
      const room = rooms[form.place.room];
      const tiles = renderTiles(room);
      const scale = Math.max(1, Math.min(2, Math.floor(620 / tiles.width)));
      const canvas = pixelCanvas(tiles.width * scale, tiles.height * scale, { class: 'pick-canvas' });
      const sprites = enemySprites();
      drawMap = () => {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.drawImage(tiles, 0, 0);
        drawThings(ctx, room, sprites);
        if (form.place.x !== null) {
          ctx.globalAlpha = 0.9;
          if (previewSprite) ctx.drawImage(previewSprite, (form.place.x + 0.5) * T - previewSprite.width / 2, (form.place.y + 1) * T - previewSprite.height - 2);
          ctx.globalAlpha = 1;
          const [a, b] = patrolFor(room);
          ctx.fillStyle = '#ffe14d';
          ctx.fillRect((a + 0.5) * T, (form.place.y + 1) * T - 1, (b - a) * T + 1, 1);
        }
      };
      canvas.addEventListener('pointerdown', (e) => {
        const r = canvas.getBoundingClientRect();
        const x = Math.floor(((e.clientX - r.left) / r.width) * (tiles.width / T));
        const y = Math.floor(((e.clientY - r.top) / r.height) * (tiles.height / T));
        if (TILES[room.tiles[y]?.[x]]?.solid ?? true) { toast('That tile blocks walking: pick a floor tile.', { kind: 'info' }); return; }
        form.place.x = x;
        form.place.y = y;
        changed();
        stepSave();
      });
      drawMap();
      mapCanvas.append(canvas);
    }
  }

  // The patrol strip: up to `walk` tiles each way, stopping at walls.
  function patrolFor(room) {
    const { x, y, walk } = form.place;
    const open = (tx) => !(TILES[room.tiles[y]?.[tx]]?.solid ?? true);
    let a = x;
    let b = x;
    while (a > x - walk && open(a - 1)) a--;
    while (b < x + walk && open(b + 1)) b++;
    return [a, b];
  }

  const idFor = () => (form.isNew ? form.id || snakeCase(form.name) || 'new_foe' : form.id);
  const constFor = (id) => (form.isNew ? constCase(id) || 'NEW_FOE' : form.constName);

  function problems() {
    const list = [];
    if (!form.art) list.push('Pick a look in step 1.');
    if (Object.values(form.patterns).filter((w) => w > 0).length < MIN_ATTACKS) list.push(`Turn on at least ${MIN_ATTACKS} attacks in step 3.`);
    const names = form.acts.map((a) => a.name);
    if (names.some((n) => !n) || new Set(names).size !== names.length) list.push('Every TALK option needs its own name (step 4).');
    const id = idFor();
    if (!/^[a-z][a-z0-9_]*$/.test(id)) list.push('The name needs to start with a letter.');
    if (form.isNew && enemies[id]) list.push(`There's already an enemy called "${id}". Change the name.`);
    if (form.place.on && form.place.x === null) list.push('Click a spot in the room for it, or untick "Also put it in a room".');
    return list;
  }

  // --- Saving ---
  async function getFiles() {
    const list = problems();
    if (list.length) throw new Error(list[0]);
    const id = idFor();
    if (form.isNew) {
      const existing = (await listDir('src/data/enemies')) ?? [];
      if (existing.includes(`${id}.js`)) throw new Error(`There's already a file called ${id}.js. Change the name.`);
    }
    const files = [
      { path: `src/data/enemies/${id}.js`, content: enemyModule(form, id, constFor(id)) },
      { path: `text/${form.textFile || `enemies/${id}.txt`}`, content: enemyText(form, id) },
    ];
    if (form.place.on) {
      const roomId = form.place.room;
      const info = (await roomFiles())[roomId];
      if (!info) throw new Error('Couldn\'t find that room\'s file.');
      const room = editableRoom(rooms[roomId]);
      room.npcs.push({ enemy: id, x: form.place.x, y: form.place.y, patrol: patrolFor(room) });
      files.push({ path: `src/data/rooms/${info.file}`, content: roomModule(room, info.constName, roomHeader(info.source)) });
    }
    return files;
  }

  async function afterSave() {
    const id = idFor();
    const placed = form.place.on;
    form.isNew = false;
    form.id = id;
    form.constName = constFor(id);
    form.textFile ||= `enemies/${id}.txt`;
    form.place.on = false;
    form.place.x = null;
    enemies = await loadEnemies(true);
    if (placed) rooms = await loadRooms(true);
    order = await loadOrder(true);
    studio.setDirty(false);
    if (placed) toast('It\'s in the room too. If the Room Editor has that room open, reopen it to see the enemy.', { kind: 'info' });
    refresh();
  }

  // Back from the Sprite Editor with a new picture.
  async function handle(request) {
    if (request?.type !== 'art') return;
    art = await loadEnemyArt(true);
    if (art.some((a) => a.file === request.file && a.base === request.base)) {
      form.art = { file: request.file, base: request.base };
      changed();
    }
    step = 0;
    refresh();
  }

  async function onShow() {
    // Patterns saved in the Pattern Lab since last time show up straight away.
    patterns = await loadPatterns(true);
    if (step === 2) renderStep();
  }

  function refresh() {
    updateSprite();
    studio.setFile(`src/data/enemies/${idFor()}.js${form.isNew ? ' (new)' : ''}`);
    renderOpen();
    renderSummary();
    renderSteps();
    renderStep();
  }
  window.addEventListener('studio:advanced', () => { if (step === 5) stepSave(); });

  refresh();
  return { getFiles, afterSave, handle, onShow };
}
