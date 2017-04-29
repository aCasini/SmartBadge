/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

 // signin page viewModel
 // In a real app, replace it with your authentication and logic
'use strict';
define(['ojs/ojcore', 'knockout',
        'jquery', 'appController',
        'ojs/ojrouter',
        'ojs/ojknockout',
        'ojs/ojcheckboxset',
        'ojs/ojinputtext',
        'ojs/ojbutton',
        'ojs/ojanimation'
        ], function(oj, ko, $, app) {
  function signinViewModel() {
    var self = this;

    self.handleTransitionCompleted = function(info) {
      // invoke fadeIn animation
      var animateOptions = { 'delay': 0, 'duration': '1s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['fadeIn']($('.demo-signin-bg')[0], animateOptions);
    }

    // Replace with state save logic for rememberUserName
    self.userName = ko.observable();
    self.passWord = ko.observable();
    self.rememberUserName = ko.observable(['remember']);
    self.errorMessage = ko.observable();
    self.errorMessagePass = ko.observable();


    // Replace with sign in authentication
    self.signIn = function() {
      //Get UserName and Password
      let userName = $('#MobilePTUsername').val();
      let passWord = $('#MobilePTPassword').val();


      if(userName == ''){
        $("#userErrorMsg").text("Error: Fill the userName");
        //self.errorMessage = ko.observable("Fill the userName ");
      }else{
        if(passWord == ''){
          $("#userErrorMsg").text("");
          $("#passErrorMsg").text("Error: Fill the Password");
        }else{
          $("#userErrorMsg").text("");
          $("#passErrorMsg").text("");
          //TODO: call the aws cognito authentication
          //app.callAwsCognito();
          var credentials = {
            "userName": userName,
            "passWord": passWord
          }
          //app.pushClient.registerForNotifications();
          //app.pushClient.signInSmartBadge(credentials);
          app.signInSmartBadge(credentials);
//          oj.Router.rootInstance.go('dashboard');
        }
      }
    };

  }
  return signinViewModel;
});
