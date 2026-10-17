# Developer notes

Everything about how Nobody's Hero is put together and how to add to it. The
player-facing instructions (installing Python, starting the game) are in the
[README](../README.md). The Studio tools (room editor, sprite editor, music
maker...) are described in [tools/README.md](../tools/README.md).

The world is 320x240 pixel art drawn at double size on a 640x480 canvas, and
the UI is drawn at the full 640x480 so it's finer than the art. The UI font is
VT323 and enemy speech bubbles use Nunito, both loaded from Google Fonts;
offline, plain fonts stand in. There's no build step: `python tools/serve.py`
serves the game on http://localhost:8000 and the Studio at
http://localhost:8000/tools/.

## Controls (the long version)

| Key | Overworld | Battle |
| --- | --- | --- |
| Arrow keys / WASD | Move | Choose commands, steer your shadow |
| Z / Enter | Read signs, talk | Confirm, strike as slashes cross the notch |
| X | Hold to run, skip text | Back out of lists; hold to focus (slower shadow) |
| Shift | Hold to run, skip text | Back out of lists; use your weapon's shadow ability |
| C / Ctrl | Open the menu (ITEMS, EQUIP, SKILLS, status) | |
| M | Mute or unmute music and sound | Mute or unmute music and sound |
| Space | Jump | Jump, in a boss's HEAVY mode |

Each landing cracks the tile under you. Land on the same tile three times and it breaks, and you fall to your death.

## The intro and title screen

The game opens with a storybook intro about the prophecy, then the title screen. Press Z on the first screen to start (browsers need a key press before they'll play sound). Z skips the intro, and Z on the title screen starts the game, or continues from your last save.

- `text/cutscenes/intro.txt` holds the intro's words. Each `[section]` picks a picture, and each entry under it is a page of text that types out slowly beneath it. The comments at the top list the pictures.
- The pictures are painted in code in `src/data/art/cutscenes.js`; add a new one there and use its name as a section.
- `text/title.txt` holds the game's name and the title screen prompts.
- The music is "Once, a Promise" (`src/data/music/prophecyTheme.js`).

## Writing dialogue

NPCs with a face in `src/data/art/portraits.js` (keyed by their NPC id, like `old_keeper`) show it beside their dialogue, blinking now and then. Taper and the Keeper also have expressions (glee, mild_anger, angry, sad, crying, worried, surprised, exhausted, beaten, and a sly one for the Keeper): start a page with one in braces, like `{sad}I miss them.`, or give a cutscene's Say step a `face`. Taper's candle flame changes with her mood; the Keeper only shows his through his eyes.

Everything that's said in the game lives in plain text files in `text/`, so you can write without touching code:

```
text/
  README.txt              How the format works
  enemies/                One file per enemy: intro, flavour, taunts, TALK replies, endings
  interactions/           One file per area: signs and things you can inspect
  npcs/                   One file per NPC: what they say first, and after that
  items/                  Item and weapon descriptions
  shops/                  What each shopkeeper says, including TALK topics
  skills/                 Skill descriptions
```

See `text/README.txt` for the format. New files are picked up automatically when the server (re)starts.

## Battling

Walk into an enemy to start a battle. The Old Keeper in the west room has advice. Some enemies lie in wait behind pillars and statues: they jump out with a "!" when you come close, then chase you (you can outrun them).

| Enemy | Where | Attacks |
| --- | --- | --- |
| Rogue Dummy | Entrance, east room | A sewing basket: rows of pins, bouncing buttons, a needle stitching thread across the box, stuffing that bursts, practice targets that fire pins (the gentlest) |
| Dust Bunny | Entrance, east room (lower) | Dust sneezes, hopping baby bunnies, a broom sweeping a wall of lint, falling carrots, cobweb strands |
| Lantern Moth | Lantern Hall | Moths drawn to your light, lantern beams, a swinging lantern shedding sparks, cocoons that hatch, spirals of wing dust |
| Waxling | Lantern Hall | Wax drips that splash, candles that shoot up columns of flame, tossed matches, a creeping curtain of flames, curls of smoke |
| Shade | Lantern Hall | Eyes that open and stare beams, grasping hands, curving crescent blades, a cage of tendrils, wisps that follow then lose interest |

Every enemy has its own set of attacks (at least three, and the game refuses to start a fight otherwise), with bullets drawn as things from that enemy. They live in `src/battle/attacks/<enemy>.js`: each file draws its bullet art with `defineBulletArt` and exports its attacks, and the enemy's data file lists which ones it uses. `dummy.js` is the example to copy.

**Group battles:** enemies close to the one you touch (within about 4 tiles) join the fight, up to 3 at once. To keep it fair, at most two attack in a turn, each with fewer bullets, and the second starts a second later. With several enemies, FIGHT, TALK and the targeted spells first ask which enemy, showing each one's HP and MERCY. Beaten or pacified enemies leave mid-fight, and you win when they're all gone. Your party stands on the left, the enemy on the right, against an animated backdrop of the Ruins.

On your turn, pick a command:

- **FIGHT**: three slashes slide along a bar toward a notch on the left. Press Z as each one crosses it; the closer, the harder you hit, and PERFECT hits do bonus damage. Pressing when nothing is at the notch wastes the next slash, so mashing doesn't work.
- **TALK**: talk to an enemy. Most options raise its MERCY meter.
- **SPELLS**: spend SP (spell power) on magic.
  - Heal Pulse (32%) heals 35 HP.
  - Rend (40%) is a guaranteed 30 damage.
  - Pacify (16%) sends an enemy away peacefully, but only once its MERCY is full. The SPELLS button flashes when one is ready.
- **ITEMS**: eat something from your bag to heal. What you eat is gone for good.
- **DEFEND**: halves damage for the next enemy turn and builds SP.
- **RUN**: try to escape. It gets more likely the longer the fight goes on. The enemy stays in the room, but ignores you for a moment.

On the enemy's turn, a box opens in the middle of the screen and you steer your **shadow** to dodge:

- Each turn, the enemy picks a random attack, never the same one twice in a row. Each attack also randomises its own details, such as wind direction, spin direction, where gaps open, and how its emitters move.
- Only its chest can be hit.
- Standing still is never safe: every enemy's attacks are built to find a shadow that stops moving.
- **Grazing**: letting bullets pass close by lights up a larger outline around your shadow and fills **SP** (the purple gauge on the left). Each new bullet you graze gives a burst of SP and shortens the enemy's turn slightly; staying close keeps SP trickling in.

Each enemy has a `difficulty` in its data file: `density` scales how often bullets spawn and `speed` how fast they fly. The rogue dummy, the first enemy you meet, uses the gentlest settings. A boss can also have a `secondWind` (below that share of its HP it layers a lighter second attack on top of the first; Taper does this below a third) and an `introCard` (an entrance before the fight: the stage opens from black, a title card names it, and it says the lines in its text file's `[boss_intro]` section).

Beaten and pacified enemies stay gone, even after you leave the room and come back.

### Items, gold and the shop

You carry up to 8 items (`src/data/items.js`, descriptions in `text/items/items.txt`), and keep them between battles: look at them (or throw one away) under ITEMS in the C menu. Enemies sometimes drop a snack themed after them (`drops` in their data file), Moss sells food and weapons for gold (`src/data/shops.js`), and some things in the world give you an item the first time you press Z on them (the cake in Taper's kitchen).

### Candles and the dark

Enemies leave candle-making materials behind, spared or beaten: Wax (Waxlings), Thread (Rogue Dummy), Moonbell Petals (Dust Bunnies), Glow Dust (Lantern Moths) and Shadow Ash (Shades). They go in a pouch that doesn't use bag space. CANDLES in the C menu turns them into candles, which are items: in battle, lighting one heals, calms every enemy (MERCY), fills SP or guards you, depending on the candle. Recipes and materials are in `src/data/candles.js`; candles are in `src/data/items.js`.

Candles also light the dark. A room with `dark` (0 to 1, set under Darkness in the Room Editor) is drawn in darkness, except where light reaches: lantern pillars, candle stands, fires, save crystals, lit lantern posts, any prop with a `light` radius, and you. The brightest candle you carry lights by itself and burns down while you're in the dark; when it's gone the next one is lit, and with none left you have only your shadow's faint glow. Taper's candle never goes out. A prop with `seenInLight` can only be seen and used inside your light (writing on a wall, a hidden lever). No room in the Ruins is dark: this is for later areas.

### Puzzles

Any object can be a **switch** (a lantern to light, a lever to pull) and a **gate** opens when its switches are all on, optionally only if they're turned on in order (a wrong one resets them). The Lantern Hall's gate needs its lanterns lit in the right order (read the sign), and the last one stands on a stone dais you have to jump up to; the Pillar Room's needs two levers, one hidden behind a pillar and one on a high ledge.

**Jumping up.** Stone blocks (`b`, knee-high, and `B`, tall) stand up from the floor. Jump (Space) onto a low block and walk along the top; a tall block is out of reach from the floor, so you need a low one as a step. Walking off an edge drops you down. Anything placed on a block can only be reached from up there, and enemies can't climb them. The heights are `raise` in `src/overworld/tileset.js`; a jump reaches about 16 pixels (`JUMP_REACH` in `src/overworld/player.js`).

### The end of the Ruins

Down the stairs at the end of Taper's hallway is the way out. Taper won't let you leave without a fight. When she's done talking, the music cuts out, the room goes dark around the two of you and your shadow stands up out of you, then the battle begins. She's the Ruins' boss: you can't run, she makes a grand entrance, her attacks are busy, and when she's low she adds a second one. They ease off as you spare her (TALK until her MERCY is full, then Pacify). Sparing her takes patience: each TALK only moves her a little, and Lull barely touches her. Spare her and she gives you her candle and goes home; beat her and she sinks to one knee, says goodbye as her flame gutters out (to "Wax and Lullaby (Last Light)", a somber remix of her theme), and melts into a pool of wax under her shawl, which stays by the door; her home goes cold. Leaving through the door completes Chapter One: the credits roll (cards from `text/credits.txt`) while "The Morning Past the Hill" plays, with its words glowing at the bottom of the screen as the tune reaches them (press X to be asked whether to skip them). Then the game carries on into the next region (Beyond the Ruins, waiting to be built). The title screen shows your save (where you are, level, gold and play time) with CONTINUE and NEW GAME.


## Chapter 2, part two: Mount Vigil and Heralds' Rest

Above the Sheer Face the stair reaches **Mount Vigil**, a spire you climb
*round*, and at the top of it **Heralds' Rest**, the village built to welcome
the Hero a hundred years ago. Eighteen rooms, no enemies (the climb is the
challenge; the monsters designed for it are in
[mountain-enemies.md](mountain-enemies.md)), two new regions (`vigil`,
`rest` in `src/data/areas.js`), three songs, and a lot of new engine.

### Spire rooms (the mountain that turns)

A room with `wraps: true` is the outside of a round mountain: its left and
right edges join up (walk off one side and you come round to the other), and
it's drawn bent round a cylinder whose circumference is the room's width
(`OverworldScene.drawSpire`: every screen column samples the one column of
the room's picture that lands at that angle, so the middle is full width,
the sides squeeze away, and the rock round the back isn't drawn). Props,
people and the rope are drawn where their column falls, squeezed the same
way (`drawOnSpire`, `project`). The camera keeps you in the middle, so
walking turns the whole mountain under you. Spire rooms are 44 tiles round;
`src/data/rooms/vigil*.js` are the ones there are. They were laid out by a
small generator (bands of ledge, faces of rings, notches of stair) and
checked for reachable ring chains and door spawns; edit them like any room.

### The view (vista) and the time of day

A room with `vista: { altitude, heading }` gets the view off the mountain
drawn behind it wherever it has open sky (`_` tiles): `src/overworld/vista.js`.
Three rings of peaks, clouds, a sea of cloud once you're high enough (above
`altitude` 0.45), the sun, birds, mist. In a spire room the whole view turns
as you walk round (the sun comes past, ranges slide away); in a flat room it
only shifts a little with the camera.

`src/overworld/daylight.js` runs a day every 14 minutes of play: the sky goes
gold at dusk and dawn, then dark blue at night with stars, a moon and the odd
shooting star, and everything outdoors (`underSky`) is shaded in a blue with
pools of light round every lamp, lit window, fire and crystal
(`drawTimeOfDay`, `drawShade`). Caves and houses don't notice.

Heralds' Rest is **lamplit** (`src/overworld/lamplight.js`; `LAMPLIT_AREAS`
in `src/data/areas.js`, or `lamplight: true`/`false` on a room). Outdoors,
the night comes down deeper there (`lamplight: { night: 0.72 }` to change it)
and every light pools warm on the snow: a pool lifts the shade and tints what
it falls on with the light's colour, and a bloom is the flame's own glow on
top, both wavering a little. Indoors the room is always a little dim and warm
between its lights, more so at night (`lamplight: { shade, nightShade }`).
What glows is `PROP_GLOWS` (by sprite: street lamps, braziers, fireplaces,
stoves, candles, the chapel's candles, altar, votive rack and stained glass),
or a prop's own `glow` (a list in the same form, or `false`), plus lit cabin
windows `w` and doorways in a cabin wall. Windows with `sky: true` let in
daylight, then moonlight. A lamplit room is never a `dark` one: no candle
burns and nothing is hidden. The round light pictures are drawn once and
scaled, so a square full of lamps costs next to nothing.

### Weather, wildlife and the small things

- `weather: 'flurry' | 'snow' | 'blizzard'` (and `wind`) draws snow across the
  room (`src/overworld/weather.js`); `birds: n` puts birds in the sky, and in a
  spire room they circle the mountain and disappear behind it.
- High rooms get wisps of cloud blowing across in front of everything.
- Cold rooms (`snowy`, or any weather): you leave footprints in snow (`n`, `i`
  tiles), your breath shows, landing kicks up snow, snow settles on your head
  if you stand still, and pebbles trickle down the face while you climb.
- Ice (`z`) is slippery: pushing builds speed, it bleeds away slowly, and you
  bump off things (`Player.slideOn`); you're reflected in it.
- `ambience` names the sounds of a place under the music (`AMBIENCES` in
  `src/audio/music.js`): `mountain` (wind, birds), `summit` (harder wind, a
  whistle), `village`, `cave` (drips, a low hum) and `hearth` (a fire).

### New tiles

`src/overworld/tileset.js`: open sky `_`, snow `n`, trodden snow `i`, ice
`z`, plank bridge `g` (rope rails where it hangs over the drop), snowy cliff
top `A`, ice-veined cliff face `E`, snow pine `Y`, snowy boulder `Q`; the
village's log cabin wall `a`, cabin window `w` (lit), snowy roof `e`, picket
fence `f`; the caves' rock `k`, wall `K`, floor `q`, stalactites `v` (walk
under them), stalagmites `^`, glowing ice crystals `x` (light in the dark),
and cave mouths `t`. Rooms can say `snowy: true` or `cave: true` so blocks
and boulders stand on the right ground. The cliff face `M` and the great
stair `s` take snow when there's snow next to them.

### Climbing, continued

A door with `climb: true` carries a rope climb into the next room: you
arrive already hooked on the first ring with the swing you had (the Ice Face
into the Knife Edge). Swinging now builds momentum (hold the way you're
swinging), reach grows with it, the rope stretches a little, and the grab
window widens; the ring you'd catch is marked. Tuning is at the top of
`src/overworld/climbing.js`.

### Heralds' Rest

The square (`restSquare.js`) with the frozen fountain and the ice statue of
the Hero, the inn (`restInn.js`: beds with `rest: true` restore your HP, and
play the `inn_dream` cutscene while you sleep if one exists), Rest Stores
(`restStores.js`, shop `rest_stores`), the Hall of Heralds, the bell tower
(the bell is a prop with `sound: 'bell'`), two houses and the Lookout, where
the stair goes on north (still to be built). Fifteen heralds and other
villagers, each with a file in `text/npcs/`, and the Keeper by the fountain
once you've met him on the Shoulder (`keeperOnTheShoulder.js`). The Keeper's
Ruins prop leaves (`until`) when that scene has played.

### HP, shops and the skill tree

- **HP carries between battles** (`heroHp` in `src/characters/progress.js`).
  Food, Heal Pulse, Mend, levelling up and a night at the inn bring it back;
  a fall brings you back whole.
- Shops **SELL** (half price; nothing you're wearing) and sell **skill
  points** (`{ skillPoint: true, price, limit }` in `src/data/shops.js`),
  and each shop has its own `keeper` sprite and `look` (room colours).
- The tree's Chapter 2 skills (`chapter: 2` in `src/data/skills.js`) roughly
  double it: new spells (Mend, Ember Flare, Bright Ward, Hush, Comet), and a
  new GRACE branch. Effects are listed at the top of that file. The SKILLS
  screen was redrawn (tabs, scrolling, a glass panel).
- **NPCs can have lines for after a cutscene**: `[first after <scene id>]`
  and `[repeat after <scene id>]` in their text file (Taper after being
  spared; the Keeper in the village).

### The party

`src/characters/party.js` defines who can join (Ves, for now). A member
follows you (`src/overworld/follower.js`; they vanish on the rope and
reappear when you're off it), takes a turn after yours in battle (the
`ally` phase: a menu like yours, FIGHT, TALK, SPELLS, ITEMS and DEFEND; their
SPELLS are the `commands` in `MEMBERS`, paid from the shared SP), and has a
branch in the skill tree paid with their own points (`MEMBER_SKILL_BRANCHES`).
They wear their own weapon and armor (`src/characters/equipment.js`): gear
with a `wielder` in `weapons.js`/`armor.js` is theirs alone, switched in EQUIP
(left/right goes on to their tabs), and saved in `HERO_STATE.memberGear`.
Since enemies only aim at you, their armor looks after you. Someone
joins through a cutscene step `{ do: 'join', who: 'vesper' }` or by talking to a
room character with `join: 'vesper'` (Ves, in the chapel, for now). Ideas for
who else, and how: [party-member-ideas.md](party-member-ideas.md).

### Checking your work

- `tools/textCheck.html` measures every line of text against its box.
- `tools/preview.html?room=<id>&x=&y=&facing=&day=` draws a still of any
  room; `?check=1&songs=1` builds every room and compiles every song;
  `?poke=all` presses Z on every interactable in the game and reports
  anything that throws; `?skills=2&party=1` draws the skill tree;
  `?equip=vesper&slot=armor` draws the EQUIP menu on Ves's tabs;
  `?allyturn=vesper&phase=spells` draws a battle on her turn.

### Levels and skills

Winning a fight earns EXP (pacifying earns gold but no EXP). The EXP needed grows every level: 20, 40, 70, 110, 160 and so on. Each level gives +8 max HP and 1 skill point; that's the only way to get either. The tree grows with the story: each skill has a `chapter`, and the SKILLS screen shows only the ones up to the chapter you're on, so every chapter adds more (roughly doubling the tree).

Press C and choose SKILLS to spend points. The tree is drawn as three constellations in a drifting night sky, with its own slow song; learned stars glow and light up the line to the next. Each skill needs the one above it:

| VALOR | SPIRIT | RESOLVE | STRIDE |
| --- | --- | --- | --- |
| Sharpened (1): FIGHT +15% | Focus (1): grazing +25% SP | Thick Skin (1): every hit does 1 less damage | Sprinter (1): run 25% faster |
| Keen Eye (1): wider strike window | Lull (1): spell, +30% MERCY | Steady Shadow (1): longer invincibility after a hit | Acrobat (2): jump a step higher, onto tall blocks |
| Rend (2): spell, 30 damage | Wide Graze (2): bigger graze area | Guard Up (1): DEFEND heals 8 HP | Sure Foot (2): landings crack the floor half as often |
| Flurry (2): a fourth FIGHT slash | Starfall (2): spell, 45 damage | Last Stand (2): survive one knockout per battle | |

Heal Pulse and Pacify are known from the start. Skills are defined in `src/data/skills.js` (the comment there lists every effect), with descriptions in `text/skills/skills.txt`. Spell costs are in `src/data/spells.js`.

### Shops

Talking to Moss opens the shop screen: Moss behind the counter in a little shop room, with a menu box (BUY, TALK, EXIT) and a dialogue box below. BUY lists every weapon with its price and details; TALK has topics to chat about. Everything Moss says, including the TALK topics, is in `text/shops/ruins_shop.txt`; any section named `talk: ...` becomes a topic.

### Weapons and shadow abilities

You start with the Worn Sword and the Old Shield. Moss, the mushroom-capped merchant in the west room, runs the **RUINS SHOP**, which sells every weapon for 0 gold for now. Winning or pacifying an enemy earns gold.

Press C in the overworld and choose EQUIP. Each weapon changes how much damage FIGHT does, and most give your shadow an ability you use with **Shift** while dodging. The ability is ready again at the start of every enemy turn, and a bar under the box shows when it has recharged.

| Weapon | FIGHT | Shift ability |
| --- | --- | --- |
| Worn Sword | x1 | None |
| Old Shield | x0.7 | **Block**: a barrier destroys bullets for 0.6s. 3s recharge. |
| Duelist's Blade | x0.9 | **Parry**: a quick slash around the shadow. 2s recharge, or 0.6s if you parry a bullet just before it hits (which also gives SP). |
| Ash Spear | x0.85 | **Lunge**: dash the way you're moving, unhittable mid-dash. 1.8s recharge. |
| Hunting Bow | x0.6 | **Shoot**: fire arrows upward that break a bullet each. 3 per turn. |
| Oak Staff | x0.5 | **Channel** (hold): stand still; grazing builds SP 3x as fast. |
| Stone Hammer | x1 | **Quake**: clear the bullets closest to you. 7s recharge. |
| Spare Lantern | x0.5 | **Light**: a pool of light where bullets slow to a crawl for 3s. |
| Glass Dagger | x0.8 | **Phase**: blink to the opposite side of the box. 3s recharge. |
| Iron Gauntlets | x0.8 | **Reflect**: punch a nearby bullet back at the enemy for damage. |
| Chapel Bell | x0.4 | **Toll**: freeze every bullet for 0.4s. 8s recharge. |
| Old Tome | x0.5 | **Recall**: spend 20% SP to heal 12 HP mid-attack. |

Bullets destroyed by an ability give a little SP.

New weapons go in `src/data/weapons.js`, with descriptions in `text/items/weapons.txt`. New abilities go in `src/battle/soulAbilities.js`, which explains every hook an ability can use. Shops are in `src/data/shops.js`, with the shopkeeper's lines in `text/shops/`. What the hero owns, has equipped and how much gold they have is in `src/characters/heroState.js`.

### Music

Original songs are synthesised live, chiptune style, with the Web Audio API, so there are no audio files. Every melody is original:

- **Lantern Dark** (`src/data/music/ruinsTheme.js`) plays in the Ruins: mysterious, D minor with a dark E-flat chord, a twinkling music box over a low drone, and a sparse echoing melody.
- **Starlight Study** (`src/data/music/skillsTheme.js`) plays in the SKILLS menu: slow and dreamy, E major, soft chords and a gentle music box.
- **Old Halls Waltz** (`src/data/music/waltzTheme.js`) isn't used yet, saved for a brighter area: a waltz in 3/4, F major, with an "oom-pah-pah" accompaniment. Play it with `music: 'waltz'`.
- **Dust and Lanterns** (`src/data/music/shopTheme.js`) plays in the RUINS SHOP: slow and wistful, A minor, an echoing lead over soft chords.
- **Keeper of the Small Flames** (`src/data/music/taperBattleTheme.js`) plays in the fight with Taper: about three minutes, B minor, 140 BPM, driving and heroic but sad underneath. Her lullaby runs all the way through it: on a music box in the intro, sung over the drums, half-time and in D major in the bridge, alone over a heartbeat in the quiet part, and blared out in full by the brass, a step higher, at the climax. The instrument presets it uses (organ, strings, piano, choir, timpani, bells, brass) are in `src/audio/instruments.js`, ready for any song.
- **The Morning Past the Hill** (`src/data/music/creditsTheme.js`) plays over the credits, once: about three minutes for concert piano, solo violin and orchestra (cello, horns, strings, plucked basses, timpani). A quiet piano figure turns over and over like wheels on a road while the violin carries the tune from B minor into D major, through a horn interlude, a pared-back verse and a building bridge, up to a last chorus in E major. Nobody sings, but its lyrics are written into the song (`src/audio/songBuilder.js` puts each syllable on its note) and the credits light them up in time. Its instruments (`CONCERT_PIANO`, `SOLO_VIOLIN`, `CELLO`, `FLUTE`, `HARP`, `HORN`, `STRING_SECTION`, `PIZZICATO_BASS` in `src/audio/instruments.js`) use vibrato that blooms in, bow and breath noise, stereo seating and a little human unevenness, so they sound played rather than programmed.
- **Cotton Clash** (`src/data/music/battleTheme.js`) plays in battle: 160 BPM, E minor lifting to a hopeful second half, a brassy lead over a syncopated bass, off-beat stabs and a busy kit.

Menus, battles, saving and doors also have little synthesised sound effects (`SFX` in `src/audio/music.js`).

Music starts on your first key press, because browsers block sound until then. A room picks its song with `music`, a shop plays its own `music` while it's open, and an enemy can override the battle song with its own `music`. Songs are written as note text; `src/audio/notation.js` explains the format.

### Shadow modes (bosses only)

Special boss battles can change how your shadow works. The mode shows as the colour of its rim and is explained the first time it appears:

- **HEAVY** (purple): your shadow falls to the floor of the box. Press Up or Space to jump, and hold it to jump higher. Used by the `pillars` attack.

New modes go in `src/battle/soulModes.js`. An attack asks for a mode with `mode: '...'` in `src/battle/bullets.js`. Only an enemy with `boss: true` may use those attacks; any other enemy that lists one stops the battle with an error, so modes stay special.

## Rooms, doors and saving

Rooms are listed in `src/data/rooms/index.js`, each with an `id`. A room's `doors` are tile areas that lead to another room by id, with a `spawn` tile where you arrive; doorways (`D` tiles) fade to black and back. Props with `save: true` are save points: they store the hero, which enemies are beaten, and where you stood, in the browser's localStorage (`src/state/saveGame.js`). The game continues from the last save when it starts and after a game over.

To start over, clear the save from your browser's developer tools (Application, Local Storage) or run `localStorage.clear()` in the console.

## Layout

```
index.html                Page with the game canvas
css/                      Page styles
text/                     All dialogue (see above)
assets/                   Real art, audio and fonts (empty for now)
  sprites/  audio/  fonts/
src/
  main.js                 Entry point: loads fonts and text, continues from the last save
  state/                  Saving and loading, and what's remembered about the world
  config.js               Resolution (320x240) and tile size (16px)
  audio/                  Music synthesiser and the note notation songs are written in
  engine/                 Shared core: game loop, input, screen scaling and UI space,
                          sprites, text-file loading
  characters/             The hero: sprites and animation, what they carry (heroState),
                          and levels and skills (progress)
  overworld/              Exploring: scene, rooms, tileset, camera, player, props, enemies
  shop/                   The shop screen
  battle/                 Battles: scene, HUD, soul and soul modes, projectiles,
                          the FIGHT strike bar, area backdrops
    attacks/              Each enemy's own attacks and bullet art, one file per enemy
  gameOver/               Game over screen
  ui/                     Shared UI: text, the overworld textbox, and the C menu (EQUIP, SKILLS)
  data/                   Content, kept separate from code
    rooms/                Room layouts as text maps, with props, doors and enemies
    art/                  Placeholder pixel art and command icons as text grids
    enemies/              Enemy stats, TALK options and attack weights
    skills.js, spells.js  The skill tree and spell costs
    music/                The songs, as note data
    textManifest.js       The list of files in text/ to load (generated)
```

Each game mode gets its own folder under `src/`. Code shared between modes lives in `engine/`, `characters/` and `ui/`.

To add a room, copy `src/data/rooms/startRoom.js` and edit the map. Each tile character is defined in `src/overworld/tileset.js`. To add an enemy, copy `src/data/enemies/dummy.js` and `text/enemies/rogue_dummy.txt`, then add it to the room's `npcs` list. To add a battle background for a new area, add a function to `src/battle/backdrops.js` and set the room's `area`.

## Next steps

- More party members (the battle already draws the party as a list)
- A first boss to show off soul modes
- More enemies, attacks and areas
- More spells
- Items to buy, and HP that carries between battles
