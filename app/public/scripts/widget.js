'use strict';

angular.module('widget', [
        'ngRoute',
        'wix',
        'directive.g+signin',
        'angularMoment',
        'feedbacksApp',
        'feedbacksData',
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
            .primaryPalette('amber')
            .accentPalette('amber');
    });
;
