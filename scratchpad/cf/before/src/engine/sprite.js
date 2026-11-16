// Builds a sprite from rows of characters, where each character is looked up in
// the palette. Characters missing from the palette (like '.') are transparent.
// This lets us keep placeholder pixel art in code until real PNGs exist in assets/.
export function makeSprite(rows, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = rows[0].length;
  canvas.height = rows.length;

  const ctx = canvas.getContext('2d');
  rows.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const color = palette[char];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });

  return canvas;
}

export function flipHorizontal(sprite) {
  const canvas = document.createElement('canvas');
  canvas.width = sprite.width;
  canvas.height = sprite.height;

  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(sprite, 0, 0);

  return canvas;
}
