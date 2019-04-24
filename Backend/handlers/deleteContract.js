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
    const afb = require('../firebase/allocation.crud');
    let contract = await fb.getContract(req.params.id);
    if (contract.httpStatus != 200) {
        res.status(contract.httpStatus).send(contract.payload);
    } else {
        let allocations = await afb.findAllBy("contractId", contract.payload.id)
        if (allocations.payload.length == 0) {
            let response = await fb.deleteContract(req.params.id);
            res.status(204).send(response.payload);
        } else {
            res.status(412).send("Precondition for the contract failed");
        }
    }
    next();
}
