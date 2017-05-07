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

    function IncidentsViewModel() {
      var self = this;

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
              //alert("address : "+ response.Items[i].address);
              var address = response.Items[i].address;
              //alert("lat : "+ response.Items[i].lat);
              var lat = response.Items[i].lat;
              //alert("lng : "+ response.Items[i].long);
              var long = response.Items[i].long;

              var timeZoneLatlng = new google.maps.LatLng(lat,long);

              var markerTimeZone = new google.maps.Marker({
                  position: timeZoneLatlng,
                  title:address
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
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          var timestamp = position.timestamp;
          console.log("Latitude: "+lat);
          console.log("Longitude: "+lng);
          console.log("Timestamp: "+timestamp);

          self.mapOne().lat(lat);
          self.mapOne().lng(lng);

          var latLng = new google.maps.LatLng(lat,lng);
          self.mapOne().marker.setPosition(latLng);

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
    return new IncidentsViewModel();
  }
);
