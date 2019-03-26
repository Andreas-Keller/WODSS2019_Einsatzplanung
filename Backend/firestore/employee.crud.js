const firestore = require('./firestore.admin.js');
const uuidv4 = require('uuid/v4');

const getEmployees = () => {
    let employees = firestore.db.collection('employees');
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
    let employees = firestore.db.collection('employees');
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
    if (employee.active !== null &&
        employee.firstName !== null &&
        employee.lastName !== null &&
        employee.emailAddress !== null &&
        employee.role !== null &&
        employee.rawPassword !== null) {

        let data = {
            active: employee.active,
            id: uuidv4(),
            firstName: employee.firstName,
            lastName: employee.lastName,
            emailAddress: employee.emailAddress,
            role: employee.role,
            password: employee.rawPassword
        };

        employee = firestore.db.collection('employees')
            .doc(data.id)
            .set({data}, {merge: true});
        return employee;
    } else {
        return false;
    }
};
const updateEmployee = (employee) => {
    if (employee.active !== null &&
        employee.id !== null &&
        employee.firstName !== null &&
        employee.lastName !== null &&
        employee.emailAddress !== null &&
        employee.rawPassword !== null) {

        let data = {
            active: employee.active,
            firstName: employee.firstName,
            lastName: employee.lastName,
            emailAddress: employee.emailAddress,
            password: employee.rawPassword
        };

        return firestore.db.collection('employees')
            .doc(employee.id)
            .update({
                data
            });
    } else {
        return false;
    }
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

    return firestore.db.collection('employees')
        .doc(id)
        .update({
            data
        });
};
const findBy = (lookupVar, value) => {
    let employees = firestore.db.collection('employees');
    return employees.where("" + lookupVar, '==', value).get()
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

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    findBy
};