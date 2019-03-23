/**
 * Get a specific allocation
 *
 * GET: /api/allocation/{id}
 * 
 * path:
 *   id {int64} ID of the allocation.
 *   
 */
exports.handler = function getAllocation(req, res, next) {
  res.send('getAllocation')
  next()
}
