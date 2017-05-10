/**
*   Utils Class
*     Description: This class contains a set of utilis function
**/

function Utils(){
  this.name = "Utility Class"
}

Utils.prototype.digitFormat = function(digit){
  return (digit < 10) ? '0' + digit.toString() : digit.toString();
}

Utils.prototype.eventTypeFormat = function(type){
  if(type == "IN"){
    return " Ingresso";
  }else if(type == "OUT"){
    return " Uscita";
  }else if(type == "IN_1"){
    return " Inizio Pausa Pranzo";
  }else if(type == "OUT_1"){
    return " Fine Pausa Pranzo";
  }else{
    return "N/A";
  }
}

Utils.prototype.appendEvent2Console = function(hour, minutes, type){
  var eventHour     = utils.digitFormat(hour+2);
  var eventMinte    = utils.digitFormat(minutes);
  var eventType     = utils.eventTypeFormat(type);

  var logEvent = "> "+ eventHour + ":" + eventMinte + " -- " +eventType + "\n";

  $("#textarea-smartBadgeEvents-ID").append(logEvent);
}

Utils.prototype.updateEventConsole = function(data){
  //Retrieval the currently SmartBadge Events for user Logged In
  var currentDate = new Date();

  var day = currentDate.getDate();
  var month = currentDate.getMonth()+1;
  var year = currentDate.getFullYear();
  var user = window.localStorage.getItem("userName");

  data.getLastSmartBadgeEvents(user, day, month, year)
    .then(function (response) {
      utils = new Utils();
      //alert("SUCCES getLastSmartBadgeEvents --> "+response.Count);
      $("#textarea-smartBadgeEvents-ID").text("");
      for(var i=0; i<response.Count; i++) {
        var eventHour     = (response.Items[i].eHour)+2;
        var eventMinte    = utils.digitFormat(response.Items[i].eMinute);
        var eventType     = utils.eventTypeFormat(response.Items[i].eType);
        //if(eventType.includes("_")){
          //Slite the causale number
        //}
        var logEvent = "> "+ eventHour + ":" + eventMinte + " -- " +eventType + "\n";
        $("#textarea-smartBadgeEvents-ID").append(logEvent);
      }
  }).fail(function (error) {
      console.error("FAIL: unable to getLastSmartBadgeEvents " + error);
  })
}
