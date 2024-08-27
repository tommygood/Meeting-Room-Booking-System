// Required modules
const router = require('express').Router();
const axios = require('axios');
  
const api_info = "https://portal.ncu.edu.tw/apis/oauth/v1/info";

async function getInfoFromAPI(access_token) {
	const headers = { 
		"Authorization" : "Bearer " + access_token,
		"Accept" : "application/json"
	}
	const res = await axios.get(api_info, {headers});
	return res.data;
}

async function getAccountName(access_token) {
	const result = await getInfoFromAPI(access_token);
    return result.chineseName;
}
async function getAccountType(access_token) {
	const result = await getInfoFromAPI(access_token);
	//test 拿到的資料
	return result.accountType;
}

router.get('/accountType', async function(req, res) {
	try {
		const result = await getAccountType(req.headers.access_token);
		res.json({result});
	}
	catch(e) {
        console.log(e);
    }
})

router.get('/accountName', async function(req, res) {
	try {
        const result = await getAccountName(req.headers.access_token);
        res.json({result});
    }
    catch(e) {
        console.log(e);
    }
})
module.exports = router;
