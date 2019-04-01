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
exports.handler = function createContract(req, res, next) {
  res.send('createContract')
  next()
}
const allocationFirebase = require('../firebase/allocation.crud.js');
const contractFirebase = require('../firebase/contract.crud.js');
const projectFirebase = require('../firebase/project.crud.js');

exports.handler = async function createContract(req, res, next) {
  let allocation = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    pensumPercentage: req.body.pensumPercentage,
    contractId: req.body.contractId,
    projectId: req.body.projectId
  };


  if (allocation.startDate === null ||
      allocation.endDate === null ||
      allocation.pensumPercentage === null ||
      allocation.contractId === null ||
      allocation.projectId === null) {
    res.status(412).send("Precondition for the allocation failed");

  } else if (contractFirebase.getContract(allocation.contractId) === 404 ||
      projectFirebase.getProject(allocation.projectId) === 404) {

    res.status(404).send("Contract or project not found")

  } else {
    res.status(201).send(await allocationFirebase.createAllocation(allocation));
  }
  next()
};