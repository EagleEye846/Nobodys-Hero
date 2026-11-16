# Orchestra samples

Recordings of real instruments, from the **VSCO 2 Community Edition** orchestral
library by Versilian Studios (https://github.com/sgossner/VSCO-2-CE), released
under **CC0 1.0** (public domain). Free to use, change and ship; no credit is
required, but it's given here anyway.

Each folder is one instrument; each file is one note, named by its MIDI number
(60 is middle C). They've been trimmed (silence cut from the front, a fade at the
end), levelled within each instrument, and compressed to Ogg Vorbis.
`src/audio/sampleSets.js` lists what's here; songs use them with an instrument
like `{ sample: 'violins', volume: 0.5 }` (see `playSample` in src/audio/music.js).

Some sets (the recorder, ocarina, saxophone, the grand piano, glockenspiel, bowed vibraphone,
wine glasses, chimes, claps, frame drum, tom, concert bass drum and anvil) come from the
**Versilian Community Sample Library** (https://github.com/sgossner/VCSL), also **CC0 1.0**.

Added 11 November 2026 for a small jazz band (the Storm Reach's song):
- From VCSL (CC0 1.0), `Idiophones/Struck Idiophones`: `hatClosed` (Hi-Hat Cymbal,
  `HiHat_HitC_v3_rr1`), `hatSoft` (`HiHat_HitC_v2_rr1`), `hatFoot` (`HiHat_Close_rr1`),
  `hatOpen` (`HiHat_HitO_rr1`), `ride` (Suspended Cymbal 2, `susCymb2_hit_stick_mp1`),
  `rideBell` (`susCymb2_hit_bell_p1`) and `shaker` (Shaker, Small,
  `Mid_ShakerHighFaster_Down_rr1`).
- From VSCO 2 CE (CC0 1.0), `Strings/Solo Contrabass/Pizz`: `bassPizz`, the solo double bass
  plucked (the `_v1_rr1` take of each note; their note names run an octave below ours, so
  `E0` is MIDI 28).
Each is trimmed, faded and levelled to its neighbours, like the rest.

One recording sits beside this folder rather than in it: `assets/audio/waves.ogg`, the faint
waves under chapter 5's credits (the `credits_sea` ambience in src/audio/music.js). It is 50
seconds cut from "Ocean Waves on a Tropical Beach" on Wikimedia Commons
(https://commons.wikimedia.org/wiki/File:Ocean_Waves_on_a_Tropical_Beach.ogg), also **CC0 1.0**,
with its end crossfaded into its start so it loops without a seam.
The `seaWaves` set (eight single waves breaking, small to big, played by the coast ambiences'
`surf` layer and by songs with real waves in them) is cut from the same CC0 recording.

`assets/audio/streetLap.ogg`, the water slopping round the drowned streets of Merrow (the
`lapping` layer of the `drowned_town` and `drowned_inside` ambiences in src/audio/music.js), is
cut from "Water over rocks as tide recedes" by earthcalling on Wikimedia Commons
(https://commons.wikimedia.org/wiki/File:Water_over_rocks_as_tide_recedes.ogg), released into
the **public domain**. It is 27.6 seconds long, levelled to match `waves.ogg`, with its last
2.5 seconds crossfaded into its start so it loops without a seam.
The sea caves' far `boom` and the muffled surf heard indoors are the `seaWaves` crashes again,
slowed and darkened, not new recordings.

`assets/audio/sfx/` holds the old chest opening sounds (`chest.ogg` and `storage.ogg`;
since 13 November 2026 the `chest`, `storage`, `pouch` and `pack` sound effects in
src/audio/music.js are made by the synth instead, and these four recordings are kept but not played). Each is a few recordings layered together (a latch, creaks,
cloth, leather, a buckle, a thump) from "RPG Audio" by Kenney (https://kenney.nl/assets/rpg-audio),
released under **CC0 1.0**. Each is cut to its first quick hit, crushed to a low, gritty quality (short and game-like rather
than realistic), and levelled to the same loudness.

Added 8 November 2026 for chapter 5:

- `assets/audio/sfx/counter.ogg`, `notch.ogg`, `soup.ogg`, `umbrella.ogg`, `shake.ogg` and
  `sidestep.ogg` (the battle moves COUNTER, NOTCH, HOT SOUP, WINDBREAK, SHAKE IT OFF and
  SIDESTEP) are cut from "RPG Audio" by Kenney (https://kenney.nl/assets/rpg-audio), **CC0 1.0**:
  `drawKnife3`, `knifeSlice`, `metalPot2`, `cloth1` with `beltHandle1`, `cloth2` with `cloth3`,
  and `footstep00` with `footstep02`. Trimmed, faded, made mono and levelled.
- `assets/audio/sfx/tideRush.ogg` (the tide turning) and `paddle.ogg` (Bramble's swimming
  lesson) are cut from the `seaWaves` set above (so from the same CC0 Wikimedia Commons
  recording): one wave slowed and darkened, and a short bit of another's break pitched up.
- `assets/audio/gulls/1.ogg` to `5.ogg` (the coast ambiences' `gulls` layer) are single calls
  cut from "XC707075 - European Herring Gull - Larus argentatus" by Sonotheque ADVL
  (https://xeno-canto.org/707075), on Wikimedia Commons
  (https://commons.wikimedia.org/wiki/File:XC707075_-_European_Herring_Gull_-_Larus_argentatus.mp3),
  **CC0 1.0**. Highpassed at 650 Hz to thin out the beach under them.
- `assets/audio/crowd.ogg` (the town hall full for the meeting, the `town_meeting` ambience) is
  32 seconds of "large-crowd-medium-distance-stereo" by eguobyte
  (https://freesound.org/people/eguobyte/sounds/360703/), on Wikimedia Commons
  (https://commons.wikimedia.org/wiki/File:360703_eguobyte_large-crowd-medium-distance-stereo.wav),
  **CC0 1.0**. Band-limited to 120 to 1600 Hz so no words come through, with its last 3 seconds
  crossfaded into its start so it loops without a seam.

Added 8 November 2026 (second sound pass for chapter 5):

- `assets/audio/rain/` holds the rain in every ambience (src/audio/music.js, `startRain`), each
  levelled and looped without a seam (its last 3 seconds crossfaded into its start):
  - `storm.ogg` (rain out in the open, the `rain` layer) and `drizzle.ogg` (lighter rain, the
    `drizzle` layer) are cut from "Light Rain Distant Thunder July 5th 2016" by kvgarlic
    (https://freesound.org/people/kvgarlic/), on Wikimedia Commons
    (https://commons.wikimedia.org/wiki/File:Light_Rain_Distant_Thunder_July_5th_2016.wav),
    **CC0 1.0**. The thunder in it is filtered out (the ambiences make their own). `storm.ogg`
    has "Rain (1)" by ezwa layered over it for a heavier hiss
    (https://commons.wikimedia.org/wiki/File:Rain_(1).ogg), released into the **public domain**.
  - `roof.ogg` (rain drumming on the boards overhead, the `rainRoof` layer) is cut from "Rain on
    a veranda and thunder" by ezwa
    (https://commons.wikimedia.org/wiki/File:Rain_on_a_veranda_and_t.ogg), **public domain**.
  - `glass.ogg` (rain on a window, the `rainGlass` layer) is cut from "Rain against the Window"
    by cori (https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg),
    **public domain**.
- `assets/audio/fire.ogg` (every fire: the `fire` layer of the hearths, the inn, the stoves and
  the forge) is 23 seconds of "Dry grass burning in open fireplace" by ezwa
  (https://commons.wikimedia.org/wiki/File:Dry_grass_burning_in_open_fireplace.ogg),
  **public domain**, its rumble filtered off and its end crossfaded into its start. The fire's
  low roar is the same recording slowed right down.
- New sounds in `assets/audio/sfx/`, cut from two CC0 packs by Kenney: "RPG Audio"
  (https://kenney.nl/assets/rpg-audio) and "Impact Sounds" (https://kenney.nl/assets/impact-sounds),
  both **CC0 1.0**. Trimmed, layered, made mono and levelled; the pouch and the pack are
  roughened like the chest:
  - `pouch.ogg`: `handleSmallLeather` with `beltHandle1`. `pack.ogg`: `cloth2` with `dropLeather`.
  - Doors: `doorWood.ogg` (`doorOpen_1`, `doorClose_2`); `doorHatch.ogg` (`metalLatch`, `creak3`
    slowed, `impactPlate_heavy_000`, `impactMetal_heavy_000`); `doorGate.ogg` (`metalClick`,
    `creak2` sped up, `impactMetal_heavy_001`); `doorCave.ogg` (`footstep_concrete_000` and
    `_002`, a little of `impactMining_000`).
  - Battle moves: `chopHit.ogg` (`chop`), `woodKnock.ogg` (`impactWood_heavy_002`, `_003`),
    `timber.ogg` (`creak1`, `impactWood_heavy_000`, `impactPlank_medium_000`), `marbles.ogg`
    (`impactGlass_light_000` to `_004`), `conker.ogg` (`impactWood_light_001`), `rustle.ogg`
    (`cloth4`, `cloth2`), `coat.ogg` (`cloth3`, `cloth1`), `rummage.ogg` (`handleSmallLeather2`,
    `bookFlip3`), `brace.ogg` (`footstep04`, `clothBelt`, `metalClick`), `standFirm.ogg`
    (`footstep08`, `footstep03`), `rope.ogg` (`creak2`, `cloth1`, `beltHandle2`) and
    `umbrellaShut.ogg` (`cloth2`, `metalClick`).
- `assets/audio/sfx/rainBurst.ogg` and `fireFlare.ogg` (RAIN DANCE and the like; FIRESIDE and
  Ember) are short bits of `rain/roof.ogg` and `fire.ogg` above, so from the same recordings.

Added 9 November 2026 (chapter 4's sound pass: the Glimmering, Belowtown, the Diggings, the
Stillwater and the Deep). The underground sounds are in `assets/audio/under/`, the footsteps in
`assets/audio/sfx/steps/`. All trimmed, made mono (the loops are stereo), levelled, and the
loops have their last 3 seconds crossfaded into their start so they loop without a seam:

- `under/drip1.ogg` to `drip6.ogg` (every cave's `drips`, and slowed right down, `slowdrips`)
  are single drops cut from "Dripping water loop" by qubodup on OpenGameArt
  (https://opengameart.org/content/dripping-water-loop), **CC0 1.0**. Highpassed at 250 Hz.
- `under/pick1.ogg` to `pick5.ogg` (the Diggings' far-off `picks`) are `impactMining_000` to
  `_004` from "Impact Sounds" by Kenney (https://kenney.nl/assets/impact-sounds), **CC0 1.0**.
- `under/creak1.ogg` to `creak3.ogg` (the Diggings' `timbers`) are `creak1` to `creak3` from
  "RPG Audio" by Kenney (https://kenney.nl/assets/rpg-audio), **CC0 1.0**; `creak4.ogg` is cut
  from "Tree Creaking" by AntumDeluge on OpenGameArt
  (https://opengameart.org/content/tree-creaking), **CC0 1.0**. `boat1.ogg` to `boat3.ogg`
  (a moored boat on the Stillwater, `boats`) are `creak3`, `creak1` and the tree creak again,
  slowed down and darkened.
- The `shipTimbers` set in this folder (the ghost ship's songs play the hull's creaks as a
  rhythm) is those same recordings, trimmed and levelled, one to a note: `60` to `62` are
  `under/creak1` to `creak3`, `63` and `64` are `under/boat1` and `boat2`, `65` is
  `under/creak4` (the tree creak), `66` is `under/boat3`, and `67` is `sfx/woodKnock.ogg`
  (`impactWood_heavy_002` and `_003` from Kenney's "Impact Sounds"). All **CC0 1.0**, as above.
- `under/cart1.ogg` to `cart3.ogg` (a cart rattling by on the rails, `carts`) are made by
  layering hits from Kenney's "Impact Sounds" (above, **CC0 1.0**): `impactMetal_light_000` to
  `_004` slowed down for the wheels clacking over the rail joints, and `impactPlate_light_000`
  to `_004` for the box rattling, swelling and fading as it passes.
- `under/anvil1.ogg` to `anvil3.ogg` (the smith's hammer in Belowtown and at Hobnail's forge,
  `hammer`) are the three strikes of "Hammer on anvil" by themightyglider on OpenGameArt
  (https://opengameart.org/content/hammer-on-anvil), **CC0 1.0**.
- `under/market.ogg` (Belowtown talking: the streets, the market, through the inn's and the
  forge's walls) is 30 seconds of "Restaurant Ambience" by stephan (PDSounds), on Wikimedia
  Commons (https://commons.wikimedia.org/wiki/File:Restaurant_ambience.ogg), released into the
  **public domain**. Band-limited to 150 to 1700 Hz so no words come through.
- `under/hall.ogg` (King Peptup's hall full of folk waiting for the show, and the square
  partying after the light goes up) is 30 seconds of "Festival concert people crowd" by stephan (PDSounds), on
  Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Festival_concert_people_crowd.ogg),
  **public domain**. Band-limited to 120 to 1600 Hz.
- `under/lake.ogg` (water lapping across the Stillwater, and far-off water in the Glimmering
  and the Flooded Drift, `lakeLap`) is 30 seconds of "Sea and river wave sounds" (the short
  Vistula recording) by RandomMind on OpenGameArt
  (https://opengameart.org/content/sea-and-river-wave-sounds), **CC0 1.0**. Lowpassed at 1300 Hz.
- `sfx/crowdCheer.ogg` (the hall cheering in the welcome show) is cut from "Clapping hurray"
  by starlite (PDSounds) on Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Clapping_hurray.ogg),
  **public domain**. `under/cheerFar.ogg` (the cheer from very far above when the light goes up,
  `farCheer`) layers "Hurray" by starlite (PDSounds, https://commons.wikimedia.org/wiki/File:Hurray.ogg,
  **public domain**) with the same "Clapping hurray", both darkened.
- Footsteps in `sfx/steps/` (chapter 4's grounds, see FOOTSTEPS in src/audio/music.js):
  `rock1-5` (rock, paving, crystal), `wood1-5` (planks, trestles), `carpet1-5` (rugs, moss,
  ash) and `grass1-5` (Sunnyside's meadows) are `footstep_concrete`, `footstep_wood`,
  `footstep_carpet` and `footstep_grass` `_000` to `_004` from Kenney's "Impact Sounds" (above);
  `gravel1-6` (gravel, packed dirt, the lane) are `footstep00` to `03`, `07` and `08` from
  Kenney's "RPG Audio" (above); `tink1-3` (the glassy tink of crystal underfoot) are
  `impactGlass_light_000` to `_002` from "Impact Sounds", highpassed; `wade1-4` (wading the
  shallows) are `splash_03`, `_12`, `_13` and `_09` from "40 CC0 water / splash / slime SFX" by
  rubberduck on OpenGameArt (https://opengameart.org/content/40-cc0-water-splash-slime-sfx),
  **CC0 1.0**, lowpassed at 3500 Hz. All **CC0 1.0**.
- The Glimmering's crystals sounding (`chimes`) are the `glass` set above (VCSL's wine glasses,
  **CC0 1.0**), not a new recording.

Added 11 November 2026, for Tally's song ("tallyBattle", the Welcome Register in chapter 3):

- The `typewriter` set: `60` to `66` are the first key strike of each of "Typewriter sounds" by
  cassie-orbitgames on OpenGameArt (https://opengameart.org/content/typewriter-sounds), `typewriter1`
  to `typewriter7`, and `67` is the key coming back up at the end of `typewriter5`. **CC0 1.0**.
  Resampled to 44.1 kHz, highpassed at 140 Hz, cut to 0.14 s, levelled.
- The `penScratch` set: `60` to `65` are short strokes cut from `pencil_write.ogg`, `66` a longer
  stretch of it (a whole line written), and `67` a rub from `pencil_erase.ogg`, both from "Pencil
  Sounds" by AntumDeluge on OpenGameArt (https://opengameart.org/content/pencil-sounds). **CC0 1.0**.
  Highpassed at 140 Hz, faded at the ends, levelled.

Added 14 November 2026 (room by room sound for chapters 4 to 6, src/audio/roomAmbience.js): no new
recordings. The far-off one-shots that play now and then over each ambience (`farGull`, `farCreak`,
`farDrip`, `farBoat`, `farPick`, `farCart`) are the recordings already in `assets/audio/gulls/` and
`assets/audio/under/` (credited above), played softly and slowed a little. The two made by the
synth (`farCaw`, a crow a long way off, and `emberPop`, a cinder cracking) are not waves. All waves
in the new room mixes are the real recordings already here (the `surf`, `boom` and `lapping` layers).

Added 15 November 2026 (room by room sound for chapters 1 to 3, src/audio/roomAmbience.js):
- `assets/audio/under/forestEve.ogg` (the `recording` bed of the Pinefall, the Hushwood, the Marsh and
  the Ruins' garden and courtyard) and `assets/audio/under/bird1.ogg` to `bird4.ogg` (the `farBird`
  one-shots) are cut from "Waidachswald Oberschefflenz Abend 20250616 2005" by Evillan on Wikimedia
  Commons (https://commons.wikimedia.org/wiki/File:Waidachswald_Oberschefflenz_Abend_20250616_2005.ogg),
  a summer evening in a wood, **CC0 1.0**. `forestEve` is 45 seconds (seconds 100 to 148 of the
  original, mixed to mono, resampled to 32 kHz, highpassed at 80 Hz, the ends crossfaded so it loops,
  levelled). The four birds are 2.4-second stretches from other places in the recording, highpassed
  at 500 Hz and faded at the ends. Everything else in the new mixes is a recording already here.
