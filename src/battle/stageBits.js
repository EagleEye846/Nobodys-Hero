// Little things flying about the battle stage: dust kicked up when a boss
// lands, shock rings, sparks and flashes as one goes down, soft lights rising
// off one that's spared. All in stage space (drawn under the shake, over the
// enemies). The battle adds them; they look after themselves from there.
//
// And the ways a boss can arrive (its `entrance`, see entranceOffset):
//   slam    drops in from above and lands heavy (the default)
//   charge  thunders in from the right and skids to a stop
//   swoop   sweeps down out of the dark on its wings
//   rise    rises up out of the floor, out of nothing
//   whirl   spins in out of the air, gathering itself
//   curtain stays where it is while the stage curtains part on it, a spotlight
//           snapping on (the showman's; drawn by drawCurtains in battleScene.js)

const TAU = Math.PI * 2;
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// When, in seconds from the start of its entrance, it starts coming in and
// when it lands, and how long it squashes down after.
export const ENTER_FROM = 0.35;
export const ENTER_LANDS = 1.15;
const SQUASH_SECONDS = 0.3;
// The `curtain` entrance: the stage curtains stay shut while the stage fades
// up, then part (from CURTAIN_PARTS to CURTAIN_OPEN), and he is revealed.
export const CURTAIN_PARTS = 1.0;
export const CURTAIN_OPEN = 2.1;

// How far off its spot it is, how squashed, and how see-through, `t` seconds
// into its entrance. `size` is its drawn size; `pos`, its spot.
export function entranceOffset(style, t, pos, size) {
  const home = { x: 0, y: 0, sx: 1, sy: 1, alpha: 1 };
  const u = Math.min(1, Math.max(0, (t - ENTER_FROM) / (ENTER_LANDS - ENTER_FROM)));
  const after = t - ENTER_LANDS;
  // After it lands: a squash that springs back.
  const squash = after >= 0 && after < SQUASH_SECONDS ? Math.sin((after / SQUASH_SECONDS) * Math.PI) * (1 - after / SQUASH_SECONDS) : 0;
  switch (style) {
    case 'charge':
      if (after < 0) return { ...home, x: (330 - pos.x) * (1 - u) ** 3 };
      // The skid: a lurch past its spot, then back.
      return { ...home, x: -6 * squash, sx: 1 + 0.05 * squash, sy: 1 - 0.05 * squash };
    case 'curtain':
      // He's there all along; the curtains hide him till they part.
      return home;
    case 'swoop':
      if (after < 0) return { ...home, x: 160 * (1 - u) ** 2, y: -140 * (1 - u) ** 2 + 12 * Math.sin(u * Math.PI) };
      return { ...home, y: 4 * squash };
    case 'rise':
      if (after < 0) return { ...home, y: 28 * (1 - u) ** 2, alpha: u };
      return home;
    case 'whirl': {
      if (after < 0) {
        const r = 46 * (1 - u);
        const a = u * TAU * 1.5;
        return { ...home, x: Math.cos(a) * r, y: Math.sin(a) * r * 0.45, alpha: u, sx: 0.6 + 0.4 * u };
      }
      return home;
    }
    default: // slam
      if (after < 0) return { ...home, y: -(pos.y + size.h + 12) * (1 - u * u) };
      return { ...home, sx: 1 + 0.08 * squash, sy: 1 - 0.12 * squash };
  }
}

// The colours worth throwing off an enemy: its palette, less the outline
// and anything near black or white.
export function bitColors(palette) {
  const colors = Object.values(palette).filter((hex) => {
    const n = parseInt(hex.slice(1, 7), 16);
    const light = (0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255)) / 255;
    return light > 0.18 && light < 0.95;
  });
  return colors.length ? colors : ['#ffffff'];
}

export class StageBits {
  constructor() {
    this.bits = [];
  }

  add(bit) {
    this.bits.push({ age: 0, vx: 0, vy: 0, gravity: 0, drag: 0, ...bit });
  }

  // A puff of dust: grows, slows, fades.
  puff(x, y, { vx = 0, vy = 0, r = 3, grow = 10, life = 0.6, color = '#cbbfa8' } = {}) {
    this.add({ kind: 'puff', x, y, vx, vy, r, grow, life, color, drag: 3 });
  }

  // A ring going out (squashed flat, along the ground, if `squash` < 1).
  ring(x, y, { speed = 120, life = 0.45, color = '#ffffff', width = 2, squash = 1, r = 2 } = {}) {
    this.add({ kind: 'ring', x, y, r, speed, life, color, width, squash });
  }

  spark(x, y, { vx = 0, vy = 0, gravity = 160, life = 0.6, color = '#ffffff', size = 2 } = {}) {
    this.add({ kind: 'spark', x, y, vx, vy, gravity, life, color, size });
  }

  // A burst of white light: a star, there and gone.
  star(x, y, { size = 10, life = 0.22 } = {}) {
    this.add({ kind: 'star', x, y, size, life });
  }

  // A soft light rising.
  mote(x, y, { vy = -24, life = 1.4, color = '#fff2cf', size = 2 } = {}) {
    this.add({ kind: 'mote', x, y, vy, life, color, size, sway: rand(0, TAU) });
  }

  // A chip of wood (or paint, or gold) flung off a broken thing: it spins,
  // falls, bounces on the boards at `floor` and settles, then fades.
  chip(x, y, { vx = 0, vy = 0, gravity = 300, life = 2.4, color = '#c9a06a', w = 3, h = 2, spin = 9, floor = 160, bounce = 0.35 } = {}) {
    this.add({ kind: 'chip', x, y, vx, vy, gravity, life, color, w, h, spin, floor, bounce, rot: rand(0, TAU) });
  }

  // A string let go: it whips from where it was tied (`x, y`) out along
  // `dx, dy` and curls away, fading.
  lash(x, y, { dx = 0, dy = 60, life = 0.55, color = '#e6e0d0', sway = 14 } = {}) {
    this.add({ kind: 'lash', x, y, dx, dy, life, color, sway: sway * (Math.random() < 0.5 ? -1 : 1) });
  }

  // A column of light going straight up out of `x, y`, from `y` to the top.
  beam(x, y, { life = 1.4, width = 12, color = '255, 236, 170' } = {}) {
    this.add({ kind: 'beam', x, y, life, width, color });
  }

  // Sparks flying out of `x, y` every way, in `colors`.
  scatter(x, y, count, colors, { speed = 90, gravity = 160, life = 0.7, up = 30 } = {}) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, TAU);
      const v = rand(0.4, 1) * speed;
      this.spark(x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - up, gravity, life: rand(0.6, 1) * life, color: pick(colors), size: Math.random() < 0.3 ? 3 : 2 });
    }
  }

  // Dust kicked out both ways along the ground from `x, y`, `width` wide.
  dust(x, y, width, count = 12, { color = '#cbbfa8', spray = 0 } = {}) {
    for (let i = 0; i < count; i++) {
      const side = i % 2 ? 1 : -1;
      const way = spray || side;
      this.puff(x + side * rand(0, width / 2), y - rand(0, 4), { vx: way * rand(30, 90), vy: -rand(6, 30), r: rand(2, 4), grow: rand(8, 16), life: rand(0.5, 0.9), color });
    }
  }

  update(dt) {
    for (const bit of this.bits) {
      bit.age += dt;
      bit.vy += bit.gravity * dt;
      if (bit.drag) {
        const keep = Math.max(0, 1 - bit.drag * dt);
        bit.vx *= keep;
        bit.vy *= keep;
      }
      bit.x += bit.vx * dt;
      bit.y += bit.vy * dt;
      if (bit.kind === 'chip') {
        bit.rot += bit.spin * dt;
        if (bit.y > bit.floor) {
          bit.y = bit.floor;
          bit.vy = -Math.abs(bit.vy) * bit.bounce;
          bit.vx *= 0.6;
          bit.spin *= 0.5;
          if (Math.abs(bit.vy) < 14) { bit.vy = 0; bit.vx = 0; bit.gravity = 0; bit.spin = 0; }
        }
      }
    }
    this.bits = this.bits.filter((bit) => bit.age < bit.life);
  }

  draw(ctx) {
    if (!this.bits.length) return;
    ctx.save();
    for (const bit of this.bits) {
      const left = 1 - bit.age / bit.life;
      switch (bit.kind) {
        case 'puff':
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.55 * left;
          ctx.fillStyle = bit.color;
          ctx.beginPath();
          ctx.arc(bit.x, bit.y, bit.r + bit.grow * (1 - left), 0, TAU);
          ctx.fill();
          break;
        case 'ring':
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = left;
          ctx.strokeStyle = bit.color;
          ctx.lineWidth = bit.width * (0.5 + left);
          ctx.beginPath();
          ctx.ellipse(bit.x, bit.y, bit.r + bit.speed * bit.age, (bit.r + bit.speed * bit.age) * bit.squash, 0, 0, TAU);
          ctx.stroke();
          break;
        case 'spark':
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = Math.min(1, left * 2);
          ctx.fillStyle = bit.color;
          ctx.fillRect(Math.round(bit.x), Math.round(bit.y), bit.size, bit.size);
          break;
        case 'star': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = left;
          const s = bit.size * (0.6 + 0.6 * (1 - left));
          const glow = ctx.createRadialGradient(bit.x, bit.y, 0, bit.x, bit.y, s);
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          glow.addColorStop(1, 'rgba(255, 240, 200, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(bit.x - s, bit.y - s, s * 2, s * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(bit.x - s), Math.round(bit.y), Math.round(s * 2), 1);
          ctx.fillRect(Math.round(bit.x), Math.round(bit.y - s), 1, Math.round(s * 2));
          break;
        }
        case 'chip':
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = Math.min(1, left * 3);
          ctx.save();
          ctx.translate(Math.round(bit.x), Math.round(bit.y));
          ctx.rotate(bit.rot);
          // (A dark edge, so it reads on the boards and against the dark.)
          ctx.fillStyle = '#0a0710';
          ctx.fillRect(-bit.w / 2 - 1, -bit.h / 2 - 1, bit.w + 2, bit.h + 2);
          ctx.fillStyle = bit.color;
          ctx.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
          ctx.restore();
          break;
        case 'lash': {
          const k = 1 - left;
          const reach = Math.min(1, k * 4);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = Math.min(1, left * 2.5);
          ctx.strokeStyle = bit.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bit.x, bit.y);
          ctx.quadraticCurveTo(bit.x + bit.dx * 0.5 * reach + Math.sin(k * 14) * bit.sway * left, bit.y + bit.dy * 0.5 * reach, bit.x + bit.dx * reach + bit.sway * k * 2, bit.y + bit.dy * reach - k * 30);
          ctx.stroke();
          break;
        }
        case 'beam': {
          ctx.globalCompositeOperation = 'lighter';
          const grow = Math.min(1, (1 - left) * 5);
          const w = bit.width * (0.4 + 0.6 * left) * (0.6 + 0.4 * grow);
          const g = ctx.createLinearGradient(0, bit.y, 0, 0);
          g.addColorStop(0, `rgba(${bit.color}, ${(0.75 * left).toFixed(3)})`);
          g.addColorStop(1, `rgba(${bit.color}, 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(Math.round(bit.x - w / 2), 0, Math.round(w), Math.round(bit.y));
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.5 * left).toFixed(3)})`;
          ctx.fillRect(Math.round(bit.x - w / 6), 0, Math.max(1, Math.round(w / 3)), Math.round(bit.y));
          break;
        }
        case 'mote': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(1, left * 1.6) * (0.6 + 0.4 * Math.sin(bit.age * 9 + bit.sway));
          ctx.fillStyle = bit.color;
          const x = bit.x + Math.sin(bit.age * 3 + bit.sway) * 4;
          ctx.fillRect(Math.round(x), Math.round(bit.y), bit.size, bit.size);
          ctx.globalAlpha *= 0.35;
          ctx.fillRect(Math.round(x) - 1, Math.round(bit.y) - 1, bit.size + 2, bit.size + 2);
          break;
        }
      }
    }
    ctx.restore();
  }
}
