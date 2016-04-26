angular.module('feedbacksApp', ['wix'])
    .factory('feedbacksApp', function ($wix) {
        var app = {
            getWidgetId: function () {
                var compId = $wix.Utils.getOrigCompId();
                if(!compId){
                    compId = $wix.Utils.getCompId();
                }

                return {
                    app_instance: $wix.Utils.getInstanceId(),
                    comp_instance: compId
                }
            },
            getWidgetSettings: function () {
                var compId = $wix.Utils.getOrigCompId();
                if(!compId){
                    compId = $wix.Utils.getCompId();
                }

                return {
                    app_instance: $wix.Utils.getInstanceId(),
                    comp_instance: compId
                }
            }
        };

        return app;
    });