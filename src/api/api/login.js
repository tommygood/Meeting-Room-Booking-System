// Required modules
const router = require('express').Router();
const oauth = require("./../utilities/oauth.js");
const config = require("./../utilities/config.js");
const operator = require("./../model/operator.js");
const Log = require("./../model/log.js");
const info = require("./../utilities/info.js");
const jwt = require('jsonwebtoken');
const oauth_config = oauth.config;
const host = config.host;

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
    	await oauth.run(host, req, res);
	}
	catch(e) {
      console.log(e);
  }
})

router.get('/callback', async function(req, res) {
	try {
      const redirect_uri = `${host}/example`;
    	const result = await oauth.callback(host, redirect_uri, req, res);
      if (result.suc) {
        const user_info = await info.getInfoFromAPI(result.access_token);
        Log.insert(req.ip, operator.getOperator.LoginSuc, user_info);
      }
  }
  catch(e) {
      console.log(e);
  }
})

module.exports = router;
