'use strict';

angular.module('feedbacks')
    .controller('WidgetController', function ($scope, $wix, $http, $filter, $mdDialog, data, application) {

        function User(id_token, full_name, email, image_url) {
            this.id_token = id_token;
            this.full_name = full_name ? full_name : "Not logged in";
            this.email = email;
            this.image_url = image_url ? image_url : "images/avatar.png";
        };

        function Feedback() {
            this.comment = "";
            this.rating = 0;

            this.reset = function () {
                this.comment = "";
                this.rating = 0;
            };
        };

        var auth2; // The Sign-In object.
        $scope.logged_in = false;
        $scope.logged_user = new User();

        function signInInit() {
            var initSigninV2 = function () {
                auth2 = gapi.auth2.getAuthInstance();

                if (!auth2) {
                    auth2 = gapi.auth2.init({
                        client_id: '4644920241-or3rocgiqb3156n1r5j7r40taetolkja.apps.googleusercontent.com',
                        scope: 'profile'
                    });
                }

                // Listen for changes to current user.
                auth2.currentUser.listen(userChanged);

                // Sign in the user if they are currently signed in.
                if (auth2.isSignedIn.get() == true) {
                    auth2.signIn();
                }
            };
            var userChanged = function (user) {
                if (user && user.isSignedIn()) {
                    var authResponse = user.getAuthResponse();
                    var profile = user.getBasicProfile();
                    $scope.logged_in = true;
                    $scope.logged_user = new User(authResponse.id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
                } else {
                    $scope.logged_in = false;
                    $scope.logged_user = new User();
                }

                $scope.$apply();
            };

            gapi.load('auth2', initSigninV2);
        }

        signInInit(); // Magic. Do not touch

        $scope.loading_feedbacks = true;
        $scope.loading_summary = true;
        $scope.settings = {};
        $scope.data = {};
        $scope.my_feedback = {};
        $scope.edit_mode = false;

        function updateWidgetHeight() {
            $wix.getBoundingRectAndOffsets(function (data) {
                $scope.widgetHeight = data.rect.height;
            });
        }

        updateWidgetHeight();

        /*Wix.addEventListener(Wix.Events.SITE_SAVED,function (data) {
         console.log(data);

         });*/

        $scope.settings = {
            show_summary: true,
            show_feedbacks: true,
            enable_comments: true,
            enable_ratings: true,
            max_rating: 5
        };

        application.getWidgetSettings().then(
            function (response) { // Success loading settings
                $scope.settings = response.data[0];
                $scope.loading_summary = false;
            }, function (response) { // Shit's fucked yo

            });

        data.getFeedbacks().then(function (res) {
            $scope.data = res.data;
            $scope.loading_feedbacks = false;
            recalculateAverage();

            var ids = res.data.map(function (feedback) {
                return feedback.id;
            });

            data.getReplies(ids.join(',')).then(function (res) {
                for (var i in $scope.data) {
                    $scope.data[i].replies = res.data[$scope.data[i].id];
                }
            });
        });

        $scope.$watchGroup(['logged_user.email', 'data'], function (newValues, oldValues) {
            if (newValues[0] && newValues[1] && Array.isArray(newValues[1])) {
                var my_comments = $filter('filter')(newValues[1], {visitor_id: newValues[0]}, true);
                if (my_comments && my_comments.length > 0) {
                    $scope.my_feedback = my_comments[0];
                }
            }
            else {
                $scope.my_feedback = null;
            }
        });

        $scope.postComment = function () {
            var request = $http({
                method: "post",
                url: "/api/feedbacks/" + application.getAppInstance() + "/" + application.getComponentId(),
                data: {
                    comment: $scope.new_feedback.comment,
                    rating: $scope.new_feedback.rating,
                    publisher_token: $scope.logged_user.id_token
                }
            });

            return request.then(
                function (res) { // success
                    var feedback = {
                        id: res.data[2].insertId,
                        app_instance: application.getAppInstance(),
                        avatar_url: $scope.logged_user.image_url,
                        comment: $scope.new_feedback.comment,
                        component_id: application.getComponentId(),
                        created_on: new Date(),
                        display_name: $scope.logged_user.full_name,
                        rating: $scope.new_feedback.rating,
                        visitor_id: $scope.logged_user.email
                    };

                    $scope.data.unshift(feedback);
                    $scope.my_feedback = feedback;

                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };

                    recalculateAverage();
                },
                function (err) { // error
                    alert('oops');
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };
                });
        };

        $scope.postFeedbackEdit = function () {
            data.editFeedback($scope.logged_user.id_token, $scope.edited_feedback).then(function (res) {
                if (res.status == 200 && res.data.affectedRows == 1) {
                    $scope.edit_mode = false;
                    $scope.my_feedback.comment = $scope.edited_feedback.comment;
                    $scope.my_feedback.rating = $scope.edited_feedback.rating;

                    recalculateAverage();
                }
            });
        };

        $scope.deleteFeedback = function () {
            data.deleteFeedback($scope.logged_user.id_token, $scope.my_feedback.id).then(function (res) {
                if (res.status == 200 && res.data.affectedRows == 1) {
                    var index = $scope.data.indexOf($scope.my_feedback);
                    $scope.data.splice(index, 1);
                    $scope.my_feedback = null;

                    recalculateAverage();
                }
            });
        };

        $scope.editFeedback = function () {
            $scope.edit_mode = true;
            $scope.edited_feedback =
            {
                id: $scope.my_feedback.id,
                comment: $scope.my_feedback.comment,
                rating: $scope.my_feedback.rating
            };
        };

        $scope.cancelFeedbackEdit = function () {
            $scope.edit_mode = false;
        };

        function recalculateAverage() {
            var sum = 0;
            var actualRates = 0;

            for (var i = 0; i < $scope.data.length; i++) {
                sum += $scope.data[i].rating;
                if ($scope.data[i].rating != 0)
                    actualRates++;
            }

            $scope.average_rating = sum / actualRates;
            $scope.average_rating_rounded = Math.round($scope.average_rating);
        };

        $scope.new_feedback = {
            comment: '',
            rating: 0
        };

        $scope.replyText = '';

        $scope.toggleReply = function (obj) {
            obj.show_reply = true;
        };

        $scope.cancelReply = function (obj) {
            obj.show_reply = false;
        };

        $scope.toggleFlagged = function (feedback) {
            feedback.showFlagged = !feedback.showFlagged;
        };

        $scope.toggleVote = function (item, vote) {
            var request = $http({
                method: "post",
                url: "/api/vote",
                data: {
                    item_id: item.id,
                    visitor_id: $scope.logged_user.email,
                    vote: vote
                }
            });

            return request.then(
                function (res) { // success
                    alert('horaay');
                },
                function (err) { // error
                    alert('oops');
                });
        };

        $scope.postReply = function (item) {
            debugger;
            'SELECT r.*, v.display_name, v.avatar_url, (select count(*) from `flagged` f where r.id =  f.item_id) "times_flagged" ';
            var reply = {
                recipient_id: item.id,
                feedback_id: item.feedback_id,
                comment: $scope.replyText,
                visitor_id: $scope.logged_user.email,
            };

            var request = $http({
                method: "post",
                url: "/api/reply",
                data: reply
            });

            return request.then(
                function (res) { // success
                    reply.created_on = new Date();
                    reply.times_flagged = 0;
                    reply.avatar_url = $scope.logged_user.image_url;
                    reply.display_name = $scope.logged_user.full_name;
                    reply.id = res.data[2].insertId;

                    $scope.replyText = '';

                    item.replies.unshift(reply);
                },
                function (err) { // error
                    alert('oops');
                });
        };

        $scope.showFlagDialog = function (ev, id) {
            var confirm = $mdDialog.prompt()
                .title('Report Feedback')
                .textContent('Tell us why do you think this feedback is inappropriate.')
                .placeholder('Reason...')
                .targetEvent(ev)
                .ok('Report')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function (reason) {
                var request = $http({
                    method: "post",
                    url: "/api/flagged",
                    data: {
                        item_id: id,
                        visitor_id: $scope.logged_user.email,
                        reason: reason
                    }
                });

                return request.then(
                    function (res) { // success
                        alert('horaay');
                    },
                    function (err) { // error
                        alert('oops');
                    });
            });
        };

        $wix.addEventListener($wix.Events.SETTINGS_UPDATED, function (settings) {
            $scope.settings = settings;
            updateWidgetHeight();
            $scope.$apply();
        });

        $scope.signIn = function () {
            auth2.signIn();
        };

        $scope.signOut = function () {
            auth2.signOut();
        };
    });
