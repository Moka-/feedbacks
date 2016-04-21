'use strict';

angular.module('widget', [
    'ngRoute',
    'wix'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/widget',
        controller: 'WidgetController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
