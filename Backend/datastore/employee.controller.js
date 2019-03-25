const Employee = require('./employee.schema.js');

const getEmployees = (req ,res) => {
    const pageCursor = req.query.cursor;

    // List employees with the Query settings defined on Schema
    Employee.list({ start: pageCursor })
        .then((entities) => {
            res.json(entities);
        })
        .catch(err => res.status(412).json(err));
};

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
    deleteEmployee
};