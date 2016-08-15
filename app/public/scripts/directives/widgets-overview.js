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
                analysis.feedbacksHighlights($scope.widget.component_id).then(function (response) {
                    $scope.feedbacksHighlights = response.data;
                });

            }],
            templateUrl: 'partials/templates/widgetOverview.html'
        }
    })
    .directive('ratingsSummary', function() {
        return {
            restrict: 'E',
            scope: {
                feedbacks: '=',
                maxRating: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.averageRating = 0;
                $scope.$watchCollection('feedbacks', function (newVal, oldVal) {
                    if(newVal && newVal.length != oldVal.length){
                        debugger;
                        var sum = 0;
                        var actualRates = 0;

                        for (var i = 0; i < newVal.length; i++) {
                            sum += newVal[i].rating;
                            if (newVal[i].rating != 0)
                                actualRates++;
                        }

                        $scope.averageRating = sum / actualRates;
                    }
                });

                // var feedbacksChart = {};
                // feedbacksChart.type = "google.charts.Bar";
                // feedbacksChart.displayed = false;
                // feedbacksChart.data = {
                //     "cols": [{
                //         id: "catalog",
                //         label: "Cookies catalog",
                //         type: "string"
                //     }, {
                //         id: "1",
                //         label: "1-Star",
                //         type: "number"
                //     }, {
                //         id: "2",
                //         label: "2-Stars",
                //         type: "number"
                //     }, {
                //         id: "3",
                //         label: "3-Stars",
                //         type: "number"
                //     }, {
                //         id: "4",
                //         label: "4-Stars",
                //         type: "number"
                //     }, {
                //         id: "5",
                //         label: "5-Stars",
                //         type: "number"
                //     }],
                //     "rows": [{
                //         c: [{
                //             v: "Chocolate"
                //         }, {
                //             v: 20
                //         }, {
                //             v: 10
                //         }, {
                //             v: 7
                //         }, {
                //             v: 30
                //         }, {
                //             v: 100
                //         }]
                //     }]
                //
                // };
                // feedbacksChart.options = {
                //     "isStacked": "true",
                //     "fill": 40,
                //     "displayExactValues": true,
                //     // "vAxis": {
                //     //     "title": "Sales unit",
                //     //     "gridlines": {
                //     //         "count": 10
                //     //     }
                //     // },
                //     // "hAxis": {
                //     //     "title": "Date"
                //     // }
                // };
                // $scope.feedbacksChart = feedbacksChart;

            }],
            templateUrl: 'partials/templates/ratingsSummary.html'
        }
    });