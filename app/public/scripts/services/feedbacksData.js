'use strict';

angular.module('feedbacksData', []).service('feedbacksData', ['$http', '$filter', function($http, $filter) {
    this.getFeedbacks = function getFeedbacks(widgetInstance) {
        var promise = $http.get('/dummy_data/feedbacks.json').then(function(response) {
            return $filter('filter')(response.data, {
                widget: widgetInstance
            });
        });
        return promise;
    };
}]);