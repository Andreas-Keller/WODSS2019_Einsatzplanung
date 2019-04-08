/**
 * Delete a specific allocation
 *
 * DELETE: /api/allocation/{id}
 *
 * path:
 *   id {int64} ID of the allocation to be deleted.
 *
 */
exports.handler = async function deleteAllocation(req, res, next) {
    const fb = require('../firebase/allocation.crud');
    let response = await fb.deleteAllocation(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
}
