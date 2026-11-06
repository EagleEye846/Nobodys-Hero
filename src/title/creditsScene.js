import { UI_WIDTH, UI_HEIGHT } from '../config.js';
import { inUiSpace } from '../engine/screen.js';
import { textFile } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { SONGS } from '../data/music/index.js';
import { lookSprite } from '../overworld/scenePlayer.js';
import { heroFrame } from '../characters/hero.js';
import { memberFrames } from '../characters/party.js';
import { drawText, textWidth } from '../ui/text.js';

// The Ruins' credits, unless the end of a chapter names its own.
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
const LYRIC_Y = UI_HEIGHT - 100;
const LYRIC_FADE = 0.35;
// A syllable's glow sweeps across it over this long at most.
const SYLLABLE_SWEEP = 0.5;
const STARS = 70;
// The procession along the bottom: the section named [walkers] in the text
// file lists who (one look per line: 'hero', 'member:vesper', or any card
// look like 'enemy:moth'). They stroll left to right over the whole song.
const WALKER_SECTION = 'walkers';
const WALKER_SCALE = 3;
const WALKER_GAP = 120;
const GROUND_Y = UI_HEIGHT - 16;
// The song fades up out of black over this long.
const OPEN_FADE = 2;

// The end credits: cards (text/credits.txt) fading in and out while the
// credits song plays, with its words at the bottom lighting up as the tune
// reaches them, like a karaoke line. Nobody sings; the words just glow.
// Behind them, a night sky slowly turns to dawn over the length of the song,
// like the end of a long walk. When it's over, `next()` gives the scene to go on to.
// `song` and `text` pick another chapter's credits song and cards.
export class CreditsScene {
  constructor(next, { song = SONG, text = TEXT_FILE } = {}) {
    this.next = next;
    this.time = 0;
    this.songName = song;
    this.song = SONGS[song];
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
    const file = textFile(text);
    this.walkers = (file[WALKER_SECTION]?.[0] ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
    const sections = Object.entries(file).filter(([name]) => name !== WALKER_SECTION).map(([, entries]) => entries);
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
    music.play(this.songName);
  }

  // Where we are in the song: its own clock while it plays (so the words land
  // on the notes), or the scene's if sound isn't allowed.
  get clock() {
    return music.songName === this.songName && music.songTime !== null ? music.songTime : this.time;
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
      this.drawWalkers(ctx, t);
      this.cards.forEach((card, i) => this.drawCard(ctx, card, t, i === 0 || i === this.cards.length - 1));
      this.drawLyrics(ctx, t);
      if (t < OPEN_FADE) {
        ctx.fillStyle = `rgba(0, 0, 0, ${(1 - t / OPEN_FADE).toFixed(3)})`;
        ctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
      }
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

  drawCard(ctx, card, t, bookend = false) {
    if (t < card.from || t > card.to) return;
    const alpha = Math.min(1, (t - card.from) / CARD_FADE, (card.to - t) / CARD_FADE);
    if (alpha <= 0) return;
    const cx = UI_WIDTH / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    // Cards drift up into place as they fade in, and on a little as they leave.
    const drift = Math.round((t < (card.from + card.to) / 2 ? 1 - alpha : -(1 - alpha)) * 14);
    ctx.translate(0, drift);
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
    // The first and last cards (the chapter, and what comes next) are bigger and gold.
    const headSize = fit(card.heading, bookend ? 36 : 30);
    drawText(ctx, card.heading, textX, bookend ? 108 : 120, { size: headSize, color: bookend ? '#ffcc66' : '#aeb8e8', align: 'center', shadow: '#141633' });
    // A thin rule under the heading, fading out at both ends.
    const ruleW = Math.min(room, textWidth(ctx, card.heading, headSize) + 60);
    const rule = ctx.createLinearGradient(textX - ruleW / 2, 0, textX + ruleW / 2, 0);
    rule.addColorStop(0, 'rgba(174, 184, 232, 0)');
    rule.addColorStop(0.5, 'rgba(174, 184, 232, 0.7)');
    rule.addColorStop(1, 'rgba(174, 184, 232, 0)');
    ctx.fillStyle = rule;
    ctx.fillRect(Math.round(textX - ruleW / 2), bookend ? 152 : 156, Math.round(ruleW), 2);
    const nameSize = bookend ? 56 : 44;
    card.names.forEach((name, i) => {
      const size = fit(name, nameSize);
      drawText(ctx, name, textX, (bookend ? 176 : 172) + i * nameSize + (nameSize - size) / 2, { size, color: bookend ? '#fff2c0' : '#f4f6ff', align: 'center', shadow: '#141633' });
    });
    ctx.restore();
  }

  // Everyone who walked this chapter with you, strolling along the bottom in
  // a line, one slow crossing of the screen over the whole song.
  walkerSprite(look, t, index) {
    const step = Math.floor(t * 3 + index) % 2;
    if (look === 'hero') return { img: heroFrame('right', true, false, t + index), bob: 0 };
    if (look.startsWith('member:')) {
      const frames = memberFrames(look.slice(7));
      if (frames) return { img: step ? frames.rightStep ?? frames.rightIdle : frames.rightIdle, bob: 0 };
    }
    const sprites = lookSprite(look);
    // Ones with no walking frames hop along instead.
    return sprites ? { img: sprites.right, bob: Math.abs(Math.sin(t * 5 + index * 1.3)) * 4 } : null;
  }

  drawWalkers(ctx, t) {
    if (!this.walkers.length) return;
    const count = this.walkers.length;
    const lineLength = count * WALKER_GAP;
    const progress = Math.min(1, t / (this.duration + RING_SECONDS));
    // Start with the last of them just off the left edge; end with the first just off the right.
    const lead = -lineLength + (UI_WIDTH + lineLength + WALKER_GAP) * progress;
    // The ground they walk on, catching the dawn light.
    const ground = ctx.createLinearGradient(0, GROUND_Y - 6, 0, UI_HEIGHT);
    ground.addColorStop(0, 'rgba(10, 8, 24, 0)');
    ground.addColorStop(1, 'rgba(10, 8, 24, 0.8)');
    ctx.fillStyle = ground;
    ctx.fillRect(0, GROUND_Y - 6, UI_WIDTH, UI_HEIGHT - GROUND_Y + 6);
    this.walkers.forEach((look, i) => {
      const walker = this.walkerSprite(look, t, i);
      if (!walker) return;
      const { img, bob } = walker;
      const w = img.width * WALKER_SCALE;
      const h = img.height * WALKER_SCALE;
      // The first in the list leads.
      const x = lead + (count - 1 - i) * WALKER_GAP;
      if (x < -w || x > UI_WIDTH + w) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(Math.round(x - w / 2 + 4), GROUND_Y - 3, Math.round(w - 8), 5);
      ctx.drawImage(img, Math.round(x - w / 2), Math.round(GROUND_Y - h + 2 - bob), w, h);
    });
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
