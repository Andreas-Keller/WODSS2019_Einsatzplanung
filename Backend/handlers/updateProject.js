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
        name: String(req.body.name),
        ftePercentage: req.body.ftePercentage,
        startDate: String(req.body.startDate),
        endDate: String(req.body.endDate),
        projectManagerId: String(req.body.projectManagerId),
        id: String(req.params.id)
    };

    if (project.name === null ||
        project.ftePercentage === null ||
        project.startDate === null ||
        project.endDate === null ||
        project.projectManagerId === null ||
        project.id === null) {
        res.status(412).send("Precondition for the project failed");

    } else {
        const projectFirebase = require('../firebase/project.crud.js');
        let foundProject = await projectFirebase.getProject(project.id);
        const employeeFirebase = require('../firebase/employee.crud');
        let foundEmployee = await employeeFirebase.findBy('id', project.projectManagerId);

        if (foundProject.httpStatus === 500 ||
            foundEmployee.httpStatus === 500) {
            res.status(500).send("Uncaught or internal server error");

        } else if (foundProject.httpStatus === 404 ||
                    foundEmployee.httpStatus === 404 ||
                    foundEmployee.payload.role !== "PROJECTMANAGER") {
            res.status(404).send("Project or project manager not found");

        } else {
            let updatedProject = await projectFirebase.updateProject(project);
            //update allocations
            let allocationFirebase = await require('../firebase/allocation.crud.js');
            let allocations = await allocationFirebase.findAllBy('projectId', project.id);
            for (const a of allocations.payload) {
                if (a.startDate > project.endDate) {
                    await allocationFirebase.deleteAllocation(a.id);

                } else if (a.endDate > project.endDate) {
                    a.endDate = project.endDate;
                    await allocationFirebase.updateAllocation(a);
                }
            }
            res.status(updatedProject.httpStatus).send(updatedProject.payload);
        }
    }
    next()
};
