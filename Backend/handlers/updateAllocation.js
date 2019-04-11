/**
 * Update a specific allocation
 *
 * PUT: /api/allocation/{id}
 *
 * path:
 *   id {int64} ID of the allocation to be updated.
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
exports.handler = async  function updateAllocation(req, res, next) {
  const fb = require('../firebase/allocation.crud.js');
  let allocation = {
    //rawPassword: req.query.password,
    pensumPercentage: req.body.pensumPercentage,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    projectId: req.body.projectId,
    contractId: req.body.contractId,
    id: String(req.params.id)
  };

  if (allocation.pensumPercentage == null ||
      allocation.startDate == null ||
      allocation.endDate == null ||
      allocation.projectId == null ||
      allocation.contractId == null ||
      allocation.id == null) {
    res.status(412).send("Precondition for the allocation failed");
  } else {
    let response = await fb.updateAllocation(allocation);
    res.status(response.httpStatus).send(response.payload);
  }
  next()
}
