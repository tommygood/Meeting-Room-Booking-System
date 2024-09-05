// Used for testing the db connection can be established and closed

// required module
const db = require("./../model/conn.js");
const Operator = require("./../model/operator.js");
const { expect } = require("chai");

// test if get db connection work
describe('test if get db connection work ', () => {
    it("should not response null ", async () => {
        const conn = await db.getDBConnection();
        expect(conn).to.not.equal(null);
    }).timeout(2000);
})

// test if close db connection work
describe('test if close db connection work ', () => {
    it("should response true ", async () => {
        const conn = await db.getDBConnection();
        const res = db.closeDBConnection(conn);
        expect(res).to.equal(true);
    }).timeout(2000);
})