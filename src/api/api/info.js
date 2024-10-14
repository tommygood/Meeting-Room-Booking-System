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

module.exports = router;
