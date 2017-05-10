/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
 'use strict';
 define(['ojs/ojcore', 'knockout',
         'jquery', 'appController',
         'ojs/ojrouter',
         'ojs/ojknockout',
         'ojs/ojcheckboxset',
         'ojs/ojinputtext',
         'ojs/ojbutton',
         'ojs/ojanimation',
         'ojs/ojdialog',
         'utils',
         'dataService'
       ], function(oj, ko, $, app, utils, data) {

    function DashboardViewModel() {
      var self = this;
      var addressoUser;
      var smartBadgeTimestamp;

      var isFakeGeolocation;
      // Header Config
      self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};

      self.mapOne = ko.observable({
          lat: ko.observable(0),
          lng:ko.observable(0)
      });

      self.numeroCausale = ko.observable();

      var data = require("dataService");

      //Retrieval the currently SmartBadge Events for user Logged In
      var currentDate = new Date();

      var day = currentDate.getDate();
      var month = currentDate.getMonth()+1;
      var year = currentDate.getFullYear();
      var user = window.localStorage.getItem("userName");

      self.handleActivated = function(info) {
        // Implement if needed
        utils = new Utils();
        utils.updateEventConsole(data);
      };



      /**
      * Function getSmartBadgeTimeZones
      *   description: Call the API from dataservice in order to retrieval the TimeZones
      **/
      data.getSmartBadgeTimeZones()
        .then(function (response) {
          if(typeof(response.errorMessage) != "undefined"){
            $( "#textInfo" ).text("ERROR: Something went wrong!");
            $("#infoDialogDashboard" ).ojDialog("open");
            console.error("ERROR: "+response.errorMessage);
          }else{

            for(var i=0; i<response.Count; i++) {
              var address     = response.Items[i].address;
              var lat         = response.Items[i].lat;
              var long        = response.Items[i].long;
              var imageUrl    = response.Items[i].icon;


              var timeZoneLatlng = new google.maps.LatLng(lat,long);

              var image = {
                url: imageUrl,
                // This marker is 20 pixels wide by 32 pixels high.
                size: new google.maps.Size(32, 32)
              }

              var markerTimeZone = new google.maps.Marker({
                  position: timeZoneLatlng,
                  title :address,
                  icon: image
              });


              // To add the marker to the map, call setMap();
              console.log("Added the marker for "+address);
              markerTimeZone.setMap(self.mapOne().googleMap);
              // Add the circle for this city to the map.
              var cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: self.mapOne().googleMap,
                center: {lat: lat, lng: long},
                radius: 120
              });
            }

            console.log('Registering Notifications Success: ', response);
          }
        }).fail(function (response) {
          $( "#textInfo" ).text("ERROR: "+ response.errorMessage);
          $("#infoDialogDashboard" ).ojDialog("open");
          console.error("ERROR_: "+response.errorMessage);
          console.error('Registering Notifications Fail: ', response);
        })
        /**
        //End Function getSmartBadgeTimeZones
        **/

      var browserSupportFlag;
      if(navigator.geolocation){
        browserSupportFlag = true;

        //retrieval the current position
        navigator.geolocation.getCurrentPosition(function(position){
          var lat           = position.coords.latitude;
          var lng           = position.coords.longitude;
          var timestamp     = position.timestamp;
          console.log("Latitude: "+lat);
          console.log("Longitude: "+lng);
          console.log("Timestamp: "+timestamp);

          self.mapOne().lat(lat);
          self.mapOne().lng(lng);

          var latLng = new google.maps.LatLng(lat,lng);
          self.mapOne().marker.setPosition(latLng);

          var reverseGeocoder = new google.maps.Geocoder();
          reverseGeocoder.geocode({'latLng': latLng}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                          if (results[0]) {
                            addressoUser = results[0].formatted_address;
                          }
                  else {
                          //navigator.notification.alert('Unable to detect your address.');
                          $( "#textInfo" ).text("ERROR: Unable to detecte your address!");
                          $("#infoDialogDashboard" ).ojDialog("open");
                          console.log('Unable to detect your address.');
                        }
              } else {
                  //navigator.notification.alert('Unable to detect your address.');
                  $( "#textInfo" ).text("ERROR: Unable to detect your address");
                  $("#infoDialogDashboard" ).ojDialog("open");
                  console.log('Unable to detect your address.');
              }
          });

        }, function(){
          self._handleNoGeolocation(browserSupportFlag);
        });
      } else{
        browserSupportFlag = false;
        self._handleNoGeolocation(browserSupportFlag);
      }

      self._handleNoGeolocation = function(errorFlag) {
              if (errorFlag == true) {
                $( "#textInfo" ).text("ERROR: Geolocation service failed!");
                $("#infoDialogDashboard" ).ojDialog("open");
                //TODO: remove me
                isFakeGeolocation = true;
                oj.Logger.warn("Geolocation service failed.");
              } else {
                oj.Logger.warn("Browser doesn't support geolocation");
              }
      };



      //SMARTBADGE add a new EVENT
      self.addSmartBadgeEvent = function(typeValue){

        var type = typeValue;
        //$("#textarea-smartBadgeEvents-ID").append(logEvent);

        if(isFakeGeolocation){
          //alert("isFakegeolocation -->  "+isFakeGeolocation);
          /**
          * Function; getServerCurrentDate
          *     description: retrieval the server smartbadge
          **/
          data.getServerCurrentDate().then(function (response) {
            smartBadgeTimestamp = response.timestamp;
            console.log("Retrieval the SmartBadge Server time: "+response.timestamp);
            //alert("Retrieval the SmartBadge Server time: "+response.timestamp);
            var type        = $("#button-startEvent-ID").val();
            var userName    = window.localStorage.getItem("userName");
            var lat         = 43.776775199999996;
            var lng         = 11.296519799999999;
            var timestamp   = smartBadgeTimestamp;
            var date        = new Date();
            var hour        = response.hour;
            var minutes     = response.minutes;
            var seconds     = response.seconds;
            var day         = response.day;
            var month       = response.month;
            var year        = response.year;
            var note        = "empty";
            var address     = "Via di Test, Firezne, Italy";

            console.log("Timbrature IN for " + userName + " at Time: "+ timestamp + " - Position( " + lat + " , " + lng + " ) - Location: "+address);
            //alert("Timbrature IN for "+userName+ " at Time: "+ timestamp + " - Position( "+lat + " , " +lng + " ) - Location: "+address);
            console.log("Latitude: "+lat);
            console.log("Longitude: "+lng);
            console.log("Timestamp: " + timestamp);

            var smartEvent = {
              "userName": "acasini",
              "eTimestamp": timestamp,
              "address": address,
              "eDay": day,
              "eHour": hour,
              "eLat": lat,
              "eLon": lng,
              "eMinute": minutes,
              "eMonth": month,
              "eSeconds": seconds,
              "eType": type,
              "eYear": year,
              "notes": note
            }

            app.smartBadgeAddEvent(smartEvent);

          }).fail(function (response) {
            console.error("ERROR: unable to get current time from SmartBadge Server AWS");
          });

        }else{
          navigator.geolocation.getCurrentPosition(function(position){

            /**
            * Function; getServerCurrentDate
            *     description: retrieval the server smartbadge
            **/
            data.getServerCurrentDate().then(function (response) {
              smartBadgeTimestamp = response.timestamp;
              console.log("Retrieval the SmartBadge Server time: "+response.timestamp);

              var userName    = window.localStorage.getItem("userName");
              var lat         = position.coords.latitude;
              var lng         = position.coords.longitude;
              var timestamp   = response.timestamp;
              var hour        = response.hour;
              var minutes     = response.minutes;
              var seconds     = response.seconds;
              var day         = response.day;
              var month       = response.month;
              var year        = response.year;
              var note        = "empty";
              var address     = addressoUser;

              console.log("Timbrature IN for " + userName + " at Time: "+ timestamp + " - Position( " + lat + " , " + lng + " ) - Location: "+address);
              //alert("Timbrature IN for "+userName+ " at Time: "+ timestamp + " - Position( "+lat + " , " +lng + " ) - Location: "+address);
              console.log("Latitude: "+lat);
              console.log("Longitude: "+lng);
              console.log("Timestamp: " + timestamp);

              var smartEvent = {
                "userName": "acasini",
                "eTimestamp": timestamp,
                "address": address,
                "eDay": day,
                "eHour": hour,
                "eLat": lat,
                "eLon": lng,
                "eMinute": minutes,
                "eMonth": month,
                "eSeconds": seconds,
                "eType": type,
                "eYear": year,
                "notes": note
              }

              app.smartBadgeAddEvent(smartEvent);
              //TODO: implemetare Haversine per controllare che la zona di timbratora sia valida

            }).fail(function (response) {
              console.error("ERROR: unable to get current time from SmartBadge Server AWS");
            });

          }, function(){
            self._handleNoGeolocation(browserSupportFlag);
            console.error("ERROR: browser not support the geolocation");
          });
        }


      }

      self.infoClose = function(){
        $( "#infoDialogDashboard" ).ojDialog("close");
      }

    }

    ko.bindingHandlers.map = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
              var mapObj = ko.utils.unwrapObservable(valueAccessor());
              var latLng = new google.maps.LatLng(
                  ko.utils.unwrapObservable(mapObj.lat),
                  ko.utils.unwrapObservable(mapObj.lng));
              var mapOptions = { center: latLng,
                                zoom: 15,
                                mapTypeId: google.maps.MapTypeId.ROADMAP};

              mapObj.googleMap = new google.maps.Map(element, mapOptions);

              mapObj.marker = new google.maps.Marker({
                  map: mapObj.googleMap,
                  position: latLng,
                  title: "You Are Here",
                  draggable: false
              });

              mapObj.onChangedCoord = function(newValue) {
                  var latLng = new google.maps.LatLng(
                      ko.utils.unwrapObservable(mapObj.lat),
                      ko.utils.unwrapObservable(mapObj.lng));
                  mapObj.googleMap.setCenter(latLng);
              };

              mapObj.onMarkerMoved = function(dragEnd) {
                  var latLng = mapObj.marker.getPosition();
                  mapObj.lat(latLng.lat());
                  mapObj.lng(latLng.lng());
              };

              mapObj.lat.subscribe(mapObj.onChangedCoord);
              mapObj.lng.subscribe(mapObj.onChangedCoord);

              google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);

              $("#" + element.getAttribute("id")).data("mapObj",mapObj);
            }
    };

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
