import { TILE_SIZE as T } from '../config.js';
import { sfx, music } from '../audio/music.js';
import { animationFrame } from '../engine/animations.js';

// A long rope hanging down a sheer face (a room's `rope`: the Long Rope out
// of Belowtown), climbed by the whole party together: you at the top, the
// others on the rope below you, each a little way behind. Walk up into the
// face at its foot to take hold. Hold UP to climb and DOWN to go back down;
// at the foot you let go and you're all standing again. At the top it's out
// into `to` (at `spawn`).
//
//   rope: { x, top, bottom, to, spawn, barks, daylight }
//     x         the column it hangs in
//     top       the row it's tied off at; climbing past it, you're out
//     bottom    the row of floor at its foot, where you take hold
//     barks     things said on the way up: { at: row, who, text }, each said
//               once as you climb past that row (who: a party member id)
//     daylight  how many rows down from the top the daylight reaches
//     music     cues for the song that's playing: { at: row, from: section },
//               each once, as you climb past that row (the old one fades out
//               under the new). The Long Rope's song climbs with you.
//
// Nobody's stuck: no falling, no hurrying. It's for the climb, not a test.

const CLIMB_SPEED = 38; // pixels a second
// How far below you each of the others climbs (pixels), in party order.
const GAP = 30;
// Hand over hand: a new grip every this many pixels.
const GRIP_PIXELS = 6;
// Waiting at the foot, the others stand to either side of the rope.
const WAIT_SIDE = 14;
// Taking hold from the side: it takes this many pixels of climbing to get to the rope.
const TAKE_HOLD = 10;
// Their climbing frames (src/data/art/finaleScenes.js): the four-frame climb,
// hanging still (+ '_hang') and waiting at the foot (+ '_ready').
const CLIMB_ANIM = { hero: 'finale_rope_hero', vesper: 'finale_rope_ves', bramble: 'finale_rope_bramble' };
const PORTRAITS = { vesper: 'vesper', bramble: 'bramble' };

// Standing at the foot of the rope, facing up into it.
export function atRopeFoot(rope, player) {
  return Math.floor(player.x / T) === rope.x && Math.floor((player.y - 1) / T) === rope.bottom && player.facing === 'up';
}

// The daylight falling down the shaft from the top: warm and strong up
// there, nothing by `daylight` rows down. Drawn over the room.
export function drawDaylightFromAbove(ctx, camera, rope) {
  const bottom = rope.daylight * T - camera.y;
  if (bottom <= 0) return;
  const g = ctx.createLinearGradient(0, -camera.y, 0, bottom);
  g.addColorStop(0, 'rgba(255, 236, 190, 0.6)');
  g.addColorStop(0.5, 'rgba(255, 220, 160, 0.28)');
  g.addColorStop(1, 'rgba(255, 210, 150, 0)');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.max(0, -camera.y), ctx.canvas.width, bottom - Math.max(0, -camera.y));
  ctx.restore();
}

// The rope itself, hanging from its top down to its foot, with a knot every
// tile and a slight sway. Drawn on the face, behind everyone.
export function drawHangingRope(ctx, camera, rope, time) {
  const x = (rope.x + 0.5) * T - camera.x;
  const top = rope.top * T - camera.y;
  const foot = (rope.bottom + 1) * T - 2 - camera.y;
  ctx.save();
  for (let y = Math.max(top, -2); y < Math.min(foot, 260); y++) {
    const sway = Math.round(Math.sin(time * 0.9 + (y + camera.y) * 0.02) * ((foot - y) / (foot - top + 1)) * 1.2);
    ctx.fillStyle = '#120c1c';
    ctx.fillRect(Math.round(x) - 2 + sway, Math.round(y), 4, 1);
    ctx.fillStyle = (Math.floor(y + camera.y) % 4) < 2 ? '#c8a46a' : '#a07c48';
    ctx.fillRect(Math.round(x) - 1 + sway, Math.round(y), 2, 1);
    if (Math.floor(y + camera.y) % T === 0) {
      ctx.fillStyle = '#7a5a32';
      ctx.fillRect(Math.round(x) - 2 + sway, Math.round(y), 4, 2);
    }
  }
  // The coil at the foot.
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(Math.round(x) - 6, Math.round(foot) - 1, 12, 4);
  ctx.fillStyle = '#c8a46a';
  ctx.fillRect(Math.round(x) - 5, Math.round(foot), 10, 2);
  ctx.restore();
}

export class RopeClimb {
  constructor(rope, player, followers) {
    this.rope = rope;
    this.player = player;
    this.followers = followers;
    this.x = (rope.x + 0.5) * T;
    this.foot = (rope.bottom + 1) * T;
    this.topY = (rope.top + 1) * T;
    // How far up you are: your feet.
    this.y = this.foot;
    this.climbed = 0;
    this.said = new Set();
    this.done = null;
    this.time = 0;
    // Seconds since you last moved: they hang still a moment after you stop.
    this.still = 1;
    for (const follower of followers) follower.hidden = true;
    this.player.facing = 'up';
    sfx('hook');
  }

  // Everyone on (or at the foot of) the rope: you, then the others below.
  get climbers() {
    return [
      { id: 'hero', y: this.y, side: 0 },
      ...this.followers.map((f, i) => ({ id: f.id, y: Math.min(this.foot, this.y + GAP * (i + 1)), side: i % 2 ? 1 : -1 })),
    ];
  }

  update(dt, input, textbox) {
    this.time += dt;
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    this.still = dy ? 0 : this.still + dt;
    if (dy) {
      const was = this.y;
      this.y = Math.min(this.foot, this.y + dy * CLIMB_SPEED * dt);
      this.climbed += Math.abs(this.y - was);
      if (Math.floor(this.climbed / GRIP_PIXELS) !== Math.floor((this.climbed - Math.abs(this.y - was)) / GRIP_PIXELS) && Math.floor(this.climbed / GRIP_PIXELS) % 3 === 0) sfx('creak');
    }
    this.player.x = this.x;
    this.player.y = this.y;
    // Back at the foot, and still heading down: let go.
    if (dy > 0 && this.y >= this.foot) {
      this.done = 'foot';
      return;
    }
    if (this.y <= this.topY - T) {
      this.done = 'top';
      return;
    }
    const row = Math.floor((this.y - 1) / T);
    // The song moving on with you.
    const cue = (this.rope.music ?? []).find((c, i) => !this.said.has(`music${i}`) && row <= c.at);
    if (cue) {
      this.said.add(`music${this.rope.music.indexOf(cue)}`);
      if (music.songName) music.play(music.songName, music.ambienceWanted ?? null, cue.from);
    }
    // Something said on the way up.
    const bark = (this.rope.barks ?? []).find((b, i) => !this.said.has(i) && row <= b.at && this.followers.some((f) => f.id === b.who));
    if (bark) {
      this.said.add(this.rope.barks.indexOf(bark));
      textbox.open(String(bark.text).split(/\n\s*\n/), PORTRAITS[bark.who] ?? null);
    }
  }

  // Sorted with everything else by the lowest of you.
  get sortY() {
    return Math.max(...this.climbers.map((c) => c.y));
  }

  draw(ctx, camera) {
    const hanging = this.still > 0.12;
    for (const c of [...this.climbers].reverse()) {
      const gone = this.foot - c.y;
      const onRope = gone > 1;
      const index = this.climbers.indexOf(c);
      let frame;
      if (onRope && hanging) {
        // Hanging on, swaying a little, a foot swinging.
        frame = animationFrame(`${CLIMB_ANIM[c.id]}_hang`, this.time + index * 0.7, 0.9);
      } else if (onRope) {
        // Hand over hand, as far as each has climbed.
        frame = animationFrame(CLIMB_ANIM[c.id], Math.floor(gone / GRIP_PIXELS), 1);
      } else if (c.id !== 'hero') {
        frame = animationFrame(`${CLIMB_ANIM[c.id]}_ready`, this.time + index * 0.4, 0.5);
      }
      if (c.id === 'hero' && !onRope) {
        this.player.drawBody(ctx, camera);
        continue;
      }
      if (!frame) continue;
      // From beside the rope onto it, then swaying a little as they hang.
      const side = c.side * WAIT_SIDE * Math.max(0, 1 - gone / TAKE_HOLD);
      const sway = onRope && hanging ? Math.round(Math.sin(this.time * 1.6 + index * 1.3)) : 0;
      const x = Math.round(this.x + side + sway) - camera.x;
      ctx.drawImage(frame, x - Math.floor(frame.width / 2), Math.round(c.y) - frame.height - camera.y);
    }
  }
}
