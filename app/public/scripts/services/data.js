'use strict';

angular.module('data', ['application'])
    .service('data', ['$http', '$q', 'application', function ($http, $q, application) {
        this.getFeedbacks = function getFeedbacks(widget_id) {
            if (!widget_id)
                return [];

            var promise = $http.get('/api/feedbacks/' + widget_id);
            return promise;
        };
        this.getReplies = function getReplies(feedback_ids) {
            var promise = $http.get('/api/replies/' + feedback_ids);
            return promise;
        }
        this.editFeedback = function (user_id_token, feedback) {
            var promise = $http({
                method: "put",
                url: '/api/feedbacks/' + feedback._id,
                data: {user_id_token, feedback}
            });
            return promise;
        };
        this.deleteFeedback = function (user_id_token, feedback) {
            var promise = $http({
                method: "post",
                url: '/api/feedbacks/delete/' + feedback._id,
                data: {user_id_token}
            });
            return promise;
        };
        this.getWidgets = function (){
            var promise = $http.get('/api/widgets/' + application.getAppInstance());
            return promise;
        };
    }]);