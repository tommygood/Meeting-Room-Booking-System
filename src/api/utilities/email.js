const nodemailer = require('nodemailer');
const config = require('./config.js');
const User = require('../model/user.js');

const sender_mail_account = config.email.sender_mail_account;
const sender_mail_password = config.email.sender_mail_password;
const mail_server = config.email.mail_server;
const transporter = nodemailer.createTransport({
    host: `smtp.${mail_server}`,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: sender_mail_account,
        pass: sender_mail_password
    }
});
// email info
const organization = config.area.organization;
const unit = config.area.unit;

module.exports = {
    send : function(receivers, subject, text) {  
        // send email to receviers
        try {
            console.log(text);
            for (let i = 0;i < receivers.length;i++) {
                // mail info
                var mailOptions = {
                    from: `${sender_mail_account}@${mail_server}`, // sender address
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
    },

    // send email to specific user by identifier
    sendUser : async function(identifier, subject, text) {
        try {
            // get email from user by identifier
            const user = await User.getSelf(identifier);
            return this.send([user.email], subject, text);
        }
        catch(e) {
            console.error(e);
            return false;
        }
    },

    // email subject
    subject : {
        succeessful_reservation : "預約成功通知信",
        cancel_reservation : "取消預約通知信",
    },

    // email text
    text : {
        succeessful_reservation : function(identifier, start_time, end_time, room_id) {
            // temp remove room id in content
            return `您好：<br/><br/>您已成功預約${unit}，時間為：<br/><br/>${start_time} 至 ${end_time}
            <br/><br/>若有臨時取消之情形，請於２小時前取消預約。<br/><br/>一年內預約會議室無故未使用累積三次即停權帳號。<br/><br/><br/><br/>此為系統信件，請勿回信。<br/><br/>如有任何疑問，請洽秘書室鄭小姐，分機57006。`;
        },
        cancel_reservation : function(identifier, start_time, end_time, room_id) {
            return `您好：<br/><br/>您已取消預約${unit}，時間為：<br/><br/>${start_time} 至 ${end_time}
            <br/><br/>若有需要請重新預約，謝謝。<br/><br/><br/><br/>此為系統信件，請勿回信。<br/><br/>如有任何疑問，請洽秘書室鄭小姐，分機57006。`;
        }
    }
}