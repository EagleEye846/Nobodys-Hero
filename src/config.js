// The game world is pixel art at 320x240. Like Deltarune, it is drawn at double
// size onto a 640x480 canvas, and the UI is drawn at the full 640x480 so text
// and outlines are finer than the art.
export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 240;
export const UI_SCALE = 2;
export const UI_WIDTH = SCREEN_WIDTH * UI_SCALE;
export const UI_HEIGHT = SCREEN_HEIGHT * UI_SCALE;

export const TILE_SIZE = 16;
