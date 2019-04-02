const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let allocations = firebase.db.collection('allocations');

const getAllocations = async () => {
    return crud.getAll(allocations);
};

const getAllocation = async (id) => {
    return await crud.findBy("id", id)
};

//TODO implement id correct
const createAllocation = async (allocation) => {
    let data = {
        id: '',
        startDate: allocation.startDate,
        endDate: allocation.endDate,
        pensumPercentage: allocation.pensumPercentage,
        contractId: allocation.contractId,
        projectId: allocation.projectId
    };

    return await crud.create(data, allocations);
};

const updateAllocation = async (allocation) => {
    let data = {
        startDate: allocation.startDate,
        endDate: allocation.endDate,
        pensumPercentage: allocation.pensumPercentage,
        contractId: allocation.contractId,
        projectId: allocation.projectId
    };

    return await crud.update(data, allocations);
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