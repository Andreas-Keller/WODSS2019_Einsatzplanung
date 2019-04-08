/**
 * Update a specific employee
 *
 * PUT: /api/employee/{id}
 *
 * path:
 *   id {int64} ID of the employee to be updated.
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
exports.handler = async function updateEmployee(req, res, next) {
    const fb = require('../firebase/employee.crud.js');
    let employee = {
        rawPassword: req.query.password,
        role: req.query.role,
        active: req.body.active,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        id: req.body.id
    };

    if (employee.active == null ||
        employee.firstName == null ||
        employee.lastName == null ||
        employee.emailAddress == null ||
        employee.role == null ||
        employee.rawPassword == null ||
        employee.id == null) {
        res.status(412).send("Precondition for the employee failed");
    }

    let response = await fb.updateEmployee(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
}
