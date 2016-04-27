'use strict';

angular.module('feedbacksData', [])
    .service('feedbacksDb', ['$http', '$filter', function($http, $filter) {
    this.getFeedbacks = function getFeedbacks(widgetid) {
        var promise = $http.get('/feedbacks/' + widgetid).then(function(response) {
            return response; 
        });
        return promise;
    };
}]);