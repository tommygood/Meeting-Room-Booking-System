const db_conn = require('./conn');
const Operator = require('./operator');

// replace operation_id with operation name
function replaceOperation(obj) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].operation_id = Operator.get(obj[i].operation_id);
    }
    return obj;
}

module.exports = {

    convertIPv4ToIPv6 : function (ip) {
        // convert ipv6 to ipv4 if it is ipv6
        // ::1 is the loopback address in IPv6
	    return (ip.includes(':') ? ip.split(":").pop() : ip) == 1 ? "127.0.0.1" : ip.split(":").pop();
    },

    // insert log into db by ip, operator_id, user identifier
    insert : async function (ip, operator_id, identifier) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                ip = this.convertIPv4ToIPv6(ip);                
                const sql = "insert into `Log` (`identifier`, `IP`, `operation_id`) values (?, ?, ?);";
                await conn.query(sql, [identifier, ip, operator_id]);
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
                const sql = "select Log.datetime, Log.IP, Log.operation_id, User.chinesename, User.unit from `Log`, `User` where `Log`.identifier = `User`.identifier order by `Log`.datetime desc limit ? offset ?;";
                const result = replaceOperation(await conn.query(sql, [parseInt(num), parseInt(offset)]));
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
