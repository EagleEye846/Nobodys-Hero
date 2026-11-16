import json, re, glob, collections
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
SPLIT = re.compile('(\r\n|\r|\n)')
size = {}
for l in open(f"{ROOT}/scratchpad/cf/dump3.txt", encoding='utf8'):
    if l.startswith('R '):
        for p in json.loads(l[2:])['props']: size[p['s']] = (p['w'], p['h'], p['fp'])
dropped = collections.defaultdict(list)
for e in json.load(open(f"{ROOT}/scratchpad/cf/decide.json"))['drop']: dropped[e['room']].append((e['sprite'], e['x'], e['y']))
for e in json.load(open(f"{ROOT}/scratchpad/cf/helpers_decide.json"))['drop']: dropped[e['room']].append((e['sprite'], e['x'], e['y']))
for e in json.load(open(f"{ROOT}/scratchpad/cf/plaques.json")): dropped[e['room']].append((e['sprite'], e['x'], e['y']))
CAP = 4
stats = collections.Counter()
for f in sorted(glob.glob(f"{ROOT}/src/data/*Touches.js")):
    parts = SPLIT.split(open(f, encoding='utf8', newline='').read())
    L = parts[0::2]; seps = parts[1::2] + ['']
    room = None; groups = collections.OrderedDict()
    for i, line in enumerate(L):
        m = re.match(r"^\s*([a-z0-9_]+):\s*\[\s*$", line)
        if m: room = m.group(1); continue
        if re.match(r"^\s*\{ kind:", line) and room:
            groups.setdefault(room, []).append(i)
    kill = set()
    for rm, idxs in groups.items():
        seen_kind = collections.Counter(); keep = []
        for i in idxs:
            line = L[i]
            kind = re.search(r"kind: '([^']+)'", line).group(1)
            mm = re.search(r"\bx: (-?[\d.]+), y: (-?[\d.]+)", line)
            anchored = False
            if mm and not re.search(r'[ ,{](w|h|items|points): ', line.replace(mm.group(0), '')):
                x, y = float(mm.group(1)), float(mm.group(2))
                for s, px, py in dropped.get(rm, []):
                    w, h, fp = size.get(s, (16, 16, 1))
                    if px - 1.5 <= x <= px + fp + 1.5 and py - h / 16 - 0.5 <= y <= py + 1.8: anchored = True; break
            if anchored: kill.add(i); stats['anchored'] += 1; continue
            if seen_kind[kind] >= 1 and kind not in ('rainrings',): kill.add(i); stats['repeat'] += 1; continue
            seen_kind[kind] += 1; keep.append(i)
        for i in keep[CAP:]: kill.add(i); stats['cap'] += 1
    out = [l + seps[i] for i, l in enumerate(L) if i not in kill]
    open(f, 'w', encoding='utf8', newline='').write(''.join(out))
print(stats)
