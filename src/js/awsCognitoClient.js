/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
// PushClient using PhoneGap notification plugin and serviceWorker

'use strict';

define(['jquery'], function ($) {

  function AWSCognitoClient(app) {
    alert("AWSCognitoClient");
    var self = this;

    var platforms = navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);
    self.platform = platforms ? platforms[0] : null;
    if(self.platform ) {
      if(self.platform.substring(0,1) == 'i'){
        self.platform = "IOS"
      } else if(self.platform && self.platform.substring(0,1) == 'A'){
        self.platform = "ANDROID"
      }
    }

    self.providers = {
      'IOS': 'APNS',
      'ANDROID': 'GCM',
      'WINDOWS': 'WNS',
      'WEB': 'SYNIVERSE'
    }

    // register notification with MCS backend
    self.registerForNotifications = function () {
      alert("i am here");
    }

  }

  return AWSCognitoClient;
})
