'use strict';

angular.module('feedbacks')
    .controller('WidgetController', function ($scope, $rootScope, $wix, $http, $filter, $mdDialog, data, application) {

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
        $scope.logged_user = null;

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
                    $scope.logged_user = new User(authResponse.id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
                    setMyFeedback();
                } else
                    $scope.logged_user = null;
            };

            gapi.load('auth2', initSigninV2);
        }
        signInInit(); // Magic. Do not touch
        function updateWidgetHeight() {
            $wix.getBoundingRectAndOffsets(function (data) {
                $scope.widgetHeight = data.rect.height;
            });
        }
        updateWidgetHeight();

        $scope.loading_feedbacks = true;
        $scope.loading_summary = true;
        $scope.feedbacks = [];

        function setMyFeedback(){
            if ($scope.logged_user && $scope.feedbacks && $scope.feedbacks.length){
                var my_comments = $filter('filter')($scope.feedbacks, {visitor_email: $scope.logged_user.email}, true);
                if (my_comments && my_comments.length) {
                    $scope.my_feedback = my_comments[0];
                }
            }
        }

        application.getWidgetSettings().then(
            function (response) { // Success loading settings
                $scope.settings = response.data;
                $scope.loading_summary = false;

                data.getFeedbacks($scope.settings._id).then(function (res) {
                    $scope.feedbacks = res.data;
                    $scope.loading_feedbacks = false;

                    $rootScope.$broadcast('feedbacksChanged',{feedbacks: $scope.feedbacks});
                    setMyFeedback();

                    //TODO: fix replies after the project gets stable
                    // var ids = res.data.map(function (feedback) {
                    //     return feedback.id;
                    // });

                    // data.getReplies(ids.join(',')).then(function (res) {
                    //     for (var i in $scope.data) {
                    //         $scope.data[i].replies = res.data[$scope.data[i].id];
                    //     }
                    // });
                });
            }, function (response) {
                console.log("Error loading widget settings");
            });

        $scope.postFeedback = function () {
            // TODO: export this method to data
            var request = $http({
                method: "post",
                url: "/api/feedbacks/" + $scope.settings._id,
                data: {
                    comment: $scope.new_feedback.comment,
                    rating: $scope.new_feedback.rating,
                    publisher_token: $scope.logged_user.id_token
                }
            });

            return request.then(
                function (response) { // success

                    var feedback = response.data;

                    $scope.feedbacks.unshift(feedback);
                    $scope.my_feedback = feedback;

                    $rootScope.$broadcast('feedbacksChanged',{feedbacks: $scope.feedbacks});
                },
                function (err) { // error
                    alert('Error posting feedback');
                    $scope.new_feedback = {
                        comment: '',
                        rating: 0
                    };
                });
        };

        $scope.deleteFeedback = function () {
            data.deleteFeedback($scope.logged_user.id_token, $scope.my_feedback).then(function (res) {
                debugger;
                if (res.status == 200 && res.data.deleted) {
                    var index = $scope.feedbacks.indexOf($scope.my_feedback);
                    $scope.feedbacks.splice(index, 1);
                    $scope.my_feedback = null;

                    $rootScope.$broadcast('feedbacksChanged',{feedbacks: $scope.feedbacks});
                }
            });
        };

        $scope.editFeedback = function () {
            $scope.edit_mode = true;
            $scope.edited_feedback = JSON.parse(JSON.stringify($scope.my_feedback));
        };

        $scope.allowEditSave = function () {
            return  $scope.edited_feedback &&
                    $scope.edited_feedback.comment.length &&
                    $scope.edited_feedback.comment.length <= $scope.settings.max_comment_length &&
                    (   $scope.edited_feedback.comment != $scope.my_feedback.comment ||
                        $scope.edited_feedback.rating != $scope.my_feedback.rating);
        }

        $scope.saveFeedbackEdit = function () {
            data.editFeedback($scope.logged_user.id_token, $scope.edited_feedback).then(function (res) {
                if (res.status == 200 && res.data) {
                    $scope.edited_feedback = null;
                    var index = $scope.feedbacks.indexOf($scope.my_feedback);
                    $scope.my_feedback = res.data;
                    $scope.feedbacks[index] = $scope.my_feedback;

                    $rootScope.$broadcast('feedbacksChanged',{feedbacks: $scope.feedbacks});
                }
            });
        };

        $scope.cancelFeedbackEdit = function () {
            $scope.edit_mode = false;
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
                    reply.marked_appropriate = 0;
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
                        $scope.feedbacks.forEach(function (element) {
                            if (element.id === res.config.data.item_id){
                                element.times_flagged++;
                            }
                        });
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
