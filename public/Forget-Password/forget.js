const forgetPasswordForm = document.getElementById("forget-password-form");

const errorMsg = document.getElementById('error');

let login = [];

const port = 3450;

forgetPasswordForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
  
    try{
        const response = await axios.post(`http://localhost:${port}/password/forgotpassword`,{email});
        console.log(response);
        document.getElementById('email').value = "";

        alert(response.data.message);
        // window.location.href = "../ExpenseTracker/expense.html"
    }
    catch(error){
        console.log('Error adding user: ',error);
    }
});

