// Required modules
const router = require('express').Router();
const oauth = require("./../utilities/oauth.js");
const jwt = require('jsonwebtoken');
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const config = oauth.config;

router.post('/', async function(req, res) {
    try {
        const account = req.body.account;
        const password = req.body.password;
        res.json({suc : false});
    }
    catch(e) {
        console.log(e);
    }
})

router.get('/sso', async function(req, res) {
	try {
    	await run(req, res);
	}
	catch(e) {
        console.log(e);
    }
})

router.get('/callback', async function(req, res) {
	const { code } = req.query;

    const tokenParams = {
        code,
        redirect_uri: 'http://localhost:3000/example',
        scope: 'identifier',
    };

    try {
  		const client = new AuthorizationCode(config);
        const auth_res = await client.getToken(tokenParams);
        //有改
		  res.redirect(`http://localhost:80/templates/userlobby.php?access_token=${auth_res.token.access_token}`);
        // Now use accessToken to access the resource
        //res.status(200).json(access_token);
    } catch (error) {
        console.error('Access Token Error', error);
        res.status(500).json('Authentication failed');
    }
})
    

async function run(req, res) {
  const client = new AuthorizationCode(config);

  const authorizationUri = client.authorizeURL({
    redirect_uri: 'http://localhost:3000/api/login/callback',
    scope: 'identifier,chinese-name,english-name,gender',
    state: '9d6ca6532dab4d92eac96d7b114730b4',
    
  });

  // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  res.redirect(authorizationUri);

  const tokenParams = {
    code: '<code>',
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'identifier',
  };

  try {
    const accessToken = await client.getToken(tokenParams);
  } catch (error) {
    console.log('Access Token Error', error.message);
  }
}

module.exports = router;
