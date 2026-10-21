# Nobody's Hero

A browser RPG about the Hero who never came. Explore the Ruins, climb the
Long Stair, and go round and up Mount Vigil to the village that's been
waiting for you for a hundred years.

## How to play

You need two things: the game's files, and **Python**. The game will not
start without Python installed.

### 1. Install Python (only once)

1. Go to **https://www.python.org/downloads/** and click the big yellow
   **Download Python** button.
2. Open the file you downloaded to install it.
3. **On Windows:** on the first screen of the installer, tick the box at the
   bottom that says **"Add python.exe to PATH"**, then click **Install Now**.
   (If you miss this box, the game won't start. Run the installer again and
   tick it.)

### 2. Download the game

1. On the game's GitHub page, click the green **Code** button, then
   **Download ZIP**.
2. Find the ZIP in your Downloads folder, right-click it and choose
   **Extract All** (on a Mac, double-click it). You'll get a folder with the
   game in it.

### 3. Start the game

**On Windows:** open the game's folder and double-click **Play.bat**. A black
window opens and the game appears in your web browser.

- Keep the black window open while you play. Close it when you're done.
- If Windows says "Windows protected your PC", click **More info**, then
  **Run anyway**.

**On a Mac:**

1. Open the **Terminal** app (press Cmd + Space, type `Terminal`, press Enter).
2. Type `cd ` (with a space after it), drag the game's folder into the
   Terminal window, and press Enter.
3. Type `python3 tools/serve.py` and press Enter.
4. Open your web browser and go to **http://localhost:8000**.

Keep Terminal open while you play. To stop, click it and press Ctrl + C.

Press **Z** on the first screen to begin.

### Controls

| Key | What it does |
| --- | --- |
| Arrow keys / WASD | Move |
| Z / Enter | Talk, read, climb, confirm |
| X / Shift | Hold to run; back out of menus |
| Space | Jump |
| C / Ctrl | Open the menu (items, equipment, skills, candles); hold C to skip through dialogue |
| M | Mute |

### Getting an update

Download the new ZIP and extract it the same way (you can delete the old
folder). Start it the same way as before. **Your save carries over**: it's
kept by your web browser, not in the game's folder, so play in the same
browser at the same address (http://localhost:8000).

### If something goes wrong

- **"Python isn't installed" or "'python' is not recognized":** install
  Python (step 1). On Windows, make sure "Add python.exe to PATH" is ticked.
- **The page says it can't connect:** the black window (or Terminal) has been
  closed. Start the game again.
- **The page is blank:** the game has to be opened through
  http://localhost:8000. Opening `index.html` by double-clicking it won't work.
- **No sound:** press a key on the first screen (browsers wait for a key press
  before playing sound), and check you haven't muted it with **M**.

---

Making things for the game (rooms, enemies, songs, dialogue): the Studio tools,
described in [tools/README.md](tools/README.md).
