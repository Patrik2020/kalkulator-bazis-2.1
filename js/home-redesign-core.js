(()=>{
'use strict';

// The materialized V17 homepage owns its header. utils.js normally replaces
// #header with the shared legacy component on DOMContentLoaded; on the V17
// homepage that would nest the old header inside the new shell and create a
// load-order race with home-current.js. Keep the shared loader for every other
// component/page, but make the V17 homepage header immutable to that loader.
const sharedComponentLoader=window.loadComponent;
if(typeof sharedComponentLoader==='function'){
 window.loadComponent=function(id,path){
  if(id==='header'&&document.body?.classList.contains('home-page')&&document.body.classList.contains('home-redesign-v17'))return;
  return sharedComponentLoader(id,path);
 };
}

const root=document.documentElement;
const $=id=>document.getElementById(id);
const dict=()=>window.KB_HOME_I18N?.[root.dataset.language]||window.KB_HOME_I18N?.hu||{};
const header=$('header'),seasonBtn=$('seasonBtn'),seasonPop=$('seasonPop'),seasonLabel=$('seasonLabel'),seasonAuto=$('seasonAuto');
const themeBtn=$('themeBtn'),themeEmoji=$('themeEmoji'),themeLabel=$('themeLabel');
const accessBtn=$('accessBtn'),langBtn=$('langBtn'),langPop=$('langPop'),langLabel=$('langLabel');
const lawBanner=$('languageLawBanner'),lawTitle=$('languageLawTitle'),lawText=$('languageLawText');
const law={en:{title:'Important: Hungarian rules',text:'Financial and tax calculations on this site follow Hungarian legislation and Hungarian calculation rules. Changing the display language does not change the legal jurisdiction of a calculation.'},de:{title:'Wichtig: ungarische Regeln',text:'Finanz- und Steuerberechnungen auf dieser Website erfolgen nach ungarischem Recht und ungarischen Berechnungsregeln. Die gewählte Anzeigesprache ändert nicht die rechtliche Grundlage der Berechnung.'}};
function seasonForNow(){const m=new Date().getMonth()+1;return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'}
function setSeason(s){root.dataset.season=s;const d=dict();if(seasonLabel)seasonLabel.textContent=d[s]||s;document.querySelectorAll('[data-season]').forEach(b=>{const selected=b.dataset.season===s;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});document.querySelectorAll('[data-season-text]').forEach(e=>e.textContent=d[e.dataset.seasonText]||e.dataset.seasonText)}
function setTheme(t){const dark=t==='dark';root.dataset.theme=dark?'dark':'light';root.style.colorScheme=root.dataset.theme;if(themeEmoji)themeEmoji.textContent=dark?'☀':'☾';if(themeLabel)themeLabel.textContent=dark?(dict().themeLight||'Világos'):(dict().themeDark||'Sötét');if(themeBtn){themeBtn.setAttribute('aria-pressed',String(dark));themeBtn.title=dark?(dict().themeLightTitle||'Világos mód'):(dict().themeDarkTitle||'Sötét mód')}}
let manualTheme=false;const media=window.matchMedia?.('(prefers-color-scheme: dark)');themeBtn?.addEventListener('click',()=>{manualTheme=true;setTheme(root.dataset.theme==='dark'?'light':'dark')});media?.addEventListener?.('change',e=>{if(!manualTheme)setTheme(e.matches?'dark':'light')});
function setAccessibility(on,persist=true){root.dataset.accessibility=on?'on':'off';accessBtn?.setAttribute('aria-pressed',String(on));if(accessBtn)accessBtn.title=on?(dict().accessNormalTitle||'Normál nézet'):(dict().accessTitle||'Akadálymentes nézet');if(persist){try{localStorage.setItem('kb-prototype-accessibility',on?'on':'off')}catch(_){}}}
function applyLanguage(lang){if(!window.KB_HOME_I18N?.[lang])lang='hu';root.dataset.language=lang;root.lang=lang;const d=dict();if(langLabel)langLabel.textContent=lang.toUpperCase();document.querySelectorAll('[data-i18n]').forEach(e=>{const v=d[e.dataset.i18n];if(v!=null)e.textContent=v});document.querySelectorAll('[data-i18n-placeholder]').forEach(e=>{const v=d[e.dataset.i18nPlaceholder];if(v!=null)e.placeholder=v});document.querySelectorAll('[data-i18n-title]').forEach(e=>{const v=d[e.dataset.i18nTitle];if(v!=null)e.title=v});document.querySelectorAll('[data-i18n-aria]').forEach(e=>{const v=d[e.dataset.i18nAria];if(v!=null)e.setAttribute('aria-label',v)});document.querySelectorAll('[data-lang]').forEach(b=>{const selected=b.dataset.lang===lang;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});if(lawBanner){lawBanner.hidden=lang==='hu';const c=law[lang];if(c){lawTitle.textContent=c.title;lawText.textContent=c.text}else{lawTitle.textContent='';lawText.textContent=''}}document.querySelectorAll('[data-jurisdiction-note]').forEach(n=>{const c=law[lang];n.hidden=lang==='hu';n.textContent=c?c.text:''});renderNewsLanguage(lang);setTheme(root.dataset.theme||'light');setSeason(root.dataset.season||seasonForNow());setAccessibility(root.dataset.accessibility==='on',false);document.dispatchEvent(new CustomEvent('kb:language-changed',{detail:{language:lang}}))}
const pickers=[{button:seasonBtn,panel:seasonPop},{button:langBtn,panel:langPop}];
function closePicker(p){p.panel?.classList.remove('open');if(p.panel)p.panel.hidden=true;p.button?.setAttribute('aria-expanded','false')}
function positionPicker(p){
 if(!p.button||!p.panel)return;
 const rect=p.button.getBoundingClientRect(),gap=12;
 const width=p.panel.getBoundingClientRect().width;
 const left=Math.max(gap,Math.min(rect.right-width,window.innerWidth-width-gap));
 p.panel.style.setProperty('left',left+'px','important');
 p.panel.style.setProperty('right','auto','important');
 p.panel.style.setProperty('top',Math.min(rect.bottom+10,window.innerHeight-gap)+'px','important');
 p.panel.style.maxHeight=Math.max(0,window.innerHeight-rect.bottom-22)+'px';
}
pickers.forEach(p=>{
 closePicker(p);p.button?.setAttribute('aria-controls',p.panel?.id||'');
 p.button?.addEventListener('click',e=>{
  e.stopPropagation();const opening=!p.panel?.classList.contains('open');
  pickers.forEach(closePicker);
  if(opening&&p.panel){nav?.classList.remove('mobile-open');p.panel.hidden=false;p.panel.classList.add('open');p.button.setAttribute('aria-expanded','true');positionPicker(p)}
 });
});
seasonPop?.addEventListener('click',e=>{const b=e.target.closest('[data-season]');if(b){setSeason(b.dataset.season);closePicker(pickers[0])}});
seasonAuto?.addEventListener('click',()=>{setSeason(seasonForNow());closePicker(pickers[0])});
langPop?.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(b){applyLanguage(b.dataset.lang);closePicker(pickers[1])}});
document.addEventListener('click',e=>{pickers.forEach(p=>{if(!p.panel?.contains(e.target)&&!p.button?.contains(e.target))closePicker(p)})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const p=pickers.find(p=>p.panel?.classList.contains('open'));if(p){closePicker(p);p.button?.focus()}}});
window.addEventListener('resize',()=>pickers.forEach(p=>{if(p.panel?.classList.contains('open'))positionPicker(p)}));
accessBtn?.addEventListener('click',()=>setAccessibility(root.dataset.accessibility!=='on'));
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>40),{passive:true});
const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');menuBtn?.addEventListener('click',()=>{pickers.forEach(closePicker);nav?.classList.toggle('mobile-open')});
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.12}):null;document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function initSearch(){const input=$('calculatorSearch'),results=$('calculatorSearchResults'),button=$('heroSearchSubmit');if(!input||!results)return;const data=window.KB_DATA||{calculators:[],categories:[]};const cats=Object.fromEntries((data.categories||[]).map(c=>[c.id,c]));let matches=[];function close(){results.innerHTML='';results.classList.remove('is-visible');input.setAttribute('aria-expanded','false')}function render(){const q=norm(input.value.trim());if(q.length<2){close();return}matches=(data.calculators||[]).filter(c=>!c.hidden&&norm([c.title,c.description,c.keywords,cats[c.category]?.title].join(' ')).includes(q)).slice(0,10);results.innerHTML=matches.length?matches.map((c,i)=>`<a class="search-result" role="option" id="heroSearchResult${i}" href="${String(c.url||'').replace(/\.html$/,'')}"><span><strong>${c.title}</strong><small>${c.description||''}</small></span><em>${cats[c.category]?.shortTitle||'Kalkulátor'}</em></a>`).join(''):'<p class="search-empty">Nincs találat. Próbálj másik kifejezést.</p>';results.classList.add('is-visible');input.setAttribute('aria-expanded','true')}function openFirst(){const first=results.querySelector('.search-result');if(!first)return false;first.click();return true}input.addEventListener('input',render);input.addEventListener('keydown',e=>{if(e.key==='Enter'&&matches[0]){e.preventDefault();openFirst()}});button?.addEventListener('click',()=>{if(!openFirst()){input.focus();render()}});document.addEventListener('click',e=>{if(!e.target.closest('.hero-search'))close()})}
let latestNews=[];function renderNewsLanguage(lang=root.dataset.language||'hu'){const list=document.querySelector('#news .news-list');if(!list||!latestNews.length)return;const d=dict();list.innerHTML=latestNews.map((item,i)=>`<a class="news-item" href="${item.href}"><time>${item.date}</time><b>${lang==='hu'?item.title:(d['news'+(i+1)]||item.title)}</b></a>`).join('')}
async function refreshNews(){try{const r=await fetch('aktualis',{cache:'no-cache'});if(!r.ok)return;const doc=new DOMParser().parseFromString(await r.text(),'text/html');const cards=[...doc.querySelectorAll('[data-current-feed] .current-card')].slice(0,3);latestNews=cards.map(card=>{const a=card.querySelector('h2 a'),date=card.querySelector('time,.current-meta time,.current-meta>*');return a?{href:a.getAttribute('href')||'aktualis',date:date?.textContent?.trim()||'',title:a.textContent.trim()}:null}).filter(Boolean);renderNewsLanguage()}catch(_){}}
try{root.dataset.accessibility=localStorage.getItem('kb-prototype-accessibility')==='on'?'on':'off'}catch(_){root.dataset.accessibility='off'}applyLanguage('hu');setSeason(seasonForNow());setTheme(media?.matches?'dark':'light');initSearch();refreshNews();
})();
