import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { textFile } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { SONGS } from '../data/music/index.js';
import { lookSprite } from '../overworld/scenePlayer.js';
import { drawText, textWidth } from '../ui/text.js';

const TEXT_FILE = 'credits.txt';
const SONG = 'credits';

// When the cards start and stop (seconds into the song), and how long each
// one takes to fade in and out.
const FIRST_CARD_AT = 1.5;
const CARDS_END_BEFORE = 6;
const CARD_FADE = 1.1;
// After the song ends: the last chord rings, then everything fades to black.
const RING_SECONDS = 4;
const FADE_OUT_SECONDS = 2;

const LYRIC_SIZE = 32;
const LYRIC_MAX_WIDTH = UI_WIDTH - 80;
const LYRIC_Y = UI_HEIGHT - 72;
const LYRIC_FADE = 0.35;
// A syllable's glow sweeps across it over this long at most.
const SYLLABLE_SWEEP = 0.5;
const STARS = 70;

// The end credits: cards (text/credits.txt) fading in and out while the
// credits song plays, with its words at the bottom lighting up as the tune
// reaches them, like a karaoke line. Nobody sings; the words just glow.
// Behind them, a night sky slowly turns to dawn over the length of the song,
// like the end of a long walk. When it's over, `next()` gives the scene to go on to.
export class CreditsScene {
  constructor(next) {
    this.next = next;
    this.time = 0;
    this.song = SONGS[SONG];
    const stepSeconds = 60 / this.song.bpm / this.song.stepsPerBeat;
    const steps = this.song.order.reduce((sum, name) => sum + Object.values(this.song.sections[name])[0].length, 0);
    this.duration = steps * stepSeconds;
    this.lyrics = (this.song.lyrics ?? []).map((line) => ({
      start: line.start * stepSeconds,
      end: line.end * stepSeconds,
      syllables: line.syllables.map((s, i, all) => ({
        at: s.step * stepSeconds,
        until: Math.min((all[i + 1]?.step ?? line.end) * stepSeconds, s.step * stepSeconds + SYLLABLE_SWEEP),
        // A syllable ending in '-' runs into the next one: "lit-" + "tle".
        text: s.text.endsWith('-') ? s.text.slice(0, -1) : s.text,
        joined: s.text.endsWith('-'),
      })),
    }));

    // Each section of the text file is a card: a heading, names, and maybe a
    // character (@look) beside it.
    const sections = Object.values(textFile(TEXT_FILE));
    const span = (this.duration - CARDS_END_BEFORE - FIRST_CARD_AT) / sections.length;
    this.cards = sections.map(([entry = ''], i) => {
      const lines = entry.split('\n');
      const look = lines.find((l) => l.startsWith('@'))?.slice(1);
      const [heading = '', ...names] = lines.filter((l) => !l.startsWith('@'));
      return {
        heading,
        names,
        sprite: look ? lookSprite(look) : null,
        side: i % 2 ? 1 : -1,
        from: FIRST_CARD_AT + i * span,
        // The last card stays up until the very end.
        to: i === sections.length - 1 ? this.duration + RING_SECONDS : FIRST_CARD_AT + (i + 1) * span,
      };
    });
  }

  enter(game) {
    this.game = game;
    music.play(SONG);
  }

  // Where we are in the song: its own clock while it plays (so the words land
  // on the notes), or the scene's if sound isn't allowed.
  get clock() {
    return music.songName === SONG && music.songTime !== null ? music.songTime : this.time;
  }

  update(dt, input) {
    this.time += dt;
    if (this.leaving) return;
    if (this.clock >= this.duration + RING_SECONDS + FADE_OUT_SECONDS) {
      this.leave();
      return;
    }
    // X asks whether to skip the credits; the answer starts on "No", so a
    // stray press doesn't skip them.
    if (!this.asking) {
      if (input.wasPressed('cancel')) {
        sfx('select');
        this.asking = { cursor: 1 };
      }
      return;
    }
    if (input.wasPressed('left') || input.wasPressed('right') || input.wasPressed('up') || input.wasPressed('down')) {
      this.asking.cursor = 1 - this.asking.cursor;
      sfx('move');
    } else if (input.wasPressed('cancel') || (input.wasPressed('confirm') && this.asking.cursor === 1)) {
      sfx('back');
      this.asking = null;
    } else if (input.wasPressed('confirm')) {
      sfx('select');
      this.leave();
    }
  }

  leave() {
    this.leaving = true;
    this.game.changeScene(this.next());
  }

  draw(ctx) {
    const t = this.clock;
    inUiSpace(ctx, () => {
      this.drawSky(ctx, Math.min(1, t / this.duration));
      for (const card of this.cards) this.drawCard(ctx, card, t);
      this.drawLyrics(ctx, t);
      const fade = (t - this.duration - RING_SECONDS) / FADE_OUT_SECONDS;
      if (fade > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, fade).toFixed(3)})`;
        ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
      }
      if (this.asking) this.drawSkipPrompt(ctx);
    });
  }

  // "Skip the credits?" with Yes and No, in the middle of the screen.
  drawSkipPrompt(ctx) {
    const box = { x: UI_WIDTH / 2 - 170, y: 196, w: 340, h: 112 };
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.fillRect(box.x - 3, box.y - 3, box.w + 6, box.h + 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(box.x, box.y, box.w, box.h);
    drawText(ctx, 'Skip the credits?', UI_WIDTH / 2, box.y + 16, { size: 32, align: 'center' });
    ['Yes', 'No'].forEach((label, i) => {
      const selected = this.asking.cursor === i;
      const x = UI_WIDTH / 2 + (i ? 70 : -70);
      drawText(ctx, selected ? `> ${label}` : label, x, box.y + 64, { size: 30, color: selected ? '#ffe14d' : '#8a82b0', align: 'center' });
    });
  }

  // The night sky: stars drifting slowly past, and, as the song goes on
  // (`dawn` from 0 to 1), a first light rising at the bottom while they fade.
  drawSky(ctx, dawn) {
    const t = this.time;
    const glow = Math.max(0, (dawn - 0.35) / 0.65) ** 1.5;
    const sky = ctx.createLinearGradient(0, 0, 0, UI_HEIGHT);
    sky.addColorStop(0, '#000000');
    sky.addColorStop(0.55, `rgba(20, 22, 54, ${(0.25 + 0.5 * glow).toFixed(3)})`);
    sky.addColorStop(0.85, `rgba(90, 60, 110, ${(0.55 * glow).toFixed(3)})`);
    sky.addColorStop(1, `rgba(230, 150, 120, ${(0.6 * glow).toFixed(3)})`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    for (let i = 0; i < STARS; i++) {
      const x = ((i * 157 + t * (3 + (i % 3))) % (UI_WIDTH + 20)) - 10;
      const y = (i * 263) % (UI_HEIGHT - 120);
      const twinkle = (0.35 + 0.35 * Math.sin(t * (0.8 + (i % 5) * 0.3) + i * 1.7)) * (1 - glow * 0.8);
      const size = i % 7 ? 2 : 3;
      ctx.fillStyle = `rgba(220, 228, 255, ${twinkle.toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), size, size);
    }
  }

  drawCard(ctx, card, t) {
    if (t < card.from || t > card.to) return;
    const alpha = Math.min(1, (t - card.from) / CARD_FADE, (card.to - t) / CARD_FADE);
    if (alpha <= 0) return;
    const cx = UI_WIDTH / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    // A character beside the card, bobbing gently.
    if (card.sprite) {
      const sprite = card.sprite.right;
      const scale = 4;
      const x = cx + card.side * 210 - (sprite.width * scale) / 2;
      const y = 196 - sprite.height * scale + Math.round(Math.sin(t * 2) * 3);
      ctx.drawImage(card.side < 0 ? sprite : card.sprite.left, Math.round(x), y, sprite.width * scale, sprite.height * scale);
    }
    const textX = card.sprite ? cx - card.side * 40 : cx;
    // A line too wide for the card (beside its character, or the screen) shrinks to fit.
    const room = card.sprite ? 400 : UI_WIDTH - 40;
    const fit = (text, size) => Math.min(size, Math.floor((size * room) / textWidth(ctx, text, size)));
    drawText(ctx, card.heading, textX, 120, { size: fit(card.heading, 30), color: '#aeb8e8', align: 'center', shadow: '#141633' });
    card.names.forEach((name, i) => {
      const size = fit(name, 44);
      drawText(ctx, name, textX, 164 + i * 44 + (44 - size) / 2, { size, color: '#f4f6ff', align: 'center', shadow: '#141633' });
    });
    ctx.restore();
  }

  // The line being sung, at the bottom: dim at first, each syllable glowing
  // as the tune reaches it.
  drawLyrics(ctx, t) {
    const line = this.lyrics.find((l) => t >= l.start && t < l.end);
    if (!line) return;
    const alpha = Math.min(1, (t - line.start) / LYRIC_FADE, (line.end - t) / LYRIC_FADE);
    // Long lines shrink to fit, with a margin either side.
    const measure = (size) => {
      const space = textWidth(ctx, ' ', size);
      const widths = line.syllables.map((s) => textWidth(ctx, s.text, size));
      const total = widths.reduce((sum, w, i) => sum + w + (line.syllables[i].joined || i === widths.length - 1 ? 0 : space), 0);
      return { size, space, widths, total };
    };
    let fit = measure(LYRIC_SIZE);
    if (fit.total > LYRIC_MAX_WIDTH) fit = measure(Math.floor((LYRIC_SIZE * LYRIC_MAX_WIDTH) / fit.total));
    const { size, space, widths, total } = fit;
    let x = (UI_WIDTH - total) / 2;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    line.syllables.forEach((s, i) => {
      const w = widths[i];
      drawText(ctx, s.text, x, LYRIC_Y, { size, color: '#4e4766' });
      const lit = Math.min(1, Math.max(0, (t - s.at) / Math.max(0.05, s.until - s.at)));
      if (lit > 0) {
        ctx.save();
        // Only the syllable being reached is cut off, where the glow has got to.
        if (lit < 1) {
          ctx.beginPath();
          ctx.rect(0, LYRIC_Y - 40, x + w * lit, size + 80);
          ctx.clip();
        }
        // Freshly sung words burn brightest, then settle to a warm glow.
        const fresh = Math.max(0, 1 - (t - s.at) / 1.5);
        ctx.shadowColor = '#9fc4ff';
        ctx.shadowBlur = 10 + 14 * fresh;
        drawText(ctx, s.text, x, LYRIC_Y, { size, color: fresh > 0.5 ? '#ffffff' : '#dfe8ff' });
        ctx.restore();
      }
      x += w + (s.joined ? 0 : space);
    });
    ctx.restore();
  }
}
