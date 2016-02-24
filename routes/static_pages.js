// TO HANDLE STATIC PAGES REQUESTS

var Authenticated = require("./modules/authenticated.js");

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

exports.register = function (server, options, next) {
  server.route([
    { // serving static files
      method: 'GET',
      path: "/public/{path*}",
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    { // Home Page
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var data = { authenticated: result.authenticated, user_id: null };

          if (result.authenticated) { //if authenticated,
            var user_id = result.user_id.toString();
            data = {
              authenticated: result.authenticated,
              user_id: user_id
            };
            return reply.view('static_pages/home', data).code(200);
          }
          else
            console.log (data);
            reply.view('static_pages/home', data).code(200);
        });
      }
    },
    { // Account registration
      method: 'GET',
      path: '/signup',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var data = result;
          reply.view('static_pages/signup', data).code(200);
        });
      }
    },
    { // Search Results Page
      method: 'GET',
      path: '/results',
      handler: function(request, reply) {
        var searchInput = request.query.searchInput || "(.*)";
        var dishSearch = new RegExp(searchInput, 'i');
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          db.collection('dishes').find({'dishName': dishSearch}).toArray(function (error, dishesResults) {
            if (error) { return reply(error).code(400); }

            var lat = parseFloat(request.query.lat);
            var long = parseFloat(request.query.long);

            dishesResults.forEach(function(dish){
              var distance = getDistance(lat, long, parseFloat(dish.restaurantLat), parseFloat(dish.restaurantLong));

              dish.distance = (distance * 1000).toFixed(0);
            });

            dishesResults.sort(function(a,b){
              if (a.distance == NaN) {
                return 0;
              }

              if (b.distance == NaN) {
                return 0;
              }

              return a.distance - b.distance;
            });


            var data = {
              authenticated: result.authenticated,
              user_id: result.user_id,
              searchInput: searchInput,
              dish: dishesResults,
            };

            console.log(data);
            return reply.view('static_pages/results', data).code(200);
          });
        });
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-views',
  version: '0.0.1'
};


