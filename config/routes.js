const admin = require('./admin')


module.exports = app => {
    
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
    .all(app.config.passport.authenticate())
    .post(admin(app.api.user.save))
    .get(admin(app.api.user.get))
    
    app.route('/tasks')
    .all(app.config.passport.authenticate())
    .post(app.api.task.save)
    
    app.route('/tasks/:id')
    .all(app.config.passport.authenticate())
    .delete(app.api.task.remove)
    .put(app.api.task.save)

    app.route('/tasks/user/:userId')
    .all(app.config.passport.authenticate())
    .get(app.api.task.getByUserId)
}