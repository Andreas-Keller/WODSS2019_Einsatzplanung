/**
 * Anonymize an employee (Note: No entities will be deleted)
 *
 * DELETE: /api/employee/{id}
 *
 * path:
 *   id {int64} ID of the employee to be anonymized.
 *
 */
exports.handler = async function anonymizeEmployee(req, res, next) {
    const fb = require('../firebase/employee.crud.js');
    let response = await fb.deleteEmployee(req.params.id);
    res.status(response.httpStatus).send(response.payload);
    next();
};
