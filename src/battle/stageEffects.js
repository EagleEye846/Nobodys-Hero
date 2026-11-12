import { PUPPET_STAGE } from './puppetStage.js';
import { CORRIE_STAGE } from './corrieStage.js';
import { FAIRWEATHER_STAGE } from './fairweatherStage.js';

// Stage effects a boss's phase can bring with it (`stage: '<name>'` on the
// phase, see the phases notes in battleScene.js): things that happen to the
// whole battle while that phase lasts, beyond what its attacks do. Each is an
// object of hooks, all optional:
//
//   start(battle, foe)              as the phase starts; returns what it
//                                   keeps (battle.stageState)
//   cue(battle, foe, name)          a `{ cue: name }` step of a beat
//   update(battle, dt)              every frame
//   drawBack(ctx, battle)           over the backdrop, before anyone's drawn
//   drawFoe(ctx, battle, foe, x, y, w, h)
//                                   draws the boss itself; returns true if it
//                                   did (or false to let the battle draw it)
//   drawOver(ctx, battle)           over the stage, under the box
//   boxSway(battle)                 { x, y } the box hangs off true by (it
//                                   only looks moved: see drawBox)
//   drawRigging(ctx, battle, sway)  what the box hangs from
//   drawBoxBack(ctx, battle, open)  in UI space: the box's back, instead
//                                   of the usual black (true if it drew)
//   drawBoxBorder(ctx, battle, open)
//                                   in UI space: its border, likewise
//   buttons(battle, commands)       per command button { dx, dy, turn, label }
//   drawStrings(ctx, battle, commands, sway)
//                                   in UI space, under the buttons
//   drawUi(ctx, battle)             in UI space, over the panel
//   sea(battle, soothed)            once a turn as its attack starts: the
//                                   water it puts in the box (tools.sea)
//   boxTurn(battle)                 radians the box is turned by (only how
//                                   it looks, like boxSway)
//   leave(battle, foe, how)         it's beaten or spared
//   skip(battle, foe)               straight to how things are once the
//                                   phase's beat is over (for previews)
//
// World-space hooks draw in the stage's pixels; UI-space ones at UI_SCALE.
export const STAGE_EFFECTS = {
  // King Peptup's last act: the puppet with a light in it (rumbold.js).
  puppet: PUPPET_STAGE,
  // Corrie, the Tidecaller's four phases: the tide, the whirlpool, the lamp (corrie.js).
  corrie: CORRIE_STAGE,
  // Madam Fairweather, the Figurehead: the box turns, star-light rings her (fairweather.js).
  fairweather: FAIRWEATHER_STAGE,
};
