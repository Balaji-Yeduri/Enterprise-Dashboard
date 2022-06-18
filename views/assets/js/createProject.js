function yesnoCheck(that) 
{
    if (that.value == "asknow") 
    {  document.getElementById("sysid").style.display = "block";
    }
  else
    {  document.getElementById("sysid").style.display = "none";
    }
    if (that.value == "api")
    {   document.getElementById("frequency").style.display = "block";
    }
  else
    {  document.getElementById("frequency").style.display = "none";
    }
    if (that.value == "yes")
    {   document.getElementById("dependency").style.display = "block";
    }
  else
    {  document.getElementById("dependency").style.display = "none";
    }
}
function updownCheck() {
  let obj = {
    lastWeekOutage: 40,
    currentWeekOutage:50,
    lastWeekRevenue:150,
    currentWeekRevenue:250,
    lastWeekAvgTime: 10,
    currentWeekAvgTime: 8,
    lastWeekHrsWorked: 5,
    currentWeekHrsWorked: 3
  }
  // let arrow = document.getElementById("arrow_outage")
  // let outage_value = document.getElementById("outage_value")
  // let outage_trend = document.getElementById("outage_trend")
  //   a = last week (40 requests) b = present week (solved => 10) value = 30
  //  b - a ==> trend 
  // current value ==> b
  // depending on this we calculate the trend
  // b > a ==>  arrow up
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