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
                feedbacks: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.averageRating = 0;
                $scope.$watchCollection('feedbacks', function (newVal, oldVal) {
                    if(newVal && newVal.length != oldVal.length){
                        var sum = 0;
                        var actualRates = 0;

                        for (var i = 0; i < newVal.length; i++) {
                            sum += newVal[i].rating;
                            if (newVal[i].rating != 0)
                                actualRates++;
                        }

                        $scope.averageRating = sum / actualRates;

                        fillChart(newVal);
                    }
                });

                function fillChart(feedbacks) {
                    feedbacks.forEach(function (element) {
                        $scope.chartData[element.rating - 1][1]['v']++;
                    })
                }

                $scope.ratingsChart = {};
                $scope.ratingsChart.type = "BarChart";

                $scope.chartData = [
                    [
                        {v: "★"},
                        {v: 0},
                        {v: 'color: #ff8b5a'}
                    ],
                    [
                        {v: "★★"},
                        {v: 0},
                        {v: 'color: #ffb234'}
                    ],
                    [
                        {v: "★★★"},
                        {v: 0},
                        {v: 'color: #ffe93b'}
                    ],
                    [
                        {v: "★★★★"},
                        {v: 0},
                        {v: 'color: #ccdb38'}
                    ],
                    [
                        {v: "★★★★★"},
                        {v: 0},
                        {v: 'color: #8bc24a'}
                    ]
                ];
                $scope.ratingsChart.data = {
                    "cols": [
                        {label: "Stars", type: "string"},
                        {label: "Users", type: "number"},
                        {label:"",pattern:"", type:"string", p: { role:"style" }}
                ], "rows": [
                    {c: $scope.chartData[4]},
                    {c: $scope.chartData[3]},
                    {c: $scope.chartData[2]},
                    {c: $scope.chartData[1]},
                    {c: $scope.chartData[0]}
                ],
                    "p": null};
                $scope.ratingsChart.options = {
                    legend: { position: "none" },
                    hAxis: { textPosition: 'none', gridlines: { color: 'transparent' }, baselineColor: 'transparent'},
                    vAxis: { baselineColor: 'transparent' },
                    bar: { groupWidth: '80%'},
                    width: 300,
                    height: 90,
                    chartArea:{
                        left:50,
                        right:0,
                        bottom:0,
                        top:0,
                        height:"100%"
                    }
                };

            }],
            templateUrl: 'partials/templates/ratingsSummary.html'
        }
    }).directive('feedbacksPerDay', function() {
    return {
        restrict: 'E',
        scope: {
            feedbacks: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.$watchCollection('feedbacks', function (newVal, oldVal) {
                if(newVal && newVal.length != oldVal.length){
                    var sorted = newVal.sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(a.created_on) - new Date(b.created_on);
                    });
                    fillChart(sorted);
                }
            });

            function fillChart(feedbacks) {

                var now = new Date();
                for (var d = new Date(feedbacks[0].created_on); d <= now; d.setDate(d.getDate() + 1)) {

                    var count = feedbacks.filter(function(value){
                        return new Date(value.created_on).setHours(0, 0, 0, 0) === new Date(d).setHours(0, 0, 0, 0);
                    }).length;
                    var row = {c: [{v: d.getDate() + "/" + (d.getMonth()+1) }, {v: count}]};

                    $scope.chartData.push(row);
                }
            }

            $scope.feedbacksHistory = {};
            $scope.feedbacksHistory.type = "LineChart";

            $scope.chartData = [];
            $scope.feedbacksHistory.data = {
                "cols": [
                    {label: "Day", type: "string"},
                    {label: "Feedbacks", type: "number"}
                ], "rows": $scope.chartData,
                "p": null};
            $scope.feedbacksHistory.options = {
                title: 'Feedbacks over time',
                legend: { position: "none" },
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'Feedbacks'
                }
            };

        }],
        templateUrl: 'partials/templates/feedbacksPerDay.html'
    }
    });