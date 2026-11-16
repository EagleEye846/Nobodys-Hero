import { TILE_SIZE as T } from '../config.js';

// Townsfolk noticing you. Someone standing about looks your way when you walk
// close by, and turns to you when you talk to them, then goes back to how
// they were stood a moment after. A small bubble pops up over them now and
// then:
//   "!"    the first time you talk to someone (each time the game is started)
//   "..."  talked to over and over, with nothing new to say
//   "?"    you stand right beside them a while and say nothing
//
// Turning is the picture flipped, the same way the cutscenes turn people:
// their own picture faces right (or straight out), flipped they face left.
// Only for people one tile wide; folk out for a stroll (folk.js) turn
// themselves, and only need turning to face you when you talk.
//
// Called from the overworld while you're free to walk (updateReactions) and
// as you press Z on someone (reactToTalk). Prop.draw draws the bubble.

const GLANCE_DISTANCE = 28;
// How long they keep looking after you've gone (or after a talk), seconds.
const LOOK_HOLD = 1.4;
const TALK_HOLD = 2.2;
// Standing beside someone, still and silent, this long: "?".
const PONDER_DISTANCE = 22;
const PONDER_SECONDS = 3.2;
// Talked to this many times in a row: "...".
const WEARY_TALKS = 3;
const BUBBLE_MS = 1100;

// Who you've talked to since the game started (NPC ids), for the "!".
const met = new Set();

const center = (prop) => ({ x: prop.x + prop.width / 2, y: prop.y + T });

// Someone who can turn to look: a one-tile character standing about. (Not a
// shop: some keepers are drawn with their stall.)
function turnable(prop) {
  return prop.npc && !prop.hidden && !prop.stroll && !prop.member && prop.width === T && (prop.sprite?.width ?? 99) <= 20;
}

// A bubble over them: '!', '?' or '...'.
export function popBubble(prop, text) {
  prop.bubble = { text, at: performance.now() };
}

// Faces `prop` toward `body` (left or right) for `hold` seconds.
function look(prop, body, hold) {
  const dx = body.x - center(prop).x;
  const r = (prop.reaction ??= { hold: 0, ponder: 0, pondered: false });
  r.hold = Math.max(r.hold, hold);
  if (Math.abs(dx) < 3) return;
  // A walk that isn't going anywhere: the way Prop.draw turns folk round.
  prop.walk = { dir: dx < 0 ? 'left' : 'right', moving: false, still: true };
}

export function updateReactions(scene, dt) {
  const player = scene.player;
  if (!player || player.hidden) return;
  for (const prop of scene.room.props) {
    if (!turnable(prop)) continue;
    const r = prop.reaction;
    const at = center(prop);
    const d = Math.hypot(player.x - at.x, player.y - at.y);
    if (d < GLANCE_DISTANCE && (player.moving || r?.hold > 0)) look(prop, player, LOOK_HOLD);
    const now = prop.reaction;
    if (!now) continue;
    // Standing beside them without a word.
    if (d < PONDER_DISTANCE && !player.moving) now.ponder += dt;
    else now.ponder = 0;
    if (now.ponder > PONDER_SECONDS && !now.pondered) {
      now.pondered = true;
      popBubble(prop, '?');
    }
    if (d >= GLANCE_DISTANCE) {
      now.hold -= dt;
      // Back to how they were stood.
      if (now.hold <= 0 && prop.walk?.still) prop.walk = null;
    }
  }
}

// Z on someone: they turn to you, and maybe a bubble.
export function reactToTalk(scene, prop) {
  const player = scene.player;
  if (!player) return;
  if (prop.stroll && prop.walk && !prop.stroll.ball) {
    // A stroller stops and turns to you (up, down, left or right).
    const at = center(prop);
    const dx = player.x - at.x;
    const dy = player.y - at.y;
    prop.walk.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    prop.walk.wait = Math.max(prop.walk.wait ?? 0, TALK_HOLD);
  } else if (turnable(prop)) {
    look(prop, player, TALK_HOLD);
  }
  const r = (prop.reaction ??= { hold: 0, ponder: 0, pondered: false });
  r.pondered = true;
  r.talks = scene.lastTalkedTo === prop ? (r.talks ?? 0) + 1 : 1;
  scene.lastTalkedTo = prop;
  const id = prop.npc;
  if (id && !met.has(id)) {
    met.add(id);
    popBubble(prop, '!');
  } else if (r.talks >= WEARY_TALKS) {
    popBubble(prop, '...');
  }
}

// The little pictures in the bubbles, a pixel a '#'.
const GLYPHS = {
  '!': ['#', '#', '#', '#', '.', '#'],
  '?': ['.#.', '#.#', '..#', '.#.', '...', '.#.'],
  '...': ['.....', '.....', '.....', '.....', '.....', '#.#.#'],
};

// The bubble, centred over (cx, bottom): white, with a dark edge and a
// little tail, popping up and fading away.
export function drawBubble(ctx, bubble, cx, bottom) {
  const age = performance.now() - bubble.at;
  const glyph = GLYPHS[bubble.text];
  if (!glyph || age > BUBBLE_MS || age < 0) return;
  const gw = glyph[0].length;
  const gh = glyph.length;
  const w = gw + 4;
  const h = gh + 4;
  const rise = age < 120 ? Math.round(2 * (1 - age / 120)) : 0;
  const left = Math.round(cx - w / 2);
  const top = Math.round(bottom - h - 3 + rise);
  ctx.save();
  ctx.globalAlpha = Math.min(1, (BUBBLE_MS - age) / 220);
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(left - 1, top, w + 2, h);
  ctx.fillRect(left, top - 1, w, h + 2);
  ctx.fillRect(Math.round(cx) - 1, top + h, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(left, top, w, h);
  ctx.fillRect(Math.round(cx) - 1, top + h, 1, 1);
  ctx.fillStyle = '#120c1c';
  glyph.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') ctx.fillRect(left + 2 + x, top + 2 + y, 1, 1);
  });
  ctx.restore();
}
