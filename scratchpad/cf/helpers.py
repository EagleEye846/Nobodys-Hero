import json, re, collections, sys
ROOT = r"c:/Users/clanc/Documents/Nobodys Hero"
FILES = ['r3aLife', 'sunnyLifeProps']
CALL = re.compile(r"\b(t|d|f|w|an|at)\(")
SPLIT = re.compile('(\r\n|\r|\n)')

def scan():
    out = []
    for name in FILES:
        p = f"{ROOT}/src/data/{name}.js"
        src = open(p, encoding='utf8', newline='').read()
        lines = SPLIT.split(src)[0::2]
        room = None
        for i, line in enumerate(lines):
            m = re.match(r"^\s*([a-z0-9_]+):\s*\[\s*$", line)
            if m: room = m.group(1); continue
            if line.lstrip().startswith('//') or line.startswith('const '): continue
            for m in CALL.finditer(line):
                depth = 0; j = m.end() - 1; end = None; q = None
                while j < len(line):
                    ch = line[j]
                    if q:
                        if ch == q: q = None
                    elif ch in "'\"": q = ch
                    elif ch == '(': depth += 1
                    elif ch == ')':
                        depth -= 1
                        if depth == 0: end = j + 1; break
                    j += 1
                if end is None: print('unbalanced', name, i); continue
                call = line[m.start():end]
                a = re.match(r"\w+\('([^']+)',\s*(-?\d+),\s*(-?\d+)(?:,\s*(?:(\d+(?:\.\d+)?),\s*)?'([^']+)')?", call)
                if not a: print('odd', call); continue
                fn = m.group(1)
                text = a.group(5) if fn in ('t', 'at') else None
                if fn in ('t',):
                    mt = re.match(r"t\('([^']+)',\s*(-?\d+),\s*(-?\d+),\s*'([^']+)'", call)
                    text = mt.group(4) if mt else None
                out.append(dict(file=p, line=i, c0=m.start(), c1=end, fn=fn, room=room, sprite=a.group(1), x=int(a.group(2)), y=int(a.group(3)), text=text, raw=call))
    return out

if __name__ == '__main__':
    es = scan()
    print(len(es), collections.Counter(e['fn'] for e in es))
    json.dump(es, open(f"{ROOT}/scratchpad/cf/helpers.json", 'w'))

def decide(es, size):
    import re
    FILLER = re.compile(r"tuft|moss|leaf|leaves|pebble|puddle|crack|track|print|stain|weed|grass|fern|lichen|frost|chips|litter|shell|crumb|mat$|silt|twig|acorn|root|drift|petal|dune|stalk|trail|marks|scatter|spill|pool|bracken|toadstool|puffball|reeds|mould|fungus|heather|flowers|foxglove|clover|snail|sign$", re.I)
    BEN = {'flat','wall','animation','speed','decor','walkable','text','light'}
    by = collections.defaultdict(list)
    for e in es: by[e['room']].append(e)
    keep, drop = [], []
    for rm, lst in by.items():
        n = len(lst)
        cnt = collections.Counter(e['sprite'] for e in lst)
        cands = []
        for e in lst:
            opt = set(re.findall(r"(?<![A-Za-z0-9_])(\w+):", e['raw'])) - BEN
            if opt: keep.append(e); e['prot'] = True; continue
            if e['fn'] in ('t', 'at') and e['text']:
                w, h, fp = size.get(e['sprite'], (16, 16, 1))
                s = 2 + (2 if cnt[e['sprite']] == 1 else 0) - (3 if FILLER.search(e['sprite']) else 0) + (1 if 12 <= h <= 34 else 0) - (2 if h > 48 or w > 48 else 0)
                cands.append((s, e))
        cands.sort(key=lambda t: (-t[0], t[1]['line'], t[1]['c0']))
        nb = 3 if n >= 30 else 2 if n >= 8 else 1
        chosen = []
        for s, e in cands:
            if s < 1: break
            if any(abs(e['x'] - c['x']) + abs(e['y'] - c['y']) < 6 for c in chosen): continue
            chosen.append(e)
            if len(chosen) >= nb: break
        ids = {id(c) for c in chosen}
        for e in lst:
            if e.get('prot'): continue
            (keep if id(e) in ids else drop).append(e)
    return keep, drop
