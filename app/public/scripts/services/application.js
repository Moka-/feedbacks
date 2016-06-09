angular.module('feedbacksApp', ['wix'])
    .factory('feedbacksApp', function ($wix, $http) {
        var app = {
            getWidgetData: function () {
                return request = $http.get('/widgets/' + this.getAppInstance() + '/' + this.getComponentId());
            },
            getWidgetSettings: function () {
                return request = $http.get('/widget-settings/' + this.getAppInstance() + '/' + this.getComponentId());
            },
            getApplicationId: function () {
                return this.getAppInstance();
            },
            getAppInstance: function () {
                return $wix.Utils.getInstanceId();
            },
            getComponentId: function () {
                var compId = $wix.Utils.getOrigCompId();

                if(!compId){
                    compId = $wix.Utils.getCompId();
                }

                return compId;
            }
        };

        return app;
    });