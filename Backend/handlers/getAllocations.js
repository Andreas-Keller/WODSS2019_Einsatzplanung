/**
 * Get all allocations
 *
 * GET: /api/allocation
 *
 * query:
 *   employeeId {int64} Filter the allocations by an employee (Filters can stack).
 *   projectId {int64} Filter the allocations by a project (Filters can stack).
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Allocations with a start date ...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Allocations with a start date b...
 *
 */
exports.handler = async function getAllocations(req, res, next) {
    const fb = require('../firebase/allocation.crud');
    let response = await fb.getAllocations();
    const util = require("../util/Util");
    const user = util.decodeToken(req);
    if (response.httpStatus === 200) {
        if (user.role === "DEVELOPER") {
            let data = [];
            let cfb = require('../firebase/contract.crud');
            //get all allocations which match with employee
            for (let i = 0; i < response.payload.length; i++) {
                let contract = await cfb.getContract(response.payload[i].contractId);
                if (contract.payload.employeeId == user.id) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        //filters
        if (req.query.employeeId) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].employeeId == req.query.employeeId) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        if (req.query.projectId) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].projectId === req.query.projectId) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        if (req.query.fromDate) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].startDate >= req.query.fromDate) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        if (req.query.toDate) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].endDate <= req.query.toDate) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        res.status(response.httpStatus).send(response.payload);
    } else {
        res.status(response.httpStatus).send();
    }
    next();
};
