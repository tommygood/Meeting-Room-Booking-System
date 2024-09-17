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
                const sql = "select blocks, id_content from `Doc` where `name` = ?;";
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

    // get all docs name
    getAll : async function () {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return null;
        }
        else {
            try {
                const sql = "select name from `Doc`;";
                const result = await conn.query(sql);
                db_conn.closeDBConnection(conn);
                return result;
            }
            catch(e) {
                console.error("error getting all docs : ", e);
                db_conn.closeDBConnection(conn);
                return null;
            }
        }
    },

    // insert doc into db by doc_name, content of blocks and specify id of div. 
    // If doc_name already exists, update the blocks and id_content
    insert : async function (name, blocks, id_content) {
        const conn = await db_conn.getDBConnection();
        if (conn == null) {
            return false;
        }
        else {
            try {
                blocks = JSON.stringify(blocks);
                id_content = JSON.stringify(id_content);
                const sql = "insert into `Doc` (`name`, `blocks`, `id_content`) values (?, ?, ?) ON DUPLICATE KEY UPDATE `blocks` = ? , `id_content` = ?;";
                await conn.query(sql, [name, blocks, id_content, blocks, id_content]);
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