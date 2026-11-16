// Small seeded noise, shared by the overworld's and the battles' painters.
// Same input, same number in [0, 1), every frame: the way the pictures stay
// put while they're drawn fresh. Two families with different constants: keep
// each file on the one it was drawn with, or its picture changes.

export const fract = (x) => x - Math.floor(x);

// The weather, life and touches family (atmosphere.js, liveliness.js, touches.js).
export const hash = (n) => fract(Math.sin(n * 91.7 + 17.3) * 43758.5453);

// The vistas' and backdrops' family (seaVista.js, coastBackdrops.js, corrieStage.js).
export const vistaHash = (n) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
