import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config.js';
import { createScreen } from './engine/screen.js';
import { Input } from './engine/input.js';
import { Game } from './engine/game.js';
import { OverworldScene } from './overworld/overworldScene.js';
import { START_ROOM } from './data/rooms/startRoom.js';

const ctx = createScreen(document.getElementById('game'), SCREEN_WIDTH, SCREEN_HEIGHT);
const game = new Game(ctx, new Input());

game.changeScene(new OverworldScene(START_ROOM));
game.start();
