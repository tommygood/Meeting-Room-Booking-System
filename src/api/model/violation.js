const db_conn = require('./conn');

module.exports = {

    // get violation records by identifier
    getByIdentifier : async function (identifier) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT * FROM `Violation` WHERE `identifier` = ?;";
                const result = await conn.query(sql, [identifier]);
                db_conn.closeDBConnection(conn);
                return result;
            }
            catch(e) {
                console.error("error getting violation : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    },

    // insert violation record into db by identifier, reason, remark
    insert : async function (identifier, reason, remark) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "insert into `Violation` (`identifier`, `reason`, `remark`) values (?, ?, ?);";
                await conn.query(sql, [identifier, reason, remark]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting violation : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    }
}