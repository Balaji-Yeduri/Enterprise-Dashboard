const express               =  require('express');
const app                   =  express();
const mongoose              =  require("mongoose");
const bodyParser            =  require("body-parser");
const User                  =  require("./models/ProjectModel.js");
const cron = require('node-cron');
const path = require('path');
const  fetchsnowdata  = require('./controllers/asknowcontroller.js');
const dbcontroller= require("./controllers/dbcontroller.js" ) ;
var logger = require('./controllers/logcontroller.js');

//logger.info('log to file');




app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'views')));
app.use(bodyParser.urlencoded({ extended: true }))


fetchsnowdata.fetchincidents().then(DBIncidentArray => dbcontroller.getprojectslist(DBIncidentArray)).then((projectarray)=>{
    // //=======================
    //      R O U T E S
    //=======================
    app.get(["/","/index.html"], (req,res) =>{

        res.render('index.ejs', {incarray : DBIncidentArray,projarray:projectarray})
     });
     app.get("/project-management.html", (req,res) =>{

        res.render('project-management.ejs', {projarray:projectarray})
     });
    
    app.get("/analytics.html", (req,res) =>{
    
        res.render('analytics.ejs', {})
     });
    
    app.get("/tickets.html", (req,res) =>{
    
        res.render('tickets.ejs', {incarray : DBIncidentArray})
     });
     app.get("/create-project.html", (req,res) =>{
    
        res.render('create-project.ejs', {})
     });
     app.post("/addproject", (req,res) =>{
    
        console.log(req.body);
     });
     cron.schedule('* * * * *', function() {
        console.log('running a task every 1 minute');
        fetchsnowdata.fetchincidents().then(currentresponse =>{
            DBIncidentArray = currentresponse;
            dbcontroller.getprojectslist(DBIncidentArray)
            .then(secondresponse =>{
                projectarray = secondresponse;
            })
        });
      });
     
    
  });

  app.listen(3000, () => {
    console.log('Listening on PORT: 3000')
  });
    





