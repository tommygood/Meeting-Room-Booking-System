const db = require("mariadb");
const config = require("./../utilities/config.js");
// create pool
const pool = db.createPool({
    connectionLimit : 5,
    host : config.db.host,
    port : config.db.port,
    user : config.db.username,
    password : config.db.password,
    database : config.db.name,
});

module.exports = {
    // return connection of db
    getDBConnection : async function() {
        try {
            const conn = await pool.getConnection();
            return conn;
        }
        catch(e) {
            console.error("error getting db connection : ", e);
            return null;
        }
    },
    
    // close connection of db
    closeDBConnection : function(conn) {
        try {
            conn.release();
        }
        catch(e) {
            console.error("error closing db connection : ", e);
        }
    }
}