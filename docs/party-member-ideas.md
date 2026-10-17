> **Update (2026-10-18):** Pip was replaced by **Ves (Vesper)**, a girl found
> praying in the Heralds' Rest chapel, who fights with an umbrella (SHELTER,
> FLURRY, SLEET, ZEPHYR). The Pip ideas below are kept for reference only.

# A party member: ideas

The battle already draws the party as a list, so a second member is a matter
of story, sprites and a few battle rules. These are the strongest candidates,
each with how you'd befriend them, what they'd do in a fight, and how they'd
fit the story of a Hero who never came. Pick one; the others can be NPCs
later. My recommendation is first.

## 1. Pip, the smallest herald (recommended)

**Who:** the marmot kid on lookout at the gate, with the wooden trumpet that
goes "fweep". Loud, loyal, convinced you're the Hero and not about to be
talked out of it.

**Why it works:** Pip is the village's hope made small and portable. Taking
Pip up the mountain makes every herald scene land harder (Mrs Pottle has to
let him go), and Pip is the perfect foil for the Keeper's twist: the Keeper
can't charm a child who already decided who the Hero is. Pip also gives the
player a reason to be kind that isn't a meter.

**Befriending:** three steps across the village, so it feels earned:

1. Talk to Pip at the gate (he fweeps). Then find Bram's lost trumpet (it's
   in a cairn on the Lookout stair; a `gives` prop) and give it to Bram.
   Bram, grateful, gives Pip his old brass trumpet.
2. Sleep at the inn. In the dream (when it exists), Pip is there, fweeping at
   the dark. On waking, Pip is outside the inn asking to come.
3. Mrs Pottle says no. Talk to her again after Pottle (the twin) tells her
   it's not fair that Pip gets to be in the story; she relents on one
   condition: "bring him back for supper". Pip joins.

**In battle:** Pip stands behind you with the trumpet. New command on his
turn (or a second slot in TALK): *FANFARE*, which costs nothing and raises
every enemy's MERCY by 10% and your SP by 10%, but makes the next attack a
little busier (enemies are startled). Pip has his own small HP pool (shown
in the party list); if he drops, he hides behind you until the fight ends
(no game over). Pip's HP recovers fully between battles; he is a kid.

**Overworld:** follows you like Taper did in `taperFollows`, one tile behind;
sits on your shoulders on the rope (a small sprite change, big charm).
Occasionally fweeps when you find a chest.

**Sprites needed:** `herald_kid` already exists (16x15); a back view and a
"riding the rope" variant, plus a 32x32 portrait with glee / worried /
surprised.

## 2. Button, Marta's snow hare

**Who:** the white hare asleep in Marta's chair. Doesn't talk. Decides things.

**Befriending:** feed it (any food item, three times, from the ITEMS menu
while standing next to it: a new `feeds` prop rule). On the third it follows
you out of the house and Marta says "well, that's that then".

**In battle:** a passive partner: *Nose twitch* warns you which attack is
coming (the attack's name shows a second early), and once per battle Button
*thumps*, freezing every bullet for half a second (the Chapel Bell's Toll,
free). Can't be hurt (it's under your feet).

**Why:** cheapest to build, very cute, no dialogue to write. Weakest for
story.

## 3. Craghorn Kid

**Who:** one of Old Nan's great-great-grandkids: a young goat who wants to
show the Hero the way up, like it was told to, and will settle for you.

**Befriending:** spare three Craghorns on the Long Stair (pacify, not beat),
then talk to Old Nan in the square; she sends the kid with you. "It needs
the exercise."

**In battle:** *Charge*: on your turn, instead of FIGHT, the kid charges for
a guaranteed hit (like Rend, free, but it can't be used two turns running).
In the overworld it butts open the blocked paths on the summit stair
(rockfalls marked `goat: true`), which opens shortcuts.

**Why:** ties the mountain's enemies to the village, and gives a reason to
spare Craghorns. Needs a new sprite set.

## 4. Taper (if spared)

**Who:** her. She said there'd always be soup; what if she came to find you?

**Befriending:** not a quest: after you sleep at the inn with Taper spared,
she's at the inn's fire in the morning ("I couldn't sit at home"). She joins
for the summit only.

**In battle:** *Lullaby* (TALK: raises MERCY of all by 15%) and *Candle*
(halves damage one turn), and her presence makes the Keeper's twist cut
deepest: she warned you about the light.

**Why:** the most emotional option, but it only works on the spared route,
so it would need a different partner on the other route (Pip). Save it for
the summit.

## How the battle would change

- `PARTY` in battleScene gains a second member with `hp`, `maxHp`, a sprite
  and a `command` (what they do on their turn, or a passive).
- The party list already draws names and HP bars; add the second row.
- Enemy attacks keep targeting the one soul: partners aren't dodging, they're
  helping, which keeps the bullet-hell unchanged.
- The overworld follower is `taperFollows` generalised: a `follower` prop
  that trails the player's path.
