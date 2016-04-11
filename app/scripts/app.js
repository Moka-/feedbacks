'use strict';

angular.module('wixApp', [
    'ngRoute',
    'wix'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/app.html',
        controller: 'MainCtrl'
      })
    .when('/Widget/', {
        templateUrl: 'views/widget.html',
        controller: 'WidgetController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
