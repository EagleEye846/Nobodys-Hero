import { UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { PANELS, PANEL_WIDTH, PANEL_HEIGHT } from '../data/art/cutscenes.js';
import { inUiSpace } from '../engine/screen.js';
import { textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { peekSave, eraseSave, formatPlayTime } from '../state/saveGame.js';
import { ROOMS } from '../data/rooms/index.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, textWidth } from '../ui/text.js';

// "LANTERN HALL" or "taper_home" -> "Lantern Hall"
const friendlyName = (name) => String(name).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const TEXT_FILE = 'title.txt';

const PROMPT_BLINK_SECONDS = 0.5;
const TITLE_FADE_SECONDS = 1.5;
const PROMPT_DELAY = 1.2;
// The title shrinks to fit if it's long.
const TITLE_SIZE = 72;
const TITLE_MAX_WIDTH = UI_WIDTH - 80;

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
  // `newGame()` starts over from the beginning.
  constructor(startGame, newGame = startGame) {
    this.startGame = startGame;
    this.newGame = newGame;
    this.time = 0;
    this.title = textSection(TEXT_FILE, 'title')[0];
    this.prompt = textSection(TEXT_FILE, 'new_game')[0];
    // With a save there's a card for it, and a choice: carry on, or start over.
    this.save = peekSave();
    this.options = ['CONTINUE', 'NEW GAME'];
    this.cursor = 0;
    this.confirming = false;
  }

  enter(game) {
    this.game = game;
    music.play('prophecy');
  }

  update(dt, input) {
    this.time += dt;
    if (this.time < PROMPT_DELAY) return;
    if (!this.save) {
      if (input.wasPressed('confirm')) this.begin(this.startGame);
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
      else {
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
    drawText(ctx, formatPlayTime(world.playSeconds), card.x + card.w - 20, card.y + 14, { size: 28, align: 'right' });
    drawText(ctx, place, card.x + 20, card.y + 52, { size: 28, color: '#ffcc66' });
    drawText(ctx, `${hero.gold ?? 0} G`, card.x + card.w - 20, card.y + 54, { size: 24, color: '#ffe14d', align: 'right' });

    const optionsY = card.y + card.h + 36;
    if (this.confirming) {
      drawText(ctx, 'Erase your save and start over?', UI_WIDTH / 2, optionsY - 6, { size: 30, align: 'center', color: '#ff5470', outline: '#07040c' });
      drawText(ctx, 'Z: yes, start over     X: no', UI_WIDTH / 2, optionsY + 30, { size: 24, align: 'center', color: '#c9c2e0', outline: '#07040c' });
      return;
    }
    this.options.forEach((label, i) => {
      const x = UI_WIDTH / 2 + (i === 0 ? -150 : 40);
      const selected = i === this.cursor;
      if (selected) ctx.drawImage(soulSprite(), x - 26, optionsY + 8);
      drawText(ctx, label, x, optionsY, { size: 32, color: selected ? '#ffe14d' : '#ffffff', outline: '#07040c' });
    });
  }

  draw(ctx) {
    const fade = Math.min(1, this.time / TITLE_FADE_SECONDS);
    this.drawStair(ctx, fade);

    inUiSpace(ctx, () => {
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
    });
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
    PANELS.stair(ctx, this.time);
    ctx.restore();
    // Fade the picture's edges into the dark.
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
    for (let i = 0; i < 26; i++) {
      const rise = (this.time * (8 + (i % 5) * 3) + i * 37) % 250;
      const ex = (i * 53 + Math.sin(this.time * 0.8 + i) * 6 + 400) % SCREEN_WIDTH;
      const ey = SCREEN_HEIGHT - rise;
      ctx.globalAlpha = fade * (0.35 + 0.35 * Math.sin(this.time * 3 + i * 1.7)) * Math.min(1, rise / 60);
      ctx.fillStyle = i % 3 ? '#ffcc66' : '#ff8c1a';
      ctx.fillRect(Math.round(ex), Math.round(ey), 1, 1);
    }
    ctx.globalAlpha = 1;
  }
}
