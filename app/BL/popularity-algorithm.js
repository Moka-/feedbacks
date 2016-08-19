module.exports = {
    getWidgetScore: function (maxRating, dateAdded, feedbacks) {
        var ratingValues = new Array(maxRating);

        if (maxRating % 2 == 1) {
            var intervals = Math.floor(maxRating / 2);
            var zeroValueIndex = Math.floor(maxRating / 2) + 1;
            ratingValues[zeroValueIndex] = 0;

            for (var i = 0; i < intervals; i++) {
                var value = intervals / (intervals + i);
                ratingValues[zeroValueIndex - 1 - i] = -value;
                ratingValues[zeroValueIndex + 1 + i] = value;
            }
        }
        else {
            for (var i = 0; i < maxRating; i++) {
                value = maxRating / 2 / maxRating / 2 + i;
                ratingValues[maxRating / 2 - i] = -value;
                ratingValues[maxRating / 2 + i] = value;
            }
        }

        var x = 0;
        var widgetScore = 0;

        for (var i in feedbacks) {
            var y = feedbacks[i].rating;
            x += y;
            var t = Math.abs((dateAdded - feedbacks[i].date) / 1000);
            var score = y * t / 45000;
            widgetScore += score;
        }

        var z = Math.max(Math.abs(x), 1);

        return Math.round(Math.log10(z) + widgetScore);
    }
};