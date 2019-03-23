/**
 * Create a new allocation
 *
 * POST: /api/allocation
 * 
 * body:
 *   id {int64} Allocation ID.
 *   startDate {date} Allocation start date (YYYY-MM-DD).
 *   endDate {date} Allocation end date (YYYY-MM-DD).
 *   pensumPercentage {int64} Full time equivalent for the contract as percentage value (0.5 FTE = 50).
 *   contractId {int64} Contract ID of the allocation.
 *   projectId {int64} Project ID of the allocation.
 *   
 */
exports.handler = function createAllocation(req, res, next) {
  res.send('createAllocation')
  next()
}
