/**
 * Delete a specific allocation
 *
 * DELETE: /api/allocation/{id}
 * 
 * path:
 *   id {int64} ID of the allocation to be deleted.
 *   
 */
exports.handler = function deleteAllocation(req, res, next) {
  res.send('deleteAllocation')
  next()
}
