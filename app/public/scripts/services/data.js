'use strict';

angular.module('data', ['application'])
    .service('data', ['$http', 'application', function ($http, application) {
        this.getFeedbacks = function getFeedbacks() {
            var promise = $http.get('/api/feedbacks/' + application.getAppInstance() + '/' + application.getComponentId());
            return promise;
        };
        this.getReplies = function getReplies(feedback_ids) {
            var promise = $http.get('/api/replies/' + feedback_ids);
            return promise;
        }
        this.editFeedback = function (user_id_token, feedback) {
            var promise = $http({
                method: "put",
                url: '/api/feedbacks/' + application.getAppInstance() + '/' + application.getComponentId() + '/' + feedback.feedback_id,
                data: {user_id_token, feedback}
            });
            return promise;
        };
        this.deleteFeedback = function (user_id_token, feedback_id) {
            var promise = $http({
                method: "delete",
                url: '/api/feedbacks/' + application.getAppInstance() + '/' + application.getComponentId() + '/' + feedback_id + '/' + user_id_token
            });
            return promise;
        };
    }]);