(()=>{
'use strict';
if(!document.body?.classList.contains('home-page'))return;
if(document.querySelector('script[data-kb-home-redesign-v17]'))return;
const root=String(window.KB_PROJECT_ROOT||'').replace(/\/$/,'');
const script=document.createElement('script');
script.src=`${root}/js/home-current.js?v=20260920-3`.replace(/\/{2,}/g,'/');
script.async=false;
script.dataset.kbHomeRedesignV17='';
document.body.appendChild(script);
})();