'use strict';

angular.module('widget', [
    'ngRoute',
    'wix'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/widget.html',
        controller: 'WidgetController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
