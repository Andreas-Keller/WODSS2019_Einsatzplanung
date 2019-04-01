const Employee = require('../domain/employee.js');

const getEmployees = (req ,res, next) => {

    //const pageCursor = req.query.cursor;

    if (req.query.role === undefined) {
        Employee.find((err, employees) => {
            if(err) {
                res.status(412).json(err)
            }
            //res.set("Content-Type", "application/json")
            res.json(employees)
        })
    } else {
        console.log(req.query.role);
        Employee.find({role: req.query.role}, null, function(err, employees) {
            if(err) {
                res.status(412).json(err)
            }

            res.json(employees);
        });
    }
    

    //next()
};
/*
const getEmployeeForJWT = (req ,res, next) => {

    //console.log(req.body.emailAddress);
    Employee.find((err, employees) => {
        if(err) {
            //res.status(412).json(err)
        }
        return employees.filter( e => e.emailAddress === req.body.emailAddress);
    })
    //next()
};

*/



// from datastore controller
const getEmployee = (req, res) => {
    const employeeId = +req.params.id;
    Employee.get(employeeId)
        .populate('address') // Retrieve the reference entity
        .then((entity) => {
            res.json(entity.plain());
        })
        .catch(err => res.status(412).json(err));
};

const createEmployee = (req, res) => {
    const entityData = Employee.sanitize(req.body);
    const employee = new Employee(entityData);

    employee.save()
        .then((entity) => {
            res.json(entity.plain());
        })
        .catch((err) => {
            // If there are any validation error on the schema
            // they will be in this error object
            res.status(412).json(err);
        })
};

const updateEmployee = (req, res) => {
    const employeeId = +req.params.id;
    const entityData = Employee.sanitize(req.body); // { email: 'john@snow.com' }

    /**
     * This will fetch the entity, merge the data and save it back to the Datastore
     */
    Employee.update(employeeId, entityData)
        .then((entity) => {
            res.json(entity.plain());
        })
        .catch((err) => {
            // If there are any validation error on the schema
            // they will be in this error object
            res.status(412).json(err);
        });
};

const deleteEmployee = (req, res) => {
    const userId = +req.params.id;
    Employee.delete(userId)
        .then((response) => {
            res.json(response);
        })
        .catch(err => res.status(412).json(err));
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    //getEmployeeForJWT
};
