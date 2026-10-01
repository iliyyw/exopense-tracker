const transactionInput = document.getElementById("transactionInput");
const amountInput = document.getElementById("amountInput");
const typeSelect = document.getElementById("typeSelect");
const categorySelect = document.getElementById("categorySelect");
const addBtn = document.getElementById("AddBtn");
const filterCategory = document.getElementById("filterCategory");
const filterType = document.getElementById("filterType");
const transactionList = document.getElementById("transactionList");
const balanceE1 = document.getElementById("balance");
const incomeE1 = document.getElementById("income");
const expenseE1 = document.getElementById("expense");
let transactions = [];

transactionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    amountInput.focus();
  }
});
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    typeSelect.focus();
  }
});
typeSelect.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    categorySelect.focus();
  }
});
categorySelect.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

filterCategory.addEventListener("change", () => {
  renderTransactions();
});

filterType.addEventListener("change", () => {
  renderTransactions();
});

const savedTransactions = localStorage.getItem("transactions");
if (savedTransactions) {
  transactions = JSON.parse(savedTransactions);
}

function renderTransactions() {
  transactionList.innerHTML = "";

  const selectedCategory = filterCategory.value;
  const selectedType = filterType.value;

  transactions.forEach((transaction) => {
    if (
      selectedCategory !== "all" &&
      transaction.category !== selectedCategory
    ) {
      return;
    }

    if (selectedType !== "all" && transaction.type !== selectedType) {
      return;
    }

    const li = document.createElement("li");

    li.dataset.amount = transaction.amount;

    li.textContent = `${transaction.description} - $${transaction.amount} - ${transaction.category}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    li.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      transactions = transactions.filter((item) => item !== transaction);

      localStorage.setItem("transactions", JSON.stringify(transactions));

      renderTransactions();
      updateSummary();
    });

    transactionList.appendChild(li);
  });
}

function addTransaction() {
  const description = transactionInput.value.trim();
  const amount = amountInput.value;
  const type = typeSelect.value;
  const category = categorySelect.value;

  if (!description || !amount) {
    return;
  }

  const finalAmount = type === "expense" ? -Number(amount) : Number(amount);

  transactions.push({
    description,
    amount: finalAmount,
    type,
    category,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  transactionInput.value = "";
  amountInput.value = "";
  typeSelect.value = "income";
  categorySelect.value = "food";

  renderTransactions();
  updateSummary();
}
addBtn.addEventListener("click", addTransaction);

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;
  const transactionItems = transactionList.querySelectorAll("li");

  transactionItems.forEach((transaction) => {
    const amount = Number(transaction.dataset.amount);
    if (amount > 0) {
      totalIncome += amount;
    } else {
      totalExpense += Math.abs(amount);
    }
  });
  const balance = totalIncome - totalExpense;
  balanceE1.textContent = `$${balance}`;
  incomeE1.textContent = `$${totalIncome}`;
  expenseE1.textContent = `$${totalExpense}`;
}
