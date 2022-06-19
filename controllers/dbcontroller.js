const ProjectModel  =  require("../models/ProjectModel.js");
const config = require('../config');
const IncidentModel = require("../models/IncModel.js");
const mongoose = require("mongoose");
const alert = require('./alertController')

global.notificationsarray=[];

const dbconnect = () => {
    return new Promise((resolve, reject) => {
   
    mongoose.connect('mongodb://'+config.mongo.host+'/Enterprise__dashboard', function(err, client) {
         if (err) {
              console.log('Mongo db connection Error', err); 
              resolve('false');
         } else {
  
           // db = client.db('Enterprise__dashboard');
            console.log('db connected');
            resolve(client);
         }
    });
  
  })
  };


  const fetchlastruntime = (db) => {
    return new Promise((resolve, reject) => {
   //let lastruntime = false;
   db.createCollection("Lastruntime", function(err, res) {
    if (err)
    {
        console.log('collect present');
        db.collection('Lastruntime').find().toArray(function(err, result){
            if(err)
            {
                console.log('Error Reading table');
                resolve('2022-03-17 22:20:00');
            }
            else{
            console.log('');
            lastruntime = result[0]['datetime'];
            console.log('last runtime '+lastruntime);
            let date_ob = new Date();
            var monthcount=date_ob.getMonth()+1;
            var minutecount = date_ob.getMinutes();
            var currentruntime=date_ob.getFullYear()+'-'+monthcount+'-'+date_ob.getDate()+' '+date_ob.getHours()+':'+minutecount+':'+date_ob.getMinutes()
            console.log(currentruntime);
            db.collection('Lastruntime').findOneAndUpdate({ 'datetime':lastruntime},{ $set:{'datetime': currentruntime }})
            resolve(lastruntime);
          }
               });


    }
    else{
      lastruntime='2022-03-17 22:21:00'
        db.collection('Lastruntime').insertOne({"datetime" : lastruntime})
        resolve(lastruntime);
    }
 }
 );

    
  })
  }

  const asknowprojectslist = (db,lastruntime) => {
    return new Promise((resolve, reject) => {
  //get asknow projects list from db
      ProjectModel.find({},function(err,result){
      //db.collection('Projects_list').find({"monitoringType":"Ask Now"}).toArray(function(err, result){
        if(err){
        console.log(err);
        resolve(false);
      }
        else
        { 
          asknowquerystring='';
          for (var arrayindex = 0; arrayindex < result.length; arrayindex++) 
          { 
            asknowquerystring= asknowquerystring+'cmdb_ci='+result[arrayindex]['sysId']+'^OR';
           }
           asknowquerystring='^'+asknowquerystring;
           console.log(asknowquerystring);
  
           resolve(asknowquerystring);
        }
        
      })
  });
  }

  const getprojectslist= (dbDBIncidentArray) => {
    return new Promise((resolve, reject) => {
  //get asknow projects from db
      ProjectModel.find({"monitoringType":"ask now"},function(err,result){
      //db.collection('Projects_list').find({"monitoringType":"Ask Now"}).toArray(function(err, result){
        if(err){
        console.log(err);
        resolve(false);
      }
        else
        { 
          projectarray=[];
          for (var arrayindex = 0; arrayindex < result.length; arrayindex++) 
          { 
            var filteredcount = dbDBIncidentArray.filter(function(element){
                return element.Business_Service == result[arrayindex].projectName;
            }).length
           projectarray.push({'name':result[arrayindex].projectName,'status':result[arrayindex].operationalStatus,'inccount':filteredcount,'dependentsavailable':result[arrayindex].dependenciesAvailable,'dependentlist':result[arrayindex].dependencyList})
           }

           resolve(projectarray);
        }
        
      })
  });
  }


  const getincidentsfromdb= () => {
    return new Promise((resolve, reject) => {
  //get asknow projects from db
    dbconnect()
    IncidentModel.find({}).sort([['Priority', 1]]).exec(function(err, DBIncidentArray){
    //logger.info(DBIncidentArray.length + ' retrieved');
     console.log('inc from DB '+DBIncidentArray.length);
    resolve(DBIncidentArray);
        });
    }
        )

  }
  


  const updateDB= (IncidentArray) => {
    return new Promise((resolve, reject) => {
      notificationsarray=[];
        console.log(IncidentArray.length);
        for (eachinc= 0; eachinc<IncidentArray.length; eachinc++)
        {
            if( IncidentArray[eachinc].Priority === 1 )//|| IncidentArray[eachinc].Outage_Flag === true)
            {
                ProjectModel.findOneAndUpdate({projectName:IncidentArray[eachinc].Business_Service}, {operationalStatus : 'Critical'},{new: true},function(err,updateEntry){
                    if(err){
                       console.log(err);
                        resolve(false);
                      }
                      else if(updateEntry == null ){
                        resolve();
                      }
                      else{
                    var emailidvalue =updateEntry.emailDL[0].email;
                    if(updateEntry.dependenciesAvailable){
                        dependents=updateEntry.dependencyList;
                        for (dependentscount=0;dependentscount < dependents.length ; dependentscount++){
                        ProjectModel.findOneAndUpdate({projectName:updateEntry.dependencyList[dependentscount].projectName,operationalStatus : 'good'}, {operationalStatus : 'Warning'},{new: true},function(err,updateEntry2){
                           // emailidvalue=emailidvalue+';'+updateEntry2.emailDL[0].email
                        })
                    }
                }
                alert.sendemail(emailidvalue,'High Priority Ticket Created for '+updateEntry.projectName,'High Priority Ticket Created for '+updateEntry.projectName)
                alert.sendteamsnotification('High Priority Ticket Created for '+updateEntry.projectName,'High Priority Ticket Created for '+updateEntry.projectName)
                notificationsarray.push(updateEntry.projectName+' has an P1 ticket');
                    resolve()
                }
                    
                })
            }
        }
    });
                
            }
 
// mongoose.connect('mongodb://localhost:27017/Enterprise__dashboard', function(err, client) {
//        if (err) {
//             console.log('Mongo db connection Error', err); 
//            // resolve('false');
//        } else {

//          // db = client.db('Enterprise__dashboard');
//           console.log('db connected');
//         //   client.collection.deleteOne({}, function (err, docs) {
//         //     if (err){
//         //         console.log(err);
//         //     }
//         //     else{
//         //         console.log("First function call : ", docs);
//         //     }
//         // });

//     //     var collection = client.collection('Lastruntime');

//     // collection.find().toArray(function(err, kittens) {
//     //     console.log(kittens);
//     // });    
//         //  resolve(db);
//         ProjectModel.find({},function(err,op){
//             console.log(op);
//         })
// }
// });
module.exports = { getincidentsfromdb,dbconnect,fetchlastruntime,asknowprojectslist,getprojectslist,updateDB };