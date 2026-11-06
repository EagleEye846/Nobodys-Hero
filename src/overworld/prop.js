import { TILE_SIZE as T } from '../config.js';
import { drawFootShadow } from './shadows.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES, PROP_FOOTPRINTS } from '../data/art/props.js';
import { beatPulse } from './beatPulse.js';
import { animationFrame, DEFAULT_FRAME_SECONDS } from '../engine/animations.js';

const sprites = Object.fromEntries(
  Object.entries(PROP_SPRITES).map(([name, rows]) => [name, makeSprite(rows, PROP_PALETTE)]),
);

// A picture made while the game runs (the tide dial, tides.js): rooms can name
// it as a sprite, and its owner repaints it.
export function registerPropSprite(name, canvas) {
  sprites[name] = canvas;
}

// Characters (NPCs and shopkeepers) breathe, so they read as alive: in for
// two of these, out for two.
const BOB_SECONDS = 0.6;

// A solid, one-tile object in a room. Press confirm on it to read its `text`
// (a section of the room's text file), talk to its `npc` (a file in text/npcs/),
// browse its `shop` (an id in src/data/shops.js), or save if it's a `save`
// point. Its sprite can be bigger than the tile: it stands on the tile's
// bottom edge, centred. With an `animation` (see src/engine/animations.js) it
// plays that instead, `speed` seconds a frame.
//
// An object that `gives` an item hands it over the first time you press Z on
// it; after that it changes to its `taken` look and words, if it has them
// (the cake on Taper's counter becomes just a counter).
// The `gap` props that lie flat on the floor, rather than being holes in a wall.
const FLOOR_GAPS = new Set(['rotten_planks', 'drain_grate']);

// The crystals and glowcaps swell with the song without being asked (`pulse:
// false` turns it off for one).
const BEAT_SPRITES = /^(crystal_(teal|pink|violet|gold)_[sl]|crystal_bloom|crystal_pool|glowcap_(big|giant|small|tall|trio))$/;

export class Prop {
  //
  // Puzzles: a `lever` is a switch with a name, flipped with Z (it shows its
  // NAME_on sprite while on). A gate (`opensWith` a list of switch names) opens
  // once they're all on; with `inOrder`, they must be turned on in that order.
  constructor({
    sprite, x, y, text = null, npc = null, shop = null, fishing = null, save = false, animation = null, speed = DEFAULT_FRAME_SECONDS,
    gives = null, taken = null, lever = null, opensWith = null, inOrder = false, openText = null, resetText = null,
    walkable = false, solidSides = 0, light = null, seenInLight = false, notice = false, grapple = false,
    rest = false, dream = null, sound = null, join = null, nightText = null, wrath = null, glow = undefined,
    member = null, storage = false, vane = false, drift = null, travel = null,
    rock = false, button = null, rockReset = false, step = false,
    gap = false, treadle = null, log = false, chop = null, hide = false, wet = null, gold = 0,
    flow = null, tideWheel = null, tideBell = null, tideDial = false, float = false, cast = null, high = false, drawScene = null,
    cart = false, smash = false, switch: railSwitch = null, dir = null, cartOnly = false,
    beam = null, beamWhen = null, mirror = null, fixed = false, eye = null, latch = true,
    stroll = null, flat = false, chime = null, pulse = null, lure = null, quest = null,
    who = null, by = null, byText = null, react = false,
  }) {
    // A gift whose friends answer after it (see takeGift in overworldScene.js).
    this.react = react;
    // `pulse: 'beat'`: swells with the song (see beatPulse.js). It stretches
    // up a pixel or two on each beat, brightens, and on the first beat of a
    // bar sends out a ring of light. Its glow swells with it. It doesn't touch
    // where it stands or what it blocks.
    this.pulse = pulse === false ? null : pulse ?? (BEAT_SPRITES.test(sprite) ? 'beat' : null);
    // Town folk who go about their day (see src/overworld/folk.js): a `stroll`
    // is where and how they walk. `flat` lies on the floor, under everyone
    // (chalk squares, confetti). A button is set in the floor too, so a rock
    // or bale resting on it is drawn on top of it.
    this.stroll = stroll;
    // A singing crystal (Chapter 4: src/overworld/chimes.js): Z rings its
    // note, { set, note }. `shake` and `ringing` are seconds left of the
    // shiver from a wrong note and the glow of a struck one.
    this.chime = chime;
    this.shake = 0;
    this.ringing = 0;
    this.flat = flat || Boolean(button);
    this.walk = null;
    this.emote = 0;
    // The light-beam puzzles (Chapter 4: src/overworld/beams.js). A sun-crystal
    // throws a `beam` ('up', 'down', 'left' or 'right'), only while its
    // `beamWhen` switch is on if it has one. A prism's `mirror` ('/' or
    // '\') turns a beam 90 degrees; Z turns it over unless it's `fixed`. A
    // crystal `eye` lights its switch (a name, like a lever's) when a beam
    // reaches it, and keeps it on for good unless `latch` is false.
    this.beam = beam;
    this.beamWhen = beamWhen;
    this.mirror = mirror;
    this.mirrorHome = mirror;
    this.fixed = fixed;
    this.eye = eye;
    this.latch = latch;
    // Something drawn out of it (the Fallen Star from its stone): a scene to
    // play when you take it, instead of the usual words (see drawFromStone).
    this.drawScene = drawScene;
    // The Hushwood (Chapter 3), with Bramble. A `gap` is a hole too small
    // for you and just right for him: it stops the hero, and anyone else who
    // isn't small. A `treadle` (a name, like a button's) is held down by
    // anyone or anything standing on it, and lets up when they step off. A
    // `log` slides when pushed until something stops it, and sinks into
    // brook water as a bridge. A thin tree to `chop` falls the way the
    // chopper faces ('fell'), or a hollow one splits open to walk into
    // ('open'). A `hide` (a leaf pile) is somewhere to keep still in while
    // the Hush goes over. A `wet` prop is water in a channel: it's only there
    // while its sluice levers say so (names that must be on, or '!name' off).
    // `gold` is a purse of that many coins. See src/overworld/hushwood.js.
    this.gap = gap;
    this.treadle = treadle;
    // Trio puzzles (Chapter 5): a treadle with `who` ('hero', 'vesper' or 'bramble')
    // only goes down under that one; a lever or wheel with `by` only turns
    // for that one (`byText`: a section of the room's text file, said when
    // someone else tries it). Without them, any body will do.
    this.who = who;
    this.by = by;
    this.byText = byText;
    this.log = log;
    this.sunk = false;
    this.chop = chop === true ? 'fell' : chop;
    this.felled = false;
    this.hide = hide;
    // Loose scree you can kick to make a noise (the Deep's Crawl): it sends
    // the blind hunter off to listen at `lure.to` (a waypoint of its path)
    // for `lure.hold` seconds. Once. See SoundHunter in hushwood.js.
    this.lure = lure;
    this.lureUsed = false;
    this.wet = wet;
    this.gold = gold;
    // The Old Drains: a `flow` is a current, fast shallow water running one
    // way ('up', 'down', 'left' or 'right'). Step in and it carries you (and
    // logs and casks) along till something stops you or it runs out; you
    // can't walk up one. With a `wet` too, it only runs while its sluice
    // wheels say so. See Player.rideCurrent.
    this.flow = flow;
    // The tides (Chapter 5, tides.js): a wheel or a bell post that sets the tide,
    // a dial that shows it, and a crate (a `rock`) that floats at high tide.
    this.tideWheel = tideWheel;
    this.tideBell = tideBell;
    this.tideDial = tideDial;
    this.float = float;
    this.floating = false;
    // Push puzzles (Chapter 3): a `rock` you shove a tile at a time by walking
    // into it, a `button` (a switch with a name, like a lever's) that's held
    // down while a rock sits on it, and a `rockReset` that rolls every rock
    // in the room back to where it started. See Room's push puzzle section
    // and OverworldScene.pushRocks.
    this.rock = rock;
    // A `step` rock is a low block (12 high) whoever can jump may climb onto, once
    // it sits still: push it to the foot of a tall block and it's the way up.
    this.step = step;
    this.home = rock || log ? { x: x * T, y: y * T } : null;
    this.slide = null;
    this.button = button;
    // A button that only a mine cart's weight presses (a rock sitting on it does nothing).
    this.cartOnly = cartOnly;
    this.rockReset = rockReset;
    // A green updraft you can travel by: its id in src/data/travel.js.
    this.travel = travel;
    // A weathervane (turn it to turn the wind), or a snowdrift that's only
    // there in some winds (the ones listed): see weathervanes.js.
    this.vane = vane;
    this.drift = drift;
    // A storage chest: opens STORAGE (see storageMenu.js).
    this.storage = storage;
    // A party member staying put here for a while (Ves sitting by the hut
    // door): a cutscene actor who `plays` them `ahead` takes this one's place.
    this.member = member;
    // In a lamplit room (see src/overworld/lamplight.js): the light it gives
    // off, if not the usual for its sprite (PROP_GLOWS), or `false` for none.
    this.glow = glow === false ? [] : glow;
    // Something you may only use once a visit (the great bell: ONE ring). Use it
    // again and these words (a section of the room's text file) play, then it's
    // game over.
    this.wrath = wrath;
    this.uses = 0;
    // Other words for it after dark, outdoors (a section of the room's text file).
    this.nightText = nightText;
    // A character who joins the party when you talk to them (a member id in
    // src/characters/party.js). After that they walk with you instead.
    this.join = join;
    // A sound effect played when you press Z on it (the bell: 'bell').
    this.sound = sound;
    // A bed at an inn: sleep in it to restore your HP (see OverworldScene.useBed).
    this.rest = rest;
    this.dream = dream;
    // Rings for the Climbing Rope (see src/overworld/climbing.js): a
    // grapple_ring at the top of a cliff, which you can stand on, and a
    // swing_ring hammered into a steep face, to swing from on the way up.
    this.grapple = grapple || sprite === 'grapple_ring';
    this.swing = sprite === 'swing_ring';
    // Something the player should read: a bobbing "!" floats over it until
    // they have (the room sets `noticed` from the save).
    this.notice = notice;
    this.noticed = false;
    // In a dark room: how far it lights (pixels), and whether it can only be
    // seen (and used) inside your own light, like writing on a wall.
    this.light = light;
    this.seenInLight = seenInLight;
    // Something flat on the floor (a puddle, a rug) that you walk over, but can still look at.
    this.walkable = walkable || this.grapple || this.swing || Boolean(button) || Boolean(treadle) || hide || Boolean(flow);
    this.baseWalkable = this.walkable;
    // Something you walk through the middle of, but not its ends (an arch's
    // posts): this many pixels at each side still block.
    this.solidSides = solidSides;
    this.gives = gives;
    this.takenLook = taken;
    // A townsperson's side quest: a list of rules for what they say and do
    // when they hold or are owed something (see src/data/quests.js).
    this.quest = quest;
    // The Diggings' mine carts (see carts.js). A `cart` rolls along rails: true,
    // or a name for tests to ask after. A `smash` barricade is broken by a cart
    // sent down the line empty. A `switch` is a lever that throws a track switch
    // of that name (it's a lever like any other, under another name).
    this.cart = cart;
    this.smash = smash;
    this.smashed = false;
    this.dir = dir;
    this.lever = lever ?? railSwitch;
    this.opensWith = opensWith;
    this.inOrder = inOrder;
    this.openText = openText;
    this.resetText = resetText;
    this.isOpen = false;
    this.baseLook = sprite;
    this.animation = animation;
    this.speed = speed;
    this.sprite = sprites[sprite];
    this.floorGap = gap && FLOOR_GAPS.has(sprite);
    if (!this.sprite) throw new Error(`Unknown prop sprite '${sprite}'`);
    this.look = sprite;
    this.x = x * T;
    this.y = y * T;
    // Big furniture stands on several tiles, starting at its own and going right.
    this.width = (PROP_FOOTPRINTS[sprite] ?? 1) * T;
    this.height = T;
    this.text = text;
    this.npc = npc;
    this.shop = shop;
    // A scene id: once it has played, this NPC also lends a fishing rod (fishingScene.js).
    this.fishing = fishing;
    // A name for a cutscene actor to `plays`, for someone in the room who
    // isn't an NPC or a shop (Ves, hurt, in the stilt hut).
    this.cast = cast;
    // A lever up out of reach (the Dead City): only Ves, with her crutch, can
    // pull it (see OverworldScene.useLever).
    this.high = high;
    this.save = save;
    this.talkedTo = false;
    // A cutscene can hide a character while an actor plays them (see scenePlayer.js).
    this.hidden = false;
  }

  // Who this is, for cutscenes that cast a room's character: their NPC or
  // shop id, or their `cast` name.
  get character() {
    return this.npc ?? this.shop ?? this.cast;
  }

  // A switch shows its NAME_on sprite while it's on, if it has one.
  setOn(on) {
    this.on = on;
    const look = on && sprites[`${this.baseLook}_on`] ? `${this.baseLook}_on` : this.baseLook;
    this.sprite = sprites[look];
    this.look = look;
  }

  // Its item has been taken: no more giving, and on to its `taken` look.
  markTaken() {
    this.gives = null;
    this.gold = 0;
    if (this.takenLook?.sprite && sprites[this.takenLook.sprite]) {
      this.sprite = sprites[this.takenLook.sprite];
      this.look = this.takenLook.sprite;
    }
    if (this.takenLook?.text) this.text = this.takenLook.text;
    // Something picked up and carried off (a mitten in the leaves), not
    // something emptied: `taken: { gone: true }` and it's no longer there.
    if (this.takenLook?.gone) this.hidden = true;
  }

  // Shows another of its sprites for a while (a bed with you in it, say), or
  // its own again with no name. Only sprites that exist.
  setLook(name = null) {
    const look = name && sprites[name] ? name : this.baseLook;
    this.sprite = sprites[look];
    this.look = look;
  }

  moveToTile(tx, ty) {
    this.x = tx * T;
    this.y = ty * T;
  }

  // A current is flat water on the floor: under everyone, even someone
  // standing in it (and under a cask riding it). So is a log or a rock sunk
  // in the water as a stepping-stone: you stand up on top of it. And a `gap`
  // lying on the floor (rotten planks, a grate) that someone small walks
  // across: they're on it, not behind it.
  get sortY() {
    // (A grating or planks lying over a current go over its water, not under it.)
    if (this.floorGap) return this.y - 1e6 + 0.5;
    if (this.flat) return this.y - 1e6 + 0.25;
    // (A gate draws over whatever it's sealing, on the same tile.)
    return this.flow || this.sunk ? this.y - 1e6 : this.y + this.height + (this.opensWith ? 0.5 : 0);
  }

  overlaps(left, top, right, bottom) {
    if (this.hidden || this.isOpen) return false;
    return left < this.x + this.width && right > this.x && top < this.y + this.height && bottom > this.y;
  }

  // Whether it stands in the way of something in that box.
  blocks(left, top, right, bottom) {
    if (!this.walkable) return this.overlaps(left, top, right, bottom);
    if (!this.solidSides || !this.overlaps(left, top, right, bottom)) return false;
    return left < this.x + this.solidSides || right > this.x + this.width - this.solidSides;
  }

  // Its shadow in the sun (see shadows.js): not for things lying flat on the
  // floor, or the floating save crystal (it has its own glow).
  shadow() {
    if (this.hidden || this.isOpen || this.walkable || this.save) return null;
    const frame = (this.animation && animationFrame(this.animation, performance.now() / 1000, this.speed)) || this.sprite;
    return { image: frame, x: this.x + this.width / 2, y: this.y + T - (this.raise ?? 0) };
  }

  draw(ctx, camera) {
    if (this.hidden || this.isOpen) return;
    const seconds = performance.now() / 1000;
    let frame = (this.animation && animationFrame(this.animation, seconds, this.speed)) || this.sprite;
    // Folk on the move: the still front (or back) view, hopping along, unless
    // their walk keeps its animation (the sweeper sweeps as she goes).
    const walk = this.walk;
    let flipped = false;
    let bob = 0;
    if (walk) {
      flipped = walk.dir === 'left' && this.stroll?.flip !== false;
      if (walk.moving) {
        const back = walk.dir === 'up' && sprites[`${this.baseLook}_back`];
        if (!this.stroll?.keepAnim) frame = back || this.sprite;
        bob = Math.round(Math.abs(Math.sin(seconds * (this.stroll?.hop ? 8 : 9) + this.x * 0.3)) * (this.stroll?.hop ? 3 : 1));
      }
    }
    const isCharacter = (this.npc || this.shop) && frame === this.sprite && !walk?.moving;
    // Save points float smoothly and glow.
    if (this.save) bob = Math.round(Math.sin(seconds * 2.5) * 2);
    // A crate afloat on the tide rocks a pixel up and down.
    if (this.floating && !this.slide) bob = Math.round(Math.sin(seconds * 2 + this.x * 0.15));
    // Starlight on the leaves (the way to the Starfall Glade): a soft blue
    // glow round it, slowly breathing, so it catches your eye in the dark wood.
    if (this.look === 'star_glint') {
      const gx = this.x + this.width / 2 - camera.x;
      const gy = this.y + T / 2 - camera.y;
      const pulse = 0.3 + 0.15 * Math.sin(seconds * 2.2);
      const halo = ctx.createRadialGradient(gx, gy, 1, gx, gy, 18);
      halo.addColorStop(0, `rgba(154, 216, 255, ${pulse.toFixed(3)})`);
      halo.addColorStop(1, 'rgba(154, 216, 255, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(gx - 18, gy - 18, 36, 36);
    }

    // A struck crystal: a soft halo that fades. A wrong one shivers.
    if (this.ringing > 0) {
      const gx = this.x + this.width / 2 - camera.x;
      const gy = this.y + T / 2 - camera.y - frame.height / 3;
      const halo = ctx.createRadialGradient(gx, gy, 1, gx, gy, 22);
      halo.addColorStop(0, `rgba(230, 250, 255, ${(this.ringing * 0.7).toFixed(3)})`);
      halo.addColorStop(1, 'rgba(230, 250, 255, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(gx - 22, gy - 22, 44, 44);
    }
    const shiver = this.shake > 0 ? Math.round(Math.sin(this.shake * 90) * 1.5) : 0;
    const x = this.x + Math.floor((this.width - frame.width) / 2) - camera.x + shiver;
    // Standing on a raised block (`raise`, set by the room): drawn on top of it.
    const y = this.y + T - (this.raise ?? 0) - frame.height - bob - camera.y;
    if (this.save) {
      const cx = x + this.sprite.width / 2;
      const cy = y + 6;
      const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, 14);
      glow.addColorStop(0, `rgba(255, 210, 120, ${(0.45 + 0.15 * Math.sin(seconds * 3)).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(255, 210, 120, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - 14, cy - 14, 28, 28);
    }
    if (this.npc || this.shop) drawFootShadow(ctx, this.x + Math.floor(this.width / 2) - camera.x, this.y + T - (this.raise ?? 0) - camera.y);
    // Breathing: their shoulders and head rise a pixel and settle, feet
    // planted, each on their own time (from where they stand). The top is
    // drawn a pixel higher, and the row at the waist fills the gap.
    // Walking left: the same figure the other way round.
    if (this.pulse === 'beat') {
      this.drawPulsing(ctx, frame, x, y, seconds);
      if (this.notice && !this.noticed) this.drawNotice(ctx, x + frame.width / 2, y - 3, seconds);
      return;
    }
    if (flipped) {
      ctx.save();
      ctx.translate(2 * x + frame.width, 0);
      ctx.scale(-1, 1);
    }
    if (isCharacter && Math.floor(seconds / BOB_SECONDS + this.x / 37) % 4 < 2) {
      const { width: w, height: h } = frame;
      const waist = Math.floor(h * 0.6);
      ctx.drawImage(frame, 0, waist, w, h - waist, x, y + waist, w, h - waist);
      ctx.drawImage(frame, 0, waist - 1, w, 1, x, y + waist - 1, w, 1);
      ctx.drawImage(frame, 0, 0, w, waist, x, y - 1, w, waist);
    } else {
      ctx.drawImage(frame, x, y);
    }
    if (flipped) ctx.restore();
    if (this.emote > 0) this.drawNotice(ctx, x + frame.width / 2, y - 3, seconds);
    if (this.notice && !this.noticed) this.drawNotice(ctx, x + frame.width / 2, y - 3, seconds);
  }

  // Swelling with the song: stretched up a pixel (two for a tall one) and
  // lit a little more on the beat, plus a ring of pixels spreading from its
  // foot on the first beat of a bar. Drawn at whole pixels, so it stays crisp.
  drawPulsing(ctx, frame, x, y, seconds) {
    const { env, down } = beatPulse(seconds);
    const grow = Math.round(env * (frame.height >= 24 ? 2 : 1));
    ctx.drawImage(frame, x, y - grow, frame.width, frame.height + grow);
    if (env > 0.04) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.4 * env;
      ctx.drawImage(frame, x, y - grow, frame.width, frame.height + grow);
      ctx.restore();
    }
    if (down > 0.05) {
      // Wide and flat, round the foot: a pixel every so often on an ellipse.
      const cx = x + frame.width / 2;
      const cy = y + frame.height - 1;
      const reach = 6 + (1 - down) * 16;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(200, 240, 255, ${(0.55 * down).toFixed(3)})`;
      for (let a = 0; a < 20; a++) {
        const t = (a / 20) * Math.PI * 2;
        ctx.fillRect(Math.round(cx + Math.cos(t) * reach), Math.round(cy + Math.sin(t) * reach * 0.4), 1, 1);
      }
      ctx.restore();
    }
  }

  // A yellow "!" with a dark edge, bobbing above it.
  drawNotice(ctx, cx, bottom, seconds) {
    const left = Math.round(cx) - 1;
    const top = Math.round(bottom - 9 - Math.abs(Math.sin(seconds * 4)) * 3);
    ctx.fillStyle = '#120c1c';
    ctx.fillRect(left - 1, top - 1, 4, 7);
    ctx.fillRect(left - 1, top + 6, 4, 4);
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(left, top, 2, 5);
    ctx.fillRect(left, top + 7, 2, 2);
  }
}
