'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, $http, feedbacksDb, feedbacksApp) {
        $scope.app_instance = feedbacksApp.getAppInstance();
        $scope.comp_id = feedbacksApp.getComponentId();
        $scope.loading_feedbacks = true;
        $scope.loading_summary = true;
        $scope.settings = {};
        $scope.comment_focused = false;

        var no_user = {
            full_name: "Not logged in",
            image_url: "http://1.bp.blogspot.com/-XaPPe3eCMwE/VZSjxETf2OI/AAAAAAAANzE/3uOIgVpxds0/s1600/avatar.png"};
        $scope.logged_in = false;
        $scope.logged_user = no_user;
        
        $wix.getBoundingRectAndOffsets(function(data){
            $scope.widgetHeight = data.rect.height;
        });

        $scope.settings = {
            max_rating: 5,
        };

        feedbacksApp.getWidgetSettings().then(
            function (response){ // Success loading settings
                $scope.settings = response.data[0];
                $scope.loading_summary = false;
            }, function(response){ // Shit's fucked yo
        
            });

        feedbacksDb.getFeedbacks($scope.app_instance, $scope.comp_id).then(function (res) {
            $scope.data = res.data;
            var sum = 0;

            for (var i = 0; i < res.data.length; i++) {
                sum += res.data[i].rating;
            }

            $scope.average_rating = sum / res.data.length;
            $scope.loading_feedbacks = false;
        });

        $scope.postComment = function(){
            var request = $http({
                method: "post",
                url: "/feedbacks",
                data: {
                    app_instance: $scope.app_instance,
                    component_id: $scope.comp_id,
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

                    var newAve = (($scope.average_rating * obj.length - 1) + obj[obj.length - 1]) / (obj.length);
                    $scope.feedbacks_count = obj.length;
                    $scope.average_rating = newAve;
                    $scope.from_expanded = false;
                },
                function (err) { // error
                    alert('oops');
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };

                    $scope.from_expanded = false;
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

            $scope.logged_user = {
                id_token: authResponse.id_token,
                full_name: profile.getName(),
                given_name: profile.getGivenName(),
                family_name: profile.getFamilyName(),
                email: profile.getEmail(),
                image_url: profile.getImageUrl()
            };

            $scope.$apply();
        });

        $scope.handleSettingsApplied = function (a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
        }

        $scope.logOut = function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                $scope.logged_in = false;
                $scope.logged_user = no_user;
                $scope.$apply();
            });
        };

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, $scope.handleSettingsApplied);
});
