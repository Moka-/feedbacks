var ID3 = require('./decision-tree');

module.exports = {
    highlights: function (feedbacks, callback) {
        if(!Array.isArray(feedbacks)) callback();

        var data = buildVectors(feedbacks);

        var dt = new ID3(data.vectors, "rating", data.words);
        callback();
    }
};

function buildVectors(feedbacks) {
    var words = [];
    var vectors = [];

    feedbacks.forEach(function (element, index, array) {
        var feedbackWords = element.comment.split(' ');
        var vector = {};

        feedbackWords.forEach(function (element, index, array) {
            vector[element] = true;

            if(words.indexOf(element) == -1)
                words.push(element);
        });

        vector.rating = element.rating;

        vectors.push(vector);
    });

    return {words, vectors};
}