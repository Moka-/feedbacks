'use strict';

angular.module('feedbacks')
  .controller('SettingsController', function ($scope, $wix, $http, application) {

      var loadSettings = function(){
          application.getWidgetSettings().then(
              function (response){ // Success loading settings
                  debugger;
                  $scope.settings = response.data;
              }, function(response){ // Shit's fucked yo

              });
      }
      loadSettings();

      $scope.catalogs = []; // Init an empty array

      // $http.get('/api/catalogs/' + application.getApplicationId()).then(
      //     function (response){ // Success loading settings
      //         $scope.catalogs = response.data;
      //     }, function(response){ // Shit's fucked yo
      //         debugger;
      //     });

      // $scope.loadCatalogs = function () {
      //
      // };

      $scope.goToDash = function () {
          $wix.Settings.getDashboardAppUrl(function(url) {
              window.open(url, '_blank');
          });
      };

      $scope.revertChanges = function () {
          loadSettings();
      };

      $scope.applyChanges = function () {
          $wix.Settings.triggerSettingsUpdatedEvent($scope.settings, $wix.Utils.getOrigCompId());
      };

      $scope.save = function(){
          var request = $http({
              method: "put",
              url: "/api/widgets/" + application.getAppInstance() + "/" + application.getComponentId(),
              data: $scope.settings
          });

          return request.then(
              function (res) {
                  $wix.Settings.triggerSettingsUpdatedEvent($scope.settings, application.getComponentId());
              }, function (err) {
                  alert('Error loading new settings');
              });
      };
  });