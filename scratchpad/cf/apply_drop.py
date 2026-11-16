import json, re, glob, collections
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
SPLIT = re.compile('(\r\n|\r|\n)')
d = json.load(open(f"{ROOT}/scratchpad/cf/decide.json"))
byfile = collections.defaultdict(set)
for e in d['drop']: byfile[e['file']].add(e['line'])
for f, lines in byfile.items():
    src = open(f, encoding='utf8', newline='').read()
    parts = SPLIT.split(src)
    L = parts[0::2]; seps = parts[1::2] + ['']
    out = []
    n = 0
    for i, l in enumerate(L):
        if i in lines: n += 1; continue
        out.append(l + seps[i])
    assert n == len(lines), (f, n, len(lines))
    open(f, 'w', encoding='utf8', newline='').write(''.join(out))
print('files', len(byfile))
# text sections
kept_texts = {e['text'] for e in d['keep'] if e['text']}
corpus = ''
for f in glob.glob(f"{ROOT}/src/**/*.js", recursive=True): corpus += open(f, encoding='utf8').read()
dt = {e['text'] for e in d['drop'] if e['text']} - kept_texts
dt = {t for t in dt if f"'{t}'" not in corpus and f'"{t}"' not in corpus}
def doomed(header):
    h = header.strip()
    for t in dt:
        if h == t or re.match(re.escape(t) + r'_(ves|bramble|calm)\b', h): return True
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
        txt = ''.join(out)

        open(f, 'w', encoding='utf8', newline='').write(txt)
print('sections removed', removed, 'of', len(dt))
