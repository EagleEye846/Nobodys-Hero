import { SettingsMenu } from '../ui/settingsMenu.js';
import { UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { PANELS, PANEL_WIDTH, PANEL_HEIGHT } from '../data/art/cutscenes.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { peekSave, eraseSave, formatPlayTime } from '../state/saveGame.js';
import { ROOMS } from '../data/rooms/index.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, textWidth } from '../ui/text.js';
import { glide } from '../ui/uiMotion.js';
import { promptName } from '../engine/input.js';
import { ChapterSelectScene } from './chapterSelectScene.js';

// "LANTERN HALL" or "taper_home" -> "Lantern Hall"
const friendlyName = (name) => String(name).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const TEXT_FILE = 'title.txt';

const PROMPT_BLINK_SECONDS = 0.5;
const TITLE_FADE_SECONDS = 1.5;
const PROMPT_DELAY = 1.2;
// The title shrinks to fit if it's long.
const TITLE_SIZE = 72;
const TITLE_MAX_WIDTH = UI_WIDTH - 80;

// The opening: the first time the title shows after the game loads, a short
// sequence plays before the menu: the Ruins' hall of lanterns drifts past,
// the name forms out of the dark, and the empty stair fades up beneath it.
// Any key hurries it along to the menu. It plays once per visit to the page, so coming
// back to the title later goes straight to the menu.
const ATTRACT_SECONDS = 10;
// How much faster the opening runs once a key is pressed.
const SKIP_SPEED = 6;
const ATTRACT_ACTIONS = ['confirm', 'cancel', 'menu', 'skip', 'up', 'down', 'left', 'right', 'jump', 'swap'];
const HALL_SCALE = 2.3;
let attractPlayed = false;
const ease = (x) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };

function blinkOn(time) {
  return Math.floor(time / PROMPT_BLINK_SECONDS) % 2 === 0;
}

// Browsers won't play sound until a key is pressed, so the game opens on this
// before the intro (which needs its music). `next()` builds the next scene.
export class PressStartScene {
  constructor(next) {
    this.next = next;
    this.time = 0;
  }

  enter(game) {
    this.game = game;
  }

  update(dt, input) {
    this.time += dt;
    if (input.wasPressed('confirm')) this.game.changeScene(this.next());
  }

  draw(ctx) {
    if (!blinkOn(this.time)) return;
    inUiSpace(ctx, () => {
      drawText(ctx, textSection(TEXT_FILE, 'press_start')[0], UI_WIDTH / 2, UI_HEIGHT / 2 - 14, { size: 28, color: '#888', align: 'center' });
    });
  }
}

// The title screen, after the intro. Confirm starts the game, or continues
// from the last save point. Its words live in text/title.txt.
export class TitleScene {
  // `startGame()` continues from the save (or starts fresh without one);
  // `newGame()` starts over from the beginning; `playChapter(room, spawn)`
  // starts a chapter picked from CHAPTERS.
  constructor(startGame, newGame = startGame, playChapter = null) {
    this.startGame = startGame;
    this.newGame = newGame;
    this.playChapter = playChapter;
    this.time = 0;
    // How far into the opening we are; already done if it has played before.
    this.intro = attractPlayed ? ATTRACT_SECONDS : 0;
    attractPlayed = true;
    this.title = textSection(TEXT_FILE, 'title')[0];
    this.prompt = textSection(TEXT_FILE, 'new_game')[0];
    // With a save there's a card for it, and a choice: carry on, or start over.
    this.save = peekSave();
    // CHAPTERS: start any chapter you've reached again (src/state/chapters.js).
    // OPTIONS: volume, text speed, screen shake and keys (src/ui/settingsMenu.js).
    this.options = playChapter ? ['CONTINUE', 'NEW GAME', 'CHAPTERS', 'OPTIONS'] : ['CONTINUE', 'NEW GAME', 'OPTIONS'];
    this.settings = new SettingsMenu();
    this.cursor = 0;
    this.confirming = false;
  }

  enter(game) {
    this.game = game;
    // Once the Ruins are behind you (Taper spared or beaten), the title has
    // its own song; before that, the prophecy's.
    const seen = this.save?.world?.seenScenes ?? [];
    const leftRuins = seen.includes('taper_spared') || seen.includes('taper_defeated');
    music.play(leftRuins ? 'title' : 'prophecy');
  }

  update(dt, input) {
    if (this.intro < ATTRACT_SECONDS) {
      // A key doesn't cut the opening off: it runs the rest of it fast, so
      // the hall still fades away and the stair still comes up. A second key
      // goes straight to the menu.
      if (ATTRACT_ACTIONS.some((action) => input.wasPressed(action))) {
        if (this.skipping) this.intro = ATTRACT_SECONDS;
        this.skipping = true;
      }
      this.intro = Math.min(ATTRACT_SECONDS, this.intro + dt * (this.skipping ? SKIP_SPEED : 1));
      // Into the menu with the title already settled.
      if (this.intro >= ATTRACT_SECONDS) this.time = TITLE_FADE_SECONDS;
      return;
    }
    this.time += dt;
    if (this.time < PROMPT_DELAY) return;
    if (this.settings.isOpen) {
      this.settings.update(input);
      return;
    }
    // No save here yet: confirm starts, and the menu key opens OPTIONS (for
    // SAVE FILE: bringing in a save exported from another browser or address).
    if (!this.save) {
      if (input.wasPressed('confirm')) this.begin(this.startGame);
      else if (input.wasPressed('menu')) {
        sfx('select');
        this.settings.open();
      }
      return;
    }
    if (this.confirming) {
      if (input.wasPressed('confirm')) {
        eraseSave();
        this.begin(this.newGame);
      } else if (input.wasPressed('cancel')) {
        sfx('back');
        this.confirming = false;
      }
      return;
    }
    const before = this.cursor;
    if (input.wasPressed('down') || input.wasPressed('right')) this.cursor = (this.cursor + 1) % this.options.length;
    if (input.wasPressed('up') || input.wasPressed('left')) this.cursor = (this.cursor - 1 + this.options.length) % this.options.length;
    if (this.cursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      if (this.cursor === 0) this.begin(this.startGame);
      else if (this.options[this.cursor] === 'CHAPTERS') {
        sfx('select');
        const title = () => new TitleScene(this.startGame, this.newGame, this.playChapter);
        this.game.changeScene(new ChapterSelectScene(title, this.playChapter, this.startGame));
      } else if (this.options[this.cursor] === 'OPTIONS') {
        sfx('select');
        this.settings.open();
      } else {
        sfx('select');
        this.confirming = true;
      }
    }
  }

  begin(start) {
    sfx('select');
    this.game.changeScene(start());
  }

  // Where you saved, your level, and how long you've played.
  drawSaveCard(ctx) {
    const { hero, world } = this.save;
    const card = { x: UI_WIDTH / 2 - 190, y: 236, w: 380, h: 96 };
    ctx.fillStyle = '#fff';
    ctx.fillRect(card.x - 3, card.y - 3, card.w + 6, card.h + 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(card.x, card.y, card.w, card.h);
    const room = ROOMS[world.room];
    const place = room ? friendlyName(room.name || room.id) : 'Somewhere in the Ruins';
    drawText(ctx, 'HERO', card.x + 20, card.y + 12, { size: 30, color: '#4fe3d0' });
    drawText(ctx, `LV ${hero.level ?? 1}`, card.x + 120, card.y + 14, { size: 28 });
    drawText(ctx, formatPlayTime(world.timePlayed ?? world.playSeconds), card.x + card.w - 20, card.y + 14, { size: 28, align: 'right' });
    const gold = `${hero.gold ?? 0} G`;
    // A long place name (The Foot Of The Last Light) shrinks to keep clear of the gold.
    const placeRoom = card.w - 40 - textWidth(ctx, gold, 24) - 14;
    const placeSize = Math.max(18, Math.min(28, Math.floor((28 * placeRoom) / textWidth(ctx, place, 28))));
    drawText(ctx, place, card.x + 20, card.y + 52 + (28 - placeSize) / 2, { size: placeSize, color: '#ffcc66' });
    drawText(ctx, gold, card.x + card.w - 20, card.y + 54, { size: 24, color: '#ffe14d', align: 'right' });

    const optionsY = card.y + card.h + 36;
    if (this.confirming) {
      drawText(ctx, 'Erase your save and start over?', UI_WIDTH / 2, optionsY - 6, { size: 30, align: 'center', color: '#ff5470', outline: '#07040c' });
      drawText(ctx, 'Z: yes, start over     X: no', UI_WIDTH / 2, optionsY + 30, { size: 24, align: 'center', color: '#c9c2e0', outline: '#07040c' });
      return;
    }
    // Where each option starts, from the middle: three across, or four.
    const spots = this.options.length > 3 ? [-280, -134, 12, 158] : [-250, -70, 110];
    const size = this.options.length > 3 ? 28 : 32;
    this.options.forEach((label, i) => {
      const x = UI_WIDTH / 2 + spots[i];
      const selected = i === this.cursor;
      // The heart slides across to the option rather than jumping.
      if (selected) {
        const at = glide('titleOptions', x - 26, optionsY + 6, 110);
        ctx.drawImage(soulSprite(), at.x, at.y);
      }
      drawText(ctx, label, x, optionsY, { size, color: selected ? '#ffe14d' : '#ffffff', outline: '#07040c' });
    });
  }

  draw(ctx) {
    const opening = this.intro < ATTRACT_SECONDS;
    const fade = opening ? ease((this.intro - 7.6) / 2.4) : Math.min(1, this.time / TITLE_FADE_SECONDS);
    if (opening) this.drawHall(ctx, this.intro);
    if (!opening || fade > 0) this.drawStair(ctx, fade);
    else this.drawEmbers(ctx, ease(this.intro / 2), this.intro);

    inUiSpace(ctx, () => {
      if (opening) {
        this.drawForming(ctx);
        return;
      }
      const cx = UI_WIDTH / 2;
      const lines = this.title.split('\n');
      const widest = Math.max(...lines.map((line) => textWidth(ctx, line, TITLE_SIZE)));
      const size = Math.min(TITLE_SIZE, Math.floor((TITLE_SIZE * TITLE_MAX_WIDTH) / widest));

      ctx.globalAlpha = fade;
      drawText(ctx, this.title, cx, 92 - (lines.length - 1) * size * 0.5, {
        size, color: '#ffcc66', align: 'center', shadow: '#5a3a10',
      });
      ctx.globalAlpha = 1;

      if (this.time < PROMPT_DELAY) return;
      if (this.save) {
        ctx.globalAlpha = Math.min(1, (this.time - PROMPT_DELAY) / 0.4);
        this.drawSaveCard(ctx);
        ctx.globalAlpha = 1;
      } else if (blinkOn(this.time - PROMPT_DELAY)) {
        drawText(ctx, this.prompt, cx, UI_HEIGHT - 46, { size: 30, align: 'center', outline: '#07040c' });
      }
      if (!this.save) {
        drawText(ctx, `${promptName('menu')}: OPTIONS / IMPORT SAVE`, cx, UI_HEIGHT - 16, { size: 20, align: 'center', color: '#8a82b0', outline: '#07040c' });
      }
    });
    // OPTIONS, over everything, while it's open.
    this.settings.draw(ctx);
  }

  // The Hero's stair from the intro, glowing faintly under the title, with
  // embers drifting up from the lanterns. In world pixels (320x240).
  drawStair(ctx, fade) {
    const x = (SCREEN_WIDTH - PANEL_WIDTH) / 2;
    const y = 104;
    ctx.save();
    ctx.globalAlpha = fade * 0.75;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
    ctx.clip();
    const clock = this.intro < ATTRACT_SECONDS ? this.intro : this.time;
    PANELS.stair(ctx, clock);
    ctx.restore();
    // Fade the picture's edges into the dark (only as much as the stair has
    // faded up, or the dark edges show as a box over the hall behind).
    ctx.globalAlpha = fade;
    const edge = ctx.createLinearGradient(0, y, 0, y + PANEL_HEIGHT);
    edge.addColorStop(0, 'rgba(0, 0, 0, 0)');
    edge.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    edge.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = edge;
    ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
    const sides = ctx.createLinearGradient(x, 0, x + PANEL_WIDTH, 0);
    sides.addColorStop(0, 'rgba(0, 0, 0, 1)');
    sides.addColorStop(0.25, 'rgba(0, 0, 0, 0)');
    sides.addColorStop(0.75, 'rgba(0, 0, 0, 0)');
    sides.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = sides;
    ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
    ctx.globalAlpha = 1;
    this.drawEmbers(ctx, fade, this.intro < ATTRACT_SECONDS ? this.intro : this.time);
  }

  // Embers rising from below, in world pixels.
  drawEmbers(ctx, fade, time) {
    for (let i = 0; i < 26; i++) {
      const rise = (time * (8 + (i % 5) * 3) + i * 37) % 250;
      const ex = (i * 53 + Math.sin(time * 0.8 + i) * 6 + 400) % SCREEN_WIDTH;
      const ey = SCREEN_HEIGHT - rise;
      ctx.globalAlpha = fade * (0.35 + 0.35 * Math.sin(time * 3 + i * 1.7)) * Math.min(1, rise / 60);
      ctx.fillStyle = i % 3 ? '#ffcc66' : '#ff8c1a';
      ctx.fillRect(Math.round(ex), Math.round(ey), 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  // The hall of lanterns, big, drifting slowly past from right to left, fading
  // in out of black and then away again as the stair comes up. World pixels.
  drawHall(ctx, t) {
    const alpha = ease((t - 0.4) / 1.8) * (1 - ease((t - 6.5) / 2.5)) * 0.8;
    if (alpha <= 0) return;
    const w = PANEL_WIDTH * HALL_SCALE;
    const h = PANEL_HEIGHT * HALL_SCALE;
    const x = -(w - SCREEN_WIDTH) * Math.min(1, t / 8);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.clip();
    ctx.translate(x, (SCREEN_HEIGHT - h) / 2);
    ctx.scale(HALL_SCALE, HALL_SCALE);
    PANELS.ruins(ctx, t);
    ctx.restore();
    // Dark at the edges, like looking down a corridor.
    const vignette = ctx.createRadialGradient(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 40, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 210);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, `rgba(0, 0, 0, ${(alpha * 1.1).toFixed(3)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  // The name forming: the letters start spread wide and faint, and draw in
  // together to settle where the title sits in the menu. UI pixels.
  drawForming(ctx) {
    const p = ease((this.intro - 3.8) / 3.2);
    if (p <= 0) return;
    const lines = this.title.split('\n');
    const widest = Math.max(...lines.map((line) => textWidth(ctx, line, TITLE_SIZE)));
    const size = Math.min(TITLE_SIZE, Math.floor((TITLE_SIZE * TITLE_MAX_WIDTH) / widest));
    const spread = (1 - p) * 26;
    ctx.globalAlpha = p;
    lines.forEach((line, row) => {
      const chars = [...line];
      const widths = chars.map((c) => textWidth(ctx, c, size));
      const total = widths.reduce((a, b) => a + b, 0) + spread * (chars.length - 1);
      let x = UI_WIDTH / 2 - total / 2;
      const y = 92 - (lines.length - 1) * size * 0.5 + row * size;
      chars.forEach((c, i) => {
        drawText(ctx, c, x, y, { size, color: '#ffcc66', shadow: '#5a3a10' });
        x += widths[i] + spread;
      });
    });
    ctx.globalAlpha = 1;
  }
}
