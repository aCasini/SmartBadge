
require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojdialog'],
function(oj, ko, $)
{
function dialogModel() {

   var self = this;
   self.handleOpen = $("#buttonOpener").click(function() {
       $("#modalDialog1").ojDialog("open"); });

   self.handleOKClose = $("#okButton").click(function() {
       $("#modalDialog1").ojDialog("close"); });
}

});
