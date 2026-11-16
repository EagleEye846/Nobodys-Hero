import json, re, sys, io
root = 'c:/Users/clanc/Documents/Nobodys Hero/'
out = open(root + 'scratchpad/r3b/place.out', encoding='utf-8').read()
m = re.search(r'^(\{.*\})\s*$', out, re.M)
placed = json.loads(m.group(1))
spec = json.load(open(root + 'scratchpad/r3b/spec.json'))
files = {}
data = {}
for rid, props in placed.items():
    items = {i['key']: i for i in spec['rooms'][rid]['items'] if i.get('name')}
    lst = []
    for p in props:
        q = dict(p); q['r3b'] = True
        lst.append(q)
    data[rid] = lst
# data file
lines = ["// Round 3 life pass, helper B (15 November 2026): the set pieces and dressing for the dullest rooms of",
         "// chapter 3 (the fun check). Each list is spread into its room's props with one line. Every one is",
         "// `walkable` (no body), so no route, push, log, treadle, current, carry or cutscene walk can be blocked; a",
         "// script placed each off every door, start, save point, cutscene strip, patrol band and old prop, on",
         "// ground you can reach, with a clear tile to stand on below anything you can press Z on. The Hushwood",
         "// ones are all quiet things: nothing here makes a sound. Their words are the `r3b_*` sections at the",
         "// end of text/interactions/hushwood.txt and deadcity.txt. Sprites: src/data/art/r3bLife.js.",
         "export const R3B_PROPS = {"]
for rid, lst in data.items():
    lines.append(f"  {rid}: [")
    for p in lst:
        parts = [f"sprite: '{p['sprite']}'", f"x: {p['x']}", f"y: {p['y']}"]
        if 'text' in p: parts.append(f"text: '{p['text']}'")
        parts.append('walkable: true')
        if p['sprite'] == 'r3b_jar_post' and rid in ('hush_underroot', 'hollin_well_bottom'): parts.append('light: 30')
        if p.get('flat'): parts.append('flat: true')
        if p.get('decor'): parts.append('decor: true')
        parts.append('r3b: true')
        lines.append("    { " + ", ".join(parts) + " },")
    lines.append("  ],")
lines.append("};")
open(root + 'src/data/r3bLife.js', 'w', encoding='utf-8').write("\n".join(lines) + "\n")
# texts
hush, city = [], []
for rid, lst in data.items():
    r = spec['rooms'][rid]
    keys = {p['text'] for p in lst if 'text' in p}
    sect = []
    for it in r['items']:
        if not it.get('name') or it['key'] not in keys: continue
        sect.append(f"[{it['key']}]\n{it['text']}\n")
        if it.get('line'):
            sect.append(f"[{it['key']}_{r['spk']}]\n{it['line']}\n")
    target = city if (rid.startswith('city') or rid.startswith('registry')) else hush
    target.append(f"# {rid}\n" + "\n".join(sect))
json.dump({'hush': "\n".join(hush), 'city': "\n".join(city), 'rooms': list(data.keys())}, open(root + 'scratchpad/r3b/texts.json', 'w'))
print(len(data), 'rooms', sum(len(v) for v in data.values()), 'props', sum(1 for v in data.values() for p in v if 'text' in p), 'with text')
