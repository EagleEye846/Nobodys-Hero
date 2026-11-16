import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { vistaHash as hash } from '../engine/noise.js';
import { flashScale } from '../state/settings.js';

// The lamp room after Corrie's fight (lastlight_lamp, `wreck: { after }`): the same room the
// fight ends in (the battle's backdrop at its last stage, drawLastLight in
// src/battle/coastBackdrops.js), seen from above. The north wall and the roof are gone:
//   - open sky where the glass was, the storm's pale eye turning in it, lightning;
//   - the sea far below, heaving, seen over what's left of the stone parapet and through
//     the gaps in it, spray bursting up past the sill;
//   - every brass upright of the lantern snapped off to a stump, some bent out over the drop;
//     of the roof only a scrap of iron plates left at the far right, its ribs wrenched up,
//     one plate swinging by a corner;
//   - on the left a wide gap in the parapet, the sea heaving in it, up over the sill, and a
//     lattice girder of the roof fallen across that side of the floor, its top caught on the
//     stump of an upright;
//   - rain coming straight in, splashing on the boards, puddles rippling;
//   - while the great lamp is lit (`lit`), its light standing straight up into the storm.
// After the storm (`calm`): a washed grey-blue sky, a quiet sea, no rain, no lightning.
// The colours are the backdrop's own. Everything is worked out from the clock, so it's the
// same picture every frame it's drawn.
//
// drawBack goes on the floor, under everybody; drawOver (the rain inside, the flash) on top.

const BRASS = ['#2a1c08', '#a07820', '#e8c860'];
const STORM_SKY = ['#04181c', '#0a2c2c', '#14483a', '#2a7046', '#58944c'];
const CALM_SKY = ['#3e5064', '#53667c', '#6e8298', '#8c9db0', '#a8b4c2'];
// The room, in its own pixels: inside the side walls, and the bottom of the wall row
// (where the sill meets the boards).
const X0 = T;
const SILL = 2 * T;
// The top of the parapet, and where the sea meets the sky beyond it.
const PARAPET = SILL - 13;
const HORIZON = SILL - 19;
// The uprights, left to right: where each stands (px from X0) and how much of it is left
// (0: whole, right up into the roof), and which way its broken end is bent.
const UPRIGHTS = [
  { x: 14, left: 9, bend: -4 }, { x: 96, left: 15, bend: 5 }, { x: 134, left: 7, bend: -4 },
  { x: 172, left: 22, bend: 9, over: true }, { x: 212, left: 5, bend: 3 }, { x: 250, left: 12, bend: -5 },
  { x: 286, left: 18, bend: -8, over: true }, { x: 308, left: 26, bend: 3 },
];
// Where the wall has gone altogether (px from X0): the sea shows in the gap. The first is
// the big one, where the sea comes up over the sill.
const GAPS = [[32, 80], [146, 162], [226, 242]];
// The fallen girder: from the boards (its foot) up to the stump it's caught on.
const GIRDER = { fx: X0 + 20, fy: SILL + 74, tx: X0 + 97, ty: SILL - 22 };

const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
function line(ctx, color, x0, y0, x1, y1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * i) / steps), Math.round(y0 + ((y1 - y0) * i) / steps), 1, 1);
}
function glow(ctx, x, y, radius, rgb, strength) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, radius);
  g.addColorStop(0, `rgba(${rgb}, ${strength.toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
// 0..1: how bright the lightning is just now (a double flicker, then it fades), as in the fight.
function flashAt(time, period) {
  const scale = flashScale();
  if (!period || !scale) return { f: 0, n: 0, p: 9 };
  const t = time + 1;
  const n = Math.floor(t / period);
  const p = t - n * period;
  let f = 0;
  if (p < 0.06) f = 1;
  else if (p < 0.14) f = 0.15;
  else if (p < 0.26) f = 0.85;
  else if (p < 0.55) f = ((0.55 - p) / 0.29) * 0.4;
  return { f: f * scale, n, p };
}
const inGap = (x) => GAPS.some(([a, b]) => x >= a && x < b);

export class LampWreck {
  constructor(room) {
    this.width = room.pixelWidth;
  }

  // The flash right now (the overworld's lamp shade lifts with it too).
  flash(time, calm) {
    return calm ? { f: 0, n: 0, p: 9 } : flashAt(time, 3.4);
  }

  drawBack(ctx, camera, time, calm) {
    const ox = -camera.x;
    const oy = -camera.y;
    const x1 = this.width - T;
    const fl = this.flash(time, calm);
    const top = Math.min(0, oy);
    const sill = oy + SILL;

    ctx.save();
    // Above the room, right across; inside the walls, down to the sill.
    ctx.beginPath();
    ctx.rect(0, top, W, Math.max(0, oy - top));
    ctx.rect(ox + X0, oy, x1 - X0, SILL);
    ctx.clip();

    // The sky: sick green low down, where the sea throws the light back (grey-blue after).
    const horizon = oy + HORIZON;
    const stops = calm ? CALM_SKY : STORM_SKY;
    const band = (horizon - top) / stops.length;
    stops.forEach((c, i) => rect(ctx, c, 0, top + i * band, W, band + 1));
    if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.5).toFixed(3)})`, 0, top, W, horizon - top);
    if (!calm) {
      // The storm's eye, pale and turning, right over the tower.
      const ex = ox + 150;
      const ey = top + 5;
      glow(ctx, ex, ey, 110, '150, 235, 170', 0.3);
      ctx.fillStyle = 'rgba(170, 236, 186, 0.3)';
      ctx.beginPath(); ctx.ellipse(ex, ey, 42, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${fl.f ? '244, 255, 240' : '214, 250, 214'}, ${(0.4 + fl.f * 0.3).toFixed(3)})`;
      ctx.beginPath(); ctx.ellipse(ex, ey, 24, 4, 0, 0, Math.PI * 2); ctx.fill();
      for (let arm = 0; arm < 3; arm++) {
        for (let j = 0; j < 40; j++) {
          const rr = 14 + j * 3.4;
          const a = arm * 2.094 + rr * 0.03 - time * 0.3;
          const x = ex + Math.cos(a) * rr * 1.8;
          const y = ey + Math.sin(a) * rr * 0.24;
          rect(ctx, 'rgba(8, 40, 38, 0.75)', x - 7, y - 1, 13 + j * 0.3, 3);
          if (j % 2 === 0) rect(ctx, 'rgba(120, 200, 150, 0.4)', x - 6 - Math.cos(a) * 2, y - 1, 8, 1);
        }
      }
      // Ragged cloud driving across, low.
      for (let i = 0; i < 12; i++) {
        const w = 26 + hash(i + 7000) * 34;
        const x = ((hash(i + 7010) * (W + 120) + time * (14 + hash(i + 7020) * 14)) % (W + 120)) - 60;
        const y = top + 2 + hash(i + 7030) * (horizon - top - 9);
        rect(ctx, i % 3 ? 'rgba(6, 34, 42, 0.8)' : 'rgba(12, 52, 52, 0.7)', x, y, w, 3);
        rect(ctx, 'rgba(6, 34, 42, 0.8)', x + 5, y - 2, w - 12, 2);
      }
      if (fl.f > 0.5 && fl.p < 0.3) {
        // The bolt, down into the sea.
        let bx = 40 + hash(fl.n * 5.3) * (W - 80);
        for (let y = top; y < horizon; y += 4) {
          const nx = bx + (hash(fl.n * 13 + y) - 0.5) * 9;
          line(ctx, '#f4fff6', bx, y, nx, y + 4);
          bx = nx;
        }
        glow(ctx, bx, horizon, 26, '230, 255, 236', 0.5);
      }
    } else {
      for (let i = 0; i < 7; i++) {
        const w = 30 + hash(i + 7050) * 40;
        const x = ((hash(i + 7060) * (W + 120) + time * 3) % (W + 120)) - 60;
        rect(ctx, i % 2 ? 'rgba(104, 120, 140, 0.7)' : 'rgba(114, 130, 150, 0.6)', x, top + 2 + hash(i + 7070) * (horizon - top - 8), w, 3);
      }
    }

    // The sea, far below: over the wall, and standing in the gaps.
    const swell = calm ? 1 : 2.4;
    for (let x = 0; x < W; x++) {
      const wx = x - ox;
      const y = horizon + Math.sin(wx * 0.05 + time * (calm ? 0.8 : 2.2)) * swell * 0.5 + Math.sin(wx * 0.13 - time * 2.1) * (calm ? 0.3 : 0.9);
      rect(ctx, calm ? '#30465a' : '#0a2c2c', x, y, 1, sill - y);
      rect(ctx, calm ? '#3a5268' : '#124038', x, y + 2, 1, 2);
      if (Math.sin(wx * 0.05 + time * 1.4) > (calm ? 0.95 : 0.7)) rect(ctx, calm ? '#d4e0e8' : '#8cc8a8', x, y - 1, 2, 1);
      // Long seas running, nearer.
      const y2 = y + 6 + Math.sin(wx * 0.09 - time * (calm ? 0.9 : 2.6)) * swell;
      rect(ctx, calm ? '#2a3e52' : '#17574a', x, y2, 1, sill - y2);
      if (Math.sin(wx * 0.09 - time * (calm ? 0.9 : 2.6) + 1) > (calm ? 0.96 : 0.78)) rect(ctx, calm ? '#d4e0e8' : (x + Math.floor(time * 6)) % 5 ? '#a8dcc0' : '#ffffff', x, y2 - 1, 2, 1);
    }

    // The spray coming up the outside of the tower, past the sill.
    if (!calm) {
      for (let i = 0; i < 6; i++) {
        const period = 2.6 + hash(i + 4500) * 1.6;
        const phase = ((time + hash(i + 4510) * period) % period) / period;
        if (phase > 0.55) continue;
        const x = ox + X0 + 14 + hash(i + 4520) * (x1 - X0 - 28);
        const up = Math.sin((phase / 0.55) * Math.PI) * (16 + hash(i + 4530) * 16);
        for (let j = 0; j < 14; j++) {
          const dx = (hash(i * 31 + j) - 0.5) * 22 * (0.5 + phase);
          const dy = up * (0.3 + hash(i * 17 + j) * 0.7);
          rect(ctx, j % 3 ? 'rgba(220, 250, 240, 0.7)' : '#ffffff', x + dx, sill - 6 - dy, j % 4 ? 1 : 2, j % 4 ? 1 : 2);
        }
        glow(ctx, x, sill - 6 - up * 0.6, 14, '200, 240, 230', 0.25);
      }
    }

    // In the big gap the sea is right up the tower: heaving in it, over the sill.
    if (!calm) {
      const [g0, g1] = GAPS[0];
      for (let x = g0; x < g1; x++) {
        const sx = ox + X0 + x;
        const mid = 1 - Math.abs((x - (g0 + g1) / 2) / ((g1 - g0) / 2)) ** 2;
        const wy = sill - 7 - mid * (5 + Math.sin(time * 1.7) * 3) + Math.sin(x * 0.3 + time * 3.1) * 1.5;
        rect(ctx, '#17574a', sx, wy, 1, sill - wy);
        rect(ctx, '#2c7c62', sx, wy + 1, 1, 2);
        rect(ctx, (x + Math.floor(time * 6)) % 5 ? '#a8dcc0' : '#ffffff', sx, wy, 1, 1);
      }
    }

    // The stone parapet, broken: its courses, a ragged top, the gaps with a stump each side.
    const py = oy + PARAPET;
    for (let x = 0; x < x1 - X0; x += 8) {
      if (inGap(x)) continue;
      const edge = inGap(x - 8) || inGap(x + 8);
      const drop = edge ? 5 + Math.round(hash(x * 1.3 + 4420) * 4) : Math.round(hash(x * 1.3 + 4420) * 3.4);
      const y = py + drop;
      const sx = ox + X0 + x;
      rect(ctx, '#1e2422', sx, y, 8, sill - y);
      rect(ctx, '#2e3632', sx + 1, y + 1, 7, 4);
      rect(ctx, '#2a302e', sx + ((x / 8) % 2 ? 4 : 0), y + 6, 4, sill - y - 7);
      rect(ctx, fl.f > 0.4 ? '#8aa898' : '#3c4842', sx, y, 8, 1);
      // Wet, and weed on it here and there.
      if (hash(x + 4440) > 0.7) rect(ctx, '#2a5a40', sx + 2, y + 1, 3, 2);
      if (hash(x + 4450) > 0.6) rect(ctx, 'rgba(160, 220, 200, 0.5)', sx + 3, y + 3 + Math.round(hash(x) * 4), 2, 1);
    }
    // The foot rail the glass stood in, torn where the wall went.
    for (let x = 0; x < x1 - X0; x++) {
      if (inGap(x)) continue;
      rect(ctx, BRASS[0], ox + X0 + x, sill - 2, 1, 2);
      rect(ctx, BRASS[1], ox + X0 + x, sill - 2, 1, 1);
    }

    // The brass uprights: whole under what's left of the roof, snapped and bent beyond it.
    for (const u of UPRIGHTS) {
      const x = ox + X0 + u.x;
      const foot = sill - 2;
      const tip = u.left ? foot - u.left - 12 : top - 2;
      rect(ctx, BRASS[0], x - 1, tip, 4, foot - tip);
      rect(ctx, BRASS[1], x, tip, 2, foot - tip);
      rect(ctx, fl.f > 0.4 ? '#fff6c0' : BRASS[2], x, tip, 1, foot - tip);
      if (!u.left) continue;
      if (u.over) {
        // Bent right over, out past the wall, its end hanging over the drop.
        const kx = x + u.bend;
        const ky = tip - 5;
        const ex = kx + u.bend * 1.6;
        const ey = ky + 7 + Math.sin(time * 2.2 + u.x) * 0.8;
        for (const [dx, c] of [[1, BRASS[0]], [0, BRASS[1]]]) {
          line(ctx, c, x + dx, tip, kx + dx, ky);
          line(ctx, c, kx + dx, ky, ex + dx, ey);
        }
        line(ctx, BRASS[2], x, tip, kx, ky);
        // A length of the glazing bar still on it, swinging.
        line(ctx, BRASS[1], ex, ey, ex + Math.sin(time * 2.2 + u.x) * 2, ey + 6);
      } else {
        // Its snapped end, splayed.
        line(ctx, BRASS[1], x + 1, tip, x + 1 + u.bend, tip - 6);
        line(ctx, BRASS[2], x, tip, x + u.bend, tip - 5);
        line(ctx, BRASS[0], x + 2, tip, x + 2 + u.bend, tip - 4);
        line(ctx, BRASS[1], x + 1, tip, x + 1 - u.bend * 0.6, tip - 3);
      }
    }
    ctx.restore();

    this.drawRoof(ctx, ox, oy, top, x1, time, calm);
    this.drawFloor(ctx, ox, oy, x1, time, calm);
    this.drawGirder(ctx, ox, oy);
  }

  // What's left of the roof, a scrap at the far right: iron plates on ribs, a brass rim
  // round its edge, torn off ragged; ribs wrenched up past the tear; a plate hanging by a
  // corner, swinging.
  drawRoof(ctx, ox, oy, top, x1, time, calm) {
    const left = ox + x1 - 34;
    const end = Math.min(W, ox + this.width);
    const edgeAt = (x) => oy + 8 + Math.sin(x * 0.08) * 2 - Math.max(0, left + 18 - x) * 0.5 - (x < left + 14 ? hash(x * 0.9 + 4900) * 7 : 0);
    for (let x = Math.max(0, left); x < end; x++) {
      const wx = x - ox;
      const edge = Math.round(edgeAt(x));
      if (edge <= top) continue;
      rect(ctx, '#141612', x, top, 1, edge - top);
      if (wx % 20 < 9) rect(ctx, '#1c201a', x, top, 1, edge - top - 2);
      rect(ctx, BRASS[1], x, edge, 1, 2);
      rect(ctx, BRASS[0], x, edge + 2, 1, 1);
      // Rain running off its lip.
      if (!calm && (wx * 7) % 13 === 0) rect(ctx, 'rgba(200, 235, 225, 0.55)', x, edge + 3 + ((time * 30 + wx * 3) % 9), 1, 3);
    }
    // A rib, and its rivets.
    for (const wx of [x1 - 16, x1 + 6]) {
      const x = ox + wx;
      const edge = Math.round(edgeAt(x));
      rect(ctx, '#3a3428', x, top, 2, edge - top);
      rect(ctx, '#6a5a38', x, top, 1, edge - top);
      for (let y = top + 3; y < edge - 2; y += 5) rect(ctx, '#8a7448', x + 5, y, 1, 1);
    }
    // Torn: ribs wrenched up and out past the tear.
    for (let j = 0; j < 4; j++) {
      const x = left + 6 + j * 6;
      const tipX = x - 12 - j * 6;
      const tipY = oy + 3 - j * 4 + (calm ? 0 : Math.sin(time * 3 + j) * 1.2);
      line(ctx, '#3a3428', x, oy + 7, tipX, tipY);
      line(ctx, '#3a3428', x, oy + 8, tipX, tipY + 1);
      line(ctx, '#6a5a38', x + 1, oy + 6, tipX + 1, tipY - 1);
    }
    // A plate torn loose, hanging by a corner, swinging.
    const sx = left + 8;
    const swing = Math.sin(time * (calm ? 0.9 : 2.4) + 1) * (calm ? 1 : 3);
    const hy = Math.round(edgeAt(sx)) + 1;
    ctx.fillStyle = '#0c0e0c';
    ctx.beginPath(); ctx.moveTo(sx - 1, hy); ctx.lineTo(sx + 12, hy); ctx.lineTo(sx + 11 + swing, hy + 19); ctx.lineTo(sx - 2 + swing, hy + 15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1c201a';
    ctx.beginPath(); ctx.moveTo(sx, hy); ctx.lineTo(sx + 11, hy); ctx.lineTo(sx + 10 + swing, hy + 17); ctx.lineTo(sx - 1 + swing, hy + 14); ctx.closePath(); ctx.fill();
    line(ctx, BRASS[1], sx + 1, hy + 1, sx + swing, hy + 14);
    line(ctx, '#6a5a38', sx + 6, hy + 2, sx + 5 + swing, hy + 15);
  }

  // The roof girder that came down: iron lattice, two rails and the braces between them,
  // lying up the left of the floor with its top caught on the stump of an upright; a roof
  // plate flat on the boards by its foot, and the stones of the parapet where the wall went.
  drawGirder(ctx, ox, oy) {
    const ax = ox + GIRDER.fx;
    const ay = oy + GIRDER.fy;
    const bx = ox + GIRDER.tx;
    const by = oy + GIRDER.ty;
    // The plate, and a twist of rib on it.
    const px0 = ox + X0 + 30;
    const py0 = oy + SILL + 86;
    const quad = (color, pts) => { ctx.fillStyle = color; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); };
    quad('#080a08', [[px0, py0 + 2], [px0 + 34, py0 - 3], [px0 + 44, py0 + 5], [px0 + 8, py0 + 11]]);
    quad('#1c201a', [[px0 + 2, py0 + 2], [px0 + 33, py0 - 2], [px0 + 42, py0 + 4], [px0 + 9, py0 + 9]]);
    line(ctx, BRASS[1], px0 + 2, py0 + 2, px0 + 33, py0 - 2);
    for (let j = 0; j < 3; j++) line(ctx, '#3a3428', px0 + 12 + j * 9, py0 + 1, px0 + 17 + j * 9, py0 + 7 - j);
    // Its shadow on the boards, then the girder.
    quad('rgba(0, 0, 0, 0.35)', [[ax - 6, ay + 3], [ax + 8, ay + 8], [bx + 12, by + 12], [bx + 2, by + 4]]);
    quad('#060806', [[ax - 7, ay - 2], [ax + 6, ay + 4], [bx + 9, by + 3], [bx - 3, by - 7]]);
    quad('#232b27', [[ax - 5, ay - 2], [ax + 5, ay + 3], [bx + 7, by + 2], [bx - 2, by - 5]]);
    for (const off of [0, 1]) {
      line(ctx, '#56665c', ax - 5, ay - 2 + off, bx - 2, by - 5 + off);
      line(ctx, BRASS[1], ax + 4, ay + 2 + off, bx + 6, by + 1 + off);
    }
    line(ctx, BRASS[2], ax + 4, ay + 2, bx + 6, by + 1);
    for (let j = 0; j < 11; j++) {
      const gx = ax + ((bx - ax) * (j + 0.5)) / 11;
      const gy = ay + ((by - ay) * (j + 0.5)) / 11;
      line(ctx, '#0c100e', gx - 3, gy - 2, gx + 5, gy);
      rect(ctx, '#8a7448', gx - 4, gy - 3, 1, 1);
    }
    // The stones.
    for (const [sx, sy, sw, sh] of [[40, 8, 9, 6], [58, 14, 7, 5], [30, 22, 8, 5], [70, 6, 6, 4], [50, 30, 5, 4], [84, 20, 6, 4]]) {
      const x = ox + X0 + sx;
      const y = oy + SILL + sy;
      rect(ctx, '#161a18', x - 1, y, sw + 2, sh + 1);
      rect(ctx, '#2e3632', x, y, sw, sh - 1);
      rect(ctx, '#3c4842', x, y, sw, 1);
    }
  }

  // The boards, soaked: puddles rippling, the rain hitting them.
  drawFloor(ctx, ox, oy, x1, time, calm) {
    for (let i = 0; i < 9; i++) {
      const x = ox + X0 + 14 + hash(i + 5000) * (x1 - X0 - 28);
      const y = oy + SILL + 10 + hash(i + 5010) * (10 * T);
      const rx = Math.round(7 + hash(i) * 8);
      ctx.fillStyle = calm ? 'rgba(150, 176, 200, 0.16)' : 'rgba(120, 190, 180, 0.16)';
      ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), rx, 2, 0, 0, Math.PI * 2); ctx.fill();
      const ripple = Math.sin(time * 3 + i * 2);
      if (!calm && ripple > 0.6) {
        ctx.fillStyle = 'rgba(220, 255, 245, 0.3)';
        ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), Math.round(3 + ripple * 3), 1, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (calm) return;
    // Each drop that lands: a tick of white, then a ring.
    for (let i = 0; i < 46; i++) {
      const period = 0.5 + hash(i + 5200) * 0.5;
      const n = Math.floor((time + hash(i + 5210)) / period);
      const k = ((time + hash(i + 5210)) % period) / period;
      const x = ox + X0 + hash(i * 3.1 + n * 7.7 + 5220) * (x1 - X0);
      const y = oy + SILL + 4 + hash(i * 5.3 + n * 3.3 + 5230) * (11 * T - 8);
      if (k < 0.25) rect(ctx, 'rgba(230, 255, 248, 0.8)', x, y - 2 + k * 4, 1, 2);
      else if (k < 0.7) {
        const r = 1 + (k - 0.25) * 6;
        rect(ctx, `rgba(210, 245, 235, ${(0.5 * (1 - k)).toFixed(3)})`, x - r, y, 1, 1);
        rect(ctx, `rgba(210, 245, 235, ${(0.5 * (1 - k)).toFixed(3)})`, x + r, y, 1, 1);
      }
    }
  }

  // Over everybody: the rain driving in where the roof was, and the lightning on the room.
  // `lit`: where the great lamp's heart is ({ x, y } in room pixels) while it burns.
  drawOver(ctx, camera, time, calm, lit = null) {
    if (lit) {
      // With the roof off, its light stands straight up into the storm.
      const x = lit.x - camera.x;
      const y = lit.y - camera.y;
      const flick = 0.92 + 0.08 * Math.sin(time * 9) * Math.sin(time * 2.3);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const [w0, w1, a] of [[12, 40, 0.11], [5, 15, 0.15]]) {
        const g = ctx.createLinearGradient(0, y - 18, 0, -30);
        g.addColorStop(0, `rgba(255, 244, 200, ${(a * 1.5 * flick).toFixed(3)})`);
        g.addColorStop(1, `rgba(255, 244, 200, ${(a * 0.5 * flick).toFixed(3)})`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(x - w0, y - 18); ctx.lineTo(x - w1, -4); ctx.lineTo(x + w1, -4); ctx.lineTo(x + w0, y - 18); ctx.closePath(); ctx.fill();
      }
      // Rain lit up in it.
      for (let i = 0; i < 16; i++) {
        const k = (time * (1.2 + hash(i + 6100) * 0.8) + hash(i + 6110)) % 1;
        const yy = k * (y - 18);
        const half = 5 + (1 - yy / Math.max(1, y - 18)) * 22;
        ctx.fillStyle = 'rgba(255, 250, 220, 0.5)';
        ctx.fillRect(Math.round(x + (hash(i + 6120) * 2 - 1) * half - yy * 0.1), Math.round(yy), 1, 3);
      }
      ctx.restore();
    }
    if (calm) return;
    const fl = this.flash(time, calm);
    ctx.fillStyle = 'rgba(210, 245, 235, 0.5)';
    ctx.beginPath();
    const slant = 0.45;
    for (let i = 0; i < 70; i++) {
      const sp = 250 * (0.8 + hash(830 + i + 5) * 0.5);
      const y = ((hash(830 + i + 1) * H + time * sp) % (H + 8)) - 4;
      let x = (hash(830 + i + 2) * (W + 80) - y * slant - time * 14) % (W + 40);
      if (x < -20) x += W + 40;
      const len = 4 + Math.floor(hash(830 + i + 3) * 4);
      for (let k = 0; k < len; k++) ctx.rect(Math.round(x - k * slant), Math.round(y + k), 1, 1);
    }
    ctx.fill();
    if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.16).toFixed(3)})`, 0, 0, W, H);
  }
}
