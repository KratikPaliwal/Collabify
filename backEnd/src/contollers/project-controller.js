const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Project } = require('../models/project.model.js');
const { z } = require('zod'); 
const { isValidObjectId } = require('mongoose');

const createProject = asyncHandler( async (req, res) => {
    // project title, description, duration, requiredRoles
    // ans user already login hi rhe ga
    // then create post 
    // and return

    const { title, description, duration, requiredRoles } = req.body;

    const owner = req.user._id;

    const requiredBody = z.object({
        title : z.string().min(3),
        description : z.string().min(3),
        duration : z.number(),
        requiredRoles : z.array(z.string())
    })

    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataSuccess.success) {
        throw new ApiError(401, `Invalid data format : ${parsedDataSuccess.error}`)
    }

    // check ki saara data aaya hai ki nhi
    if (!title || !description) {
        throw new ApiError(401, "All Field are required");
    }

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
        throw new ApiError(401, "requiredRoles are required");
    }

    const project = await Project.create({
        title,
        description,
        creator : owner,
        duration : duration || " ",
        requiredRoles
    });

    // return res
    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "successfully created a post"
        )
    );

})

const getAllProjects = asyncHandler( async (req, res) => {
    // user phele se authenticated rhe ga
    // then saare posts find krna hai
    // then return krna hai

    const projects = await Project.find({});

    // check ki projects mili ya nhi
    if (!Array.isArray(projects) || projects.length === 0) {
        throw new ApiError(401, "Not found any Project");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            projects,
            "Successfully fetched all projects"
        )
    );

})

const getProjectById = asyncHandler( async (req, res) => {
    // user phele se login hai
    // params se aage ga projectId
    // usko Project db mai find krna hai
    // mile toh return krna hai
    // nhi toh nhi return krn ahai

    const { ProjectId } = req.params;

    if (isValidObjectId(ProjectId)) {
        throw new ApiError(401, "Invalid Project Id");
    }

    const project = await Project.findById(ProjectId);

    // check ki projext mila ya nhi
    if (!project) {
        throw new ApiError(401, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "Successfully founded Project"
        )
    );

})

const updateProject = asyncHandler( async (req, res) => {
    // update only title, description, requiredRoles, duration
    // user phele se register kre ga
    // then project ko find kro and update the details
    // and return response that project is details is updated

    const { projectId } = req.params;

    if (isValidObjectId(projectId)) {
        throw new ApiError(401, "Invalid project Id");
    }

    const { title, description, requiredRoles, duration } = req.body;

    const requiredBody = z.object({
        title : z.string().min(3),
        description : z.string().min(3),
        duration : z.number(),
        requiredRoles : z.array(z.string())
    })

    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataSuccess.success) {
        throw new ApiError(401, `Invalid data format : ${parsedDataSuccess.error}`);
    }

    if (!title || !description) {
        throw new ApiError(401, "All Fields are required");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(401, "Project not found");
    }

    if(project.creator.equals(req.user?._id)) {
        throw new ApiError(401, "Unauthorized access to project");
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.duration = duration || project.duration;
    project.requiredRoles = requiredRoles || project.requiredRoles;

    await project.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "Successfully updated the project details"
        )
    );

})

const deleteProject = asyncHandler( async (req, res) => {
    // user phele se login hai
    // projectid bheje ga params mai
    // then project ko find kre gai
    // delete kr denge
    // return res

    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(401, "Invalid Project Id");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(401, "Project not found")
    }

    await project.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Successfully deleted a project"
        )
    );
    
})

const addMemberToProject = asyncHandler( async (req, res) => {

})

const removeMemberFromProject = asyncHandler( async (req, res) => {

})

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMemberToProject,
    removeMemberFromProject
}