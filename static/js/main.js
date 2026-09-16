const balance = document.getElementById('total-balance');
const money_plus = document.getElementById('total-income');
const money_minus = document.getElementById('total-expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

let transactions = [];

// 1. Veritabanından verileri çek
async function getTransactions() {
    try {
        const res = await fetch('/api/transactions');
        transactions = await res.json();
        init();
    } catch (error) {
        console.error('Veriler çekilirken hata oluştu:', error);
    }
}

// 2. Yeni işlemi veritabanına kaydet
async function addTransaction(e) {
    e.preventDefault();

    if (desc.value.trim() === '' || amount.value.trim() === '') {
        alert('Lütfen bir açıklama ve tutar girin.');
        return;
    }

    const transactionAmount = type.value === 'expense' 
        ? -Math.abs(Number(amount.value)) 
        : Math.abs(Number(amount.value));

    const newTransaction = {
        text: desc.value,
        amount: transactionAmount
    };

    try {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTransaction)
        });

        const savedTransaction = await res.json();
        transactions.push(savedTransaction);

        addTransactionDOM(savedTransaction);
        updateValues();

        desc.value = '';
        amount.value = '';
    } catch (error) {
        console.error('İşlem kaydedilirken hata oluştu:', error);
    }
}

// 3. Ekrana HTML elemanını ekle
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

// 4. Tutarları hesapla
function updateValues() {
    const amounts = transactions.map(t => t.amount);

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

// 5. Veritabanından sil
async function removeTransaction(id) {
    try {
        await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
        });

        transactions = transactions.filter(t => t.id !== id);
        init();
    } catch (error) {
        console.error('Silinirken hata oluştu:', error);
    }
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Sayfa açılınca verileri getir
getTransactions();

form.addEventListener('submit', addTransaction);