import re,sys,glob
root='c:/Users/clanc/Documents/Nobodys Hero/'
src=open(root+'src/data/r3aLife.js',encoding='utf8').read()
rooms=re.findall(r"^  (\w+): \[(.*?)^  \],",src,re.S|re.M)
def room_file(rid):
    for f in glob.glob(root+'src/data/rooms/*.js'):
        t=open(f,encoding='utf8').read()
        if re.search(r"\bid:\s*'%s'"%rid,t): return f,t
def tiles(t):
    m=re.search(r"tiles:\s*\[(.*?)\n\s*\],",t,re.S)
    return re.findall(r"'([^']*)'",m.group(1))
def props_from(text):
    return [(m.group(1),int(m.group(2)),int(m.group(3))) for m in re.finditer(r"sprite:\s*'([^']+)',\s*x:\s*(\d+),\s*y:\s*(\d+)",text)]
def data_props(rid):
    out=[]
    for f in glob.glob(root+'src/data/*.js'):
        if f.endswith('r3aLife.js'): continue
        t=open(f,encoding='utf8').read()
        for m in re.finditer(r"^\s*%s:\s*\[(.*?)^\s*\],"%rid,t,re.S|re.M):
            out+=props_from(m.group(1))
    return out
floor={'beyond_ruins':',:','cave_entry':'q','cave_gallery':'q','sheer_face':',:','vigil_lamplighters_hut':'o','ice_cave_throat':'q','ice_cave_grotto':'q','ice_cave_hall':'q','ice_cave_roost':'q','vigil_summit':'n'}
wallok=set()
bad=0
for rid,body in rooms:
    f,t=room_file(rid); T=tiles(t)
    existing=props_from(t.split('props: [')[1].split('looks:')[0].split('R3A_PROPS')[0])+data_props(rid)
    occ={(x,y):s for s,x,y in existing}
    mine=re.findall(r"(\w)\('([\w]+)', (\d+), (\d+)(?:, '(\w+)')?(.*?)\),?\n",body)
    seen={}
    for kind,spr,x,y,txt,rest in mine:
        x=int(x);y=int(y)
        ch=T[y][x] if y<len(T) and x<len(T[0]) else '?'
        fl=floor.get(rid,'o')
        problems=[]
        isdecor=kind in 'dfw'
        if kind=='w' or 'wall: true' in rest: pass
        elif ch not in fl+('r' if rid.startswith('rest') or rid.endswith('hut') else ''): problems.append('tile %r'%ch)
        if (x,y) in occ: problems.append('on existing %s'%occ[(x,y)])
        if (x,y) in seen: problems.append('dup %s'%seen[(x,y)])
        seen[(x,y)]=spr
        if problems:
            bad+=1; print(rid,spr,x,y,problems)
print('bad',bad)
