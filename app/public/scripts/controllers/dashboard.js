'use strict';

angular.module('feedbacks')
    .controller('DashboardController', function ($scope, $http, $wix, application) {
        $http.get('/catalogs/' + application.getApplicationId()).then(
            function (response){ // Success loading settings
                console.log(response);
                $scope.models.catalogs = response.data;
            }, function(response){ // Shit's fucked yo

            });

        $scope.models = {
            selected: null,
            catalogs: {}
        };

        $scope.saveCatalogs = function () {
            var request = $http({
                method: "post",
                url: "/catalogs",
                data: $scope.models.catalogs
            });
        };

        $scope.addCatalog = function () {
            $scope.models.catalogs.push({
                app_instance: application.getApplicationId(),
                name: "New Catalog",
                widgets: []
            });
        };

        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

    });
