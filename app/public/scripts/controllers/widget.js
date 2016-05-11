'use strict';

angular.module('widget')
    .controller('WidgetController', function ($scope, $wix, feedbacksDb, feedbacksApp) {
        $scope.app_instance = feedbacksApp.getAppInstance();
        $scope.comp_id = feedbacksApp.getComponentId();
        $scope.loading_feedbacks = true;

        $wix.getBoundingRectAndOffsets(function(data){
            $scope.widgetHeight = data.rect.height;
        });

        // feedbacksApp.getWidgetSettings().then(
        //     function (response){ // Success loading settings
        //         $scope.settings = response.data[0];
        //     }, function(response){ // Shit's fucked yo
        //
        //     });

        // $scope.settings = feedbacksApp.getWidgetSetting(); //TODO: actually get the
        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            comments_enabled: true,
            ratings_enabled: true,
            max_rating: 5,
            average_rate: 4.3,
            feedbacks_count: 3000
        };

        feedbacksDb.getFeedbacks($scope.app_instance, $scope.comp_id).then(function (d) {
            $scope.data = d.data;
            $scope.loading_feedbacks = false;
        });

        $scope.inject = {average_rating: 0, rating_count: 0};

        $scope.$on('event:posted-feedback', function (event, newFeedback) {
            $scope.data.push(newFeedback);
            $scope.$apply();
        });

        $scope.handleSettingsApplied = function (newSettings) {
            $scope.settings = newSettings;
            $scope.$apply();
        }

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, $scope.handleSettingsApplied);

        $scope.average_rating;
        $scope.rating_count;

        $scope.$watch('data', function(newValue, oldValue){
            if (oldValue && newValue && (newValue.length != oldValue.length)){
                var sum = 0;
                for(var i = 0; i < newValue.length; i++) {
                    sum += newValue[i].rating;
                }

                $scope.inject.average_rating = sum / newValue.length;
                $scope.inject.rating_count = newValue.length;
                $scope.$apply();
            }
        });
});
