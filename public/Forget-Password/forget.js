const forgetPasswordForm = document.getElementById("forget-password-form");

const errorMsg = document.getElementById('error');

let login = [];

const port = 3450;

forgetPasswordForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
  
    try{
        await axios.post(`http://localhost:${port}/password/forgotpassword`,{email})
        .then(response => {
            if(response.status === 202) {
                document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent </div>';
            } else {
                throw new Error ('Something went wrong!!!')
            }
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err} </div>`;
        });
        console.log(response);
        document.getElementById('email').value = "";

        alert(response.data.message);
        
    }
    catch(error){
        console.log('Error adding user: ',error);
    }
});

