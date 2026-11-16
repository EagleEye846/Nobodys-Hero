import { HERO_STATE } from '../characters/heroState.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { inParty } from '../characters/party.js';
import { textFile, textSection } from '../engine/textLoader.js';
import { sfx } from '../audio/music.js';
import { COLLECTIONS, COLLECTION_OF, collectionCount, collectionDone } from '../data/collections.js';
import { GEAR, giveGear } from '../data/gear.js';

// Picking up one piece of a collectible set (src/data/collections.js): what you find, its name
// and how many of the set you have now ("Sea glass: 4 of 10"); then the friend's say on it, if
// they're with you; and on the set's last piece, the reward (a keepsake and a little gold), with
// words of its own. Called from takeGift in overworldScene.js for a prop that `gives` a piece.
const TEXT = 'interactions/collections.txt';
// The text sections say `ves`; the party knows her as `vesper`.
const MEMBER = { ves: 'vesper', bramble: 'bramble' };

// `scene` is the OverworldScene, `prop` the thing on the floor. Gives back true when it's one
// of the pieces (and has been dealt with), false for anything else.
export function takeCollectible(scene, prop) {
  const id = prop.gives;
  const set = COLLECTION_OF[id];
  if (!set) return false;
  const data = COLLECTIONS[set];
  const piece = data.pieces.find((one) => one.id === id);
  giveGear(id);
  const { got, total } = collectionCount(set);
  const pages = [...textSection(TEXT, id), `You got: ${piece.name}.\n${data.count}: ${got} of ${total}.`];
  const friends = [];
  // Who answers: the one that piece is for, if they're along.
  const friend = (key) => {
    const words = textFile(TEXT)[key];
    return words?.length ? words : null;
  };
  const answer = (name, section) => {
    const lines = friend(`${section}_${name}`);
    if (lines && inParty(MEMBER[name])) friends.push([lines, MEMBER[name]]);
  };
  answer(piece.who, id);
  // The last piece: the reward, once.
  const reward = data.reward;
  if (collectionDone(set) && !HERO_STATE.gear.includes(reward.gear)) {
    giveGear(reward.gear);
    HERO_STATE.gold += reward.gold ?? 0;
    pages.push(...textSection(TEXT, `${set}_done`));
    const who = ['ves', 'bramble'].find((name) => inParty(MEMBER[name]) && friend(`${set}_done_${name}`));
    if (who) friends.push([friend(`${set}_done_${who}`), MEMBER[who]]);
    sfx('coins');
  }
  sfx('pickup');
  WORLD_STATE.taken ??= [];
  WORLD_STATE.taken.push(prop.key);
  prop.markTaken();
  scene.textbox.open(pages);
  // The friends answer after the words (as queueReactions does).
  if (friends.length) {
    const next = () => {
      const [lines, who] = friends.shift();
      scene.textbox.open(lines, who);
      if (friends.length) scene.afterText = next;
    };
    scene.afterText = next;
  }
  return true;
}

// The reward gear's names, for the journal page (a set's keepsake).
export const rewardName = (set) => GEAR[COLLECTIONS[set].reward.gear]?.name ?? '';
