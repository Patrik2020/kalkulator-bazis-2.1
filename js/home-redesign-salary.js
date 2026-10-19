(()=>{
'use strict';
const initialize=()=>{
const $=id=>document.getElementById(id),root=document.documentElement;
const widget=$('heroSalaryWidget'),form=$('heroSalaryForm'),input=$('heroSalaryAmount'),inputLabel=$('heroSalaryInputLabel'),resultLabel=$('heroSalaryResultLabel'),result=$('heroSalaryResult'),status=$('heroSalaryApiStatus');
const rateSelect=$('heroSalaryTaxRate'),rateLabel=$('heroSalaryTaxRateLabel'),rateNote=$('heroSalaryRateNote');
if(!widget||!input||!result||!rateSelect)return;
if(window.KB_SITE_RUNTIME?.claimInitialization(widget,'home-redesign-salary.js')===false)return;
const API='https://api.kalkulatorbazis.hu/api/v1/calculators/salary';
let direction='gross-to-net',timer=0,request=0,lastOutput=432250;
const locale=()=>root.dataset.language==='de'?'de-DE':root.dataset.language==='en'?'en-GB':'hu-HU';
const dict=()=>window.KB_HOME_I18N?.[root.dataset.language||'hu']||window.KB_HOME_I18N?.hu||{};
const copy={
  hu:{label:'SZJA-kulcs',normal:'15% – 2026-os szabály',simulation:'9% – összehasonlítás',note:'A 9% csak összehasonlító számítás, nem hatályos 2026-os adókulcs.',simStatus:'9%-os összehasonlító számítás · Salary API',unavailable:'A 9%-os számítás most nem érhető el az API-ban.'},
  en:{label:'Income tax rate',normal:'15% – 2026 rules',simulation:'9% – comparison',note:'The 9% option is a comparison only, not the 2026 statutory rate.',simStatus:'9% comparison · Salary API',unavailable:'The 9% option is not yet available from the API.'},
  de:{label:'Einkommensteuersatz',normal:'15 % – Regeln 2026',simulation:'9 % – Vergleich',note:'Die Option mit 9 % dient nur zum Vergleich und gilt 2026 nicht als gesetzlicher Steuersatz.',simStatus:'9-%-Vergleich · Salary API',unavailable:'Die 9-%-Berechnung ist derzeit über die API nicht verfügbar.'}
};
const text=()=>copy[root.dataset.language]||copy.hu;
const rate=()=>rateSelect.value==='9'?9:15;
const parse=v=>{const n=Number(String(v||'').replace(/[^0-9,-]/g,'').replace(',','.'));return Number.isFinite(n)?n:NaN};
const format=n=>`${Math.round(n).toLocaleString(locale())} Ft`;
const formatInput=n=>Math.round(n).toLocaleString(locale());
function labels(){
 const d=dict(),t=text();
 inputLabel.textContent=direction==='gross-to-net'?(d.salaryInputGross||'Bruttó munkabér'):(d.salaryInputNet||'Nettó munkabér');
 resultLabel.textContent=direction==='gross-to-net'?(d.salaryResultNet||'Becsült nettó'):(d.salaryResultGross||'Szükséges bruttó');
 if(rateLabel)rateLabel.textContent=t.label;
 rateSelect.options[0].textContent=t.normal;
 rateSelect.options[1].textContent=t.simulation;
 if(rateNote)rateNote.textContent=t.note;
 document.querySelectorAll('[data-salary-direction]').forEach(b=>{const active=b.dataset.salaryDirection===direction;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
}
function setStatus(key){const d=dict();if(status)status.textContent=d[key]||'';}
function fallback(amount){return direction==='gross-to-net'?amount*.665:amount/.665}
async function calculate(){
 clearTimeout(timer);
 const raw=input.value;if(!/\d/.test(raw)){result.textContent='—';return}
 const amount=parse(raw);if(!Number.isInteger(amount)||amount<0){result.textContent=dict().salaryInvalid||'Adj meg egy érvényes egész forintösszeget';return}
 const id=++request,selectedRate=rate();
 widget.classList.add('is-calculating');
 const body={taxYear:2026,szjaRatePercent:selectedRate,under25:false,firstMarried:false,firstMarriedClaimedTaxBase:0,personalAllowance:false,motherBenefit:'none',family:{dependants:0,eligibleDependants:0,disabledEligibleDependants:0,claimPercent:100}};
 if(direction==='gross-to-net')body.gross=amount;else body.desiredNet=amount;
 try{
  const r=await fetch(`${API}/${direction}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});
  if(!r.ok)throw new Error(String(r.status));
  const p=await r.json();
  const returnedRate=p?.data?.taxes?.szjaRatePercent;
  if(selectedRate===9&&returnedRate!==9)throw new Error('unsupported_rate');
  if(returnedRate!==undefined&&returnedRate!==selectedRate)throw new Error('mismatched_rate');
  const value=direction==='gross-to-net'?p?.data?.net:p?.data?.gross;
  if(!Number.isFinite(value))throw new Error('invalid');
  if(id!==request)return;
  lastOutput=value;result.textContent=format(value);
  if(selectedRate===9){if(status)status.textContent=text().simStatus}else setStatus('salaryApiLive');
  widget.dataset.fallback='false';
 }catch(_){
  if(id!==request)return;
  if(selectedRate===9){
   lastOutput=NaN;result.textContent='—';if(status)status.textContent=text().unavailable;
  }else{
   const value=fallback(amount);lastOutput=value;result.textContent=format(value);setStatus('salaryPreviewFallback');
  }
  widget.dataset.fallback='true';
 }finally{if(id===request)widget.classList.remove('is-calculating')}
}
input.addEventListener('focus',()=>{const n=parse(input.value);if(Number.isFinite(n))input.value=String(Math.round(n))});
input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(calculate,220)});
input.addEventListener('blur',()=>{const n=parse(input.value);if(Number.isFinite(n))input.value=formatInput(n);calculate()});
rateSelect.addEventListener('change',calculate);
form?.addEventListener('submit',e=>{e.preventDefault();calculate()});
document.querySelectorAll('[data-salary-direction]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.salaryDirection===direction)return;direction=b.dataset.salaryDirection;if(Number.isFinite(lastOutput))input.value=formatInput(lastOutput);labels();calculate()}));
document.addEventListener('kb:language-changed',()=>{labels();const n=parse(input.value);if(Number.isFinite(n))input.value=formatInput(n);if(Number.isFinite(lastOutput))result.textContent=format(lastOutput)});
labels();calculate();
};
if(window.KB_SITE_RUNTIME)window.KB_SITE_RUNTIME.registerHomeInitializer('home-redesign-salary.js',initialize);else initialize();
})();
