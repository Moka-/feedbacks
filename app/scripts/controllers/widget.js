'use strict';

angular.module('widget')
    .controller('WidgetController', function($scope, $wix, feedbacksDb) {

        $scope.newComment = {};
        $scope.feedbacks = feedbacksDb.feedbackss;

        /*if ($wix.Utils.getViewMode() !== 'standalone') {
            $scope.instanceId = $wix.Utils.getInstanceId();
            $scope.instance = $wix.Utils.getInstance();
        }*/
    })
    .directive('feedback', function($interpolate) {
        return {
            restrict: 'E',
            scope: {
                feedback: '=info'
            },
            templateUrl: 'views/templates/feedback.html '
        };
    })
    .factory('feedbacksDb', ['$http', function($http) {

        var obj = {
            feedbackss: null
        };

        $http.get('/dummy_data/feedbacks.json').success(function(response) {
            obj.feedbackss = response;
        });
        return obj;
    }]);
