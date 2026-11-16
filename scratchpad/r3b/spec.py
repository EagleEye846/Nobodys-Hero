# Spec for round 3 helper B: what each dull room gets. Run: python spec.py  -> spec.json
import json

FLAT = {'r3m_mould', 'r3m_silt', 'r3m_stain', 'r3h_acorns', 'r3h_leafdrift', 'r3h_moss', 'r3h_roots', 'r3h_toadring', 'r3h_twigs', 'r3h_stardust',
        'r3p_fairy_ring', 'r3p_leaves_flat', 'r3p_twigs', 'r3p_branch', 'r3p_deer_bed', 'r3p_hoofprints', 'r3p_puddle',
        'r3p_stones_flat', 'cl_moss_flat', 'cl_cracks_flat', 'cl_loose_pages', 'cl_ink_blot', 'cl_mosaic',
        'r3b_moss_patch', 'r3m_puddle', 'r3m_puddle2', 'r3m_mudflat', 'r3m_duckweed'}

ROOMS = {}


def room(rid, short, spk):
    ROOMS[rid] = {'short': short, 'spk': spk, 'items': []}
    return ROOMS[rid]['items']


def poke(items, sprite, name, text, line=None, zone=None, near=None):
    items.append({'sprite': sprite, 'name': name, 'text': text, 'line': line, 'zone': zone, 'near': near, 'flat': sprite in FLAT})


def deco(items, sprite, n=1, zone=None):
    items.append({'sprite': sprite, 'n': n, 'zone': zone, 'flat': sprite in FLAT})


# Kits of filler dressing (decor, no words)
HUSH_KIT = [('r3b_moss_patch', 4), ('r3h_leafdrift', 3), ('r3p_leaf_heap', 3), ('r3h_fern', 3), ('r3p_toadstools', 2),
            ('r3p_boletes', 2), ('r3p_chanterelles', 2), ('r3p_red_shrub', 2), ('r3p_berries', 1), ('r3p_moss_rock', 2),
            ('r3p_slim_trunk', 2), ('r3p_slim_trunk_b', 2), ('r3p_web_bush', 1), ('r3p_hoofprints', 1), ('r3h_bracket', 1),
            ('r3p_puffballs', 1), ('r3p_pinecones', 2), ('r3h_twigs', 2)]
CITY_KIT = [('cl_weeds', 3), ('cl_weeds_tall', 2), ('cl_moss_flat', 3), ('cl_cracks_flat', 2), ('r3b_wild_flowers', 2), ('cl_ivy_wall', 0)]
REG_KIT = [('cl_loose_pages', 3), ('cl_paper_stack', 2), ('cl_ink_blot', 1), ('cl_cracks_flat', 2), ('cl_moss_flat', 1)]

HUSH_KIT = [('r3b_moss_patch', 4), ('r3h_leafdrift', 3), ('r3p_leaf_heap', 3), ('r3h_fern', 3), ('r3p_toadstools', 2),
            ('r3p_boletes', 2), ('r3p_chanterelles', 2), ('r3p_red_shrub', 3), ('r3p_berries', 1), ('r3p_moss_rock', 3),
            ('r3p_slim_trunk', 3), ('r3p_slim_trunk_b', 3), ('r3p_web_bush', 1), ('r3p_hoofprints', 1), ('r3h_bracket', 2),
            ('r3p_puffballs', 1), ('r3p_pinecones', 2), ('r3h_twigs', 2), ('r3p_stump', 2), ('r3p_stump_big', 1),
            ('r3p_hollow_log', 1), ('r3p_mush_log', 1), ('r3p_bracken', 2), ('r3h_glowcaps', 2), ('r3p_boulder', 1),
            ('r3b_wild_flowers', 1), ('r3p_fairy_ring', 1), ('r3p_stones_flat', 1), ('r3p_puddle', 1)]
CITY_KIT = [('cl_weeds', 3), ('cl_weeds_tall', 3), ('cl_moss_flat', 3), ('cl_cracks_flat', 3), ('r3b_wild_flowers', 3),
            ('cl_shoes', 1), ('cl_bundle', 1), ('cl_bench_moss', 1), ('cl_loose_pages', 2), ('r3p_leaves_flat', 2),
            ('r3p_leaf_heap', 1), ('cl_trunk', 1), ('cl_hand_cart', 1)]
TOWN_KIT = [('cl_weeds', 3), ('cl_weeds_tall', 2), ('cl_moss_flat', 3), ('cl_cracks_flat', 3), ('r3b_wild_flowers', 4),
            ('r3h_leafdrift', 3), ('r3p_leaf_heap', 2), ('r3p_bucket', 1), ('r3p_broom', 1), ('cl_flower_tub', 1),
            ('r3p_stones_flat', 1), ('r3p_puddle', 1), ('r3p_pinecones', 1)]
CAVE_KIT = [('r3b_moss_patch', 3), ('r3m_puddle', 2), ('r3m_puddle2', 2), ('r3m_bricks', 2), ('r3m_fungus', 2), ('r3m_bones', 1),
            ('r3m_mould', 1), ('r3p_stones_flat', 2), ('r3p_old_boot', 1)]
STORE_KIT = [('r3p_sack_pile', 1), ('r3p_apple_crate', 1), ('r3p_broom', 1), ('r3p_old_bucket', 1), ('cl_loose_pages', 3),
             ('r3p_jars', 1), ('r3p_tin_stack', 1), ('cl_cracks_flat', 2)]
KITS = {'hush': HUSH_KIT, 'city': CITY_KIT, 'reg': REG_KIT, 'town': TOWN_KIT, 'cave': CAVE_KIT, 'store': STORE_KIT}
FILL = {}  # rid -> (kit, n)

# ===================================================================== THE HUSHWOOD (nothing here makes a sound)
# The woodcutters' rules, painted on boards, one a room: the thread through the wood.

it = room('hush_mist_edge', 'me2', 'bramble'); FILL['hush_mist_edge'] = ('hush', 30)
poke(it, 'r3b_hush_sign', 'rule1', "A board nailed to a post, the paint run in the damp. A hand with one finger across its lips, and under it in careful capitals: RULE ONE. WALK SOFT.", "{worried}Walk soft. I'm walking soft. Am I walking soft? You're walking soft. I think we're both walking soft.", zone='s')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn bush hung with strips of cloth, dozens, red and ochre and blue and grey. Each is knotted tight. Somebody tied each one on and whispered into it first.", "{awed}You whisper a wish and tie it on. Ma did it every year. ...I never found out what she asked for.", zone='nw')
poke(it, 'r3b_jar_post', 'jar', "A jar on a hook, full of a green glow. Not a flame: a fungus, kept alive in a little damp moss, so the light never flickers and never smells of smoke. Smoke carries.", "{thinking}That's clever. ...Is that clever? It's very clever.", zone='c')
poke(it, 'r3b_stump_house', 'stump', "A great old stump with a round door and one small lit window. A tin chimney the width of a thumb. Nothing is smoking. Somebody very small is trying to look like nobody's home.", "{sly}Hello? ...Sorry. Sorry, we're leaving.", zone='e')
poke(it, 'r3b_felt_shoes', 'shoes', "A rail with three pairs of shoes hung out to dry, all soled in thick grey felt. You hold one up to your ear and listen to nothing. It's the quietest shoe you've ever heard.", "{sheepish}I can hear my own ear.", zone='sw')

it = room('hush_felled_run', 'fr2', 'bramble'); FILL['hush_felled_run'] = ('hush', 30)
poke(it, 'r3b_hush_sign', 'rule2', "RULE TWO. NO SINGING. And under it, smaller, in a different chalk: (HUMMING COUNTS.)", "{sheepish}...I hum when I'm scared. I'm humming now. Am I? Oh no.", zone='e')
poke(it, 'r3b_fallen_giant', 'giant', "A trunk as long as a barn and as wide as a door, felled so long ago it's turned into a hill. Moss, shelf fungus, one small mushroom wearing a bigger one as a hat. The broken end is wide enough to crawl into, and somebody has, and left.", "{awed}It's got a hole you could live in. Somebody did. Look, there's a spoon.", zone='c')
poke(it, 'r3b_quiet_shrine', 'shrine', "A little stack of stones with a nook in it: a candle stub wrapped in felt and a pinch of dried flowers. The woodcutters didn't sing to the trees. They left a candle and kept quiet.", "{worried}A candle. For who? ...For it?", zone='nw')
poke(it, 'r3p_axe_stump', 'axe', "An axe sunk in a stump, the handle wrapped in rag so it won't clack when it's pulled out. It's still stuck. Whoever wrapped it never came back to pull.", "{scared}Don't pull it. Don't. ...Was I going to? No.", zone='s')
poke(it, 'r3p_old_boot', 'boot', "One felt-soled boot lying on its side, not worn through. Not a boot you'd leave. Somebody was moving fast and quiet at once, which is very hard to do.", "{scared}Where's the other one?", zone='w')

it = room('hush_hollow_oak', 'ho2', 'bramble'); FILL['hush_hollow_oak'] = ('hush', 32)
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn tree at the oak's foot, hung with cloth strips, the oldest gone grey as ash. At the bottom is a new one: a scrap of blue scarf, the knot tied by small, careful hands.", "{sad}That one's mine. ...I wished for something. It's rude to say.", zone='c')
poke(it, 'r3b_stump_house', 'mouse', "A stump with a door painted on it, and a mouse in a thimble for a helmet who looks at you, looks at your boots, and goes in. The door shuts without a sound.", "{glee}A guard mouse! Hello, sir! We're friends, sir!", zone='nw')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow on a post, hung low, at child height. Somebody didn't want a little one to trip.", "{proud}That's how you do it. ...I'd have put it higher. No. Lower. Fine.", zone='e')
poke(it, 'r3p_nest_ground', 'nest', "A nest on the ground, empty. The shells have been folded in neatly and tucked beside it. Neat birds.", "{thinking}Do birds tidy? ...Do I tidy? Don't answer that.", zone='s')
poke(it, 'r3b_moss_patch', 'moss', "Moss thick enough to sleep on. You press it. It presses back, softly, and forgives you.", "{grin}I'm going to sleep here. No. Not here. Somewhere with a roof.", zone='w')

it = room('hush_kid_gap', 'kg2', 'bramble'); FILL['hush_kid_gap'] = ('hush', 28)
poke(it, 'r3b_bell_wrapped', 'bell', "A small brass bell on a post, wrapped in felt and tied with string. A children's bell: the little ones used to ring it to say they were home. Then somebody wrapped it, and nobody unwrapped it.", "{sad}...I used to ring that. It went ding like a spoon on a cup.", zone='c')
poke(it, 'r3b_felt_shoes', 'shoes', "Little felt shoes in a row, from toddler to nearly grown. Each pair has a name chalked on the sole: PIP, DOT, WREN. The last pair is blank.", "{sad}Mine were over there. ...They were over there.", zone='e')
poke(it, 'r3b_hush_sign', 'rule0', "A board with a rule, and under it, in wobbly chalk: RULE ZERO. HOLD HANDS. Somebody has added: (EVEN IF YOUR HANDS ARE STICKY.)", "{grin}That's Wren. Wren's rules are the best rules.", zone='s')
poke(it, 'r3p_hoop', 'hoop', "A hoop and a stick, left where the game stopped. There's a footprint in the mud inside the hoop, a small one, pointing home.", "{worried}It's pointing home. Good. That's good.", zone='nw')
poke(it, 'r3b_stump_house', 'mice', "A mouse house under a root. Someone has built it a twig fence and left a toast crumb at the door. A note: PLEASE BE QUIET (MICE).", "{glee}They're very quiet already!", zone='w')

it = room('hush_leaning_pines', 'lp2', 'bramble'); FILL['hush_leaning_pines'] = ('hush', 30)
poke(it, 'r3b_hush_sign', 'rule4', "RULE FOUR. IF IT LISTENS, STAND STILL. Somebody has gone over the word STILL, three times, in thicker paint.", "{scared}Stand still. Good. I can do still. I'm so good at still.", zone='s')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn bush on the lean, hung so heavy with cloth strips that it droops. They're all the same grey now. The wishes have worn the colour out of them.", "{sad}That's a lot of wishes. ...Do you think any of them came true?", zone='ne')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine stuffed in the crook of a leaning trunk: a felted candle stub, a button, a thimble, a pressed leaf. Small offerings. Nothing a hungry thing would want.", "{thinking}That's the point, isn't it. Nothing to want.", zone='w')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow on a post. The pines lean away from it, or toward it. It's hard to tell, with pines.", "{awed}They're leaning at it like they're reading over its shoulder.", zone='c')
poke(it, 'r3p_cairn', 'cairn', "A cairn of seven stones, one for each person who got through this stretch. The eighth stone, on top, has been turned face down. Out of respect, probably.", "{sad}Seven. ...That's not very many.", zone='sw')

it = room('hush_treadles', 'tr2', 'bramble'); FILL['hush_treadles'] = ('hush', 28)
poke(it, 'r3b_hush_sign', 'rule3', "RULE THREE. NO AXES AFTER DUSK. A second line, newer: NO AXES AT ALL. A third, in a hurry: PLEASE.", "{worried}Three rules. They were running out of rules, Sword. Or running out of patience.", zone='n')
poke(it, 'r3b_felt_shoes', 'shoes', "A rack of felt shoes beside the treadle path, so you could change before the planks. The planks creak. The shoes are why they didn't.", "{proud}Soft shoes for hard planks. Ma would've made us wear them.", zone='sw')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow set where the path goes dark, so you can find the next plank. The moss in it glows without being asked.", "{thinking}It's moss. It just does it. I like that.", zone='e')
poke(it, 'r3b_stump_house', 'stump', "A stump with a small door and a doormat the size of a stamp: WELCOME (QUIETLY).", "{sly}We'll be so quiet.", zone='nw')

it = room('hush_gorge', 'go2', 'bramble'); FILL['hush_gorge'] = ('hush', 30)
poke(it, 'r3b_bell_wrapped', 'bell', "A bell on the gorge's lip, wrapped in felt and wound round with rope. This is the bell that used to ring the hours across the drop. Nothing rings now. The wood has been counting without it.", "{worried}They tied up the bell. So it wouldn't tell it where they were.", zone='c')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn tree leaning out over the gorge, hung with cloth strips. They flick in the updraught without a sound. Every one is tied facing the drop.", "{awed}They're wishing at the bottom. Why would you wish at the bottom?", zone='e')
poke(it, 'r3b_fallen_giant', 'giant', "A trunk laid across the gorge's near lip, as a bridge once and a bench now. The moss is worn off the middle where people sat to look.", "{grin}Sit on it. Go on. It's the best view in the wood.", zone='s')
poke(it, 'r3p_cairn', 'cairn', "A cairn on the ledge, and a hat balanced on top, brim down. It's held there with a stone. It's been held there a long time.", "{sad}Somebody's hat. ...Somebody made sure it stayed.", zone='w')

it = room('hush_sawpit', 'sp2', 'bramble'); FILL['hush_sawpit'] = ('hush', 28)
poke(it, 'r3b_felt_shoes', 'shoes', "A rack of shoes with felt tied round every sole, and a second rack of saw teeth with felt tied round every tooth. The woodcutters worked in a hush. You can see the effort.", "{awed}Even the saw had socks.", zone='c')
poke(it, 'r3b_hush_sign', 'rule3b', "RULE THREE AND A HALF. CUT SLOW. A third of the planks stacked here are stamped SLOW in black. They're perfectly square.", "{proud}Slow is good. Ma says fast is for people who like splinters.", zone='s')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine at the end of the sawpit with a felted candle and a tiny saw carved from a twig. An offering to the saw, so it wouldn't squeak.", "{sly}It's working. The saw hasn't said a word.", zone='e')
poke(it, 'r3p_cap_stump', 'cap', "A cap left on a stump, a pencil behind its band. A tally of planks on the stump top, in neat fives. The last five has only four.", "{worried}They stopped at four. Why would you stop at four?", zone='nw')

it = room('hush_notched', 'no2', 'bramble'); FILL['hush_notched'] = ('hush', 28)
poke(it, 'r3b_hush_sign', 'rule5', "RULE FIVE. IF IT STOPS, YOU STOP. Underneath, tallied in scratches: forty-one marks. The last twelve are very close together.", "{scared}...Forty-one times. Somebody stopped forty-one times.", zone='s')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine in the notch of an old stump: a candle, a button, a child's tooth, a note: FOR LUCK. KEEP.", "{sad}I'm not going to take the tooth.", zone='c')
poke(it, 'r3b_stump_house', 'mouse', "A mouse's door under the fox's old den. The mouse has chalked a rule of its own: RULE ONE. RUN.", "{glee}That's the best rule I've heard.", zone='e')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow on a post, half-sunk in the leaf-litter. The mist makes it a green moon.", "{awed}It's a moon. It's a tiny moon on a stick.", zone='nw')

it = room('hush_sprung_trap', 'st2', 'bramble'); FILL['hush_sprung_trap'] = ('hush', 28)
poke(it, 'r3b_hush_sign', 'rule7', "RULE SEVEN. DON'T ANSWER IT. And below, in a different hand, a shaky addition: (IT SOUNDS LIKE ANYONE YOU KNOW.)", "{scared}...Don't answer it. I won't. I'm not going to. ...Who?", zone='s')
poke(it, 'r3b_bell_wrapped', 'bell', "A bell in a trap-frame, the cord sprung and the felt still on. It was a warning bell. It was wrapped so it couldn't be a warning.", "{worried}They set a trap that couldn't ring. ...That's not a trap. That's a hope.", zone='c')
poke(it, 'r3b_felt_shoes', 'shoes', "A rack of shoes with every sole felted, and a space on the rail the size of one pair. Somebody went out in a hurry in their good shoes.", "{sad}Not the good ones. Never go out in the good ones.", zone='sw')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn tree with a white rag tied on every branch, all of them tied by the same hand. Somebody came alone, and wished many times.", "{sad}That's a lot of wishing for one person.", zone='ne')

it = room('hush_windfall', 'wf2', 'bramble'); FILL['hush_windfall'] = ('hush', 26)
poke(it, 'r3b_hush_sign', 'rule6', "RULE SIX. DON'T LOOK UP. The sign has been put up very low, so you won't have to.", "{worried}I'm not looking up. I'm looking at the sign. It's a nice sign.", zone='s')
poke(it, 'r3b_fallen_giant', 'giant', "A great trunk across the maze's mouth, and the other trunks have gone round it, as water goes round a stone. In the wood, even a fallen thing has the right of way.", "{awed}Everything's polite here. Even the trees.", zone='c')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine at a corner of the walls: a felted candle, a clay bird, a thimble that held water once. It's long dry.", "{thinking}Nobody's topped it up. That's fine. That's allowed.", zone='ne')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow set where two walls meet, so you'd know the corner was a corner. It's the only way to tell, in the mist.", "{proud}A corner light! That's what I'd do.", zone='w')

it = room('hush_millrace', 'mr2', 'bramble'); FILL['hush_millrace'] = ('hush', 28)
poke(it, 'r3b_hush_sign', 'rule', "A rule on a board by the water: LET THE RIVER BE LOUD. The mill-folk's one exception, scratched in after the rest. The river was the only thing allowed to speak.", "{glee}The river gets to talk! Lucky river.", zone='s')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn tree at the water's edge with cloth strips tied in the river-side branches. The mill-folk's wishes: for rain, for wheel-grease, for a quiet winter.", "{thinking}A quiet winter. They got one, didn't they.", zone='ne')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow on a mooring post at the race. The water takes the light and gives back a greener one.", "{awed}It's green on the water too! Look! Two jars!", zone='c')
poke(it, 'r3b_bell_wrapped', 'bell', "The mill bell, wrapped in felt. A mill with no bell to say the hour ends: the folk worked by the sun and the stomach.", "{sheepish}My stomach would have been a good bell.", zone='w')

it = room('hush_quiet', 'qu2', 'bramble'); FILL['hush_quiet'] = ('hush', 28)
poke(it, 'r3b_hush_sign', 'rule8', "RULE EIGHT. A board with the rule painted over, white, and then written on again in the white: THERE IS NO RULE EIGHT. (WE RAN OUT OF TIME.)", "{scared}...They ran out of rules. Sword, they ran out of rules.", zone='s')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine on the edge of the Quiet: the candle stub is the biggest you've seen. It's never been lit. A stone beside it is warm from the sun, and your hand wants to stay on it.", "{sad}It's warm. Why's the rock warm? It's the Quiet.", zone='nw')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn tree at the Quiet's edge, with no cloth on it at all. Only the knots, left behind, where the strips were pulled off all at once.", "{scared}Something took them. ...Or someone took them down. In a hurry.", zone='ne')
poke(it, 'r3b_jar_post', 'jar', "A jar of glow, the last on the path, its moss going pale from the cold. You're not sure it's meant to light anything now. It just marks where the lights stop.", "{worried}That's where the lights stop. ...Don't go further. ...Go further.", zone='e')

it = room('hush_clawed_bridge', 'cb2', 'bramble'); FILL['hush_clawed_bridge'] = ('hush', 28)
poke(it, 'r3b_bell_wrapped', 'bell', "A bell on a post at the bridge's end, felt-wrapped, with a second wrap over the first and a third over that. It's been wrapped more than anything you've seen.", "{scared}They really, really, really didn't want it to ring.", zone='c')
poke(it, 'r3b_hush_sign', 'sign', "A board at the bridge's end: CROSS ONE AT A TIME. DON'T LOOK DOWN. DON'T LOOK BACK. It runs out of board before it runs out of advice.", "{worried}That's a lot of don'ts for a bridge.", zone='s')
poke(it, 'r3b_felt_shoes', 'shoes', "A rack of felt shoes before the bridge, the last pairs in the wood. Somebody's lined them up toe to heel. Some of them are very small.", "{sad}...They changed their shoes for the bridge. Of course they did.", zone='sw')
poke(it, 'r3b_rag_thorn', 'thorn', "A thorn bush by the bridge-foot, hung with a last wish or two. The newest strip is the colour of your sleeve. You check. It isn't yours.", "{sly}Is it yours? It looks like yours.", zone='ne')

it = room('hush_underroot', 'ur2', 'bramble'); FILL['hush_underroot'] = ('hush', 24)
poke(it, 'r3b_jar_post', 'jar', "A jar of glow on a hook screwed into a root, the only light but yours. In the dark under the wood, somebody thought of a night-light.", "{awed}It's a night-light. Somebody put a night-light down here.", zone='c')
poke(it, 'r3b_jar_post', 'jar2', "A second jar, further on, hung low. The glow is dimmer. It's the spare, in case the first one fails, in case anybody would need it.", "{proud}Two! They thought of two!", zone='w')
poke(it, 'r3b_quiet_shrine', 'shrine', "A shrine in a hollow of a root: a felted candle and a child's drawing of the sky, so the dark can know what it's missing.", "{sad}That's for the dark. That's so nice.", zone='e')
poke(it, 'r3b_stump_house', 'stump', "A root-house with a round door and a window lit green with glow-moss. Tiny curtains. Somebody's put out a doormat the size of a button.", "{glee}Somebody lives down here!", zone='s')

# ===================================================================== THE DEAD CITY (Ves with you)
it = room('city_gate_foot', 'gf', 'ves'); FILL['city_gate_foot'] = ('city', 14, 'flatCut')
G = (1, 4, 5, 16)
poke(it, 'r3b_bedroll', 'bed', "A bedroll, still rolled the way a careful person rolls one. The pack beside it has a tin mug and half a biscuit, and the biscuit has been half-eaten for fifty years. Somebody camped at the gate to be first through.", "{thoughtful}First through. I'd rather be second. Second gets to see what happens to first.", zone=G)
poke(it, 'r3b_left_sticks', 'sticks', "A barrel of walking sticks, and one hat on top. Left at the gate by people who thought they wouldn't need them. Every stick has a name burned into it. Most are worn off.", "{bored}A coat-stand for people who thought they were done walking. Optimistic.", zone=G)
poke(it, 'r3b_queue_posts', 'queue', "Two brass posts and a red rope. A queue, for a gate. Somebody thought the Hero would be popular.", "{laughing}There's no queue. There's us. ...Do we form one?", zone=G)
#poke(it, 'r3b_banner_pole', 'banner', "A banner on a tall pole: WELCOME, in letters the sun has faded to pink. Below it, smaller, in a child's paint: (HELLO!)", "{shy}...Hello back.", zone=G)
poke(it, 'cl_street_chair', 'chair', "A chair set at an angle facing the gate, so someone could watch for the hero in comfort. The seat is worn pale. Chairs don't go that pale in a year.", "{sad}Somebody watched a long time. That's a lot of looking at a door.", zone=G)
poke(it, 'r3p_kettle_stones', 'kettle', "A ring of fire-stones and a black kettle, the ash crusted over. The lid is still on.", "{smile}Tea at the end of the world. I respect that.", zone=G)

it = room('city_statue_court', 'sc2', 'ves'); FILL['city_statue_court'] = ('city', 24)
poke(it, 'r3b_fountain_dry', 'fountain', "A round fountain, dry as a bone. A plinth stands in the middle with nothing on top. The water used to come from the statue's hands. Moss has filled the basin, and a single brass coin is left in it.", "{thoughtful}Dry. A fountain's the first thing to go. You don't notice one until the sound stops.", zone='c')
poke(it, 'r3b_plinth_feet', 'feet', "A plinth with only the boots left on it: stone boots, toes up, a little cracked, standing as if the rest of the person had stepped out. Which may be exactly what happened.", "{laughing}Out of the boots and gone. I've felt the urge.", zone='ne')
poke(it, 'r3b_banner_pole', 'banner', "A banner on a pole, faded to pink. Four poles ring this court. Three have banners. The fourth has a pair of socks, which somebody had the sense to hang out.", "{smile}Practical.", zone='nw')
poke(it, 'r3b_stall', 'stall', "A stall at the court's edge, striped awning faded to pale blue. A chalk card on the counter: LAST DAY. EVERYTHING MUST GO. Everything did.", "{bored}Everything must go. Spot on.", zone='sw')
poke(it, 'r3b_laundry_slab', 'laundry', "A laundry slab, scrubbed hollow by years of wrists, with a violet bar of soap still sitting in the dip, shrunk to a pebble.", "{smile}Violet. Fancy. Even the washing was fancy.", zone='se')

it = room('city_last_street', 'ls2', 'ves'); FILL['city_last_street'] = ('city', 22)
poke(it, 'r3b_bell_wrapped', 'bell', "A bell on a post by a door, wrapped in felt and tied with string. Even here. Even in the city, where nobody walks, they wrapped the bell.", "{worried}Even here. They knew it was coming. ...They knew a long time.", zone='c')
poke(it, 'r3b_felt_shoes', 'shoes', "Soft shoes on a rack by the last gate, felt-soled, in every size, set out as if for a long line. For the last stretch, you changed your shoes.", "{thoughtful}A shoe stand at the edge of the world. That's very polite.", zone='w')
poke(it, 'r3b_stall', 'stall', "A stall with its shutter down and a card: CLOSED UNTIL FURTHER NOTICE. THANK YOU FOR YOUR PATIENCE. The card has been left to curl at the corners.", "{bored}Further notice. We're all waiting on that.", zone='e')
poke(it, 'r3b_banner_pole', 'banner', "A banner on a pole, torn to ribbons and pink as a shell. Under the faded gold: the city's motto, in small letters: WE ARE LISTENING.", "{worried}We are listening. ...To what?", zone='ne')

it = room('city_stacks', 'sk2', 'ves'); FILL['city_stacks'] = ('reg', 11)
poke(it, 'r3b_book_tower', 'tower', "A tower of books that has leaned, in fifty years, about a thumb's width. A slip of paper marks the place: PAGE 40 OF 41. The last page isn't in the book. You check.", "{bored}Page forty of forty-one. And forty-one isn't there. Of course not.", zone='w')
poke(it, 'r3b_globe', 'globe', "A globe. The seas have faded to the same tan as the land, so the world is one dusty ball with writing on it. There's a pin in a place that isn't on any map you know.", "{thoughtful}A pin. Somebody knew where they were going. That's more than I can say.", zone='e')
poke(it, 'r3b_dust_sheet', 'sheet', "Something under a dust sheet, shaped like a desk with an opinion. You lift a corner: a desk. You lower it. It's the sort of room that makes you whisper.", "{shy}Why am I whispering?", zone='c')
poke(it, 'r3b_book_tower', 'tower2', "A second tower, this one fallen over and put back together wrong, with the spines facing in. A note on top: SORT LATER.", "{bored}Later. The great tradition.", zone='s')

it = room('city_aqueduct', 'aq2', 'ves'); FILL['city_aqueduct'] = ('city', 22)
poke(it, 'r3b_laundry_slab', 'slab', "A washing slab at the water's edge, scrubbed hollow by years of wrists. A bar of soap sits in the dip, shrunk to a violet pebble.", "{smile}Fancy soap. Even the laundry had standards.", zone='w')
poke(it, 'r3m_cattails', 'cattail', "Cattails, thick as a fence at the pool's lip. They've climbed the aqueduct's stone and think they own it.", "{bored}They'd win an election, honestly.", zone='c')
poke(it, 'r3m_stepstones', 'steps', "Stepping stones across the shallows, laid so no one would ever wet their feet. They've sunk a little. You'll wet your feet.", "{smile}Excellent planning. For a different century.", zone='s')
poke(it, 'r3m_boot', 'boot', "A single boot at the pool's edge, half-sunk, a frog sitting in it like it's the only chair in town.", "{laughing}It's got a tenant. Don't evict it.", zone='e')

it = room('city_colonnade', 'co2', 'ves'); FILL['city_colonnade'] = ('city', 22)
poke(it, 'r3b_stall', 'stall1', "A stall between two pillars, awning faded to pale stripes. The scales are still on the counter, one pan up, one down: weighing something when it stopped. A mouse has moved into the empty pan.", "{laughing}Two ounces of mouse. Fair price.", zone='nw')
poke(it, 'r3b_stall', 'stall2', "A stall with a hand-lettered card: BACK IN FIVE MINUTES. The ink says it was written with a very steady hand, which is how you write a polite lie.", "{bored}Five minutes. Excellent timekeeping.", zone='se')
poke(it, 'r3b_banner_pole', 'banner', "A banner at the colonnade's end, torn, one corner hanging. The picture on it was a lantern. The lantern has faded the least.", "{thoughtful}The lantern outlasted the rest. Lanterns do that.", zone='ne')
poke(it, 'r3b_bedroll', 'bed', "A bedroll tucked behind a pillar, the blanket folded square. A tag on the strap: PLEASE DON'T MOVE. Whoever it was, they planned to be back.", "{sad}Don't move it. I won't.", zone='sw')

it = room('city_reading_room', 'rr2', 'ves'); FILL['city_reading_room'] = ('reg', 11)
poke(it, 'r3b_globe', 'globe', "A reading-room globe with a brass ring round it, tilted to the angle of somebody leaning to see. There's a thumbprint at the north.", "{thoughtful}They checked the north. Everyone checks the north.", zone='ne')
poke(it, 'r3b_book_tower', 'tower', "A book tower by the armchair, three open at once, face down: somebody reading three things at the same time. The tower is the height of a bored person's patience.", "{bored}Three at once. I do that. It means none of them are good.", zone='se')
poke(it, 'r3b_dust_sheet', 'sheet', "A sheet over a reading-lamp and a footstool, shaped like a patient animal.", "{shy}It's waiting for somebody to come back and read. It's very patient.", zone='sw')
poke(it, 'r3b_ticket_post', 'ticket', "A ticket post by the door: TAKE A NUMBER. QUIET PLEASE. The roll holds one ticket, and it's 0001.", "{laughing}Number one. Not first. Just number one.", zone='w')

it = room('city_sculptors_yard', 'sy2', 'ves'); FILL['city_sculptors_yard'] = ('city', 18)
poke(it, 'r3b_unfinished_statue', 'statue', "A figure half-freed from its block: shoulders, a chin, the idea of a face. The chisel marks stop mid-line, as if the sculptor was called to dinner. A mallet waits on one shoulder.", "{bored}He got as far as the chin. The chin is excellent.", zone='c')
poke(it, 'r3b_plinth_feet', 'feet', "A plinth waiting for a finished statue, and on it a pair of stone boots: the first bit done. Somebody always starts at the bottom.", "{thoughtful}Start at the feet. Good advice for most things.", zone='w')
poke(it, 'r3b_dust_sheet', 'sheet', "A sheet over a statue, and the statue's outline looks like a person holding up a lantern. You don't lift the sheet.", "{worried}Leave it. I mean it. Leave it.", zone='e')
poke(it, 'r3b_laundry_slab', 'slab', "A grinding slab for pigment: red, ochre, a lump of blue the size of an egg. The blue is still bright. Everything else faded around it.", "{smile}Fifty years and the blue is still the best part.", zone='s')

# ===================================================================== THE REGISTRY (Ves with you)
it = room('registry_cleft', 'cl2', 'ves'); FILL['registry_cleft'] = ('reg', 13)
poke(it, 'r3b_dust_sheet', 'sheet', "A big dust sheet over a table with four chairs, as if the meeting broke up in a hurry and somebody was tidy about it.", "{bored}Meeting adjourned. Permanently.", zone='nw')
poke(it, 'r3b_book_tower', 'tower', "A tower of ledgers by the crack, each labelled with a year. The newest is open on top: the page is blank, except one line. A date. And: SEE NEXT.", "{thoughtful}See next. There isn't a next. ...Is there?", zone='e')
poke(it, 'r3b_file_cart', 'cart', "A file cart parked half in the crack, its boxes ready to go. One box says OUTGOING. One says INCOMING. The third says WHATEVER THAT IS.", "{laughing}I like the third box.", zone='sw')
poke(it, 'r3b_queue_posts', 'queue', "Queue posts leading to the crack in the wall, a sign hanging from the rope: THIS WAY FOR APPEALS.", "{bored}Appeals. To what? The wall?", zone='s')

it = room('registry_cellar', 'ce3', 'ves'); FILL['registry_cellar'] = ('reg', 13)
poke(it, 'r3b_file_cart', 'cart', "A cart of file boxes in the cellar, each lid taped shut with a red seal. The seals are unbroken. Nothing in here was ever meant to be looked at.", "{worried}Don't break the seals. Don't. ...I'm tempted. Don't let me.", zone='w')
poke(it, 'r3b_dust_sheet', 'sheet', "A dust sheet over a heap that rises in the middle, then falls: a desk, a lamp, a very tall plant that never got watered.", "{bored}Tall plant. Poor plant.", zone='ne')
poke(it, 'r3b_book_tower', 'tower', "A tower of damp ledgers, swollen to twice their size. The top one has a note on it: WE'LL DRY THESE. A second note, later: WE WILL DRY THESE.", "{smile}Optimism in two handwritings.", zone='se')
poke(it, 'r3b_globe', 'globe', "A globe in the cellar, face to the wall. Somebody turned it round and didn't want to look at it.", "{thoughtful}Somebody didn't want to see the world. I understand them a little.", zone='sw')

it = room('registry_counting', 'ct2', 'ves'); FILL['registry_counting'] = ('reg', 13)
poke(it, 'r3b_file_cart', 'cart', "A cart of counting-boards stacked like loaves. The topmost board has a tally with a thumb-sized hole poked through the sixth mark.", "{bored}They got bored at six. I'd have got bored at three.", zone='w')
poke(it, 'r3b_ticket_post', 'ticket', "A ticket post by the counting desks. The roll has run out, but one ticket is stuck in the slot: 0000. A note: DON'T.", "{shy}Zero. Not even one. Not even a start.", zone='e')
poke(it, 'r3b_globe', 'globe', "A globe at the desk's end, spun last by an impatient hand: it's stopped with a hole where the pin was.", "{thoughtful}Somebody pulled the pin out. Just left. As a gesture.", zone='n')
poke(it, 'r3b_dust_sheet', 'sheet', "A big dust sheet over something four-legged. It's a stool. You are sure it's a stool.", "{shy}It's a stool. Don't lift it.", zone='sw')

it = room('registry_stacks', 'rs2', 'ves'); FILL['registry_stacks'] = ('reg', 11)
poke(it, 'r3b_book_tower', 'tower', "A tower of books in the stacks' aisle, one stack tall, one stack wide. A sticky note on it: PLEASE RESHELVE. A second, below: IT IS REALLY VERY HIGH UP.", "{bored}Please reshelve. Please reach.", zone='c')
poke(it, 'r3b_file_cart', 'cart', "A file cart on its side by the shelves, its books spilled in a fan. A fallen ladder beside it. Somebody went for a high book and the cart had other ideas.", "{laughing}High shelf wins again.", zone='w')
poke(it, 'r3b_globe', 'globe', "A globe at the end of the aisle, parked in the dust. Someone has drawn a small line on it from this room to a place you can't read. A trip planned and not taken.", "{thoughtful}A trip they never took. We've all got one.", zone='e')
poke(it, 'r3b_dust_sheet', 'sheet', "A sheet over a tall shape at the aisle's far end: a clerk's high stool, or a ghost with good posture.", "{shy}Ghost with good posture. That's my guess.", zone='ne')

it = room('registry_waiting', 'wa2', 'ves'); FILL['registry_waiting'] = ('reg', 13)
poke(it, 'r3b_queue_posts', 'queue', "Two queue posts and a rope, and the carpet worn into a track where hundreds of people stood and shuffled and stood. The track goes round the room twice and ends at a desk with a CLOSED sign.", "{bored}They queued for years. To be told to ask again tomorrow.", zone='c')
poke(it, 'r3b_ticket_post', 'ticket', "A dispenser with a roll of paper numbers. You tear one off: 0001. Nothing happens. You hold it for a bit, in case.", "{bored}Number one. Not first in line. Just number one. It's different.", zone='e')
poke(it, 'r3b_dust_sheet', 'sheet', "A bench under a dust sheet, shaped like a long, flat, slightly disappointed animal.", "{smile}A sheeted bench. Somebody tidied the waiting. It's the saddest thing I've seen all day.", zone='nw')
poke(it, 'r3b_file_cart', 'cart', "A trolley of forms: FORM 1. FORM 1A. FORM 1A (REVISED). The top form asks for your name, your age, and a reason. The reason has a very small box.", "{laughing}Reason: small box.", zone='sw')

# ===================================================================== HOLLIN (Bramble with you; Ves is missing)
it = room('hollin_well', 'wl2', 'bramble'); FILL['hollin_well'] = ('town', 26)
poke(it, 'r3b_feast_table', 'feast', "A trestle table laid for a feast: forty plates, forty cups, a cake the size of a cartwheel gone to green velvet. Among the plates, a card in a careful hand: FOR THE HERO. WHEN HE COMES. (START WITHOUT HIM IF IT GETS LATE.)", "{sad}They put out all the good plates. ...Nobody started. Look, nobody started.", zone=(12, 9, 19, 12))
poke(it, 'r3b_bunting', 'bunting1', "Bunting strung between two posts, the flags faded to the colours of weak tea. One's lost a corner, and the string still holds the shape of the wind that used to blow.", "{awed}They hung flags. For the Hero. ...For whoever.", zone=(3, 9, 11, 14))
poke(it, 'r3b_bunting', 'bunting2', "A second string of bunting, further down the square, hung to meet the first. Somebody's measured it, and it doesn't quite. Two flags short, and then a ribbon.", "{thinking}They ran out of flags. They tied a ribbon. Good thinking.", zone=(21, 9, 29, 14))
poke(it, 'r3b_wild_flowers', 'flowers', "Wild flowers coming up through the cobbles in a line, as if the stones had been laid with a gap for them. Some days a town can't help having a garden.", "{grin}They came up in a row! They're organised!", zone=(2, 6, 29, 13))
poke(it, 'r3b_stump_house', 'mouse', "A mouse has made a house in an upturned bucket by the well, with a door cut in the side and a doormat made of a leaf.", "{glee}A mouse in a bucket. That's so smart.", zone=(4, 15, 28, 22))

it = room('hollin_well_bottom', 'wb2', 'bramble'); FILL['hollin_well_bottom'] = ('cave', 10)
poke(it, 'r3b_jar_post', 'jar', "A jar of glow-moss on a post by the well-bottom landing. Somebody lowered it down on a rope and left it, in case anyone fell, or anyone came down to find them.", "{worried}A light for whoever fell. ...That's what I'd do.", zone='c')
poke(it, 'r3m_g_tally', 'tally', "A chalk tally on the wall, six marks, then a seventh crossing them, and a seventh again, as if someone gave up counting days and began counting something else.", "{sad}It stops counting days. It starts counting... what?", zone='w')
poke(it, 'r3m_g_face', 'face', "A chalk face on the wall with a big smile and an arrow pointing UP. Underneath, a child's writing: THIS WAY OUT. (WE THINK.)", "{proud}That's the right way. I can read upside down.", zone='e')
poke(it, 'r3b_moss_patch', 'moss', "A patch of moss on the old stones, fat and green in the dark, as if something down here cares about the damp.", "{thinking}It likes it here. Good for it.", zone='s')

it = room('hollin_backroom', 'bk2', 'bramble'); FILL['hollin_backroom'] = ('store', 6)
poke(it, 'r3b_dust_sheet', 'sheet', "A dust sheet over a stack of crates, the corner chewed. A tiny nest is built in the folds: three mice and a toast crust.", "{glee}They've got a whole flat!", zone='w')
poke(it, 'r3p_bundle', 'flags', "A bundle of spare flags, rolled tight, tied with string: WELCOME (SPARE). They never took them out. You leave them rolled.", "{sad}Spare welcome. They kept a spare.", zone='e')
poke(it, 'r3b_file_cart', 'cart', "A stores trolley of tinned goods and paper-wrapped parcels, labelled: HERO'S SUPPER (HOT). The parcels are very cold.", "{worried}Hero's supper. Nobody ate it. Nobody ate it, Sword.", zone='sw')

it = room('hollin_mill', 'mi2', 'bramble'); FILL['hollin_mill'] = ('hush', 30)
poke(it, 'r3b_bunting', 'bunting', "Bunting strung from the mill's gable to a post in the yard, the flags faded to pastel. MILL OPEN DAY, says a board beneath. The date has run.", "{awed}An open day! Open to everyone! Even us!", zone=(3, 11, 25, 19))
poke(it, 'r3b_wild_flowers', 'flowers', "A tuft of wild flowers growing from a crack in the millstone's old plinth. Yellow, pink, white. The only thing in the mill still turning to the sun.", "{grin}Flowers! On a rock! That's brave!", zone=(3, 11, 25, 19))
poke(it, 'r3p_wheelbarrow', 'barrow', "A wheelbarrow tipped on its side with a note chalked on the underside: GONE FOR HELP. BACK SOON.", "{sad}Back soon. ...Does it say how soon?", zone=(3, 11, 25, 21))
poke(it, 'r3p_sack_pile', 'sacks', "A pile of flour sacks, one slit and spilled into a fan. A line of mouse prints crosses it, and returns, and crosses again. A busy road.", "{glee}A mouse highway!", zone=(3, 11, 25, 21))
poke(it, 'r3b_stump_house', 'stump', "A mill-stump with a tiny door and a tin-lid roof. A thread of smoke would be rising if it weren't unlit.", "{sly}Is it a house? A tiny house?", zone=(3, 11, 25, 21))

it = room('hollin_lane', 'ln2', 'bramble'); FILL['hollin_lane'] = ('town', 14)
poke(it, 'r3b_wild_flowers', 'flowers', "Wild flowers in a doorstep crack. They've got every colour a doorstep can have.", "{grin}Somebody's garden's still going.", zone=(1, 1, 10, 26))
poke(it, 'r3b_stump_house', 'mouse', "A mouse's door at the foot of a garden wall, a pea-pod for a doorbell. It's pulled shut, tightly.", "{glee}Doorbell! Doorbell! No, don't.", zone=(22, 1, 32, 26))
poke(it, 'r3b_bunting', 'bunting', "A short string of bunting between two garden posts, as welcome as it was fifty years ago, which is to say very, very faded.", "{awed}Even the gardens put out flags.", zone=(22, 1, 32, 26))
poke(it, 'r3b_felt_shoes', 'shoes', "A rack of felt shoes outside a garden gate, set out, in rows, for a long line of visitors. Not one pair's been moved.", "{sad}Not one pair's been touched. They were all waiting for somebody to need them.", zone=(1, 1, 10, 26))

# ---- emit spec.json
for rid, r in ROOMS.items():
    for it in r['items']:
        if it.get('name'):
            it['key'] = f"r3b_{r['short']}_{it['name']}"
json.dump({'rooms': ROOMS, 'kits': {k: [[s, w] for s, w in v if w] for k, v in KITS.items()}, 'fill': {k: list(v) for k, v in FILL.items()}, 'flatset': sorted(FLAT)},
          open(__file__.replace('spec.py', 'spec.json'), 'w'), indent=1)
print(len(ROOMS), 'rooms', sum(1 for r in ROOMS.values() for i in r['items'] if i.get('name')), 'pokeables')
