const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      bodyParser            =  require("body-parser");
     // User                  =  require("./models/ProjectModel.js");
     const path = require('path');


app.use(express.static(path.join(__dirname,'views')));
//Connecting database
//mongoose.connect("mongodb://localhost/auth_demo");
//=======================
//      R O U T E S
//=======================
app.get(["/","/index.html"], (req,res) =>{
    res.render('index.ejs',{});
});
app.get(["/","/analytics.html"], (req,res) =>{
    res.render('analytics.ejs',{});
});
app.get(["/","/create project.html"], (req,res) =>{
    res.render('create project.ejs',{});
});
app.get(["/","/edit project.html"], (req,res) =>{
    res.render('edit project.ejs',{});
});
app.get(["/","/project-managment.html"], (req,res) =>{
    res.render('project-managment.ejs',{});
});
app.get(["/","/tickets.html"], (req,res) =>{
    res.render('tickets.ejs',{});
});
//Auth Routes
// app.get("/login",(req,res)=>{
//     res.render("login");
// });
//Listen On Server
app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});