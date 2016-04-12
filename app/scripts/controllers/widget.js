'use strict';

angular.module('widget')
    .controller('WidgetController', function($scope, $wix, feedbacksDb) {

        $scope.newComment = {};
        $scope.feedbacks = feedbacksDb.getFeedbacks();

        if ($wix.Utils.getViewMode() !== 'standalone') {
            $scope.instanceId = $wix.Utils.getInstanceId();
            $scope.instance = $wix.Utils.getInstance();
        }
    })
    .directive('feedback', function($interpolate) {
        return {
            restrict: 'E',
            scope: {
                feedback: '=info'
            },
            templateUrl: 'views/templates/feedback.html'
                //template: 'img: {{feedback.img}}<br/>author: {{feedback.author}}<br/>content: {{feedback.content}}'
        };
    })
    .factory('feedbacksDb', ['$http', function($http) {

        var FeedbacksDataOp = {};
        FeedbacksDataOp.getStudents = function() {
            return $http.get(urlBase + '/GetStudents');
        };

        FeedbacksDataOp.getFeedbacks = function() {
            return [{
                img: 1,
                author: "me",
                content: "lol"
            }, {
                img: 3,
                author: "me",
                content: "lol"
            }, {
                img: 3,
                author: "me",
                content: "lol"
            }, {
                img: 3,
                author: "me",
                content: "lol"
            }];
        };

        return FeedbacksDataOp;
    }]);
