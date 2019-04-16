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
  const fb = require('../firebase/contract.crud.js');
  let contract = {
    pensumPercentage: req.body.pensumPercentage,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    employeeId: req.body.employeeId,
    id: String(req.params.id)
  };

  if (contract.pensumPercentage == null ||
      contract.startDate == null ||
      contract.endDate == null ||
      contract.employeeId == null ||
      contract.id == null) {
    res.status(412).send("Precondition for the contract failed");
  } else {
    let response = await fb.updateContract(contract);
    res.status(response.httpStatus).send(response.payload);
  }
  next()
};
