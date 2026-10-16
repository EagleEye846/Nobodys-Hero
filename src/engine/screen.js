// Sets the canvas to the game's internal resolution and scales it up by the
// largest whole number that fits the window, so pixels stay square.
export function createScreen(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function fitToWindow() {
    const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / width, window.innerHeight / height)));
    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;
  }

  window.addEventListener('resize', fitToWindow);
  fitToWindow();

  return ctx;
}
