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
    res.status(200).send(await employeeFirebase.getEmployee(req.query.id));
    next()
};
