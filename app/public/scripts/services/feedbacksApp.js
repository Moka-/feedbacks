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
                debugger;
                var widgetId = this.getWidgetId();
                //$http something TODO: add call to db once kostya is done
            }
        };

        return app;
    });