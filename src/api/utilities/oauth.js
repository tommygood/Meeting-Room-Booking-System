// make sure to replace the client id and secret with your own application from the NCU Portal
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const jwt = require('../utilities/jwt.js');
const user = require('../model/user.js');
const Info = require("./../utilities/info.js");

module.exports = {
	config: {
		client: {
		  id: process.env.oauth_client_id == undefined ? '20240810153319N3rBYdMmk8gj' : process.env.oauth_client_id,
		  secret: process.env.oauth_client_secret == undefined ? '5qnk47LxuLGxJLrRUKSDNNJxRC5pU4byTV5ZYMKnro0SOyBiVtoEhe' : process.env.oauth_client_secret
		},
		auth: {
			tokenHost: 'https://portal.ncu.edu.tw',
			authorizePath: '/oauth2/authorization',
			tokenPath: '/oauth2/token',
		}
	},

	scope: 'identifier,chinese-name,english-name',

	// Function to get the token
	run : async function run(host, req, res) {
		const client = new AuthorizationCode(this.config);
	  
		const authorizationUri = client.authorizeURL({
		  redirect_uri: `${host}/api/login/callback`,
		  scope: this.scope,
		  state: '9d6ca6532dab4d92eac96d7b114730b4',
		});
	  
		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.redirect(authorizationUri);
	  
		const tokenParams = {
		  code: '<code>',
		  redirect_uri: `${host}/api/login/callback`,
		  scope: this.scope,
		};
	  
		try {
		  const accessToken = await client.getToken(tokenParams);
		  return {suc : true, access_token : accessToken.access_token};
		} catch (error) {
		  console.log('Access Token Error', error.message);
		  return {suc : false, error : error.message};
		}
	},

	// Function to callback from the portal
	callback : async function callback(host, redirect_uri, req, res) {
		const { code } = req.query;

		const tokenParams = {
			code,
			redirect_uri: `${host}/example`,
			scope: this.scope,
		};

		try {
			const client = new AuthorizationCode(this.config);
			const auth_res = await client.getToken(tokenParams);
			const access_token = auth_res.token.access_token;
			// check if the login is successful
			if (auth_res.token.error) {
				res.status(500).json('Authentication failed');
				return {suc : false, error : auth_res.token.error};
			}
			else {
				// put the token in cookie and redirect to main page if login successfully
				const user_info = await Info.getInfoFromAPI(access_token);
				const token = jwt.signJwtToken(user_info.identifier);
                res.cookie("token", token);
				res.redirect(`${redirect_uri}`);
				return {suc : true, access_token : auth_res.token.access_token, user_info};
			}
		} catch (error) {
			console.error('Access Token Error', error);
			res.status(500).json('Authentication failed');
			return {suc : false, error : error.message};
		}
	}
}
