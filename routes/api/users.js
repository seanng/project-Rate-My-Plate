// TO HANDLE API/USERS DATA REQUESTS

var Joi = require('joi'); // What do JOI do? Object schema validation
var Bcrypt = require('bcrypt'); // What is Bcrypt? Encryption / Hashing function

exports.register = function(server, options, next) {
  server.route([
    { //Create a new user
      method: 'POST',
      path: '/api/users',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;

          // Get user input parameters (username, email, password)
          var user = request.payload;

          //query to find existing user
          var uniqUserQuery = { $or: [{username: user.username}, {email: user.email}] };

          db.collection('users').findOne(uniqUserQuery, function(err, userExist){
            if (userExist) {
              return reply('Error: Username/Email already exist', err);
            }

            Bcrypt.genSalt(10, function(err, salt) {
              Bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;

                // Store hash in your password DB.
                db.collection('users').insert(user, function(err, doc) {
                  if (err) { return reply('Internal MongoDB error', err); }

                  reply(doc);
                });
              });
            });
          });
        },
        validate: {
          payload: {
          // Required, Limited to 20 chars
            username: Joi.string().max(20).required(),
            email:    Joi.string().email().max(50).required(),
            password: Joi.string().min(5).max(20).required(),
            name:     Joi.string()
          }
        }
      }
    },
    { // Get one user.
      method: 'GET',
      path: '/api/users/{username}',
      handler: function(request, reply) {
        var username = encodeURIComponent(request.params.username);
        var db = request.server.plugins['hapi-mongodb'].db;

        db.collection('users').findOne({ "username": username }, function(err, user) {
          if (err) { return reply('Internal MongoDB error', err); }

          reply(user);
        });
      }
    }
  ]);
  next();
};


exports.register.attributes = {
  name: 'static-pages-users',
  version: '0.0.1'
};