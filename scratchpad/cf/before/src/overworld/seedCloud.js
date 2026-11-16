import { Updraft } from './windGeyser.js';

// A seed cloud: a dandelion gone to seed, blown into the air. It is an
// updraft (windGeyser.js: step on it and it tosses you to tile `to`), drawn as
// a drifting swirl of white seed parachutes instead of wind, and only there
// while its `when` switch is on (a high seed-clock lever that Ves puffs at).
//
//   gusts: [{ x: 11, y: 8, to: { x: 14, y: 8 }, seeds: true, when: 'clock_a' }]
//
// Without `when` it is always there.
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const SEEDS = 40;

export class SeedCloud extends Updraft {
  constructor(data, room) {
    super(data);
    this.when = data.when ?? null;
    this.room = room;
    this.turnedOn = null;
    this.rise = 0;
  }

  get isOn() {
    return !this.when || this.room.isLeverOn(this.when);
  }

  draw(ctx, camera, time = performance.now() / 1000) {
    if (!this.isOn) {
      this.turnedOn = null;
      return;
    }
    this.turnedOn ??= time;
    // The cloud swells in over the first half second.
    const grow = 0.35 + 0.65 * Math.min(1, (time - this.turnedOn) / 0.5);
    const cx = this.x - camera.x;
    const base = this.y - camera.y;
    // A soft pale puff on the ground it blows from.
    for (let r = 9; r > 0; r -= 3) {
      ctx.fillStyle = `rgba(255, 252, 238, ${(0.16 * grow).toFixed(3)})`;
      ctx.fillRect(Math.round(cx - r), Math.round(base - r * 0.45), r * 2, Math.round(r * 0.9));
    }
    for (let i = 0; i < SEEDS; i++) {
      const t = (time * (0.32 + hash(i) * 0.2) + hash(i + 50)) % 1;
      const angle = time * (1.6 + hash(i + 9)) + i * 2.4;
      const spread = 3 + t * 13 * (0.5 + hash(i + 3));
      const x = cx + Math.cos(angle) * spread;
      const y = base - 3 - t * 46 * grow;
      const a = Math.sin(t * Math.PI) * 0.95 * grow;
      if (a < 0.05) continue;
      // The seed: a small tuft of white fluff with a dark speck below it.
      const sx = Math.round(x);
      const sy = Math.round(y);
      ctx.fillStyle = `rgba(150, 120, 80, ${a.toFixed(3)})`;
      ctx.fillRect(sx, sy + 3, 1, 2);
      ctx.fillStyle = `rgba(255, 255, 250, ${a.toFixed(3)})`;
      ctx.fillRect(sx - 2, sy, 5, 1);
      ctx.fillRect(sx - 1, sy - 1, 3, 3);
      ctx.fillStyle = `rgba(214, 222, 214, ${(a * 0.8).toFixed(3)})`;
      ctx.fillRect(sx - 1, sy + 2, 3, 1);
    }
  }
}
