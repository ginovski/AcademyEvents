var Event = require('mongoose').model('Event');

module.exports = {
    create: function(event, callback) {
        Event.create(event, callback);
    },
    getPassedEvents: function(callback){
        Event.find({date: {$lt: Date.now()}}).exec(callback);
    },
    getActiveEventsForCurrentUser: function(user, callback){
        Event.find()
            .where('date')
            .gt(Date.now())
            .exec(callback);
    },
    getCreatedByUser: function(user, callback){
        Event.find({creator: user.username}).exec(callback);
    },
    getJoinedByUser: function(user, callback){
        Event.find({usersJoined: user.username}).exec(callback);
    },
    getPassedUserEvents: function(user, callback){
        Event.find({usersJoined: user.username})
            .where('date')
            .lt(Date.now())
            .exec(callback);
    },
    getDetails: function(id, callback){
        Event.findOne({_id: id}).exec(callback);
    },
    join: function(id,user,callback){
        Event.update({_id: id}, {$push: {usersJoined: user.username}},callback);
    },
    leave: function(id,user,callback){
        Event.update({_id: id}, {$pull: {usersJoined: user.username}},callback);
    },
    comment: function(id, user, text, callback){
        Event.update({_id: id}, {$push: {comments: {user: user.username, text:text}}},callback);
    },
    vote: function(id, vote, callback){
        Event.update({_id: id}, {evaluation: {
          organization: vote.organization,
          venue: vote.venue
        }},callback);
    }
};
