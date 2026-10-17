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
import { AREA_NAMES } from '../data/areas.js';
import { SCENES } from '../data/scenes/index.js';
import { ScenePlayer } from './scenePlayer.js';
import { ITEMS, giveItem } from '../data/items.js';
import { ChapterEndScene } from '../title/chapterEndScene.js';
import { burnCandle, lightRadius } from '../data/candles.js';
import { HERO_STATE } from '../characters/heroState.js';
import { skillBonus } from '../characters/progress.js';
import { CreditsScene } from '../title/creditsScene.js';

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

// Dark rooms: the darkness is drawn onto this, with holes cut where light reaches.
let darkCanvas = null;

// The area's name card fades in, holds, then fades out.
const TITLE_FADE_SECONDS = 0.6;
const TITLE_HOLD_SECONDS = 1.8;

// Going through a door fades to black and back.
const DOOR_FADE_SECONDS = 0.3;

// A soft darkening toward the screen's edges, so the Ruins feel close and old.
let vignetteCanvas = null;
function vignette() {
  if (!vignetteCanvas) {
    vignetteCanvas = document.createElement('canvas');
    vignetteCanvas.width = SCREEN_WIDTH;
    vignetteCanvas.height = SCREEN_HEIGHT;
    const ctx = vignetteCanvas.getContext('2d');
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;
    const shade = ctx.createRadialGradient(cx, cy, SCREEN_HEIGHT * 0.45, cx, cy, SCREEN_WIDTH * 0.62);
    shade.addColorStop(0, 'rgba(6, 3, 14, 0)');
    shade.addColorStop(1, 'rgba(6, 3, 14, 0.42)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }
  return vignetteCanvas;
}

// Picks up from the last save, or starts fresh in `fallbackRoom` if there isn't one.
export function continueGame(fallbackRoom) {
  if (loadGame() && ROOMS[WORLD_STATE.room]) return new OverworldScene(ROOMS[WORLD_STATE.room], WORLD_STATE.spawn);
  return new OverworldScene(fallbackRoom);
}

// Free-roam exploration: walk around a room, read things, and get ambushed.
// `spawn` is where the player appears, in tile coordinates. `fromArea` is the
// region of the room you came from, if any.
export class OverworldScene {
  constructor(roomData, spawn = roomData.playerStart, fromArea = null) {
    this.roomData = roomData;
    this.room = new Room(roomData);
    this.player = new Player(spawn.x * T + T / 2, (spawn.y + 1) * T);
    this.unstick();
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
    // The region's name card, only when arriving from a different region.
    this.areaName = roomData.area !== fromArea ? AREA_NAMES[roomData.area] : null;
  }

  enter(game) {
    this.game = game;
    music.play(this.roomData.music ?? null);
  }

  update(dt, input) {
    this.titleTime += dt;
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
    this.fadeIn = Math.max(0, this.fadeIn - dt);

    if (this.doorway) {
      this.doorway.t += dt;
      if (this.doorway.t >= DOOR_FADE_SECONDS) {
        this.game.changeScene(new OverworldScene(ROOMS[this.doorway.door.to], this.doorway.door.spawn, this.roomData.area));
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

    // A cutscene takes over completely until it ends.
    if (this.cutscene) {
      this.cutscene.update(dt, input);
      if (this.cutscene.done) {
        const { battle, endChapter } = this.cutscene;
        this.cutscene = null;
        this.room.refreshShowsUp();
        if (battle) {
          this.storyBattle(battle);
          return;
        }
        if (endChapter) {
          const next = ROOMS[endChapter.room];
          // On to the next chapter (the skill tree grows with it), and the
          // end of a chapter saves by itself, ready to start the next one.
          WORLD_STATE.chapter = (WORLD_STATE.chapter ?? 1) + 1;
          if (next) saveGame(next.id, endChapter.spawn ?? next.playerStart);
          const goOn = next
            ? () => new OverworldScene(next, endChapter.spawn ?? next.playerStart, this.roomData.area)
            : this.game.home;
          // With `credits`, the credits roll first.
          const card = () => new ChapterEndScene(goOn);
          this.game.changeScene(endChapter.credits ? new CreditsScene(card) : card());
          return;
        }
      }
      const focus = this.cutscene?.cameraPoint ?? this.player;
      this.camera.follow(focus.x, focus.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
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
      if (this.roomData.dark) this.burnCandle(dt);
      for (const npc of this.npcs) npc.update(dt, this.player, this.room);
      if (this.player.landedThisFrame) this.handleLanding();
      if (input.wasPressed('confirm') && !this.player.isAirborne) this.interact();
      this.checkDoors();
      this.checkCutscenes();

      const foe = this.npcs.find((npc) => npc.touches(this.player));
      if (foe && !this.player.isAirborne && !this.doorway) this.battleFlash = { group: this.groupAround(foe), t: 0 };
    }

    this.camera.follow(this.player.x, this.player.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
  }

  // Stepping into a cutscene trigger plays its scene (just the first time,
  // unless the scene says `once: false`).
  checkCutscenes() {
    if (this.player.isAirborne || this.doorway || this.cutscene) return;
    const [tx, ty] = this.player.tilePosition();
    const trigger = (this.roomData.cutscenes ?? []).find((c) => tx >= c.x && tx < c.x + c.w && ty >= c.y && ty < c.y + c.h);
    if (!trigger) {
      this.lastTrigger = null;
      return;
    }
    const scene = SCENES[trigger.scene];
    if (!scene) throw new Error(`A cutscene trigger in ${this.roomData.id} plays unknown scene '${trigger.scene}'`);
    WORLD_STATE.seenScenes ??= [];
    if (scene.once !== false && WORLD_STATE.seenScenes.includes(scene.id)) return;
    // Stepping off and back on doesn't replay a repeatable scene straight away.
    if (this.lastTrigger === trigger) return;
    this.lastTrigger = trigger;
    if (!WORLD_STATE.seenScenes.includes(scene.id)) WORLD_STATE.seenScenes.push(scene.id);
    this.playCutscene(scene);
  }

  // A battle started by a cutscene (a boss, say). Afterwards, the scene named
  // by the step's `spared` or `defeated` plays, depending on how it ended, and
  // is remembered as seen, so rooms can change with it ("Shows up").
  storyBattle(step) {
    const enemy = ENEMIES[step.enemy];
    if (!enemy) throw new Error(`A cutscene starts a battle with unknown enemy '${step.enemy}'`);
    const game = this.game;
    game.changeScene(new BattleScene([enemy], (result, outcomes) => {
      if (result === 'death') {
        game.changeScene(new GameOverScene(() => continueGame(this.roomData), 'Your light flickered out.'));
        return;
      }
      game.changeScene(this);
      const state = outcomes?.[0]?.state;
      const next = state === 'pacified' ? step.spared : state === 'defeated' ? step.defeated : null;
      if (!next) return;
      WORLD_STATE.seenScenes ??= [];
      if (!WORLD_STATE.seenScenes.includes(next)) WORLD_STATE.seenScenes.push(next);
      if (SCENES[next]) this.playCutscene(SCENES[next]);
    }, this.roomData.area));
  }

  // Never leave the player stuck where they arrive (say, a door that opens onto
  // something that's appeared since): move them to the nearest open floor.
  unstick() {
    const { player, room } = this;
    const free = (x, y) => !player.collidesAt(room, x, y) && player.floorAt(room, x, y) === 0;
    if (free(player.x, player.y)) return;
    const [tx, ty] = player.tilePosition();
    for (let r = 1; r < Math.max(room.width, room.height); r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = (tx + dx) * T + T / 2;
          const y = (ty + dy + 1) * T;
          if (free(x, y)) {
            player.x = x;
            player.y = y;
            return;
          }
        }
      }
    }
  }

  // Plays a scene (from src/data/scenes/) here and now.
  playCutscene(scene) {
    this.player.moving = false;
    this.player.animationTime = 0;
    this.cutscene = new ScenePlayer(scene, this);
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
    // Stone blocks are solid all the way through: only the floor cracks.
    if (this.player.ground > 0) return;
    // Sure Foot: only every other landing cracks it.
    this.landings = (this.landings ?? 0) + 1;
    if (skillBonus('softLanding') && this.landings % 2) return;
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
    const [px, py] = this.player.interactionPoint();
    let prop = this.room.propAt(px, py);
    // Something only seen in the light isn't there for you until your light reaches it.
    if (prop && !this.inLight(prop)) prop = null;
    if (!prop) {
      this.inspectTile(Math.floor(px / T), Math.floor(py / T));
      return;
    }
    // Something up on a block is out of reach from down below.
    if (prop.raise > this.player.ground) {
      this.textbox.open([textSection('interactions/the_ruins.txt', 'out_of_reach')[0]]);
      return;
    }
    // Reading something with a "!" over it puts the "!" away, for good.
    if (prop.notice && !prop.noticed) {
      prop.noticed = true;
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push(prop.key);
    }
    // Shops are their own screen; leaving comes back here (and to the room's music).
    if (prop.shop) this.game.changeScene(new ShopScene(prop.shop, () => this.game.changeScene(this)));
    else if (prop.save) this.useSavePoint();
    else if (prop.npc) this.textbox.open(this.npcPages(prop), prop.npc);
    else if (prop.lever) this.useLever(prop);
    else if (prop.gives) this.takeGift(prop);
    else if (prop.text) this.textbox.open(textSection(this.roomData.textFile, prop.text));
  }

  // A switch: flip it, unless the gate it belongs to is already open. Gates can
  // say something when they open (`openText`) or when you get the order wrong
  // (`resetText`), from the room's text file.
  useLever(prop) {
    const say = (section, fallback) => this.textbox.open(section ? textSection(this.roomData.textFile, section) : [fallback]);
    if (this.room.props.some((gate) => gate.isOpen && gate.opensWith?.includes(prop.lever))) {
      if (prop.text) say(prop.text);
      return;
    }
    const { opened, reset } = this.room.flipLever(prop.lever);
    if (reset.length) {
      sfx('error');
      say(reset[0].resetText, 'Click... Everything resets.');
    } else if (opened.length) {
      sfx('door');
      say(opened[0].openText, 'Somewhere nearby, something grinds open.');
    } else {
      sfx(prop.on ? 'select' : 'back');
      if (prop.on && prop.text) say(prop.text);
    }
  }

  // Something with an item for you: its words, then you take it (if there's room).
  takeGift(prop) {
    const pages = prop.text ? [...textSection(this.roomData.textFile, prop.text)] : [];
    const { name } = ITEMS[prop.gives];
    if (giveItem(prop.gives)) {
      sfx('heal');
      pages.push(`You got the ${name}.`);
      WORLD_STATE.taken ??= [];
      WORLD_STATE.taken.push(prop.key);
      prop.markTaken();
    } else {
      pages.push(`You'd take the ${name}, but your bag is full.`);
    }
    this.textbox.open(pages);
  }

  // Tiles can have words too (a flower bed, a pillar, a pool of water): words
  // for that one spot (`looks`), or for every tile of its kind in the room (`tileTexts`).
  inspectTile(tx, ty) {
    const spot = (this.roomData.looks ?? []).find((look) => look.x === tx && look.y === ty);
    const section = spot?.text ?? this.roomData.tileTexts?.[this.room.tileAt(tx, ty)];
    if (section) this.textbox.open(textSection(this.roomData.textFile, section));
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
    const props = this.room.props.filter((prop) => this.inLight(prop));
    const entities = [...props, ...this.room.standing, ...this.npcs, ...(this.cutscene?.drawables ?? []), this.player].sort((a, b) => a.sortY - b.sortY);
    for (const entity of entities) entity.draw(ctx, this.camera);
    if (this.roomData.dark) this.drawDarkness(ctx);
    this.cutscene?.drawOverlay(ctx, this.camera);
    ctx.drawImage(vignette(), 0, 0);

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

  // --- Dark rooms (`dark` in the room's data: how dark, 0 to 1). ---

  // Your candle burns while you're in the dark (see src/data/candles.js).
  burnCandle(dt) {
    const event = burnCandle(dt);
    if (!event || this.textbox.isOpen) return;
    const name = (id) => ITEMS[id].name;
    if (event.lit) this.textbox.open([`It's dark here. You light the ${name(event.lit)}.`]);
    else if (event.out) {
      this.textbox.open([event.next
        ? `Your ${name(event.out)} burns down to nothing. You light the ${name(event.next)}.`
        : `Your ${name(event.out)} burns down to nothing. Only your own faint glow is left.`]);
    }
  }

  // Where your light comes from: just above your head.
  get lightPoint() {
    return { x: this.player.x, y: this.player.y - this.player.ground - Math.round(this.player.z) - 12 };
  }

  // Whether a prop can be seen: always, unless it's only `seenInLight` in a
  // dark room and your light doesn't reach it.
  inLight(prop) {
    if (!prop.seenInLight || !this.roomData.dark) return true;
    const { x, y } = this.lightPoint;
    return Math.hypot(prop.x + prop.width / 2 - x, prop.y + T / 2 - y) < lightRadius() * 0.8;
  }

  // The dark, with soft holes where light reaches: your own (flickering), and
  // every lantern, fire and crystal in the room.
  drawDarkness(ctx) {
    darkCanvas ??= Object.assign(document.createElement('canvas'), { width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    const dark = darkCanvas.getContext('2d');
    dark.globalCompositeOperation = 'source-over';
    dark.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.fillStyle = `rgba(4, 2, 10, ${this.roomData.dark})`;
    dark.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.globalCompositeOperation = 'destination-out';
    const t = performance.now() / 1000;
    const flicker = 1 + Math.sin(t * 9) * 0.03 + Math.sin(t * 23) * 0.02;
    const lights = [...this.room.lightSources(), { ...this.lightPoint, radius: lightRadius() * flicker }];
    for (const { x, y, radius } of lights) {
      const cx = x - this.camera.x;
      const cy = y - this.camera.y;
      const hole = dark.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
      hole.addColorStop(0, 'rgba(0, 0, 0, 1)');
      hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
      dark.fillStyle = hole;
      dark.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.drawImage(darkCanvas, 0, 0);
    // Your candle's warm glow on everything near you.
    const { x, y } = this.lightPoint;
    const radius = lightRadius() * flicker;
    const cx = x - this.camera.x;
    const cy = y - this.camera.y;
    const warm = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
    warm.addColorStop(0, 'rgba(255, 190, 110, 0.22)');
    warm.addColorStop(1, 'rgba(255, 190, 110, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = warm;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
    this.drawCandleGauge(ctx);
  }

  // Your lit candle and how much of it is left, in the corner.
  drawCandleGauge(ctx) {
    const lit = HERO_STATE.lit && HERO_STATE.items.includes(HERO_STATE.lit.id) ? HERO_STATE.lit : null;
    inUiSpace(ctx, () => {
      const label = lit ? ITEMS[lit.id].name : 'No candle';
      drawText(ctx, label, 16, 12, { size: 22, color: lit ? '#ffd27a' : '#8a82b0', outline: '#000' });
      if (!lit) return;
      const burn = ITEMS[lit.id].light.burn;
      const left = burn === Infinity ? 1 : Math.max(0, lit.left / burn);
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(16, 38, 100, 6);
      ctx.fillStyle = '#ffcc66';
      ctx.fillRect(16, 38, Math.round(100 * left), 6);
    });
  }

  drawBlack(ctx, alpha) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawTitleCard(ctx) {
    const name = this.areaName;
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
