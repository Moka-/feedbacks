'use strict';

angular.module('feedbacks')
    .directive('widgetsOverview', function () {
        return {
            restrict: 'E',
            scope: true,
            controller: ['$scope', '$wix', 'data', function ($scope, $wix, data ) {
                $scope.widgets = [];
                data.getWidgets().then(function(response) {
                    $scope.widgets = response.data;
                });
            }],
            templateUrl: 'partials/templates/widgetsOverview.html'
        }
    }).directive('widgetOverview', function() {
        return {
            restrict: 'E',
            scope: {widget: '='},
            controller: ['$scope', '$wix', 'data', 'analysis', function ($scope, $wix, data, analysis) {
                $scope.feedbacks = [];
                data.getFeedbacks($scope.widget.component_id).then(function (response) {
                    $scope.feedbacks = response.data;
                });

                $scope.feedbacksHighlights = [];
                // analysis.feedbacksHighlights($scope.widget.component_id).then(function (response) {
                //     $scope.feedbacksHighlights = response.data;
                // });
                $scope.feedbacksHighlights = analysis.feedbacksHighlight($scope.widget.component_id).data;

            }],
            templateUrl: 'partials/templates/widgetOverview.html'
        }
    });