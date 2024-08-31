const db_conn = require('./conn');

module.exports = {

    insert : async function (ip, operator_id, user_info) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = 'INSERT INTO `User` (`identifier`, `chinesename`, `email`, `mobilePhone`, `unit`, `status`, `privilege_level`) VALUES (?, ?, ?, ?, ?, ?, ?);';
                await conn.query(sql, [user_info.identifier, user_info.chineseName, user_info.email, user_info.mobilePhone, user_info.unit, user_info.status, user_info.privilege_level]);
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
