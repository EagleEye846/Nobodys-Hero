import re,sys
def show(path):
    s=open(path,encoding='utf8').read()
    m=re.search(r"tiles: \[\n(.*?)\n  \],",s,re.S)
    rows=[r.strip().rstrip(',').strip("'") for r in m.group(1).split('\n')]
    rows=[r.replace("\\\\","\\") for r in rows]
    grid=[list(r) for r in rows]
    props=[]
    for l in s.split('\n'):
        mm=re.search(r"sprite: '([^']+)'.*?\bx: (\d+), y: (\d+)",l)
        if mm and 'enemy' not in l[:12]:
            props.append((mm.group(1),int(mm.group(2)),int(mm.group(3)),'walkable' in l))
        me=re.search(r"enemy: '([^']+)', x: (\d+), y: (\d+)",l)
        if me: props.append(('E:'+me.group(1),int(me.group(2)),int(me.group(3)),True))
    for n,x,y,w in props:
        if y<len(grid) and x<len(grid[y]):
            grid[y][x]=('e' if n.startswith('E:') else ('o' if w else 'P'))
    print(path, len(grid[0]),'x',len(grid))
    print('    '+''.join(str(i%10) for i in range(len(grid[0]))))
    for i,r in enumerate(grid): print('%3d '%i+''.join(r))
    d=re.findall(r"\{ x: (\d+), y: (\d+), w: (\d+), h: (\d+), to: '([^']+)'",s)
    print('doors',d)
    print('start',re.findall(r"playerStart: \{ x: (\d+), y: (\d+)",s))
    print('P/o list:',[(n,x,y) for n,x,y,w in props if not w])
for p in sys.argv[1:]: show(p)
