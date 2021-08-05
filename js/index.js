const currencyHolder = document.getElementById("currency")
const balanceHolder = document.getElementById("balance")
const txnNameHolder = document.getElementById("name")
const txnAmountHolder = document.getElementById("amount")
const income = document.getElementById("income")
const expense = document.getElementById("expense")
const saveButton = document.getElementById("save")
const cancelButton = document.getElementById("cancel")
const displayList = document.getElementById("list-of-transaction")

let symbol = "₹";

let listOfTransactions = [];

let currentBalance = 0;

let editIndex = -1;

function edit(i){
    editIndex = i;
   txnNameHolder.value = listOfTransactions[i].name;
   txnAmountHolder.value = listOfTransactions[i].amount;
   if(listOfTransactions[i].type == "income")
   {
       income.checked = true;
   }

   cancelButton.style.display = "block";
}

function del(i){
    listOfTransactions = listOfTransactions.filter((e,index) => i !== index);
    render(); 
}

function saveData() {
    localStorage.setItem("symbol",symbol);
    localStorage.setItem("balance",currentBalance);
    localStorage.setItem("list", JSON.stringify(listOfTransactions));
}

function loadData() {
     symbol = localStorage.getItem("symbol");
     listOfTransactions = JSON.parse(localStorage.getItem("list"));
     currentBalance = Number(localStorage.getItem("balance"));
}

function render(){
    currentBalance = listOfTransactions.reduce((total, value) => 
    {return value.type == "expense" ? total - value.amount : total + value.amount}, 0);

    displayList.innerHTML = "";
 
    if(listOfTransactions.length == 0){
        displayList.innerHTML += "No Transaction Found"
    }

    else{
        listOfTransactions.forEach((e,i) => {
            displayList.innerHTML += 
            `<li class="transaction ${e.type}">
                    <p>${e.name}</p>
                    <div class="right-side">
                        <p>${symbol}${e.amount}</p>
                        <button onclick = "edit(${i})"><i class="fas fa-edit"></i></button>
                        <button onclick = "del(${i})"><i class="fas fa-trash"></i></button>
                    </div>
                </li>
            `;
        })
    }

    currencyHolder.innerHTML = symbol;
    balanceHolder.innerHTML = currentBalance;
    saveData(); 
}

cancelButton.addEventListener("click", () => {
    editIndex = -1
    txnNameHolder.value = "";
    txnAmountHolder.value = "";
    cancelButton.style.display = "none";
})

saveButton.addEventListener("click", () => {
    if((txnNameHolder.value) == "" || Number(txnAmountHolder.value) <= 0){
        alert("Can't do that");
        return
    }

    let transaction ={
        name: txnNameHolder.value,
        amount: Number(txnAmountHolder.value),
        type: income.checked? "income" : "expense"
    };

    if(editIndex == -1) {
        listOfTransactions.push(transaction);
    }
    else{
        listOfTransactions[editIndex] = transaction;
    }
    editIndex = -1
    txnNameHolder.value = "";
    txnAmountHolder.value = "";
    render();
    cancelButton.style.display = none;
})

loadData();
render();