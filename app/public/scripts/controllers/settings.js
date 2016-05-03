'use strict';

angular.module('settings')
  .controller('SettingsController', function ($scope, $wix, feedbacksApp) {

      $scope.widget_id = feedbacksApp.getWidgetId();
      feedbacksApp.getWidgetSettings().then(
          function (response){ // Success loading settings
              $scope.settings = response.data[0];
      }, function(response){ // Shit's fucked yo

      });

      $scope.catalogs = []; // Init an empty array
      
      $scope.loadCatalogs = function () {
          $scope.catalogs = [{value: 1, text: 'Cookies'}, {value: 2, text: 'dsfdsf'}, {value: 3, text: 'hfghgfhhgfh'}, {value: 4, text: 'tretertre'}];
      }

      $scope.gotodash = function(){
            alert('dash');
      }
      $scope.revert = function(){
          alert('revert');
      }
      $scope.apply = function(){
          alert('apply');
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
                  $rootScope.$broadcast('event:posted-feedback', res);

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