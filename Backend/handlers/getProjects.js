/**
 * Get all projects
 *
 * GET: /api/project
 *
 * query:
 *   projectManagerId {int64} Filter the projects by a project manager ID.
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Projects with a start date bef...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Projects with a start date befo...
 *
 */
exports.handler = async function getProjects(req, res, next) {
    const projectFirebase = require('../firebase/project.crud.js');
    let response = await projectFirebase.getProjects();
    const util = require("../util/util");
    const user = util.decodeToken(req);
    if (response.httpStatus === 200) {
        // if (user.role === "DEVELOPER") {
        //     let afb = require('../firebase/allocation.crud');
        //     let cfb = require('../firebase/contract.crud');
        //     let allocations = afb.getAllocations();
        //     let data = [];
        //     for (let i = 0; i < response.payload.length; i++) {
        //         let contract = await cfb.getContract(response.payload[i].contractId);
        //         if (contract.payload.employeeId == user.id) {
        //             data.push(response.payload[i]);
        //         }
        //     }
        //     response.payload = data;
        // }
        if (req.query.projectManagerId) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].projectManagerId === req.query.projectManagerId) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        if (req.query.fromDate) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].endDate >= req.query.fromDate) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        if (req.query.toDate) {
            let data = [];
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].startDate <= req.query.toDate) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        }
        res.status(response.httpStatus).send(response.payload);
    }
    else {
        res.status(response.httpStatus).send();
    }
    //res.send('getProjects')
    next();
};
