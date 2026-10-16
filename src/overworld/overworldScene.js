import { SCREEN_WIDTH, SCREEN_HEIGHT, UI_WIDTH, TILE_SIZE as T } from '../config.js';
import { Room } from './room.js';
import { Camera } from './camera.js';
import { Player } from './player.js';
import { Npc } from './npc.js';
import { TextBox } from '../ui/textbox.js';
import { PauseMenu } from '../ui/pauseMenu.js';
import { drawText } from '../ui/text.js';
import { textFile, textSection } from '../engine/textLoader.js';
import { inUiSpace } from '../engine/screen.js';
import { music, sfx } from '../audio/music.js';
import { WORLD_STATE, saveGame, loadGame } from '../state/saveGame.js';
import { BattleScene } from '../battle/battleScene.js';
import { ShopScene } from '../shop/shopScene.js';
import { GameOverScene } from '../gameOver/gameOverScene.js';
import { ROOMS } from '../data/rooms/index.js';
// Every enemy by id (its file name in src/data/enemies/); rooms' `enemy` refers to these.
import { ENEMIES } from '../data/enemies/index.js';

// Enemies this close (in world pixels) to the one you touch join the fight, up to MAX_GROUP in all.
const GROUP_RADIUS = 64;
const MAX_GROUP = 3;

// Roughly the player's chest, so the camera centres on the body rather than the feet.
const CAMERA_OFFSET_Y = -10;

// After the floor breaks: how long to watch the fall, then how long to fade to black.
const FALL_SECONDS = 0.9;
const FADE_SECONDS = 0.8;

// The screen flashes this long before a battle starts.
const BATTLE_FLASH_SECONDS = 0.7;

// The area's name card fades in, holds, then fades out.
const TITLE_FADE_SECONDS = 0.6;
const TITLE_HOLD_SECONDS = 1.8;

// Going through a door fades to black and back.
const DOOR_FADE_SECONDS = 0.3;

// Picks up from the last save, or starts fresh in `fallbackRoom` if there isn't one.
export function continueGame(fallbackRoom) {
  if (loadGame() && ROOMS[WORLD_STATE.room]) return new OverworldScene(ROOMS[WORLD_STATE.room], WORLD_STATE.spawn);
  return new OverworldScene(fallbackRoom);
}

// Free-roam exploration: walk around a room, read things, and get ambushed.
// `spawn` is where the player appears, in tile coordinates.
export class OverworldScene {
  constructor(roomData, spawn = roomData.playerStart) {
    this.roomData = roomData;
    this.room = new Room(roomData);
    this.player = new Player(spawn.x * T + T / 2, (spawn.y + 1) * T);
    // Each enemy has a key, so a beaten one stays gone even after leaving the room.
    this.npcs = (roomData.npcs ?? [])
      .map((data, i) => Object.assign(new Npc(data), { key: `${roomData.id}:${i}` }))
      .filter((npc) => !WORLD_STATE.defeated.includes(npc.key));
    this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.textbox = new TextBox();
    this.pauseMenu = new PauseMenu();
    this.battleFlash = null;
    this.doorway = null;
    this.fadeIn = DOOR_FADE_SECONDS;
    this.titleTime = 0;
  }

  enter(game) {
    this.game = game;
    music.play(this.roomData.music ?? null);
  }

  update(dt, input) {
    this.titleTime += dt;
    this.fadeIn = Math.max(0, this.fadeIn - dt);

    if (this.doorway) {
      this.doorway.t += dt;
      if (this.doorway.t >= DOOR_FADE_SECONDS) {
        this.game.changeScene(new OverworldScene(ROOMS[this.doorway.door.to], this.doorway.door.spawn));
      }
      return;
    }

    if (this.battleFlash) {
      this.battleFlash.t += dt;
      if (this.battleFlash.t >= BATTLE_FLASH_SECONDS) this.startBattle(this.battleFlash.group);
      return;
    }

    if (this.player.isFalling) {
      this.player.update(dt, input, this.room);
      if (this.player.fallTime >= FALL_SECONDS + FADE_SECONDS) {
        this.game.changeScene(new GameOverScene(() => continueGame(this.roomData)));
      }
      return;
    }

    // Menus and the textbox take over input while open, so the player stands still.
    if (this.pauseMenu.isOpen) {
      this.pauseMenu.update(input);
    } else if (this.textbox.isOpen) {
      this.textbox.update(dt, input);
    } else if (input.wasPressed('menu') && !this.player.isAirborne) {
      sfx('select');
      this.pauseMenu.open();
    } else {
      this.player.update(dt, input, this.room);
      for (const npc of this.npcs) npc.update(dt);
      if (this.player.landedThisFrame) this.handleLanding();
      if (input.wasPressed('confirm') && !this.player.isAirborne) this.interact();
      this.checkDoors();

      const foe = this.npcs.find((npc) => npc.touches(this.player));
      if (foe && !this.player.isAirborne && !this.doorway) this.battleFlash = { group: this.groupAround(foe), t: 0 };
    }

    this.camera.follow(this.player.x, this.player.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
  }

  // Stepping onto a door's tiles starts the fade into the next room.
  checkDoors() {
    if (this.player.isAirborne) return;
    const [tx, ty] = this.player.tilePosition();
    const door = (this.roomData.doors ?? []).find((d) => tx >= d.x && tx < d.x + d.w && ty >= d.y && ty < d.y + d.h);
    if (!door) return;
    if (!ROOMS[door.to]) throw new Error(`A door in ${this.roomData.id} leads to unknown room '${door.to}'`);
    sfx('door');
    this.doorway = { door, t: 0 };
  }

  // Every landing cracks the tile underfoot; a fully cracked tile gives way.
  handleLanding() {
    const [tx, ty] = this.player.tilePosition();
    if (this.room.landOn(tx, ty) === 'broken') this.player.fallInto(tx, ty);
  }

  // The enemy you touched, plus the nearest others close enough to join in.
  groupAround(foe) {
    const nearby = this.npcs
      .filter((npc) => npc !== foe && npc.cooldown <= 0 && Math.hypot(npc.x - foe.x, npc.y - foe.y) <= GROUP_RADIUS)
      .sort((a, b) => Math.hypot(a.x - foe.x, a.y - foe.y) - Math.hypot(b.x - foe.x, b.y - foe.y));
    return [foe, ...nearby].slice(0, MAX_GROUP);
  }

  startBattle(group) {
    const game = this.game;
    const onEnd = (result) => {
      if (result === 'death') {
        game.changeScene(new GameOverScene(() => continueGame(this.roomData), 'Your light flickered out.'));
        return;
      }
      // Fled: the enemies stay, but can't start another fight straight away.
      // Won: every enemy in the fight was beaten or pacified, and they're gone
      // for good. Either way the world continues where it was.
      for (const npc of group) {
        if (result === 'fled') {
          npc.startCooldown();
        } else {
          this.npcs = this.npcs.filter((other) => other !== npc);
          WORLD_STATE.defeated.push(npc.key);
        }
      }
      this.battleFlash = null;
      game.changeScene(this);
    };
    game.changeScene(new BattleScene(group.map((npc) => ENEMIES[npc.enemy]), onEnd, this.roomData.area));
  }

  interact() {
    const prop = this.room.propAt(...this.player.interactionPoint());
    if (!prop) return;
    // Shops are their own screen; leaving comes back here (and to the room's music).
    if (prop.shop) this.game.changeScene(new ShopScene(prop.shop, () => this.game.changeScene(this)));
    else if (prop.save) this.useSavePoint();
    else if (prop.npc) this.textbox.open(this.npcPages(prop), prop.npc);
    else if (prop.text) this.textbox.open(textSection(this.roomData.textFile, prop.text));
  }

  // Saves the game where the player is standing.
  useSavePoint() {
    const [x, y] = this.player.tilePosition();
    const saved = saveGame(this.roomData.id, { x, y });
    sfx('save');
    this.textbox.open(textSection(this.roomData.textFile, saved ? 'save_point' : 'save_failed'));
  }

  // An NPC says their [first] lines once, then their [repeat] lines (if they have any).
  npcPages(prop) {
    const path = `npcs/${prop.npc}.txt`;
    const repeat = textFile(path).repeat;
    const pages = prop.talkedTo && repeat ? repeat : textSection(path, 'first');
    prop.talkedTo = true;
    return pages;
  }

  draw(ctx) {
    ctx.drawImage(this.room.background, -this.camera.x, -this.camera.y);
    this.room.drawDamage(ctx, this.camera);

    // Draw lower things last so the player can stand in front of or behind others.
    const entities = [...this.room.props, ...this.npcs, this.player].sort((a, b) => a.sortY - b.sortY);
    for (const entity of entities) entity.draw(ctx, this.camera);

    this.textbox.draw(ctx);
    this.pauseMenu.draw(ctx);
    this.drawTitleCard(ctx);

    if (this.player.isFalling) {
      const fade = Math.min(1, Math.max(0, (this.player.fallTime - FALL_SECONDS) / FADE_SECONDS));
      this.drawBlack(ctx, fade);
    }
    if (this.doorway) this.drawBlack(ctx, this.doorway.t / DOOR_FADE_SECONDS);
    if (this.fadeIn > 0) this.drawBlack(ctx, this.fadeIn / DOOR_FADE_SECONDS);

    if (this.battleFlash && Math.floor(this.battleFlash.t / 0.12) % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }

  drawBlack(ctx, alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawTitleCard(ctx) {
    const name = this.roomData.name;
    const fadeOutStart = TITLE_FADE_SECONDS + TITLE_HOLD_SECONDS;
    if (!name || this.titleTime >= fadeOutStart + TITLE_FADE_SECONDS) return;

    const fadeIn = this.titleTime / TITLE_FADE_SECONDS;
    const fadeOut = 1 - (this.titleTime - fadeOutStart) / TITLE_FADE_SECONDS;
    inUiSpace(ctx, () => {
      ctx.globalAlpha = Math.max(0, Math.min(1, fadeIn, fadeOut));
      drawText(ctx, name, UI_WIDTH / 2, 56, { size: 64, align: 'center', shadow: '#120a20' });
    });
  }
}
