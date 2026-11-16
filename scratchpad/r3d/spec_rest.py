# Round 3 helper D: the other rooms of chapter 5.
REST = {}

REST['wreck_watch_rock'] = dict(
 file='interactions/wreck.txt',
 pokes=[
  ('il_logbook', 7, 8, 'log', "A watchkeeper's log in a biscuit tin to keep the rain off. Every entry says the same: FOG. FOG. FOG. Then one that says: CLEAR. (JOKE.)",
   ('grin', "Ha!"), ('smile', "It's a decent joke for a man alone with a bell.")),
  ('hot_mug', 6, 9, 'mug', "A tin mug upside down on a rock, full of rain. It's a very small pond with a handle.",
   ('thinking', "I wonder if there are fish in it."), ('bored', "There's rain in it. Stop looking for fish.")),
  ('sc_gull', 5, 8, 'gull', "A gull standing on the rock, utterly still, looking at the bell. When you step near, it says nothing and doesn't leave.",
   ('worried', "Is it a ghost gull?"), ('bored', "It's a gull. They have the same expression either way.")),
  ('c5_oilskin_hook', 6, 11, 'oilskin', "An oilskin on a nail in the rock, stiff as a board. Both pockets are full of dried peas.",
   ('glee', "Emergency peas!"), ('bored', "Don't.")),
 ],
 decor=[('il_tidepool_small',8,9),('c5_seaweed_heap',7,10),('il_lichen',5,9),('c5_gull_marks',6,7),('il_rocks',4,11)],
 touches=["{ kind: 'rainrings', x: 6, y: 13, w: 34, h: 3, n: 14 }"],
)

REST['wreck_chain_cliff'] = dict(
 file='interactions/wreck.txt',
 pokes=[
  ('shore_tally_post', 9, 11, 'tally', "A post notched in bundles of five. Someone counted the days of the chain. The last bundle has only four, and then, cut deep: GONE HOME.",
   ('thoughtful', "Four. They were so close to five."), ('bored', "Or they got bored of counting. That's more likely.")),
  ('gs_bitts', 16, 12, 'bitts', "A bollard worn smooth by chain and a century of wanting to go somewhere.",
   ('grin', "It's smooth like a doorknob."), ('bored', "Please don't try to open it.")),
  ('shore_pipe', 17, 21, 'pipe', "A clay pipe jammed in a crack, a twist of tobacco still in the bowl. Whoever kept the chain liked a quiet smoke.",
   ('thoughtful', "It's cold."), ('bored', "That's what happens to pipes.")),
  ('il_kettle', 12, 22, 'kettle', "A kettle on a flat stone with its lid on, full to the top. The rain keeps topping it up.",
   ('glee', "Free tea! If we had a fire."), ('bored', "It's rain. Boiled rain, if you had a fire. A recipe for nobody.")),
  ('c5_oilskin_hook', 8, 12, 'oilskin', "A hook with an oilskin on it, shaped like a man who's just stepped out. It drips.",
   ('worried', "It's dripping on my boot."), ('bored', "It's what oilskins do. They drip, we dry, nobody wins.")),
 ],
 decor=[('c5_rust_bloom',10,12),('c5_puddle',14,22),('c5_seaweed_heap',20,22),('il_lichen',5,21),('c5_crab_trail',11,13),('il_thrift',15,11),('c5_gull_marks',19,21)],
 touches=["{ kind: 'skyGulls', x: 2, y: 2, w: 26, h: 8, n: 3 }"],
)

REST['reach_needle'] = dict(
 file='interactions/reach.txt',
 pokes=[
  ('il_cairn', 20, 12, 'cairn', "A cairn on the ledge, built by people who were very, very tired. The top stone is a lump of white quartz.",
   ('glee', "I'm adding one."), ('bored', "That's a pebble. But fine.")),
  ('c5_handbell', 22, 24, 'bell', "A little handbell on a hook at the ledge. A card: RING IF YOU MADE IT. A gull's already rung it.",
   ('glee', "I made it! DING!"), ('smile', "Once.")),
  ('il_logbook', 6, 24, 'book', "A climbers' book in a tin: names, dates, and drawings of the Needle, each one steeper than the last. The newest has the Needle drawn with a smile.",
   ('grin', "I'm drawing it with a hat."), ('bored', "The Needle is the hat. Go on, then.")),
  ('in_barometer', 14, 34, 'baro', "A brass barometer on a nail at the foot of the climb: STORMY, CHANGE, FAIR, VERY DRY. The needle's wedged on a fifth word, scratched in: WHOOPS.",
   ('grin', "WHOOPS!"), ('bored', "That's not a setting. Somebody drew that on.")),
 ],
 decor=[('il_thrift',18,34),('il_lichen',12,34),('c5_wrack_line',19,35),('il_thrift',9,12),('il_lichen',22,13),('il_grass_tuft',8,24)],
 touches=[],
)

REST['sunny_sea_view'] = dict(
 file='interactions/sunnyside.txt',
 pokes=[
  ('st_sleeper_chair', 5, 6, 'sleeper', "Somebody asleep in a deckchair with a hat over their face. They're snoring in time with the waves, or the waves are snoring in time with them.",
   ('grin', "Shh!"), ('bored', "That's how you wake a sleeper.")),
  ('c5_tide_board', 2, 4, 'ships', "A chalk board: SHIPS SEEN TODAY: 0. LAST WEEK: 0. LAST MONTH: 0 (A BIG ONE, BUT FAR).",
   ('thinking', "Maybe we're the first ship."), ('bored', "We're not a ship.")),
  ('sc_model_boat', 27, 6, 'model', "A model boat on a ledge, rigged and varnished, with a paper sail. NAME: HOPE. It's pointing out to sea like it's about to go.",
   ('glee', "Can we launch it?"), ('bored', "From a cliff? It's a very long drop.")),
  ('st_message_bottle', 18, 4, 'bottle', "A bottle stuck cork-down in the sand with a note rolled in it: THE SEA IS VERY BIG. (I CHECKED.) BURDOCK.",
   ('glee', "BURDOCK! He's been here!"), ('bored', "He came all this way to measure the sea. He did a short sum.")),
  ('sy_picnic_raided', 24, 10, 'picnic', "A picnic, raided: crusts, a crushed jam tart and a long trail of crumbs. One very proud gull on a post, not looking at you.",
   ('worried', "They got everything."), ('bored', "They always do.")),
 ],
 decor=[('r5s_clover',2,3),('il_thrift',1,8),('il_thrift',28,3),('sy_dune_grass',26,3),('r5s_clover',28,8),('il_grass_tuft',2,6),('il_lichen',27,11)],
 touches=[],
)

REST['sunny_cliff_cave'] = dict(
 file='interactions/sunnyside.txt',
 pokes=[
  ('in_knot_board', 18, 11, 'knots', "A board of knots, each tagged with its name. One tag says: THIS ONE IS FOR TELLING A FISH YOU'VE GOT IT.",
   ('glee', "That's the best knot."), ('bored', "It's a loop. With a label.")),
  ('sc_leak_bucket', 21, 11, 'bucket', "A bucket catching a drip from the cave roof. Plink. Plink. It's nearly full, which means whoever emptied it hasn't been back.",
   ('grin', "Plink!"), ('bored', "...Plink. There. Happy?")),
  ('in_net_mending', 19, 16, 'net', "A half-mended net on a frame, the netting needle still in it. Whoever left it knew exactly where they'd stopped.",
   ('thoughtful', "Do you think they'll come back and finish it?"), ('bored', "Not this season.")),
  ('in_cat_bed', 7, 16, 'catbed', "A cat's bed made of an old oilskin, with a fish bone laid on it like a pillow. The cat is somewhere else. It left a muddy paw print over everything.",
   ('glee', "Where's the cat? CAT!"), ('smile', "It left, Bramble. It has a life.")),
  ('lv_lunch_pail', 17, 13, 'pail', "A lunch pail with a heel of loaf, a boiled egg and a note: DON'T FEED THE CAT. The egg has been fed to the cat.",
   ('glee', "The cat's winning."), ('bored', "The cat was always winning.")),
 ],
 decor=[('shore_starfish',10,17),('shore_shells',4,15),('c5_seaweed_heap',14,16),('il_tidepool_small',5,13),('c5_puddle',6,17),('shore_shells_b',20,14)],
 touches=["{ kind: 'caustics', x: 2, y: 4, w: 5, h: 6, color: '140,235,255' }"],
)

REST['sunny_cliff_hollow'] = dict(
 file='interactions/sunnyside.txt',
 pokes=[
  ('st_crab_bucket', 6, 12, 'crabs', "A bucket of crabs with a plank over it and a rock on the plank. Every few seconds the bucket rattles.",
   ('worried', "They're plotting."), ('bored', "They're crabs. They're always plotting.")),
  ('c5_child_drawing', 5, 5, 'drawing', "A child's drawing nailed to the cave wall: a boat, a big sun and three people. One of the people is wearing a very large hat.",
   ('glee', "That's me!"), ('bored', "You were nowhere near here.")),
  ('il_oil_cans', 5, 14, 'cans', "Two oil cans and a rag. One of the cans is labelled SOUP. It smells of oil.",
   ('worried', "Don't. Don't taste it."), ('bored', "Noted.")),
  ('sc_gull', 9, 4, 'gull', "A gull standing on a crate marked FISH, looking at you in a way that suggests the crate is its property.",
   ('worried', "It's going to peck."), ('bored', "It's going to stand there until you leave. That's worse.")),
 ],
 decor=[('shore_starfish',8,12),('c5_seaweed_heap',10,13),('shore_shells',7,14),('c5_puddle',9,11)],
 touches=[],
)

REST['soundings_echo_hall'] = dict(
 file='interactions/soundings.txt',
 pokes=[
  ('sd_chart', 22, 4, 'chart', "A chart of the hall in chalk. Every ring-stone is marked with how long its echo lasts: 3, 3, 4, WAIT FOR IT.",
   ('glee', "HELLO! ...hello... hello..."), ('bored', "It said hello back three times. Rude.")),
  ('in_logbook_stand', 26, 5, 'log', "A sounder's log on a stand. Day after day: DEPTH 14. DEPTH 14. DEPTH 15 (!!). DEPTH 14.",
   ('glee', "FIFTEEN!"), ('bored', "Two exclamation marks. A fish must have been involved.")),
  ('in_stool_mug', 17, 6, 'mug', "A three-legged stool with a tin mug of rainwater on it and a tiny paper boat afloat inside. Someone sailed it.",
   ('glee', "Captain Mug!"), ('smile', "Mind the rocks.")),
  ('moles_hard_hat', 8, 7, 'hat', "A hard hat on top of a stalagmite, so the stalagmite looks like a very serious foreman.",
   ('glee', "Hello, Foreman."), ('bored', "Mind your manners. It's been here longer than the hat.")),
 ],
 decor=[('lv_cave_fern',8,3),('sd_glass_shards',14,5),('sd_scree',12,4),('lv_cave_fern',29,3),('sd_scree',20,3)],
 touches=["{ kind: 'echodrip', x: 20, y: 3.2, fall: 5, every: 9 }"],
)

REST['lanes_causeway'] = dict(
 file='interactions/lanes.txt',
 pokes=[
  ('lv_bench', 2, 3, 'bench', "A bench built for waiting. It faces the water, and the sign over it says NEXT TIDE: LATER.",
   ('thinking', "How much later?"), ('bored', "That's the question the bench answers.")),
  ('lv_boot', 36, 3, 'boot', "A single wader boot upright on a post, rain pouring out of the top in a neat line. Somebody's idea of a signpost.",
   ('glee', "BOOT SIGN!"), ('bored', "It points in no direction. Efficient.")),
  ('lv_skep', 38, 3, 'skep', "A bee skep on a flat stone, dry and silent.",
   ('worried', "Where did the bees go?"), ('thoughtful', "Up the hill, I imagine. Bees are sensible.")),
  ('cl_rain_butt', 35, 2, 'butt', "A rain butt, full to the brim, its lid floating on top like a hat. The only thing in the Lanes with a good reason to be this full.",
   ('glee', "I'm jumping in it."), ('bored', "No.")),
 ],
 decor=[('c5_puddle',3,14),('ln_moss_a',37,10),('c5_wrack_line',2,6),('c5_gull_marks',36,4)],
 touches=[],
)

REST['gullrest_jetty'] = dict(
 file='interactions/gullrest.txt',
 pokes=[
  ('in_rods_corner', 13, 12, 'rods', "A rack of fishing rods leaning in order of size, with a card: BORROW ONE. BRING IT BACK. BRING A FISH, TOO.",
   ('glee', "Can we borrow one?"), ('bored', "Have you got a fish?")),
  ('st_cat_loaf', 11, 15, 'cat', "A tabby asleep in the sun on a coil of rope, one paw on a fish head it has decided is its own.",
   ('glee', "Can I stroke it?"), ('smile', "Ask the fish.")),
  ('hs_oars', 9, 9, 'oars', "A row of oars with names burnt into the blades: BETSY, BIG BETSY, NOT BETSY.",
   ('grin', "Not Betsy is my favourite."), ('bored', "Not Betsy is clearly the best oar.")),
  ('sc_coast_map', 7, 10, 'map', "A map of the coast pinned to a post, with a thumb-sized hole in it where the Reach should be. Someone has written: HERE BE... PROBABLY ROCKS.",
   ('thinking', "Is that where we're going?"), ('bored', "Wherever there's a hole in the map. Apparently.")),
 ],
 decor=[('st_shells',5,9),('st_starfish',12,13),('c5_rope_coil',6,5),('st_dinghy_a',30,12,'water'),('st_dinghy_b',36,6,'water'),('sy_dune_grass',3,3)],
 touches=["{ kind: 'swimfish', x: 28, y: 3, w: 16, h: 5, n: 3 }"],
)

REST['lastlight_upper'] = dict(
 file='interactions/lastlight.txt',
 pokes=[
  ('in_calendar', 3, 4, 'calendar', "A tear-off calendar stuck on a single day. Someone has circled it and drawn a very small lamp beside it.",
   ('thinking', "What happened that day?"), ('bored', "Whatever it was, it was the last page they cared about.")),
  ('il_broom', 10, 5, 'broom', "A long broom with a bundle of rags tied on the end, for dusting the lamp glass. Every strand has been combed.",
   ('thinking', "Who combs a broom?"), ('bored', "Someone with a very long staircase and a lot of time.")),
  ('il_oil_cans', 22, 5, 'cans', "Oil cans in a row, each with a brass spout and a number scratched on it: 1, 2, 3, 5, 6, 7, 8, 9. There is no number four.",
   ('worried', "Where's four?"), ('bored', "Used. Next question.")),
  ('in_stool_mug', 13, 13, 'stool', "A stool and a mug set by the stairwell, for whoever is carrying oil up and needs to sit on the third landing and curse.",
   ('glee', "I'll curse for you!"), ('bored', "Please don't.")),
  ('cl_wall_clock', 14, 9, 'clock', "A wall clock with both hands stopped on twelve, which is lamp-lighting time.",
   ('worried', "Is that midnight?"), ('thoughtful', "It's when the lamp should have been lit. Leave it.")),
 ],
 decor=[('c5_puddle',8,12),('c5_rubble',3,16),('c5_floor_crack',10,16),('c5_puddle',22,10),('c5_rubble',18,5)],
 touches=["{ kind: 'motes', x: 2, y: 3, w: 20, h: 12, n: 10, color: '220,210,170' }"],
)

REST['ship_figurehead_perch'] = dict(
 file='interactions/ghostship.txt',
 pokes=[
  ('gs_bottles', 8, 7, 'bottles', "A row of bottles on a rail, all corked, all empty, all labelled: FOR LATER.",
   ('worried', "Later what?"), ('bored', "They never said. It's why they're empty.")),
  ('gs_tricorn', 14, 7, 'hat', "A hat on a nail, its brim pressed to the shape of a head that isn't there. It tilts when you look away.",
   ('worried', "It tilted."), ('bored', "Everything tilts. It's a ship.")),
  ('gs_log_bottle', 22, 7, 'logbottle', "A bottle on the deck with a log page rolled up inside: DAY 1,000. THE FIGUREHEAD HAS NOT MOVED. (IT IS LOOKING AT ME.)",
   ('worried', "..."), ('bored', "Don't look at it back.")),
  ('r5g_dice', 23, 6, 'dice', "Two dice on a barrel lid, mid-game, six and six. A pile of buttons for stakes. Nobody's counted them.",
   ('glee', "Double six! I win!"), ('smile', "Against who?")),
 ],
 decor=[('gs_net_heap',21,8),('gs_barrel_staves',14,6),('gs_weed_a',9,8),('gs_puddle',16,7)],
 touches=[],
)

REST['isles_gannet_stack'] = dict(
 file='interactions/isles.txt',
 pokes=[
  ('il_stakes_rope', 13, 4, 'stake', "A bird-counter's stake with a tally: 1,214 ADULTS. 1,213 ADULTS. 1,215 ADULTS. The last number has been rubbed out and written again, very firmly.",
   ('thinking', "How do you count a gannet?"), ('bored', "Carefully. And never twice.")),
  ('telescope', 5, 6, 'scope', "A telescope on a tripod, pointed at one nest. In the lens: a chick bigger than its mother, being fed anyway.",
   ('glee', "Let me see!"), ('smile', "He's enormous.")),
  ('il_note_tidy', 32, 3, 'note', "A note held under a stone: BACK AT FOUR. (CHICKS.)",
   ('glee', "What time is it?"), ('bored', "Not four.")),
  ('r5s_deckchair', 32, 13, 'deckchair', "A deckchair, a flask and a pair of binoculars on the seat. Everything is pointed at the cliff, which is full of birds who aren't looking back.",
   ('grin', "They're ignoring us. It's rude."), ('smile', "They've got a lot to ignore.")),
 ],
 decor=[('il_gull',17,5),('il_thrift',20,5),('il_lichen',9,7),('il_grass_tuft',22,4),('il_thrift',8,3)],
 touches=[],
)

REST['lanes_bubble'] = dict(
 file='interactions/lanes.txt',
 pokes=[
  ('il_tea_table', 15, 13, 'tea', "A tea table in a bubble of air under the sea, set for three. The tea's long cold, a crumb of cake on each plate.",
   ('thinking', "Three places. Who's the third?"), ('bored', "Somebody late.")),
  ('lv_sundial', 13, 6, 'sundial', "A sundial under a roof of water. The gnomon throws a shadow from a light that isn't here.",
   ('thinking', "What time is it in a bubble?"), ('bored', "Bubble time. About half past.")),
  ('lv_birdbath', 19, 8, 'birdbath', "A birdbath full of sea. A small crab sits in it, looking extremely at home.",
   ('glee', "A crab bath!"), ('smile', "He thinks he's a bird. Let him.")),
  ('lv_glove', 18, 12, 'glove', "A single glove on a hook, fingers curled as if waiting to be held. The leather's gone green, but it's soft.",
   ('worried', "...Gloves are the worst."), ('bored', "That's very specific.")),
 ],
 decor=[('lv_cave_fern',16,6),('ln_moss_a',17,13),('lv_cave_fern',14,12),('ln_moss_b',20,12)],
 touches=["{ kind: 'sparkle', x: 14, y: 5, w: 7, h: 4, n: 8, color: '200, 235, 255' }"],
)

REST['reach_wreck'] = dict(
 file='interactions/reach.txt',
 pokes=[
  ('gs_ship_bell', 38, 7, 'bell', "A ship's bell fallen out of its frame, cracked down one side. It still sounds, a little, like a sigh.",
   ('glee', "BONG. ...bong?"), ('bored', "That's what's left of BONG.")),
  ('gs_chart_table_book', 36, 10, 'chart', "A sea chart soaked to felt. You can make out one word: HERE. There's an arrow, rubbed through.",
   ('thinking', "Here what?"), ('bored', "Here here. Very helpful.")),
  ('gs_sack_spill', 16, 13, 'grain', "A burst sack of grain, a hundred years old and fresh as the day. The gulls won't touch it.",
   ('worried', "Gulls eat everything."), ('bored', "Then it isn't food.")),
  ('gs_hammock_sag', 20, 12, 'hammock', "A hammock strung between two ribs of the wreck, sagging in the middle, a hat over the end as if somebody's snoring.",
   ('glee', "I'm getting in."), ('bored', "It's four hundred years old and made of barnacles.")),
 ],
 decor=[('shore_shells',12,12),('shore_starfish',24,12),('c5_seaweed_heap',37,12),('shore_kelp',15,14)],
 touches=[],
)

REST['wreck_under_point'] = dict(
 file='interactions/wreck.txt',
 pokes=[
  ('in_boots', 22, 10, 'boots', "A pair of sea boots set neatly side by side on a rock, as if their owner took them off to paddle and never came back for them.",
   ('worried', "Don't think about it."), ('bored', "I'm not.")),
  ('gs_log_bottle', 5, 6, 'bottle', "A bottle with a log page inside: FOG. FOG. TIDE. FOG. LUNCH.",
   ('grin', "Lunch is the best bit."), ('bored', "Lunch is always the best bit.")),
  ('shore_whelk', 4, 3, 'whelk', "A whelk shell big as a boot, with a smaller shell tucked inside it, and a smaller one inside that. Three deep.",
   ('glee', "A shell family!"), ('smile', "A very small queue.")),
 ],
 decor=[('shore_shells_b',3,9),('c5_seaweed_heap',21,12)],
 touches=[],
)

REST['soundings_tide_stair'] = dict(
 file='interactions/soundings.txt',
 pokes=[
  ('in_barometer', 4, 11, 'gauge', "A brass tide gauge bolted to the stair wall: HIGH (OH DEAR), LOW (OH GOOD), MIDDLE (DEPENDS). The needle's on DEPENDS.",
   ('grin', "It depends!"), ('bored', "On what, it doesn't say.")),
  ('lv_candle_stubs', 12, 3, 'candles', "Candle stubs on every third step, for the sounders who went down in the dark. Each has a thumbprint pressed in the wax.",
   ('thoughtful', "It's like a trail made of little lights."), ('bored', "Practical people. I like them.")),
  ('il_logbook', 22, 23, 'log', "A sounder's logbook swollen with damp. The last line, written in a hurry: STAIRS FLOODED AGAIN. WALKED UP THE WALL.",
   ('glee', "He walked up the WALL?"), ('bored', "Obviously not literally.")),
  ('lv_boot', 3, 25, 'boot', "A boot on the stairs full of seawater, with a small fish living in it. The fish looks well.",
   ('glee', "Fish boot!"), ('bored', "Ex-boot.")),
 ],
 decor=[('sd_scree',6,3),('lv_cave_fern',14,13),('sd_glass_shards',24,24),('lv_drip_column',16,22)],
 touches=[],
)

REST['lanes_sluices'] = dict(
 file='interactions/lanes.txt',
 pokes=[
  ('in_logbook_stand', 3, 2, 'log', "The sluice-keeper's log: GATES UP. GATES DOWN. GATES UP. WHO KEEPS CHANGING THE GATES? The last entry just says: ME.",
   ('glee', "ME!"), ('bored', "He worked it out. That's something.")),
  ('st_cat_loaf_b', 34, 2, 'cat', "A ginger cat on top of a sluice post, flat as a loaf, watching the water go by with great disapproval.",
   ('glee', "Hello!"), ('bored', "It won't answer. It's judging the water.")),
  ('lv_lunch_pail', 4, 14, 'pail', "A lunch pail on a ledge above the water line, tied with string. On the lid: NOT FOR SLUICE-KEEPERS. Written by a sluice-keeper.",
   ('grin', "Hah!"), ('bored', "A rule he'd clearly tested.")),
 ],
 decor=[('lv_reeds',5,2),('c5_puddle',2,15),('ln_moss_a',36,13)],
 touches=[],
)
