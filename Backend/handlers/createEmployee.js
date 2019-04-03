/**
 * Create a new employee
 *
 * POST: /api/employee
 *
 * query:
 *   password {string} Password of the new employee.
 *   role {string} Role of the new employee.
 *
 * body:
 *   active {boolean}
 *   id {int64} Employee ID.
 *   firstName {string} Employee first name.
 *   lastName {string} Employee last name.
 *   emailAddress {string} Employee email address.
 *   role {string} Single employee role.
 *
 */
exports.handler = async function createEmployee(req, res, next) {
    let employee = {
        rawPassword: req.query.password,
        role: req.query.role,
        active: req.body.active,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress
    };

    if (employee.active === null ||
        employee.firstName === null ||
        employee.lastName === null ||
        employee.emailAddress === null ||
        employee.role === null ||
        employee.rawPassword === null) {
        res.status(412).send("Precondition for the employee failed");
    } else {
        const employeeFirebase = require('../firebase/employee.crud.js');
        let foundUser = (await employeeFirebase.findBy("emailAddress", employee.emailAddress));
        if (foundUser.httpStatus === 500) {
            res.status(foundUser.httpStatus).send('Uncaught or internal server error');
        } else if (foundUser.httpStatus === 404) {
            let createdEmployee = (await employeeFirebase.createEmployee(employee));
            res.status(createdEmployee.httpStatus).send(createdEmployee.payload);
        }
        else {
            res.status(404).send("User with same email already registered")
        }
    }
    next()
};
