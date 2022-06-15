const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      bodyParser            =  require("body-parser");
      User                  =  require("./models/ProjectModel.js");
      cron = require('node-cron');
      const path = require('path');
const { fetchsnowdata } = require('./controllers/fetchsnowdata.js');
global.DBIncidentArray;

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'views')));




fetchsnowdata().then(DBIncidentArray => {
    // //=======================
    //      R O U T E S
    //=======================
    app.get(["/","/index.html"], (req,res) =>{

        res.render('index.ejs', {incarray : DBIncidentArray})
     });
     app.get("/project-management.html", (req,res) =>{

        res.render('project-management.ejs', {})
     });
    
    app.get("/analytics.html", (req,res) =>{
    
        res.render('analytics.ejs', {})
     });
    
    app.get("/tickets.html", (req,res) =>{
    
        res.render('tickets.ejs', {incarray : DBIncidentArray})
     });


     cron.schedule('* * * * *', function() {
        console.log('running a task every minute');
        fetchsnowdata().then(currentresponse =>{
            DBIncidentArray = currentresponse;
        });
      });
    
  });

  app.listen(3000, () => {
    console.log('Listening on PORT: 3000')
  });
    





