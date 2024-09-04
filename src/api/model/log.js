const db_conn = require('./conn');

module.exports = {

    convertIPv4ToIPv6 : function (ip) {
        // convert ipv6 to ipv4 if it is ipv6
	    return ip.includes(':') ? ip.split(":")[ip.length-1] : ip;
    },

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
                conn.release();
                return false;
            }
        }
    }
}
