const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let employees = firebase.db.collection('employees');

const getEmployees = async () => {
    return crud.getAll(employees);
};

const getEmployee = async (id) => {
    return await crud.findBy("id", id)
};

const createEmployee = async (employee) => {
    return await crud.create(employee, employees);
};

const updateEmployee = async (employee) => {
    return await crud.update(employee, employees);
};

const deleteEmployee = async (id) => {
    let data = {
        active: false,
        firstName: null,
        lastName: null,
        emailAddress: null,
        role: null,
        rawPassword: null,
        id: id
    };

    return await crud.update(data, employees);
};
const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, employees);
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    findBy
};
