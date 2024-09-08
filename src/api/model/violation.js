const db_conn = require('./conn');

module.exports = {

    // get violation records by identifier
    get : async function () {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT * FROM `Violation`;";
                const result = await conn.query(sql);
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

    // insert violation record into db by reservation_id, reason, remark
    insert : async function (reserve_id, reason, remark) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "insert into `Violation` (`identifier`, `reason`, `remark`) values ((SELECT `identifier` FROM  `Reservation` WHERE `reserve_id` = ?), ?, ?);"
                await conn.query(sql, [reserve_id, reason, remark]);
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