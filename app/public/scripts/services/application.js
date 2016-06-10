angular.module('application', ['wix'])
    .factory('application', function ($wix, $http) {
        var app = {
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

                if(!compId)
                    compId = $wix.Utils.getCompId();
                
                return compId;
            }
        };

        return app;
    });