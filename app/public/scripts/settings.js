'use strict';

angular.module('settings', [
    'ngRoute',
    'wix'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/settings', 
        controller: 'SettingsController'
      })
      .otherwise({
        redirectTo: '/'
      });

  });