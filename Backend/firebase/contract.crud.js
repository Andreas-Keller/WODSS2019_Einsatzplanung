const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let contracts = firebase.db.collection('contracts');

const getContracts = async () => {
    return crud.getAll(contracts);
};

const getContract = async (id) => {
    return await crud.findBy("id", String(id), contracts)
};

const createContract = async (contract) => {
    return await crud.create(contract, contracts);
};

const updateContract = async (contract) => {
    return await crud.update(contract, contracts);
};

const deleteContract = async (id) => {
    return await crud.deleteEntity(id, contracts);
};

const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, contracts);
};

const findAllBy = async (lookupVar, value) => {
    return await crud.findAllBy(lookupVar, value, contracts);
};
module.exports = {
    getContracts,
    getContract,
    createContract,
    updateContract,
    deleteContract,
    findBy,
    findAllBy,
    contracts
};