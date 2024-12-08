// make sure to replace the client id and secret with your own application from the NCU Portal
const {
  ClientCredentials,
  ResourceOwnerPassword,
  AuthorizationCode,
} = require("simple-oauth2");
const crypto = require("crypto");
const jwt = require("../utilities/jwt.js");
const user = require("../model/user.js");
const Info = require("./../utilities/info.js");

module.exports = {
  config: {
    client: {
      id:
        process.env.oauth_client_id == undefined
          ? "202412032157153TTwd9OVvxgb"
          : process.env.oauth_client_id,
      secret:
        process.env.oauth_client_secret == undefined
          ? "jAeau0dgAIJWrDw7tleyitNLD7kwbOtXgfHCan27jyikZXagw6F"
          : process.env.oauth_client_secret,
    },
    auth: {
      tokenHost: "https://portal.ncu.edu.tw",
      authorizePath: "/oauth2/authorization",
      tokenPath: "/oauth2/token",
    },
  },

  scope:
    "identifier,chinese-name,english-name,faculty-records,email,mobile-phone",

  // Function to get the token
  run: async function run(host, req, res) {
    const client = new AuthorizationCode(this.config);

    const codeVerifier = this.generateCodeVerifier();
    const code_challenge = this.generateCodeChallenge(codeVerifier);
    const authorizationUri = client.authorizeURL({
      redirect_uri: `${host}/2fconference/api/login/callback`,
      scope: this.scope,
      state: "9d6ca6532dab4d92eac96d7b114730b4",
      code_verify: code_challenge, // this is the code_challenge for weird result from vunlnerability scanner
      code_challenge: code_challenge,
      code_challenge_method: "S256",
    });
    req.session.code_verifier = codeVerifier;

    // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
    res.redirect(authorizationUri);
  },

  // Function to callback from the portal
  callback: async function callback(host, redirect_uri, req, res) {
    const { code } = req.query;
    const codeVerifier = req.session.code_verifier;

    const tokenParams = {
      code,
      redirect_uri: redirect_uri,
      scope: this.scope,
      code_verifier: codeVerifier,
      code_verify: codeVerifier
    };

    try {
      const client = new AuthorizationCode(this.config);
      const auth_res = await client.getToken(tokenParams);
      const access_token = auth_res.token.access_token;
      // check if the login is successful
      if (auth_res.token.error) {
        res.status(500).json("Authentication failed");
        return { suc: false, error: auth_res.token.error };
      } else {
        // put the token in cookie and redirect to main page if login successfully
        const user_info = await Info.getInfoFromAPI(access_token);
        const token = jwt.signJwtToken(user_info.identifier);
        res.cookie("token", token, { sameSite: 'strict', secure: true, maxAge: 1000 * 60 * 60 * 24});
        res.redirect(`${redirect_uri}`);
        return {
          suc: true,
          access_token: auth_res.token.access_token,
          user_info,
        };
      }
    } catch (error) {
      console.error("Access Token Error", error);
      res.status(500).json("Authentication failed");
      return { suc: false, error: error.message };
    }
  },

  generateCodeVerifier: function (length = 128) {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
  },

  // 將 code_verifier 進行 SHA256 雜湊並生成 code_challenge
  generateCodeChallenge: function (codeVerifier) {
    return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
  },
};
