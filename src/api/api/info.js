// Required modules
const router = require('express').Router();
const Info = require('./../model/info.js');
const jwt = require('./../utilities/jwt.js');
const axios = require('axios');

router.get('/chinesename', async function(req, res) {
	try {
		// Verify the token
		const result = jwt.verifyJwtToken(req.cookies.token);
		if (result.suc) {
			const data = await Info.getChinesename(result.data.data);
			res.json({data});
		}
		else {
			res.json({result : 'Invalid token'});
		}
    }
    catch(e) {
        console.log(e);
		res.json({result : 'error'});
    }
})

module.exports = router;
