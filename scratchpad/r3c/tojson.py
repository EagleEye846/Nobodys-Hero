import json,sys
sys.path.insert(0,'scratchpad/r3c')
from spec import SPEC
out={r:[dict(sprite=i['sprite'],region=i['region'],flat=i['flat'],words=bool(i['id'])) for i in v['items']] for r,v in SPEC.items()}
json.dump(out,open('tools/r3c_spec.json','w'))
print(len(out), sum(len(v) for v in out.values()))
