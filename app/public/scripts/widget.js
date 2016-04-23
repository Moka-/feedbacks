'use strict';

angular.module('widget', [
        'ngRoute',
        'wix',
        'directive.g+signin',
        'angularMoment'
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
    })
;
