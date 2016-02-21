var Authenticated = require("../modules/Authenticated.js");

var getRestaurantID;

exports.register = function (server, options, next) {
  server.route([
    { // reply dishes of particular restaurant
      method: 'POST',
      path: "/api/dishesforautocomplete",
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          getRestaurantID = request.payload.getID.toString();
          console.log (getRestaurantID);

          db.collection('dishes').find({'restaurantID': getRestaurantID}).toArray(function (err, results) {
            if (err) { return reply(err); }
            console.log (results, 123123);
            return reply(results).code(200);
          });
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

