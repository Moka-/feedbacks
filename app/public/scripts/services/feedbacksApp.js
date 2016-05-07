angular.module('feedbacksApp', ['wix'])
    .factory('feedbacksApp', function ($wix, $http) {
        var app = {
            getWidgetId: function () {
                var compId = $wix.Utils.getOrigCompId();
                if(!compId){
                    compId = $wix.Utils.getCompId();
                }

                return $wix.Utils.getInstanceId() + compId;
            },
            getWidgetSettings: function () {
                var widgetId = this.getWidgetId();
                return request = $http.get('/widget/' + widgetId);
            },
            getApplicationId: function () {
                return $wix.Utils.getInstanceId();
            }
        };

        return app;
    });