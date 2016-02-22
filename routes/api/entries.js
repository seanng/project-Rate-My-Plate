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
            user_id: request.payload.user_id,
            restaurantID: request.payload.restaurantID,
            restaurantName: request.payload.restaurantName,
            dishName: request.payload.dishName,
            comment: request.payload.comment,
            dishID: null
            //dishRating: request.payload.dishRating
          };

          // Before inserting entry, check if dish already exists.
          //var dishCount = db.collection('entries').find({'restaurantID': entry.restaurantID, 'dishName': entry.dishName}).count();

          db.collection('entries').count({'restaurantID': entry.restaurantID, 'dishName': entry.dishName}, function(err, dishCount){
            if (err) { return reply(err); }
            // IF DISH DOES NOT EXIST
            if (dishCount === 0) {
              var newDish = {
                dishName: request.payload.dishName,
                restaurantName: request.payload.restaurantName,
                restaurantID: request.payload.restaurantID
                //dishRatings: [entry.dishRating]
              };
              // Create a new dish.
              db.collection('dishes').insert(newDish, function(err, doc) {
                if (err) { return reply(err); }
                entry.dishID = doc.ops[0]._id; // entry.dishID will now be updated
                console.log(entry);
                db.collection('entries').insert(entry, function(err, createdEntry) {
                  if (err) { return reply(err, "couldn't create new dish"); }
                  reply (createdEntry);
                });
              });
            }
            // IF DISH EXISTS,
            else {
              console.log(dishCount);
              // Retrieve dishID and append to entry.dishID
              db.collection('dishes').findOne({'restaurantID': entry.restaurantID, 'dishName': entry.dishName}, function(err, doc){
                console.log(doc);
                if (err) { return reply(err); }
                entry.dishID = doc.ops[0]._id;
                console.log(entry);
                db.collection('entries').insert(entry, function(err, createdEntry) {
                  if (err) { return reply(err, "couldn't update new dish"); }
                  // Push dishRating from entry to dishRatings array in dish document
                  // db.collection('dishes').update({'restaurantID': entry.restaurantID, 'dishName': entry.dishName}, {$push: {dishRatings: entry.dishRating}});
                  reply (createdEntry);
                });
              });
            }
          });
        });
      }
    },
    { // Get all entries of {user_id}
      method: 'GET',
      path: '/userpage/{user_id}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

          var user_id = request.params.user_id;
          db.collection('entries').find({"user_id": user_id}).toArray(function (err, entries) {
            if (err) { return reply(err); }
            // reply(results).code(200);
            console.log(entries);
            reply.view('static_pages/userpage', {entries: entries, authenticated: result.authenticated, user_id: user_id}).code(200);
          });
        });
      }
    },
    { // Get all entries of {dishID}
      method: 'GET',
      path: '/dishpage/{dishID}',
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

          var dishID = request.params.dishID;
          db.collection('entries').find({"dishID": dishID}).toArray(function (err, results) {
            if (err) { return reply(err); }
            // reply(results).code(200);
            console.log(results);
            reply.view('static_pages/dishpage', {entries: results, authenticated: result.authenticated, dishID: dishID}).code(200);
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

