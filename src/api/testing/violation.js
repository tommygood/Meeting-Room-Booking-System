// required module
const { expect } = require("chai");

// call violation api
const Violation = require("../api/violation").Violation;
const violation = new Violation();

const ip = "127.0.0.1";
let stub_res = {
    json : function (data) {
    },
    // status have send function
    status : function (code) {
        //  not expect code to be 500
        expect(code).to.not.equal(500);
        return {
            send : function (data) {
                console.error(data);
            }
        };
    }
};

describe('violation', () => {
    let violation_id;

    it("post a violation should return true", async () => {
        const stub_req = {
            body : {
                reserve_id: 1,
                reason: "unit test",
                remark: "test"
            },
            identifier: "admin",
            ip: ip
        };
        stub_res.json = function (data) {
            expect(data).include({suc: true});
        };
        await violation.insert(stub_req, stub_res);
    });

    it('get violation should include the violation just inserted', async () => {
        const stub_req = {};
        stub_res.json = function (data) {
            const latest_violation = data.data[data.data.length - 1];
            expect(latest_violation.reason).to.equal("unit test");
            violation_id = latest_violation.violation_id;
        };
        await violation.get(stub_req, stub_res);
    });

    it('delete violation should return true', async () => {
        const stub_req = {
            body : {
                violation_id: violation_id
            },
            identifier: "admin",
            ip: ip
        };
        stub_res.json = function (data) {
            expect(data).include({suc: true});
        };
        await violation.delete(stub_req, stub_res);
    });
});