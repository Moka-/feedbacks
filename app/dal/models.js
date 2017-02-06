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
    var widgetSchema = new Schema({
        app_instance: String,
        component_id: String,
        catalog_id: ObjectId,
        name: { type: String, default: 'New Widget' },
        show_feedbacks: { type: Boolean, default: true },
        show_summary: { type: Boolean, default: true },
        max_rating: { type: Number, default: 5 },
        max_comment_length: { type: Number, default: 300 },

        require_comment: { type: Boolean, default: false },
        require_rating: { type: Boolean, default: false },
        enable_comments: { type: Boolean, default: true },

        enable_votes: { type: Boolean, default: true },
        enable_replies: { type: Boolean, default: true },
        enable_ratings: { type: Boolean, default: true }
    });
    var feedbackSchema = new Schema({
        target_id: ObjectId,
        visitor_id: ObjectId,

        visitor_email: String,
        visitor_name: String,
        visitor_picture_url: String,

        created_on : { type: Date, default: Date.now },
        edited_on: { type: Date, default: Date.now },
        deleted: { type: Boolean, default: false },

        comment: String,
        rating: Number,

        up_voters: [Schema.Types.ObjectId],
        down_voters: [Schema.Types.ObjectId],
        flag_voters: [Schema.Types.ObjectId],
        marked_appropriate: { type: Boolean, default: false },
        marked_inappropriate: { type: Boolean, default: false }
    });
    var catalogSchema = new Schema({
        app_instance: String,
        name: String
    });

    widgetSchema.plugin(findOneOrCreate);
    visitorSchema.plugin(findOneOrCreate);
    catalogSchema.plugin(findOneOrCreate);

    var models = {
        Widget : mongoose.model('Widget', widgetSchema),
        Visitor : mongoose.model('Visitor', visitorSchema),
        Feedback : mongoose.model('Feedback', feedbackSchema),
        Catalog: mongoose.model('Catalog', catalogSchema)
    };

    return models;
}


