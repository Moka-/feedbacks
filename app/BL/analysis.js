var ID3 = require('./decision-tree');
var db = require('../dal/db');

module.exports = {
    highlights: function (feedbacks, callback) {
        if(!Array.isArray(feedbacks) || feedbacks.length < 2){
            callback("Feedbacks is not an array, or is too short", null);
            return;
        }

        var normalized = feedbacks.map(function (obj) {

            var robj = {};
            for (var key in obj){
                if (!obj.hasOwnProperty(key)) continue;

                robj[key] = obj[key];
            }

            var rating = obj.rating;
            if (rating < 3) robj.rating = "bad";
            if (rating > 3) robj.rating = "good";
            if (rating == 3) robj.rating = "neutral";

            return robj;
        });

        var data = buildVectors(normalized);

        var dt = new ID3(data.vectors, "rating", data.words);
        var results = dt.igRanks();

        results.forEach(function (result) {
            result.instances = 0;
            feedbacks.forEach(function (feedback) {
                if(feedback.comment.split(' ').some(function(w){return w === result.word})){
                    result.instances += 1;
                    result.appearence = feedback.comment;
                }
            });
        });

        callback(null, results);
    },
    catalogsFeedbacks: function (app_instance, callback) {
        var sql = "select c.name, CAST(f.created_on AS DATE) as date, count(f.id) as count " +
                "from catalogs c, widgets w, feedbacks f " +
                "where c.id = w.catalog_id " +
                "and w.app_instance = f.app_instance and w.app_instance = ? " +
                "and w.component_id = f.component_id " +
                "group by c.name, CAST(f.created_on AS DATE)";

        db.query(sql, app_instance, callback);
    }
};

function buildVectors(feedbacks) {
    var words = [];
    var vectors = [];

    feedbacks.forEach(function (element, index, array) {
        var feedbackWords = element.comment.split(' ');
        var vector = {};

        feedbackWords.forEach(function (element, index, array) {
            vector[element] = 'y';

            if(words.indexOf(element) == -1)
                words.push(element);
        });

        vector.rating = element.rating;

        vectors.push(vector);
    });

    vectors.forEach(function (vector, index, array) {
        words.forEach(function (word, index, array) {
            if (!vector[word])
                vector[word] = 'n';
        });
    });

    return {words, vectors};
}