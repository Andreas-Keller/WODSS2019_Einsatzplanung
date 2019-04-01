const firebase = require('./firebase.admin.js');
const uuidv4 = require('uuid/v4');

const getEmployees = () => {
    let employees = firebase.db.collection('employees');
    return employees.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting Employees', err);
        });
};

const getEmployee = (id) => {
    let employees = firebase.db.collection('employees');
    return employees.where('id', '==', id).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting employee', err);
            return 500;
        });
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
        .update({
            data
        });
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
        .update({
            data
        });
};
//FindBy does not work
const findBy = (lookupVar, value) => {
    let employees = firebase.db.collection('employees');
    console.log("Lookup Var: " + lookupVar);
    console.log("value Var: " + value);
    console.log(employees);
    return employees.where(lookupVar, "==", value).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                return doc;
            });

        })
        .catch(err => {
            console.log('Error getting employee', err);
            return 500;
        });
};
const findByEmail = (email) => {
    let employees = firebase.db.collection('employees');
    return employees.where("emailAddress", "==", email).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                return doc;
            });
        })
        .catch(err => {
            console.log('Error getting employee', err);
            return 500;
        });
};
module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    findBy,
    findByEmail
};