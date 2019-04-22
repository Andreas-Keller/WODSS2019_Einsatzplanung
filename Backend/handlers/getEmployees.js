/**
 * Get all employees
 *
 * GET: /api/employee
 *
 * query:
 *   role {string} Filter the employees by role).
 *
 */
exports.handler = async function getEmployees(req, res, next) {
    const employeeFirebase = require('../firebase/employee.crud.js');
    let response = await employeeFirebase.getEmployees();

    const util = require("../util/Util");
    const user = util.decodeToken(req);
    if (response.httpStatus === 200) {
        if (user.role === "DEVELOPER") {
            response.payload = [user];//return only dev\
        }
        //filters
        let data = [];
        if (req.query.role != undefined) {
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].role === req.query.role && response.payload[i].emailAddress !== null) {
                    data.push(response.payload[i]);
                }
            }
            response.payload = data;
        } else {
            for (let i = 0; i < response.payload.length; i++) {
                if (response.payload[i].emailAddress !== null) {
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