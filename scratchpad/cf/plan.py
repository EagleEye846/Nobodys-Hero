import json, re, glob, collections, os
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
es = json.load(open(f"{ROOT}/scratchpad/cf/lp.json"))
size = {}
room_ids = set()
for l in open(f"{ROOT}/scratchpad/cf/dump2.txt", encoding='utf8'):
    if l.startswith('R '):
        r = json.loads(l[2:]); room_ids.add(r['id'])
        for p in r['props']: size[p['s']] = (p['w'], p['h'], p['fp'])
EXCLUDE = {'lanes_hamlet', 'secret_lanes_attic'}
FLATWORD = re.compile(r"shoe|boot|mug|cups?$|cup_|_can$|tin$|tin_|pot_single|ink_pot|pages|duck|toy|doll|feather|mitten|stub|flask|bottle|shell|starfish|fishbones|fish_bones|egg|hat$|glove|bones|cheese|sock|ball|saucer|packet|button|books|dish|knife|spoon|marble|rope_coil|coil|lantern_fallen|whelk|turnip|nest|mat$|doormat|puddle|net_torn|planks|driftwood|drawing|rivets|chalk|scratches|worm_pile|grit|fossil|bricks|sieve|candle|tea_tray|helm$|top_hat|hassock|posy|mosaic|loose|veg_bed|rock_pool|pool|journal|unsent|noughts|tally$|beetle|logbook$|note|snowbunny|goat_kid|snowshoes|skis|sled|wheel|acorn|fur$|antler|horn|stardust|reserved|sweet|bundle|dandelion|flowers|wild_flowers|herbs|kelp|wrack|ribbon|crab|gull$|cat_sit|bath|cat_bowl|cat_bed|cat_hearth|stoat_den|fishing_hole|flag_rag|frozen_shirt|boots|bent_pole", re.I)
LOW = set('al_wheel_sunk rock_pool pearl_pool mosaic veg_bed shore_kelp shore_kelp_b il_dandelion felt_shoes chalk_arrow chalk_skull net_torn boots_dry planks_scatter driftwood bones'.split())
PLAQUE = set('dg_tally r1_reserved c5_child_drawing il_note_tidy r3m_g_tally'.split())
def is_flat(e):
    w, h, fp = size.get(e['sprite'], (16, 16, 1))
    if h <= 12: return True
    if any(e['sprite'].endswith(n) for n in LOW): return True
    if FLATWORD.search(e['sprite']): return h <= 16
    return False
BENIGN = {'sprite','x','y','text','walkable','decor','flat','animation','speed','pulse','notice','glow','light','sound','nightText','seenInLight','speaker','react'}
def keys(raw):
    return set(re.findall(r"""(?<![A-Za-z0-9_])["']?([A-Za-z]+)["']?\s*:""", raw))
use = collections.defaultdict(set)
for f in glob.glob(f"{ROOT}/notes/docs/chapter-*-playthrough.txt"):
    for line in open(f, encoding='utf8'):
        if line.startswith('#') or '|' not in line: continue
        parts = line.strip().split('|', 3)
        cur = parts[0]
        for tok in parts[3].split(';'):
            m = re.match(r"(go|use|at):(\d+),(\d+)", tok)
            if m: use[cur].add((int(m.group(2)), int(m.group(3)))); continue
            m = re.match(r"(?:exit|enter|expect:room|travel):([a-z0-9_]+)", tok)
            if m and m.group(1) in room_ids: cur = m.group(1)
plan = {}
plaques = []
cls = collections.Counter()
for e in es:
    if e['room'] in EXCLUDE or e['room'] not in room_ids: continue
    import os
    if bool(re.search(r"""walkable["']?\s*:\s*true""", e['raw'])) == bool(os.environ.get('AUDIT')): continue
    if keys(e['raw']) - BENIGN: cls['special'] += 1; continue
    if e['sprite'] in PLAQUE and not os.environ.get('AUDIT'): plaques.append(e); continue
    if is_flat(e): cls['flat'] += 1; continue
    w, h, fp = size.get(e['sprite'], (16, 16, 1))
    cls['solid'] += 1
    pl = plan.setdefault(e['room'], {'solid': [], 'avoid': sorted(use.get(e['room'], []))})
    pl['solid'].append(dict(k=f"{e['sprite']}@{e['x']},{e['y']}", sprite=e['sprite'], x=e['x'], y=e['y'], fp=fp, h=h, tall=(h >= 40 and fp <= 2)))
json.dump(plan, open(f"{ROOT}/tools/_plan.json" if not os.environ.get('AUDIT') else f"{ROOT}/tools/_audit.json", 'w'))
print(cls, len(plan))
json.dump(plaques, open(f"{ROOT}/scratchpad/cf/plaques.json", 'w'))
print('plaques', len(plaques))
