(function(){
var R=window.RP,LOC=window.LOC,L=R.L,names={hr:'Hrvatski',en:'English',de:'Deutsch',pl:'Polski',it:'Italiano',fr:'Français'};
var $=function(i){return document.getElementById(i)},cur='hr',S={locked:false,step:'dev',dev:null,sub:null,box:null,vac:'',prob:'',note:'',busy:false,err:'',zone:null,fromMap:false},t0=Date.now();
function store(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function u(k){return R.ui[k][cur]}
function detect(){var h=location.hash.slice(1);if(names[h])return h;var s=store('lang');if(names[s])return s;
  var n=(navigator.languages||[navigator.language||'en']).map(function(l){return l.slice(0,2).toLowerCase()});
  for(var i=0;i<n.length;i++)if(names[n[i]])return n[i];return 'en'}
function lab(group,key,lang){return R[group][key][lang||cur]}
function devKey(){return S.dev==='other'?S.sub:S.dev}
function flat(dev){var p=R.probs[dev];if(Array.isArray(p))return p;return p.tech.concat(p.mech)}
function devLabel(lang){var l=lab('dev',S.dev,lang);if(S.dev==='other')l+=' – '+lab('dev',S.sub,lang);
  if(S.dev==='boxes'&&S.box)l+=' '+S.box;if(S.dev==='vacuum'&&S.vac)l+=' '+S.vac;return l}
function ready(){if(!S.dev||!S.prob)return false;if((S.dev==='boxes'&&!S.box)||(S.dev==='vacuum'&&!S.vac))return false;if(S.dev==='other'&&!S.sub)return false;return true}
var ICON={
 changer:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="6" width="32" height="36" rx="5" fill="#4a4a4a"/><rect x="13" y="11" width="22" height="9" fill="#b80000"/><rect x="13" y="25" width="22" height="4" rx="2" fill="#111"/><circle cx="24" cy="36" r="3.5" fill="#f28200"/></svg>',
 boxes:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="42.5" width="28" height="3.5" rx="1" fill="#8c8a84"/><rect x="17" y="22" width="14" height="21" fill="#aaa69d"/><rect x="17" y="22" width="4" height="21" fill="#8f8b83"/><path d="M31 38c6-1 9-6 9-12" fill="none" stroke="#9aa0a6" stroke-width="2" stroke-linecap="round"/><rect x="6" y="6" width="36" height="17" rx="1.5" fill="#e6c75e" stroke="#b39a30" stroke-width="1.2"/><rect x="6" y="6" width="4.5" height="17" rx="1.5" fill="#2b2f3a"/><circle class="vc-lamp" cx="16" cy="12" r="2" fill="#e5171a"/><rect x="22" y="10.5" width="13" height="2" fill="#5b4a14" opacity=".8"/><rect x="22" y="15" width="13" height="2" fill="#5b4a14" opacity=".8"/><rect x="26" y="19" width="6" height="1.6" fill="#2b2f3a"/></svg>',
 vacuum:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="2" width="24" height="44" rx="2.5" fill="#aeb2b7"/><rect x="8" y="6" width="18" height="37" fill="#dba51f"/><path d="M8 6h18v6C20 10 13 11 8 15z" fill="#efc24d" opacity=".55"/><rect x="10" y="9" width="5.5" height="10" rx="1" fill="#f7f4e2"/><rect x="12" y="11" width="1.6" height="4" fill="#333"/><rect x="17" y="14.5" width="7" height="3.4" fill="#e0456d" stroke="#d8d8d8" stroke-width=".8"/><circle class="vc-lamp" cx="21" cy="10" r="1.9" fill="#e5171a"/><path d="M12 40l1.6-6c2-5.5 7-9.5 12-12" fill="none" stroke="#1d1d1d" stroke-width="3.2" stroke-linecap="round"/><path d="M10.5 41.5l3-6.5 3 1.5-2.2 6z" fill="#111"/><rect x="31" y="3" width="2" height="41" fill="#b9bcc2"/><g class="vc-hose"><path d="M33 12c8-1 12 7 8 14-2.5 4.5-6.5 4-5 10 1 4 5 5 3 9" fill="none" stroke="#1f9bb3" stroke-width="3.8" stroke-linecap="round"/><path d="M33 12c8-1 12 7 8 14-2.5 4.5-6.5 4-5 10 1 4 5 5 3 9" fill="none" stroke="#0f6f84" stroke-width="3.8" stroke-linecap="round" stroke-dasharray="1 2.2" opacity=".55"/></g></svg>',
 gloss:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="22" cy="26" r="18" fill="#2b2b2b"/><circle cx="22" cy="26" r="11" fill="#cfd3d6"/><circle cx="22" cy="26" r="4" fill="#8f969b"/><path d="M22 15v22M11 26h22M14.2 18.2l15.6 15.6M29.8 18.2L14.2 33.8" stroke="#9aa0a6" stroke-width="2"/><path class="vc-lamp" d="M38 4l1.8 4.6 4.6 1.8-4.6 1.8L38 16.8l-1.8-4.6-4.6-1.8 4.6-1.8z" fill="#f28200"/></svg>',
 cloths:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="12" width="32" height="24" rx="3" fill="#f1efe9" stroke="#4a4a4a" stroke-width="3"/><path d="M14 20h20M14 26h20M14 32h14" stroke="#bdb9ac" stroke-width="2.5"/></svg>',
 other:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="12" cy="24" r="4.5" fill="#4a4a4a"/><circle cx="24" cy="24" r="4.5" fill="#f28200"/><circle cx="36" cy="24" r="4.5" fill="#4a4a4a"/></svg>'};

function boxArt(){var n=S.box?S.box:'?';
 return '<svg class="bx-art" viewBox="0 0 300 170" role="img" aria-label="BOX '+n+'"><defs><clipPath id="bxc"><rect width="300" height="170" rx="14"/></clipPath></defs><g clip-path="url(#bxc)">'+
 '<rect width="300" height="170" fill="#eceae6"/><rect width="300" height="22" fill="#6c7480"/><rect y="22" width="300" height="5" fill="#b9bcc2"/><rect y="132" width="300" height="38" fill="#8d8d8a"/><rect y="128" width="300" height="6" fill="#c9c7c1"/>'+
 '<rect x="12" y="34" width="10" height="100" fill="#a9a7a1"/>'+
 '<rect x="106" y="128" width="74" height="9" rx="2" fill="#8a8780"/><rect x="124" y="72" width="38" height="58" fill="#aaa69d"/><rect x="124" y="72" width="9" height="58" fill="#8f8b83"/>'+
 '<rect x="102" y="30" width="86" height="44" rx="3" fill="#e6c75e" stroke="#b39a30" stroke-width="2"/><rect x="102" y="30" width="11" height="44" rx="3" fill="#2b2f3a"/>'+
 '<circle class="bx-lamp" cx="126" cy="43" r="5" fill="#ff2a1f"/><circle class="bx-lampH" cx="126" cy="43" r="5" fill="none" stroke="#ff2a1f" stroke-width="3"/>'+
 '<rect x="140" y="38" width="38" height="5" fill="#5b4a14" opacity=".8"/><rect x="140" y="50" width="38" height="5" fill="#5b4a14" opacity=".8"/><rect x="152" y="62" width="16" height="4" fill="#2b2f3a"/>'+
 '<g class="bx-hoseL"><path d="M102 62C76 64 60 80 58 102S54 124 52 130" fill="none" stroke="#2b2f3a" stroke-width="5" stroke-linecap="round"/><rect x="46" y="126" width="12" height="9" rx="3" fill="#f28200"/></g>'+
 '<path d="M188 58C212 58 228 70 236 94" fill="none" stroke="#2b2f3a" stroke-width="5" stroke-linecap="round"/><g transform="translate(236 94)"><rect x="-4" y="0" width="8" height="30" rx="3" fill="#cfcfcf" transform="rotate(-8)"/><rect x="-6" y="26" width="12" height="9" rx="3" fill="#f28200" transform="rotate(-8)"/></g>'+
 '<path class="bx-spray" d="M228 128v12M234 128v16M240 128v10" stroke="#3aa0f0" stroke-width="3" stroke-linecap="round"/>'+
 '<rect x="200" y="4" width="88" height="30" rx="6" fill="#f28200" stroke="#303030" stroke-width="2"/><text x="244" y="26" text-anchor="middle" font-family="Montserrat,Barlow,sans-serif" font-weight="900" font-size="19" fill="#303030">BOX '+n+'</text>'+
 '</g></svg>'}
function zl(z,lang){return R.map.zones[z].t[lang||cur].split('~')}
function mapSVG(){var M=R.map,g='',pl='';
 Object.keys(M.zones).forEach(function(k){var z=M.zones[k],ls=zl(k),pts=z.pts.map(function(p){return p.join(',')}).join(' ');
  g+='<g class="mz-g'+(S.zone===k?' on':'')+'" data-zone="'+k+'" role="button" tabindex="0" aria-pressed="'+(S.zone===k)+'" aria-label="'+esc(ls.join(' '))+'">'+
   '<polygon class="mz" points="'+pts+'" fill="'+z.col+'" stroke="'+z.col+'"/></g>';
  pl+='<g class="mp" data-zone="'+k+'" aria-hidden="true" data-x="'+z.at[0]+'" data-y="'+z.at[1]+'" transform="translate('+z.at[0]+' '+z.at[1]+')"><rect rx="12" fill="'+z.pill+'"/><text text-anchor="middle">'+
   ls.map(function(s,i){return '<tspan x="0" dy="'+(i?'30':(-(ls.length-1)*15+9))+'">'+esc(s)+'</tspan>'}).join('')+'</text></g>'});
 return '<div class="rp-map'+(S.zone?' has-sel':'')+'"><svg viewBox="0 0 '+M.w+' '+M.h+'" role="group" aria-label="'+esc(u('mapAria'))+'"><image href="'+M.img+'" width="'+M.w+'" height="'+M.h+'"/>'+g+pl+'</svg></div>'}
function fitPills(){var M=R.map;[].forEach.call(document.querySelectorAll('.rp-map .mp'),function(g){var t=g.querySelector('text'),r=g.querySelector('rect'),b;
  try{b=t.getBBox()}catch(e){return}if(!b.width)return;var w=b.width+26,h=b.height+14,x=+g.dataset.x,y=+g.dataset.y;
  r.setAttribute('x',b.x-13);r.setAttribute('y',b.y-7);r.setAttribute('width',w);r.setAttribute('height',h);
  x=Math.max(w/2+6,Math.min(M.w-w/2-6,x));g.setAttribute('transform','translate('+x+' '+y+')')})}
function zonePanel(){var k=S.zone;if(!k)return '<p class="rp-s rp-maphint">'+esc(u('mapSub'))+'</p>';
 var z=R.map.zones[k],h='<div class="rp-pick" id="mpick" style="--zc:'+z.pill+'"><h3><i></i>'+esc(zl(k).join(' '))+'</h3><p class="rp-s">'+esc(u('mapPick'))+'</p>';
 if(z.box)h+='<div class="rp-pg">'+esc(lab('dev','boxes'))+'</div><div class="rp-nums">'+z.box.map(function(n){return '<button class="rp-num" data-pick="box:'+n+'">'+n+'</button>'}).join('')+'</div>';
 if(z.vac)h+='<div class="rp-pg">'+esc(lab('dev','vacuum'))+'</div><div class="rp-nums" style="grid-template-columns:repeat('+Math.min(z.vac.length,5)+',1fr)">'+z.vac.map(function(n){return '<button class="rp-num" data-pick="vac:'+n+'">'+n+'</button>'}).join('')+'</div>';
 if(z.other)h+='<div class="rp-pg">'+esc(lab('dev','other'))+'</div><div class="rp-sub">'+z.other.map(function(s){return '<button class="rp-opt" data-pick="sub:'+s+'">'+esc(lab('dev',s))+'</button>'}).join('')+'</div>';
 return h+'</div>'}
function pick(v){var a=v.split(':'),k=a[0],x=a[1];S.locked=false;S.fromMap=true;S.sub=S.box=null;S.vac=S.prob=S.note='';
 if(k==='box'){S.dev='boxes';S.box=x}else if(k==='vac'){S.dev='vacuum';S.vac=x}else{S.dev='other';S.sub=x}
 S.step='form';render()}
function pickZone(k){S.zone=k;render(true);var p=$('mpick');if(p&&p.scrollIntoView){var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;p.scrollIntoView({behavior:rm?'auto':'smooth',block:'nearest'})}}
function vacArt(){var n=S.vac?S.vac:'?',hp='M168 76C206 70 216 106 198 128C187 142 170 134 177 118';
 return '<svg class="bx-art" viewBox="0 0 300 170" role="img" aria-label="'+esc(lab('dev','vacuum'))+' '+n+'"><defs><clipPath id="vcc"><rect width="300" height="170" rx="14"/></clipPath><linearGradient id="vcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecc04a"/><stop offset="1" stop-color="#c9921a"/></linearGradient></defs><g clip-path="url(#vcc)">'+
 '<rect width="300" height="170" fill="#eceae6"/><rect y="146" width="300" height="24" fill="#8d8d8a"/><rect y="142" width="300" height="6" fill="#c9c7c1"/>'+
 '<g transform="translate(2 0)"><rect x="70" y="8" width="80" height="140" rx="4" fill="#aeb2b7"/><rect x="80" y="19" width="60" height="124" fill="url(#vcg)"/><rect x="140" y="19" width="5" height="124" fill="#4a4a4a"/>'+
 '<rect x="86" y="28" width="19" height="36" rx="2" fill="#f7f4e2" opacity=".92"/><rect x="92" y="33" width="6" height="16" rx="1" fill="#333"/><rect x="90" y="52" width="10" height="6" fill="#222"/>'+
 '<circle class="bx-lamp" cx="120" cy="34" r="6" fill="#ff2a1f"/><circle class="bx-lampH" cx="120" cy="34" r="6" fill="none" stroke="#ff2a1f" stroke-width="3"/><text x="128" y="38" font-size="6.5" font-weight="800" fill="#6b4d00" text-anchor="start" font-family="Barlow,sans-serif">TEST</text>'+
 '<rect x="110" y="46" width="26" height="12" fill="#ddd" stroke="#999" stroke-width="1"/><rect x="113" y="49" width="20" height="6" fill="#e0456d"/>'+
 '<text transform="translate(95 117) rotate(-90)" font-size="13" font-weight="800" fill="#fff" textLength="52" lengthAdjust="spacingAndGlyphs" font-family="Barlow Condensed,Barlow,sans-serif">USISAVAČ</text>'+
 '<path d="M106 138C110 114 124 94 138 82" fill="none" stroke="#1d1d1d" stroke-width="10" stroke-linecap="round"/><path d="M97 140l14-22 9 6-10 24z" fill="#111"/>'+
 '<rect x="158" y="8" width="7" height="140" fill="#b9bcc2"/><rect x="150" y="72" width="44" height="5" rx="2" fill="#c9c7c1"/>'+
 '<g class="vc-hose"><path d="'+hp+'" fill="none" stroke="#1f9bb3" stroke-width="10" stroke-linecap="round"/><path d="'+hp+'" fill="none" stroke="#0f6f84" stroke-width="10" stroke-linecap="round" stroke-dasharray="2 5" opacity=".55"/></g></g>'+
 '<rect x="204" y="6" width="90" height="30" rx="6" fill="#f28200" stroke="#303030" stroke-width="2"/><text x="249" y="27" text-anchor="middle" font-family="Montserrat,Barlow,sans-serif" font-weight="900" font-size="14" fill="#303030" textLength="72" lengthAdjust="spacingAndGlyphs">USISAVAČ '+n+'</text>'+
 '</g></svg>'}
function has(d){return LOC.reportDevs.indexOf(d)>-1}
function nums(n){var a=[];for(var i=1;i<=n;i++)a.push(i);return a}
function numStyle(n){return n<5?' style="grid-template-columns:repeat('+n+',1fr)"':''}
function preset(){var m=/[?&]d=([a-z0-9]+)/.exec(location.search);if(!m)return;var k=m[1],x;
 if(k==='changer'||(k==='cloths'&&has('cloths'))){S.dev=k}
 else if((x=/^box([1-9])$/.exec(k))&&+x[1]<=LOC.boxes){S.dev='boxes';S.box=x[1]}
 else if((x=/^vac(10|[1-9])$/.exec(k))&&+x[1]<=LOC.vacs){S.dev='vacuum';S.vac=x[1]}
 else if(k==='gloss'&&!has('other')){S.dev='gloss'}
 else if(has('other')&&(k==='gloss'||k==='scent'||k==='carpet'||k==='deep')){S.dev='other';S.sub=k}
 else return;S.locked=true;S.step='form'}
function head(){$('title').textContent=u('title');$('hint').textContent=u('sub');$('homeLink').textContent=u('home');document.title=u('title')+' | Car Wash'+(LOC.name?' '+LOC.name:'');var lt=$('locTag');if(lt){lt.textContent=LOC.name||'';lt.hidden=!LOC.name};document.documentElement.lang=cur;
  [].forEach.call($('langs').children,function(b){b.setAttribute('aria-pressed',b.dataset.l===cur)});
  $('homeLink').href=$('homeLogo').href='index.html#'+cur}
function render(keep){head();var h='';
 if(S.step==='dev'){
  h='<h2>'+esc(u('q1'))+'</h2><div class="rp-grid">'+LOC.reportDevs.map(function(k){return '<button class="rp-big" data-dev="'+k+'">'+ICON[k]+'<span>'+esc(lab('dev',k))+'</span></button>'}).join('')+'</div>'+(LOC.map?
   '<div class="rp-or"><span>'+esc(u('mapOr'))+'</span></div><button class="rp-mapbtn" data-act="map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z" fill="#d10000"/><circle cx="12" cy="9" r="2.8" fill="#fff"/></svg><span>'+esc(u('mapBtn'))+'</span></button>':'')}
 else if(S.step==='map'&&LOC.map){
  h='<h2>'+esc(u('mapTitle'))+'</h2>'+mapSVG()+zonePanel()+'<button class="rp-back" data-act="list">'+esc(u('mapList'))+'</button>'}
 else if(S.step==='form'){
  h='<div class="rp-top"><span class="rp-chip">'+ICON[S.dev]+esc(S.locked?devLabel():lab('dev',S.dev))+'</span><button class="rp-link" data-act="change">'+esc(u('change'))+'</button></div>';
  if(S.dev==='other'&&!S.locked){h+='<h2>'+esc(u('which'))+'</h2><div class="rp-sub">'+['gloss','scent','carpet','deep'].map(function(k){return '<button class="rp-opt" data-sub="'+k+'" aria-pressed="'+(S.sub===k)+'">'+esc(lab('dev',k))+'</button>'}).join('')+'</div>'}
  if(S.dev==='boxes'){h+=boxArt()}
  if(S.dev==='vacuum'){h+=vacArt()}
  if(S.dev==='boxes'&&!S.locked){h+='<h2>'+esc(u('boxNo'))+'</h2><div class="rp-nums"'+numStyle(LOC.boxes)+'>'+nums(LOC.boxes).map(function(n){return '<button class="rp-num" data-box="'+n+'" aria-pressed="'+(S.box==n)+'">'+n+'</button>'}).join('')+'</div>'}
  if(S.dev==='vacuum'&&!S.locked){h+='<h2>'+esc(u('vacNo'))+'</h2><div class="rp-nums"'+numStyle(LOC.vacs)+'>'+nums(LOC.vacs).map(function(n){return '<button class="rp-num" data-vac="'+n+'" aria-pressed="'+(S.vac==n)+'">'+n+'</button>'}).join('')+'</div>'}
  var dk=devKey(),opts='';
  if(S.dev!=='other'||S.sub){
   var P=R.probs[S.dev==='other'?'other':S.dev],opt=function(k){return '<option value="'+k+'"'+(S.prob===k?' selected':'')+'>'+esc(lab('p',k))+'</option>'};
   if(Array.isArray(P))opts=P.map(opt).join('');else opts='<optgroup label="'+esc(lab('grp','tech'))+'">'+P.tech.map(opt).join('')+'</optgroup><optgroup label="'+esc(lab('grp','mech'))+'">'+P.mech.map(opt).join('')+'</optgroup>';
   h+='<label class="rp-l" for="prob">'+esc(u('problem'))+'</label><select id="prob"><option value="">'+esc(u('choose'))+'</option>'+opts+'</select>'+
    '<label class="rp-l" for="note">'+esc(u('note'))+'</label><textarea id="note" rows="3" maxlength="300">'+esc(S.note)+'</textarea>'+
    '<input class="hp" type="text" id="hp" tabindex="-1" autocomplete="off" aria-hidden="true">'}
  h+='<button class="rp-go" data-act="review"'+(ready()?'':' disabled')+'>'+esc(u('send'))+'</button>'}
 else if(S.step==='confirm'){
  h='<h2>'+esc(u('check'))+'</h2><p class="rp-s">'+esc(u('checkS'))+'</p><dl class="rp-sum"><dt>'+esc(u('device'))+'</dt><dd>'+esc(devLabel())+'</dd><dt>'+esc(u('prob'))+'</dt><dd>'+esc(lab('p',S.prob))+'</dd>'+(S.note?'<dt>'+esc(u('note').replace(/\s*\(.*\)/,''))+'</dt><dd>'+esc(S.note)+'</dd>':'')+'</dl>'+
   (S.err?'<p class="rp-err" role="alert">'+esc(S.err)+'</p>':'')+
   '<button class="rp-go rp-go--ok" data-act="confirm"'+(S.busy?' disabled':'')+'>'+esc(S.busy?u('sending'):u('confirm'))+'</button><button class="rp-back" data-act="back"'+(S.busy?' disabled':'')+'>'+esc(u('back'))+'</button>'}
 else{h='<div class="rp-thx"><div class="rp-ok" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#2f9e4f"/><path d="M13 25l8 8 15-17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h2>'+esc(u('thanks'))+'</h2><p>'+esc(u('thanksT'))+'</p><p class="rp-test">'+esc(u('test'))+'</p><a class="rp-go" href="index.html#'+cur+'">'+esc(u('home'))+'</a></div>'}
 $('rp').innerHTML=h;if(S.step==='map')fitPills();if(S.step!=='dev'&&!keep)window.scrollTo({top:0})}
function send(){
 var last=+store('rpLast')||0;if(Date.now()-last<60000){S.err=u('wait');render();return}
 var hr='hr',msg=(LOC.name?'Lokacija: '+LOC.name+'\n':'')+'Uređaj: '+devLabel(hr)+'\nProblem: '+lab('p',S.prob,hr)+(S.note?'\nNapomena: '+S.note:'')+'\nJezik prijavitelja: '+cur+'\nVrijeme: '+new Date().toLocaleString('hr-HR',{timeZone:'Europe/Zagreb'});
 S.busy=true;S.err='';render();
 var done=function(ok){S.busy=false;if(ok){store('rpLast',Date.now());S.step='sent'}else S.err=u('err')+(S.errCode||'');render()};
 if(location.hash==='#test'||location.search==='?test'){setTimeout(function(){done(true)},600);return}
 var base={topic:R.NTFY_TOPIC,title:'KVAR'+(LOC.name?' '+LOC.name:'')+': '+devLabel(hr),message:msg,priority:4,tags:['rotating_light']},
  withMail=JSON.stringify(Object.assign({email:R.NOTIFY_EMAIL},base)),pushOnly=JSON.stringify(base),code='';
 function post(b,o){var ctl=window.AbortController?new AbortController():null,to=setTimeout(function(){ctl&&ctl.abort()},12000);
  return fetch('https://ntfy.sh',Object.assign({method:'POST',body:b,signal:ctl?ctl.signal:undefined},o||{})).then(function(r){clearTimeout(to);return r},function(x){clearTimeout(to);throw x})}
 post(withMail).then(function(r){if(r.ok)return true;code=' [HTTP '+r.status+']';return post(pushOnly).then(function(r2){if(r2.ok)return true;code=' [HTTP '+r2.status+']';return false})})
 .catch(function(){code=' [network]';return post(pushOnly,{mode:'no-cors'}).then(function(){return true},function(){return false})})
 .then(function(ok){if(!ok)S.errCode=code;done(ok)})}
document.addEventListener('click',function(e){var zg=e.target.closest?e.target.closest('[data-zone]'):null;if(zg){pickZone(zg.getAttribute('data-zone'));return}
 var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
 if(t.dataset.pick){pick(t.dataset.pick);return}
 if(t.dataset.dev){S.fromMap=false;S.locked=false;S.dev=t.dataset.dev;S.sub=S.box=null;S.vac=S.prob=S.note='';S.step='form';render();return}
 if(t.dataset.sub){S.sub=t.dataset.sub;S.prob='';render();return}
 if(t.dataset.box){S.box=t.dataset.box;render();return}
 if(t.dataset.vac){S.vac=t.dataset.vac;render();return}
 var a=t.dataset.act;
 if(a==='change'){S.locked=false;S.step=S.fromMap?'map':'dev';render()}
 else if(a==='map'){S.step='map';render()}
 else if(a==='list'){S.fromMap=false;S.step='dev';render()}
 else if(a==='review'&&ready()){var hp=$('hp');if(hp&&hp.value)return;if(Date.now()-t0<2500)return;S.step='confirm';S.err='';render()}
 else if(a==='back'){S.step='form';S.err='';render()}
 else if(a==='confirm'&&!S.busy){send()}});
document.addEventListener('change',function(e){var t=e.target;
 if(t.id==='prob'){S.prob=t.value;var b=document.querySelector('.rp-go');if(b)b.disabled=!ready()}
});
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.getAttribute&&e.target.getAttribute('data-zone')){e.preventDefault();pickZone(e.target.getAttribute('data-zone'))}});
document.addEventListener('input',function(e){if(e.target.id==='note')S.note=e.target.value});
L.forEach(function(c){var b=document.createElement('button');b.textContent=names[c];b.dataset.l=c;b.lang=c;b.onclick=function(){cur=c;store('lang',c);try{history.replaceState(null,'','#'+c)}catch(e){}render()};$('langs').appendChild(b)});
cur=detect();preset();render();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(S.step==='map')fitPills()});
})();
