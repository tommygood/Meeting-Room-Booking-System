const nodemailer = require('nodemailer');
const config = require('./config.js');
const User = require('../model/user.js');

// if the gmail use the two factor authentication, then need to use the special app password on setting of https://myaccount.google.com/apppasswords
const sender_gmail_account = config.email.sender_gmail_account;
const sender_gmail_password = config.email.sender_gmail_password;
// the email account that will show on the email instead of the gmail account
const sender_alias_account = config.email.sender_alias_account;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender_gmail_account,
    pass: sender_gmail_password
  }
});

module.exports = {
    send : function(receivers, subject, text) {  
        // send email to all recevier
        try {
            for (let i = 0;i < receivers.length;i++) {
                // mail info
                var mailOptions = {
                    from: sender_alias_account,
                    to: receivers[i],
                    subject: subject,
                    html: text
                };
                // send email
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            } 
            return true;
        }
        catch(e) {
            console.error(e);
            return false;
        }
    },

    // send email to all admins
    sendAdmins : async function(subject, text) {
        try {
            // extract emails from admin emails to make list of receivers
            const admin_emails = await User.getAdminsEmail();
            const receivers = [];
            for (let i = 0;i < admin_emails.length;i++) {
                receivers.push(admin_emails[i].email);
            }
            return this.send(receivers, subject, text);
        }
        catch(e) {
            console.error(e);
            return false;
        }
    }
}