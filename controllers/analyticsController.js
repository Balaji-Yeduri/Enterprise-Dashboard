const axios = require('axios');
const asknowcontroller = require('./asknowcontroller.js')
const dbcontroller = require('./dbcontroller')
const ProjectModel = require("../models/ProjectModel");
const config = require('../config')

var IncidentArray;
var askNowQueryString;
var allIncidents;

const analytics = () =>{
  return new Promise((resolve, reject) => {
  dbcontroller.dbconnect()
  dbcontroller.asknowprojectslist().then(askNowString =>{
    askNowQueryString  = askNowString;
   console.log('projectData',askNowQueryString)
  asknowcontroller.fetchClosedIncidents(askNowQueryString).then(currentresponse =>{
     IncidentArray = currentresponse;
    asknowcontroller.fetchincidents(askNowQueryString).then(incidentResponse =>{
        console.log('IncidentResponse',incidentResponse)
        allIncidents = incidentResponse.length;

    ProjectModel.find({ "monitoringType": "Ask now"}).then(projectResponse =>{
        console.log('ClosedincidentArray',IncidentArray)
        let timeWorked = 0;
        let lossOfRevenue = 0;
        let averageResolutionTime = 0;
        for (let index = 0; index < IncidentArray.result.length; index++) {
            timeWorked += parseInt(IncidentArray.result[index].time_worked.split(' ')[1]);
        }
        for (let index = 0; index < projectResponse.length; index++) {
            lossOfRevenue += timeWorked * projectResponse[index].fteDetails.fteCost * projectResponse[index].fteDetails.fteCount
        }
        averageResolutionTime = timeWorked/IncidentArray.result.length;
        resolve({"lossOfRevenue":lossOfRevenue, "outages":IncidentArray.result.length+allIncidents,"timeWorked":timeWorked,"averageResolutionTime":averageResolutionTime});
    })
});
});
});
  });
}
/*const lossOfRevenue = (lastruntime) => {
    return new Promise((resolve, reject) => {
        //get api call
        var response;
        var asknowquerystring = '';
        console.log('in fetch ' + lastruntime);
        dbcontroller.dbconnect()
       ProjectModel.find({
            "monitoringType": "Ask now"
        }).then(projectResponse => {
            console.log('anayliticsProject', projectResponse)
            for (var arrayindex = 0; arrayindex < projectResponse.length; arrayindex++) {
                asknowquerystring = asknowquerystring + 'cmdb_ci=' + projectResponse[arrayindex]['sysId'] + '^OR';

                asknowquerystring = '^' + asknowquerystring;
                console.log(asknowquerystring);
                let inputdata = {
                    headers: {
                        'Authorization': config.asknow.auth
                    },
                    params: {
                        'sysparm_fields': 'number,u_outage_flag,priority,incident_state,cmdb_ci.name,opened_at,time_worked,status',
                        //'sysparm_limit':1,
                        'sysparm_query': "priorityIN1,2^incident_stateIN6,7^sys_created_on>javascript:gs.dateGenerate('" + lastruntime + "')" + asknowquerystring
                    }
                }
               
                const response = axios.get(config.asknow.host + '/api/now/table/incident', inputdata)
                    .then((res) => {
                      console.log('projectResponse[arrayindex]',projectResponse[arrayindex]);
                        return res.data
                    }) 
                    
                    
                    let timeWorked = 0;
                    for (let index = 0; index < res.data.result.length; index++) {
                        timeWorked += parseInt(res.data.result[index].time_worked.split(' ')[1]);
                    }
                    var lossOfRevenue = timeWorked + projectResponse[arrayindex].fteDetails.fteCost + projectResponse[arrayindex].fteDetails.fteCount;
                    resolve(lossOfRevenue);

            }
      });
    });
}*/
 analytics().then(function(response){
    console.log('rrr',response)
 })
module.exports = { analytics };