fixed = {
'city_gate_foot':(4,7),'city_statue_court':(5,7),'city_last_street':(5,7),'city_stacks':(5,7),'hollin_well':(5,7),'hollin_well_bottom':(5,7),
'hush_hollow_oak':(5,7),'hush_windfall':(5,7),'registry_cleft':(5,7),
'city_aqueduct':(6,7),'city_colonnade':(6,7),'city_reading_room':(6,7),'city_sculptors_yard':(6,7),'hollin_lane':(6,7),'hollin_backroom':(6,7),'hollin_mill':(6,7),
'hush_mist_edge':(6,7),'hush_felled_run':(6,7),'hush_kid_gap':(6,7),'hush_leaning_pines':(6,7),'hush_gorge':(6,7),'hush_sawpit':(6,7),'hush_notched':(6,7),
'hush_sprung_trap':(6,7),'hush_millrace':(6,7),'hush_quiet':(6,7),'hush_clawed_bridge':(6,7),'hush_treadles':(6,7),'hush_underroot':(6,7),
'registry_cellar':(6,7),'registry_counting':(6,7),'registry_stacks':(6,7),'registry_waiting':(6,7)}
other = {
'baths_stokehold':7,'city_baths':8,'city_crier_square':7,'city_forum':7,'city_library':7,'city_old_street':7,
'drains_cistern':8,'drains_conduit':7,'drains_culvert':7,'drains_gratings':8,'drains_ladle':8,'drains_outfall':8,'drains_stair':7,'drains_sumps':8,'drains_vault':7,'drains_weir':7,
'hollin_gate':8,'hollin_lookout':7,'hollin_stores':8,
'hush_kiln':7,'hush_rummage':8,'hush_starfall':7,
'lasthome_chapel':8,'lasthome_gate':8,'lasthome_healer':7,'lasthome_inn':8,'lasthome_square':9,
'marsh_clerks_islet':8,'marsh_falls_foot':8,'marsh_far_shore':8,'marsh_heron_flats':8,'marsh_hut':7,'marsh_hut_island':8,'marsh_jetty':8,'marsh_lantern_path':8,'marsh_rushes':8,'marsh_sunken_road':8,'marsh_tollhouse':7,'marsh_watergate':8,'marsh_wisp_hollow':8,
'pinefall_bramble_gate':8,'pinefall_brook':8,'pinefall_camp':8,'pinefall_deadfall':8,'pinefall_landing':9,'pinefall_maze':7,'pinefall_quarry':9,'pinefall_ravine':9,'pinefall_rolling':8,'pinefall_tatters':8,'pinefall_tumbled':8,
'registry_lair':7}
root = 'c:/Users/clanc/Documents/Nobodys Hero/'
ids = [l.strip() for l in open(root + 'scratchpad/r3b/ids.txt') if l.strip()]
rows = []
for i in ids:
    if i in fixed:
        rows.append(f"| {i} | {fixed[i][0]} | {fixed[i][1]} | fixed |")
    else:
        rows.append(f"| {i} | {other[i]} | {other[i]} | left |")
missing = [i for i in ids if i not in fixed and i not in other]
assert not missing, missing
tbl = "\n".join(rows)
doc = """

### Round 3 scores: chapter 3 (helper B, r3b_)

Scored out of 10 after opening a still of every room: what there is to see, poke and find; whether the room has a reason to be there; whether it looks like a picture; whether it repeats the room before. A few marsh and drains rooms were scored from the still and the room data without a close look. 85 rooms; the 33 marked "fixed" are the dullest (the bottom quarter is 21; I went past it). Before and after:

| room | before | after | |
|---|---|---|---|
""" + tbl + """

### Round 3, helper B: chapter 3 (the Hushwood, Hollin, the Dead City, the Registry) [r3b_]

**The dullest rooms found:** the Hero's Gate foot (4: one big paved floor), the Statue Court, the Last Street, the Stacks (reading) room, the Hollin Well square and its Well Bottom, the Hollow Oak and the Windfall (5), then the rest of the Hushwood (a dark forest floor with the same tiny dressing in every room), the Registry (the same purple stone as the city and the same loose pages), the aqueduct, the colonnade, the reading room, the sculptor's yard, and Hollin's lane, mill and back room (6). The Pinefall, the Drains, the Marsh and Lasthome were already 7 to 9 and were left alone.

**What was added (33 rooms, about 860 new pieces, 140 to press Z on):**
- New art `src/data/art/r3bLife.js` (ids `r3b_`, 26 sprites, hooked into props.js in four lines): a bell wrapped in felt, a thorn tree hung with wish-rags, a rack of felt-soled shoes, a stump with a lit door and window, a jar of glowing moss on a post, a huge fallen trunk, a cairn shrine, a woodcutters' "finger to the lips" sign, a moss drift; the dead city's bedroll, stick barrel, dry fountain, plinth with only its stone boots, faded market stall, torn banner, half-carved statue and laundry slab; the Registry's book tower, globe, queue posts, ticket post, dust sheet and file cart; Hollin's welcome bunting, laid feast table and wild flowers. Props: `src/data/r3bLife.js` (one marked line per room file). Words: the `r3b_*` sections at the end of hushwood.txt and deadcity.txt.
- The Hushwood now has a thread: **the woodcutters' rules**, one painted board per room. RULE ZERO (HOLD HANDS, in a child's chalk) in the Kid Gap; then WALK SOFT, NO SINGING, NO AXES AFTER DUSK, CUT SLOW, IF IT LISTENS STAND STILL, IF IT STOPS YOU STOP, DON'T LOOK UP, DON'T ANSWER IT; and at the Quiet: THERE IS NO RULE EIGHT. (WE RAN OUT OF TIME.) Around them: wish-rags, wrapped bells (the children's, the mill's, the gorge's), felt shoes, jars of glow-moss, mouse houses. Nothing makes a sound and nothing has a body.
- The jars give a real green light: one line in room.js (`PROP_LIGHTS`) lights them and the stump house's window in lit rooms, and in the two dark rooms (the Underroot and the Well Bottom) they also light the dark (`light: 30`), so those rooms finally have a place to look at.
- Hollin: the Well Square has the welcome feast laid out for the Hero (forty plates, a cake gone green, a card: FOR THE HERO. WHEN HE COMES.), two strings of bunting and wild flowers coming up through the cobbles; the Mill has its open-day bunting and a wheelbarrow with GONE FOR HELP chalked on it; the Lane's garden strips have flowers, a mouse door, a bunting string and a rack of felt shoes (the stealth lane itself, x 10 to 21, is left empty); the Back Room has the spare flags and "HERO'S SUPPER (HOT)".
- The Dead City: the Gate Foot has a pilgrim's camp (bedroll, stick barrel, queue posts for a gate, a kettle, a chair) in its west pocket (the east is the Warden's cutscene ground, so only flat floor decals went there); the Statue Court has a dry fountain, a plinth with just its boots, a stall and a laundry slab; the Last Street has a wrapped bell and a rack of felt shoes (the Hushwood's habits, come from the city) and, on purpose, no moving things; the Colonnade has two stalls; the Stacks and Reading Room have globes, book towers and dust sheets; the Sculptor's Yard has a half-carved statue; the aqueduct has a washing slab, cattails and stepping stones.
- The Registry: queue posts, a ticket post (TAKE A NUMBER: you take 0001), file carts, dust sheets, globes, book towers.
- Voices: Bramble where he can be (the Hushwood from the Hollow Oak on, Hollin), Ves in the city and Registry; where neither is there, narration only. In the Hush Bramble whispers and worries.

**Rules kept:** every new prop is `walkable` (no body). A script placed each one off doors, the start, cutscene strips (except flat floor decals at the Gate Foot), monster patrol bands, the stealth lane, the leaf piles and every old prop, on reachable ground, with a free tile to stand on below anything with words. Nothing within two tiles of a door or the start. Keeper: nothing added (the first draft had three small "somebody tends this" lines, a fed jar, a new candle, a dusted card; they were taken out). No gold added.

**Checks (15 Nov):** `?check=1` clean; `?mask=all` shows nothing of mine (only the old before/after pairs); `?poke=all&with=bramble`: 16,982 props ok, 0 failures; textCheck: Problems 0; the chapter 3 walk-through lines for all 33 rooms (43 lines) pass. I looked at before and after stills of every fixed room.

**Not done / for later:** the generator (a spec file, a placement page and a script) is in `scratchpad/r3b/` and is not part of the game. The big east half of the Gate Foot is still open floor, on purpose. No new living touches or sounds (the Hushwood must stay hushed). I only replaced `props.js`, `room.js` and the two text files with small additive edits.
"""
open(root + 'notes/docs/life-pass-2026-11-14.md', 'a', encoding='utf-8').write(doc)
print('ok')
