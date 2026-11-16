"""Round 3 helper D builder.
python build.py req    -> writes tools/r3d_requests.json (for the snapper page)
python build.py final  -> reads scratchpad/r3d/snap.json, writes src/data/r3dLife.js, text blocks
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from spec_ash import ASH
from spec_rest import REST

ROOT = r'c:/Users/clanc/Documents/Nobodys Hero'
SPEC = {**ASH, **REST}
FLAT = {'c5_wrack_line','c5_crab_trail','c5_gull_marks','c5_puddle','c5_planks_scatter','c5_net_torn','c5_floor_crack',
        'c5_rust_bloom','c5_shingle_spill','c5_turf_patch','c5_weed_mat','il_lichen','il_rocks_flat','gs_puddle'}
AVOID = {
 'ash_buried_road': dict(rows=[7], cols=[12, 18, 23, 25]),
 'ash_cinder_field': dict(rows=[5, 9], cols=[10, 12]),
 'ash_storm_flats': dict(rows=[9], cols=[12, 30]),
 'ash_drift_cut': dict(rows=[3, 5, 8], cols=[6, 11, 21]),
}
MARK_B, MARK_E = '# --- R3D BEGIN (round 3 fun check, helper D) ---', '# --- R3D END ---'


def requests():
    out = {}
    for room, s in SPEC.items():
        items = []
        for i, p in enumerate(s['pokes']):
            items.append(dict(t='p', sprite=p[0], x=p[1], y=p[2], key=p[3]))
        for d in s['decor']:
            items.append(dict(t='d', sprite=d[0], x=d[1], y=d[2], water=(len(d) > 3 and d[3] == 'water')))
        out[room] = dict(items=items, **AVOID.get(room, dict(rows=[], cols=[])))
    return out


def final():
    snap = json.load(open(os.path.join(os.path.dirname(__file__), 'snap.json')))
    js = ['// Round 3, helper D (the fun check, 15 November 2026): more to see and poke in the thinnest rooms of',
          '// chapter 5 and the Ash Road. Every piece is walkable (bodiless), so no route, push, gust, swing or cutscene',
          "// walk can be blocked. Words are the r3d_* sections at the end of each room's text file. (draft)",
          'export const R3D_PROPS = {']
    texts = {}
    tjs = ['// Round 3, helper D: living touches for the thinnest rooms.', 'export const R3D_TOUCHES = {']
    report = []
    for room, s in SPEC.items():
        placed = snap.get(room, {})
        lines = []
        for p in s['pokes']:
            at = placed.get(p[3])
            if not at:
                report.append(f'DROPPED poke {room}/{p[3]}')
                continue
            tid = f'r3d_{room}_{p[3]}'
            lines.append(f"  {{ sprite: '{p[0]}', x: {at[0]}, y: {at[1]}, text: '{tid}', walkable: true }},")
            t = texts.setdefault(s['file'], [])
            t.append(f"[{tid}]\n{p[4]}\n\n[{tid}_bramble]\n{{{p[5][0]}}}{p[5][1]}\n\n[{tid}_ves]\n{{{p[6][0]}}}{p[6][1]}\n")
        for j, d in enumerate(s['decor']):
            at = placed.get(f'd{j}')
            if not at:
                report.append(f'DROPPED decor {room}/{d[0]}')
                continue
            flat = ', flat: true' if d[0] in FLAT else ''
            lines.append(f"  {{ sprite: '{d[0]}', x: {at[0]}, y: {at[1]}{flat}, walkable: true, decor: true }},")
        js.append(f"  {room}: [")
        js.extend(lines)
        js.append('  ],')
        if s['touches']:
            tjs.append(f"  {room}: [")
            tjs.extend(f"    {t}," for t in s['touches'])
            tjs.append('  ],')
    js.append('};')
    tjs.append('};')
    open(f'{ROOT}/src/data/r3dLife.js', 'w', encoding='utf-8').write('\n'.join(js) + '\n')
    open(f'{ROOT}/src/data/r3dTouches.js', 'w', encoding='utf-8').write('\n'.join(tjs) + '\n')
    for f, blocks in texts.items():
        path = f'{ROOT}/text/{f}'
        txt = open(path, encoding='utf-8').read()
        if MARK_B in txt:
            txt = txt[:txt.index(MARK_B)].rstrip('\n') + '\n'
        txt = txt.rstrip('\n') + '\n\n' + MARK_B + '\n# (draft)\n\n' + '\n'.join(blocks) + '\n' + MARK_E + '\n'
        open(path, 'w', encoding='utf-8', newline='\n').write(txt)
    print('\n'.join(report) or 'all placed')


if __name__ == '__main__':
    if sys.argv[1] == 'req':
        json.dump(requests(), open(f'{ROOT}/tools/r3d_requests.json', 'w'))
        print('requests for', len(SPEC), 'rooms')
    else:
        final()
