// Maps physical keys to game actions, following Deltarune's defaults:
// arrows to move, Z/Enter to confirm, X/Shift to cancel (and run), C/Ctrl for the menu
// (and holding C skips through dialogue).
// Our own additions: Space jumps, X held is focus while dodging, Shift uses
// your equipped weapon's soul ability, and Q (or Tab) switches between you and
// Bramble in the Hushwood (and E steers Bramble when Ves is along too). A key can trigger several actions.
import { SETTINGS } from '../state/settings.js';

// The key each rebindable action starts on. The OPTIONS screen changes these
// (kept in SETTINGS.keys); the keys in EXTRA_KEYS always work as well, unless
// you give one of them to another action.
export const DEFAULT_KEYS = {
  up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
  confirm: 'KeyZ', cancel: 'KeyX', menu: 'KeyC', swap: 'KeyQ', jump: 'Space',
  // Chapter 5, with the whole party: E steers Bramble (Q steers Ves), and R calls everyone back to you.
  swapB: 'KeyE', regroup: 'KeyR',
  // Held: flicks through dialogue, and skips a cutscene you've seen. Shares C with the menu.
  skip: 'KeyC',
};
// Actions that ride along with another: X held is focus.
const COMPANIONS = { cancel: ['focus'] };
const EXTRA_KEYS = {
  KeyW: ['up'], KeyS: ['down'], KeyA: ['left'], KeyD: ['right'],
  Enter: ['confirm'],
  ShiftLeft: ['cancel', 'ability'], ShiftRight: ['cancel', 'ability'],
  ControlLeft: ['menu'], ControlRight: ['menu'],
  Tab: ['swap'],
};
// Keys that can't be given to an action (they're kept for the extras above, or
// the browser).
export const RESERVED_KEYS = ['Escape', 'Enter', 'Tab', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'KeyM'];

// The key now doing `action`.
export function keyFor(action) {
  const code = SETTINGS.keys?.[action];
  return typeof code === 'string' && code ? code : DEFAULT_KEYS[action];
}

// A key's name as the menus show it ('KeyZ' is Z, 'ArrowUp' is UP).
export function keyName(code) {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Arrow')) return code.slice(5).toUpperCase();
  if (code.startsWith('Numpad')) return `PAD ${code.slice(6).toUpperCase()}`;
  return code.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
}

// Every key and the actions it triggers, worked out from the settings.
export function buildBindings() {
  const map = {};
  for (const [code, actions] of Object.entries(EXTRA_KEYS)) map[code] = [...actions];
  const claimed = new Set();
  for (const action of Object.keys(DEFAULT_KEYS)) {
    // SKIP may sit on the same key as MENU (it does at the start); on its own it adds itself.
    if (action === 'skip') continue;
    const code = keyFor(action);
    // A key given to one action is taken off any other (or doubled-up) one.
    if (claimed.has(code)) continue;
    claimed.add(code);
    map[code] = [action, ...(COMPANIONS[action] ?? [])];
  }
  const skipKey = keyFor('skip');
  map[skipKey] = [...(map[skipKey] ?? []), 'skip'];
  return map;
}

let KEY_BINDINGS = buildBindings();
// Called after the keys change, so the new ones work straight away.
export function refreshBindings() {
  KEY_BINDINGS = buildBindings();
}

export class Input {
  constructor() {
    this.heldKeys = new Set();
    this.pressedActions = new Set();
    // Set by the OPTIONS screen while it waits for a new key.
    this.capture = false;
    this.captured = null;

    window.addEventListener('keydown', (event) => {
      // Waiting for a key to give an action (the OPTIONS screen): it takes it.
      if (this.capture) {
        event.preventDefault();
        if (!event.repeat) this.captured = event.code;
        return;
      }
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
      if (KEY_BINDINGS[code]?.includes(action)) return true;
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
