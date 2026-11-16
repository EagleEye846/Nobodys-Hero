import fs from 'fs'; import path from 'path'; import {pathToFileURL} from 'url';
const dir='src/data/rooms';
const re=/^(pinefall|hollin|hush|drains|marsh|lasthome|city|registry|baths)/;
const rows=[];
for(const f of fs.readdirSync(dir).filter(f=>re.test(f))){
  try{
    const m=await import(pathToFileURL(path.resolve(dir,f)).href);
    for(const [k,r] of Object.entries(m)){ if(!r||!r.id||!r.props) continue;
      const props=r.props; const words=props.filter(p=>p.text||p.lines||p.say||p.words||p.id&&!p.decor).length;
      rows.push({id:r.id,file:f,w:r.map?.[0]?.length??r.width,h:r.map?.length??r.height,props:props.length,decor:props.filter(p=>p.decor).length,speak:props.filter(p=>p.text||p.sign||p.interact||p.words||p.line).length,npcs:(r.npcs||[]).length,mons:(r.enemies||r.monsters||[]).length,touches:0});
    }
  }catch(e){rows.push({file:f,err:String(e).slice(0,80)})}
}
console.log(JSON.stringify(rows));
