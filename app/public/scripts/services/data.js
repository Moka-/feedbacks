'use strict';

angular.module('data', ['application'])
    .service('data', ['$http', 'application', function ($http, application) {
        this.getFeedbacks = function getFeedbacks() {
            var promise = $http.get('/api/feedbacks/' + application.getAppInstance() + '/' + application.getComponentId());
            return promise;
        };
    }]);