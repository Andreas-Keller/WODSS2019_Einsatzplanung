/**
 * Get a specific employee
 *
 * GET: /api/employee/{id}
 *
 * path:
 *   id {int64} ID of the employee.
 *
 */
exports.handler = async function getEmployee(req, res, next) {
    // res.send('getEmployee')
    const employeeFirebase = require('../firebase/employee.crud.js');
    console.log(req)
    let response = await employeeFirebase.getEmployee(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
};
