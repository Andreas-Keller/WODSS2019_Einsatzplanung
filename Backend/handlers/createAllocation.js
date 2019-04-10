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

exports.handler = async function createAllocation(req, res, next) {
    let allocation = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        pensumPercentage: req.body.pensumPercentage,
        contractId: req.body.contractId,
        projectId: req.body.projectId
    };

    const contractFirebase = require('../firebase/contract.crud.js');
    const projectFirebase = require('../firebase/project.crud.js');
    let foundContract = await contractFirebase.getContract(allocation.contractId);
    let foundProject = await projectFirebase.getProject(allocation.projectId)
    if (allocation.startDate === null ||
        allocation.endDate === null ||
        allocation.pensumPercentage === null ||
        allocation.contractId === null ||
        allocation.projectId === null) {
        res.status(412).send("Precondition for the allocation failed");

    } else if (foundContract.httpStatus === 500 || foundProject.httpStatus === 500) {
        res.status(500).send('Uncaught or internal server error')

    } else if (foundContract.httpStatus === 404 || foundProject.httpStatus === 404) {
        res.status(404).send("Contract or project not found")

    } else {
        const allocationFirebase = require('../firebase/allocation.crud.js');
        let createdAllocation = await allocationFirebase.createAllocation(allocation);
        res.status(createdAllocation.httpStatus).send(createdAllocation.payload);
    }
    next()
};
