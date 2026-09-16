const balance = document.getElementById('total-balance');
const money_plus = document.getElementById('total-income');
const money_minus = document.getElementById('total-expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

let transactions = [];

function addTransaction(e) {
     e.preventDefault(); 
    if (desc.value.trim() === '' || amount.value.trim() === '') {
        alert('Lütfen bir açıklama ve tutar girin.');
        return;
    }


const transactionAmount = type.value === 'expense' 
        ? -Math.abs(Number(amount.value)) 
        : Math.abs(Number(amount.value));

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        text: desc.value,
        amount: transactionAmount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    
    desc.value = '';
    amount.value = '';
}

function addTransactionDOM(transaction) {
    
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'expense' : 'income';

    const item = document.createElement('li');
    item.classList.add(itemClass);

    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}₺${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
   
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
   
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₺${total}`;
    money_plus.innerText = `+₺${income}`;
    money_minus.innerText = `-₺${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init();
}
// Ekranı baştan başlatma / tazeleme
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();

form.addEventListener('submit', addTransaction);