/**
 * Get all employees
 *
 * GET: /api/employee
 *
 * query:
 *   role {string} Filter the employees by role).
 *
 */

const controller = require('../mongodb/controllers/employee.controller')
//todo add controller for datastore

exports.handler = function getEmployees(req, res, next) {
  controller.getEmployees(req, res, next)
}
