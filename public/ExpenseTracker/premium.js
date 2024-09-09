const premiumButton = document.getElementById('rzp-button');

const port = 3450

premiumButton.addEventListener('click', async (event) => {
    event.preventDefault();  // Prevent default action of the button
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:${port}/purchase/premium-package`, { headers: { 'Authorization': token } });
        console.log(response);

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (paymentResponse) {
                try {
                    await axios.post(`http://localhost:${port}/purchase/updated-transaction-status`, {
                        order_id: options.order_id,
                        payment_id: paymentResponse.razorpay_payment_id,
                    }, { headers: { "Authorization": token } });

                    alert('You are a Premium User now');
                } catch (error) {
                    alert('Error updating transaction status');
                    console.log(error);
                }
            }
        };

        const rzpl = new Razorpay(options);
        rzpl.open();

        rzpl.on('payment.failed', function (paymentFailureResponse) {
            console.log(paymentFailureResponse);
            alert('Payment failed. Please try again.');
        });

    } catch (err) {
        console.error('Error initiating Razorpay payment:', err);
    }
});