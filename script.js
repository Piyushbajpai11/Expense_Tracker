// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('total-income');
const expenseElement = document.getElementById('total-expense');
const filterCategory = document.getElementById('filter-category');

// Initialize transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Validate input
    if (!description || !amount || !date) {
        alert('Please fill in all fields');
        return;
    }

    const transaction = {
        id: generateID(),
        type,
        description,
        amount,
        category,
        date
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    transactionForm.reset();
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateUI();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update UI
function updateUI() {
    // Filter transactions based on category
    const filteredTransactions = filterCategory.value === 'all'
        ? transactions
        : transactions.filter(t => t.category === filterCategory.value);

    // Clear transaction list
    transactionList.innerHTML = '';

    // Calculate totals
    const amounts = transactions.map(transaction => ({
        ...transaction,
        amount: transaction.type === 'expense' ? -transaction.amount : transaction.amount
    }));

    const total = amounts.reduce((acc, item) => acc + item.amount, 0);
    const income = amounts
        .filter(item => item.amount > 0)
        .reduce((acc, item) => acc + item.amount, 0);
    const expense = amounts
        .filter(item => item.amount < 0)
        .reduce((acc, item) => acc + item.amount, 0);

    // Update balance display
    balanceElement.textContent = `$${total.toFixed(2)}`;
    incomeElement.textContent = `$${income.toFixed(2)}`;
    expenseElement.textContent = `$${Math.abs(expense).toFixed(2)}`;

    // Add transactions to list
    filteredTransactions.forEach(transaction => {
        const sign = transaction.type === 'income' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add('transaction-item');

        item.innerHTML = `
            <div class="transaction-details">
                <span class="transaction-description">${transaction.description}</span>
                <span class="transaction-category">${transaction.category}</span>
                <span class="transaction-date">${transaction.date}</span>
            </div>
            <div class="transaction-amount ${transaction.type}-amount">
                ${sign}$${Math.abs(transaction.amount).toFixed(2)}
            </div>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        transactionList.appendChild(item);
    });
}

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', updateUI);

// Initialize UI
updateUI(); 