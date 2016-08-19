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
            controller: ['$scope', '$wix', '$filter', 'data', 'analysis', function ($scope, $wix, $filter, data, analysis) {
                $scope.feedbacks = [];
                $scope.feedbackAwaitingReview = [];
                data.getFeedbacks($scope.widget.component_id).then(function (response) {
                    $scope.feedbacks = response.data;
                    $scope.feedbackAwaitingReview = $filter('awaitingReview')($scope.feedbacks);
                });

                $scope.feedbacksHighlights = [];
                analysis.feedbacksHighlights($scope.widget.component_id).then(function (response) {
                    $scope.feedbacksHighlights = response.data;
                });

            }],
            templateUrl: 'partials/templates/widgetOverview.html'
        }
    }).filter('awaitingReview', function() {
        return function( items ) {
            var filtered = [];
            items.forEach(function(item) {
                if( item.times_flagged > 0 &&
                    !item.marked_appropriate &&
                    !item.marked_inappropriate){
                    filtered.push(item);
                }
            });
            return filtered;
        };
    }).directive('ratingsSummary', function() {
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
                    hAxis: { textPosition: 'none',
                        gridlines: { color: 'transparent' },
                        baselineColor: 'transparent'
                    },
                    vAxis: { baselineColor: 'transparent',
                        textStyle : { fontSize: 12,
                                        color: '#676767' } },
                    bar: { groupWidth: '80%'},
                    width: 300,
                    height: 90,
                    chartArea:{
                        left:60,
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
    }).directive('applicationOverview', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: ['$scope', '$wix', 'analysis', function ($scope, $wix, analysis) {
            analysis.catalogsFeedbacks().then(function (response) {
                $scope.catalogFeedbacks = response.data;
                fillChart(response.data);
            });

            function fillChart(result) {
                var datesOnly = result.map(function(obj){ return new Date(obj.date); });
                var firstDate = new Date(Math.min.apply(null,datesOnly));

                var catalogsOnly = result.map(function(obj){ return obj.name; });
                var catalogsDistinct = Array.from(new Set(catalogsOnly));

                catalogsDistinct.forEach(function(element){
                    $scope.chartCols.push({label: element, type: "number"});
                });

                var now = new Date();
                for (var d = firstDate; d <= now; d.setDate(d.getDate() + 1)) {

                    var feedbacksToday = result.filter(function(value){
                        return new Date(value.date).setHours(0, 0, 0, 0) === new Date(d).setHours(0, 0, 0, 0);
                    });

                    var today = {c: [{v: d.getDate() + "/" + (d.getMonth()+1)}]};

                    catalogsDistinct.forEach(function(element){
                        var t = feedbacksToday.filter(function(value){ return value.name === element});

                        if (t.length == 0) {
                            today.c.push({v: 0 })
                        } else {
                            today.c.push({v: t[0].count })
                        }
                    });
                    $scope.chartData.push(today);
                }
            }

            $scope.catalogsHistory = {};
            $scope.catalogsHistory.type = "LineChart";

            $scope.chartData = [];
            $scope.chartCols = [
                {label: "Date", type: "string"}
            ];
            $scope.catalogsHistory.data = {
                "cols": $scope.chartCols,
                "rows": $scope.chartData,
                "p": null};
            $scope.catalogsHistory.options = {
                title: 'Feedbacks per catalog',
                hAxis: {
                    title: 'Time'
                },
                vAxis: {
                    title: 'Feedbacks'
                }
            };

        }],
        templateUrl: 'partials/templates/applicationOverview.html'
    }
});