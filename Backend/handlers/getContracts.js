/**
 * Get all contracts
 *
 * GET: /api/contract
 *
 * query:
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Contracts with a start date be...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Contracts with a start date bef...
 *
 */
exports.handler = async function getContracts(req, res, next) {
    //res.send('getContracts')
    const contractFirebase = require('../firebase/contract.crud.js');
    let response = await contractFirebase.getContracts();
    res.status(response.httpStatus).send(response.payload);
    next();
}
