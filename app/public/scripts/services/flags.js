'use strict';

angular.module('flags', ['application'])
    .service('flags', ['$http', '$q', 'application', function ($http, $q, application) {
        this.flag = function (feedback_id, user_id_token, reason) {
            return null;
        };
        this.unflag = function (feedback_id, user_id_token) {
            return null;
        }
        this.markAppropriate = function (feedback_id) {
            var promise = $http({
                method: 'POST',
                url: '/api/flags/appropriate',
                data: feedback_id
            });
            return promise;
        };
        this.markInappropriate = function (feedback_id) {
            var promise = $http({
                method: 'POST',
                url: '/api/flags/inappropriate',
                data: feedback_id
            });
            return promise;
        };
    }]);