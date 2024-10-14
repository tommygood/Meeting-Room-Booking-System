// Required modules
const router = require('express').Router();
const jwt = require('./../utilities/jwt.js');
const User = require('./../model/user.js');

class Doc {
    constructor() {
        this.model = require('./../model/doc.js');
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
    }

    async get(req, res) {
        try {
            const doc_name = req.query.doc_name;
            const data = await this.model.get(doc_name);
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async getAll(req, res) {
        try {
            const data = await this.model.getAll();
            res.json({data});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }

    async insert(req, res) {
        try {
            const {doc_name, blocks, id_content} = req.body;
            const suc = await this.model.insert(doc_name, blocks, id_content);
            res.json({suc});
        }
        catch(e) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    }
}

const doc = new Doc();

// get doc by doc_name
router.get('/', doc.get);

// get all docs
router.get('/all', doc.getAll);

// insert a doc
router.post('/', jwt.verifyAdmin, doc.insert);

module.exports = router;
module.exports.Doc = Doc;
