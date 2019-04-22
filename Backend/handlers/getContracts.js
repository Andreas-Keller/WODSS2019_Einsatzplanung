/**
 * Get all contracts
 *
 * GET: /api/contract
 *
 * query:
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Contracts with a start date be...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Contracts with a start date bef...
 *
 */
exports.handler = async function getContracts(req, res, next) {
    //res.send('getContracts')
    const contractFirebase = require('../firebase/contract.crud.js');
    let response = await contractFirebase.getContracts();

    const util = require("../util/Util");
    const user = util.decodeToken(req);
    if (response.httpStatus === 200) {
        if (user.role === "DEVELOPER") {
            let data = [];
            //get all contracts which match with employee
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].employeeId == user.id) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        //filters
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

    res.status(response.httpStatus).send(response.payload);
    next();
};
