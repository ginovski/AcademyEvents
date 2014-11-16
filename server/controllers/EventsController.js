var events = require('../data/events'),
    users = require('../data/users');

var CONTROLLER_NAME = 'events';

function _findIndexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return -1;
}

module.exports = {
    getCreateEvent: function(req,res,next){
        res.render(CONTROLLER_NAME +  '/create-event');
    },
    createEvent: function(req,res,next){
        var newEvent = {};
        var event = req.body;

        newEvent.title = event.title;
        newEvent.description = event.description;
        newEvent.category = event.category;
        newEvent.type = {
            initiative: req.body.initiative,
            season: req.body.season
        };
        newEvent.creator = req.user.username;
        newEvent.usersJoined = [];
        newEvent.usersJoined.push(req.user.username);
        newEvent.date = new Date(req.body.date);

        if(event.location){
            location = event.location.split(',');
            newEvent.location = {
                latitude: location[0],
                longitude: location[1]
            }
        }
        if(!req.user.phoneNumber){
            req.session.error = 'You must enter phone number first'
            res.redirect('/');
        }
        else{
            newEvent.phoneNumber = req.user.phoneNumber;

            events.create(newEvent, function(err, result){
                if(err){
                    req.session.error = 'Cannot create event';
                    res.redirect('/')
                }
                else{
                    console.log(result);
                    res.redirect('/');
                }
            });
        }
    },
    getPassedEventsForHomePage: function(req, res, next){
        events.getPassedEvents(function(err, events){
            res.render('index', {events: events});
        })
    },
    getActiveForCurrentUser: function(req, res, next){
      events.getActiveEventsForCurrentUser(req.user, function(err, result){
          res.render(CONTROLLER_NAME + '/active-events', {events: result});
      })
    },
    getPastEvents: function(req, res, next){
        console.log(1);
        events.getPassedEvents(function(err, result){
            console.log(2);
            res.render(CONTROLLER_NAME + '/past-events', {events: result});
        })
    },
    getEventDetails: function(req, res, next){
        events.getDetails(req.params.id, function(err, result){
            res.render(CONTROLLER_NAME + '/event-details', {event: result});
        })
    },
    joinEvent: function(req, res, next){
       events.join(req.params.id, req.user, function(err){
           if(err){
               console.log(err);
           }
           else{
               req.session.success = "You have joined successfuly";
               res.redirect('/events/' + req.params.id);
           }
       });
    },
    leaveEvent: function(req, res, next){
        events.leave(req.params.id, req.user, function(err){
            if(err){
                console.log(err);
            }
            else{
                req.session.success = "You have left successfuly";
                res.redirect('/events/' + req.params.id);
            }
        })
    },
    comment: function(req, res, next){
        events.comment(req.params.id, req.user, req.body.text, function(err){
            if(err){
                console.log(err);
            }
            else{
                req.session.success = "Your comment has been added";
                res.redirect('/events/' + req.params.id);
            }
        })
    },
    vote: function(req, res, next){
        events.vote(req.params.id, req.body, function(err){
            if(err){
                console.log(err);
            }
            else{
                users.addPoints(req.user, req.body, function(err){
                    req.session.success = "Your vote has been added";
                    res.redirect('/events/' + req.params.id);
                })
            }
        })
    }
};
