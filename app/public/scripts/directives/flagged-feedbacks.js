'use strict';

angular.module('feedbacks')
    .directive('flaggedFeedbacks', function() {
        return {
            restrict: 'E',
            scope: { feedbacks: '=' },
            controller: ['$scope', 'flags', 'data', function ($scope, flags, data ) {

                $scope.appropriate = function (feedback) {
                    flags.markAppropriate(feedback.id);
                };

                $scope.inappropriate = function (feedback) {
                    flags.markInappropriate(feedback.id);
                };

            }],
            templateUrl: 'partials/templates/flaggedFeedbacks.html'
        }
    }
)