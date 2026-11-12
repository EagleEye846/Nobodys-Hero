import { ISLES_STAR_HELD } from './islesStarHeld.js';

// ISLES STAR BROUGHT: walking into Orla's forge with the Fallen Star and the shard won from the
// Figurehead on the ghost ship (superboss-ch5.md). She hears the two of them humming the same note before you've said a word (the
// hero never speaks), calls you over to the anvil, and the reforge happens there and then
// (`reforge`: the same as her shop's TALK topic, src/data/fallenStar.js). Then it goes on exactly
// as isles_star_held: the sword held up in the big light's shaft, the sparks, "Four stars now".
//
// The trigger (islesForge.js) is just inside each door (x 1 to 3 and 16 to 18, rows 9 to 10), with
// `forge: 'orla_forge'`: it only plays while that reforge is ready (the sword, the +2 done, the
// shard in your pockets). Without them nothing plays, and her shop is as it was. `marks` counts
// isles_star_held as watched too, so the shop never plays it again; and a player who reforged in
// the shop (isles_star_held seen, or starForged 3) never gets this one (`until`). Anyone who
// somehow walks past it (a save made inside the forge) still has the shop's "The star sword".
//
// The walk: along the way across (rows 9 to 10) to the middle of the room, then up to the anvil
// (the hero 6,5; Ves 5,6 and Bramble 7,6, clear of the sign at 4,8), where isles_star_held takes
// over. The forge has no monsters.
//
// (draft).
export const ISLES_STAR_BROUGHT = {
  id: 'isles_star_brought',
  room: 'isles_forge',
  once: true,

  // The same cast as isles_star_held (its steps follow on from these).
  actors: ISLES_STAR_HELD.actors,

  steps: [
    // Her hammer, and then it stops.
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.3 },
    { do: 'sound', name: 'clink' },
    { do: 'wait', seconds: 0.6 },
    { do: 'say', who: 'orla', text: '{gruff}Shut the door. The forge doesn\'t heat the whole...\n\n{annoyed}No. Wait. Stand still.' },
    { do: 'wait', seconds: 0.4 },
    { do: 'sound', name: 'shimmer' },
    { do: 'emote', who: 'bramble', emote: '!', wait: false },
    // (draft) "from the figurehead": the shard now comes from the ghost ship's guardian.
    { do: 'say', text: 'At your side, the Fallen Star is humming. In your pocket, the shard from the figurehead hums back. The same note.' },
    { do: 'say', who: 'orla', text: '{gruff}That\'s the one. Both of them. Over here, before it stops.' },
    // Across to the middle of the room, then up to the anvil.
    { do: 'walk', who: 'player', to: { x: 8, y: 9 }, wait: false },
    { do: 'walk', who: 'ves', to: { x: 7, y: 10 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 6, y: 10 } },
    { do: 'wait', seconds: 0.3 },
    { do: 'walk', who: 'ves', to: { x: 5, y: 6 }, wait: false },
    { do: 'walk', who: 'bramble', to: { x: 7, y: 6 }, wait: false },
    { do: 'walk', who: 'player', to: { x: 6, y: 5 } },
    { do: 'face', who: 'player', dir: 'up' },
    { do: 'face', who: 'ves', dir: 'up' },
    { do: 'face', who: 'bramble', dir: 'up' },
    { do: 'reforge', smith: 'orla_forge', marks: 'isles_star_held' },
    { do: 'say', text: 'Orla sets the shard on the anvil, beside the notch in the blade where it broke away.\n\nThen she stops. She looks at the sword in your hand, and then at you.' },
    { do: 'say', who: 'orla', text: '{gruff}...Before I start. Take it over to the window, where the big light comes down. Hold it up in that. I want to see something.' },
    ...ISLES_STAR_HELD.steps,
  ],
};
