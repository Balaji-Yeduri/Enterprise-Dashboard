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
  //    console.log(lastruntime);
      let inputdata = {
        headers: {'Authorization': config.asknow.auth},
        params: {
         'sysparm_fields': 'number,u_outage_flag,priority,incident_state,cmdb_ci.name,opened_at',
         //'sysparm_limit':1,
         'sysparm_query':"priorityIN1,2,3^incident_stateIN1,2,3,4,5^sys_created_on>javascript:gs.dateGenerate('"+lastruntime+"')"+asknowquerystring
        }
      }
     axios.get(config.asknow.host+'/api/now/table/incident', inputdata)
    .then((res) => {
     // console.log(res.data);
      console.log(res.data.result.length);
      if(res.data.result.length && res.data.result.length >0){
        var inputobj=[];
        for(inccounter=0;inccounter<res.data.result.length;inccounter++){
          inputobj.push({'Inc_Number': res.data.result[inccounter].number,'Outage_Flag': res.data.result[inccounter].u_outage_flag,'Inc_State': res.data.result[inccounter].incident_state,'Business_Service':res.data.result[inccounter]['cmdb_ci.name'],'Priority':res.data.result[inccounter].priority,'Opened_Time':res.data.result[inccounter].opened_at});
          }
          IncidentModel.insertMany(inputobj).then(IncidentArray => dbcontroller.updateDB(IncidentArray))
          
        }
        //else{
          
          IncidentModel.find({},function(err, DBIncidentArray){
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
//fetchincidents();

module.exports = { fetchincidents };