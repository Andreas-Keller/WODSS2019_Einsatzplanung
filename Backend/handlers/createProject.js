/**
 * Create a new project
 *
 * POST: /api/project
 *
 * body:
 *   id {int64} Project ID.
 *   name {string} Project name.
 *   ftePercentage {int64} Full time equivalent represented as a percentage value (1 FTE = 100% = 1 person working 1 day).
 *   startDate {date} Project start date (YYYY-MM-DD).
 *   endDate {date} Project end date (YYYY-MM-DD).
 *   projectManagerId {int64} Project manager employee ID.
 *
 */
exports.handler = async function createProject(req, res, next) {
    let project = {
        name: req.body.name,
        ftePercentage: req.body.ftePercentage,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        projectManagerId: req.body.projectManagerId
    };

    const projectFirebase = require('../firebase/project.crud.js');
    let foundProject = await projectFirebase.findBy(project.name);
    if (project.name === null ||
        project.ftePercentage === null ||
        project.startDate === null ||
        project.endDate === null ||
        project.projectManagerId) {
        res.status(412).send("Precondition for the project failed");
    } else if(foundProject.httpStatus === 500){
        res.status(foundProject.httpStatus).send('Uncaught or internal server error');

    } else {
        let response = await projectFirebase.createProject(project);
        res.status(response.httpStatus).send(response.payload);
    }
    next()
};