'use strict';

angular.module('analysis', ['application'])
    .service('analysis', ['$http', '$q', 'application', function ($http, $q, application) {
        this.feedbacksHighlight = function (component_id) {
            // if (!component_id)
            //     component_id = application.getComponentId();
            //
            // var promise = $http.get('/api/analysis/' + application.getAppInstance() + '/' + component_id);
            // return promise;

            return {data: [{keyword: "fun", ig:100}, {keyword: "bad", ig:200}, {keyword: "cool", ig:500}, {keyword: "great", ig:7}]}
        };
    }]);