// Configuration file for the application

module.exports = {
	host : process.env.host == undefined ? "http://localhost:3000" : process.env.host,
	db : {
		host : process.env.db_host == undefined ? 'db.cymlab.ncu.im' : process.env.db_host,
		port : process.env.db_port == undefined ? 3306 : process.env.db_port,
		name : process.env.db_name == undefined ? "secretariat" : process.env.db_name,
		username : process.env.db_username == undefined ? "secretariat" : process.env.db_username,
		password : process.env.db_password == undefined ? "Sec@ncu" : process.env.db_password
	},
	email : {
		sender_mail_account : process.env.sender_mail_account == undefined ? "" : process.env.sender_mail_account,
		sender_mail_password : process.env.sender_mail_password == undefined ? "" : process.env.sender_mail_password,
		mail_server : process.env.mail_server == undefined ? "ncu.edu.tw" : process.env.mail_server
	},
	telegram : {
		bot_token : "6261510862:AAEHbnjlKupEgKMSn6umI2ARTLNxwUSxnCo",
		admin_id : "1697361994"
	},
	area : {
		organization : "國立中央大學",
		unit : "行政大樓2樓會議室"
	}
}