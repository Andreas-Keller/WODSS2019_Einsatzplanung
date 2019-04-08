/**
 * Get all employees
 *
 * GET: /api/employee
 *
 * query:
 *   role {string} Filter the employees by role).
 *
 */
exports.handler = async function getEmployees(req, res, next) {
    // res.send('getEmployees');
    const employeeFirebase = require('../firebase/employee.crud.js');
    let response = await employeeFirebase.getEmployees();

    console.log('params:');
    console.log(req.query.role);

    let data = response.payload;
    let array = [];

    if(req.query.role !== undefined) {
        for(let i = 0; i < response.payload.length; i++) {
            console.log(response.payload[i]);

            if(response.payload[i].role === req.query.role && response.payload[i].emailAddress !== null) {
                array.push(response.payload[i]);
            }
        }
        data = array;
    } else {
        for(let i = 0; i < response.payload.length; i++) {
            console.log(response.payload[i]);

            if(response.payload[i].emailAddress !== null) {
                array.push(response.payload[i]);
            }
        }
        data = array;
    }

    res.status(response.httpStatus).send(data);
    next()
};