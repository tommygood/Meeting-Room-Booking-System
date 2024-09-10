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
                console.log(user_info.academyRecords.name)
                const sql = 'INSERT INTO `User` (`identifier`, `chinesename`, `email`, `mobilePhone`, `unit`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `chinesename` = ?, `email` = ?, `mobilePhone` = ?, `unit` = ?;';
                await conn.query(sql, [user_info.identifier, user_info.chineseName, user_info.email, user_info.mobilePhone, user_info.unit, user_info.chineseName, user_info.email, user_info.mobilePhone, user_info.FacultyRecords.unit]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting log : ", e);
                conn.release();
                return false;
            }
        }
    },

    // get all users
    get : async function () {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                const sql = 'SELECT User.identifier, User.chinesename, User.email, User.mobilePhone, User.unit, User.status, User.privilege_level, COUNT(Violation.violation_id) AS violation_count FROM `User` LEFT JOIN `Violation` ON User.identifier = Violation.identifier GROUP BY User.identifier;';
                const result = await conn.query(sql);
                db_conn.closeDBConnection(conn);
                return result;
            }
            catch(e) {
                console.error("error getting user : ", e);
                conn.release();
                return null;
            }
        }
    },

    // update privilege level by identifier
    updatePrivilegeLevel : async function (identifier, privilege_level) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = 'UPDATE `User` SET `privilege_level` = ? WHERE `identifier` = ?;';
                await conn.query(sql, [privilege_level, identifier]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error updating privilege level : ", e);
                conn.release();
                return false;
            }
        }
    },

    // update user status by identifier
    updateStatus : async function (identifier, status) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = 'UPDATE `User` SET `status` = ? WHERE `identifier` = ?;';
                await conn.query(sql, [status, identifier]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error updating user status : ", e);
                conn.release();
                return false;
            }
        }
    },

    // get user privilege level by identifier
    getPrivilegeLevel : async function (identifier) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                console.log("identifier : ", identifier);
                const sql = 'SELECT `privilege_level` FROM `User` WHERE `identifier` = ?;';
                const result = await conn.query(sql, [identifier]);
                db_conn.closeDBConnection(conn);
                console.log("result : ", result);
                return result[0].privilege_level;
            }
            catch(e) {
                console.error("error getting privilege level : ", e);
                conn.release();
                return null;
            }
        }
    }
}