// Maps physical keys to game actions, following Deltarune's defaults:
// arrows to move, Z/Enter to confirm, X/Shift to cancel (and run), C/Ctrl for the menu
// (and holding C skips through dialogue).
// Our own additions: Space jumps, X held is focus while dodging, and Shift uses
// your equipped weapon's soul ability. A key can trigger several actions.
const KEY_BINDINGS = {
  Space: ['jump'],
  ArrowUp: ['up'], KeyW: ['up'],
  ArrowDown: ['down'], KeyS: ['down'],
  ArrowLeft: ['left'], KeyA: ['left'],
  ArrowRight: ['right'], KeyD: ['right'],
  KeyZ: ['confirm'], Enter: ['confirm'],
  KeyX: ['cancel', 'focus'],
  ShiftLeft: ['cancel', 'ability'], ShiftRight: ['cancel', 'ability'],
  KeyC: ['menu', 'skip'], ControlLeft: ['menu'], ControlRight: ['menu'],
};

export class Input {
  constructor() {
    this.heldKeys = new Set();
    this.pressedActions = new Set();

    window.addEventListener('keydown', (event) => {
      const actions = KEY_BINDINGS[event.code];
      if (!actions) return;
      event.preventDefault();
      if (!event.repeat) for (const action of actions) this.pressedActions.add(action);
      this.heldKeys.add(event.code);
    });
    window.addEventListener('keyup', (event) => this.heldKeys.delete(event.code));
    // Releasing keys while the tab is unfocused never fires keyup.
    window.addEventListener('blur', () => this.heldKeys.clear());
  }

  // True while any key bound to the action is held.
  isDown(action) {
    for (const code of this.heldKeys) {
      if (KEY_BINDINGS[code].includes(action)) return true;
    }
    return false;
  }

  // True only on the frame the action was first pressed.
  wasPressed(action) {
    return this.pressedActions.has(action);
  }

  endFrame() {
    this.pressedActions.clear();
  }
}
