'use strict';

angular.module('settings')
  .controller('SettingsController', function ($scope, $wix, $http, feedbacksApp) {

      var loadSettings = function(){
          feedbacksApp.getWidgetSettings().then(
              function (response){ // Success loading settings
                  $scope.settings = response.data[0];
              }, function(response){ // Shit's fucked yo

              });
      }
      loadSettings();

      $scope.catalogs = []; // Init an empty array

      $http.get('/catalogs/' + feedbacksApp.getApplicationId()).then(
          function (response){ // Success loading settings
              $scope.catalogs = response.data;
          }, function(response){ // Shit's fucked yo
              debugger;
          });

      $scope.loadCatalogs = function () {

      }

      $scope.gotodash = function(){
          $wix.Settings.getDashboardAppUrl(function(url) {
              window.open(url, '_blank');
          });
      }
      $scope.revert = function(){
          loadSettings();
      }
      $scope.apply = function(){
          $wix.Settings.triggerSettingsUpdatedEvent($scope.settings, $wix.Utils.getOrigCompId());
      }
      $scope.save = function(){
          alert('save');

          var request = $http({
              method: "post",
              url: "/widgets",
              data: $scope.settings
          });

          return request.then(
              function (res) {
                  $wix.Settings.triggerSettingsUpdatedEvent(res, $wix.Utils.getOrigCompId());
              }, function (err) {
                  alert('oops');
                  $scope.new_feedback = {
                      comment: '',
                      rating: 0
                  };
                  $scope.from_expanded = false;
              });
      }
  });