import json,re
t=json.load(open('c:/Users/clanc/Documents/Nobodys Hero/scratchpad/r3b/texts.json'))
for fn,key,title in (('text/interactions/hushwood.txt','hush','hush rooms and Hollin'),('text/interactions/deadcity.txt','city','the Dead City and the Registry')):
    fn='c:/Users/clanc/Documents/Nobodys Hero/'+fn
    s=open(fn,encoding='utf-8').read()
    s=re.sub(r"\n# --- THE LIFE PASS, ROUND 3 \(r3b\).*?# --- END THE LIFE PASS, ROUND 3 \(r3b\) ---\n","\n",s,flags=re.S)
    if not s.endswith('\n'): s+='\n'
    s=s.rstrip('\n')+'\n'
    s+=f"\n# --- THE LIFE PASS, ROUND 3 (r3b): the fun check, {title} ---\n\n"+t[key]+"\n# --- END THE LIFE PASS, ROUND 3 (r3b) ---\n"
    open(fn,'w',encoding='utf-8').write(s)
print('text ok')
