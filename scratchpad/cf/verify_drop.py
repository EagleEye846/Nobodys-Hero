import json,re,collections,difflib
ROOT=r"c:/Users/clanc/Documents/Nobodys Hero"
d=json.load(open(ROOT+'/scratchpad/cf/decide.json'))
byfile=collections.defaultdict(list)
for e in d['drop']: byfile[e['file']].append(e)
bad=0
for f,es in byfile.items():
    rel=f.replace(chr(92),'/').split('src/data/')[1]
    a=open(ROOT+'/scratchpad/cf/backup/data/'+rel,encoding='utf8').read().split('\n')
    b=open(f,encoding='utf8').read().split('\n')
    removed=[l for l in a if True]
    ca=collections.Counter(x.rstrip('\r') for x in a); cb=collections.Counter(x.rstrip('\r') for x in b)
    gone=ca-cb; extra=cb-ca
    want=collections.Counter(e['raw'].rstrip('\r') for e in es)
    if extra or (gone-want) or (want-gone):
        bad+=1; print('MISMATCH',rel,sum(extra.values()),sum((gone-want).values()),sum((want-gone).values()))
print('bad files',bad,'of',len(byfile))
