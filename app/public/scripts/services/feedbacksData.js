'use strict';

angular.module('feedbacksData', [])
    .service('feedbacksDb', ['$http', '$filter', function($http, $filter) {
    this.getFeedbacks = function getFeedbacks(app_instance, comp_id) {
        var promise = $http.get('/feedbacks/' + app_instance + '/' + comp_id).then(function(response) {
            return response; 
        });
        return promise;
    };
}]);