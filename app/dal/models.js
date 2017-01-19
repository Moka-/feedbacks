'use strict';

var findOneOrCreate = require('mongoose-find-one-or-create');

module.exports = function(mongoose) {
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var visitorSchema = new Schema({
        email: String,
        name: String,
        picture_url: String
    });
    var feedbackSchema = new Schema({
        target: ObjectId,
        visitor: ObjectId,
        created_on : Date,
        edited_on: Date,
        deleted: Boolean,

        content: String,
        rating: Number,
        upvoters: [Schema.Types.ObjectId],
        downvoters: [Schema.Types.ObjectId],

        inappropriate_flags: Number,
        marked_appropriate: Boolean,
        marked_inappropriate: Boolean
    });

    var widgetSchema = new Schema({
        app_instance: String,
        component_id: String,
        catalog: ObjectId,
        name: String,
        show_feedbacks: { type: Boolean, default: true },
        max_rating: { type: Number, default: 5 },
        max_comment_length: { type: Number, default: 300 },

        require_comment: { type: Boolean, default: false },
        require_rating: { type: Boolean, default: false },

        enable_comments: { type: Boolean, default: true },
        enable_summary: { type: Boolean, default: true },
        enable_votes: { type: Boolean, default: true },
        enable_replies: { type: Boolean, default: true },
        enable_ratings: { type: Boolean, default: true }
    });
    widgetSchema.plugin(findOneOrCreate);

    var models = {
        Widget : mongoose.model('Widget', widgetSchema),
        Visitor : mongoose.model('Visitor', visitorSchema),
        Feedback : mongoose.model('Feedback', feedbackSchema)
    };

    return models;
}


