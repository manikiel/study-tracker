const CACHE='study-v6';
const ASSETS=['./','./index.html','./style.css?v=6','./app.js?v=6','./core.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(path=>new Request(new URL(path,self.location.href),{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('study-')&&k!==CACHE).map(k=>caches.delete(k)))).then(async()=>{await self.clients.claim();const windows=await self.clients.matchAll({type:'window'});await Promise.all(windows.map(client=>client.navigate(client.url).catch(()=>{})));}));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));return;}
e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));});
