(()=>{
'use strict';
if(!document.body?.classList.contains('home-page'))return;
if(window.KB_SITE_RUNTIME?.isMaterializedHome())return;
if(document.querySelector('script[data-kb-home-redesign-v17]'))return;
const root=String(window.KB_PROJECT_ROOT||'').replace(/\/$/,'');
const script=document.createElement('script');
script.src=`${root}/js/home-current.js?v=9a00ae6d51f8`.replace(/\/{2,}/g,'/');
script.async=false;
script.dataset.kbHomeRedesignV17='';
document.body.appendChild(script);
})();
