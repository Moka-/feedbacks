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
                var widgetId = this.getWidgetId();
                return request = $http.get('/widget/' + widgetId);
                
                //
                // return request.then(
                //     function (res) {
                //         debugger;
                //     }, function (err) {
                //         debugger;
                //     });
                //
                // return {
                //     // Widget settings, stored under widgets
                //     widget_id: "fdsfs",
                //     widget_name: "Poptarts",
                //     catalog: 2,
                //     show_summary: true,
                //     show_feedbacks: true,
                //     enable_comments: true,
                //     comment_required: false,
                //     comment_max_length: 150,
                //     enable_ratings: true,
                //     rating_required: false,
                //     max_rating: 5,
                //
                //     // Widget statistics, computed from feedbacks
                //     average_rate: 4.3,
                //     feedbacks_count: 3000
                // }
            }
        };

        return app;
    });