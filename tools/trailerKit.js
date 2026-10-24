// The trailer machine, shared by tools/trailer.html (chapters 1 and 2) and
// tools/trailer3.html (chapter 3): live scenes from the game, cut on the
// beat of a song, with text on black, the game's own text box, and a title
// card; played live, or exported frame by frame as a 4K video.
//
// Each trailer page calls runTrailer() with:
//   bpm        the song's tempo (one bar of 4/4 at that tempo is the unit
//              every `from`/`to` below is written in; 20.5 is half way
//              through bar 20)
//   song       the song (from src/data/music/index.js)
//   end        the bar it ends on
//   text       the words (see TEXT in trailer.html)
//   shots      the shots (see SHOTS in trailer.html)
//   hits       bars with a big hit: a white flash and a shake
//   flashes    [from, to]: every cut in those bars gets a small flash too
//   title      the title card: { at, name, sub, subAt, to } in bars
//   filename   the exported video's name
//   day        the time of day (0 sunrise, 0.25 noon, 0.5 sunset) for any
//              overworld shot that doesn't set its own; without it those
//              shots take whatever hour the game's clock has drifted to
//   setup()    anything the world needs to know first (flags, gear)
//
// Overworld shots play the game's own cutscenes (`scene`), or are little
// cutscenes of their own, scripted with the same steps the game's scenes use (walk, face, animate, camera, toss, weather... see
// STEP_TYPES in src/overworld/scenePlayer.js), so the hero goes exactly
// where he's told. Battle shots pick the enemy's busiest attack by trying
// them all and counting bullets, unless one is named.
//
// For checking without sound: ?at=41 draws the moment 41 seconds in and stops.
// ?seconds=5 makes Export video do only the first 5 seconds.
import { UI_WIDTH, UI_HEIGHT, UI_SCALE } from '../src/config.js';
import { loadTextFiles } from '../src/engine/textLoader.js';
import { loadUiFont, layoutDialogue, drawDialogue } from '../src/ui/text.js';
import { TEXT_FILES } from '../src/data/textManifest.js';
import { OverworldScene } from '../src/overworld/overworldScene.js';
import { ScenePlayer } from '../src/overworld/scenePlayer.js';
import { GeyserRide } from '../src/overworld/windGeyser.js';
import { ROOMS } from '../src/data/rooms/index.js';
import { SCENES } from '../src/data/scenes/index.js';
import { BattleScene } from '../src/battle/battleScene.js';
import { ENEMIES } from '../src/data/enemies/index.js';
import { SPELLS } from '../src/data/spells.js';
import { joinParty, leaveParty, inParty, MEMBERS as PARTY_MEMBERS } from '../src/characters/party.js';
import { WORLD_STATE } from '../src/state/saveGame.js';
import { HERO_STATE } from '../src/characters/heroState.js';
import { ShopScene } from '../src/shop/shopScene.js';
import { DAY_SECONDS } from '../src/overworld/daylight.js';
import { BOX } from '../src/battle/hud.js';
import { music, renderSong } from '../src/audio/music.js';

// Everyone who can follow the hero: a shot's `party` names who does.
const MEMBERS = ['vesper', 'bramble'];

export async function runTrailer(config) {
  const { text: TEXT, shots: SHOTS, hits: HITS, end: END, song, title: CARD, filename } = config;
  const BAR = (60 / config.bpm) * 4;
  const [flashFrom, flashTo] = config.flashes ?? [0, 0];

  const out = document.getElementById('trailer');
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const frame = document.createElement('canvas');
  frame.width = UI_WIDTH;
  frame.height = UI_HEIGHT;
  const fctx = frame.getContext('2d');
  fctx.imageSmoothingEnabled = false;
  const params = new URLSearchParams(location.search);
  const status = document.getElementById('status');

  await Promise.all([loadUiFont(), loadTextFiles(TEXT_FILES), document.fonts.load("400 100px 'VT323'")]);

  // The scenes would start their own music and sound effects: only the
  // trailer's song plays (and the text box's typing blip).
  const typeBlip = music.sfx.bind(music);
  music.play = () => {};
  // And no room's wind or fire either (they'd carry on after the trailer ends).
  music.setAmbience = () => {};
  music.sfx = () => {};
  config.setup?.();

  // The game's animations keep time by the browser's clock. The trailer
  // keeps its own instead, moved on by exactly what each shot is given, so
  // a still, a live play and an export all see every animation at the same
  // frame. Each shot is built (and its first moments stamped) when the page
  // loads, so when a shot comes on screen the clock goes back to what it
  // read when that shot was built, and runs on from there.
  const realNow = performance.now.bind(performance);
  let trailerClock = 0;
  performance.now = () => trailerClock;

  // Pretend controllers.
  const still = { isDown: () => false, wasPressed: () => false, endFrame() {} };
  // The soul dodging: each frame, of the nine ways it could move, the one that
  // keeps it furthest from every bullet over the next moment (where each is
  // heading), with a gentle pull back toward the middle of the box so it
  // isn't cornered.
  const WAYS = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  // When nothing's close it doesn't sit still: it wanders round the box in
  // a slow loop, the way a player grazing for SP does, and only breaks off
  // to get out of the way.
  function dodging(battle) {
    let way = [0, 0];
    return {
      think() {
        const { soul, bullets } = battle;
        const live = bullets.filter((b) => !b.snuffs);
        const angle = battle.time * 1.7;
        const wander = [Math.cos(angle), Math.sin(angle)];
        let best = -Infinity;
        for (const [dx, dy] of WAYS) {
          let score = Infinity;
          for (const step of [7, 14]) {
            const x = soul.x + dx * step, y = soul.y + dy * step;
            if (x < BOX.x + 4 || x > BOX.x + BOX.w - 4 || y < BOX.y + 4 || y > BOX.y + BOX.h - 4) { score = -10; break; }
            const ahead = step / 80;
            for (const b of live) score = Math.min(score, b.edgeDistance(x - (b.vx ?? 0) * ahead, y - (b.vy ?? 0) * ahead));
          }
          const centre = Math.hypot(soul.x + dx * 14 - (BOX.x + BOX.w / 2), soul.y + dy * 14 - (BOX.y + BOX.h / 2));
          const safe = Math.min(score, 26);
          const along = (dx * wander[0] + dy * wander[1]) / (Math.hypot(dx, dy) || 1);
          score = safe - centre * 0.04 + (safe > 16 ? 3 * along : 0) - (dx === 0 && dy === 0 ? 0.6 : 0);
          if (score > best) { best = score; way = [dx, dy]; }
        }
      },
      isDown(action) {
        const [dx, dy] = way;
        return (action === 'right' && dx > 0) || (action === 'left' && dx < 0) || (action === 'down' && dy > 0) || (action === 'up' && dy < 0);
      },
    };
  }
  // Playing a turn: on the strike bar, presses as each slash crosses the notch
  // (a PERFECT every time); reads through any words; then dodges when the
  // enemy attacks.
  // How close a bullet gets (pixels) before each SHIFT ability is used.
  const ABILITY_REACH = { block: 11, reflect: 17, lunge: 9, parry: 9, quake: 12, phase: 9 };
  // `pause` is how long each message stays up before it's read on.
  function playing(battle, pause = 0.45) {
    const dodge = dodging(battle);
    const NOTCH_X = 190; // where the bar's notch is, in UI pixels (strikeBar.js)
    const pressed = new WeakSet();
    let sinceConfirm = 0;
    let useAbility = false;
    return {
      tick(dt) {
        sinceConfirm += dt;
        if (battle.phase !== 'dodge') return;
        dodge.think();
        const reach = ABILITY_REACH[battle.weapon?.ability];
        if (reach && battle.abilityCooldown <= 0) {
          const { soul } = battle;
          const nearest = Math.min(Infinity, ...battle.bullets.filter((b) => !b.snuffs).map((b) => b.edgeDistance(soul.x, soul.y)));
          if (nearest < reach) useAbility = true;
        }
      },
      isDown: (action) => battle.phase === 'dodge' && dodge.isDown(action),
      wasPressed(action) {
        if (action === 'ability') { const use = useAbility; useAbility = false; return use; }
        if (action !== 'confirm') return false;
        if (battle.phase === 'fight' && battle.strike) {
          const next = battle.strike.slashes.find((slash) => slash.state === 'sliding');
          if (next && next.x <= NOTCH_X + 2 && !pressed.has(next)) { pressed.add(next); return true; }
          return false;
        }
        if (battle.phase === 'dodge' || battle.phase === 'fightResult') return false;
        if (sinceConfirm < pause) return false;
        sinceConfirm = 0;
        return true;
      },
      endFrame() {},
    };
  }

  // The real controls: `moves`, one after another (see `keys` in trailer.html).
  const SWING_HEIGHT = 0.9; // how high to pump a rope swing (climbing.js: 0.35 to 1.55)
  const SWING_STAY = 1.1;   // at least this long on each ring (a swing there and back) before flinging on
  function keyed(scene, moves) {
    let t = 0, index = -1, pressed = new Set();
    const begin = (i) => { index = i; t = 0; pressed = new Set(moves[i]?.press ?? []); };
    begin(0);
    return {
      tick(dt) {
        t += dt;
        const move = moves[index];
        if (!move) return;
        const done = move.until ? move.until(scene.player, scene) : t >= (move.seconds ?? Infinity);
        if (done) begin(index + 1);
      },
      isDown(action) {
        const move = moves[index];
        if (move?.swing && scene.climb?.state.name === 'hang') {
          // Pumping: hold the way the swing is going, up to a middling swing
          // (any higher and the next ring but one is in reach: no zig-zag).
          if (scene.climb.state.swing >= SWING_HEIGHT) return false;
          const moving = Math.sign(Math.cos(scene.climb.state.phase));
          return (action === 'right' && moving > 0) || (action === 'left' && moving < 0);
        }
        return (move?.hold ?? []).includes(action);
      },
      wasPressed(action) {
        const move = moves[index];
        if (move?.swing && action === 'confirm' && scene.climb?.state.name === 'hang') {
          const climb = scene.climb;
          // A proper swing on each ring first (pumped up, and a swing there
          // and back), then at the right moment.
          if (climb.state !== move.hanging) { move.hanging = climb.state; move.hungAt = t; }
          if (climb.state.swing < SWING_HEIGHT - 0.05 || t - move.hungAt < SWING_STAY) return false;
          const best = climb.target();
          return Boolean(best && best.off < climb.grabWindow * 0.5);
        }
        return pressed.delete(action);
      },
      endFrame() {},
    };
  }

  // Who's with the hero in a shot: its `party` (or `ves: true`, for Ves alone).
  const partyOf = (spec) => spec.party ?? (spec.ves ? ['vesper'] : []);
  function setParty(ids) {
    for (const id of MEMBERS) {
      if (ids.includes(id) && !inParty(id)) joinParty(id);
      if (!ids.includes(id) && inParty(id)) leaveParty(id);
    }
  }
  const dayClock = (day) => (((day - 0.08) % 1 + 1) % 1) * DAY_SECONDS;
  const game = { changeScene() {}, home: null };
  const run = (scene, seconds, input = still) => { for (let t = 0; t < seconds; t += 1 / 60) scene.update(1 / 60, input); };

  // --- An overworld shot: the room, settled, with its little cutscene running. ---
  function buildRoom(spec) {
    const data = ROOMS[spec.room];
    if (!data) throw new Error(`No room '${spec.room}'`);
    const clock = () => { const day = spec.day ?? config.day; if (day != null) WORLD_STATE.playSeconds = dayClock(day); };
    clock();
    const scene = new OverworldScene(data, spec.at ?? data.playerStart, data.area);
    scene.enter?.(game);
    // The room's own cutscenes don't start by themselves here.
    scene.checkCutscenes = () => {};
    // The monsters are there to be seen, but none starts a fight; and none
    // wanders onto the hero (with no fight to stop it, it would walk right
    // over him): within a couple of tiles of him, it stays where it is.
    for (const npc of scene.npcs) {
      npc.touches = () => false;
      npc.reach = 0;
      const update = npc.update.bind(npc);
      npc.update = (dt, player, room) => { if (Math.hypot(npc.x - player.x, npc.y - player.y) > 40) update(dt, player, room); };
    }
    if (spec.facing) scene.player.facing = spec.facing;
    // `take`: the thing that plays that scene when it's taken (the sword in
    // the stone) is already gone from where it was.
    const taken = spec.take && scene.room.props.find((prop) => prop.drawScene === spec.take);
    if (taken) { WORLD_STATE.taken ??= []; WORLD_STATE.taken.push(taken.key); taken.markTaken(); }
    run(scene, 2.5);
    if (spec.facing) scene.player.facing = spec.facing;
    const input = spec.keys ? keyed(scene, spec.keys) : still;
    if (spec.script) scene.cutscene = new ScenePlayer({ id: `trailer_${spec.from}`, actors: spec.actors ?? [], steps: spec.script }, scene);
    if (spec.ride) {
      if (!scene.geysers.length) throw new Error(`${spec.room} has no wind geyser to ride`);
      scene.ride = new GeyserRide({ geyser: scene.geysers[0], from: { x: scene.player.x, y: scene.player.y } });
    }
    let t = 0;
    const vision = spec.vision && { ...spec.vision, fade: spec.vision.fade ?? 0 };
    return {
      update(dt) {
        clock();
        t += dt;
        // The dream pictures keep time by the clock on the wall, so they're
        // told the shot started `t` seconds ago.
        if (vision) {
          const now = performance.now() / 1000;
          scene.vision = { ...vision, start: now - t, moodStart: now - t };
        }
        input.tick?.(dt);
        scene.update(dt, input);
        scene.battleFlash = null;
      },
      draw: (c) => scene.draw(c),
      debug: () => `${spec.room}: clock ${(trailerClock / 1000).toFixed(2)} anim ${JSON.stringify(scene.player.sceneAnimation)} step ${scene.cutscene?.index}`,
    };
  }

  // --- One of the game's own cutscenes (src/data/scenes/), played in its
  // room from its trigger, with a reader pressing on through its words at a
  // reading pace: a page, a moment to take it in, the next. ---
  function buildScene(spec) {
    const data = SCENES[spec.scene];
    if (!data) throw new Error(`No scene '${spec.scene}'`);
    const roomData = ROOMS[data.room];
    const trigger = (roomData.cutscenes ?? []).find((c) => c.scene === spec.scene);
    const at = spec.at ?? (trigger ? { x: trigger.x, y: trigger.y + Math.floor((trigger.h ?? 1) / 2) } : roomData.playerStart);
    const clock = () => { const day = spec.day ?? config.day; if (day != null) WORLD_STATE.playSeconds = dayClock(day); };
    clock();
    const scene = new OverworldScene(roomData, at, roomData.area);
    scene.enter?.(game);
    scene.checkCutscenes = () => {};
    for (const npc of scene.npcs) { npc.touches = () => false; npc.reach = 0; }
    if (spec.facing) scene.player.facing = spec.facing;
    run(scene, 1);
    // A scene that something plays when it's taken (the sword in the stone)
    // is taken the game's own way, so the stone shows it gone.
    const held = scene.room.props.find((prop) => prop.drawScene === spec.scene);
    if (held) scene.drawFromStone(held);
    else scene.playCutscene(data);
    // `stopAt`: the scene freezes when it reaches that step (the sword held
    // high, before the words about it).
    if (spec.stopAt != null) {
      const cutscene = scene.cutscene;
      const update = cutscene.update.bind(cutscene);
      cutscene.update = (dt, input) => { if (cutscene.index < spec.stopAt) update(dt, input); };
    }
    // Every page shows whole the moment it opens (no half-typed line at a
    // cut), stays up `pause` seconds to be read, and then the next.
    const box = scene.textbox;
    let page = null, settled = 0;
    const reader = {
      tick(dt) {
        if (!box.isOpen) { page = null; settled = 0; return; }
        const current = box.pages[box.pageIndex];
        if (current !== page) { page = current; settled = 0; }
        box.visibleCharacters = current.text.length;
        settled += dt;
      },
      isDown: () => false,
      wasPressed(action) {
        if (action !== 'confirm' || !box.isOpen || settled < (spec.pause ?? 1.2)) return false;
        settled = 0;
        return true;
      },
      endFrame() {},
    };
    return {
      update(dt) {
        clock();
        reader.tick(dt);
        scene.update(dt, reader);
        scene.battleFlash = null;
      },
      draw: (c) => scene.draw(c),
      // For the still's report: where the cutscene has got to.
      debug: () => `clock ${(trailerClock / 1000).toFixed(2)} ` + (scene.cutscene ? `${spec.scene}: step ${scene.cutscene.index} (${scene.cutscene.step?.do}, ${(scene.cutscene.step?.t ?? 0).toFixed(1)}s in, box ${box.isOpen ? 'open' : 'shut'})` : `${spec.scene}: finished`),
    };
  }

  // --- A battle shot. ---
  // Every attack an enemy (in a boss phase) has, tried for a few seconds each:
  // the one that fills the box with the most bullets.
  const busiestCache = new Map();
  function busiestPattern(spec) {
    const key = `${spec.battle}:${spec.stage ?? 0}`;
    if (busiestCache.has(key)) return busiestCache.get(key);
    const enemy = ENEMIES[spec.battle];
    const probe = new BattleScene([enemy], () => {}, 'ruins');
    const probed = probe.phased ?? probe.foes[0];
    for (let i = 1; i <= (spec.stage ?? 0); i++) probe.enterPhase(probed, i);
    let best = null;
    let most = -1;
    for (const { name } of probe.bossPhase(probed)?.patterns ?? enemy.patterns) {
      const battle = new BattleScene([enemy], () => {}, 'ruins');
      const foe = battle.phased ?? battle.foes[0];
      for (let i = 1; i <= (spec.stage ?? 0); i++) battle.enterPhase(foe, i);
      battle.hurt = () => {};
      battle.attackers = [foe];
      battle.pickPattern = () => name;
      battle.phase = 'dodge';
      battle.phaseTime = 0;
      battle.startAttack();
      battle.turnLength = Infinity;
      let peak = 0;
      // Counted over the stretch of the attack the shot will show.
      for (let t = 0; t < 4.5; t += 1 / 60) {
        battle.update(1 / 60, still);
        if (t > 1.5) peak = Math.max(peak, battle.bullets.length);
      }
      if (peak > most) { most = peak; best = name; }
    }
    busiestCache.set(key, best);
    return best;
  }

  function buildBattle(spec) {
    const enemy = ENEMIES[spec.battle];
    if (!enemy) throw new Error(`No enemy '${spec.battle}'`);
    HERO_STATE.weapon = spec.weapon ?? config.weapon ?? 'worn_sword';
    const battle = new BattleScene([enemy], () => {}, spec.area ?? enemy.area ?? 'ruins');
    const foe = battle.phased ?? battle.foes[0];
    for (let i = 1; i <= (spec.stage ?? 0); i++) battle.enterPhase(foe, i);
    if (battle.flame && spec.stage > 1) battle.flame.stage = battle.flame.stages;
    // Hits land for real (the flinch, the number, the shake), but nobody goes
    // down: anyone getting low is quietly topped up.
    const hurt = battle.hurt.bind(battle);
    battle.hurt = (bullet) => {
      hurt(bullet);
      for (const member of battle.party) if (member.hp < member.maxHp * 0.3) member.hp = member.maxHp;
    };
    const pattern = spec.pattern ?? busiestPattern(spec);
    battle.pickPattern = () => pattern;
    const input = playing(battle, spec.pause);
    if (spec.fight) {
      // His turn: FIGHT, the slashes, the hit, their words, then their attack.
      battle.actor = battle.hero;
      battle.target = foe;
      battle.setPhase('fight');
      for (let t = 0; t < 1.2; t += 1 / 60) { input.tick(1 / 60); battle.update(1 / 60, input); }
    } else if (spec.spell) {
      // His turn: he casts that spell (src/data/spells.js) at them: the
      // words, the spell's light, the hit; then their attack.
      if (!SPELLS[spec.spell]) throw new Error(`No spell '${spec.spell}'`);
      battle.actor = battle.hero;
      battle.target = foe;
      battle.sp = 100;
      battle.castSpell({ id: spec.spell, ...SPELLS[spec.spell] }, foe);
    } else if (spec.ally) {
      // A friend's turn: `{ who, act }`, one of their moves by its label
      // (src/characters/party.js), the way the preview page plays them.
      const member = PARTY_MEMBERS[spec.ally.who];
      const command = [...member.commands, ...Object.values(member.learnable ?? {}), ...(member.hurt?.commands ?? [])].find((c) => c.label === spec.ally.act);
      if (!command) throw new Error(`${spec.ally.who} has no move '${spec.ally.act}'`);
      battle.sp = 100;
      battle.setPhase('command');
      battle.ally = battle.pendingAllies.shift() ?? battle.party.find((m) => m.id === spec.ally.who);
      battle.setPhase('ally');
      battle.target = foe;
      battle.actor = battle.ally;
      battle.allyAct(battle.ally, command);
    } else {
      battle.attackers = [foe];
      battle.phase = 'dodge';
      battle.phaseTime = 0;
      battle.startAttack();
      // Never let the turn end while we're watching.
      battle.turnLength = Infinity;
      // Well into the attack, so the box is full of bullets when we cut to it.
      for (let t = 0; t < 2.4; t += 1 / 60) { input.tick(1 / 60); battle.update(1 / 60, input); }
    }
    return {
      update(dt) { input.tick(dt); battle.update(dt, input); },
      draw: (c) => battle.draw(c),
    };
  }

  // --- A shop shot: the keeper's greeting, and Z pressed at the given seconds. ---
  function buildShop(spec) {
    const shop = new ShopScene(spec.shop, () => {});
    shop.enter(game);
    let t = 0;
    const presses = [...(spec.presses ?? [])];
    const input = {
      isDown: () => false,
      wasPressed(action) {
        if (action !== 'confirm' || !presses.length || t < presses[0]) return false;
        presses.shift();
        return true;
      },
      endFrame() {},
    };
    return {
      update(dt) { t += dt; shop.update(dt, input); },
      draw: (c) => shop.draw(c),
    };
  }

  function build(spec) {
    setParty(partyOf(spec));
    let scene;
    if (spec.scene) scene = buildScene(spec);
    else if (spec.room) scene = buildRoom(spec);
    else if (spec.battle) scene = buildBattle(spec);
    else if (spec.shop) scene = buildShop(spec);
    else return { update() {}, draw: null };
    // The game checks who's in the party as it goes (a whirlwind takes Ves's
    // umbrella), so each shot keeps its own party while it plays.
    // (A game cutscene can change the party itself: Bramble joining.)
    const update = scene.update;
    scene.update = (dt) => {
      if (scene.clockAt != null && !scene.entered) { trailerClock = scene.clockAt; scene.entered = true; }
      trailerClock += dt * 1000;
      if (!spec.scene) setParty(partyOf(spec));
      update(dt);
    };
    // Part of it has already happened when we cut to it.
    for (let t = 0; t < (spec.pre ?? 0); t += 1 / 60) scene.update(1 / 60);
    scene.clockAt = trailerClock;
    return scene;
  }

  status.textContent = 'Getting the shots ready...';
  const built = SHOTS.map((spec, i) => {
    const to = SHOTS[i + 1]?.from ?? END;
    try {
      return { ...spec, to, scene: build(spec) };
    } catch (error) {
      console.error(`Shot ${i} (bar ${spec.from}) failed:`, error);
      status.textContent = `Shot at bar ${spec.from} failed: ${error.message}`;
      return { ...spec, to, scene: { update() {}, draw: null } };
    }
  });
  setParty([]);
  if (!status.textContent.includes('failed')) status.textContent = '';

  // --- Drawing. ---
  // Everything is laid out in 1920x1080 and drawn at twice that, in 4K. The
  // game's picture is 8 screen pixels to each of its pixels: crisp in 4K, and
  // still exactly 4 to 1 when it's shown at 1080p (filling the height would be
  // 9, and 4.5 at 1080p: blurry). So there are thin black bars above and below.
  const K = out.width / 1920;
  const base = (dx = 0, dy = 0) => ctx.setTransform(K, 0, 0, K, dx * K, dy * K);
  const GAME = { x: 320, y: 60, w: 1280, h: 960 };       // the game's 4:3 picture, in the 16:9 frame

  function drawShot(shot) {
    const { scene } = shot;
    if (!scene.draw) return;
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.fillStyle = '#000';
    fctx.fillRect(0, 0, UI_WIDTH, UI_HEIGHT);
    fctx.setTransform(UI_SCALE, 0, 0, UI_SCALE, 0, 0);
    scene.draw(fctx);
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    // Whole pixels only: no zooming, which would stretch some pixels more than others.
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame, GAME.x, GAME.y, GAME.w, GAME.h);
    if (shot.dim) {
      ctx.fillStyle = `rgba(0,0,0,${shot.dim})`;
      ctx.fillRect(GAME.x, GAME.y, GAME.w, GAME.h);
    }
  }

  function vt(size) { ctx.font = `400 ${size}px 'VT323', monospace`; }

  // Typewriter text: how many characters are showing `seconds` after it starts.
  const typed = (text, seconds) => Math.min(text.length, Math.floor(seconds * 30));
  const blipped = new WeakMap();

  function drawText(item, bar) {
    const seconds = (bar - item.from) * BAR;
    const left = (item.to - bar) * BAR;
    const fade = Math.min(1, left / 0.25);
    ctx.globalAlpha = Math.max(0, fade);
    if (item.caption) {
      // Fades in, along the bottom, with a shadow so it reads over anything.
      ctx.globalAlpha = Math.max(0, Math.min(fade, seconds / 0.5));
      vt(62);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillText(item.caption, 960 + 4, 1000 + 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.caption, 960, 1000);
    } else if (item.line) {
      vt(72);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.line.slice(0, typed(item.line, seconds)), 960, 560);
    } else if (item.big) {
      vt(170);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.big, 960, 600);
    } else if (item.voice) {
      // The game's text box, drawn in its own 640x480 space and scaled up.
      const count = typed(item.voice, seconds);
      const before = blipped.get(item) ?? 0;
      if (count > before && params.get('at') == null && !exporting) {
        if (/\S/.test(item.voice[count - 1])) typeBlip('type');
        blipped.set(item, count);
      }
      const s = GAME.w / UI_WIDTH;
      const box = { x: 32, y: 318, w: 576, h: 146 };
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(GAME.x + box.x * s, GAME.y + box.y * s, box.w * s, box.h * s);
      ctx.fillStyle = '#000000';
      ctx.fillRect(GAME.x + (box.x + 4) * s, GAME.y + (box.y + 4) * s, (box.w - 8) * s, (box.h - 8) * s);
      ctx.save();
      ctx.translate(GAME.x, GAME.y);
      ctx.scale(s, s);
      const lines = layoutDialogue(ctx, item.voice, box.w - 52, 30);
      drawDialogue(ctx, lines, box.x + 26, box.y + 20 + 26, { size: 30, lineHeight: 34, visible: count });
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // Embers for the title card.
  const embers = Array.from({ length: 90 }, (_, i) => ({ x: (i * 211) % 1920, y: (i * 137) % 1080, speed: 30 + (i % 7) * 12, size: 6 + (i % 3) * 3, color: ['#ffcc66', '#e8743b', '#fff2c0'][i % 3] }));
  function drawTitle(bar) {
    const seconds = (bar - CARD.at) * BAR;
    for (const e of embers) {
      const y = (((e.y - seconds * e.speed) % 1080) + 1080) % 1080;
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(seconds * 3 + e.x);
      ctx.fillStyle = e.color;
      ctx.fillRect(Math.round(e.x / 6) * 6, Math.round(y / 6) * 6, e.size, e.size);
    }
    ctx.globalAlpha = Math.min(1, (CARD.to - bar) * BAR / 0.6);
    vt(250);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a3a10';
    ctx.fillText(CARD.name, 960 + 12, 580 + 12);
    ctx.fillStyle = '#ffcc66';
    ctx.fillText(CARD.name, 960, 580);
    if (bar > CARD.subAt) {
      ctx.globalAlpha *= Math.min(1, (bar - CARD.subAt) * BAR / 0.8);
      vt(64);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(CARD.sub, 960, 700);
    }
    ctx.globalAlpha = 1;
  }

  function hitStrength(bar) {
    let flash = 0, shake = 0;
    for (const at of HITS) {
      const since = (bar - at) * BAR;
      if (since >= 0 && since < 0.6) { flash = Math.max(flash, 1 - since / 0.35); shake = Math.max(shake, 28 * (1 - since / 0.6)); }
    }
    for (const shot of built) {
      if (shot.from < flashFrom || shot.from >= flashTo || HITS.includes(shot.from)) continue;
      const since = (bar - shot.from) * BAR;
      if (since >= 0 && since < 0.15) flash = Math.max(flash, 0.35 * (1 - since / 0.15));
    }
    return { flash: Math.max(0, flash), shake };
  }

  let exporting = false;
  function render(seconds, dt) {
    const bar = seconds / BAR;
    const shot = built.findLast((s) => s.from <= bar) ?? built[0];
    if (dt > 0) shot.scene.update(Math.min(dt, 1 / 20));
    const { flash, shake } = hitStrength(bar);
    base();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 1920, 1080);
    if (shake) base((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    if (shot.title) drawTitle(bar);
    else drawShot(shot);
    for (const item of TEXT) if (bar >= item.from && bar < item.to) drawText(item, bar);
    base();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flash})`;
      ctx.fillRect(0, 0, 1920, 1080);
    }
  }

  function blackScreen() {
    base();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 1920, 1080);
  }

  // The end: every sound stops, and a screen to watch it again.
  function finish(message = '') {
    music.playSong(null);
    blackScreen();
    document.body.classList.remove('playing');
    status.textContent = message;
    const again = document.createElement('div');
    again.id = 'start';
    again.innerHTML = '<h1>THE END</h1><div><button id="again">Watch again</button></div>';
    document.body.append(again);
    document.getElementById('again').onclick = () => location.reload();
  }

  // --- Playing it, live with the music. ---
  function play() {
    document.getElementById('start').remove();
    document.body.classList.add('playing');
    if (music.muted) music.toggleMute();
    music.playSong(song);
    let last = null;
    const tick = (now) => {
      const seconds = music.songTime ?? 0;
      const dt = last == null ? 0 : (now - last) / 1000;
      last = now;
      if (seconds / BAR >= END) { finish(); return; }
      render(seconds, music.songTime == null || seconds === 0 ? 0 : dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // --- Exporting it: every frame drawn one at a time, exactly 1/60 second
  // apart, and encoded (so nothing is ever dropped); the song rendered offline
  // alongside; the two put together in a .webm file. ---
  const FPS = 60;
  async function exportVideo() {
    document.getElementById('start').remove();
    exporting = true;
    const { Muxer, ArrayBufferTarget } = await import('https://cdn.jsdelivr.net/npm/webm-muxer@5.0.4/build/webm-muxer.mjs');
    // ?seconds=5 exports just the start, for checking.
    const seconds = params.has('seconds') ? Number(params.get('seconds')) : END * BAR;
    status.textContent = 'Rendering the music...';
    const rendered = await renderSong(song, seconds, 48000);

    // The best video codec this browser can encode at 4K60: AV1 or VP9 on the
    // graphics card if it can, else VP9 on the processor.
    const { width, height } = out;
    const tries = [
      { muxer: 'V_AV1', name: 'AV1', codec: 'av01.0.12M.08', hardwareAcceleration: 'prefer-hardware' },
      { muxer: 'V_VP9', name: 'VP9', codec: 'vp09.00.51.08', hardwareAcceleration: 'prefer-hardware' },
      { muxer: 'V_VP9', name: 'VP9', codec: 'vp09.00.51.08', hardwareAcceleration: 'no-preference' },
      { muxer: 'V_VP9', name: 'VP9', codec: 'vp09.00.41.08', hardwareAcceleration: 'no-preference' },
    ];
    let video = null;
    for (const option of tries) {
      const encoderConfig = { codec: option.codec, width, height, bitrate: 80_000_000, framerate: FPS, hardwareAcceleration: option.hardwareAcceleration, latencyMode: 'quality' };
      try {
        if ((await VideoEncoder.isConfigSupported(encoderConfig)).supported) { video = { ...option, config: encoderConfig }; break; }
      } catch { /* not this one */ }
    }
    if (!video) { exporting = false; finish("This browser can't encode 4K video. Try Chrome or Edge."); return; }

    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: { codec: video.muxer, width, height, frameRate: FPS },
      audio: { codec: 'A_OPUS', sampleRate: 48000, numberOfChannels: 2 },
    });
    let failed = null;
    const videoEncoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { failed = e; } });
    videoEncoder.configure(video.config);
    const audioEncoder = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: (e) => { failed = e; } });
    audioEncoder.configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 256_000 });

    // The song, in 20ms slices.
    const slice = 960;
    const left = rendered.getChannelData(0), right = rendered.getChannelData(1);
    for (let at = 0; at < rendered.length; at += slice) {
      const n = Math.min(slice, rendered.length - at);
      const data = new Float32Array(n * 2);
      data.set(left.subarray(at, at + n), 0);
      data.set(right.subarray(at, at + n), n);
      audioEncoder.encode(new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((at / 48000) * 1e6), data }));
    }

    // The pictures.
    const frames = Math.ceil(seconds * FPS);
    const began = realNow();
    for (let f = 0; f < frames && !failed; f++) {
      render(f / FPS, f === 0 ? 0 : 1 / FPS);
      const picture = new VideoFrame(out, { timestamp: Math.round((f / FPS) * 1e6), duration: Math.round(1e6 / FPS) });
      videoEncoder.encode(picture, { keyFrame: f % (FPS * 2) === 0 });
      picture.close();
      // Let the encoder catch up, and show how it's going.
      while (videoEncoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 1));
      if (f % 30 === 0) {
        const done = (f + 1) / frames;
        const eta = ((realNow() - began) / 1000) * (1 / done - 1);
        status.textContent = `Exporting (4K, ${video.name}): ${Math.floor(done * 100)}%, about ${Math.max(1, Math.ceil(eta / 60))} min left`;
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    if (!failed) {
      await videoEncoder.flush();
      await audioEncoder.flush();
    }
    exporting = false;
    if (failed) { finish(`Export failed: ${failed.message}`); return; }
    muxer.finalize();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([target.buffer], { type: 'video/webm' }));
    link.download = filename;
    link.click();
    window.exportDone = { bytes: target.buffer.byteLength, codec: video.name, frames };
    finish(`Saved ${filename} (check your Downloads).`);
  }

  // --- A strip, for checking motion: ?strip=<from>,<step>,<count> plays
  // the trailer through from two seconds before `from`, exactly as live
  // play does, and tiles one frame every `step` seconds. ---
  if (params.get('strip') != null) {
    document.getElementById('start').remove();
    const [from, step, count] = params.get('strip').split(',').map(Number);
    const strip = document.createElement('canvas');
    strip.width = out.width;
    strip.height = out.height;
    const sctx = strip.getContext('2d');
    sctx.fillStyle = '#222';
    sctx.fillRect(0, 0, strip.width, strip.height);
    const cols = 4, w = strip.width / cols, h = w * 9 / 16;
    let taken = 0, next = from;
    document.getElementById('report').textContent += `
start: clock ${trailerClock}`;
    for (let t = Math.max(0, from - 2); taken < count; t += 1 / 60) {
      render(t, t === Math.max(0, from - 2) ? 0 : 1 / 60);
      if (t >= next) {
        // &zoom=1: just the middle of the picture, where the camera keeps the hero.
        if (params.get('zoom')) sctx.drawImage(out, out.width / 2 - 200 * K, out.height / 2 - 150 * K, 400 * K, 300 * K, (taken % cols) * w, Math.floor(taken / cols) * h, w, h);
        else sctx.drawImage(out, (taken % cols) * w, Math.floor(taken / cols) * h, w, h);
        sctx.fillStyle = '#fff';
        sctx.font = `${Math.round(h / 8)}px monospace`;
        sctx.fillText(t.toFixed(2), (taken % cols) * w + 10, Math.floor(taken / cols) * h + h / 7);
        taken++;
        next += step;
        const shot = built.findLast((s) => s.from <= t / BAR) ?? built[0];
        document.getElementById('report').textContent += `
${t.toFixed(2)}: ${shot.scene.debug?.() ?? shot.from}`;
      }
    }
    base();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(strip, 0, 0);
    const report = document.getElementById('report');
    if (report) report.textContent += `\n${status.textContent}\nTRAILER STILL DONE`;
    return;
  }

  // --- A still, for checking: ?at=<seconds>. ---
  if (params.get('at') != null) {
    document.getElementById('start').remove();
    const at = Number(params.get('at'));
    const shot = built.findLast((s) => s.from <= at / BAR) ?? built[0];
    // Run the shot from its start up to this moment.
    const into = at - shot.from * BAR;
    for (let t = 0; t < into; t += 1 / 60) shot.scene.update(1 / 60);
    render(at, 0);
    document.title = 'TRAILER STILL DONE';
    // tools/headless.py waits for this in the page's report box.
    const report = document.getElementById('report');
    if (report) report.textContent += `\n${status.textContent}\n${shot.scene.debug?.() ?? ''}\nTRAILER STILL DONE`;
  } else {
    blackScreen();
    // Ready: the buttons work from here (they're greyed out while the shots get built).
    for (const [id, go] of [['play', play], ['export', exportVideo]]) {
      const button = document.getElementById(id);
      button.onclick = go;
      button.disabled = false;
    }
  }
}
