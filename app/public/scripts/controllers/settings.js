'use strict';

angular.module('feedbacks')
  .controller('SettingsController', function ($scope, $wix, $http, application) {

      var loadSettings = function(){
          application.getWidgetSettings().then(
              function (response){ // Success loading settings
                  $scope.settings = response.data[0];
              }, function(response){ // Shit's fucked yo

              });
      }
      loadSettings();

      $scope.catalogs = []; // Init an empty array

      $http.get('/catalogs/' + application.getApplicationId()).then(
          function (response){ // Success loading settings
              $scope.catalogs = response.data;
          }, function(response){ // Shit's fucked yo
              debugger;
          });

      $scope.loadCatalogs = function () {

      };

      $scope.goToDash = function () {
          $wix.Settings.getDashboardAppUrl(function(url) {
              window.open(url, '_blank');
          });
      };

      $scope.revertChanges = function () {
          loadSettings();
      };

      $scope.applyChanges = function () {
          console.log('click!');
          $wix.Settings.triggerSettingsUpdatedEvent($scope.settings, $wix.Utils.getOrigCompId());
      };
      
      $scope.save = function(){
          var request = $http({
              method: "put",
              url: "/widgets",
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