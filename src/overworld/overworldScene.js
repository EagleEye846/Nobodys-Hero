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
import { AREA_NAMES, OUTDOOR_AREAS } from '../data/areas.js';
import { SCENES } from '../data/scenes/index.js';
import { ScenePlayer } from './scenePlayer.js';
import { Climb, findClimb } from './climbing.js';
import { drawVista } from './vista.js';
import { drawSnow, drawCirclingBirds, drawWisps } from './weather.js';
import { daylight } from './daylight.js';
import { heroFrame } from '../characters/hero.js';
import { healHeroFully } from '../characters/progress.js';
import { Follower } from './follower.js';
import { MEMBERS, partyIds, joinParty } from '../characters/party.js';
import { ITEMS, giveItem } from '../data/items.js';
import { ARMOR } from '../data/armor.js';
import { WEAPONS } from '../data/weapons.js';
import { GEAR, hasGear, giveGear } from '../data/gear.js';
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

// Where the gear's words live (getting it, and rings you can't use yet).
const GEAR_TEXT = 'interactions/gear.txt';

// After the floor breaks: how long to watch the fall, then how long to fade to black.
const FALL_SECONDS = 0.9;
const FADE_SECONDS = 0.8;

// The screen flashes this long before a battle starts.
const BATTLE_FLASH_SECONDS = 0.7;

// Dark rooms: the darkness is drawn onto this, with holes cut where light reaches.
let darkCanvas = null;

// Footprints in the snow last this long, and come every so many pixels walked.
const PRINT_SECONDS = 70;
const PRINT_STRIDE = 7;
const MAX_PRINTS = 160;
// Night darkens the outdoors this much at most, in a blue, not a black.
const NIGHT_SHADE = 0.44;
const NIGHT_TINT = '8, 12, 40';

// The area's name card fades in, holds, then fades out.
const TITLE_FADE_SECONDS = 0.6;
const TITLE_HOLD_SECONDS = 1.8;

// Going through a door fades to black and back.
const DOOR_FADE_SECONDS = 0.3;

// A night at an inn: the room fades to black, you sleep, and it comes back.
const REST_FADE_SECONDS = 1.1;
const REST_SLEEP_SECONDS = 1.6;
// The cutscene that plays while you sleep at an inn, if one by this name
// exists in src/data/scenes/ (a bed can name its own with `dream`).
const DEFAULT_DREAM = 'inn_dream';

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
  // `arrival` says how you came in: through a door marked `climb`, the rope
  // hooks the next ring straight away, with the `swing` you had (see tryClimb).
  constructor(roomData, spawn = roomData.playerStart, fromArea = null, arrival = {}) {
    this.roomData = roomData;
    this.room = new Room(roomData);
    this.player = new Player(spawn.x * T + T / 2, (spawn.y + 1) * T);
    this.unstick();
    if (arrival.climb) {
      this.player.facing = 'up';
      this.pendingClimb = arrival;
    }
    // Whoever's in the party arrives with you.
    this.followers = partyIds().map((id) => new Follower(id, this.player.x, this.player.y));
    // Weather and the view off the mountain are drawn from the room's data.
    this.time = 0;
    // Small things that make the cold feel cold: footprints you leave in the
    // snow, your breath, snow kicked up when you land, pebbles knocked loose
    // on a climb, and snow settling on you if you stand still in it.
    this.prints = [];
    this.particles = [];
    this.strideSince = 0;
    this.printSide = 1;
    this.breathIn = 1.5;
    this.pebbleIn = 0.3;
    this.idleTime = 0;
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
    // The room's song, and its ambience (wind, birds, dripping caves: see music.js).
    music.play(this.roomData.music ?? null, this.roomData.ambience ?? null);
  }

  update(dt, input) {
    this.titleTime += dt;
    this.time += dt;
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
    this.fadeIn = Math.max(0, this.fadeIn - dt);
    this.updateParticles(dt);

    if (this.doorway) {
      this.doorway.t += dt;
      if (this.doorway.t >= DOOR_FADE_SECONDS) {
        const { door } = this.doorway;
        const arrival = door.climb ? { climb: true, swing: this.climbMomentum ?? null } : {};
        this.game.changeScene(new OverworldScene(ROOMS[door.to], door.spawn, this.roomData.area, arrival));
      }
      return;
    }

    if (this.resting) {
      this.updateRest(dt, input);
      return;
    }

    // Arrived through a climbing door: straight onto the next ring.
    if (this.pendingClimb) {
      const arrival = this.pendingClimb;
      this.pendingClimb = null;
      const plan = findClimb(this.room, this.player);
      if (plan && hasGear('climbing_rope')) this.climb = new Climb(plan, this.player, this.room, arrival.swing);
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

    // Climbing a rope takes over until you're at the top (or bottom). The
    // party waits out of sight and catches up when you're off the rope.
    if (this.climb) {
      for (const follower of this.followers) follower.hidden = true;
      this.climb.update(dt, input);
      this.knockPebbles(dt);
      if (this.climb.done) {
        // Keep the swing you had, in case the next room carries the climb on.
        this.climbMomentum = this.climb.momentum;
        this.climb = null;
        this.wrapPlayer();
        for (const follower of this.followers) {
          follower.warpTo(this.player.x, this.player.y);
          follower.hidden = false;
        }
        this.checkDoors();
      }
      this.followCamera(this.player);
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
      for (const follower of this.followers) follower.update(dt, this.player);
      const focus = this.cutscene?.cameraPoint ?? this.player;
      this.followCamera(focus);
      return;
    }

    // Menus and the textbox take over input while open, so the player stands still.
    if (this.pauseMenu.isOpen) {
      this.pauseMenu.update(input);
    } else if (this.textbox.isOpen) {
      this.textbox.update(dt, input);
    } else if (this.wrathfulEnd) {
      sfx('hurt');
      this.game.changeScene(new GameOverScene(() => continueGame(this.roomData), "The heralds' wrath descended upon you."));
    } else if (input.wasPressed('menu') && !this.player.isAirborne) {
      sfx('select');
      this.pauseMenu.open();
    } else {
      this.player.update(dt, input, this.room);
      if (this.player.moving) this.climbMomentum = null;
      this.wrapPlayer();
      for (const follower of this.followers) follower.update(dt, this.player);
      this.leaveFootprints();
      this.breathe(dt);
      if (this.player.landedThisFrame && this.onSnow()) this.kickSnow();
      this.idleTime = this.player.moving || this.player.isAirborne ? 0 : this.idleTime + dt;
      if (this.roomData.dark) this.burnCandle(dt);
      for (const npc of this.npcs) npc.update(dt, this.player, this.room);
      if (this.player.landedThisFrame) this.handleLanding();
      if (input.wasPressed('confirm') && !this.player.isAirborne) this.interact();
      this.checkDoors();
      this.checkCutscenes();

      const foe = this.npcs.find((npc) => npc.touches(this.player));
      if (foe && !this.player.isAirborne && !this.doorway) this.battleFlash = { group: this.groupAround(foe), t: 0 };
    }

    this.followCamera(this.player);
  }

  // --- The cold: footprints, breath, kicked-up snow, loose pebbles. ---

  // Whether it's cold here: snow underfoot, or snow in the air, and not indoors.
  get cold() {
    return !this.roomData.indoors && Boolean(this.roomData.snowy || this.roomData.weather);
  }

  onSnow() {
    const [tx, ty] = this.player.tilePosition();
    const tile = this.room.tileAt(tx, ty);
    return this.player.ground === 0 && (tile === 'n' || tile === 'i');
  }

  // Every few pixels walked over snow, a footprint, alternating feet. Each is
  // drawn with the room's things (so it bends round the spire) and fades.
  leaveFootprints() {
    const { player } = this;
    if (!player.moving || player.isAirborne || !this.onSnow()) {
      this.lastStep = null;
      return;
    }
    if (this.lastStep) this.strideSince += Math.hypot(player.x - this.lastStep.x, player.y - this.lastStep.y);
    this.lastStep = { x: player.x, y: player.y };
    if (this.strideSince < PRINT_STRIDE) return;
    this.strideSince = 0;
    this.printSide = -this.printSide;
    const sideways = player.facing === 'left' || player.facing === 'right';
    const print = {
      x: player.x + (sideways ? 0 : this.printSide * 3),
      y: player.y + (sideways ? this.printSide * 2 : 0),
      born: this.time,
      sortY: -1e9,
      draw: (ctx, camera) => {
        const age = (this.time - print.born) / PRINT_SECONDS;
        if (age >= 1) return;
        ctx.fillStyle = `rgba(96, 116, 160, ${(0.5 * (1 - age)).toFixed(3)})`;
        ctx.fillRect(Math.round(print.x) - 1 - camera.x, Math.round(print.y) - 3 - camera.y, 2, 3);
      },
    };
    this.prints.push(print);
    if (this.prints.length > MAX_PRINTS) this.prints.shift();
  }

  // A puff of breath now and then, rising from where your mouth is.
  breathe(dt) {
    if (!this.cold || this.player.isAirborne) return;
    this.breathIn -= dt;
    if (this.breathIn > 0) return;
    this.breathIn = 2.2 + Math.random() * 1.6 + (this.player.running ? -1 : 0);
    const { player } = this;
    const facing = player.facing === 'left' ? -1 : player.facing === 'right' ? 1 : 0;
    this.particles.push({ kind: 'breath', x: player.x + facing * 4, y: player.y - 13, vx: facing * 6 + (Math.random() - 0.5) * 4, vy: -7, life: 1.1, age: 0 });
  }

  // Landing in snow throws some up.
  kickSnow() {
    for (let i = 0; i < 7; i++) {
      const angle = Math.PI + Math.random() * Math.PI;
      const speed = 20 + Math.random() * 30;
      this.particles.push({ kind: 'snow', x: this.player.x, y: this.player.y - 1, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.6 - 10, life: 0.5 + Math.random() * 0.3, age: 0 });
    }
  }

  // Climbing shakes the odd pebble loose from the rock above you.
  knockPebbles(dt) {
    const name = this.climb?.state?.name;
    if (name !== 'hang' && name !== 'leap' && name !== 'reel') return;
    this.pebbleIn -= dt;
    if (this.pebbleIn > 0) return;
    this.pebbleIn = 0.35 + Math.random() * 0.9;
    const { player } = this;
    this.particles.push({ kind: 'pebble', x: player.x + (Math.random() - 0.5) * 30, y: player.y - 70 - Math.random() * 30, vx: (Math.random() - 0.5) * 10, vy: 20 + Math.random() * 30, life: 1.4, age: 0, big: Math.random() < 0.3 });
  }

  updateParticles(dt) {
    for (const p of this.particles) {
      p.age += dt;
      if (p.kind === 'breath') {
        p.vx *= 0.97;
        p.vy *= 0.96;
      } else if (p.kind === 'snow') {
        p.vy += 160 * dt;
      } else if (p.kind === 'pebble') {
        p.vy += 420 * dt;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.particles = this.particles.filter((p) => p.age < p.life);
  }

  drawParticles(ctx) {
    const project = this.spire ? (x) => this.project(x).x : (x) => x - this.camera.x;
    for (const p of this.particles) {
      const k = p.age / p.life;
      const x = Math.round(project(p.x));
      const y = Math.round(p.y - this.camera.y);
      if (p.kind === 'breath') {
        const r = 2 + k * 4;
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.35 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'snow') {
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * (1 - k)).toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      } else {
        ctx.fillStyle = p.big ? '#5a5468' : '#7a7484';
        ctx.fillRect(x, y, p.big ? 2 : 1, p.big ? 2 : 1);
      }
    }
  }

  // Standing still in falling snow, it settles on your head.
  drawSnowCap(ctx) {
    if (!this.roomData.weather || this.roomData.indoors || this.idleTime < 2) return;
    const { player } = this;
    const x = this.spire ? this.project(player.x).x : player.x - this.camera.x;
    const top = player.y - player.ground - 18 - this.camera.y;
    const grown = Math.min(1, (this.idleTime - 2) / 6);
    ctx.fillStyle = '#eef3fa';
    ctx.fillRect(Math.round(x) - 2 - Math.round(grown * 2), top - 1, 4 + Math.round(grown * 4), 1);
    if (grown > 0.4) ctx.fillRect(Math.round(x) - 1 - Math.round(grown), top - 2, 2 + Math.round(grown * 2), 1);
  }

  // On ice, you're mirrored in it.
  drawReflection(ctx) {
    const { player } = this;
    if (this.spire || !player.onIce(this.room) || player.isAirborne) return;
    const frame = heroFrame(player.facing, player.moving, false, player.animationTime, player.running);
    const x = player.x - Math.floor(frame.width / 2) - this.camera.x;
    const y = player.y - this.camera.y;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(0, y * 2);
    ctx.scale(1, -1);
    ctx.drawImage(frame, x, y - frame.height + 1);
    ctx.restore();
  }

  // --- Spire rooms: the outside of a round mountain (`wraps` in the room's data). ---
  // The room's map is the mountain's surface unrolled. Walking off one edge
  // brings you round to the other, and the room is drawn bent round a
  // cylinder, so the whole mountain turns as you walk round it, with the
  // view off it (vista.js) turning behind.

  get spire() {
    return this.room.wraps;
  }

  // The mountain's radius: its circumference is the room's width.
  get radius() {
    return this.room.pixelWidth / (2 * Math.PI);
  }

  // Keeps the player on the map as they walk round the seam (and brings the
  // party round with them).
  wrapPlayer() {
    if (!this.spire) return;
    const w = this.room.pixelWidth;
    const wrapped = ((this.player.x % w) + w) % w;
    if (wrapped !== this.player.x) {
      for (const follower of this.followers) follower.shift(wrapped - this.player.x);
      this.player.x = wrapped;
    }
  }

  // --- The party (src/characters/party.js) ---

  addFollower(id) {
    if (this.followers.some((follower) => follower.id === id)) return;
    this.followers.push(new Follower(id, this.player.x, this.player.y));
    this.room.refreshShowsUp();
  }

  removeFollower(id) {
    this.followers = this.followers.filter((follower) => follower.id !== id);
  }

  followCamera(focus) {
    this.camera.follow(focus.x, focus.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
    // Round a spire there's no left or right edge to stop at: whoever we're
    // following is always in the middle.
    if (this.spire) this.camera.x = Math.round(focus.x - SCREEN_WIDTH / 2);
  }

  // Where a world x lands on the screen round the spire: its angle from the
  // point facing you, where it sits, and how much it's foreshortened (0 at the
  // edges, 1 in the middle; negative round the back).
  project(x) {
    const w = this.room.pixelWidth;
    let dx = x - (this.camera.x + SCREEN_WIDTH / 2);
    dx = ((dx % w) + w) % w;
    if (dx > w / 2) dx -= w;
    const angle = dx / this.radius;
    return { x: SCREEN_WIDTH / 2 + this.radius * Math.sin(angle), scale: Math.cos(angle), angle };
  }

  // The view off the mountain: which way you're looking (in turns), how high
  // up the room the camera is, how high the room is on the mountain, and the
  // time of day.
  get vistaView() {
    const vista = this.roomData.vista;
    const w = this.room.pixelWidth;
    const yaw = (vista.heading ?? 0) + (this.spire ? ((this.camera.x + SCREEN_WIDTH / 2) % w) / w : 0);
    const rise = Math.max(0, this.room.pixelHeight - SCREEN_HEIGHT - this.camera.y);
    const { night, dusk } = daylight();
    return { yaw, rise, altitude: vista.altitude ?? 0, driftX: this.spire ? 0 : this.camera.x, night, dusk };
  }

  // Whether the time of day shows here: outdoors, under the sky.
  get underSky() {
    return !this.roomData.indoors && !this.roomData.dark && (Boolean(this.roomData.vista) || OUTDOOR_AREAS.has(this.roomData.area));
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
  // Only the Ruins' old floors do this; the mountain's rock and snow hold.
  handleLanding() {
    if (this.roomData.area !== 'ruins') return;
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
      if (!this.tryClimb()) this.inspectTile(Math.floor(px / T), Math.floor(py / T));
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
    if (prop.sound) sfx(prop.sound);
    // Rung once too often: the heralds' wrath, and then game over (see update).
    if (prop.wrath && ++prop.uses > 1) {
      this.textbox.open(textSection(this.roomData.textFile, prop.wrath));
      this.wrathfulEnd = true;
      return;
    }
    // Some things have other words after dark (`nightText`): the bell, for one.
    if (prop.nightText && this.underSky && daylight().night > 0.5) {
      this.textbox.open(textSection(this.roomData.textFile, prop.nightText));
      return;
    }
    // Shops are their own screen; leaving comes back here (and to the room's music).
    if (prop.shop) this.game.changeScene(new ShopScene(prop.shop, () => this.game.changeScene(this)));
    else if (prop.save) this.useSavePoint();
    else if (prop.rest) this.useBed(prop);
    else if (prop.join && MEMBERS[prop.join]) this.recruit(prop);
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

  // Something with an item for you: its words, then you take it (if there's
  // room). It can be a weapon (src/data/weapons.js), armor (src/data/armor.js)
  // or gear (src/data/gear.js) too, which don't take bag space.
  takeGift(prop) {
    const pages = prop.text ? [...textSection(this.roomData.textFile, prop.text)] : [];
    const id = prop.gives;
    const armor = ARMOR[id];
    const weapon = WEAPONS[id];
    const gear = GEAR[id];
    const thing = armor ?? weapon ?? gear ?? ITEMS[id];
    if (!thing) throw new Error(`${this.roomData.id}: a ${prop.look} gives unknown thing '${id}'`);
    const { name } = thing;
    let got = true;
    if (gear) {
      giveGear(id);
      pages.push(...textSection(GEAR_TEXT, `got_${id}`));
    } else if (armor) {
      if (!HERO_STATE.armors.includes(id)) HERO_STATE.armors.push(id);
      pages.push(`You got the ${name}! Wear it from EQUIP (press C).`);
    } else if (weapon) {
      if (!HERO_STATE.weapons.includes(id)) HERO_STATE.weapons.push(id);
      pages.push(`You got the ${name}! Equip it from EQUIP (press C).`);
    } else if (giveItem(id)) {
      pages.push(`You got the ${name}.`);
    } else {
      got = false;
      pages.push(`You'd take the ${name}, but your bag is full.`);
    }
    if (got) {
      sfx('heal');
      WORLD_STATE.taken ??= [];
      WORLD_STATE.taken.push(prop.key);
      prop.markTaken();
    }
    this.textbox.open(pages);
  }

  // Someone who joins when you talk to them: their words, then they're with you.
  recruit(prop) {
    const pages = prop.npc ? [...this.npcPages(prop)] : [];
    const member = MEMBERS[prop.join];
    if (joinParty(prop.join)) {
      sfx('levelUp');
      pages.push(`${member.name} joined the party!\nThey'll follow you, take a turn in battles, and have a branch of their own in SKILLS.`);
      this.addFollower(prop.join);
    }
    this.textbox.open(pages, prop.npc);
  }

  // --- Resting at an inn (a prop with `rest: true`). ---

  // Its words first; then the room fades to black, you sleep (and dream, if
  // there's a dream to be had), and wake with your HP restored.
  useBed(prop) {
    this.textbox.open(prop.text ? textSection(this.roomData.textFile, prop.text) : ['A soft bed. You could sleep for a week.']);
    this.resting = { phase: 'words', t: 0, dream: prop.dream ?? DEFAULT_DREAM };
  }

  updateRest(dt, input) {
    const rest = this.resting;
    rest.t += dt;
    if (rest.phase === 'words') {
      this.textbox.update(dt, input);
      if (this.textbox.isOpen) return;
      sfx('rest');
      music.play(null);
      rest.phase = 'fade';
      rest.t = 0;
    } else if (rest.phase === 'fade') {
      if (rest.t < REST_FADE_SECONDS) return;
      rest.phase = 'sleep';
      rest.t = 0;
      // The dream, when there is one, plays in the dark (see DEFAULT_DREAM).
      if (SCENES[rest.dream]) {
        rest.phase = 'dream';
        this.playCutscene(SCENES[rest.dream]);
      }
    } else if (rest.phase === 'dream') {
      this.cutscene.update(dt, input);
      if (!this.cutscene.done) return;
      this.cutscene = null;
      rest.phase = 'sleep';
      rest.t = 0;
    } else if (rest.phase === 'sleep') {
      if (rest.t < REST_SLEEP_SECONDS) return;
      healHeroFully();
      music.play(this.roomData.music ?? null);
      rest.phase = 'wake';
      rest.t = 0;
    } else if (rest.phase === 'wake') {
      if (rest.t < REST_FADE_SECONDS) return;
      this.resting = null;
      sfx('heal');
      this.textbox.open([textFile(this.roomData.textFile).rested?.[0] ?? 'You slept like a stone. Your HP is fully restored.']);
    }
  }

  // How dark the room is while you rest, 0 to 1.
  get restDarkness() {
    const rest = this.resting;
    if (!rest) return 0;
    if (rest.phase === 'fade') return rest.t / REST_FADE_SECONDS;
    if (rest.phase === 'wake') return 1 - rest.t / REST_FADE_SECONDS;
    return rest.phase === 'words' ? 0 : 1;
  }

  // --- Climbing, with the Climbing Rope (see climbing.js). ---

  // Pressing Z at a cliff: climb it if you can. Returns whether there was a
  // ring to climb to (with no rope yet, you just see it out of reach).
  tryClimb() {
    const plan = findClimb(this.room, this.player);
    if (!plan) return false;
    if (!hasGear('climbing_rope')) {
      this.textbox.open(textSection(GEAR_TEXT, plan.kind === 'swing' ? 'swing_no_rope' : 'ring_no_rope'));
      return true;
    }
    this.climb = new Climb(plan, this.player, this.room);
    return true;
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
    // The room's own words for it, or the Ruins' if its text file hasn't any.
    const section = saved ? 'save_point' : 'save_failed';
    this.textbox.open(textFile(this.roomData.textFile)[section] ?? textSection('interactions/the_ruins.txt', section));
  }

  // An NPC says their [first] lines once, then their [repeat] lines (if they have any).
  // Once a cutscene has played, they can have new lines for after it:
  // [first after <scene id>] said once, then [repeat after <scene id>]. The
  // latest cutscene they have lines for wins.
  npcPages(prop) {
    const path = `npcs/${prop.npc}.txt`;
    const sections = textFile(path);
    const scene = [...(WORLD_STATE.seenScenes ?? [])].reverse().find((id) => sections[`first after ${id}`]);
    if (scene) {
      WORLD_STATE.talked ??= [];
      const key = `${prop.npc}:${scene}`;
      const heard = WORLD_STATE.talked.includes(key);
      if (!heard) WORLD_STATE.talked.push(key);
      return heard ? sections[`repeat after ${scene}`] ?? sections[`first after ${scene}`] : sections[`first after ${scene}`];
    }
    const repeat = sections.repeat;
    const pages = prop.talkedTo && repeat ? repeat : textSection(path, 'first');
    prop.talkedTo = true;
    return pages;
  }

  draw(ctx) {
    // The view off the mountain shows wherever the room has open sky.
    if (this.roomData.vista) drawVista(ctx, this.vistaView, this.time);
    else if (this.spire) { ctx.fillStyle = '#07040f'; ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); }

    // Draw lower things last so the player can stand in front of or behind
    // others (footprints lowest of all).
    const props = this.room.props.filter((prop) => this.inLight(prop));
    const entities = [...this.prints, ...props, ...this.room.standing, ...this.npcs, ...this.followers, ...(this.cutscene?.drawables ?? []), this.player].sort((a, b) => a.sortY - b.sortY);
    if (this.spire) {
      this.drawSpire(ctx);
      for (const entity of entities) this.drawOnSpire(ctx, entity);
    } else {
      ctx.drawImage(this.room.background, -this.camera.x, -this.camera.y);
      this.room.drawDamage(ctx, this.camera);
      for (const entity of entities) entity.draw(ctx, this.camera);
    }
    const project = this.spire ? (x) => this.project(x).x : (x) => x - this.camera.x;
    this.drawReflection(ctx);
    this.climb?.drawRope(ctx, this.camera, project);
    this.climb?.drawTarget(ctx, this.camera, project);
    this.drawSnowCap(ctx);
    this.drawParticles(ctx);
    if (this.roomData.birds) this.drawBirds(ctx);
    // High up, wisps of cloud blow across between you and everything.
    if (this.roomData.vista && (this.roomData.vista.altitude ?? 0) > 0.55) drawWisps(ctx, this.time, Math.min(1, ((this.roomData.vista.altitude ?? 0) - 0.55) * 2.5));
    if (this.underSky) this.drawTimeOfDay(ctx);
    if (this.roomData.weather) drawSnow(ctx, this.roomData.weather, this.time, this.roomData.wind ?? 1);
    if (this.roomData.dark) this.drawDarkness(ctx);
    this.cutscene?.drawOverlay(ctx, this.camera);
    // Underground, the edges of the screen sink into shadow; outdoors they don't.
    if (!OUTDOOR_AREAS.has(this.roomData.area) || this.roomData.indoors) ctx.drawImage(vignette(), 0, 0);
    if (this.resting) this.drawBlack(ctx, this.restDarkness);

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

  // The room bent round the mountain. Every column of screen pixels across the
  // cylinder's width samples one column of the room's picture: the one at the
  // angle that lands there (x = R sin(angle), so angle = asin(x / R)). The
  // mapping is fixed for a given radius, so it's worked out once; each frame
  // only slides it round by the camera. The rock in the middle is drawn
  // at full width and the sides are squeezed, with no seams and nothing
  // shimmering as you turn, and the shading round the sides is one picture
  // laid over the top.
  spireMapping() {
    const radius = this.radius;
    if (this.mapping?.radius === radius) return this.mapping;
    const width = Math.round(radius * 2);
    const left = Math.round(SCREEN_WIDTH / 2 - radius);
    // For each screen column, how far round the rock (in pixels of the map) it looks at.
    const offsets = new Float32Array(width);
    const depths = new Float32Array(width);
    for (let i = 0; i < width; i++) {
      const u = Math.max(-1, Math.min(1, (i + 0.5 - radius) / radius));
      const angle = Math.asin(u);
      offsets[i] = angle * radius;
      depths[i] = Math.cos(angle);
    }
    // The shading: darker round the sides (more on the side away from the sun),
    // and a thin rim of light on the sunlit edge.
    const shade = document.createElement('canvas');
    shade.width = width;
    shade.height = SCREEN_HEIGHT;
    const sctx = shade.getContext('2d');
    for (let i = 0; i < width; i++) {
      const side = (i + 0.5 - radius) / radius;
      const dark = Math.min(0.85, (1 - depths[i]) * 0.62 + Math.max(0, side) * 0.12);
      sctx.fillStyle = `rgba(12, 14, 36, ${dark.toFixed(3)})`;
      sctx.fillRect(i, 0, 1, SCREEN_HEIGHT);
      if (side < -0.8) {
        sctx.fillStyle = `rgba(255, 240, 200, ${((-side - 0.8) * 0.9).toFixed(3)})`;
        sctx.fillRect(i, 0, 1, SCREEN_HEIGHT);
      }
    }
    this.mapping = { radius, width, left, offsets, shade };
    return this.mapping;
  }

  drawSpire(ctx) {
    const { background } = this.room;
    const w = this.room.pixelWidth;
    const { width, left, offsets, shade } = this.spireMapping();
    const centre = this.camera.x + SCREEN_WIDTH / 2;
    const y = -this.camera.y;
    const height = background.height;
    for (let i = 0; i < width; i++) {
      const sx = left + i;
      if (sx < 0 || sx >= SCREEN_WIDTH) continue;
      let src = Math.floor(centre + offsets[i]);
      src = ((src % w) + w) % w;
      ctx.drawImage(background, src, 0, 1, height, sx, y, 1, height);
    }
    ctx.drawImage(shade, left, 0);
    this.room.drawDamage(ctx, this.camera);
  }

  // Someone or something on the spire: drawn where their column falls, and
  // squeezed the same way the rock is there.
  drawOnSpire(ctx, entity) {
    const point = this.project(entity.x);
    if (point.scale <= 0.08) return;
    ctx.save();
    ctx.translate(point.x, 0);
    ctx.scale(point.scale, 1);
    ctx.translate(-point.x, 0);
    entity.draw(ctx, { x: entity.x - point.x, y: this.camera.y });
    ctx.restore();
  }

  // Birds circling the spire (or, in a flat room, crossing the sky).
  drawBirds(ctx) {
    const radius = this.spire ? this.radius + 22 : 0;
    const yaw = this.spire ? (this.camera.x + SCREEN_WIDTH / 2) / this.radius : 0;
    drawCirclingBirds(ctx, this.roomData.birds, this.time, this.room.pixelHeight, (angle, worldY) => {
      const y = worldY - this.camera.y;
      if (!this.spire) {
        // Across the sky, out past the room's edges and back.
        const span = this.room.pixelWidth + 200;
        const x = ((angle / (Math.PI * 2)) * span % span + span) % span - 100 - this.camera.x;
        return x > -8 && x < SCREEN_WIDTH + 8 ? { x, y, near: false } : null;
      }
      const theta = angle - yaw;
      const depth = Math.cos(theta);
      const x = SCREEN_WIDTH / 2 + radius * Math.sin(theta);
      // Behind the rock: hidden. Out past its edge: still seen, but far off.
      if (depth < 0 && Math.abs(x - SCREEN_WIDTH / 2) < this.radius) return null;
      return { x, y, near: depth > 0.3 };
    });
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

  // Dusk and night, outdoors: the light goes gold, then the dark comes down
  // in a blue, and every lamp, window, fire and crystal keeps a pool of light.
  drawTimeOfDay(ctx) {
    const { night, dusk } = daylight();
    if (dusk > 0.02) {
      ctx.fillStyle = `rgba(255, 168, 90, ${(dusk * 0.11).toFixed(3)})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    if (night > 0.02) this.drawShade(ctx, night * NIGHT_SHADE, NIGHT_TINT, 26);
  }

  // Shade over the whole screen (`alpha` of the colour `tint`), with soft holes
  // where light reaches: the room's lights, and a hole `ownRadius` wide round
  // you. Round the spire, the lights sit where the rock bends to.
  drawShade(ctx, alpha, tint, ownRadius) {
    darkCanvas ??= Object.assign(document.createElement('canvas'), { width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    const dark = darkCanvas.getContext('2d');
    dark.globalCompositeOperation = 'source-over';
    dark.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.fillStyle = `rgba(${tint}, ${alpha.toFixed(3)})`;
    dark.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.globalCompositeOperation = 'destination-out';
    const lights = [...this.room.lightSources(), { ...this.lightPoint, radius: ownRadius }];
    for (const { x, y, radius } of lights) {
      let cx = x - this.camera.x;
      let r = radius;
      if (this.spire) {
        const point = this.project(x);
        if (point.scale <= 0) continue;
        cx = point.x;
        r = radius * (0.5 + 0.5 * point.scale);
      }
      const cy = y - this.camera.y;
      const hole = dark.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
      hole.addColorStop(0, 'rgba(0, 0, 0, 1)');
      hole.addColorStop(0.45, 'rgba(0, 0, 0, 0.75)');
      hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
      dark.fillStyle = hole;
      dark.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.drawImage(darkCanvas, 0, 0);
  }

  // The dark, with soft holes where light reaches: your own (flickering), and
  // every lantern, fire and crystal in the room.
  drawDarkness(ctx) {
    const t = performance.now() / 1000;
    const flicker = 1 + Math.sin(t * 9) * 0.03 + Math.sin(t * 23) * 0.02;
    this.drawShade(ctx, this.roomData.dark, '4, 2, 10', lightRadius() * flicker);
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
