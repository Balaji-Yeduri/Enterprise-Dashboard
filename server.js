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
app.get("/", (req,res) =>{
   res.sendFile(path.join(__dirname,'views','index.html'));
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