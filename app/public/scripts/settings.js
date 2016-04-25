'use strict';

angular.module('settings', [
    'ngRoute',
    'wix','ngMaterial'
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