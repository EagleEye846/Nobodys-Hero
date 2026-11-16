import json,re,sys
sys.path.insert(0,'scratchpad/r3c')
from spec import SPEC
FLAT={'r3c_chalk_line','r3c_boot_print','r3c_chalk_arrow'}
pick=json.loads(re.search(r'RESULT (\{.*\})',open('scratchpad/r3c/pick.txt').read()).group(1))
FILES={}
for f in __import__('glob').glob('src/data/rooms/*.js'):
    s=open(f,encoding='utf8').read()
    m=re.search(r"\n  id: '([a-z_]+)'",s)
    if m: FILES[m.group(1)]=f
TOUCH={ # region-based extras
 'belowtown_long_rope':[{'kind':'motes','x':2,'y':39,'w':14,'h':8,'n':8,'color':"'255,225,160'"}],
 'belowtown_collapse':[{'kind':'motes','x':1,'y':2,'w':24,'h':19,'n':10,'color':"'230,215,190'"}],
 'deep_last_flight':[{'kind':'motes','x':3,'y':19,'w':18,'h':3,'n':6,'color':"'190,205,230'"}],
 'deep_crawl':[{'kind':'beetle','x':21,'y':17,'w':5}],
 'deep_way_up':[{'kind':'motes','x':2,'y':11,'w':18,'h':2,'n':5,'color':"'190,205,230'"}],
 'deep_keepers_fire':[{'kind':'motes','x':18,'y':5,'w':10,'h':4,'n':7,'color':"'255,190,120'"}],
 'stillwater_stair_down':[{'kind':'beetle','x':7,'y':13,'w':3}],
 'diggings_star_pool':[{'kind':'starmotes','x':14,'y':5,'w':12,'h':6,'n':8,'color':"'255,226,170'"}],
 'glimmer_landing':[{'kind':'sparkle','x':15,'y':5,'w':10,'h':6,'n':10,'color':"'255,190,230'"}],
 'glimmer_chimney':[{'kind':'sparkle','x':2,'y':16,'w':14,'h':3,'n':8,'color':"'190,235,255'"}],
 'deep_root':[{'kind':'motes','x':2,'y':17,'w':28,'h':8,'n':8,'color':"'190,205,230'"}],
 'deep_first_dark':[{'kind':'beetle','x':15,'y':14,'w':6}],
 'diggings_star_spill':[{'kind':'starmotes','x':14,'y':5,'w':8,'h':6,'n':6,'color':"'255,226,170'"}],
 'deep_heros_camp':[{'kind':'motes','x':4,'y':5,'w':24,'h':6,'n':6,'color':"'200,200,215'"}],
}
props_js=[]; touches_js=[]
texts={}   # textfile -> list of blocks
for room,sp in SPEC.items():
    lines=[]; crickets=[]
    for item,pos in zip(sp['items'],pick[room]):
        if pos is None: continue
        x,y=pos
        flat=item['sprite'] in FLAT or item['flat']
        base=f"sprite: '{item['sprite']}', x: {x}, y: {y}, walkable: true"
        if flat: base+=", flat: true"
        if item['sprite']=='r3c_jar_lights': base+=", animation: 'r3c_jar_lights', speed: 0.5"
        if item['id']:
            key=f"{sp['prefix']}_{item['id']}"
            lines.append(f"    {{ {base}, text: '{key}' }},")
            t=texts.setdefault(sp['textfile'],[])
            t.append((room,f"[{key}]\n{item['text']}\n"))
            if item['ves']: t.append((room,f"[{key}_ves]\n{item['ves']}\n"))
            if item['text2']: t.append((room,f"[{key} 2]\n{item['text2']}\n"))
            if item['ves2']: t.append((room,f"[{key}_ves 2]\n{item['ves2']}\n"))
        else:
            lines.append(f"    {{ {base}, decor: true }},")
            if not flat and len(crickets)<2: crickets.append((x,y))
    props_js.append(f"  {room}: [\n"+"\n".join(lines)+"\n  ],")
    tl=[]
    for x,y in crickets[:2]: tl.append(f"    {{ kind: 'cricket', x: {x}, y: {y} }},")
    for t in TOUCH.get(room,[]):
        tl.append("    { "+", ".join(f"{k}: {repr(v) if k=='kind' else v}" for k,v in t.items())+" },")
    touches_js.append(f"  {room}: [\n"+"\n".join(tl)+"\n  ],")
hdr='''// Round 3 (the fun check), helper C, 15 November 2026: the dullest rooms of chapter 4 get a layer of things
// to look at and press Z on, with a Ves answer on most. Placed by script: every tile is floor, clear of every
// door, save point (two tiles), monster patrol and scene walk, and never directly south of a word-bearing
// prop. All of them are `walkable` (no bodies), so no climb, push, ring, rope or cutscene can be blocked.
// The art is in src/data/art/r3cLife.js (ids start `r3c_`); the words are the `r3c_` sections at the end of
// the room's text file. Each room file spreads its list in at the start of its props.
import { ROOM_TOUCHES } from './touches.js';

export const R3C_PROPS = {
'''
out=hdr+"\n".join(props_js)+"\n};\n\nexport const R3C_TOUCHES = {\n"+"\n".join(touches_js)+"\n};\n\nfor (const [room, specs] of Object.entries(R3C_TOUCHES)) {\n  ROOM_TOUCHES[room] = [...(ROOM_TOUCHES[room] ?? []), ...specs];\n}\n"
open('src/data/r3cLife.js','w',encoding='utf8').write(out)
# text blocks
START='# --- THE LIFE PASS, ROUND 3 (helper C, 15 November 2026): the dullest rooms of chapter 4 ---'
END='# --- end life pass round 3 (helper C) ---'
for tf,blocks in texts.items():
    p=f'text/interactions/{tf}.txt'
    s=open(p,encoding='utf8').read()
    if START in s:
        s=s[:s.index(START)].rstrip('\n')+'\n'
    body='\n'+START+'\n\n'+"\n".join(b for _,b in blocks)+'\n'+END+'\n'
    open(p,'w',encoding='utf8').write(s.rstrip('\n')+'\n'+body)
# room files
for room in SPEC:
    f=FILES[room]; s=open(f,encoding='utf8').read()
    if 'R3C_PROPS' not in s:
        s=re.sub(r"\nexport const ",lambda m:"\nimport { R3C_PROPS } from '../r3cLife.js';\n\nexport const ",s,count=1)
        s=s.replace("\n  props: [\n","\n  props: [\n    ...(R3C_PROPS."+room+" ?? []),\n",1)
        open(f,'w',encoding='utf8').write(s)
print('ok',len(props_js),{k:len(v) for k,v in texts.items()})
