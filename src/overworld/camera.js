export class Camera {
  constructor(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.x = 0;
    this.y = 0;
  }

  // Centres on the target, clamped so the view never shows past the room's edges.
  // A room smaller than the screen is centred instead.
  follow(targetX, targetY, worldWidth, worldHeight) {
    this.x = clampToWorld(targetX - this.viewWidth / 2, worldWidth, this.viewWidth);
    this.y = clampToWorld(targetY - this.viewHeight / 2, worldHeight, this.viewHeight);
  }
}

function clampToWorld(position, worldSize, viewSize) {
  if (worldSize <= viewSize) return Math.floor((worldSize - viewSize) / 2);
  return Math.round(Math.min(Math.max(position, 0), worldSize - viewSize));
}
