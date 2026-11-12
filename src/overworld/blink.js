// Blinking: the hero, Ves and Bramble shut their eyes for a moment every few
// seconds (now and then twice), walking or standing, so a face left on screen
// never looks painted on.
//
// Nothing is redrawn by hand. The eyes are found in each frame the first time
// it's shown: a dark pixel (the outline's colour, or the hero's eye colour)
// with skin on both sides of it. The blink copy of the frame has each of them
// turned to skin, the bottom one of a tall eye a shade darker (the lid). A
// frame with no eyes in it (from behind, a scene's own animation) has no copy
// and is drawn as it is. Copies are made once a frame and kept.
//
//   blinkFrame(image, body)   the frame to draw for `body` this moment

const EYES = new Set([0x120c1c, 0x1b1428]);
// Every party member's skin (the hero's, and Ves's and Bramble's).
const SKIN = new Set([0xf1c49a, 0xf2d6b0]);

// How long a blink lasts, and how long between them.
const SHUT = 0.11;
const EVERY = [2.6, 5.4];
// A second blink straight after the first, this often.
const DOUBLE = 0.22;

const copies = new WeakMap();
const timers = new WeakMap();
const now = () => performance.now() / 1000;

// The frame `image` with its eyes shut, or null if it has none (made once a frame).
export function shutCopy(image) {
  if (copies.has(image)) return copies.get(image);
  let copy = null;
  try {
    const w = image.width;
    const h = image.height;
    const src = document.createElement('canvas');
    src.width = w;
    src.height = h;
    const sctx = src.getContext('2d');
    sctx.drawImage(image, 0, 0);
    const pixels = sctx.getImageData(0, 0, w, h);
    const d = pixels.data;
    const rgb = (x, y) => (x < 0 || y < 0 || x >= w || y >= h || d[(y * w + x) * 4 + 3] < 200 ? -1
      : (d[(y * w + x) * 4] << 16) | (d[(y * w + x) * 4 + 1] << 8) | d[(y * w + x) * 4 + 2]);
    const isEye = (x, y) => EYES.has(rgb(x, y)) && SKIN.has(rgb(x - 1, y)) && SKIN.has(rgb(x + 1, y));
    const eyes = [];
    // (Only the top half: eyes are in the head, and a dark stripe between
    // two patches of skin lower down would be a hand or a knee.)
    for (let y = 0; y < Math.ceil(h * 0.6); y++) for (let x = 1; x < w - 1; x++) if (isEye(x, y)) eyes.push([x, y]);
    // More than a few is not a face (a pattern of some kind): leave it alone.
    if (eyes.length && eyes.length <= 6) {
      for (const [x, y] of eyes) {
        const skin = rgb(x - 1, y);
        // The lowest pixel of an eye is the shut lid, a little darker than the skin.
        const lid = !eyes.some(([ex, ey]) => ex === x && ey === y + 1);
        const k = lid ? 0.78 : 1;
        const i = (y * w + x) * 4;
        d[i] = Math.round(((skin >> 16) & 255) * k);
        d[i + 1] = Math.round(((skin >> 8) & 255) * k);
        d[i + 2] = Math.round((skin & 255) * k);
      }
      sctx.putImageData(pixels, 0, 0);
      copy = src;
    }
  } catch {
    copy = null;
  }
  copies.set(image, copy);
  return copy;
}

// Whether `body`'s eyes are shut just now (each keeps its own time).
function shut(body) {
  const t = now();
  let timer = timers.get(body);
  if (!timer) {
    timer = { next: t + EVERY[0] * Math.random() + 0.8, again: false };
    timers.set(body, timer);
  }
  if (t < timer.next) return false;
  if (t < timer.next + SHUT) return true;
  // Over: the next one, straight after (a double blink) or a while off.
  if (!timer.again && Math.random() < DOUBLE) {
    timer.again = true;
    timer.next = t + 0.12;
  } else {
    timer.again = false;
    timer.next = t + EVERY[0] + Math.random() * (EVERY[1] - EVERY[0]);
  }
  return false;
}

export function blinkFrame(image, body) {
  if (!image || !body || !shut(body)) return image;
  return shutCopy(image) ?? image;
}
