// Configuration file for the application

module.exports = {
	host : "http://localhost:3000",
	db : {
		host : process.env.db_host == undefined ? 'db.cymlab.ncu.im' : process.env.db_host,
		port : process.env.db_port == undefined ? 3306 : process.env.db_port,
		name : process.env.db_name == undefined ? "secretariat" : process.env.db_name,
		username : process.env.db_username == undefined ? "secretariat" : process.env.db_username,
		password : process.env.db_password == undefined ? "Sec@ncu" : process.env.db_password
	},
	telegram : {
		bot_token : "6261510862:AAEHbnjlKupEgKMSn6umI2ARTLNxwUSxnCo",
		admin_id : "1697361994"
	}
}