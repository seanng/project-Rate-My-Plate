var Authenticated = require("../modules/Authenticated.js");


exports.register = function (server, options, next) {
  server.route([
    { // reply dishes of particular restaurant
      method: 'POST',
      path: "/api/dishesforautocomplete",
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var getRestaurantID = request.payload.getID.toString();
          console.log (getRestaurantID);

          db.collection('dishes').find({'restaurantID': getRestaurantID}).toArray(function (err, results) {
            if (err) { return reply(err); }
            console.log (results, 123123);
            return reply(results).code(200);
          });
        });
      }
    },
    {
      method: 'POST',
      path: '/api/dishes',
      handler: function(request, reply) {
        Authenticated(request, function(result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var newDish = {
            dishName: request.payload.dishName,
            restaurantName: request.payload.restaurantName,
            restaurantID: request.payload.restaurantID
            // avgRating: request.payload.ratings <- THIS SHOULD BE AN ARRAY.
          };

          db.collection('dishes').insert(newDish, function(err, doc) {
            if (err) { return reply(err); }
            reply (doc.ops[0]);
          });
        });
      }
    },
    {
      method: 'PUT',
      path: '/api/dishes',
      handler: function (request, reply) {
        Authenticated(request, function(result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var dishInfo = {
            dishName: request.payload.dishName,
            restaurantName: request.payload.restaurantName,
            restaurantID: request.payload.restaurantID
            // avgRating: request.payload.ratings
          };
        });
      }
    }
  ]);
  next();
};


exports.register.attributes = {
  name: 'dishes-route',
  version: '0.0.1'
};

