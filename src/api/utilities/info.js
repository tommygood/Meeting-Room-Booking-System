const axios = require('axios');
const api_info = "https://portal.ncu.edu.tw/apis/oauth/v1/info";

module.exports = {
   
    getInfoFromAPI : async function getInfoFromAPI(access_token) {
        const headers = { 
            "Authorization" : "Bearer " + access_token,
            "Accept" : "application/json"
        }
        const res = await axios.get(api_info, {headers});
        return res.data;
    },
    
    getAccountName : async function getAccountName(access_token) {
        const result = await this.getInfoFromAPI(access_token);
        return result.chineseName;
    },

    getAccountType: async function getAccountType(access_token) {
        const result = await this.getInfoFromAPI(access_token);
        //test 拿到的資料
        return result.accountType;
    },
    
    getIdentifier : async function getIdentifier(params) {
        const result = await this.getInfoFromAPI(params);
        return result.identifier;
    }
}