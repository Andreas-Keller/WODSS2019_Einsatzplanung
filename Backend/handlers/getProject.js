/**
 * Get a specific project
 *
 * GET: /api/project/{id}
 *
 * path:
 *   id {int64} ID of the project.
 *
 */
exports.handler = async function getProject(req, res, next) {
    const projectFirebase = require('../firebase/project.crud.js');
    let response = await projectFirebase.getProject(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
};
