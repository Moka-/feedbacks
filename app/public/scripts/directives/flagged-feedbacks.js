'use strict';

angular.module('feedbacks')
    .directive('flaggedFeedbacks', function() {
        return {
            restrict: 'E',
            scope: { feedbacks: '=' },
            controller: ['$scope', '$wix', 'data', function ($scope, $wix, data ) {

                // do work

            }],
            templateUrl: 'partials/templates/flaggedFeedbacks.html'
        }
    }
)