'use strict';

angular.module('widget')
    .directive('writeFeedback', function () {
        return {
            restrict: 'E',
            scope: {
                feedback: '=info'
            },
            templateUrl: 'partials/templates/writeFeedback.html',
            controller: function ($scope) {

                $scope.expanded = false;
                $scope.social_connected=false;
                $scope.settings;

                $scope.$on('event:google-plus-signin-success', function (event, authResult) {
                    $scope.social_connected = true;
                    var authResponse = authResult.getAuthResponse();
                    var profile = authResult.getBasicProfile();

                    $scope.google_plus_user = {
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

                $scope.writeBoxFocus = function(){
                    $scope.expanded = true;
                };
                $scope.writeBoxBlur = function(){
                    if(!$scope.content){
                        $scope.expanded = false;
                    }
                };

            },
        };
    })


    .directive('feedback', function () {
        return {
            restrict: 'E',
            scope: {
                feedback: '=info'
            },
            templateUrl: 'partials/templates/feedback.html'
        };
    })
    .directive('userImage', function () {
        return {
            restrict: 'E',
            scope: {
                image: '=info'
            },
            template: '<img class="avatar" ng-src="{{image}}"/>'
        };
    })
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
});