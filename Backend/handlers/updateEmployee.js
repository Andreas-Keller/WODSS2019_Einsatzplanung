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
        //rawPassword: req.query.password,
        active: req.body.active,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        id: String(req.params.id)
    };

    if (employee.active == null ||
        employee.firstName == null ||
        employee.lastName == null ||
        employee.emailAddress == null ||
        employee.id == null) {
      res.status(412).send("Precondition for the employee failed");
    } else {
      let response = await fb.updateEmployee(employee);
      res.status(response.httpStatus).send(response.payload);
    }

    next();
}
