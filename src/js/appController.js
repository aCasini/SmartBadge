/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */

define(['ojs/ojcore',
        'ojs/ojrouter',
        'ojs/ojarraytabledatasource',
        'ojs/ojmoduleanimations',
        'knockout',
        'jquery',
        'dataService',
        //'PushClient',
        'ConnectionDrawer'
      ],
  function(oj, ko, ConnectionDrawer) {

     function ControllerViewModel() {
      var self = this;
      //Load the dataModule by requireJS
      var data = require("dataService");

      /*
      * Function : call the AWs APIs for Cognito SignIn user
      */
      self.signInSmartBadge = function (credentials) {
        // Show spinner dialog
        window.plugins.spinnerDialog.show();
        console.log("Call the AWS Cognito SigIn API");

        data.signInSmartBadge(credentials).then(function (response) {
          //alert(JSON.stringify(response));
          console.log('Registering Notifications Success: ', response);
          // Show spinner dialog
          $('#navigationBarID').css('display','inline');
          window.plugins.spinnerDialog.hide();

          sessionStorage.refreshToken=response.refreshToken.token;
          sessionStorage.accessToken=response.accessToken.jwtToken;

          oj.Router.rootInstance.go('dashboard');
        }).fail(function (response) {
          alert(JSON.stringify(response));
          console.error('Registering Notifications Fail: ', response);
          window.plugins.spinnerDialog.hide();
        })
      }

      /*
      * Function : call the AWs APIs for Cognito SignUp user
      */
      self.signUpSmartBadge = function (registration) {

        window.plugins.spinnerDialog.show();
        console.log("Call the AWS Cognito SigUp API");

        data.signUpSmartBadge(registration).then(function (response) {
          if(typeof(response.errorMessage) != "undefined"){
            alert("ERROR: "+response.errorMessage);
            console.log("ERROR: "+response.errorMessage);
          }else{
            var user = response.userName.username;
            var tmpPass = response.passWord;

            $("#textInfo" ).text("You Registration info: " + user + " / " +tmpPass + "\n  -> Please, change your password aftet confirmation");
            //Setting values in confirmation popup
            $("#MobilePTUsername_conf").val(user);

            //Setting values in change pass popup
            $("#MobilePTUsername_cp").val(user);
            $('#MobilePTPassword_cp_old').val(tmpPass);
            $("#infoDialog" ).ojDialog("open");


            console.log('Registering Notifications Success: ', response);
          }
          // Show spinner dialog
          window.plugins.spinnerDialog.hide();
        }).fail(function (response) {
          alert("ERROR: "+response.errorMessage);
          //alert(JSON.stringify(response.errorMessage));
          console.error('Registering Notifications Fail: ', response);
          window.plugins.spinnerDialog.hide();
        })
      }

      /*
      * Function : call the AWs APIs for Cognito confirm user
      */
      self.confUserSmartBadge = function(confirmUser){
        window.plugins.spinnerDialog.show();
        console.log("Call the AWS Cognito Confirmation User API");

        data.confUserSmartBadge(confirmUser).then(function (response) {
          if(typeof(response.errorMessage) != "undefined"){
            alert("ERROR: "+response.errorMessage);
            console.log("ERROR: "+response.errorMessage);
          }else{
            $( "#textInfo" ).text("User " + confirmUser.userName + " has been CONFIRMED");
            $( "#infoDialog" ).ojDialog("open");


            console.log('Registering Notifications Success: ', response);
          }
          // Show spinner dialog
          window.plugins.spinnerDialog.hide();
        }).fail(function (response) {
          alert("ERROR: "+response.errorMessage);
          //alert(JSON.stringify(response.errorMessage));
          console.error('Registering Notifications Fail: ', response);
          window.plugins.spinnerDialog.hide();
        })
      }

      /*
      * Function : call the AWS APIs for Change Password in cognito user-pool
      */
      self.changePasswordSmartBadge = function(changePassword){
        window.plugins.spinnerDialog.show();
        console.log("Call the AWS Cognito Change User Password API");

        data.changePasswordSmartBadge(changePassword).then(function (response) {
          if(typeof(response.errorMessage) != "undefined"){
            alert("ERROR: "+response.errorMessage);
            console.log("ERROR: "+response.errorMessage);
          }else{
            $( "#textInfo" ).text("Great! Password Changed");
            $( "#infoDialog" ).ojDialog("open");

            console.log('Registering Notifications Success: ', response);
          }
          // Show spinner dialog
          window.plugins.spinnerDialog.hide();
        }).fail(function (response) {
          alert("ERROR: "+response.errorMessage);
          //alert(JSON.stringify(response.errorMessage));
          console.error('Registering Notifications Fail: ', response);
          window.plugins.spinnerDialog.hide();
        })
      }

      //********************


      // Save the theme so we can perform platform specific navigational animations
      var platform = oj.ThemeUtils.getThemeTargetPlatform();

      // Router setup
      self.router = oj.Router.rootInstance;

      self.router.configure({
       'signin': {label: 'Sign In'},
       'dashboard': {label: 'Dashboard', isDefault: true},
       'incidents': {label: 'Incidents'},
       'customers': {label: 'Customers'},
       'profile': {label: 'Profile'},
       'about': {label: 'About'}
      });

      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
      // Callback function that can return different animations based on application logic.
      function switcherCallback(context) {
        if (platform === 'android')
          return 'fade';
        return null;
      };

      function mergeConfig(original) {
        return $.extend(true, {}, original, {
          'animation': oj.ModuleAnimations.switcher(switcherCallback)
        });
      }

      self.moduleConfig = mergeConfig(self.router.moduleConfig);

      // Navigation setup
      var navData = [
      {name: 'Dashboard', id: 'dashboard',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
      {name: 'Incidents', id: 'incidents',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
      {name: 'Customers', id: 'customers',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
      {name: 'Profile', id: 'profile',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'},
      {name: 'About', id: 'about',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
      ];

      self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

      // Header Setup
      self.getHeaderModel = function() {
        var headerFactory = {
          createViewModel: function(params, valueAccessor) {
            var model =  {
              pageTitle: self.router.currentState().label,
              handleBindingsApplied: function(info) {
                // Adjust content padding after header bindings have been applied
                self.adjustContentPadding();
              }
            };
            return Promise.resolve(model);
          }
        }
        return headerFactory;
      }

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions.
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);
