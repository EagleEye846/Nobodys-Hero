import { UI_WIDTH, UI_HEIGHT, SCREEN_WIDTH } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { inUiSpace } from '../engine/screen.js';
import { textFile, textSection, turnSection } from '../engine/textLoader.js';
import { music, sfx } from '../audio/music.js';
import { voiceFor, speak } from '../audio/voices.js';
import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { SHOPS } from '../data/shops.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { soulSprite } from '../battle/soul.js';
import { drawText, wrapLines, textWidth, layoutDialogue, drawDialogue, paginate } from '../ui/text.js';
import { MENU_COLORS, drawWeaponList, drawWeaponDetails, drawArmorDetails, drawItemDetails, listIcon, itemIcon } from '../ui/menuFrame.js';
import { glide, counting } from '../ui/uiMotion.js';
import { ITEMS, giveItem, roomForItem } from '../data/items.js';
import { WEAPONS } from '../data/weapons.js';
import { ARMOR } from '../data/armor.js';
import { skillBonus } from '../characters/progress.js';
import { isWorn, wielderOf, equippedGear, HERO } from '../characters/equipment.js';
import { inParty } from '../characters/party.js';
import { STAR_FORGINGS, starLevel } from '../data/fallenStar.js';
import { GEAR, hasGear, giveGear, keepsakeText } from '../data/gear.js';

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
// The shopkeeper's words in the right box: how wide, how big, and how many lines fit.
const TALK_WIDTH = RIGHT_BOX.w - 44;
const TALK_SIZE = 28;
const TALK_LINES = 7;
let measuring = null;
const DETAILS_AREA = { x: RIGHT_BOX.x + 20, y: RIGHT_BOX.y + 16, w: RIGHT_BOX.w - 40, h: RIGHT_BOX.h - 26 };

const MENU_OPTIONS = ['BUY', 'SELL', 'TALK', 'EXIT'];

// What a shop pays for something: SELL_SHARE of an item's price, or of the
// most any shop charges for a weapon or piece of armor. Never less than a coin.
// SELL_SHARE matches Haggler's discount (bargain 0.15), so buying something
// cheap and selling it straight back never makes money.
const SELL_SHARE = 0.85;
// Things no shop sells (monster loot, mostly) have no price, so shops pay
// generously for them: a drop by how much it heals (more than a shop charges
// per HP, since nobody else sells it), capped for the ones that heal you
// fully; gear at a flat rate.
const VALUE_PER_HP = 1.2;
const MOST_HP_VALUED = 150;
const UNPRICED_ITEM = 45;
const UNPRICED_GEAR = 150;
// An item a shop stocks is worth the least any shop charges for it (so the
// Hearth Candle, 55 G at the Ruins shop, can't be sold back for more).
function itemValue(id) {
  const item = ITEMS[id];
  const prices = Object.values(SHOPS).flatMap((shop) => shop.stock.filter((s) => s.item === id).map((s) => s.price));
  if (prices.length) return Math.min(...prices);
  if (item.price) return item.price;
  return item.heal ? Math.min(item.heal, MOST_HP_VALUED) * VALUE_PER_HP : UNPRICED_ITEM;
}
export function sellValue(entry) {
  if (entry.item) return Math.max(1, Math.floor(itemValue(entry.item) * SELL_SHARE));
  const id = entry.weapon ?? entry.armor;
  const key = entry.weapon ? 'weapon' : 'armor';
  const prices = Object.values(SHOPS).flatMap((shop) => shop.stock.filter((s) => s[key] === id).map((s) => s.price));
  return Math.max(1, Math.floor((prices.length ? Math.max(...prices) : UNPRICED_GEAR) * SELL_SHARE));
}

// Everything you could sell right now: the bag, and weapons and armor nobody
// in the party is wearing.
function sellables() {
  return [
    ...HERO_STATE.items.map((item, index) => ({ item, index })),
    ...HERO_STATE.weapons.filter((w) => !isWorn('weapon', w)).map((weapon) => ({ weapon })),
    ...HERO_STATE.armors.filter((a) => !isWorn('armor', a)).map((armor) => ({ armor })),
  ];
}
const TEXT_SPEED = 50; // characters per second
const LEAVE_SECONDS = 1.6;
const BLINK_PERIOD = 3.2;
const BLINK_SECONDS = 0.12;

// Each shop has its own keeper (`keeper` in src/data/shops.js, a prop sprite;
// Moss if left out) with `eyes` to close when they blink (none, and `still`,
// for a shop with nobody minding it), and a `look`: the
// colours of its room.
const DEFAULT_KEEPER = { sprite: 'merchant', eyes: [{ x: 3, y: 11 }, { x: 8, y: 11 }], eyeColor: PROP_PALETTE.m };
const DEFAULT_LOOK = {
  wall: '#2a1f45', wallLine: '#211838', shelf: '#6b4423', shelfTop: '#8a5a2a',
  counter: '#5a3a1a', counterTop: '#8a5a2a', counterGrain: '#4a2e14', lantern: '#ffcc66',
};
const keeperSprites = new Map();
function keeperSprite(name) {
  if (!keeperSprites.has(name)) keeperSprites.set(name, makeSprite(PROP_SPRITES[name], PROP_PALETTE));
  return keeperSprites.get(name);
}

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
    this.shopId = shopId;
    this.shop = SHOPS[shopId];
    if (!this.shop) throw new Error(`Unknown shop '${shopId}'`);
    this.sellCursor = 0;
    this.sellList = [];
    this.keeper = { ...DEFAULT_KEEPER, ...(this.shop.keeper ?? {}) };
    this.look = { ...DEFAULT_LOOK, ...(this.shop.look ?? {}) };
    this.onExit = onExit;
    this.mode = 'menu';
    this.menuCursor = 0;
    this.buyCursor = 0;
    this.talkCursor = 0;
    this.time = 0;
    // TALK topics are the "talk: ..." sections of the shop's text file
    // (a "... after <scene>" section is the same topic, later in the story).
    this.topics = Object.keys(textFile(this.shop.textFile))
      .filter((section) => section.startsWith('talk: ') && !section.includes(' after '))
      .map((section) => ({ section, label: section.slice('talk: '.length) }));
    // A smith who can reforge the Fallen Star (src/data/fallenStar.js), once
    // you've got it: a topic of their own, last.
    this.forging = STAR_FORGINGS.findIndex((f) => f.smith === shopId);
    // Without the sword, they've heard of it, and say where to look.
    if (this.forging > 0) this.topics.push({ section: null, label: HERO_STATE.weapons.includes('fallen_star') ? 'The star sword' : 'Star-metal', forge: true });
    // Hello, and a different hello the next times you come in ([greeting 2], [greeting 3]).
    WORLD_STATE.turns ??= {};
    const visits = (WORLD_STATE.turns[`shop:${shopId}`] ?? 0) + 1;
    WORLD_STATE.turns[`shop:${shopId}`] = visits;
    this.say('greeting', visits);
  }

  enter(game) {
    this.game = game;
    music.play(this.shop.music ?? null);
  }

  // Everything a section says, as pages that fit the box (Z shows the next).
  // A "<section> after <scene>" version wins once you've seen that scene (the
  // latest one seen), the way townsfolk's lines move on with the story.
  // `turn`: the how-manyth time it's said, for words that take turns (turnSection).
  say(section, turn = 1) {
    measuring ??= document.createElement('canvas').getContext('2d');
    const sections = textFile(this.shop.textFile);
    const scene = [...(WORLD_STATE.seenScenes ?? [])].reverse().find((id) => sections[`${section} after ${id}`]);
    this.pages = textSection(this.shop.textFile, turnSection(this.shop.textFile, scene ? `${section} after ${scene}` : section, turn))
      .flatMap((entry) => paginate(measuring, entry, TALK_WIDTH, TALK_SIZE, TALK_LINES));
    this.pageIndex = 0;
    this.line = this.pages[0];
    this.lineTime = 0;
  }

  // The keeper's voice as their words type out (src/audio/voices.js), every
  // other letter. Words shown whole at once (Z) make no sound.
  speakLine() {
    // (A new line, or the same words said again from the start.)
    if (!this.spoken || this.spokenLine !== this.line || this.lineTime < this.spoken.time) {
      this.spokenLine = this.line;
      this.spoken = { letters: 0, upTo: 0, time: 0 };
    }
    this.spoken.time = this.lineTime;
    const length = this.line?.length ?? 0;
    const shown = Number.isFinite(this.lineTime) ? Math.min(length, this.visibleCharacters()) : length;
    if (Number.isFinite(this.lineTime)) speak(voiceFor(this.shopId), this.line, this.spoken.upTo, shown, this.spoken);
    this.spoken.upTo = Math.max(this.spoken.upTo, shown);
  }

  get morePages() {
    return this.pageIndex < this.pages.length - 1;
  }

  update(dt, input) {
    this.time += dt;
    this.lineTime += dt;
    this.speakLine();

    // A long line carries on: Z finishes the page, then shows the next.
    if (this.morePages && this.mode !== 'buy' && input.wasPressed('confirm')) {
      if (this.visibleCharacters() < this.line.length) this.lineTime = Infinity;
      else {
        this.pageIndex++;
        this.line = this.pages[this.pageIndex];
        this.lineTime = 0;
      }
      return;
    }

    switch (this.mode) {
      case 'menu':
        this.updateMenu(input);
        break;
      case 'buy':
        this.updateBuy(input);
        break;
      case 'sell':
        this.updateSell(input);
        break;
      case 'talk':
        this.updateTalk(input);
        break;
      case 'leaving':
        // After a reforge that goes on in the room (`afterScene`), only Z leaves: the words matter.
        if (this.afterScene && input.wasPressed('confirm') && this.visibleCharacters() < this.line.length) this.lineTime = Infinity;
        else if ((!this.afterScene && this.lineTime >= LEAVE_SECONDS) || input.wasPressed('confirm')) this.onExit(this.afterScene ?? null);
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
    } else if (choice === 'SELL') {
      this.sellList = sellables();
      if (!this.sellList.length) {
        sfx('error');
        this.say('nothing_to_sell');
      } else {
        this.mode = 'sell';
        this.sellCursor = 0;
        this.say('sell_prompt');
      }
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

  // What something costs you, after Haggler.
  priceOf(entry) {
    if (entry.skillPoint) return entry.price;
    return Math.max(1, Math.round(entry.price * (1 - skillBonus('bargain'))));
  }

  // How many of this shop's skill points you've bought.
  skillPointsBought() {
    return HERO_STATE.boughtSkillPoints?.[this.shopId] ?? 0;
  }

  buy(entry) {
    const { weapon, armor, item, skillPoint, gear } = entry;
    const price = this.priceOf(entry);
    // GEAR (a Notch Charm), once: their [bought_notch] words.
    if (gear) {
      if (hasGear(gear)) {
        sfx('error');
        this.say('owned');
      } else if (HERO_STATE.gold < price) {
        sfx('error');
        this.say('too_poor');
      } else {
        sfx('levelUp');
        HERO_STATE.gold -= price;
        giveGear(gear);
        this.say('bought_notch');
      }
      return;
    }
    if (skillPoint) {
      if (this.skillPointsBought() >= (entry.limit ?? 1)) {
        sfx('error');
        this.say('skill_sold_out');
      } else if (HERO_STATE.gold < price) {
        sfx('error');
        this.say('too_poor');
      } else {
        sfx('levelUp');
        HERO_STATE.gold -= price;
        HERO_STATE.skillPoints += 1;
        HERO_STATE.boughtSkillPoints ??= {};
        HERO_STATE.boughtSkillPoints[this.shopId] = this.skillPointsBought() + 1;
        this.say('bought_skill');
      }
      return;
    }
    if (item) {
      if (HERO_STATE.gold < price) {
        sfx('error');
        this.say('too_poor');
      } else if (!roomForItem()) {
        sfx('error');
        this.say('bag_full');
      } else {
        sfx('buy');
        HERO_STATE.gold -= price;
        // With your bag full, it goes to storage, and they say so.
        const stored = giveItem(item) === 'stored';
        this.say(stored && textSection(this.shop.textFile, 'bought_stored').length ? 'bought_stored' : 'bought_item');
      }
      return;
    }
    // Weapons and armor are bought once each.
    const owned = weapon ? HERO_STATE.weapons : HERO_STATE.armors;
    const id = weapon ?? armor;
    // A party member's gear can't be bought before they've joined.
    const wielder = wielderOf(weapon ? 'weapon' : 'armor', id);
    if (owned.includes(id)) {
      sfx('error');
      this.say('owned');
    } else if (wielder !== HERO && !inParty(wielder)) {
      sfx('error');
      this.say('wont_fit');
    } else if (HERO_STATE.gold < price) {
      sfx('error');
      this.say('too_poor');
    } else {
      sfx('buy');
      HERO_STATE.gold -= price;
      owned.push(id);
      this.say('bought');
    }
  }

  updateSell(input) {
    if (input.wasPressed('cancel') || !this.sellList.length) {
      this.backToMenu();
      return;
    }
    const count = this.sellList.length;
    const before = this.sellCursor;
    if (input.wasPressed('down')) this.sellCursor = (this.sellCursor + 1) % count;
    if (input.wasPressed('up')) this.sellCursor = (this.sellCursor - 1 + count) % count;
    if (this.sellCursor !== before) sfx('move');
    if (input.wasPressed('confirm')) this.sell(this.sellList[this.sellCursor]);
  }

  sell(entry) {
    sfx('coins');
    HERO_STATE.gold += sellValue(entry);
    if (entry.item) HERO_STATE.items.splice(entry.index, 1);
    else if (entry.weapon) HERO_STATE.weapons.splice(HERO_STATE.weapons.indexOf(entry.weapon), 1);
    else HERO_STATE.armors.splice(HERO_STATE.armors.indexOf(entry.armor), 1);
    this.say('sold');
    this.sellList = sellables();
    this.sellCursor = Math.min(this.sellCursor, Math.max(0, this.sellList.length - 1));
    if (!this.sellList.length) this.mode = 'menu';
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
      const topic = this.topics[this.talkCursor];
      if (topic.forge) this.forge();
      else this.say(topic.section);
    }
  }

  // The star sword: they say what they'd need ([forge_ask]), or, if you've
  // brought it, reforge it on the spot ([forge_now]), or say it's done
  // ([forge_done]). An earlier forging still to do comes first ([forge_later]).
  forge() {
    const forging = STAR_FORGINGS[this.forging];
    const level = starLevel();
    // No sword yet: a hint where it is ([forge_hint]); or, holding the piece
    // with nothing to put it in, a shrug ([forge_shard_only]).
    if (!HERO_STATE.weapons.includes('fallen_star')) {
      this.say(hasGear(forging.needs) ? 'forge_shard_only' : 'forge_hint');
      return;
    }
    if (level >= this.forging) {
      this.say('forge_done');
      return;
    }
    if (level < this.forging - 1) {
      this.say('forge_later');
      return;
    }
    if (!hasGear(forging.needs)) {
      this.say('forge_ask');
      return;
    }
    HERO_STATE.gear = HERO_STATE.gear.filter((id) => id !== forging.needs);
    HERO_STATE.starForged = this.forging;
    // (No jingle: the reforge show that follows has its own sting. src/overworld/reforgeShow.js)
    this.say('forge_now');
    // A smith with a `forgeScene` (src/data/shops.js) finishes the job out in the room: once
    // [forge_now] has been read, the shop closes and the overworld plays that scene.
    if (this.shop.forgeScene) {
      this.afterScene = this.shop.forgeScene;
      this.mode = 'leaving';
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
      if (this.mode === 'buy' || this.mode === 'sell') this.drawBubble(ctx);
    });
  }

  // The shop room, in world units: wall, shelves, lanterns, the shopkeeper and the counter.
  drawRoom(ctx) {
    const look = this.look;
    ctx.fillStyle = look.wall;
    ctx.fillRect(0, 0, SCREEN_WIDTH, ROOM_HEIGHT);
    ctx.fillStyle = look.wallLine;
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
      ctx.fillStyle = look.shelf;
      ctx.fillRect(shelf.x, shelf.y, shelf.w, 4);
      ctx.fillStyle = look.shelfTop;
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
      ctx.fillStyle = look.lantern;
      ctx.fillRect(x, 12, 7, 9);
      ctx.fillStyle = '#fff2c0';
      ctx.fillRect(x + 2, 14, 3, 5);
    }

    this.drawKeeper(ctx);

    ctx.fillStyle = look.counter;
    ctx.fillRect(0, COUNTER_Y, SCREEN_WIDTH, ROOM_HEIGHT - COUNTER_Y);
    ctx.fillStyle = look.counterTop;
    ctx.fillRect(0, COUNTER_Y, SCREEN_WIDTH, 3);
    ctx.fillStyle = look.counterGrain;
    for (let x = 10; x < SCREEN_WIDTH; x += 24) ctx.fillRect(x, COUNTER_Y + 3, 1, ROOM_HEIGHT - COUNTER_Y - 3);
    // A little stack of coins on the counter.
    ctx.fillStyle = '#ffd25e';
    for (let i = 0; i < 4; i++) ctx.fillRect(232, COUNTER_Y - 2 - i * 2, 9, 2);
    ctx.fillStyle = '#c99a2e';
    for (let i = 0; i < 4; i++) ctx.fillRect(232, COUNTER_Y - 1 - i * 2, 9, 1);
  }

  // The shopkeeper, big, behind the counter: bobbing gently and blinking now and then.
  drawKeeper(ctx) {
    const sprite = keeperSprite(this.keeper.sprite);
    const w = sprite.width * KEEPER_SCALE;
    const h = sprite.height * KEEPER_SCALE;
    const x = Math.round(SCREEN_WIDTH / 2 - (sprite.width / 2) * KEEPER_SCALE);
    // A keeper that isn't alive (`still`) doesn't bob.
    const bob = !this.keeper.still && Math.sin(this.time * 2) > 0 ? 1 : 0;
    const y = COUNTER_Y - h + 6 * KEEPER_SCALE - bob;
    ctx.drawImage(sprite, x, y, w, h);

    if (this.time % BLINK_PERIOD < BLINK_SECONDS) {
      ctx.fillStyle = this.keeper.eyeColor;
      for (const eye of this.keeper.eyes) ctx.fillRect(x + eye.x * KEEPER_SCALE, y + eye.y * KEEPER_SCALE, KEEPER_SCALE, KEEPER_SCALE);
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
      // Rows are stock entries: food you can buy again and again, weapons,
      // armor and skill points a limited number of times.
      const stock = this.shop.stock;
      const gone = (i) => (stock[i].weapon && HERO_STATE.weapons.includes(stock[i].weapon))
        || (stock[i].gear && hasGear(stock[i].gear))
        || (stock[i].armor && HERO_STATE.armors.includes(stock[i].armor))
        || (stock[i].skillPoint && this.skillPointsBought() >= (stock[i].limit ?? 1));
      drawWeaponList(ctx, stock.map((_, i) => i), this.buyCursor, {
        area: LIST_AREA,
        name: (i) => (stock[i].skillPoint ? 'Skill Point' : stock[i].gear ? GEAR[stock[i].gear].name : stock[i].item ? ITEMS[stock[i].item].name : stock[i].armor ? ARMOR[stock[i].armor].name : WEAPONS[stock[i].weapon].name),
        nameColor: (i) => (gone(i) ? MENU_COLORS.dim : stock[i].skillPoint || stock[i].gear ? '#ffe14d' : MENU_COLORS.text),
        tag: (i) => (gone(i) ? { text: stock[i].skillPoint ? 'SOLD OUT' : 'OWNED', color: MENU_COLORS.dim } : { text: `${this.priceOf(stock[i])}G`, color: MENU_COLORS.highlight }),
        icon: (i) => this.entryIcon(stock[i]),
      });
      return;
    }
    if (this.mode === 'sell') {
      const list = this.sellList;
      drawWeaponList(ctx, list.map((_, i) => i), this.sellCursor, {
        area: LIST_AREA,
        name: (i) => (list[i].item ? ITEMS[list[i].item].name : list[i].armor ? ARMOR[list[i].armor].name : WEAPONS[list[i].weapon].name),
        nameColor: () => MENU_COLORS.text,
        tag: (i) => ({ text: `+${sellValue(list[i])}G`, color: '#5fc27a' }),
        icon: (i) => this.entryIcon(list[i]),
      });
      return;
    }

    const options = this.mode === 'talk' ? this.topics.map((topic) => topic.label) : MENU_OPTIONS;
    const cursor = this.mode === 'talk' ? this.talkCursor : this.menuCursor;
    const rowHeight = this.mode === 'talk' ? 36 : 44;
    // More topics than fit scroll with the cursor, with arrows at the ends.
    const rows = Math.floor((LEFT_BOX.h - 34) / rowHeight);
    const first = Math.max(0, Math.min(cursor - rows + 1, options.length - rows));
    options.slice(first, first + rows).forEach((label, row) => {
      const i = first + row;
      const y = LEFT_BOX.y + 24 + row * rowHeight;
      const selected = i === cursor && this.mode !== 'leaving';
      if (selected) {
        // The heart slides between the options rather than jumping.
        const at = glide(`shop:${this.mode}`, LEFT_BOX.x + 24, y + 7);
        ctx.drawImage(soulSprite(), at.x, at.y);
      }
      drawText(ctx, label, LEFT_BOX.x + 52, y, { size: this.mode === 'talk' ? 28 : 34, color: selected ? MENU_COLORS.highlight : MENU_COLORS.text });
    });
    if (first > 0) drawText(ctx, '▲', LEFT_BOX.x + LEFT_BOX.w - 30, LEFT_BOX.y + 12, { size: 20, color: MENU_COLORS.dim });
    if (first + rows < options.length) drawText(ctx, '▼', LEFT_BOX.x + LEFT_BOX.w - 30, LEFT_BOX.y + LEFT_BOX.h - 32, { size: 20, color: MENU_COLORS.dim });
  }

  drawRightBox(ctx) {
    if (this.mode === 'buy' || this.mode === 'sell') {
      const entry = this.mode === 'buy' ? this.shop.stock[this.buyCursor] : this.sellList[this.sellCursor];
      if (!entry) return;
      if (entry.skillPoint) this.drawSkillPointDetails(ctx, entry);
      else if (entry.gear) this.drawGearDetails(ctx, entry);
      else if (entry.item) drawItemDetails(ctx, entry.item, DETAILS_AREA);
      // Gear gets green and red arrows against what its wearer has on now.
      else if (entry.armor) drawArmorDetails(ctx, entry.armor, DETAILS_AREA, equippedGear(wielderOf('armor', entry.armor), 'armor'));
      else drawWeaponDetails(ctx, entry.weapon, DETAILS_AREA, equippedGear(wielderOf('weapon', entry.weapon), 'weapon'));
      this.drawOwnedNote(ctx, entry);
    } else {
      const lines = layoutDialogue(ctx, this.line, TALK_WIDTH, TALK_SIZE);
      drawDialogue(ctx, lines, RIGHT_BOX.x + 22, RIGHT_BOX.y + 20, { size: TALK_SIZE, lineHeight: 27, visible: this.visibleCharacters() });
      // There's more to come: press Z.
      if (this.morePages && this.visibleCharacters() >= this.line.length && Math.floor(this.time * 2) % 2 === 0) {
        drawText(ctx, '▼', RIGHT_BOX.x + RIGHT_BOX.w - 30, RIGHT_BOX.y + RIGHT_BOX.h - 30, { size: 20, color: MENU_COLORS.highlight });
      }
    }
    // Your gold sits in the room's bottom-left corner, clear of both boxes.
    // It counts down (or up) to what's left after you buy or sell.
    drawText(ctx, `${counting('shopGold', HERO_STATE.gold)} G`, 16, ROOM_HEIGHT * 2 - 30, { size: 28, color: MENU_COLORS.highlight, outline: '#000' });
  }

  // The small picture beside a stock or sell row: a sword, a shield, food,
  // a candle, or a star for a skill point.
  entryIcon(entry) {
    if (entry.skillPoint) return listIcon('star', '#ffe14d');
    if (entry.gear) return listIcon('other', '#ffe14d');
    if (entry.item) return itemIcon(entry.item);
    return listIcon(entry.armor ? 'armor' : 'weapon', MENU_COLORS.description);
  }

  // A small line along the bottom of the details: how many of an item you
  // carry, or whether you own a piece of gear and how it measures up to what
  // the hero wears (+ better, - worse).
  drawOwnedNote(ctx, entry) {
    if (entry.skillPoint || entry.gear) return;
    let text = '';
    let color = MENU_COLORS.dim;
    if (entry.item) {
      const have = HERO_STATE.items.filter((id) => id === entry.item).length;
      const stored = HERO_STATE.storage.filter((id) => id === entry.item).length;
      text = `You have ${have}${stored ? ` (+${stored} stored)` : ''}`;
    } else {
      const weapon = !!entry.weapon;
      const id = entry.weapon ?? entry.armor;
      if ((weapon ? HERO_STATE.weapon : HERO_STATE.armor) === id) text = 'Wearing it';
      else if ((weapon ? HERO_STATE.weapons : HERO_STATE.armors).includes(id)) text = 'Already yours';
      else if (wielderOf(weapon ? 'weapon' : 'armor', id) === HERO) {
        const mine = weapon ? WEAPONS[HERO_STATE.weapon] : ARMOR[HERO_STATE.armor];
        const theirs = weapon ? WEAPONS[id] : ARMOR[id];
        const stats = weapon ? [['FIGHT', 'fightPower']] : [['DEF', 'defense'], ['MAG', 'magic'], ['SP', 'spGain']];
        const parts = [];
        for (const [label, key] of stats) {
          const diff = Math.round(((theirs[key] ?? 0) - (mine?.[key] ?? 0)) * 100) / 100;
          if (diff) parts.push(`${label} ${diff > 0 ? '▲' : '▼'}${Math.abs(diff)}`);
        }
        if (parts.length) text = `Against yours: ${parts.join('  ')}`;
        color = MENU_COLORS.highlight;
      }
    }
    // Above the details box, level with the gold, where no description can reach it.
    if (text) drawText(ctx, text, RIGHT_BOX.x + 4, ROOM_HEIGHT * 2 - 26, { size: 22, color, outline: '#000' });
  }

  // A skill point for sale: what it is, and how many are left here.
  drawSkillPointDetails(ctx, entry) {
    const { x, y, w } = DETAILS_AREA;
    const left = (entry.limit ?? 1) - this.skillPointsBought();
    drawText(ctx, 'Skill Point', x, y, { size: 30, color: '#ffe14d' });
    drawText(ctx, `${left} left here`, x, y + 34, { size: 24, color: left ? MENU_COLORS.highlight : MENU_COLORS.dim });
    const lines = wrapLines(ctx, 'A point for the skill tree, saved up by someone who never got to spend it. Press C out there and choose SKILLS to use it.', w, 22);
    drawText(ctx, lines.join('\n'), x, y + 70, { size: 22, lineHeight: 24, color: MENU_COLORS.text });
  }

  // A Notch Charm for sale: what it is (its KEEPSAKES words), and whether it's yours.
  drawGearDetails(ctx, entry) {
    const { x, y, w } = DETAILS_AREA;
    const owned = hasGear(entry.gear);
    const name = GEAR[entry.gear].name;
    const size = Math.min(30, Math.floor((30 * w) / Math.max(1, textWidth(ctx, name, 30))));
    drawText(ctx, name, x, y, { size, color: '#ffe14d' });
    drawText(ctx, owned ? 'Yours already' : 'One of a kind', x, y + 34, { size: 24, color: owned ? MENU_COLORS.dim : MENU_COLORS.highlight });
    const lines = wrapLines(ctx, keepsakeText(entry.gear), w, 22);
    drawText(ctx, lines.join('\n'), x, y + 70, { size: 22, lineHeight: 24, color: MENU_COLORS.text });
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
