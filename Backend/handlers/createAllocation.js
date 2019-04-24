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
        contractId: String(req.body.contractId),
        projectId: String(req.body.projectId)
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
        res.status(foundContract.httpStatus).send('Uncaught or internal server error')
    } else if (foundContract.httpStatus === 404 || foundProject.httpStatus === 404) {
        res.status(foundContract.httpStatus).send("Contract or project not found")
    } else {
        const allocationFirebase = require('../firebase/allocation.crud.js');
        //check if new allocation fits in fte percentage of project
        let projectAllocations = await allocationFirebase.findAllBy('projectId', allocation.projectId);
        let ftePercentage = 0;
        for (const x of projectAllocations.payload) {
            ftePercentage += x.pensumPercentage;
        }
        if (ftePercentage + allocation.pensumPercentage > foundProject.payload.ftePercentage * 100) {
            res.status(412).send("Precondition for the allocation failed");
        } else {
            //check if employee is allowed to add allocation
            let allEmployeeAllocations = await allocationFirebase.findAllBy('contractId', foundContract.payload.id);

            let canCreate = true;

            //sorting allocations by date
            let d = [];
            allEmployeeAllocations.payload.push(allocation);
            for (const c of allEmployeeAllocations.payload) {
                d.push({date: c.startDate, p: c.pensumPercentage});
                d.push({date: c.endDate, p: -c.pensumPercentage});
            }
            d.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            console.log(d)

            //if sum over 100, cant add it
            let percentageNow = 0;
            for (const v of d) {
                percentageNow += v.p;
                if (percentageNow > foundContract.payload.pensumPercentage) {
                    canCreate = false;
                }
            }
            if (canCreate) {
                let createdAllocation = await allocationFirebase.createAllocation(allocation);
                res.status(createdAllocation.httpStatus).send(createdAllocation.payload);
            } else {
                res.status(412).send("Precondition for the allocation failed");
            }
        }
    }
    next()
};
