'use strict';

angular.module('feedbacks', [
    'ngRoute',
    'wix',
    'directive.g+signin',
    'angularMoment',
    'application',
    'data',
    'ngMaterial',
    'ngAnimate',
    'dndLists',
    'angular-input-stars',
    'angular-uuid'
])
    .config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/widget',
                controller: 'WidgetController'
            })
            .when('/widget', {
                templateUrl: '/partials/widget',
                controller: 'WidgetController'
            })
            .when('/settings', {
                templateUrl: '/partials/settings',
                controller: 'SettingsController'
            })
            .when('/dashboard', {
                templateUrl: '/partials/dashboard',
                controller: 'DashboardController'
            })
            .otherwise({
                redirectTo: '/'
            });

        //use the HTML5 History API
        $locationProvider.html5Mode(true);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    });
;
