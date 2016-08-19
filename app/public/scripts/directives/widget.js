'use strict';

angular.module('feedbacks')
    .directive('feedbacksSummary', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/feedbacksSummary.html'
        }
    })
    .directive('feedbackInput', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/feedbackInput.html'
        }
    })
    .directive('postReply', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/postReply.html'
        }
    })
    .directive('reply', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/reply.html'
        }
    })
    .directive('feedbackReplies', function () {
        return {
            restrict: 'EA',
            templateUrl: 'partials/templates/feedbackReplies.html'
        }
    });