const { asyncHandler } = require('../utils/asyncHandler.js');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { Project } = require('../models/project.model.js');

const createProject = asyncHandler( async (req, res) => {

})

const getAllProjects = asyncHandler( async (req, res) => {

})

const getProjectById = asyncHandler( async (req, res) => {

})

const updateProject = asyncHandler( async (req, res) => {

})

const deleteProject = asyncHandler( async (req, res) => {

})

const addMemberToProject = asyncHandler( async (req, res) => {

})

const removeMemberFromProject = asyncHandler( async (req, res) => {

})

const getProjectsOfUser = asyncHandler( async (req, res) => {

})

const searchProject = asyncHandler( async (req, res) => {

})

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMemberToProject,
    removeMemberFromProject,
    getProjectsOfUser,
    searchProject
}