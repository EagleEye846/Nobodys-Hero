import re, json, glob, os
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
DEDICATED = ['diggingsDressing','hushLife','lifePass3m','lifePass5','lifeShip','r3bLife','r3cLife','r3dLife','r3pDressing','restLife','ruinsLife','vigilLifePass','lifePass3c','r3aLife','sunnyLifeProps']
SPR = re.compile(r"""^\s*\{\s*["']?sprite["']?\s*:\s*["']([^"']+)["']""")
def num(raw, k):
    m = re.search(r"""["']?\b%s["']?\s*:\s*(-?\d+)""" % k, raw)
    return int(m.group(1)) if m else None
def text(raw):
    m = re.search(r"""["']?text["']?\s*:\s*["']([^"']+)["']""", raw)
    return m.group(1) if m else None
def entry(path, i, line, room):
    m = SPR.match(line)
    if not m or not re.search(r"\}\s*,?\s*(//.*)?$", line.strip()): return None
    return dict(file=path, line=i, room=room, sprite=m.group(1), x=num(line,'x'), y=num(line,'y'), text=text(line), raw=line.rstrip('\n'))
def scan():
    out = []
    for name in DEDICATED:
        p = f"{ROOT}/src/data/{name}.js"
        room = None
        for i, line in enumerate(open(p, encoding='utf-8').read().split('\n')):
            m = re.match(r"""^\s*["']?([a-zA-Z0-9_]+)["']?\s*:\s*\[\s*$""", line)
            if m: room = m.group(1); continue
            e = entry(p, i, line, room)
            if e: out.append(e)
    for p in sorted(glob.glob(f"{ROOT}/src/data/rooms/*.js")):
        lines = open(p, encoding='utf-8').read().split('\n')
        rid = None
        for l in lines:
            m = re.match(r"^\s*id:\s*'([^']+)'", l)
            if m: rid = m.group(1); break
        inprops = False; inblock = False
        for i, line in enumerate(lines):
            if re.match(r"^  props:\s*\[", line): inprops = True; inblock = False; continue
            if inprops and re.match(r"^  \],?\s*$", line): inprops = False; inblock = False; continue
            if not inprops: continue
            if re.search(r"//.*(life.?pass|LIFE-PASS)", line, re.I) and not re.search(r"END", line):
                inblock = True; continue
            if re.search(r"//.*(end life pass|LIFE-PASS-END)", line, re.I): inblock = False; continue
            if inblock:
                e = entry(p, i, line, rid)
                if e: out.append(e)
    return out
if __name__ == '__main__':
    es = scan()
    json.dump(es, open(f"{ROOT}/scratchpad/cf/lp.json", 'w'))
    from collections import Counter
    print(len(es)); 
    c = Counter(os.path.basename(e['file']) for e in es)
    for k, v in c.most_common(): print(v, k)
