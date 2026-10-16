// Small DOM helpers and components shared by every tool, so each editor reads
// as layout rather than plumbing.

// Keys set as DOM properties (they don't work as attributes on every element).
// Everything else is set as an attribute, and on* keys become event listeners.
const PROPERTY_KEYS = new Set(['value', 'checked', 'disabled', 'selected', 'textContent', 'title', 'readOnly', 'innerHTML']);

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : String(child));
  }
  // Properties after children, so a <select> already has its options when its value is set.
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style') node.style.cssText = value;
    else if (key === 'tip') node.dataset.tip = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (PROPERTY_KEYS.has(key)) node[key] = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  return node;
}

// replaceChildren() that skips null/false (replaceChildren would print "null").
export function setChildren(node, ...children) {
  node.replaceChildren(...children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false));
  return node;
}

// --- Pixel icons: 10x10 bitmaps drawn as SVG, in the button's text colour. ---
const ICONS = {
  pencil: ['......##..', '.....#..#.', '....#..##.', '...#..#...', '..#..#....', '.#..#.....', '#..#......', '##.#......', '###.......', '..........'],
  eraser: ['..........', '.....####.', '....#...##', '...#...#.#', '..#...#..#', '.#####..#.', '#.....##..', '#....#....', '.#####....', '..........'],
  fill: ['...##.....', '..#..#....', '.#....#...', '#......#..', '.#......#.', '..#....##.', '...#..#.#.', '....##..#.', '........#.', '..........'],
  picker: ['.......##.', '......####', '.....####.', '......##..', '.....#.#..', '....#.#...', '...#.#....', '..#.#.....', '.##.......', '#.........'],
  mirror: ['....##....', '#...##...#', '##..##..##', '###.##.###', '####..####', '###.##.###', '##..##..##', '#...##...#', '....##....', '..........'],
  undo: ['..........', '..#.......', '.##.......', '#########.', '.##......#', '..#......#', '.........#', '...######.', '..........', '..........'],
  redo: ['..........', '.......#..', '.......##.', '.#########', '#......##.', '#......#..', '#.........', '.######...', '..........', '..........'],
  plus: ['..........', '....##....', '....##....', '....##....', '.########.', '.########.', '....##....', '....##....', '....##....', '..........'],
  minus: ['..........', '..........', '..........', '..........', '.########.', '.########.', '..........', '..........', '..........', '..........'],
  trash: ['...####...', '.########.', '..........', '.#.#..#.#.', '.#.#..#.#.', '.#.#..#.#.', '.#.#..#.#.', '.#.#..#.#.', '.########.', '..........'],
  save: ['#########.', '#.#####.##', '#.#####..#', '#.#####..#', '#........#', '#.######.#', '#.#....#.#', '#.#....#.#', '##########', '..........'],
  play: ['..#.......', '..##......', '..###.....', '..####....', '..#####...', '..####....', '..###.....', '..##......', '..#.......', '..........'],
  pause: ['..........', '.###..###.', '.###..###.', '.###..###.', '.###..###.', '.###..###.', '.###..###.', '.###..###.', '.###..###.', '..........'],
  stop: ['..........', '.########.', '.########.', '.########.', '.########.', '.########.', '.########.', '.########.', '.########.', '..........'],
  loop: ['..######..', '.#......#.', '#......###', '#.......#.', '#.........', '.........#', '.#.......#', '###......#', '.#......#.', '..######..'],
  grid: ['##########', '#..#..#..#', '#..#..#..#', '##########', '#..#..#..#', '#..#..#..#', '##########', '#..#..#..#', '#..#..#..#', '##########'],
  fit: ['###....###', '#........#', '#........#', '..........', '..........', '..........', '..........', '#........#', '#........#', '###....###'],
  home: ['....##....', '...####...', '..######..', '.########.', '##########', '.##....##.', '.##.##.##.', '.##.##.##.', '.##.##.##.', '..........'],
  copy: ['######....', '#....#....', '#..######.', '#..#....#.', '#..#....#.', '####....#.', '...#....#.', '...#....#.', '...######.', '..........'],
  download: ['....##....', '....##....', '....##....', '.##.##.##.', '..######..', '...####...', '....##....', '#........#', '##########', '..........'],
  back: ['..........', '...#......', '..##......', '.#########', '##########', '.#########', '..##......', '...#......', '..........', '..........'],
  next: ['..........', '......#...', '......##..', '#########.', '##########', '#########.', '......##..', '......#...', '..........', '..........'],
  check: ['..........', '.........#', '........##', '.......##.', '#.....##..', '##...##...', '.##.##....', '..###.....', '...#......', '..........'],
  close: ['..........', '.##....##.', '..##..##..', '...####...', '....##....', '...####...', '..##..##..', '.##....##.', '..........', '..........'],
  heart: ['..........', '.##...##..', '####.####.', '#########.', '#########.', '.#######..', '..#####...', '...###....', '....#.....', '..........'],
  room: ['##########', '#....#...#', '#....#...#', '#.........', '#....#...#', '###.##.###', '#........#', '#........#', '##########', '..........'],
  note: ['....######', '....######', '....#....#', '....#....#', '....#....#', '.####.####', '#####.####', '#####.####', '.###...##.', '..........'],
  pattern: ['....#.....', '.#..#..#..', '..#...#...', '...###....', '####.####.', '...###....', '..#...#...', '.#..#..#..', '....#.....', '..........'],
  enemy: ['..######..', '.########.', '##.####.##', '##.####.##', '##########', '##########', '###.##.###', '##########', '#.##.##.##', '..........'],
  sign: ['##########', '#........#', '#.######.#', '#........#', '##########', '....##....', '....##....', '....##....', '...####...', '..........'],
  door: ['..######..', '.#......#.', '#........#', '#........#', '#......#.#', '#........#', '#........#', '#........#', '#........#', '##########'],
  star: ['....##....', '....##....', '..........', '.########.', '..######..', '...####...', '..##..##..', '.#......#.', '..........', '..........'],
  crystal: ['....##....', '...####...', '..##..##..', '.##....##.', '##......##', '.##....##.', '..##..##..', '...####...', '....##....', '..........'],
  code: ['..#....#..', '.#......#.', '.#......#.', '.#......#.', '#........#', '.#......#.', '.#......#.', '.#......#.', '..#....#..', '..........'],
  cursor: ['#.........', '##........', '#.#.......', '#..#......', '#...#.....', '#....#....', '#..###....', '#.#.......', '##........', '#.........'],
  box: ['##########', '#........#', '#........#', '#........#', '#........#', '#........#', '#........#', '#........#', '#........#', '##########'],
  person: ['...####...', '...####...', '...####...', '..........', '.########.', '#.######.#', '#.######.#', '..##..##..', '..##..##..', '..##..##..'],
  shop: ['...####...', '..#....#..', '.########.', '##########', '####..####', '###.##.###', '####..####', '##########', '.########.', '..........'],
  flag: ['##........', '########..', '#########.', '########..', '##........', '##........', '##........', '##........', '##........', '##........'],
  shift: ['..........', '..#....#..', '.##....##.', '###....###', '.##....##.', '..#....#..', '..........', '..........', '..........', '..........'],
  resize: ['######....', '#....#....', '#....#....', '#....#....', '######.#..', '.......##.', '....######', '.......##.', '.......#..', '..........'],
  menu: ['..........', '..........', '##########', '..........', '..........', '##########', '..........', '..........', '##########', '..........'],
  dice: ['##########', '#........#', '#.##..##.#', '#.##..##.#', '#........#', '#........#', '#.##..##.#', '#.##..##.#', '#........#', '##########'],
  wand: ['.......#..', '......###.', '.......#..', '......#...', '.....#....', '....#.....', '...#......', '..#.......', '.#........', '#.........'],
  eye: ['..........', '...####...', '.##....##.', '#...##...#', '#..####..#', '#...##...#', '.##....##.', '...####...', '..........', '..........'],
  warn: ['....##....', '....##....', '...####...', '...#..#...', '..##..##..', '..##..##..', '.###..###.', '.########.', '####..####', '##########'],
  info: ['...####...', '..#....#..', '.#..##..#.', '#........#', '#...##...#', '#...##...#', '.#..##..#.', '..#....#..', '...####...', '..........'],
};

const iconCache = new Map();
export function icon(name, size = 20) {
  const rows = ICONS[name] ?? ICONS.star;
  const key = `${name}:${size}`;
  if (!iconCache.has(key)) {
    let rects = '';
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`; }));
    iconCache.set(key, `<svg viewBox="0 0 10 10" width="${size}" height="${size}" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`);
  }
  const span = el('span', { class: 'icon' });
  span.innerHTML = iconCache.get(key);
  return span;
}

// A button with an icon and/or a label. opts: { kind: 'primary' | 'ghost' |
// 'danger' | 'big', title (tooltip), key (shortcut shown in the tooltip),
// active, disabled, iconOnly }.
export function btn(iconName, label, onClick, opts = {}) {
  const tip = opts.title ?? (opts.iconOnly ? label : null);
  const tooltip = tip ? `${tip}${opts.key ? `  (${opts.key})` : ''}` : (opts.key ? `${label}  (${opts.key})` : null);
  const classes = ['btn', opts.kind, opts.iconOnly ? 'icon-only' : null, opts.active ? 'active' : null, opts.class].filter(Boolean).join(' ');
  return el('button', {
    type: 'button',
    class: classes,
    onclick: onClick,
    disabled: opts.disabled,
    tip: tooltip,
    'aria-label': opts.iconOnly ? label : null,
  }, iconName ? icon(iconName, opts.iconSize ?? 18) : null, opts.iconOnly ? null : el('span', {}, label));
}

// Plain button kept for small text-only actions.
export function button(label, onClick, props = {}) {
  return el('button', { type: 'button', class: 'btn', onclick: onClick, ...props }, label);
}

export const hint = (...text) => el('p', { class: 'hint' }, ...text);

// A labelled control.
export function field(label, control, help) {
  return el('label', { class: 'field' }, el('span', { class: 'field-label' }, label), control, help ? el('span', { class: 'hint' }, help) : null);
}

export function textInput(value, onChange, props = {}) {
  return el('input', { type: 'text', value: value ?? '', onchange: (e) => onChange(e.target.value), ...props });
}

export function numberInput(value, onChange, props = {}) {
  return el('input', {
    type: 'number',
    value: value ?? '',
    onchange: (e) => {
      const number = Number(e.target.value);
      if (e.target.value !== '' && Number.isFinite(number)) onChange(number);
    },
    ...props,
  });
}

// `options` is a list of values, or of [value, label] pairs.
export function select(options, value, onChange, props = {}) {
  const items = options.map((option) => {
    const [optionValue, label] = Array.isArray(option) ? option : [option, option];
    return el('option', { value: optionValue }, label);
  });
  return el('select', { value, onchange: (e) => onChange(e.target.value), ...props }, items);
}

export function checkbox(checked, onChange, label, props = {}) {
  const input = el('input', { type: 'checkbox', checked, onchange: (e) => onChange(e.target.checked) });
  return el('label', { class: 'check', ...props }, input, el('span', {}, label));
}

// A labelled range slider with a live readout. Returns the element; .set(v) updates it.
export function slider({ label, min, max, step = 1, value, format = (v) => String(v), onInput, onChange, tip }) {
  const readout = el('span', { class: 'slider-value' }, format(value));
  const input = el('input', {
    type: 'range', min, max, step, value,
    oninput: (e) => { const v = Number(e.target.value); readout.textContent = format(v); onInput?.(v); },
    onchange: (e) => onChange?.(Number(e.target.value)),
  });
  const node = el('label', { class: 'slider', tip }, el('span', { class: 'slider-head' }, el('span', { class: 'field-label' }, label), readout), input);
  node.set = (v) => { input.value = v; readout.textContent = format(v); };
  return node;
}

// A row of buttons where one is chosen. options: [[value, label, iconName?, tooltip?]].
export function segmented(options, value, onChange, opts = {}) {
  const node = el('div', { class: `segmented${opts.small ? ' small' : ''}`, role: 'group' });
  const buttons = options.map(([v, label, iconName, tip]) => {
    const b = el('button', {
      type: 'button',
      class: v === value ? 'active' : '',
      tip,
      onclick: () => { node.set(v); onChange(v); },
    }, iconName ? icon(iconName, 16) : null, label ? el('span', {}, label) : null);
    b.dataset.value = String(v);
    return b;
  });
  node.append(...buttons);
  node.set = (v) => buttons.forEach((b) => b.classList.toggle('active', b.dataset.value === String(v)));
  return node;
}

// A titled group inside a sidebar.
export function section(title, ...children) {
  return el('section', { class: 'side-section' }, title ? el('h3', {}, title) : null, ...children);
}

export function emptyState(iconName, title, text, action) {
  return el('div', { class: 'empty' }, icon(iconName, 40), el('h3', {}, title), text ? el('p', {}, text) : null, action);
}

// --- Tooltips: one floating label for every [data-tip] element. ---
const tipBox = el('div', { class: 'tooltip' });
let tipTarget = null;
document.addEventListener('mouseover', (e) => {
  const target = e.target.closest?.('[data-tip]');
  if (target === tipTarget) return;
  tipTarget = target;
  if (!target || !target.dataset.tip) { tipBox.classList.remove('show'); return; }
  if (!tipBox.isConnected) document.body.append(tipBox);
  tipBox.textContent = target.dataset.tip;
  const r = target.getBoundingClientRect();
  tipBox.classList.add('show');
  const w = tipBox.offsetWidth;
  const left = Math.max(6, Math.min(window.innerWidth - w - 6, r.left + r.width / 2 - w / 2));
  const below = r.bottom + 8 + tipBox.offsetHeight < window.innerHeight;
  tipBox.style.left = `${left}px`;
  tipBox.style.top = `${below ? r.bottom + 6 : r.top - tipBox.offsetHeight - 6}px`;
});
document.addEventListener('pointerdown', () => { tipBox.classList.remove('show'); tipTarget = null; });

// --- Toasts ---
let toastArea = null;
export function toast(message, { kind = 'ok', link = null, seconds = 7 } = {}) {
  if (!toastArea) {
    toastArea = el('div', { class: 'toasts', 'aria-live': 'polite' });
    document.body.append(toastArea);
  }
  const close = () => { node.classList.add('leaving'); setTimeout(() => node.remove(), 250); };
  const node = el('div', { class: `toast ${kind}` },
    icon(kind === 'error' ? 'warn' : kind === 'info' ? 'info' : 'check', 18),
    el('span', { class: 'toast-text' }, message),
    link ? el('a', { href: link.href, target: '_blank', rel: 'noopener', class: 'toast-link' }, link.label) : null,
    el('button', { type: 'button', class: 'toast-close', onclick: close, 'aria-label': 'Close' }, icon('close', 14)));
  toastArea.append(node);
  setTimeout(close, seconds * 1000);
  return node;
}

// --- Modal dialogs. Resolves with the chosen action's value (null if cancelled). ---
export function modal({ title, body, actions = [{ label: 'OK', value: true, kind: 'primary' }], wide = false, onOpen }) {
  return new Promise((resolve) => {
    const finish = (value) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey, true);
      resolve(value);
    };
    const primary = actions.find((a) => a.kind === 'primary');
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(null); }
      if (e.key === 'Enter' && primary && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        e.stopPropagation();
        choose(primary);
      }
    };
    const choose = async (action) => {
      if (action.validate) {
        const problem = await action.validate();
        if (problem) { error.textContent = problem; return; }
      }
      finish(typeof action.value === 'function' ? action.value() : action.value);
    };
    const error = el('p', { class: 'modal-error' });
    const box = el('div', { class: `modal${wide ? ' wide' : ''}`, role: 'dialog', 'aria-modal': 'true' },
      el('header', {}, el('h2', {}, title), el('button', { type: 'button', class: 'btn ghost icon-only', onclick: () => finish(null), 'aria-label': 'Close' }, icon('close', 16))),
      el('div', { class: 'modal-body' }, body),
      error,
      el('footer', {}, actions.map((a) => btn(a.icon ?? null, a.label, () => choose(a), { kind: a.kind ?? 'ghost' }))));
    const overlay = el('div', { class: 'overlay', onpointerdown: (e) => { if (e.target === overlay) finish(null); } }, box);
    document.body.append(overlay);
    document.addEventListener('keydown', onKey, true);
    onOpen?.(box);
    (box.querySelector('input, textarea, select') ?? box.querySelector('footer .primary'))?.focus();
  });
}

export async function confirmBox(title, text, okLabel = 'OK', kind = 'primary') {
  return Boolean(await modal({
    title,
    body: el('p', {}, text),
    actions: [{ label: 'Cancel', value: false }, { label: okLabel, value: true, kind }],
  }));
}

// A small popup menu under a button. items: [{ icon, label, hint, onClick } | '-'].
export function popupMenu(anchor, items) {
  document.querySelector('.popup-menu')?.remove();
  const menu = el('div', { class: 'popup-menu', role: 'menu' }, items.map((item) => (item === '-'
    ? el('hr')
    : el('button', { type: 'button', class: 'menu-item', role: 'menuitem', disabled: item.disabled, onclick: () => { menu.remove(); item.onClick(); } },
      item.icon ? icon(item.icon, 16) : el('span', { class: 'icon' }),
      el('span', { class: 'menu-text' }, el('span', {}, item.label), item.hint ? el('small', {}, item.hint) : null)))));
  document.body.append(menu);
  const r = anchor.getBoundingClientRect();
  menu.style.top = `${Math.min(window.innerHeight - menu.offsetHeight - 8, r.bottom + 4)}px`;
  menu.style.left = `${Math.max(8, Math.min(window.innerWidth - menu.offsetWidth - 8, r.left))}px`;
  const away = (e) => {
    if (menu.contains(e.target)) return;
    menu.remove();
    document.removeEventListener('pointerdown', away, true);
  };
  setTimeout(() => document.addEventListener('pointerdown', away, true));
  return menu;
}

// True while the user is typing in a form control, so tool shortcuts keep out of the way.
export function isTyping(event) {
  const t = event.target;
  const tag = t?.tagName;
  if (tag === 'INPUT') return !['range', 'checkbox', 'radio', 'button', 'color'].includes(t.type);
  return tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = el('textarea', { style: 'position:fixed;left:-9999px' });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = el('a', { href: url, download: filename, style: 'display:none' });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// A read-only code view (shown in Advanced mode).
export function codeView(text = '') {
  const area = el('textarea', { class: 'code', readOnly: true, spellcheck: 'false', rows: 14 });
  area.value = text;
  return area;
}

// A canvas that stays crisp when scaled.
export function pixelCanvas(width, height, props = {}) {
  const canvas = el('canvas', props);
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  return canvas;
}

// A canvas showing a sprite canvas scaled up (whole-pixel scale that fits `max`).
export function thumbnail(sprite, max = 48, minScale = 1) {
  const scale = Math.max(minScale, Math.floor(max / Math.max(sprite.width, sprite.height)) || 1);
  const c = pixelCanvas(sprite.width * scale, sprite.height * scale, { class: 'thumb' });
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, 0, 0, c.width, c.height);
  return c;
}

export function deepClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

// Every cell on a straight line between two cells (Bresenham).
export function lineCells(from, to) {
  const cells = [];
  let { x, y } = from;
  const dx = Math.abs(to.x - x);
  const dy = -Math.abs(to.y - y);
  const sx = x < to.x ? 1 : -1;
  const sy = y < to.y ? 1 : -1;
  let error = dx + dy;
  for (;;) {
    cells.push({ x, y });
    if (x === to.x && y === to.y) return cells;
    const twice = 2 * error;
    if (twice >= dy) { error += dy; x += sx; }
    if (twice <= dx) { error += dx; y += sy; }
  }
}

// Name helpers: "Crystal Cave" -> crystal_cave / crystalCave / CRYSTAL_CAVE.
export const snakeCase = (text) => String(text).trim().replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
export const camelCase = (text) => snakeCase(text).split('_').filter(Boolean).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('');
export const constCase = (text) => snakeCase(text).toUpperCase();
// "stabThird" / "old_keeper" -> "Stab third" / "Old keeper"
export const friendly = (name) => {
  const words = String(name).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim().toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : '';
};
