'use strict';

angular.module('widget')
    .directive('feedback', function () {
        return {
            restrict: 'E',
            scope: {
                feedback: '=info'
            },
            templateUrl: 'partials/templates/feedback.html'
        };
    })
    .directive('feedbacksInteraction', function () {
        return {
            restrict: 'EA',
            scope: {
                image: '=info'
            },
            templateUrl: 'partials/templates/widget-form.html',
        controller: function ($scope, $http, $timeout) {
            $scope.logOut = function() {
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    $scope.logged_in = false;
                    $scope.logged_user = null;
                    $scope.$apply();
                });
            }
 
            $scope.writeFeedbackButtonText = '';

            $scope.logged_in = false;
            $scope.logged_user = null;

            $scope.from_expanded = false;
            $scope.settings = $scope.$parent.settings;

            $scope.$watch('settings', function() {
                $timeout(function() {
                    $scope.settings.avarage_rating = $scope.$parent.settings.avarage_rating;
                    $scope.settings.feedbacks_count = $scope.$parent.settings.feedbacks_count;
                }, 1000);
            }, true);

            if($scope.settings.enable_comments){
                $scope.writeFeedbackButtonText += "comment"
            }
            if($scope.settings.enable_ratings){
                $scope.writeFeedbackButtonText += " & rate"
            }

            $scope.postComment = function(){
                var request = $http({
                    method: "post",
                    url: "/feedbacks",
                    data: {
                        app_instance: $scope.$parent.app_instance,
                        component_id: $scope.$parent.comp_id,
                        comment: $scope.new_feedback.comment,
                        rating: $scope.new_feedback.rating,
                        visitor_id: $scope.logged_user.id_token
                    }
                });

                return request.then(
                    function (res) { // success
                        $scope.$parent.data.push(res.data[0]);
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
                console.log(authResponse.id_token);
                
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

            $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
                // User has not authorized the G+ App!
                console.log('Not signed into Google Plus.');
            });
        }
    }})
    .directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template: "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                        <i class='fa fa-star{{((hoverValue + _rating) <= $index) && \"-o\" || \"\" }}' ng-Click='isolatedClick($index + 1)' \
                           ng-mouseenter='isolatedMouseHover($index + 1)' \
                           ng-mouseleave='isolatedMouseLeave($index + 1)' /> \
                    </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});;