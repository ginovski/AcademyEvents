var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    editPhone: function(user, phone, callback){
        User.update({_id: user._id}, {phoneNumber: phone}, callback);
    },
    editAccounts: function(user, data, callback){
        User.update({_id: user._id}, {accounts: {
            facebook: data.facebook,
            twitter: data.twitter,
            linkedIn: data.linkedIn,
            googlePlus: data.googlePlus
        }}, callback);
    },
    addPoints: function(user, vote, callback){
        User.update({_id: user._id}, {eventPoints: {
            organization: vote.organization,
            venue: vote.venue
        }},callback);
    }
};