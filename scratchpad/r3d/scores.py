import re, sys, json
# Round 3 scoring for the chapter 5 + Ash Road stretch.
# Score out of 10 from: how much there is to see/poke/find (density of props, words, living touches per room size),
# a reason to exist (scenes, puzzles, secrets: listed by hand), looks like a picture (stills), repeats the room before.
def load(path):
    rows = {}
    for l in open(path):
        p = l.strip().split('|')
        if len(p) < 10: continue
        g = lambda s: int(re.search(r'(\d+)', s).group(1))
        w, h = map(int, p[2].split('x'))
        rows[p[0]] = dict(w=w, h=h, props=g(p[3]), words=g(p[4]), touch=g(p[6]), kinds=g(p[9]), scenes=g(p[10]))
    return rows

def base(r):
    d = (r['props'] + 2 * r['words'] + 3 * r['touch']) / (r['w'] * r['h']) * 100
    s = 3 + d / 6.5
    if r['scenes'] >= 2: s += 0.5
    return min(9, max(3, s))

SKIP = ('haddock_', 'secret_merrow', 'lastlight_balcony', 'isles_forge')   # untouched on purpose / story rooms
# by-hand adjustments after looking at stills and thinking about the room's job (+ better, - worse)
ADJ = {
 'ash_seabed': 0, 'ash_tideline': 0, 'ash_buried_road': 0, 'ash_cinder_field': 0, 'ash_orchard': 0,
 'ash_storm_flats': 0, 'ash_waystation': 0, 'ash_drift_cut': 0, 'ash_town_gate': 0,
 'reach_needle': 0.5, 'wreck_chain_cliff': 0.5, 'sunny_sea_view': 0.5, 'reach_foot': 1.0,
 'wreck_watch_rock': -0.5, 'lastlight_upper': 0,
}

if __name__ == '__main__':
    path = sys.argv[1]
    rows = load(path)
    out = []
    for k, r in rows.items():
        if k.startswith(SKIP): continue
        out.append((round(min(9, max(3, base(r) + ADJ.get(k, 0))), 1), k, r))
    out.sort()
    for s, k, r in out:
        print(f"{s:4.1f} {k:28s} {r['w']}x{r['h']} props {r['props']} words {r['words']} touches {r['touch']}")
