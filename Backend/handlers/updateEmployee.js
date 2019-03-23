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
exports.handler = function updateEmployee(req, res, next) {
  res.send('updateEmployee')
  next()
}
