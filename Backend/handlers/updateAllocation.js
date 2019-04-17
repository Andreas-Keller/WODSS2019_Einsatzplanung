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
        pensumPercentage: req.body.pensumPercentage,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        projectId: req.body.projectId,
        contractId: req.body.contractId,
        id: String(req.params.id)
    };

    if (allocation.pensumPercentage === null ||
        allocation.startDate === null ||
        allocation.endDate === null ||
        allocation.projectId === null ||
        allocation.contractId === null ||
        allocation.id === null) {
        res.status(412).send("Precondition for the allocation failed");

    } else {
        const allocationFirebase = require('../firebase/allocation.crud.js');
        let foundAllocation = await allocationFirebase.getAllocation(allocation.id);
        const contractFirebase = require('../firebase/contract.crud.js');
        let foundContract = await contractFirebase.getContract(allocation.contractId);
        const projectFirebase = require('../firebase/project.crud.js');
        let foundProject = await projectFirebase.getProject(allocation.projectId);

        if (foundAllocation.httpStatus === 500 ||
            foundContract.httpStatus === 500 ||
            foundProject.httpStatus === 500) {
            res.status(500).send("Uncaught or internal server error");

        } else if (foundAllocation.httpStatus === 404 ||
                    foundContract.httpStatus === 404 ||
                    foundProject.httpStatus === 404) {
            res.status(404).send("Allocation, contract or project not found");

        } else {
            let updatedAllocation = await allocationFirebase.updateAllocation(allocation);
            res.status(updatedAllocation.httpStatus).send(updatedAllocation.payload);
        }
    }
    next()
};
