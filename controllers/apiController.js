const axios = require('axios');
const config = require('../config')
const apiDataModel = require("../models/apiDataModel");
const ProjectModel = require("../models/ProjectModel")
const mongoose = require("mongoose");

var ELCStatus;
var ASDStatus;
var InformaticaStatus;
const body =   {
    "message": {
        "text": "hi"
    },
    "from": {
        "id": "u-e37feeef-4f97-521f-a808-1389cd7d52cd"
    },
    "mergeIdentity": true,
    "preferredChannelForResponse": "rtm"
}





const updateDB= () => {
    return new Promise((resolve, reject) => {
ProjectModel.findOne({projectName : "Informatica"}, function(err, projectArray){
    if(projectArray === null || projectArray === undefined){
        resolve()
    }else{
         axios.get(config.Informatica.url, { headers: {
            "Content-Type": "application/json",
            "Authorization": config.Informatica.auth
        }}).then((response) => {
        console.log(response.data);
       apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Informatica",result:response.data,status:"Up", projectName:projectArray.projectName ,projectId:projectArray._id,lastChecked:new Date()}) 
       }).catch((err) => {
        apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Informatica",result:err,status:"Down", projectName:projectArray.projectName ,projectId:projectArray._id,lastChecked:new Date()}) 
        console.log(err);});
       } 

})
ProjectModel.findOne({projectName : "ELC"}).then(function(ELCprojectArray){
    if(ELCprojectArray === null || ELCprojectArray === undefined){
        resolve()
    }
    else{
      axios.post(config.botsHost + config.ELCBot.botID, body, { headers: {
           "Content-Type": "application/json",
           "authorization": config.ELCBot.jwtToken
       }}).then((response)=>{
       console.log(response.data);
       apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Webhook-ELC",result:response.data,status:"UP", projectName:ELCprojectArray.projectName ,projectId:ELCprojectArray._id,lastChecked:new Date()}) 

       }).catch ((err) => {
        apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Webhook-ELC",result:err,status:"Down", projectName:ELCprojectArray.projectName ,projectId:ELCprojectArray._id,lastChecked:new Date()})     
        console.log(err);
       });}
})
    
ProjectModel.findOne({projectName : "ASD"}).then(function(ASDprojectArray){
    if(ASDprojectArray === null || ASDprojectArray === undefined){
        resolve()  
    }
    else{
    console.log('ssssssssssssssss',ASDprojectArray)
    axios.post(config.botsHost + config.ELCBot.botID, body, { headers: {
        "Content-Type": "application/json",
        "authorization": config.ELCBot.jwtToken
    }}).then((response)=>{
    console.log(response.data);
    apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Webhook-ASD",result:response.data,status:"UP", projectName:ASDprojectArray.projectName ,projectId:ASDprojectArray._id,lastChecked:new Date()}) 

    }).catch ((err) => {
     apiDataModel.insertMany({apiId:Math.floor(100000 + Math.random() * 900000),apiName:"Webhook-ASD",result:err,status:"Down", projectName:ASDprojectArray.projectName ,projectId:ASDprojectArray._id,lastChecked:new Date()})     
     console.log(err);
    });}
})
resolve();
    })
}



const fetchAPIData  =() => {
    return new Promise((resolve, reject) => {
        updateDB().then(function(){
            apiDataModel.find({},function(err, apiDataArray){
                resolve(apiDataArray);
            });
        })
            
    })

  }

  module.exports = { fetchAPIData };
