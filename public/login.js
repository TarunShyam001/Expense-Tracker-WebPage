const loginForm = document.getElementById("login-form");

const errorMsg = document.getElementById('error');

let login = [];

const port = 3450;

loginForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try{
        const response = await axios.post(`http://localhost:${port}/user/login`,{email, password});
        console.log(response);

        document.getElementById('email').value = "";
        document.getElementById('password').value = "";

        errorMsg.textContent = 'Login-Successfully';
    }
    catch(error){
        if(error.response) {
            if(error.response.status === 401){
                document.getElementById('password').value = "";
                errorMsg.textContent = `Error: ${error.response.data.message}`;
            } else if (error.response.status === 404) {
                document.getElementById('email').value = "";
                document.getElementById('password').value = "";
                errorMsg.textContent = `Error: ${error.response.data.message}`;
            } else {
                errorMsg.textContent = `Error: The provided data is incorrect`;
            }
        } else {
            console.log('Error adding user: ',error);
            errorMsg.textContent = '';
        }
    }
});

