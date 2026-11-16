import { ASH_KINDS } from '../../src/overworld/ashTouches.js';
const calls=[];
const ctx={ set fillStyle(v){}, fillRect(...a){calls.push(a)}, drawImage(){}, save(){}, restore(){} };
const b=ASH_KINDS.blown({x:27,y:5,len:5,scene:{}});
b.floor(ctx,{x:256,y:0},0);
console.log(calls.length, calls.slice(0,5));
