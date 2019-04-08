/**
 * Get a specific contract
 *
 * GET: /api/contract/{id}
 *
 * path:
 *   id {int64} ID of the contract.
 *
 */
exports.handler = async function getContract(req, res, next) {
    const fb = require('../firebase/contract.crud');
    let response = await fb.getContract(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
};
