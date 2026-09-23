(()=>{
'use strict';
if(!document.body.classList.contains('home-page'))return;
const root=document.documentElement,base=String(window.KB_PROJECT_ROOT||'').replace(/\/$/,'');
const url=p=>`${base}/${String(p).replace(/^\//,'')}`.replace(/^\/$/,'./');
try{localStorage.removeItem('kalkulatorbazis-theme')}catch(_){ }
const m=new Date().getMonth()+1;
root.lang='hu';root.dataset.language='hu';root.dataset.season=m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter';root.dataset.theme=window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light';root.style.colorScheme=root.dataset.theme;
document.body.classList.add('home-redesign-v17');
document.querySelectorAll('link[data-home-professional-style],link[data-kb-seasonal-theme],script[data-kb-home-ia]').forEach(n=>n.remove());
if(!document.querySelector('link[data-home-redesign-v17]')){const l=document.createElement('link');l.rel='stylesheet';l.href=url('css/pages/home-redesign-v17.css?v=4a06e7b1351c');l.dataset.homeRedesignV17='';document.head.appendChild(l)}
const fetchText=async p=>{const r=await fetch(url(p),{cache:'no-cache'});if(!r.ok)throw new Error(`${p}: HTTP ${r.status}`);return r.text()};
const replace=(selector,html)=>{const current=document.querySelector(selector);if(!current)return;const t=document.createElement('template');t.innerHTML=html.trim();current.replaceWith(t.content)};
const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url(src);s.onload=resolve;s.onerror=reject;document.body.appendChild(s)});
const preserveStaticQualityMarkers=main=>{
 if(!main||main.querySelector('[data-kb-static-quality-final-start]'))return;
 const marker=(name,value)=>{const el=document.createElement('span');el.hidden=true;el.setAttribute('aria-hidden','true');el.setAttribute(name,'');el.dataset.kbStaticMarker=value;return el};
 const start=marker('data-kb-static-quality-final-start','KB_STATIC:quality-final:START');
 const end=marker('data-kb-static-quality-final-end','KB_STATIC:quality-final:END');
 const trust=main.querySelector('#trust')||main.lastElementChild;
 if(trust){main.insertBefore(start,trust);trust.after(end)}else{main.prepend(start);main.append(end)}
};
Promise.all([fetchText('fragments/home-redesign-v17-header.inc'),fetchText('fragments/home-redesign-v17-main.inc'),fetchText('fragments/home-redesign-v17-footer.inc')]).then(async([header,main,footer])=>{
 document.querySelectorAll('.kb-help-launcher,.kb-help-panel,[data-kb-backdrop]').forEach(n=>n.remove());
 replace('#header',header);replace('main',main);replace('#footer',footer);
 const redesignedMain=document.querySelector('main');
 if(redesignedMain)redesignedMain.id='main-content';
 const hero=redesignedMain?.querySelector('.hero');
 if(hero)hero.id='top';
 preserveStaticQualityMarkers(redesignedMain);
 for(const src of ['js/home-redesign-i18n-hu.js?v=e16382283760','js/home-redesign-i18n-en.js?v=2afb10ea4b0e','js/home-redesign-i18n-de.js?v=c7098ff2d797','js/home-redesign-help-i18n-hu.js?v=c61429bad988','js/home-redesign-help-i18n-en.js?v=1258bd945bfa','js/home-redesign-help-i18n-de.js?v=dbfccc2f4617','js/home-redesign-core.js?v=c8e141c68d35','js/home-redesign-salary.js?v=2d9d1a3111cd','js/home-redesign-help.js?v=4d095d1ef6b1'])await load(`${src}?v=20260921-1`);
 document.dispatchEvent(new CustomEvent('kb:home-redesign-ready'));
}).catch(err=>{console.error('Kalkulátor Bázis homepage redesign could not initialize.',err);document.body.classList.remove('home-redesign-v17')});
})();
