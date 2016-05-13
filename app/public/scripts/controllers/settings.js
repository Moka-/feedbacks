'use strict';

angular.module('settings')
  .controller('SettingsController', function ($scope, $wix, feedbacksApp) {

      var loadSettings = function(){
          feedbacksApp.getWidgetSettings().then(
              function (response){ // Success loading settings
                  debugger;
                  $scope.settings = response.data[0];
              }, function(response){ // Shit's fucked yo

              });
      }
      loadSettings();

      $scope.catalogs = []; // Init an empty array
      
      $scope.loadCatalogs = function () {
          $scope.catalogs = [{value: 1, text: 'Cookies'}, {value: 2, text: 'dsfdsf'}, {value: 3, text: 'hfghgfhhgfh'}, {value: 4, text: 'tretertre'}];
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