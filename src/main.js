import { UI_WIDTH, UI_HEIGHT } from './config.js';
import { createScreen } from './engine/screen.js';
import { Input } from './engine/input.js';
import { Game } from './engine/game.js';
import { loadTextFiles } from './engine/textLoader.js';
import { loadUiFont } from './ui/text.js';
import { TEXT_FILES } from './data/textManifest.js';
import { continueGame } from './overworld/overworldScene.js';
import { START_ROOM } from './data/rooms/index.js';
import { CutsceneScene } from './cutscene/cutsceneScene.js';
import { PressStartScene, TitleScene } from './title/titleScene.js';

const ctx = createScreen(document.getElementById('game'), UI_WIDTH, UI_HEIGHT);
const game = new Game(ctx, new Input());

// Canvas text can't use a web font until it has loaded, and all dialogue lives in /text.
await Promise.all([loadUiFont(), loadTextFiles(TEXT_FILES)]);

// The intro, then the title screen, then the game: picking up from the last
// save point, or starting at the Ruins entrance.
const startGame = () => continueGame(START_ROOM);
const titleScreen = () => new TitleScene(startGame);
const intro = () => new CutsceneScene('cutscenes/intro.txt', titleScreen, { song: 'prophecy' });
game.changeScene(new PressStartScene(intro));
game.start();
