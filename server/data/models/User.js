var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports.init = function() {
    var userSchema = mongoose.Schema({
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        phoneNumber: String,
        email: { type: String, required: true},
        accounts: {
            facebook: String,
            twitter: String,
            linkedIn: String,
            googlePlus: String
        },
        eventPoints: {
            organization: {type: Number, min: 1, max: 5, default: 1},
            venue: {type: Number, min: 1, max: 5, default: 1}
        },
        initiatives: [{
            type: { type: String, required: true},
            season: { type: String, required: true}
        }],
        picture: String,
        username: { type: String, required: true, unique: true },
        salt: String,
        hashPass: String
    });

    userSchema.method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);
};


