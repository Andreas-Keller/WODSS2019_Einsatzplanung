const firebase = require('./firebase.admin.js');
const fbHelper = require('./firebaseHelper.js');
const crud = require('./firebase.global.crud.js');

let employees = firebase.db.collection('employees');

const getEmployees = async () => {
    return crud.getAll(employees);
};

const getEmployee = async (id) => {
    return await crud.findBy("id", id)
};

//FIXME CREATE IS BROKEN
const createEmployee = async (employee) => {
    let data = {
        active: employee.active,
        id: '',
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailAddress: employee.emailAddress,
        role: employee.role,
        password: employee.rawPassword
    };
    return await crud.create(data, employees);
};

const updateEmployee = async (employee) => {
    let data = {
        active: employee.active,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailAddress: employee.emailAddress,
        password: employee.rawPassword
    };
    return await crud.update(data, employees);
};

const deleteEmployee = async (id) => {
    let data = {
        active: false,
        firstName: null,
        lastName: null,
        emailAddress: null,
        role: null,
        password: null,
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