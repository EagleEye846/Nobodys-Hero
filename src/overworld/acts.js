// Little things people do with their whole body, out in the world: a hop, a
// start, a look about, a nod, a shake of the head, a shiver, a sigh, a lunge,
// crouching down and standing back up. A cutscene's `act` step plays one (on
// you, an actor, or anyone following you), the hero glances about on their
// own when left standing a while, and enemies lunge as they catch you.
//
// None of it needs new frames: an act is a pose, worked out from the time
// since it started, that moves, lifts or squashes whatever frame they're
// showing anyway, or shows them facing another way for a moment.

export const ACTS = {
  hop: 'A little hop',
  startle: 'Jump with a start (with a "!")',
  look: 'Look about, this way and that',
  nod: 'Nod',
  shake: 'Shake their head',
  shiver: 'Shiver',
  sigh: 'Sigh (shoulders drop)',
  lunge: 'Lunge forward',
  crouch: 'Crouch down (stays down)',
  stand: 'Stand back up',
};

// How long each one takes, in seconds.
const LENGTH = { hop: 0.38, startle: 0.42, look: 1.4, nod: 0.62, shake: 0.62, shiver: 0.9, sigh: 1.1, lunge: 0.42, crouch: 0.2, stand: 0.24 };
// How low a crouch goes, and how much wider it squashes.
const CROUCH = { sx: 1.1, sy: 0.8 };

export const actLength = (name) => LENGTH[name] ?? 0;

// A new act for someone, starting now (`now` in seconds, performance time).
// `toward` (a direction, { x, y } of length 1) is the way a lunge goes, if
// not the way they face.
export function startAct(name, now, facing = 'down', toward = null) {
  if (!LENGTH[name]) throw new Error(`Unknown act '${name}'`);
  return { name, start: now, facing, toward };
}

// Which way to glance while looking about: either side, from facing you or
// away; from side-on, toward you and back the other way.
const GLANCES = { down: ['left', 'right'], up: ['left', 'right'], left: ['down', 'right'], right: ['down', 'left'] };

const ease = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 2;
const hump = (k) => Math.sin(Math.min(1, Math.max(0, k)) * Math.PI);

// The pose `act` puts them in at `now`: moved sideways (`dx`), up (`lift`),
// `forward` the way they face, squashed (`sx`, `sy`, about their feet), and
// facing some other way for now (`look`), or null once it's over. A crouch
// holds its last pose until they stand.
export function actPose(act, now) {
  if (!act) return null;
  const t = now - act.start;
  const length = LENGTH[act.name];
  const k = t / length;
  const pose = { dx: 0, lift: 0, forward: 0, sx: 1, sy: 1, look: null, toward: act.toward };
  if (t >= length && act.name !== 'crouch') return null;
  switch (act.name) {
    case 'hop':
      // Squat, up, and squash a little as they land.
      if (k < 0.15) { pose.sx = 1.08; pose.sy = 0.9; } else if (k < 0.85) pose.lift = Math.round(hump((k - 0.15) / 0.7) * 5);
      else { pose.sx = 1.1; pose.sy = 0.9; }
      break;
    case 'startle':
      // Straight up, stretched tall with the fright, and down hard.
      if (k < 0.7) { pose.lift = Math.round(hump(k / 0.7) * 7); pose.sx = 0.92; pose.sy = 1.1; } else { pose.sx = 1.12; pose.sy = 0.88; }
      break;
    case 'look': {
      const [a, b] = GLANCES[act.facing] ?? GLANCES.down;
      pose.look = k < 0.12 ? null : k < 0.45 ? a : k < 0.8 ? b : null;
      break;
    }
    case 'nod':
      // Twice: a dip of the head (the top squashes down a pixel or two).
      pose.sy = 1 - 0.08 * hump((k * 2) % 1);
      break;
    case 'shake':
      pose.dx = Math.round(Math.sin(k * Math.PI * 6) * 1.2 * (1 - k * 0.5));
      pose.look = act.facing === 'down' || act.facing === 'up' ? (Math.sin(k * Math.PI * 6) > 0.5 ? 'right' : Math.sin(k * Math.PI * 6) < -0.5 ? 'left' : null) : null;
      break;
    case 'shiver':
      pose.dx = Math.floor(t * 30) % 2 ? 1 : 0;
      pose.sy = 1 - 0.03 * (Math.floor(t * 15) % 2);
      break;
    case 'sigh':
      // Shoulders up with the breath in, then down further, then back.
      pose.sy = 1 + 0.04 * hump(k / 0.35) - 0.07 * hump((k - 0.35) / 0.65);
      pose.sx = 1 + 0.03 * hump((k - 0.35) / 0.65);
      break;
    case 'lunge':
      // Lean back, then throw themselves forward, and settle.
      pose.forward = k < 0.25 ? -Math.round(ease(k / 0.25) * 2) : Math.round(hump((k - 0.25) / 0.75) * 7);
      pose.lift = k > 0.25 ? Math.round(hump((k - 0.25) / 0.75) * 3) : 0;
      if (k < 0.25) { pose.sx = 1.06; pose.sy = 0.94; }
      break;
    case 'crouch': {
      const c = ease(k);
      pose.sx = 1 + (CROUCH.sx - 1) * c;
      pose.sy = 1 + (CROUCH.sy - 1) * c;
      break;
    }
    case 'stand': {
      // Up out of a crouch, a touch too far, and settled.
      const c = ease(k);
      pose.sx = CROUCH.sx + (1 - CROUCH.sx) * c;
      pose.sy = CROUCH.sy + (1 - CROUCH.sy) * c + 0.05 * hump(k);
      break;
    }
    default:
      break;
  }
  return pose;
}

// `forward` turned into pixels the way they're facing (or going: `toward`).
export function poseOffset(pose, facing) {
  if (!pose) return { x: 0, y: 0 };
  const f = pose.forward;
  const way = pose.toward ? [pose.toward.x, pose.toward.y] : { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[facing] ?? [0, 0];
  return { x: Math.round(pose.dx + way[0] * f), y: Math.round(way[1] * f - pose.lift) };
}

// Draws `frame` with its feet at (cx, feetY), squashed about its feet by
// `sx`, `sy`. Whole pixels throughout, so it stays crisp.
export function drawPosed(ctx, frame, cx, feetY, sx = 1, sy = 1) {
  if (sx === 1 && sy === 1) {
    ctx.drawImage(frame, Math.round(cx - Math.floor(frame.width / 2)), Math.round(feetY - frame.height));
    return;
  }
  const w = Math.max(1, Math.round(frame.width * sx));
  const h = Math.max(1, Math.round(frame.height * sy));
  ctx.drawImage(frame, Math.round(cx - w / 2), Math.round(feetY - h), w, h);
}
