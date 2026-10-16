import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE as T } from '../config.js';
import { Room } from './room.js';
import { Camera } from './camera.js';
import { Player } from './player.js';
import { Npc } from './npc.js';
import { TextBox } from '../ui/textbox.js';
import { BattleScene } from '../battle/battleScene.js';
import { GameOverScene } from '../gameOver/gameOverScene.js';
import { ROGUE_DUMMY } from '../data/enemies/dummy.js';

// Battle stats for each enemy key used in room data.
const ENEMIES = { dummy: ROGUE_DUMMY };

// Roughly the player's chest, so the camera centres on the body rather than the feet.
const CAMERA_OFFSET_Y = -10;

// After the floor breaks: how long to watch the fall, then how long to fade to black.
const FALL_SECONDS = 0.9;
const FADE_SECONDS = 0.8;

// The screen flashes this long before a battle starts.
const BATTLE_FLASH_SECONDS = 0.7;

// Free-roam exploration: walk around a room, read things, and get ambushed.
export class OverworldScene {
  constructor(roomData) {
    this.roomData = roomData;
    this.room = new Room(roomData);
    const start = this.room.playerStart;
    this.player = new Player(start.x * T + T / 2, (start.y + 1) * T);
    this.npcs = (roomData.npcs ?? []).map((npc) => new Npc(npc));
    this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.textbox = new TextBox();
    this.battleFlash = null;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    if (this.battleFlash) {
      this.battleFlash.t += dt;
      if (this.battleFlash.t >= BATTLE_FLASH_SECONDS) this.startBattle(this.battleFlash.npc);
      return;
    }

    if (this.player.isFalling) {
      this.player.update(dt, input, this.room);
      if (this.player.fallTime >= FALL_SECONDS + FADE_SECONDS) {
        this.game.changeScene(new GameOverScene(() => new OverworldScene(this.roomData)));
      }
      return;
    }

    // The textbox takes over input while it's open, so the player stands still.
    if (this.textbox.isOpen) {
      this.textbox.update(dt, input);
    } else {
      this.player.update(dt, input, this.room);
      for (const npc of this.npcs) npc.update(dt);
      if (this.player.landedThisFrame) this.handleLanding();
      if (input.wasPressed('confirm') && !this.player.isAirborne) this.interact();

      const foe = this.npcs.find((npc) => npc.touches(this.player));
      if (foe && !this.player.isAirborne) this.battleFlash = { npc: foe, t: 0 };
    }

    this.camera.follow(this.player.x, this.player.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
  }

  // Every landing cracks the tile underfoot; a fully cracked tile gives way.
  handleLanding() {
    const [tx, ty] = this.player.tilePosition();
    if (this.room.landOn(tx, ty) === 'broken') this.player.fallInto(tx, ty);
  }

  startBattle(npc) {
    const game = this.game;
    game.changeScene(new BattleScene(ENEMIES[npc.enemy], (result) => {
      if (result === 'death') {
        game.changeScene(new GameOverScene(() => new OverworldScene(this.roomData), 'You were overwhelmed by cotton.'));
        return;
      }
      // Won or spared: the enemy leaves, and the world continues where it was.
      this.npcs = this.npcs.filter((other) => other !== npc);
      this.battleFlash = null;
      game.changeScene(this);
    }));
  }

  interact() {
    const prop = this.room.propAt(...this.player.interactionPoint());
    if (prop?.text) this.textbox.open(prop.text);
  }

  draw(ctx) {
    ctx.drawImage(this.room.background, -this.camera.x, -this.camera.y);
    this.room.drawDamage(ctx, this.camera);

    // Draw lower things last so the player can stand in front of or behind others.
    const entities = [...this.room.props, ...this.npcs, this.player].sort((a, b) => a.sortY - b.sortY);
    for (const entity of entities) entity.draw(ctx, this.camera);

    this.textbox.draw(ctx);

    if (this.player.isFalling) {
      const fade = Math.min(1, Math.max(0, (this.player.fallTime - FALL_SECONDS) / FADE_SECONDS));
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    if (this.battleFlash && Math.floor(this.battleFlash.t / 0.12) % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }
}
