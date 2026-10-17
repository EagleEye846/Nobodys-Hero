import { readText, listDir } from './api.js';
import { loadRooms, loadScenes, loadEnemies, loadSongs } from './library.js';
import { pickTile } from './rooms.js';
import {
  el, setChildren, icon, btn, hint, field, select, section, checkbox, modal, toast, pixelCanvas, thumbnail,
  snakeCase, camelCase, constCase, friendly, emptyState, deepClone, codeView,
} from './ui.js';
import { quote, inline, comment, headerComment } from './source.js';
import { STEP_TYPES, EMOTES, FACINGS, lookSprite } from '../src/overworld/scenePlayer.js';
import { ANIMATION_NAMES, DEFAULT_FRAME_SECONDS } from '../src/engine/animations.js';
import { ITEMS } from '../src/data/items.js';
import { OverworldScene } from '../src/overworld/overworldScene.js';
import { PORTRAITS } from '../src/data/art/portraits.js';
import { PROP_SPRITES } from '../src/data/art/props.js';
import { SOUND_NAMES } from '../src/audio/music.js';
import { TEXTBOX_LINES, pageLineCount } from '../src/ui/textbox.js';
import { loadUiFont } from '../src/ui/text.js';
import { UI_WIDTH, UI_HEIGHT, UI_SCALE } from '../src/config.js';

// Cutscene Maker: script a scene that plays in a room. Add the people in it
// (actors), then the steps: who walks where, who says what, emotes, camera
// moves, sounds. The preview plays it in the real game engine. Scenes save to
// src/data/scenes/; put a Cutscene trigger in a room (Room Editor) to play one.

// The fields each kind of step keeps when it's saved.
const STEP_FIELDS = {
  say: ['who', 'face', 'text'],
  walk: ['who', 'to', 'fast'],
  face: ['who', 'dir'],
  emote: ['who', 'emote'],
  wait: ['seconds'],
  camera: ['who', 'to'],
  appear: ['who', 'at'],
  leave: ['who'],
  animate: ['who', 'animation', 'speed', 'seconds', 'once'],
  sound: ['name'],
  music: ['song'],
  give: ['item'],
  battle: ['enemy', 'who', 'spared', 'defeated'],
  end_chapter: ['room', 'spawn', 'credits'],
};
const STEP_ICONS = { say: 'chat', walk: 'person', face: 'eye', emote: 'star', wait: 'pause', camera: 'fit', appear: 'plus', leave: 'minus', animate: 'play', sound: 'note', music: 'note', give: 'heart', battle: 'enemy', end_chapter: 'flag' };

function list(name, items, format) {
  if (!items.length) return `  ${name}: [],`;
  return `  ${name}: [\n${items.map((item) => `    ${format(item)},`).join('\n')}\n  ],`;
}

const cleanActor = ({ id, look, x, y, portrait, hidden, plays, animation, speed }) => ({
  id, look, x, y, portrait: portrait || undefined, hidden: hidden || undefined, plays: plays || undefined,
  animation: animation || undefined, speed: animation && speed ? speed : undefined,
});
function cleanStep(step) {
  const out = { do: step.do };
  for (const key of STEP_FIELDS[step.do] ?? []) {
    if (step[key] !== undefined && step[key] !== '') out[key] = step[key];
  }
  if (step.do === 'music' && !out.song) out.song = null;
  return out;
}

export function sceneModule(scene, constName, header) {
  const top = header?.trim() ? header.trim() : comment(`${friendly(scene.id).toUpperCase()}: made in Ruins Studio (tools/).`);
  return [
    top,
    `export const ${constName} = {`,
    '  // Triggers in rooms name the scene by this id.',
    `  id: ${quote(scene.id)},`,
    '  // The room it\'s made for, used by the Cutscene Maker\'s map and preview.',
    `  room: ${quote(scene.room)},`,
    '  // false: it plays every time you step on its trigger, not just the first time.',
    `  once: ${scene.once !== false},`,
    '',
    '  // People who appear only in this scene, besides the player (see exampleScene.js).',
    list('actors', scene.actors, (actor) => inline(cleanActor(actor))),
    '',
    '  // What happens, in order (see STEP_TYPES in src/overworld/scenePlayer.js).',
    list('steps', scene.steps, (step) => inline(cleanStep(step))),
    '};',
    '',
  ].join('\n');
}

// Which file each scene lives in: { id: { file, constName, header } }.
async function sceneFiles() {
  const files = (await listDir('src/data/scenes')) ?? ['exampleScene.js'];
  const out = {};
  await Promise.all(files.filter((f) => f.endsWith('.js') && f !== 'index.js').map(async (file) => {
    const source = await readText(`src/data/scenes/${file}`);
    const constName = source.match(/export\s+const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/)?.[1];
    const id = source.match(/\bid\s*:\s*'([^']+)'/)?.[1];
    if (id && constName) out[id] = { file, constName, header: headerComment(source) };
  }));
  return out;
}

export async function mount(root, studio) {
  await loadUiFont();
  let rooms = await loadRooms(true);
  let scenes = await loadScenes(true);
  let files = await sceneFiles();
  const enemies = await loadEnemies();
  const songs = Object.keys(await loadSongs());

  let scene = null; // the scene being edited (a copy)
  let meta = null; // { file, constName, header, isNew }
  let selectedStep = null;
  let run = null; // the running preview

  const looks = [
    ...Object.keys(PROP_SPRITES).filter((name) => !['sign', 'savepoint'].includes(name) && !name.endsWith('_back')).map((name) => [`prop:${name}`, friendly(name)]),
    ...Object.keys(enemies).map((name) => [`enemy:${name}`, `${friendly(enemies[name].enemy.name ?? name)} (enemy)`]),
  ];
  const roomName = (id) => friendly(rooms[id]?.name || id);
  const actorIds = () => scene.actors.map((a) => a.id);
  const whoOptions = ({ nobody = false, actorsOnly = false } = {}) => [
    ...(nobody ? [['', 'Nobody (a narrator)']] : []),
    ...(actorsOnly ? [] : [['player', 'You (the player)']]),
    ...scene.actors.map((a) => [a.id, friendly(a.id)]),
  ];

  // --- Layout ---
  const sceneSelect = el('select', { onchange: (e) => openScene(e.target.value), tip: 'Open a cutscene' });
  const leftBody = el('div');
  const left = el('aside', { class: 'sidebar left' },
    el('div', { class: 'row', style: 'margin-bottom:14px' }, sceneSelect, btn('plus', 'New cutscene', () => newScene(), { kind: 'ghost' })),
    leftBody);
  const stepsColumn = el('div', { class: 'scroll-column' });
  const work = el('div', { class: 'work' }, stepsColumn);
  const screen = pixelCanvas(UI_WIDTH, UI_HEIGHT);
  screen.tabIndex = 0;
  const previewStatus = el('div');
  const checks = el('div');
  const code = el('div', { class: 'adv' });
  const right = el('aside', { class: 'sidebar right' },
    section('Preview', el('div', { class: 'preview-box' }, screen),
      el('div', { class: 'row', style: 'margin-top:10px' },
        btn('play', 'Play', () => startPreview(), { kind: 'primary' }),
        btn('next', 'Next (Z)', () => run?.press('confirm'), { kind: 'ghost', title: 'Like pressing Z: goes on to the next page of words' }),
        btn('stop', 'Stop', () => stopPreview(), { kind: 'ghost', iconOnly: true })),
      previewStatus),
    section('Check', checks),
    code);
  root.append(el('div', { class: 'workspace wide-right' }, left, work, right));

  // --- Opening ---
  function renderSceneSelect() {
    const ids = Object.keys(scenes);
    const options = ids.map((id) => el('option', { value: id }, friendly(id)));
    if (meta?.isNew) options.push(el('option', { value: scene.id }, `${friendly(scene.id)} (new)`));
    setChildren(sceneSelect, options);
    sceneSelect.value = scene?.id ?? '';
  }

  async function okToLeave() {
    if (!studio.isDirty()) return true;
    return modal({ title: 'Leave without saving?', body: hint('Your changes to this cutscene haven\'t been saved.'), actions: [{ label: 'Stay', value: false }, { label: 'Leave', value: true, kind: 'danger' }] });
  }

  async function openScene(id) {
    if (scene && id !== scene.id && !(await okToLeave())) { renderSceneSelect(); return; }
    const data = scenes[id];
    if (!data) return;
    stopPreview();
    scene = deepClone({ once: true, actors: [], steps: [], ...data });
    const info = files[id];
    meta = { file: info?.file ?? `${camelCase(id)}.js`, constName: info?.constName ?? constCase(id), header: info?.header ?? '', isNew: false };
    selectedStep = null;
    studio.setFile(`src/data/scenes/${meta.file}`);
    studio.setDirty(false);
    renderAll();
  }

  async function newScene() {
    if (!(await okToLeave())) return;
    const name = el('input', { type: 'text', placeholder: 'e.g. Keeper says hello' });
    const roomPick = select(Object.keys(rooms).map((id) => [id, roomName(id)]), Object.keys(rooms)[0]);
    const answer = await modal({
      title: 'New cutscene',
      body: el('div', {}, field('Name it', name, 'Just for you, to tell cutscenes apart.'), field('Which room is it in?', roomPick)),
      actions: [{ label: 'Cancel', value: null }, { label: 'Make it', value: true, kind: 'primary' }],
      onOpen: () => name.focus(),
    });
    if (!answer) return;
    const id = snakeCase(name.value);
    if (!id) { toast('Give it a name first.', { kind: 'error' }); return; }
    if (scenes[id]) { toast(`There's already a cutscene called ${friendly(id)}.`, { kind: 'error' }); openScene(id); return; }
    stopPreview();
    scene = { id, room: roomPick.value, once: true, actors: [], steps: [] };
    meta = { file: `${camelCase(id)}.js`, constName: constCase(id), header: '', isNew: true };
    selectedStep = null;
    studio.setFile(`src/data/scenes/${meta.file} (new)`);
    studio.setDirty(true);
    renderAll();
  }

  // --- Editing ---
  function changed({ steps = false, actors = false } = {}) {
    studio.setDirty(true);
    if (actors) renderLeft();
    if (steps || actors) renderSteps();
    renderChecks();
    if (!run?.playing) drawStill();
  }

  function renderAll() {
    renderSceneSelect();
    renderLeft();
    renderSteps();
    renderChecks();
    drawStill();
  }

  // A "tile x, y" label with a button that picks a tile on the scene's room map.
  function tilePicker(label, value, onPick, help) {
    return el('div', { class: 'field' },
      el('span', { class: 'field-label' }, label),
      el('div', { class: 'row' },
        el('span', { class: 'grow tile-label' }, value ? `tile ${value.x}, ${value.y}` : 'not set'),
        btn('flag', 'Pick on the map', async () => {
          const roomData = rooms[scene.room];
          if (!roomData) { toast('That room doesn\'t exist yet.', { kind: 'error' }); return; }
          const spot = await pickTile(roomData, { title: label, text: 'Click a tile.', current: value });
          if (spot) onPick(spot);
        }, { kind: 'ghost' })),
      help ? hint(help) : null);
  }

  function renderLeft() {
    if (!scene) {
      setChildren(leftBody, hint('Pick a cutscene above, or make a new one.'));
      return;
    }
    setChildren(leftBody,
      section('This cutscene',
        field('Room', select(Object.keys(rooms).map((id) => [id, roomName(id)]), scene.room, (v) => { scene.room = v; changed(); })),
        checkbox(scene.once !== false, (v) => { scene.once = v; changed(); }, 'Only plays the first time'),
        hint('To play it in the game, put a Cutscene trigger in the room (Room Editor, Place).')),
      section('Who\'s in it',
        hint('You (the player) are always in it. Add anyone else here.'),
        scene.actors.map((actor, i) => actorCard(actor, i)),
        btn('plus', 'Add someone', () => {
          const taken = new Set(actorIds());
          let id = 'keeper';
          for (let n = 2; taken.has(id); n++) id = `keeper_${n}`;
          const start = rooms[scene.room]?.playerStart ?? { x: 2, y: 2 };
          scene.actors.push({ id, look: 'prop:keeper', x: start.x, y: start.y, portrait: PORTRAITS.old_keeper ? 'old_keeper' : undefined, hidden: true });
          changed({ actors: true });
        }, { kind: 'ghost' })));
  }

  // The characters standing in the scene's room (NPCs and shopkeepers), whom an actor can play.
  const roomCharacters = () => (rooms[scene.room]?.props ?? []).filter((p) => p.npc || p.shop);

  function actorCard(actor, index) {
    const sprite = lookSprite(actor.look)?.right;
    const characters = roomCharacters();
    const playing = characters.find((p) => (p.npc ?? p.shop) === actor.plays);
    const castAs = field('Already in the room?', select(
      [['', 'No, someone new'], ...characters.map((p) => [p.npc ?? p.shop, `Yes: the ${friendly(p.npc ?? p.shop)} standing there`])],
      actor.plays ?? '',
      (v) => {
        const prop = characters.find((p) => (p.npc ?? p.shop) === v);
        if (prop) {
          // They start where that character stands, looking like them, on stage.
          Object.assign(actor, { plays: v, look: `prop:${prop.sprite}`, x: prop.x, y: prop.y, hidden: undefined });
          if (prop.npc && PORTRAITS[prop.npc]) actor.portrait = prop.npc;
        } else {
          delete actor.plays;
        }
        changed({ actors: true });
      }),
    playing ? 'They step out from where they stand, and stay where the scene leaves them. If they Leave, they\'re gone until you come back.' : null);
    const rename = (value) => {
      const id = snakeCase(value);
      if (!id || id === 'player' || (id !== actor.id && actorIds().includes(id))) { toast('That name is taken or empty.', { kind: 'error' }); renderLeft(); return; }
      for (const step of scene.steps) if (step.who === actor.id) step.who = id;
      actor.id = id;
      changed({ actors: true });
    };
    return el('div', { class: 'page-card' },
      el('div', { class: 'card-head' },
        sprite ? thumbnail(sprite, 32) : icon('person', 22),
        el('input', { type: 'text', value: friendly(actor.id), class: 'grow', onchange: (e) => rename(e.target.value), tip: 'Their name in the steps' }),
        btn('trash', 'Remove', () => {
          scene.actors.splice(index, 1);
          scene.steps = scene.steps.filter((step) => step.who !== actor.id);
          changed({ actors: true });
        }, { iconOnly: true, kind: 'ghost danger', title: 'Remove them (and their steps)' })),
      characters.length ? castAs : null,
      playing ? null : field('Looks like', select(looks, actor.look, (v) => { actor.look = v; changed({ actors: true }); })),
      field('Portrait when talking', select([['', 'None'], ...Object.keys(PORTRAITS).map((p) => [p, friendly(p)])], actor.portrait ?? '', (v) => { actor.portrait = v || undefined; changed(); })),
      playing ? null : tilePicker('Starts on', actor, (spot) => { actor.x = spot.x; actor.y = spot.y; changed({ actors: true }); }),
      playing ? null : checkbox(Boolean(actor.hidden), (v) => { actor.hidden = v || undefined; changed(); }, 'Off-stage until an Appear step'),
      field('Doing at the start', select([['', 'Nothing (standing)'], ...ANIMATION_NAMES.map((a) => [a, friendly(a)])], actor.animation ?? '', (v) => { actor.animation = v || undefined; changed(); }), 'An animation they play until a step changes it, or they walk.'));
  }

  // --- Steps ---
  function newStep(kind) {
    const first = scene.actors[0]?.id;
    if ((kind === 'appear' || kind === 'leave' || kind === 'animate') && !first) { toast('Add someone to the cutscene first (on the left).', { kind: 'info' }); return null; }
    const start = rooms[scene.room]?.playerStart ?? { x: 2, y: 2 };
    return {
      say: { do: 'say', who: first ?? '', text: '' },
      walk: { do: 'walk', who: first ?? 'player', to: { ...start } },
      face: { do: 'face', who: 'player', dir: 'down' },
      emote: { do: 'emote', who: first ?? 'player', emote: '!' },
      wait: { do: 'wait', seconds: 0.5 },
      camera: { do: 'camera', who: 'player' },
      appear: { do: 'appear', who: first },
      leave: { do: 'leave', who: first },
      animate: { do: 'animate', who: first, animation: ANIMATION_NAMES[0] ?? '' },
      sound: { do: 'sound', name: SOUND_NAMES[0] },
      music: { do: 'music', song: rooms[scene.room]?.music ?? null },
      give: { do: 'give', item: Object.keys(ITEMS)[0] },
      battle: { do: 'battle', enemy: Object.keys(enemies)[0] },
      end_chapter: { do: 'end_chapter' },
    }[kind];
  }

  function addStep(kind) {
    const step = newStep(kind);
    if (!step) return;
    const at = selectedStep === null ? scene.steps.length : selectedStep + 1;
    scene.steps.splice(at, 0, step);
    selectedStep = at;
    changed({ steps: true });
    stepsColumn.querySelector(`.step-card[data-index="${at}"]`)?.scrollIntoView({ block: 'nearest' });
    stepsColumn.querySelector(`.step-card[data-index="${at}"] textarea`)?.focus();
  }

  function renderSteps() {
    if (!scene) {
      setChildren(stepsColumn, emptyState('film', 'No cutscene open', 'Pick one at the top left, or make a new one.'));
      return;
    }
    const addBar = el('div', { class: 'add-bar' }, Object.entries(STEP_TYPES).map(([kind, label]) => btn(STEP_ICONS[kind], label, () => addStep(kind), { kind: 'ghost' })));
    setChildren(stepsColumn,
      el('h2', { class: 'section-title' }, friendly(scene.id)),
      hint('Steps play from top to bottom. Click a step to select it: new steps go after the selected one.'),
      scene.steps.length ? scene.steps.map((step, i) => stepCard(step, i)) : emptyState('film', 'No steps yet', 'Add one with the buttons below.'),
      el('h3', { class: 'section-title', style: 'margin-top:16px' }, selectedStep === null ? 'Add a step at the end' : `Add a step after step ${selectedStep + 1}`),
      addBar);
  }

  function stepCard(step, index) {
    const move = (by) => {
      const to = index + by;
      if (to < 0 || to >= scene.steps.length) return;
      [scene.steps[index], scene.steps[to]] = [scene.steps[to], scene.steps[index]];
      selectedStep = to;
      changed({ steps: true });
    };
    const card = el('div', {
      class: `step-card${selectedStep === index ? ' selected' : ''}`,
      onclick: () => {
        if (selectedStep === index) return;
        selectedStep = index;
        for (const other of stepsColumn.querySelectorAll('.step-card')) other.classList.toggle('selected', Number(other.dataset.index) === index);
        stepsColumn.querySelector('.add-bar')?.previousElementSibling?.replaceChildren(`Add a step after step ${index + 1}`);
      },
    });
    card.dataset.index = index;
    setChildren(card,
      el('div', { class: 'card-head' },
        el('span', { class: 'num' }, `${index + 1}`),
        icon(STEP_ICONS[step.do] ?? 'star', 18),
        el('span', { class: 'grow' }, STEP_TYPES[step.do] ?? step.do),
        btn('back', 'Move up', () => move(-1), { iconOnly: true, kind: 'ghost' }),
        btn('next', 'Move down', () => move(1), { iconOnly: true, kind: 'ghost' }),
        btn('trash', 'Remove step', () => {
          scene.steps.splice(index, 1);
          selectedStep = scene.steps.length ? Math.min(index, scene.steps.length - 1) : null;
          changed({ steps: true });
        }, { iconOnly: true, kind: 'ghost danger' })),
      el('div', { class: 'step-fields' }, stepFields(step)));
    return card;
  }

  const who = (step, opts) => field('Who', select(whoOptions(opts), step.who ?? '', (v) => { step.who = v; changed({ steps: true }); }));

  function stepFields(step) {
    switch (step.do) {
      case 'say': {
        const warning = el('p', { class: 'warn-text' });
        const measure = () => {
          const speaker = scene.actors.find((a) => a.id === step.who)?.portrait;
          const ctx = screen.getContext('2d');
          const long = String(step.text ?? '').split(/\n\s*\n/).map((page, i) => [i + 1, page.trim() ? pageLineCount(ctx, page.trim(), PORTRAITS[speaker] ? speaker : null) : 0]).filter(([, lines]) => lines > TEXTBOX_LINES);
          warning.textContent = long.length ? `Too long for the box: page ${long.map(([n]) => n).join(', ')}. ${TEXTBOX_LINES} lines fit; split it with a blank line.` : '';
        };
        const area = el('textarea', { value: step.text ?? '', placeholder: 'What do they say? Leave a blank line to start a new page.', oninput: (e) => { step.text = e.target.value; measure(); changed(); } });
        measure();
        // Their expression, if their portrait has any (a page can also start with {sad} and so on).
        const portrait = PORTRAITS[scene.actors.find((a) => a.id === step.who)?.portrait];
        const faces = Object.keys(portrait?.expressions ?? {});
        const face = faces.length
          ? field('Face', select([['', 'Normal'], ...faces.map((f) => [f, friendly(f)])], step.face ?? '', (v) => { if (v) step.face = v; else delete step.face; changed(); }))
          : null;
        return [who(step, { nobody: true }), face, el('div', { class: 'field wide' }, el('span', { class: 'field-label' }, 'Words'), area, warning,
          faces.length ? hint(`Start a page with {${faces[0]}} (or ${faces.slice(1, 4).map((f) => `{${f}}`).join(', ')}...) to change their face for that page.`) : null)];
      }
      case 'walk':
        return [who(step), tilePicker('Walks to', step.to, (spot) => { step.to = spot; changed({ steps: true }); }),
          checkbox(Boolean(step.fast), (v) => { if (v) step.fast = true; else delete step.fast; changed(); }, 'Hurry (twice as fast)')];
      case 'give':
        return [field('Item', select(Object.entries(ITEMS).map(([id, item]) => [id, item.name]), step.item, (v) => { step.item = v; changed(); })),
          el('div', { class: 'field wide' }, hint('Goes in your bag, with a "You got..." box (or "your bag is full").'))];
      case 'battle': {
        const sceneOptions = [['', 'Nothing'], ...Object.keys(scenes).map((id) => [id, friendly(id)])];
        return [
          field('Enemy', select(Object.keys(enemies).map((id) => [id, friendly(enemies[id].enemy.name ?? id)]), step.enemy, (v) => { step.enemy = v; changed(); })),
          field('Spotlight on', select([['', 'Just you'], ...whoOptions({ actorsOnly: true })], step.who ?? '', (v) => { if (v) step.who = v; else delete step.who; changed({ steps: true }); })),
          field('Then, if spared, play', select(sceneOptions, step.spared ?? '', (v) => { if (v) step.spared = v; else delete step.spared; changed(); })),
          field('Then, if beaten, play', select(sceneOptions, step.defeated ?? '', (v) => { if (v) step.defeated = v; else delete step.defeated; changed(); })),
          el('div', { class: 'field wide' }, hint('First the music cuts out, the room goes dark around you and the one in the spotlight, and your shadow stands up out of you. Then the cutscene ends here and the battle starts. Afterwards the matching scene plays, and counts as seen, so "Shows up" settings in rooms can change with it.')),
        ];
      }
      case 'end_chapter': {
        const fields = [field('Then go on to', select([['', 'The title screen'], ...Object.keys(rooms).map((id) => [id, roomName(id)])], step.room ?? '', (v) => {
          if (v) { step.room = v; step.spawn = { ...(rooms[v]?.playerStart ?? { x: 1, y: 1 }) }; } else { delete step.room; delete step.spawn; }
          changed({ steps: true });
        }))];
        if (step.room) {
          fields.push(el('div', { class: 'field' },
            el('span', { class: 'field-label' }, 'Arriving at'),
            el('div', { class: 'row' }, el('span', { class: 'grow tile-label' }, step.spawn ? `tile ${step.spawn.x}, ${step.spawn.y}` : 'its start'),
              btn('flag', 'Pick on the map', async () => {
                const spot = await pickTile(rooms[step.room], { title: `Where do you arrive in ${roomName(step.room)}?`, text: 'Click a tile.', current: step.spawn });
                if (spot) { step.spawn = spot; changed({ steps: true }); }
              }, { kind: 'ghost' }))));
        }
        fields.push(checkbox(Boolean(step.credits), (v) => { if (v) step.credits = true; else delete step.credits; changed(); }, 'Roll the credits first (text/credits.txt)'));
        fields.push(el('div', { class: 'field wide' }, hint('Shows a card between chapters (its words are in text/chapter_end.txt), then carries on into that room.')));
        return fields;
      }
      case 'face':
        return [who(step), field('Faces', select(FACINGS.map((f) => [f, friendly(f)]), step.dir ?? 'down', (v) => { step.dir = v; changed(); }))];
      case 'emote':
        return [who(step), field('Emote', select(EMOTES.map((e) => [e, e === '<3' ? 'Heart (<3)' : e]), step.emote ?? '!', (v) => { step.emote = v; changed(); }))];
      case 'wait':
        return [field('Seconds', el('input', { type: 'number', min: 0.1, max: 10, step: 0.1, value: step.seconds ?? 0.5, onchange: (e) => { step.seconds = Math.max(0.1, Number(e.target.value) || 0.5); changed(); } }))];
      case 'camera': {
        const target = step.to ? 'spot' : (step.who ?? 'player');
        const options = [['player', 'Back to you (the player)'], ...scene.actors.map((a) => [a.id, `To ${friendly(a.id)}`]), ['spot', 'To a spot']];
        const fields = [field('Look at', select(options, target, (v) => {
          if (v === 'spot') { delete step.who; step.to = { ...(rooms[scene.room]?.playerStart ?? { x: 2, y: 2 }) }; } else { delete step.to; step.who = v; }
          changed({ steps: true });
        }))];
        if (step.to) fields.push(tilePicker('The spot', step.to, (spot) => { step.to = spot; changed({ steps: true }); }));
        fields.push(el('div', { class: 'field wide' }, hint('The camera glides there, then stays until you move it back to the player.')));
        return fields;
      }
      case 'appear': {
        const fields = [who(step, { actorsOnly: true }), checkbox(Boolean(step.at), (v) => { if (v) step.at = { x: 2, y: 2 }; else delete step.at; changed({ steps: true }); }, 'Somewhere new')];
        if (step.at) fields.push(tilePicker('Appears at', step.at, (spot) => { step.at = spot; changed({ steps: true }); }));
        return fields;
      }
      case 'leave':
        return [who(step, { actorsOnly: true }), el('div', { class: 'field wide' }, hint('They vanish. Walk them off somewhere first for a nicer exit.'))];
      case 'animate':
        return [
          who(step, { actorsOnly: true }),
          field('Animation', select([['', 'Stop animating'], ...ANIMATION_NAMES.map((a) => [a, friendly(a)])], step.animation ?? '', (v) => { step.animation = v; changed({ steps: true }); })),
          step.animation ? field('Seconds a frame', el('input', { type: 'number', min: 0.05, max: 2, step: 0.05, value: step.speed ?? DEFAULT_FRAME_SECONDS, onchange: (e) => { step.speed = Math.max(0.05, Number(e.target.value) || DEFAULT_FRAME_SECONDS); changed(); } })) : null,
          step.animation ? field('For how long', el('input', { type: 'number', min: 0, max: 30, step: 0.5, value: step.seconds ?? 0, onchange: (e) => { const v = Math.max(0, Number(e.target.value) || 0); if (v) step.seconds = v; else delete step.seconds; changed(); } }), '0 keeps it going while the next steps play. Walking stops it.') : null,
          step.animation ? checkbox(Boolean(step.once), (v) => { if (v) step.once = true; else delete step.once; changed(); }, 'Play it once and stay on the last frame') : null,
          el('div', { class: 'field wide' }, hint('Animations are sprites with several frames: draw your own in the Sprite Editor.')),
        ];
      case 'sound':
        return [field('Sound', select(SOUND_NAMES.map((s) => [s, friendly(s)]), step.name, (v) => { step.name = v; changed(); }))];
      case 'music':
        return [field('Song', select([['', 'Silence'], ...songs.map((s) => [s, friendly(s)])], step.song ?? '', (v) => { step.song = v || null; changed(); }))];
      default:
        return [hint(`This step (${step.do}) can only be edited in the code.`)];
    }
  }

  // --- Checks ---
  function problems() {
    if (!scene) return [];
    const out = [];
    const known = new Set(['player', ...actorIds()]);
    if (!rooms[scene.room]) out.push(`It's set in "${scene.room}", which isn't a room.`);
    scene.actors.forEach((a) => {
      if (!lookSprite(a.look)) out.push(`${friendly(a.id)} has no look picked.`);
      if (a.plays && !roomCharacters().some((p) => (p.npc ?? p.shop) === a.plays)) out.push(`${friendly(a.id)} plays the ${friendly(a.plays)}, who isn't in ${roomName(scene.room)} any more. Put them back with the Room Editor, or pick "No, someone new".`);
    });
    scene.steps.forEach((step, i) => {
      const n = i + 1;
      if (STEP_FIELDS[step.do]?.includes('who') && step.who && !known.has(step.who)) out.push(`Step ${n} is about "${step.who}", who isn't in the cutscene.`);
      if ((step.do === 'appear' || step.do === 'leave') && !scene.actors.some((a) => a.id === step.who)) out.push(`Step ${n} needs someone from "Who's in it".`);
      if (step.do === 'say' && !String(step.text ?? '').trim()) out.push(`Step ${n} doesn't say anything yet.`);
    });
    const used = Object.values(rooms).some((r) => (r.cutscenes ?? []).some((c) => c.scene === scene.id));
    if (!used && !meta?.isNew) out.push('No room plays it yet. Add a Cutscene trigger in the Room Editor.');
    return out;
  }

  function renderChecks() {
    const list = problems();
    setChildren(checks, list.length
      ? list.map((text) => el('p', { class: 'warn-text', style: 'font-size:14px' }, text))
      : el('p', { class: 'hint' }, icon('check', 14), ' Everything looks good.'));
    if (studio.advanced && scene) setChildren(code, section('The code', codeView(sceneModule(scene, meta.constName, meta.header))));
  }
  window.addEventListener('studio:advanced', () => { if (scene) renderChecks(); else setChildren(code); });

  // --- Preview: the real game, playing the scene ---
  function previewWorld(steps) {
    const roomData = rooms[scene.room];
    if (!roomData) return null;
    // Start the player on the scene's trigger, if a room has one, so it looks like it will in the game.
    const trigger = (roomData.cutscenes ?? []).find((c) => c.scene === scene.id);
    const world = new OverworldScene(roomData, trigger ? { x: trigger.x, y: trigger.y } : roomData.playerStart);
    world.game = { changeScene() {} };
    world.fadeIn = 0;
    world.areaName = null;
    world.playCutscene({ ...deepClone(scene), steps });
    return world;
  }

  function paint(world) {
    const ctx = screen.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    if (!world) return;
    ctx.setTransform(UI_SCALE, 0, 0, UI_SCALE, 0, 0);
    world.draw(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  const still = { wasPressed: () => false, isDown: () => false };
  // Everyone in their starting places.
  function drawStill() {
    if (!scene) { paint(null); return; }
    try {
      const world = previewWorld([{ do: 'wait', seconds: 1e9 }]);
      world?.update(0, still);
      paint(world);
      setChildren(previewStatus, hint(world ? 'Everyone in their starting places. Press Play to watch it.' : 'Pick a room for it.'));
    } catch (error) {
      paint(null);
      setChildren(previewStatus, el('p', { class: 'warn-text' }, error.message));
    }
  }

  function startPreview() {
    if (!scene) return;
    stopPreview();
    let world;
    try {
      world = previewWorld(deepClone(scene.steps));
    } catch (error) {
      toast(error.message, { kind: 'error' });
      return;
    }
    if (!world) { toast('Pick a room for it first.', { kind: 'error' }); return; }
    const pressed = new Set();
    const input = { wasPressed: (action) => pressed.has(action), isDown: () => false };
    run = { playing: true, press: (action) => pressed.add(action) };
    let last = performance.now();
    const frame = (now) => {
      if (!run?.playing) return;
      try {
        world.update(Math.min(0.05, (now - last) / 1000), input);
      } catch (error) {
        toast(`The cutscene stopped: ${error.message}`, { kind: 'error' });
        stopPreview();
        return;
      }
      last = now;
      pressed.clear();
      paint(world);
      if (!world.cutscene) {
        run = null;
        setChildren(previewStatus, hint('The end. Press Play to watch it again.'));
        return;
      }
      const at = world.cutscene.index + 1;
      setChildren(previewStatus, hint(`Step ${at} of ${scene.steps.length}: ${STEP_TYPES[scene.steps[at - 1]?.do] ?? ''}. Press Next (or Z with the preview clicked) to go on when someone is talking.`));
      run.raf = requestAnimationFrame(frame);
    };
    run.raf = requestAnimationFrame(frame);
    screen.focus();
  }

  function stopPreview() {
    if (!run) return;
    cancelAnimationFrame(run.raf);
    run = null;
    drawStill();
  }

  screen.addEventListener('keydown', (e) => {
    if (!run) return;
    const action = { KeyZ: 'confirm', Enter: 'confirm', KeyX: 'cancel', ShiftLeft: 'cancel' }[e.code];
    if (action) { e.preventDefault(); run.press(action); }
  });

  // --- Saving ---
  async function getFiles() {
    if (!scene) return [];
    if (!scene.steps.length) throw new Error('Add at least one step before saving.');
    return [{ path: `src/data/scenes/${meta.file}`, content: sceneModule(scene, meta.constName, meta.header) }];
  }

  async function afterSave() {
    scenes = await loadScenes(true);
    files = await sceneFiles();
    rooms = await loadRooms(true);
    meta.isNew = false;
    studio.setFile(`src/data/scenes/${meta.file}`);
    renderSceneSelect();
    renderChecks();
  }

  async function handle(request) {
    if (request?.scene && scenes[request.scene]) await openScene(request.scene);
  }

  async function onShow() {
    // Rooms may have new cutscene triggers from the Room Editor.
    rooms = await loadRooms(true);
    if (scene) { renderLeft(); renderChecks(); if (!run) drawStill(); }
  }

  const firstId = Object.keys(scenes)[0];
  if (firstId) await openScene(firstId);
  else renderAll();

  return { getFiles, afterSave, handle, onShow, onHide: stopPreview };
}
