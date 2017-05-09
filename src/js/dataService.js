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
  function getLastSmartBadgeEvents(user, day, month, year){
    var fullUrl = awsBaseUrl + timeEventsPaths+"?user="+user+"&day="+day+"&month="+month+"year="+year
    console.log("Call the webService: "+fullUrl);
    alert(fullUrl);
    return $.ajax({
      url: fullUrl,
      type: 'GET',
      dataType: "json",
      crossDomain: true
      //jsonp: true,
      //jsonpCallback: "callback"
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
  function registerForNotifications(registration) {
    return $.ajax({
      type: 'POST',
      url: registrationUrl,
      headers: baseHeaders,
      data: JSON.stringify(registration),
      contentType: 'application/json; charset=UTF-8'
    });
  }

  function getCustomers() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'customers'
      });
    else {
      return $.ajax(localUrl + 'customers.txt');
    }
  }

  function createCustomer(customer) {
    return $.ajax({
      type: 'POST',
      headers: baseHeaders,
      data: JSON.stringify(customer),
      url: baseUrl + 'customers',
      contentType: 'application/json; charset=UTF-8'
    });
  }

  function updateCustomer(id, customer) {
    return $.ajax({
      type: 'PATCH',
      headers: baseHeaders,
      data: JSON.stringify(customer),
      url: baseUrl + 'customers/' + id,
      contentType: 'application/json; charset=UTF-8'
    });
  }

  function getCustomer(id) {
    if(id) {
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'customers/' + id
        });
      } else {

        var promise = new Promise(function(resolve, reject){
          $.get(localUrl + 'customers.txt').done(function(response) {
            var customers = JSON.parse(response).result;
            var customer = customers.filter(function(customer) { return customer.id === id; });
            resolve(JSON.stringify(customer[0]));
          }).fail(function(response){
            reject(response);
          });
        });

        return promise;
      }
    }

    return $.when(null);
  }

  function getIncidents() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'incidents?technician=~'
      });
    else {
      return $.get(localUrl + 'incidents.txt');
    }
  }

  function getIncidentsStats() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'stats/incidents?technician=~'
      });
    else {
      return $.get(localUrl + 'incidentsStats.txt');
    }
  }

  function getIncidentsHistoryStats() {
    if(isOnline) {
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'stats?technician=~&period=annual'
      });
    } else {
      return $.get(localUrl + 'incidentsHistoryStats.txt');
    }
  }

  function createIncident(incident) {
    return $.ajax({
      type: 'POST',
      headers: baseHeaders,
      url: baseUrl + 'incidents',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(incident)
    });
  }

  function getIncident(id) {
    if(id)
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'incidents/' + id
        });
      } else {
        return $.get(localUrl + 'incidents/' + id + '.txt');
      }

    return $.when(null);
  }

  function updateIncident(id, incident) {
    if(id)
      return $.ajax({
        type: 'PUT',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(incident)
      });
    return $.when(null);
  }

  function getIncidentActivities(id) {
    if(id) {
      if(isOnline) {
        return Promise.resolve($.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'incidents/' + id + '/activities'
        }));
      } else {
        return $.get(localUrl + 'incidents/' + id + '/activities.txt');
      }
    }
  }

  function postIncidentActivity(id, comment, picture) {
    if(id && comment) {

      var activity = { comment: comment, picture: picture };

      return $.ajax({
        type: 'POST',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id + '/activities',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(activity)
      });
    } else {
      return $.when(null);
    }
  }

  function updateIncidentActivity(id, actid, content) {
    if(id && actid && content)
      return $.ajax({
        type: 'PATCH',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id + '/activities/' + actid,
        data: JSON.stringify(content),
        contentType: 'application/json; charset=UTF-8'
      });
    else
      return $.when(null);
  }

  function getLocation(id) {
    if(id) {
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'locations/' + id
        });
      } else {

        var promise = new Promise(function(resolve, reject){
          $.get(localUrl + 'locations.txt').done(function(response) {
            var locations = JSON.parse(response);
            var location = locations.filter(function(location) { return location.id === id; });
            resolve(JSON.stringify(location[0]));
          }).fail(function(response){
            reject(response);
          });
        });

        return promise;
      }

    } else {
      return $.when(null);
    }

  }

  function getUserProfile() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'users/~'
      });
    else {
      return $.get(localUrl + 'users.txt');
    }
  }

  function updateUserProfile(user) {
    return $.ajax({
      type: 'PATCH',
      headers: baseHeaders,
      url: baseUrl + 'users/~',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(user)
    });
  }

  return {
    signInSmartBadge: signInSmartBadge,
    signUpSmartBadge: signUpSmartBadge,
    confUserSmartBadge: confUserSmartBadge,
    getSmartBadgeTimeZones: getSmartBadgeTimeZones,
    changePasswordSmartBadge: changePasswordSmartBadge,
    smartBadgeAddEvent: smartBadgeAddEvent,
    getLastSmartBadgeEvents: getLastSmartBadgeEvents,
    getServerCurrentDate: getServerCurrentDate,
    registerForNotifications: registerForNotifications,
    getCustomers: getCustomers,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    getCustomer: getCustomer,
    getIncidents: getIncidents,
    getIncidentsStats: getIncidentsStats,
    getIncidentsHistoryStats: getIncidentsHistoryStats,
    createIncident: createIncident,
    getIncident: getIncident,
    updateIncident: updateIncident,
    getIncidentActivities: getIncidentActivities,
    postIncidentActivity: postIncidentActivity,
    updateIncidentActivity: updateIncidentActivity,
    getLocation: getLocation,
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    setOnlineMode: setOnlineMode
  };

});
