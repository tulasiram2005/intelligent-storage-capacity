(function(root){
const GB=1e9;
function forecast(used,capacity,growth){return growth>0?Math.max(0,Math.ceil((capacity-used)/growth)):null}
function reclaimable(files){return files.filter(f=>f.duplicate).reduce((s,f)=>s+f.size,0)}
function validate(data){if(!data||!Array.isArray(data.files)||!Number.isFinite(data.capacity)||data.capacity<=0||!Number.isFinite(data.used)||data.used<0||data.used>data.capacity)throw Error('Invalid inventory capacity or usage.');for(const f of data.files){if(typeof f.name!=='string'||!Number.isFinite(f.size)||f.size<0)throw Error('Invalid file entry.')}return data}
const api={GB,forecast,reclaimable,validate};if(typeof module!=='undefined')module.exports=api;else root.StorageEngine=api;
})(globalThis);
