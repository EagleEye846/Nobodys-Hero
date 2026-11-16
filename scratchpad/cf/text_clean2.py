import json, re, glob
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
SPLIT = re.compile('(\r\n|\r|\n)')
d = json.load(open(f"{ROOT}/scratchpad/cf/decide.json"))
corpus = ''
for f in glob.glob(f"{ROOT}/src/**/*.js", recursive=True): corpus += open(f, encoding='utf8').read()
kept = {e['text'] for e in d['keep'] if e['text']}
dt = set(json.load(open(f"{ROOT}/scratchpad/cf/extra_drop.json")))
dt = {t for t in dt if f"'{t}'" not in corpus and f'"{t}"' not in corpus}
SUF = re.compile(r'^(.*)_(ves|bramble|calm)\b')
def doomed(h):
    h = h.strip()
    if h in dt: return True
    m = SUF.match(h)
    while m:
        if m.group(1) in dt: return True
        m = SUF.match(m.group(1))
    return False
removed = 0
for f in glob.glob(f"{ROOT}/text/**/*.txt", recursive=True):
    src = open(f, encoding='utf8', newline='').read()
    parts = SPLIT.split(src)
    L = parts[0::2]; seps = parts[1::2] + ['']
    out = []; skip = False; changed = False
    for l, s in zip(L, seps):
        m = re.match(r'^\[([^\]]+)\]\s*$', l)
        if m:
            skip = doomed(m.group(1))
            if skip: removed += 1; changed = True
        if not skip: out.append(l + s)
    if changed:
        open(f, 'w', encoding='utf8', newline='').write(''.join(out))
print('sections removed', removed, 'of', len(dt))
