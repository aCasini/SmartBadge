/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// handles API calls to MCS backend

'use strict';
define(['jquery', 'appConfig'], function ($, appConfig) {

  var baseUrl               = appConfig.backendUrl;
  var registrationUrl       = appConfig.registrationUrl;
  //AWS BaseURL:
  var awsBaseUrl            = appConfig.baseURL;
  var signInPath            = appConfig.signInPath;
  var signUpPath            = appConfig.signUpPath;
  var signConfirmPath       = appConfig.confirmUserPath;
  var signChangePassPath    = appConfig.changePassPath;
  var timeZonesPath         = appConfig.timeZonesPath;
  var timeEventPath         = appConfig.timeEventPath;
  var serverDatePath        = appConfig.serverDatePath;
  var timeEventsPaths       = appConfig.timeEventsPaths;


  // Note, the appConfig contains a Basic Authentication header. The use of Basic Auth is
  // not recommended for production apps. Using OAUTH is being tracked via bug 25025212.
  var baseHeaders = appConfig.backendHeaders;

  var localUrl = 'localData/';

  var isOnline = true;

  function setOnlineMode(mode) {
    isOnline = mode;
  }

/*
*   Function: SignIn
*     description: call the signIn API
*/
  function signInSmartBadge(credentials) {
    return $.ajax({
      type: 'POST',
      url: awsBaseUrl + signInPath,
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(credentials)
    });
  }

/*
*   Function: signUp
*     description: call the signUp API
*/
  function signUpSmartBadge(userRegistration) {
    return $.ajax({
      type: 'POST',
      url: awsBaseUrl + signUpPath,
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(userRegistration)
    });
  }

  /*
  * Function: confirmUser
  *   description: call the confirmation user on aws cognito
  */
  function confUserSmartBadge(confirmUser) {
    return $.ajax({
      type: 'POST',
      url: awsBaseUrl + signConfirmPath,
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(confirmUser)
    });
  }

  /*
  * Function: changePasswordSmartBadge
  *   description: change the user password
  */
  function changePasswordSmartBadge(changePassword) {
    return $.ajax({
      type: 'POST',
      url: awsBaseUrl + signChangePassPath,
      crossDomain: true,
      dataType: "json",
      data: JSON.stringify(changePassword)
    });
  }

  /*
  * Function: getSmartBadgeTimeZones
  *   description: get all timeZones from AWS
  */
  //$util.parseJson($input.json('$')) --> added to API gateway
  function getSmartBadgeTimeZones(){
    console.log("Call the webService: "+awsBaseUrl + timeZonesPath);

    return $.ajax({
      url: awsBaseUrl + timeZonesPath,
      type: 'GET',
      dataType: "jsonp",
      jsonp: true,
      jsonpCallback: "callback"
    });
  }

  /*
  * Function getServerCurrentDate
  *   description: retrieval the server smart badge current date
  */
  function getServerCurrentDate(){
    console.log("Call the webService: "+awsBaseUrl + serverDatePath);
    //alert("Call the webService: "+awsBaseUrl + serverDatePath);
    return $.ajax({
      url: awsBaseUrl + serverDatePath,
      type: 'GET',
      dataType: "json",
      crossDomain: true
      //jsonp: true,
      //jsonpCallback: "callback"
    });
  }

  /*
  * Function getLastSmartBadgeEvents
  *   description: get the currently SmartBadge events for user loggedIn
  */
  //$util.parseJson($input.json('$')) --> added to API gateway
  function getLastSmartBadgeEvents(user, day, month, year){
    var fullUrl = awsBaseUrl + timeEventsPaths+"?user="+user+"&day="+day+"&month="+month+"&year="+year
    console.log("Call the webService: "+fullUrl);

    return $.ajax({
      url: fullUrl,
      type: 'GET',
      dataType: "json",
      crossDomain: true,
      //jsonp: true,
      //jsonpCallback: "callbackEvents"
    });
  }

  /*
  * Function: smartBadgeAddEvent
  *   description: add a new TimeCardEvent to AWS
  */
  function smartBadgeAddEvent(smartEvent){
    console.log("Call the webService: "+awsBaseUrl + timeEventPath);
    /*
    alert(typeof smartEvent.userName + " - " + smartEvent.userName );
    alert(typeof smartEvent.eTimestamp + " - " +smartEvent.eTimestamp);
    alert(typeof smartEvent.address+ " - " +smartEvent.address);
    alert(typeof smartEvent.eDay + " - " + smartEvent.eDay);
    alert(typeof smartEvent.eHour + " - " +smartEvent.eHour);
    alert(typeof smartEvent.eLat + " - " +smartEvent.eLat);
    alert(typeof smartEvent.eLon + " - " +smartEvent.eLon);
    alert(typeof smartEvent.eMinute + " - " +smartEvent.eMinute);
    alert(typeof smartEvent.eMonth + " - " +smartEvent.eMonth);
    alert(typeof smartEvent.eSeconds + " - " +smartEvent.eSeconds);
    alert(typeof smartEvent.eType + " - " +smartEvent.eType);
    alert(typeof smartEvent.eYear + " - " +smartEvent.eYear);
    alert(typeof smartEvent.notes + " - " +smartEvent.notes);
    */
    var accessToken = window.localStorage.getItem("accessToken");
    //alert(accessToken);
    return $.ajax({
      type: 'POST',
      url: awsBaseUrl + timeEventPath,
      crossDomain: true,
      dataType: "json",
      headers: {
        "Authorization": accessToken,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(smartEvent)
    });
  }

//*********************************************************

  return {
    signInSmartBadge: signInSmartBadge,
    signUpSmartBadge: signUpSmartBadge,
    confUserSmartBadge: confUserSmartBadge,
    getSmartBadgeTimeZones: getSmartBadgeTimeZones,
    changePasswordSmartBadge: changePasswordSmartBadge,
    smartBadgeAddEvent: smartBadgeAddEvent,
    getLastSmartBadgeEvents: getLastSmartBadgeEvents,
    getServerCurrentDate: getServerCurrentDate
  };

});
