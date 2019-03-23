/**
 * Delete a specific project including all associated allocations (Note: Cascading delete)
 *
 * DELETE: /api/project/{id}
 * 
 * path:
 *   id {int64} ID of the project to be deleted.
 *   
 */
exports.handler = function deleteProject(req, res, next) {
  res.send('deleteProject')
  next()
}
