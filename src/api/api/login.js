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

class SSOLogin {
  constructor() {
  }

  async sso(req, res) {
    try {
    	await oauth.run(host, req, res);
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
  }

  async callback(req, res) {
    try {
      const redirect_uri = `${host}/2fconference/lobby`;
      const result = await oauth.callback(host, redirect_uri, req, res);

      // insert/update user info into db
      User.insert(result.user_info);
      // Log the login result
      if (result.suc) {
        Log.insert(req.ip, Operator.getOperator.LoginSuc.code, result.user_info.identifier);
      }
      else {
        Log.insert(req.ip, Operator.getOperator.LoginFail.code, result.user_info.identifier);
      }
    }
    catch(e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
  }
}

const login = new SSOLogin();

router.get('/sso', login.sso);

router.get('/callback', login.callback);

module.exports = router;
