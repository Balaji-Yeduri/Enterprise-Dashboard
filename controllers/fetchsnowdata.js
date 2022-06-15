const config = require('../config');
const axios = require('axios');

//function fetchsnowdata(){
  //const fetchsnowdata = async () => {
global.DBIncidentArray=[];


let MongoClient = require('mongodb').MongoClient;
var lastruntime;
var asknowquerystring;
global.db;
let client;


const dbconnect = () => {
  return new Promise((resolve, reject) => {
 
  MongoClient.connect('mongodb://'+config.mongo.host, function(err, client) {
       if (err) {
            console.log('Mongo db connection Error', err); 
            resolve('false');
       } else {

          db = client.db('Enterprise__dashboard');
          console.log('db connected');
          resolve(db);
       }
  });

})
};

const fetchlastruntime = (db) => {
  return new Promise((resolve, reject) => {
 //let lastruntime = false;

  db.collection('Lastruntime').find().toArray(function(err, result){
    if(err)
    {
        console.log('Error Reading table');
        resolve(false);
    }
    else{
    lastruntime = result[0]['datetime'];
    console.log(lastruntime);
    let date_ob = new Date();
    var monthcount=date_ob.getMonth()+1;
    var currentruntime=date_ob.getFullYear()+'-'+monthcount+'-'+date_ob.getDate()+' '+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getMinutes()
    console.log(currentruntime);
    //db.collection('Lastruntime')findOneAndUpdate({ datetime':"'2021-10-01','07:44:00' },{$set: {'datetime':"'2021-01-01','07:44:00'"}})
    resolve(lastruntime);
  }
       });
  
})
}


const asknowprojectslist = (db) => {
  return new Promise((resolve, reject) => {
//get asknow projects list from db
   
    db.collection('Projects_list').find({"monitoringType":"Ask Now"}).toArray(function(err, result){
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


const fetchdata =  (lastruntime,db,asknowquerystring) =>{
  return new Promise((resolve, reject) => {
  
      //get api call
      console.log(lastruntime);
      let inputdata = {
        headers: {'Authorization': config.asknow.auth},
        params: {
         'sysparm_fields': 'number,u_outage_flag,priority,incident_state,cmdb_ci.name',
         //'sysparm_limit':1,
         'sysparm_query':"priorityIN1,2,3^incident_stateIN2,3,4,5^sys_created_on>javascript:gs.dateGenerate('"+lastruntime+"')"+asknowquerystring
        }
      }
     axios.get(config.asknow.host+'/api/now/table/incident', inputdata)
    .then((res) => {
      console.log(res.data);
      console.log(res.data.result.length);
      if(res.data.result.length && res.data.result.length >0){
        var inputobj=[];
        for(inccounter=0;inccounter<res.data.result.length;inccounter++){
          inputobj.push({'Inc_Number': res.data.result[inccounter].number,'outage': res.data.result[inccounter].u_outage_flag,'Inc_State': res.data.result[inccounter].incident_state,'Business_Service':res.data.result[inccounter]['cmdb_ci.name'],'Priority':res.data.result[inccounter].priority});
          }
          db.collection("Incident_list").insertMany(inputobj); 
      }
      db.collection('Incident_list').find().toArray(function(err, DBIncidentArray){
        console.log(DBIncidentArray.length);
        resolve(DBIncidentArray);
      })
    })
    .catch((error) => {
      console.error(error)
    })
 

});
}
// const closedbconn = (db) => {
//   return new Promise((resolve, reject) => {
//     db.close();

// });
// }

function fetchsnowdata(){   
  return new Promise((resolve, reject) => {
  dbconnect()
  .then(db => fetchlastruntime(db))
  .then(lastruntime => asknowprojectslist(db,lastruntime))
  .then(asknowquerystring => fetchdata(lastruntime,db,asknowquerystring))
  .then(DBIncidentArray =>  resolve(DBIncidentArray))

  
});
}
//fetchsnowdata();

module.exports = { fetchsnowdata };