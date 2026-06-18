// 1
const a = document.getElementById("a");
const b = document.getElementById("b");
const r1 = document.getElementById("result1");

function calc1() {
  const x = parseFloat(a.value);
  const y = parseFloat(b.value);

  if (!x || !y) return r1.textContent = "–";

  r1.textContent = (x * y / 100).toFixed(2);
}

// 2
const c = document.getElementById("c");
const d = document.getElementById("d");
const r2 = document.getElementById("result2");

function calc2() {
  const x = parseFloat(c.value);
  const y = parseFloat(d.value);

  if (!x || !y) return r2.textContent = "–";

  r2.textContent = ((x / y) * 100).toFixed(2) + " %";
}

// 3
const e = document.getElementById("e");
const f = document.getElementById("f");
const r3 = document.getElementById("result3");

function calc3() {
  const x = parseFloat(e.value);
  const y = parseFloat(f.value);

  if (!x || !y) return r3.textContent = "–";

  const change = ((y - x) / x) * 100;

  r3.textContent = change.toFixed(2) + " %";
}

// auto
[a,b].forEach(i => i?.addEventListener("input", calc1));
[c,d].forEach(i => i?.addEventListener("input", calc2));
[e,f].forEach(i => i?.addEventListener("input", calc3));

calc1();
calc2();
calc3();