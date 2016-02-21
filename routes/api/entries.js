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
            userID: request.payload.userID,
            restaurantID: request.payload.restaurantID,
            restaurantName: request.payload.restaurantName,
            dishName: request.payload.dishName,
            comment: request.payload.comment
          };

          db.collection('entries').insert(entry, function(err, doc) {
            if (err) { return reply(err); }
            reply (doc.ops[0]);
          });
        });
      }
    },
    { // Get all entries of {userid}
      method: 'GET',
      path: '/userpage/{userID}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

          var userID = request.params.userID;
          db.collection('entries').find({"userID": userID}).toArray(function (err, entries) {
            if (err) { return reply(err); }
            // reply(results).code(200);
            console.log(entries);
            reply.view('static_pages/userpage', {entries: entries, authenticated: result.authenticated, userID: userID}).code(200);
          });
        });
      }
    },
    { // Get all entries of {dishid}
      method: 'GET',
      path: '/dishpage/{dishid}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

          var dishid = request.params.dishid;
          console.log(dishid);
          db.collection('entries').find({"dishid": dishid}).toArray(function (err, results) {
            if (err) { return reply(err); }
            // reply(results).code(200);
            console.log(results);
            reply.view('static_pages/dishpage', {entries: results, authenticated: result.authenticated, dishid: dishid}).code(200);
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

