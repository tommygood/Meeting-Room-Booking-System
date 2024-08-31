const db = require("mariadb");
// create pool
const pool = db.createPool({
    connectionLimit : 500,
    host : 'db.cymlab.ncu.im',
    port : 443,
    user : 'secretariat',
    password : 'Sec@ncu',
    database : 'secretariat',
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