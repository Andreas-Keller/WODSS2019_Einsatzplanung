const firebase = require('./firebase.admin.js');
const uuidv4 = require('uuid/v4');

const getContracts = () => {
    let contracts = firebase.db.collection('contracts');
    return contracts.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data())
            });
        })
        .catch(error => {
            console.log('Error getting contracts', error);
            return 500;
        });
};

const getContract = (id) => {
    let contract = firebase.db.collection('contracts')
    return contract.where('id', '==', id).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching data.');
                return 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting contract', error);
            return 500;
        });
};

const createContract  = (contract) => {
    let data = {
        id: uuidv4(),
        startDate: contract.startDate,
        endDate: contract.endDate,
        pensumPercentage: contract.pensumPercentage,
        employeeId: contract.employeeId
    };

    contract = firebase.db.collection('contracts')
        .doc(data.id)
        .set( {data}, {merge: true});
    return contract;
};

const updateContract = (contract) => {
    let data = {
        startDate: contract.startDate,
        endDate: contract.endDate,
        pensumPercentage: contract.pensumPercentage,
        employeeId: contract.employeeId
    };

    return firebase.db.collection('contracts')
        .doc(contract.id)
        .update({ data });
};

const deleteContract = (id) => {
    let data = {
        startDate: null,
        endDate: null,
        pensumPercentage: null,
        contractId: null,
        projectId: null
    };

    return firebase.db.collection('contracts')
        .doc(id)
        .update({ data })
};

const findBy = (lookupVar, value) => {
    let contracts = firebase.db.collection('contracts');
    return contracts.where("" + lookupVar, '==', value).get()
        .then(snapshot => {
            if (snapshot.empty)  {
                console.log('No matching data.');
                return 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(error => {
            console.log('Error getting contract', error);
            return 500;
        });
};

module.exports = {
    getContracts,
    getContract,
    createContract,
    updateContract,
    deleteContract,
    findBy
};