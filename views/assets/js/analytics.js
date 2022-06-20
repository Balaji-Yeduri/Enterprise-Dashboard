/*import { analytics } from '../../../controllers/analyticsController.js';

var lossOfRevenue;
var outages;
var timeWorked;
var averageResolutionTime
analytics().then(function(data){
    lossOfRevenue = data.lossOfRevenue;
    outages = data.outages;
    timeWorked = data.timeWorked;
    averageResolutionTime = averageResolutionTime;
})*/
 
function updownCheck() {

    let obj = {
    
    lastWeekOutage: 0,
    
    currentWeekOutage:outages,
    
    lastWeekRevenue:0,
    
    currentWeekRevenue:lossOfRevenue,
    
    lastWeekAvgTime: 0,
    
    currentWeekAvgTime: averageResolutionTime,
    
    lastWeekHrsWorked: 0,
    
    currentWeekHrsWorked: timeWorked
    
    }
    
    // let arrow = document.getElementById("arrow_outage")
    
    // let outage_value = document.getElementById("outage_value")
    
    // let outage_trend = document.getElementById("outage_trend")
    
    // a = last week (40 requests) b = present week (solved => 10) value = 30
    
    // b - a ==> trend
    
    // current value ==> b
    
    // depending on this we calculate the trend
    
    // b > a ==> arrow up
    
    // b < a ==> arrow down
    
    // document.getElementById("arrow_outage").className = "fa-solid fa-caret-down"
    document.getElementById("outage_value").textContent = Math.abs(obj.currentWeekOutage - obj.lastWeekOutage)
    
    // $150
document.getElementById("revenue_loss").textContent = "$"+Math.abs(obj.currentWeekRevenue - obj.lastWeekRevenue)

document.getElementById("avg_time").textContent = Math.abs(obj.currentWeekAvgTime- obj.lastWeekAvgTime)

document.getElementById("hrs_worked").textContent = Math.abs(obj.currentWeekHrsWorked- obj.lastWeekHrsWorked)

if(obj.currentWeekOutage < obj.lastWeekOutage) {

document.getElementById("arrow_outage").className = "fa-solid fa-caret-down"

} else {

document.getElementById("arrow_outage").className = "fa-solid fa-caret-up"

}

if(obj.currentWeekRevenue < obj.lastWeekRevenue) {

document.getElementById("arrow_revenue").className = "fa-solid fa-caret-down"

}

else{

document.getElementById("arrow_revenue").className = "fa-solid fa-caret-up"

}

if(obj.currentWeekAvgTime < obj.lastWeekAvgTime) {

document.getElementById("arrow_avg").className = "fa-solid fa-caret-down"

}

else {

document.getElementById("arrow_avg").className = "fa-solid fa-caret-up"

}

if(obj.currentWeekHrsWorked < obj.lastWeekHrsWorked) {

document.getElementById("arrow_hrs").className = "fa-solid fa-caret-down"

}
else {

    document.getElementById("arrow_hrs").className = "fa-solid fa-caret-up"
    
    }
    
    }
    
    updownCheck()