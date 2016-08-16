function getWidgetScore(maxRating, dateAdded, feedbacks) {
    var ratingValues = new Array(maxRating);

    if (maxRating % 2 == 1) {
        var intervals = round(MaxRating / 2);
        var zeroValueIndex = round(MaxRating / 2) + 1;

        for (var i in intervals) {
            var value = intervals / (intervals + i);
            ratingValues[zeroValueIndex - 1 - i] = -value;
            ratingValues[zeroValueIndex + 1 + i] = value;
        }
    }
    else {
        for (var i in MaxRating) {
            value = MaxRating / 2 / MaxRating / 2 + i;
            ratingValues[MaxRating / 2 - i] = -value;
            ratingValues[MaxRating / 2 + i] = value;
        }
    }

    var x = 0;
    var widgetScore = 0;

    for (var feedback in feedbacks) {
        var y = ratingValues[feedback.rating];
        x += y;
        var t = Math.abs((dateAdded - feedback.dateAdded) / 1000);
        var score = y * t / 45000;
        widgetScore += score;
    }

    var z = Math.max(Math.abs(x), 1);

    return Math.log10(z) + widgetScore;
}
