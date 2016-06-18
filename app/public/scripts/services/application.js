angular.module('application', ['wix'])
    .factory('application', function ($wix, $http) {
        var app = {
            getWidgetSettings: function () {
                return $http.get('/api/widgets/' + this.getAppInstance() + '/' + this.getComponentId());
            },
            getApplicationId: function () { // obsolete
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