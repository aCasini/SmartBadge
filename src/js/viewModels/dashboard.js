/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
 // Renders map view using either Oracle mapViewer or Google Maps

 $(document).ready(function () {
   ko.applyBindings(viewModel);
});


'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'dataService', 'ojs/ojknockout', 'oraclemapviewer'],
function(oj, ko, $, app, data) {
    function DashboardViewModel() {

        var self = this;
        self.mapOne = ko.observable({
            lat: ko.observable(0),
            lng:ko.observable(0)
        });


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

            //alert("PRE: "+ self.mapOne().marker.position);


            self.mapOne().marker.setPosition(latLng);

            //alert("POST: "+ self.mapOne().marker.position);
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

        self.addMarker = function(location){
          var marker = new google.maps.Marker({
            position: location,
            map: map
          });
        }

      }


      //Handler for the google map
      ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var mapObj = ko.utils.unwrapObservable(valueAccessor());
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng));
                var mapOptions = { center: latLng,
                                  zoom: 10,
                                  mapTypeId: google.maps.MapTypeId.ROADMAP};

                mapObj.googleMap = new google.maps.Map(element, mapOptions);

                mapObj.marker = new google.maps.Marker({
                    map: mapObj.googleMap,
                    position: latLng,
                    title: "You Are Here",
                    draggable: true
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

    return DashboardViewModel;
  }
);
