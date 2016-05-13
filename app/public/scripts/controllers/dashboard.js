'use strict';

angular.module('dashboard')
    .controller('DashboardController', function ($scope, $http, $wix, feedbacksApp) {
        $http.get('/catalogs/' + feedbacksApp.getApplicationId()).then(
            function (response){ // Success loading settings
                $scope.models.catalogs = response.data;
            }, function(response){ // Shit's fucked yo
                debugger;
            });

        $scope.models = {
            selected: null,
            catalogs: {}
        };

        $scope.saveCatalogs = function () {
            alert('sss');
        };

        $scope.addCatalog = function () {
            $scope.models.catalogs.push({
                app_instance: feedbacksApp.getApplicationId(),
                name: "New Catalog",
                widgets: []
            })
        };

        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

    });