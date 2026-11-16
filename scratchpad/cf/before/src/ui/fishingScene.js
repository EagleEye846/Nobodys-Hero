import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { SETTINGS } from '../state/settings.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { ITEMS, giveItem, roomForItem, healLabel } from '../data/items.js';
import { GEAR, giveGear, hasGear } from '../data/gear.js';
import { inParty, memberFrames } from '../characters/party.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { TextBox } from './textbox.js';
import { drawText } from './text.js';
import { MENU_COLORS } from './menuFrame.js';

// FISHING WITH GUBB (Chapter 4, the Stillwater). An optional pastime on its
// own screen, started by knocking on the jetty post once the ferry has run
// (see `fishing` on the post in src/data/rooms/stillwaterShore.js). It never
// blocks anything and pays nothing in gold: only a bite of food, now and
// then, and once in a long while a keepsake.
//
//   Z  casts the line, then waits. When the bobber dips (and goes ping), Z
//      again, quick.
//   Then a tug of war: HOLD Z and the marker rises, let go and it sinks.
//      Keep it on the fish's zone and the bar fills; off it, the bar drains.
//      Full means landed, empty means the fish got away.
//   X puts the rod back (it asks nothing and costs nothing).
//
// Gubb talks from out on the water (text/interactions/fishing.txt) and Ves
// has one dry word the first time. His song plays low underneath.
//
// Everything draws in UI space (640x480), in blocky pixel style.

const TEXT_FILE = 'interactions/fishing.txt';
const VES = 'vesper';

// --- The fish -------------------------------------------------------------
// `item` is a food in src/data/items.js (the pearl is gear: a keepsake).
// `weight` is how often the lake gives it. `zone` is the height of the fish's
// zone on the bar (smaller is harder), `speed` how fast it darts, `change`
// how many seconds between its changes of mind.
export const FISH = [
  { id: 'moonblind_minnow', weight: 26, zone: 104, speed: 55, change: 1.7 },
  { id: 'grumbling_olm', weight: 20, zone: 86, speed: 80, change: 1.4 },
  { id: 'lantern_gudgeon', weight: 14, zone: 74, speed: 105, change: 1.2 },
  { id: 'boiled_boot', weight: 12, zone: 112, speed: 30, change: 2.2 },
  { id: 'ancient_sweet', weight: 8, zone: 92, speed: 65, change: 1.5 },
  { id: 'slowfin_carp', weight: 12, zone: 58, speed: 125, change: 0.95 },
  // The rare one: a keepsake, once.
  { id: 'pearl_button', weight: 5, zone: 54, speed: 135, change: 0.85, gear: true },
];
const FISH_BY_ID = Object.fromEntries(FISH.map((fish) => [fish.id, fish]));
export const fishName = (fish) => (fish.gear ? GEAR[fish.id] : ITEMS[fish.id]).name;

// A few catches a visit, then Gubb wants his rod back until you've been
// away from the Stillwater (OverworldScene clears `thisVisit` elsewhere).
export const CATCHES_PER_VISIT = 3;

// --- Timings and the bar --------------------------------------------------
const CAST_SECONDS = 0.55;
const WAIT_MIN = 2;
const WAIT_MAX = 5;
const BITE_SECONDS = 1.1;
const LANDED_SECONDS = 2.2;
const FIGHT_LIMIT = 45;
// The tug of war's bar: where, how tall, and the marker on it.
const BAR = { x: 540, y: 110, w: 44, h: 250 };
const MARKER_H = 36;
const RISE = 175;
const FALL = 125;
const FILL = 0.3;
const DRAIN = 0.2;
const START_PROGRESS = 0.35;

// --- The scene's layout ---------------------------------------------------
// The whole 640x480 screen is the scene (the textbox sits over its lower part).
const WATER_TOP = 170;
const SCENE_BOTTOM = 480;
const ROD_TIP = { x: 292, y: 236 };
const SPOT = { x: 420, y: 318 };
// You and Ves on the jetty's end: where your feet are, and the size of the
// game's own sprites, drawn big and crisp.
const FEET_Y = 392;
const HERO_X = 214;
const VES_X = 112;
const FIGURE_SCALE = 6;

const NOTE_STEPS = [0, 2, -1, 3];

// The choice after the knock.
const CHOICES = ['BORROW THE ROD', 'NO, THANKS'];

const rand = (a, b) => a + Math.random() * (b - a);

export class FishingScene {
  constructor(onExit, { gubbSpeaker = 'gubb' } = {}) {
    this.onExit = onExit;
    this.gubb = gubbSpeaker;
    this.textbox = new TextBox();
    this.then = null;
    this.time = 0;
    this.mode = 'talk';
    this.modeTime = 0;
    this.cursor = 0;
    this.ripples = [];
    this.rippleTimer = 0;
    this.told = new Set();
    this.fish = null;
    this.fishingState = (WORLD_STATE.fishing ??= { taught: false, caught: 0, vesSpoke: false });
    this.bobber = { x: ROD_TIP.x, y: ROD_TIP.y, dip: 0 };
    this.wait = 0;
    this.fight = null;
    this.banner = null;
    this.fishingState.thisVisit ??= 0;
    if (this.fishingState.thisVisit >= CATCHES_PER_VISIT) this.say('rod_resting', this.gubb, () => this.leave());
    else this.say(this.fishingState.taught ? 'offer_again' : 'offer', this.gubb, () => this.go('choose'));
  }

  enter(game) {
    this.game = game;
    // Gubb's own song, low, under the lake's ambience.
    music.play('gubb', 'lake');
    music.musicBus?.gain.setTargetAtTime(SETTINGS.music * 0.5, music.ctx.currentTime, 0.2);
  }

  // Back to the shore: the music comes back up, and the room puts its own song on.
  leave() {
    if (this.left) return;
    this.left = true;
    if (music.ctx) music.musicBus?.gain.setTargetAtTime(SETTINGS.music, music.ctx.currentTime, 0.1);
    this.onExit();
  }

  go(mode) {
    this.mode = mode;
    this.modeTime = 0;
  }

  // Words from `speaker` (a section of the fishing text file); `then` once they're read.
  say(section, speaker, then = null) {
    this.then = then;
    this.textbox.open(Array.isArray(section) ? section : textSection(TEXT_FILE, section), speaker);
    this.talking = true;
  }

  // Something Gubb only says the first time it happens this visit.
  scold(section) {
    if (this.told.has(section)) return;
    this.told.add(section);
    this.say(section, this.gubb, () => this.go('ready'));
  }

  // --- Update -------------------------------------------------------------

  update(dt, input) {
    this.time += dt;
    this.modeTime += dt;
    this.updateRipples(dt);

    if (this.talking) {
      this.textbox.update(dt, input);
      if (!this.textbox.isOpen) {
        this.talking = false;
        const next = this.then;
        this.then = null;
        next?.();
      }
      return;
    }

    switch (this.mode) {
      case 'choose': return this.updateChoose(input);
      case 'ready': return this.updateReady(input);
      case 'cast': return this.updateCast();
      case 'wait': return this.updateWait(dt, input);
      case 'bite': return this.updateBite(input);
      case 'fight': return this.updateFight(dt, input);
      case 'landed': return this.updateLanded();
      default: return undefined;
    }
  }

  updateChoose(input) {
    if (input.wasPressed('up') || input.wasPressed('down')) {
      this.cursor = 1 - this.cursor;
      sfx('move');
    }
    // X is "no, thanks".
    const refused = input.wasPressed('cancel');
    if (refused) this.cursor = 1;
    if (!refused && !input.wasPressed('confirm')) return;
    sfx('select');
    if (this.cursor === 1) {
      this.say('declined', this.gubb, () => this.leave());
    } else if (!this.fishingState.taught) {
      this.fishingState.taught = true;
      this.say('how_to', this.gubb, () => this.go('ready'));
    } else this.go('ready');
  }

  updateReady(input) {
    this.bobber = { x: ROD_TIP.x + 4, y: ROD_TIP.y + 26, dip: 0 };
    if (input.wasPressed('cancel')) {
      this.say('leave', this.gubb, () => this.leave());
    } else if (input.wasPressed('confirm')) {
      sfx('hook');
      this.go('cast');
    }
  }

  updateCast() {
    const t = Math.min(1, this.modeTime / CAST_SECONDS);
    const x = ROD_TIP.x + (SPOT.x - ROD_TIP.x) * t;
    const y = ROD_TIP.y + (SPOT.y - ROD_TIP.y) * t - Math.sin(t * Math.PI) * 90;
    this.bobber = { x, y, dip: 0 };
    if (t < 1) return;
    sfx('splash');
    this.ripples.push({ x: SPOT.x, y: SPOT.y + 4, age: 0, big: true });
    this.wait = rand(WAIT_MIN, WAIT_MAX);
    this.go('wait');
  }

  updateWait(dt, input) {
    this.bobber = { x: SPOT.x, y: SPOT.y + Math.sin(this.time * 2.2) * 1.5, dip: 0 };
    // A few small tremors on the water while she makes up her mind.
    this.rippleTimer -= dt;
    if (this.rippleTimer <= 0) {
      this.rippleTimer = rand(0.8, 1.4);
      this.ripples.push({ x: SPOT.x + rand(-6, 6), y: SPOT.y + 4, age: 0 });
    }
    if (input.wasPressed('cancel')) {
      sfx('back');
      this.go('ready');
    } else if (input.wasPressed('confirm')) {
      sfx('error');
      this.scold('too_soon');
      if (!this.talking) this.go('ready');
    } else if (this.modeTime >= this.wait) {
      this.fish = this.rollFish();
      sfx('ping');
      sfx('splash');
      this.go('bite');
    }
  }

  // What's on the line: the first fish you ever hook is the gentlest one, so
  // the tug of war is learned on something kind. Otherwise by weight, with the
  // pearl button only until you have it.
  rollFish() {
    if (!this.fishingState.caught) return FISH_BY_ID.moonblind_minnow;
    const pool = FISH.filter((fish) => !(fish.gear && hasGear(fish.id)));
    let roll = Math.random() * pool.reduce((sum, fish) => sum + fish.weight, 0);
    for (const fish of pool) if ((roll -= fish.weight) < 0) return fish;
    return pool[0];
  }

  updateBite(input) {
    const t = this.modeTime;
    this.bobber = { x: SPOT.x, y: SPOT.y + 10 + Math.sin(t * 40) * 2, dip: 1 };
    if (input.wasPressed('confirm')) {
      sfx('hook');
      this.startFight();
    } else if (input.wasPressed('cancel')) {
      this.go('ready');
    } else if (t >= BITE_SECONDS) {
      sfx('back');
      this.scold('too_late');
      if (!this.talking) this.go('ready');
    }
  }

  startFight() {
    const f = this.fish;
    this.fight = {
      zoneY: BAR.h / 2 - f.zone / 2,
      target: BAR.h / 2 - f.zone / 2,
      retarget: f.change,
      marker: BAR.h - MARKER_H,
      progress: START_PROGRESS,
      held: false,
      total: 0,
    };
    this.go('fight');
  }

  updateFight(dt, input) {
    const f = this.fish;
    const fight = this.fight;
    fight.total += dt;
    this.bobber = { x: SPOT.x + Math.sin(this.time * 17) * 3, y: SPOT.y + 6 + Math.sin(this.time * 23) * 2, dip: 1 };

    // The fish darts to a new spot every so often, easing toward it.
    fight.retarget -= dt;
    if (fight.retarget <= 0) {
      fight.retarget = f.change * rand(0.7, 1.3);
      fight.target = rand(0, BAR.h - f.zone);
    }
    const gap = fight.target - fight.zoneY;
    fight.zoneY += Math.sign(gap) * Math.min(Math.abs(gap), f.speed * dt);

    // Holding Z lifts the marker; letting go lets it sink.
    fight.held = input.isDown('confirm');
    fight.marker += (fight.held ? -RISE : FALL) * dt;
    fight.marker = Math.max(0, Math.min(BAR.h - MARKER_H, fight.marker));

    const middle = fight.marker + MARKER_H / 2;
    fight.on = middle >= fight.zoneY && middle <= fight.zoneY + f.zone;
    fight.progress += (fight.on ? FILL : -DRAIN) * dt;

    if (this.modeTime % 0.45 < dt) this.ripples.push({ x: SPOT.x + rand(-8, 8), y: SPOT.y + 4, age: 0 });

    if (fight.progress >= 1) this.land();
    else if (fight.progress <= 0 || fight.total > FIGHT_LIMIT || input.wasPressed('cancel')) {
      sfx('error');
      this.scold('lost');
      if (!this.talking) this.go('ready');
    }
  }

  // The fish comes up out of the water; then what Gubb makes of it.
  land() {
    sfx('splash');
    sfx('levelUp');
    this.go('landed');
  }

  updateLanded() {
    if (this.modeTime < LANDED_SECONDS) return;
    const fish = this.fish;
    const first = !this.fishingState.caught;
    // What gets said, in order: Gubb on the catch, then what happened to it
    // (a keepsake's words, or a full bag), then Ves, the first time only.
    const steps = [[textSection(TEXT_FILE, `catch_${fish.id}`), this.gubb]];

    if (fish.gear) {
      giveGear(fish.id);
      steps.push([textSection('interactions/gear.txt', `got_${fish.id}`), null]);
    } else if (!roomForItem()) {
      // No pocket and no chest: she goes back in.
      steps.push([textSection(TEXT_FILE, 'bag_full'), this.gubb]);
    } else {
      sfx('heal');
      if (giveItem(fish.id) === 'stored') steps.push([textSection(TEXT_FILE, 'stored'), this.gubb]);
    }
    if (first && !this.fishingState.vesSpoke && inParty(VES)) {
      this.fishingState.vesSpoke = true;
      steps.push([textSection(TEXT_FILE, 'ves_first'), VES]);
    }
    this.fishingState.caught++;
    this.fishingState.thisVisit = (this.fishingState.thisVisit ?? 0) + 1;
    this.fish = null;
    // That's the visit's last: Gubb has his rod back.
    const done = this.fishingState.thisVisit >= CATCHES_PER_VISIT;
    if (done) steps.push([textSection(TEXT_FILE, 'rod_back'), this.gubb]);

    const run = () => {
      const step = steps.shift();
      if (step) this.say(step[0], step[1], run);
      else if (done) {
        this.go('gone');
        this.leave();
      }
      else this.go('ready');
    };
    run();
  }

  updateRipples(dt) {
    for (const ripple of this.ripples) ripple.age += dt;
    this.ripples = this.ripples.filter((ripple) => ripple.age < 2.4);
  }

  // A jump straight to a moment, for the preview (tools/preview.html?fishing=1).
  debugJump(mode, fishId = 'moonblind_minnow') {
    this.talking = false;
    this.textbox.pages = null;
    this.fish = FISH_BY_ID[fishId];
    this.go(mode);
    if (mode === 'wait') {
      this.wait = 99;
      this.ripples.push({ x: SPOT.x, y: SPOT.y + 4, age: 0, big: true });
    }
    if (mode === 'bite') this.modeTime = 0.2;
    if (mode === 'fight') this.startFight();
    if (mode === 'landed') this.modeTime = 1.2;
  }

  // --- Drawing ------------------------------------------------------------

  draw(ctx) {
    inUiSpace(ctx, () => {
      this.drawCave(ctx);
      this.drawWater(ctx);
      this.drawPunt(ctx);
      this.drawRipples(ctx);
      this.drawJetty(ctx);
      this.drawLineAndBobber(ctx);
      if (this.mode === 'fight') this.drawFightBar(ctx);
      if (this.mode === 'landed') this.drawLanded(ctx);
      this.drawHint(ctx);
      if (this.mode === 'choose' && !this.talking) this.drawChoice(ctx);
    });
    this.textbox.draw(ctx);
  }

  // The cavern roof: black rock, a few stalactites, pale lichen specks.
  drawCave(ctx) {
    ctx.fillStyle = '#04050c';
    ctx.fillRect(0, 0, 640, SCENE_BOTTOM);
    ctx.fillStyle = '#0a0d1c';
    for (let i = 0; i < 16; i++) {
      const x = i * 44 + ((i * 37) % 23);
      const h = 50 + ((i * 53) % 80);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 34, 0);
      ctx.lineTo(x + 17, h);
      ctx.fill();
    }
    for (let i = 0; i < 34; i++) {
      const twinkle = 0.35 + 0.35 * Math.sin(this.time * 0.9 + i * 1.7);
      ctx.fillStyle = `rgba(150, 230, 215, ${twinkle})`;
      ctx.fillRect((i * 97) % 640, 8 + ((i * 41) % 130), 3, 3);
    }
  }

  // The black water: bands of deepening blue and a slow glint here and there.
  drawWater(ctx) {
    const bands = ['#0b1530', '#0a1228', '#091024', '#070d1d', '#060a18', '#050814'];
    const bandH = (SCENE_BOTTOM - WATER_TOP) / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, WATER_TOP + i * bandH, 640, bandH + 1);
    });
    for (let i = 0; i < 30; i++) {
      const y = WATER_TOP + 14 + ((i * 29) % (SCENE_BOTTOM - WATER_TOP - 30));
      const x = ((i * 131 + this.time * (6 + (i % 3) * 3)) % 700) - 30;
      ctx.fillStyle = `rgba(140, 190, 230, ${0.08 + 0.06 * Math.sin(this.time + i)})`;
      ctx.fillRect(x, y, 22 + (i % 4) * 8, 2);
    }
    // The far shore: a dark line and the pillar-tops standing out of the lake.
    ctx.fillStyle = '#03040a';
    ctx.fillRect(0, WATER_TOP - 8, 640, 10);
    ctx.fillRect(520, WATER_TOP - 30, 14, 26);
    ctx.fillRect(280, WATER_TOP - 18, 10, 16);
    // Dark stalactite reflections, wavering, and the deep going black toward the bottom.
    ctx.fillStyle = 'rgba(2, 3, 8, 0.5)';
    for (let i = 0; i < 16; i++) {
      const x = i * 44 + ((i * 37) % 23) + Math.sin(this.time * 0.7 + i) * 3;
      const h = 40 + ((i * 53) % 80);
      ctx.beginPath();
      ctx.moveTo(x, WATER_TOP + 4);
      ctx.lineTo(x + 34, WATER_TOP + 4);
      ctx.lineTo(x + 17, WATER_TOP + 4 + h * 0.6);
      ctx.fill();
    }
    const deep = ctx.createLinearGradient(0, WATER_TOP + 160, 0, SCENE_BOTTOM);
    deep.addColorStop(0, 'rgba(0, 0, 4, 0)');
    deep.addColorStop(1, 'rgba(0, 0, 4, 0.75)');
    ctx.fillStyle = deep;
    ctx.fillRect(0, WATER_TOP + 160, 640, SCENE_BOTTOM - WATER_TOP - 160);
  }

  // Gubb out on the lake in his punt: a lantern on the prow and its long
  // reflection, and a note drifting up now and then.
  drawPunt(ctx) {
    const px = 476;
    const py = 232 + Math.sin(this.time * 0.8) * 1.5;
    const glow = ctx.createRadialGradient(px - 28, py - 14, 2, px - 28, py - 14, 70);
    glow.addColorStop(0, 'rgba(255, 210, 120, 0.4)');
    glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(px - 100, py - 84, 140, 140);
    // The reflection, wobbling.
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = `rgba(255, 205, 110, ${0.3 - i * 0.03})`;
      ctx.fillRect(px - 32 + Math.sin(this.time * 2 + i) * 3, py + 14 + i * 7, 8 - (i >> 1), 3);
    }
    // Hull, Gubb (fat, green, in a smock), the lantern pole.
    ctx.fillStyle = '#2a1c12';
    ctx.fillRect(px - 44, py + 2, 88, 12);
    ctx.fillRect(px - 52, py - 2, 10, 8);
    ctx.fillStyle = '#1b130c';
    ctx.fillRect(px - 40, py + 10, 80, 4);
    ctx.fillStyle = '#587350';
    ctx.beginPath();
    ctx.ellipse(px + 6, py - 6, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8aa874';
    ctx.beginPath();
    ctx.ellipse(px + 8, py - 22, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e6e8bc';
    ctx.fillRect(px + 2, py - 4, 10, 8);
    ctx.fillStyle = '#1a1020';
    ctx.fillRect(px + 6, py - 25, 3, 3);
    ctx.fillRect(px + 12, py - 25, 3, 3);
    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(px - 30, py - 26, 3, 28);
    ctx.fillStyle = '#ffd27a';
    ctx.fillRect(px - 34, py - 36, 11, 11);
    ctx.fillStyle = '#fff2c4';
    ctx.fillRect(px - 31, py - 33, 5, 5);
    // Humming.
    for (let i = 0; i < 2; i++) {
      const age = ((this.time * 0.5 + i * 0.5) % 1);
      const nx = px + 30 + Math.sin(age * 5 + i) * 6 + i * 14;
      const ny = py - 30 - age * 50 - NOTE_STEPS[(Math.floor(this.time * 0.5 + i * 2)) % 4] * 3;
      ctx.fillStyle = `rgba(230, 240, 200, ${0.7 * (1 - age)})`;
      ctx.beginPath();
      ctx.ellipse(nx, ny, 4, 3, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(nx + 3, ny - 11, 2, 11);
    }
  }

  drawRipples(ctx) {
    for (const ripple of this.ripples) {
      const grow = ripple.age * (ripple.big ? 40 : 26);
      ctx.strokeStyle = `rgba(176, 214, 238, ${Math.max(0, 0.7 - ripple.age * 0.3)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, 6 + grow, 2 + grow * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // The jetty's last boards, and you on the end of it with the borrowed rod,
  // Ves beside you: the game's own sprites (the hero's and Ves's standing
  // frames, facing the lake), drawn big with no smoothing.
  drawJetty(ctx) {
    ctx.fillStyle = '#4e3a26';
    ctx.fillRect(0, 392, 300, 22);
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(0, 414, 300, 66);
    ctx.fillStyle = '#241810';
    for (let x = 18; x < 300; x += 42) ctx.fillRect(x, 392, 4, 88);
    // The end post, weedy.
    ctx.fillStyle = '#2a1c12';
    ctx.fillRect(280, 366, 22, 70);
    ctx.fillStyle = '#4a6a3c';
    ctx.fillRect(280, 396, 22, 40);
    // Shadows under their feet.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(HERO_X, FEET_Y, 38, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ves, if she's with you (standing, looking out at the water).
    if (inParty(VES)) {
      const ves = memberFrames(VES)?.rightIdle;
      if (ves) this.drawFigure(ctx, ves, VES_X, FEET_Y);
    }
    this.drawFigure(ctx, HERO_ANIMATIONS.right[0], HERO_X, FEET_Y);
    // The rod: held in the hero's near hand, out over the water.
    const hand = { x: HERO_X + 22, y: FEET_Y - 62 };
    ctx.strokeStyle = '#4a3420';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(hand.x - 8, hand.y + 10);
    ctx.lineTo(ROD_TIP.x, ROD_TIP.y);
    ctx.stroke();
    ctx.strokeStyle = '#a07a46';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hand.x - 8, hand.y + 10);
    ctx.lineTo(ROD_TIP.x, ROD_TIP.y);
    ctx.stroke();
    // A reel.
    ctx.fillStyle = '#d8d0b8';
    ctx.fillRect(hand.x + 4, hand.y - 2, 8, 8);
  }

  // A character sprite drawn crisp, feet at (x, y), `FIGURE_SCALE` times its size.
  drawFigure(ctx, sprite, x, y) {
    const w = sprite.width * FIGURE_SCALE;
    const h = sprite.height * FIGURE_SCALE;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, Math.round(x - w / 2), Math.round(y - h), w, h);
  }

  // The line (slack while waiting, taut in the fight) and the red bobber.
  drawLineAndBobber(ctx) {
    const { x, y, dip } = this.bobber;
    const taut = this.mode === 'fight' ? 1 : 0;
    ctx.strokeStyle = 'rgba(230, 236, 250, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ROD_TIP.x, ROD_TIP.y);
    const sag = (1 - taut) * 24;
    ctx.quadraticCurveTo((ROD_TIP.x + x) / 2, (ROD_TIP.y + y) / 2 + sag, x, y - 4);
    ctx.stroke();
    if (this.mode === 'ready') return;
    // Below the surface, the bobber's reflection and (in the fight) the shape of the fish.
    if (this.mode === 'fight') {
      const a = this.time * 3.4;
      ctx.fillStyle = 'rgba(2, 4, 12, 0.7)';
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 22, y + 22 + Math.sin(a) * 6, 20, 7, Math.cos(a) * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 90, 90, 0.18)';
    ctx.fillRect(x - 4, y + 6, 8, 8);
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(x - 5, y - 4 + dip * 4, 10, 6);
    ctx.fillStyle = '#e8453c';
    ctx.fillRect(x - 5, y - 10 + dip * 4, 10, 6);
    // The dip: a bite, and a "!" for anyone who missed the ping.
    if (this.mode === 'bite') {
      const bounce = Math.sin(this.modeTime * 30) * 3;
      drawText(ctx, '!', x, y - 56 + bounce, { size: 48, align: 'center', color: '#ffe14d', outline: '#000' });
    }
  }

  // What to press, at the top of the screen.
  drawHint(ctx) {
    const hints = {
      ready: 'Z: CAST     X: PUT THE ROD BACK',
      wait: 'Wait for the dip...     X: reel in',
      bite: 'Z NOW!',
      fight: 'HOLD Z to lift the marker. Let go to sink it.',
    };
    const hint = hints[this.mode];
    if (!hint || this.talking) return;
    drawText(ctx, hint, 24, 14, { size: 26, color: this.mode === 'bite' ? MENU_COLORS.highlight : MENU_COLORS.description, outline: '#000' });
  }

  // The tug of war: the bar, the fish's zone, your marker, and how full the catch is.
  drawFightBar(ctx) {
    const fight = this.fight;
    const f = this.fish;
    ctx.fillStyle = '#fff';
    ctx.fillRect(BAR.x - 4, BAR.y - 4, BAR.w + 8, BAR.h + 8);
    ctx.fillStyle = '#0a1020';
    ctx.fillRect(BAR.x, BAR.y, BAR.w, BAR.h);
    // The fish's zone, glowing when you're on it.
    ctx.fillStyle = fight.on ? '#4fe3d0' : '#2a8f86';
    ctx.fillRect(BAR.x + 2, BAR.y + fight.zoneY, BAR.w - 4, f.zone);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(BAR.x + BAR.w / 2, BAR.y + fight.zoneY + f.zone / 2, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(BAR.x + BAR.w / 2 + 9, BAR.y + fight.zoneY + f.zone / 2);
    ctx.lineTo(BAR.x + BAR.w / 2 + 16, BAR.y + fight.zoneY + f.zone / 2 - 5);
    ctx.lineTo(BAR.x + BAR.w / 2 + 16, BAR.y + fight.zoneY + f.zone / 2 + 5);
    ctx.fill();
    // Your marker.
    ctx.fillStyle = fight.held ? '#fff7b0' : '#ffe14d';
    ctx.fillRect(BAR.x - 2, BAR.y + fight.marker, BAR.w + 4, MARKER_H);
    ctx.fillStyle = '#7a5a10';
    ctx.fillRect(BAR.x - 2, BAR.y + fight.marker + MARKER_H / 2 - 1, BAR.w + 4, 3);
    // How full the catch is.
    const px = BAR.x + BAR.w + 14;
    ctx.fillStyle = '#fff';
    ctx.fillRect(px - 4, BAR.y - 4, 22, BAR.h + 8);
    ctx.fillStyle = '#0a1020';
    ctx.fillRect(px, BAR.y, 14, BAR.h);
    const fill = Math.max(0, Math.min(1, fight.progress)) * BAR.h;
    ctx.fillStyle = fight.progress > 0.66 ? '#7dff9a' : fight.progress > 0.33 ? '#4fe3d0' : '#ff7a8a';
    ctx.fillRect(px, BAR.y + BAR.h - fill, 14, fill);
  }

  // The catch, lifted out of the water over the jetty's end.
  drawLanded(ctx) {
    const t = Math.min(1, this.modeTime / 0.8);
    const rise = 1 - (1 - t) * (1 - t);
    const cx = 320;
    const cy = 250 - rise * 105 + Math.sin(this.time * 4) * 3;
    const glow = ctx.createRadialGradient(cx, cy, 6, cx, cy, 120);
    glow.addColorStop(0, 'rgba(255, 245, 200, 0.45)');
    glow.addColorStop(1, 'rgba(255, 245, 200, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 120, cy - 120, 240, 240);
    drawFish(ctx, this.fish.id, cx, cy, 2.2, this.time);
    if (t >= 1) {
      const item = this.fish.gear ? null : this.fish.id;
      drawText(ctx, fishName(this.fish).toUpperCase(), cx, 28, { size: 36, align: 'center', color: MENU_COLORS.highlight, outline: '#000' });
      if (item) drawText(ctx, healLabel(item), cx, 70, { size: 26, align: 'center', color: MENU_COLORS.ability, outline: '#000' });
      else drawText(ctx, 'A KEEPSAKE', cx, 70, { size: 26, align: 'center', color: MENU_COLORS.magic, outline: '#000' });
    }
  }

  drawChoice(ctx) {
    const box = { x: 372, y: 20, w: 244, h: 112 };
    ctx.fillStyle = '#fff';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.fillStyle = '#000';
    ctx.fillRect(box.x + 4, box.y + 4, box.w - 8, box.h - 8);
    CHOICES.forEach((label, i) => {
      const y = box.y + 18 + i * 44;
      const on = i === this.cursor;
      drawText(ctx, label, box.x + 52, y, { size: 28, color: on ? MENU_COLORS.highlight : MENU_COLORS.text });
      if (on) {
        ctx.fillStyle = '#ff2a2a';
        ctx.fillRect(box.x + 22, y + 6, 14, 14);
      }
    });
  }
}

// --- Fish pictures ----------------------------------------------------------
// Each is drawn around (x, y), `s` times its natural size, facing right.

function body(ctx, x, y, rx, ry, color, tail = color) {
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(x - rx + 4, y);
  ctx.lineTo(x - rx - 16, y - ry);
  ctx.lineTo(x - rx - 16, y + ry);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawFish(ctx, id, x, y, s = 1, time = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.rotate(Math.sin(time * 5) * 0.08);
  switch (id) {
    case 'moonblind_minnow':
      // Pale and eyeless: only a smooth patch where the eye should be.
      body(ctx, 0, 0, 30, 11, '#d8e0ee', '#b9c5dc');
      ctx.fillStyle = '#eef3fb';
      ctx.fillRect(-10, -10, 22, 4);
      ctx.fillStyle = '#b9c5dc';
      ctx.fillRect(14, -3, 6, 6);
      ctx.fillStyle = '#9aa8c4';
      ctx.fillRect(2, -16, 10, 7);
      break;
    case 'grumbling_olm': {
      // A long pink worm of a thing with red frills and tiny legs.
      ctx.fillStyle = '#e8a9b0';
      for (let i = 0; i < 14; i++) {
        const px = -36 + i * 5.5;
        ctx.beginPath();
        ctx.ellipse(px, Math.sin(i * 0.8 + time * 4) * 4, 6, 5 - i * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#d9444f';
      for (let i = -1; i <= 1; i++) ctx.fillRect(41, i * 6 - 1, 9, 2);
      ctx.fillStyle = '#c98a94';
      ctx.fillRect(-10, 6, 3, 8);
      ctx.fillRect(14, 6, 3, 8);
      ctx.fillStyle = '#5a2a36';
      ctx.fillRect(40, -2, 8, 2);
      ctx.fillRect(42, 1, 4, 2);
      break;
    }
    case 'lantern_gudgeon': {
      body(ctx, 0, 0, 30, 12, '#3a6a78', '#2a4e5a');
      ctx.fillStyle = '#7fb6c4';
      ctx.fillRect(-12, -9, 26, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, -5, 4, 4);
      ctx.fillStyle = '#1a1020';
      ctx.fillRect(18, -4, 2, 2);
      // The lamp on a little stalk, over her head.
      ctx.strokeStyle = '#2a4e5a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, -10);
      ctx.quadraticCurveTo(24, -26, 34, -14);
      ctx.stroke();
      const lamp = ctx.createRadialGradient(34, -14, 1, 34, -14, 20);
      lamp.addColorStop(0, 'rgba(210, 255, 180, 0.95)');
      lamp.addColorStop(1, 'rgba(210, 255, 180, 0)');
      ctx.fillStyle = lamp;
      ctx.fillRect(10, -38, 48, 48);
      ctx.fillStyle = '#f6ffd8';
      ctx.fillRect(31, -17, 6, 6);
      break;
    }
    case 'boiled_boot':
      ctx.fillStyle = '#5a3a22';
      ctx.beginPath();
      ctx.moveTo(-16, -30);
      ctx.lineTo(8, -30);
      ctx.lineTo(8, 4);
      ctx.lineTo(34, 10);
      ctx.lineTo(34, 24);
      ctx.lineTo(-16, 24);
      ctx.fill();
      ctx.fillStyle = '#2a1a10';
      ctx.fillRect(-16, 18, 50, 6);
      ctx.fillStyle = '#7a5a3a';
      ctx.fillRect(-16, -30, 24, 5);
      ctx.fillStyle = '#d8d0b8';
      for (let i = 0; i < 3; i++) ctx.fillRect(-4, -18 + i * 9, 14, 2);
      // Weed hanging off it.
      ctx.fillStyle = '#4a6a3c';
      ctx.fillRect(22, 14, 4, 12);
      ctx.fillRect(28, 16, 3, 9);
      break;
    case 'ancient_sweet': {
      ctx.fillStyle = '#b8a888';
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-36, -14);
      ctx.lineTo(-36, 14);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(36, -14);
      ctx.lineTo(36, 14);
      ctx.fill();
      ctx.fillStyle = '#d8c8a0';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c4b088';
      for (let i = -2; i <= 2; i++) ctx.fillRect(i * 6 - 1, -10, 3, 20);
      ctx.fillStyle = '#e8d8b0';
      ctx.fillRect(-10, -8, 8, 3);
      break;
    }
    case 'slowfin_carp':
      body(ctx, 0, 0, 36, 20, '#d19a3c', '#a8742a');
      ctx.fillStyle = '#e8b85a';
      ctx.fillRect(-20, -17, 44, 5);
      ctx.fillStyle = '#b07828';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ctx.fillRect(-20 + c * 9 + (r % 2) * 4, -6 + r * 8, 5, 4);
      ctx.fillStyle = '#a8742a';
      ctx.fillRect(-6, -30, 20, 12);
      ctx.fillStyle = '#fff';
      ctx.fillRect(22, -8, 6, 6);
      ctx.fillStyle = '#1a1020';
      ctx.fillRect(25, -7, 3, 4);
      ctx.fillStyle = '#e8d8a8';
      ctx.fillRect(36, 2, 10, 2);
      ctx.fillRect(36, 8, 8, 2);
      break;
    case 'pearl_button': {
      const pearl = ctx.createRadialGradient(-6, -6, 2, 0, 0, 26);
      pearl.addColorStop(0, '#ffffff');
      pearl.addColorStop(0.6, '#e4e8f2');
      pearl.addColorStop(1, '#a8b4d0');
      ctx.fillStyle = pearl;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#a8b4d0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#6a7490';
      for (const [dx, dy] of [[-6, -6], [6, -6], [-6, 6], [6, 6]]) ctx.fillRect(dx - 2, dy - 2, 4, 4);
      break;
    }
    default:
      body(ctx, 0, 0, 28, 12, '#8890a8');
  }
  ctx.restore();
}
