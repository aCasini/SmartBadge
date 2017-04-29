define(['dataService'], function (data) {

function PushClient(app) {
  var self = this;

  self.signInSmartBadge = function (credentials) {
    //alert("credentials created --> invoke the function");
    // Show spinner dialog
    window.plugins.spinnerDialog.show();
    console.log("Call the AWS Cognito SigIn API");
    data.signInSmartBadge(credentials).then(function (response) {
      alert(JSON.stringify(response));
      console.log('Registering Notifications Success: ', response);
      // Show spinner dialog
      window.plugins.spinnerDialog.hide();
    }).fail(function (response) {
      alert(JSON.stringify(response));
      console.error('Registering Notifications Fail: ', response);
      window.plugins.spinnerDialog.hide();
    })
  }
}

return PushClient;
})
