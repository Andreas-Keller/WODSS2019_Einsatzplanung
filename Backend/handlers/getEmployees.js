/**
 * Get all employees
 *
 * GET: /api/employee
 * 
 * query:
 *   role {string} Filter the employees by role).
 *   
 */
exports.handler = function getEmployees(req, res, next) {
  res.send('getEmployees');
  next()
};
