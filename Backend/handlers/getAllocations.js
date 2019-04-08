/**
 * Get all allocations
 *
 * GET: /api/allocation
 * 
 * query:
 *   employeeId {int64} Filter the allocations by an employee (Filters can stack).
 *   projectId {int64} Filter the allocations by a project (Filters can stack).
 *   fromDate {date} Start date (YYYY-MM-DD) to create a time range with a lower boundary (Allocations with a start date ...
 *   toDate {date} End date (YYYY-MM-DD) to create a time range with an upper boundary (Allocations with a start date b...
 *   
 */
exports.handler = async function getAllocations(req, res, next) {
    const fb = require('../firebase/allocation.crud');
    let response = await fb.getAllocations();
    res.status(response.httpStatus).send(response.payload);
    next();
};
