/**
 * Get a specific contract
 *
 * GET: /api/contract/{id}
 * 
 * path:
 *   id {int64} ID of the contract.
 *   
 */
exports.handler = function getContract(req, res, next) {
  res.send('getContract')
  next()
}
