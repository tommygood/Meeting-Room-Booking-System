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
			res.status(403).send('Forbidden');
		}
    }
    catch(e) {
        console.error(e);
		res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
