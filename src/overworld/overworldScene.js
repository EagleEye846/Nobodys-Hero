import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE as T } from '../config.js';
import { Room } from './room.js';
import { Camera } from './camera.js';
import { Player } from './player.js';
import { TextBox } from '../ui/textbox.js';

// Roughly the player's chest, so the camera centres on the body rather than the feet.
const CAMERA_OFFSET_Y = -10;

// Free-roam exploration: walk around a room and read things.
export class OverworldScene {
  constructor(roomData) {
    this.room = new Room(roomData);
    const start = this.room.playerStart;
    this.player = new Player(start.x * T + T / 2, (start.y + 1) * T);
    this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.textbox = new TextBox();
  }

  update(dt, input) {
    // The textbox takes over input while it's open, so the player stands still.
    if (this.textbox.isOpen) {
      this.textbox.update(dt, input);
    } else {
      this.player.update(dt, input, this.room);
      if (input.wasPressed('confirm')) this.interact();
    }

    this.camera.follow(this.player.x, this.player.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
  }

  interact() {
    const prop = this.room.propAt(...this.player.interactionPoint());
    if (prop?.text) this.textbox.open(prop.text);
  }

  draw(ctx) {
    ctx.drawImage(this.room.background, -this.camera.x, -this.camera.y);

    // Draw lower things last so the player can stand in front of or behind props.
    const entities = [...this.room.props, this.player].sort((a, b) => a.sortY - b.sortY);
    for (const entity of entities) entity.draw(ctx, this.camera);

    this.textbox.draw(ctx);
  }
}
