const config = require('../config');
const axios = require('axios');


let MongoClient = require('mongodb').MongoClient;
var lastruntime;
var asknowquerystring;
MongoClient.connect('mongodb://'+config.mongo.host, function(err, client){
  if(err) throw err;
  let db = client.db('Enterprise__dashboard');
  //read last runtime
  db.collection('Lastruntime').find().toArray(function(err, result){
    if(err)
    {
        console.log('Error Reading Database');
    }
    else{
    console.log(result[0]['datetime']);
    lastruntime = result[0]['datetime'];
    //update current datetime in db 
    let date_ob = new Date();
    var monthcount=date_ob.getMonth()+1;
    var currentruntime=date_ob.getFullYear()+'-'+monthcount+'-'+date_ob.getDate()+' '+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getMinutes()
    console.log(currentruntime);
    //db.collection('Lastruntime')findOneAndUpdate({ datetime':"'2021-10-01','07:44:00' },{$set: {'datetime':"'2021-01-01','07:44:00'"}})
    


    //get asknow projects list from db
   
    db.collection('Projects_list').find({"monitoringType":"Ask Now"}).toArray(function(err, result){
      if(err){
      console.log(err);
    }
      else
      { 
        var asknowquerystring='';
        for (var arrayindex = 0; arrayindex < result.length; arrayindex++) 
        { 
          asknowquerystring= asknowquerystring+'cmdb_ci='+result[arrayindex]['sysId']+'^OR';
         }
         asknowquerystring='^'+asknowquerystring;
         console.log(asknowquerystring);
      }
    })
    
    
    
    
    //get api call
    let inputdata = {
        headers: {'Authorization': config.asknow.auth},
        params: {
         'sysparm_fields': 'number,u_outage_flag,business_service,priority,incident_state,cmdb_ci.sys_id',
         //'sysparm_limit':1,
         'sysparm_query':"priorityIN1,2,3^incident_stateIN2,3,4,5^sys_created_on>javascript:gs.dateGenerate('"+lastruntime+"')"+'^cmdb_ci=d8b3591f6f799200ac14373aea3ee42c'//asknowquerystring
        }
      }
     axios.get(config.asknow.host+'/api/now/table/incident', inputdata)
    .then((res) => {
      console.log(res.data);
      let respdata =[];
      respdata= res.data;
      console.log(respdata.length);
      // for(inccount=0;inccount<res.data.length;inccount++)
      // {
      //   console.log(res.data[inccount]);
      // }

    })
    .catch((error) => {
      console.error(error)
    })
    //client.close();
    }
    });
 });

