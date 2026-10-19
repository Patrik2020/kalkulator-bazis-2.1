(()=>{
'use strict';
if(!document.body.classList.contains('home-page'))return;
if(window.KB_SITE_RUNTIME?.isMaterializedHome())return;
if(window.KB_SITE_RUNTIME?.claimInitialization(document.body,'home-assembler')===false)return;
const base=String(window.KB_PROJECT_ROOT||'').replace(/\/$/,'');
const url=p=>`${base}/${String(p).replace(/^\//,'')}`.replace(/^\/$/,'./');
document.body.classList.add('home-redesign-v17');
document.querySelectorAll('link[data-home-professional-style],link[data-kb-seasonal-theme],script[data-kb-home-ia]').forEach(n=>n.remove());
if(!document.querySelector('link[data-home-redesign-v17]')){const l=document.createElement('link');l.rel='stylesheet';l.href=url('css/pages/home-redesign-v17.css?v=6ada244efb8e');l.dataset.homeRedesignV17='';document.head.appendChild(l)}
const fetchText=async p=>{const r=await fetch(url(p),{cache:'no-cache'});if(!r.ok)throw new Error(`${p}: HTTP ${r.status}`);return r.text()};
const replace=(selector,html)=>{const current=document.querySelector(selector);if(!current)return;const t=document.createElement('template');t.innerHTML=html.trim();current.replaceWith(t.content)};
const replaceHeader=html=>{
 const current=document.querySelector('.kb-header-wrap')||document.querySelector('#header');
 if(!current)return;
 document.querySelector('#languageLawBanner')?.remove();
 const t=document.createElement('template');
 t.innerHTML=html.trim();
 current.replaceWith(t.content);
};
const load=src=>window.KB_SITE_RUNTIME?window.KB_SITE_RUNTIME.loadScript(url(src)):new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url(src);s.onload=resolve;s.onerror=reject;document.body.appendChild(s)});
const preserveStaticQualityMarkers=main=>{
 if(!main||main.querySelector('[data-kb-static-quality-final-start]')||main.innerHTML.includes('KB_STATIC:quality-final:START'))return;
 const marker=(name,value)=>{const el=document.createElement('span');el.hidden=true;el.setAttribute('aria-hidden','true');el.setAttribute(name,'');el.dataset.kbStaticMarker=value;return el};
 const start=marker('data-kb-static-quality-final-start','KB_STATIC:quality-final:START');
 const end=marker('data-kb-static-quality-final-end','KB_STATIC:quality-final:END');
 const trust=main.querySelector('#trust')||main.lastElementChild;
 if(trust){main.insertBefore(start,trust);trust.after(end)}else{main.prepend(start);main.append(end)}
};
Promise.all([fetchText('fragments/home-redesign-v17-header.inc'),fetchText('fragments/home-redesign-v17-main.inc'),fetchText('fragments/home-redesign-v17-footer.inc')]).then(async([header,main,footer])=>{
 document.querySelectorAll('.kb-help-launcher,.kb-help-panel,[data-kb-backdrop],#kbHelpBackdrop,#langPop,#seasonPop').forEach(n=>n.remove());
 replaceHeader(header);replace('main',main);replace('#footer',footer);
 const redesignedMain=document.querySelector('main');
 if(redesignedMain)redesignedMain.id='main-content';
 const hero=redesignedMain?.querySelector('.hero');
 if(hero)hero.id='top';
 preserveStaticQualityMarkers(redesignedMain);
 for(const src of ['js/home-redesign-i18n-hu.js?v=00531531f455','js/home-redesign-i18n-en.js?v=2afb10ea4b0e','js/home-redesign-i18n-de.js?v=c7098ff2d797','js/home-redesign-help-i18n-hu.js?v=c61429bad988','js/home-redesign-help-i18n-en.js?v=1258bd945bfa','js/home-redesign-help-i18n-de.js?v=dbfccc2f4617','js/home-redesign-core.js?v=b8c94750081c','js/home-redesign-salary.js?v=d9c8185e7089','js/home-redesign-help.js?v=be1be25c964a','js/home-multiplex-rails.js?v=957ad23b24f9'])await load(src);
 window.KB_SITE_RUNTIME?.initializeHome();
 document.dispatchEvent(new CustomEvent('kb:home-redesign-ready'));
}).catch(err=>{console.error('Kalkulátor Bázis homepage redesign could not initialize.',err);document.body.classList.remove('home-redesign-v17')});
})();
