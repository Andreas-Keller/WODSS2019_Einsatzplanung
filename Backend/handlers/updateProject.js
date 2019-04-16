/**
 * Update a specific project. If the end date is changed to an earlier date in the future (Before now&#x2F;past is not possible), all future allocations will be deleted and the end of pending allocations will be set to the new project end (Represents a project end)
 *
 * PUT: /api/project/{id}
 *
 * path:
 *   id {int64} ID of the project to be updated.
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
exports.handler = async function updateProject(req, res, next) {
    let project = {
        name: req.body.name,
        ftePercentage: req.body.ftePercentage,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        projectManagerId: req.body.projectManagerId
    };

    const projectFirebase = require('../firebase/project.crud.js');
    if (project.name === null ||
        project.ftePercentage === null ||
        project.startDate === null ||
        project.endDate === null ||
        project.projectManagerId) {
        res.status(412).send("Precondition for the project failed");
    } else {
        let updateProject = await projectFirebase.updateAllocation(project);
        res.send(updateProject.httpStatus).send(updateProject.payload);
    }

    next()
};
