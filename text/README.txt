GAME TEXT
=========

Everything characters and objects say lives in these files, so you can write
and edit dialogue without touching code. Refresh the game to see changes.


FORMAT
------

# Lines starting with # are comments and are ignored.

[section name]      starts a section.

Inside a section, blank lines separate entries.
Each line inside an entry is shown as its own "* " paragraph.
Long lines wrap automatically in game, so don't break them yourself.

Example:

    [welcome_sign]
    Welcome to the Ruins.
    Use the arrow keys to walk.

    Press Z to read signs.

That section has two entries (two pages of the textbox). The first page has
two "* " paragraphs.


FOLDERS
-------

enemies/        One file per enemy: battle intro, flavour text, taunts,
                TALK replies, and how the fight ends. A taunt written over
                several lines (no blank line between) is said one speech
                bubble at a time.

interactions/   One file per area: signs and other things you can inspect.
                Each entry is one page of the textbox.

npcs/           One file per NPC. [first] is said the first time you talk to
                them, [repeat] every time after that.

cutscenes/      Story scenes, like the intro. Each [section] names a picture
                to show, and each entry under it is a page of text. See the
                comments at the top of intro.txt.

title.txt       The game's name and the title screen prompts.


ADDING A NEW FILE
-----------------

1. Create the .txt file in the right folder.
2. Run the game with `python tools/serve.py` (or run `python tools/serve.py --generate`):
   it adds every .txt file here to src/data/textManifest.js so the game loads it.
3. Point the enemy, room or NPC at it (see the comments in each file).
