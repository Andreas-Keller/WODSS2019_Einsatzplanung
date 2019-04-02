const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let projects = firebase.db.collection('projects');

const getProjects = async () => {
    return crud.getAll(projects);
};

const getProject = async (id) => {
    return await crud.findBy("id", id)
};

//TODO implement id correct
const createProject = async (project) => {
    let data = {
        id: '',
        name: project.name,
        ftePercentage: project.ftePercentage,
        startDate: project.startDate,
        endDate: project.endDate,
        projectManagerId: project.projectManagerId
    };

    return await crud.create(data, projects);
};

const updateProject = async (project) => {
    let data = {
        name: project.name,
        ftePercentage: project.ftePercentage,
        startDate: project.startDate,
        endDate: project.endDate,
        projectManagerId: project.projectManagerId
    };

    return await crud.update(data, projects);
};

const deleteProject = async (id) => {
    return await crud.deleteEntity(id, projects);
};

const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, projects);
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    findBy
};