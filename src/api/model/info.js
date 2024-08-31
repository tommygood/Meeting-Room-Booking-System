const { getIdentifier, getAccountType } = require('../utilities/info');
const db_conn = require('./conn');

module.exports = {

    getChinesename : async function (identifier) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT `chinesename` FROM `User` WHERE `identifier` = ?;";
                const result = await conn.query(sql, [identifier]);
                db_conn.closeDBConnection(conn);
                return result[0].chinesename;
            }
            catch(e) {
                console.error("error getting account type : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    }    
}