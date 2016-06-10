'use strict';

angular.module('widget', [
        'ngRoute',
        'wix',
        'directive.g+signin',
        'angularMoment',
        'feedbacksApp',
        'feedbacksData',
        'ngMaterial',
    'ngAnimate',
    'angular-input-stars'
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
        $mdThemingProvider.theme('altTheme')
            .primaryPalette('orange').dark();

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');

        //$mdThemingProvider.alwaysWatchTheme(true);
    });
;
