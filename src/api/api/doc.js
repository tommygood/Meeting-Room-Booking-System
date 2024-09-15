// Required modules
const router = require('express').Router();
const doc = require('../model/doc.js');
const Doc = require('./../model/doc.js');
const jwt = require('./../utilities/jwt.js');

// get doc by doc_name
router.get('/', async function(req, res) {
	try {
		// get doc name from query string
        const doc_name = req.query.doc_name;
        const data = await Doc.get(doc_name);
        res.json({data});
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
})

// insert a doc
router.post('/', async function(req, res) {
    try {
        // Verify the token
        const result = jwt.verifyJwtToken(req.cookies.token);
        if (result.suc) {
            const doc_name = req.body.doc_name;
            const blocks = req.body.blocks;
            const suc = await Doc.insert(doc_name, blocks);
            res.json({suc});
        }
        else {
            res.json({result : 'Invalid token'});
        }
    }
    catch(e) {
        console.log(e);
        res.json({result : 'error'});
    }
});

module.exports = router;
