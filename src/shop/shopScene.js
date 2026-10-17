import { UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { textFile, textSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { HERO_STATE } from '../characters/heroState.js';
import { SHOPS } from '../data/shops.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, wrapLines, layoutDialogue, drawDialogue } from '../ui/text.js';
import { MENU_COLORS, drawWeaponList, drawWeaponDetails, drawItemDetails } from '../ui/menuFrame.js';
import { ITEMS, MAX_ITEMS, giveItem } from '../data/items.js';
import { WEAPONS } from '../data/weapons.js';

// A shop, laid out like Deltarune's: the shopkeeper behind their counter up
// top, and two boxes below. The left box is the menu (BUY, TALK, EXIT) or the
// list you're browsing; the right box is what the shopkeeper says, or the
// item you're looking at. The scene ends through onExit.

// World units (320 wide): the shop room above the boxes.
const ROOM_HEIGHT = 122;
const COUNTER_Y = 96;
const KEEPER_SCALE = 4;

// UI units (640x480): the two boxes.
const LEFT_BOX = { x: 8, y: 250, w: 300, h: 222 };
const RIGHT_BOX = { x: 316, y: 250, w: 316, h: 222 };
const BUBBLE = { x: 404, y: 26, w: 222, h: 84 };
const BORDER = 4;
const LIST_AREA = { x: LEFT_BOX.x + 18, y: LEFT_BOX.y + 18, width: LEFT_BOX.w - 40, rowHeight: 32, rows: 6 };
const DETAILS_AREA = { x: RIGHT_BOX.x + 20, y: RIGHT_BOX.y + 16, w: RIGHT_BOX.w - 40 };

const MENU_OPTIONS = ['BUY', 'TALK', 'EXIT'];
const TEXT_SPEED = 50; // characters per second
const LEAVE_SECONDS = 1.6;
const BLINK_PERIOD = 3.2;
const BLINK_SECONDS = 0.12;

const keeperSprite = makeSprite(PROP_SPRITES.merchant, PROP_PALETTE);
// Where the merchant's eyes are in their sprite, to close them when they blink.
const EYES = [{ x: 3, y: 11 }, { x: 8, y: 11 }];

// Bottles on the shelves: a fixed arrangement so the room looks the same every visit.
const BOTTLE_COLORS = ['#5fc27a', '#ff5470', '#4fe3d0', '#ffd25e', '#b07cff', '#ff8c1a'];
const SHELVES = [
  { x: 14, y: 34, w: 96 },
  { x: 210, y: 34, w: 96 },
  { x: 14, y: 64, w: 96 },
  { x: 210, y: 64, w: 96 },
];

export class ShopScene {
  constructor(shopId, onExit) {
    this.shop = SHOPS[shopId];
    if (!this.shop) throw new Error(`Unknown shop '${shopId}'`);
    this.onExit = onExit;
    this.mode = 'menu';
    this.menuCursor = 0;
    this.buyCursor = 0;
    this.talkCursor = 0;
    this.time = 0;
    // TALK topics are the "talk: ..." sections of the shop's text file.
    this.topics = Object.keys(textFile(this.shop.textFile))
      .filter((section) => section.startsWith('talk: '))
      .map((section) => ({ section, label: section.slice('talk: '.length) }));
    this.say('greeting');
  }

  enter(game) {
    this.game = game;
    music.play(this.shop.music ?? null);
  }

  say(section) {
    this.line = textSection(this.shop.textFile, section)[0];
    this.lineTime = 0;
  }

  update(dt, input) {
    this.time += dt;
    this.lineTime += dt;

    switch (this.mode) {
      case 'menu':
        this.updateMenu(input);
        break;
      case 'buy':
        this.updateBuy(input);
        break;
      case 'talk':
        this.updateTalk(input);
        break;
      case 'leaving':
        if (this.lineTime >= LEAVE_SECONDS || input.wasPressed('confirm')) this.onExit();
        break;
    }
  }

  updateMenu(input) {
    const count = MENU_OPTIONS.length;
    const before = this.menuCursor;
    if (input.wasPressed('down')) this.menuCursor = (this.menuCursor + 1) % count;
    if (input.wasPressed('up')) this.menuCursor = (this.menuCursor - 1 + count) % count;
    if (this.menuCursor !== before) sfx('move');
    const choice = input.wasPressed('cancel') ? 'EXIT' : input.wasPressed('confirm') ? MENU_OPTIONS[this.menuCursor] : null;

    if (choice) sfx(choice === 'EXIT' ? 'back' : 'select');
    if (choice === 'BUY') {
      this.mode = 'buy';
      this.say('buy_prompt');
    } else if (choice === 'TALK') {
      this.mode = 'talk';
      this.say('talk_prompt');
    } else if (choice === 'EXIT') {
      this.mode = 'leaving';
      this.say('farewell');
    }
  }

  backToMenu() {
    sfx('back');
    this.mode = 'menu';
    this.say('menu_prompt');
  }

  updateBuy(input) {
    if (input.wasPressed('cancel')) {
      this.backToMenu();
      return;
    }
    const count = this.shop.stock.length;
    const before = this.buyCursor;
    if (input.wasPressed('down')) this.buyCursor = (this.buyCursor + 1) % count;
    if (input.wasPressed('up')) this.buyCursor = (this.buyCursor - 1 + count) % count;
    if (this.buyCursor !== before) sfx('move');
    if (input.wasPressed('confirm')) this.buy(this.shop.stock[this.buyCursor]);
  }

  buy({ weapon, item, price }) {
    if (item) {
      if (HERO_STATE.gold < price) {
        sfx('error');
        this.say('too_poor');
      } else if (HERO_STATE.items.length >= MAX_ITEMS) {
        sfx('error');
        this.say('bag_full');
      } else {
        sfx('heal');
        HERO_STATE.gold -= price;
        giveItem(item);
        this.say('bought_item');
      }
      return;
    }
    if (HERO_STATE.weapons.includes(weapon)) {
      sfx('error');
      this.say('owned');
    } else if (HERO_STATE.gold < price) {
      sfx('error');
      this.say('too_poor');
    } else {
      sfx('heal');
      HERO_STATE.gold -= price;
      HERO_STATE.weapons.push(weapon);
      this.say('bought');
    }
  }

  updateTalk(input) {
    if (input.wasPressed('cancel')) {
      this.backToMenu();
      return;
    }
    const count = this.topics.length;
    const before = this.talkCursor;
    if (input.wasPressed('down')) this.talkCursor = (this.talkCursor + 1) % count;
    if (input.wasPressed('up')) this.talkCursor = (this.talkCursor - 1 + count) % count;
    if (this.talkCursor !== before) sfx('move');
    if (input.wasPressed('confirm')) {
      sfx('select');
      this.say(this.topics[this.talkCursor].section);
    }
  }

  visibleCharacters() {
    return Math.floor(this.lineTime * TEXT_SPEED);
  }

  draw(ctx) {
    this.drawRoom(ctx);
    inUiSpace(ctx, () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, ROOM_HEIGHT * 2, UI_WIDTH, UI_HEIGHT - ROOM_HEIGHT * 2);
      this.drawBox(ctx, LEFT_BOX);
      this.drawBox(ctx, RIGHT_BOX);
      this.drawLeftBox(ctx);
      this.drawRightBox(ctx);
      // While browsing, the shopkeeper talks in a bubble so the item info has the right box.
      if (this.mode === 'buy') this.drawBubble(ctx);
    });
  }

  // The shop room, in world units: wall, shelves, lanterns, the shopkeeper and the counter.
  drawRoom(ctx) {
    ctx.fillStyle = '#2a1f45';
    ctx.fillRect(0, 0, SCREEN_WIDTH, ROOM_HEIGHT);
    ctx.fillStyle = '#211838';
    for (let row = 0; row * 8 < COUNTER_Y; row++) {
      const y = row * 8;
      ctx.fillRect(0, y + 7, SCREEN_WIDTH, 1);
      for (let x = (row % 2) * 8; x < SCREEN_WIDTH; x += 16) ctx.fillRect(x, y, 1, 7);
    }

    SHELVES.forEach((shelf, s) => {
      for (let i = 0; i < 6; i++) {
        const x = shelf.x + 4 + i * 15;
        const height = 8 + ((i + s) % 3) * 2;
        ctx.fillStyle = BOTTLE_COLORS[(i + s * 2) % BOTTLE_COLORS.length];
        ctx.fillRect(x, shelf.y - height, 7, height);
        ctx.fillStyle = '#c9a26b';
        ctx.fillRect(x + 2, shelf.y - height - 2, 3, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(x + 1, shelf.y - height + 2, 1, 3);
      }
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(shelf.x, shelf.y, shelf.w, 4);
      ctx.fillStyle = '#8a5a2a';
      ctx.fillRect(shelf.x, shelf.y, shelf.w, 1);
    });

    // Two lanterns hanging from the ceiling, swaying and glowing.
    for (const [baseX, phase] of [[124, 0], [196, 1.7]]) {
      const x = Math.round(baseX + Math.sin(this.time * 1.2 + phase) * 2);
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(baseX, 0, 1, 12);
      const glow = ctx.createRadialGradient(x + 3, 17, 1, x + 3, 17, 26);
      glow.addColorStop(0, `rgba(255, 204, 102, ${(0.35 + 0.08 * Math.sin(this.time * 3 + phase)).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 204, 102, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 23, -9, 52, 52);
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(x - 1, 11, 9, 11);
      ctx.fillStyle = '#ffcc66';
      ctx.fillRect(x, 12, 7, 9);
      ctx.fillStyle = '#fff2c0';
      ctx.fillRect(x + 2, 14, 3, 5);
    }

    this.drawKeeper(ctx);

    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(0, COUNTER_Y, SCREEN_WIDTH, ROOM_HEIGHT - COUNTER_Y);
    ctx.fillStyle = '#8a5a2a';
    ctx.fillRect(0, COUNTER_Y, SCREEN_WIDTH, 3);
    ctx.fillStyle = '#4a2e14';
    for (let x = 10; x < SCREEN_WIDTH; x += 24) ctx.fillRect(x, COUNTER_Y + 3, 1, ROOM_HEIGHT - COUNTER_Y - 3);
    // A little stack of coins on the counter.
    ctx.fillStyle = '#ffd25e';
    for (let i = 0; i < 4; i++) ctx.fillRect(232, COUNTER_Y - 2 - i * 2, 9, 2);
    ctx.fillStyle = '#c99a2e';
    for (let i = 0; i < 4; i++) ctx.fillRect(232, COUNTER_Y - 1 - i * 2, 9, 1);
  }

  // The shopkeeper, big, behind the counter: bobbing gently and blinking now and then.
  drawKeeper(ctx) {
    const w = keeperSprite.width * KEEPER_SCALE;
    const h = keeperSprite.height * KEEPER_SCALE;
    const x = Math.round(SCREEN_WIDTH / 2 - 6 * KEEPER_SCALE);
    const bob = Math.sin(this.time * 2) > 0 ? 1 : 0;
    const y = COUNTER_Y - h + 6 * KEEPER_SCALE - bob;
    ctx.drawImage(keeperSprite, x, y, w, h);

    if (this.time % BLINK_PERIOD < BLINK_SECONDS) {
      ctx.fillStyle = PROP_PALETTE.m;
      for (const eye of EYES) ctx.fillRect(x + eye.x * KEEPER_SCALE, y + eye.y * KEEPER_SCALE, KEEPER_SCALE, KEEPER_SCALE);
    }
  }

  drawBox(ctx, { x, y, w, h }) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + BORDER, y + BORDER, w - BORDER * 2, h - BORDER * 2);
  }

  drawLeftBox(ctx) {
    if (this.mode === 'buy') {
      // Rows are stock entries: food you can buy again and again, weapons once.
      const stock = this.shop.stock;
      const owned = (i) => stock[i].weapon && HERO_STATE.weapons.includes(stock[i].weapon);
      drawWeaponList(ctx, stock.map((_, i) => i), this.buyCursor, {
        area: LIST_AREA,
        name: (i) => (stock[i].item ? ITEMS[stock[i].item].name : WEAPONS[stock[i].weapon].name),
        nameColor: (i) => (owned(i) ? MENU_COLORS.dim : MENU_COLORS.text),
        tag: (i) => (owned(i) ? { text: 'OWNED', color: MENU_COLORS.dim } : { text: `${stock[i].price}G`, color: MENU_COLORS.highlight }),
      });
      return;
    }

    const options = this.mode === 'talk' ? this.topics.map((topic) => topic.label) : MENU_OPTIONS;
    const cursor = this.mode === 'talk' ? this.talkCursor : this.menuCursor;
    const rowHeight = this.mode === 'talk' ? 36 : 44;
    options.forEach((label, i) => {
      const y = LEFT_BOX.y + 24 + i * rowHeight;
      const selected = i === cursor && this.mode !== 'leaving';
      if (selected) ctx.drawImage(soulSprite(), LEFT_BOX.x + 24, y + 7);
      drawText(ctx, label, LEFT_BOX.x + 52, y, { size: this.mode === 'talk' ? 28 : 34, color: selected ? MENU_COLORS.highlight : MENU_COLORS.text });
    });
  }

  drawRightBox(ctx) {
    if (this.mode === 'buy') {
      const entry = this.shop.stock[this.buyCursor];
      if (entry.item) drawItemDetails(ctx, entry.item, DETAILS_AREA);
      else drawWeaponDetails(ctx, entry.weapon, DETAILS_AREA);
    } else {
      const lines = layoutDialogue(ctx, this.line, RIGHT_BOX.w - 44, 28);
      drawDialogue(ctx, lines, RIGHT_BOX.x + 22, RIGHT_BOX.y + 20, { size: 28, lineHeight: 27, visible: this.visibleCharacters() });
    }
    // Your gold sits in the room's bottom-left corner, clear of both boxes.
    drawText(ctx, `${HERO_STATE.gold} G`, 16, ROOM_HEIGHT * 2 - 30, { size: 28, color: MENU_COLORS.highlight, outline: '#000' });
  }

  drawBubble(ctx) {
    const { x, y, w, h } = BUBBLE;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 10);
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 1, y + 30);
    ctx.lineTo(x - 18, y + 46);
    ctx.lineTo(x + 1, y + 52);
    ctx.fill();
    // Wrap the whole line first, then reveal it, so words don't jump lines as they type out.
    let remaining = this.visibleCharacters();
    const lines = wrapLines(ctx, this.line, w - 22, 14, 'speech').slice(0, 4).map((line) => {
      const shown = line.slice(0, Math.max(0, remaining));
      remaining -= line.length + 1;
      return shown;
    });
    drawText(ctx, lines.join('\n'), x + 11, y + 10, { size: 14, lineHeight: 17, font: 'speech', color: '#1a1424' });
  }
}
