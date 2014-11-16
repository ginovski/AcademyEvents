var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout',auth.isAuthenticated, auth.logout);
    app.get('/profile',auth.isAuthenticated, controllers.users.getProfile);
    app.post('/profile/editPhone', auth.isAuthenticated, controllers.users.editPhone);

    app.get('/events/create', auth.isAuthenticated, controllers.events.getCreateEvent);
    app.post('/events/create', auth.isAuthenticated, controllers.events.createEvent);
    app.get('/events/active', auth.isAuthenticated, controllers.events.getActiveForCurrentUser);
    app.get('/events/past', auth.isAuthenticated, controllers.events.getPastEvents);
    app.get('/events/:id', auth.isAuthenticated, controllers.events.getEventDetails);
    app.get('/events/join/:id', auth.isAuthenticated, controllers.events.joinEvent);
    app.get('/events/leave/:id', auth.isAuthenticated, controllers.events.leaveEvent);
    app.post('/events/:id/comment', auth.isAuthenticated, controllers.events.comment);
    app.post('/events/:id/vote', auth.isAuthenticated, controllers.events.vote);
    app.get('/', controllers.events.getPassedEventsForHomePage);

    app.get('*', function(req, res) {
        res.redirect('/');
    });
};