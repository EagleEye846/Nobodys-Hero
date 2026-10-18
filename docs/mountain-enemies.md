# Enemies for Mount Vigil

The monsters designed for the mountain. **All five regulars are built** (18
October 2026) and in the Room Editor's Enemies list, ready to place; none is in
a room yet. Three more for the ice caves (Stone Golem, Ice Moth, Glintling)
are built too; see *The ice caves* below. The boss at the end is still only a design. Heralds' Rest stays a
safe place.

| Enemy | id (file) | Built |
|---|---|---|
| Chough | `chough` | yes |
| Frostbite | `frostbite` | yes |
| Ringer | `ringer` | yes |
| Rimewing (the grown Lantern Keeper's Moth) | `rimewing` | yes |
| Frozen Step (the upper Loose Step) | `iceStep` | yes |
| Stone Golem (ice caves) | `stone_golem` | yes |
| Ice Moth (ice caves) | `ice_moth` | yes |
| Glintling (ice caves) | `glintling` | yes |
| The First Herald (boss) | - | no, saved for a later story beat |

Each one is `src/data/enemies/<id>.js` (numbers), `src/data/art/<id>.js`
(sprite, and disguise art where it has one), `src/battle/attacks/<id>.js`
(attacks) and `text/enemies/<name>.txt` (everything it says). Their drops are
in `src/data/items.js` and `text/items/items.txt`.

What follows is the original design; notes marked **Built** say where the
game differs from it. Each follows the house rules:
three or more distinct attacks drawn with the enemy's own things (never plain
orbs), a unique drop, and TALK options that fit its character. Chapter 2
attacks should be busier and quicker than the Ruins' (density and speed
around 1.1 to 1.2), and EXP should keep levels coming every few fights.

Where they'd live is noted, but any of them can be reused across rooms.

## Chough

A glossy black mountain crow with a red beak and a wicked sense of humour. The
choughs have watched six climbers fail and find it all very entertaining.

- **Where:** the Ridge and the Spiral Stair (patrols along ledges; takes off
  and circles when it sees you).
- **HP 120, damage 7.** Quick but fragile.
- **Attacks:** *Dive* (a bird silhouette sweeps across the box in a shallow
  arc, then a second from the other side); *Pebble drop* (small stones fall
  from the top in columns, each telegraphed by a tiny shadow); *Shiny!*
  (sparkling trinkets drift in and the bird snatches them one by one, each
  snatch a fast horizontal line); *Chee-ow* (sound rings: expanding red arcs
  from the bird's beak with one gap).
- **TALK:** Inspect / Wave arms (calm 20; it finds you hilarious) / Offer
  shiny thing (calm 45) / Caw back (calm 35).
- **Drop:** *Shiny Button* (heals 25; "it insisted you have it").
- **Material:** *Black Feather* (a dark, long-burning candle: "Chough Candle").
- **Built:** as designed: HP 120, damage 7, 60 EXP, 45 gold, drops the Shiny
  Button (40%). *Pebble drop* became a bombing run (the shadows show on the
  floor first, and one is always under you). The candle material isn't in yet
  (the CANDLES screen would need room for more recipes).

## Frostbite

A snowdrift that got up and walked. A hump of snow with two blue eyes and a
grin of icicles, slow and relentless. It wants a hug. Its hugs are very cold.

- **Where:** the Shoulder, the Cloud Walk (wanders; disguises itself as a
  snow heap, like the Loose Step does).
- **HP 220, damage 9.** A tank.
- **Attacks:** *Drift* (a wall of snow slides in from one side with a
  soul-sized hole that wanders); *Icicle fall* (icicles grow from the top of
  the box, longer and longer, then drop in a random order); *Snowball*
  (a big snowball bounces round the box, growing each bounce, leaving a trail
  of little ones); *Shiver* (the whole box frosts over from the edges in;
  stand in the thinning middle).
- **TALK:** Inspect / Hug it (calm 40, costs 4 HP) / Build a snowman (calm 35)
  / Shiver dramatically (calm 25).
- **Drop:** *Snow Cone* (heals 35).
- **Material:** *Rime* (a pale blue candle that calms: "Frost Candle").
- **Built:** as designed: HP 220, damage 9, 95 EXP, 55 gold, drops the Snow
  Cone (40%). It has disguise art (a snow heap). *Hug it* costs 4 HP: TALK
  options can now have `hurt`. No candle material yet, as with the Chough.

## Ringer

A living iron climbing ring, with a lot of opinions about who hammered it in
and whether they knew what they were doing. It swings itself at you.

- **Where:** the Ice Face and the Knife Edge (hangs on the face as a prop
  until you swing near, then drops down to fight).
- **HP 150, damage 10.** Hits hard, fights briefly.
- **Attacks:** *Pendulum* (rings swing on ropes across the box from pivots
  along the top, each a little out of phase); *Hammer* (a mallet silhouette
  stamps down on a column, telegraphed by a crack line); *Clang* (ring-shaped
  shockwaves expand from where you were a second ago); *Rope burn* (ropes
  stretch diagonally across the box and tighten; slip through the gaps as they
  go taut).
- **TALK:** Inspect / Tighten it (calm 30) / Compliment the forging (calm 40)
  / Swing on it (calm 35, "it approves of your technique").
- **Drop:** *Iron Filings Toffee* (heals 40, "surprisingly chewy").
- **Built:** as designed: HP 150, damage 10, 85 EXP, 50 gold, Iron Filings
  Toffee (40%). Its disguise is a grapple ring (matching the `grapple_ring`
  prop), so place it where rings go. *Pendulum* ropes sometimes snap and fling
  the ring; *Clang* bursts into chain links you can slip between.

## Lantern Keeper's Moth, grown

Not for the mountain proper: a reminder that the Keeper's light has reached
up here too. A huge pale moth with a frost pattern on its wings, drawn to the
village's lamps. Rare. Suggests the twist without saying it.

- **Where:** one, at the Lookout at night (if night is ever added), or in the
  Singing Gallery, circling the crystals.
- **HP 260, damage 9.**
- **Attacks:** *Lamp-drawn* (it flies to the brightest point; bullets stream
  toward wherever the soul last stood still); *Frost dust* (spirals of wing
  dust that slow the soul where they touch); *Beat* (the wings beat and the box
  tilts: everything slides one way, then the other); *Candle* (a lone candle
  flame appears in the box and every bullet bends toward it; stand near it,
  not on it).
- **TALK:** Inspect / Shade the lamp (calm 35) / Hum (calm 30) / Mention the
  Keeper (calm 50, "it goes very still").
- **Drop:** *Frost Jam* (heals 45).
- **Built** as the **RIMEWING** (`rimewing`): HP 260, damage 9, 130 EXP, 70
  gold. It drops *Rime Jam* (heals 50, 50%), renamed so it isn't confused with
  the shop's Frostberry Jam. *Beat* blows the bullets and you sideways rather
  than tilting the box; *Candle* has a glow round the flame that burns up the
  scales (stand in it), which shrinks and moves.

## Stair Step, Loose (upper)

The Loose Step again, higher up: a brother step, frozen into a block of ice,
who has been waiting at the top for the one at the bottom. Reuse the Loose
Step's attacks with ice art (the rockslide becomes an avalanche, the cracks
become ice cracks), slightly denser. A nice way to pay off the step's story
without new code: **HP 190, damage 9**, drops *Ice Shortbread*.

**Built** as the **FROZEN STEP** (`iceStep`): HP 190, damage 9, 90 EXP, 50
gold, Ice Shortbread (40%), density 1.25. The Loose Step's four attacks are
now made by `makeStepAttacks` in `src/battle/attacks/step.js`, and the Frozen
Step's (`iceStepTumble`, `iceStepFootfall`, `iceStepCrack`,
`iceStepAvalanche`) are the same moves with ice art. It disguises itself as a
snow-topped block.

## The ice caves

Three more regulars for the ice caves inside the spire, past the Weathervane
Shelf, where the crystals in the rock glow blue. All three are built (18
October 2026) and in the Room Editor's Enemies list.

## Stone Golem

A heap of cave stone that got up and walked, with crystals of ice growing out
of its shoulders and one arm, cold blue eyes, and a crystal heart showing
through a crack in its chest. Slow, heavy, and in no hurry at all. It was a
rock for a thousand years and liked it.

- **Where:** anywhere in the ice caves, among boulders. Use the **disguise**
  behaviour: it lies curled up as a boulder (the same stone as the boulder
  tile `O`, with a shard of ice on top where the tile has moss), opens its
  eyes or glints now and then, and pounces when you come close.
- **HP 300, damage 10.** The toughest of the cave regulars; density 1.15,
  speed 1.05 (slow things, but plenty of them).
- **Attacks:** *Rock Fist* (`golemFist`: a stone fist blinks at one side,
  level with you, then punches across the box; when it hits the far wall,
  pebbles bounce back); *Crystal Growth* (`golemCrystals`: three spikes of
  ice, one under you, blink then grow out of the floor or the roof, by
  turns, then shatter and fling their tips off as shards); *Tremor*
  (`golemTremor`: a wave runs across the floor throwing rocks up, low and
  high by turns, then runs back; chips fall from the roof all the while, so
  the top of the box is safest but not safe); *Geode* (`golemGeode`: a geode
  thumps down away from you, cracks, and bursts into two rings of ice shards,
  the second turned so its gaps don't line up).
- **TALK:** Inspect / Stand very still (calm 30) / Admire crystals (calm 40)
  / Knock politely (calm 35; something inside knocks back).
- **Drop:** *Geode Rock Candy* (heals 55, 45%).
- **Built:** 150 EXP, 75 gold.

## Ice Moth

A moth of frost from the ice caves, its wings thin faceted sheets of ice,
drawn to the glowing crystals the way the Ruins' moths are drawn to lanterns.
It can't keep its mind on anything else. (Not the Ruins' Lantern Moth, nor
the Rimewing: a cave moth of its own.)

- **Where:** in caves with glowing ice crystals (tile `x`), patrolling or
  wandering near them.
- **HP 170, damage 8.** Density 1.15, speed 1.15: its moths are quick.
- **Attacks:** *Drawn to the Glow* (`iceMothOrbit`: a crystal lights up away
  from you and a ring of six little ice moths circles it, the ring breathing
  in and out; now and then the moth nearest you darts at you and another
  flies in to take its place; halfway through, the crystal moves and the ring
  drifts after it); *Frost Scales* (`iceMothScales`: the moth flutters back
  and forth along the top of the box, shedding scales that see-saw down like
  leaves, and a fan of five falls each time it turns); *Flurry*
  (`iceMothFlurry`: a line of nine moths streams in from an edge, all
  following a leader that keeps turning toward you, until it loses interest
  and leads them out; then another line comes from another side).
- **TALK:** Inspect / Hold still (calm 25) / Point at a crystal (calm 45) /
  Breathe on it (calm 30).
- **Drop:** *Frost Nectar* (heals 40, 40%).
- **Built:** 85 EXP, 50 gold.

## Glintling

A little cluster of living ice crystal, three prisms tall, with a gap-toothed
grin. Light that goes into it comes out in colours, and it thinks that's the
funniest thing in the world. Mischievous rather than mean.

- **Where:** anywhere in the ice caves; it suits **pounce** or **ambush**
  near crystal clusters (it pretends to be one), or a quick **patrol**.
- **HP 140, damage 8.** Fragile, but its tricks come thick and fast:
  density 1.2, speed 1.1.
- **Attacks:** *Refraction* (`glintRefract`: a prism appears, a beam of
  light comes in from one side and splits through it into three coloured
  beams, the middle one at you; all four flash as lines first); *Mirror
  Image* (`glintMirror`: your shadow's helmet, reflected in ice, copies your
  moves mirrored across the middle of the box and flicks splinters at you;
  halfway through the mirror turns from left-right to top-bottom); *Glitter
  Burst* (`glintBurst`: crystals pop up one after another, each a step closer
  to you, and burst into rings of splinters); *Skating* (`glintSkate`: it
  rolls up and skates round the box, bouncing off the walls and turning a
  little toward you each time, leaving a trail of glitter that lasts a
  second).
- **TALK:** Inspect / Make a funny face (calm 35) / Cover the light (calm 25)
  / Admire the colours (calm 45).
- **Drop:** *Glint Drop* (heals 35, 45%).
- **Built:** 75 EXP, 45 gold.

## Boss: the Roost Mother (built)

The great bat of the ice caves, in her roost of ice beyond the Hall of Glass.
Every bat in the caves is one of hers, and your light has woken them all;
she'd like it put out, and she'd like some quiet. Huge (56x35, wings spread
wide), dark fur rimed with frost, violet wings like her little ones' hung
with icicles, a ruff of frost at her throat and glowing pink eyes. Ves is
terrified of bats (lost in a cave as a child, swarmed), so this fight is
about her fear: the flavour text watches her, shaking, keep her umbrella up.

- **Where:** the Roost (`great_bat`), started by the `bats_in_the_roost`
  scene's `battle` step; `bat_defeated` follows it.
- **No mercy** (`noMercy: { who: 'vesper' }`): the floor of her roost is the
  bones of the climbers who never came back past the second cairn. Any
  calming TALK, spell or candle is stopped before it costs anything, and Ves
  says why in a portrait box ([no_mercy], then [no_mercy_again]). After she
  dies, `bat_defeated`: a pup squeaks for her, Ves apologises to the hero,
  then walks up to the pup and lifts it to the roost on her umbrella, the end
  of her fear of bats. (`bat_spared` is no longer reachable.)
- `boss: true`, `introCard: { title: 'THE ROOST MOTHER', subtitle: 'Who Sings
  in the Dark' }`, `music: 'batBattle'`, `backdrop: 'cave'`, and
  `battlePos: { x: 206, y: 36 }` (a new field: a lone boss's own spot on the
  stage, so her sprite fits). No running away. `secondWind` below a third of
  her HP, like Taper.
- **HP 900, damage 11.** Density 1.2, speed 1.12: well above Taper (320) and
  the caves' regulars, since bosses are each chapter's hardest fights.
- **Attacks** (`src/battle/attacks/great_bat.js`): *Echolocation*
  (`batEcholocation`: the box goes dark and her little ones and falling ice
  shards are all but invisible, a faint glint, until her screech sweeps a
  ring of sonar across the box from her side and its echo sweeps back off the
  far wall; whatever a ring passes over shows for a moment and fades);
  *Screech* (`batScreech`: great rings of sound roll across the box, each
  with one gap to slip through, each gap a step up or down from the last;
  halfway through, echoes come back off the far wall too, so they arrive from
  both sides in turn); *Echoes* (`batEchoes`: fans of three sound-waves aimed
  at you bounce round the box, slower and fainter each bounce, gone after the
  third); *The Roost Wakes* (`batSwarm`: two rivers of little bats pour
  across the box, one each way, snaking up and down, with a stray now and
  then); *Dive* (`batDive`: she blinks at an edge of the box, a dashed line
  shows her path through you, and she swoops through, shedding frost that
  drifts down where she's been); *Icicles* (`batIcicles`: rows of icicles
  shiver along the top and fall in a sweep from one side to the other, one
  left out, and shatter into skittering shards; between rows, one falls right
  above you).
- **TALK:** Check / Shade your light (calm 14) / Be very quiet (calm 12) /
  Stand by Ves (calm 16; she knows that look: someone keeping a small one
  safe). Lull works well on her (calm 25): a lullaby, for a mother trying to
  get hundreds to sleep. Ves's own TALK lines are hers (`[vesper_talk]`), kind
  words she has to work up to. Spared, she settles and lets you pass.
- **Drop:** *Roost Plum* (heals 120, always, beaten or spared).
- **Built:** 380 EXP, 110 gold.

## Boss: the Herald of the Summit (not built)

For the end of the Cloud Walk, or the summit when it's built: the first
herald, who never came down, who has been waiting at the top for a hundred
years with the real fanfare. Not evil; just unable to stop. A tall
snow-white marmot in a tattered tabard, holding a trumpet of ice.

- `boss: true`, `introCard: { title: 'THE FIRST HERALD', subtitle: 'Who Never
  Came Down' }`, its own song (a grand, sad arrangement of "Soup's On" with the
  prophecy fanfare blared out in full).
- **Attacks** use a new soul mode, **HUSH** (the box is silent: bullets only
  show when they're near, so you watch for the glint): *Fanfare* (notes burst
  from the trumpet in chords, three at a time, in the fanfare's rhythm);
  *Procession* (silhouettes of six climbers march across the box; the gaps
  between them are the way through); *Welcome banner* (a banner unrolls
  across the box and you duck under it as it drops); *Encore* (everything at
  once, in the rhythm of the song's climax).
- Sparing it (TALK: *Listen to the fanfare*, *Say you're not the Hero*, *Say
  the speech back*, *Ask to come home*) ends with it coming down the mountain
  with you to the village, where the band finally gets to play for someone.

## Where they are (placed 2026-10-18)

Along the route, up from the Ruins (each room's `npcs`, with a comment on why):

- **Lower climb:** Climb Start and Sheer Face (a chough each), the Ridge (chough,
  craghorn), the Spiral Stair (chough, disguised loose step), the Hollow (craghorn).
  These low rooms are green and sunny: no snow creatures (frostbites, upper
  loose steps), and their fights use the Long Stair's sky, not the snowy heights.
- **First caves:** Cave Entry (disguised golem, ice moth), the Singing Gallery
  (the only rimewing, a pouncing glintling, an ice moth).
- **Up to Heralds' Rest:** the Shoulder (disguised frostbite, clear of the
  Keeper's walk), the Ice Face (ringer as a ring, frostbite), the Knife Edge
  (ringer), the Cloud Walk (frostbite, craghorn).
- **With Ves:** the Second Cairn (upper loose step, clear of Ves's walk), the
  Cloud Bank (+ frostbite, chough), the High Shelf (upper loose step), the Broken
  Span (+ upper loose step, chough), the Wind Stair (chough, frostbite), the Gale
  Face (craghorn, ringer). The Lamplighter's Ledge and the ice caves were
  already populated; the Weathervane Shelf is left to its puzzle.
- **EXP:** 30 enemies in these rooms, 2510 EXP: about four levels from LV 5 or
  6, a level every seven fights or so.


## Boss: the Usurper (built)

The summit's shade (`usurper`; `src/data/enemies/usurper.js`, attacks in
`src/battle/attacks/usurper.js`, words in `text/enemies/usurper.txt`). Started
by summit_arrival; beaten, usurper_falls plays. `music: 'usurperBattle'`,
`backdrop: 'summit'`. No running, and no mercy at all: no MERCY meter
(`noMercy: { who: 'foe', meter: false }`), and every try at it he mocks
([mercy_mock]). Fought in three `phases` (see bossPhase in battleScene.js):

- **Smoke** (1 turn): FIGHT does 0, spells 4%. Blade, Crown, Banners, Stare,
  Hands, Fanfare.
- **Flame**: Ves relights her mother's lantern (her turn is [relight]); its
  flame sits in the box and his attacks (Whiteout, Shadow Blades, Grasp, Cold
  Crown) send pale *snuffers* at it, each tethered to it by a dotted thread.
  Your shadow catches them harmlessly. Each turn it shrugs off 3 (+1 per past
  setback, up to +3; +2 more for TALK *Guard the lantern*); survive and it
  grows a stage, get snuffed and it shrinks one. Four stages lights it. TALK
  *Stare him down* turns a turn's snuffers on you instead.
- **Lit**: the light burns off 25% of his HP and makes him solid; he drops the
  blade and Ves fights with it (FIGHT at power 1.4, gold), plus BLADE (20% SP)
  and TOGETHER (50% SP: your best FIGHT and hers, x0.9). Faster attacks, no
  blade, and his Last Stand; `secondWind` below a third.
- **HP 1400, damage 14**, density 1.35 / 1.3 / 1.45, speed 1.18 / 1.15 / 1.3.
  600 EXP, 160 gold, a Lamplight Candle and 3 Shadow Ash.
- Sums: at the summit you're about LV 8 to 10 (Ruins ~LV 5, then 2510 mountain
  EXP plus the caves and the Roost Mother): 160 to 180 HP, DEF 2 to 4, so a
  hit is 10 to 12. About 1 + 4-6 + 4-6 of his turns. A skilled player taking a
  hit a turn needs no healing; a careful one taking three needs ~200 HP of
  food or Heal Pulse (Ves can't heal while she's at the lantern). Phase 3 is
  ~1050 HP against ~190 (a plain build) to ~280 (a VALOR build) a round.
- `tools/preview.html?bossphase=usurper&stage=0|1|2` plays each phase's
  attacks through and draws the box.
