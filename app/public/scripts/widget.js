'use strict';

angular.module('widget', [
        'ngRoute',
        'wix',
        'directive.g+signin',
        'angularMoment',
        'application',
        'data',
        'ngMaterial',
        'ngAnimate'
    ])
    .config(function ($routeProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/widget',
                controller: 'WidgetController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    });
;
