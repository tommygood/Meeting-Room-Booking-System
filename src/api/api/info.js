// Required modules
const router = require('express').Router();
const jwt = require('./../utilities/jwt.js');
const axios = require('axios');

class Info {
    constructor() {
        this.getChinesename = this.getChinesename.bind(this);
        this.model = require('./../model/info.js');
    }

    async getChinesename(req, res) {
      try {
        const identifier = req.identifier;
        const data = await this.model.getChinesename(identifier);
        res.json({data});
      }
      catch(e) {
        console.error(e);
		    res.status(500).send('Internal Server Error');
      }
    }
}

const info = new Info();

router.get('/chinesename', jwt.verifyLogin, info.getChinesename);

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
