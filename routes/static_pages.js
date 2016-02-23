// TO HANDLE STATIC PAGES REQUESTS

var Authenticated = require("./modules/authenticated.js");

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
    { // Dish Page
      method: 'GET',
      path: '/dishpage',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          var data = result;
          reply.view('static_pages/dishpage', data).code(200);
          console.log (data);
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
        var dishSearch = new RegExp(searchInput);
        Authenticated(request, function (result) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          db.collection('dishes').find({'dishName': dishSearch}).toArray(function (error, doc) {
            console.log (doc);
            if (error) { return reply(error).code(400); }
            return reply.view('static_pages/results', {authenticated: result.authenticated, user_id: result.user_id, searchresults: doc[0]}).code(200);
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


