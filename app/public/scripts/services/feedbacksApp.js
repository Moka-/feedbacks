angular.module('feedbacksApp', ['wix'])
    .factory('feedbacksApp', function ($wix, $http) {
        var app = {
            getWidgetSettings: function () {
                return request = $http.get('/widgets/' + this.getAppInstance() + '/' + this.getComponentId());
            },
            getApplicationId: function () {
                return $wix.Utils.getInstanceId();
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