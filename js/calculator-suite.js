(function(){
  const root=window.KB_PROJECT_ROOT||"";
  const format=(value)=>Number.isFinite(value)?new Intl.NumberFormat("hu-HU",{maximumFractionDigits:12}).format(value):"Hiba";

  const factorial=(n)=>{if(!Number.isInteger(n)||n<0||n>170)throw new Error("factorial");let r=1;for(let i=2;i<=n;i++)r*=i;return r;};
  const evaluate=(raw,mode="deg")=>{
    let expr=String(raw||"").replace(/,/g,".").replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/π/g,"pi").replace(/√/g,"sqrt").replace(/\^/g,"**");
    while(/(\d+(?:\.\d+)?|\([^()]+\))!/.test(expr))expr=expr.replace(/(\d+(?:\.\d+)?|\([^()]+\))!/g,"factorial($1)");
    const angle=(x)=>mode==="deg"?x*Math.PI/180:x;
    const replacements={sin:"SIN",cos:"COS",tan:"TAN",asin:"ASIN",acos:"ACOS",atan:"ATAN",sqrt:"SQRT",log:"LOG",ln:"LN",abs:"ABS",factorial:"FACT",pi:"PI",e:"E"};
    Object.entries(replacements).forEach(([key,val])=>{expr=expr.replace(new RegExp(`\\b${key}\\b`,"gi"),val);});
    if(!/^[0-9+\-*/().\s,]*?(?:\*\*)?[0-9+\-*/().\s,A-Z]*$/.test(expr))throw new Error("invalid");
    const allowed=/^(?:[0-9+\-*/().\s,]|\*\*|SIN|COS|TAN|ASIN|ACOS|ATAN|SQRT|LOG|LN|ABS|FACT|PI|E)+$/;
    if(!allowed.test(expr))throw new Error("invalid");
    const fn=Function("SIN","COS","TAN","ASIN","ACOS","ATAN","SQRT","LOG","LN","ABS","FACT","PI","E",`"use strict";return (${expr});`);
    return fn(x=>Math.sin(angle(x)),x=>Math.cos(angle(x)),x=>Math.tan(angle(x)),x=>(mode==="deg"?Math.asin(x)*180/Math.PI:Math.asin(x)),x=>(mode==="deg"?Math.acos(x)*180/Math.PI:Math.acos(x)),x=>(mode==="deg"?Math.atan(x)*180/Math.PI:Math.atan(x)),Math.sqrt,Math.log10,Math.log,Math.abs,factorial,Math.PI,Math.E);
  };

  const bindCalculator=(shell,scientific=false)=>{
    const display=shell.querySelector("[data-calc-display]");
    const history=shell.closest(".scientific-layout")?.querySelector("[data-calc-history]");
    let mode="deg";
    const addHistory=(expression,result)=>{if(!history)return;const li=document.createElement("li");li.textContent=`${expression} = ${format(result)}`;history.prepend(li);while(history.children.length>10)history.lastElementChild.remove();};
    shell.addEventListener("click",event=>{
      const button=event.target.closest("button[data-value],button[data-action]");if(!button)return;
      const action=button.dataset.action;
      if(action==="clear")display.value="";
      else if(action==="backspace")display.value=display.value.slice(0,-1);
      else if(action==="equals"){try{const original=display.value;const result=evaluate(original,mode);display.value=format(result).replace(/\s/g,"").replace(",",".");addHistory(original,result);}catch(error){display.value="Hiba";}}
      else if(action==="mode"){mode=button.dataset.mode||"deg";shell.querySelectorAll('[data-action="mode"]').forEach(item=>item.classList.toggle("is-active",item.dataset.mode===mode));}
      else display.value+=button.dataset.value||"";
      display.focus();
    });
    display.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();shell.querySelector('[data-action="equals"]')?.click();}else if(event.key==="Escape")shell.querySelector('[data-action="clear"]')?.click();});
  };

  const quickMarkup=()=>`<section class="container quick-calculator-section" aria-labelledby="quickCalculatorTitle"><div class="quick-calculator-card"><div class="quick-calculator-copy"><span class="section-label">Gyors számolás</span><h2 id="quickCalculatorTitle">Egyszerű számológép</h2><p>Végezd el a leggyakoribb alapműveleteket közvetlenül a főoldalon.</p><div class="calculator-note">Összetettebb művelethez, gyökvonáshoz, hatványozáshoz és trigonometriai számításokhoz <a href="${root}/kalkulatorok/multifunkcios-szamologep.html">nyisd meg a multifunkciós számológépet</a>.</div></div><div class="calculator-shell" data-calculator><input class="calculator-display" data-calc-display inputmode="decimal" aria-label="Számológép kijelző"><div class="calculator-keys"><button class="danger" data-action="clear">C</button><button data-action="backspace">⌫</button><button class="operator" data-value="%">%</button><button class="operator" data-value="÷">÷</button><button data-value="7">7</button><button data-value="8">8</button><button data-value="9">9</button><button class="operator" data-value="×">×</button><button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button><button class="operator" data-value="−">−</button><button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button><button class="operator" data-value="+">+</button><button data-value="0">0</button><button data-value=".">,</button><button data-value="(">(</button><button class="equals" data-action="equals">=</button></div></div></div></section>`;

  const init=()=>{
    const path=location.pathname.replace(/\/+$/,"");
    if(path===""||path.endsWith("/index.html")){
      const hero=document.querySelector(".home-hero");if(hero&&!document.querySelector(".quick-calculator-section")){hero.insertAdjacentHTML("afterend",quickMarkup());bindCalculator(document.querySelector(".quick-calculator-section [data-calculator]"));}
    }
    document.querySelectorAll("[data-calculator]").forEach(shell=>{if(!shell.dataset.bound){shell.dataset.bound="true";bindCalculator(shell,shell.classList.contains("scientific-calculator"));}});
  };
  document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();