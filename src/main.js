import { UI_WIDTH, UI_HEIGHT } from './config.js';
import { createScreen } from './engine/screen.js';
import { Input } from './engine/input.js';
import { Game } from './engine/game.js';
import { loadTextFiles } from './engine/textLoader.js';
import { loadUiFont } from './ui/text.js';
import { TEXT_FILES } from './data/textManifest.js';
import { continueGame } from './overworld/overworldScene.js';
import { START_ROOM } from './data/rooms/index.js';

const ctx = createScreen(document.getElementById('game'), UI_WIDTH, UI_HEIGHT);
const game = new Game(ctx, new Input());

// Canvas text can't use a web font until it has loaded, and all dialogue lives in /text.
await Promise.all([loadUiFont(), loadTextFiles(TEXT_FILES)]);

// Pick up from the last save point, or start at the Ruins entrance.
game.changeScene(continueGame(START_ROOM));
game.start();
