// Turns editor data back into source code in the game's own formats, so the
// output can be pasted straight into src/ and text/.

// A JS string literal in the game's style (single quotes).
export function quote(text) {
  return `'${String(text).split('\\').join('\\\\').split("'").join("\\'")}'`;
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
export const objectKey = (key) => (IDENTIFIER.test(key) ? key : quote(key));

// One-line literal for small values: { wave: 'sine', volume: 0.1 }.
export function inline(value) {
  if (typeof value === 'string') return quote(value);
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (!entries.length) return '{}';
    return `{ ${entries.map(([k, v]) => `${objectKey(k)}: ${inline(v)}`).join(', ')} }`;
  }
  return String(value);
}

// Turns a comment (possibly several lines) into // lines.
function comment(text, indent = '') {
  return String(text).trim().split(/\r?\n/).map((line) => `${indent}// ${line}`.trimEnd()).join('\n');
}

// --- Sprites -----------------------------------------------------------

function paletteBlock(name, palette) {
  const lines = palette.map(({ char, color, note }) => {
    const line = `  ${objectKey(char)}: ${quote(color)},`;
    return note ? line + ' // ' + note : line;
  });
  return `export const ${name} = {\n${lines.join('\n')}\n};`;
}

function rowsBlock(rows, indent) {
  return rows.map((row) => `${indent}${quote(row)},`).join('\n');
}

// doc: { kind, baseName, comment, palette: [{ char, color, note }], frames: [{ name, rows: [string] }] }
// `frame` is which frame a single-sprite export uses.
export function spriteModule(doc, frame = 0) {
  const parts = [];
  if (doc.comment) parts.push(comment(doc.comment));
  if (doc.kind === 'icons') {
    const frames = doc.frames.map((f) => `  ${objectKey(f.name)}: [\n${rowsBlock(f.rows, '    ')}\n  ],`);
    parts.push(`export const ${doc.baseName} = {\n${frames.join('\n')}\n};`);
    return `${parts.join('\n')}\n`;
  }
  parts.push(paletteBlock(`${doc.baseName}_PALETTE`, doc.palette));
  let body;
  if (doc.kind === 'single') {
    body = `export const ${doc.baseName}_SPRITE = [\n${rowsBlock(doc.frames[frame].rows, '  ')}\n];`;
  } else {
    const frames = doc.frames.map((f) => `  ${objectKey(f.name)}: [\n${rowsBlock(f.rows, '    ')}\n  ],`);
    body = `export const ${doc.baseName}_SPRITES = {\n${frames.join('\n')}\n};`;
  }
  return `${parts.join('\n')}\n\n${body}\n`;
}

// --- Rooms -------------------------------------------------------------

function tileKey(tiles, notes) {
  const entries = Object.entries(tiles).map(([char, tile]) => {
    const note = notes[char] ?? '(see tileset.js)';
    return `${char}  ${note}${tile.solid && !note.includes('solid') ? ' (solid)' : ''}`;
  });
  const lines = ['// Tile key (see src/overworld/tileset.js):'];
  // Two columns, the right one lined up after the longest left entry.
  const column = Math.max(0, ...entries.filter((_, i) => i % 2 === 0 && entries[i + 1]).map((e) => e.length)) + 3;
  for (let i = 0; i < entries.length; i += 2) {
    const left = entries[i];
    const right = entries[i + 1];
    lines.push(`//   ${right ? left.padEnd(column) + right : left}`.trimEnd());
  }
  return lines.join('\n');
}

function objectList(name, items, format) {
  if (!items.length) return `  ${name}: [],`;
  return `  ${name}: [\n${items.map((item) => `    ${format(item)},`).join('\n')}\n  ],`;
}

const propLiteral = (prop) => {
  const out = { sprite: prop.sprite, x: prop.x, y: prop.y };
  if (prop.text) out.text = prop.text;
  if (prop.npc) out.npc = prop.npc;
  if (prop.shop) out.shop = prop.shop;
  if (prop.save) out.save = true;
  return inline(out);
};

const doorLiteral = ({ x, y, w, h, to, spawn }) => inline({ x, y, w, h, to, spawn: { x: spawn.x, y: spawn.y } });
const npcLiteral = ({ art, enemy, x, y, patrol }) => inline({ art, enemy, x, y, patrol: [patrol[0], patrol[1]] });

// room: the game's room object, with tiles as strings. `tiles` is TILES from tileset.js.
export function roomModule(room, constName, tiles, notes) {
  const lines = [
    `// ${room.name || room.id}: made in Ruins Studio (tools/).`,
    tileKey(tiles, notes),
    `export const ${constName} = {`,
    `  id: ${quote(room.id)},`,
    `  name: ${quote(room.name)},`,
    `  area: ${quote(room.area)},`,
    `  music: ${quote(room.music)},`,
    '',
    '  tiles: [',
    rowsBlock(room.tiles, '    '),
    '  ],',
    '',
    `  playerStart: ${inline({ x: room.playerStart.x, y: room.playerStart.y })},`,
    '',
    objectList('doors', room.doors, doorLiteral),
    '',
    `  textFile: ${quote(room.textFile)},`,
    objectList('props', room.props, propLiteral),
    '',
    objectList('npcs', room.npcs, npcLiteral),
    '};',
  ];
  return `${lines.join('\n')}\n`;
}

// --- Songs -------------------------------------------------------------

// A step array written out literally, one bar per line.
function stepsBlock(steps, stepsPerBar, indent) {
  const lines = [];
  for (let i = 0; i < steps.length; i += stepsPerBar) {
    lines.push(`${indent}${steps.slice(i, i + stepsPerBar).map(inline).join(', ')},`);
  }
  return lines.join('\n');
}

export function songModule(song, constName, stepsPerBar) {
  const instruments = Object.entries(song.instruments)
    .map(([name, instrument]) => `    ${objectKey(name)}: ${inline(instrument)},`);
  const sections = Object.entries(song.sections).map(([name, tracks]) => {
    const trackLines = Object.entries(tracks)
      .map(([track, steps]) => `      ${objectKey(track)}: [\n${stepsBlock(steps, stepsPerBar, '        ')}\n      ],`);
    return `    ${objectKey(name)}: {\n${trackLines.join('\n')}\n    },`;
  });
  const lines = [
    `// "${song.title}": made in the Ruins Studio Music Maker (tools/).`,
    `// ${song.bpm} BPM, ${song.stepsPerBeat} steps per beat.`,
    `export const ${constName} = {`,
    `  title: ${quote(song.title)},`,
    `  bpm: ${song.bpm},`,
    `  stepsPerBeat: ${song.stepsPerBeat},`,
    '',
    '  instruments: {',
    ...instruments,
    '  },',
    '',
    '  sections: {',
    ...sections,
    '  },',
    '',
    `  order: ${inline(song.order)},`,
  ];
  if (song.loopFrom) lines.push(`  loopFrom: ${song.loopFrom},`);
  lines.push('};');
  return `${lines.join('\n')}\n`;
}

// --- Enemies -----------------------------------------------------------

// form: { constName, textId, name, art, artInfo, maxHp, damage, density, speed,
//         patterns: [{ name, weight }], talk: [{ name, calm, text }], exp, coins, boss }
export function enemyModule(form) {
  const { artInfo } = form;
  const talk = form.talk.map(({ name, calm }) => `    ${inline(calm ? { name, calm } : { name })},`);
  const patterns = form.patterns.map(({ name, weight }) => `    ${inline({ name, weight })},`);
  const lines = [
    `import { ${artInfo.baseName}_PALETTE, ${artInfo.baseName}_SPRITE } from '../art/${artInfo.file}';`,
    '',
    `// The ${form.name}'s numbers. Everything it says is in text/enemies/${form.textId}.txt.`,
    `export const ${form.constName} = {`,
    `  name: ${quote(form.name)},`,
    `  textFile: ${quote('enemies/' + form.textId + '.txt')},`,
    `  sprite: { rows: ${artInfo.baseName}_SPRITE, palette: ${artInfo.baseName}_PALETTE },`,
    `  maxHp: ${form.maxHp},`,
    `  damage: ${form.damage},`,
    '',
    '  // Fewer bullets (density) that fly slower (speed). 1 is full strength.',
    `  difficulty: { density: ${form.density}, speed: ${form.speed} },`,
    '',
    '  // Each enemy turn picks one at random (never the same twice in a row).',
    '  // Higher weight = more likely. Patterns live in src/battle/bullets.js.',
    '  patterns: [',
    ...patterns,
    '  ],',
    '',
    '  // TALK options. Each name needs a [talk: Name] section in the text file.',
    '  // `calm` raises the CALM meter; at 100% the Pacify spell ends the fight peacefully.',
    '  talk: [',
    ...talk,
    '  ],',
    '',
    `  rewards: { exp: ${form.exp}, coins: ${form.coins} },`,
  ];
  if (form.boss) {
    lines.push('', '  // A boss: its patterns may change the soul mode (like \x27pillars\x27).', '  boss: true,');
  }
  lines.push('};');
  return `${lines.join('\n')}\n`;
}

// Blank-line separated paragraphs from a multi-line text box.
const paragraphs = (text, fallback) => {
  const out = String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return out.length ? out : [fallback];
};

export function enemyTextFile(form, moduleFile) {
  const talkSections = form.talk.map(({ name, text }) => {
    const fallback = '(What happens when you choose ' + name + '.)';
    return `[talk: ${name}]\n${paragraphs(text, fallback).join('\n\n')}`;
  });
  const lines = [
    `# ${form.name}`,
    '# Numbers (HP, damage, how much each TALK option calms it) live in',
    `# src/data/enemies/${moduleFile}.`,
    '',
    '[intro]',
    paragraphs(form.intro, `${form.name} appears!`).join('\n\n'),
    '',
    '# Shown at the start of each of your turns, in order, then repeating.',
    '[flavor]',
    paragraphs(form.flavor, `${form.name} is watching you.`).join('\n\n'),
    '',
    '# Said in a speech bubble before each attack, picked at random.',
    '[taunts]',
    paragraphs(form.taunts, 'Here I come!').join('\n\n'),
    '',
    '# One section per TALK option. The names after "talk:" must match the',
    `# TALK options in src/data/enemies/${moduleFile}.`,
    talkSections.join('\n\n'),
    '',
    '# How the fight ends. The rewards line is added automatically.',
    '[victory]',
    paragraphs(form.victory, `${form.name} was defeated!`).join('\n\n'),
    '',
    '[pacified]',
    paragraphs(form.pacified, `${form.name} was pacified.`).join('\n\n'),
  ];
  return `${lines.join('\n')}\n`;
}
