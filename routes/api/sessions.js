// TO HANDLE SESSIONS COLLECTION REQUESTS

var Joi = require('joi');
var Bcrypt = require('bcrypt');
var Auth = require('./auth');

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'POST',
      path: '/api/sessions',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var user = request.payload;

        db.collection('users').findOne({ "username": user.username }, function(err, userMongo) {
          if (err) { return reply('Internal MongoDB error', err).code(400); }

          if (userMongo === null) {
            return reply({ "message": "User doesn't exist" }).code(400);
          }

          Bcrypt.compare(user.password, userMongo.password, function(err, result) {
            // If password matches, please authenticate user and add to cookie
            function randomKeyGenerator() {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            if (result) {
              // if password matches, please authenticate user and add to cookie
              console.log(result, newSession);
              randomKeyGenerator();
              // Generate a random string
              var randomKey = randomKeyGenerator();

              var db = request.server.plugins['hapi-mongodb'].db;

              var newSession = {
                "session_id": randomKey,
                "user_id": userMongo._id
              };

              db.collection('sessions').insert(newSession, function(err, result) {
                if (err) {
                  return reply('Internal MongoDB error', err).code(400);
                }

                // Store the Session information in the browser Cookie
                request.yar.set('hapi_ratemyplate_session', {
                  "session_id": randomKey,
                  "user_id": userMongo._id
                });

                return reply({ "message:": "Authenticated" }).code(200);
              });

            } else { reply({ message: "Not authorized" }).code(400); }
          });
        });
      }
    },
    {
      method: 'GET',
      path: '/api/authenticated',
      handler: function(request, reply) {
        Auth.authenticated(request, function(result) {
          reply(result);
        });
      }
    }
  ]);

  next();

};


exports.register.attributes = {
  name: 'static-pages-routes',
  version: '0.0.1'
};