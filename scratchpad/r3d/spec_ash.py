# Round 3 helper D: the Ash Road rooms. (room -> pokes, decor, touches)
# poke: (sprite, x, y, key, description, (mood, bramble line), (mood, ves line))
ASH = {}

ASH['ash_seabed'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('shore_whelk', 16, 4, 'shell', "A shell as big as a hip bath, lying open like a book. The sand inside has been smoothed by a very long tide.",
   ('grin', "I could sleep in it. I'm sleeping in it."), ('bored', "You'd be mistaken for a clam. Briefly.")),
  ('shore_bottle', 22, 6, 'bottle', "A corked bottle half in the sand, a roll of paper inside. In a careful hand: IS IT STILL RAINING? PLEASE WRITE BACK.",
   ('thinking', "We could write back. We'd have to find the sea first."), ('thoughtful', "Leave it. Somebody's waiting on an answer, and it's a nice question.")),
  ('c5_tide_board', 26, 7, 'board', "A tide board with a chalk slot. LOW, it says. Underneath, in somebody's best hand: NEXT HIGH, SEE ME. There's no one to see.",
   ('worried', "How long is a low?"), ('bored', "Longer than usual.")),
  ('il_rowboat_half', 24, 3, 'rowboat', "A small rowing boat sitting dry on its keel with the oars shipped, as if it had only stepped out. A tin mug on the seat has a skin of ash in it.",
   ('thinking', "Whoever was waiting for the tide gave up on the tide."), ('thoughtful', "Or the tide gave up on them. Either way, it's a nice boat.")),
  ('c5_buoy_yellow', 15, 8, 'buoy', "A yellow buoy lying on its side, with a face painted on it, very badly. It still has most of its rope.",
   ('grin', "Hello, Kevin."), ('bored', "Don't name it.")),
 ],
 decor=[('shore_starfish',12,5),('shore_shells',20,5),('c5_wrack_line',18,6),('c5_crab_trail',24,5),('c5_driftwood',27,4),
        ('il_rocks_flat',14,3),('shore_kelp',26,3),('shore_shells_b',17,7),('shore_fishbones',11,4),('c5_seaweed_heap',21,3)],
 touches=["{ kind: 'glint', points: [[13.5, 5], [21, 7], [27, 5], [18, 4]] }",
          "{ kind: 'mist', x: 10, y: 8, w: 22, h: 3, n: 4, color: '180, 170, 160' }"],
)

ASH['ash_tideline'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('c5_deckchair', 4, 10, 'deckchair', "A deckchair set up facing the dry seabed. The stripes were blue once. Somebody sat here a long time, waiting for the sea to come back.",
   ('thinking', "It's still pointed the right way."), ('thoughtful', "Optimists have good chairs.")),
  ('st_sandcastle', 23, 6, 'castle', "A sandcastle, baked hard as brick by the ash. A tiny flag sticks out of the tower: a shell on a stick.",
   ('glee', "It's still standing! It's the strongest castle in the world!"), ('smile', "It's the only one.")),
  ('st_bucket_spade', 4, 12, 'bucket', "A tin bucket and a wooden spade, put down neatly side by side. Whoever left them meant to come back.",
   ('worried', "Where's the kid?"), ('thoughtful', "Up the road. Everybody went up the road.")),
  ('st_beach_umbrella', 19, 12, 'umbrella', "A beach umbrella planted in the ash. Its red and white stripes have gone grey and grey.",
   ('grin', "Yours is better."), ('bored', "Mine's better. Yes.")),
  ('st_glass_float', 20, 13, 'float', "A green glass float, the kind nets used. You hold it up to your eye, and the whole grey world goes green and wet and wavy.",
   ('glee', "Do it again!"), ('smile', "...Again.")),
 ],
 decor=[('c5_gull_marks',6,3),('st_shells',6,5),('st_starfish',4,13),('st_towel_a',23,4),('c5_wrack_line',2,10),
        ('il_rocks',30,4),('shore_kelp',25,11),('c5_crab_trail',26,9),('st_shells',17,8)],
 touches=["{ kind: 'glint', points: [[3, 9], [24, 5.5], [20.5, 12.5]] }",
          "{ kind: 'mist', x: 1, y: 7, w: 8, h: 6, n: 4, color: '180, 170, 160' }"],
)

ASH['ash_buried_road'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('cl_sign_bread', 15, 3, 'bread', "A bread sign on a bracket, hanging from nothing. There's no shop under it, only a hump of ash the shape of a roof.",
   ('worried', "Is the baker down there?"), ('bored', "Bakers keep early hours. Don't knock.")),
  ('cl_wall_clock', 15, 5, 'clock', "A wall clock lying face up in the ash, stopped at ten to four. The glass is whole.",
   ('thinking', "Did it stop, or did someone stop it?"), ('bored', "Clocks stop. It's their whole personality.")),
  ('cl_bundle', 22, 4, 'bundle', "A bundle tied up in a blanket, the knot still tight. Someone dropped it and kept going.",
   ('worried', "Should we open it?"), ('bored', "It's socks. It's always socks.")),
  ('cl_hand_cart', 21, 11, 'cart', "A hand cart with one wheel, still loaded: a sack of something grey, a rolled rug, an empty birdcage with its door open.",
   ('thinking', "Why take a birdcage?"), ('thoughtful', "So you'd know where the bird was safe.")),
  ('cl_street_chair', 19, 12, 'chair', "A chair set facing the road, its back to the field. The seat's worn pale. A good place to see who was coming.",
   ('thinking', "Who was coming?"), ('bored', "Us, apparently. Late.")),
  ('lv_lunch_pail', 22, 12, 'pail', "A lunch pail with a clasp. Inside: a heel of bread turned to stone, and a note. EAT THIS FIRST. LOVE, MA.",
   ('worried', "..."), ('thoughtful', "Put it back. Gently.")),
 ],
 decor=[('al_stalks',22,3),('cl_weeds',14,4),('c5_rubble',17,5),('al_dune_a',24,4),('cl_weeds_tall',24,5),
        ('al_stalks',17,10),('cl_weeds',20,12),('c5_floor_crack',16,9),('al_dune_b',24,12)],
 touches=["{ kind: 'mist', x: 14, y: 9, w: 10, h: 4, n: 4, color: '170, 160, 150' }"],
)

ASH['ash_cinder_field'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('washing_line', 5, 8, 'washing', "A washing line with the washing still pegged on: three shirts, a sheet and one very small sock. Stiff as boards, grey as the sky.",
   ('thinking', "The sock's my size."), ('thoughtful', "Somebody was on the last chore of a long day.")),
  ('cl_wash_tub', 2, 12, 'tub', "A wash tub on a stand, full to the brim with ash. When you stir it, it's soft as flour.",
   ('glee', "It's like snow, but it doesn't go away."), ('bored', "That's the problem with it.")),
  ('cl_veg_bed', 16, 7, 'vegbed', "A vegetable bed with its rows neatly staked. Every stake has a seed packet on it, still in colour: PEAS, BEANS, TURNIPS. One just says SURPRISE.",
   ('glee', "Surprise! What's the surprise?"), ('smile', "Probably a turnip.")),
  ('cl_stick_horse', 22, 10, 'horse', "A stick horse leaning on a fence post: a sock for a head, two button eyes. It's been waiting for its rider to come back from dinner.",
   ('grin', "I'm calling him Trotter."), ('smile', "Of course you are.")),
  ('cl_apple_crate', 22, 7, 'apples', "A crate of apples, black and shrunk to the size of walnuts. One has a bite out of it.",
   ('worried', "Who bit it?"), ('bored', "A worm. The worm left.")),
  ('r5s_bale_stack', 30, 8, 'bales', "Hay bales stacked three high, grey all through. They still smell of summer if you put your nose right in.",
   ('glee', "They do!"), ('bored', "I'm not putting my nose in a bale.")),
 ],
 decor=[('cl_weeds_tall',1,4),('cl_weeds',5,3),('al_dune_a',11,12),('c5_floor_crack',6,10),('c5_rubble',13,13),
        ('al_stalks',32,4),('cl_weeds',28,6),('al_stalks',3,14),('cl_weeds_tall',17,3)],
 touches=["{ kind: 'mist', x: 1, y: 10, w: 12, h: 4, n: 4, color: '170, 160, 150' }"],
)

ASH['ash_orchard'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('cl_cask_rack', 24, 8, 'casks', "A cask rack, the casks stacked and the bungs in. One has CIDER, FIRST PRESSING chalked on its end, and a smiley.",
   ('glee', "Can we open it?"), ('bored', "It's been shut since before your grandmother.")),
  ('r5s_apple_basket', 24, 11, 'basket', "A basket of windfalls, the apples all grey now and light as paper. Under them, a folded cloth, still clean.",
   ('thinking', "Who put the cloth in?"), ('thoughtful', "Someone who meant to cover them for the walk home.")),
  ('r5s_ladder', 14, 11, 'ladder', "A ladder against a dead apple tree, one rung missing near the top. Somebody went up for the last apple.",
   ('thinking', "Did they get it?"), ('bored', "I'd say they came down faster than they went up.")),
  ('cl_bird_table', 5, 11, 'birdtable', "A bird table with a saucer of seed gone to dust, and a little cloth cap for a roof.",
   ('worried', "Where are the birds?"), ('thoughtful', "Up the road. Where the food is.")),
  ('cl_milk_stool', 28, 7, 'stool', "A milking stool and a pail. The pail has a skin of ash across it like old milk.",
   ('worried', "Is there a cow?"), ('bored', "There isn't a cow. Don't look for the cow.")),
 ],
 decor=[('cl_weeds_tall',12,3),('al_stalks',16,5),('al_dune_a',17,3),('cl_weeds',36,10),('r5s_apples_fallen',23,12),
        ('cl_weeds',9,11),('al_stalks',33,11),('r5s_apples_fallen',13,13),('al_dune_c',36,7)],
 touches=["{ kind: 'leaffall', x: 1, y: 2, w: 36, h: 12, n: 3 }"],
)

ASH['ash_storm_flats'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('c5_tattered_flag', 20, 6, 'flag', "A flag on a pole, torn to a ribbon. It points the same way all the time. That way.",
   ('thinking', "That way what?"), ('bored', "North. Which is where we're going. So that's one useful rag.")),
  ('sy_windsock', 22, 13, 'windsock', "A windsock stuck out stiff, though there's no wind in it right now. It's full of ash.",
   ('worried', "It knows the gust's coming."), ('bored', "It's not a forecast. It's a sock.")),
  ('cl_trunk', 35, 5, 'trunk', "A traveller's trunk with a strap round it and the lid sealed in wax. A stamped address in red: HEARTH, CARE OF THE SMITH.",
   ('glee', "A delivery! We're nearly delivering a trunk!"), ('bored', "We're nearly not carrying a trunk.")),
  ('cl_stone_cat', 38, 5, 'cat', "A stone cat sitting on a gatepost, ash up to its whiskers. It has a very satisfied face.",
   ('glee', "I'm patting it."), ('smile', "It'll be the best behaved cat you've met.")),
  ('lv_barrow', 18, 14, 'barrow', "A wheelbarrow tipped on its side, one wheel in the air. The wind gives it a flick now and then.",
   ('grin', "Whee."), ('bored', "Don't get in.")),
 ],
 decor=[('al_dune_a',19,4),('al_dune_b',24,14),('al_stalks',21,11),('c5_floor_crack',36,7),('al_dune_c',34,13),
        ('al_stalks',2,4),('al_log',2,15),('al_dune_a',38,10),('al_stalks',43,12)],
 touches=["{ kind: 'mist', x: 2, y: 14, w: 40, h: 3, n: 5, color: '175, 165, 155' }"],
)

ASH['ash_waystation'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('in_mug_rail', 22, 9, 'mugs', "A rack of tin mugs on hooks, each with a name scratched in the base: ROOK, ODA, BIG TOM. One has no name at all.",
   ('thinking', "There's one with no name."), ('bored', "Take it. That's what the blank one's for.")),
  ('cl_coal_scuttle', 19, 11, 'scuttle', "A scuttle with the last of the coal in the bottom, packed round with ash. KEEP IT FOR THE KETTLE is scratched on the side.",
   ('grin', "Rules are rules."), ('bored', "Rules are why there's a kettle.")),
  ('cl_rota_board', 23, 7, 'rota', "A chore rota nailed to a post: SWEEPING, WATER, SOUP, HOPE. Someone's ticked the first three.",
   ('worried', "Who does HOPE?"), ('thoughtful', "Whoever's last in the queue.")),
  ('in_knot_board', 26, 9, 'knots', "A board of knots, each tagged with its name. The last tag says: THE ONE YOU TIE WHEN YOU'RE TIRED.",
   ('glee', "Teach me that one!"), ('bored', "It's a bow. Everyone knows it.")),
 ],
 decor=[('in_boots_dry',19,8),('al_stalks',3,6),('c5_doormat',22,6),('cl_hoop',24,12),('al_stalks',3,11),('c5_floor_crack',16,9)],
 touches=["{ kind: 'mouse', x: 20, y: 12, w: 3 }"],
)

ASH['ash_drift_cut'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('cl_paper_stack', 24, 10, 'receipts', "A stack of toll receipts held down by a stone: PAID, PAID, PAID, PAID. The stone has a face painted on it.",
   ('grin', "It looks very pleased with itself."), ('bored', "It's a paperweight. It's earned the face.")),
  ('cl_ledger_lectern', 28, 7, 'ledger', "A ledger on a stand. The last entry: ONE CART. ONE GOAT. ONE MAN, WOULD NOT GIVE HIS NAME. TOLL: HIS HAT.",
   ('thinking', "He wouldn't give his name, so they took his hat."), ('bored', "Sensible. Hats are expensive.")),
  ('c5_rope_coil', 17, 7, 'rope', "A length of toll rope, cut clean through. The cut end isn't frayed. Somebody used a knife and wasn't in a hurry.",
   ('worried', "So nobody paid?"), ('thoughtful', "Or everybody did, and then left.")),
  ('st_cat_loaf', 5, 3, 'cat', "A grey cat, loafed up on a crate, perfectly still. It isn't ash. It's breathing. It opens one eye.",
   ('glee', "A CAT!"), ('smile', "...Hello, you.")),
 ],
 decor=[('al_stalks',17,10),('cl_weeds',3,12),('al_dune_a',27,9),('c5_floor_crack',24,6),('cl_weeds_tall',9,10),
        ('c5_rubble',23,9),('al_stalks',29,10)],
 touches=["{ kind: 'mist', x: 16, y: 6, w: 14, h: 5, n: 4, color: '170, 160, 150' }"],
)

ASH['ash_town_gate'] = dict(
 file='interactions/ashroad.txt',
 pokes=[
  ('cl_sign_boot', 10, 12, 'bootsign', "A cobbler's sign, a gold boot, poking out of the ash at head height. The boot has been oiled.",
   ('thinking', "Somebody's been polishing it."), ('thoughtful', "The folk in Hearth. Digging out, one sign at a time.")),
  ('cl_sign_key', 13, 10, 'keysign', "A key as big as your arm, on a bracket: a locksmith's sign. The bow has been rubbed bright.",
   ('glee', "A secret key!"), ('bored', "It's a sign for a key shop. Please don't.")),
  ('lv_bench', 17, 12, 'bench', "A bench facing the buried gate. The seat is clear of ash, as if it had been swept this morning.",
   ('worried', "This morning?"), ('thoughtful', "Somebody sits here and waits for the gate.")),
  ('cl_broom_bucket', 9, 14, 'broom', "A bucket of clean water with a broom across it. The water is clear, which means it's new.",
   ('glee', "Water! Clean water!"), ('bored', "Don't drink it. It's somebody's.")),
  ('town_noticeboard', 12, 16, 'notices', "A notice board half under the ash. One notice is still readable: HEARTH FOLK DIG ON THE HALF HOUR. KNOCK IF YOU CAN READ THIS.",
   ('glee', "I'm going to knock on everything."), ('bored', "Knock on the board. They'll hear that.")),
 ],
 decor=[('al_stalks',8,6),('cl_weeds',11,8),('al_dune_a',16,14),('c5_rubble',8,10),('cl_weeds_tall',19,7),
        ('al_stalks',9,17),('c5_floor_crack',14,6)],
 touches=["{ kind: 'mist', x: 7, y: 12, w: 16, h: 5, n: 4, color: '170, 160, 150' }"],
)
