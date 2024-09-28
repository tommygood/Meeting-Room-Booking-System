// Required modules
const router = require('express').Router();
const Info = require('./../model/info.js');
const jwt = require('./../utilities/jwt.js');
const axios = require('axios');

router.get('/chinesename', jwt.verifyLogin, async function(req, res) {
	try {
		const data = await Info.getChinesename(req.identifier);
		res.json({data});
    }
    catch(e) {
        console.error(e);
		res.status(500).send('Internal Server Error');
    }
})

// return server ip
// FIXME : remove this function after k8s testing is done
router.get('/ip', async function(req, res) {
	try {
		const os = require('os');
		const networkInterfaces = os.networkInterfaces();
		res.json({data : networkInterfaces, version : '1.0.1'});
	}
	catch(e) {
		console.error(e);
		res.status(500).send('Internal Server Error');
	}
})

module.exports = router;
