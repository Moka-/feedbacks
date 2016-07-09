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

        var auth2; // The Sign-In object.
        $scope.logged_in = false;
        $scope.logged_user = new User();

        var initSigninV2 = function() {
            auth2 = gapi.auth2.getAuthInstance();

            if(!auth2){
                auth2 = gapi.auth2.init({
                    client_id: '4644920241-or3rocgiqb3156n1r5j7r40taetolkja.apps.googleusercontent.com',
                    scope: 'profile'
                });
            }

            // Listen for changes to current user.
            auth2.currentUser.listen(userChanged);

            // Sign in the user if they are currently signed in.
            if (auth2.isSignedIn.get() == true) {
                auth2.signIn();
            }
        };

        var userChanged = function (user) {
            if (user && user.isSignedIn()) {
                var authResponse = user.getAuthResponse();
                var profile = user.getBasicProfile();
                $scope.logged_in = true;
                $scope.logged_user = new User(authResponse.id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
            } else {
                $scope.logged_in = false;
                $scope.logged_user = new User();
            }

            $scope.$apply();
        };

        gapi.load('auth2', initSigninV2);

        $scope.loading_feedbacks = true;
        $scope.loading_summary = true;
        $scope.settings = {};

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
            $scope.loading_feedbacks = false;
            recalculateAverage();
        });

        $scope.postComment = function () {
            var request = $http({
                method: "post",
                url: "/api/feedbacks/" + application.getAppInstance() + "/" + application.getComponentId(),
                data: {
                    comment: $scope.new_feedback.comment,
                    rating: $scope.new_feedback.rating,
                    publisher_token: $scope.logged_user.id_token
                }
            });

            return request.then(
                function (res) { // success
                    var feedback = {
                        app_instance: application.getAppInstance(),
                        avatar_url: $scope.logged_user.image_url,
                        comment: $scope.new_feedback.comment,
                        component_id: application.getComponentId(),
                        created_on: new Date(),
                        display_name: $scope.logged_user.full_name,
                        rating: $scope.new_feedback.rating,
                        visitor_id: $scope.logged_user.email
                    }

                    $scope.data.push(feedback);

                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };

                    recalculateAverage();
                },
                function (err) { // error
                    alert('oops');
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };
                });
        };

        function recalculateAverage() {
            var sum = 0;
            var actualRates = 0;

            for (var i = 0; i < $scope.data.length; i++) {
                sum += $scope.data[i].rating;
                if ($scope.data[i].rating != 0)
                    actualRates++;
            }

            $scope.average_rating = sum / actualRates;
            $scope.average_rating_rounded = Math.round($scope.average_rating);
        };
        
        $scope.new_feedback = {
            comment: '',
            rating: 0
        };

        // $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        //     debugger;
        //     $scope.logged_in = true;
        //     var authResponse = authResult.getAuthResponse();
        //     var profile = authResult.getBasicProfile();
        //     $scope.logged_user = new User(authResponse.id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
        //     $scope.$apply();
        // });

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, function (settings) {
            $scope.settings = settings;
            $scope.$apply();
        });

        // function onSignIn(googleUser) {
        //     debugger;
        //     var profile = googleUser.getBasicProfile();
        //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //     console.log('Name: ' + profile.getName());
        //     console.log('Image URL: ' + profile.getImageUrl());
        //     console.log('Email: ' + profile.getEmail());
        // }

        $scope.signIn = function () {
            auth2.signIn();
        };

        $scope.signOut = function () {
            auth2.signOut();
        };
    });
