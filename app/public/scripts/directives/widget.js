'use strict';

angular.module('feedbacks')
    .directive('feedbacksSummary', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/feedbacksSummary.html'
        }
    });