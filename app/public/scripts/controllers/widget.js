'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb, feedbacksApp) {

        $scope.widgetHeight = 200;

        $wix.getBoundingRectAndOffsets(function(data){
            $scope.widgetHeight = data.rect.height;
        });

        var widget_id = feedbacksApp.getWidgetId();
        // $scope.settings = feedbacksApp.getWidgetSetting(); //TODO: actually get the 
        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            comments_enabled: true,
            ratings_enabled: true,
            rating_max: 5
        };

        feedbacksDb.getFeedbacks(widget_id).then(function (d) {
            $scope.data = d.data;
        });
});
