// required module
const { expect } = require("chai");

// call the reservation api
const Reservation = require("./../api/reservation.js").Reservation;
const reservation = new Reservation();

// start time is now time and format is YYYY-MM-DD HH:00:00
let start_time = new Date().toISOString().slice(0, 19).replace('T', ' ').slice(0, 14) + "00:00"
// end time is start time + 1 hour
let end_time = new Date(new Date().getTime() + 60*60*1000).toISOString().slice(0, 19).replace('T', ' ').slice(0, 14) + "00:00"

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

describe('test if reservation operations work ', () => {
    let reserve_id;

    it("post a random reservation should response true ", async () => {
        const stub_req = {
            body : {
                room_id: 1,
                name: "Backend Unit Test",
                start_time: start_time,
                end_time: end_time,
                show: true,
                ext: "123"
            },
            identifier: "admin",
            ip: "127.0.0.1",
        };
        stub_res.json = function (data) {
            expect(data).include({suc: true});
        };
        await reservation.post(stub_req, stub_res);
    });

    it("get the reservation posted above should response true ", async () => {
        const stub_req = {
            query : {
                start_time: start_time,
                end_time: end_time
            }
        };
        stub_res.json = function (data) {
            expect(data.data[0].name).to.equal("Backend Unit Test");
            reserve_id = data.data[0].reserve_id;
        };
        await reservation.get(stub_req, stub_res);
    });

    it("post a fully overlap reservation should response overlap message ", async () => {
        const stub_req = {
            body : {
                room_id: 1,
                name: "Backend Unit Test",
                start_time: start_time,
                end_time: end_time,
                show: true,
                ext: "123"
            },
            identifier: "admin",
            ip: ip,
        }
        stub_res.json = function (data) {
            expect(data).include({result: "與其他預約有衝突，請再次確認"});
        };
        await reservation.post(stub_req, stub_res);
    });

    it("post a foward overlap reservation response overlap message", async () => {
        // new_start_time is start_time - 30 minutes
        const new_start_time = new Date(new Date(start_time).getTime() - 30 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);    
        const stub_req = {
            body : {
                room_id: 1,
                name: "Backend Unit Test",
                start_time: new_start_time,
                end_time: end_time,
                show: true,
                ext: "123"
            },
            identifier: "admin",
            ip: ip,
        }
        stub_res.json = function (data) {
            expect(data).include({result: "與其他預約有衝突，請再次確認"});
        };
        await reservation.post(stub_req, stub_res);
    });

    it("post a backward overlap reservation response overlap message", async () => {
        // new_end_time is end_time + 30 minutes
        const new_start_time = new Date(new Date(start_time).getTime() + 30 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);    
        const stub_req = {
            body : {
                room_id: 1,
                name: "Backend Unit Test",
                start_time: new_start_time,
                end_time: end_time,
                show: true,
                ext: "123"
            },
            identifier: "admin",
            ip: ip,
        }
        stub_res.json = function (data) {
            expect(data).include({result: "與其他預約有衝突，請再次確認"});
        };
        await reservation.post(stub_req, stub_res);
    });

    it("delete the reservation posted above should response true ", async () => {
        const stub_req = {
            body : {
                reserve_id: reserve_id
            },
            identifier: "admin",
            ip: "127.0.0.1",
        };
        stub_res.json = function (data) {
            expect(data).include({suc: true});
        };
        await reservation.delete(stub_req, stub_res);
    });
})
