/**
 * Delete a specific contract (Note: The contract can only be deleted as long as he is not used for an allocation)
 *
 * DELETE: /api/contract/{id}
 * 
 * path:
 *   id {int64} ID of the contract to be deleted.
 *   
 */
exports.handler = async function deleteContract(req, res, next) {
    const fb = require('../firebase/contract.crud');
    let response = await fb.deleteContract(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
}
