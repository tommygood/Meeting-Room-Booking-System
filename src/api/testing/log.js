// Used for testing the log functions

// required module
const Log = require("./../model/log.js");
const Operator = require("./../model/operator.js");
const { expect } = require("chai");
const request = require('supertest');

// test if log function work
describe('test if log function work ', () => {
    it("should response true ", async () => {
        const ip = "127.0.0.1";
        const user_info = {identifier: "admin"};
        const res = await Log.insert(ip, Operator.getOperator.Test, user_info);
        expect(res).to.equal(true);
    })
})
