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
  ui/                     Shared UI: textbox and, later, menus
  data/                   Content, kept separate from code
    rooms/                Room layouts as text maps
    art/                  Placeholder pixel art as text grids
```

Each game mode gets its own folder under `src/`. Code shared between modes lives in `engine/` and `ui/`.

To add a room, copy `src/data/rooms/startRoom.js` and edit the map. Each tile character is defined in `src/overworld/tileset.js`.

## Next steps

- `src/battle/`: turn-based combat as a new scene with the same `update`/`draw` interface, started from the overworld with `game.changeScene(...)`
- A bitmap pixel font in `assets/fonts/` to replace the blurry canvas text
- Doors that move the player between rooms
