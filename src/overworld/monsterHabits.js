// MONSTER HABITS: small things a monster does out in a room that the plain
// patrol / chase / hide behaviours don't cover. Each habit is switched on by a
// field on the room's enemy, does nothing for a monster without it, and never
// touches a monster's patrol, sight, lunge or cutscene clearance. Npc (npc.js)
// calls into this file; keep each habit small and add new ones below.
//
// TIDE: `tide: 'high'` (or 'low') on a room's enemy. It is only out of the
// water while the room's tide stands at that state: when the tide goes the
// other way it sinks, and a few rings spread on the water where it went down.
// While it is under it can't be touched, doesn't move and has no shadow. The
// tide's own creep (`room.tide.anim`) counts as "not yet", so it only comes up
// once the water has settled. (The Tidewight, in the Soundings' wells.)
//
//
// HEARS: `hears: true` (or a number of tiles: how far from its post it will go) on a room's enemy.
// When something in its room makes a noise (a lever pulled, a bell rung, a wheel turned, a crystal
// sung) it breaks off whatever it was doing and heads for the sound, listens there a moment, and
// then goes back to its post and carries on. A fight, a chase or a lurk comes first: it only
// answers noise while it is walking its patrol or wandering. (The Echo Bat-Shrimp, in the Soundings.)
//
// (A monster that hides as a rock or a shell until you come near is not a habit
// but a hiding place: behaviour 'disguise' and a `look` from hideouts.js.)

const RISE_SECONDS = 0.9;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Moves `npc.surface` (0 under, 1 fully out) toward where the tide wants it.
// The first call just snaps it, so a room you walk into already has it up or down.
export function followTide(npc, dt, room) {
  const tide = room?.tide;
  if (!tide) { npc.surface = 1; return; }
  const up = tide.state === npc.tideWhen && !tide.anim;
  if (npc.surface == null) { npc.surface = up ? 1 : 0; return; }
  npc.surface = clamp01(npc.surface + (up ? dt : -dt) / RISE_SECONDS);
}

// Draws the water where it is, or the part of it that is out. (x, y) is the point under its feet.
export function drawSurfacing(ctx, npc, x, y, time) {
  const s = npc.surface ?? 0;
  const w = npc.sprite.width;
  const h = npc.sprite.height;
  // Under: a darker patch in the water and rings spreading from it now and then.
  const patch = 1 - s;
  if (patch > 0) {
    ctx.save();
    ctx.globalAlpha = 0.45 * patch;
    ctx.fillStyle = '#04080f';
    ctx.beginPath();
    ctx.ellipse(x, y - 3, w * 0.38, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    const k = (time * 0.4) % 1;
    ctx.globalAlpha = 0.9 * patch * (1 - k);
    ctx.strokeStyle = '#8fd8e4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y - 3, 3 + k * w * 0.4, 1 + k * 3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  // Coming up: the whole of it rising through the waterline (everything below the line is cut off).
  if (s > 0) {
    const lift = (Math.round(Math.sin(time * 1.8) * 1.5) + 2) * s;
    const sink = (1 - s) * (h + 2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - w, y - h - 40, w * 2, h + 40 - 2);
    ctx.clip();
    ctx.drawImage(npc.sprite, x - Math.floor(w / 2), y - 2 - lift - h + sink);
    ctx.restore();
    if (s < 1) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#8fd8e4';
      ctx.fillRect(x - Math.floor(w / 2), y - 2, w, 1);
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// HEARS

const HEAR_RANGE_TILES = 9;
const HEAR_SPEED = 30;
const LISTEN_SECONDS = 2.2;
const T_PX = 16;

// Something made a noise at the middle of `prop` (a lever, a wheel, a bell, a crystal): every
// monster in the room that hears things turns toward it. `npcs` is the scene's list.
export function hearNoise(npcs, prop) {
  if (!npcs || !prop) return;
  const x = prop.x + (prop.width ?? T_PX) / 2;
  const y = prop.y + (prop.height ?? T_PX);
  for (const npc of npcs) {
    if (!npc.hears || npc.lurking || npc.leap || npc.chasing || npc.frozen || npc.dormant) continue;
    npc.heard = { x, y, phase: 'go', wait: LISTEN_SECONDS, blocked: 0 };
  }
}

// One step of answering a noise. Returns true while it is busy with it (so Npc skips its own
// patrol or wander), false once it is back at its post. `npc.hears` is true or a leash in tiles.
export function followNoise(npc, dt, room) {
  const h = npc.heard;
  if (!h) return false;
  npc.time += dt;
  const leash = (typeof npc.hears === 'number' ? npc.hears : HEAR_RANGE_TILES) * T_PX;
  let tx = h.phase === 'home' ? npc.homeX : h.x;
  let ty = h.phase === 'home' ? npc.homeY : h.y;
  // Never wanders further from its post than its leash.
  const fromHome = Math.hypot(tx - npc.homeX, ty - npc.homeY);
  if (fromHome > leash) {
    tx = npc.homeX + ((tx - npc.homeX) / fromHome) * leash;
    ty = npc.homeY + ((ty - npc.homeY) / fromHome) * leash;
  }
  if (h.phase === 'listen') {
    npc.moving = false;
    h.wait -= dt;
    if (h.wait <= 0) h.phase = 'home';
    return true;
  }
  const dx = tx - npc.x;
  const dy = ty - npc.y;
  const d = Math.hypot(dx, dy);
  if (d < 4) {
    if (h.phase === 'go') h.phase = 'listen';
    else {
      // Home again: the patrol picks up from here.
      npc.heard = null;
      npc.direction = Math.sign(npc.x - (npc.minX + npc.maxX) / 2) > 0 ? -1 : 1;
      return false;
    }
    return true;
  }
  const speed = HEAR_SPEED * npc.pace(dt);
  const moved = speed > 0 && npc.step(room, (dx / d) * speed * dt, (dy / d) * speed * dt);
  h.blocked = speed > 0 && !moved ? h.blocked + dt : 0;
  // Stuck against something: it has heard all it can from here.
  if (h.blocked > 0.6) h.phase = h.phase === 'go' ? 'listen' : 'home';
  if (h.blocked > 3) { npc.heard = null; return false; }
  npc.moving = moved;
  return true;
}
