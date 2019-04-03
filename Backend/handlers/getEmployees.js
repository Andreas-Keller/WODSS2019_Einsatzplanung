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
    // res.send('getEmployees');
    const employeeFirebase = require('../firebase/employee.crud.js');
    let response = await employeeFirebase.getEmployees();
    res.status(response.httpStatus).send(response.payload);
    next()
};