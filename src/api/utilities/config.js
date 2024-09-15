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
		sender_gmail_account : process.env.sender_gmail_account == undefined ? "tommy50508@gmail.com" : process.env.sender_gmail_account,
		sender_gmail_password : process.env.sender_gmail_password == undefined ? "yfpo wyie vbjs ruyw" : process.env.sender_gmail_password,
		sender_alias_account : process.env.sender_alias_account == undefined ? "113423005@cc.ncu.edu.tw" : process.env.sender_alias_account
	},
	telegram : {
		bot_token : "6261510862:AAEHbnjlKupEgKMSn6umI2ARTLNxwUSxnCo",
		admin_id : "1697361994"
	}
}