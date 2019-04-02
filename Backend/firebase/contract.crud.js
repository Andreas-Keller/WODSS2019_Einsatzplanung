const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let contracts = firebase.db.collection('contracts');

const getContracts = async () => {
    return crud.getAll(contracts);
};

const getContract = async (id) => {
    return await crud.findBy("id", id)
};

//TODO implement id correct
const createContract = async (contract) => {
    let data = {
        id: '',
        startDate: contract.startDate,
        endDate: contract.endDate,
        pensumPercentage: contract.pensumPercentage,
        employeeId: contract.employeeId
    };

    return await crud.create(data, contracts);
};

const updateContract = async (contract) => {
    let data = {
        startDate: contract.startDate,
        endDate: contract.endDate,
        pensumPercentage: contract.pensumPercentage,
        employeeId: contract.employeeId
    };

    return await crud.update(data, contracts);
};

const deleteContract = async (id) => {
    return await crud.deleteEntity(id, contracts);
};

const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, contracts);
};

module.exports = {
    getContracts,
    getContract,
    createContract,
    updateContract,
    deleteContract,
    findBy
};