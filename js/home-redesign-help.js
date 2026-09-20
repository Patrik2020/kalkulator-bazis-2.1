(()=>{
'use strict';
const $=id=>document.getElementById(id),root=document.documentElement;
const launcher=$('kbHelpLauncher'),panel=$('kbHelpPanel'),backdrop=$('kbHelpBackdrop'),close=$('kbHelpClose');if(!launcher||!panel)return;
const dict=()=>window.KB_HELP_I18N?.[root.dataset.language||'hu']||window.KB_HELP_I18N?.hu||{};
function open(){panel.dataset.open='true';backdrop?.setAttribute('data-open','true');launcher.setAttribute('aria-expanded','true');panel.removeAttribute('aria-hidden')}
function shut(){panel.dataset.open='false';backdrop?.setAttribute('data-open','false');launcher.setAttribute('aria-expanded','false');panel.setAttribute('aria-hidden','true')}
function show(name){panel.querySelectorAll('.kb-help-view').forEach(v=>v.hidden=v.dataset.helpView!==name)}
launcher.addEventListener('click',open);close?.addEventListener('click',shut);backdrop?.addEventListener('click',shut);document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});panel.addEventListener('click',e=>{const b=e.target.closest('[data-help-open]');if(b)show(b.dataset.helpOpen);const back=e.target.closest('[data-help-back]');if(back)show('home')});
async function send(form){const d=dict(),status=form.querySelector('.kb-help-status'),submit=form.querySelector('[type="submit"]');status.hidden=true;submit.disabled=true;const fd=new FormData(form);fd.set('page',location.href);fd.set('language',root.dataset.language||'hu');try{const r=await fetch('https://formspree.io/f/xgojpond',{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('send');status.textContent=d.success||'Köszönjük, megkaptuk az üzenetet.';status.dataset.kind='success';status.hidden=false;form.reset()}catch(_){status.textContent=d.error||'A küldés most nem sikerült. Írj nekünk: kalkulatorbazis@gmail.com';status.dataset.kind='error';status.hidden=false}finally{submit.disabled=false}}
panel.querySelectorAll('[data-help-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();send(f)}));
function translate(){const d=dict();panel.querySelectorAll('[data-help-i18n]').forEach(el=>{const v=d[el.dataset.helpI18n];if(v!=null)el.textContent=v});launcher.querySelectorAll('[data-help-i18n]').forEach(el=>{const v=d[el.dataset.helpI18n];if(v!=null)el.textContent=v});panel.querySelectorAll('[data-help-placeholder]').forEach(el=>{const v=d[el.dataset.helpPlaceholder];if(v!=null)el.placeholder=v})}
document.addEventListener('kb:language-changed',translate);translate();show('home');shut();
})();