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


COLOURED AND SHAKING WORDS
--------------------------

In anything the text box shows (people, signs, scenes), a few words can be
picked out:

    The {c:gold}Bathtub Bell{/c} hangs by the gate.
    It's {fx:shake}so cold{/fx} out here.

Colours: gold, red, blue, green, grey. Effects: shake. Use them sparingly
(gold for a place or a thing that matters). Anywhere that doesn't draw them
(the battle panel, shops), the tags are left out and the words read plainly.
tools/textCheck.html measures text without the tags, and lists a colour that
doesn't exist or a tag that's never closed under Problems.


FOLDERS
-------

enemies/        One file per enemy: battle intro, flavour text, taunts,
                TALK replies, and how the fight ends. A taunt can run over
                several lines (no blank line between): lines join into one
                speech bubble until one ends a sentence (. ! ? ...), and
                each sentence after that gets a bubble of its own.

interactions/   One file per area: signs and other things you can inspect.
                Each entry is one page of the textbox.
                [thing after <scene id>] is used instead of [thing] once
                that scene has played (the latest one wins), like the
                townsfolk's [first after <scene id>] in npcs/.

npcs/           One file per NPC. [first] is said the first time you talk to
                them, [repeat] every time after that. [repeat 2], [repeat 3]...
                take turns after [repeat], staying on the last one; the game
                remembers (in the save) who you've talked to. [first_ves] or
                [repeat_bramble 2] is what Ves or Bramble says after it, if
                they're with you.

TURNS           Anything you look at can take turns the same way: [thing],
                then [thing 2], [thing 3]... staying on the last. A number on
                its own further on, like [quay_bell 10], is said that time
                only (the tenth ring), then it's back to the usual. Later in
                the story: [thing 2 after <scene id>]; after the storm,
                [thing_calm 2]. Friends' answers: [thing_ves 2]. Shops'
                [greeting 2] and [greeting 3] work the same, by visit.

cutscenes/      Story scenes, like the intro. Each [section] names a picture
                to show, and each entry under it is a page of text. See the
                comments at the top of intro.txt.

spells/         spells.txt: the one-line description under the battle's
                SPELLS list for each spell, Ves's too.

title.txt       The game's name and the title screen prompts.

goals.txt       "What was I doing?": the line about where to go next, on the
                C menu and after loading a save. See the top of the file.

game_over.txt   A boss's own line under GAME OVER, by enemy id.


ADDING A NEW FILE
-----------------

1. Create the .txt file in the right folder.
2. Run the game with `python tools/serve.py` (or run `python tools/serve.py --generate`):
   it adds every .txt file here to src/data/textManifest.js so the game loads it.
3. Point the enemy, room or NPC at it (see the comments in each file).
