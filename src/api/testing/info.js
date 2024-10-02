// Used for testing the log functions

// required module
const Info = require("./../model/info.js");
const Operator = require("./../model/operator.js");
const { expect } = require("chai");

// test if get chinesename from info function work
describe('test if get chinesename from info function work ', () => {
    it("should response true ", async () => {
        const identifier = "admin";
        const res = await Info.getChinesename(identifier);
        expect(res).to.equal("管理員");
    })
})