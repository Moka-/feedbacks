'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb) {

        $scope.widget_id = {
            app_instance: $wix.Utils.getInstanceId(),
            comp_instance: $wix.Utils.getCompId()
        }

        $scope.newComment = {
            content: ''
        };

        feedbacksDb.getFeedbacks($scope.widget_id.app_instance, $scope.widget_id.comp_instance).then(function (d) {
            $scope.data = d;
        });

        $scope.submit = function () {
            if ($scope.newComment) {
                $scope.data.push(
                {"app_instance":"bcac1c8a-3b11-4374-aff7-e865a14c2681",
                    "comp_instance":"comp-imz3qe6k",
                    "date":"2015-11-27T04:54:53Z",
                    "google_id_token":"016a8be5-a79c-4972-b81d-6e4bae4b1a92",
                    "content":"Vesa Curae; Duis faucibus accumsan odio. Curabitur convallis.",
                    "name":"Virginia Wallace",
                    "image":"http://dummyimage.com/52x95.png/dddddd/000000"}
                );
            }
        };
    })
    .service('feedbacksDb', ['$http', '$filter', function ($http, $filter) {
        this.getFeedbacks = function getFeedbacks(app_instance, comp_instance) {
            var promise = $http.get('/dummy_data/feedbacks.json').then(function (response) {
                return $filter('filter')(response.data, {
                    app_instance: app_instance, comp_instance: comp_instance
                });
            });
            return promise;
        };
    }]);
