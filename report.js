(function(){
var R=window.RP,L=R.L,names={hr:'Hrvatski',en:'English',de:'Deutsch',pl:'Polski',it:'Italiano',fr:'Français'};
var $=function(i){return document.getElementById(i)},cur='hr',S={step:'dev',dev:null,sub:null,box:null,vac:'',prob:'',note:'',busy:false,err:''},t0=Date.now();
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
 boxes:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="14" width="36" height="26" rx="3" fill="#4a4a4a"/><path d="M6 14l6-8h24l6 8z" fill="#f28200"/><path d="M24 20c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12z" fill="#3aa0f0"/></svg>',
 vacuum:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 8h10v22a8 8 0 1 0 8 8h-4a4 4 0 1 1-4-4V8" fill="none" stroke="#4a4a4a" stroke-width="4" stroke-linejoin="round"/><rect x="26" y="34" width="16" height="9" rx="3" fill="#f28200"/></svg>',
 cloths:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="12" width="32" height="24" rx="3" fill="#f1efe9" stroke="#4a4a4a" stroke-width="3"/><path d="M14 20h20M14 26h20M14 32h14" stroke="#bdb9ac" stroke-width="2.5"/></svg>',
 other:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="12" cy="24" r="4.5" fill="#4a4a4a"/><circle cx="24" cy="24" r="4.5" fill="#f28200"/><circle cx="36" cy="24" r="4.5" fill="#4a4a4a"/></svg>'};

function boxArt(){var n=S.box?S.box:'?';
 return '<svg class="bx-art" viewBox="0 0 300 170" role="img" aria-label="BOX '+n+'"><defs><clipPath id="bxc"><rect width="300" height="170" rx="14"/></clipPath></defs><g clip-path="url(#bxc)">'+
 '<rect width="300" height="170" fill="#eceae6"/><rect width="300" height="22" fill="#6c7480"/><rect y="22" width="300" height="5" fill="#b9bcc2"/><rect y="132" width="300" height="38" fill="#8d8d8a"/><rect y="128" width="300" height="6" fill="#c9c7c1"/>'+
 '<rect x="12" y="34" width="10" height="100" fill="#a9a7a1"/>'+
 '<rect x="128" y="64" width="30" height="72" fill="#a7a7a2"/><rect x="128" y="64" width="8" height="72" fill="#8e8e89"/><rect x="118" y="124" width="50" height="10" rx="2" fill="#888"/>'+
 '<rect x="112" y="36" width="62" height="38" rx="4" fill="#f2c200" stroke="#b78f00" stroke-width="2"/><rect x="112" y="36" width="9" height="38" rx="3" fill="#2b2b2b"/>'+
 '<circle cx="132" cy="48" r="4" fill="#fff"/><circle cx="146" cy="48" r="4" fill="#fff"/><circle cx="160" cy="48" r="4" fill="#fff"/><rect x="128" y="58" width="36" height="9" fill="#b80000"/>'+
 '<circle class="bx-lamp" cx="143" cy="29" r="7" fill="#ff2a1f"/><circle class="bx-lampH" cx="143" cy="29" r="7" fill="none" stroke="#ff2a1f" stroke-width="3"/>'+
 '<g class="bx-hoseL"><path d="M112 58C84 58 66 76 62 100S56 124 52 130" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/><rect x="46" y="126" width="12" height="9" rx="3" fill="#f28200"/></g>'+
 '<path d="M174 54C204 54 224 66 232 92" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/><g transform="translate(232 92)"><rect x="-4" y="0" width="8" height="30" rx="3" fill="#cfcfcf" transform="rotate(-8)"/><rect x="-6" y="26" width="12" height="9" rx="3" fill="#f28200" transform="rotate(-8)"/></g>'+
 '<path class="bx-spray" d="M228 128v12M234 128v16M240 128v10" stroke="#3aa0f0" stroke-width="3" stroke-linecap="round"/>'+
 '<rect x="200" y="4" width="88" height="30" rx="6" fill="#f28200" stroke="#303030" stroke-width="2"/><text x="244" y="26" text-anchor="middle" font-family="Montserrat,Barlow,sans-serif" font-weight="900" font-size="19" fill="#303030">BOX '+n+'</text>'+
 '</g></svg>'}
function head(){$('title').textContent=u('title');$('hint').textContent=u('sub');$('homeLink').textContent=u('home');document.title=u('title')+' | Car Wash';document.documentElement.lang=cur;
  [].forEach.call($('langs').children,function(b){b.setAttribute('aria-pressed',b.dataset.l===cur)});
  $('homeLink').href=$('homeLogo').href='index.html#'+cur}
function render(){head();var h='';
 if(S.step==='dev'){
  h='<h2>'+esc(u('q1'))+'</h2><div class="rp-grid">'+['changer','boxes','vacuum','cloths','other'].map(function(k){return '<button class="rp-big" data-dev="'+k+'">'+ICON[k]+'<span>'+esc(lab('dev',k))+'</span></button>'}).join('')+'</div>'}
 else if(S.step==='form'){
  h='<div class="rp-top"><span class="rp-chip">'+ICON[S.dev]+esc(lab('dev',S.dev))+'</span><button class="rp-link" data-act="change">'+esc(u('change'))+'</button></div>';
  if(S.dev==='other'){h+='<h2>'+esc(u('which'))+'</h2><div class="rp-sub">'+['gloss','scent','carpet','deep'].map(function(k){return '<button class="rp-opt" data-sub="'+k+'" aria-pressed="'+(S.sub===k)+'">'+esc(lab('dev',k))+'</button>'}).join('')+'</div>'}
  if(S.dev==='boxes'){h+=boxArt()+'<h2>'+esc(u('boxNo'))+'</h2><div class="rp-nums">'+[1,2,3,4,5,6,7,8,9].map(function(n){return '<button class="rp-num" data-box="'+n+'" aria-pressed="'+(S.box==n)+'">'+n+'</button>'}).join('')+'</div>'}
  if(S.dev==='vacuum'){h+='<h2>'+esc(u('vacNo'))+'</h2><div class="rp-nums">'+[1,2,3,4,5,6,7,8,9,10].map(function(n){return '<button class="rp-num" data-vac="'+n+'" aria-pressed="'+(S.vac==n)+'">'+n+'</button>'}).join('')+'</div>'}
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
 $('rp').innerHTML=h;if(S.step!=='dev')window.scrollTo({top:0})}
function send(){
 var last=+store('rpLast')||0;if(Date.now()-last<60000){S.err=u('wait');render();return}
 var hr='hr',msg='Uređaj: '+devLabel(hr)+'\nProblem: '+lab('p',S.prob,hr)+(S.note?'\nNapomena: '+S.note:'')+'\nJezik prijavitelja: '+cur+'\nVrijeme: '+new Date().toLocaleString('hr-HR',{timeZone:'Europe/Zagreb'});
 S.busy=true;S.err='';render();
 var done=function(ok){S.busy=false;if(ok){store('rpLast',Date.now());S.step='sent'}else S.err=u('err')+(S.errCode||'');render()};
 if(location.hash==='#test'||location.search==='?test'){setTimeout(function(){done(true)},600);return}
 var base={topic:R.NTFY_TOPIC,title:'KVAR: '+devLabel(hr),message:msg,priority:4,tags:['rotating_light']},
  withMail=JSON.stringify(Object.assign({email:R.NOTIFY_EMAIL},base)),pushOnly=JSON.stringify(base),code='';
 function post(b,o){var ctl=window.AbortController?new AbortController():null,to=setTimeout(function(){ctl&&ctl.abort()},12000);
  return fetch('https://ntfy.sh',Object.assign({method:'POST',body:b,signal:ctl?ctl.signal:undefined},o||{})).then(function(r){clearTimeout(to);return r},function(x){clearTimeout(to);throw x})}
 post(withMail).then(function(r){if(r.ok)return true;code=' [HTTP '+r.status+']';return post(pushOnly).then(function(r2){if(r2.ok)return true;code=' [HTTP '+r2.status+']';return false})})
 .catch(function(){code=' [network]';return post(pushOnly,{mode:'no-cors'}).then(function(){return true},function(){return false})})
 .then(function(ok){if(!ok)S.errCode=code;done(ok)})}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
 if(t.dataset.dev){S.dev=t.dataset.dev;S.sub=S.box=null;S.vac=S.prob=S.note='';S.step='form';render();return}
 if(t.dataset.sub){S.sub=t.dataset.sub;S.prob='';render();return}
 if(t.dataset.box){S.box=t.dataset.box;render();return}
 if(t.dataset.vac){S.vac=t.dataset.vac;render();return}
 var a=t.dataset.act;
 if(a==='change'){S.step='dev';render()}
 else if(a==='review'&&ready()){var hp=$('hp');if(hp&&hp.value)return;if(Date.now()-t0<2500)return;S.step='confirm';S.err='';render()}
 else if(a==='back'){S.step='form';S.err='';render()}
 else if(a==='confirm'&&!S.busy){send()}});
document.addEventListener('change',function(e){var t=e.target;
 if(t.id==='prob'){S.prob=t.value;var b=document.querySelector('.rp-go');if(b)b.disabled=!ready()}
});
document.addEventListener('input',function(e){if(e.target.id==='note')S.note=e.target.value});
L.forEach(function(c){var b=document.createElement('button');b.textContent=names[c];b.dataset.l=c;b.lang=c;b.onclick=function(){cur=c;store('lang',c);try{history.replaceState(null,'','#'+c)}catch(e){}render()};$('langs').appendChild(b)});
cur=detect();render();
})();
