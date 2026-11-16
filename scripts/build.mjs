import fs from 'node:fs';
const html=fs.readFileSync('dist/index.html','utf8');
const standalone=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync('dist/style.css','utf8')+'</style>').replace('<script src="engine.js"></script>',()=>'<script>'+fs.readFileSync('dist/engine.js','utf8')+'</script>').replace('<script src="app.js"></script>',()=>'<script>'+fs.readFileSync('dist/app.js','utf8')+'</script>');
fs.writeFileSync('dist/STRATA-Offline.html',standalone);
console.log('Built self-contained offline application.');
