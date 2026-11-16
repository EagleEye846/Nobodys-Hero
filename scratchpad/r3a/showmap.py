import re,sys,glob,os
root='c:/Users/clanc/Documents/Nobodys Hero/'
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
        t=open(f,encoding='utf8').read()
        for m in re.finditer(r"^\s*%s:\s*\[(.*?)^\s*\],"%rid,t,re.S|re.M):
            out+=props_from(m.group(1))
    return out
rid=sys.argv[1]
f,t=room_file(rid)
T=tiles(t)
pr=props_from(t.split('props: [')[1].split('looks:')[0])+data_props(rid)
grid=[list(r) for r in T]
for s,x,y in pr:
    if 0<=y<len(grid) and 0<=x<len(grid[0]): grid[y][x]='@' if grid[y][x]!='@' else '%'
print(os.path.basename(f),len(T[0]),'x',len(T))
print('    '+''.join(str(i%10) for i in range(len(T[0]))))
for i,r in enumerate(grid): print('%3d '%i+''.join(r))
doors=re.findall(r"\{ x: (\d+), y: (\d+), w: (\d+), h: (\d+), to: '(\w+)'",t)
print('doors',doors)
print('monsters',re.findall(r"enemy: '(\w+)', x: (\d+), y: (\d+), patrol: \[(\d+), (\d+)\]",t))
print('start',re.findall(r"playerStart: \{ x: (\d+), y: (\d+)",t))
print('main props',[ (s,x,y) for s,x,y in props_from(t.split('props: [')[1].split('looks:')[0])][:12])
