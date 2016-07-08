'use strict';

angular.module('feedbacks')
    .controller('DashboardController', function ($scope, $http, $wix, application, uuid) {
        $http.get('/api/catalogs/' + application.getApplicationId()).then(
            function (response) { // Success loading settings
                response.data.forEach(function (current) {
                    current.deleted = false;
                });

                $scope.models.catalogs = response.data;
                $scope.originalCatalogs = JSON.parse(JSON.stringify(response.data));
                $scope.loading_catalogs = false;
            }, function (response) { // Shit's fucked yo

            });

        $scope.loading_catalogs = true;
        $scope.models = {
            selected: null,
            catalogs: {}
        };

        $scope.saveCatalogs = function () {
            var request = $http({
                method: "post",
                url: "/api/catalogs",
                data: {
                    catalogs: $scope.models.catalogs,
                    app_instance: application.getApplicationId()
                }
            });

            return request.then(
                function (res) { // success
                    debugger;
                },
                function (err) {
                    debugger;
                });
        };

        $scope.removeCatalog = function (id, widgets) {
            $scope.models.catalogs = $scope.models.catalogs.filter(function (obj) {
                if (widgets.length > 0 && obj.id == 0) {
                    for (var i = 0; i < widgets.length; i++) {
                        obj.widgets.push(widgets[i]);
                    }
                }

                if (obj.id == id && !obj.new) {
                    obj.deleted = true;

                    return true;
                } else {
                    return id != obj.id;
                }
            });
        };

        $scope.undoChanges = function () {
            $scope.models.catalogs = JSON.parse(JSON.stringify($scope.originalCatalogs));
        };

        $scope.addCatalog = function () {
            $scope.models.catalogs.push({
                id: uuid.v4(),
                app_instance: application.getApplicationId(),
                name: "New Catalog",
                new: true,
                deleted: false,
                widgets: []
            });
        };

        // Model to JSON for demo purpose
        $scope.$watch('models', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


        var chart1 = {};
        chart1.type = "google.charts.Bar";
        chart1.displayed = false;
        chart1.data = {
            "cols": [{
                id: "catalog",
                label: "Cookies catalog",
                type: "string"
            }, {
                id: "laptop-id",
                label: "1-Star",
                type: "number"
            }, {
                id: "desktop-id",
                label: "2-Stars",
                type: "number"
            }, {
                id: "server-id",
                label: "3-Stars",
                type: "number"
            }, {
                id: "cost-id",
                label: "4-Stars",
                type: "number"
            }, {
                id: "cost-id",
                label: "5-Stars",
                type: "number"
            }],
            "rows": [{
                c: [{
                    v: "Chocolate"
                }, {
                    v: 20
                }, {
                    v: 10
                }, {
                    v: 7
                }, {
                    v: 30
                }, {
                    v: 100
                }]
            }, {
                c: [{
                    v: "Vanilla"
                }, {
                    v: 1
                }, {
                    v: 21
                }, {
                    v: 10
                }, {
                    v: 25
                }, {
                    v: 20
                }]
            }, {
                c: [{
                    v: "Peanut-Butter"
                }, {
                    v: 24
                }, {
                    v: 5
                }, {
                    v: 30
                }, {
                    v: 20
                }, {
                    v: 50
                }]
            }]
        };
        chart1.options = {
            "title": "Sales per month",
            "isStacked": "true",
            "fill": 40,
            "displayExactValues": true,
            "vAxis": {
                "title": "Sales unit",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Date"
            }
        };
        $scope.myChart = chart1;

        var chart2 = {};
        chart2.type = "google.charts.Line";
        chart2.displayed = false;
        chart2.data = {
            "cols": [{
                id: "month",
                label: "Popularity of Cookies",
                type: "string"
            }, {
                id: "laptop-id",
                label: "Chocolate",
                type: "number"
            }, {
                id: "desktop-id",
                label: "Vanilla",
                type: "number"
            }, {
                id: "server-id",
                label: "Peanut-Butter",
                type: "number"
            }],
            "rows": [{
                c: [{
                    v: "January"
                }, {
                    v: 19
                }, {
                    v: 12
                }, {
                    v: 7
                }]
            }, {
                c: [{
                    v: "February"
                }, {
                    v: 13
                }, {
                    v: 1
                }, {
                    v: 12
                }]
            }, {
                c: [{
                    v: "March"
                }, {
                    v: 24
                }, {
                    v: 5
                }, {
                    v: 11
                }]
            }, {
                c: [{
                    v: "April"
                }, {
                    v: 30
                }, {
                    v: 1
                }, {
                    v: 20
                }]
            }
            ]
        };

        chart2.options = {
            "title": "Sales per month",
            "isStacked": "true",
            "fill": 20,
            "displayExactValues": true,
            "vAxis": {
                "title": "Sales unit",
                "gridlines": {
                    "count": 10
                }
            },
            "hAxis": {
                "title": "Date"
            }
        };
        $scope.myChart2 = chart2;
    });
