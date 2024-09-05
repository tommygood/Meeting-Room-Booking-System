const db_conn = require('./conn');

module.exports = {

    // get all rooms
    get : async function () {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT * FROM `Room`;";
                const result = await conn.query(sql);
                db_conn.closeDBConnection(conn);
                return result;
            }
            catch(e) {
                console.error("error getting reservation : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    },

    // insert room into db by name, status
    insert : async function (name, status) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "insert into `Room` (`room_name`, `room_status`) values (?, ?);";
                await conn.query(sql, [name, status]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting room : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    }
}