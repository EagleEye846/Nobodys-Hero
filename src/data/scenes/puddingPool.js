// PALE'S POOL (secret, draft: every line here): the four scenes of the
// chapter 4 superboss, in `diggings_star_pool`.
//
//   pudding_wakes   the first time you step up to the water: the shelf, the
//                   seven mugs and the dish, the sword humming, and the PALE
//                   OLM coming up through the stone. Ends in the battle.
//   pudding_again   the same moment, short, for every try after that (a
//                   retreat, or a game over), until the fight is over.
//   pudding_spared  the end of the TALK: it hiccups the shard up onto the
//                   shelf and goes to sleep in the dish.
//   pudding_beaten  the end of the fight: the glass lets go, the pool goes
//                   dark, and the shard is left in the dish.
// The lore under it (14 Nov 2026): the olm wished on the star that the miners
// would come back after lunch, and got their voices and their things instead.
// Sparing it lets the wish go (it gives the voices back); beating it breaks it.
// Both endings give the Deep Star Shard (Hobnail's forging, fallenStar.js) and the
// Olm-Glass Mantle.
//
// The hero never speaks. Ves is dry. Bramble isn't with you in chapter 4.
// Clearance: the walks stay in columns 6 to 9, rows 6 to 10 (no monsters in the room).
// The battle itself is src/data/enemies/pudding.js.

const VES_AT = { id: 'ves', look: 'prop:vesper_stand', x: 6, y: 9, portrait: 'vesper', plays: 'vesper' };

export const PUDDING_WAKES = {
  id: 'pudding_wakes',
  room: 'diggings_star_pool',
  once: true,
  actors: [VES_AT],
  steps: [
    { do: 'walk', who: 'player', to: { x: 8, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 7, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: 'The shaft ends in a pool, and the pool is lit from underneath. A cold light, the colour of the shard, wavers across the glassy walls and the roof.\n\nThe water is perfectly still. The sword, on your back, is humming so hard you can feel it in your teeth.' },
    // The shelf.
    { do: 'camera', to: { x: 4, y: 4 } },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', text: 'On the dry side, against the wall, someone has put up a plank shelf. A kettle. Seven tin mugs in a row, one of them chipped. And at the end, set a little apart, a small, flat tin dish, with a ring worn into the bottom of it.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Seven mugs again. And a dish.' },
    { do: 'say', who: 'ves', text: '{bored}Nobody puts a dish by the kettle for themselves.' },
    { do: 'camera' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'In the middle of the pool, a single ring spreads out across the water. Then another, further down.\n\nThe stone at the edge ripples. Not the water. The stone.' },
    { do: 'quake', amount: 1, seconds: 1.4 },
    { do: 'sound', name: 'crumble' },
    { do: 'say', who: 'ves', text: '{scared}That is not how rock behaves.' },
    { do: 'sound', name: 'splash' },
    { do: 'say', text: 'Something long and pale comes up out of the wall the way a drowned thing rises, and the stone closes behind it without a mark. Its skin is like wet glass. You can see right through it: the long white spine, the gills hanging off its head like raw red feathers, the star burning in its belly.\n\nAnd turning slowly round the star, the way things turn in a jar: a hard hat. A boot. A tin mug.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', text: 'It stops. It does not drift, or breathe. Its blind head faces the shelf, and its mouth is a thin seam that runs back nearly to its gills.\n\nThen, without seeming to move at all, it is facing you.' },
    { do: 'say', who: 'ves', text: '{surprised}There\'s a hat in it. {scared}...There\'s a boot in it.' },
    { do: 'say', who: 'ves', text: '{determined}Right. It knows we\'re here. Don\'t ask me how. Ready when you are.' },
    { do: 'battle', enemy: 'pudding', still: true, spared: 'pudding_spared', defeated: 'pudding_beaten' },
  ],
};

export const PUDDING_AGAIN = {
  id: 'pudding_again',
  room: 'diggings_star_pool',
  // Every time, until the fight is over.
  once: false,
  actors: [VES_AT],
  steps: [
    { do: 'walk', who: 'player', to: { x: 8, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 7, y: 9 } },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'sound', name: 'shimmer' },
    { do: 'say', text: 'The ring spreads across the pool again. The stone goes soft.\n\nThe long pale shape comes up out of the wall with everything it kept turning inside it, and faces the shelf, and then, all at once, you.' },
    { do: 'quake', amount: 1, seconds: 1.0 },
    { do: 'say', who: 'ves', text: '{bored}Back already. It\'s very patient. I wish it wasn\'t.' },
    { do: 'battle', enemy: 'pudding', still: true, spared: 'pudding_spared', defeated: 'pudding_beaten' },
  ],
};

export const PUDDING_SPARED = {
  id: 'pudding_spared',
  room: 'diggings_star_pool',
  once: true,
  actors: [VES_AT],
  steps: [
    // "Seven Mugs" finishes the whistle at last: the coda, played once.
    { do: 'music', song: 'puddingBattle', section: 'afterLunch' },
    { do: 'walk', who: 'player', to: { x: 8, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 7, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'camera', to: { x: 4, y: 4 } },
    { do: 'wait', seconds: 0.8 },
    { do: 'say', text: 'The light in the pool goes out like a lamp being turned down at the end of a long evening. The glass in the walls clouds, and is stone again.\n\nOn the shelf, in the little tin dish, a plain pale cave olm the size of a slipper lies curled round a dull grey lump, with its chin on the rim. Round the dish, set out neatly where the glass let go of them: a hard hat, one boot, a tin mug, and a pocket watch, still ticking.' },
    { do: 'wait', seconds: 0.8 },
    { do: 'sound', name: 'clink' },
    { do: 'say', text: 'It hiccups. Something small and hard bounces off the rim of the dish and rolls to a stop beside the kettle.\n\nIt does not look round to see whether you noticed. It doesn\'t say anything, in anybody\'s voice. It doesn\'t need to now.' },
    { do: 'say', who: 'ves', text: '{surprised}It gave it back. It coughed it up and it gave it back. {bored}After the boot, I\'m choosing to find that polite.' },
    { do: 'sound', name: 'starGet' },
    { do: 'give', item: 'star_shard_deep' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'On a nail at the end of the shelf hangs a coat that something large has kept very close for a very long time: heavy, grey-blue, cold and faintly damp, and stitched all over with glassy beads that catch the light.\n\nThere is a tag pinned to it, in a hand in no hurry: FOR WHOEVER CAME BACK.' },
    { do: 'give', item: 'olmglass_mantle' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{smile}Back after lunch.' },
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'say', who: 'ves', text: '{thoughtful}Hobnail said to bring him a star. {bored}I\'m not telling him where it\'s been.' },
    { do: 'wait', seconds: 0.3 },
  ],
};

export const PUDDING_BEATEN = {
  id: 'pudding_beaten',
  room: 'diggings_star_pool',
  once: true,
  actors: [VES_AT],
  steps: [
    { do: 'walk', who: 'player', to: { x: 8, y: 8 } },
    { do: 'walk', who: 'ves', to: { x: 7, y: 9 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'crumble' },
    { do: 'say', text: 'The glass lets go all at once, and it is very quiet. Pieces of light come down through the pool like snow in a bottle, and with them, slowly, everything it kept: a hard hat, one boot, a tin mug, a pocket watch. They settle on the bottom one by one, and the light goes out.\n\nThe water is just water. The walls are just rock. The long, patient shape in the stone is not there.' },
    { do: 'camera', to: { x: 4, y: 4 } },
    { do: 'wait', seconds: 0.6 },
    { do: 'sound', name: 'clink' },
    { do: 'say', text: 'On the shelf, in the little tin dish, a small dull thing glows, very faintly, like a coal that has not quite made up its mind. It has rolled into the ring worn in the bottom, as if that were where it was always kept.' },
    { do: 'sound', name: 'starGet' },
    { do: 'give', item: 'star_shard_deep' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'On a nail at the end of the shelf, behind the kettle, hangs a coat that something large has kept very close for a very long time: heavy, grey-blue, cold and faintly damp, and stitched all over with glassy beads that catch the light.\n\nThere is a tag pinned to it, in a hand in no hurry: FOR WHOEVER CAME BACK.' },
    { do: 'give', item: 'olmglass_mantle' },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{sad}It only wanted them back after lunch. Seven mugs and a dish.' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'ves', text: '{thoughtful}...It kept their things. All this time. {bored}Pour one anyway, would you? The kettle\'s here. I won\'t say anything.' },
    { do: 'wait', seconds: 0.3 },
  ],
};

// THE WHISTLE (draft: every line): the three pieces of the seventh shift's end-of-shift
// whistle, found in the Glimmering (the pea), Belowtown (the mouthpiece) and the
// Stillwater (the barrel), brought to the sealed crack in Seam Nine. Put together and
// blown, three long notes down and one short up, the glass over the crack rings itself
// open. Plays on the first walk down the crack's corridor with all three (the trigger is
// in diggingsLostSeam.js). The door to the Scorch only opens after it.
// Clearance: the walk is column 3, rows 12 to 13, nothing else in the corridor.
export const WHISTLE_BLOWN = {
  id: 'whistle_blown',
  room: 'diggings_lost_seam',
  once: true,
  actors: [{ id: 'ves', look: 'prop:vesper_stand', x: 3, y: 11, portrait: 'vesper', plays: 'vesper' }],
  steps: [
    { do: 'walk', who: 'player', to: { x: 3, y: 13 } },
    { do: 'walk', who: 'ves', to: { x: 3, y: 12 } },
    { do: 'face', who: 'player', dir: 'down' },
    { do: 'face', who: 'ves', dir: 'down' },
    { do: 'wait', seconds: 0.4 },
    { do: 'say', text: 'The skin of glass over the crack is thicker up close. Under it the hum goes on, patient, like someone waiting at the bottom of a staircase.\n\nIn your pockets, three small brass things have been getting warmer the closer you came.' },
    { do: 'say', who: 'ves', text: '{thoughtful}Pea, mouthpiece, barrel. Three miners, three pockets, three places, and not one of them thought to write down the order. {smile}Well. It is a whistle. It can only go together one way.' },
    { do: 'take', item: 'whistle_pea' },
    { do: 'take', item: 'whistle_mouth' },
    { do: 'take', item: 'whistle_barrel' },
    { do: 'sound', name: 'click' },
    { do: 'give', item: 'shift_whistle' },
    { do: 'say', text: 'The barrel slides into the mouthpiece with a click that is very pleased with itself, and the pea drops in through the slot and rattles home.' },
    { do: 'say', who: 'ves', text: '{bored}Three long notes down. One short note up. I am told he likes it.' },
    { do: 'sound', name: 'whistle' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'whistle' },
    { do: 'wait', seconds: 0.5 },
    { do: 'sound', name: 'whistle' },
    { do: 'wait', seconds: 0.7 },
    { do: 'sound', name: 'shimmer' },
    { do: 'quake', amount: 1, seconds: 1.2 },
    { do: 'say', text: 'The glass over the crack rings. Not a crack: a note, the fourth one, the short one going up. It runs away down into the floor like a stone dropped in a well, and the skin of glass lets go of the rock and slides aside without a sound.\n\nBelow, something very large whistles the tune back, in a man\'s breath, a bit flat. Then it goes quiet, listening.' },
    { do: 'say', who: 'ves', text: '{scared}It joined in. {bored}The rules said it does that. {scared}They didn\'t say it had a man\'s voice.' },
    { do: 'say', who: 'ves', text: '{determined}...Right. Rules are for people who are not going down there. After you.' },
    { do: 'wait', seconds: 0.3 },
  ],
};
