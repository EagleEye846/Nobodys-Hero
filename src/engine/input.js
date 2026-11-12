// Maps physical keys to game actions, following Deltarune's defaults:
// arrows to move, Z/Enter to confirm, X to cancel (X or Shift to run), C/Ctrl for the menu
// (and holding C skips through dialogue).
// Our own additions: Space jumps, X held is focus while dodging, Shift uses
// your equipped weapon's soul ability, and Q (or Tab) switches between you and
// Bramble in the Hushwood (and E steers Bramble when Ves is along too). A key can trigger several actions.
// F goes fullscreen and back (unless you've given F to something).
//
// A controller works too (any pad the browser knows as "standard": Xbox,
// PlayStation, Switch Pro and most others), on the same actions: see PAD.
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
  // Shift runs and uses the soul ability, but never backs out of a menu (so
  // Windows' Win+Shift+S screenshot doesn't close what you're looking at).
  ShiftLeft: ['run', 'ability'], ShiftRight: ['run', 'ability'],
  ControlLeft: ['menu'], ControlRight: ['menu'],
  Tab: ['swap'],
  // The ghost ship's lantern, out and lit again (src/overworld/haunt.js).
  KeyL: ['lantern'],
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

// A controller's buttons, by their place in the browser's "standard" layout,
// and the actions each does. The bottom face button confirms and the right
// one backs out (held, it runs and focuses, like X); the left one jumps; the
// top one is the menu (held, it skips, like C). The shoulders are Shift (the
// soul ability, and running) and Q; the triggers are E and R. The d-pad and
// the left stick move. Start is the menu too.
const PAD = {
  0: ['confirm'], 1: ['cancel', 'focus'], 2: ['jump'], 3: ['menu', 'skip'],
  4: ['swap'], 5: ['run', 'ability'], 6: ['swapB'], 7: ['regroup'],
  8: ['lantern'], 9: ['menu'],
  12: ['up'], 13: ['down'], 14: ['left'], 15: ['right'],
};
// What the menus call each action's button, on a controller.
const PAD_NAMES = { confirm: 'A', cancel: 'B', jump: 'X', menu: 'Y', skip: 'Y', swap: 'LB', run: 'RB', ability: 'RB', swapB: 'LT', regroup: 'RT' };
// How far the stick has to lean before it counts as a press.
const STICK_DEADZONE = 0.5;

// The name to show for the button doing `action` now: the key's name, or
// the controller's button if that's what you last pressed something on.
let lastDevice = 'keys';
export function promptName(action) {
  if (lastDevice === 'pad' && PAD_NAMES[action]) return PAD_NAMES[action];
  return keyName(keyFor(action));
}

// Fullscreen on and off (the F key, and the FULLSCREEN option). Browsers
// only allow it straight after a key press or a click.
export function isFullscreen() {
  return Boolean(document.fullscreenElement);
}
export function toggleFullscreen() {
  try {
    const done = isFullscreen() ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.();
    done?.catch?.(() => {});
  } catch {
    // Not allowed here (an embedded page, say): nothing happens.
  }
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
    // Any key or button at all went down this frame (the PAUSED card waits for one).
    this.anyPressed = false;
    // The actions the controller's buttons are holding down right now.
    this.padHeld = new Set();
    // RUN set to TOGGLE: whether you're running now (tapping run flips it).
    this.runLatched = false;

    window.addEventListener('keydown', (event) => {
      lastDevice = 'keys';
      if (!event.repeat) this.anyPressed = true;
      // Waiting for a key to give an action (the OPTIONS screen): it takes it.
      if (this.capture) {
        event.preventDefault();
        if (!event.repeat) this.captured = event.code;
        return;
      }
      const actions = KEY_BINDINGS[event.code];
      if (!actions) {
        if (event.code === 'KeyF' && !event.repeat) toggleFullscreen();
        return;
      }
      event.preventDefault();
      if (!event.repeat) for (const action of actions) this.press(action);
      this.heldKeys.add(event.code);
    });
    window.addEventListener('keyup', (event) => this.heldKeys.delete(event.code));
    // Releasing keys while the tab is unfocused never fires keyup.
    window.addEventListener('blur', () => {
      this.heldKeys.clear();
      this.padHeld.clear();
    });
  }

  press(action) {
    this.pressedActions.add(action);
    // A run tap only flips the latch if something reads run this frame (the
    // overworld does; a battle doesn't, so Shift as the soul ability leaves it be).
    if (action === 'run') this.runTap = true;
  }

  // Reads the controller (once a frame, before the scene updates): a button
  // going down is a press, the same as a key.
  pollPads() {
    const pads = navigator.getGamepads?.() ?? [];
    const held = new Set();
    for (const pad of pads) {
      if (!pad || !pad.connected) continue;
      pad.buttons.forEach((button, i) => {
        if (button?.pressed && PAD[i]) for (const action of PAD[i]) held.add(action);
      });
      const [x = 0, y = 0] = pad.axes;
      if (x < -STICK_DEADZONE) held.add('left');
      if (x > STICK_DEADZONE) held.add('right');
      if (y < -STICK_DEADZONE) held.add('up');
      if (y > STICK_DEADZONE) held.add('down');
    }
    for (const action of held) {
      if (this.padHeld.has(action)) continue;
      lastDevice = 'pad';
      this.anyPressed = true;
      if (this.capture) continue;
      this.press(action);
    }
    this.padHeld = held;
  }

  // True while any key (or button) bound to the action is held. With RUN on
  // TOGGLE, running is on once tapped, and holding the run key walks.
  isDown(action) {
    const held = this.heldDown(action);
    if (action === 'run' && SETTINGS.runMode === 'toggle') {
      if (this.runTap) {
        this.runLatched = !this.runLatched;
        this.runTap = false;
      }
      return this.runLatched !== held;
    }
    return held;
  }

  heldDown(action) {
    if (this.padHeld.has(action)) return true;
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
    this.anyPressed = false;
    this.runTap = false;
  }
}
