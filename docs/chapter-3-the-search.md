# Chapter 3: The Search (design brainstorm)

> **Built so far (20 October 2026): the Pinefall's rooms, no enemies.** The
> forest is a scarlet autumn wood in the spirit of Deltarune's Scarlet Forest
> (the user's reference): dark leaf litter (`d`), pale paths (`y`), scarlet
> trees (`L`) and bramble hedges (`Z`), and a run of small rooms with one idea
> each. In order: `pinefall_landing` (where you fell; Ves's mitten; save) →
> `pinefall_bramble_gate` (three levers, pulled as the sun goes) →
> `pinefall_deadfall` (stumps up onto fallen trunks; her ribbon) →
> `pinefall_brook` (ring climb to the only bridge, rope down) →
> `pinefall_camp` (the woodcutters' camp and its sale stall, nobody home;
> save) → `pinefall_maze` (a bramble maze, a pack in the far dead end) →
> `pinefall_tatters` (claw marks, scraps of her coat: the midboss clearing) →
> `pinefall_ravine` (rope down in shelves to the mist; no door on yet).
> Chapter 2's ending now leads here (Ves leaves the party as she falls), and
> chapter select has Chapter 3. Words: `text/interactions/pinefall.txt`. The
> rooms were generated and checked for reachability and soft locks by a
> script (kept in the session scratchpad, not the repo). Still to come: the
> Pinefall's enemies, the woodcutters, the companion, the wake-up scene,
> and the Lantern Marsh.
>
> **Also built:** the Keeper meets you at the woodcutters' fire
> (`keeper_at_the_fire`, triggered walking into the camp) and points you
> south; he stays by the fire after. The forest is silent (only its
> ambience) until that scene, then plays **"The Scarlet Waltz"**
> (`pinefallTheme.js`, song `pinefall`, a mysterious 3/4 waltz with Ves's
> motif in its middle): rooms use `musicAfter: { scene, song }`.

Where Chapter 2 left us: the Usurper went over the summit's edge with Ves in
his grip, the hero dived after them, missed her hand by an inch, and the last
thing we saw was trees rushing up. "Somewhere below the clouds, the wind is
still carrying a plum umbrella."

Decided so far (20 October 2026): the chapter crosses **all three** of the
regions below the clouds; Ves is **found hurt partway** and escorted; a
**chapter-only companion** fights beside the hero until then; the boss is
still open (options at the end). Everything else here is a proposal.

## The shape of it

Three regions, climbed down and across rather than up, each with its own
music, enemies and look. The route runs:

```
summit ─fall─> THE PINEFALL ──> THE LANTERN MARSH ──> THE HOLLOW VALLEY ──> boss
               (forest)         (bog, mist)             (ruined city, a hub)
               hero wakes       Ves came down here      she recovers here
               companion joins  found hurt, escorted    companion leaves
```

**Why this order.** The hero fell straight down into trees, so they wake in
the forest. Ves's umbrella caught the wind and carried her further, so she
isn't where you land: that's the search. The marsh is where a drifting
umbrella would come down. The valley beyond is where there are people, beds
and a healer, which is where an escort has to end. And the boss belongs in
the ruined city: the biggest set for the biggest fight.

**Length.** Chapter 2 was about twice Chapter 1. Chapter 3 should be about
Chapter 2's length again (three regions of ~8 rooms plus a hub of ~8), not
double it: the user's time matters more than the room count.

### Opening

Black. The sound of wind in branches. The hero comes to in the crown of a
pine, snagged twenty feet up, alone, at dawn. The first room is a climb-down
puzzle (branches as `b/B` blocks, a swing ring on a snagged rope: the
climbing rope survived the fall). At the bottom: a mustard mitten in the
needles. No music until you pick it up; then "The Pinefall" starts, and the
area card shows. The hero is hurt: HP starts at a third, and there's no
healing until the companion's camp.

### The Search, as a mechanic

Ves's things are strewn along the wind's line: **mitten → ribbon (on a
branch, high) → scarf (in the marsh reeds) → the umbrella (with the boss, or
hung somewhere only the climax reaches)**. Each is a prop you pick up (an
ITEMS entry with its own words) and each triggers a short scene: the hero
holds it, an emote, and the companion reacts. The scarf matters most: it's
the twin of her mother's, which she searched the Roost's bones for. Finding
it in the mud should hit.

The companion's job in the search is to point: a dog's nose, a kid's
knowledge of the woods, a herald's spyglass. Mechanically, a `track` prop
that the companion reacts to (a "!" and a line) tells you which door to
take at forks, so the forest can branch without soft-locking anyone.

## The three regions

### 1. The Pinefall (forest)

Tall pines, fallen trunks as bridges, a river to cross on logs, moss, early
light coming down in bars. Snow only in the shade; the first green since the
Ruins. Jump-and-climb rooms using the stone blocks and swing rings; new
things: **log rolls** (a trunk you push that rolls until it hits something,
like the whirlwinds but under your control), **the river** (current carries
you downstream a tile a step unless you're on a stone).

- **Woodcutters' camp**: three or four people who fell out of the Heralds'
  story generations ago and went down the far side to live. A fire (full
  heal), a save, a tiny shop (rope, pine candy, a hatchet weapon). The
  companion comes from here.
- **Midboss: the thing that hurt Ves.** See *Bosses* below; if the chapter
  boss isn't the beast, the beast is this midboss, fought in a clearing of
  shredded plum fabric.
- **Enemies (3)**: a *Pinecone Hedgehog* (rolls, drops needles), a *Magpie*
  (steals an item mid-battle: TALK to get it back), a *Sapling* (a young
  tree spirit that walks when you look away, Weeping-Angel style in the
  overworld, and in battle grows branches across the box).

### 2. The Lantern Marsh (bog and mist)

Flat, grey, waist-deep mist. Old lanterns on poles mark the safe path,
some lit, some not; off the path you sink (the tile swallows you and you
restart the room, like the swing-climb fall). **Wisps**: lights that drift
and look exactly like lanterns, which lead you off the path. A punt you
pole along channels. This is Keeper territory in tone only: lanterns that
lead travellers somewhere are the twist's whole mechanism, and the player
should feel a chill here without being told why. (Check every line of
foreshadowing with the user first.)

- **Where Ves came down.** Her umbrella isn't here; she is, in a lantern
  keeper's stilt hut or a reed bed, hurt (a leg; she can't walk unaided)
  and with no umbrella, which to her is nearly worse. The reunion scene is
  the chapter's heart: see *Ves, hurt* below.
- **The Keeper appears here** (he "came down the quiet way"), tending marsh
  lanterns nobody asked him to tend, helpful as ever: he's the one who tells
  you where the hurt girl is. He should NOT be the one who found her.
- **Enemies (3)**: *Wisp* (lures: its bullets are lights you want to touch,
  one is real and heals, the rest burn), *Bog Toad* (tongue lashes, a
  swallow attack that moves the box), *Reed Stalker* (a heron with a spear
  beak: slow, telegraphed, huge damage, the chapter's "heavy").
- **Travel**: no updrafts without Ves's umbrella. Marsh travel is by **punt
  poles** at jetties (same system, different prop and words), and the hound
  or kid can't ride wind anyway.

### 3. The Hollow Valley (ruined city, the hub)

A lowland city the prophecy was supposed to end in, overgrown and half
sunk, with a living town built inside its biggest hall: **Lasthome** (or
Low Vigil, or Undercroft: name to be chosen), the people who stopped
waiting. Market, inn, a healer, a chapel with no bell, a library with the
prophecy's other half. Lamplit like Heralds' Rest but warmer, lower, more
tired. The skill vendor, the smith, and the chapter's travel hub.

- **Ves recovers here** (a night at the healer's; a dream scene is the
  natural place for her to tell the hero what she saw on the way down, and
  for the hero's own fall-dream: the lantern dream's sibling).
- **The companion leaves here** (their reason below).
- **The ruins proper**: beyond the town, the dead part of the city: a
  drowned forum, a collapsed aqueduct (ring climbs across its arches), the
  Hero's Gate the prophecy named. The boss is at the Gate.
- **Enemies (3)**: *Lamp Mite* swarms (many tiny, like Frostbite but
  quick), *Cairn Hound* (a stone dog that guards the dead: the companion
  reacts to these), *Herald's Echo* (a shade of a town crier that attacks
  with words: bullet text, Undertale "Spider Dance" style).

## Ves, hurt

Found at the marsh's midpoint. Her leg's bad and her umbrella is gone. She
is furious with herself for losing it, frightened of the mist, and
overjoyed in a way she tries to hide (use the big expressions). From here to
Lasthome she's **carried or supported**:

- Overworld: a new follower mode, `leaning`: she walks half a tile behind
  with a hand on the hero's shoulder; the hero can't run or jump while she's
  leaning (puzzles in this stretch are about finding the flat way). Or,
  simpler to build: she rides on the hero's back (a new hero sprite, like
  the Ves hand-float but reversed), which also means no jumping. The second
  reads better and is one sprite set rather than a movement mode.
- Battle: she's in the party but has only SHELTER (no umbrella means no
  FLURRY/SLEET/ZEPHYR: she holds her coat over you instead; retitle it
  COVER for the stretch) and a new free command, **CALL OUT** (she shouts
  what the enemy's about to do: the next attack's name shows a second early,
  the Button idea from the party notes). Her HP is halved and she can't be
  healed above it until the healer. The point is that she's in the fight
  and can't fight; the player should want her umbrella back.
- The umbrella comes back at the climax (it's with the boss, or hung at the
  Hero's Gate), and its return is her first real spell of the chapter,
  mid-boss, as a scripted turn.
- **Its music is decided** (user, 20 October 2026): the boss's last phase
  switches to **"Nobody's Dawn"** (`nobodysDawnTheme.js`, song id
  `nobodysDawn`) the moment she has her umbrella again. Its gong and BRAAAM
  are the umbrella opening; her motif, heroic in G major, is her fighting
  again. Set it as that phase's `music` (battleScene.js already switches
  songs on a phase change). The boss's own theme should sit at 150 BPM so
  the switch doesn't jolt.

Her arc this chapter picks up where chapter 2 left it (she'd decided to go
with the hero to the end): now she has to decide it again, having nearly
died for it, with no mother's lamp left to finish. The honest ending for
her is that she chooses the hero over the quest, which the chapter 7 plan
will make unbearable in the right way.

## The companion (chapter 3 only)

Three candidates. The first is recommended.

### 1. The Hound (recommended)

A big grey mountain dog, old, one ear torn. It belonged to one of the six
lost Heroes and has been waiting in the Pinefall for its master to come
back down for longer than dogs live. It's the chapter's theme as an
animal: nobody's dog, waiting for a hero who never came.

- **Joins**: it finds you under the tree, sniffs the mitten, and leads.
  Nobody has to be convinced; it decides. No dialogue to write for it, and
  everything it does is in emotes and animation, which suits a silent hero
  (the two of them say nothing to each other the whole chapter).
- **Battle**: *FETCH* (free: it leaps up and catches a bullet before it
  reaches you, once a turn), *HOWL* (10 SP: MERCY up for all, and busier
  attacks for a turn), *GUARD* (stands over you: halves one attack). HP of
  its own; if it drops it limps to the edge and whines until the battle ends.
- **Overworld**: tracking (see *The Search*): it runs to the next trace
  and barks. Digs up buried chests (`dig` props) in the forest. Won't go
  into the bog water; swims rivers.
- **Leaves**: in the Hollow Valley, at the Cairn Hounds' field, it finds
  its master's cairn and lies down on it, and won't come. A one-emote
  goodbye: the hero kneels, the dog's tail thumps once. Ves, if she's well
  enough by then, says what the hero can't.
- **Sprites**: a 16x16 dog with walk, run, sit, lie frames; a leap for
  Fetch. No portrait (it doesn't talk).
- **Music**: a motif that's a plain falling fifth (the Zelda "hero's quest"
  interval, inverted: a hero who went down and didn't come back) over a
  slow walking bass, which the chapter theme can quote when the hound
  appears, and which plays once, alone, at the cairn.

### 2. Bramble, the woodcutters' kid

Ten or so, hatchet too big for them, hunting the beast that "took the girl
who fell out of the sky" because nobody at camp will go. Loud, brave,
wrong about things. The Pip role from the party notes, but from the valley
side of the mountain: these people stopped believing in the Hero
generations ago, so Bramble has never heard of one and treats the hero as
simply a stranger with a sword, which is refreshing after two chapters of
"are you the Hero?"

- **Battle**: *CHOP* (a FIGHT of their own), *HOLLER* (MERCY up), *HIDE*.
- **Overworld**: knows the forest (the track role), can squeeze through
  gaps (`small` doors) to pull levers the hero can't reach.
- **Leaves**: sent home from Lasthome by the healer, furious, with a
  promise to be told the end of the story. Needs a 32x32 portrait with six
  or so expressions, and a lot of lines.

### 3. Fenwick, the lost herald

A grown herald who went down the far side thirty years ago to find the
Hero on the other side of the mountain and lost his nerve in the marsh;
now runs the lantern ferry. Joins in the marsh (so the forest is solo, which
could be good for the opening's loneliness). Dry, tired, funny, the only
adult who has ever been honest with the hero about what the heralds were
waiting for.

- **Battle**: *TRUMPET* (MERCY up and SP up, like the old FANFARE idea),
  *POLE* (a FIGHT), *LANTERN* (slows bullets near you, the `light` ability
  as a command).
- **Leaves**: stays in Lasthome and finally sends word back up to Heralds'
  Rest that someone came. Which the user might want for later chapters.

## Bosses: the brainstorm

The constraints: it's at the Hero's Gate in the ruined city; Ves is back on
her feet and gets her umbrella during or just before it; it has to be the
hardest fight so far (the Usurper is 14 damage, 600 EXP; the Roost Mother
900 HP) and climb from there; three or more themed attacks per phase, bullet
art of its own things; and it should be sparable or not for a reason, the
way the Roost Mother wasn't.

### A. The Warden of the Gate (a monument that wanted the real thing)

A colossal stone statue of the prophesied Hero, built by the city to greet
him, standing at the Gate with its stone sword raised in welcome. It's been
waiting too. When you come, it wakes to judge you, and it finds you wanting:
you're the wrong height, the wrong face, you have no name (the silent hero
can't give it one). It isn't evil. It's a monument doing its job.

- **Why it fits**: it's the game's premise as a boss ("are you the Hero?"
  asked by the only thing that can't be charmed), it's new (we've had a
  guide-boss, a beast and a shade, not a construct), and it foreshadows
  nothing about the Keeper while still being about heroes, which keeps the
  twist safe.
- **Fight**: three phases as it breaks: *Welcome* (the sword, stone petals,
  inscriptions as bullet text: the prophecy's words), *Judgement* (it
  measures you: lines that scan the box; the shadow must stand in the
  "hero-shaped" gap), *Ruin* (it's crumbling; falling masonry, the Gate
  itself coming down). Ves's umbrella return: at the Ruin phase she catches
  falling stone on it (a scripted SHELTER that becomes the new spell).
- **Spare or kill**: sparing means convincing a statue that a nobody will
  do, with TALK options that are all the hero's actions in the game so far
  (the Roost Mother spared, Taper spared...) read back by Ves; killing is
  breaking it, and the Gate with it. Either way it stops.
- **Music**: a chorale (it was built to sound like a fanfare) that falls
  apart; the Long Stair fanfare on stone.

### B. The Pinefall Beast (what hurt her), carried to the climax

The forest's apex predator: a huge pale lynx or a bear-sized marten, the
thing whose claws are in Ves's leg and whose den has her umbrella in it. In
this version the midboss and the boss are the same animal: it mauls Ves
offscreen, you drive it off in the forest (phase 1, it flees), and it stalks
you through the whole chapter (glimpsed in the mist, in the ruins) until the
Gate.

- **Why**: the simplest emotional line: the thing that hurt her. A stalking
  boss is new and a little scary.
- **Against**: we did a beast (the Roost Mother) last chapter, and a
  predator at the Hero's Gate has no reason to be there. Better as the
  midboss only.

### C. The Bellwether (the drowned herald of the marsh)

A herald who went into the marsh with a lantern and a bell to light the
way for the Hero and never came out: now a tall, wet, lantern-headed thing
whose light is what the wisps copy. It gathers lost travellers' lanterns.
It's the twist's mechanism in miniature (a light that lures, a lantern that
keeps something), which is either exactly the right foreshadowing or too
close to the bone: the user decides.

- **Fight**: in the marsh, not the Gate, which breaks the "boss in the
  city" shape; or it follows the lantern-line into the city's sunk forum.
  Attacks: bell tolls (rings), lantern swings, wisp swarms, the mist itself
  (the box fills and you follow one light).
- **Spare**: it can be put out, which is a mercy; ties to the Spare Lantern.

### D. The Second Hero's shade, gone gentle

One of the six who reached the valley, gave up on the Door, and ruled the
city kindly until it emptied. Now a shade like the Usurper but his
opposite: not a usurper, an abdicator. He welcomes you, feeds you, and
wants you to stop too. The fight is him refusing to let you leave for your
own good (a Taper echo). Foreshadows the chapter 7 shades without
revealing anything about the Keeper.

- **Against**: a third "someone blocks the way because they care" boss,
  and a second shade in a row. Strong writing, weaker as a fight.

### E. The Westerly (the wind that took the umbrella)

A storm spirit, the wind that's been carrying things off the mountain for
a hundred years: umbrellas, lanterns, heralds, hope. Its den at the Gate is
a whirl of everything the wind took. Ves's umbrella is in it, and so is
her mother's lantern. Fighting it is fighting weather: whirlwinds, drifts,
updrafts (reusing the Weathervane Shelf's tech in the battle box).

- **Why**: it closes Ves's chapter 2 thread (the umbrella the wind took;
  her mother's lantern found at last, unlit) and gives her a reason to fly
  again. A wind boss suits her powers returning.
- **Against**: an elemental is less of a character than a statue or a
  shade; needs a face.

### F. Two bosses: the Beast (mid) and the Warden (end)

The recommendation. The Beast is the midboss in the forest's shredded
clearing (what hurt her; it flees, and that's the chapter's first phase of
the search paying off), and the Warden is the Gate. That's three boss-grade
fights counting the Roost Mother pattern from last chapter, each with a
different kind of weight.

## New mechanics (pick a few, not all)

- **Carrying Ves** (no jumping, no running) for the marsh-to-valley stretch.
- **The river**: current tiles that carry you a tile a step.
- **Log rolls**: pushable trunks that roll until stopped.
- **Marsh path and wisps**: off-path tiles swallow you; wisps that look like
  lanterns.
- **Punting**: a boat on channel tiles, poled with the arrow keys.
- **Dig spots** (hound) or **small doors** (kid).
- **Bullet text** attacks (the Echo, the Warden's inscriptions).
- **Hero's shadow**: a chapter 3 shadow mode from the Warden's fight, as the
  Usurper's gave one (the user's plan was each chapter's boss grants a
  battle-only ability).

## Scope (so we know what we're signing up for)

| Thing | Count | Notes |
|---|---|---|
| Rooms | ~30 | Pinefall 8, Marsh 8, Lasthome 7, ruins 6, boss 1 |
| Enemies | 9 regulars + 1 midboss + 1 boss | 3 per region; each 3+ themed attacks, unique drop |
| Music | ~9 | Pinefall, Marsh, Lasthome, ruins, boss (orchestral, like "Who Would Be Hero"), the hound, Ves hurt, a dream, credits. Area themes are in the style of Hollow Knight's City of Tears (user, 21 October 2026): a fixed stack-of-fifths "rain" ostinato that never changes while the bass moves under it, long tunes on colour notes, rolling 12/8 near 60, inside/outside swells (helpers in `parts/chapter3.js`) |
| Skills | ~30 hero + ~12 Ves | Doubling the tree again (`chapter: 3`); Ves gets a branch about fighting without her umbrella, then with it |
| Items / gear | ~15 | Pine candy etc., forest and marsh weapons (hatchet, punt pole, lantern staff), armor |
| Scenes | ~14 | Waking, each trace (4), companion joins, finding Ves, Keeper in the marsh, the healer, the dream, companion leaves, umbrella returns, boss, ending |
| Text | ~20 files | enemies, NPCs, interactions per region, shops, cutscenes |

## Build order (proposed)

1. **Skeleton first**: chapter 3 in `chapters.js`, the three areas in
   `areas.js` with backdrops and a weather/vista look, one placeholder room
   per region joined by doors, the `end_chapter` of `usurper_falls` pointed
   at the first room so the game actually continues. Chapter card and credits
   text for the end.
2. **The Pinefall**: rooms, the three enemies, the companion (sprites,
   follower, battle commands), the camp, the traces, the midboss.
3. **The Marsh**: rooms and tech (path, wisps, punt), enemies, the Keeper
   scene, finding Ves, carrying her.
4. **Lasthome + the ruins**: the hub, the healer and dream, the companion's
   goodbye, the ruins rooms, enemies.
5. **The boss**, its music, the umbrella's return, the ending and credits.
6. **Skills, gear, items** for the chapter, levelled against the EXP curve.
7. **Music** for each region as its rooms land, not after.

Each step ends with the usual checks: preview `?check=1&songs=1`,
`?poke=all`, textCheck, and listening to every new song.

## Open questions for the user

1. Which companion? (Hound recommended.)
2. Which boss (A–F)? (F: Beast midboss + Warden recommended.)
3. Carrying Ves on the hero's back, or her leaning on the hero's shoulder?
4. The hub town's name: Lasthome / Low Vigil / Undercroft / something else?
5. Does the Keeper appear in the marsh, and may he be the one who says
   where the hurt girl is?
6. Any Chapter 7 foreshadowing allowed in the Marsh (option C's bones, the
   wisps, a lantern with something in it), or keep the marsh clean?
