# What's new

## Fixes (20 October 2026)

- **Z at the foot of a face sometimes did nothing.** Where a face's first ring
  is in the tile right in front of you (the Shoulder, the Broken Span),
  pressing Z picked up the ring prop instead of throwing the rope, and ring
  props have nothing to say. Rings are now skipped by the press and left to
  the climb (`OverworldScene.interact`).
- **The throw is more forgiving**: it works from the ring's column or one
  column either side (`findClimb` in `src/overworld/climbing.js`), and when
  a ring is near but you can't throw (up on a block, not close enough under
  it) it says so instead of nothing (`ring_from_block`, `ring_too_far` in
  `text/interactions/gear.txt`).
- **The Ice Pick alcove** in the Singing Gallery could be jumped into but
  not out of (nothing low inside to jump up from). Two low blocks added.
- **New tool**: `python tools/headless.py <url>` runs a preview/textCheck page
  in headless Edge and waits for it to finish (song renders take real time).
- The Usurper's fight plays a new, all-orchestra theme, "Who Would Be Hero"
  (`usurperHeroTheme.js`); the three unused movements and the mix stay in
  the music list.

Everything that changed in the big Mount Vigil session (17 October 2026),
grouped so you can find it again. Files are named where it helps.

## Climbing (the rope)

- **Swing for distance.** Hold left or right along with your swing to pump it
  higher; holding against it slows you; let go of both and it dies down. Reach
  grows with momentum (about 2 tiles at the gentlest swing, 6 at full), and
  it grows faster the harder you swing. You keep 90% of your swing when you
  catch the next ring. (`src/overworld/climbing.js`, tuning at the top.)
- **The rope stretches** with momentum, up to ¾ of a tile, and the stretch
  helps most with rings straight above you.
- **The grab window widens** with momentum (about twice as long at full swing).
- **A marker shows the ring you'd catch**: faint when it's in reach, bright
  when pressing Z now would catch it.
- **Climbs carry on through doors**: a door with `climb: true` hooks you to the
  next room's first ring as you arrive, with the swing you had.
- Swinging high: the top of the swing is nearly level with the ring.
- Momentum builds fast (~¾ s to a full swing), slows fast when you hold against it.
- The Sheer Face's north door now leads onto Mount Vigil.
- Strong Arms (skill) pumps the swing 50% faster.

## Mount Vigil: the spinning mountain (9 rooms)

The spire you climb round, drawn bent round a cylinder so the whole mountain
turns under you as you walk, with the valleys, clouds, sun and birds turning
behind (`wraps`, `vista`; `OverworldScene.drawSpire`, `src/overworld/vista.js`).

1. **The Ridge** (`vigil_ridge`): three ledges, two swing climbs and one throw,
   a rockfall crossed over fallen blocks, a plank bridge over the drop, a chest
   (Frostberry Jam), a save crystal, a waymark, a cairn with a seventh stone.
2. **The Spiral Stair** (`vigil_spiral`): the great stair winding round the
   spire in runs, a broken run bridged with planks, a tally stone ("7?" "8"),
   a save crystal, rings up a sheer bit, fallen blocks up to a shelf with a
   chest (Herald's Cloak).
3. **The Hollow** (`vigil_hollow`): first snow, a cave mouth into the spire, a
   spur with a chest (Snowmelt Tea), a cold camp with a pack (Herald Honeycake),
   a save crystal.
4. **The Ice Caves** (`cave_entry`): dark, with glowing ice crystals for light,
   stalactites to walk under, stalagmites, a frozen pool, a chest (**Vigil
   Mail**, the Hero's own armour), a pack (Hot Cocoa), a save crystal.
5. **The Singing Gallery** (`cave_gallery`): a great chamber with a frozen
   lake, a forest of stalagmites, a walled alcove reached over blocks with
   the **Ice Pick** in it, the heralds' Book of Arrivals (the six who came
   before), a pack (Fanfare Fudge), a save crystal.
6. **The Shoulder** (`vigil_shoulder`): out into the snow; the heralds' camp
   (a fire that never goes out, a tent, cocoa with a note), a snowman, a
   cairn, the **Keeper** waiting with advice (cutscene), a save crystal, an
   ice face, a bridge, a chest (Fur-Lined Hood).
7. **The Ice Face** (`vigil_ice_face`): three pitches of rings; the third
   goes over the top into the next room without a pause. A chest (Ringer's
   Mittens), a save crystal.
8. **The Knife Edge** (`vigil_knife_edge`): the climb carried on; a long
   zigzag pitch, a second with a long sideways catch, a save crystal, a chest
   (Herald Honeycake), blocks up to the stair, a tally stone with a fresh
   seventh mark.
9. **The Cloud Walk** (`vigil_cloud_walk`): above the clouds; a ramp of stair,
   a bridge, one more face, a chest (Heralds' Soup), and a swept stair between
   lamps and banners up to the gate.

Plus: snow, ice, cave and village **tiles** (`_ n i z g A E Y Q a w e f k K q
v ^ x t`), the cliff face and the stair take snow next to snow, blocks go
snowy; two new **regions** (MOUNT VIGIL, HERALDS' REST) with title cards and
battle backdrops; **birds** circling the spire; **snow** weather with wind;
**wisps of cloud** blowing across high up; **pebbles** trickling down the face
while you climb; the Keeper leaves the Ruins once you've met him up here.

## Heralds' Rest: the village (9 rooms)

10. **The Gate** (`rest_gate`): the arch ("HERALDS' REST. WELCOME, HERO."),
    lamps, banners, a notice board a hundred years deep, a save crystal, and
    **Pip** on lookout (he fweeps; and he joins you: see the party).
11. **The square** (`rest_square`): the frozen fountain, the ice statue of
    the Hero (re-carved yearly from a guess), four lamps, benches, a brazier,
    a skating pond (slippery!), a snowman, barrels, skis, a save crystal, the
    Keeper by the fountain, and the villagers: **Horace** (Head Herald, with
    a four-hour speech), **Marta** (knitting a scarf that goes round the
    square), **Pottle** (unconvinced), **Bram** (lost his trumpet), **Old
    Nan** (an ancient goat who bites, affectionately), a **snow hare**,
    **Wick** (the oldest, who remembers the scholar with the lantern), a
    chough.
12. **The Soft Beds** (`rest_inn`): Greta, soup that's never off, a fire, and
    beds you can **sleep in to restore HP** (with a hook for a dream). Tamsin
    by the fire, who went past the second cairn and came back quiet.
13. **Rest Stores** (`rest_stores`): Fennick's shop (see shops).
14. **The Hall of Heralds** (`rest_hall`): the feast table laid for a hundred
    years, the Hero's chair ("RESERVED"), trumpets, two hearths, the Book of
    Arrivals, and the fanfare band rehearsing (Ada, Ollo, Nib, Maestro Pell).
15. **The Bell Tower** (`rest_belltower`): Dunstan and the bell (ring it; it
    goes BONNNG; ring it after dark and see what happens), the bell log.
16. **Marta's** (`rest_house_marta`): her cottage, her hare Button, a drawer
    with pine candy.
17. **The Pottles'** (`rest_house_pottle`): Mrs Pottle's kitchen (a honeycake
    for you), the kids' drawings of the Hero (with wings, a dog, a very large hat).
18. **The Lookout** (`rest_lookout`): the platform over the cloud sea, the
    telescope aimed at the summit (look through it at night), Sedge on watch,
    a save crystal, a chest (Fanfare Fudge), and the stair north to the summit
    (to be built).

Everything in the village has words when you press Z on it (about 120
things). Fifteen NPCs each with first and repeat lines (`text/npcs/`).

## Day and night, and the small things

- A **day every 14 minutes of play**: dawn and dusk go gold, night goes deep
  blue with stars, a moon and shooting stars; outdoors, every lamp, lit window,
  fire and crystal keeps a pool of light. Some things say different words
  after dark (the bell, the lamps, the telescope).
- **Footprints** in the snow (they fade), **breath** in the cold, snow kicked
  up when you land, **snow settling on your head** when you stand still in a
  snowfall.
- **Ice is slippery**: you skate, overshoot and bump off things; you're
  **reflected** in it.
- **Ambient sound** under the music: wind that gusts (and whistles high up),
  birds, cave drips with an echo, a low hum in the Gallery, a crackling fire
  indoors (`ambience` per room).
- The **cylinder** is drawn per pixel column (no shimmer when turning), lit on
  the sun side and shaded on the other, with a bright rim.
- **Lamplight in the village** (`src/overworld/lamplight.js`): after dark the
  square goes deeper blue than the open mountain and every street lamp,
  brazier, lit window and open cabin door pools warm, flickering light on the
  snow (by day only a faint warmth). Indoors, the houses are dim and warm
  between their fires and candles, darker at night, and the chapel's stained
  glass lets in daylight, then moonlight. It's never a dark room: your candle
  doesn't burn.
- **Cleaner village tiles**: snow is one even white with a few soft drifts
  (no more patchwork of tiles or speckles), lanes are neat courses of rounded
  cobbles with a clean snow bank along their edges, the pond is clear ice with
  long streaks of shine, log walls run unbroken with log ends at the corners,
  roofs are smooth snow with tidy eaves and icicles, and cabin doors are
  wooden doors with firelight inside. The cliff tops and faces up the mountain
  are calmer too.

## Music

- **"Thin Air"** (`vigilTheme.js`), Mount Vigil: atmospheric and slow, 92 BPM,
  about 3½ minutes: wind, ascent, ledge, a held breath, the Long Stair's tune
  on the horn, ice (bells, harp, piano), a long rising climb, the peak, and it
  thins back to the wind. Flute, violin, horn, brass, harp, bells, piano,
  cello, low strings, ticking strings, string section, choir, pizzicato
  basses, a drone, heartbeat, timpani, snare, cymbal.
- **"Soup's On"** (`restTheme.js`), Heralds' Rest: jolly, 116 BPM, bells over
  an oom-pah with sleigh bells, a flute, and the prophecy's tune as the
  heralds' fanfare on brass.
- **"The Hollow Mountain"** (`cavesTheme.js`), the caves: "Thin Air" at a
  quarter speed on a music box, with drips, cello, choir, a drone.
- New sound effects: a bell, a bedtime chime.

## Battles, HP and the party

- **HP carries between battles.** Food, Heal Pulse/Mend, levelling up and the
  inn restore it; a fall restores it. The menu shows HP x/y.
- **No running from bosses**: RUN is dimmed and doesn't cost your turn.
- **Chapter 2 enemies hit harder**: Loose Step and Craghorn are busier,
  quicker and do 9 damage.
- **Speech bubbles no longer overlap** an enemy's name and bars.
- **Taper notices you spared her**: new lines at home after sparing (and a
  general system: `[first after <scene>]` / `[repeat after <scene>]` for any NPC).
- **Party members** (`src/characters/party.js`): Pip is built. He follows you
  (vanishes on the rope, reappears after), takes a turn after yours in every
  battle (FANFARE: MERCY +10% all and SP +10%; CHEER: heal; HIDE: guard),
  and has his own skill branch and points. He joins when you talk to him at
  the gate (move this where you like: a cutscene step `join` exists too).

## Skills, spells and shops

- **New spells**: Mend, Ember Flare (hits everyone), Bright Ward (halves
  damage for two turns), Hush (MERCY for everyone), Comet (80 damage).
- **16 new Chapter 2 skills** across the branches and a new **GRACE** branch
  (Kind Word, Hush, Gentle Hands, Haggler): Ember Flare, Heavy Hand, Comet,
  Kindling, Thrift, Mending Light, Bright Ward, Warm Heart, Iron Will, Strong
  Arms, Mountain Legs, Lucky Pockets.
- **The skill tree was redrawn**: tabs across the top, aurora and nebulae,
  stars that pulse when learnable, a glass panel, labels that fit, scrolling
  for tall branches, and the member's tab when someone's joined.
- **Shops sell and buy**: SELL (half price, nothing you're wearing); **skill
  points for 500 gold** (one at Moss's, two at Rest Stores); each shop has its
  own keeper and colours. Rest Stores sells snacks, the Herald's Trumpet,
  Fur-Lined Hood, Ringer's Mittens and the Snow Mantle.
- New items (Pine Candy, Snowmelt Tea, Frostberry Jam, Hot Cocoa, Herald
  Honeycake, Fanfare Fudge, Heralds' Soup), armor (Herald's Cloak, Fur-Lined
  Hood, Ringer's Mittens, Vigil Mail, Snow Mantle) and weapons (Ice Pick,
  Herald's Trumpet), each with its words.

## Fixes

- Chests holding a weapon froze the game (the Gallery's Ice Pick). Fixed, and
  every interactable in the game is now pressed by a test.
- Coming up the Spiral Stair into the Hollow bounced you straight back (you
  spawned on the exit tile). Fixed, and spawns are checked against doors.
- The floor only crumbles in the Ruins now.
- The cylinder no longer jitters: per-pixel mapping instead of stretched columns.

## Docs and tools

- `README.md` is now just how to install and play (Python required).
- `docs/DEVELOPERS.md`: the full guide (moved from the README) plus the new
  systems. `docs/mountain-enemies.md`: six enemies designed for the mountain.
  `docs/party-member-ideas.md`: who could join, and how.
- `tools/preview.html`: stills of any room at any time of day, room and song
  checks, the poke-everything test, the skill tree.
- The Room Editor knows the new tiles.
