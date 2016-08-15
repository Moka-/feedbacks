var ID3 = require('./decision-tree');

module.exports = {
    highlights: function (feedbacks, callback) {
        if(!Array.isArray(feedbacks) || feedbacks.length < 2){
            callback("Feedbacks is not an array, or is too short", null);
            return;
        }

        var data = buildVectors(feedbacks);

        var dt = new ID3(data.vectors, "rating", data.words);
        var results = dt.igRanks();

        results.forEach(function (result, index, array) {
            result.instances = 0;
            feedbacks.forEach(function (feedback, index, array) {
                if(feedback.comment.indexOf(result.word) !== -1) {
                    result.instances += 1;
                    if (result.instances == 1) result.appearence = feedback.comment;
                }

            });
        });

        callback(null, results);
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