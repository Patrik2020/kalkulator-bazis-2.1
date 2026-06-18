const fields = {
  income: document.getElementById("income"),
  housing: document.getElementById("housing"),
  utilities: document.getElementById("utilities"),
  food: document.getElementById("food"),
  transport: document.getElementById("transport"),
  debt: document.getElementById("debt"),
  other: document.getElementById("other"),
  savings: document.getElementById("savings"),
};

const balanceResult = document.getElementById("balanceResult");
const expenseResult = document.getElementById("expenseResult");
const savingsRateResult = document.getElementById("savingsRateResult");
const statusResult = document.getElementById("statusResult");

function parseMoney(value) {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function formatMoney(value) {
  return `${new Intl.NumberFormat("hu-HU").format(Math.round(value))} Ft`;
}

function formatMoneyInput(input) {
  input.addEventListener("input", () => {
    const raw = input.value.replace(/\s/g, "").replace(/\D/g, "");
    input.value = raw ? new Intl.NumberFormat("hu-HU").format(Number(raw)) : "";
  });
}

function calculateBudget() {
  const income = parseMoney(fields.income.value);
  const savings = parseMoney(fields.savings.value);
  const expenses =
    parseMoney(fields.housing.value) +
    parseMoney(fields.utilities.value) +
    parseMoney(fields.food.value) +
    parseMoney(fields.transport.value) +
    parseMoney(fields.debt.value) +
    parseMoney(fields.other.value) +
    savings;

  if (!income) {
    balanceResult.textContent = "–";
    expenseResult.textContent = "";
    savingsRateResult.textContent = "";
    statusResult.textContent = "";
    return;
  }

  const balance = income - expenses;
  const savingsRate = savings / income * 100;

  balanceResult.textContent = formatMoney(balance);
  expenseResult.textContent = `Összes kiadás megtakarítással együtt: ${formatMoney(expenses)}`;
  savingsRateResult.textContent = `Megtakarítási arány: ${savingsRate.toFixed(1).replace(".", ",")}%`;

  if (balance < 0) {
    statusResult.textContent = "A költségvetés negatív, érdemes csökkenteni valamelyik kiadási kategóriát.";
    statusResult.className = "budget-status is-warning";
  } else if (savingsRate >= 20) {
    statusResult.textContent = "Erős megtakarítási arány, a költségvetésed stabilnak tűnik.";
    statusResult.className = "budget-status is-good";
  } else if (savingsRate >= 10) {
    statusResult.textContent = "Egészséges irány, de még van tér a megtakarítás növelésére.";
    statusResult.className = "budget-status is-neutral";
  } else {
    statusResult.textContent = "Alacsony megtakarítási arány, érdemes tartalékot építeni.";
    statusResult.className = "budget-status is-warning";
  }
}

Object.values(fields).forEach((input) => {
  formatMoneyInput(input);
  input.addEventListener("input", calculateBudget);
});

calculateBudget();
