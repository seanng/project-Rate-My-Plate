// TO HANDLE ENTRIES COLLECTION REQUESTS

var Authenticated = require("../modules/Authenticated.js");
var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server, options, next) {
  server.route([
    { // User Page
      method: 'POST',
      path: '/api/entries',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db       = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var session  = request.yar.get('hapi_ratemyplate_session');

          var entry = {
            dishname: request.payload.dishname,
            comment: request.payload.comment
          };

          db.collection('entries').insert(entry, function(err, doc) {
            if (err) { return reply(err); }
            reply (doc.ops[0]);
          });

        });
      }
    }
  ]);
  next();
};


exports.register.attributes = {
  name: 'entries-route',
  version: '0.0.1'
};
