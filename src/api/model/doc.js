const db_conn = require('./conn');

module.exports = {

    // get doc by doc_name
    get : async function (name) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                const sql = "select blocks from `Doc` where `name` = ?;";
                const result = await conn.query(sql, [name]);
                db_conn.closeDBConnection(conn);
                return result[0];
            }
            catch(e) {
                console.error("error getting doc : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    },

    // insert doc into db by doc_name, content of blocks and update if exists
    insert : async function (name, blocks) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                blocks = JSON.stringify(blocks);
                const sql = "insert into `Doc` (`name`, `blocks`) values (?, ?) ON DUPLICATE KEY UPDATE `blocks` = ?;";
                await conn.query(sql, [name, blocks, blocks]);
                db_conn.closeDBConnection(conn);
                return true;
            }
            catch(e) {
                console.error("error inserting doc : ", e);
                db_conn.closeDBConnection(conn);
                return false;
            }
        }
    }
}