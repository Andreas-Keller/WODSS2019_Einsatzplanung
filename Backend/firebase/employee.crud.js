const firebase = require('./firebase.admin.js');
const uuidv4 = require('uuid/v4');

const getEmployees = async () => {
    let employees = firebase.db.collection('employees');
    let returnValue = null;
    await employees.get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                returnValue = 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
            returnValue = snapshot;
        })
        .catch(err => {
            console.log('Error getting employee', err);
            returnValue = 500;
        });
    return returnValue;
};

const getEmployee = (id) => {
    return findBy("id", id)
};

const createEmployee = (employee) => {
    let data = {
        active: employee.active,
        id: uuidv4(),
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailAddress: employee.emailAddress,
        role: employee.role,
        password: employee.rawPassword
    };

    employee = firebase.db.collection('employees')
        .doc(data.id)
        .set({data}, {merge: true});
    return employee;
};
const updateEmployee = (employee) => {
    let data = {
        active: employee.active,
        firstName: employee.firstName,
        lastName: employee.lastName,
        emailAddress: employee.emailAddress,
        password: employee.rawPassword
    };

    return firebase.db.collection('employees')
        .doc(employee.id)
        .update(
            data
        );
};

const deleteEmployee = (id) => {
    let data = {
        active: false,
        firstName: null,
        lastName: null,
        emailAddress: null,
        role: null,
        password: null
    };

    return firebase.db.collection('employees')
        .doc(id)
        .update(
            data
        );
};
const findBy = async (lookupVar, value) => {
    let employees = firebase.db.collection('employees');
    let returnValue = null;
    await employees.where(lookupVar, '==', value).limit(1).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents. (findBy)');
                returnValue = 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                returnValue = doc;
            });
        })
        .catch(err => {
            console.log('Error getting employee', err);
            returnValue = 500;
        });
    return returnValue;
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    findBy
};