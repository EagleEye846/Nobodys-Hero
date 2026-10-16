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

## Room Editor

Choose a room at the top, or **New room** (pick a name, a size, and start empty
or from a copy of another room).

- **Paint** (**1**): pick a tile (Floor, Wall, Rug, Lantern pillar, Doorway...)
  and drag with the Brush, Box or Fill. Right-click picks up a tile.
- **Place** (**2**): pick a thing (Player start, Door, Sign, Save point,
  Keeper / NPC, Shop, or any enemy) and click the map. Click things to select
  them, drag to move, Delete to remove. A selected enemy shows yellow handles:
  drag them to set how far it walks.
- The panel on the right edits the selected thing: a sign's words, where a door
  leads (and **Pick on the map** for where you arrive), which shop or NPC...
  With nothing selected it shows the room's name, music, battle background and size.
- **Check** lists problems in plain words (a door to nowhere, a start inside a wall...).

Saving writes the room file in `src/data/rooms/` and, if signs changed, their
sections in the room's text file (every other section is kept as it was).

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
