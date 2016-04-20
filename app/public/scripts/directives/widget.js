'use strict';

angular.module('widget').directive('feedback', function() {
    return {
        restrict: 'E',
        scope: {
            feedback: '=info'
        },
        templateUrl: 'views/templates/feedback.html '
    };
});