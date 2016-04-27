'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb, feedbacksApp) {

        var widget_id = feedbacksApp.getWidgetId();
        // $scope.settings = feedbacksApp.getWidgetSetting(); //TODO: actually get the 
        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            comments_enabled: true,
            ratings_enabled: true,
            rating_max: 5
        };
        
        feedbacksDb.getFeedbacks(widget_id).then(function (d) {
            $scope.data = d.data;
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
        this.getFeedbacks = function getFeedbacks(widgetid) {

            var promise = $http.get('/feedbacks/' + widgetid).then(function(response) {
                return response;
            });
            return promise;
        };
    }]);
