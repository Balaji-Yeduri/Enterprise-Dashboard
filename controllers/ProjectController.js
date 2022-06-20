const config = require('../config');
const axios = require('axios');
const mongoose = require("mongoose");
const ProjectModel = require("../models/ProjectModel.js");
const IncidentModel = require("../models/IncModel.js");
const apiDataModel = require("../models/apiDataModel");
const moment = require('moment');
var path = require('path');
const dbcontroller = require("./dbcontroller.js");
var dependencyProjects =[];
var downstreamProjects = [];

const fetchProjects = () => {
    return new Promise((resolve, reject) => {

        ProjectModel.find({}, function(err, ProjectArray) {
            //logger.info(DBIncidentArray.length + ' retrieved');
            //console.log(DBIncidentArray.length);
            resolve(ProjectArray);
        });

    })
};
const addProject = (data) => {
    return new Promise((resolve, reject) => {
        console.log('data',data)
        var requiredOperation =(data.requiredOperation === "yes") ? true : false;
        ProjectModel.insertMany([{
            "projectId": Math.floor(100000 + Math.random() * 900000),
            "projectName": data.projectName,
            "fteDetails": {
                "fteCount": data.FTECount,
                "fteCost": data.FTECost
            },
            "alias": data.Alias,
            "operationalStatus": data.form3Example6,
            "dependenciesAvailable": true,
            "monitoringType": data.monitoringType,
            "sysId": data.sys_id,
            "apiDetails": {
                "apiType": "",
                "apiUrl": "",
                "apiMethod": ""
            },
            "monitoringFrequency": data.monitoringFrequency,
            "monitoringID": Math.floor(100000 + Math.random() * 900000),
            "emailDL": [{
                "email": data.resourceEmail,
                "emailId": data.resourceEmail
            }],
            "seniorPOC": {
                "email":data.seniorPOCName,
                "name": data.seniorPOCEmail
            },
            "secondaryPOC": {
                "email": data.secondaryPOCName,
                "name": data.secondaryPOCEmail
            },
            "slaCriteria": {
                "p1": data.P1,
                "p2": data.P2,
            },
            "outageOn": false,
            "tickets": [""],
            "active": true,
            "createdAt": new Date(),
            "updatedAt": new Date()
        }]).then(function(){
            if(data && data.dependencyProject && Array.isArray(data.dependencyProject)){
                for(i=0;i<data.dependencyProject.length;i++){
                    ProjectModel.findOne({projectName : data.dependencyProject[i]}).then(function(projectArray){
                        dependencyProjects.push({
                            "projectName": projectArray.projectName,
                            "projectId": projectArray.projectId,
                        })                                                                                                                               
    
                    }).then(function(){
                        dbcontroller.dbconnect().then(function(db){
                            db.collection("projects").updateMany({"projectName":data.projectName},[{$set: { dependencyList:dependencyProjects}}])
                           
                        })
                    })
                }
            }
            else {
                ProjectModel.findOne({projectName : data.dependencyProject}).then(function(projectArray){
                    dependencyProjects.push({
                        "projectName": projectArray.projectName,
                        "projectId": projectArray.projectId,
                    })    
    
                }).then(function(){
                    console.log('dependencyProjects',dependencyProjects)
                    dbcontroller.dbconnect().then(function(db){
                        db.collection("projects").updateMany({"projectName":data.projectName},[{$set: { dependencyList:dependencyProjects}}])
                       
                    })
                    //ProjectModel.updateMany({"projectName":"KoreAI"},[{$set: { dependencyList:dependencyProjects}}])
            })
    
            }
             if(data && data.downstreamProjectName && Array.isArray(data.downstreamProjectName)){
                for(i=0;i<data.downstreamProjectName.length;i++){
                    ProjectModel.findOne({projectName : data.downstreamProjectName[i]}).then(function(projectArray){
                        downstreamProjects.push({
                            "projectName": projectArray.projectName,
                            "projectId": projectArray.projectId,
                        })    
    
                    }).then(function(){
                        dbcontroller.dbconnect().then(function(db){
                            db.collection("projects").updateMany({"projectName":data.projectName},[{$set: { downStreamList:downstreamProjects}}])
                           
                        })
                        //ProjectModel.updateMany({"projectName":data.projectName},[{$set: { downStreamList:downstreamProjects}}])
                    })
                }
               
            }
            else {
                ProjectModel.findOne({projectName : data.downstreamProjectName}).then(function(projectArray){
                    downstreamProjects.push({
                        "projectName": projectArray.projectName,
                        "projectId": projectArray.projectId,
                    })    
    
                }).then(function(){
                    dbcontroller.dbconnect().then(function(db){
                        db.collection("projects").updateMany({"projectName":data.projectName},[{$set: { downStreamList:downstreamProjects}}])
                       
                    })
                })
            }
        })
        
        })
        .catch((error) => {
            console.error(error)
        })
    resolve();

};


module.exports = { fetchProjects, addProject };