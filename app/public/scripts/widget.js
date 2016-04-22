'use strict';

angular.module('widget', [
        'ngRoute',
        'wix',
        'directive.g+signin'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/widget',
                controller: 'WidgetController'
            })
            .when('/access_token=:accessToken', {
                template: '',
                controller: function ($location, $rootScope) {
                    debugger;
                    var hash = $location.path().substr(1);
                    var splitted = hash.split('&');
                    var params = {};

                    for (var i = 0; i < splitted.length; i++) {
                        var param = splitted[i].split('=');
                        var key = param[0];
                        var value = param[1];
                        params[key] = value;
                        $rootScope.accesstoken = params;
                    }
                    $location.path("/widget");
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    })
;
