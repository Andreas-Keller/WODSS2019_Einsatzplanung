const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let allocations = firebase.db.collection('allocations');

const getAllocations = async () => {
    return crud.getAll(allocations);
};

const getAllocation = async (id) => {
    return await crud.findBy("id", String(id), allocations)
};

const createAllocation = async (allocation) => {
    return await crud.create(allocation, allocations);
};

const updateAllocation = async (allocation) => {
    return await crud.update(allocation, allocations);
};

const deleteAllocation = async (id) => {
    return await crud.deleteEntity(id, allocations);
};

const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, allocations);
};

module.exports = {
    getAllocations,
    getAllocation,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    findBy
};