'use strict';

angular.module('feedbacks')
    .controller('DashboardController', function ($scope, $http, $wix, application, uuid) {
        $http.get('/catalogs/' + application.getApplicationId()).then(
            function (response) { // Success loading settings
                respone.data.forEach(function (current) {
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
                url: "/catalogs",
                data: $scope.models.catalogs
            });
        };

        $scope.removeCatalog = function (id, widgets) {

            $scope.models.catalogs = $scope.models.catalogs.filter(function (obj) {
                if (widgets.length > 0 && obj.id == 0) {
                    for (var i = 0; i < widgets.length; i++) {
                        obj.widgets.push(widgets[i]);
                    }
                }

                return id != obj.id;
            });
        };

        $scope.undo = function () {
            console.log('click');
            $scope.models.catalogs = JSON.parse(JSON.stringify($scope.originalCatalogs));
        };

        $scope.addCatalog = function () {
            $scope.models.catalogs.push({
                id: uuid.v4(),
                app_instance: application.getApplicationId(),
                name: "New Catalog",
                new: true,
                widgets: []
            });
        };

        // Model to JSON for demo purpose
        $scope.$watch('models', function (model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

    });
