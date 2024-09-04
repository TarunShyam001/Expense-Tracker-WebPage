const signUpForm = document.getElementById("sign-up-form");

const errorMsg = document.getElementById('error');

let users = [];

const port = 3450;

signUpForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try{
        const response = await axios.post(`http://localhost:${port}/user/signup`,{username, email, password});
        users.push(response.data);

        document.getElementById('username').value = "";
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";

        errorMsg.textContent = '';
    }
    catch(error){
        if(error.response && (error.response.status === 409 || error.response.status === 404)) {
            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
            errorMsg.textContent = `Error: ${error.response.data.message}`;
        } else {
            console.log('Error adding user: ',error);
            errorMsg.textContent = '';
        }
    }
});

