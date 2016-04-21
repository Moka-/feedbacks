'use strict';

angular.module('widget')
    .controller('WidgetController', function($scope, $wix, feedbacksDb) {

        $scope.newComment = {
            content: ''
        };

        $scope.actualInstance = $wix.Utils.getInstanceId();
        $scope.compId = $wix.Utils.getCompId();
        $scope.$watch(
            'widgetInstance',
            function change(newValue, oldValue) {
              if (Number.isInteger(newValue)) {
                feedbacksDb.getFeedbacks($scope.widgetInstance).then(function(d) {
                    $scope.data = d;
                });
              }
            }
        );

        $scope.submit = function() {
            if ($scope.newComment) {
                $scope.data.push({
                    "widget": 10,
                    "name": "Judith Wallace",
                    "content": "Morbi a ipsum. Integer a nibh. In quis justo.",
                    "publish_date": "19.10.2015",
                    "publish_time": "15:43",
                    "image": "http://dummyimage.com/231x134.gif/5fa2dd/ffffff"
                });
            }
        };
    })
    .service('feedbacksDb', ['$http', '$filter', function($http, $filter) {
        this.getFeedbacks = function getFeedbacks(widgetInstance) {
            var promise = $http.get('/dummy_data/feedbacks.json').then(function(response) {
                return $filter('filter')(response.data, {
                    widget: widgetInstance
                });
            });
            return promise;
        };
    }]);
