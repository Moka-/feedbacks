'use strict';

angular.module('analysis', ['application'])
    .service('analysis', ['$http', '$q', 'application', function ($http, $q, application) {
        this.feedbacksHighlights = function (component_id) {
            if (!component_id)
                component_id = application.getComponentId();

            var promise = $http.get('/api/analysis/highlights/' + application.getAppInstance() + '/' + component_id);
            return promise;
        };

        this.catalogsFeedbacks = function () {
            var app_instance = application.getAppInstance();
            var promise = $http.get('/api/analysis/catalogsFeedbacks/' + app_instance);
            return promise;
        };
    }]);