'use strict';

angular.module('dashboard', [
        'ngRoute',
        'wix',
        'feedbacksApp',
        'ngMaterial',
        'ngAnimate',
        'dndLists'
    ])
    .config(function ($routeProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/dashboard',
                controller: 'DashboardController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    });
;
