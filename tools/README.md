# Ruins Studio

Tools for making things for the game: sprites, rooms, music, attack patterns
and enemies. Press **Save** and your work goes straight into the game's files.
Refresh the game to play with it.

## Starting it

From the game folder (the one with `index.html`):

```
python tools/serve.py
```

Then open <http://localhost:8000/tools/> for the Studio and <http://localhost:8000/>
for the game. (`python tools/serve.py 8080` uses another port.)

The server only listens on this computer. It can only write inside `src/data/`
and `text/`, and it copies the old version of every file it changes into
`.studio-backups/` first, so a bad save can always be undone by copying the
backup back. After each save it rebuilds the game's lists of enemies, rooms,
songs, patterns and text files, so new things show up without editing code.

Without the server (for example `python -m http.server`), everything still
works except **Save**. Use the **Export** button next to Save to copy the code
or download the file, and put it where the file name at the top says.

## Finding your way around

- The **home screen** has a card for each tool. The tabs at the top switch tools;
  each keeps its work while you look at another.
- The top bar shows the file you're editing. An **orange dot** means unsaved
  changes. **Save** (or Ctrl+S) saves; the browser warns you before leaving with
  unsaved work.
- **Advanced** (top right) shows the code and the extra settings (ids, palette
  letters, raw instrument settings). Everything works without it.
- Hover over a button to see what it does and its shortcut.

## Checking (no Studio needed)

- **textCheck.html** measures every line of the game's text against the box
  it's shown in. Run it after writing any text.
- **preview.html** draws a still of any room without playing to it
  (`preview.html?room=rest_square&x=20&y=17&facing=down&day=0.75`), builds
  every room and compiles every song (`?check=1&songs=1`), presses Z on every
  interactable in the game and reports anything that throws (`?poke=all`),
  and draws the skill tree (`?skills=2&party=1`).

## Sprite Editor

Pick a sprite on the left, or press **New** and choose a kind: *Enemy* (16x16),
*Character* (12x18), *Portrait* (32x32, with a blink frame) or a custom size.

- Tools: Pencil **B**, Eraser **E** (or right-click), Fill **F**, Colour picker **I**,
  Mirror **M**, Grid **G**. Scroll to zoom, **0** fits it to the window.
  Ctrl+Z / Ctrl+Y undo and redo.
- **Colours** are swatches: click one to paint with it, double-click (or use the
  box underneath) to change it everywhere, **+** to add one. The letters the game
  stores them under are chosen for you.
- **Frames** appear under the canvas for animated sprites. **Add frame** copies the
  current one; **[** and **]** switch frames. The preview on the right plays them.

Saving an existing sprite only rewrites that sprite (and its palette) in its art
file; everything else in the file stays as it was. New sprites become a new file
in `src/data/art/`. New portraits are added to `PORTRAITS` in `portraits.js`
(the portrait id is its name, e.g. `old_keeper`, matching `text/npcs/<id>.txt`).

### Animations

Any sprite with a few frames of the same size is an **animation** the game
can play, named after the sprite (Taper watering her flowers is
`taper_watering`, from `src/data/art/taperWatering.js`). To make one: **New**,
pick **Character** or **Custom size**, draw the first frame, then **Add frame**
for each next one and save. Then:

- In the **Room Editor**, select a character or object and pick it under
  **Animation** (with a **Speed**): it plays over and over in the room.
- In the **Cutscene Maker**, give someone an animation under **Doing at the
  start**, or use a **Play an animation** step (walking stops it).

New animations show up after you refresh the Studio (Ctrl+F5).

## Room Editor

Choose a room at the top, or **New room** (pick a name, a size, and start empty
or from a copy of another room).

- **Paint** (**1**): pick a tile (Floor, Wall, Rug, Lantern pillar, Doorway...)
  and drag with the Brush, Box or Fill. Right-click picks up a tile.
- **Place** (**2**): pick a thing (Player start, Door, Cutscene, Sign, Save point,
  Keeper / NPC, Shop, Object like a watering can, or any enemy) and click the map. Click things to select
  them, drag to move, Delete to remove. A selected enemy shows yellow handles:
  drag them to set how far it walks.
- The panel on the right edits the selected thing: a sign's words, where a door
  leads (and **Pick on the map** for where you arrive), which shop or NPC...
  With nothing selected it shows the room's name, music, region and size.
- **Check** lists problems in plain words (a door to nowhere, a start inside a wall...).
- **Flavour text:** select any Object and write in **When you press Z on it**
  (Undertale's "It's you!"). Each line is a "*" line; an empty line starts a
  new page. Leave it empty and it's just for looks. Furniture (fireplace,
  armchair, bookshelves, beds, tables...) is in the Object's **Looks like** list;
  the big pieces cover two or three tiles to the right of where you place them.
- **Words for tiles:** in **Place** mode, click a flower bed, pillar, rubble,
  water or any other tile (not plain floor) to give it words. Choose **Just this
  one**, or **Every flower bed in this room** (or whatever it is). A little
  yellow speech mark shows on tiles that have words.
- **Homes:** paint **Wood floor** and **Home wall** (papered, with panelling;
  two tiles tall like the stone walls) for inside a house. Plants, flower beds
  and other decorations sit on wood when they're surrounded by it.
- **Gives you:** an Object can give an item the first time you press Z on it,
  and change its look afterwards (**Looks like, once taken**).
- **Puzzle:** make an Object a **switch** (give it a name; lantern posts and
  levers light up or flip when on) or a **gate** (list the switch names that
  open it, and tick **in that order** for an order puzzle).
- **Shows up:** a character or object can be there *always*, only *until* a
  cutscene has played, or only *after* it has. That's how Taper waters her
  flowers in the Flower Room until you meet her, then waits at home. Rooms
  check this again whenever a cutscene ends, so someone can already be waiting
  further along (Taper at the door in The Way Out) instead of popping in.
- **Stairs up / Stairs down** tiles work like doorways: paint them, then put a
  Door on them.
- **Tall tiles** (Tall pillar, Broken pillar, Hero statue, Candelabra) rise above
  their tile, and in the game you can walk behind them. Their base blocks walking.
- **How enemies move:** select an enemy and pick from **How it moves**: walks back
  and forth, stays put, wanders about, chases you when it sees you, hides and jumps
  out then chases, hides then pounces on you (the battle starts as it lands), or
  in disguise then pounces. For the hiding and disguised ones, **Leaps from** sets
  how many tiles away they spring (shown as a dashed circle on the map). Hiding ones go on the tile just above a tall tile, and
  peek out now and then so sharp-eyed players can spot them. Chasers are slower
  than you walk, so you can always escape. Disguised enemies wear their `disguise`
  art if they have some (the Columneon looks like a pillar).

Saving writes the room file in `src/data/rooms/` and, if signs changed, their
sections in the room's text file (every other section is kept as it was).

## Dialogue Maker

Pick someone on the left (or **New person**) and write what they say: **First
time** is said the first time you talk to them, **After that** every time after.
Each page is one box of text, and each line starts with "* " in the game. The
preview on the right is the game's own text box, with their portrait if they
have one (make one in the Sprite Editor: New, Portrait, named like the person).
Pages too long for the box turn red. **Play it all** types them out like the
game does. Saves to `text/npcs/<name>.txt`; put the person in a room with the
Room Editor (Place, Keeper / NPC).

## Cutscene Maker

Script a scene that plays in a room. Pick a cutscene at the top left or make a
**New cutscene** (name it and choose its room).

- **Who's in it:** you (the player) always are. **Add someone** for anyone else:
  how they look (any prop or enemy), their portrait when they talk, where they
  start, and whether they're off-stage until an **Appear** step. To use someone
  who's already standing in the room (like the Keeper), set **Already in the
  room?** to them: they step out from where they stand (no double), and stay
  wherever the scene leaves them. If they **Leave**, they're gone until you
  come back into the room.
- **Steps** play top to bottom: say something, walk to a spot (or hurry), turn
  to face, show an emote (! ? ... or a heart), wait, move the camera, appear,
  leave, play an animation, play a sound, change the music, give an item,
  start a battle (then play one scene if the enemy was spared and another if
  it was beaten), or end the chapter. Click a step to select it; new steps go after it.
  Leave a blank line in someone's words to start a new page.
- **Preview** plays it in the real game engine. Press **Next (Z)** (or click the
  preview and press Z) to go on when someone is talking.
- **To play it in the game**, put a **Cutscene** trigger in the room with the
  Room Editor (Place, Cutscene, then click or drag an area). Stepping there
  plays it, only the first time unless you untick "Only plays the first time".

Scenes save to `src/data/scenes/<name>.js`. `exampleScene.js` shows the format.

## Music Maker

Pick a song at the top or start a **New song**.

- **Tracks** on the left: click one to write its notes, choose its instrument and
  volume, mute it, or **Add a track** (Melody, Harmony, Bass, Pad, Sparkle).
- **Piano roll**: click to add a note of the chosen **Note length**, drag to make
  it longer, click it again (or right-click) to remove it. Click the keyboard on
  the left to hear a note. Pick a **Key** and scale: in-key rows are lighter, and
  **Snap to scale** moves clicks onto the scale.
- **Drums** under the roll: Kick, Snare, Hat and Open hat. Click or drag to add hits.
- **Sections** (Intro, A, B...): switch, add (a copy or empty), rename, delete,
  and change the number of bars.
- **Play** / Space plays it; **Loop section** repeats the section you're on
  (turn it off to hear the whole song). **Tempo** sets the speed.

Songs save as `src/data/music/<name>Theme.js`. Rooms play a song by its short
name (shown under the song's name).

## Music Export

`tools/exportMusic.html` (<http://localhost:8000/tools/exportMusic.html> with the
server running) records the game's songs to **MP3** or **WAV** files, played on
the same instruments as in the game. Press **Export** beside a song, or **Export
all** to pick a folder for every song at once. Looping songs play through, go
round the loop the number of times you choose, then fade out. MP3 needs the
internet the first time (it loads the encoder); WAV always works.

## Pattern Lab

The box on the left is a copy of the battle box. Arrow keys or WASD move the
soul (hold X to go slowly); hits and grazes are counted. The sliders under it
thin out or slow down the bullets the way an enemy's difficulty does.

- **Try a pattern**: every built-in pattern and every one made here.
- **Build your own**: add blocks (Rain from the top, Aimed at you, Ring burst,
  Spiral, Wall with a gap, Bouncing balls, Wavy shots) and set them with sliders
  and bullet pictures. The box updates while you drag. Blocks all run at once.

Saving writes `src/data/patterns/<name>.js`; enemies can use it by name at once
(it appears in the Enemy Maker). The file remembers its blocks, so **Change**
in Try mode opens it again. In Advanced you can see or hand-edit the code.

## Enemy Maker

Six steps, with the enemy shown at battle size on the left the whole time:

1. **Look**: name it and pick its picture, or **Draw a new one** (opens the
   Sprite Editor; save there and you come straight back).
2. **Stats**: Easy / Normal / Hard, then fine-tune HP, damage, bullets and rewards.
3. **Attacks**: turn on patterns and choose Rarely / Sometimes / Often. Hover a
   card to watch it. Patterns that change the soul make the enemy a boss.
4. **Talk**: its TALK options, how much Mercy each gives, and what happens.
5. **Words**: intro, each-turn lines, taunts, and how the fight ends. These start
   filled in with its name.
6. **Save**: writes `src/data/enemies/<id>.js` and `text/enemies/<id>.txt`. Tick
   **Also put it in a room** and click a floor tile to add it to a room as well.

Pick an existing enemy at the top left to change it instead.

## For programmers

- Plain ES modules, no build step. The tools import the game's own modules
  (`../src/...`), so tiles, bullets and songs are drawn and played by game code.
- `main.js` is the shell (tabs, Save, Export, unsaved tracking). Each tool
  exports `mount(root, studio)` and returns `{ getFiles, afterSave, handle, onShow, onHide }`;
  `getFiles()` returns `[{ path, content }]` and the shell sends them to `/api/save`
  after checking every `.js` file's brackets balance.
- `library.js` finds the game's content (art files, enemies, rooms, songs,
  patterns) through the generated registries, so it never needs updating.
- `source.js` rewrites one `export const NAME = ...` in a file and leaves the
  rest alone; `textfile.js` does the same for one `[section]` of a text file.
- `rooms.js` has the room helpers the Room Editor and Enemy Maker share.

## Text Check

Open http://localhost:8000/tools/textCheck.html (with `python tools/serve.py` running) to measure every line of the game's text against the box it's shown in, with the game's own fonts. Run it after writing or changing any text.

- **Dialogue boxes page by themselves**: the overworld textbox, the battle panel and the shop's box carry a page that's too long onto the next one (`paginate` in `src/ui/text.js`). The check lists those for information, in case one splits mid-thought and would read better split by hand (a blank line in a text file starts a new page).
- **Everything else has a hard limit** and is listed under Problems if it doesn't fit: battle flavour text (3 lines), speech bubbles (3 lines each), skill descriptions (2 lines), intro pages (5 lines), the chapter card (3 lines), shop TALK topics (list width), and descriptions and credits lines too long to read even shrunk.
- Lists scroll (the shop's TALK topics, battle options), and descriptions and credits lines shrink to fit their space.
- Adding a new kind of text box? Give it a rule in `tools/textCheck.html`.
