const config = require('../config');
const axios = require('axios');
const mongoose =  require("mongoose");
const ProjectModel  =  require("../models/ProjectModel.js");
const IncidentModel = require("../models/IncModel.js");
const moment = require('moment');
var path = require('path');
const dbcontroller= require("./dbcontroller.js" ) ;
// const logcontroller= require("./logcontroller.js" ) ;
// const logger=logcontroller.logger;


var db;
let client;


const fetchdata =  (lastruntime,db,asknowquerystring) =>{
  return new Promise((resolve, reject) => {
  
      //get api call
    console.log('in fetch '+lastruntime);
      let inputdata = {
        headers: {'Authorization': config.asknow.auth},
        params: {
         'sysparm_fields': 'number,u_outage_flag,priority,incident_state,cmdb_ci.name,opened_at',
         //'sysparm_limit':1,
         'sysparm_query':"priorityIN1,2^incident_stateIN1,2,3,4,5^sys_created_on>javascript:gs.dateGenerate('"+lastruntime+"')"+asknowquerystring
        }
      }
     axios.get(config.asknow.host+'/api/now/table/incident', inputdata)
    .then((res) => {
      console.log('asknow resp status code '+res.status);
      console.log(res.data.result.length);
      if(res.data.result.length && res.data.result.length >0){
        var inputobj=[];
        for(inccounter=0;inccounter<res.data.result.length;inccounter++){
          inputobj.push({'Inc_Number': res.data.result[inccounter].number,'Outage_Flag': res.data.result[inccounter].u_outage_flag,'Inc_State': res.data.result[inccounter].incident_state,'Business_Service':res.data.result[inccounter]['cmdb_ci.name'],'Priority':res.data.result[inccounter].priority,'Opened_Time':res.data.result[inccounter].opened_at});
          }
          IncidentModel.insertMany(inputobj).then(IncidentArray => dbcontroller.updateDB(IncidentArray))
          
        }
        //else{
          
          IncidentModel.find({}).sort([['Priority', 1]]).exec(function(err, DBIncidentArray){
            //logger.info(DBIncidentArray.length + ' retrieved');
          //console.log(DBIncidentArray.length);
          resolve(DBIncidentArray);
      });
    
    //}
      })
    .catch((error) => {
      console.error(error)
    })
 

});
}

const fetchClosedIncidentsdata =  (db,asknowquerystring) =>{
  return new Promise((resolve, reject) => {
  
      //get api call
      var date_ob = new Date();
      date_ob.setDate(date_ob.getDate()-7);
    console.log('weekDate',date_ob);
    var monthcount=date_ob.getMonth()+1;
    var currentruntime=date_ob.getFullYear()+'-'+monthcount+'-'+date_ob.getDate()+' '+date_ob.getHours()+':'+date_ob.getMinutes();+':'+date_ob.getMinutes()

    console.log('in fetch '+currentruntime);
      let inputdata = {
        headers: {'Authorization': config.asknow.auth},
        params: {
         'sysparm_fields': 'number,u_outage_flag,priority,incident_state,cmdb_ci.name,opened_at,time_worked',
         //'sysparm_limit':1,
         'sysparm_query':"priorityIN1,2^incident_stateIN6,7^sys_created_on>javascript:gs.dateGenerate('"+currentruntime+"')"+asknowquerystring
        }
      }
     axios.get(config.asknow.host+'/api/now/table/incident', inputdata)
    .then((res) => {
      console.log('asknow resp status code '+res.status);
      console.log(res.data);
     
          resolve(res.data);
    
    
    //}
      })
    .catch((error) => {
      console.error(error)
    })
 

});
}



function fetchincidents(){   
  return new Promise((resolve, reject) => {
  dbcontroller.dbconnect()
  .then(db => dbcontroller.fetchlastruntime(db))
  .then(lastruntime => dbcontroller.asknowprojectslist(db,lastruntime))
  .then(asknowquerystring => fetchdata(lastruntime,db,asknowquerystring))
 // .then(DBIncidentArray => dbcontroller.updateDB(DBIncidentArray))
  .then(DBIncidentArray => resolve(DBIncidentArray))

  
});
}
function fetchClosedIncidents(){   
  return new Promise((resolve, reject) => {
  dbcontroller.dbconnect()
  .then(db => dbcontroller.fetchlastruntime(db))
  .then(lastruntime => dbcontroller.asknowprojectslist(db,lastruntime))
  .then(asknowquerystring => fetchClosedIncidentsdata(lastruntime,db,asknowquerystring))
 // .then(DBIncidentArray => dbcontroller.updateDB(DBIncidentArray))
  .then(DBIncidentArray => resolve(DBIncidentArray))

  
});
}
//fetchincidents();

module.exports = { fetchincidents, fetchClosedIncidents };