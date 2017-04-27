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
define(['ojs/ojcore', 'knockout', 'jquery', 'appController',
        'ojs/ojrouter',
        'ojs/ojknockout',
        'ojs/ojcheckboxset',
        'ojs/ojinputtext',
        'ojs/ojbutton',
        'ojs/ojanimation'], function(oj, ko, $, app) {
  function signinViewModel() {
    var self = this;

    self.handleTransitionCompleted = function(info) {
      // invoke fadeIn animation
      var animateOptions = { 'delay': 0, 'duration': '1s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['fadeIn']($('.demo-signin-bg')[0], animateOptions);
    }

    // Replace with state save logic for rememberUserName
  //  self.userName = ko.observable('Harry Hole');
  //  self.passWord = ko.observable('password');

    self.userName = ko.observable();
    self.passWord = ko.observable();
    self.rememberUserName = ko.observable(['remember']);

    // Replace with sign in authentication
    self.signIn = function() {
      //Get UserName and Password
      let userName = $('#MobilePTUsername').val();
      let passWord = $('#MobilePTPassword').val();

      alert("Start the login to AWS Cognito");
      alert("UserName: "+ userName);
      alert("Password: "+ passWord);
      //app.callAwsCognito();
      alert(app.awsCognitoClient);
      app.awsCognitoClient.registerForNotifications();
      //oj.Router.rootInstance.go('incidents/tabdashboard');
    };

  }
  return signinViewModel;
});
