const db_conn = require('./conn');

module.exports = {

    insert : async function (user_info) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                // insert user info into db, if user exists, then update user info
                const sql = 'INSERT INTO `User` (`identifier`, `chinesename`, `email`, `mobilePhone`, `unit`, `status`, `privilege_level`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `chinesename` = ?, `email` = ?, `mobilePhone` = ?, `unit` = ?, `status` = ?, `privilege_level` = ?;';
                await conn.query(sql, [user_info.identifier, user_info.chineseName, user_info.email, user_info.mobilePhone, user_info.unit, user_info.status, user_info.privilege_level, user_info.chineseName, user_info.email, user_info.mobilePhone, user_info.unit, user_info.status, user_info.privilege_level]);
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