// Sets the canvas to the full UI resolution and scales it to fit the window.
// Scales go in half steps so each world pixel (2 canvas pixels) stays a whole
// number of screen pixels.
export function createScreen(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function fitToWindow() {
    const fit = Math.min(window.innerWidth / width, window.innerHeight / height);
    const scale = Math.max(0.5, Math.floor(fit * 2) / 2);
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;
  }

  window.addEventListener('resize', fitToWindow);
  fitToWindow();

  return ctx;
}

// Scenes draw in world coordinates (320x240). Wrap UI drawing in this to use
// full-resolution canvas coordinates (640x480) instead.
export function inUiSpace(ctx, draw) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  draw();
  ctx.restore();
}
