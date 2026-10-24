import { SCREEN_WIDTH, SCREEN_HEIGHT, UI_WIDTH, TILE_SIZE as T } from '../config.js';
import { Room } from './room.js';
import { Camera } from './camera.js';
import { Player, FLOW_DIRS } from './player.js';
import { Npc } from './npc.js';
import { TextBox } from '../ui/textbox.js';
import { PauseMenu } from '../ui/pauseMenu.js';
import { StorageMenu } from '../ui/storageMenu.js';
import { TravelMenu } from '../ui/travelMenu.js';
import { catchUpDrafts, foundDrafts, draftIn } from '../data/travel.js';
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
import { Climb, findClimb, ringNear } from './climbing.js';
import { drawVista } from './vista.js';
import { drawSnow, drawCirclingBirds, drawWisps, drawFog } from './weather.js';
import { drawVision } from './visions.js';
import { drawShadows, drawBlockShadows, sunShadows } from './shadows.js';
import { Whirl, WhirlRide, windIn, turnWind, applyWind, whirlLanding, WIND_STEP } from './weathervanes.js';
import { PROP_SPRITES } from '../data/art/props.js';
import { daylight } from './daylight.js';
import { isLamplit, roomLights, ambientFor, flickerAt, skyColor, holeSprite, glowSprite } from './lamplight.js';
import { heroFrame } from '../characters/hero.js';
import { healHeroFully } from '../characters/progress.js';
import { Follower } from './follower.js';
import { MEMBERS, partyIds, joinParty, inParty, isHurt } from '../characters/party.js';
import { wielderOf, HERO } from '../characters/equipment.js';
import { ITEMS, giveItem } from '../data/items.js';
import { ARMOR } from '../data/armor.js';
import { WEAPONS } from '../data/weapons.js';
import { GEAR, hasGear, giveGear } from '../data/gear.js';
import { ChapterEndScene } from '../title/chapterEndScene.js';
import { burnCandle, lightRadius } from '../data/candles.js';
import { HERO_STATE } from '../characters/heroState.js';
import { skillBonus } from '../characters/progress.js';
import { CreditsScene } from '../title/creditsScene.js';
import { recordChapterStart } from '../state/chapters.js';
import { WindGeyser, Updraft, GeyserRide, canRide, hopPath, hopAt, VES } from './windGeyser.js';
import { HushShadow } from './hushwood.js';
import { Bridges } from './bridges.js';
import { crumbleIn } from './crumble.js';
import { STRIDE, RUN_STRIDE, groundUnder, footfall, landing, moveParticle, drawParticle } from './footfall.js';

// Without Ves, a wind geyser holds you off: within this many pixels of it the
// wind pushes you away, from gently (min) to harder than you can walk (max),
// in pixels a second.
const WIND_HOLD_RADIUS = 28;
const WIND_HOLD_MIN = 25;
const WIND_HOLD_MAX = 210;
// Push puzzles: how long you lean on a rock before it moves, and how long it slides.
const ROCK_PUSH_SECONDS = 0.22;
const ROCK_SLIDE_SECONDS = 0.22;
// A log rolls a tile in this long, and keeps rolling till it's stopped.
const LOG_SLIDE_SECONDS = 0.12;
// The Hushwood's own words: switching to Bramble, chopping, the Hush (see hushwood.js).
const HUSH_TEXT = 'interactions/hushwood.txt';
// Bramble, the woodcutters' kid (src/characters/party.js).
const BRAMBLE = 'bramble';
// Seen by the Hush: how long the dark holds before you're back at the door.
const CAUGHT_SECONDS = 1.4;
// The Lantern Marsh's own words (the bog, the mist).
const MARSH_TEXT = 'interactions/marsh.txt';
// The Dead City's: steering Ves on her crutch, and the high levers.
const DEAD_TEXT = 'interactions/deadcity.txt';
// Standing in bog this long (a moment's grace, for catching an edge) and it
// has you: you sink, slowly, and the room starts again from the door.
const BOG_GRACE = 0.12;
const SINK_SECONDS = 1.8;
// The mist's colour, and how far you can see through it round yourself.
const MIST_TINT = '176, 186, 188';
const MIST_SIGHT = 30;
// How fast you settle onto the middle of a stepping-stone, pixels a second.
const SETTLE_SPEED = 30;
// A tile's step in each direction you can face.
const STEP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

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

// The lead-in before a battle starts lasts this long (see drawBattleLeadIn).
const BATTLE_FLASH_SECONDS = 0.7;
// Before that, the enemy that caught you lunges at you (see Npc.pounceOn),
// you start, and the screen jolts as it hits.
const BATTLE_NOTICE_SECONDS = 0.42;
const BATTLE_JOLT_AT = 0.24;

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

// Whether a light at a screen point, `r` wide, shows on screen at all.
const onScreen = ({ x, y, r }) => x + r > 0 && x - r < SCREEN_WIDTH && y + r > 0 && y - r < SCREEN_HEIGHT;

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
// After a game over (`whole`) you come back at full HP, not the HP you saved
// with, so a low save before a boss can't trap you.
export function continueGame(fallbackRoom, { whole = false } = {}) {
  const loaded = loadGame();
  if (whole) healHeroFully();
  if (loaded && ROOMS[WORLD_STATE.room]) return new OverworldScene(ROOMS[WORLD_STATE.room], WORLD_STATE.spawn);
  return new OverworldScene(fallbackRoom);
}

// The cutscene party member `id` ran on ahead in, if they aren't with you in
// this room (or null). A scene says so with `leavesAhead: { who, until, blocked }`:
// from when it plays until the `until` scene does, they're out of sight in the
// scene's own room and in the `until` scene's room (where that scene finds
// them). You won't leave the scene's room without them, except through the
// door to theirs: `blocked` names the words you get instead (a section of the
// room's text file). Anywhere else they've caught you up and follow as usual.
function wentAhead(id, roomId) {
  const seen = WORLD_STATE.seenScenes ?? [];
  return Object.values(SCENES).find(({ id: sceneId, room, leavesAhead }) => leavesAhead?.who === id
    && seen.includes(sceneId) && !seen.includes(leavesAhead.until)
    && (roomId === room || roomId === SCENES[leavesAhead.until]?.room)) ?? null;
}
// Stepping back off a door you won't go through: the opposite way to the one you face.
const BACK_STEP = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] };

// Free-roam exploration: walk around a room, read things, and get ambushed.
// `spawn` is where the player appears, in tile coordinates. `fromArea` is the
// region of the room you came from, if any.
export class OverworldScene {
  // `arrival` says how you came in: through a door marked `climb`, the rope
  // hooks the next ring straight away, with the `swing` you had (see tryClimb).
  constructor(roomData, spawn = roomData.playerStart, fromArea = null, arrival = {}) {
    this.roomData = roomData;
    this.room = new Room(roomData);
    // Where you came in (the room you came from, and the spot): leaving by
    // another door means you've got through (see checkDoors), and the Hush
    // sends you back here (see catchUp).
    this.cameFrom = arrival.from ?? null;
    this.arrival = { ...spawn };
    // Getting here finds the green updrafts on the way (src/data/travel.js).
    if (catchUpDrafts(roomData.id).length) sfx('heal');
    this.player = new Player(spawn.x * T + T / 2, (spawn.y + 1) * T);
    // With Bramble along, Q switches who you're steering (see swap): the hero
    // is `heroBody` always, Bramble on his own is `kid`, and whichever of you
    // is standing still while the other goes off is the `partner`.
    this.heroBody = this.player;
    // Carrying Ves (the Lantern Marsh): she rides on your back, not behind.
    this.player.carrying = WORLD_STATE.carrying ?? null;
    this.kid = null;
    this.partner = null;
    this.unstick();
    if (arrival.climb) {
      this.player.facing = 'up';
      this.pendingClimb = arrival;
    }
    // Whoever's in the party arrives with you.
    this.followers = partyIds().filter((id) => id !== this.player.carrying).map((id) => new Follower(id, this.player.x, this.player.y));
    // Except someone who ran on ahead in a cutscene, until you catch them up.
    for (const follower of this.followers) if (wentAhead(follower.id, roomData.id)) follower.hidden = true;
    // Wind geysers (windGeyser.js). Carried up one into this room, you drift
    // down onto your spawn, hanging off Ves's boot.
    this.geysers = (roomData.geysers ?? []).map((data) => new WindGeyser(data));
    // Updrafts: small ones that toss you to another tile in this room.
    this.updrafts = (roomData.gusts ?? []).map((data) => new Updraft(data));
    // Whirlwinds, and the wind the weathervanes set (see weathervanes.js).
    this.whirls = (roomData.whirls ?? []).map((data) => new Whirl(data));
    // The Hush's shadow going over (see hushwood.js), and how much the room
    // has darkened under the old trees (`gloom`, 0 to 1).
    this.hush = roomData.hush ? new HushShadow(roomData.hush) : null;
    // The Dead City's floors that give way under you (`!` tiles: crumble.js).
    this.crumble = crumbleIn(roomData, this.room);
    this.caught = null;
    // Rooms with treadles (or their gates) check them every step.
    this.hasTreadles = this.room.allProps.some((p) => p.treadle || p.wet);
    for (const prop of this.room.allProps) if (prop.opensWith?.some((name) => this.room.allProps.some((t) => t.treadle === name))) prop.held = true;
    this.wind = windIn(roomData);
    if (this.wind) applyWind(this.room, this.wind);
    for (const whirl of this.whirls) whirl.wind = this.wind;
    // The whirlwind you're standing in that's already had its go: it won't
    // take you again until you step off it.
    this.spentWhirl = null;
    this.hop = null;
    this.ride = arrival.geyser && canRide() ? new GeyserRide({ landing: { x: this.player.x, y: this.player.y } }) : null;
    // Weather and the view off the mountain are drawn from the room's data.
    this.time = 0;
    // How much of the room's weather (snow and `fog`) there is, 0 to 1: all
    // of it, unless a cutscene has stilled it for good (`weatherUntil`, a
    // scene id) or is fading it now (fadeWeather).
    this.weatherAmount = roomData.weatherUntil && (WORLD_STATE.seenScenes ?? []).includes(roomData.weatherUntil) ? 0 : 1;
    this.weatherFade = null;
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
    // Bridges that give under you (bridges.js), and where everyone last put
    // a foot down, for their footfalls (footfall.js).
    this.bridges = new Bridges(this.room);
    this.feet = new Map();
    // The screen jolting (shakeCamera): how hard, and for how much longer.
    this.shake = null;
    // Each enemy has a key, so a beaten one stays gone even after leaving the room.
    this.npcs = (roomData.npcs ?? [])
      .map((data, i) => Object.assign(new Npc(data), { key: `${roomData.id}:${i}`, light: data.light ?? ENEMIES[data.enemy]?.light ?? null }))
      .filter((npc) => !WORLD_STATE.defeated.includes(npc.key));
    this.camera = new Camera(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.textbox = new TextBox();
    this.pauseMenu = new PauseMenu();
    this.storageMenu = new StorageMenu();
    // TRAVEL, from a green updraft (src/data/travel.js).
    this.travelMenu = new TravelMenu();
    // Something to do once the textbox closes (a second speaker's lines).
    this.afterText = null;
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
    music.play(this.song, this.roomData.ambience ?? null);
  }

  // The room's song: its `music`, or, once a scene has played, the song of
  // its `musicAfter` ({ scene, song }: the Pinefall is quiet until you've
  // met the Keeper at the woodcutters' fire, and waltzes after).
  get song() {
    const after = this.roomData.musicAfter;
    if (after && (WORLD_STATE.seenScenes ?? []).includes(after.scene)) return after.song;
    return this.roomData.music ?? null;
  }

  update(dt, input) {
    this.titleTime += dt;
    this.time += dt;
    // A gusty face (`climbWind`): the wind comes in gusts, every so often.
    const gusts = this.room.climbWind;
    this.gusting = Boolean(gusts) && (this.time % gusts.every) < gusts.lasts;
    WORLD_STATE.playSeconds = (WORLD_STATE.playSeconds ?? 0) + dt;
    this.fadeIn = Math.max(0, this.fadeIn - dt);
    this.updateParticles(dt);
    this.updateFeet(dt);
    this.crumble?.update(dt, this);
    if (this.shake) {
      this.shake.left -= dt;
      if (this.shake.left <= 0) this.shake = null;
    }

    if (this.doorway) {
      this.doorway.t += dt;
      if (this.doorway.t >= DOOR_FADE_SECONDS) {
        const { door } = this.doorway;
        const arrival = door.climb ? { climb: true, swing: this.climbMomentum ?? null } : {};
        arrival.from = this.roomData.id;
        this.game.changeScene(new OverworldScene(ROOMS[door.to], door.spawn, this.roomData.area, arrival));
      }
      return;
    }

    if (this.resting) {
      this.updateRest(dt, input);
      return;
    }

    // Ves reaching up for a high lever: everyone waits while she hooks it
    // and pulls, then it flips (see useLever).
    if (this.reaching) {
      this.updateReach(dt);
      return;
    }

    // Bramble on his own, in a gap only a kid fits (a hole in a hedge, a cat
    // flap, a gap in the reeds, a grating): he crawls through it. Not over
    // rotten planks: those he just walks across.
    if (this.player.small) {
      const p = this.player;
      p.squeezeGap = this.room.props.find((g) => g.gap && g.baseLook !== 'rotten_planks' && !g.hidden && g.overlaps(p.x - 5, p.y - 6, p.x + 5, p.y)) ?? null;
      p.squeezing = Boolean(p.squeezeGap);
    }

    // On the wind: nobody does anything until it sets you down (or carries
    // you off into the room above).
    if (this.ride) {
      this.ride.update(dt);
      this.followCamera(this.ride.focus);
      if (!this.ride.done) return;
      const geyser = this.ride.geyser;
      this.ride = null;
      if (geyser) {
        if (!ROOMS[geyser.to]) throw new Error(`A wind geyser in ${this.roomData.id} blows to unknown room '${geyser.to}'`);
        this.game.changeScene(new OverworldScene(ROOMS[geyser.to], geyser.spawn, this.roomData.area, { geyser: true }));
        return;
      }
      for (const follower of this.followers) follower.warpTo(this.player.x, this.player.y + 2);
    }

    // Tossed by an updraft: carried along the arc until you land.
    if (this.hop) {
      this.updateHop(dt);
      this.followCamera(this.player);
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
      const flash = this.battleFlash;
      const was = flash.t;
      flash.t += dt;
      for (const npc of flash.group) npc.update(dt, this.player, this.room);
      if (was < BATTLE_JOLT_AT && flash.t >= BATTLE_JOLT_AT) {
        sfx('pounce');
        this.shakeCamera(2, 0.22);
      }
      this.followCamera(this.player);
      if (flash.t >= BATTLE_NOTICE_SECONDS + BATTLE_FLASH_SECONDS) this.startBattle(flash.group);
      return;
    }

    if (this.player.isFalling) {
      this.player.update(dt, input, this.room);
      if (this.player.fallTime >= FALL_SECONDS + FADE_SECONDS) {
        // (A crumbling floor has its own words for it: see crumble.js.)
        this.game.changeScene(new GameOverScene(() => continueGame(this.roomData, { whole: true }), this.player.fallMessage ?? undefined));
      }
      return;
    }

    // Climbing a rope takes over until you're at the top (or bottom). The
    // party waits out of sight and catches up when you're off the rope.
    if (this.climb) {
      for (const follower of this.followers) follower.hidden = true;
      this.climb.gust = this.gusting ? this.room.climbWind : null;
      this.climb.update(dt, input);
      this.knockPebbles(dt);
      if (this.climb.done) {
        // Keep the swing you had, in case the next room carries the climb on.
        this.climbMomentum = this.climb.momentum;
        this.climb = null;
        this.wrapPlayer();
        for (const follower of this.followers) {
          // (Not Bramble, if he's off on his own: he isn't following.)
          if (this.partner && follower.id === this.kid?.skin) continue;
          follower.warpTo(this.player.x, this.player.y);
          follower.hidden = false;
        }
        this.checkDoors();
      }
      this.followCamera(this.player);
      return;
    }

    this.tickWeather(dt);
    // A cutscene takes over completely until it ends.
    if (this.cutscene) {
      this.cutscene.update(dt, input);
      if (this.cutscene.done) {
        const { battle, endChapter, goto } = this.cutscene;
        this.cutscene = null;
        this.room.refreshShowsUp();
        if (battle) {
          this.storyBattle(battle);
          return;
        }
        if (goto) {
          const next = ROOMS[goto.room];
          if (!next) throw new Error(`A cutscene in ${this.roomData.id} goes to unknown room '${goto.room}'`);
          // With `save`, it saves by itself there (no going back up a well).
          if (goto.save) saveGame(next.id, goto.spawn ?? next.playerStart);
          this.game.changeScene(new OverworldScene(next, goto.spawn ?? next.playerStart, this.roomData.area, { from: this.roomData.id }));
          return;
        }
        if (endChapter) {
          const next = ROOMS[endChapter.room];
          // On to the next chapter (the skill tree grows with it), and the
          // end of a chapter saves by itself, ready to start the next one.
          WORLD_STATE.chapter = (WORLD_STATE.chapter ?? 1) + 1;
          if (next) saveGame(next.id, endChapter.spawn ?? next.playerStart);
          // Remembered for chapter select, to start this chapter again later.
          recordChapterStart(WORLD_STATE.chapter);
          const goOn = next
            ? () => new OverworldScene(next, endChapter.spawn ?? next.playerStart, this.roomData.area)
            : this.game.home;
          // With `credits`, the credits roll first (`credits: { song, text }`
          // for a chapter's own song and cards); `card` names its chapter card.
          const card = () => new ChapterEndScene(goOn, endChapter.card);
          const credits = endChapter.credits === true ? {} : endChapter.credits;
          this.game.changeScene(credits ? new CreditsScene(card, credits) : card());
          return;
        }
      }
      this.updateFollowers(dt);
      const focus = this.cutscene?.cameraPoint ?? this.player;
      this.followCamera(focus);
      return;
    }

    // Menus and the textbox take over input while open, so the player stands still.
    if (this.storageMenu.isOpen) {
      this.storageMenu.update(input);
    } else if (this.travelMenu.isOpen) {
      this.travelMenu.update(input);
    } else if (this.pauseMenu.isOpen) {
      this.pauseMenu.update(input);
    } else if (this.textbox.isOpen) {
      this.textbox.update(dt, input);
      if (!this.textbox.isOpen && this.afterText) {
        const next = this.afterText;
        this.afterText = null;
        next();
      }
    } else if (this.wrathfulEnd) {
      sfx('hurt');
      this.game.changeScene(new GameOverScene(() => continueGame(this.roomData, { whole: true }), "The heralds' wrath descended upon you."));
    } else if (this.caught) {
      this.updateCaught(dt);
    } else if (input.wasPressed('menu') && !this.player.isAirborne) {
      sfx('select');
      this.pauseMenu.open();
    } else if (input.wasPressed('swap') && !this.player.isAirborne && this.canSwap()) {
      this.swap();
    } else {
      // The one of you standing still is in your way, unless you're already
      // overlapping (a current can carry you both to the same spot): then you
      // can walk apart.
      const p = this.partner;
      const overlapping = p && Math.abs(p.x - this.player.x) < 10 && Math.abs(p.y - this.player.y) < 6;
      this.room.blockers = p && !overlapping ? [p] : [];
      const wasGround = this.player.ground;
      this.player.update(dt, input, this.room);
      if (this.player.ground > wasGround) this.leaveVesBelow();
      this.pushRocks(dt, input);
      this.settleTreadles();
      this.updateHush(dt);
      this.checkBog(dt);
      this.balance(dt, input);
      if (this.player.moving) this.climbMomentum = null;
      this.wrapPlayer();
      this.updateFollowers(dt);
      this.leaveFootprints();
      this.breathe(dt);
      if (this.player.landedThisFrame && this.onSnow()) this.kickSnow();
      this.idleTime = this.player.moving || this.player.isAirborne ? 0 : this.idleTime + dt;
      if (this.roomData.dark) this.burnCandle(dt);
      for (const npc of this.npcs) npc.update(dt, this.player, this.room);
      if (this.player.landedThisFrame) this.handleLanding();
      if (input.wasPressed('confirm') && !this.player.isAirborne) this.interact();
      this.checkDoors();
      this.checkGeysers(dt);
      this.checkCutscenes();

      // Either of you, if you've split up.
      const foe = this.npcs.find((npc) => npc.touches(this.player) || (this.partner && npc.touches(this.partner)));
      if (foe && !this.player.isAirborne && !this.doorway) this.caughtBy(foe);
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
      } else if (moveParticle(p, dt)) {
        continue;
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
      } else if (drawParticle(ctx, p, x, y)) {
        continue;
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
    if (this.followers.some((follower) => follower.id === id) || this.heroBody.carrying === id) return;
    this.followers.push(new Follower(id, this.player.x, this.player.y));
    this.room.refreshShowsUp();
  }

  removeFollower(id) {
    this.followers = this.followers.filter((follower) => follower.id !== id);
  }

  // Picks someone up to carry on your back (`id`, a party member), or with
  // null puts them down to walk behind you again (see Player.carrying).
  carry(id) {
    const was = this.heroBody.carrying;
    WORLD_STATE.carrying = id;
    this.heroBody.carrying = id;
    if (id) this.removeFollower(id);
    if (was && was !== id && inParty(was)) this.addFollower(was);
  }

  followCamera(focus) {
    this.camera.follow(focus.x, focus.y + CAMERA_OFFSET_Y, this.room.pixelWidth, this.room.pixelHeight);
    // Round a spire there's no left or right edge to stop at: whoever we're
    // following is always in the middle.
    if (this.spire) this.camera.x = Math.round(focus.x - SCREEN_WIDTH / 2);
    if (this.shake) {
      const power = this.shake.amount * Math.min(1, this.shake.left / this.shake.seconds);
      this.camera.x += Math.round((Math.random() * 2 - 1) * power);
      this.camera.y += Math.round((Math.random() * 2 - 1) * power);
    }
  }

  // The screen jolts, `amount` pixels, dying away over `seconds`.
  shakeCamera(amount, seconds) {
    this.shake = { amount, seconds, left: seconds };
  }

  // --- Feet: footfalls, and bridges giving under them (footfall.js, bridges.js). ---

  // Everyone who walks about here: you (and whichever of you is standing
  // apart), the party, and anyone walking in a cutscene.
  walkers() {
    const list = [this.player, ...(this.partner ? [this.partner] : []), ...this.followers];
    if (this.cutscene) list.push(...this.cutscene.drawables.filter((actor) => !actor.heldBy));
    return list;
  }

  updateFeet(dt) {
    const walkers = this.walkers();
    this.bridges.update(dt, walkers);
    for (const body of walkers) {
      // How far a bridge has given under them (not round a spire, where the
      // bridge itself is drawn without its sag).
      body.sag = this.spire ? 0 : this.bridges.dropFor(body);
      const going = body.walking ?? (body.moving && !body.isAirborne && !body.isSliding);
      if (!going || body.hidden || body.tucked) {
        this.feet.delete(body);
        continue;
      }
      const last = this.feet.get(body);
      if (!last) {
        this.feet.set(body, { x: body.x, y: body.y, since: 0 });
        continue;
      }
      last.since += Math.hypot(body.x - last.x, body.y - last.y);
      last.x = body.x;
      last.y = body.y;
      if (last.since < (body.running ? RUN_STRIDE : STRIDE)) continue;
      last.since = 0;
      const facing = body.dir ?? body.facing;
      const way = facing === 'left' || facing === -1 ? -1 : facing === 'right' || facing === 1 ? 1 : 0;
      const under = this.bridges.step(body, body.running ? 1.3 : 1);
      if (under && body === this.player && Math.random() < 0.3) sfx('creak');
      footfall(this.particles, groundUnder(this.room, body), body, { running: Boolean(body.running), light: body !== this.player, under, way });
    }
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
    // Scenes wait till you're together again.
    if (this.player.isAirborne || this.doorway || this.cutscene || this.partner) return;
    const [tx, ty] = this.player.tilePosition();
    // A trigger can wait for a scene to have played (`after`), or stop once
    // one has (`until`), like a prop.
    const seen = WORLD_STATE.seenScenes ?? [];
    const trigger = (this.roomData.cutscenes ?? []).find((c) => tx >= c.x && tx < c.x + c.w && ty >= c.y && ty < c.y + c.h
      && (!c.after || seen.includes(c.after)) && (!c.until || !seen.includes(c.until)));
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

  // Where a fight here takes place, for its background (and its song): a
  // cave's own crystal cavern, or the room's area. The lower mountain's green,
  // sunny rooms (out under the sky, no snow) fight under the Long Stair's sky,
  // not the snowy heights.
  get battleArea() {
    const data = this.roomData;
    if (data.cave) return 'cave';
    // The Hushwood (and Hollin, in it) is still the Pinefall, deeper in: its
    // fights look and sound the same.
    if (data.area === 'hushwood' || data.area === 'hollin') return 'pinefall';
    if (data.area === 'vigil' && !data.snowy && !data.indoors) return 'stair';
    return data.area;
  }

  // A battle started by a cutscene (a boss, say). Afterwards, the scene named
  // by the step's `spared` or `defeated` plays, depending on how it ended, and
  // is remembered as seen, so rooms can change with it ("Shows up").
  //
  // A step can name several `enemies` instead of one `enemy` (a pack, say),
  // and an `after` scene that plays however it was won. With `noRun`, there's
  // no running away (`noRunText`, a section of the room's text file, says why).
  storyBattle(step) {
    const ids = step.enemies ?? [step.enemy];
    const list = ids.map((id) => {
      if (!ENEMIES[id]) throw new Error(`A cutscene starts a battle with unknown enemy '${id}'`);
      return ENEMIES[id];
    });
    const game = this.game;
    const noRun = step.noRun ? (textSection(this.roomData.textFile, step.noRunText ?? '')[0] ?? true) : null;
    game.changeScene(new BattleScene(list, (result, outcomes, gameOver) => {
      if (result === 'death') {
        game.changeScene(new GameOverScene(() => continueGame(this.roomData, { whole: true }), gameOver ?? 'Your light flickered out.'));
        return;
      }
      game.changeScene(this);
      const state = outcomes?.[0]?.state;
      const next = step.after ?? (state === 'pacified' ? step.spared : state === 'defeated' ? step.defeated : null);
      if (!next) return;
      WORLD_STATE.seenScenes ??= [];
      if (!WORLD_STATE.seenScenes.includes(next)) WORLD_STATE.seenScenes.push(next);
      if (SCENES[next]) this.playCutscene(SCENES[next]);
    }, this.battleArea, { noRun }));
  }

  // Never leave the player stuck where they arrive (say, a door that opens onto
  // something that's appeared since): move them to the nearest open floor.
  unstick() {
    const { player, room } = this;
    const free = (x, y, ground = 0) => !player.collidesAt(room, x, y) && player.floorAt(room, x, y) === ground;
    // Up on a block is fine, as long as it's the block they think they're on.
    if (free(player.x, player.y, player.ground)) return;
    player.ground = 0;
    player.z = 0;
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

  // Stepping into a wind geyser: with Ves, up you go; without her, it shoves
  // you straight back out (and says why, the first time).
  checkGeysers(dt) {
    if (this.player.isAirborne || this.doorway || this.ride || this.hop) return;
    const [ux, uy] = this.player.tilePosition();
    // A whirlwind flings you downwind (anyone, Ves or not), or sets you back.
    const whirl = this.whirls.find((w) => w.covers(ux, uy));
    this.whirlRest = Math.max(0, (this.whirlRest ?? 0) - dt);
    if (!whirl) this.spentWhirl = null;
    else if (whirl !== this.spentWhirl && this.whirlRest <= 0) {
      this.rideWhirl(whirl);
      return;
    }
    // An updraft takes anyone, Ves or not.
    const updraft = this.updrafts.find((u) => u.covers(ux, uy));
    if (updraft) {
      const to = { x: updraft.drop.x * T + T / 2, y: (updraft.drop.y + 1) * T - 2 };
      this.hop = hopPath({ x: this.player.x, y: this.player.y }, to, this.player.ground, this.room.raiseAt(updraft.drop.x, updraft.drop.y));
      sfx('flare');
      return;
    }
    if (canRide()) {
      const [tx, ty] = this.player.tilePosition();
      const geyser = this.geysers.find((g) => g.covers(tx, ty));
      if (geyser) this.ride = new GeyserRide({ geyser, from: { x: this.player.x, y: this.player.y } });
      return;
    }
    // Without her, the wind holds you off: a gentle push away from the column
    // that grows the closer you get, until it's stronger than you can walk,
    // and snow blowing past your boots. No words: you just can't get in.
    for (const geyser of this.geysers) {
      let dx = this.player.x - geyser.x;
      // Round a spire, the short way to it may be across the seam.
      if (this.spire) {
        const w = this.room.pixelWidth;
        dx = ((dx % w) + w + w / 2) % w - w / 2;
      }
      const dy = this.player.y - geyser.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= WIND_HOLD_RADIUS) continue;
      const k = 1 - distance / WIND_HOLD_RADIUS;
      const speed = WIND_HOLD_MIN + (WIND_HOLD_MAX - WIND_HOLD_MIN) * k * k;
      const [ux, uy] = distance > 1 ? [dx / distance, dy / distance] : [0, 1];
      // The hero moves in whole pixels, so the push builds up between frames.
      this.windCarry ??= { x: 0, y: 0 };
      this.windCarry.x += ux * speed * dt;
      this.windCarry.y += uy * speed * dt;
      const stepX = Math.trunc(this.windCarry.x);
      const stepY = Math.trunc(this.windCarry.y);
      this.windCarry.x -= stepX;
      this.windCarry.y -= stepY;
      if (stepX && !this.player.collidesAt(this.room, this.player.x + stepX, this.player.y)) this.player.x += stepX;
      if (stepY && !this.player.collidesAt(this.room, this.player.x, this.player.y + stepY)) this.player.y += stepY;
      this.windSnowIn = (this.windSnowIn ?? 0) - dt;
      if (this.windSnowIn <= 0) {
        this.windSnowIn = 0.1;
        for (let i = 0; i < 2; i++) {
          const spread = (Math.random() - 0.5) * 1.2;
          const vx = (ux * Math.cos(spread) - uy * Math.sin(spread)) * (40 + Math.random() * 30);
          const vy = (ux * Math.sin(spread) + uy * Math.cos(spread)) * (40 + Math.random() * 30) - 6;
          this.particles.push({ kind: 'snow', x: this.player.x, y: this.player.y - 2, vx, vy, life: 0.4 + Math.random() * 0.3, age: 0 });
        }
      }
    }
  }

  // Into a whirlwind: up and away downwind, to wherever something solid
  // stops you. If that's over the drop it won't take you: it spins you round
  // and puts you back where you stepped in from (and says so, the first time).
  rideWhirl(whirl) {
    this.spentWhirl = whirl;
    const land = whirlLanding(this.room, whirl.tx, whirl.ty, this.wind);
    if (!land) {
      sfx('back');
      // A moment before it'll try again, if you walk straight back in.
      this.whirlRest = 0.6;
      const [dx, dy] = WIND_STEP[this.player.facing] ?? [0, 1];
      this.player.x -= dx * T;
      this.player.y -= dy * T;
      this.unstick();
      this.player.moving = false;
      this.spentWhirl = null;
      WORLD_STATE.whirlRefused ??= false;
      if (!WORLD_STATE.whirlRefused && textSection(this.roomData.textFile, 'whirl_refuses').length) {
        WORLD_STATE.whirlRefused = true;
        this.textbox.open(textSection(this.roomData.textFile, 'whirl_refuses'));
      }
      return;
    }
    // Along the wind (round a spire, the short way it blows, not the long way back).
    const to = { x: land.alongX * T + T / 2, y: (land.y + 1) * T - 2 };
    // With Ves: she opens her umbrella to it and you hang off her boot, the
    // two of you carried off together (WhirlRide). You're already where it
    // sets you down; the ride is drawn in your place.
    if (canRide()) {
      this.ride = new WhirlRide({ from: { x: this.player.x, y: this.player.y }, at: { x: whirl.x, y: whirl.y }, to });
      this.player.x = to.x;
      this.player.y = to.y;
      this.wrapPlayer();
      this.spentWhirl = this.whirls.find((w) => w.covers(land.x, land.y)) ?? null;
      sfx('flare');
      return;
    }
    this.hop = hopPath({ x: this.player.x, y: this.player.y }, to, this.player.ground, this.room.raiseAt(land.x, land.y));
    this.hop.seconds *= 0.8;
    this.hop.peak += 10;
    // Landing in another whirlwind doesn't set it off: you'd have to step off and back in.
    this.spentWhirl = this.whirls.find((w) => w.covers(land.x, land.y)) ?? null;
    this.landingWhirl = true;
    sfx('flare');
  }

  // A weathervane: a quarter turn, and the wind, the other vanes and the
  // drifts all go round with it.
  turnVane() {
    this.wind = turnWind(this.roomData);
    applyWind(this.room, this.wind);
    for (const whirl of this.whirls) whirl.wind = this.wind;
    sfx('door');
    // A drift heaped up where you're standing (or where Ves is) pushes you clear.
    this.unstick();
    for (const follower of this.followers) {
      if (this.room.props.some((p) => p.drift && !p.hidden && p.overlaps(follower.x - 4, follower.y - 4, follower.x + 4, follower.y))) follower.warpTo(this.player.x, this.player.y + 2);
    }
    if (!WORLD_STATE.turnedVane && textSection(this.roomData.textFile, 'vane_first').length) {
      WORLD_STATE.turnedVane = true;
      this.textbox.open(textSection(this.roomData.textFile, 'vane_first'));
    }
  }

  // Along the updraft's arc. The hero's own height (`z`, as in a jump) does
  // the drawing; landing puts them on whatever floor is at the far end.
  updateHop(dt) {
    this.hop.t += dt;
    const at = hopAt(this.hop);
    this.player.x = Math.round(at.x);
    this.player.y = Math.round(at.y);
    this.player.ground = at.base;
    this.player.z = Math.max(0.01, at.z);
    this.player.velocityZ = 0;
    if (!at.done) return;
    this.player.ground = this.hop.floorTo;
    this.player.z = 0;
    this.player.landedThisFrame = true;
    this.hop = null;
    // Round a spire, a whirlwind may have carried you past the seam.
    if (this.landingWhirl) {
      this.landingWhirl = false;
      this.wrapPlayer();
    }
    for (const follower of this.followers) follower.warpTo(this.player.x, this.player.y + 2);
    if (this.onSnow()) this.kickSnow();
  }

  // Stepping onto a door's tiles starts the fade into the next room.
  checkDoors() {
    if (this.player.isAirborne) return;
    const [tx, ty] = this.player.tilePosition();
    const door = (this.roomData.doors ?? []).find((d) => tx >= d.x && tx < d.x + d.w && ty >= d.y && ty < d.y + d.h);
    if (!door) return;
    if (!ROOMS[door.to]) throw new Error(`A door in ${this.roomData.id} leads to unknown room '${door.to}'`);
    // Split up, nobody leaves without the other.
    if (this.partner) {
      const [bx, by] = BACK_STEP[this.player.facing] ?? [0, -1];
      this.player.x += bx * T;
      this.player.y += by * T;
      this.unstick();
      this.player.moving = false;
      const kidVes = this.kid?.skin === VES;
      const section = this.player === this.kid ? (kidVes ? 'split_door_ves' : 'split_door_kid') : (kidVes ? 'split_door_hero_ves' : 'split_door');
      this.textbox.open(textSection(kidVes ? DEAD_TEXT : HUSH_TEXT, section), this.player === this.kid ? this.kid.skin : null);
      return;
    }
    // Out by a door you didn't come in by: you've got through. A puzzle
    // room's bridges and fallen trees stay as they are now, for good.
    if (door.to !== this.cameFrom && this.room.allProps.some((p) => p.log || p.chop === 'fell' || p.treadle || (p.rock && p.sunk))) {
      WORLD_STATE.passed ??= {};
      WORLD_STATE.passed[this.roomData.id] ??= this.room.passedState();
    }
    // Someone ran on ahead from here (see wentAhead): only their door will do.
    const ahead = this.followers.map((follower) => wentAhead(follower.id, this.roomData.id)).find(Boolean);
    if (ahead && ahead.room === this.roomData.id && door.to !== SCENES[ahead.leavesAhead.until]?.room) {
      const [bx, by] = BACK_STEP[this.player.facing] ?? [0, -1];
      this.player.x += bx * T;
      this.player.y += by * T;
      this.unstick();
      this.player.moving = false;
      if (ahead.leavesAhead.blocked) this.textbox.open(textSection(this.roomData.textFile, ahead.leavesAhead.blocked));
      return;
    }
    sfx('door');
    this.doorway = { door, t: 0 };
  }

  // Every landing cracks the tile underfoot; a fully cracked tile gives way.
  // Only old floors do this: the Ruins', and any room marked `crumbles` (the
  // Dead City's); the mountain's rock and snow hold.
  handleLanding() {
    const under = this.bridges.step(this.player, 2.2);
    if (under) sfx('creak');
    landing(this.particles, groundUnder(this.room, this.player), this.player, under);
    if (this.roomData.area !== 'ruins' && !this.roomData.crumbles) return;
    // Stone blocks are solid all the way through: only the floor cracks.
    if (this.player.ground > 0) return;
    // Sure Foot: only every other landing cracks it.
    this.landings = (this.landings ?? 0) + 1;
    if (skillBonus('softLanding') && this.landings % 2) return;
    const [tx, ty] = this.player.tilePosition();
    if (this.room.landOn(tx, ty) === 'broken') this.player.fallInto(tx, ty);
  }

  // An enemy's caught you: it (and any joining in) lunges, you start, and
  // then the lead-in to the fight (drawBattleLeadIn).
  caughtBy(foe) {
    const group = this.groupAround(foe);
    let surprised = false;
    for (const npc of group) surprised = npc.pounceOn(this.player) || surprised;
    if (surprised) sfx('ambush');
    this.player.moving = false;
    this.player.perform('startle');
    for (const follower of this.followers) follower.perform('startle');
    this.battleFlash = { group, t: 0 };
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
        game.changeScene(new GameOverScene(() => continueGame(this.roomData, { whole: true }), 'Your light flickered out.'));
        return;
      }
      // Fled: the enemies stay, but can't start another fight straight away.
      // Won: every enemy in the fight was beaten or pacified, and they're gone
      // for good. Either way the world continues where it was.
      for (const npc of group) {
        npc.lunge = null;
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
    game.changeScene(new BattleScene(group.map((npc) => ENEMIES[npc.enemy]), onEnd, this.battleArea));
  }

  interact() {
    const [px, py] = this.player.interactionPoint();
    // Z on the one of you standing still: together again.
    if (this.partner && this.player.interactionPoints().some(([x, y]) => Math.abs(x - this.partner.x) <= 8 && y <= this.partner.y + 2 && y >= this.partner.y - 16)) {
      // (Ves can't get up onto a block to you, on her crutch.)
      if (this.kid?.skin === VES && this.kid.ground !== this.heroBody.ground) {
        this.textbox.open(textSection(DEAD_TEXT, 'ves_cant_reach'), VES);
        return;
      }
      this.rejoin();
      return;
    }
    // Something only seen in the light isn't there for you until your light
    // reaches it. The iron rings aren't pressed, they're climbed with the rope
    // (tryClimb): one hammered into the tile right in front of you must not
    // swallow the press, or Z at the foot of the face does nothing at all.
    const prop = this.player.interactionPoints().map(([x, y]) => this.room.propAt(x, y)).find((p) => p && this.inLight(p) && !p.grapple && !p.swing);
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
    else if (prop.vane) this.turnVane();
    else if (prop.storage) {
      sfx('select');
      this.storageMenu.open();
    }
    else if (prop.rest) this.useBed(prop);
    else if (prop.travel) this.useTravelDraft(prop);
    else if (prop.join && MEMBERS[prop.join]) this.recruit(prop);
    else if (prop.npc) this.textbox.open(this.npcPages(prop), prop.npc);
    else if (prop.lever) this.useLever(prop);
    else if (prop.rockReset) this.resetRocks(prop);
    else if (prop.rock || prop.log) this.pokeRock(prop);
    else if (prop.chop && !prop.felled) this.chopTree(prop);
    else if (prop.gold) this.takeGold(prop);
    else if (prop.gives && prop.drawScene && SCENES[prop.drawScene]) this.drawFromStone(prop);
    else if (prop.gives) this.takeGift(prop);
    else if (prop.text) this.say(this.roomData.textFile, prop.text);
  }

  // A section of words, then Bramble's say on it, if he's with you and has one
  // (a section of the same name with `_bramble` on the end), with his face;
  // then Ves's (`_ves`), if she's with you.
  say(file, section, speaker = null) {
    this.textbox.open(textSection(file, section), speaker);
    const words = textFile(file);
    const after = [[BRAMBLE, '_bramble'], [VES, '_ves']]
      .filter(([who, end]) => inParty(who) && words[`${section}${end}`]?.length)
      .map(([who, end]) => [words[`${section}${end}`], who]);
    const next = () => {
      const [lines, who] = after.shift();
      this.textbox.open(lines, who);
      if (after.length) this.afterText = next;
    };
    if (after.length) this.afterText = next;
  }

  // --- Bramble (Chapter 3): switching, chopping, gold, the Hush. ---

  // Whether Q can switch you over: Bramble's with you (not off in a scene),
  // and nothing else is going on.
  canSwap() {
    const id = this.swapperId();
    if (!id || this.climb || this.hop || this.ride) return false;
    return this.partner || this.followers.some((f) => f.id === id && !f.hidden);
  }

  // Who steps out from behind you when you press Q: Bramble, while he's with
  // you; after he's gone home, Ves, once she's walking again (on her crutch:
  // she can't jump, climb or push, but she can reach the high levers, and
  // she's light enough for rotten boards).
  swapperId() {
    if (inParty(BRAMBLE)) return BRAMBLE;
    if (inParty(VES) && this.heroBody.carrying !== VES) return VES;
    return null;
  }

  // The body you steer when you split up, for that member.
  kidFor(follower) {
    if (this.kid?.skin !== follower.id) {
      this.kid = new Player(follower.x, follower.y, { skin: follower.id, small: true, crutch: follower.id === VES });
    }
    return this.kid;
  }

  // Q: Bramble steps out from behind you and you steer him (the hero waits
  // where they are); with you split up, Q swaps who you're steering.
  swap() {
    sfx('select');
    if (!this.partner) {
      const follower = this.followers.find((f) => f.id === this.swapperId());
      this.kidFor(follower);
      this.kid.x = Math.round(follower.x);
      this.kid.y = Math.round(follower.y);
      this.kid.ground = follower.ground ?? 0;
      this.kid.z = 0;
      this.kid.facing = this.player.facing;
      this.kid.moving = false;
      // Wedged somewhere a body can't stand (the trail cuts corners): at your feet instead.
      if (this.kid.collidesAt(this.room, this.kid.x, this.kid.y) || this.kid.floorAt(this.room, this.kid.x, this.kid.y) !== this.kid.ground) {
        this.kid.x = this.player.x;
        this.kid.y = this.player.y;
        this.kid.ground = this.player.ground;
      }
      follower.hidden = true;
      this.player.moving = false;
      this.partner = this.heroBody;
      this.player = this.kid;
      // The first time with each of them, they say what they can do.
      const first = follower.id === BRAMBLE ? 'swap_first' : `swap_first_${follower.id}`;
      if (!(WORLD_STATE.read ?? []).includes(first)) {
        WORLD_STATE.read ??= [];
        WORLD_STATE.read.push(first);
        this.textbox.open(textSection(follower.id === BRAMBLE ? HUSH_TEXT : DEAD_TEXT, first), follower.id);
      }
      return;
    }
    this.player.moving = false;
    [this.player, this.partner] = [this.partner, this.player];
  }

  // Together again: Bramble (or Ves) falls in behind you, from wherever they were.
  rejoin() {
    if (!this.partner) return;
    const kid = this.kid;
    this.player = this.heroBody;
    this.partner = null;
    const follower = this.followers.find((f) => f.id === kid.skin);
    if (follower) {
      follower.warpTo(kid.x, kid.y);
      follower.hidden = false;
    }
    sfx('select');
  }

  // Bramble chops a thin tree down (his job: you'd need a proper axe). It
  // falls the way whoever's chopping faces: into brook water it's a bridge,
  // onto open ground it's a log you can roll, and if there's no room there
  // it won't come down that way. A hollow trunk splits open instead.
  chopTree(prop) {
    if (!inParty(BRAMBLE)) {
      this.say(this.roomData.textFile, prop.text ?? 'thin_pine');
      this.afterText = () => this.textbox.open(textSection(HUSH_TEXT, 'chop_alone'));
      return;
    }
    if (prop.raise > this.player.ground) return;
    if (prop.chop === 'open') {
      this.room.fell(prop);
      WORLD_STATE.chopped ??= [];
      if (!WORLD_STATE.chopped.includes(prop.key)) WORLD_STATE.chopped.push(prop.key);
      sfx('chop');
      this.textbox.open(textSection(this.roomData.textFile, prop.openText ?? 'hollow_open'), BRAMBLE);
      return;
    }
    const [dx, dy] = STEP[this.player.facing];
    const tx = prop.x / T + dx;
    const ty = prop.y / T + dy;
    const into = this.room.logCanEnter(tx, ty);
    if (!into || this.somebodyAt(tx, ty)) {
      sfx('error');
      this.textbox.open(textSection(HUSH_TEXT, 'chop_no_room'), BRAMBLE);
      return;
    }
    this.room.fell(prop);
    this.room.addLog(tx, ty, into === 'sink');
    sfx('chop');
    this.shakeCamera(2, 0.25);
    const first = !(WORLD_STATE.read ?? []).includes('chop_first');
    if (first) {
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push('chop_first');
    }
    this.textbox.open(textSection(HUSH_TEXT, first ? 'chop_first' : into === 'sink' ? 'chop_splash' : 'chop_timber'), BRAMBLE);
  }

  // Whether anyone (you, the other of you, or an enemy) is standing on a tile.
  somebodyAt(tx, ty) {
    const on = (b) => b && Math.floor(b.x / T) === tx && Math.floor((b.y - 1) / T) === ty;
    return on(this.player) || on(this.partner) || this.npcs.some((npc) => Math.floor(npc.x / T) === tx && Math.floor((npc.y - 1) / T) === ty);
  }

  // A purse of coins: its words, then the gold.
  takeGold(prop) {
    const pages = prop.text ? [...textSection(this.roomData.textFile, prop.text)] : [];
    HERO_STATE.gold += prop.gold;
    pages.push(`You found ${prop.gold} gold!`);
    sfx('heal');
    WORLD_STATE.taken ??= [];
    WORLD_STATE.taken.push(prop.key);
    prop.markTaken();
    this.textbox.open(pages);
  }

  // Treadles: down under whoever's standing on them (either of you), or a
  // rock or log; their gates open and shut with them.
  settleTreadles() {
    if (!this.hasTreadles) return;
    const bodies = [this.player, this.partner].filter(Boolean);
    const was = this.room.props.filter((p) => p.opensWith && p.isOpen).length;
    this.room.settleTreadles(bodies);
    // A gate won't shut on a rock or log sitting in its way, either.
    const things = this.room.props.filter((p) => (p.rock || p.log) && !p.sunk && !p.hidden).map((p) => ({ x: p.x + T / 2, y: p.y + T }));
    this.room.refreshPuzzles([...bodies, ...things]);
    const now = this.room.props.filter((p) => p.opensWith && p.isOpen).length;
    if (now !== was) sfx(now > was ? 'door' : 'back');
  }

  // The Hush goes over. Keep still in a leaf pile and it misses you; anywhere
  // else, it doesn't.
  updateHush(dt) {
    if (!this.hush) return;
    this.hush.update(dt);
    const bodies = [this.player, this.partner].filter(Boolean);
    for (const body of bodies) {
      const pile = this.room.props.find((p) => p.hide && !p.hidden && p.overlaps(body.x - 1, body.y - 2, body.x + 1, body.y));
      const tucked = Boolean(pile) && !body.moving && !body.isAirborne;
      body.tucked = tucked;
      // Its own tucked-in look: a leaf pile's, or a doorway alcove's (alcove_hidden).
      if (pile) pile.setLook(tucked ? `${pile.baseLook}_hidden` : null);
      if (!tucked && this.hush.covers(body.x, body.y)) {
        this.caught = { t: 0 };
        sfx('hurt');
        return;
      }
    }
    for (const pile of this.room.props.filter((p) => p.hide)) {
      if (!bodies.some((b) => b.tucked && pile.overlaps(b.x - 1, b.y - 2, b.x + 1, b.y))) pile.setLook(null);
    }
    // Hiding, Bramble squeezes in beside you.
    const friend = this.followers.find((f) => f.id === this.swapperId());
    if (friend && !this.partner) friend.tucked = this.player.tucked;
  }

  // Seen: everything goes dark, and you're back at the door you came in by,
  // with Bramble, the Hush gone on round its loop.
  updateCaught(dt) {
    this.caught.t += dt;
    const bog = this.caught.bog;
    if (bog) bog.body.sinking = Math.min(1, this.caught.t / (SINK_SECONDS * 0.7));
    if (this.caught.t < (bog ? SINK_SECONDS : CAUGHT_SECONDS)) return;
    this.caught = null;
    if (bog) {
      this.climbOutOfBog(bog.body);
      return;
    }
    this.rejoin();
    this.player.x = this.arrival.x * T + T / 2;
    this.player.y = (this.arrival.y + 1) * T;
    this.player.ground = 0;
    this.player.z = 0;
    this.player.tucked = false;
    this.unstick();
    for (const follower of this.followers) {
      follower.warpTo(this.player.x, this.player.y);
      follower.tucked = false;
    }
    this.room.resetPuzzle();
    this.hush?.reset(this.roomData.hush.start ?? 0);
    const first = !(WORLD_STATE.read ?? []).includes('hush_caught');
    if (first) {
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push('hush_caught');
    }
    // (Bramble says so in the Hushwood; Ves, in the Dead City.)
    const ves = !inParty(BRAMBLE) && inParty(VES);
    this.textbox.open(textSection(ves ? DEAD_TEXT : HUSH_TEXT, first ? 'hush_caught' : 'hush_caught_again'), ves ? VES : inParty(BRAMBLE) ? BRAMBLE : null);
  }

  // --- Stepping-stones: a log, rock or cask sunk in water or bog. ---

  // Whoever's standing on one is up on top of it, keeping their balance.
  // Stand still and you settle into the middle of it (it's small, and
  // there's water all round).
  balance(dt, input) {
    const still = !(input.isDown('left') || input.isDown('right') || input.isDown('up') || input.isDown('down'));
    for (const body of [this.player, this.partner, ...this.followers].filter(Boolean)) {
      const tx = Math.floor(body.x / T);
      const ty = Math.floor((body.y - 1) / T);
      const on = (body.ground ?? 0) === 0 && !body.isAirborne && this.room.isSteppingStone(tx, ty);
      body.balanceTime = on ? (body.balanceTime ?? 0) + dt : 0;
      body.balancing = on;
      // Settle onto the middle of it (just you: the one you're steering).
      if (on && body === this.player && still && !body.carried) {
        const cx = tx * T + T / 2;
        const cy = (ty + 1) * T - 3;
        const step = SETTLE_SPEED * dt;
        if (body.x !== cx) body.moveAxis(this.room, 'x', Math.sign(cx - body.x) * Math.min(step, Math.abs(cx - body.x)));
        if (body.y !== cy) body.moveAxis(this.room, 'y', Math.sign(cy - body.y) * Math.min(step, Math.abs(cy - body.y)));
      }
    }
  }

  // --- The Lantern Marsh: the bog (`%` tiles) and the mist (`mist`). ---

  // Step into the bog (at floor level, not mid-jump, and not where a log or
  // a rock has sunk to make a step) and after a moment it has you.
  checkBog(dt) {
    for (const body of [this.player, this.partner].filter(Boolean)) {
      const [tx, ty] = body.tilePosition();
      const stuck = body.ground === 0 && !body.isAirborne && this.room.isBog(tx, ty);
      body.inBog = stuck ? (body.inBog ?? 0) + dt : 0;
      if (body.inBog > BOG_GRACE) {
        body.moving = false;
        this.caught = { t: 0, bog: { body } };
        sfx('splash');
        return;
      }
    }
  }

  // Sunk: back at the door you came in by, muddy to the knees, with Bramble,
  // and the room as it was (like being seen by the Hush).
  climbOutOfBog(body) {
    body.sinking = 0;
    body.inBog = 0;
    this.rejoin();
    this.player.x = this.arrival.x * T + T / 2;
    this.player.y = (this.arrival.y + 1) * T;
    this.player.ground = 0;
    this.player.z = 0;
    this.player.sinking = 0;
    this.unstick();
    for (const follower of this.followers) follower.warpTo(this.player.x, this.player.y);
    this.room.resetPuzzle();
    const first = !(WORLD_STATE.read ?? []).includes('bog_sunk');
    if (first) {
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push('bog_sunk');
    }
    const who = body.skin === BRAMBLE ? 'kid' : 'you';
    this.say(MARSH_TEXT, first ? `bog_sunk_${who}` : `bog_again_${who}`);
  }

  // The mist: everything goes pale and soft beyond a few steps of you, but
  // round every lantern (and anything else that glows, like a wisp) it
  // thins, and you can see the way.
  drawMist(ctx) {
    const lights = [...this.room.lightSources(), ...(this.cutscene?.lights ?? [])];
    for (const npc of this.npcs) {
      if (!npc.light) continue;
      const flicker = 0.85 + Math.sin(this.time * 7 + npc.x) * 0.1;
      lights.push({ x: npc.x, y: npc.y - 10, radius: npc.light * flicker });
    }
    this.drawShade(ctx, this.roomData.mist, MIST_TINT, MIST_SIGHT, lights);
  }

  // --- Push puzzles (Chapter 3) ---
  // Walk into a rock, square on, and keep walking: after a moment it slides
  // one tile, if there's room behind it (open floor, no wall, block, doorway,
  // other rock or enemy). A rock that stops on a button holds it down; when
  // all of a gate's buttons are down, it opens for good.
  //
  // Logs (the Hushwood) push the same way, but once they're going they roll
  // on till something stops them, or into brook water, where they sink and
  // make a bridge. Anyone can push a log; only the hero can shift a rock.
  pushRocks(dt, input) {
    const room = this.room;
    for (const thing of room.props.filter((p) => p.slide && (p.rock || p.log))) {
      const slide = thing.slide;
      slide.t = Math.min(1, slide.t + dt / (thing.log ? LOG_SLIDE_SECONDS : ROCK_SLIDE_SECONDS));
      thing.x = Math.round(slide.fromX + (slide.toX - slide.fromX) * slide.t);
      thing.y = Math.round(slide.fromY + (slide.toY - slide.fromY) * slide.t);
      if (slide.t < 1) continue;
      thing.slide = null;
      if (slide.sink) {
        // (Into the water, a log; into the marsh's bog, a log or a rock.)
        room.sinkLog(thing, slide.toX / T, slide.toY / T);
        sfx('splash');
        this.rockSettled();
        continue;
      }
      if (thing.log && this.rollOn(thing, slide.dx, slide.dy)) continue;
      this.rockSettled();
    }

    const player = this.player;
    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    // Straight on only, from the floor.
    if (Boolean(dx) === Boolean(dy) || player.isAirborne || player.ground > 0) {
      this.pushing = null;
      return;
    }
    // The rock right in front: a pixel further would bump it, and you're
    // lined up with it (not catching its corner).
    const ax = player.x + dx;
    const ay = player.y + dy;
    const rock = room.props.find((r) => (r.rock || r.log) && !r.sunk && !r.slide && r.overlaps(ax - 5, ay - 6, ax + 5, ay)
      && (dx ? Math.abs(player.y - 3 - (r.y + T / 2)) <= 5 : Math.abs(player.x - (r.x + T / 2)) <= 5));
    if (!rock) {
      this.pushing = null;
      return;
    }
    if (this.pushing?.rock !== rock || this.pushing.dx !== dx || this.pushing.dy !== dy) this.pushing = { rock, dx, dy, t: 0 };
    this.pushing.t += dt;
    if (this.pushing.t < ROCK_PUSH_SECONDS) return;
    this.pushing.t = 0;
    // Ves can't push anything, on a crutch. She says so, once.
    if (player.crutch) {
      if (!this.vesLeaned) {
        this.vesLeaned = true;
        this.textbox.open(textSection(DEAD_TEXT, 'ves_push'), VES);
      }
      return;
    }
    // Bramble leans on a rock with everything he's got. It doesn't notice.
    if (rock.rock && player.small) {
      if (!this.leanedOn) {
        this.leanedOn = true;
        this.textbox.open(textSection(HUSH_TEXT, 'kid_rock'), BRAMBLE);
      }
      return;
    }
    const tx = rock.x / T + dx;
    const ty = rock.y / T + dy;
    const into = rock.log ? room.logCanEnter(tx, ty) : room.rockCanEnter(tx, ty);
    if (!into || this.somebodyAt(tx, ty)) return;
    sfx('push');
    this.pokedRock = null;
    rock.slide = { fromX: rock.x, fromY: rock.y, toX: tx * T, toY: ty * T, t: 0, dx, dy, sink: into === 'sink' };
    // Off whatever button it was on.
    room.settleButtons();
  }

  // A log that's just rolled a tile rolls another, if it can. In a current
  // (the Old Drains) it goes the current's way instead.
  rollOn(log, dx, dy) {
    const flow = this.room.flowAt(log.x / T, log.y / T);
    if (flow) [dx, dy] = FLOW_DIRS[flow];
    const tx = log.x / T + dx;
    const ty = log.y / T + dy;
    const into = this.room.logCanEnter(tx, ty);
    if (!into || this.somebodyAt(tx, ty)) return false;
    log.slide = { fromX: log.x, fromY: log.y, toX: tx * T, toY: ty * T, t: 0, dx, dy, sink: into === 'sink' };
    return true;
  }

  // A rock has come to rest: buttons go down under it, and a gate may open.
  rockSettled() {
    const { opened, pressed } = this.room.settleButtons();
    if (opened.length) {
      sfx('door');
      const gate = opened[0];
      this.textbox.open(gate.openText ? textSection(this.roomData.textFile, gate.openText) : ['Somewhere nearby, something grinds open.']);
    } else if (pressed) {
      sfx('click');
    }
  }

  // Z on a rock says what it is; Z on it again, straight after, rolls every
  // rock home, so even boxed in by your own rocks you're never stuck.
  pokeRock(prop) {
    if (this.pokedRock === prop) {
      this.pokedRock = null;
      this.resetRocks({ text: 'rock_home' });
      return;
    }
    this.pokedRock = prop;
    if (prop.text) this.textbox.open(textSection(this.roomData.textFile, prop.text));
  }

  // The stump that puts every rock back (in case one's stuck in a corner).
  resetRocks(prop) {
    // Split up, everything goes back to how it was when you came in, you two
    // included: back together at the door (so a reset can't fetch Bramble
    // through a gate he's shut behind).
    const split = Boolean(this.partner);
    this.rejoin();
    this.room.resetRocks();
    sfx('push');
    // Or standing out on a log bridge that's just gone: back to the door,
    // rather than onto whichever bank is nearer (which could be the far one).
    if (split || this.player.collidesAt(this.room, this.player.x, this.player.y)) {
      this.player.x = this.arrival.x * T + T / 2;
      this.player.y = (this.arrival.y + 1) * T;
      this.player.ground = 0;
    }
    this.unstick();
    for (const follower of this.followers) follower.warpTo(this.player.x, this.player.y);
    if (prop.text) this.textbox.open(textSection(this.roomData.textFile, prop.text));
  }

  // A switch: flip it, unless the gate it belongs to is already open. Gates can
  // say something when they open (`openText`) or when you get the order wrong
  // (`resetText`), from the room's text file.
  useLever(prop, reached = false) {
    const say = (section, fallback) => this.textbox.open(section ? textSection(this.roomData.textFile, section) : [fallback]);
    // A `high` lever (the Dead City's) is up out of reach: only Ves can hook
    // it down with her crutch, whether you're steering her or she's with you.
    if (prop.high) {
      const vesHere = this.player.skin === VES || (!this.partner && this.followers.some((f) => f.id === VES && !f.hidden) && this.heroBody.carrying !== VES);
      if (!vesHere) {
        this.textbox.open(textSection(DEAD_TEXT, 'high_lever_no'));
        return;
      }
      // She can't jump: she reaches up and hooks it, with her crutch while
      // she's hurt, her umbrella's crook once she's not, and pulls it down.
      if (!reached) {
        const body = this.player.skin === VES ? this.player : this.followers.find((f) => f.id === VES);
        const reach = { prop, body, anim: isHurt(VES) ? 'ves_crutch_reach' : 'ves_umbrella_reach' };
        if (body === this.player) {
          body.facing = 'up';
          body.moving = false;
        } else {
          // Following you: you step back out of her way, and she comes up to
          // where you were, under the lever, before she reaches for it.
          const spot = { x: this.player.x, y: this.player.y };
          const aside = [[0, T], [-T, 0], [T, 0], [0, 0]].map(([dx, dy]) => ({ x: spot.x + dx, y: spot.y + dy }))
            .find((p) => (p.x === spot.x && p.y === spot.y) || !this.room.collides(p.x - 5, p.y - 6, p.x + 5, p.y));
          reach.walk = { t: 0, seconds: 0.45, hero: { from: { ...spot }, to: aside }, ves: { from: { x: body.x, y: body.y }, to: spot } };
        }
        this.reaching = reach;
        if (!reach.walk) this.startReach();
        return;
      }
    }
    if (this.room.props.some((gate) => gate.isOpen && gate.opensWith?.includes(prop.lever))) {
      if (prop.text) say(prop.text);
      return;
    }
    const { opened, reset } = this.room.flipLever(prop.lever);
    // A sluice (a lever some channel's water answers to): it won't send water
    // down onto a rock or a log sitting in the channel, or onto either of you.
    // (It checks after the flip, and flips back.)
    const flooded = (thing) => this.room.props.some((w) => w.wet && !w.hidden && w.x === thing.x && w.y === thing.y);
    const under = (body) => body && this.room.props.some((w) => w.wet && !w.hidden && w.overlaps(body.x - 5, body.y - 6, body.x + 5, body.y));
    if (this.room.props.some((p) => (p.rock || (p.log && !p.sunk)) && !p.hidden && flooded(p)) || under(this.player) || under(this.partner)) {
      this.room.flipLever(prop.lever);
      sfx('error');
      this.textbox.open(textSection(HUSH_TEXT, under(this.player) || under(this.partner) ? 'sluice_someone' : 'sluice_blocked'));
      return;
    }
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
  // A weapon drawn out of something (the Fallen Star, out of its stone): it's
  // yours, the thing it was in shows it gone, and its scene plays (`drawScene`:
  // the spin, the sword held high, the jingle).
  drawFromStone(prop) {
    const id = prop.gives;
    if (!HERO_STATE.weapons.includes(id)) HERO_STATE.weapons.push(id);
    WORLD_STATE.taken ??= [];
    WORLD_STATE.taken.push(prop.key);
    prop.markTaken();
    this.playCutscene(SCENES[prop.drawScene]);
  }

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
    // A party member's own weapon or armor (Ves's umbrella parts) says who it's for.
    const slot = armor ? 'armor' : weapon ? 'weapon' : null;
    const wielder = slot ? wielderOf(slot, id) : HERO;
    if (wielder !== HERO) {
      const list = slot === 'armor' ? HERO_STATE.armors : HERO_STATE.weapons;
      if (!list.includes(id)) list.push(id);
      // Away from the party (Ves, lost below the clouds): you keep it for her.
      const who = MEMBERS[wielder].name[0] + MEMBERS[wielder].name.slice(1).toLowerCase();
      pages.push(inParty(wielder)
        ? `You got the ${name}! It's for ${MEMBERS[wielder].name}. Put it on from EQUIP (press C).`
        : `You pocketed the ${name}. ${who} might like it.`);
    } else if (gear) {
      giveGear(id);
      pages.push(...textSection(GEAR_TEXT, `got_${id}`));
    } else if (armor) {
      if (!HERO_STATE.armors.includes(id)) HERO_STATE.armors.push(id);
      pages.push(`You got the ${name}! Wear it from EQUIP (press C).`);
    } else if (weapon) {
      if (!HERO_STATE.weapons.includes(id)) HERO_STATE.weapons.push(id);
      pages.push(`You got the ${name}! Equip it from EQUIP (press C).`);
    } else {
      // Into your bag, or with that full, into storage.
      const placed = giveItem(id);
      if (placed === 'stored') pages.push(`You got the ${name}. Your bag is full, so it went to storage (the chests by the save points).`);
      else if (placed) pages.push(`You got the ${name}.`);
      else {
        got = false;
        pages.push(`You'd take the ${name}, but your bag and storage are both full.`);
      }
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
    this.resting = { phase: 'words', t: 0, dream: prop.dream ?? DEFAULT_DREAM, bed: prop };
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
      this.tuckIn(rest.bed);
      // The dream, when there is one, plays in the dark (see DEFAULT_DREAM).
      // Most are only dreamt once (unless the scene says `once: false`).
      const dream = SCENES[rest.dream];
      WORLD_STATE.seenScenes ??= [];
      if (dream && (dream.once === false || !WORLD_STATE.seenScenes.includes(dream.id))) {
        if (!WORLD_STATE.seenScenes.includes(dream.id)) WORLD_STATE.seenScenes.push(dream.id);
        rest.phase = 'dream';
        rest.dreamt = dream;
        this.playCutscene(dream);
      }
    } else if (rest.phase === 'dream') {
      this.cutscene.update(dt, input);
      if (!this.cutscene.done) return;
      this.cutscene = null;
      // The dream counts as seen, so the room can change with it while it's
      // dark; unless it has a scene for waking up, which changes it after.
      if (!rest.dreamt?.wakeScene) this.room.refreshShowsUp();
      rest.phase = 'sleep';
      rest.t = 0;
    } else if (rest.phase === 'sleep') {
      if (rest.t < REST_SLEEP_SECONDS) return;
      healHeroFully();
      music.play(this.song);
      rest.phase = 'wake';
      rest.t = 0;
    } else if (rest.phase === 'wake') {
      if (rest.t < REST_FADE_SECONDS) return;
      this.resting = null;
      // A dream can have a scene for waking up from it (`wakeScene`), which
      // plays instead of the usual words.
      const wake = SCENES[rest.dreamt?.wakeScene];
      if (wake) {
        WORLD_STATE.seenScenes ??= [];
        if (!WORLD_STATE.seenScenes.includes(wake.id)) WORLD_STATE.seenScenes.push(wake.id);
        this.playCutscene(wake);
        return;
      }
      this.getUp();
      sfx('heal');
      this.textbox.open([textFile(this.roomData.textFile).rested?.[0] ?? 'You slept like a stone. Your HP is fully restored.']);
    }
  }

  // Into bed: if the bed has a NAME_sleeping sprite, it shows you asleep in
  // it, and you (the standing you) are hidden until you get up. You're kept
  // where your head is, so emotes show over it.
  tuckIn(bed) {
    if (!bed || !PROP_SPRITES[`${bed.baseLook}_sleeping`]) return;
    this.sleeper = { bed, from: { x: this.player.x, y: this.player.y, facing: this.player.facing } };
    bed.setLook(`${bed.baseLook}_sleeping`);
    this.player.hidden = true;
    this.player.x = bed.x + 12;
    this.player.y = bed.y + T + 6;
  }

  // Sitting up in bed (NAME_sitting), or lying back down.
  sitUp(sitting = true) {
    const bed = this.sleeper?.bed;
    if (bed) bed.setLook(`${bed.baseLook}_${sitting ? 'sitting' : 'sleeping'}`);
  }

  // Out of bed, back where you were standing.
  getUp() {
    if (!this.sleeper) return;
    const { bed, from } = this.sleeper;
    bed.setLook();
    Object.assign(this.player, from);
    this.player.hidden = false;
    this.sleeper = null;
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
    // Not with Ves on your back: you'd need both hands.
    if (this.player.carrying) {
      const near = findClimb(this.room, this.player) || ringNear(this.room, this.player);
      if (near) this.say(MARSH_TEXT, 'carry_rope');
      return Boolean(near);
    }
    // Bramble doesn't do ropes. He says so. Nor does Ves, on her crutch.
    if (this.player === this.kid) {
      const near = findClimb(this.room, this.player) || ringNear(this.room, this.player);
      if (near) this.textbox.open(this.kid.skin === VES ? textSection(DEAD_TEXT, 'ves_rope') : textSection(HUSH_TEXT, 'kid_rope'), this.kid.skin);
      return Boolean(near);
    }
    const plan = findClimb(this.room, this.player);
    if (!plan) {
      // A ring close by that you can't throw to from here: say why, rather
      // than nothing (standing up on a block, or not close enough under it).
      const near = hasGear('climbing_rope') && ringNear(this.room, this.player);
      if (near) this.textbox.open(textSection(GEAR_TEXT, this.player.ground > 0 ? 'ring_from_block' : 'ring_too_far'));
      return Boolean(near);
    }
    if (!hasGear('climbing_rope')) {
      this.textbox.open(textSection(GEAR_TEXT, plan.kind === 'swing' ? 'swing_no_rope' : 'ring_no_rope'));
      return true;
    }
    // Where there's another way round for him (a room with `ropeSplit`),
    // Bramble won't go on the rope: he stays where he is, and you're split up.
    const vesBelow = this.swapperId() === VES && !this.partner && this.followers.some((f) => f.id === VES && !f.hidden);
    if (vesBelow || (this.roomData.ropeSplit && !this.partner && this.followers.some((f) => f.id === BRAMBLE && !f.hidden))) {
      this.splitOff();
      this.textbox.open(vesBelow ? textSection(DEAD_TEXT, 'ves_rope_split') : textSection(HUSH_TEXT, 'kid_rope_split'), vesBelow ? VES : BRAMBLE);
      this.afterText = () => {
        this.climb = new Climb(findClimb(this.room, this.player) ?? plan, this.player, this.room);
      };
      return true;
    }
    this.climb = new Climb(plan, this.player, this.room);
    return true;
  }

  // Up onto a block with Ves following: she can't climb on her crutch, so
  // she stays below where she is, and you're split up (Q to steer her).
  leaveVesBelow() {
    if (this.partner || this.player !== this.heroBody || this.swapperId() !== VES) return;
    const follower = this.followers.find((f) => f.id === VES && !f.hidden);
    if (!follower) return;
    this.kidFor(follower);
    this.kid.x = Math.round(follower.x);
    this.kid.y = Math.round(follower.y);
    this.kid.ground = 0;
    this.kid.z = 0;
    this.kid.facing = 'up';
    this.kid.moving = false;
    if (this.kid.collidesAt(this.room, this.kid.x, this.kid.y) || this.kid.floorAt(this.room, this.kid.x, this.kid.y) > 0) {
      this.kid.y += T;
      if (this.kid.collidesAt(this.room, this.kid.x, this.kid.y) || this.kid.floorAt(this.room, this.kid.x, this.kid.y) > 0) this.kid.y -= 2 * T;
    }
    follower.hidden = true;
    this.partner = this.kid;
    if (!(WORLD_STATE.read ?? []).includes('ves_stays')) {
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push('ves_stays');
      this.textbox.open(textSection(DEAD_TEXT, 'ves_stays'), VES);
    }
  }

  // Bramble stays put where he is, as you go on: split up, with you still
  // steering the hero.
  splitOff() {
    const follower = this.followers.find((f) => f.id === this.swapperId());
    this.kidFor(follower);
    this.kid.x = this.player.x;
    this.kid.y = this.player.y;
    this.kid.ground = this.player.ground;
    this.kid.z = 0;
    this.kid.facing = 'down';
    this.kid.moving = false;
    follower.hidden = true;
    this.partner = this.kid;
  }

  // Tiles can have words too (a flower bed, a pillar, a pool of water): words
  // for that one spot (`looks`), or for every tile of its kind in the room (`tileTexts`).
  inspectTile(tx, ty) {
    const spot = (this.roomData.looks ?? []).find((look) => look.x === tx && look.y === ty);
    const section = spot?.text ?? this.roomData.tileTexts?.[this.room.tileAt(tx, ty)];
    if (section) this.say(this.roomData.textFile, section);
  }

  // Saves the game where the player is standing.
  // A green updraft (src/data/travel.js); getting to its room already found
  // it. The first time you press Z on one, it's explained (by Ves, if she's
  // with you); after that it reminds you that you travel from save points.
  useTravelDraft(prop) {
    const say = (section, speaker = null) => this.textbox.open(textSection('interactions/travel.txt', section), speaker);
    const explained = canRide() ? 'travel_explained' : 'travel_seen';
    if (!(WORLD_STATE.read ?? []).includes(explained)) {
      WORLD_STATE.read ??= [];
      WORLD_STATE.read.push(explained);
      if (canRide()) {
        say('found');
        this.afterText = () => say('found_ves', VES);
      } else {
        say('found_alone');
      }
      return;
    }
    say(canRide() ? 'from_saves' : 'no_ves');
  }

  // A cutscene stilling the weather (or bringing it back): the snow and fog
  // go to `to` over `seconds`.
  fadeWeather(to, seconds) {
    this.weatherFade = { from: this.weatherAmount, to, seconds: Math.max(0.01, seconds), t: 0 };
  }

  tickWeather(dt) {
    const fade = this.weatherFade;
    if (!fade) return;
    fade.t = Math.min(fade.seconds, fade.t + dt);
    const k = fade.t / fade.seconds;
    this.weatherAmount = fade.from + (fade.to - fade.from) * (k * k * (3 - 2 * k));
    if (k >= 1) this.weatherFade = null;
  }

  useSavePoint() {
    if (this.partner) {
      this.textbox.open(textSection(HUSH_TEXT, 'split_save'));
      return;
    }
    const [x, y] = this.player.tilePosition();
    const saved = saveGame(this.roomData.id, { x, y });
    sfx('save');
    // The room's own words for it, or the Ruins' if its text file hasn't any.
    const section = saved ? 'save_point' : 'save_failed';
    this.textbox.open(textFile(this.roomData.textFile)[section] ?? textSection('interactions/the_ruins.txt', section));
    // Then, with Ves along and somewhere else found in this chapter to go,
    // TRAVEL (Stay here first, so tapping through the save doesn't send you off).
    const here = draftIn(this.roomData.id);
    if (canRide() && foundDrafts().some((draft) => draft.id !== here?.id)) {
      this.afterText = () => this.offerTravel(here?.id ?? null);
    }
  }

  // TRAVEL from a save point: pick a place and Ves rides the wind there with
  // you, as up a wind geyser (GeyserRide), from where you're standing.
  offerTravel(here) {
    sfx('select');
    this.travelMenu.open(here, (draft) => {
      sfx('travel');
      const from = { x: this.player.x, y: this.player.y };
      const wind = { x: this.player.x, y: this.player.y, to: draft.room, spawn: { x: draft.x, y: draft.y } };
      this.ride = new GeyserRide({ geyser: wind, from });
    });
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
    // On a geyser ride, the ride draws the hero and Ves itself.
    const people = this.ride ? [this.ride, ...this.followers.filter((follower) => follower.id !== VES)] : [...this.followers, this.player, ...(this.partner ? [this.partner] : [])];
    const entities = [...this.prints, ...props, ...this.room.standing, ...this.npcs, ...this.geysers, ...this.updrafts, ...this.whirls, ...(this.cutscene?.drawables ?? []), ...people].sort((a, b) => a.sortY - b.sortY);
    if (this.spire) {
      this.drawSpire(ctx);
      for (const entity of entities) this.drawOnSpire(ctx, entity);
    } else {
      ctx.drawImage(this.room.background, -this.camera.x, -this.camera.y);
      this.bridges.draw(ctx, this.camera, this.room.background, SCREEN_WIDTH);
      this.room.drawDamage(ctx, this.camera);
      this.crumble?.drawFloor(ctx, this.camera);
      // Outdoors by day, everything standing casts a shadow (see shadows.js).
      if (this.underSky) {
        const sun = sunShadows(WORLD_STATE.playSeconds);
        drawBlockShadows(ctx, this.camera, this.room, sun);
        drawShadows(ctx, this.camera, entities, sun);
      }
      for (const entity of entities) entity.draw(ctx, this.camera);
      this.crumble?.draw(ctx, this.camera);
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
    else if (this.lamplit) this.drawLamplight(ctx, false);
    // The snow blows the way the weathervanes say, if there are any; on a
    // gusty face it blows harder during a gust.
    if (this.roomData.weather && this.weatherAmount > 0) drawSnow(ctx, this.roomData.weather, this.time, (this.roomData.wind ?? 1) * (this.gusting ? 2.6 : 1), this.wind ? WIND_STEP[this.wind] : null, this.weatherAmount);
    if (this.roomData.fog && this.weatherAmount > 0) drawFog(ctx, this.time, this.roomData.fog * this.weatherAmount);
    // The Hush's shadow, over everything on the floor, and the old wood's gloom.
    this.hush?.draw(ctx, this.camera);
    if (this.roomData.gloom) this.drawGloom(ctx);
    if (this.roomData.mist) this.drawMist(ctx);
    if (this.caught) this.drawCaught(ctx);
    if (this.partner && !this.cutscene) this.drawSplitTag(ctx);
    if (this.roomData.dark) this.drawDarkness(ctx);
    this.cutscene?.drawOverlay(ctx, this.camera);
    // Underground, the edges of the screen sink into shadow; outdoors they don't.
    if (!OUTDOOR_AREAS.has(this.roomData.area) || this.roomData.indoors) ctx.drawImage(vignette(), 0, 0);
    if (this.resting) this.drawBlack(ctx, this.restDarkness);
    // A dream's vision, over the dark (see visions.js).
    if (this.vision) drawVision(ctx, this.vision, performance.now() / 1000);

    this.textbox.draw(ctx);
    this.pauseMenu.draw(ctx);
    this.storageMenu.draw(ctx);
    this.travelMenu.draw(ctx);
    this.drawTitleCard(ctx);

    if (this.player.isFalling) {
      const fade = Math.min(1, Math.max(0, (this.player.fallTime - FALL_SECONDS) / FADE_SECONDS));
      this.drawBlack(ctx, fade);
    }
    if (this.doorway) this.drawBlack(ctx, this.doorway.t / DOOR_FADE_SECONDS);
    if (this.fadeIn > 0) this.drawBlack(ctx, this.fadeIn / DOOR_FADE_SECONDS);
    if (this.ride) this.drawBlack(ctx, this.ride.blackout);

    if (this.battleFlash) this.drawBattleLeadIn(ctx, Math.max(0, this.battleFlash.t - BATTLE_NOTICE_SECONDS));
  }

  // Before an ordinary battle: a quicker take on a story battle's lead-in
  // (scenePlayer.js). The dark closes in to a spotlight on you, then
  // everything eases to black. No white, no strobing.
  drawBattleLeadIn(ctx, t) {
    const ease = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
    const { player } = this;
    const x = this.spire ? this.project(player.x).x : player.x - this.camera.x;
    const y = player.y - player.ground - 10 - this.camera.y;
    const close = ease(t / (BATTLE_FLASH_SECONDS * 0.6));
    const radius = 420 + (34 - 420) * close;
    const dark = ctx.createRadialGradient(x, y, radius * 0.55, x, y, radius);
    dark.addColorStop(0, 'rgba(0, 0, 0, 0)');
    dark.addColorStop(1, `rgba(0, 0, 0, ${(0.92 * close).toFixed(3)})`);
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    const black = ease((t - BATTLE_FLASH_SECONDS * 0.65) / (BATTLE_FLASH_SECONDS * 0.3));
    if (black > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${black.toFixed(3)})`;
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
  // A lamplit place (the village) does it its own way: see drawLamplight.
  drawTimeOfDay(ctx) {
    const { night, dusk } = daylight();
    if (dusk > 0.02) {
      ctx.fillStyle = `rgba(255, 168, 90, ${(dusk * 0.11).toFixed(3)})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    if (this.lamplit) this.drawLamplight(ctx, true);
    else if (night > 0.02) this.drawShade(ctx, night * NIGHT_SHADE, NIGHT_TINT, 26);
  }

  // Whether this room is lit by its own lamps and fires (see lamplight.js).
  // Never a dark room: lamplight doesn't burn your candle.
  get lamplit() {
    this.isLamplit ??= isLamplit(this.roomData);
    return this.isLamplit;
  }

  // Where a point in the room lands on screen, and how big a light of
  // `radius` there looks. Round the spire, lights sit where the rock bends to
  // (null if it's round the back).
  toScreen(x, y, radius) {
    if (!this.spire) return { x: x - this.camera.x, y: y - this.camera.y, r: radius };
    const point = this.project(x);
    if (point.scale <= 0) return null;
    return { x: point.x, y: y - this.camera.y, r: radius * (0.5 + 0.5 * point.scale) };
  }

  // Shade over the whole screen (`alpha` of the colour `tint`), with soft holes
  // where light reaches: the room's lights (or the `lights` given, each as
  // { x, y, radius } and how much of the shade it lifts, `cut`), and a hole
  // `ownRadius` wide round you. The hole is one picture, drawn once and
  // scaled, so a room full of lights costs next to nothing.
  drawShade(ctx, alpha, tint, ownRadius, lights = this.room.lightSources()) {
    darkCanvas ??= Object.assign(document.createElement('canvas'), { width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    const dark = darkCanvas.getContext('2d');
    dark.globalCompositeOperation = 'source-over';
    dark.globalAlpha = 1;
    dark.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.fillStyle = `rgba(${tint}, ${alpha.toFixed(3)})`;
    dark.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    dark.globalCompositeOperation = 'destination-out';
    const hole = holeSprite();
    for (const { x, y, radius, cut = 1 } of [...lights, { ...this.lightPoint, radius: ownRadius }]) {
      const point = radius > 0 && this.toScreen(x, y, radius);
      if (!point || !onScreen(point)) continue;
      dark.globalAlpha = Math.min(1, cut);
      dark.drawImage(hole, point.x - point.r, point.y - point.r, point.r * 2, point.r * 2);
    }
    dark.globalAlpha = 1;
    ctx.drawImage(darkCanvas, 0, 0);
  }

  // Lamplight (see lamplight.js): the room dimmed between its lights (by
  // night outdoors, always a little indoors), then each light drawn in. A
  // pool lifts the shade and tints what it falls on with its colour
  // (multiplied, so white snow goes gold rather than just brighter); a bloom
  // is the flame's own glow, added on top. Flames waver; glass doesn't.
  drawLamplight(ctx, outdoors) {
    const { night } = daylight();
    const { shade, tint, lit } = ambientFor(this.roomData, outdoors, night);
    const lights = roomLights(this.room, outdoors);
    const sky = skyColor(night);
    // Sky windows let in more by night (moonlight off the snow) than they
    // seem to by day, against a room lit by fires.
    const strengthOf = (l) => l.strength * flickerAt(l, this.time) * (l.sky ? 0.5 + night : lit);
    if (shade > 0.01) {
      const holes = lights.filter((l) => l.pool).map((l) => ({ x: l.x, y: l.y, radius: l.pool * 0.9, cut: strengthOf(l) * 1.1 }));
      // Your own little light (so you never vanish in the dark) is faint here:
      // the lamps do the lighting.
      holes.push({ ...this.lightPoint, radius: 20, cut: 0.3 });
      this.drawShade(ctx, shade, tint, 0, holes);
    }
    ctx.save();
    // Light is soft: let the round pictures blend as they're scaled.
    ctx.imageSmoothingEnabled = true;
    for (const l of lights) {
      const strength = strengthOf(l);
      if (strength < 0.01) continue;
      const point = this.toScreen(l.x, l.y, l.pool ?? l.bloom);
      if (!point || !onScreen(point)) continue;
      const sprite = glowSprite(l.sky ? sky : l.color);
      const { x, y, r } = point;
      if (l.pool && !l.sky) {
        // Firelight tints what it falls on; moonlight only brightens it.
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = Math.min(1, strength);
        ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, strength * (!l.pool ? 0.6 : l.sky ? 0.7 : 0.16));
      ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  // The dark, with soft holes where light reaches: your own (flickering), and
  // every lantern, fire and crystal in the room.
  drawDarkness(ctx) {
    const t = performance.now() / 1000;
    const flicker = 1 + Math.sin(t * 9) * 0.03 + Math.sin(t * 23) * 0.02;
    // Lit by the room's lights, your own, and any cutscene character who glows.
    this.drawShade(ctx, this.roomData.dark, '4, 2, 10', lightRadius() * flicker, [...this.room.lightSources(), ...(this.cutscene?.lights ?? [])]);
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

  // Ves reaching a high lever (see useLever): first, if she's following,
  // you step back and she walks up under it; then she reaches and hooks it,
  // and pulls; then it flips.
  updateReach(dt) {
    const reach = this.reaching;
    if (reach.walk) {
      const w = reach.walk;
      w.t = Math.min(w.seconds, w.t + dt);
      const k = w.t / w.seconds;
      const lerp = (a, b) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
      Object.assign(this.player, lerp(w.hero.from, w.hero.to));
      this.player.moving = k < 1 && (w.hero.from.x !== w.hero.to.x || w.hero.from.y !== w.hero.to.y);
      this.player.animationTime += dt;
      Object.assign(reach.body, lerp(w.ves.from, w.ves.to));
      reach.body.walking = k < 1;
      reach.body.time += dt;
      if (Math.abs(w.ves.to.x - w.ves.from.x) > Math.abs(w.ves.to.y - w.ves.from.y)) reach.body.dir = w.ves.to.x < w.ves.from.x ? 'left' : 'right';
      else reach.body.dir = 'up';
      if (k < 1) return;
      reach.walk = null;
      this.player.moving = false;
      this.player.facing = 'up';
      reach.body.dir = 'up';
      this.startReach();
      return;
    }
    if (this.time < reach.until) return;
    this.reaching = null;
    const { prop, body } = reach;
    if (body === this.player) body.sceneAnimation = null;
    else {
      body.animation = null;
      // She falls in behind you again from here.
      body.warpTo(body.x, body.y);
    }
    this.useLever(prop, true);
  }

  startReach() {
    const reach = this.reaching;
    const anim = { name: reach.anim, start: performance.now() / 1000, speed: 0.38, once: true };
    if (reach.body === this.player) reach.body.sceneAnimation = anim;
    else reach.body.animation = anim;
    sfx('hook');
    reach.until = this.time + 0.85;
  }

  // The party behind you, in a line: each one that's walking with you takes
  // the next place back along your path (one hidden in a scene, or standing
  // still while you're split up, doesn't hold a place).
  updateFollowers(dt) {
    let place = 0;
    for (const follower of this.followers) {
      follower.update(dt, this.player, place);
      if (!follower.hidden) place++;
    }
  }

  // Your lit candle and how much of it is left, in the top-right corner
  // (the top-left is for who you're steering, when you split up).
  drawCandleGauge(ctx) {
    const lit = HERO_STATE.lit && HERO_STATE.items.includes(HERO_STATE.lit.id) ? HERO_STATE.lit : null;
    inUiSpace(ctx, () => {
      const right = UI_WIDTH - 16;
      const label = lit ? ITEMS[lit.id].name : 'No candle';
      drawText(ctx, label, right, 12, { size: 22, color: lit ? '#ffd27a' : '#8a82b0', outline: '#000', align: 'right' });
      if (!lit) return;
      const burn = ITEMS[lit.id].light.burn;
      const left = burn === Infinity ? 1 : Math.max(0, lit.left / burn);
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(right - 100, 38, 100, 6);
      ctx.fillStyle = '#ffcc66';
      ctx.fillRect(right - 100, 38, Math.round(100 * left), 6);
    });
  }

  // Under the oldest trees the light goes grey and thin: the room darkened
  // (multiplied, so colours dim rather than wash out) by its `gloom`, and
  // more when the Hush is near.
  drawGloom(ctx) {
    const near = this.hush ? this.hush.nearness(this.player.x, this.player.y) : 0;
    const g = Math.min(1, this.roomData.gloom + near * 0.25);
    const r = Math.round(255 - g * 120);
    const gr = Math.round(255 - g * 135);
    const b = Math.round(255 - g * 95);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgb(${r}, ${gr}, ${b})`;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.restore();
    if (near > 0.02) this.drawDread(ctx, near);
  }

  // The Hush close: the dark closes in from the edges of the screen and
  // beats, slow, like a heart you can hear. The nearer it is the further in
  // the dark comes, and when it stops to listen the beat quickens.
  drawDread(ctx, near) {
    const rate = this.hush.listening ? 2.4 : 1.5;
    const beat = Math.max(0, Math.sin(this.time * rate * Math.PI * 2)) ** 3;
    const strength = near * (0.3 + 0.3 * beat);
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;
    const shade = ctx.createRadialGradient(cx, cy, SCREEN_HEIGHT * (0.5 - 0.2 * near), cx, cy, SCREEN_WIDTH * 0.68);
    shade.addColorStop(0, 'rgba(10, 2, 8, 0)');
    shade.addColorStop(1, `rgba(10, 2, 8, ${strength.toFixed(3)})`);
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  // Seen by the Hush: the dark closes in, fast, with its eyes in it.
  drawCaught(ctx) {
    // Sinking in the bog: a slow fade, no eyes.
    if (this.caught.bog) {
      this.drawBlack(ctx, Math.max(0, (this.caught.t - SINK_SECONDS * 0.45) / (SINK_SECONDS * 0.45)));
      return;
    }
    const k = Math.min(1, this.caught.t / (CAUGHT_SECONDS * 0.5));
    this.drawBlack(ctx, k * 0.95);
    if (k < 0.6) return;
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2 - 10;
    ctx.fillStyle = `rgba(220, 226, 255, ${(Math.min(1, (k - 0.6) * 2.5) * 0.9).toFixed(3)})`;
    ctx.fillRect(cx - 14, cy, 6, 2);
    ctx.fillRect(cx + 9, cy - 1, 6, 2);
  }

  // Split up: who you're steering, in the corner, and how to get back.
  drawSplitTag(ctx) {
    inUiSpace(ctx, () => {
      const kid = this.player === this.kid ? MEMBERS[this.kid.skin] : null;
      drawText(ctx, kid ? kid.name : 'YOU', 16, 12, { size: 22, color: kid ? (this.kid.skin === BRAMBLE ? '#ffb07a' : '#c8b0f0') : '#ffffff', outline: '#000' });
      drawText(ctx, 'Q: switch   Z on the other: together', 16, 38, { size: 16, color: '#c8c0e0', outline: '#000' });
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
