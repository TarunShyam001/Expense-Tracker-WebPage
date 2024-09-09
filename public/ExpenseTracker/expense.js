const expenseForm = document.querySelector(".expense-form");

const listOfItems = document.getElementById("list-of-expenses");

let listOfExpense = [];

const port = 3450;

expenseForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const expenseDetails = {
        title : document.getElementById('title').value,
        category : document.getElementById('category').value,
        amount : document.getElementById('amount').value,
        details : document.getElementById('details').value
    }
  
    try{
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:${port}/expense/add-expense`, expenseDetails, { headers : {'Authorization' : token} });

        console.log(response.data); // Check the structure of the returned data

        listOfExpense.push(response.data);
        console.log(listOfExpense);

        document.getElementById('title').value = "";
        document.getElementById('amount').value = "";
        document.getElementById('category').value = "";
        document.getElementById('details').value = "";

        renderExpense();
    }
    catch(err){
        comsole.log(err);
    }
});


async function deleteExpense(index) {
    const expense = listOfExpense[index];
    console.log('Deleting expense with ID: ', expense.id); // For debugging

    try {
        await axios.delete(`http://localhost:${port}/expense/delete-expense/${expense.id}`);
        listOfExpense.splice(index, 1);

        renderExpense();
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

async function editExpense(index) {
    const expense = listOfExpense[index];
    try {
        document.getElementById('title').value = expense.title;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;
        document.getElementById('details').value = expense.details;

        deleteExpense(index);
        renderExpense();

    } catch (error) {
        console.error('Error editing expense:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:${port}/expense/get-expenses`, { headers: { 'Authorization': token } });
        listOfExpense = response.data;
        renderExpense(); // Make sure this is called after successfully fetching expenses
    } catch (error) {
        console.log('Error fetching expenses: ', error);
    }
});


function renderExpense() {
    const expenseList = document.getElementById("list-of-expenses");
    expenseList.innerHTML = ''; // Clear the existing list

    listOfExpense.forEach((expense, index) => {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense-item');

        expenseItem.innerHTML = `
            <h3 class="exp-title">${expense.title}</h3>
            <h4 class="exp-amount">Rs.${expense.amount}/-</h4>
            <h4 class="exp-category">${expense.category}</h4>
            <p class="exp-details">${expense.details}</p>
            <button onclick="editExpense(${index})" class="edit-btn">Edit</button>
            <button onclick="deleteExpense(${index})" class="delete-btn">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
}


// const response = await axios.get(`http://localhost:${port}/expense/premium`, { headers: { 'Authorization': token } });
//         if(response.data) {
//             premium.style.display = 'none';
//         } else {
//             premium.style.display = 'flex'
//         }