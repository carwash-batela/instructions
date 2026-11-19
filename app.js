(function(){
var D=window.DATA,TF=window.TARIFFS,cur=null,sel=null,credit=0,shown=[null,0,0,0],timers=[];
var FILL={wash:'#d10000',wax:'#ffc400',rinse:'#0a72c8',rim:'#f4f4f4',foam:'#f4f4f4',stop:'#d10000'};
var EDGE={wash:'#c00000',wax:'#d9a300',rinse:'#0070c0',rim:'#4a4a4a',foam:'#e0338f',stop:'#c00000'};
var $=function(i){return document.getElementById(i)},store=function(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}};
var reduce=function(){return matchMedia('(prefers-reduced-motion:reduce)').matches};
var order=['hr','en','de','pl','it','fr'];
var DQ=(function(){var m=/[?&]d=(changer|cloths|gloss|scent|carpet|deep|box[1-9]|vac10|vac[1-9])(?:&|$)/.exec(location.search);return m?m[1]:''})();
var eur=function(c){return (c/100).toFixed(2).replace('.',',')};
var LOC=window.LOC||{id:'main',name:'',panel:'main',programs:null,devices:['vac','gloss','scent','deep','cloths','carpet'],patch:null};
if(LOC.patch)LOC.patch(D,TF);
if(LOC.programs)Object.keys(D).forEach(function(l){D[l].programs=D[l].programs.filter(function(p){return LOC.programs.indexOf(p.id)>-1})});

/* ---------- 7-segment display ---------- */
function hor(y,x0,x1){return [[x0,y],[x0+3.5,y-3.5],[x1-3.5,y-3.5],[x1,y],[x1-3.5,y+3.5],[x0+3.5,y+3.5]].join(' ')}
function ver(x,y0,y1){return [[x,y0],[x+3.5,y0+3.5],[x+3.5,y1-3.5],[x,y1],[x-3.5,y1-3.5],[x-3.5,y0+3.5]].join(' ')}
var SEGP={a:hor(3.5,4,30),g:hor(31,4,30),d:hor(58.5,4,30),f:ver(3.5,6.5,28.5),b:ver(30.5,6.5,28.5),e:ver(3.5,33.5,55.5),c:ver(30.5,33.5,55.5)};
var DIG=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
function digitSVG(i){var x=440+i*70+18,y=172+15,s='';for(var k in SEGP)s+='<polygon class="seg" data-s="'+k+'" points="'+SEGP[k]+'"/>';
  return '<g class="dg" data-i="'+i+'" transform="translate('+x+' '+y+')">'+s+'</g>'}
function paint(i,v){var g=document.querySelector('#mframe .dg[data-i="'+i+'"]');if(!g)return;var on=v===null?'':DIG[v];
  [].forEach.call(g.children,function(p){p.setAttribute('class','seg'+(on.indexOf(p.dataset.s)>-1?' on':''))})}
function digitsOf(c){var e=Math.floor(c/100),t=Math.floor(c%100/10),h=c%10;return [e>=10?Math.floor(e/10):null,e%10,t,h]}
function paintAll(){for(var i=0;i<4;i++)paint(i,shown[i])}
function spin(i,fin,dur){clearInterval(timers[i]);
  if(reduce()||fin===null){shown[i]=fin;paint(i,fin);return}
  var t0=Date.now();timers[i]=setInterval(function(){
    if(Date.now()-t0>=dur){clearInterval(timers[i]);shown[i]=fin;paint(i,fin);return}
    paint(i,Math.floor(Math.random()*10))},55)}
function setCredit(c){credit=Math.max(0,Math.min(9990,c));var t=digitsOf(credit);
  for(var i=0;i<4;i++)spin(i,t[i],380+i*140);
  $('credit').textContent=eur(credit)+' €'}

/* ---------- machine panel ---------- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function txt(s,x,y,size,o){o=o||{};return '<text class="ph'+(o.cls?' '+o.cls:'')+'" x="'+x+'" y="'+y+'" font-size="'+size+'" data-fs="'+size+'"'+
  (o.fit?' data-fit="'+o.fit+'"':'')+(o.anchor?' text-anchor="'+o.anchor+'"':'')+(o.extra||'')+'>'+esc(s)+'</text>'}
var DLY={wash:0,wax:.45,rinse:.9,rim:1.35,foam:1.8,stop:.2};
function btn(id,cx,cy,ring,face,label){
  return '<g class="btn" data-id="'+id+'" role="button" tabindex="0" aria-pressed="false" aria-label="'+esc(label)+'">'+
   '<circle class="pulse" cx="'+cx+'" cy="'+cy+'" r="'+ring+'" style="animation-delay:'+DLY[id]+'s"/>'+
   '<circle class="halo" cx="'+cx+'" cy="'+cy+'" r="'+(ring+8)+'" fill="none" stroke="#fff" stroke-width="6"/>'+
   '<circle class="halo" cx="'+cx+'" cy="'+cy+'" r="'+(ring+14)+'" fill="none" stroke="#0b2a3f" stroke-width="5"/>'+
   '<circle cx="'+cx+'" cy="'+cy+'" r="'+ring+'" fill="url(#ringg)" stroke="#7d8388" stroke-width="2"/>'+
   '<circle class="face" cx="'+cx+'" cy="'+cy+'" r="'+face+'" fill="'+FILL[id]+'" stroke="rgba(0,0,0,.35)" stroke-width="2"/>'+
   '<circle cx="'+cx+'" cy="'+cy+'" r="'+face+'" fill="url(#gloss)"/></g>'}
function machine(d){
  if(LOC.panel==='brda')return machineBrda(d);
  var m=d.m,P=d.programs,lab=function(id){var p=P.filter(function(x){return x.id===id})[0];return p.name+' – '+p.btn};
  var s='<svg viewBox="0 0 1280 860" role="img" aria-label="'+esc(d.alt)+'" xmlns="http://www.w3.org/2000/svg">'+
  '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4b617"/><stop offset=".5" stop-color="#f7d42a"/><stop offset="1" stop-color="#f9e440"/></linearGradient>'+
  '<linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4d8db"/><stop offset="1" stop-color="#8f969b"/></linearGradient>'+
  '<radialGradient id="gloss" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="slit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bdbdbd"/><stop offset="1" stop-color="#6f6f6f"/></linearGradient>'+
  '<clipPath id="plate"><rect width="1280" height="860" rx="26"/></clipPath></defs>'+
  '<g clip-path="url(#plate)"><rect width="1280" height="860" fill="url(#bg)"/>'+
  '<polygon points="0,600 1280,150 1280,330 0,760" fill="#fff" opacity=".16"/>'+
  '<polygon points="0,330 1280,-60 1280,40 0,440" fill="#fff" opacity=".13"/>'+
  '<polygon points="330,860 1280,420 1280,860" fill="#b07a00" opacity=".09"/></g>'+
  '<rect x="1.5" y="1.5" width="1277" height="857" rx="25" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3"/>';

  /* coin values + slot */
  var coins=[['0,10 €',10],['0,20 €',20],['0,50 €',50],['1,00 €',100],['2,00 €',200],[d.token,100]];
  coins.forEach(function(c,i){s+=txt(c[0],254,203+i*33,29,{anchor:'end',fit:150,extra:' data-coin="'+c[1]+'"',cls:'coinv'})});
  s+='<rect x="272" y="168" width="108" height="210" rx="20" fill="#353535"/>'+
     '<rect x="313" y="208" width="26" height="86" rx="5" fill="url(#slit)" transform="rotate(12 326 251)"/>'+
     '<rect x="296" y="334" width="60" height="28" rx="6" fill="#4472c4"/>';
  /* return tray */
  s+='<rect x="285" y="470" width="100" height="160" rx="18" fill="#a6a6a6" stroke="#8c8c8c" stroke-width="2"/>'+
     '<rect x="324" y="500" width="22" height="100" rx="4" fill="#d3d3d3" transform="rotate(8 335 550)"/>';
  /* display */
  s+='<rect x="440" y="172" width="280" height="92" fill="#b80000" stroke="#161616" stroke-width="3"/>';
  for(var i=1;i<4;i++)s+='<line x1="'+(440+i*70)+'" y1="172" x2="'+(440+i*70)+'" y2="264" stroke="#3b0000" stroke-width="3"/>';
  for(i=0;i<4;i++)s+=digitSVG(i);
  s+='<circle class="seg on" cx="571" cy="247" r="4.5"/>';
  /* tire + rim wash */
  s+=txt(m.rim,860,106,34,{anchor:'middle',fit:215});
  s+='<circle cx="860" cy="205" r="80" fill="rgba(255,255,255,.28)" stroke="#111" stroke-width="5"/>'+
     '<circle cx="860" cy="205" r="87" fill="none" stroke="#111" stroke-width="12" stroke-dasharray="7 5"/>'+
     '<circle cx="860" cy="205" r="62" fill="none" stroke="#111" stroke-width="3"/><circle cx="860" cy="205" r="53" fill="none" stroke="#111" stroke-width="2"/>';
  s+=btn('rim',860,205,40,30,lab('rim'));
  /* foam bubbles */
  [[1125,215,78],[1040,150,30],[1190,98,40],[1092,86,24],[1010,104,17],[1228,240,30],[1050,262,36],[1160,60,13]].forEach(function(b){
    s+='<circle cx="'+b[0]+'" cy="'+b[1]+'" r="'+b[2]+'" fill="#e8369a" stroke="#7b1fa2" stroke-width="7"/>'+
       '<ellipse cx="'+(b[0]+b[2]*.38)+'" cy="'+(b[1]-b[2]*.45)+'" rx="'+(b[2]*.22)+'" ry="'+(b[2]*.13)+'" fill="#fff" opacity=".9" transform="rotate(-35 '+(b[0]+b[2]*.38)+' '+(b[1]-b[2]*.45)+')"/>'});
  s+=btn('foam',1125,215,40,30,lab('foam'));
  s+=txt(m.foam[0],1125,354,44,{anchor:'middle',fit:250,cls:'heavy'})+txt(m.foam[1],1125,398,44,{anchor:'middle',fit:240,cls:'heavy'})+
     txt(m.box,1125,440,32,{anchor:'middle',fit:240,cls:'heavy'});
  /* premium / standard frames */
  [['PREMIUM',410],['STANDARD',790]].forEach(function(f){
    s+='<rect x="'+f[1]+'" y="295" width="180" height="470" rx="24" fill="none" stroke="#111" stroke-width="3.5"/>'+
       txt(f[0],f[1]+90,334,37,{anchor:'middle',fit:166,cls:'it'})+txt(d.prog,f[1]+90,361,25,{anchor:'middle',fit:166})});
  /* bars */
  var bars=[[392,84,m.wash,'r'],[512,104,m.wax,'l'],[652,84,m.rinse,'r']];
  bars.forEach(function(b){s+='<rect x="485" y="'+b[0]+'" width="410" height="'+b[1]+'" rx="16" fill="#131313"/>';
    var cy=b[0]+b[1]/2;
    s+= b[3]==='r'? txt(b[2],520,cy+16,47,{fit:258,extra:' fill="#fff"',cls:'wh'}) : txt(b[2],860,cy+16,47,{anchor:'end',fit:250,extra:' fill="#fff"',cls:'wh'})});
  s+=btn('wash',843,434,46,35,lab('wash'))+btn('wax',537,564,46,35,lab('wax'))+btn('rinse',843,694,46,35,lab('rinse'));
  /* numbers */
  [[459,434,1],[459,564,2],[459,694,3],[921,434,1],[921,694,2]].forEach(function(n){
    s+='<circle cx="'+n[0]+'" cy="'+n[1]+'" r="19" fill="#111"/>'+txt(n[2],n[0],n[1]+1,25,{anchor:'middle',extra:' fill="#fff" dominant-baseline="central"',cls:'wh'})});
  /* stop */
  s+=txt(m.stop,1125,688,66,{anchor:'middle',cls:'it heavy',fit:200})+btn('stop',1125,764,48,37,lab('stop'));
  s+='<image href="assets/lavateh.png" x="60" y="772" width="230" height="52"/></svg>';
  return s}

/* ---------- panel lokacije BRDA (slika vrata bez aktivne pjene + tipke) ---------- */
function machineBrda(d){
  var P=d.programs,lab=function(id){var p=P.filter(function(x){return x.id===id})[0];return p.name+' – '+p.btn};
  var s='<svg viewBox="0 0 1180 954" role="img" aria-label="'+esc(d.alt)+'" xmlns="http://www.w3.org/2000/svg">'+
  '<defs><linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4d8db"/><stop offset="1" stop-color="#8f969b"/></linearGradient>'+
  '<radialGradient id="gloss" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="slit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bdbdbd"/><stop offset="1" stop-color="#6f6f6f"/></linearGradient>'+
  '<clipPath id="plate"><rect width="1180" height="954" rx="24"/></clipPath></defs>'+
  '<g clip-path="url(#plate)"><image href="assets/panel-brda.webp" width="1180" height="954"/></g>'+
  '<rect x="1.5" y="1.5" width="1177" height="951" rx="23" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3"/>';
  /* vrijednosti novca + otvor */
  var coins=[['0,10 €',10],['0,20 €',20],['0,50 €',50],['1,00 €',100],['2,00 €',200],[d.token,100]];
  coins.forEach(function(c,i){s+=txt(c[0],228,203+i*23,20,{anchor:'end',fit:128,extra:' data-coin="'+c[1]+'"',cls:'coinv'})});
  s+='<rect x="241" y="159" width="110" height="182" rx="16" fill="#353535"/>'+
     '<rect x="285" y="187" width="22" height="74" rx="5" fill="url(#slit)" transform="rotate(12 296 224)"/>'+
     '<rect x="268" y="298" width="56" height="26" rx="6" fill="#4472c4"/>';
  /* zaslon (7 segmenata) */
  var sc=227/280;
  s+='<g transform="translate('+(455-440*sc).toFixed(2)+' '+(158+(77-92*sc)/2-172*sc).toFixed(2)+') scale('+sc.toFixed(4)+')">'+
     '<rect x="440" y="172" width="280" height="92" fill="#b80000" stroke="#161616" stroke-width="3"/>';
  for(var i=1;i<4;i++)s+='<line x1="'+(440+i*70)+'" y1="172" x2="'+(440+i*70)+'" y2="264" stroke="#3b0000" stroke-width="3"/>';
  for(i=0;i<4;i++)s+=digitSVG(i);
  s+='<circle class="seg on" cx="571" cy="247" r="4.5"/></g>';
  /* nazivi programa (veći i podebljani) */
  s+=txt(d.m.wash,548,430.5,40,{fit:246,extra:' fill="#fff" dominant-baseline="central"',cls:'wh heavy'})+txt(d.m.rinse,548,739.5,40,{fit:246,extra:' fill="#fff" dominant-baseline="central"',cls:'wh heavy'});
  /* tipke */
  s+=btn('rim',838,196,43,33,lab('rim'))+btn('stop',1033,196,43,33,lab('stop'))+
     btn('wash',837.5,429,33,25,lab('wash'))+btn('wax',568,583.5,33,25,lab('wax'))+btn('rinse',837.5,738,33,25,lab('rinse'));
  return s+'</svg>'}

function fit(root){[].forEach.call(root.querySelectorAll('[data-fit]'),function(t){
  var b=+t.dataset.fs;t.setAttribute('font-size',b);var w=t.getComputedTextLength?t.getComputedTextLength():0,mx=+t.dataset.fit;
  if(w>mx)t.setAttribute('font-size',(b*mx/w).toFixed(1))})}


/* ---------- tariff + prices + xml ---------- */
function tariffKey(){var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Zagreb',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),h=0,m=0;
  p.forEach(function(x){if(x.type==='hour')h=+x.value;if(x.type==='minute')m=+x.value});var t=h*60+m;return (t>=TF.normal.from&&t<TF.normal.to)?'normal':'reduced'}
function hm(m){return Math.floor(m/60)+':'+('0'+m%60).slice(-2)}
function renderPrices(){var d=D[cur],pr=d.pr,k=tariffKey(),t=TF[k];
  var h='<h2>'+esc(pr.title)+'</h2><p class="asof">'+esc(pr.asof)+'</p><div class="tarhead"><b>'+esc(pr[k])+'</b><span>'+hm(t.from)+' – '+hm(t.to)+'</span><em>'+esc(pr.now)+'</em></div>';
  TF.order.forEach(function(g){h+='<h3>'+esc(pr.groups[g[0]])+'</h3><ul class="prow">'+g[1].map(function(i){return '<li><span>'+esc(pr.items[i])+'</span><span><b>'+t.s[i]+'</b> '+esc(pr.sec)+'</span></li>'}).join('')+'</ul>'});
  h+='<p class="vat">'+esc(pr.vat)+'<br>'+esc(pr.complaint)+' <a href="mailto:'+TF.email+'">'+TF.email+'</a></p>';
  var ml={hr:'Strojno čitljiv cjenik (preuzimanje):',en:'Machine-readable price list (download):',de:'Maschinenlesbare Preisliste (Download):',pl:'Cennik do odczytu maszynowego (pobierz):',it:'Listino leggibile da macchina (scarica):',fr:'Tarifs lisibles par machine (télécharger) :'};
  h+='<p class="mr"><span>'+esc(ml[cur]||ml.en)+'</span><a href="cjenik.xml" download>XML</a><a href="cjenik.csv" download>CSV</a></p>';
  $('prices').innerHTML=h;
  [].forEach.call(document.querySelectorAll('.time[data-tk]'),function(e){e.textContent='1 € = '+e.dataset.tk.split(',').map(function(k){return t.s[k]}).join(' / ')+' s'})}
/* ---------- water / foam transition (mobile) ---------- */
var FX={
 rinse:{c:'30,150,240',a:.62,dur:1500,n:34,streak:1},
 wash:{c:'60,130,232',a:.62,dur:2500,n:20,foam:1,nb:7,sp:.6,bc:'238,247,255',hc:'140,200,255',slow:1},
 wax:{c:'255,190,0',a:.66,dur:1600,n:30,shine:1},
 rim:{c:'215,222,228',a:.82,dur:1900,n:22,slow:1},
 foam:{c:'255,92,178',a:.9,dur:2600,n:15,foam:1,slow:1},
 stop:{c:'205,0,0',a:.6,dur:900,n:26}};
var raf=0;
function rnd(n){var a=[],x=7;for(var i=0;i<n;i++){x=(x*9301+49297)%233280;a.push(x/233280)}return a}
function flow(id){var fx=FX[id];if(!fx||reduce()||matchMedia('(min-width:960px)').matches)return false;
  var cv=$('flow'),top=Math.max(0,$('machine').getBoundingClientRect().bottom-4),W=innerWidth,H=innerHeight-top,dpr=Math.min(devicePixelRatio||1,2);
  if(H<80)return false;cancelAnimationFrame(raf);
  cv.style.top=top+'px';cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;cv.style.display='block';
  var ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  var R=rnd(fx.n*6),cw=W/fx.n,t0=performance.now();
  function ease(x){return 1-Math.pow(1-x,2.2)}
  function frame(now){var t=(now-t0)/fx.dur;if(t>=1){cv.style.display='none';ctx.clearRect(0,0,W,H);return}
    cv.style.top=Math.max(0,$('machine').getBoundingClientRect().bottom-4)+'px';ctx.clearRect(0,0,W,H);var fade=t>.88?(1-t)/.12:1,pourEnd=fx.slow?.5:.38,hold=fx.slow?.62:.55;
    for(var i=0;i<fx.n;i++){var o=R[i*6],sp=.72+R[i*6+1]*.3,x=i*cw;
      var pt=Math.min(Math.max((t-o*.12)/pourEnd,0),1),head=Math.min(ease(pt)*H*sp*1.15,H);
      var dt=Math.min(Math.max((t-hold-o*.18)/(.9-hold),0),1),tail=dt*dt*H*1.15;
      if(head<=tail+1)continue;var A=fx.a*fade,w=cw+1.5,rr=w/2;
      ctx.fillStyle='rgba('+fx.c+','+A+')';ctx.beginPath();ctx.rect(x-.5,tail,w,Math.max(head-tail-rr,0));ctx.arc(x-.5+rr,head-rr,rr,0,Math.PI);ctx.fill();
      if(fx.streak){ctx.fillStyle='rgba(255,255,255,'+(.35*fade)+')';ctx.fillRect(x+cw*.3,tail,Math.max(cw*.12,1.5),head-tail-rr)}
      if(fx.specks){for(var k=0;k<5;k++){var yy=tail+(head-tail)*R[(i*6+k)%R.length],sz=1.5+R[(i*6+k+1)%R.length]*2.6;ctx.fillStyle='rgba(255,255,255,'+(.85*fade)+')';ctx.beginPath();ctx.arc(x+cw*(.2+R[(i*6+k+2)%R.length]*.6),yy,sz,0,7);ctx.fill()}}
      if(fx.foam){for(k=0;k<(fx.nb||4);k++){var by=head-k*cw*(fx.sp||.75),br=cw*(.95-k*(fx.nb>4?.07:.12));if(by<tail)break;ctx.fillStyle='rgba('+(fx.bc||'255,165,215')+','+(.95*fade)+')';ctx.beginPath();ctx.arc(x+cw*.5+(k%2?-1:1)*cw*.18,by,br,0,7);ctx.fill();
        ctx.fillStyle='rgba('+(fx.hc||'255,255,255')+','+(.75*fade)+')';ctx.beginPath();ctx.arc(x+cw*.5+(k%2?-1:1)*cw*.18-br*.3,by-br*.3,br*.22,0,7);ctx.fill()}}}
    if(fx.shine){ctx.save();ctx.globalCompositeOperation='source-atop';var sx=(-.3+t*1.8)*W,g=ctx.createLinearGradient(sx-90,0,sx+90,H*.5);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,'+(.8*fade)+')');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
    raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);return true}


/* ---------- exchange, devices, carpet demo, go2wash ---------- */
var IC={
 bill:'<svg viewBox="0 0 64 40" width="52" height="32" aria-hidden="true"><rect x="2" y="2" width="60" height="36" rx="5" fill="#e6efd9" stroke="#4a4a4a" stroke-width="3"/><circle cx="32" cy="20" r="9" fill="none" stroke="#4a4a4a" stroke-width="3"/><circle cx="11" cy="20" r="3" fill="#4a4a4a"/><circle cx="53" cy="20" r="3" fill="#4a4a4a"/></svg>',
 card:'<svg viewBox="0 0 64 42" width="52" height="34" aria-hidden="true"><rect x="2" y="2" width="60" height="38" rx="6" fill="#4a4a4a"/><rect x="2" y="11" width="60" height="8" fill="#f28200"/><rect x="9" y="27" width="22" height="5" rx="2" fill="#fff"/></svg>',
 token:'<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#2f6fdd" stroke="#1d4fa8" stroke-width="2"/><circle cx="16" cy="16" r="9.5" fill="none" stroke="#7fa8f0" stroke-width="1.6"/><ellipse cx="11" cy="9.5" rx="4.5" ry="2.4" fill="#fff" opacity=".55" transform="rotate(-30 11 9.5)"/></svg>',
 vac:'<svg viewBox="0 0 48 48" width="68" height="68" aria-hidden="true"><rect x="5" y="2" width="24" height="44" rx="2.5" fill="#aeb2b7"/><rect x="8" y="6" width="18" height="37" fill="#dba51f"/><path d="M8 6h18v6C20 10 13 11 8 15z" fill="#efc24d" opacity=".55"/><rect x="10" y="9" width="5.5" height="10" rx="1" fill="#f7f4e2"/><rect x="12" y="11" width="1.6" height="4" fill="#333"/><rect x="17" y="14.5" width="7" height="3.4" fill="#e0456d" stroke="#d8d8d8" stroke-width=".8"/><circle class="vc-lamp" cx="21" cy="10" r="1.9" fill="#e5171a"/><path d="M12 40l1.6-6c2-5.5 7-9.5 12-12" fill="none" stroke="#1d1d1d" stroke-width="3.2" stroke-linecap="round"/><path d="M10.5 41.5l3-6.5 3 1.5-2.2 6z" fill="#111"/><rect x="31" y="3" width="2" height="41" fill="#b9bcc2"/><g class="vc-hose"><path d="M33 12c8-1 12 7 8 14-2.5 4.5-6.5 4-5 10 1 4 5 5 3 9" fill="none" stroke="#1f9bb3" stroke-width="3.8" stroke-linecap="round"/><path d="M33 12c8-1 12 7 8 14-2.5 4.5-6.5 4-5 10 1 4 5 5 3 9" fill="none" stroke="#0f6f84" stroke-width="3.8" stroke-linecap="round" stroke-dasharray="1 2.2" opacity=".55"/></g></svg>',
 scent:'<svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true"><path d="M24 4l11 17h-6l9 13H10l9-13h-6z" fill="#3c9a53" stroke="#2c6f3c" stroke-width="2.5" stroke-linejoin="round"/><rect x="21.5" y="34" width="5" height="8" fill="#8a5a2b"/><circle cx="24" cy="2" r="0" /></svg>',
 deep:'<svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true"><path d="M24 5c7 9 12 15 12 22a12 12 0 0 1-24 0c0-7 5-13 12-22z" fill="#3aa0f0" stroke="#1d6fb5" stroke-width="2.5"/><path d="M38 6l1.6 4 4 1.6-4 1.6L38 17l-1.6-3.8-4-1.6 4-1.6z" fill="#f28200"/></svg>'};
function renderExchange(d){var e=d.ex;
  var b=[[5,5],[10,11],[20,23]].map(function(x){var bo=x[1]-x[0];return '<div class="tile"><div class="trow"><b>'+x[0]+' €</b><i aria-hidden="true">↓</i><span class="tok">'+IC.token+'<b>'+x[1]+'</b></span></div><em'+(bo?'':' class="b0"')+'>+'+(bo||0)+'</em></div>'}).join('');
  $('exchange').innerHTML='<div class="exch-h"><span class="ico">'+IC.bill+'</span><div><h2>'+esc(e.t)+'</h2><p>'+esc(e.s)+'</p></div></div><div class="exch-g">'+b+
   '<div class="tile tile-card"><span class="ico">'+IC.card+'</span><div><b>'+esc(e.card)+'</b><span>'+esc(e.cardT)+'</span></div></div></div><p class="exch-n">'+esc(e.one)+'</p>'}
function carpetSVG(label,title){
 var drops='';for(var i=0;i<8;i++)drops+='<path class="drop" style="animation-delay:'+(i*.11).toFixed(2)+'s" d="M'+(124+i*32)+' 198c3 4 4 6 4 8a4 4 0 0 1-8 0c0-2 1-4 4-8z" fill="#3aa0f0"/>';
 var pic='';for(var j=0;j<5;j++)pic+='<circle cx="'+(118+j*62)+'" cy="56" r="21" fill="#fff" stroke="#c99a00" stroke-width="2"/><path d="M'+(108+j*62)+' 62q10-18 20 0" fill="none" stroke="#4a4a4a" stroke-width="3" stroke-linecap="round"/>';
 return `<svg viewBox="0 0 600 312" class="cps s0" id="cpSvg" role="img" aria-label="${esc(label)}">
<defs><clipPath id="cpclip"><rect x="96" y="188" width="288" height="104"/></clipPath><pattern id="matp" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#8d6b3f"/><path d="M0 8h16" stroke="#6f522d" stroke-width="4"/></pattern></defs>
<rect width="600" height="312" rx="16" fill="#3a3a3a"/>
<rect x="80" y="20" width="440" height="272" rx="12" fill="#262626"/>
<rect x="80" y="20" width="320" height="72" rx="12" fill="#f2c200"/>${pic}
<rect x="80" y="92" width="320" height="80" fill="#fff"/>
<text x="240" y="122" text-anchor="middle" font-size="25" fill="#303030" data-fit="296" data-fs="25">${esc(title.toUpperCase())}</text>
<rect x="150" y="134" width="82" height="26" rx="13" fill="#d10000"/><text x="191" y="152" text-anchor="middle" font-size="13" fill="#fff">STOP</text>
<rect x="248" y="134" width="82" height="26" rx="13" fill="#1a73d9"/><path d="M289 139c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="#fff"/>
<rect x="96" y="174" width="288" height="20" rx="4" fill="#0e0e0e"/>
<rect x="80" y="196" width="320" height="96" rx="0" fill="#f2c200"/><rect x="80" y="196" width="320" height="96" fill="#000" opacity=".18"/>
<g clip-path="url(#cpclip)"><g class="mat"><rect x="127" y="200" width="230" height="56" rx="6" fill="url(#matp)" stroke="#5a4223" stroke-width="2"/><path d="M133 204v48M141 204v48" stroke="#d7b98a" stroke-width="2" opacity=".6"/></g></g>
<path d="M96 196h288" stroke="#0e0e0e" stroke-width="4"/>
<rect x="400" y="20" width="120" height="272" rx="12" fill="#3b3b3b"/>
<rect x="436" y="30" width="48" height="12" rx="5" fill="#0e0e0e"/><rect x="452" y="33" width="16" height="3" rx="1.5" fill="#999"/>
<rect x="412" y="62" width="96" height="34" fill="#b80000" stroke="#161616" stroke-width="2"/>
<text class="d0" x="460" y="87" text-anchor="middle" font-size="22" fill="#fff0e6">0.00</text><text class="d1" x="460" y="87" text-anchor="middle" font-size="22" fill="#fff0e6">0.50</text>
<circle class="coin" cx="460" cy="10" r="9" fill="#e6b422" stroke="#a87a0c" stroke-width="2"/>
<circle cx="440" cy="250" r="19" fill="#8f969b"/><circle cx="440" cy="250" r="14" fill="#d10000"/><text x="440" y="253.5" text-anchor="middle" font-size="9" fill="#fff">STOP</text>
<circle cx="490" cy="250" r="19" fill="#8f969b"/><circle class="bluehalo" cx="490" cy="250" r="19" fill="none" stroke="#fff" stroke-width="4"/><circle cx="490" cy="250" r="14" fill="#1a73d9"/>
${drops}
<g class="arrs"><g class="aInG"><path d="M24 262V208m-9 11l9-11 9 11" fill="none" stroke="#3cbf5a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="24" y="284" text-anchor="middle" font-size="14" fill="#3cbf5a">IN</text></g>
<g class="aOutG"><path d="M58 208v54m-9-11l9 11 9-11" fill="none" stroke="#ff5a4d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="58" y="284" text-anchor="middle" font-size="14" fill="#ff5a4d">OUT</text></g></g>
<g transform="translate(560 160)"><g class="rot"><path d="M16-16a24 24 0 1 0 8 16" fill="none" stroke="#f28200" stroke-width="6" stroke-linecap="round"/><path d="M6-20l14 6 4-16z" fill="#f28200"/></g></g>
</svg>`}
function clothSVG(label){
 var cols=['#1a73d9','#f28200','#8a5a2b','#f0f0f0'],bt='';
 cols.forEach(function(c,i){var x=232+i*45;bt+='<circle cx="'+x+'" cy="170" r="19" fill="#8f969b"/><circle class="kh" style="animation-delay:'+(i*.6)+'s" cx="'+x+'" cy="170" r="19" fill="none" stroke="#fff" stroke-width="4"/><circle cx="'+x+'" cy="170" r="14" fill="'+c+'" stroke="#222" stroke-width="1.5"/>'});
 return `<svg viewBox="0 0 600 300" class="cps kr s0" id="krSvg" role="img" aria-label="${esc(label)}">
<defs><clipPath id="krclip"><rect x="200" y="254" width="200" height="46"/></clipPath></defs>
<rect width="600" height="300" rx="16" fill="#3a3a3a"/><rect y="270" width="600" height="30" fill="#2b2b2b"/>
<rect x="190" y="20" width="220" height="242" rx="14" fill="#e9b800"/><path d="M190 60h220v-26a14 14 0 0 0-14-14H204a14 14 0 0 0-14 14z" fill="#f28200"/>
<rect x="204" y="70" width="192" height="58" rx="8" fill="#2b2b2b"/>
<rect x="216" y="82" width="110" height="34" fill="#b80000" stroke="#161616" stroke-width="2"/>
<text class="kd0" x="271" y="107" text-anchor="middle" font-size="22" fill="#fff0e6">0,00</text><text class="kd1" x="271" y="107" text-anchor="middle" font-size="22" fill="#fff0e6">0,70</text>
<rect x="352" y="78" width="14" height="42" rx="6" fill="#0e0e0e"/><rect x="357" y="84" width="4" height="30" rx="2" fill="#777"/>
<rect x="204" y="138" width="192" height="66" rx="8" fill="#3a3a3a"/>${bt}
<rect x="220" y="222" width="160" height="22" rx="4" fill="#0e0e0e"/><rect x="204" y="246" width="192" height="6" fill="#b88e00"/>
<g class="kcoin"><circle cx="485" cy="99" r="13" fill="#e6b422" stroke="#a87a0c" stroke-width="2"/></g>
<g clip-path="url(#krclip)"><g class="kcl"><rect x="250" y="226" width="100" height="62" rx="4" fill="#f1efe9" stroke="#b9b5aa" stroke-width="2"/><path d="M258 240h84M258 252h84M258 264h84" stroke="#d6d2c6" stroke-width="2"/></g></g>
</svg>`}
var DM={cp:{n:4,svg:'cpSvg',cap:'cpCap',c:'cp',pre:'cps s'},kr:{n:3,svg:'krSvg',cap:'krCap',c:'kr',pre:'cps kr s'}},dmI={cp:0,kr:0},dmT={};
function dmGo(k,n){var m=DM[k],sv=$(m.svg);if(!sv)return;dmI[k]=n;sv.setAttribute('class',m.pre+n);$(m.cap).textContent=D[cur][m.c].steps[n];
  [].forEach.call(document.querySelectorAll('.cp-dots[data-demo='+k+'] button'),function(b){b.setAttribute('aria-pressed',+b.dataset.n===n)})}
function dmAuto(k){clearInterval(dmT[k]);if(reduce())return;dmT[k]=setInterval(function(){if(!document.hidden)dmGo(k,(dmI[k]+1)%DM[k].n)},3800)}
function renderFoot(d){var pr=d.pr;$('foot').innerHTML='<p class="vat">'+esc(pr.vat)+'<br>'+esc(pr.complaint)+' <a href="mailto:'+TF.email+'">'+TF.email+'</a></p><a class="rate" href="https://www.google.com/search?q=autopraonica+split" target="_blank" rel="noopener">'+esc(d.rate)+'</a>'}
function renderWarn(d){var w=d.wn;
 $('warn').innerHTML='<svg class="wn-svg" viewBox="0 0 220 140" aria-hidden="true"><rect width="220" height="140" rx="12" fill="#3a3a3a"/>'+
  '<rect x="140" y="52" width="68" height="78" rx="8" fill="#575757"/><circle cx="174" cy="92" r="15" fill="#8f969b"/><circle class="wn-halo" cx="174" cy="92" r="15" fill="none" stroke="#fff" stroke-width="4"/><circle cx="174" cy="92" r="11" fill="#1a73d9"/>'+
  '<path d="M140 114C124 122 112 118 104 108" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M82 24v18a8 8 0 0 0 16 0" fill="none" stroke="#aaa" stroke-width="4" stroke-linecap="round"/>'+
  '<g class="wn-lance"><rect x="14" y="51" width="58" height="5" rx="2" fill="#2b2b2b"/><rect x="10" y="49" width="9" height="9" rx="2" fill="#f28200"/>'+
  '<rect x="68" y="46" width="46" height="16" rx="6" fill="#f28200"/><path d="M92 60h14l-2 26a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z" fill="#bdbdbd"/><path d="M88 62l8 14" stroke="#777" stroke-width="3" stroke-linecap="round"/>'+
  '<g class="wn-hand"><rect x="88" y="64" width="26" height="20" rx="9" fill="#f1c9a0" stroke="#c4966a" stroke-width="2"/><path d="M92 71h18M92 77h18" stroke="#c4966a" stroke-width="1.5"/></g></g>'+
  '<path class="wn-jet" d="M10 78L-2 70v16z" fill="#8cc8ff"/>'+
'<g class="wn-drops"><path class="wn-drop" style="animation-delay:0s" d="M16 86c2 3 3 4 3 6a3 3 0 0 1-6 0c0-2 1-3 3-6z" fill="#3aa0f0"/><path class="wn-drop" style="animation-delay:.25s" d="M24 92c2 3 3 4 3 6a3 3 0 0 1-6 0c0-2 1-3 3-6z" fill="#3aa0f0"/><path class="wn-drop" style="animation-delay:.5s" d="M8 90c2 3 3 4 3 6a3 3 0 0 1-6 0c0-2 1-3 3-6z" fill="#3aa0f0"/></g>'+
  '<g class="wn-finger"><rect x="168" y="100" width="12" height="30" rx="6" fill="#f1c9a0" stroke="#c4966a" stroke-width="2"/></g></svg>'+
  '<div class="wn-t"><span class="wn-i" aria-hidden="true">!</span><h2>'+esc(w.t)+'</h2><p>'+esc(w.x)+'</p></div>'}
function renderDevices(d){var v=d.dv,c=d.cp,k=d.kr,has=function(x){return LOC.devices.indexOf(x)>-1};
  function dev(id,ico,tk){var x=v[id];return '<article class="dev"><div class="dev-i">'+ico+'</div><div class="dev-b"><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p><span class="time" data-tk="'+tk+'"></span></div></article>'}
  var li=function(kk,x){return '<li class="k-'+kk+'"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></li>'};
  function dots(id,n,p){var o='';for(var i=0;i<n;i++)o+='<button data-n="'+i+'" aria-pressed="false" aria-label="'+esc(p)+' '+(i+1)+'">'+(i+1)+'</button>';return '<div class="cp-dots" data-demo="'+id+'">'+o+'</div>'}
  var kt=['glass','cockpit','leather','dry'].map(function(t,i){return '<li class="k-'+t+'">'+esc(k.types[i])+'</li>'}).join('');
  $('devices').innerHTML='<h2>'+esc(v.t)+'</h2><div class="devgrid">'+(has('vac')?dev('vac',IC.vac,'vac'):'')+
   (has('gloss')?dev('gloss','<img src="assets/tire-gloss.webp" alt="" width="72" height="72">','gloss'):'')+(has('scent')?dev('scent',IC.scent,'scent'):'')+(has('deep')?dev('deep',IC.deep,'deepwash,deeprinse'):'')+
   (has('cloths')?'<article class="dev dev--wide"><div class="cp"><div class="cp-demo">'+clothSVG(k.t)+'<p class="cp-cap" id="krCap"></p>'+dots('kr',3,k.play)+'</div>'+
   '<div class="cp-list"><h3>'+esc(k.t)+'</h3><span class="pricepill">'+esc(k.price)+'</span><p class="kr-s">'+esc(k.s)+'</p><ul class="kr-types">'+kt+'</ul><p class="kr-note"><i aria-hidden="true">!</i>'+esc(k.note)+'</p></div></div></article>':'')+
   (has('carpet')?'<article class="dev dev--wide"><div class="cp"><div class="cp-demo">'+carpetSVG(c.t,c.t)+'<p class="cp-cap" id="cpCap"></p>'+dots('cp',4,c.play)+'</div>'+
   '<div class="cp-list"><h3>'+esc(c.t)+'</h3><ul>'+li('coins',c.coins)+li('min',c.min)+li('modes',c.modes)+li('wet',c.wet)+li('stop',c.stop)+li('q',c.q)+'</ul><p class="thx">'+esc(c.thx)+'</p></div></div></article>':'')+'</div>';
  fit($('devices'));dmGo('cp',dmI.cp);dmGo('kr',dmI.kr);dmAuto('cp');dmAuto('kr')}
function renderGo(d){var g=d.go,o=$('go2').classList.contains('open');
  $('go2').innerHTML='<div class="go2-p" id="go2p"'+(o?'':' hidden')+'><div class="go2-h"><b>go2wash</b><em>'+esc(g.soon)+'</em><button class="go2-x" id="go2x" aria-label="'+esc(g.close)+'">&times;</button></div><p class="go2-tag">'+esc(g.tag)+'</p><p>'+esc(g.t)+'</p><a href="https://go2wash.eu/" target="_blank" rel="noopener">'+esc(g.cta)+'</a></div>'+
   '<button class="go2-b" id="go2b" aria-expanded="'+o+'" aria-controls="go2p" aria-label="go2wash – '+esc(g.soon)+'"><span>go2</span><i></i></button>'}
document.addEventListener('click',function(e){var t=e.target,box=$('go2');
  var cd=t.closest&&t.closest('.cp-dots button');if(cd){var dk=cd.parentNode.dataset.demo;dmGo(dk,+cd.dataset.n);dmAuto(dk);return}
  if(t.closest&&t.closest('#go2b')){var o=box.classList.toggle('open');$('go2p').hidden=!o;$('go2b').setAttribute('aria-expanded',o);return}
  if((t.closest&&t.closest('#go2x'))||(box.classList.contains('open')&&!(t.closest&&t.closest('#go2')))){box.classList.remove('open');$('go2p').hidden=true;$('go2b').setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('go2').classList.contains('open')){$('go2').classList.remove('open');$('go2p').hidden=true;$('go2b').focus()}});

/* ---------- page ---------- */
function build(){var b=$('langs');order.forEach(function(c){var x=document.createElement('button');x.textContent=D[c].name;x.dataset.l=c;x.lang=c;
  x.onclick=function(){set(c,true)};b.appendChild(x)})}
function detect(){var h=location.hash.slice(1);if(D[h])return h;var s=store('lang');if(D[s])return s;
  var n=(navigator.languages||[navigator.language||'en']).map(function(l){return l.slice(0,2).toLowerCase()});
  for(var i=0;i<n.length;i++)if(D[n[i]])return n[i];return 'en'}
function chips(d){var r='<span>'+esc(d.coin)+'</span>';
  [['0,10 €',10],['0,20 €',20],['0,50 €',50],['1,00 €',100],['2,00 €',200]].forEach(function(c){r+='<button class="chip" data-coin="'+c[1]+'">'+c[0]+'</button>'});
  r+='<button class="chip" data-coin="100">'+esc(d.token)+'</button>';
  r+='<button class="chip chip-r" data-reset="1" aria-label="0,00 €"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5"/></svg></button>';return r}
function set(c,user){var d=D[c];cur=c;sel=null;document.documentElement.lang=c;document.title=d.title+' | Car Wash'+(LOC.name?' '+LOC.name:'');var lt=$('locTag');if(lt){lt.textContent=LOC.name||'';lt.hidden=!LOC.name}
  if(user){store('lang',c);try{history.replaceState(null,'','#'+c)}catch(e){}}
  [].forEach.call($('langs').children,function(b){b.setAttribute('aria-pressed',b.dataset.l===c)});
  $('title').textContent=d.title;$('hint').textContent=d.hint;
  $('mframe').innerHTML=machine(d);fit($('mframe'));paintAll();
  $('coinsD').innerHTML=$('coinsM').innerHTML=chips(d);
  $('programs').innerHTML=d.programs.map(function(p){
    var tags=(p.prem?'<span>Premium '+p.prem+'</span>':'')+(p.std?'<span>Standard '+p.std+'</span>':'');
    return '<article class="card" data-id="'+p.id+'" style="--c:'+EDGE[p.id]+';--f:'+FILL[p.id]+'">'+
    '<button class="card-h" aria-pressed="false"><span class="dot"></span><span class="ttl"><b>'+esc(p.name)+'</b><small>'+esc(p.btn)+'</small></span>'+
    (p.tk?'<span class="time" data-tk="'+p.tk+'"></span>':'')+'</button>'+(tags?'<div class="tags">'+tags+'</div>':'')+'<p>'+esc(p.text)+'</p></article>'}).join('');
  renderFoot(d);$('rpBtn').textContent=RP.ui.btn[c];$('rpFab').href='report.html'+(DQ?'?d='+DQ:'')+'#'+c;renderExchange(d);renderWarn(d);renderDevices(d);renderGo(d);
  renderPrices();
  $('mPrice').textContent=d.pr.title;
  $('rate').textContent=d.rate;
  stick()}
function pick(id,fromSpot){var again=sel===id&&!fromSpot;sel=again?null:id;
  [].forEach.call(document.querySelectorAll('#mframe .btn'),function(s){s.setAttribute('aria-pressed',s.dataset.id===sel)});
  [].forEach.call(document.querySelectorAll('.card'),function(c){var on=c.dataset.id===sel;c.classList.toggle('on',on);c.querySelector('.card-h').setAttribute('aria-pressed',on)});
  var go=sel&&flow(sel);
  if(fromSpot&&sel){var cd=document.querySelector('.card[data-id="'+sel+'"]');setTimeout(function(){cd.scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'})},go?260:0)}}
function stick(){var w=matchMedia('(min-width:960px)').matches;document.documentElement.style.setProperty('--stick',w?'0px':$('machine').offsetHeight+'px')}

document.addEventListener('click',function(e){var t=e.target;
  var c=t.closest&&t.closest('[data-coin]');if(c){setCredit(credit+(+c.dataset.coin));return}
  if(t.closest('[data-reset]')){setCredit(0);return}
  var b=t.closest('#mframe .btn');if(b){pick(b.dataset.id,true);return}
  var h=t.closest('.card-h');if(h){pick(h.parentNode.dataset.id,false)}});
document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var b=e.target.closest&&e.target.closest('#mframe .btn');if(b){e.preventDefault();pick(b.dataset.id,true)}});
var z=$('zoom');$('zoomBtn').onclick=function(){var box=$('zbox');box.innerHTML=$('mframe').innerHTML;
  [].forEach.call(box.querySelectorAll('[tabindex]'),function(n){n.removeAttribute('tabindex')});z.showModal()};
$('zoomClose').onclick=function(){z.close()};z.addEventListener('click',function(e){if(e.target===z)z.close()});
addEventListener('resize',stick);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fit($('mframe'));fit($('devices'));stick()});
build();set(detect(),false);setCredit(0);
setInterval(function(){if(!document.hidden)renderPrices()},60000);
addEventListener('hashchange',function(){var h=location.hash.slice(1);if(D[h]&&h!==cur)set(h,false)});
})();
