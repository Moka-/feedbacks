'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb) {

        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            $scope.visitorName = authResult.wc.Za;
            $scope.$apply();

            if (authResult.isSignedIn()) {
                var profile = authResult.getBasicProfile();
                console.log('ID: ' + profile.getId());
                console.log('Full Name: ' + profile.getName());
                console.log('Given Name: ' + profile.getGivenName());
                console.log('Family Name: ' + profile.getFamilyName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
            }

            console.log('Signed in!');
        });
        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            // User has not authorized the G+ App!
            console.log('Not signed into Google Plus.');
        });

        $scope.newComment = {
            content: ''
        };
        
        $scope.app_instance = $wix.Utils.getInstanceId();
        $scope.comp_instance = $wix.Utils.getCompId();

        $wix.getBoundingRectAndOffsets(function (data) {
            $scope.widgetDimensions = {height: data.rect.height};
        });

        feedbacksDb.getFeedbacks($scope.app_instance, $scope.comp_instance).then(function (d) {
            $scope.data = d;
        });

        $scope.submit = function () {
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
