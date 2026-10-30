import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const f of ['index.html','app.js','core.js','style.css','sw.js','manifest.webmanifest'])await copyFile(f,`dist/${f}`);
await cp('icons','dist/icons',{recursive:true});
console.log('Static app built in dist/');
