// make sure to replace the client id and secret with your own application from the NCU Portal
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');

module.exports = {
	config: {
		client: {
		  id: '20240810153319N3rBYdMmk8gj',
		  secret: '5qnk47LxuLGxJLrRUKSDNNJxRC5pU4byTV5ZYMKnro0SOyBiVtoEhe'
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
		  scope: 'identifier,chinese-name,english-name',
		  state: '9d6ca6532dab4d92eac96d7b114730b4',
		});
	  
		// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
		res.redirect(authorizationUri);
	  
		const tokenParams = {
		  code: '<code>',
		  redirect_uri: `${host}/api/login/callback`,
		  scope: 'identifier,chinese-name,english-name',
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
			scope: 'identifier,chinese-name,english-name',
		};

		try {
			const client = new AuthorizationCode(this.config);
			const auth_res = await client.getToken(tokenParams);
			res.redirect(`${redirect_uri}?access_token=${auth_res.token.access_token}`);
			return {suc : true, access_token : auth_res.token.access_token};
		} catch (error) {
			console.error('Access Token Error', error);
			res.status(500).json('Authentication failed');
			return {suc : false, error : error.message};
		}
	}
}
