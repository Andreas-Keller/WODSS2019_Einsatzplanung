/**
 * Create a new contract
 *
 * POST: /api/contract
 *
 * body:
 *   id {int64} Contract ID.
 *   startDate {date} Contract start date (YYYY-MM-DD).
 *   endDate {date} Contract end date (YYYY-MM-DD).
 *   pensumPercentage {int32} Full time equivalent for the contract as percentage value (0.5 FTE = 50).
 *   employeeId {int64} Employee ID of the contract.
 *
 */

exports.handler = async function createContract(req, res, next) {
    let contract = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        pensumPercentage: req.body.pensumPercentage,
        employeeId: String(req.body.employeeId)
    };
    const employeeFirebase = require('../firebase/employee.crud.js');
    let employee = await employeeFirebase.getEmployee(contract.employeeId);
    if (contract.startDate === null ||
        contract.endDate === null ||
        contract.pensumPercentage === null ||
        contract.employeeId === null) {
        res.status(412).send("Precondition for the contract failed");

    } else if (employee.httpStatus === 500) {
        res.status(employee.httpStatus).send("Uncaught or internal server error")

    } else if (employee.httpStatus === 404) {
        res.status(employee.httpStatus).send("Employee not found")

    } else {//check if contract starts/ends in another contract or if the contract is active while another is
        let employeeContracts = await require('../firebase/contract.crud').findAllBy('employeeId', employee.payload.id);
        let canCreate = true;
        for (const c of employeeContracts.payload) {
            if ((contract.startDate >= c.startDate && contract.startDate <= c.endDate) || (contract.endDate >= c.startDate && contract.endDate <= c.endDate)) {
                canCreate = false;
            }
            if ((c.startDate >= contract.startDate && c.endDate <= contract.startDate) || (c.startDate >= contract.endDate && c.endDate <= contract.endDate)) {
                canCreate = false;
            }
            console.log(contract.startDate >= c.startDate && contract.startDate <= c.endDate);
            console.log(contract.endDate >= c.startDate && contract.endDate <= c.endDate);
        }
        if (canCreate) {
            const contractFirebase = require('../firebase/contract.crud.js');
            let response = await contractFirebase.createContract(contract)
            res.status(response.httpStatus).send(response.payload);
        } else {
            res.status(412).send("Precondition for the contract failed");
        }
    }
    next()
};
