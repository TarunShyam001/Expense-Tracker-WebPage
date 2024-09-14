// controllers/resetpassword.js
const uuid = require('uuid');
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo'); // Import TransactionalEmailsApi and SendSmtpEmail
const bcrypt = require('bcrypt');

const User = require('../models/users');
const Forgotpassword = require('../models/forget');

const port = 3450;

// Function to handle forgot password request
const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where : { email }});

        if (user) {
            const id = uuid.v4();
            await user.createForgotpassword({ id , active: true });

            // Set up Brevo API key
            // const brevoApiKey = process.env.BREV_API_KEY;
            const brevoApiKey = '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';

            // Initialize the TransactionalEmailsApi with the API key
            const apiInstance = new TransactionalEmailsApi();
            const apiKey = apiInstance.authentications['apiKey'];
            apiKey.apiKey = brevoApiKey;

            // Create a new SendSmtpEmail object
            const sendSmtpEmail = new SendSmtpEmail();

            // Fill in the email details
            sendSmtpEmail.subject = 'Reset Password Request';
            sendSmtpEmail.htmlContent = `<p>Click the link below to reset your password.</p><a href="http://localhost:${port}/password/resetpassword/${id}">Reset password</a>`;
            sendSmtpEmail.sender = { name: 'Tarun Shyam', email: 'shyamtarun2001@gmail.com' };
            sendSmtpEmail.to = [{ email }];
            // Add any other necessary email fields here (cc, bcc, replyTo, headers, etc.)

            // Send the email using the Brevo API
            apiInstance.sendTransacEmail(sendSmtpEmail)
                .then((data) => {
                    console.log('Email sent successfully:', data);
                    return res.status(200).json({ message: 'Link to reset password sent to your email', success: true });
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send email');
                });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}

// Function to render password reset form
const resetpassword = (req, res) => {
    const id = req.params.id;
    Forgotpassword.findOne({ where : { id }})
    .then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            // Render the HTML form for resetting password
            res.status(200).send(
                `<html>
                    <form action="/password/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>Reset Password</button>
                    </form>
                </html>`
            );
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    });
}

// Function to update user's password
const updatepassword = (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        Forgotpassword.findOne({ where : { id: resetpasswordid }})
        .then(resetpasswordrequest => {
            User.findOne({ where: { id: resetpasswordrequest.userId }})
            .then(user => {
                if (user) {
                    // Encrypt the new password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if (err) {
                            console.error(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if (err) {
                                console.error(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash })
                            .then(() => {
                                res.status(201).json({ message: 'Successfully updated the new password' });
                            })
                            .catch(error => {
                                console.error(error);
                                throw new Error(error);
                            });
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user exists', success: false });
                }
            });
        });
    } catch (error) {
        return res.status(403).json({ error: error.message, success: false });
    }
}

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}