const db_conn = require('./conn');

module.exports = {

    // get all reservations
    get : async function (start_time, end_time) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT `Reservation`.reserve_id ,`Reservation`.identifier, `Room`.room_name, `Reservation`.name, `Reservation`.start_time, `Reservation`.end_time, `Reservation`.show, `Reservation`.ext, `User`.chinesename, `User`.`unit` FROM `Reservation`,`Room`, `User` WHERE `Reservation`.room_id = `Room`.room_id AND `Reservation`.identifier = `User`.identifier AND `Reservation`.start_time >= ? AND `Reservation`.end_time <= ? AND `Reservation`.status = 0;";
                const result = await conn.query(sql, [start_time, end_time]);
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
    
    // insert reservation into db by identifier, room_id, name, start_time, end_time, show, ext
    insert : async function (identifier, room_id, name, start_time, end_time, show, ext) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "insert into `Reservation` (`identifier`, `room_id`, `name`, `start_time`, `end_time`, `show`, `ext`) values (?, ?, ?, ?, ?, ?, ?);";
                await conn.query(sql, [identifier, room_id, name, start_time, end_time, show, ext]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting reservation : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // get reservations which `show` is true and between the start_time and end_time
    getShow : async function () {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                sql = "SELECT * FROM `Reservation` WHERE `show` = 1 AND `status` = 0;";
                const result = await conn.query(sql);
                db_conn.closeDBConnection(conn);
                return result[0];
            }
            catch(e) {
                console.error("error getting reservations which show are true : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    },

    // update all columns except identifer in reservation by reserve_id and identifier
    updateSelfs : async function (identifer, reserve_id, room_id, name, start_time, end_time, show, ext) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "UPDATE `Reservation` SET `room_id` = ?, `name` = ?, `start_time` = ?, `end_time` = ?, `show` = ?, `ext` = ? WHERE `reserve_id` = ? and `identifier` = ?;";
                await conn.query(sql, [room_id, name, start_time, end_time, show, ext, reserve_id, identifer]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error updating reservation : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // update all columns except identifer in reservation by reserve_id, for admin
    update : async function (reserve_id, room_id, name, start_time, end_time, show, ext, status) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "UPDATE `Reservation` SET `room_id` = ?, `name` = ?, `start_time` = ?, `end_time` = ?, `show` = ?, `ext` = ?, `status` = ? WHERE `reserve_id` = ?;";
                await conn.query(sql, [room_id, name, start_time, end_time, show, ext, status, reserve_id]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error updating reservation : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // delete reservation by reserve_id
    delete : async function (reserve_id) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                const sql = "UPDATE `Reservation` SET `status` = 1 WHERE `reserve_id` = ?";
                await conn.query(sql, [reserve_id]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error deleting reservation : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // check if the reservation is overlapped with the existing reservations
    checkOverlap : async function (start_time, end_time) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                // based on three conditions, check if the reservation is overlapped with the existing reservations
                const sql = "SELECT COUNT(reserve_id) FROM `Reservation` WHERE ? > `start_time` AND ? < `end_time` AND `status` = 0";
                const result = await conn.query(sql, [start_time, start_time]);
                const sql1 = "SELECT COUNT(reserve_id) FROM `Reservation` WHERE ? > `start_time` AND ? < `end_time` AND `status` = 0";
                const sql2 = "SELECT COUNT(reserve_id) FROM `Reservation` WHERE ? = `start_time` AND ? = `end_time` AND `status` = 0";
                const result2 = await conn.query(sql, [end_time, end_time]);
                const result1 = await conn.query(sql, [end_time, end_time]);
                db_conn.closeDBConnection(conn);
                return result[0]['COUNT(reserve_id)'] > 0 || result1[0]['COUNT(reserve_id)'] > 0 || result2[0]['COUNT(reserve_id)'] > 0;
            }
            catch(e) {
                console.error("error checking overlap : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    },

    // get reservation by reserve_id
    getById : async function (reserve_id) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                const sql = "SELECT * FROM `Reservation` WHERE `reserve_id` = ?;";
                const result = await conn.query(sql, [reserve_id]);
                db_conn.closeDBConnection(conn);
                return result[0];
            }
            catch(e) {
                console.error("error getting reservation by reserve_id : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    }
}