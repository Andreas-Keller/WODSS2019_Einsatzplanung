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
exports.handler = async function updateAllocation(req, res, next) {
    let allocation = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        pensumPercentage: req.body.pensumPercentage,
        contractId: req.body.contractId,
        projectId: req.body.projectId
    };

    const allocationFirebase = require('../firebase/allocation.crud.js');
    if (allocation.startDate === null ||
        allocation.endDate === null ||
        allocation.pensumPercentage === null ||
        allocation.contractId === null ||
        allocation.projectId === null) {
        res.status(412).send("Precondition for the allocation failed");
    } else {
        let updateAllocation = await allocationFirebase.updateAllocation(allocation);
        res.send(updateAllocation.httpStatus).send(updateAllocation.payload);
    }

    next()
};
