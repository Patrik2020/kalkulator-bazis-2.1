(()=>{
'use strict';
if(!document.body?.classList.contains('home-page'))return;
if(window.KB_HOME_IA_LOADED)return;
window.KB_HOME_IA_LOADED=true;
if(document.querySelector('script[data-kb-home-current]'))return;
const root=String(window.KB_PROJECT_ROOT||'').replace(/\/$/,'');
const homeCurrentAsset='js/home-current.js?v=b70188f5d96c';
const script=document.createElement('script');
script.src=`${root}/${homeCurrentAsset}`.replace(/\/{2,}/g,'/');
script.async=false;
script.dataset.kbHomeCurrent='';
document.body.appendChild(script);
})();
