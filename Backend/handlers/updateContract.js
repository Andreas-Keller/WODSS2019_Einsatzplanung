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
exports.handler = async function updateContract(req, res, next) {
    let contract = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        pensumPercentage: req.body.pensumPercentage,
        employeeId: req.body.employeeId
    };

    const contractFirebase = require('../firebase/contract.crud.js');
    if (contract.startDate === null ||
        contract.endDate === null ||
        contract.pensumPercentage === null ||
        contract.employeeId === null) {
        res.status(412).send("Precondition for the contract failed");

    } else {
        let updateContract = await contractFirebase.updateContract(contract);
        res.send(updateContract.httpStatus).send(updateContract.payload);
    }

    next()
};
