const firebase = require('./firebase.admin.js');
const uuidv4 = require('uuid/v4');

const getAllocations = () => {
    let allocations = firebase.db.collection('allocations');
    return allocations.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data())
            });
        })
        .catch(error => {
            console.log('Error getting allocations', error);
            return 500;
        });
};

const getAllocation = (id) => {
    let allocation = firebase.db.collection('allocations')
    return allocation.where('id', '==', id).get()
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
            console.log('Error getting allocation', error);
            return 500;
        });
};

const createAllocation  = (allocation) => {
    let data = {
        id: uuidv4(),
        startDate: allocation.startDate,
        endDate: allocation.endDate,
        pensumPercentage: allocation.pensumPercentage,
        contractId: allocation.contractId,
        projectId: allocation.projectId
    };

    allocation = firebase.db.collection('allocations')
        .doc(data.id)
        .set( {data}, {merge: true});
    return allocation;
};

const updateAllocation = (allocation) => {
    let data = {
        startDate: allocation.startDate,
        endDate: allocation.endDate,
        pensumPercentage: allocation.pensumPercentage,
        contractId: allocation.contractId,
        projectId: allocation.projectId
    };

    return firebase.db.collection('allocations')
        .doc(allocation.id)
        .update({ data });
};

const deleteAllocation = (id) => {
    let data = {
        startDate: null,
        endDate: null,
        pensumPercentage: null,
        contractId: null,
        projectId: null
    };

    return firebase.db.collection('allocations')
        .doc(id)
        .update({ data })
};

const findBy = (lookupVar, value) => {
    let allocations = firebase.db.collection('allocations');
    return allocations.where("" + lookupVar, '==', value).get()
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
            console.log('Error getting allocation', error);
            return 500;
        });
};

module.exports = {
  getAllocations,
  getAllocation,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  findBy
};