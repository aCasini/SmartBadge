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
        'ojs/ojanimation',
        'ojs/ojdialog'
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
    self.eMail = ko.observable();
    self.confcode = ko.observable();
    self.userName_cp = ko.observable();
    self.passWord_cp_old = ko.observable();
    self.passWord_cp_new = ko.observable();
    self.rememberUserName = ko.observable(['remember']);
    self.errorMessage = ko.observable();
    self.errorMessagePass = ko.observable();
    self.errorMessageMail = ko.observable();
    self.errorMessageConfcode = ko.observable();

    /*
    * OK SingUp Function
    */
    self.signUpOK = function(){
      var email = $('#MobilePTemail').val();
      if(email == ''){
        $("#emailErrorMsg").text("Error: Fill the e-mail");
      }else if(!email.endsWith("bridgeconsulting.it")){
        $("#emailErrorMsg").text("Error: the email must has a bridgeconsulting domain");
      }else{
        $( "#wideDialog" ).ojDialog("close");
      }
    }

    /*
    * CANCEL SingUp Function
    */
    self.signUpClose = function(){
      $( "#wideDialog" ).ojDialog("close");
    }

    /*
    * Main function -> open the SingUp Popup
    */
    self.signUp = function(){
      var initialVisibility = $("#wideDialog" ).ojDialog( "option", "initialVisibility" );

      $("#wideDialog" ).ojDialog( "option", "initialVisibility", "show" );
      var initialVisibilityAfter = $("#wideDialog" ).ojDialog( "option", "initialVisibility" );

      $( "#wideDialog" ).ojDialog("open");

    };

    /*
    * Main function -> open the Confirmation Popup
    */
    self.confirmSignUp = function() {
      var initialVisibility = $("#confirmDialog" ).ojDialog( "option", "initialVisibility" );

      $("#confirmDialog" ).ojDialog( "option", "initialVisibility", "show" );
      var initialVisibilityAfter = $("#confirmDialog" ).ojDialog( "option", "initialVisibility" );

      $( "#confirmDialog" ).ojDialog("open");
    }

    /*
    * OK Confirmation Function
    */
    self.confirmUpOK = function(){
      var confCode = $('#MobilePTconfcode').val();
      var isnum = /^\d+$/.test(confCode);

      if(isnum == false){
        $("#confcodeErrorMsg").text("Error: Registration Code must contains only digits");
      }else if(confCode == ''){
        $("#confcodeErrorMsg").text("Error: Fill the Code to complete the registration");
      }else{
        //TODO: call the confir webService
        $( "#confirmDialog" ).ojDialog("close");
      }
    }

    /*
    * CANCEL Confirmation Function
    */
    self.confirmClose = function() {
      $( "#confirmDialog" ).ojDialog("close");
    }

    self.changePassSignUp = function() {
      alert("Change Password");
      var initialVisibility = $("#changePassDialog" ).ojDialog( "option", "initialVisibility" );

      $("#changePassDialog" ).ojDialog( "option", "initialVisibility", "show" );
      var initialVisibilityAfter = $("#changePassDialog" ).ojDialog( "option", "initialVisibility" );

      $( "#changePassDialog" ).ojDialog("open");
    }

    self.changePassOK = function(){
      //TODO: implement me
      $( "#changePassDialog" ).ojDialog("close");
    }

    self.changePassClose = function(){
      $( "#changePassDialog" ).ojDialog("close");
    }

/*
* === SING IN FUNCTION ====
*/
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
