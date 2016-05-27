'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, $http, feedbacksDb, feedbacksApp) {
        $scope.app_instance = feedbacksApp.getAppInstance();
        $scope.comp_id = feedbacksApp.getComponentId();
        $scope.loading_feedbacks = true;
        $scope.settings = {};
        
        $scope.comment_focused = false;
        
        $scope.logged_in = false;
        $scope.logged_user = null;
        
        $wix.getBoundingRectAndOffsets(function(data){
            $scope.widgetHeight = data.rect.height;
        });

        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            enable_comments: true,
            enable_ratings: true,
            max_rating: 5,
            avarage_rating: 4.3,
            feedbacks_count: 3000
        };

        $scope.$watch('data', function() {
            var sum = 0;
            for(var i = 0; i < $scope.data.length; i++) {
                sum += $scope.data[i].rating;
            }
            $scope.average_rating = sum / $scope.data.length;
        });
        
        feedbacksApp.getWidgetSettings().then(
            function (response){ // Success loading settings
                $scope.settings = response.data[0];
            }, function(response){ // Shit's fucked yo
        
            });

        feedbacksDb.getFeedbacks($scope.app_instance, $scope.comp_id).then(function (d) {
            $scope.data = d.data;
            $scope.loading_feedbacks = false;
        });

        $scope.postComment = function(){
            debugger;
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
                    debugger;
                    $scope.data.push(res.data[0]);
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };
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

        $scope.logOut = function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                $scope.logged_in = false;
                $scope.logged_user = null;
            });
        };

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, $scope.handleSettingsApplied);
});
