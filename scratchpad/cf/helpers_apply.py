import sys, json, re, collections
sys.path.insert(0, 'c:/Users/clanc/Documents/Nobodys Hero/scratchpad/cf')
import helpers
ROOT = helpers.ROOT
SPLIT = helpers.SPLIT
size = {}
for l in open(ROOT + '/scratchpad/cf/dump3.txt', encoding='utf8'):
    if l.startswith('R '):
        for p in json.loads(l[2:])['props']: size[p['s']] = (p['w'], p['h'], p['fp'])
mode = sys.argv[1]
def edit_lines(changes):
    # changes: file -> list of (line, c0, c1, replacement)
    for f, ch in changes.items():
        parts = SPLIT.split(open(f, encoding='utf8', newline='').read())
        L = parts[0::2]; seps = parts[1::2] + ['']
        by = collections.defaultdict(list)
        for line, c0, c1, rep in ch: by[line].append((c0, c1, rep))
        for line, lst in by.items():
            s = L[line]
            for c0, c1, rep in sorted(lst, reverse=True):
                if rep is None:
                    tail = s[c1:]
                    m = re.match(r"\s*,?\s*", tail)
                    s = s[:c0] + tail[m.end():]
                else: s = s[:c0] + rep + s[c1:]
            L[line] = s
        out = []
        for i, l in enumerate(L):
            if re.match(r"^\s*,?\s*$", l) and i in by: continue
            out.append(l + seps[i])
        open(f, 'w', encoding='utf8', newline='').write(''.join(out))
if mode == 'drop':
    es = helpers.scan()
    keep, drop = helpers.decide(es, size)
    ch = collections.defaultdict(list)
    for e in drop: ch[e['file']].append((e['line'], e['c0'], e['c1'], None))
    edit_lines(ch)
    print('dropped', len(drop), 'kept', len(keep))
if mode == 'plan':
    exec(open(ROOT + '/scratchpad/cf/plan.py').read().split("plan = {}")[0].split("es = json.load")[0])
    src = open(ROOT + '/scratchpad/cf/plan.py').read()
    # reuse is_flat from plan.py
    ns = {}
    pre = src.split("use = collections")[0].replace("es = json.load(open(f\"{ROOT}/scratchpad/cf/lp.json\"))", "es = []")
    exec(pre, ns)
    es = helpers.scan()
    plan = {}
    for e in es:
        if e['fn'] == 'w' or 'flat' in e['raw'] or e['room'] in ns['EXCLUDE']: continue
        if e['fn'] == 'd' and False: pass
        if re.search(r"(?<![A-Za-z0-9_])(gives|until|after|quest|npc|gold):", e['raw']): continue
        pr = dict(sprite=e['sprite'])
        if ns['is_flat'](pr): continue
        w, h, fp = size.get(e['sprite'], (16, 16, 1))
        pl = plan.setdefault(e['room'], {'solid': [], 'avoid': []})
        pl['solid'].append(dict(k=f"{e['sprite']}@{e['x']},{e['y']}", sprite=e['sprite'], x=e['x'], y=e['y'], fp=fp, h=h, tall=(h >= 40 and fp <= 2)))
    json.dump(plan, open(ROOT + '/tools/_plan_h.json', 'w'))
    print(sum(len(v['solid']) for v in plan.values()), 'to test in', len(plan), 'rooms')
if mode == 'apply':
    es = helpers.scan()
    idx = collections.defaultdict(list)
    for e in es: idx[(e['room'], f"{e['sprite']}@{e['x']},{e['y']}")].append(e)
    ch = collections.defaultdict(list); st = collections.Counter()
    for l in open(ROOT + '/scratchpad/cf/verify_h.txt', encoding='utf8'):
        if not l.startswith('V '): continue
        v = json.loads(l[2:])
        for r in v['results']:
            lst = idx.get((v['id'], r['k']))
            if not lst: st['nomatch'] += 1; continue
            e = lst.pop(0); raw = e['raw']
            if r['status'] == 'none': ch[e['file']].append((e['line'], e['c0'], e['c1'], None)); st['removed'] += 1; continue
            if r['status'] == 'moved':
                raw = re.sub(r"^(\w+\('[^']+',\s*)(-?\d+)(,\s*)(-?\d+)", lambda m: f"{m.group(1)}{r['nx']}{m.group(3)}{r['ny']}", raw); st['moved'] += 1
            else: st['solid'] += 1
            if re.search(r", \{.*\}\)$", raw): raw = re.sub(r"(, \{)( ?)(?=[^{]*\}\)$)", lambda m: m.group(1) + " walkable: false,", raw, count=1)
            else: raw = raw[:-1] + ", { walkable: false })"
            ch[e['file']].append((e['line'], e['c0'], e['c1'], raw))
    edit_lines(ch); print(st)
