/**
 * Delete a specific contract (Note: The contract can only be deleted as long as he is not used for an allocation)
 *
 * DELETE: /api/contract/{id}
 * 
 * path:
 *   id {int64} ID of the contract to be deleted.
 *   
 */
exports.handler = function deleteContract(req, res, next) {
  res.send('deleteContract')
  next()
}
