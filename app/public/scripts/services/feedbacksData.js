'use strict';

angular.module('feedbacksData', [])
    .service('feedbacksData', ['$http', '$filter', function($http, $filter) {
    this.getFeedbacks = function getFeedbacks(widgetid) {
        debugger;
        var promise = $http.get('/feedbacks/' + widgetid).then(function(response) {
            debugger;
            return response;
        });
        return promise;
    };
}]);