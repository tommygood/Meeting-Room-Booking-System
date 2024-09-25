// Required modules
const router = require('express').Router();
const doc = require('../model/doc.js');
const Doc = require('./../model/doc.js');
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');

// get doc by doc_name
router.get('/', async function(req, res) {
	try {
		// get doc name from query string
        const doc_name = req.query.doc_name;
        const data = await Doc.get(doc_name);
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

// get all docs
router.get('/all', async function(req, res) {
    try {
        const data = await Doc.getAll();
        res.json({data});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
})

// insert a doc
router.post('/', jwt.verifyAdmin, async function(req, res) {
    try {
        const doc_name = req.body.doc_name;
        const blocks = req.body.blocks;
        const id_content = req.body.id_content;
        const suc = await Doc.insert(doc_name, blocks, id_content);
        res.json({suc});
    }
    catch(e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
