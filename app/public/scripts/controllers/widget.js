'use strict';

angular.module('feedbacks')
    .controller('WidgetController', function ($scope, $wix, $http, data, application) {

        function User(id_token, full_name, email, image_url) {
            this.id_token = id_token;
            this.full_name = full_name ? full_name : "Not logged in";
            this.email = email;
            this.image_url = image_url ? image_url : "images/avatar.png";
        };

        function Feedback() {
            this.comment = "";
            this.rating = 0;

            this.reset = function () {
                this.comment = "";
                this.rating = 0;
            };
        };

        $scope.loading_feedbacks = true;
        $scope.loading_summary = true;
        $scope.settings = {};

        $scope.logged_in = false;
        $scope.logged_user = new User();

        $wix.getBoundingRectAndOffsets(function (data) {
            $scope.widgetHeight = data.rect.height;
        });

        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            enable_comments: true,
            enable_ratings: true,
            max_rating: 5
        };

        application.getWidgetSettings().then(
            function (response) { // Success loading settings
                $scope.settings = response.data[0];
                $scope.loading_summary = false;
            }, function (response) { // Shit's fucked yo

            });

        data.getFeedbacks().then(function (res) {
            $scope.data = res.data;
            var sum = 0;
            var actualRates = 0;

            for (var i = 0; i < res.data.length; i++) {
                sum += res.data[i].rating;
                if (res.data[i].rating != 0)
                    actualRates++;
            }

            $scope.average_rating = sum / actualRates;
            $scope.average_rating_rounded = Math.round($scope.average_rating);
            $scope.loading_feedbacks = false;
        });

        $scope.postComment = function () {
            var request = $http({
                method: "post",
                url: "/feedbacks",
                data: {
                    app_instance: application.getAppInstance(),
                    component_id: application.getComponentId(),
                    comment: $scope.new_feedback.comment,
                    rating: $scope.new_feedback.rating,
                    visitor_id: $scope.logged_user.id_token
                }
            });

            return request.then(
                function (res) { // success
                    $scope.data.push(res.data[0]);
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };

                    var sum = 0;
                    var actualRates = 0;

                    for (var i = 0; i < $scope.data.length; i++) {
                        sum += $scope.data[i].rating;
                        if ($scope.data[i].rating != 0)
                            actualRates++;
                    }

                    $scope.average_rating = sum / actualRates;
                    $scope.average_rating_rounded = Math.round($scope.average_rating);

                    // var newAverage = (($scope.average_rating * $scope.data.length - 1) + $scope.data[$scope.data.length - 1].rating) / ($scope.data.length);
                    // $scope.average_rating = newAverage;
                    // $scope.average_rating_rounded = Math.round(newAverage);
                },
                function (err) { // error
                    alert('oops');
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };
                });
        };

        $scope.new_feedback = {
            comment: '',
            rating: 0
        };

        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            $scope.logged_in = true;
            var authResponse = authResult.getAuthResponse();
            var profile = authResult.getBasicProfile();
            $scope.logged_user = new User(authResponse.id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
            $scope.$apply();
        });

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, function (settings) {
            $scope.settings = settings;
            $scope.$apply();
        });

        $scope.logOut = function () {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                $scope.logged_in = false;
                $scope.logged_user = new User();
                $scope.$apply();
            });
        };
    });
