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
// The chapter 5 sea: where its horizon sits, how many rows of glints are on
// it, and how big a pixel of the lantern is.
const SEA_HORIZON = UI_HEIGHT - 150;
const SEA_ROWS = 12;
const LANTERN_PIXEL = 3;
// The song fades up out of black over this long.
const OPEN_FADE = 2;

// The end credits: cards (text/credits.txt) fading in and out while the
// credits song plays, with its words at the bottom lighting up as the tune
// reaches them, like a karaoke line. Nobody sings; the words just glow.
// Behind them, a night sky slowly turns to dawn over the length of the song,
// like the end of a long walk. When it's over, `next()` gives the scene to go on to.
// `song` and `text` pick another chapter's credits song and cards. `ambience`
// plays under the song (see music.js), and `sea` puts the sea along the
// bottom, with a lantern bobbing out on it (chapter 5).
export class CreditsScene {
  constructor(next, { song = SONG, text = TEXT_FILE, ambience = null, sea = false, skippable = true } = {}) {
    this.next = next;
    // The first time through a chapter's ending the credits play in full.
    this.skippable = skippable;
    this.time = 0;
    this.songName = song;
    this.ambience = ambience;
    this.sea = sea;
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
    music.play(this.songName, this.ambience);
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
      if (this.skippable && input.wasPressed('cancel')) {
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
      if (this.sea) this.drawSea(ctx, t, Math.min(1, t / this.duration));
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

  // The sea under the sky, from the horizon down to the shore the walkers are
  // on: slow glints drifting on it that catch the dawn as it comes, the foam
  // running up the sand and back, and far out, one lantern bobbing.
  drawSea(ctx, t, dawn) {
    const glow = Math.max(0, (dawn - 0.35) / 0.65) ** 1.5;
    const top = SEA_HORIZON;
    const shore = GROUND_Y - 6;
    // The dawn coming up behind the horizon (the sea hides the sky's own).
    const dawnLight = ctx.createLinearGradient(0, top - 110, 0, top);
    dawnLight.addColorStop(0, 'rgba(230, 150, 120, 0)');
    dawnLight.addColorStop(0.7, `rgba(150, 90, 120, ${(0.35 * glow).toFixed(3)})`);
    dawnLight.addColorStop(1, `rgba(255, 170, 130, ${(0.65 * glow).toFixed(3)})`);
    ctx.fillStyle = dawnLight;
    ctx.fillRect(0, top - 110, UI_WIDTH, 110);
    const sea = ctx.createLinearGradient(0, top, 0, shore);
    sea.addColorStop(0, `rgb(${Math.round(22 + 70 * glow)}, ${Math.round(26 + 34 * glow)}, ${Math.round(58 + 30 * glow)})`);
    sea.addColorStop(0.25, `rgb(${Math.round(12 + 26 * glow)}, ${Math.round(18 + 18 * glow)}, ${Math.round(44 + 18 * glow)})`);
    sea.addColorStop(1, '#070a1c');
    ctx.fillStyle = sea;
    ctx.fillRect(0, top, UI_WIDTH, shore - top);
    // The horizon itself: a thin bright line once the sun is near.
    ctx.fillStyle = `rgba(255, 196, 160, ${(0.15 + 0.5 * glow).toFixed(3)})`;
    ctx.fillRect(0, top, UI_WIDTH, 2);
    // Glints: short dashes in rows, longer and slower the nearer they are.
    for (let row = 0; row < SEA_ROWS; row++) {
      const near = row / (SEA_ROWS - 1);
      const y = Math.round(top + 4 + (shore - top - 14) * near ** 1.5);
      const length = 6 + near * 26;
      const gap = 40 + near * 70;
      const drift = (t * (4 + near * 6) * (row % 2 ? 1 : -1) + row * 37) % gap;
      for (let x = -gap + drift; x < UI_WIDTH; x += gap) {
        const wobble = Math.sin(t * 0.9 + x * 0.05 + row * 1.9);
        if (wobble < 0.1) continue;
        const a = (0.08 + 0.22 * wobble) * (1 - near * 0.4) * (0.5 + 0.5 * glow + 0.25);
        ctx.fillStyle = `rgba(${Math.round(150 + 105 * glow)}, ${Math.round(170 + 30 * glow)}, ${Math.round(230 - 60 * glow)}, ${a.toFixed(3)})`;
        ctx.fillRect(Math.round(x), y, Math.round(length * wobble), 2);
      }
      // The sun's path on the water, widening toward the shore.
      if (glow > 0.02) {
        const half = 10 + near * 50;
        for (let k = 0; k < 3; k++) {
          const w = Math.round(half * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + row * 2.3 + k * 1.9))));
          const x = UI_WIDTH * 0.72 + Math.sin(t * 0.6 + row + k * 2.1) * half * 0.6 - w / 2;
          ctx.fillStyle = `rgba(255, 200, 150, ${(0.4 * glow * (1 - near * 0.5)).toFixed(3)})`;
          ctx.fillRect(Math.round(x), y, w, 2);
        }
      }
    }
    this.drawLantern(ctx, t, glow);
    // The foam, running up the sand and sliding back.
    const reach = Math.sin(t * 0.45) * 0.5 + 0.5;
    const foamY = shore - 2 + Math.round(reach * 6);
    for (let x = 0; x < UI_WIDTH; x += 4) {
      const edge = Math.round(Math.sin(x * 0.031 + t * 0.6) * 2 + Math.sin(x * 0.11) * 1.5);
      const a = 0.25 + 0.35 * (1 - reach) * (0.5 + 0.5 * Math.sin(x * 0.07 + t));
      ctx.fillStyle = `rgba(220, 232, 255, ${a.toFixed(3)})`;
      ctx.fillRect(x, foamY + edge, 4, 2);
    }
  }

  // A little lantern far out on the water, drifting slowly across over the
  // song, rocking on the swell, its light laid on the sea under it.
  drawLantern(ctx, t, glow) {
    const p = LANTERN_PIXEL;
    const across = Math.min(1, t / Math.max(1, this.duration));
    const cx = Math.round(UI_WIDTH * (0.18 + 0.5 * across));
    const swell = Math.sin(t * 1.25) * 4 + Math.sin(t * 0.53 + 1) * 2;
    const baseY = Math.round(SEA_HORIZON + 62 + swell);
    const lean = Math.round(Math.sin(t * 1.25 + 0.9) * 1.6);
    const flicker = 0.85 + 0.1 * Math.sin(t * 9.3) + 0.05 * Math.sin(t * 23.1);
    // Its light, round it and laid on the water under it.
    const halo = ctx.createRadialGradient(cx, baseY - 5 * p, 2, cx, baseY - 5 * p, 46);
    halo.addColorStop(0, `rgba(255, 200, 110, ${(0.42 * flicker * (1 - glow * 0.5)).toFixed(3)})`);
    halo.addColorStop(1, 'rgba(255, 200, 110, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - 46, baseY - 5 * p - 46, 92, 92);
    for (let k = 0; k < 7; k++) {
      const y = baseY + 3 + k * 5;
      const w = Math.round((10 - k) * (0.7 + 0.3 * Math.sin(t * 2.1 + k * 1.7)));
      ctx.fillStyle = `rgba(255, 196, 110, ${((0.4 - k * 0.05) * flicker).toFixed(3)})`;
      ctx.fillRect(cx - w + Math.round(Math.sin(t * 1.7 + k) * 2), y, w * 2, 2);
    }
    // The lantern, in rows from the top (the ring, the cap, the glass, the
    // foot), leaning with the swell: the top sways more than the foot.
    const iron = '#2a2236';
    const rim = '#4a3d58';
    const glass = `rgb(255, ${Math.round(190 + 30 * flicker)}, ${Math.round(90 + 30 * flicker)})`;
    const flame = '#fff6d0';
    const rows = [
      [[2, 2, rim]],
      [[1, 1, rim], [4, 1, rim]],
      [[0, 6, iron]],
      [[1, 4, rim]],
      [[0, 1, iron], [1, 4, glass], [5, 1, iron]],
      [[0, 1, iron], [1, 1, glass], [2, 2, flame], [4, 1, glass], [5, 1, iron]],
      [[0, 1, iron], [1, 1, glass], [2, 2, flame], [4, 1, glass], [5, 1, iron]],
      [[0, 1, iron], [1, 4, glass], [5, 1, iron]],
      [[0, 6, iron]],
      [[1, 4, rim]],
    ];
    const height = rows.length;
    rows.forEach((spans, r) => {
      const shift = Math.round(lean * (height - r) / height);
      const y = baseY - (height - r) * p;
      for (const [col, width, color] of spans) {
        ctx.fillStyle = color;
        ctx.fillRect(cx - 3 * p + (col * p) + shift, y, width * p, p);
      }
    });
    // The water lapping round its foot.
    ctx.fillStyle = 'rgba(10, 14, 34, 0.85)';
    ctx.fillRect(cx - 4 * p, baseY - 1, 8 * p, 3);
    ctx.fillStyle = `rgba(255, 210, 140, ${(0.5 * flicker).toFixed(3)})`;
    ctx.fillRect(cx - 4 * p + Math.round(Math.sin(t * 2) * 2), baseY - 1, 3 * p, 1);
    ctx.fillRect(cx + p + Math.round(Math.sin(t * 2 + 2) * 2), baseY - 1, 2 * p, 1);
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
