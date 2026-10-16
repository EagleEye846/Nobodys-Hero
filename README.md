# RPG Prototype

A browser RPG with Deltarune-style turn-based combat. It currently has the overworld: a character you can walk around a pixel-art room.

## Running it

The game uses JavaScript modules, which browsers won't load from `file://`, so serve this folder. Run this from the project root, not your home folder; `--bind` keeps it private to your machine:

```
python -m http.server 8000 --bind 127.0.0.1
```

Then open http://localhost:8000.

## Controls

| Key | Action |
| --- | --- |
| Arrow keys / WASD | Move |
| X / Shift (hold) | Run |
| Space | Jump. Landing on the same tile three times breaks it, and you fall to your death |

In battle: arrow keys move your soul, Z confirms, X backs out of submenus, and holding X or Shift while dodging is Touhou-style focus (slower, with your exact hitbox shown).

## Battling

Touch the rogue dummy in the east room to start a Deltarune-style battle:

- **FIGHT**: stop the sweeping bar near the centre for more damage.
- **ACT**: Check, Talk, Compliment, or spend 32 TP to Soothe. Acts raise MERCY.
- **ITEM**: eat a Dark Candy to heal 40 HP.
- **SPARE**: ends the fight peacefully once MERCY reaches 100%.
- **DEFEND**: halves damage next turn and charges TP.

On the enemy's turn you dodge bullet patterns inside the box. Grazing — letting
bullets skim past without being hit — charges TP.
| Z / Enter | Confirm / read signs |
| X / Shift | Skip text |

## Layout

```
index.html                Page with the game canvas
css/                      Page styles
assets/                   Real art, audio and fonts (empty for now)
  sprites/  audio/  fonts/
src/
  main.js                 Entry point: creates the game and the first scene
  config.js               Resolution (320x240) and tile size (16px)
  engine/                 Shared core: game loop, input, screen scaling, sprite helpers
  overworld/              Exploring: scene, rooms, tileset, camera, player, props
  battle/                 Deltarune-style battles: scene, soul, bullets, attack bar
  gameOver/               Game over screen
  ui/                     Shared UI: textbox and, later, menus
  data/                   Content, kept separate from code
    rooms/                Room layouts as text maps
    art/                  Placeholder pixel art as text grids
    enemies/              Enemy stats, acts, quips and attack patterns
```

Each game mode gets its own folder under `src/`. Code shared between modes lives in `engine/` and `ui/`.

To add a room, copy `src/data/rooms/startRoom.js` and edit the map. Each tile character is defined in `src/overworld/tileset.js`.

## Next steps

- More enemies, bullet patterns and rooms
- Spells that spend the TP earned by grazing
- A bitmap pixel font in `assets/fonts/` to replace the blurry canvas text
- Doors that move the player between rooms
