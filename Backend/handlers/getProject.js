/**
 * Get a specific project
 *
 * GET: /api/project/{id}
 * 
 * path:
 *   id {int64} ID of the project.
 *   
 */
exports.handler = function getProject(req, res, next) {
  res.send('getProject')
  next()
}
