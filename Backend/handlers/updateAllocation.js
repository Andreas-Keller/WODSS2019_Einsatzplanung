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
        startDate: String(req.body.startDate),
        endDate: String(req.body.endDate),
        projectId: String(req.body.projectId),
        contractId: String(req.body.contractId),
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

        } else if (foundContract.payload.startDate > allocation.startDate //date boundary checks
            || foundContract.payload.startDate > allocation.endDate
            || foundContract.payload.endDate < allocation.startDate
            || foundContract.payload.endDate < allocation.endDate) {
            res.status(412).send("Precondition for the allocation failed");

        } else {
            //check if updated allocation pensum fits in fte of project
            let projectAllocations = await allocationFirebase.findAllBy('projectId', allocation.projectId);
            let ftePercentage = 0;
            for (const x of projectAllocations.payload) {
                if (!(x.id === allocation.id)) {
                    ftePercentage += x.pensumPercentage;
                }
            }
            if (ftePercentage + allocation.pensumPercentage > foundProject.payload.ftePercentage * 100) {
                res.status(412).send("Precondition for the allocation failed");

            } else {
                //check if employee is allowed to add allocation
                let allEmployeeAllocations = await allocationFirebase.findAllBy('contractId', foundContract.payload.id);

                let canUpdate = true;

                //sorting allocations by date
                let d = [];
                for (const c of allEmployeeAllocations.payload) {
                    if (!(c.id === allocation.id)) {
                        d.push({date: c.startDate, p: c.pensumPercentage});
                        d.push({date: c.endDate, p: -c.pensumPercentage});
                    }
                }
                d.push({date: allocation.startDate, p: allocation.pensumPercentage});
                d.push({date: allocation.endDate, p: -allocation.pensumPercentage});

                d.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });

                //if sum over 100, cant add it
                let percentageNow = 0;
                for (const v of d) {
                    percentageNow += v.p;
                    if (percentageNow > foundContract.payload.pensumPercentage) {
                        canUpdate = false;
                    }
                }
                if (canUpdate) {
                    let updatedAllocation = await allocationFirebase.updateAllocation(allocation);
                    res.status(updatedAllocation.httpStatus).send(updatedAllocation.payload);
                } else {
                    res.status(412).send("Precondition for the allocation failed");
                }
            }
        }
    }
    next()
};
