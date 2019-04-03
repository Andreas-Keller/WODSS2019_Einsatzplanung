/**
 * Get all projects
 *
 * GET: /api/project
 *
 * query:
 *   projectManagerId {int64} Filter the projects by a project manager ID.
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Projects with a start date bef...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Projects with a start date befo...
 *
 */
exports.handler = async function getProjects(req, res, next) {
  const projectFirebase = require('../firebase/project.crud.js');
  res.status(200).send(await projectFirebase.getProjects());
  //res.send('getProjects')
  next()
}
