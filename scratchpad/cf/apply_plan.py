import json, re, collections
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
SPLIT = re.compile('(\r\n|\r|\n)')
es = json.load(open(f"{ROOT}/scratchpad/cf/lp.json"))
idx = collections.defaultdict(list)
for e in es: idx[(e['room'], f"{e['sprite']}@{e['x']},{e['y']}")].append(e)
stats = collections.Counter()
edits = collections.defaultdict(dict)   # file -> line -> new raw or None
removed_texts = []
def strip_walk(raw):
    raw = re.sub(r""",\s*["']?walkable["']?\s*:\s*true""", '', raw)
    raw = re.sub(r"""["']?walkable["']?\s*:\s*true\s*,\s*""", '', raw)
    return raw
for l in open(f"{ROOT}/scratchpad/cf/verify2.txt", encoding='utf8'):
    if not l.startswith('V '): continue
    v = json.loads(l[2:])
    for r in v['results']:
        lst = idx.get((v['id'], r['k']))
        if not lst: stats['nomatch'] += 1; continue
        e = lst.pop(0)
        raw = edits[e['file']].get(e['line'], e['raw'])
        if r['status'] == 'none':
            edits[e['file']][e['line']] = None; stats['removed'] += 1
            if e['text']: removed_texts.append(e['text'])
            continue
        new = strip_walk(raw)
        if r['status'] == 'moved':
            new = re.sub(r"""(["']?\bx["']?\s*:\s*)-?\d+""", lambda m: m.group(1) + str(r['nx']), new, count=1)
            new = re.sub(r"""(["']?\by["']?\s*:\s*)-?\d+""", lambda m: m.group(1) + str(r['ny']), new, count=1)
            stats['moved'] += 1
        else: stats['solid'] += 1
        edits[e['file']][e['line']] = new
for f, ch in edits.items():
    src = open(f, encoding='utf8', newline='').read()
    parts = SPLIT.split(src)
    L = parts[0::2]; seps = parts[1::2] + ['']
    out = []
    for i, l in enumerate(L):
        if i in ch:
            if ch[i] is None: continue
            l = ch[i].rstrip('\r')
        out.append(l + seps[i])
    open(f, 'w', encoding='utf8', newline='').write(''.join(out))
json.dump(removed_texts, open(f"{ROOT}/scratchpad/cf/removed_texts.json", 'w'))
print(stats)
