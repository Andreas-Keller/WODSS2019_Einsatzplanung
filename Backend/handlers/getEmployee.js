/**
 * Get a specific employee
 *
 * GET: /api/employee/{id}
 * 
 * path:
 *   id {int64} ID of the employee.
 *   
 */
exports.handler = function getEmployee(req, res, next) {
  res.send('getEmployee')
  next()
}
