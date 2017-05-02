
define(['jquery', 'dataService', 'appConfig'], function ($, data, appConfig) {
  function Car(app) {
    var self = this;


    self.signInSmartBadge = function (credentials) {
      //alert("credentials created --> invoke the function");
      //data.signInSmartBadge(credentials);
      SpinnerDialog.show("Sign In", "Verify your credentials ... ");

      data.signInSmartBadge(credentials).then(function (response) {
        alert(JSON.stringify(response));
        console.log('Registering Notifications Success: ', response);
        SpinnerDialog.hide();
        alert("Go to ...");
        oj.Router.rootInstance.go('dashbord/tabdashboard');
        alert("loaded");
      }).fail(function (response) {
        alert(JSON.stringify(response));
        console.error('Registering Notifications Fail: ', response);
        SpinnerDialog.hide();
      })


    }

  }

  return Car;
});
