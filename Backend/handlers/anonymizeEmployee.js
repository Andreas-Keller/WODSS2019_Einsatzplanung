/**
 * Anonymize an employee (Note: No entities will be deleted)
 *
 * DELETE: /api/employee/{id}
 * 
 * path:
 *   id {int64} ID of the employee to be anonymized.
 *   
 */
exports.handler = function anonymizeEmployee(req, res, next) {
  res.send('anonymizeEmployee')
  next()
}
