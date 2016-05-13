'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb, feedbacksApp) {
        $scope.app_instance = feedbacksApp.getAppInstance();
        $scope.comp_id = feedbacksApp.getComponentId();
        $scope.loading_feedbacks = true;
        $scope.settings = {};

        $wix.getBoundingRectAndOffsets(function(data){
            $scope.widgetHeight = data.rect.height;
        });

        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            enable_comments: true,
            enable_ratings: true,
            max_rating: 5,
            average_rate: 4.3,
            feedbacks_count: 3000
        };

        feedbacksApp.getWidgetSettings().then(
            function (response){ // Success loading settings
                $scope.settings = response.data[0];
            }, function(response){ // Shit's fucked yo
        
            });

        feedbacksDb.getFeedbacks($scope.app_instance, $scope.comp_id).then(function (d) {
            $scope.data = d.data;
            $scope.loading_feedbacks = false;
        });

        $scope.$on('event:posted-feedback', function (event, newFeedback) {
            $scope.data.push(newFeedback);
            $scope.$apply();
        });

        $scope.handleSettingsApplied = function (newSettings) {
            $scope.settings = newSettings;
            $scope.$apply();
        }

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, $scope.handleSettingsApplied);
});
