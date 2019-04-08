/**
 * Delete a specific project including all associated allocations (Note: Cascading delete)
 *
 * DELETE: /api/project/{id}
 *
 * path:
 *   id {int64} ID of the project to be deleted.
 *
 */
exports.handler = async function deleteProject(req, res, next) {
    const fb = require('../firebase/project.crud');
    let response = await fb.deleteProject(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
}
