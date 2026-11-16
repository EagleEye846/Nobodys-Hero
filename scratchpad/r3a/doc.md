
### Round 3, helper A: chapters 1 and 2 (prefix r3a_)

Played in order with stills and the metrics page (`tools/r3aMetrics.html?ids=...`: props, talkers, sprites, monsters per room). 51 rooms scored out of 10 (see, poke, find; a reason to exist; looks like a picture; not a copy of the room before). Rooms that scored 7 or more before are left as they were.

**Round 3 scores (chapters 1 and 2)**

| Room | Before | After | Note |
|---|---|---|---|
| ruins_entrance, lantern_hall, pillar_room, flower_room, taper_home, taper_kitchen, your_room | 8 | 8 | full of things, each with a reason |
| taper_hall, way_out | 7 | 7 | fine |
| beyond_ruins | 4 | 8 | the first look at the world was two props and a meadow |
| goat_track, climb_start | 7 | 7 | fine |
| sheer_face | 5 | 8 | a wall of bare rock with rings on it |
| vigil_ridge, spiral, hollow, shoulder, cloud_walk, second_cairn, cloud_bank, broken_span, wind_stair, lamplighters_ledge, weathervanes, vane_gardens | 8 | 8 | |
| vigil_ice_face, knife_edge, high_shelf, gale_face, ice_chimney, spire_neck, owl_shelf | 7 | 7 | |
| cave_entry | 3 | 7 | six props, no living things, black |
| cave_gallery | 3 | 8 | the Singing Gallery had eight props and no song |
| vigil_lamplighters_hut | 6 | 7 | |
| ice_cave_throat | 5 | 7 | |
| ice_cave_grotto | 6 | 8 | |
| ice_cave_hall | 5 | 7 | |
| ice_cave_roost | 6 | 7 | |
| vigil_summit | 5 | 7 | a white floor with a column |
| rest_gate, rest_lookout | 7 | 7 | |
| rest_square | 9 | 9 | the best room in the stretch |
| rest_inn | 8 | 8 | |
| rest_hall | 6 | 8 | |
| rest_stores | 6 | 8 | |
| rest_forge | 5 | 7 | the forge had 11 props and was left alone in round 2 |
| rest_belltower | 5 | 8 | |
| rest_house_marta | 6 | 8 | |
| rest_house_pottle | 6 | 8 | |
| rest_chapel | 6 | 7 | |

Fixed 17 rooms (a third of the stretch, not only the bottom quarter): beyond_ruins, sheer_face, cave_entry, cave_gallery, vigil_lamplighters_hut, the four ice cave rooms, vigil_summit, and the hall, stores, forge, belltower, both houses and the chapel in Heralds' Rest.

What each had missing, and what went in (222 new pieces, 92 of them to press Z on, most with a Ves line where she is there):
- **beyond_ruins**: a picnic rug laid for a Hero who never came (two cups, one chipped), a signpost (UP. (BURIED.)), a cold fire ring, BARNABY's flask, a name stone (BERT (TURNED BACK) / BERT (WENT AGAIN)), wildflowers, heather and scree, bees, swaying grass, finches.
- **sheer_face**: a telescope on the top ledge (the Ruins as a thumbprint, the dummy still on its patrol), a ribboned cairn at the top, a flask of tea for the next climber on the halfway ledge, a cairn with one stone for each climber who started, a cold fire ring, BERT WAS HERE on the rock, frost cracks and icicles on the face, glints.
- **cave_entry**: a guide-line of rope tied round stalagmites (it runs on through the ice cave rooms behind the Weathervane Shelf too), a coil with BERT's tag, a frozen flask, boots, pale glowing toadstools, a drip pool that gives the note back, chalk arrows, drips, glow, mist, glowbugs.
- **cave_gallery**: chalk notes (E, G, D) on seven stalagmites, a hum slab (hand on it: a low note), THE GALLERY IS IN D (SLIGHTLY FLAT), a tea kit and a frozen bedroll, PLEASE DON'T WHISTLE. IT WHISTLES BACK, toadstools, glows that pulse, bats.
- **vigil_lamplighters_hut**: oil shelf with a half-written label, a table with two mugs (one turned to the chair, one to the door), a frosted window, THE ROUND roster, kindling for whoever comes next; a candle glow and dust motes. Ves answers each.
- **ice_cave_throat, grotto, hall, roost**: Bert's trail (bedroll, tea kit, slates, "back by dark"), the guide-line, a price slate and a heap of single boots at the goblin's stall, a frozen fall with a rainbow, the golem warning, a bat census, guano, big claw marks in the roost; Ves lines on every one.
- **vigil_summit**: five rime fins, a summit register in a tin (VIEW. WIND. VIEW. WIND.), a very small snowman, the last LOST HERO'S HAT stake. Placed away from the arrival scene's walks.
- **Heralds' Rest**: the Hall of Heralds (WELCOME, HERO banner repainted 11 times, a statue under a bedsheet, a dust-sheeted chair, the suggestions bowl, the arrivals board with its row of blanks); the stores (cheese, scales, THE LAST ROPE, four named hams, the shop mouse's footprints, today's slate); the forge (bellows, blade rack, horseshoes, tong board, quench tub, coal, grindstone, sparks, steam, firelight); the belltower (a dove with boundaries, the bell rope, a ringer's tea corner, the slate "not a snooze button", two arrow slits, a secret geranium); Marta's loom (the long scarf runs out of the window: the Lanes' too-long scarf), the wheel, the knitting; Pottle's buns, bird (CRUMB IS A LIAR) and slate; the chapel's donation box (buttons), wish bowl (COME SOON, PLEASE; BRING SOUP), hymnals, kneelers.
- Small running gags tie it together: Bert, "don't tell the horse/inn/tower" (three secret geraniums), the Hero's welcome waiting.

How: art `src/data/art/r3aLife.js` (61 sprites, ids `r3a_`, characters from 0xaa00; hooked in with three lines in `restLife.js`); props `src/data/r3aLife.js`, spread into 17 room files with one line each; living things added to `src/data/restTouches.js` (existing kinds only: drips, glow, sparkle, mist, steam, sparks, bees, grass, finches, bats). Words: `r3a_*` blocks at the end of `the_stair.txt`, `mount_vigil.txt`, `upper_vigil.txt`, `ice_caves.txt` and `heralds_rest.txt`. Everything is bodiless (`walkable`) and nothing with words stands within a column of a ring on the Sheer Face; the summit's decoration stays off the arrival walk. A cord loop or chalk note overlays a stalagmite from the tile just south of it (a prop on the spike's own tile is drawn under the spike).

Checks: `?check=1` clean when run (twice it stopped on another helper's file mid-edit); `?poke=` ok on all 17 rooms (with Ves where she is); `?mask=` clean after two fixes (the oil shelf covered the chalk tally; the window covered Marta's fireplace); textCheck Problems 0; chapter 1 walk-through all pass; chapter 2: lines 1 to 53 (to the first ice cave room) plus every line for the ice caves, summit, stores, forge, hall, houses and chapel pass (the full file was stopped at line 53 because the shared browsers made it take hours); six new lines at the end of chapter-2-playthrough.txt (signpost/picnic/names, the slab and slate, the bellows and tub, the loom and basket, the wish bowl and donation box, the banner and statue) pass. I looked at stills of every fixed room. Also added `tools/r3aMetrics.html` (a plain count of props, talkers, sprites, monsters and touches per room, for the next fun check).
