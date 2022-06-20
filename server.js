const express               =  require('express');
const app                   =  express();
const mongoose              =  require("mongoose");
const bodyParser            =  require("body-parser");
const User                  =  require("./models/ProjectModel.js");
const cron = require('node-cron');
const path = require('path');
const  fetchsnowdata  = require('./controllers/asknowcontroller.js');
const dbcontroller= require("./controllers/dbcontroller.js" ) ;
const projectcontroller = require("./controllers/ProjectController");
const apicontroller = require("./controllers/apiController")
const analyticsController = require("./controllers/analyticsController")
var logger = require('./controllers/logcontroller.js');

//logger.info('log to file');
var DBIncidentArray=[];
var projectarray=[];
var apiarray = [];
var analyticsData;;






app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'views')));
app.use(bodyParser.urlencoded({ extended: true }))


start().then(success=> {
    // //=======================
    //      R O U T E S
    //=======================
    app.get(["/","/index.html"], (req,res) =>{
        if (projectarray.length>0){

        res.render('index.ejs', {incarray : DBIncidentArray,projarray:projectarray,apiarray: apiarray})
        }
        else{res.render('create-project.ejs', {})}
     });
     app.get("/project-management.html", (req,res) =>{

        res.render('project-management.ejs', {projarray:projectarray})
     });
    
    app.get("/analytics.html", (req,res) =>{
    
        res.render('analytics.ejs', {analyticsData:analyticsData})
     });
    
    app.get("/tickets.html", (req,res) =>{
    
        res.render('tickets.ejs', {incarray : DBIncidentArray})
     });
     app.get("/create-project.html", (req,res) =>{
    
        res.render('create-project.ejs', {projarray:projectarray})
     });
     app.post("/addproject", (req,res) =>{
    
        console.log(req.body)
        projectcontroller.addProject(req.body)
        res.render('index.ejs',{incarray : DBIncidentArray,projarray:projectarray,apiarray: apiarray});
     });
     cron.schedule('*/3 * * * *', function() {
        console.log('running a task every 3 minute');
        fetchsnowdata.fetchincidents().then(currentresponse =>{
            DBIncidentArray = currentresponse;
            dbcontroller.getprojectslist(DBIncidentArray)
            .then(secondresponse =>{
                projectarray = secondresponse;
                projectcontroller.fetchProjects().then(projectResponse =>{
                    projectarray = projectResponse
                apicontroller.fetchAPIData().then(apiResponse =>{
                    apiarray = apiResponse
                })
                analyticsController.analytics().then(analytics =>{
                    analyticsData = analytics;
                })
            })
            })
        });
      });
     
    
  });

  app.listen(3000, () => {
    console.log('Listening on PORT: 3000')
  });
    

function start()
{
    return new Promise((resolve, reject) => {
        dbcontroller.getincidentsfromdb().then(currentresponse =>{
        DBIncidentArray = currentresponse;
       /* dbcontroller.getprojectslist(DBIncidentArray)
        .then(secondresponse =>{
            projectarray = secondresponse;*/
        projectcontroller.fetchProjects().then(projectResponse =>{
            projectarray = projectResponse
        apicontroller.fetchAPIData().then(apiResponse =>{
            apiarray = apiResponse
        analyticsController.analytics().then(analytics =>{
            analyticsData = analytics;
        })
            resolve('success')
        })
    })
            
        
    });

});
}



