'use strict';

angular.module('settings', [
        'ngRoute',
        'wix', 'ngMaterial', 'feedbacksApp'
    ])
    .config(function ($routeProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/settings',
                controller: 'SettingsController'
            })
            .otherwise({
                redirectTo: '/'
            });
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    });