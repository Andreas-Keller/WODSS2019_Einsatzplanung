const firebase = require('./firebase.admin.js');
const uuidv4 = require('uuid/v4');

const getProjects = () => {
    let projects = firebase.db.collection('projects');
    return projects.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data())
            });
        })
        .catch(error => {
            console.log('Error getting projects', error);
            return 500;
        });
};

const getProject = (id) => {
    let project = firebase.db.collection('projects')
    return project.where('id', '==', id).get()
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
            console.log('Error getting project', error);
            return 500;
        });
};

const createProject  = (project) => {
    let data = {
        id: uuidv4(),
        name: project.name,
        ftePercentage: project.ftePercentage,
        startDate: project.startDate,
        endDate: project.endDate,
        projectManagerId: project.projectManagerId
    };

    project = firebase.db.collection('projects')
        .doc(data.id)
        .set( {data}, {merge: true});
    return project;
};

const updateProject = (project) => {
    let data = {
        name: project.name,
        ftePercentage: project.ftePercentage,
        startDate: project.startDate,
        endDate: project.endDate,
        projectManagerId: project.projectManagerId
    };

    return firebase.db.collection('projects')
        .doc(project.id)
        .update({ data });
};

const deleteProject = (id) => {
    let data = {
        name: null,
        ftePercentage: null,
        startDate: null,
        endDate: null,
        projectManagerId: null
    };

    return firebase.db.collection('projects')
        .doc(id)
        .update({ data })
};

const findBy = (lookupVar, value) => {
    let projects = firebase.db.collection('projects');
    return projects.where("" + lookupVar, '==', value).get()
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
            console.log('Error getting project', error);
            return 500;
        });
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    findBy
};