/* Capacity engine. Pure functions shared by the UI and Node tests. */
(function (root) {
  'use strict';
  const DAY = 86400000;
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  function fit(points) {
    if (points.length < 3) throw Error('At least 3 observations are required.');
    const mx = mean(points.map(p => p.day)), my = mean(points.map(p => p.used));
    const sxx = points.reduce((s, p) => s + (p.day - mx) ** 2, 0);
    if (sxx === 0) throw Error('Observation times must be different.');
    const slope = points.reduce((s, p) => s + (p.day - mx) * (p.used - my), 0) / sxx;
    const intercept = my - slope * mx;
    const sse = points.reduce((s, p) => s + (p.used - intercept - slope * p.day) ** 2, 0);
    const sst = points.reduce((s, p) => s + (p.used - my) ** 2, 0);
    return { slope, intercept, r2: sst === 0 ? 1 : 1 - sse / sst, se: Math.sqrt(sse / (points.length - 2)), n: points.length, mx, sxx };
  }
  function predict(model, day) { return model.intercept + model.slope * day; }
  function interval(model, day) {
    // Normal approximation to a 95% prediction interval; assumes independent constant-variance residuals.
    return 1.96 * model.se * Math.sqrt(1 + 1 / model.n + (day - model.mx) ** 2 / model.sxx);
  }
  function evaluate(points) {
    if (points.length < 10) return null;
    const split = Math.min(points.length - 2, Math.floor(points.length * 0.78));
    const train = points.slice(0, split), test = points.slice(split), m = fit(train);
    const errors = test.map(p => p.used - predict(m, p.day));
    const baseline = test.map(p => p.used - train[train.length - 1].used);
    return { train: train.length, test: test.length, mae: mean(errors.map(Math.abs)), rmse: Math.sqrt(mean(errors.map(e => e * e))), baselineMAE: mean(baseline.map(Math.abs)), r2: m.r2 };
  }
  function runway(server, threshold, capacity = server.capacity, reclaim = 0, growthFactor = 1) {
    const last = server.points.at(-1), current = Math.max(0, last.used - reclaim), target = capacity * threshold / 100;
    if (current >= target) return 0;
    if (server.points.length < 3) return null;
    const m = fit(server.points), slope = m.slope * growthFactor;
    if (slope <= 1e-9) return null;
    return Math.max(0, Math.ceil((target - current) / slope));
  }
  function analyze(server) {
    const last = server.points.at(-1), model = server.points.length >= 3 ? fit(server.points) : null;
    return { last, model, validation: evaluate(server.points), utilization: last.used / server.capacity * 100, days: runway(server, 90) };
  }
  function forecastValue(server, offset, factor = 1, reclaim = 0) {
    const current = server.points.at(-1).used;
    if (server.points.length < 3) return null;
    // Anchor forecast at latest observed usage to avoid a jump at the boundary.
    return Math.max(0, current - reclaim + fit(server.points).slope * offset * factor);
  }
  function makeDemo() {
    const specs = [
      ['atlas','Atlas','Research datasets','CHENNAI / LAB 01',1000,458,4.03,8, '#ffb454'],
      ['nova','Nova','Student workspaces','CHENNAI / LAB 02',750,359,2.14,5,'#8b9dff'],
      ['vault','Vault','Archive & recovery','CHENNAI / BACKUP',2000,943,2.45,10,'#4ac8b0']
    ];
    return specs.map(([id,name,role,location,capacity,start,slope,noise,color],j)=>({id,name,role,location,capacity,color,source:'Synthetic',points:Array.from({length:90},(_,i)=>({day:i+1,used:+(start+slope*(i+1)+Math.sin(i*1.73+j)*noise+Math.cos(i*.31+j)*noise*.45).toFixed(2)}))}));
  }
  function parseCSV(text) {
    const lines = text.trim().replace(/^\uFEFF/, '').split(/\r?\n/).filter(l=>l.trim());
    if (lines.length < 2) throw Error('CSV needs a header and observations.');
    const columns = lines[0].split(',').map(s=>s.trim().toLowerCase());
    for (const name of ['server','day','used_gb','capacity_gb']) if(!columns.includes(name)) throw Error('Required columns: server,day,used_gb,capacity_gb');
    const groups = new Map();
    for (let i=1;i<lines.length;i++) {
      const cells=lines[i].split(',').map(s=>s.trim());
      if(cells.length!==columns.length) throw Error(`Row ${i+1}: wrong column count. Quoted commas are not supported.`);
      const row=Object.fromEntries(columns.map((c,j)=>[c,cells[j]]));
      if(!row.day || !row.used_gb || !row.capacity_gb) throw Error(`Row ${i+1}: missing numeric value.`);
      const day=Number(row.day),used=Number(row.used_gb),capacity=Number(row.capacity_gb);
      if(!row.server || row.server.length>64 || ![day,used,capacity].every(Number.isFinite)||day<0||capacity<=0||used<0||used>capacity)throw Error(`Row ${i+1}: invalid values.`);
      if(!groups.has(row.server))groups.set(row.server,{id:'import-'+groups.size,name:row.server,role:'Imported telemetry',location:'LOCAL CSV',capacity,color:['#ffb454','#8b9dff','#4ac8b0'][groups.size%3],source:'Imported',points:[]});
      const s=groups.get(row.server);
      if(s.capacity!==capacity)throw Error(`Row ${i+1}: changing capacity needs a separate series.`);
      if(s.points.some(p=>p.day===day))throw Error(`Row ${i+1}: duplicate observation time.`);
      s.points.push({day,used});
    }
    if(groups.size>12)throw Error('Import up to 12 servers at once.');
    const servers=[...groups.values()];
    for(const s of servers){s.points.sort((a,b)=>a.day-b.day);if(s.points.length<3)throw Error(`${s.name} needs at least 3 observations.`);if(s.points.length>10000)throw Error('Maximum 10,000 observations per server.');}
    return servers;
  }
  function toCSV(servers) { return 'server,day,used_gb,capacity_gb\n'+servers.flatMap(s=>s.points.map(p=>[s.name.replace(/[,\r\n]/g,' '),p.day,p.used,s.capacity].join(','))).join('\n'); }
  const tools = {
    compare_servers(servers,{threshold=90}) {return servers.map(s=>({server:s.name,days:runway(s,threshold),threshold})).sort((a,b)=>(a.days??Infinity)-(b.days??Infinity));},
    forecast_threshold(servers,{server,threshold=90}) {const s=servers.find(s=>s.id===server);return {server:s.name,threshold,days:runway(s,threshold),growthGB:fit(s.points).slope};},
    plan_capacity(servers,{server,horizon=90,target=80}) {const s=servers.find(s=>s.id===server),projected=forecastValue(s,horizon);return {server:s.name,horizon,target,additionalGB:Math.ceil(Math.max(0,projected/(target/100)-s.capacity)),projectedGB:projected};},
    evaluate_model(servers,{server}) {const s=servers.find(s=>s.id===server);return {server:s.name,...evaluate(s.points)};}
  };
  function advise(servers,question,selected) {
    const q=question.toLowerCase(), server=servers.find(s=>q.includes(s.name.toLowerCase()))||servers.find(s=>s.id===selected)||servers[0];
    let name,args;
    if(/first|compare|rank|urgent/.test(q)){name='compare_servers';args={threshold:Number(q.match(/(\d+)\s*%/)?.[1]||90)};}
    else if(/accur|error|model|mae|rmse/.test(q)){name='evaluate_model';args={server:server.id};}
    else if(/add|expand|capacity|upgrade/.test(q)){name='plan_capacity';args={server:server.id,horizon:90,target:80};}
    else if(/when|reach|hit|runway|fill/.test(q)){name='forecast_threshold';args={server:server.id,threshold:Number(q.match(/(\d+)\s*%/)?.[1]||90)};}
    else return {error:'Try “Which server reaches 90% first?”, “When does Atlas reach 90%?”, “How much capacity should I add to Atlas?” or “How accurate is the Atlas model?”'};
    if(args.threshold!==undefined&&(args.threshold<=0||args.threshold>100))return {error:'Choose a threshold between 1% and 100%.'};
    return {name,args,result:tools[name](servers,args)};
  }
  const api={fit,predict,interval,evaluate,runway,analyze,forecastValue,makeDemo,parseCSV,toCSV,advise,tools};
  if(typeof module!=='undefined')module.exports=api; else root.Capacity=api;
})(globalThis);
