'use strict';

angular.module('analysis', ['application'])
    .service('analysis', ['$http', '$q', 'application', function ($http, $q, application) {
        this.feedbacksHighlights = function feedbacksHighlight(component_id) {
            if (!component_id)
                component_id = application.getComponentId();

            var promise = $http.get('/api/analysis/highlights/' + application.getAppInstance() + '/' + component_id);
            return promise;
        };
    }]);