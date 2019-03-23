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
exports.handler = function createEmployee(req, res, next) {
  res.send('createEmployee')
  next()
}
