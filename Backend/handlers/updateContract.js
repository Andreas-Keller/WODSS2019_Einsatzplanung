/**
 * Update a specific contract
 *
 * PUT: /api/contract/{id}
 * 
 * path:
 *   id {int64} ID of the contract to be updated.
 *   
 * body:
 *   id {int64} Contract ID.
 *   startDate {date} Contract start date (YYYY-MM-DD).
 *   endDate {date} Contract end date (YYYY-MM-DD).
 *   pensumPercentage {int32} Full time equivalent for the contract as percentage value (0.5 FTE = 50).
 *   employeeId {int64} Employee ID of the contract.
 *   
 */
exports.handler = function updateContract(req, res, next) {
  res.send('updateContract')
  next()
}
