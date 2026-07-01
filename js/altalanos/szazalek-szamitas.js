function readNumber(input) {
  const value = Number.parseFloat(input?.value?.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function formatPercentValue(value) {
  return new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 4 }).format(value);
}

// 1. Mennyi az adott szám megadott százaléka?
const a = document.getElementById("a");
const b = document.getElementById("b");
const r1 = document.getElementById("result1");

function calc1() {
  const x = readNumber(a);
  const y = readNumber(b);
  if (x === null || y === null) {
    r1.textContent = "–";
    return;
  }
  r1.textContent = formatPercentValue(x * y / 100);
}

// 2. Az egyik szám hány százaléka a másiknak?
const c = document.getElementById("c");
const d = document.getElementById("d");
const r2 = document.getElementById("result2");

function calc2() {
  const x = readNumber(c);
  const y = readNumber(d);
  if (x === null || y === null || y === 0) {
    r2.textContent = y === 0 ? "Nullával nem lehet osztani." : "–";
    return;
  }
  r2.textContent = `${formatPercentValue((x / y) * 100)} %`;
}

// 3. Százalékos változás a kezdőértékhez képest
const e = document.getElementById("e");
const f = document.getElementById("f");
const r3 = document.getElementById("result3");

function calc3() {
  const x = readNumber(e);
  const y = readNumber(f);
  if (x === null || y === null || x === 0) {
    r3.textContent = x === 0 ? "A kezdőérték nem lehet nulla." : "–";
    return;
  }
  r3.textContent = `${formatPercentValue(((y - x) / x) * 100)} %`;
}

[a, b].forEach((input) => input?.addEventListener("input", calc1));
[c, d].forEach((input) => input?.addEventListener("input", calc2));
[e, f].forEach((input) => input?.addEventListener("input", calc3));

calc1();
calc2();
calc3();
