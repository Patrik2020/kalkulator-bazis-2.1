(()=>{
'use strict';
const $=id=>document.getElementById(id),root=document.documentElement;
const widget=$('heroSalaryWidget'),form=$('heroSalaryForm'),input=$('heroSalaryAmount'),inputLabel=$('heroSalaryInputLabel'),resultLabel=$('heroSalaryResultLabel'),result=$('heroSalaryResult'),status=$('heroSalaryApiStatus');
if(!widget||!input||!result)return;
const API='https://api.kalkulatorbazis.hu/api/v1/calculators/salary';
let direction='gross-to-net',timer=0,request=0,lastOutput=432250;
const locale=()=>root.dataset.language==='de'?'de-DE':root.dataset.language==='en'?'en-GB':'hu-HU';
const dict=()=>window.KB_HOME_I18N?.[root.dataset.language||'hu']||window.KB_HOME_I18N?.hu||{};
const parse=v=>{const n=Number(String(v||'').replace(/[^0-9,-]/g,'').replace(',','.'));return Number.isFinite(n)?n:NaN};
const format=n=>`${Math.round(n).toLocaleString(locale())} Ft`;
const formatInput=n=>Math.round(n).toLocaleString(locale());
function labels(){const d=dict();inputLabel.textContent=direction==='gross-to-net'?(d.salaryInputGross||'Bruttó munkabér'):(d.salaryInputNet||'Nettó munkabér');resultLabel.textContent=direction==='gross-to-net'?(d.salaryResultNet||'Becsült nettó'):(d.salaryResultGross||'Szükséges bruttó');document.querySelectorAll('[data-salary-direction]').forEach(b=>b.classList.toggle('active',b.dataset.salaryDirection===direction));}
function setStatus(key){const d=dict();if(status)status.textContent=d[key]||'';}
function fallback(amount){return direction==='gross-to-net'?amount*.665:amount/.665}
async function calculate(){clearTimeout(timer);const raw=input.value;if(!/\d/.test(raw)){result.textContent='—';return}const amount=parse(raw);if(!Number.isFinite(amount)||amount<0){result.textContent=dict().salaryInvalid||'Adj meg egy érvényes összeget';return}const id=++request;widget.classList.add('is-calculating');const body={taxYear:2026,under25:false,firstMarried:false,firstMarriedClaimedTaxBase:0,personalAllowance:false,motherBenefit:'none',family:{dependants:0,eligibleDependants:0,disabledEligibleDependants:0,claimPercent:100}};if(direction==='gross-to-net')body.gross=amount;else body.desiredNet=amount;try{const r=await fetch(`${API}/${direction}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error(String(r.status));const p=await r.json();const value=direction==='gross-to-net'?p?.data?.net:p?.data?.gross;if(!Number.isFinite(value))throw new Error('invalid');if(id!==request)return;lastOutput=value;result.textContent=format(value);setStatus('salaryApiLive');widget.dataset.fallback='false'}catch(_){if(id!==request)return;const value=fallback(amount);lastOutput=value;result.textContent=format(value);setStatus('salaryPreviewFallback');widget.dataset.fallback='true'}finally{if(id===request)widget.classList.remove('is-calculating')}}
input.addEventListener('focus',()=>{const n=parse(input.value);if(Number.isFinite(n))input.value=String(Math.round(n))});
input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(calculate,220)});
input.addEventListener('blur',()=>{const n=parse(input.value);if(Number.isFinite(n))input.value=formatInput(n);calculate()});
form?.addEventListener('submit',e=>e.preventDefault());
document.querySelectorAll('[data-salary-direction]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.salaryDirection===direction)return;direction=b.dataset.salaryDirection;if(Number.isFinite(lastOutput))input.value=formatInput(lastOutput);labels();calculate()}));
document.addEventListener('kb:language-changed',()=>{labels();const n=parse(input.value);if(Number.isFinite(n))input.value=formatInput(n);if(Number.isFinite(lastOutput))result.textContent=format(lastOutput)});
labels();calculate();
})();