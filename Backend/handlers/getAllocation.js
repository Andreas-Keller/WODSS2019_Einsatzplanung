/**
 * Get a specific allocation
 *
 * GET: /api/allocation/{id}
 * 
 * path:
 *   id {int64} ID of the allocation.
 *   
 */
exports.handler = async function getAllocation(req, res, next) {
    const fb = require('../firebase/allocation.crud');
    let response = await fb.getAllocation(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
}
