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
         'dataService'
       ], function(oj, ko, $, app, data) {

    function DashboardViewModel() {
      var self = this;
      var addressoUser;
      // Header Config
      self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};

      self.mapOne = ko.observable({
          lat: ko.observable(0),
          lng:ko.observable(0)
      });

      self.numeroCausale = ko.observable();

      var data = require("dataService");
//***********
      data.getSmartBadgeTimeZones()
        .then(function (response) {
          if(typeof(response.errorMessage) != "undefined"){
            alert("ERROR: "+response.errorMessage);
            console.log("ERROR: "+response.errorMessage);
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
          alert("ERROR_: "+response.errorMessage);
          console.error('Registering Notifications Fail: ', response);
        })
//***********
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
                          alert('Unable to detect your address.');
                          }
              } else {
                  //navigator.notification.alert('Unable to detect your address.');
                  alert('Unable to detect your address.');
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
                alert("Geolocation service failed.");
                oj.Logger.warn("Geolocation service failed.");
              } else {
                oj.Logger.warn("Browser doesn't support geolocation");
              }
      };

      //SMARTBADGE add a new EVENT
      self.startSmartBadge = function(){


        navigator.geolocation.getCurrentPosition(function(position){
          //window.plugins.spinnerDialog.show();

          var type        = "IN";
          var userName    = window.localStorage.getItem("userName");
          var lat         = position.coords.latitude;
          var lng         = position.coords.longitude;
          var timestamp   = position.timestamp;
          var date        = new Date();
          var hour        = date.getHours();
          var minutes     = date.getMinutes();
          var seconds     = date.getSeconds();
          var day         = date.getDate();
          var month       = date.getMonth();
          var year        = date.getFullYear();
          var note        = "empty";
          var address     = addressoUser;

          console.log("Timbrature IN for " + userName + " at Time: "+ timestamp + " - Position( " + lat + " , " + lng + " ) - Location: "+address);
          alert("Timbrature IN for "+userName+ " at Time: "+ timestamp + " - Position( "+lat + " , " +lng + " ) - Location: "+address);
          console.log("Latitude: "+lat);
          console.log("Longitude: "+lng);
          console.log("Timestamp: "+timestamp);

          var smartEvent = {
            "userName": userName,
            "eTimestamp": timestamp,
            "address": address,
            "eDay": day,
            "eHour": hour,
            "eLat": lat,
            "eLon": lng,
            "eMinute": minutes,
            "eMonth": month+1,
            "eSeconds": seconds,
            "eType": type,
            "eYear": year,
            "notes": note
          }

          app.smartBadgeAddEvent(smartEvent);

          //alert("Start for "+userName + " at "+timestamp);
          //TODO: implemetare Haversine per controllare che la zona di timbratora sia valida

          //window.plugins.spinnerDialog.show();
        }, function(){
          self._handleNoGeolocation(browserSupportFlag);
        });

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
