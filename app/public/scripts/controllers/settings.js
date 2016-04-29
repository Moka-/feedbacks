'use strict';

angular.module('settings')
  .controller('SettingsController', function ($scope, $wix, feedbacksApp) {

      $scope.widget_id = feedbacksApp.getWidgetId();
      $scope.widget_settings = feedbacksApp.getWidgetSettings();

    $wix.UI.initialize({
      numOfImages: 10,
      isIconShown: true,
      imageVisibility: 'show',
      imagesToSync: 0,
      imageMeta: true,
      imageAlt: false,
      imageLink: false
    });

    $wix.UI.onChange('*', function() {
      $wix.Settings.triggerSettingsUpdatedEvent('updated', $wix.Utils.getOrigCompId());
    });
      
      
      $scope.loadCatalogs = function () {
          debugger;
          $wix.Settings.triggerSettingsUpdatedEvent('updated', $wix.Utils.getOrigCompId());
      }

      $scope.catalogs = ['Cookies', 'Cakes', 'Cupcakes', 'Pizzas'];
  });