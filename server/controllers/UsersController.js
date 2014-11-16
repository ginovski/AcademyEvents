var encryption = require('../utilities/encryption'),
    fs = require('fs');
    users = require('../data/users'),
    events = require('../data/events');

var CONTROLLER_NAME = 'users';

function _validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function _validateUsername(username){
    var re = /^[-\w\.\$@\*\!]{6,20}$/
    return re.test(username)
}

module.exports = {
    getRegister: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/register')
    },
    postRegister: function(req, res, next) {
        req.pipe(req.busboy);
        var newUserData = {};
        newUserData.initiatives = {};
        newUserData.accounts = {};

        var fstream;

        req.busboy.on('file', function (fieldname, file, filename) {
            if(filename != ''){
                var route = __dirname + '/../../public/pictures/' + filename;
                fstream = fs.createWriteStream(route);
                file.pipe(fstream);
                newUserData.picture = "/pictures/" + filename;
            }
            else{
                file.resume();
                newUserData.picture = "/pictures/default/defaultPic.png";
            }
        });
        req.busboy.on('field', function(fieldname, val) {
            if(fieldname == 'initiative'){
                newUserData.initiatives.type = val;
            }
            else if(fieldname == 'season'){
                newUserData.initiatives.season = val;
            }
            else if(fieldname == 'facebook' || fieldname == 'twitter' || fieldname == 'linkedIn' || fieldname == 'googlePlus'){
                newUserData.accounts[fieldname] = val;
            }
            else{
                newUserData[fieldname] = val;
            }
        });
        req.busboy.on('finish', function(){
            if (newUserData.password != newUserData.confirmPassword) {
                req.session.error = 'Passwords do not match!';
                res.redirect('/register');
            }
            else if(!_validateUsername(newUserData.username)){
                req.session.error = "The username should be between 6 and 20 characters long and can contain Latin letters, digits and the symbols '_' (underscore), ' ' (space) and '.' (dot)";
                res.redirect('/register');
            }
            else if(!_validateEmail(newUserData.email)){
                req.session.error = 'Email is not valid';
                res.redirect('/register');
            }
            else {
                newUserData.salt = encryption.generateSalt();
                newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);

                users.create(newUserData, function (err, user) {
                    if (err) {
                        console.log('Failed to register new user: ' + err);
                        return;
                    }

                    req.logIn(user, function (err) {
                        if (err) {
                            res.status(400);
                            return res.send({reason: err.toString()}); // TODO
                        }
                        else {
                            res.redirect('/');
                        }
                    })
                });
            }
        });
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res, next){
        events.getCreatedByUser(req.user, function(err, result){
            var created = result;
            events.getJoinedByUser(req.user, function(err, result){
                var joined = result;
                events.getPassedUserEvents(req.user, function(err, result){
                    var passed = result
                    res.render(CONTROLLER_NAME + '/profile', {created: created, joined: joined, passed: passed});
                })
            })
        });
    },
    editPhone: function(req, res, next){
        users.editPhone(req.user, req.body.phone, function(err){
            if(err){
                req.session.error = 'An error occured during updating your profile';
                res.redirect('/profile');
            }
            else{
                req.session.success = 'You have edited your phone number successfuly';
                res.redirect('/profile');
            }
        })
    },
    editAccounts: function(req, res, next){
        users.editPhone(req.user, req.body, function(err){
            if(err){
                req.session.error = 'An error occured during updating your profile';
                res.redirect('/profile');
            }
            else{
                req.session.success = 'You have edited your accounts successfuly';
                res.redirect('/profile');
            }
        })
    }
};