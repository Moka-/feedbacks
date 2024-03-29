'use strict';

angular.module('data', ['application'])
    .service('data', ['$http', '$q', 'application', function ($http, $q, application) {
        this.getFeedbacks = function getFeedbacks(component_id) {
            if (!component_id)
                component_id = application.getComponentId();

            var promise = $http.get('/api/feedbacks/' + application.getAppInstance() + '/' + component_id);
            return promise;
        };
        this.getReplies = function getReplies(feedback_ids) {
            var promise = $http.get('/api/replies/' + feedback_ids);
            return promise;
        }
        this.editFeedback = function (user_id_token, feedback) {
            var promise = $http({
                method: "put",
                url: '/api/feedbacks/' + application.getAppInstance() + '/' + application.getComponentId() + '/' + feedback.id,
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
        this.getWidgets = function (){
            var promise = $http.get('/api/widgets/' + application.getAppInstance());
            return promise;
        };
    }]);