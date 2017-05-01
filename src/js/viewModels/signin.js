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
    self.rememberUserName = ko.observable(['remember']);
    self.errorMessage = ko.observable();
    self.errorMessagePass = ko.observable();
    self.errorMessageMail = ko.observable();

    //require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojdialog'],
    //function(oj, ko, $)
    //{

    //}
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

    self.signUpClose = function(){
      $( "#wideDialog" ).ojDialog("close");
    }

    self.signUp = function(){

      var initialVisibility = $("#wideDialog" ).ojDialog( "option", "initialVisibility" );
      //alert("initialVisibility: "+initialVisibility);

      $("#wideDialog" ).ojDialog( "option", "initialVisibility", "show" );
      var initialVisibilityAfter = $("#wideDialog" ).ojDialog( "option", "initialVisibility" );
      //alert("initialVisibilityAfter: "+initialVisibilityAfter);

      $( "#wideDialog" ).ojDialog("open");
      //alert("refreshed");

      //ko.applyBindings(new dialogModel(), document.getElementById('dialogWrapper'));
      /*
        var message = "Do you want to create the user? please enter you eMail";
        var title = "Sign-Up";
        var buttonLabels = ["Yes","No"];
        var defaultText = "yourUser@bridgeconsulting.it"

        navigator.notification.prompt(message, promptCallback, title, buttonLabels, defaultText);

        function promptCallback(result) {
          if(result.buttonIndex == 1){
            alert("The email with the confirmation code has been sent. Please confirm the resgistration");
          }
           console.log("You clicked " + result.buttonIndex + " button! \n" +
              "You entered " +  result.input1);
        }
        */


    };

    self.confirmSignUp = function() {
      //TODO: implement me
      alert("Confirm User Registration by code");
    }

    self.changePassSignUp = function() {
      //TODO: implement me
      alert("Change Password");
    }

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
