import json, re, collections, glob
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
es = json.load(open(f"{ROOT}/scratchpad/cf/lp.json"))
dump = {}
for line in open(f"{ROOT}/scratchpad/cf/dump.txt", encoding='utf8'):
    if line.startswith('R '):
        r = json.loads(line[2:]); dump[r['id']] = r
size = {}
for r in dump.values():
    for p in r['props']: size[p['s']] = (p['w'], p['h'], p['fp'])
room_ids = set(dump)
# walk-through points
use = collections.defaultdict(set)
for f in glob.glob(f"{ROOT}/notes/docs/chapter-*-playthrough.txt"):
    for line in open(f, encoding='utf8'):
        if line.startswith('#') or '|' not in line: continue
        toks = set(re.findall(r"[a-z0-9_]+", line.split('|')[0] + ' ' + line.split('|',3)[3]))
        rooms = toks & room_ids
        pts = re.findall(r"use:(\d+),(\d+)", line)
        for rm in rooms:
            for a, b in pts: use[rm].add((int(a), int(b)))
BENIGN = {'sprite','x','y','text','walkable','decor','flat','animation','speed','pulse','notice','glow','light','sound','nightText','seenInLight','speaker','react'}
def keys(raw):
    return set(re.findall(r"""(?<![A-Za-z0-9_])["']?([A-Za-z]+)["']?\s*:""", raw))
WALL = set("""lv_sill lv_sill_pots lv_porch r2r_window r2r_window_pot r2v_wall_flags cl_ivy_wall cl_wall_clock bt_wall_pegs cl_pigeonholes cl_hat_pegs r1_coat_pegs r1_bell_pull r1_clock r1_mural r1_plaque r1_pigeonholes r1_jam_shelf r1_labels r1_banner r1_banner_blue cl_banner_torn cl_dartboard in_barometer in_calendar in_sketch_boat in_sketch_light in_mug_rail in_knot_board r2r_coat_hooks r2r_scarf_pegs r2r_menu_board r2r_dartboard r3h_clock r3m_shelf r3m_peg_cap r3m_peg_coat r2r_chimney r2r_roof_cat r2r_roof_cock st_tiny_door r5g_ratdoor sc_coast_map sd_chart bt_poster_a bt_poster_b cl_sign_boot cl_sign_bread cl_sign_key cl_sign_quill cl_sign_scales st_awning cl_oatcake_rack cl_pot_rack cl_towel_rack r1_mouse_hole cl_steam_pipe cl_prayer_board r5g_hook_lamp lv_hook_lamp lv_glow_shelf in_mug_rail""".split())
FILLER = re.compile(r"tuft|moss|leaf|leaves|pebble|puddle|crack|track|print|stain|weed|grass|fern|lichen|frost|snow_lump|chips|litter|shell|crumb|mat$|silt|twig|acorn|root|drift|petal|dune|stalk|trail|marks|scatter|spill|shingle|wrack|marram|holly|thrift|pool|bracken|toadstool|puffball|bolete|chanterelle|berries|pinecone|stones_flat|reeds|cattail|sedge|cotton|mould|fungus|cap|glitter|hoar|icicle|ice_|rime|wind_ripple|rock_peek|handhold|krummholz|vole|stoat|burrow|hoof|feather|hopscotch|chalk|footprint|wax|wool|button|packet|ink_blot|loose_pages|paper_stack|floor_stars|pale_caps|glow_patch|turf|heap|snag|sign$|gull_marks|crab_trail|rust_plate|rubble|plank|vines|bud|mush", re.I)
by_room = collections.defaultdict(list)
for e in es: by_room[e['room']].append(e)
keep, drop, why = [], [], collections.Counter()
for rm, lst in by_room.items():
    n = len(lst)
    cands = []
    for e in lst:
        k = keys(e['raw']) - BENIGN
        e['prot'] = bool(k) or ((e['x'], e['y']) in use.get(rm, set()) and bool(e['text']))
        e['wall'] = e['sprite'] in WALL
        if e['wall'] and not k: e['prot'] = (e['x'], e['y']) in use.get(rm, set()) and False
    # candidates for "best"
    cnt = collections.Counter(e['sprite'] for e in lst)
    for e in lst:
        if e['prot'] or e['wall'] or not e['text']: continue
        w, h, fp = size.get(e['sprite'], (16, 16, 1))
        s = 2 + (2 if cnt[e['sprite']] == 1 else 0) - (3 if FILLER.search(e['sprite']) else 0)
        s += 1 if 12 <= h <= 34 else 0
        s -= 2 if h > 48 or w > 48 else 0
        s -= 1 if re.search(r'_\d+$|_[a-z]$', e['text'] or '') else 0
        cands.append((s, e))
    cands.sort(key=lambda t: (-t[0], t[1]['line']))
    nbest = 3 if n >= 30 else 2 if n >= 8 else 1
    chosen = []
    for s, e in cands:
        if s < 1: break
        if any(abs(e['x'] - c['x']) + abs(e['y'] - c['y']) < 6 for c in chosen): continue
        chosen.append(e)
        if len(chosen) >= nbest: break
    ids = {id(c) for c in chosen}
    for e in lst:
        if e['prot'] and not e['wall'] or id(e) in ids: keep.append(e); why['keep-prot' if e['prot'] else 'keep-best'] += 1
        else: drop.append(e); why['drop-wall' if e['wall'] else 'drop'] += 1
json.dump(dict(keep=keep, drop=drop), open(f"{ROOT}/scratchpad/cf/decide.json", 'w'))
print(len(keep), len(drop), why)
pr = collections.Counter(e['sprite'] for e in keep if e['prot'])
print(pr.most_common(40))
print(collections.Counter(e['sprite'] for e in keep if not e['prot']).most_common(60))
