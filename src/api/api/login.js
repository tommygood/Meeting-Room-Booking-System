// Required modules
const router = require('express').Router();
const oauth = require("./../utilities/oauth.js");
const config = require("./../utilities/config.js");
const Operator = require("./../model/operator.js");
const Log = require("./../model/log.js");
const User = require("./../model/user.js");
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
      const redirect_uri = `${host}/page/userlobby`;
    	const result = await oauth.callback(host, redirect_uri, req, res);

      // insert/update user info into db
      User.insert(result.user_info);
      console.log("ip: ", req.ip);
      // Log the login result
      if (result.suc) {
        Log.insert(req.ip, Operator.getOperator.LoginSuc, result.user_info);
      }
      else {
        Log.insert(req.ip, Operator.getOperator.LoginFail, result.user_info);
      }
  }
  catch(e) {
      console.log(e);
  }
})

module.exports = router;
