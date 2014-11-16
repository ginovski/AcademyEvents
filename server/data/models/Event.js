var mongoose = require('mongoose');

module.exports.init = function() {
    var eventSchema = mongoose.Schema({
        title: {type: String, required: true},
        description: {type: String, required: true},
        location: {
            latitude: String,
            longitude: String
        },
        category: {type: String, required: true},
        type: {
            initiative: {type: String, required: true},
            season: {type: String, required: true}
        },
        creator: String,
        phoneNumber: {type: String, required: true},
        comments: [{
            user: String,
            text: String
        }],
        date: {type: Date, required: true},
        deleted: {type: Boolean, default: false},
        evaluation: {
            organization: {type: Number, min: 1, max: 5, default: 1},
            venue: {type: Number, min: 1, max: 5, default: 1}
        },
        usersJoined: []
    });

    var Event = mongoose.model('Event', eventSchema);
};



