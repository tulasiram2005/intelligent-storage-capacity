const assert=require('node:assert/strict');const e=require('../dist/engine.js');
assert.equal(e.forecast(742,1000,6),43);assert.equal(e.forecast(742,1000,0),null);assert.equal(e.forecast(1000,1000,6),0);
assert.equal(e.reclaimable([{size:10,duplicate:true},{size:10}]),10);
assert.throws(()=>e.validate({capacity:10,used:20,files:[]}));
assert.throws(()=>e.validate({capacity:10,used:5,files:[{name:'bad',size:-1}]}));console.log('6 engine assertions passed');
