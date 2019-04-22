const firebase = require('./firebase.admin.js');
const crud = require('./firebase.global.crud.js');

let projects = firebase.db.collection('projects');

const getProjects = async () => {
    return crud.getAll(projects);
};

const getProject = async (id) => {
    return await crud.findBy("id", String(id), projects)
};

const createProject = async (project) => {
    return await crud.create(project, projects);
};

const updateProject = async (project) => {
    return await crud.update(project, projects);
};

const deleteProject = async (id) => {
    return await crud.deleteEntity(id, projects);
};

const findBy = async (lookupVar, value) => {
    return await crud.findBy(lookupVar, value, projects);
};

const findAllBy = async (lookupVar, value) => {
    return await crud.findAllBy(lookupVar, value, projects);
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    findBy,
    findAllBy,

    projects
};