# Enemies for Mount Vigil (designed, not yet in the game)

Mount Vigil and Heralds' Rest have no enemies yet: the climb is the challenge,
and the village is a safe place. These are the monsters designed for the
mountain, ready to build when the time comes. Each follows the house rules:
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

## Stair Step, Loose (upper)

The Loose Step again, higher up: a brother step, frozen into a block of ice,
who has been waiting at the top for the one at the bottom. Reuse the Loose
Step's attacks with ice art (the rockslide becomes an avalanche, the cracks
become ice cracks), slightly denser. A nice way to pay off the step's story
without new code: **HP 190, damage 9**, drops *Ice Shortbread*.

## Boss: the Herald of the Summit

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
