const db_conn = require('./conn');

module.exports = {

    convertIPv4ToIPv6 : function (ip) {
        // convert ipv6 to ipv4 if it is ipv6
	    return ip.includes(':') ? ip.split(":")[ip.length-1] : ip;
    },

    // insert log into db by ip, operator_id, user identifier
    insert : async function (ip, operator_id, user_info) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                ip = this.convertIPv4ToIPv6(ip);                
                const sql = "insert into `Log` (`identifier`, `IP`, `operation_id`) values (?, ?, ?);";
                await conn.query(sql, [user_info.identifier, ip, operator_id]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting log : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // get log from db by offset and num
    get : async function (offset, num) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                const sql = "select * from `Log` LIMIT ? OFFSET ?;";
                const result = await conn.query(sql, [parseInt(num), parseInt(offset)]);
                db_conn.closeDBConnection(conn);
                return result;
            }
            catch(e) {
                console.error("error getting log : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    }
}
