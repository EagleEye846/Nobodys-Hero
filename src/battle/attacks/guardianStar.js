import { defineBulletArt } from '../projectiles.js';

// The Falling Star, drawn once for all three guardians (Tally, Pudding, Madam Fairweather),
// so the motif reads the same wherever it turns up: a four-pointed star, long points up and
// down and across, a white heart, a pale gold body and a soft halo round it. Only the halo and
// the outer edge pick up the guardian's own colour (the same star-glass cyan in all three).
// Two frames: the second twinkles, with the halo drawn tighter and four small diagonal rays.
//
//   defineGuardianStar('pudGlassStar', { radius: 3.4 });

const SIZE = 15;
const MID = 7;

function frame(twinkle) {
  const rows = [];
  for (let y = 0; y < SIZE; y++) {
    let row = '';
    for (let x = 0; x < SIZE; x++) {
      const dx = Math.abs(x - MID);
      const dy = Math.abs(y - MID);
      const k = (dx + 1) * (dy + 1);
      let c = '.';
      if (k <= 3) c = 'w';
      else if (k <= 5) c = 'y';
      else if (k <= 8) c = 'e';
      else if (twinkle && dx === dy && dx >= 2 && dx <= 3) c = 'y';
      else if (k <= (twinkle ? 12 : 16) && dx + dy <= 8) c = 'h';
      else if (!twinkle && k <= 22 && dx + dy <= 9) c = 'g';
      row += c;
    }
    rows.push(row);
  }
  return rows;
}

export function defineGuardianStar(name, { edge = '#5cc8ee', halo = '#9fe8ff', radius = 3, frameSeconds = 0.16 }) {
  defineBulletArt(name, {
    frames: [frame(false), frame(true)],
    palette: { w: '#ffffff', y: '#fff3b0', e: edge, h: `${halo}99`, g: `${halo}44` },
    radius,
    frameSeconds,
    rim: false,
  });
}
