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
    const afb = require('../firebase/allocation.crud');
    let project = await fb.getProject(req.params.id);
    if (project.httpStatus != 200) {
        res.status(project.httpStatus).send(project.payload);
    } else {
        let allocations = await afb.findAllBy("projectId", project.payload.id)
        for (const a of allocations.payload) {
            await afb.deleteAllocation(a.id);
        }
        let response = await fb.deleteProject(req.params.id);
        res.status(204).send(response.payload);
    }
    next();
};
